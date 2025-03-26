import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileDown, Bold, Italic, Underline, List, HighlighterIcon, Text, AlignLeft, Undo2, X, BookOpen, Columns, Columns2, Columns3 } from "lucide-react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FlashCardTraining from "./FlashCardTraining";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ["yellow", "pink", "green", "blue", "purple"];

type FormatType = "bold" | "italic" | "underline" | "highlight" | "none";
type HighlightColor = "yellow" | "pink" | "green" | "blue" | "purple";
type ColumnCount = "1" | "2" | "3";

const NotesPanel = () => {
  const [notes, setNotes] = useState<string>("");
  const [formattedNotes, setFormattedNotes] = useState<string>("");
  const [notesHistory, setNotesHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const notesRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentFormat, setCurrentFormat] = useState<FormatType>("none");
  const [highlightColor, setHighlightColor] = useState<HighlightColor>("yellow");
  const [isFlashCardOpen, setIsFlashCardOpen] = useState(false);
  const [columnCount, setColumnCount] = useState<ColumnCount>("1");

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
      
      setNotesHistory([savedFormattedNotes]);
      setHistoryIndex(0);
    }
  }, []);

  const saveToHistory = (htmlContent: string) => {
    const newHistory = historyIndex < notesHistory.length - 1 
      ? notesHistory.slice(0, historyIndex + 1) 
      : [...notesHistory];
    
    if (newHistory.length > 0 && newHistory[newHistory.length - 1] === htmlContent) {
      return;
    }
    
    newHistory.push(htmlContent);
    
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
      
      saveToHistory(htmlContent);
      
      toast.success("Notes saved successfully");
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0 && notesHistory.length > 1) {
      const newIndex = historyIndex - 1;
      const previousContent = notesHistory[newIndex];
      
      if (editorRef.current && previousContent) {
        editorRef.current.innerHTML = previousContent;
        setFormattedNotes(previousContent);
        setNotes(editorRef.current.innerText);
        setHistoryIndex(newIndex);
        
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

      printWindow.document.write(`
        <!DOCTYPE html>
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
              
              /* Direct highlighting styles - critical for PDF rendering */
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
              
              /* Print-specific styles */
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                mark {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            <h1>My Notes</h1>
            <div class="notes-content" id="notes-content"></div>
            <script>
              window.onload = function() {
                // Set the content first
                document.getElementById('notes-content').innerHTML = \`${formattedNotes.replace(/`/g, "\\`")}\`;
                
                // Process all mark elements to ensure highlighting works
                const marks = document.querySelectorAll('mark');
                marks.forEach(mark => {
                  const colorClass = mark.className;
                  if (colorClass) {
                    // Apply styles directly to ensure they stick
                    switch(colorClass) {
                      case 'yellow':
                        mark.style.cssText = "background-color: #fff9c4 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                        break;
                      case 'pink':
                        mark.style.cssText = "background-color: #f8bbd0 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                        break;
                      case 'green':
                        mark.style.cssText = "background-color: #c8e6c9 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                        break;
                      case 'blue':
                        mark.style.cssText = "background-color: #bbdefb !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                        break;
                      case 'purple':
                        mark.style.cssText = "background-color: #e1bee7 !important; color: #000 !important; display: inline-block !important; border-radius: 2px !important; padding: 0 2px !important;";
                        break;
                    }
                  }
                });
                
                // Wait for styles to be applied before printing
                setTimeout(function() {
                  window.focus();
                  window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      toast.success("Notes ready for PDF export. Select 'Save as PDF' in the print dialog.");
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
            
            const htmlContent = editorRef.current.innerHTML;
            saveToHistory(htmlContent);
            
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
      
      if (notesHistory.length === 0 || htmlContent !== notesHistory[historyIndex]) {
        saveToHistory(htmlContent);
        
        localStorage.setItem("quicklinks-notes", editorRef.current.innerText);
        localStorage.setItem("quicklinks-formatted-notes", htmlContent);
        setNotes(editorRef.current.innerText);
        setFormattedNotes(htmlContent);
      }
    }
  };

  const removeFormatting = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        if (!range.collapsed) {
          const selectedHtml = range.cloneContents();
          const textContent = selectedHtml.textContent;
          
          const textNode = document.createTextNode(textContent || "");
          
          range.deleteContents();
          range.insertNode(textNode);
          
          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.setStartAfter(textNode);
          newRange.setEndAfter(textNode);
          selection.addRange(newRange);
          
          editorRef.current.focus();
          
          const htmlContent = editorRef.current.innerHTML;
          saveToHistory(htmlContent);
          
          localStorage.setItem("quicklinks-notes", editorRef.current.innerText);
          localStorage.setItem("quicklinks-formatted-notes", htmlContent);
          setNotes(editorRef.current.innerText);
          setFormattedNotes(htmlContent);
          
          toast.info("Formatting removed");
        } else {
          toast.info("Select text to remove formatting");
        }
      }
    }
  };

  const handleOpenFlashCards = () => {
    if (!notes || notes.trim().length === 0) {
      toast.error("Please add some notes before creating flash cards");
      return;
    }
    
    setIsFlashCardOpen(true);
  };

  const handleColumnChange = (value: string) => {
    setColumnCount(value as ColumnCount);
    
    localStorage.setItem("quicklinks-notes-columns", value);
    
    toast.success(`Notes now displayed in ${value} column${value !== "1" ? "s" : ""}`);
  };

  useEffect(() => {
    const savedColumns = localStorage.getItem("quicklinks-notes-columns");
    if (savedColumns && ["1", "2", "3"].includes(savedColumns)) {
      setColumnCount(savedColumns as ColumnCount);
    }
  }, []);

  return (
    <div className="glass-card bg-white/10 dark:bg-black/25 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">Notes</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center mr-2">
            <Select value={columnCount} onValueChange={handleColumnChange}>
              <SelectTrigger className="w-[130px] h-8 text-white border-white/20 bg-white/5">
                <SelectValue placeholder="Columns" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="1" className="text-white">
                  <div className="flex items-center gap-2">
                    <Columns className="h-4 w-4" />
                    <span>1 Column</span>
                  </div>
                </SelectItem>
                <SelectItem value="2" className="text-white">
                  <div className="flex items-center gap-2">
                    <Columns2 className="h-4 w-4" />
                    <span>2 Columns</span>
                  </div>
                </SelectItem>
                <SelectItem value="3" className="text-white">
                  <div className="flex items-center gap-2">
                    <Columns3 className="h-4 w-4" />
                    <span>3 Columns</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            onClick={handleOpenFlashCards}
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
            onClick={removeFormatting}
            className="h-9 w-9 bg-white/10 text-white hover:bg-indigo-700"
            title="Remove Formatting"
          >
            <X className="h-4 w-4" />
          </Button>
          
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
          className={`w-full h-full min-h-[200px] outline-none focus:outline-none focus:ring-0 whitespace-pre-wrap ${
            columnCount === "2" ? "column-count-2" : 
            columnCount === "3" ? "column-count-3" : ""
          }`}
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
            columnGap: "2rem",
            columnRuleWidth: columnCount !== "1" ? "1px" : "0",
            columnRuleStyle: columnCount !== "1" ? "solid" : "none",
            columnRuleColor: "rgba(255, 255, 255, 0.2)",
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
      
      <FlashCardTraining 
        notesText={notes} 
        open={isFlashCardOpen} 
        onClose={() => setIsFlashCardOpen(false)} 
      />
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
