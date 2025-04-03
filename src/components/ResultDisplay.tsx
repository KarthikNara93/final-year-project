
import { useEffect, useRef } from 'react';
import { Volume2, Clock, PieChart } from 'lucide-react';
import { RecognitionResult } from '../services/recognitionService';

interface ResultDisplayProps {
  latestResult: RecognitionResult | null;
  recentResults: RecognitionResult[];
}

const ResultDisplay = ({ latestResult, recentResults }: ResultDisplayProps) => {
  const latestResultRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the latest result when it updates
  useEffect(() => {
    if (latestResult && latestResultRef.current) {
      latestResultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [latestResult]);
  
  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className="glass-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">Recognition Results</h3>
      </div>
      
      {/* Latest result */}
      <div className="p-4 bg-primary/5 flex-grow">
        <div className="text-sm font-medium text-muted-foreground mb-2">Current Recognition</div>
        
        {latestResult ? (
          <div className="animate-scale-in" ref={latestResultRef}>
            <div className="text-3xl font-bold mb-2">
              {latestResult.gesture}
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <PieChart className="h-3.5 w-3.5 mr-1.5" />
                <span>{Math.round(latestResult.confidence * 100)}% confidence</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>{formatTime(latestResult.timestamp)}</span>
              </div>
            </div>
            
            <button 
              className="mt-3 w-full btn-secondary py-1 flex items-center justify-center"
              onClick={() => {
                if (latestResult) {
                  const utterance = new SpeechSynthesisUtterance(latestResult.gesture);
                  window.speechSynthesis.speak(utterance);
                }
              }}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Speak Again
            </button>
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-4">
            No gestures recognized yet. Start the recognition to begin.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
