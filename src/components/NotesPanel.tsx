import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDown, Bold, Italic, Underline, List, HighlighterIcon, Text, AlignLeft, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COLORS = ["yellow", "pink", "green", "blue", "purple"];

type FormatType = "bold" | "italic" | "underline" | "highlight" | "none";
type HighlightColor = "yellow" | "pink" | "green" | "blue" | "purple";

const NotesPanel = () => {
  const [notes, setNotes] = useState<string>("");
  const [formattedNotes, setFormattedNotes] = useState<string>("");
  const [notesHistory, setNotesHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
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
      
      // Initialize history with the loaded content
      setNotesHistory([savedFormattedNotes]);
      setHistoryIndex(0);
    }
  }, []);

  const saveToHistory = (htmlContent: string) => {
    // Remove any future history if we're not at the end
    const newHistory = historyIndex < notesHistory.length - 1 
      ? notesHistory.slice(0, historyIndex + 1) 
      : [...notesHistory];
    
    // Don't add if content is the same as the last history item
    if (newHistory.length > 0 && newHistory[newHistory.length - 1] === htmlContent) {
      return;
    }
    
    // Add current content to history
    newHistory.push(htmlContent);
    
    // Limit history to prevent excessive memory usage (e.g., keep last 50 changes)
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setNotesHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSaveNotes = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      const textContent = editorRef.current.innerText;
      
      localStorage.setItem("quicklinks-notes", textContent);
      localStorage.setItem("quicklinks-formatted-notes", htmlContent);
      setNotes(textContent);
      setFormattedNotes(htmlContent);
      
      // Save to history when explicitly saving
      saveToHistory(htmlContent);
      
      toast.success("Notes saved successfully");
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0 && notesHistory.length > 1) {
      const newIndex = historyIndex - 1;
      const previousContent = notesHistory[newIndex];
      
      // Update the editor with the previous content
      if (editorRef.current && previousContent) {
        editorRef.current.innerHTML = previousContent;
        setFormattedNotes(previousContent);
        setNotes(editorRef.current.innerText);
        setHistoryIndex(newIndex);
        
        // Save to localStorage
        localStorage.setItem("quicklinks-notes", editorRef.current.innerText);
        localStorage.setItem("quicklinks-formatted-notes", previousContent);
        
        toast.info("Undid last change");
      }
    } else {
      toast.info("Nothing to undo");
    }
  };

  const handleSaveToPdf = async () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Pop-up blocked. Please allow pop-ups for this site.");
        return;
      }

      // Create an iframe for printing instead of directly writing to document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Notes PDF</title>
            <style>
              @media print {
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
                
                /* Critical: Make highlighting styles !important and ensure they apply in print mode */
                mark {
                  display: inline-block !important;
                  border-radius: 2px !important;
                  padding: 0 2px !important;
                }
                mark.yellow {
                  background-color: #fff9c4 !important;
                  color: #000 !important;
                }
                mark.pink {
                  background-color: #f8bbd0 !important;
                  color: #000 !important;
                }
                mark.green {
                  background-color: #c8e6c9 !important;
                  color: #000 !important;
                }
                mark.blue {
                  background-color: #bbdefb !important;
                  color: #000 !important;
                }
                mark.purple {
                  background-color: #e1bee7 !important;
                  color: #000 !important;
                }
                strong {
                  font-weight: bold !important;
                }
                em {
                  font-style: italic !important;
                }
                u {
                  text-decoration: underline !important;
                }
              }
              
              /* Non-print styles */
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
                display: inline-block;
                border-radius: 2px;
                padding: 0 2px;
              }
              mark.yellow {
                background-color: #fff9c4 !important;
                color: #000 !important;
              }
              mark.pink {
                background-color: #f8bbd0 !important;
                color: #000 !important;
              }
              mark.green {
                background-color: #c8e6c9 !important;
                color: #000 !important;
              }
              mark.blue {
                background-color: #bbdefb !important;
                color: #000 !important;
              }
              mark.purple {
                background-color: #e1bee7 !important;
                color: #000 !important;
              }
              strong {
                font-weight: bold !important;
              }
              em {
                font-style: italic !important;
              }
              u {
                text-decoration: underline !important;
              }
            </style>
          </head>
          <body>
            <h1>My Notes</h1>
            <div class="notes-content" id="notes-content"></div>
            <script>
              // Wait for DOM to be ready
              document.addEventListener('DOMContentLoaded', function() {
                // Insert the notes content
                document.getElementById('notes-content').innerHTML = \`${formattedNotes.replace(/`/g, "\\`")}\`;
                
                // Give a moment for styles to apply properly before printing
                setTimeout(function() {
                  window.focus();
                  window.print();
                }, 1000);
              });
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Force styles to recompute and print after a short delay
      printWindow.onload = function() {
        // Do one final check of the highlight marks before printing
        const marks = printWindow.document.querySelectorAll('mark');
        marks.forEach(mark => {
          // Ensure class is preserved and styles are applied
          const colorClass = mark.className;
          if (colorClass) {
            mark.setAttribute('style', `background-color: var(--highlight-${colorClass}) !important; color: #000 !important;`);
          }
        });
        
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          toast.success("Notes ready for PDF export. Select 'Save as PDF' in the print dialog.");
        }, 1000);
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
            
            // Save current state to history after formatting
            const htmlContent = editorRef.current.innerHTML;
            saveToHistory(htmlContent);
            
            // Also save to localStorage
            localStorage.setItem("quicklinks-notes", editorRef.current.innerText);
            localStorage.setItem("quicklinks-formatted-notes", htmlContent);
            setNotes(editorRef.current.innerText);
            setFormattedNotes(htmlContent);
          }
        }
      }
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      
      // Check if the content has actually changed from the last history item
      if (notesHistory.length === 0 || htmlContent !== notesHistory[historyIndex]) {
        saveToHistory(htmlContent);
        
        // Save to localStorage
        localStorage.setItem("quicklinks-notes", editorRef.current.innerText);
        localStorage.setItem("quicklinks-formatted-notes", htmlContent);
        setNotes(editorRef.current.innerText);
        setFormattedNotes(htmlContent);
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
          
          <Button 
            size="icon"
            variant="ghost"
            onClick={handleUndo}
            className="h-9 w-9 bg-white/10 text-white hover:bg-indigo-700"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </ToggleGroup>
      </div>
      
      <div ref={notesRef} className="flex-1 min-h-[200px] bg-white/5 text-white resize-none border border-solid border-white/20 rounded-md p-2">
        <div
          ref={editorRef}
          className="w-full h-full min-h-[200px] outline-none focus:outline-none focus:ring-0 whitespace-pre-wrap"
          contentEditable
          onKeyUp={handleEditorInput}
          onMouseUp={handleEditorInput}
          onBlur={handleContentChange}
          onInput={handleContentChange}
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
