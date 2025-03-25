
import React, { useState, useEffect } from "react";
import QuickLinkButton from "@/components/QuickLinkButton";
import NotesPanel from "@/components/NotesPanel";
import { QuickLink } from "@/types";
import { loadLinks, updateLink } from "@/lib/storage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react"; // Using FileDown instead of FilePdf which doesn't exist

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

  const handleSaveToPdf = async () => {
    try {
      // Use the browser's print functionality to save as PDF
      window.print();
      toast.success("Page ready for PDF conversion. Select 'Save as PDF' in the print dialog.");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading your quick links...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-purple-900 dark:from-slate-900 dark:to-purple-950 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
            Quick Links
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Access your favorite websites with a single click. Right-click any button to edit.
          </p>
        </header>

        <div className="flex items-center justify-center mb-4">
          <Button
            onClick={handleSaveToPdf}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <FileDown className="mr-2" />
            Save as PDF
          </Button>
        </div>

        <div className="flex gap-6 flex-col md:flex-row">
          <div className="md:flex-1">
            {/* Quick Links Section */}
            <div className="glass-card p-4 bg-white/15 dark:bg-black/25 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl">
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
          </div>
          
          {/* Notes Panel */}
          <div className="md:w-1/3">
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
