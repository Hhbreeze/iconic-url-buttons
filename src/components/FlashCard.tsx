
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Rotate3D } from "lucide-react";

interface FlashCardProps {
  front: string;
  back: string;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
}

const FlashCard = ({
  front,
  back,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-64 mb-4 perspective-1000">
        <div
          className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div
            className={`absolute w-full h-full bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20 cursor-pointer flex items-center justify-center transform-style-preserve-3d backface-hidden ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="text-white text-xl font-medium">{front}</div>
            <div className="absolute top-2 right-2 text-white/60 text-sm">
              Click to flip
            </div>
          </div>

          {/* Back of card */}
          <div
            className={`absolute w-full h-full bg-indigo-900/20 dark:bg-indigo-800/20 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20 cursor-pointer flex items-center justify-center transform-style-preserve-3d backface-hidden rotate-y-180 ${
              isFlipped ? "" : "rotate-y-180"
            }`}
          >
            <div className="text-white text-xl">{back}</div>
            <div className="absolute top-2 right-2 text-white/60 text-sm">
              Click to flip
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full mt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="text-white border-white/20 bg-white/5 hover:bg-white/10"
        >
          Previous
        </Button>
        <div className="text-white text-sm">
          {currentIndex + 1} of {totalCards}
        </div>
        <Button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={handleFlip}
        className="mt-2 text-white opacity-70 hover:opacity-100"
      >
        <Rotate3D className="w-4 h-4 mr-1" />
        Flip Card
      </Button>
    </div>
  );
};

export default FlashCard;
