import { AppointmentContext } from "@/contexts/AppointmentContext";
import { useContext } from "react";

export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  return context;
};