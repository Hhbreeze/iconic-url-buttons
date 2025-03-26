
import React from "react";
import { FileDown, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotesColumnSelector from "./NotesColumnSelector";
import { ColumnCount } from "@/utils/noteFormatters";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface NotesHeaderProps {
  columnCount: ColumnCount;
  onColumnChange: (value: string) => void;
  handleSaveNotes: () => void;
  handleSaveToPdf: () => void;
  handleOpenFlashCards: () => void;
  handleOpenAIFlashCards: () => void;
  notes: string;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({
  columnCount,
  onColumnChange,
  handleSaveNotes,
  handleSaveToPdf,
  handleOpenFlashCards,
  handleOpenAIFlashCards,
  notes
}) => {
  const isMobile = useIsMobile();
  
  const onOpenFlashCards = () => {
    if (!notes || notes.trim().length === 0) {
      toast.error("Please add some notes before creating flash cards");
      return;
    }
    
    handleOpenFlashCards();
  };
  
  const onOpenAIFlashCards = () => {
    if (!notes || notes.trim().length === 0) {
      toast.error("Please add some notes before creating AI flash cards");
      return;
    }
    
    handleOpenAIFlashCards();
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
      <h2 className="text-xl font-medium text-white">Notes</h2>
      <div className="flex flex-wrap items-center gap-2">
        <NotesColumnSelector 
          columnCount={columnCount} 
          onColumnChange={onColumnChange} 
        />
        <Button
          size={isMobile ? "sm" : "sm"}
          onClick={onOpenAIFlashCards}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" />
          {isMobile ? "AI" : "AI Cards"}
        </Button>
        <Button
          size={isMobile ? "sm" : "sm"}
          onClick={onOpenFlashCards}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
        >
          <BookOpen className="w-4 h-4" />
          {isMobile ? "Cards" : "Flash Cards"}
        </Button>
        <Button
          size={isMobile ? "sm" : "sm"}
          onClick={handleSaveToPdf}
          className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
        >
          <FileDown className="w-4 h-4" />
          {isMobile ? "PDF" : "Export PDF"}
        </Button>
      </div>
    </div>
  );
};

export default NotesHeader;
