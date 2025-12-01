import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MarkdownEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onExport: () => void;
}

export const MarkdownEditor = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onExport,
}: MarkdownEditorProps) => {
  return (
    <section className="flex-1 flex flex-col bg-editor-bg border-r border-editor-border h-screen">
      <header className="p-6 border-b border-editor-border flex items-center justify-between gap-4">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-display font-bold border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
        />
        <Button
          onClick={onExport}
          variant="ghost"
          size="sm"
          className="gap-2 shrink-0"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </header>
      <div className="flex-1 overflow-hidden">
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing in markdown..."
          className="markdown-editor-content h-full w-full resize-none border-none bg-transparent p-6 font-mono text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </section>
  );
};