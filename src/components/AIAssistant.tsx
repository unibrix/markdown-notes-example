import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles, Wand2, FileText, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  onInsertText: (text: string) => void;
  selectedText: string;
  onSelectionAction: (action: 'expand' | 'summarize' | 'improve') => void;
}

export const AIAssistant = ({ onInsertText, selectedText, onSelectionAction }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        // Check if selection is within the preview area
        const previewElement = document.querySelector('.markdown-preview-content');
        const range = selection?.getRangeAt(0);
        
        if (range && previewElement?.contains(range.commonAncestorContainer)) {
          const rect = range.getBoundingClientRect();
          
          if (rect && rect.width > 0 && rect.height > 0) {
            setToolbarPosition({
              top: rect.top + window.scrollY - 50,
              left: rect.left + window.scrollX + rect.width / 2
            });
            setShowToolbar(true);
          }
        } else {
          setShowToolbar(false);
        }
      } else {
        setShowToolbar(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  useEffect(() => {
    if (!selectedText) {
      setShowToolbar(false);
    }
  }, [selectedText]);

  const handleAIAction = async (action: 'generate' | 'expand' | 'summarize' | 'improve') => {
    setIsLoading(true);
    
    try {
      const content = action === 'generate' ? prompt : selectedText;
      
      if (!content) {
        toast({
          title: 'No content',
          description: action === 'generate' 
            ? 'Please enter a prompt' 
            : 'Please select some text first',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('ai-assist', {
        body: { action, content },
      });

      if (error) throw error;

      if (data?.result) {
        onInsertText(data.result);
        setPrompt('');
        setOpen(false);
        setShowToolbar(false);
        toast({
          title: 'Success',
          description: 'AI assistance applied',
        });
      }
    } catch (error: any) {
      console.error('AI error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process AI request',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolbarAction = (action: 'expand' | 'summarize' | 'improve') => {
    setShowToolbar(false);
    onSelectionAction(action);
    handleAIAction(action);
  };

  return (
    <>
      {/* Floating Toolbar for Selection */}
      {showToolbar && selectedText && (
        <div
          ref={toolbarRef}
          className="fixed z-50 flex gap-1 bg-primary p-1.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <Button
            onClick={() => handleToolbarAction('expand')}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="h-8 text-white hover:bg-white/20"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => handleToolbarAction('summarize')}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="h-8 text-white hover:bg-white/20"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => handleToolbarAction('improve')}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="h-8 text-white hover:bg-white/20"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Generate Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">AI Assistant</DialogTitle>
            <DialogDescription>
              Generate new content with AI
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Describe what you want to write about
              </label>
              <Textarea
                placeholder="e.g., Write a blog post about productivity tips..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleAIAction('generate')}
                disabled={isLoading || !prompt}
                className="w-full mt-3"
                size="default"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};