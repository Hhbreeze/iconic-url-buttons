
import { QuickLink } from "@/types";

// Default gradient pairs for buttons with more attractive colors
const DEFAULT_GRADIENTS = [
  { from: "from-blue-500", to: "to-indigo-600" },
  { from: "from-purple-500", to: "to-pink-600" },
  { from: "from-green-500", to: "to-teal-600" },
  { from: "from-amber-500", to: "to-orange-600" },
  { from: "from-rose-500", to: "to-red-600" },
  { from: "from-cyan-500", to: "to-blue-600" },
  { from: "from-fuchsia-500", to: "to-purple-600" },
  { from: "from-yellow-400", to: "to-amber-600" },
  { from: "from-lime-500", to: "to-green-600" },
  { from: "from-sky-500", to: "to-indigo-600" },
  { from: "from-violet-500", to: "to-purple-700" },
  { from: "from-pink-500", to: "to-rose-600" },
  { from: "from-indigo-500", to: "to-blue-700" },
  { from: "from-emerald-500", to: "to-green-700" },
  { from: "from-orange-500", to: "to-red-600" },
];

// Initial creation of links
export const createInitialLinks = (): QuickLink[] => {
  const links: QuickLink[] = [];
  
  for (let i = 0; i < 25; i++) {
    const gradientPair = DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length];
    links.push({
      id: `link-${i}`,
      url: "",
      title: `Link ${i + 1}`,
      icon: null,
      gradientFrom: gradientPair.from,
      gradientTo: gradientPair.to,
    });
  }
  
  return links;
};

// Storage key for saving links to localStorage
const STORAGE_KEY = "quick-links";

// Load links from localStorage
export const loadLinks = (): QuickLink[] => {
  try {
    const savedLinks = localStorage.getItem(STORAGE_KEY);
    if (savedLinks) {
      return JSON.parse(savedLinks);
    }
  } catch (error) {
    console.error("Failed to load links:", error);
  }
  
  const initialLinks = createInitialLinks();
  saveLinks(initialLinks);
  return initialLinks;
};

// Save links to localStorage
export const saveLinks = (links: QuickLink[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    console.error("Failed to save links:", error);
  }
};

// Update a specific link
export const updateLink = (links: QuickLink[], updatedLink: QuickLink): QuickLink[] => {
  const newLinks = links.map(link => 
    link.id === updatedLink.id ? updatedLink : link
  );
  saveLinks(newLinks);
  return newLinks;
};

// Convert data URL to blob for file upload
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};
