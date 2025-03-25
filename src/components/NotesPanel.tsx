
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

const NotesPanel = () => {
  const [notes, setNotes] = useState<string>("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("quicklinks-notes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem("quicklinks-notes", notes);
    toast.success("Notes saved successfully");
  };

  const handleSaveToPdf = async () => {
    try {
      // Use the browser's print functionality to save as PDF
      window.print();
      toast.success("Page ready for PDF conversion. Select 'Save as PDF' in the print dialog.");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="glass-card bg-white/10 dark:bg-black/25 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">Notes</h2>
        <Button
          size="sm"
          onClick={handleSaveToPdf}
          className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
        >
          <FileDown className="w-4 h-4" />
          Save as PDF
        </Button>
      </div>
      
      <Textarea
        className="flex-1 min-h-[200px] bg-white/5 text-white resize-none border-solid border-white/20"
        placeholder="Paste or type your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleSaveNotes}
      />
      
      <p className="text-xs text-purple-200 mt-2">
        Notes are saved automatically when you click outside the text area
      </p>
    </div>
  );
};

export default NotesPanel;
