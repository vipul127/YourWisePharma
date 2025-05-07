import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import Index from "@/pages/Index"
import Compare from "@/pages/Compare"
import Medications from "@/pages/Medications"
import MedicationDetail from "@/pages/MedicationDetail"
import About from "@/pages/About"
import NotFound from "@/pages/NotFound"

export function AppRoutes() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/medication/:name" element={<MedicationDetail />} />
        <Route path="/about" element={<About />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  )
} 