import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Pill } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import Layout from '@/components/layout/Layout';
import MedicationCard from '@/components/medication/MedicationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import medicationsData from '@/data/autoS.json';
import { API_URL, API_CONFIG } from '@/config/api';

interface MedicationsData {
  medications: Array<{
    id: string;
    name: string;
    price: number | string;
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

const normalizedMedications = (medicationsData as unknown as MedicationsData).medications.map(med => ({
  id: Number(med.id),
  name: med.name,
  price: med.price,
  is_discontinued: med.Is_discontinued,
  manufacturer: med.manufacturer_name,
  pack_size_label: med.pack_size_label,
  short_composition1: med.short_composition1,
  short_composition2: med.short_composition2,
  description: med.medicine_desc || '',
  sideEffects: med.side_effects ? med.side_effects.split(',') : [],
  side_effect_factor: med.side_effect_factor,
  riskLevel: (med.side_effect_factor < 1.5 ? "low" : med.side_effect_factor < 3 ? "medium" : "high") as "low" | "medium" | "high",
  searchName: med.name.toLowerCase()
}));

const Medications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);
  
  const handleMedicationClick = async (medication: typeof normalizedMedications[0]) => {
    try {
      console.log('Clicking medication:', medication.name);
      const url = `${API_URL}/api/search?name=${encodeURIComponent(medication.name)}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received medication data:', data);
      
      if (!data.original_medicine) {
        console.error('Invalid data structure: missing original_medicine', data);
        throw new Error('Invalid response format from API');
      }
      
      
      navigate(`/medication/${encodeURIComponent(medication.name)}`, {
        state: { medicationData: data }
      });
    } catch (error) {
      console.error('Error in handleMedicationClick:', error);
      
      navigate(`/medication/${encodeURIComponent(medication.name)}`);
    }
  };

  
  const displayedMedications = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    return query.length >= 4
      ? normalizedMedications.filter(med => med.searchName.startsWith(query))
      : normalizedMedications.slice(0, 12);
  }, [debouncedSearch]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pt-32 pb-20 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Browse Medications
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {searchQuery ? 'Search results' : 'Popular medications'}
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full max-w-[40%] items-center ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 h-5 w-5" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search medications (type at least 4 characters)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-background "
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading medication details...</p>
            </div>
          ) : (
            displayedMedications.map((medication) => (
              <div 
                key={medication.id}
                onClick={() => handleMedicationClick(medication)}
                className="cursor-pointer transform transition-transform hover:scale-[1.02] h-fit"
              >
                <MedicationCard medication={medication} />
              </div>
            ))
          )}
        </div>

        {searchQuery.length >= 4 && displayedMedications.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No medications found</h3>
            <p className="text-muted-foreground mb-6">
              Try a different search term or browse all medications.
            </p>
            <Button 
              onClick={() => setSearchQuery('')}
              className="rounded-full"
            >
              View All Medications
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medications;
