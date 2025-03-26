
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FlashCard from "./FlashCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface FlashCardTrainingProps {
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

const FlashCardTraining = ({ notesText, open, onClose }: FlashCardTrainingProps) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardCount, setCardCount] = useState(5);

  useEffect(() => {
    if (open && notesText) {
      generateFlashCards(notesText);
    }
  }, [open, notesText, cardCount]);

  const generateFlashCards = (text: string) => {
    setLoading(true);

    // Split the text by paragraphs or double line breaks
    const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length === 0) {
      setCards([]);
      setLoading(false);
      toast.error("No content found to generate flash cards");
      return;
    }
    
    // Generate different types of cards based on content
    const generatedCards: CardData[] = [];
    
    // Extract key terms, facts, and concepts from the text
    const keyTerms = extractKeyTerms(text);
    const facts = extractFacts(text);
    
    // Add fill-in-the-blank cards
    const blankCards = createFillInBlankCards(paragraphs);
    generatedCards.push(...blankCards);
    
    // Add true/false cards
    const tfCards = createTrueFalseCards(facts, text);
    generatedCards.push(...tfCards);
    
    // Add multiple choice cards
    const mcCards = createMultipleChoiceCards(keyTerms, paragraphs);
    generatedCards.push(...mcCards);
    
    // Add direct question-answer pairs
    const qaCards = createQAPairs(paragraphs);
    generatedCards.push(...qaCards);
    
    // Shuffle and limit to the requested number
    const shuffled = shuffleArray(generatedCards);
    const limited = shuffled.slice(0, Math.min(cardCount, shuffled.length));
    
    setCards(limited);
    setCurrentIndex(0);
    setLoading(false);
    
    if (limited.length === 0) {
      toast.error("Couldn't generate flash cards. Try adding more structured content to your notes.");
    } else {
      toast.success(`Created ${limited.length} flash cards!`);
    }
  };
  
  // Helper functions for card generation
  const extractKeyTerms = (text: string): {term: string, definition: string}[] => {
    const terms: {term: string, definition: string}[] = [];
    
    // Look for patterns like "Term: Definition" or "Term - Definition"
    const termPattern = /([A-Z][^:.]{2,30})[:|-]([^.!?]+)/g;
    let match;
    
    while ((match = termPattern.exec(text)) !== null) {
      const term = match[1].trim();
      const definition = match[2].trim();
      if (term && definition) {
        terms.push({ term, definition });
      }
    }
    
    return terms;
  };
  
  const extractFacts = (text: string): string[] => {
    // Split by sentences and filter for statements that look like facts
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
    
    // Filter for sentences that make factual claims
    return sentences.filter(s => 
      !s.includes("?") && 
      (s.includes(" is ") || s.includes(" are ") || s.includes(" was ") || s.includes(" were "))
    );
  };
  
  const createFillInBlankCards = (paragraphs: string[]): CardData[] => {
    const cards: CardData[] = [];
    
    paragraphs.forEach(para => {
      // Split into sentences
      const sentences = para.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 30);
      
      sentences.forEach(sentence => {
        // Find important words to blank out (nouns, names, etc.)
        const words = sentence.split(/\s+/);
        
        if (words.length >= 5) {
          // Try to find a significant word (longer than 4 chars, not at beginning)
          const candidateIndices = words
            .map((word, idx) => ({ word, idx }))
            .filter(({ word, idx }) => 
              word.length > 4 && 
              idx > 0 && 
              !word.match(/^(the|and|but|or|if|in|on|at|to|for|with|by)$/i)
            )
            .map(({ idx }) => idx);
          
          if (candidateIndices.length > 0) {
            // Choose a random significant word to blank out
            const blankIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
            const answer = words[blankIndex];
            const questionWords = [...words];
            questionWords[blankIndex] = "________";
            
            cards.push({
              front: `Fill in the blank: "${questionWords.join(' ')}"`,
              back: answer,
              type: "fillinblank"
            });
          }
        }
      });
    });
    
    return cards;
  };
  
  const createTrueFalseCards = (facts: string[], fullText: string): CardData[] => {
    const cards: CardData[] = [];
    
    facts.forEach(fact => {
      if (fact.length > 20) {
        // 50% chance to create a true statement
        if (Math.random() > 0.5) {
          cards.push({
            front: `True or False: "${fact}"`,
            back: "true",
            type: "truefalse"
          });
        } else {
          // Create a false statement by modifying the fact
          const modifiedFact = modifyFactToFalse(fact, fullText);
          cards.push({
            front: `True or False: "${modifiedFact}"`,
            back: "false",
            type: "truefalse"
          });
        }
      }
    });
    
    return cards;
  };
  
  const modifyFactToFalse = (fact: string, fullText: string): string => {
    // Simple modifications to make facts false
    const words = fact.split(/\s+/);
    
    if (fact.includes(" is ")) {
      return fact.replace(" is ", " is not ");
    } else if (fact.includes(" are ")) {
      return fact.replace(" are ", " are not ");
    } else if (fact.includes(" was ")) {
      return fact.replace(" was ", " was not ");
    } else if (fact.includes(" were ")) {
      return fact.replace(" were ", " were not ");
    } else {
      // Replace a random word with a word not in the original text
      const randomIndex = Math.floor(Math.random() * words.length);
      const alternativeWords = ["never", "always", "rarely", "incorrectly", "falsely", "differently"];
      words[randomIndex] = alternativeWords[Math.floor(Math.random() * alternativeWords.length)];
      return words.join(" ");
    }
  };
  
  const createMultipleChoiceCards = (keyTerms: {term: string, definition: string}[], paragraphs: string[]): CardData[] => {
    const cards: CardData[] = [];
    
    // Create multiple choice from key terms
    keyTerms.forEach(({ term, definition }) => {
      // Get wrong answers (other definitions)
      const wrongAnswers = keyTerms
        .filter(item => item.term !== term)
        .map(item => item.definition)
        .slice(0, 3);
      
      if (wrongAnswers.length >= 2) {
        const options = shuffleArray([definition, ...wrongAnswers.slice(0, 3)]);
        
        cards.push({
          front: `What is ${term}?`,
          back: definition,
          type: "multiplechoice",
          options
        });
      }
    });
    
    // Create multiple choice from sentences
    const sentences = paragraphs.flatMap(p => 
      p.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20)
    );
    
    sentences.forEach((sentence, idx) => {
      if (idx % 3 === 0 && sentence.length > 30) { // Only use some sentences
        const questionMatch = sentence.match(/([^,.:;]+[,.] )([^,.:;]{15,})/);
        
        if (questionMatch) {
          const context = questionMatch[1];
          const answer = questionMatch[2];
          
          // Get wrong answers (other sentence parts)
          const wrongAnswers = sentences
            .filter((s, i) => i !== idx)
            .map(s => {
              const match = s.match(/[^,.:;]{15,}/);
              return match ? match[0] : "";
            })
            .filter(Boolean)
            .slice(0, 3);
          
          if (wrongAnswers.length >= 2) {
            const options = shuffleArray([answer, ...wrongAnswers.slice(0, 3)]);
            
            cards.push({
              front: `What follows: "${context}..."?`,
              back: answer,
              type: "multiplechoice",
              options
            });
          }
        }
      }
    });
    
    return cards;
  };
  
  const createQAPairs = (paragraphs: string[]): CardData[] => {
    const cards: CardData[] = [];
    
    // Extract direct question-answer patterns from text
    paragraphs.forEach(para => {
      // Look for patterns like "Question: Answer" or "Q: A"
      const qaMatch = para.match(/(?:Question|Q):\s*([^?]+\?)\s*(?:Answer|A):\s*([^.?!]+[.?!])/i);
      
      if (qaMatch) {
        const question = qaMatch[1].trim();
        const answer = qaMatch[2].trim();
        
        cards.push({
          front: question,
          back: answer,
          type: "fillinblank"
        });
      }
    });
    
    // Also look for sentences that end with a question mark and the following sentence
    const sentences = paragraphs.flatMap(p => p.split(/[.!?]+/).map(s => s.trim()).filter(Boolean));
    
    for (let i = 0; i < sentences.length - 1; i++) {
      const sentence = sentences[i];
      
      if (sentence.endsWith("?")) {
        cards.push({
          front: sentence,
          back: sentences[i + 1],
          type: "fillinblank"
        });
      }
    }
    
    return cards;
  };
  
  // Utility function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
              onClick={() => generateFlashCards(notesText)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Regenerate
            </Button>
          </div>
        </div>
        
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
            type={cards[currentIndex].type}
            options={cards[currentIndex].options}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardTraining;
