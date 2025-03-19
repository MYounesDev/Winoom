import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Books = () => {
  return (
    <PageTemplate title="Books">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Textbooks & Resources</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Required Textbooks</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Calculus: Early Transcendentals</div>
                <div className="text-sm text-gray-600">James Stewart</div>
              </li>
              <li className="p-2 bg-gray-50 rounded">
                <div className="font-medium">University Physics</div>
                <div className="text-sm text-gray-600">Young & Freedman</div>
              </li>
            </ul>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Digital Resources</h3>
            <ul className="mt-2 space-y-2">
              <li className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Mathematics Video Tutorials</div>
                <div className="text-sm text-gray-600">Online Learning Platform</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Books;