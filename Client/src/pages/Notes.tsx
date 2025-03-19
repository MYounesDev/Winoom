import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Notes = () => {
  return (
    <PageTemplate title="Notes">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Teaching Notes</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Recent Notes</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Lecture Notes: Calculus Week 3</div>
                <div className="text-sm text-gray-600">Last updated: March 15, 2025</div>
              </li>
              <li className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Student Progress Notes</div>
                <div className="text-sm text-gray-600">Last updated: March 10, 2025</div>
              </li>
            </ul>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Create New Note
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Notes;