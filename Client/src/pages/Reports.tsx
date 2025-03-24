import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getReports } from "@/services/API"; // Assuming this is where your API functions are

const Reports = () => {
  const [availableReports, setAvailableReports] = useState<string[]>([]);
  const [recentReports, setRecentReports] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getReports();
        setAvailableReports(data.availableReports);
        setRecentReports(data.recentReports);
      } catch (err) {
        setError("Failed to load reports. Please try again later.");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <PageTemplate title="Reports">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Academic Reports</h2>
        
        {loading && (
          <div className="text-center py-4">
            <p>Loading reports...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">Available Reports</h3>
              {availableReports.length === 0 ? (
                <p className="mt-2 text-gray-500">No available reports found</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {availableReports.map((report, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded flex justify-between">
                      <span>{report}</span>
                      <button className="themed-button">Generate</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium">Recent Reports</h3>
              {recentReports.length === 0 ? (
                <p className="mt-2 text-gray-500">No recent reports found</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {recentReports.map((report, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded flex justify-between">
                      <span>{report}</span>
                      <button className="themed-button">View</button>
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

export default Reports;