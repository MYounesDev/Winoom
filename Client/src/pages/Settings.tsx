import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Settings = () => {
  return (
    <PageTemplate title="Settings">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">User Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <button className="themed-button">Save Changes</button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Settings;