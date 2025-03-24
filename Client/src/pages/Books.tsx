import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getBooks } from "@/services/API";

interface Book {
  title: string;
  author: string;
}

interface DigitalResource {
  title: string;
  source: string;
}

const Books = () => {
  const [textbooks, setTextbooks] = useState<Book[]>([]);
  const [digitalResources, setDigitalResources] = useState<DigitalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setTextbooks(response.textbooks);
        setDigitalResources(response.digitalResources);
        setLoading(false);
      } catch (err) {
        setError("Failed to load books. Please try again later.");
        setLoading(false);
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  return (
    <PageTemplate title="Books">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl mb-4">Textbooks & Resources</h2>
        {loading ? (
          <div className="p-4 text-center">Loading books and resources...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">Required Textbooks</h3>
              {textbooks.length === 0 ? (
                <p className="mt-2 text-gray-500">No textbooks found.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {textbooks.map((book, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-gray-600">{book.author}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-medium">Digital Resources</h3>
              {digitalResources.length === 0 ? (
                <p className="mt-2 text-gray-500">No digital resources found.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {digitalResources.map((resource, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-600">{resource.source}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Books;