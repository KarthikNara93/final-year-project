
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle, Camera, ZoomIn } from 'lucide-react';
import { recognitionService, RecognitionResult } from '../services/recognitionService';
import ResultDisplay from './ResultDisplay';
import { useToast } from "@/hooks/use-toast";

const RecognitionView = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCameraLoaded, setIsCameraLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<RecognitionResult | null>(null);
  const [recentResults, setRecentResults] = useState<RecognitionResult[]>([]);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Initialize camera and recognition service
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        if (!videoRef.current) return;
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });
        
        videoRef.current.srcObject = stream;
        setIsCameraLoaded(true);
        
        // Initialize recognition service after camera is loaded
        videoRef.current.onloadedmetadata = async () => {
          if (videoRef.current && canvasRef.current) {
            try {
              console.log("Initializing recognition service...");
              const initialized = await recognitionService.initialize(
                videoRef.current, 
                canvasRef.current
              );
              
              setIsInitialized(initialized);
              
              // Check if using mock data
              const mockMode = recognitionService.isUsingMockData();
              setUsingMockData(mockMode);
              
              // Get model load error if any
              const modelLoadError = recognitionService.getModelLoadError();
              setModelError(modelLoadError);
              
              if (mockMode) {
                console.log("Using mock data. Model error:", modelLoadError);
                toast({
                  title: "Model Not Loaded",
                  description: "Using mock data for demonstration. Check console for details.",
                  variant: "default"
                });
              } else {
                toast({
                  title: "Model Loaded Successfully",
                  description: "Sign language recognition model is ready to use.",
                  variant: "default"
                });
              }
            } catch (err) {
              console.error("Error initializing recognition service:", err);
              setError("Failed to initialize the recognition system. Using mock data instead.");
              setUsingMockData(true);
            }
          }
        };
      } catch (err) {
        setError('Unable to access camera. Please ensure you have granted camera permissions.');
        console.error('Camera access error:', err);
      }
    };
    
    initializeCamera();
    
    // Cleanup on unmount
    return () => {
      recognitionService.stop();
      
      // Stop and release camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);
  
  // Handle recognition results
  const handleRecognitionResult = (result: RecognitionResult) => {
    setLatestResult(result);
    
    // Add to recent results and keep only the last 5
    setRecentResults(prev => {
      const updated = [result, ...prev].slice(0, 5);
      return updated;
    });
    
    // Speak the recognized gesture
    recognitionService.speakText(result.gesture);
  };
  
  // Toggle recognition
  const toggleRecognition = async () => {
    if (!isInitialized) return;
    
    if (isRunning) {
      recognitionService.stop();
      setIsRunning(false);
    } else {
      await recognitionService.start(handleRecognitionResult);
      setIsRunning(true);
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera view */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden relative">
            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10 p-6">
                <div className="flex flex-col items-center text-center">
                  <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {!isCameraLoaded && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
                <div className="flex flex-col items-center">
                  <Camera className="h-8 w-8 text-primary animate-pulse-subtle mb-4" />
                  <p className="text-muted-foreground">Loading camera...</p>
                </div>
              </div>
            )}
            
            {/* Mock data indicator */}
            {usingMockData && isInitialized && isCameraLoaded && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm z-10 flex flex-col items-end">
                <div className="font-bold">Mock Mode</div>
                {modelError && (
                  <button 
                    onClick={() => {
                      console.log("Model error details:", modelError);
                      toast({
                        title: "Model Error Details",
                        description: modelError.substring(0, 255) + (modelError.length > 255 ? "..." : ""),
                        variant: "default"
                      });
                    }} 
                    className="text-xs underline mt-1"
                  >
                    View Error Details
                  </button>
                )}
              </div>
            )}
            
            {/* Video element */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Canvas overlay for visualizations */}
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
              
              {/* Status indicator */}
              <div className={`absolute bottom-4 right-4 rounded-full p-1 ${
                isRunning 
                  ? 'bg-primary text-white recognition-active' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  {isRunning ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {isRunning ? 'Recognition Active' : 'Recognition Paused'}
              </h3>
              
              <button
                onClick={toggleRecognition}
                disabled={!isInitialized}
                className={`btn-primary flex items-center ${
                  !isInitialized ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Model setup instructions */}
          {usingMockData && (
            <div className="mt-4 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Using Mock Data - Model Not Loaded</h3>
              <p className="text-sm mb-2">To use your own model:</p>
              <ol className="text-sm list-decimal pl-5 space-y-1">
                <li>Convert your .h5 model to TensorFlow.js format using the converter script: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">tensorflowjs_converter</code></li>
                <li>Place the converted <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">model.json</code> and weight files in <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">public/models/</code> folder</li>
                <li>Update the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">gestureClasses</code> array in <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">recognitionService.ts</code> to match your model's classes</li>
                <li>Adjust the preprocessing steps if needed</li>
              </ol>
            </div>
          )}
        </div>
        
        {/* Results panel */}
        <div className="lg:col-span-1">
          <ResultDisplay 
            latestResult={latestResult}
            recentResults={recentResults}
          />
        </div>
      </div>
    </div>
  );
};

export default RecognitionView;