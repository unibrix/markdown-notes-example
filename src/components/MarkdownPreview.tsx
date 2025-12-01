import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  title: string;
}

export const MarkdownPreview = ({ content, title }: MarkdownPreviewProps) => {
  return (
    <section className="flex-1 bg-preview-bg h-screen flex flex-col">
      <header className="p-6 border-b border-border">
        <h2 className="text-2xl font-display font-bold text-foreground">
          {title || 'Preview'}
        </h2>
      </header>
      <ScrollArea className="flex-1">
        <article className="prose prose-lg max-w-none p-6 prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-code:text-foreground prose-strong:text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*Start typing to see preview...*'}
          </ReactMarkdown>
        </article>
      </ScrollArea>
    </section>
  );
};