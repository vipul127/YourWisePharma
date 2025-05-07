import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, ArrowRight, PlusCircle, Info, PackageX, IndianRupee } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { API_URL, API_CONFIG, handleApiError } from '@/config/api';

interface MedicationDetailProps {
  original_medicine: {
    name: string;
    price: string;
    manufacturer: string;
    pack_size: string;
    compositions: {
      composition1: string | null;
      composition2: string | null;
      salt_composition: string | null;
    };
    description: string | "No Description Available";
    side_effects: string;
    drug_interactions: string;
    side_effect_factor: number;
    is_discontinued: boolean;
  };
  alternative_medicines: Array<{
    name: string;
    price: string;
    manufacturer: string;
    pack_size: string;
    compositions: {
      composition1: string | null;
      composition2: string | null;
      salt_composition: string | null;
    };
    description: string | "No Description Available";
    side_effects: string | "No Side Effects reported";
    drug_interactions: string;
    side_effect_factor: number;
    is_discontinued: boolean;
  }>;
}

const MedicationDetail = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [medicationData, setMedicationData] = useState<MedicationDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicationData = async () => {
      if (!name) {
        console.log('No medication name provided');
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Fetching medication details for:', name);
        const url = `${API_URL}/api/search?name=${encodeURIComponent(name)}`;
        console.log('API URL:', url);
        
        const response = await fetch(url, API_CONFIG);
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API Response:', data);
        
        if (!data.original_medicine) {
          console.error('Invalid data structure: missing original_medicine', data);
          throw new Error('Invalid response format from API');
        }
        
        const formattedData = {
          ...data,
          alternative_medicines: data.alternative_medicines || []
        };
        
        console.log('Setting medication data:', formattedData);
        setMedicationData(formattedData);
      } catch (error) {
        console.error('Error in fetchMedicationData:', error);
        setError(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    if (location.state?.medicationData) {
      const formattedData = {
        ...location.state.medicationData,
        alternative_medicines: location.state.medicationData.alternative_medicines || []
      };
      setMedicationData(formattedData);
      setIsLoading(false);
    } else {
      fetchMedicationData();
    }
  }, [name, location.state]);

  const getUniqueCompositions = (medicine: MedicationDetailProps['original_medicine']) => {
    const compositions = new Set<string>();
    
    if (medicine.compositions.composition1) {
      compositions.add(medicine.compositions.composition1.trim());
    }
    if (medicine.compositions.composition2) {
      compositions.add(medicine.compositions.composition2.trim());
    }
    
    if (medicine.compositions.salt_composition) {
      medicine.compositions.salt_composition.split('+').forEach(salt => {
        compositions.add(salt.trim());
      });
    }
    
    return Array.from(compositions);
  };

  const parseDrugInteractions = (interactions: string) => {
    try {
      const parsed = JSON.parse(interactions);
      return {
        drugs: parsed.drug || [],
        effects: parsed.effect || [],
        brands: parsed.brand || [] 
      };
    } catch (e) {
     
      return {
        drugs: interactions ? [interactions] : [],
        effects: interactions ? ['No specific effect details available'] : [],
        brands: []
      };
    }
  };

  const getAvailabilityBadge = (isDiscontinued: boolean) => {
    if (isDiscontinued) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="destructive" className="flex items-center gap-1.5 px-3 py-1.5">
                <PackageX className="h-4 w-4" />
                <span>Discontinued</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This medication is no longer being manufactured or distributed</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200">
              <CheckCircle className="h-4 w-4" />
              <span>Available</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This medication is currently available in the market</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleCompareNavigation = () => {
    const originalMedicine = location.state?.originalMedicine || medicationData.original_medicine;
    if (!originalMedicine) {
        console.error('No original medicine found');
        return;
    }

    const selectedAlt = location.state?.selectedAlternative;

    const uniqueMedications = new Set();

    const cleanAlternatives = medicationData.alternative_medicines.filter(med => {
        if (med === originalMedicine) return false; 
        if (med === selectedAlt) return false; 
        if (uniqueMedications.has(med.name)) return false;
        uniqueMedications.add(med.name);
        return true;
    });

    const sortedAlternatives = [...cleanAlternatives].sort((a, b) => {
        const priceA = parseFloat(a.price.replace('₹', ''));
        const priceB = parseFloat(b.price.replace('₹', ''));
        return priceA - priceB;
    });

    const bestAlternative = sortedAlternatives[0];

    const alternativesWithBest = sortedAlternatives.map(med => ({
        ...med,
        isBest: med === bestAlternative
    }));

    const finalAlternatives = selectedAlt 
        ? [{ ...selectedAlt, isBest: selectedAlt === bestAlternative }, ...alternativesWithBest.filter(med => med !== selectedAlt && med !== bestAlternative)]
        : [{ ...bestAlternative, isBest: true }, ...alternativesWithBest.filter(med => med !== bestAlternative)];

    navigate('/compare', { 
        state: { 
            medicationData: {
                original_medicine: originalMedicine,
                alternative_medicines: finalAlternatives
            },
            selectedAlternative: selectedAlt || bestAlternative,
            originalMedicine: originalMedicine
        } 
    });
  };

  if (isLoading) {
    console.log('Rendering loading state');
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
          <Button 
            variant="ghost" 
            className="mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Medications
          </Button>
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !medicationData) {
    console.log('Rendering error state:', { error, medicationData });
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
          <Button 
            variant="ghost" 
            className="mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Medications
          </Button>
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Medication</h2>
            <p className="text-muted-foreground mb-6">{error || 'Medication not found'}</p>
            <Button onClick={() => navigate('/medications')}>
              Browse All Medications
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  console.log('Rendering medication details with data:', medicationData);
  const { original_medicine } = medicationData;
  const drugInteractions = parseDrugInteractions(original_medicine.drug_interactions);
  const uniqueCompositions = getUniqueCompositions(original_medicine);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pt-32 pb-20 px-6">
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Medications
        </Button>

        <div className="relative flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Header raha se start hoga */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold text-foreground">{original_medicine.name}</h1>
                {getAvailabilityBadge(original_medicine.is_discontinued)}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{original_medicine.manufacturer}</span>
                <span>•</span>
                <span>{original_medicine.pack_size}</span>
              </div>
            </div>

            {original_medicine.is_discontinued && (
              <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive mb-1">This medication has been discontinued</h4>
                  <p className="text-sm text-muted-foreground">
                    This medication is no longer being manufactured or distributed. Please consult your healthcare provider for alternative options.
                    {medicationData.alternative_medicines.length > 0 && " You can check the alternative medications section below for similar options."}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-card dark:bg-accent/5 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-1 text-foreground">Price Details</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {original_medicine.price}
                    </span>
                    <Badge variant="outline" className="bg-primary/5 dark:bg-primary/10">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      MRP
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    per {original_medicine.pack_size.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>


            <div className="bg-card dark:bg-accent/5 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-foreground">Manufacturer Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Company</label>
                  <p className="font-medium text-foreground">{original_medicine.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Package Size</label>
                  <p className="font-medium text-foreground">{original_medicine.pack_size}</p>
                </div>
              </div>
            </div>

            <div className="bg-card dark:bg-accent/5 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-foreground">Description</h3>
              {original_medicine.description && original_medicine.description !== "No Description Available" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {original_medicine.description}
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>Detailed information about this medication is not available yet. Please consult your healthcare provider or pharmacist for more details.</p>
                </div>
              )}
            </div>

            {uniqueCompositions.length > 0 && (
              <div className="bg-card dark:bg-accent/5 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-foreground">Compositions</h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueCompositions.map((composition, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                    >
                      {composition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            
            <div className="bg-card dark:bg-accent/5 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-foreground">Side Effects</h3>
              {original_medicine.side_effect_factor === -1 ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-5 w-5" />
                  <p>No side effects have been reported for this medication yet.</p>
                </div>
              ) : original_medicine.side_effects ? (
                <div className="flex flex-wrap gap-2">
                  {original_medicine.side_effects.split(',').map((effect, index) => (
                    <span 
                      key={index}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-all duration-200 cursor-default",
                        "bg-destructive/10 dark:bg-destructive/20 text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/30",
                        "hover:shadow-md hover:-translate-y-0.5"
                      )}
                    >
                      {effect.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No side effects information available.</p>
              )}
            </div>

            <div className="bg-card dark:bg-accent/5 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-foreground">Drug Interactions</h3>
              {drugInteractions.drugs.length > 0 ? (
                <div className="space-y-4">
                  {drugInteractions.drugs.map((drug, index) => (
                    <div 
                      key={index}
                      className="bg-muted/30 dark:bg-accent/10 rounded-lg p-4 hover:bg-muted/50 dark:hover:bg-accent/20 transition-colors"
                    >
                      <h4 className="font-medium text-primary mb-2">{drug}</h4>
                      <p className="text-sm text-muted-foreground">
                        {drugInteractions.effects[index] || 'Effect details not available'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-5 w-5" />
                  <p>No known drug interactions reported.</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-80">
            <div className="sticky top-32 bg-card dark:bg-accent/5 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-foreground">Alternative Medications</h3>
              {medicationData.alternative_medicines.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {medicationData.alternative_medicines.length} alternatives available with similar composition
                  </p>
                  <Button
                    size="lg"
                    onClick={handleCompareNavigation}
                    className="w-full rounded-lg group"
                  >
                    Compare Alternatives
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="mt-6 space-y-3">
                    {medicationData.alternative_medicines.slice(0, 3).map((alt, index) => (
                      <div 
                        key={index}
                        className="text-sm p-3 rounded-lg bg-muted/30 dark:bg-accent/10 hover:bg-muted/50 dark:hover:bg-accent/20 transition-colors"
                      >
                        <div className="font-medium text-foreground">{alt.name}</div>
                        <div className="text-muted-foreground">{alt.price}</div>
                      </div>
                    ))}
                    {medicationData.alternative_medicines.length > 3 && (
                      <div className="text-sm text-center text-muted-foreground">
                        +{medicationData.alternative_medicines.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Info className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No alternative medications with similar compositions were found for this medicine.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {medicationData.alternative_medicines.length > 0 && (
          <div className="lg:hidden fixed bottom-6 left-6 right-6">
            <Button
              size="lg"
              onClick={handleCompareNavigation}
              className="w-full rounded-full shadow-lg"
            >
              Compare {medicationData.alternative_medicines.length} Alternatives
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicationDetail;
