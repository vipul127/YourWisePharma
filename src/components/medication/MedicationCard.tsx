import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert, PackageX, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MedicationCardProps {
  medication: any;
  isHero?: boolean;
  isCurrent?: boolean;
  className?: string;
}

interface VotingData {
  upvotes: number;
  totalVotes: number;
  recommendationScore: number;
}

const MedicationCard = ({ medication, isHero = false, isCurrent = false, className }: MedicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(isHero);

  // Normalize data between different structures
  const normalizedData = {
    name: medication.name,
    manufacturer: medication.manufacturer || medication.manufacturer_name || "",
    price: medication.price,
    description: medication.description || medication.medicine_desc || "",
    voting: {
      upvotes: medication.doctor_votes?.upvotes || 0,
      totalVotes: medication.doctor_votes?.total || 0,
      recommendationScore: medication.doctor_votes?.upvotes && medication.doctor_votes?.total
        ? (medication.doctor_votes.upvotes / medication.doctor_votes.total) * 100
        : 0
    },
    sideEffects: Array.isArray(medication.sideEffects) 
      ? medication.sideEffects 
      : typeof medication.sideEffects === 'string' && medication.sideEffects 
        ? medication.sideEffects.split(',') 
        : typeof medication.side_effects === 'string' && medication.side_effects
          ? medication.side_effects.split(',')
          : [],
    composition: medication.composition || 
      (medication.compositions 
        ? `${medication.compositions.composition1 || ""} ${medication.compositions.composition2 || ""}`.trim() 
        : `${medication.short_composition1 || ""} ${medication.short_composition2 || ""}`.trim()),
    isDiscontinued: medication.discontinued || medication.is_discontinued || false,
    riskLevel: medication.riskLevel || getRiskLevelFromFactor(medication.side_effect_factor),
    interactions: Array.isArray(medication.interactions) 
      ? medication.interactions 
      : typeof medication.drug_interactions === 'string' && medication.drug_interactions 
        ? medication.drug_interactions.split(',') 
        : [],
    packSize: medication.pack_size || medication.pack_size_label || "",
  };

  // Helper function to convert side_effect_factor to risk level
  function getRiskLevelFromFactor(factor?: number, trustScore?: number): 'low' | 'medium' | 'high' {
    if (trustScore !== undefined) {
      // If we have a trust score, use it as the primary factor
      if (trustScore >= 4) return 'low';
      if (trustScore >= 2.5) return 'medium';
      return 'high';
    }
    
    // Fallback to traditional risk assessment
    if (factor === undefined || factor < 0) return 'low';
    if (factor < 1.5) return 'low';
    if (factor < 3) return 'medium';
    return 'high';
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 px-2 py-0.5 rounded-full text-xs">
                  <Check className="h-3 w-3" />
                  <span>Low Risk</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">This medication has minimal known risk factors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'medium':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/50 px-2 py-0.5 rounded-full text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Medium Risk</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">This medication has some moderate risk factors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'high':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-2 py-0.5 rounded-full text-xs">
                  <ShieldAlert className="h-3 w-3" />
                  <span>High Risk</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">This medication has significant risk factors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  const getAvailabilityStatus = (isDiscontinued: boolean) => {
    if (isDiscontinued) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <PackageX className="h-4 w-4" />
          <span>Discontinued</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <Check className="h-4 w-4" />
        <span>Available</span>
      </div>
    );
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'string') {
      if (price.includes('₹')) return price;
      return `₹${price}`;
    }
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-300",
        // Base styles
        "bg-white dark:bg-accent/5",
        // Border styles
        "border border-zinc-200 dark:border-accent/20",
        "hover:border-zinc-300 dark:hover:border-accent/30",
        // Shadow styles
        "shadow-sm hover:shadow-md",
        "dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]",
        // Hover effects
        "hover:-translate-y-0.5",
        // Special states
        isHero && "md:col-span-2 border-primary/20 dark:border-primary/30",
        isCurrent && "ring-2 ring-primary ring-offset-2 dark:ring-offset-background",
        // Discontinued state
        normalizedData.isDiscontinued && "opacity-80",
        className
      )}
    >
      {isHero && (
        <div className="bg-primary/10 dark:bg-primary/20 py-1.5 px-4 text-xs font-medium text-primary text-center border-b border-primary/10 dark:border-primary/20">
          Recommended Alternative
        </div>
      )}
      
      {isCurrent && (
        <div className="bg-accent/50 dark:bg-accent/10 py-1.5 px-4 text-xs font-medium text-accent-foreground text-center border-b border-accent/20">
          Current Medication
        </div>
      )}
      
      {normalizedData.isDiscontinued && (
        <div className="bg-accent/50 dark:bg-accent/10 py-1 px-4 text-xs font-medium text-accent-foreground text-center border-b border-accent/20 flex items-center justify-center">
          <PackageX className="h-3 w-3 mr-1" />
          Discontinued
        </div>
      )}
      
      <div className="p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="min-h-[60px] flex flex-col">
            <h3 className={cn(
              "font-semibold transition-colors max-w-[200px] line-clamp-2",
              isHero || isCurrent 
                ? "text-xl text-primary dark:text-primary/90" 
                : "text-lg text-foreground"
            )}>
              {normalizedData.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
              {normalizedData.manufacturer}
            </p>
          </div>
          
          <div className="text-right flex flex-col justify-start min-w-[80px] ml-2">
            <p className={cn(
              "font-bold whitespace-nowrap",
              isHero || isCurrent 
                ? "text-2xl text-foreground" 
                : "text-xl text-foreground"
            )}>
              {formatPrice(normalizedData.price)}
            </p>
            {normalizedData.packSize && (
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {normalizedData.packSize}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {normalizedData.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getRiskBadge(normalizedData.riskLevel)}
              {normalizedData.voting.totalVotes > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                        <span>{normalizedData.voting.recommendationScore.toFixed(1)}% Recommended</span>
                        <span className="text-[10px]">({normalizedData.voting.upvotes}/{normalizedData.voting.totalVotes})</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">Based on doctor recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {getAvailabilityStatus(normalizedData.isDiscontinued)}
          </div>

          {normalizedData.sideEffects && normalizedData.sideEffects.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {normalizedData.sideEffects.slice(0, 3).map((effect, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-accent/50 dark:bg-accent/10 text-accent-foreground"
                  >
                    {effect}
                  </span>
                ))}
                {normalizedData.sideEffects.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/30 dark:bg-accent/5 text-accent-foreground">
                    +{normalizedData.sideEffects.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {isExpanded && (
            <div className="animate-slide-down space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground">Composition</h4>
                <p className="text-sm text-muted-foreground mt-1">{normalizedData.composition}</p>
              </div>
              
              {normalizedData.sideEffects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground">Side Effects</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {normalizedData.sideEffects.map((effect, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-accent/50 dark:bg-accent/10 text-accent-foreground"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {normalizedData.interactions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground flex items-center">
                    <ShieldAlert className="h-4 w-4 text-destructive mr-1" />
                    Interactions
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {normalizedData.interactions.map((interaction, index) => (
                      <li key={index}>{interaction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full flex items-center justify-center text-muted-foreground hover:text-primary mt-4"
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MedicationCard;
