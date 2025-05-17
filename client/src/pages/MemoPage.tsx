import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import MemoList from "@/components/MemoList";
import MemoForm from "@/components/MemoForm";
import EmptyState from "@/components/EmptyState";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Memo } from "@shared/schema";

// フォームから送信されるデータ型を定義
type MemoFormData = {
  title: string;
  content: string;
  color: string;
};

export default function MemoPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMemo, setCurrentMemo] = useState<Memo | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  // Fetch memos
  const { data: memos = [], isLoading } = useQuery<Memo[]>({
    queryKey: ['/api/memos'],
  });

  // Create memo mutation
  const createMemoMutation = useMutation({
    mutationFn: (newMemo: MemoFormData) => 
      apiRequest('POST', '/api/memos', newMemo),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memos'] });
      setIsFormOpen(false);
      toast({
        title: "メモを作成しました",
        description: "新しいメモが正常に保存されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message || "メモの作成に失敗しました。",
        variant: "destructive",
      });
    },
  });

  // Update memo mutation
  const updateMemoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MemoFormData }) => 
      apiRequest('PUT', `/api/memos/${id}`, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memos'] });
      setIsFormOpen(false);
      setCurrentMemo(null);
      toast({
        title: "メモを更新しました",
        description: "メモが正常に更新されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message || "メモの更新に失敗しました。",
        variant: "destructive",
      });
    },
  });

  // Delete memo mutation
  const deleteMemoMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/memos/${id}`),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memos'] });
      setIsDeleteDialogOpen(false);
      setCurrentMemo(null);
      toast({
        title: "メモを削除しました",
        description: "メモが正常に削除されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message || "メモの削除に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const handleCreateNewMemo = () => {
    setIsEditMode(false);
    setCurrentMemo(null);
    setIsFormOpen(true);
  };

  const handleEditMemo = (memo: Memo) => {
    setIsEditMode(true);
    setCurrentMemo(memo);
    setIsFormOpen(true);
  };

  const handleDeleteMemo = (memo: Memo) => {
    setCurrentMemo(memo);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitMemo = (data: MemoFormData) => {
    if (isEditMode && currentMemo) {
      updateMemoMutation.mutate({ id: currentMemo.id, data });
    } else {
      createMemoMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (currentMemo) {
      deleteMemoMutation.mutate(currentMemo.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">シンプルメモアプリ</h1>
          <Button
            onClick={handleCreateNewMemo}
            className="bg-primary hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            新規メモ
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : memos.length === 0 ? (
          <EmptyState onCreateMemo={handleCreateNewMemo} />
        ) : (
          <MemoList 
            memos={memos} 
            onEdit={handleEditMemo} 
            onDelete={handleDeleteMemo} 
          />
        )}
      </main>

      {/* Memo Form Dialog */}
      <MemoForm 
        isOpen={isFormOpen}
        isEdit={isEditMode}
        memo={currentMemo}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitMemo}
        isPending={createMemoMutation.isPending || updateMemoMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMemoMutation.isPending}
      />
    </div>
  );
}
