import React, { useState, useEffect, ChangeEvent } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getTeachers, postTeachers } from "@/services/api";
import * as XLSX from "xlsx";
import { ArrowUpDown, X, UserPlus, Upload } from "lucide-react";

interface Teacher {
  ID: number;
  name: string;
  classes: string[];
  lessons: { [key: string]: string[] };
  status: string;
}

interface NewTeacher {
  name: string;
  classes: string;
  lessons: string;
  status: string;
}

type SortField = "ID" | "name" | "status";
type SortDirection = "asc" | "desc";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTeacher, setNewTeacher] = useState<NewTeacher>({
    name: "",
    classes: "",
    lessons: "",
    status: "Active",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers();
        setTeachers(response.teachers);
        setFilteredTeachers(response.teachers);
        setError("");
      } catch (err) {
        setError("Failed to load teachers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(teacher.ID)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.classes.some((cls) =>
          cls.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  useEffect(() => {
    if (!sortField) return;
    const sorted = [...filteredTeachers].sort((a, b) => {
      if (sortField === "ID") {
        return sortDirection === "asc" ? a.ID - b.ID : b.ID - a.ID;
      }
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    });
    setFilteredTeachers(sorted);
  }, [sortField, sortDirection]);

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
        
        const formattedData = jsonData.map((row: any) => ({
          ID: row.ID,
          name: row.name,
          classes: row.classes.split(",").map((c: string) => c.trim()),
          lessons: JSON.parse(row.lessons || "{}"),
          status: row.status || "Active",
        }));
        
        const response = await postTeachers(formattedData);
        setTeachers(response);
        setFilteredTeachers(response);
      } catch (err) {
        setError("Failed to process Excel file.");
      } finally {
        setUploading(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
  };

  const getSortIndicator = (field: SortField) => (
    <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${
      sortField === field 
        ? sortDirection === "asc" 
          ? "text-[var(--primary-color)]" 
          : "text-[var(--secondary-color)] rotate-180" 
        : "text-gray-400"
    }`} />
  );

  const handleAddTeacher = () => {
    setShowModal(true);
    setNewTeacher({ name: "", classes: "", lessons: "", status: "Active" });
    setFormError("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewTeacher((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateUniqueID = () => {
    return teachers.length === 0 
      ? 1000 
      : Math.max(...teachers.map(t => t.ID)) + 1;
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
      : status === "Inactive"
      ? "bg-gray-100 text-gray-600"
      : "bg-red-100 text-red-800"; // Changed "On Leave" to red
  };

  const handleSubmitTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.classes || !newTeacher.lessons) {
      setFormError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const classesArray = newTeacher.classes.split(",").map(c => c.trim());
      const lessonsArray = newTeacher.lessons.split(",").map(l => l.trim());
      const lessonsObj: { [key: string]: string[] } = {};
      classesArray.forEach((cls, i) => {
        lessonsObj[cls] = lessonsArray[i]?.split(";").map(l => l.trim()) || [];
      });

      const teacherWithID = {
        ID: generateUniqueID(),
        name: newTeacher.name,
        classes: classesArray,
        lessons: lessonsObj,
        status: newTeacher.status,
      };

      const response = await postTeachers([teacherWithID]);
      setTeachers(response);
      setFilteredTeachers(response);
      setShowModal(false);
    } catch (err) {
      setFormError("Failed to add teacher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTemplate title="Teacher Management">
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search teachers by name, ID, or class..."
            className="w-full p-4 pr-10 rounded-lg border border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--glow-color)] bg-white shadow-sm transition-all duration-300 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[var(--border-color)]">
          {loading ? (
            <div className="p-6 text-center text-gray-500 animate-pulse">Loading teachers...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 bg-red-50">{error}</div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Teacher List</h3>
                <span className="text-sm text-gray-500">{filteredTeachers.length} teachers</span>
              </div>

              {filteredTeachers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No teachers found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(--accent-color)]">
                      <tr>
                        {["ID", "name", "status"].map((field) => (
                          <th
                            key={field}
                            className="p-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-[var(--glow-color)] transition-colors"
                            onClick={() => handleSort(field as SortField)}
                          >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                            {getSortIndicator(field as SortField)}
                          </th>
                        ))}
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Classes & Lessons</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map((teacher) => (
                        <tr 
                          key={teacher.ID} 
                          className="border-t border-[var(--border-color)] hover:bg-[var(--accent-color)] transition-colors"
                        >
                          <td className="p-3 text-gray-700">{teacher.ID}</td>
                          <td className="p-3 font-medium text-gray-800">{teacher.name}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                              {teacher.status}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">
                            {teacher.classes.map((cls) => (
                              <div key={cls} className="mb-1">
                                <span className="font-medium text-[var(--primary-color)]">{cls}:</span>{" "}
                                {teacher.lessons[cls]?.join(", ") || "N/A"}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleAddTeacher}
            className="px-5 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--button-hover-bg)] focus:ring-2 focus:ring-[var(--glow-color)] transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={uploading || isSubmitting}
          >
            <UserPlus className="h-5 w-5" /> Add Teacher
          </button>
          <label
            className={`px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-[var(--glow-color)] transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add New Teacher</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-[var(--accent-color)] rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border-l-4 border-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitTeacher} className="space-y-5">
              {[
                { name: "name", label: "Teacher Name*", placeholder: "Enter full name" },
                { name: "classes", label: "Classes* (comma-separated)", placeholder: "e.g., 1/A, 2/B" },
                { name: "lessons", label: "Lessons* (comma-separated)", placeholder: "e.g., Math;English, Science" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={newTeacher[field.name as keyof NewTeacher]}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--glow-color)] transition-all shadow-sm"
                    placeholder={field.placeholder}
                    required
                  />
                  {field.name === "lessons" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Example: For classes "1/A, 2/B", enter "Math;English, Science" to assign Math and English to 1/A, Science to 2/B.
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={newTeacher.status}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--glow-color)] transition-all shadow-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-[var(--accent-color)] rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--button-hover-bg)] focus:ring-2 focus:ring-[var(--glow-color)] transition-all flex items-center gap-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSubmitting ? "Adding..." : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTemplate>
  );
};

export default Teachers;