import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getNotes } from "@/services/api";

interface Note {
  title: string;
  lastUpdated: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response.notes);
        setLoading(false);
      } catch (err) {
        setError("Failed to load notes. Please try again later.");
        setLoading(false);
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, []);

  return (
    <PageTemplate title="Notes">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Teaching Notes</h2>
        {loading ? (
          <div className="p-4 text-center">Loading notes...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">Recent Notes</h3>
              {notes.length === 0 ? (
                <p className="mt-2 text-gray-500">No notes found.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {notes.map((note, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{note.title}</div>
                      <div className="text-sm text-gray-600">
                        Last updated: {note.lastUpdated}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end">
              <button className="themed-button">
                Create New Note
              </button>
            </div>
          </div>
        )
      }
      </div>
    </PageTemplate>
  );
};

export default Notes;
