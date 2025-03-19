import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Lessons = () => {
  return (
    <PageTemplate title="Lessons">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Lesson Materials</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Mathematics</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded">Introduction to Calculus</li>
              <li className="p-2 bg-gray-50 rounded">Derivatives and Integrals</li>
            </ul>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Physics</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded">Newton's Laws of Motion</li>
              <li className="p-2 bg-gray-50 rounded">Conservation of Energy</li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Lessons;