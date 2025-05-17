import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-sm mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4 text-red-500">
            <Trash2 className="h-10 w-10" />
          </div>
          <AlertDialogTitle className="text-center">メモを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-3">
          <AlertDialogCancel
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            disabled={isPending}
          >
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-600 flex items-center"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                削除中...
              </span>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                削除する
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
