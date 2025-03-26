
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import FlashCardTraining from "./FlashCardTraining";
import NotesToolbar from "./NotesToolbar";
import NotesHeader from "./NotesHeader";
import NotesEditor from "./NotesEditor";
import { FormatType, HighlightColor, ColumnCount } from "@/utils/noteFormatters";
import { exportNotesToPdf } from "@/utils/pdfExporter";
import { saveNotesToStorage, getNotesFromStorage, saveColumnPreference, getColumnPreference } from "@/utils/notesStorage";

const NotesPanel = () => {
  const [notes, setNotes] = useState<string>("");
  const [formattedNotes, setFormattedNotes] = useState<string>("");
  const [notesHistory, setNotesHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const notesRef = useRef<HTMLDivElement>(null);
  const [currentFormat, setCurrentFormat] = useState<FormatType>("none");
  const [highlightColor, setHighlightColor] = useState<HighlightColor>("yellow");
  const [isFlashCardOpen, setIsFlashCardOpen] = useState(false);
  const [columnCount, setColumnCount] = useState<ColumnCount>("1");

  // Load saved notes on component mount
  useEffect(() => {
    const { notes: savedNotes, formattedNotes: savedFormattedNotes } = getNotesFromStorage();
    
    if (savedNotes) {
      setNotes(savedNotes);
    }
    
    if (savedFormattedNotes) {
      setFormattedNotes(savedFormattedNotes);
      setNotesHistory([savedFormattedNotes]);
      setHistoryIndex(0);
    }
    
    const savedColumns = getColumnPreference();
    if (savedColumns) {
      setColumnCount(savedColumns as ColumnCount);
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
    const editorElement = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editorElement) {
      const htmlContent = editorElement.innerHTML;
      const textContent = editorElement.innerText;
      
      saveNotesToStorage(textContent, htmlContent);
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
      
      const editorElement = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
      if (editorElement && previousContent) {
        editorElement.innerHTML = previousContent;
        setFormattedNotes(previousContent);
        setNotes(editorElement.innerText);
        setHistoryIndex(newIndex);
        
        saveNotesToStorage(editorElement.innerText, previousContent);
        
        toast.info("Undid last change");
      }
    } else {
      toast.info("Nothing to undo");
    }
  };

  const handleSaveToPdf = () => {
    exportNotesToPdf(formattedNotes, columnCount);
  };

  const handleEditorInput = () => {
    const editorElement = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editorElement) {
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
            
            editorElement.focus();
            
            const htmlContent = editorElement.innerHTML;
            saveToHistory(htmlContent);
            
            saveNotesToStorage(editorElement.innerText, htmlContent);
            setNotes(editorElement.innerText);
            setFormattedNotes(htmlContent);
          }
        }
      }
    }
  };

  const handleContentChange = () => {
    const editorElement = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editorElement) {
      const htmlContent = editorElement.innerHTML;
      
      if (notesHistory.length === 0 || htmlContent !== notesHistory[historyIndex]) {
        saveToHistory(htmlContent);
        
        saveNotesToStorage(editorElement.innerText, htmlContent);
        setNotes(editorElement.innerText);
        setFormattedNotes(htmlContent);
      }
    }
  };

  const removeFormatting = () => {
    const editorElement = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editorElement) {
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
          
          editorElement.focus();
          
          const htmlContent = editorElement.innerHTML;
          saveToHistory(htmlContent);
          
          saveNotesToStorage(editorElement.innerText, htmlContent);
          setNotes(editorElement.innerText);
          setFormattedNotes(htmlContent);
          
          toast.info("Formatting removed");
        } else {
          toast.info("Select text to remove formatting");
        }
      }
    }
  };

  const handleColumnChange = (value: string) => {
    setColumnCount(value as ColumnCount);
    
    saveColumnPreference(value);
    
    toast.success(`Notes now displayed in ${value} column${value !== "1" ? "s" : ""}`);
  };

  const updateNotes = (notesText: string, formattedNotesHtml: string) => {
    setNotes(notesText);
    setFormattedNotes(formattedNotesHtml);
  };

  return (
    <div className="glass-card bg-white/10 dark:bg-black/25 p-6 h-full flex flex-col">
      <NotesHeader 
        columnCount={columnCount}
        onColumnChange={handleColumnChange}
        handleSaveNotes={handleSaveNotes}
        handleSaveToPdf={handleSaveToPdf}
        handleOpenFlashCards={() => setIsFlashCardOpen(true)}
        notes={notes}
      />
      
      <NotesToolbar 
        currentFormat={currentFormat}
        highlightColor={highlightColor}
        setCurrentFormat={setCurrentFormat}
        setHighlightColor={setHighlightColor}
        handleUndo={handleUndo}
        removeFormatting={removeFormatting}
      />
      
      <NotesEditor 
        formattedNotes={formattedNotes}
        columnCount={columnCount}
        currentFormat={currentFormat}
        highlightColor={highlightColor}
        onContentChange={handleContentChange}
        onEditorInput={handleEditorInput}
        onNotesUpdate={updateNotes}
        saveToHistory={saveToHistory}
      />
      
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

export default NotesPanel;
