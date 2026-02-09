import { StaffContext } from "@/contexts/StaffContext";
import { useContext } from "react";



 export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
