import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getLessons } from "@/services/API";

interface LessonsData {
  [subject: string]: string[];
}

const Lessons = () => {
  const [lessons, setLessons] = useState<LessonsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await getLessons();
        setLessons(response.lessons);
        setLoading(false);
      } catch (err) {
        setError("Failed to load lessons. Please try again later.");
        setLoading(false);
        console.error("Error fetching lessons:", err);
      }
    };

    fetchLessons();
  }, []);

  return (
    <PageTemplate title="Lessons">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Lesson Materials</h2>
        {loading ? (
          <div className="p-4 text-center">Loading lessons...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : Object.keys(lessons).length === 0 ? (
          <div className="p-4 text-center">No lessons available</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(lessons).map(([subject, topics], index) => (
              <div key={index} className="p-4 border rounded">
                <h3 className="font-medium">{subject}</h3>
                <ul className="mt-2 space-y-2">
                  {topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="p-2 bg-gray-50 rounded">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Lessons;