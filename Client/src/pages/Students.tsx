import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Students = () => {
  return (
    <PageTemplate title="Students">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Student Management</h2>
        <div className="space-y-4">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Student List</h3>
            <table className="w-full mt-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Class</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">John Doe</td>
                  <td className="p-2">STU-001</td>
                  <td className="p-2">Mathematics 101</td>
                  <td className="p-2">Active</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">STU-002</td>
                  <td className="p-2">Physics 101</td>
                  <td className="p-2">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add Student
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Students;