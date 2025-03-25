
import React, { useState } from "react";
import { QuickLink } from "@/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, Link as LinkIcon, ExternalLink } from "lucide-react";

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!link.url) {
      setIsEditing(true);
      return;
    }
    
    // Format URL if needed
    let formattedUrl = link.url;
    if (formattedUrl && !formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // Open the URL in a new tab
    if (formattedUrl) {
      window.open(formattedUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
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
          className="w-10 h-10 object-contain"
        />
      );
    }
    
    return <LinkIcon className="w-8 h-8 text-white/70" />;
  };

  // Check if the button has a URL
  const hasUrl = !!link.url;

  return (
    <>
      <button
        className={cn(
          "link-button",
          `bg-gradient-to-br ${link.gradientFrom} ${link.gradientTo}`,
          isHovered && "ring-2 ring-white/70 scale-105",
          isPressed && "scale-95",
          "relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-200",
          !hasUrl && "border-2 border-dashed border-white/30",
          "text-white font-medium border border-blueish-gray" // Added blueish-gray border
        )}
        onClick={handleClick}
        onContextMenu={handleEdit}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleEdit}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
        <div className="flex flex-col items-center justify-center gap-2 z-10 p-3">
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
        </div>
      </button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="glass-card bg-white/95 dark:bg-black/80 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Edit Quick Link</DialogTitle>
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
