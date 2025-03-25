
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface WebPreviewProps {
  url: string | null;
}

const WebPreview: React.FC<WebPreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset states when URL changes
  useEffect(() => {
    if (url) {
      setIsLoading(true);
      setError(null);
      console.log("WebPreview: Loading URL:", url);
      
      // Add additional check for known sites that block iframe embedding
      const blockedDomains = ['jw.org', 'wol.jw.org'];
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = urlObj.hostname.replace('www.', '');
      
      if (blockedDomains.some(blocked => domain.includes(blocked))) {
        setIsLoading(false);
        setError("This website blocks being displayed in iframes due to security policies. Please use the 'Open in new tab' option.");
        console.warn("WebPreview: Site likely blocks iframe embedding:", url);
      }
    }
  }, [url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log("WebPreview: iframe loaded successfully");
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load website. Some sites block being displayed in iframes.");
    console.error("WebPreview: Failed to load iframe content");
  };

  if (!url) {
    return (
      <div className="glass-card bg-white/5 dark:bg-black/15 p-6 flex flex-col items-center justify-center text-center min-h-[500px]">
        <p className="text-purple-200">
          Click on any link button above to preview the website here
        </p>
      </div>
    );
  }

  // Ensure URL has the proper format
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  return (
    <div className="glass-card bg-white/5 dark:bg-black/15 p-2 flex flex-col h-[500px]">
      <div className="mb-2 px-2 py-1 flex items-center bg-white/10 rounded">
        <div className="text-xs text-purple-200 truncate flex-1">
          {formattedUrl}
        </div>
        <a 
          href={formattedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 text-purple-200 hover:text-white"
        >
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="flex-1 overflow-hidden rounded relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/30 z-10">
            <p className="text-red-300 text-center">{error}</p>
            <a 
              href={formattedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
            >
              Open in new tab
            </a>
          </div>
        )}
        
        <iframe 
          src={formattedUrl} 
          title="Web Preview" 
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

export default WebPreview;
