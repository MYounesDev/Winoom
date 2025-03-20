import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getHomework } from "@/services/api";

interface Assignment {
  name: string;
  dueDate?: string;
  status: string;
}

const Homework = () => {
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await getHomework();
        setPendingAssignments(response.pendingAssignments);
        setCompletedAssignments(response.completedAssignments);
        setLoading(false);
      } catch (err) {
        setError("Failed to load homework. Please try again later.");
        setLoading(false);
        console.error("Error fetching homework:", err);
      }
    };

    fetchHomework();
  }, []);

  return (
    <PageTemplate title="Homework">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Homework Assignments</h2>
        {loading ? (
          <div className="p-4 text-center">Loading homework assignments...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">Pending Assignments</h3>
              {pendingAssignments.length === 0 ? (
                <p className="mt-2 text-gray-500">No pending assignments.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {pendingAssignments.map((assignment, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded flex justify-between">
                      <span>{assignment.name}</span>
                      <span className="text-red-500">Due: {assignment.dueDate}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-medium">Completed Assignments</h3>
              {completedAssignments.length === 0 ? (
                <p className="mt-2 text-gray-500">No completed assignments.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {completedAssignments.map((assignment, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded flex justify-between">
                      <span>{assignment.name}</span>
                      <span className="text-green-500">Submitted</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Homework;  