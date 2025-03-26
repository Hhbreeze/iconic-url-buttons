
import React from "react";
import { FileDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotesColumnSelector from "./NotesColumnSelector";
import { ColumnCount } from "@/utils/noteFormatters";
import { toast } from "sonner";

interface NotesHeaderProps {
  columnCount: ColumnCount;
  onColumnChange: (value: string) => void;
  handleSaveNotes: () => void;
  handleSaveToPdf: () => void;
  handleOpenFlashCards: () => void;
  notes: string;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({
  columnCount,
  onColumnChange,
  handleSaveNotes,
  handleSaveToPdf,
  handleOpenFlashCards,
  notes
}) => {
  
  const onOpenFlashCards = () => {
    if (!notes || notes.trim().length === 0) {
      toast.error("Please add some notes before creating flash cards");
      return;
    }
    
    handleOpenFlashCards();
  };
  
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-medium text-white">Notes</h2>
      <div className="flex items-center gap-2">
        <NotesColumnSelector 
          columnCount={columnCount} 
          onColumnChange={onColumnChange} 
        />
        <Button
          size="sm"
          onClick={handleSaveNotes}
          variant="outline"
          className="text-white border-white/20 bg-white/5 hover:bg-white/10"
        >
          Save
        </Button>
        <Button
          size="sm"
          onClick={onOpenFlashCards}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
        >
          <BookOpen className="w-4 h-4" />
          Flash Cards
        </Button>
        <Button
          size="sm"
          onClick={handleSaveToPdf}
          className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default NotesHeader;
