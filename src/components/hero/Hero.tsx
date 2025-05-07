import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Layers, Pill, Stethoscope, HeartPulse, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/search/SearchBar';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tagIndex, setTagIndex] = useState(0);
  const navigate = useNavigate();
  
  const tags = ["Find the best medication alternatives", "Compare prices easily", "Check side effects", "Make informed choices"];
  const tagIcons = [<Pill className="h-4 w-4 mr-2" key="pill" />, <IndianRupee className="h-4 w-4 mr-2" key="dollar" />, <Shield className="h-4 w-4 mr-2" key="shield" />, <HeartPulse className="h-4 w-4 mr-2" key="heart" />];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTagIndex(prevIndex => (prevIndex + 1) % tags.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/medications`, {
      state: { searchQuery: query }
    });
  };

  const handleSelectMedication = (medication: any) => {
    navigate(`/medication/${encodeURIComponent(medication.name)}`);
  };

  const handleGetStarted = () => {
    navigate('/medications');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-6 pb-20 pt-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className="text-center mb-12 max-w-4xl mx-auto z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }} 
            className="inline-block bg-primary/10 text-primary rounded-full px-6 py-2.5 text-sm font-medium flex items-center shadow-sm overflow-visible"
          >
            <div className="relative h-5 overflow-visible flex items-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={tagIndex} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.75,
                    ease: "easeInOut",
                    delay: 0.2 
                  }} 
                  className="flex items-center justify-center whitespace-nowrap"
                >
                  {tagIcons[tagIndex]}
                  {tags[tagIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.6 }} 
          className="relative mb-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight font-sans px-4">
            <span className="bg-gradient-to-r from-blue-600 via-primary to-purple-500 text-transparent bg-clip-text inline-block pb-[10px] mb-[8px] animate-glow">
              Alternative Medicine
            </span>
          </h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight font-sans px-6 ">
            <span className="bg-gradient-to-r from-blue-600 via-primary to-purple-500 text-transparent bg-clip-text inline-block my-0 pb-[10px] animate-glow">
              Recommendation System
            </span>
          </h1>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }} 
            className="absolute -top-6 right-[15%] rotate-6"
          >
            <Stethoscope className="text-purple-400 h-8 w-8 animate-pulse" />
            <svg className="absolute -top-1 -right-1 w-24 h-12 text-purple-400 opacity-70 pointer-events-none" viewBox="0 0 100 50">
              <path d="M10,25 Q30,5 50,25 Q70,45 90,25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" />
            </svg>
          </motion.div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.6 }} 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Find affordable alternatives to your medications, compare prices, 
          check side effects, and make informed healthcare decisions.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5, duration: 0.5 }} 
          className="z-10 relative"
        >
          <SearchBar onSearch={handleSearch} onSelectMedication={handleSelectMedication} className="z-10" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.6 }} 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 z-10"
        >
          <Button size="lg" className="rounded-md px-8 flex items-center shadow-md" onClick={handleGetStarted}>
            <Layers className="h-4 w-4 mr-2" />
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="lg" className="rounded-md px-8 flex items-center shadow-sm" onClick={() => navigate('/medications')}>
            <Stethoscope className="h-4 w-4 mr-2" />
            Browse Medications
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.7, duration: 0.6 }} 
        className="mt-8 text-center text-sm text-muted-foreground relative z-0 flex items-center justify-center"
      >
        <IndianRupee className="h-4 w-4 mr-2 text-primary" />
        <p>
          We compare medications from over 500 pharmacies to find you the best options.
        </p>
      </motion.div>
    </div>
  );
};

export default Hero;
