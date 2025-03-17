import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Reports = () => {
  return (
    <PageTemplate title="Reports">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Academic Reports</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Available Reports</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Class Performance Report</span>
                <button className="text-blue-500">Generate</button>
              </li>
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Student Progress Report</span>
                <button className="text-blue-500">Generate</button>
              </li>
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Attendance Report</span>
                <button className="text-blue-500">Generate</button>
              </li>
            </ul>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Recent Reports</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>March Monthly Report</span>
                <button className="text-blue-500">View</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Reports;