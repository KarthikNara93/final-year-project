
import { ArrowRight, Mic, Type, Hand } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
      
      {/* Hero content */}
      <div className="container mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pb-32 lg:flex lg:items-center">
        <div className="lg:w-1/2 lg:pr-12">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
              Real-time Sign Language Recognition
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Bridging <span className="text-gradient">Communication</span> Barriers
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Our advanced AI technology recognizes sign language gestures in real-time, 
            translating them into text and speech to enable seamless communication.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/recognition" 
              className="btn-primary group text-base py-3 px-6 rounded-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              to="/"
              className="btn-secondary text-base py-3 px-6 rounded-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="mt-16 lg:mt-0 lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="relative">
            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard 
                icon={<Hand className="h-5 w-5 text-primary" />} 
                title="Gesture Recognition"
                description="Real-time detection of sign language gestures using advanced computer vision"
                delay={0.6}
              />
              
              <FeatureCard 
                icon={<Type className="h-5 w-5 text-primary" />} 
                title="Text Translation"
                description="Instant conversion of recognized gestures into readable text"
                delay={0.7}
              />
              
              <FeatureCard 
                icon={<Mic className="h-5 w-5 text-primary" />} 
                title="Speech Output"
                description="Natural speech synthesis for spoken communication"
                delay={0.8}
              />
              
              <div className="glass-card p-6 flex flex-col h-full animate-fade-in animate-float" style={{ animationDelay: '0.9s' }}>
                <div className="text-4xl font-bold">99%</div>
                <div className="mt-2 text-muted-foreground">Recognition accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div 
    className="glass-card p-6 flex flex-col h-full animate-fade-in" 
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Hero;
