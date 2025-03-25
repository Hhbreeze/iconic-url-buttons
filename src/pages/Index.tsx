
import React, { useState, useEffect } from "react";
import QuickLinkButton from "@/components/QuickLinkButton";
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
        <div className="animate-pulse text-lg">Loading your quick links...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-800 dark:from-slate-900 dark:to-blue-950 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Quick Links
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Access your favorite websites with a single click. Right-click any button to edit.
          </p>
        </header>

        <div className="glass-card p-8 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {links.map((link) => (
              <QuickLinkButton
                key={link.id}
                link={link}
                onUpdate={handleUpdateLink}
              />
            ))}
          </div>
        </div>

        <footer className="text-center text-sm text-blue-200 mt-8">
          <p>
            Tip: Right-click any button to edit
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
