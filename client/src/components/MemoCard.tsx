import { useState, useRef, useEffect } from "react";
import { Memo } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MemoCardProps {
  memo: Memo;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MemoCard({ memo, onEdit, onDelete }: MemoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format content with line breaks
  const formattedContent = memo.content.split('\n').map((line, index) => (
    <div key={index}>{line}</div>
  ));

  // カードの背景色を適用
  const cardStyle = {
    backgroundColor: memo.color || "#ffffff"
  };

  return (
    <Card className="memo-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all" style={cardStyle}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-1">{memo.title}</h3>
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-1 rounded-full hover:bg-gray-100 text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-36">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    onEdit();
                    setIsMenuOpen(false);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 hover:bg-gray-100 text-red-500"
                  onClick={() => {
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="text-gray-600 mb-3 line-clamp-3 text-sm">
          {formattedContent}
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatDate(memo.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
