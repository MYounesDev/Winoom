import React from "react";
import Sidebar from '@/components/Sidebar';
import { useLocation } from 'react-router-dom';

// Define a type for the user role
type UserRole = 'Student' | 'Teacher' | 'Advisor' | null;

// Define location state type
interface LocationState {
  role: UserRole;
}

interface PageTemplateProps {
  title: string;
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, children }) => {
  const location = useLocation();
  const state = location.state as LocationState;
  const userRole = state?.role || sessionStorage.getItem('userRole') as UserRole || null;
  
  // Store the user role in session storage so it persists across pages
  React.useEffect(() => {
    if (state?.role) {
      sessionStorage.setItem('userRole', state.role);
    }
  }, [state]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar userRole={userRole} />
      <div className="p-8 w-full">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;