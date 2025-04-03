
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold tracking-tight">
                Gesture<span className="text-primary font-bold">Speak</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <NavLink to="/" active={location.pathname === "/"}>
                Home
              </NavLink>
              <NavLink to="/recognition" active={location.pathname === "/recognition"}>
                Recognition
              </NavLink>
              <Link 
                to="/recognition" 
                className="btn-primary"
              >
                Try Now
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary transition duration-150 ease-in-out"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 dark:bg-black/90 backdrop-blur-md">
          <MobileNavLink to="/" active={location.pathname === "/"}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/recognition" active={location.pathname === "/recognition"}>
            Recognition
          </MobileNavLink>
          <Link 
            to="/recognition" 
            className="block px-3 py-2 rounded-md text-base font-medium text-center btn-primary w-full mt-4"
          >
            Try Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

type NavLinkProps = {
  to: string;
  active: boolean;
  children: React.ReactNode;
};

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`relative px-1 py-2 text-sm font-medium transition-colors ${
      active ? 'text-primary' : 'text-foreground hover:text-primary'
    } after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 ${
      active ? 'after:scale-x-100' : 'hover:after:scale-x-100 hover:after:origin-bottom-left'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      active 
        ? 'bg-primary/10 text-primary' 
        : 'text-foreground hover:bg-primary/5 hover:text-primary'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
