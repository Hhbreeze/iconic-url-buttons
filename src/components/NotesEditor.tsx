
import React, { useRef, useEffect } from "react";
import { FormatType, HighlightColor, ColumnCount } from "@/utils/noteFormatters";
import { toast } from "sonner";

interface NotesEditorProps {
  formattedNotes: string;
  columnCount: ColumnCount;
  currentFormat: FormatType;
  highlightColor: HighlightColor;
  onContentChange: () => void;
  onEditorInput: () => void;
  onNotesUpdate: (notes: string, formattedNotes: string) => void;
  saveToHistory: (htmlContent: string) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
  formattedNotes,
  columnCount,
  currentFormat,
  highlightColor,
  onContentChange,
  onEditorInput,
  onNotesUpdate,
  saveToHistory
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Apply initial content
  useEffect(() => {
    if (editorRef.current && formattedNotes) {
      editorRef.current.innerHTML = formattedNotes;
    }
  }, []);

  return (
    <div 
      className="flex-1 min-h-[200px] bg-white/5 text-white resize-none border border-solid border-white/20 rounded-md p-2"
    >
      <div
        ref={editorRef}
        className={`w-full h-full min-h-[200px] outline-none focus:outline-none focus:ring-0 whitespace-pre-wrap ${
          columnCount === "2" ? "column-count-2" : 
          columnCount === "3" ? "column-count-3" : ""
        }`}
        contentEditable
        onKeyUp={onEditorInput}
        onMouseUp={onEditorInput}
        onBlur={onContentChange}
        onInput={onContentChange}
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
  );
};

export default NotesEditor;
