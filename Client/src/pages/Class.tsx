import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getClasses } from "@/services/api";
import { useLocation } from "react-router-dom";

interface LocationState {
  role: string;
}

interface ClassData {
  name: string;
  code: string;
}

const Class = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const location = useLocation();
  const state = location.state as LocationState;
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Get userRole from sessionStorage if not in location state
        const userRole = state?.role || sessionStorage.getItem('userRole') || 'Student';
        const response = await getClasses(userRole);
        setClasses(response.classes);
        setLoading(false);
      } catch (err) {
        setError("Failed to load classes. Please try again later.");
        setLoading(false);
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, [state]);

  return (
    <PageTemplate title="Class">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">My Classes</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="p-4 text-center">Loading classes...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="p-4 border rounded">
              <h3 className="font-medium">Current Classes</h3>
              {classes.length === 0 ? (
                <p className="mt-2 text-gray-500">No classes found.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {classes.map((cls, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      {cls.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Class;