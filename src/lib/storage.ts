
import { QuickLink } from "@/types";

// Default gradient pairs for buttons with more vibrant, high-contrast colors
const DEFAULT_GRADIENTS = [
  { from: "from-blue-600", to: "to-indigo-700" },
  { from: "from-purple-600", to: "to-pink-700" },
  { from: "from-green-600", to: "to-teal-700" },
  { from: "from-amber-600", to: "to-orange-700" },
  { from: "from-rose-600", to: "to-red-700" },
  { from: "from-cyan-600", to: "to-blue-700" },
  { from: "from-fuchsia-600", to: "to-purple-700" },
  { from: "from-yellow-500", to: "to-amber-700" },
  { from: "from-lime-600", to: "to-green-700" },
  { from: "from-sky-600", to: "to-indigo-700" },
  { from: "from-violet-600", to: "to-purple-800" },
  { from: "from-pink-600", to: "to-rose-700" },
  { from: "from-indigo-600", to: "to-blue-800" },
  { from: "from-emerald-600", to: "to-green-800" },
  { from: "from-orange-600", to: "to-red-700" },
];

// Initial creation of links
export const createInitialLinks = (): QuickLink[] => {
  const links: QuickLink[] = [];
  
  // Explicitly creating exactly 24 buttons
  for (let i = 0; i < 24; i++) {
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
      const parsedLinks = JSON.parse(savedLinks) as QuickLink[];
      
      // Ensure we only return 24 links (in case there were 25 stored previously)
      if (parsedLinks.length > 24) {
        return parsedLinks.slice(0, 24);
      }
      
      return parsedLinks;
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
