import React from "react";
import PageTemplate from "@/components/PageTemplate";

const Calendar = () => {
  return (
    <PageTemplate title="Calendar">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Calendar</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Upcoming Events</h3>
            <p className="text-gray-600">No upcoming events scheduled.</p>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add Event
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Calendar;