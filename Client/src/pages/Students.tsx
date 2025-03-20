import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getStudents } from "@/services/api";

interface Student {
  name: string;
  id: string;
  class: string;
  status: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents();
        setStudents(response.students);
        setFilteredStudents(response.students);
        setLoading(false);
      } catch (err) {
        setError("Failed to load students. Please try again later.");
        setLoading(false);
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {loading ? (
            <div className="p-4 text-center">Loading students...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="p-4 border rounded">
              <h3 className="font-medium">Student List</h3>
              {filteredStudents.length === 0 ? (
                <p className="mt-2 text-gray-500">No students found matching your search.</p>
              ) : (
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
                    {filteredStudents.map((student, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.id}</td>
                        <td className="p-2">{student.class}</td>
                        <td className="p-2">{student.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
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