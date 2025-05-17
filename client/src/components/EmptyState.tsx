import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateMemo: () => void;
}

export default function EmptyState({ onCreateMemo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 text-center">
        <BookmarkPlus className="mx-auto h-12 w-12 mb-4" />
        <h2 className="text-xl font-medium mb-2">メモがありません</h2>
        <p className="text-gray-500 mb-4">「新規メモ」ボタンをクリックして、最初のメモを作成しましょう</p>
        <Button 
          className="bg-primary hover:bg-blue-600 text-white"
          onClick={onCreateMemo}
        >
          メモを作成する
        </Button>
      </div>
    </div>
  );
}
