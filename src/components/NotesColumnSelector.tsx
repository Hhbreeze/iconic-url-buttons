
import React from "react";
import { Columns, Columns2, Columns3 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnCount } from "@/utils/noteFormatters";

interface NotesColumnSelectorProps {
  columnCount: ColumnCount;
  onColumnChange: (value: string) => void;
}

const NotesColumnSelector: React.FC<NotesColumnSelectorProps> = ({
  columnCount,
  onColumnChange
}) => {
  return (
    <div className="flex items-center mr-2">
      <Select value={columnCount} onValueChange={onColumnChange}>
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
  );
};

export default NotesColumnSelector;
