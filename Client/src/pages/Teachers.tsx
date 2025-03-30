import React, { useState, useEffect, ChangeEvent } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getTeachers, postTeachers } from "@/services/API";
import * as XLSX from "xlsx";
import { ArrowUpDown, X, UserPlus, Upload, FileSpreadsheet, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

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
  const [selectedTeacherDetails, setSelectedTeacherDetails] = useState<{
    teacherID: number | null;
    selectedClass: string | null;
  }>({
    teacherID: null,
    selectedClass: null
  });

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
        toast.success("Teachers imported successfully.");
      } catch (err:any) {
        console.error("Failed to process Excel file: ", err);
        toast.error("Failed to process Excel file. Please check the file format and try again.");
        console.log(err.message)      
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
          ? "text-indigo-600" 
          : "text-indigo-600 rotate-180" 
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": 
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Inactive": 
        return "bg-gray-100 text-gray-600 border border-gray-200";
      case "On Leave": 
        return "bg-amber-50 text-amber-600 border border-amber-200";
      default: 
        return "bg-gray-100 text-gray-600";
    }
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
    <PageTemplate >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Elegant Header */}
          <div className="bg-white shadow-xl rounded-2xl p-6 flex justify-between items-center border-l-4" style={{ borderColor: 'var(--primary-color)' }}>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Teacher Management
              </h1>
              <p className="text-gray-500 mt-2">
                Manage and organize your teaching staff efficiently
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleAddTeacher}
                className="themed-button"
                >
                <UserPlus className="h-5 w-5" />
                <span>Add Teacher</span>
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
                placeholder="Search teachers by name, ID, or class..."
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
                Loading teachers...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No teachers found
              </div>
            ) : (
              /* Teacher List */
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-indigo-50 border-b border-gray-200">
                    <tr>
                      {["ID", "Name", "Status"].map((header) => (
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
                        Classes & Lessons
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => (
                      <tr 
                        key={teacher.ID} 
                        className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          #{teacher.ID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {teacher.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusVariant(teacher.status)}`}
                          >
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {teacher.classes.map((cls) => (
                            <div 
                              key={cls} 
                              className="mb-2 bg-gray-100 rounded-lg p-2 hover:bg-indigo-50 transition-colors cursor-pointer"
                              onClick={() => setSelectedTeacherDetails({
                                teacherID: teacher.ID,
                                selectedClass: cls
                              })}
                            >
                              <span className="font-semibold text-indigo-600">{cls}</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {teacher.lessons[cls]?.join(", ") || "No lessons"}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                              title="Edit Teacher"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-full transition-colors"
                              title="Remove Teacher"
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

        {/* Add Teacher Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Add New Teacher</h3>
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

              <form onSubmit={handleSubmitTeacher} className="space-y-5">
                {[
                  { name: "name", label: "Teacher Name*", placeholder: "Enter full name" },
                  { name: "classes", label: "Classes* (comma-separated)", placeholder: "e.g., 1/A, 2/B" },
                  { name: "lessons", label: "Lessons* (comma-separated)", placeholder: "e.g., Math;English, Science" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={newTeacher[field.name as keyof NewTeacher]}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      placeholder={field.placeholder}
                      required
                    />
                    {field.name === "lessons" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Example: For classes "1/A, 2/B", enter "Math;English, Science" to assign Math and English to 1/A, Science to 2/B.
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={newTeacher.status}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                    {isSubmitting ? "Adding..." : "Add Teacher"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lessons Details Modal */}
        {selectedTeacherDetails.teacherID && selectedTeacherDetails.selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Lessons for {selectedTeacherDetails.selectedClass}
                </h3>
                <button
                  onClick={() => setSelectedTeacherDetails({ teacherID: null, selectedClass: null })}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {(() => {
                const selectedTeacher = teachers.find(
                  t => t.ID === selectedTeacherDetails.teacherID
                );
                const lessons = selectedTeacher?.lessons[selectedTeacherDetails.selectedClass || ''] || [];

                return (
                  <div className="space-y-3">
                    {lessons.length > 0 ? (
                      lessons.map((lesson, index) => (
                        <div 
                          key={index} 
                          className="bg-indigo-50 p-3 rounded-lg flex items-center"
                        >
                          <span className="mr-3 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </span>
                          <span className="font-medium text-gray-700">{lesson}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No lessons found for this class</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Teachers;

