import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { getHomework, submitHomework, editHomework, askQuestionAboutHomework } from "@/services/API";
import { BookOpen, Calendar, Clock, CheckCircle, Edit2, Send, HelpCircle, User, Users, X } from "lucide-react";
import toast from "react-hot-toast";

interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  description: string;
  status: "pending" | "submitted";
  submittedCount: number;
  attachment?: string;
  submittedContent?: string;
}

interface SubmitFormData {
  homeworkId: string;
  content: string;
  attachment?: File | null;
}

const Homework = () => {
  const [homeworkItems, setHomeworkItems] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
  const [submitForm, setSubmitForm] = useState<SubmitFormData>({
    homeworkId: "",
    content: "",
    attachment: null,
  });

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await getHomework();
        setHomeworkItems(response.homeworkItems);
        setLoading(false);
      } catch (err) {
        setError("Failed to load homework assignments. Please try again later.");
        setLoading(false);
        console.error("Error fetching homework:", err);
      }
    };

    fetchHomework();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmitForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSubmitForm((prev) => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleOpenSubmitModal = (homework: HomeworkItem) => {
    setSelectedHomework(homework);
    setSubmitForm({
      homeworkId: homework.id,
      content: "",
      attachment: null,
    });
    setShowSubmitModal(true);
  };

  const handleOpenEditModal = (homework: HomeworkItem) => {
    setSelectedHomework(homework);
    setSubmitForm({
      homeworkId: homework.id,
      content: homework.submittedContent || "",
      attachment: null,
    });
    setShowEditModal(true);
  };

  const handleOpenQuestionModal = (homework: HomeworkItem) => {
    setSelectedHomework(homework);
    setShowQuestionModal(true);
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await submitHomework(submitForm);
      
      // Update the local state with the updated homework list
      setHomeworkItems(response.homeworkItems);
      
      // Close modal and reset form
      setShowSubmitModal(false);
      setSubmitForm({
        homeworkId: "",
        content: "",
        attachment: null,
      });
      
      toast.success("Homework submitted successfully!");
    } catch (err) {
      setFormError("Failed to submit homework. Please try again.");
      console.error("Error submitting homework:", err);
      toast.error("Failed to submit homework. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await editHomework(submitForm);
      
      // Update the local state with the updated homework list
      setHomeworkItems(response.homeworkItems);
      
      // Close modal and reset form
      setShowEditModal(false);
      setSubmitForm({
        homeworkId: "",
        content: "",
        attachment: null,
      });
      
      toast.success("Homework edited successfully!");
    } catch (err) {
      setFormError("Failed to edit homework. Please try again.");
      console.error("Error editing homework:", err);
      toast.error("Failed to edit homework. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await askQuestionAboutHomework({
        homeworkId: selectedHomework?.id || "",
        question: submitForm.content,
      });
      
      // Close modal and reset form
      setShowQuestionModal(false);
      setSubmitForm({
        homeworkId: "",
        content: "",
        attachment: null,
      });
      
      toast.success("Question sent successfully!");
    } catch (err) {
      setFormError("Failed to send question. Please try again.");
      console.error("Error sending question:", err);
      toast.error("Failed to send question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDueDateColor = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600 font-bold"; // Overdue
    if (diffDays <= 2) return "text-orange-500"; // Due soon
    return "text-gray-700"; // Normal
  };

  const getHomeworkStatusColor = (status: string) => {
    const statusColors = {
      pending: "bg-blue-100 border-blue-300 text-blue-800",
      submitted: "bg-green-100 border-green-300 text-green-800",
    };
    
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 border-gray-300 text-gray-800";
  };

  const getSubjectColor = (subject: string) => {
    // Generate consistent colors based on subject
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
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <PageTemplate>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white shadow-xl rounded-2xl p-6 flex justify-between items-center border-l-4" style={{ borderColor: 'var(--primary-color)' }}>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Homework Assignments
            </h1>
            <p className="text-gray-500 mt-2">
              View, submit, and manage your homework assignments
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading homework assignments...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="p-4 bg-red-50 rounded-lg text-red-500 border border-red-200 inline-block">
              {error}
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-auto">
            {homeworkItems.length === 0 ? (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">
                  No Homework Assignments
                </h3>
                <p className="text-gray-600 mt-2">
                  You don't have any homework assignments at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {homeworkItems.map((homework) => (
                  <div
                    key={homework.id}
                    className={`p-5 rounded-lg border-l-4 shadow-sm transition-transform hover:scale-101 ${getSubjectColor(
                      homework.subject
                    )}`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-70 shadow-sm">
                            {homework.subject}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            homework.status === "submitted" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {homework.status === "submitted" ? "Submitted" : "Pending"}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mt-2">{homework.title}</h3>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center text-gray-700">
                            <User size={16} className="mr-2" />
                            <span>Teacher: {homework.teacher}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <span className={getDueDateColor(homework.dueDate)}>
                              Due: {homework.dueDate}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-700">
                            <Users size={16} className="mr-2" />
                            <span>{homework.submittedCount} students submitted</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-semibold mb-1">Description:</h4>
                          <p className="text-gray-700 whitespace-pre-line">
                            {homework.description}
                          </p>
                        </div>
                        
                        {homework.submittedContent && (
                          <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-md">
                            <h4 className="font-semibold mb-1">Your Submission:</h4>
                            <p className="text-gray-700">{homework.submittedContent}</p>
                            {homework.attachment && (
                              <div className="mt-2">
                                <a 
                                  href={homework.attachment}
                                  className="inline-flex items-center text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span>View attachment</span>
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {homework.status === "pending" ? (
                          <button
                            onClick={() => handleOpenSubmitModal(homework)}
                            className="themed-button flex items-center justify-center gap-2"
                          >
                            <Send size={16} />
                            Submit Homework
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenEditModal(homework)}
                            className="themed-button flex items-center justify-center gap-2"
                          >
                            <Edit2 size={16} />
                            Edit Submission
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleOpenQuestionModal(homework)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
                        >
                          <HelpCircle size={16} />
                          Ask Question
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Homework Modal */}
      {showSubmitModal && selectedHomework && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fadeIn border-[var(--primary-color)] border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Submit Homework
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium">{selectedHomework.title}</h4>
              <p className="text-sm text-gray-500">{selectedHomework.subject} - Due: {selectedHomework.dueDate}</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border-l-4 border-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitHomework} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Answer*
                </label>
                <textarea
                  name="content"
                  value={submitForm.content}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm min-h-32"
                  placeholder="Type your answer here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachment (optional)
                </label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
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
                      Submitting...
                    </span>
                  ) : (
                    "Submit Homework"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Homework Modal */}
      {showEditModal && selectedHomework && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fadeIn border-[var(--primary-color)] border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Submission
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium">{selectedHomework.title}</h4>
              <p className="text-sm text-gray-500">{selectedHomework.subject} - Due: {selectedHomework.dueDate}</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border-l-4 border-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditHomework} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Answer*
                </label>
                <textarea
                  name="content"
                  value={submitForm.content}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm min-h-32"
                  placeholder="Type your answer here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Attachment (optional)
                </label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm"
                />
                {selectedHomework.attachment && (
                  <div className="mt-2 text-sm text-gray-600">
                    Current attachment: 
                    <a 
                      href={selectedHomework.attachment}
                      className="ml-1 text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View file
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {showQuestionModal && selectedHomework && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fadeIn border-[var(--primary-color)] border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Ask Question About Homework
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium">{selectedHomework.title}</h4>
              <p className="text-sm text-gray-500">{selectedHomework.subject} - Teacher: {selectedHomework.teacher}</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border-l-4 border-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleAskQuestion} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Question*
                </label>
                <textarea
                  name="content"
                  value={submitForm.content}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all shadow-sm min-h-32"
                  placeholder="Type your question here..."
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
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
                      Sending...
                    </span>
                  ) : (
                    "Send Question"
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

export default Homework;