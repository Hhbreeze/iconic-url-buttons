
import React, { useState } from "react";
import { QuickLink } from "@/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, Link as LinkIcon, ExternalLink, Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickLinkButtonProps {
  link: QuickLink;
  onUpdate: (updatedLink: QuickLink) => void;
}

const QuickLinkButton: React.FC<QuickLinkButtonProps> = ({ link, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [iconPreview, setIconPreview] = useState<string | null>(link.icon);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const handleClick = () => {
    // Only proceed if there's a URL
    if (!link.url) {
      setIsEditing(true);
      return;
    }
    
    // Format URL if needed and open in a new tab
    const formattedUrl = link.url.trim().startsWith('http') 
      ? link.url.trim() 
      : `https://${link.url.trim()}`;
    
    console.log("QuickLinkButton: Opening URL in new tab:", formattedUrl);
    window.open(formattedUrl, '_blank');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    const formattedUrl = url.trim() && !url.match(/^https?:\/\//)
      ? `https://${url}`
      : url;
      
    onUpdate({
      ...link,
      title: title || link.title,
      url: formattedUrl,
      icon: iconPreview,
    });
    
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setIconPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Mobile touch handlers
  const handleTouchStart = () => {
    // Start a timer when the user holds their finger on the button
    if (isMobile) {
      setIsPressed(true);
      const timer = setTimeout(() => {
        setIsEditing(true);
        setIsPressed(false);
      }, 800); // 800ms long press to edit
      setLongPressTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    // Clear the timer if the user lifts their finger before the long press is registered
    if (isMobile && longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      setIsPressed(false);
    }
  };

  const handleTouchMove = () => {
    // Cancel the long press if the user moves their finger
    if (isMobile && longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      setIsPressed(false);
    }
  };

  // Desktop handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const displayIcon = () => {
    if (iconPreview) {
      return (
        <img 
          src={iconPreview} 
          alt={title} 
          className="w-8 h-8 object-contain"
        />
      );
    }
    
    return <LinkIcon className="w-6 h-6 text-white/70" />;
  };

  // Check if the button has a URL
  const hasUrl = !!link.url;

  return (
    <>
      <button
        className={cn(
          "link-button",
          "bg-blueish-gray", 
          isHovered && "ring-2 ring-white/70 scale-105",
          isPressed && "scale-95",
          "relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-200",
          !hasUrl && "border-2 border-solid border-white/30", 
          "text-white font-medium shadow-[0_0_0_1.5px_rgba(64,62,67,0.8)]", 
          "h-[70px] w-[70px]"
        )}
        onClick={isMobile ? undefined : handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => {
          handleTouchEnd();
          // Only trigger click if we don't have a long press going
          if (!longPressTimer && hasUrl) handleClick();
        }}
        onTouchMove={handleTouchMove}
        onContextMenu={handleEdit}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
        <div className="flex flex-col items-center justify-center gap-1 z-10 p-1">
          {displayIcon()}
          {title && (
            <span className="text-xs font-medium tracking-wide truncate max-w-full text-white drop-shadow-md">
              {title}
            </span>
          )}
          {hasUrl && (
            <div className="absolute bottom-1 right-1 opacity-80">
              <ExternalLink className="w-3 h-3 text-white" />
            </div>
          )}
          {isMobile && (
            <div className="absolute top-1 right-1 opacity-70">
              <Pencil className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="glass-card bg-white/95 dark:bg-black/80 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Edit Quick Link</DialogTitle>
            <DialogDescription>
              Configure your quick access link
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Button Label</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter button label"
                className="bg-white/30 backdrop-blur-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-white/30 backdrop-blur-sm"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label>Icon</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-md bg-secondary border">
                  {iconPreview ? (
                    <img 
                      src={iconPreview} 
                      alt="Icon Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <LinkIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <Label
                    htmlFor="icon-upload"
                    className="flex items-center justify-center w-full py-2 px-4 bg-secondary border rounded-md cursor-pointer hover:bg-secondary/80 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Icon
                  </Label>
                  <input
                    id="icon-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickLinkButton;
