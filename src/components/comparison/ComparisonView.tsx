import { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Sparkles,
  PackageX,
  AlertCircle,
  Info,
  ThumbsUp,
  CheckCircle,
  ThumbsDown,
  X as XIcon,
  UserRound,
  MoveUp,
  MoveDown,
  Heart,
  HeartCrack
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  getRecommendationColorClass, 
  getRecommendationBgClass, 
  getRecommendationLabel,
  formatVoteCount,
  getProgressWidth
} from '@/lib/doctorVoting';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { API_URL, API_CONFIG, handleApiError } from '@/config/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/auth/AuthDialog';

interface ComparisonViewProps {
  className?: string;
}

const ComparisonView = ({ className }: ComparisonViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isDoctor } = useAuth();
  const [showAllAlternatives, setShowAllAlternatives] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<any>(
    location.state?.selectedAlternative || null
  );
  const [showVotingPanel, setShowVotingPanel] = useState(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [voteType, setVoteType] = useState<'up' | 'down' | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleVote = async (type: 'up' | 'down') => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    // If user is authenticated, consider them a doctor (even if doctors table doesn't exist yet)
    // This matches our fallback behavior in useAuth.tsx
    try {
      const currentMed = selectedAlternative || bestAlternative;
      toast({
        title: `Voting for ${currentMed.name}`,
        description: `You are ${type === 'up' ? 'recommending' : 'not recommending'} this medication.`,
      });

      const response = await fetch(`${API_URL}/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicine_id: currentMed.id,
          vote: type === 'up' ? 'upvote' : 'downvote',
          is_doctor: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update vote');
      }

      const data = await response.json();
      console.log("Vote response data:", data);
      
      // Create a copy of the updated medicine with new vote data
      const updatedMed = {
        ...currentMed,
        doctor_voting_factor: data.doctor_voting_factor,
        total_upvotes: data.total_upvotes,
        total_doctor_votes: data.total_doctor_votes
      };
      
      // Update correct medicine in state
      if (selectedAlternative && selectedAlternative.id === currentMed.id) {
        setSelectedAlternative(updatedMed);
      } else if (bestAlternative.id === currentMed.id) {
        // Since we can't directly modify bestAlternative or alternative_medicines (they come from props),
        // we need to force a re-render by triggering a state update
        // We can do this by re-selecting the current alternative
        setSelectedAlternative(updatedMed);

        // Note: In a real app, you'd want to use a state management solution like Redux
        // or use a parent component state to manage this data
      }

      setVoteType(type);
      setShowVoteSuccess(true);
      setTimeout(() => {
        setShowVoteSuccess(false);
        setVoteType(null);
      }, 2000);
    } catch (error) {
      console.error('Error updating vote:', error);
      toast({
        variant: "destructive",
        title: "Error updating vote",
        description: error.message || "Please try again later."
      });
    }
  };
  
  // Get medication data from location state
  const medicationData = location.state?.medicationData;
  if (!medicationData) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          Please select a medication to compare alternatives.
        </p>
      </div>
    );
  }

  const { original_medicine, alternative_medicines } = medicationData;
  
  // Get best alternative and remaining alternatives
  const bestAlternative = alternative_medicines.find(med => med.isBest) || alternative_medicines[0];

  // Floating Doctor Voting Panel
  const renderVotingPanel = () => {
    const currentMed = selectedAlternative || bestAlternative;
    const votingFactor = currentMed.doctor_voting_factor || 0;
    const recommendationPercentage = votingFactor * 100;
    const totalUpvotes = currentMed.total_upvotes || 0;
    const totalDoctorVotes = currentMed.total_doctor_votes || 0;
    const downvotes = totalDoctorVotes - totalUpvotes;
    const recommendationLabel = getRecommendationLabel(recommendationPercentage);
    const colorClass = getRecommendationColorClass(recommendationPercentage);
    const bgClass = getRecommendationBgClass(recommendationPercentage);

    // If user is not logged in, show login prompt
    if (!user) {
      return (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto"
        >
          <div className="bg-card dark:bg-card/90 backdrop-blur-sm rounded-xl shadow-xl border border-border dark:border-accent/30 p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                  <UserRound className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Doctor Recommendations
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentMed.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVotingPanel(false)}
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">Doctor Login Required</h3>
                <p className="text-muted-foreground mb-6">
                  Please log in as a verified healthcare professional to provide your medical recommendations
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setShowVotingPanel(false);
                    setShowAuthDialog(true);
                  }}
                >
                  <UserRound className="h-5 w-5 mr-2" />
                  Login as Doctor
                </Button>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                Your expert opinion helps other healthcare providers make informed decisions
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    // For logged in doctors, show voting panel
    return (
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto"
      >
        <div className="bg-card dark:bg-card/90 backdrop-blur-sm rounded-xl shadow-xl border border-border dark:border-accent/30 p-6 m-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                <UserRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Doctor Recommendations
                </h3>
                <p className="text-sm text-muted-foreground">{currentMed.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVotingPanel(false)}
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Recommendation Status */}
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 text-center">
              <div className={cn("text-2xl font-bold mb-1", colorClass)}>
                {recommendationLabel}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {formatVoteCount(totalDoctorVotes)} medical professional assessments
              </p>
            </div>
            
            {/* Progress Bar with Percentage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Medical Approval</span>
                <span className={cn("text-sm font-bold", colorClass)}>
                  {recommendationPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-muted/50 dark:bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", bgClass)}
                  style={{ width: getProgressWidth(recommendationPercentage) }}
                />
              </div>
            </div>

            {/* Vote Counts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-md p-3 text-center">
                <Badge 
                  variant="outline" 
                  className="bg-white/50 dark:bg-black/20 mb-2 px-3 py-1 text-base font-bold"
                >
                  {formatVoteCount(totalUpvotes)}
                </Badge>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Upvotes</span>
                </div>
              </div>
              
              <div className="bg-destructive/10 dark:bg-destructive/20 rounded-md p-3 text-center">
                <Badge 
                  variant="outline" 
                  className="bg-white/50 dark:bg-black/20 mb-2 px-3 py-1 text-base font-bold"
                >
                  {formatVoteCount(downvotes)}
                </Badge>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  <span className="font-medium">Downvotes</span>
                </div>
              </div>
            </div>

            {/* Voting Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                variant="outline"
                className={cn(
                  "border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary font-medium flex items-center gap-2 py-6 justify-center relative",
                  showVoteSuccess && voteType === 'up' && "pointer-events-none"
                )}
                onClick={() => handleVote('up')}
                disabled={showVoteSuccess}
              >
                {showVoteSuccess && voteType === 'up' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md"
                  >
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </motion.div>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    <span>Recommend</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive hover:text-destructive font-medium flex items-center gap-2 py-6 justify-center relative",
                  showVoteSuccess && voteType === 'down' && "pointer-events-none"
                )}
                onClick={() => handleVote('down')}
                disabled={showVoteSuccess}
              >
                {showVoteSuccess && voteType === 'down' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-md"
                  >
                    <CheckCircle className="h-6 w-6 text-destructive" />
                  </motion.div>
                ) : (
                  <>
                    <HeartCrack className="h-5 w-5" />
                    <span>Do Not Recommend</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground mt-2">
              Your assessment helps other healthcare providers make informed decisions
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Get remaining alternatives excluding the selected one and best alternative
  const getRemainingAlternatives = () => {
    const uniqueMedications = new Set();

    // If no alternative is selected, return all alternatives except the best one
    if (!selectedAlternative) {
        return alternative_medicines.filter(med => {
            if (med === bestAlternative) return false; // Exclude best alternative
            if (uniqueMedications.has(med.name)) return false; // Exclude duplicates
            uniqueMedications.add(med.name);
            return true;
        });
    }

    // If selected alternative is the best alternative, show all others
    if (selectedAlternative === bestAlternative) {
        return alternative_medicines.filter(med => {
            if (med === selectedAlternative) return false; // Exclude selected alternative
            if (uniqueMedications.has(med.name)) return false; // Exclude duplicates
            uniqueMedications.add(med.name);
            return true;
        });
    }

    // If a different alternative is selected, keep best alternative in the list
    return alternative_medicines.filter(med => {
        if (med === selectedAlternative) return false; // Exclude selected alternative
        if (uniqueMedications.has(med.name)) return false; // Exclude duplicates
        uniqueMedications.add(med.name);
        return true;
    });
  };

  const remainingAlternatives = getRemainingAlternatives();

  // Function to get first sentence or truncated description
  const getFirstSentence = (description: string) => {
    if (!description || description === "No Description Available") {
      return "No description available for this medication.";
    }
    // Try to find the first complete sentence
    const match = description.match(/^[^.!?]+[.!?]/);
    if (match) {
      return match[0].trim();
    }
    // Fallback: If no sentence ending found, take first 150 characters
    return description.length > 150 
      ? `${description.slice(0, 150)}...` 
      : description;
  };

  // Function to get discontinued badge
  const getDiscontinuedBadge = (isDiscontinued: boolean) => {
    if (!isDiscontinued) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className="flex items-center gap-1.5">
              <PackageX className="h-3.5 w-3.5" />
              <span>Discontinued</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This medication is no longer being manufactured or distributed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Function to calculate price difference percentage
  const getPriceDifference = (original: string, alternative: string) => {
    const originalPrice = parseFloat(original.replace('₹', ''));
    const alternativePrice = parseFloat(alternative.replace('₹', ''));
    const difference = ((alternativePrice - originalPrice) / originalPrice * 100).toFixed(0);
    return {
      percentage: Math.abs(parseFloat(difference)),
      isExpensive: alternativePrice > originalPrice
    };
  };

  // Function to handle alternative selection
  const handleAlternativeSelect = (medication: any) => {
    // If the medication is already selected, don't update
    if (medication === selectedAlternative) return;
    
    setSelectedAlternative(medication);
  };

  // Function to handle "More Details" click
  const handleMoreDetails = (medication: any) => {
    // Create a new array of alternatives excluding the current medication
    const updatedAlternatives = alternative_medicines.filter(med => {
      // Don't include the current medication
      if (med === medication) return false;
      // Don't include duplicates
      const isDuplicate = alternative_medicines.findIndex(m => m.name === med.name) !== 
                         alternative_medicines.findIndex(m => m === med);
      if (isDuplicate) return false;
      return true;
    });
    
    // Preserve the best alternative flag when navigating
    const preservedAlternatives = updatedAlternatives.map(med => ({
      ...med,
      isBest: med === bestAlternative
    }));

    navigate(`/medication/${encodeURIComponent(medication.name)}`, {
      state: { 
        medicationData: {
          original_medicine: medication,
          alternative_medicines: preservedAlternatives
        },
        selectedAlternative: selectedAlternative || bestAlternative,
        originalMedicine: original_medicine
      }
    });
  };

  // Function to render comparison details
  const renderComparisonDetails = (medication: any, isOriginal: boolean = false) => {
    const priceDiff = !isOriginal && getPriceDifference(original_medicine.price, medication.price);
    const isBestMatch = !isOriginal && medication.isBest;
    
    return (
      <div className="bg-card dark:bg-accent/5 rounded-lg shadow-lg border border-border dark:border-accent/20">
        <div className={cn(
          "py-3 px-4 text-sm font-medium text-center rounded-t-lg flex items-center justify-center gap-2",
          isOriginal 
            ? "bg-primary/10 dark:bg-primary/20 text-primary" 
            : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
        )}>
          {isOriginal ? (
            <>
              <ArrowLeft className="h-4 w-4" />
              Current Medication
            </>
          ) : (
            <>
              {selectedAlternative === medication ? 'Selected Alternative' : 'Best Alternative'}
              <ArrowRight className="h-4 w-4" />
              {isBestMatch && (
                <Badge variant="secondary" className="ml-2 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Best Match
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-1">
                <h3 className="text-xl font-semibold text-foreground">{medication.name}</h3>
                {getDiscontinuedBadge(medication.is_discontinued)}
              </div>
              <p className="text-sm text-muted-foreground">{medication.manufacturer}</p>
            </div>
            {!isOriginal && (
              <Badge variant="outline" className={cn(
                "bg-green-50 dark:bg-green-900/50 shrink-0",
                priceDiff.isExpensive 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-green-600 dark:text-green-400"
              )}>
                {priceDiff.isExpensive 
                  ? `${priceDiff.percentage}% Expensive` 
                  : `${priceDiff.percentage}% Cheaper`}
              </Badge>
            )}
          </div>

          {/* Doctor Voting Section */}
          <div className="mb-6 bg-muted/30 dark:bg-accent/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 dark:bg-primary/20 p-1 rounded-full">
                  <UserRound className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-sm font-medium text-foreground">Doctor Recommendations</h4>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">Assessment score based on verified doctor inputs. Higher percentages indicate stronger medical consensus on effectiveness and safety.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {medication.doctor_voting_factor !== null && medication.doctor_voting_factor !== undefined ? (
              <div className="space-y-3">
                {/* Recommendation Label */}
                <div className={cn(
                  "text-center py-1 rounded-md font-medium text-sm mb-2",
                  getRecommendationColorClass(medication.doctor_voting_factor * 100),
                  "bg-muted/50 dark:bg-muted/30"
                )}>
                  {getRecommendationLabel(medication.doctor_voting_factor * 100)}
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-muted/50 dark:bg-muted/30 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", getRecommendationBgClass(medication.doctor_voting_factor * 100))}
                        style={{ width: getProgressWidth(medication.doctor_voting_factor * 100) }}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    getRecommendationColorClass(medication.doctor_voting_factor * 100)
                  )}>
                    {((medication.doctor_voting_factor || 0) * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Vote Counts - Block Style */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-primary/10 dark:bg-primary/20 rounded-md p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Upvotes</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
                      {formatVoteCount(medication.total_upvotes || 0)}
                    </Badge>
                  </div>
                  <div className="bg-destructive/10 dark:bg-destructive/20 rounded-md p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">Downvotes</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
                      {formatVoteCount((medication.total_doctor_votes || 0) - (medication.total_upvotes || 0))}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <div className="bg-muted/40 dark:bg-muted/20 rounded-lg p-4 flex flex-col items-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">No Recommendations Yet</p>
                  <p className="text-xs text-muted-foreground">This medication has not received any doctor assessments</p>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="mb-6 bg-muted/30 dark:bg-accent/10 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getFirstSentence(medication.description)}
            </p>
          </div>
          
          {/* Price Section */}
          <div className="flex items-center justify-between p-4 bg-muted/30 dark:bg-accent/10 rounded-lg mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Price</div>
              <div className={cn(
                "text-2xl font-bold text-foreground",
                !isOriginal && !priceDiff.isExpensive && "text-green-600 dark:text-green-400",
                !isOriginal && priceDiff.isExpensive && "text-red-600 dark:text-red-400"
              )}>
                {medication.price}
              </div>
            </div>
            {!isOriginal && (
              <Badge variant="secondary" className="ml-auto">
                {priceDiff.isExpensive ? 'Pay' : 'Save'} ₹
                {Math.abs(parseFloat(original_medicine.price.replace('₹', '')) - 
                parseFloat(medication.price.replace('₹', ''))).toFixed(2)}
              </Badge>
            )}
          </div>

          {/* Key Details Grid */}
          <div className="grid gap-6 p-4 bg-muted/30 dark:bg-accent/10 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">Composition</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {medication.compositions.composition1 && (
                  <Badge variant="outline" className="font-normal">
                    {medication.compositions.composition1}
                  </Badge>
                )}
                {medication.compositions.composition2 && (
                  <Badge variant="outline" className="font-normal">
                    {medication.compositions.composition2}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">Side Effect Risk</span>
              </div>
              <Badge variant={
                medication.side_effect_factor < 1.5 ? "secondary" :
                medication.side_effect_factor < 3 ? "outline" : "destructive"
              }>
                {medication.side_effect_factor < 1.5 ? "Low Risk" :
                 medication.side_effect_factor < 3 ? "Medium Risk" : "High Risk"}
              </Badge>
            </div>

            {medication.pack_size && (
              <div className="text-sm">
                <span className="text-muted-foreground">Pack Size:</span>{' '}
                <span className="font-medium text-foreground">{medication.pack_size}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={() => handleMoreDetails(medication)}
          >
            View Full Details
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={cn("w-full font-sans max-w-7xl mx-auto", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating Doctor Voting Panel */}
      <AnimatePresence>
        {showVotingPanel && renderVotingPanel()}
      </AnimatePresence>

      {/* Authentication Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      {/* Floating Button to Show Voting Panel */}
      <motion.button
        onClick={() => setShowVotingPanel(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "bg-primary text-primary-foreground shadow-lg rounded-full px-5 py-3",
          "hover:bg-primary/90 transition-colors",
          "flex items-center gap-2",
          "border border-primary/20",
          showVotingPanel && "hidden"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <UserRound className="h-5 w-5" />
        <span className="font-medium">Doctor Recommendations</span>
      </motion.button>

      {/* Main Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Original Medication */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {renderComparisonDetails(original_medicine, true)}
        </motion.div>

        {/* Alternative Medication */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {renderComparisonDetails(selectedAlternative || bestAlternative)}
        </motion.div>
      </div>

      {/* Other Alternatives Section */}
      {remainingAlternatives.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card dark:bg-accent/5 rounded-lg border border-border dark:border-accent/20 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Other Alternatives</h2>
            {remainingAlternatives.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllAlternatives(!showAllAlternatives)}
                className="text-primary"
              >
                {showAllAlternatives ? (
                  <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Show All <ChevronDown className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {remainingAlternatives
                .slice(0, showAllAlternatives ? undefined : 6)
                .map((medication, index) => (
                  <motion.div
                    key={medication.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleAlternativeSelect(medication)}
                    className={cn(
                      "cursor-pointer transition-all transform hover:scale-[1.02]",
                      "bg-muted/30 dark:bg-accent/10 p-4 rounded-lg",
                      selectedAlternative === medication && "ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{medication.name}</h4>
                      {medication.is_discontinued && (
                        <Badge variant="destructive" className="text-xs flex items-center gap-1">
                          <PackageX className="h-3 w-3" />
                          <span>Discontinued</span>
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {getFirstSentence(medication.description)}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-lg font-bold",
                        !getPriceDifference(original_medicine.price, medication.price).isExpensive 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {medication.price}
                      </span>
                      <Badge variant="outline" className={cn(
                        getPriceDifference(original_medicine.price, medication.price).isExpensive 
                          ? "text-red-600 dark:text-red-400" 
                          : "text-green-600 dark:text-green-400"
                      )}>
                        {getPriceDifference(original_medicine.price, medication.price).isExpensive
                          ? `${getPriceDifference(original_medicine.price, medication.price).percentage}% Expensive`
                          : `Save ${getPriceDifference(original_medicine.price, medication.price).percentage}%`}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {medication.manufacturer}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            medication.side_effect_factor < 1.5 ? "secondary" :
                            medication.side_effect_factor < 3 ? "outline" : "destructive"
                          } className="text-xs">
                            {medication.side_effect_factor < 1.5 ? "Low Risk" :
                             medication.side_effect_factor < 3 ? "Medium Risk" : "High Risk"}
                          </Badge>
                          {medication.isBest && (
                            <Badge variant="secondary" className="bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Best
                            </Badge>
                          )}
                        </div>
                      </div>
                      {medication.doctor_voting_factor ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3 text-primary" />
                          <span>Doctor Confidence: {((medication.doctor_voting_factor || 0) * 100).toFixed(1)}%</span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ComparisonView;
