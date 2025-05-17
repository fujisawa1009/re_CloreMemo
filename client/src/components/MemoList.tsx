import { Memo } from "@shared/schema";
import MemoCard from "./MemoCard";

interface MemoListProps {
  memos: Memo[];
  onEdit: (memo: Memo) => void;
  onDelete: (memo: Memo) => void;
}

export default function MemoList({ memos, onEdit, onDelete }: MemoListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onEdit={() => onEdit(memo)}
          onDelete={() => onDelete(memo)}
        />
      ))}
    </div>
  );
}
