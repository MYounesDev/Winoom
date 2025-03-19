import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Classes = () => {
  return (
    <PageTemplate title="Classes">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Manage Classes</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Your Classes</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Mathematics 101</span>
                <span>30 students</span>
              </li>
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Physics 101</span>
                <span>25 students</span>
              </li>
              <li className="p-2 bg-gray-50 rounded flex justify-between">
                <span>Computer Science 101</span>
                <span>28 students</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add New Class
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Classes;