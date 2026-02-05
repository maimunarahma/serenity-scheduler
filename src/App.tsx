import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import { StaffProvider } from "@/contexts/StaffContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StaffPage from "./pages/Staff";
import ServicesPage from "./pages/Services";
import AppointmentsPage from "./pages/Appointments";
import QueuePage from "./pages/Queue";
import ActivityPage from "./pages/Activity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

// Component that shows loading during auth check
const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner 
        size="xl" 
        text="Loading Serenity Scheduler..." 
        fullScreen 
      />
    );
  }

  return (
    <AppointmentProvider>
      <StaffProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </StaffProvider>
    </AppointmentProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
