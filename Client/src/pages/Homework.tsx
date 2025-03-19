import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Homework = () => {
  return (
    <PageTemplate title="Homework">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Homework Assignments</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Pending Assignments</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Mathematics Assignment #3</span>
                <span className="text-red-500">Due: March 20, 2025</span>
              </li>
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Physics Lab Report</span>
                <span className="text-red-500">Due: March 22, 2025</span>
              </li>
            </ul>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Completed Assignments</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Mathematics Assignment #2</span>
                <span className="text-green-500">Submitted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Homework;