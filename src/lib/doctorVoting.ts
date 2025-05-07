// Trust score calculation for doctor voting system

type DoctorCredential = 'Specialist' | 'General' | 'Resident';

interface DoctorVote {
  doctorId: string;
  credential: DoctorCredential;
  isVerified: boolean;
  expertiseLevel: number; // 1-5 scale
  vote: number; // 1-5 scale
}

const CREDENTIAL_WEIGHTS: Record<DoctorCredential, number> = {
  Specialist: 1.5,
  General: 1.0,
  Resident: 0.7
};

/**
 * Calculates a weighted trust score based on doctor votes
 * @param votes Array of doctor votes
 * @returns Trust score between 0-5
 */
export const calculateTrustScore = (votes: DoctorVote[]): number => {
  if (votes.length === 0) return 0;

  const weightedSum = votes.reduce((sum, vote) => {
    // Only count verified doctor votes
    if (!vote.isVerified) return sum;

    const credentialWeight = CREDENTIAL_WEIGHTS[vote.credential];
    const expertiseMultiplier = vote.expertiseLevel / 5; // Normalize to 0-1
    
    return sum + (vote.vote * credentialWeight * expertiseMultiplier);
  }, 0);

  // Get total number of verified votes for averaging
  const verifiedVotes = votes.filter(v => v.isVerified).length;
  
  if (verifiedVotes === 0) return 0;
  
  // Calculate final score (0-5 range)
  const score = weightedSum / verifiedVotes;
  
  // Round to 1 decimal place
  return Math.round(score * 10) / 10;
};

/**
 * Converts a trust score to a risk level
 * @param trustScore Trust score between 0-5
 * @returns Risk level assessment
 */
export const getTrustBasedRiskLevel = (trustScore: number): 'low' | 'medium' | 'high' => {
  if (trustScore >= 4) return 'low';
  if (trustScore >= 2.5) return 'medium';
  return 'high';
};

import { cn } from "@/lib/utils";

/**
 * Get the appropriate color class for doctor recommendation percentage
 */
export function getRecommendationColorClass(percentage: number) {
  if (percentage >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 50) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 25) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * Get the appropriate background color class for doctor recommendation percentage
 */
export function getRecommendationBgClass(percentage: number) {
  if (percentage >= 75) return "bg-emerald-500";
  if (percentage >= 50) return "bg-blue-500";
  if (percentage >= 25) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Get the recommendation label based on the percentage
 */
export function getRecommendationLabel(percentage: number) {
  if (percentage === 0 && percentage === 0.0) return "Not Yet Recommended";
  if (percentage >= 75) return "Highly Recommended";
  if (percentage >= 50) return "Recommended";
  if (percentage >= 25) return "Moderately Recommended";
  return "Minimally Recommended";
}

/**
 * Format vote counts with abbreviations for larger numbers
 */
export function formatVoteCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Get the width style for progress bar based on percentage
 */
export function getProgressWidth(percentage: number): string {
  return `${Math.min(100, Math.max(0, percentage))}%`;
}