
export type FormatType = "bold" | "italic" | "underline" | "highlight" | "none";
export type HighlightColor = "yellow" | "pink" | "green" | "blue" | "purple";
export type ColumnCount = "1" | "2" | "3";

export function getColorValue(color: HighlightColor): string {
  switch (color) {
    case "yellow": return "#fff9c4";
    case "pink": return "#f8bbd0";
    case "green": return "#c8e6c9";
    case "blue": return "#bbdefb";
    case "purple": return "#e1bee7";
    default: return "#fff9c4";
  }
}
