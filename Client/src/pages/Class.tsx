import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getStudentClass } from "@/services/api";
import { useLocation } from "react-router-dom";

interface LocationState {
  role: string;
}


interface ClassData {
  name: string;
}

const Class = () => {
  const [studentClass, setClass] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const location = useLocation();
  const state = location.state as LocationState;
  
  useEffect(() => {
    const fetchClass = async () => {
      try {
        // Get userRole from sessionStorage if not in location state
        const response = await getStudentClass();
        setClass(response.studentClass);
        setLoading(false);
      } catch (err) {
        setError("Failed to load student class. Please try again later.");
        setLoading(false);
        console.error("Error fetching class:", err);
      }
    };

    fetchClass();
  }, [state]);

  return (
    <PageTemplate title="Class">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">My Class</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="p-4 text-center">Loading class...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="p-4 border rounded">
              <h3 className="font-medium">Current Class</h3>
              {!studentClass ? (
                <p className="mt-2 text-gray-500">No class found.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                    <li className="p-2 bg-gray-50 rounded">
                      {studentClass.name}
                    </li>
               
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