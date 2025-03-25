
import React from "react";
import { cn } from "@/lib/utils";

interface WebPreviewProps {
  url: string | null;
}

const WebPreview: React.FC<WebPreviewProps> = ({ url }) => {
  if (!url) {
    return (
      <div className="glass-card bg-white/5 dark:bg-black/15 p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <p className="text-purple-200">
          Click on any link button above to preview the website here
        </p>
      </div>
    );
  }

  // Ensure URL has the proper format
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  return (
    <div className="glass-card bg-white/5 dark:bg-black/15 p-2 flex flex-col h-[300px]">
      <div className="mb-2 px-2 py-1 flex items-center bg-white/10 rounded">
        <div className="text-xs text-purple-200 truncate flex-1">
          {formattedUrl}
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded">
        <iframe 
          src={formattedUrl} 
          title="Web Preview" 
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default WebPreview;
