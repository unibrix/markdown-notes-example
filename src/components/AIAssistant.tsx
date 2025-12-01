import { useState } from 'react';
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
import { Sparkles, Wand2, FileText, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  onInsertText: (text: string) => void;
  selectedText: string;
}

export const AIAssistant = ({ onInsertText, selectedText }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] text-white border-none hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">AI Assistant</DialogTitle>
          <DialogDescription>
            Use AI to generate, expand, or improve your content
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Generate New Content
            </label>
            <Textarea
              placeholder="Describe what you want to write about..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={() => handleAIAction('generate')}
              disabled={isLoading || !prompt}
              className="w-full mt-2"
              size="sm"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or work with selected text
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleAIAction('expand')}
              disabled={isLoading || !selectedText}
              variant="secondary"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-1" />
              Expand
            </Button>
            <Button
              onClick={() => handleAIAction('summarize')}
              disabled={isLoading || !selectedText}
              variant="secondary"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              Summarize
            </Button>
            <Button
              onClick={() => handleAIAction('improve')}
              disabled={isLoading || !selectedText}
              variant="secondary"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Improve
            </Button>
          </div>

          {selectedText && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Selected text:</p>
              <p className="text-sm line-clamp-3">{selectedText}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};