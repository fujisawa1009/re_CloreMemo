import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Memo, insertMemoSchema } from "@shared/schema";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Extend the insert schema with validation rules
const formSchema = insertMemoSchema.extend({
  title: z.string().min(1, "タイトルを入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  color: z.string().default("#ffffff"),
});

// 色の選択肢
const colorOptions = [
  { value: "#ffffff", label: "白" },
  { value: "#f8d7da", label: "赤" },
  { value: "#d1e7dd", label: "緑" },
  { value: "#cfe2ff", label: "青" },
  { value: "#fff3cd", label: "黄" },
  { value: "#e2e3e5", label: "灰色" },
];

interface MemoFormProps {
  isOpen: boolean;
  isEdit: boolean;
  memo: Memo | null;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

export default function MemoForm({ 
  isOpen, 
  isEdit, 
  memo, 
  onClose, 
  onSubmit,
  isPending 
}: MemoFormProps) {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      color: "#ffffff",
    },
  });

  // Reset form when dialog opens/closes or when editing different memo
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: isEdit && memo ? memo.title : "",
        content: isEdit && memo ? memo.content : "",
        color: isEdit && memo ? memo.color : "#ffffff",
      });
    }
  }, [isOpen, isEdit, memo, form]);

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "メモを編集" : "新規メモ"}</DialogTitle>
          <DialogDescription>メモの情報と色を設定します</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="タイトルを入力" 
                      {...field} 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内容</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="メモの内容を入力" 
                      rows={5}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>メモの色</FormLabel>
                  <FormDescription>
                    メモカードの背景色を選択してください
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {colorOptions.map((color) => (
                        <FormItem key={color.value} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value={color.value}
                                id={color.value}
                                className="sr-only"
                                checked={field.value === color.value}
                              />
                              <label
                                htmlFor={color.value}
                                className={`flex w-16 h-8 items-center justify-center rounded-md border-2 cursor-pointer transition-all ${
                                  field.value === color.value
                                    ? "border-primary outline outline-2 outline-primary"
                                    : "border-gray-200"
                                }`}
                                style={{ backgroundColor: color.value }}
                              >
                                <span className="text-xs font-medium">{color.label}</span>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                キャンセル
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-blue-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    保存中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
