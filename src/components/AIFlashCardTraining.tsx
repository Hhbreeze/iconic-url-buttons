
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import FlashCard from "./FlashCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface AIFlashCardTrainingProps {
  notesText: string;
  open: boolean;
  onClose: () => void;
}

interface CardData {
  front: string;
  back: string;
  type: "multiplechoice" | "truefalse" | "fillinblank";
  options?: string[];
}

const AIFlashCardTraining = ({ notesText, open, onClose }: AIFlashCardTrainingProps) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cardCount, setCardCount] = useState(5);
  const [apiKey, setApiKey] = useState<string>(() => {
    const saved = localStorage.getItem("openai_api_key");
    return saved || "";
  });
  const [apiKeyEntered, setApiKeyEntered] = useState<boolean>(() => {
    return !!localStorage.getItem("openai_api_key");
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (open && notesText && apiKeyEntered) {
      generateFlashCards();
    }
  }, [open, notesText, apiKeyEntered, cardCount]);

  const handleApiKeySubmit = () => {
    if (!apiKey) {
      toast.error("Please enter an API key");
      return;
    }
    
    localStorage.setItem("openai_api_key", apiKey);
    setApiKeyEntered(true);
    generateFlashCards();
  };

  const generateFlashCards = async () => {
    if (!notesText || notesText.trim().length === 0) {
      toast.error("Please add some notes before generating flash cards");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Generate ${cardCount} flash cards from the following notes. 
              Each flash card should have a question (front) and answer (back).
              Also specify a type for each card: either "multiplechoice" (with 4 options including the correct one), 
              "truefalse", or "fillinblank". Return the data as a JSON array of objects, each with 
              "front", "back", "type", and optionally "options" properties.`
            },
            {
              role: "user",
              content: notesText
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error connecting to OpenAI");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsedCards = JSON.parse(jsonMatch[0]);
          setCards(parsedCards);
          setCurrentIndex(0);
          toast.success(`Created ${parsedCards.length} AI-generated flash cards!`);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          toast.error("Error parsing the response from OpenAI. Please try again.");
        }
      } else {
        toast.error("Could not extract valid flash card data from the response");
      }
    } catch (error) {
      console.error("Error generating flash cards:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
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

  const handleCardCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (!isNaN(count) && count > 0) {
      setCardCount(count);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800/90 text-white border-slate-700 max-w-xl backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-400" />
            AI-Generated Flash Cards
          </DialogTitle>
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
        
        {!apiKeyEntered ? (
          <div className="space-y-4">
            <p className="text-white/80">
              To generate AI flash cards, please enter your OpenAI API key. 
              Your key will be stored locally in your browser.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-white/5 text-white border-white/20"
              />
              <Button 
                onClick={handleApiKeySubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Connect to ChatGPT
              </Button>
            </div>
            <p className="text-xs text-white/60">
              You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">https://platform.openai.com/api-keys</a>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-sm text-white/70 mb-1 block">
                Number of flash cards:
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={cardCount}
                  onChange={handleCardCountChange}
                  min="1"
                  max="20"
                  className="bg-white/5 text-white border-white/20 w-20"
                />
                <Button 
                  onClick={generateFlashCards}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-lg">Generating AI flash cards...</div>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center p-8">
                <p className="mb-4">No flash cards could be generated from your notes.</p>
                <p className="text-sm text-slate-300">
                  Try adding more content to your notes for better results.
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
                type={cards[currentIndex].type}
                options={cards[currentIndex].options}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIFlashCardTraining;
