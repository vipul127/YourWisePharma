export const API_URL = import.meta.env.VITE_API_URL;
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const API_CONFIG = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors' as const,
  credentials: 'include' as const,
  cache: 'no-cache' as const,
  redirect: 'follow' as const,
  referrerPolicy: 'no-referrer' as const,
};


// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  console.error('API Error:', error);
  
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return 'Failed to load medication details. Please check your connection and try again.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again later.';
}; 



