
export function saveNotesToStorage(notes: string, formattedNotes: string) {
  localStorage.setItem("quicklinks-notes", notes);
  localStorage.setItem("quicklinks-formatted-notes", formattedNotes);
}

export function saveColumnPreference(columnCount: string) {
  localStorage.setItem("quicklinks-notes-columns", columnCount);
}

export function getNotesFromStorage() {
  return {
    notes: localStorage.getItem("quicklinks-notes") || "",
    formattedNotes: localStorage.getItem("quicklinks-formatted-notes") || "",
  };
}

export function getColumnPreference(): string {
  const savedColumns = localStorage.getItem("quicklinks-notes-columns");
  if (savedColumns && ["1", "2", "3"].includes(savedColumns)) {
    return savedColumns;
  }
  return "1";
}
