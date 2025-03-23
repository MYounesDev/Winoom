import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getCalendar } from "@/services/api";

interface Event {
  title: string;
  date: string;
  time?: string;
  location?: string;
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await getCalendar();
        setEvents(response.events);
        setLoading(false);
      } catch (err) {
        setError("Failed to load calendar events. Please try again later.");
        setLoading(false);
        console.error("Error fetching calendar events:", err);
      }
    };

    fetchCalendar();
  }, []);

  return (
    <PageTemplate title="Calendar">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Calendar</h2>
        {loading ? (
          <div className="p-4 text-center">Loading calendar events...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">Upcoming Events</h3>
              {events.length === 0 ? (
                <p className="text-gray-600">No upcoming events scheduled.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {events.map((event, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {event.date} {event.time && `at ${event.time}`}
                        {event.location && ` - ${event.location}`}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end">
              <button className="themed-button">
                Add Event
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Calendar;