import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import ImageCarousel from "@/components/ImageCarousel";
import {
  Baby,
  UserRound,
  LineChart,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { getAnnouncements, getSchoolImages } from "@/services/API";

interface Announcement {
  title: string;
  description: string;
  imageUrl: string;
  publishDate: string;
}

interface Image {
  url: string;
  alt: string;
  caption: string;
}

const RoleSelectionUI = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schoolImages, setSchoolImages] = useState<Image[]>([]);

  // Fetch announcements from API
  useEffect(() => {
    const fetchSchoolImages = async () => {
      try {
        setIsLoading(true);
        const response = await getSchoolImages();
        setSchoolImages(response.images);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolImages();
  }, []);

  // Auto rotate images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === schoolImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [schoolImages.length]);

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const response = await getAnnouncements();
        setAnnouncements(response.announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast.error("Failed to load announcements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? schoolImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === schoolImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleRoleSelect = async (role: string) => {
    try {
      sessionStorage.setItem("userRole", role);
      navigate(`/home`, { state: { role } });
    } catch (error) {
      toast.error(`Error selecting role: ${error}`);
      console.error(`Error with ${role} request:`, error);
    }
  };

  const getLogo = (role: string | null) => {
    let gradientClasses;

    switch (role) {
      case "Student":
        gradientClasses = "from-yellow-500 to-orange-600";
        break;
      case "Teacher":
        gradientClasses = "from-blue-500 to-indigo-700";
        break;
      case "Advisor":
        gradientClasses = "from-purple-500 to-indigo-700";
        break;
      default:
        gradientClasses = "from-green-400 to-blue-600";
        break;
    }

    return (
      <div className="flex items-center justify-center mb-6">
        <h1
          className={`text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${gradientClasses}`}
        >
          Winoom
        </h1>
      </div>
    );
  };

  const roleData = [
    {
      title: "Student",
      description:
        "Access your classes, assignments, and personalized learning resources",
      icon: Baby,
      colors: {
        primary: "bg-gradient-to-br from-yellow-400 to-orange-500",
        secondary: "bg-yellow-50",
        hover: "bg-gradient-to-br from-yellow-500 to-orange-600",
        text: "text-yellow-600",
        border: "border-yellow-400",
      },
    },
    {
      title: "Teacher",
      description:
        "Manage your classes, create assignments, and access teaching resources",
      icon: UserRound,
      colors: {
        primary: "bg-gradient-to-br from-blue-400 to-indigo-600",
        secondary: "bg-blue-50",
        hover: "bg-gradient-to-br from-blue-500 to-indigo-700",
        text: "text-blue-600",
        border: "border-blue-400",
      },
    },
    {
      title: "Advisor",
      description:
        "Review student progress, generate reports, and provide academic guidance",
      icon: LineChart,
      colors: {
        primary: "bg-gradient-to-br from-purple-400 to-indigo-600",
        secondary: "bg-purple-50",
        hover: "bg-gradient-to-br from-purple-500 to-indigo-700",
        text: "text-purple-600",
        border: "border-purple-400",
      },
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic background based on hovered role */}
      <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out z-0">
        {hoveredRole === "Student" && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-80"></div>
        )}
        {hoveredRole === "Teacher" && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-80"></div>
        )}
        {hoveredRole === "Advisor" && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-80"></div>
        )}
        {!hoveredRole && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-indigo-100 opacity-80"></div>
        )}
      </div>

      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{
            background:
              hoveredRole === "Student"
                ? "#fbbf24"
                : hoveredRole === "Teacher"
                ? "#3b82f6"
                : hoveredRole === "Advisor"
                ? "#8b5cf6"
                : "#31E52B",
          }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{
            background:
              hoveredRole === "Student"
                ? "#f97316"
                : hoveredRole === "Teacher"
                ? "#4f46e5"
                : hoveredRole === "Advisor"
                ? "#7c3aed"
                : "#0BAF1B",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{
            background:
              hoveredRole === "Student"
                ? "#fb923c"
                : hoveredRole === "Teacher"
                ? "#60a5fa"
                : hoveredRole === "Advisor"
                ? "#a78bfa"
                : "#2DF00F",
          }}
        ></div>
      </div>

      <div className="w-full max-w-6xl z-10">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          {getLogo(hoveredRole)}
          <p className="text-slate-600 text-xl font-light mx-auto max-w-xl mb-8">
            Choose your role to begin your personalized educational journey
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {roleData.map((role) => (
            <div
              key={role.title}
              className="group relative"
              onMouseEnter={() => setHoveredRole(role.title)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleRoleSelect(role.title)}
            >
              <div
                className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-500 transform cursor-pointer ${
                  hoveredRole === role.title
                    ? "scale-105 shadow-2xl"
                    : "hover:shadow-xl"
                }`}
              >
                {/* Card header with gradient */}
                <div
                  className={`${role.colors.primary} h-40 flex justify-center items-center relative transition-all duration-500 group-hover:${role.colors.hover}`}
                >
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative z-10">
                    <role.icon
                      size={80}
                      className="text-white drop-shadow-lg"
                    />

                    {/* Bouncing stars for Student card */}
                    {role.title === "Student" && hoveredRole === "Student" && (
                      <>
                        <div className="absolute -top-2 -left-8 w-8 h-8 text-yellow-300 animate-bounce animation-delay-300">
                          ★
                        </div>
                        <div className="absolute -bottom-6 -right-10 w-8 h-8 text-yellow-300 animate-bounce animation-delay-700">
                          ★
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card content */}
                <div
                  className={`${role.colors.secondary} p-8 text-center group-hover:bg-white transition-all duration-300`}
                >
                  <h3 className={`text-2xl font-bold ${role.colors.text} mb-4`}>
                    {role.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {role.description}
                  </p>
                  <button
                    className={`px-8 py-3 rounded-full shadow-md font-medium text-white ${role.colors.primary} transition-all duration-300 transform group-hover:translate-y-0 group-hover:shadow-lg`}
                  >
                    Continue as {role.title}
                  </button>

                  {/* Special elements for Student card */}
                  {role.title === "Student" && hoveredRole === "Student" && (
                    <div className="mt-3 flex justify-center gap-3">
                      <span className="inline-block animate-pulse">🎒</span>
                      <span className="inline-block animate-bounce">🎨</span>
                      <span className="inline-block animate-pulse">📚</span>
                      <span className="inline-block animate-bounce">🧩</span>
                    </div>
                  )}
                </div>

                {/* Animated border on hover */}
                <div
                  className={`absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 group-hover:${role.colors.border} opacity-0 group-hover:opacity-100`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* School Image Carousel */}
        {schoolImages.length > 0 ? (
          <ImageCarousel schoolImages={schoolImages} />
        ) : (
          <div className="relative w-full h-[32rem] max-w-4xl mx-auto bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden">
            <p className="text-gray-500 text-lg font-medium animate-pulse">
              Loading images...
            </p>
          </div>
        )}

        {/* Announcements Section */}
        <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">
              School Announcements
            </h3>
            <Calendar className="text-slate-600" size={24} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No announcements available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* This would render actual API data */}
              {announcements.map((announcement: Announcement, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {announcement.imageUrl && (
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 mb-1">
                        {formatDate(announcement.publishDate)}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        {announcement.title}
                      </h4>
                      <p className="text-slate-600 text-sm line-clamp-3">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fallback UI in case API is not ready during development */}
              {announcements.length === 0 && (
                <>
                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src="/api/placeholder/200/200"
                          alt="Mayor Visit"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-500 mb-1">
                          March 25, 2025
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">
                          The Mayor Visited Our School
                        </h4>
                        <p className="text-slate-600 text-sm line-clamp-3">
                          We were honored to welcome Mayor Johnson for a special
                          assembly where students presented their community
                          improvement projects.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 mb-1">
                        March 10, 2025
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        School Trip on April 15th
                      </h4>
                      <p className="text-slate-600 text-sm">
                        The annual science museum field trip is scheduled for
                        April 15th. Permission slips due by April 5th. Contact
                        your homeroom teacher for details.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 mb-1">
                        March 5, 2025
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        Exam Program Announced
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Final examination schedules have been posted. Please
                        check the student portal for your personalized exam
                        timetable and preparation resources.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center shadow-md ${
                  hoveredRole === "Student"
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : hoveredRole === "Teacher"
                    ? "bg-gradient-to-br from-blue-400 to-indigo-600"
                    : hoveredRole === "Advisor"
                    ? "bg-gradient-to-br from-purple-400 to-indigo-600"
                    : "bg-gradient-to-br from-green-400 to-indigo-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">
                Adaptive Learning
              </h4>
              <p className="text-slate-600">
                Personalized pathways that adapt to your learning style and pace
              </p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center shadow-md ${
                  hoveredRole === "Student"
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : hoveredRole === "Teacher"
                    ? "bg-gradient-to-br from-blue-400 to-indigo-600"
                    : hoveredRole === "Advisor"
                    ? "bg-gradient-to-br from-purple-400 to-indigo-600"
                    : "bg-gradient-to-br from-green-400 to-indigo-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">
                Collaborative Learning
              </h4>
              <p className="text-slate-600">
                Connect with peers and educators in real-time across all devices
              </p>
            </div>
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center shadow-md ${
                  hoveredRole === "Student"
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : hoveredRole === "Teacher"
                    ? "bg-gradient-to-br from-blue-400 to-indigo-600"
                    : hoveredRole === "Advisor"
                    ? "bg-gradient-to-br from-purple-400 to-indigo-600"
                    : "bg-gradient-to-br from-green-400 to-indigo-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">
                Advanced Security
              </h4>
              <p className="text-slate-600">
                Enterprise-grade security and privacy protections for all users
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-500 mb-3">
            © 2025 Winoom Education Platform • All rights reserved
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-700 transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-slate-700 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />

      {/* CSS Animation Definitions */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default RoleSelectionUI;
