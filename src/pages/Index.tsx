
import React, { useState, useEffect } from "react";
import QuickLinkButton from "@/components/QuickLinkButton";
import NotesPanel from "@/components/NotesPanel";
import { QuickLink } from "@/types";
import { loadLinks, updateLink } from "@/lib/storage";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const Index = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const quickLinks = loadLinks();
    setLinks(quickLinks);
    setLoaded(true);

    // Show a mobile-specific toast on first load
    if (isMobile) {
      toast.info(
        "Tip: Long press any button to edit its link",
        { duration: 5000 }
      );
    }
  }, [isMobile]);

  const handleUpdateLink = (updatedLink: QuickLink) => {
    const updatedLinks = updateLink(links, updatedLink);
    setLinks(updatedLinks);
    toast.success("Link updated successfully");
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading your links...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-purple-900 dark:from-slate-900 dark:to-purple-950 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
            TapBoard
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Access your favorite websites with a single click. 
            {isMobile ? " Long press any button to edit." : " Right-click any button to edit."}
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {/* Quick Links Section - Tight frame */}
          <div className="glass-card py-1 px-0.5 bg-white/15 dark:bg-black/25 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl inline-block mx-auto">
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
              {links.map((link) => (
                <QuickLinkButton
                  key={link.id}
                  link={link}
                  onUpdate={handleUpdateLink}
                />
              ))}
            </div>
          </div>
          
          {/* Notes Panel */}
          <div>
            <NotesPanel />
          </div>
        </div>

        <footer className="text-center text-sm text-purple-200 mt-6 flex items-center justify-center">
          {isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <span>Tip: Long press any button to edit</span>
                    <InfoIcon className="w-4 h-4 ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-center">
                    Tap to open the website. Long press (hold) for about 1 second to edit the link.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p>
              Tip: Right-click any button to edit
            </p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Index;
