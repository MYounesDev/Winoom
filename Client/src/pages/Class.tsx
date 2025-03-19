import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Class = () => {
  return (
    <PageTemplate title="Class">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">My Classes</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Current Classes</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded">Mathematics 101</li>
              <li className="p-2 bg-gray-50 rounded">Physics 101</li>
              <li className="p-2 bg-gray-50 rounded">Computer Science 101</li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Class;