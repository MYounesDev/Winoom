import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getCalendar, postEvent } from "@/services/API";
import { CalendarDays, MapPin, Clock, Plus, X } from "lucide-react";

interface Event {
  title: string;
  date: string;
  time?: string;
  location?: string;
}

interface NewEvent {
  title: string;
  date: string;
  time: string;
  location: string;
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    date: "",
    time: "",
    location: "",
  });

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

  // Group events by month for better organization
  const groupEventsByMonth = () => {
    const grouped: { [key: string]: Event[] } = {};

    events.forEach((event) => {
      const date = new Date(event.date);
      const month = isNaN(date.getTime())
        ? event.date.split(" ")[1] // Extract month if in format "23 April"
        : date.toLocaleString("default", { month: "long" });

      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(event);
    });

    return grouped;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      // Call the postEvent API function to save the new event
      const response = await postEvent(newEvent);

      // Add the new event to the list with the response from the API
      // This allows us to get any server-generated fields like ID
      setEvents(response.events);

      // Reset form and close modal
      setNewEvent({ title: "", date: "", time: "", location: "" });
      setShowModal(false);
    } catch (err) {
      setFormError("Failed to add event. Please try again.");
      console.error("Error adding event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventColor = (title: string) => {
    // Generate a consistent color based on the event title
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-red-100 border-red-300 text-red-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
    ];

    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <PageTemplate>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white shadow-xl rounded-2xl p-6 flex justify-between items-center border-l-4" style={{ borderColor: 'var(--primary-color)' }}>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              School Calendar
            </h1>
            <p className="text-gray-500 mt-2">
              View and manage upcoming school events
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="themed-button"
          >
            Add Calendar
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading calendar events...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 inline-block">
              {error}
            </div>
          </div>
        ) : (
          <div className="p-6 max-h-[450px] overflow-auto">
            {Object.entries(groupEventsByMonth()).map(
              ([month, monthEvents]) => (
                <div key={month} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    {month}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthEvents.map((event, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 shadow-sm transition-transform hover:scale-102 ${getEventColor(
                          event.title
                        )}`}
                      >
                        <h4 className="font-bold text-lg mb-2">
                          {event.title}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-700">
                            <CalendarDays size={16} className="mr-2" />
                            <span>{event.date}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center text-gray-700">
                              <Clock size={16} className="mr-2" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-gray-700">
                              <MapPin size={16} className="mr-2" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {events.length === 0 && (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <CalendarDays
                  size={64}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  No Events Scheduled
                </h3>
                <p className="text-gray-600 mt-2">
                  Click 'Add Event' to schedule your first event.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for adding a new event */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fadeIn border-[var(--primary-color)] border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Event
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border-l-4 border-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitEvent} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                  placeholder="e.g. 9:00 AM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                  placeholder="e.g. School Yard"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="themed-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Add Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default Calendar;
