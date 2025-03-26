import React, { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

// Define a type for the user role
type UserRole = 'Student' | 'Teacher' | 'Advisor' | null;

// Define location state type
interface LocationState {
  role: UserRole;
}

interface PageTemplateProps {
  title?: string;
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  useEffect(() => {
    // Try to get role from location state first
    const state = location.state as LocationState;
    
    if (state?.role) {
      setUserRole(state.role);
      sessionStorage.setItem('userRole', state.role);
    } else {
      // Fall back to sessionStorage if no state
      const storedRole = sessionStorage.getItem('userRole') as UserRole;
      
      if (storedRole) {
        setUserRole(storedRole);
      } else {
        // If no role found anywhere, redirect to home page
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate]);

  return (
    <div className="app-container">
      <Sidebar userRole={userRole} />
      <div className="main-content">
        {title ? <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">{title}</h1> : <></>}
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;