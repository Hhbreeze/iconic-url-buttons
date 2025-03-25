
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
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

  return (
    <div className="glass-card bg-white/10 dark:bg-black/25 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">Notes</h2>
        <Button 
          size="sm" 
          onClick={handleSaveNotes}
          className="flex items-center gap-1"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
      
      <Textarea
        className="flex-1 min-h-[200px] bg-white/5 text-white resize-none border-solid border-white/20"
        placeholder="Paste or type your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      
      <p className="text-xs text-purple-200 mt-2">
        Notes are saved locally in your browser
      </p>
    </div>
  );
};

export default NotesPanel;
