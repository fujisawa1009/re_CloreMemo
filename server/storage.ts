import { users, type User, type InsertUser, memos, type Memo, type InsertMemo, type UpdateMemo } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Memo CRUD operations
  getMemos(): Promise<Memo[]>;
  getMemo(id: number): Promise<Memo | undefined>;
  createMemo(memo: InsertMemo): Promise<Memo>;
  updateMemo(id: number, memo: UpdateMemo): Promise<Memo | undefined>;
  deleteMemo(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private memoStore: Map<number, Memo>;
  currentId: number;
  currentMemoId: number;

  constructor() {
    this.users = new Map();
    this.memoStore = new Map();
    this.currentId = 1;
    this.currentMemoId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Memo CRUD implementations
  async getMemos(): Promise<Memo[]> {
    // Return memos sorted by updatedAt (newest first)
    return Array.from(this.memoStore.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getMemo(id: number): Promise<Memo | undefined> {
    return this.memoStore.get(id);
  }

  async createMemo(insertMemo: InsertMemo): Promise<Memo> {
    const id = this.currentMemoId++;
    const now = new Date();
    
    // クライアントからcolorを受け取れていないようなので、明示的に設定
    const color = insertMemo.color || "#ffffff";
    
    // スプレッド演算子ではなく、各フィールドを明示的に設定
    const memo: Memo = {
      id,
      title: insertMemo.title,
      content: insertMemo.content,
      color: color,  // 色を明示的に設定
      createdAt: now,
      updatedAt: now,
    };
    
    this.memoStore.set(id, memo);
    return memo;
  }

  async updateMemo(id: number, updateData: UpdateMemo): Promise<Memo | undefined> {
    const memo = this.memoStore.get(id);
    
    if (!memo) {
      return undefined;
    }
    
    // 色を明示的に設定
    const color = updateData.color || memo.color || "#ffffff";
    
    // 各フィールドを明示的に設定
    const updatedMemo: Memo = {
      id: memo.id,
      title: updateData.title || memo.title,
      content: updateData.content || memo.content,
      color: color,
      createdAt: memo.createdAt,
      updatedAt: new Date(),
    };
    
    this.memoStore.set(id, updatedMemo);
    return updatedMemo;
  }

  async deleteMemo(id: number): Promise<boolean> {
    return this.memoStore.delete(id);
  }
}

export const storage = new MemStorage();
