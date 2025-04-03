
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
  title?: string;
}

const ErrorMessage = ({ error, title = "Camera Error" }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10 p-6">
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
