
import { useToast } from "@/hooks/use-toast";

interface ModelStatusProps {
  usingMockData: boolean;
  modelError: string | null;
}

const ModelStatus = ({ usingMockData, modelError }: ModelStatusProps) => {
  const { toast } = useToast();

  if (!usingMockData) return null;

  return (
    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm z-10 flex flex-col items-end">
      <div className="font-bold">Mock Mode</div>
      {modelError && (
        <button 
          onClick={() => {
            console.log("API connection error details:", modelError);
            toast({
              title: "API Connection Error",
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
  );
};

export default ModelStatus;
