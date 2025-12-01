import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotesList } from '@/components/NotesList';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { AIAssistant } from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, Loader2, FileText, Edit, Eye } from 'lucide-react';
import { Session, User } from '@supabase/supabase-js';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mobileTab, setMobileTab] = useState('notes');

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load notes
  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  // Auto-save on content change
  useEffect(() => {
    if (selectedNoteId && user) {
      const timeoutId = setTimeout(() => {
        saveNote();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [title, content, selectedNoteId]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      
      if (data && data.length > 0 && !selectedNoteId) {
        selectNote(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: 'Untitled',
          content: '',
        })
        .select()
        .single();

      if (error) throw error;
      
      setNotes([data, ...notes]);
      selectNote(data.id);
      
      toast({
        title: 'Success',
        description: 'New note created',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const saveNote = async () => {
    if (!selectedNoteId || !user || saving) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', selectedNoteId);

      if (error) throw error;
      
      // Update local state
      setNotes(notes.map(note => 
        note.id === selectedNoteId 
          ? { ...note, title, content, updated_at: new Date().toISOString() }
          : note
      ));
    } catch (error: any) {
      toast({
        title: 'Error saving',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== noteId));
      
      if (selectedNoteId === noteId) {
        const remainingNotes = notes.filter(note => note.id !== noteId);
        if (remainingNotes.length > 0) {
          selectNote(remainingNotes[0].id);
        } else {
          setSelectedNoteId(null);
          setTitle('');
          setContent('');
        }
      }
      
      toast({
        title: 'Success',
        description: 'Note deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const selectNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNoteId(noteId);
      setTitle(note.title);
      setContent(note.content);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const getSelectedText = () => {
    const selection = window.getSelection();
    return selection?.toString() || '';
  };

  const insertText = (text: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setContent(prev => {
        const start = prev.substring(0, content.indexOf(getSelectedText()));
        const end = prev.substring(start.length + getSelectedText().length);
        return start + text + end;
      });
    } else {
      setContent(prev => prev + '\n\n' + text);
    }
  };

  const exportMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'Untitled'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Success',
      description: 'Note exported as .md file',
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-between p-2 border-b bg-sidebar-background">
        <div className="flex items-center gap-2">
            <AIAssistant
              onInsertText={insertText}
              selectedText={getSelectedText()}
              onSelectionAction={() => {}}
              resetKey={selectedNoteId || 'no-note'}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={mobileTab} onValueChange={setMobileTab} className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-3 rounded-none">
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="editor" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="flex-1 m-0 overflow-hidden">
            <NotesList
              notes={notes}
              selectedNoteId={selectedNoteId}
              onSelectNote={(id) => {
                selectNote(id);
                setMobileTab('editor');
              }}
              onCreateNote={createNote}
              onDeleteNote={deleteNote}
            />
          </TabsContent>
          
          <TabsContent value="editor" className="flex-1 m-0 overflow-hidden">
            <MarkdownEditor
              title={title}
              content={content}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onExport={exportMarkdown}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
            <MarkdownPreview content={content} title={title} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
          <NotesList
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={selectNote}
            onCreateNote={createNote}
            onDeleteNote={deleteNote}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <MarkdownEditor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onExport={exportMarkdown}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <MarkdownPreview content={content} title={title} />
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <AIAssistant
          onInsertText={insertText}
          selectedText={getSelectedText()}
          onSelectionAction={() => {}}
          resetKey={selectedNoteId || 'no-note'}
        />
        <Button
          variant="default"
          size="sm"
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Index;