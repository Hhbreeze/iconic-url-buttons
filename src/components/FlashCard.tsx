
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Rotate3D, Smile, Frown } from "lucide-react";

interface FlashCardProps {
  front: string;
  back: string;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  type: "multiplechoice" | "truefalse" | "fillinblank";
  options?: string[]; // For multiple choice
}

const FlashCard = ({
  front,
  back,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  type,
  options = [],
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const checkAnswer = () => {
    if (type === "truefalse") {
      // Convert to lowercase and trim for comparison
      setIsCorrect(userAnswer.toLowerCase().trim() === back.toLowerCase().trim());
      setMatchPercentage(userAnswer.toLowerCase().trim() === back.toLowerCase().trim() ? 100 : 0);
    } else if (type === "multiplechoice") {
      setIsCorrect(userAnswer.toLowerCase().trim() === back.toLowerCase().trim());
      setMatchPercentage(userAnswer.toLowerCase().trim() === back.toLowerCase().trim() ? 100 : 0);
    } else {
      // For fill in the blank, implement a more flexible matching algorithm
      const correctAnswer = back.toLowerCase().trim();
      const userAnswerText = userAnswer.toLowerCase().trim();
      
      // Extract significant words from the correct answer (words longer than 3 characters)
      const significantWords = correctAnswer.split(/\s+/)
        .filter(word => word.length > 3)
        .map(word => word.replace(/[.,;:!?"'()]/g, '')); // Strip punctuation
      
      if (significantWords.length === 0) {
        // If no significant words, fall back to direct comparison
        setIsCorrect(userAnswerText === correctAnswer);
        setMatchPercentage(userAnswerText === correctAnswer ? 100 : 0);
        return;
      }
      
      // Count how many significant words from the correct answer appear in the user's answer
      let matchCount = 0;
      significantWords.forEach(word => {
        if (userAnswerText.includes(word)) {
          matchCount++;
        }
      });
      
      // Calculate match percentage
      const percentage = Math.round((matchCount / significantWords.length) * 100);
      setMatchPercentage(percentage);
      
      // Consider the answer correct if it meets the threshold (30% match)
      setIsCorrect(percentage >= 30);
    }
    
    setShowResult(true);
  };

  const resetCard = () => {
    setUserAnswer("");
    setShowResult(false);
    setIsFlipped(false);
    setMatchPercentage(0);
  };

  const handleNextCard = () => {
    resetCard();
    onNext();
  };

  const renderAnswerInput = () => {
    if (type === "truefalse") {
      return (
        <div className="flex gap-2 justify-center mt-4">
          <Button 
            variant={userAnswer === "true" ? "default" : "outline"} 
            onClick={() => setUserAnswer("true")}
            className="text-white border-white/20 bg-white/5 hover:bg-white/10"
          >
            True
          </Button>
          <Button 
            variant={userAnswer === "false" ? "default" : "outline"} 
            onClick={() => setUserAnswer("false")}
            className="text-white border-white/20 bg-white/5 hover:bg-white/10"
          >
            False
          </Button>
        </div>
      );
    } else if (type === "multiplechoice" && options.length > 0) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          {options.map((option, idx) => (
            <Button
              key={idx}
              variant={userAnswer === option ? "default" : "outline"}
              onClick={() => setUserAnswer(option)}
              className="text-white border-white/20 bg-white/5 hover:bg-white/10 text-left justify-start"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    } else {
      return (
        <div className="mt-4 w-full">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="bg-white/5 text-white border-white/20"
          />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-64 mb-4 perspective-1000">
        <div
          className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={showResult ? handleFlip : undefined}
        >
          {/* Front of card */}
          <div
            className={`absolute w-full h-full bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20 flex flex-col items-center justify-center transform-style-preserve-3d backface-hidden ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="text-white text-xl font-medium mb-4">{front}</div>
            
            {!showResult && renderAnswerInput()}
            
            {!showResult && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  checkAnswer();
                }}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!userAnswer}
              >
                Check Answer
              </Button>
            )}
            
            {showResult && (
              <div className="mt-4 flex flex-col items-center">
                {isCorrect ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-green-400">
                      <Smile className="w-8 h-8 mr-2" />
                      <span className="text-lg">Correct!</span>
                    </div>
                    {type === "fillinblank" && matchPercentage < 100 && (
                      <div className="text-sm text-green-300 mt-1">
                        Match: {matchPercentage}% - Close enough!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-red-400">
                    <Frown className="w-8 h-8 mr-2" />
                    <span className="text-lg">Try again</span>
                  </div>
                )}
                
                {!isCorrect && (
                  <div className="mt-2 text-sm text-white/70">
                    Click to see the answer
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetCard();
                  }}
                  className="mt-4 text-white border-white/20 bg-white/5 hover:bg-white/10"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {/* Back of card */}
          <div
            className={`absolute w-full h-full bg-indigo-900/20 dark:bg-indigo-800/20 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20 flex items-center justify-center transform-style-preserve-3d backface-hidden rotate-y-180 ${
              isFlipped ? "" : "rotate-y-180"
            }`}
          >
            <div className="text-white text-xl">{back}</div>
            <div className="absolute top-2 right-2 text-white/60 text-sm">
              Click to flip back
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
          onClick={handleNextCard}
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
