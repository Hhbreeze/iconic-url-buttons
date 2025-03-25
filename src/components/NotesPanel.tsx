import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDown, Bold, Italic, Underline, List, HighlighterIcon, Text, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COLORS = ["yellow", "pink", "green", "blue", "purple"];

type FormatType = "bold" | "italic" | "underline" | "highlight" | "none";
type HighlightColor = "yellow" | "pink" | "green" | "blue" | "purple";

const NotesPanel = () => {
  const [notes, setNotes] = useState<string>("");
  const [formattedNotes, setFormattedNotes] = useState<string>("");
  const notesRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentFormat, setCurrentFormat] = useState<FormatType>("none");
  const [highlightColor, setHighlightColor] = useState<HighlightColor>("yellow");

  useEffect(() => {
    const savedNotes = localStorage.getItem("quicklinks-notes");
    const savedFormattedNotes = localStorage.getItem("quicklinks-formatted-notes");
    
    if (savedNotes) {
      setNotes(savedNotes);
    }
    
    if (savedFormattedNotes) {
      setFormattedNotes(savedFormattedNotes);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedFormattedNotes;
      }
    }
  }, []);

  const handleSaveNotes = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      const textContent = editorRef.current.innerText;
      
      localStorage.setItem("quicklinks-notes", textContent);
      localStorage.setItem("quicklinks-formatted-notes", htmlContent);
      setNotes(textContent);
      setFormattedNotes(htmlContent);
      
      toast.success("Notes saved successfully");
    }
  };

  const handleSaveToPdf = async () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Pop-up blocked. Please allow pop-ups for this site.");
        return;
      }

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
              mark {
                border-radius: 2px;
                padding: 0 2px;
              }
              mark.yellow {
                background-color: #fff9c4;
                color: #000;
              }
              mark.pink {
                background-color: #f8bbd0;
                color: #000;
              }
              mark.green {
                background-color: #c8e6c9;
                color: #000;
              }
              mark.blue {
                background-color: #bbdefb;
                color: #000;
              }
              mark.purple {
                background-color: #e1bee7;
                color: #000;
              }
              strong {
                font-weight: bold;
              }
              em {
                font-style: italic;
              }
              u {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <h1>My Notes</h1>
            <div class="notes-content">${formattedNotes}</div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.onload = function() {
        printWindow.print();
        toast.success("Notes ready for PDF export. Select 'Save as PDF' in the print dialog.");
      };
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const applyFormat = (type: FormatType) => {
    setCurrentFormat(type === currentFormat ? "none" : type);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && currentFormat !== "none") {
        const range = selection.getRangeAt(0);
        
        if (!range.collapsed) {
          const selectedText = range.toString();
          
          let formattedElement: HTMLElement | null = null;
          
          if (currentFormat === "bold") {
            formattedElement = document.createElement("strong");
            formattedElement.textContent = selectedText;
          } else if (currentFormat === "italic") {
            formattedElement = document.createElement("em");
            formattedElement.textContent = selectedText;
          } else if (currentFormat === "underline") {
            formattedElement = document.createElement("u");
            formattedElement.textContent = selectedText;
          } else if (currentFormat === "highlight") {
            formattedElement = document.createElement("mark");
            formattedElement.className = highlightColor;
            formattedElement.textContent = selectedText;
          }
          
          if (formattedElement) {
            range.deleteContents();
            range.insertNode(formattedElement);
            
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStartAfter(formattedElement);
            newRange.setEndAfter(formattedElement);
            selection.addRange(newRange);
            
            editorRef.current.focus();
            
            handleSaveNotes();
          }
        }
      }
    }
  };

  return (
    <div className="glass-card bg-white/10 dark:bg-black/25 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">Notes</h2>
        <div className="flex items-center gap-2">
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
            onClick={handleSaveToPdf}
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ToggleGroup type="single" value={currentFormat}>
          <ToggleGroupItem 
            value="bold" 
            onClick={() => applyFormat("bold")}
            className={`${currentFormat === 'bold' ? 'bg-indigo-600' : 'bg-white/10'} text-white hover:bg-indigo-700`}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="italic" 
            onClick={() => applyFormat("italic")}
            className={`${currentFormat === 'italic' ? 'bg-indigo-600' : 'bg-white/10'} text-white hover:bg-indigo-700`}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="underline" 
            onClick={() => applyFormat("underline")}
            className={`${currentFormat === 'underline' ? 'bg-indigo-600' : 'bg-white/10'} text-white hover:bg-indigo-700`}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          
          <Popover>
            <PopoverTrigger asChild>
              <ToggleGroupItem 
                value="highlight" 
                onClick={() => applyFormat("highlight")}
                className={`${currentFormat === 'highlight' ? 'bg-indigo-600' : 'bg-white/10'} text-white hover:bg-indigo-700`}
              >
                <HighlighterIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-gray-800 border-gray-700">
              <div className="flex gap-1">
                {COLORS.map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 ${
                      highlightColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: getColorValue(color as HighlightColor) }}
                    onClick={() => setHighlightColor(color as HighlightColor)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </ToggleGroup>
      </div>
      
      <div ref={notesRef} className="flex-1 min-h-[200px] bg-white/5 text-white resize-none border border-solid border-white/20 rounded-md p-2">
        <div
          ref={editorRef}
          className="w-full h-full min-h-[200px] outline-none focus:outline-none focus:ring-0 whitespace-pre-wrap"
          contentEditable
          onKeyUp={handleEditorInput}
          onMouseUp={handleEditorInput}
          onBlur={handleSaveNotes}
          dangerouslySetInnerHTML={{ __html: formattedNotes }}
          style={{
            minHeight: "200px",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        />
      </div>
      
      <div className="flex flex-wrap justify-between items-center mt-2">
        <p className="text-xs text-purple-200">
          Notes are saved automatically when you click outside the text area
        </p>
        <p className="text-xs text-purple-200">
          <span className="font-semibold">Tip:</span> Select text to format or highlight
        </p>
      </div>
    </div>
  );
};

function getColorValue(color: HighlightColor): string {
  switch (color) {
    case "yellow": return "#fff9c4";
    case "pink": return "#f8bbd0";
    case "green": return "#c8e6c9";
    case "blue": return "#bbdefb";
    case "purple": return "#e1bee7";
    default: return "#fff9c4";
  }
}

export default NotesPanel;
