import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

const NotesPanel = () => {
  const [notes, setNotes] = useState<string>("");
  const notesRef = useRef<HTMLDivElement>(null);

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
      // Create a new window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Pop-up blocked. Please allow pop-ups for this site.");
        return;
      }

      // Add content and styling to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Notes PDF</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 40px;
                white-space: pre-wrap;
              }
              h1 {
                color: #333;
                margin-bottom: 20px;
              }
              .notes-content {
                border: 1px solid #ddd;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <h1>My Notes</h1>
            <div class="notes-content">${notes.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);

      // Trigger print dialog once content is loaded
      printWindow.document.close();
      printWindow.onload = function() {
        printWindow.print();
        // Keep the window open for user to select save as PDF option
      };

      toast.success("Notes ready for PDF export. Select 'Save as PDF' in the print dialog.");
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
      
      <div ref={notesRef}>
        <Textarea
          className="flex-1 min-h-[200px] bg-white/5 text-white resize-none border-solid border-white/20"
          placeholder="Paste or type your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveNotes}
        />
      </div>
      
      <p className="text-xs text-purple-200 mt-2">
        Notes are saved automatically when you click outside the text area
      </p>
    </div>
  );
};

export default NotesPanel;
