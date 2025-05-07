import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Home, Info, Search, Pill, Stethoscope, UserRound, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/auth/AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isDoctor, doctorDetails, signOut } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/medications', label: 'Medications', icon: <Pill className="h-4 w-4" /> },
    { href: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
  ];

  const handleGetStarted = () => {
    navigate('/medications');
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Optionally redirect or show a message
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <Pill className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">YourWisePharma</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
            <div className="flex space-x-1">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
                    "hover:bg-primary/10",
                    location.pathname === href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {icon}
                  <span className="ml-2">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Theme Toggle and Get Started */}
          <div className="flex-shrink-0 hidden md:flex items-center gap-4">
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <ThemeToggle />
            {!user ? (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setIsAuthDialogOpen(true)}
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden sm:inline">Doctor Login</span>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-primary"
                  >
                    <UserRound className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {isDoctor ? 'Dr.' : ''} {doctorDetails?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {doctorDetails?.name || user.email}
                    {isDoctor && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {doctorDetails?.specialty}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-primary/10 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-64" : "max-h-0 invisible"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background/80 backdrop-blur-sm border-b">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                "hover:bg-primary/10",
                location.pathname === href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {icon}
              <span className="ml-2">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Authentication Dialog */}
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </nav>
  );
};
