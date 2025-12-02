import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesList = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: NotesListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full border-r border-sidebar-border bg-sidebar flex flex-col h-screen">
      <header className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-display font-bold text-sidebar-foreground mb-4">
          Notes
        </h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-sidebar-accent border-sidebar-border"
          />
        </div>
        <Button
          onClick={onCreateNote}
          className="w-full bg-primary hover:bg-primary/90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <nav className="p-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 px-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors group relative",
                    selectedNoteId === note.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate mb-1">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {note.content.substring(0, 100) || 'Empty note'}
                      </p>
                      <time className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </time>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
};