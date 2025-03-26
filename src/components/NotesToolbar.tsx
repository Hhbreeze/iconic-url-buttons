
import React from "react";
import { Bold, Italic, Underline, HighlighterIcon, X, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { FormatType, HighlightColor } from "@/utils/noteFormatters";

const COLORS = ["yellow", "pink", "green", "blue", "purple"];

interface NotesToolbarProps {
  currentFormat: FormatType;
  highlightColor: HighlightColor;
  setCurrentFormat: (format: FormatType) => void;
  setHighlightColor: (color: HighlightColor) => void;
  handleUndo: () => void;
  removeFormatting: () => void;
}

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

const NotesToolbar: React.FC<NotesToolbarProps> = ({
  currentFormat,
  highlightColor,
  setCurrentFormat,
  setHighlightColor,
  handleUndo,
  removeFormatting
}) => {
  const applyFormat = (type: FormatType) => {
    setCurrentFormat(type === currentFormat ? "none" : type);
  };

  return (
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
  );
};

export default NotesToolbar;
