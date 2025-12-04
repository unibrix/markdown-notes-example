import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

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
        <article className="markdown-preview-content prose prose-lg max-w-none p-6 break-words prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-code:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-pre:bg-muted prose-th:text-foreground prose-td:text-foreground prose-ol:list-decimal prose-ol:pl-6 prose-ul:list-disc prose-ul:pl-6 [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {content || '*Start typing to see preview...*'}
          </ReactMarkdown>
        </article>
      </ScrollArea>
    </section>
  );
};