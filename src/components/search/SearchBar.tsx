import { useState, useRef, useEffect } from 'react';
import { Search, X, Pill, DollarSign, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import autoSuggestions from '@/data/autoS.json';
import { API_URL, API_CONFIG } from '@/config/api';

interface MedicationsData {
  medications: Array<{
    id: number;
    name: string;
    price: number;
    Is_discontinued: boolean;
    manufacturer_name: string;
    pack_size_label: string;
    short_composition1: string;
    short_composition2: string;
    medicine_desc: string;
    side_effects: string;
    side_effect_factor: number;
  }>;
}

const medicationsData = autoSuggestions as unknown as MedicationsData;

interface Medication {
  id: number;
  name: string;
  price: number;
  Is_discontinued: boolean;
  manufacturer_name: string;
  pack_size_label: string;
  short_composition1: string;
  short_composition2: string;
  medicine_desc: string;
  side_effects: string;
  side_effect_factor: number;
}

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  onSelectMedication?: (medication: Medication) => void;
}

const SearchBar = ({ className, onSearch, onSelectMedication }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      const filteredResults = medicationsData.medications.filter(med => 
        med.name.toLowerCase().startsWith(searchTerm)
      ).slice(0, 5); // Limit to 5 results for better performance
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch && query) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleSelectMedication = async (medication: Medication) => {
    try {
      setIsLoading(true);
      console.log('Fetching from:', `${API_URL}api/search?name=${encodeURIComponent(medication.name)}`);
      const response = await fetch(
        `${API_URL}api/search?name=${encodeURIComponent(medication.name)}`,
        API_CONFIG
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch medication details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received medication data:', data);
      
      if (!data.original_medicine) {
        console.error('Invalid data structure: missing original_medicine', data);
        throw new Error('Invalid response format from API');
      }
      
      // Navigate to the medication detail page with the fetched data
      navigate(`/medication/${encodeURIComponent(medication.name)}`, {
        state: { medicationData: data }
      });
      
      setQuery(medication.name);
      setIsFocused(false);
      
      if (onSelectMedication) {
        onSelectMedication(medication);
      }
    } catch (error) {
      console.error('Error fetching medication details:', error);
      // If API fails, still navigate but without pre-loaded data
      navigate(`/medication/${encodeURIComponent(medication.name)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityIcon = (isDiscontinued: boolean) => {
    if (isDiscontinued) {
      return (
        <div className="flex items-center">
          <AlertCircle className="h-3.5 w-3.5 text-destructive mr-1" />
          <span className="text-destructive px-2 py-0.5 rounded-full text-xs bg-destructive/10">Discontinued</span>
        </div>
      );
    }
    return (
      <div className="flex items-center">
        <CheckCircle className="h-3.5 w-3.5 text-green-500 dark:text-green-400 mr-1" />
        <span className="text-green-500 dark:text-green-400 px-2 py-0.5 rounded-full text-xs bg-green-500/10">Available</span>
      </div>
    );
  };

  return (
    <div className={cn("relative w-full max-w-3xl mx-auto", className)}>
      <div 
        className={cn(
          "flex items-center w-full overflow-hidden rounded-full border transition-all duration-300",
          isFocused 
            ? "border-primary/50 shadow-lg bg-background" 
            : "border-border shadow-md hover:shadow-lg focus-within:border-primary/50"
        )}
      >
        <div className="flex-shrink-0 pl-4">
          <Search className={cn(
            "h-5 w-5 transition-colors", 
            isFocused ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for medications..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="w-full py-5 px-3 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none font-sans"
          disabled={isLoading}
        />
        {query && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 pr-2 text-muted-foreground/70 hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className={cn(
            "flex-shrink-0 h-12 w-12 mr-[6px] rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90 hover:shadow-xl"
          )}
          disabled={isLoading}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div 
            ref={resultsRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full rounded-xl bg-card shadow-xl border border-border overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((medication) => (
                <motion.div
                  key={medication.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors flex items-center",
                    isLoading && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => handleSelectMedication(medication)}
                >
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground font-sans">{medication.name}</div>
                      {getAvailabilityIcon(medication.Is_discontinued)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 font-sans">
                      <span className="flex items-center">
                        <IndianRupee className="h-3.5 w-3.5 mr-1" />
                        {medication.price.toFixed(2)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{medication.manufacturer_name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
