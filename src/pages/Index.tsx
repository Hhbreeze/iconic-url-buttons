
import React, { useState, useEffect } from "react";
import QuickLinkButton from "@/components/QuickLinkButton";
import NotesPanel from "@/components/NotesPanel";
import { QuickLink } from "@/types";
import { loadLinks, updateLink } from "@/lib/storage";
import { toast } from "sonner";

const Index = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const quickLinks = loadLinks();
    setLinks(quickLinks);
    setLoaded(true);
  }, []);

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
            Access your favorite websites with a single click. Right-click any button to edit.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {/* Quick Links Section - Tight frame */}
          <div className="glass-card py-1 px-0.5 bg-white/15 dark:bg-black/25 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl inline-block mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-1">
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

        <footer className="text-center text-sm text-purple-200 mt-6">
          <p>
            Tip: Right-click any button to edit
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
