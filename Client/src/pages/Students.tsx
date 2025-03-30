import React, { useState, useEffect, ChangeEvent } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getStudents, postStudents } from "@/services/API";
import * as XLSX from "xlsx";
import { ArrowUpDown, X, UserPlus, FileSpreadsheet, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

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
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const response = await postStudents(jsonData);

        setStudents(response);
        setFilteredStudents(response);
        toast.success("Students imported successfully.");
      } catch (err: any) {
        console.error("Failed to process Excel file: ", err);
        toast.error("Failed to process Excel file. Please check the file format and try again.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
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
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(student.ID)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  useEffect(() => {
    if (!sortField) return;
    const sorted = [...filteredStudents].sort((a, b) => {
      if (sortField === "ID") {
        return sortDirection === "asc" ? a.ID - b.ID : b.ID - a.ID;
      }
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    setFilteredStudents(sorted);
  }, [sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
  };

  const getSortIndicator = (field: SortField) => (
    <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${
      sortField === field 
        ? sortDirection === "asc" 
          ? "text-indigo-600" 
          : "text-indigo-600 rotate-180" 
        : "text-gray-400"
    }`} />
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": 
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Inactive": 
        return "bg-gray-100 text-gray-600 border border-gray-200";
      case "Suspended": 
        return "bg-red-50 text-red-600 border border-red-200";
      case "Graduated": 
        return "bg-blue-50 text-blue-600 border border-blue-200";
      default: 
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleAddStudent = () => {
    setShowModal(true);
    setNewStudent({ name: "", class: "", status: "Active" });
    setFormError("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateUniqueID = () => {
    return students.length === 0 
      ? 1000 
      : Math.max(...students.map(s => s.ID)) + 1;
  };

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.class) {
      setFormError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const studentWithID = {
        ID: generateUniqueID(),
        ...newStudent,
      };

      const response = await postStudents([studentWithID]);
      setStudents(response);
      setFilteredStudents(response);
      setShowModal(false);
    } catch (err) {
      setFormError("Failed to add student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTemplate>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Elegant Header */}
          <div className="bg-white shadow-xl rounded-2xl p-6 flex justify-between items-center border-l-4" style={{ borderColor: 'var(--primary-color)' }}>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Student Management
              </h1>
              <p className="text-gray-500 mt-2">
                Manage and organize your student records efficiently
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleAddStudent}
                className="themed-button"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add Student</span>
              </button>
              <label 
                className="group flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:-translate-y-1 hover:scale-105 shadow-lg cursor-pointer"
              >
                <FileSpreadsheet className="h-5 w-5" />
                <span>Import Excel</span>
                <input
                  type="file"
                  onChange={handleExcelFileChange}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search students by name, ID, or class..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Loading and Error States */}
            {loading ? (
              <div className="text-center py-8 text-gray-500 animate-pulse">
                Loading students...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students found
              </div>
            ) : (
              /* Student List */
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-indigo-50 border-b border-gray-200">
                    <tr>
                      {["ID", "Name", "Class", "Status"].map((header) => (
                        <th 
                          key={header} 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition-colors"
                          onClick={() => handleSort(header.toLowerCase() as SortField)}
                        >
                          <div className="flex items-center">
                            {header}
                            {getSortIndicator(header.toLowerCase() as SortField)}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr 
                        key={student.ID} 
                        className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          #{student.ID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {student.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusVariant(student.status)}`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                              title="Edit Student"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-full transition-colors"
                              title="Remove Student"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Student Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Add New Student</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border-l-4 border-red-500">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitStudent} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class*
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={newStudent.class}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Enter class (e.g. 1/A)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newStudent.status}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="themed-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {isSubmitting ? "Adding..." : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Students;