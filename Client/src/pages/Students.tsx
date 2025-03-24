import React, { useState, useEffect, ChangeEvent } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getStudents, postStudent } from "@/services/api";
import * as XLSX from "xlsx";
import { ArrowUpDown, X, UserPlus, Upload } from "lucide-react";

interface Student {
  ID: number;
  name: string;
  class: string;
  status: string;
}

interface NewStudent {
  name: string;
  class: string;
  status: string;
}

type SortField = "ID" | "name" | "class" | "status";
type SortDirection = "asc" | "desc";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: "",
    class: "",
    status: "Active"
  });
  const [formError, setFormError] = useState("");

  const handleExcelFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select an Excel file first");
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async function (e) {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Send data to backend using the postData function directly
        const response = await postStudent(jsonData);

        // Update students with the response
        setStudents(response);
        setFilteredStudents(response);
      } catch (err) {
        console.error("Error processing Excel file:", err);
        setError(
          "Failed to process Excel file. Please check the format and try again."
        );
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the Excel file.");
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);

    // Reset the input value so the same file can be uploaded again if needed
    e.target.value = "";
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents();
        setStudents(response.students);
        setFilteredStudents(response.students);
        setError("");
      } catch (err) {
        setError("Failed to load students. Please try again later.");
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(student.ID + "")
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.class?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Apply sorting whenever sortField or sortDirection changes
  useEffect(() => {
    if (!sortField) return;

    const sorted = [...filteredStudents].sort((a, b) => {
      // Handle numeric ID sorting specially
      if (sortField === "ID") {
        const aVal = a[sortField] || 0;
        const bVal = b[sortField] || 0;
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      // For string fields
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStudents(sorted);
  }, [sortField, sortDirection, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: SortField) => {
    // If clicking on the same field, toggle direction
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking on a new field, set it and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Function to display sort indicators
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="inline ml-1 h-4 w-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown
        className={`inline ml-1 h-4 w-4 ${
          sortDirection === "asc" ? "text-blue-500" : "text-red-500"
        }`}
      />
    );
  };

  // Handle opening the add student modal
  const handleAddStudent = () => {
    setShowModal(true);
    setNewStudent({
      name: "",
      class: "",
      status: "Active"
    });
    setFormError("");
  };

  // Handle input changes in the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate the minimum unique ID that doesn't exist already
  const generateUniqueID = (): number => {
    // Start with the minimum possible ID
    const minPossibleID = 100;

    if (students.length === 0) {
      return minPossibleID;
    }

    // Sort existing IDs
    const existingIDs = students
      .map((student) => student.ID)
      .sort((a, b) => a - b);

    // Find the first gap in the sequence or use the next number after the maximum
    let candidateID = minPossibleID;

    for (let i = 0; i < existingIDs.length; i++) {
      if (existingIDs[i] !== candidateID) {
        // Found a gap
        return candidateID;
      }
      candidateID++;
    }

    // If no gaps were found, return the next number after the highest
    return candidateID;
  };

  // Get color class based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Graduated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle form submission
  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newStudent.name.trim()) {
      setFormError("Student name is required");
      return;
    }

    if (!newStudent.class.trim()) {
      setFormError("Class is required");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      // Generate a unique ID for the new student
      const uniqueID = generateUniqueID();

      // Create the student object with the generated ID
      const studentWithID = {
        ...newStudent,
        ID: uniqueID,
      };

      // Send the new student to the server
      const response = await postStudent([studentWithID]);

      // Update the state with the new data
      setStudents(response);
      setFilteredStudents(response);

      // Close the modal
      setShowModal(false);
    } catch (err) {
      console.error("Error adding student:", err);
      setFormError("Failed to add student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the status label with appropriate color
  const renderStatusCell = (status: string) => {
    const colorClass = getStatusColor(status);
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {status || "-"}
      </span>
    );
  };

  return (
    <PageTemplate title="Student Management">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {loading ? (
            <div className="p-4 text-center">Loading students...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="p-4 border rounded shadow-sm">
              <h3 className="font-medium">Student List</h3>
              {filteredStudents.length === 0 ? (
                <p className="mt-2 text-gray-500">
                  No students found matching your search.
                </p>
              ) : (
                <div className="w-full mt-2">
                  <div className="border rounded overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th
                              className="p-2 text-left cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("ID")}
                            >
                              ID {getSortIndicator("ID")}
                            </th>
                            <th
                              className="p-2 text-left cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("name")}
                            >
                              Name {getSortIndicator("name")}
                            </th>
                            <th
                              className="p-2 text-left cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("class")}
                            >
                              Class {getSortIndicator("class")}
                            </th>
                            <th
                              className="p-2 text-left cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("status")}
                            >
                              Status {getSortIndicator("status")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="p-2">{student.ID || "-"}</td>
                              <td className="p-2">{student.name || "-"}</td>
                              <td className="p-2">{student.class || "-"}</td>
                              <td className="p-2">
                                {renderStatusCell(student.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              className="themed-button flex items-center gap-2"
              onClick={handleAddStudent}
              disabled={uploading || isSubmitting}
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </button>

            <label
              className={`px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all font-medium shadow-lg flex items-center gap-2 cursor-pointer transform hover:translate-y-px ${
                uploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Upload className="h-5 w-5" />
              {uploading ? "Uploading..." : "Import Excel"}
              <input
                type="file"
                onChange={handleExcelFileChange}
                accept=".xlsx,.xls"
                className="hidden"
                disabled={uploading || isSubmitting}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fadeIn  border-[var(--secondary-color)] border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Student
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

            <form onSubmit={handleSubmitStudent} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={newStudent.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class*
                </label>
                <input
                  type="text"
                  name="class"
                  value={newStudent.class}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                  placeholder="Enter class (e.g. 1/ A)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newStudent.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                >
                  <option
                    value="Active"
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </option>
                  <option
                    value="Inactive"
                    className="bg-gray-100 text-gray-800"
                  >
                    Inactive
                  </option>
                  <option value="Suspended" className="bg-red-100 text-red-800">
                    Suspended
                  </option>
                  <option
                    value="Graduated"
                    className="bg-blue-100 text-blue-800"
                  >
                    Graduated
                  </option>
                </select>
                {/* Color indicator for selected status */}
                <div
                  className="mt-2 px-3 py-1 inline-block rounded-full text-sm font-medium text-white"
                  style={{
                    backgroundColor:
                      newStudent.status === "Active"
                        ? "#10B981"
                        : newStudent.status === "Inactive"
                        ? "#6B7280"
                        : newStudent.status === "Suspended"
                        ? "#EF4444"
                        : "#3B82F6",
                  }}
                >
                  {newStudent.status}
                </div>
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
                  className="themed-button px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium shadow-sm"
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
                    "Add Student"
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

export default Students;
