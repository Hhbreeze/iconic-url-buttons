
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FlashCard from "./FlashCard";
import { toast } from "sonner";

interface FlashCardTrainingProps {
  notesText: string;
  open: boolean;
  onClose: () => void;
}

interface CardData {
  front: string;
  back: string;
}

const FlashCardTraining = ({ notesText, open, onClose }: FlashCardTrainingProps) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && notesText) {
      generateFlashCards(notesText);
    }
  }, [open, notesText]);

  const generateFlashCards = (text: string) => {
    setLoading(true);

    // Split the text by paragraphs or double line breaks
    const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/);
    
    // Filter out empty paragraphs and create cards
    const generatedCards: CardData[] = [];
    
    paragraphs.forEach((paragraph, index) => {
      const trimmedPara = paragraph.trim();
      if (trimmedPara) {
        // Try to split by ":" or "-" to get question/answer pairs
        const splitIndex = Math.max(
          trimmedPara.indexOf(":"),
          trimmedPara.indexOf(" - ")
        );
        
        if (splitIndex > 0) {
          // We have a natural split point
          const front = trimmedPara.substring(0, splitIndex).trim();
          const back = trimmedPara.substring(splitIndex + 1).trim();
          
          if (front && back) {
            generatedCards.push({ front, back });
          }
        } else if (trimmedPara.length > 10 && index < paragraphs.length - 1) {
          // Use this paragraph as front and next as back if both exist
          const nextPara = paragraphs[index + 1]?.trim();
          if (nextPara && nextPara.length > 0) {
            generatedCards.push({
              front: trimmedPara,
              back: nextPara
            });
          }
        }
      }
    });
    
    if (generatedCards.length === 0) {
      // If no cards were created with the above methods, create simple cards by sentence
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      for (let i = 0; i < sentences.length - 1; i += 2) {
        if (sentences[i] && sentences[i+1]) {
          generatedCards.push({
            front: sentences[i].trim(),
            back: sentences[i+1].trim()
          });
        }
      }
    }
    
    setCards(generatedCards);
    setCurrentIndex(0);
    setLoading(false);
    
    if (generatedCards.length === 0) {
      toast.error("Couldn't generate flash cards. Try adding more structured content to your notes.");
    } else {
      toast.success(`Created ${generatedCards.length} flash cards!`);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentIndex(0);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800/90 text-white border-slate-700 max-w-xl backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Flash Card Training</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 absolute right-4 top-4 text-white"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-lg">Generating flash cards...</div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center p-8">
            <p className="mb-4">No flash cards could be generated from your notes.</p>
            <p className="text-sm text-slate-300">
              Try adding more structured content to your notes, like question-answer pairs
              separated by colons or dashes.
            </p>
          </div>
        ) : (
          <FlashCard
            front={cards[currentIndex].front}
            back={cards[currentIndex].back}
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentIndex={currentIndex}
            totalCards={cards.length}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardTraining;
