import React, { useState, useEffect, ReactElement } from 'react';
import PageTemplate from "@/components/PageTemplate";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  GraduationCap,
  BookOpen,
  ClipboardList,
  Calendar,
  TrendingUp,
  Star,
  School,
  Users, 
  BookmarkCheck,
  LoaderPinwheel,
  AlertTriangle,
  Sparkles,
  Rocket,
  Medal
} from 'lucide-react';

// Import API functions
import { 
  getStudentDashboardData, 
  getTeacherDashboardData, 
  getAdvisorDashboardData 
} from "@/services/API";

// Dashboard data interfaces
interface StudentDashboardData {
  totalCourses: number;
  assignments: number;
  upcomingEvents: number;
  attendanceData: { name: string; value: number }[];
  gradesData: { name: string; value: number }[];
}

interface TeacherDashboardData {
  totalStudents: number;
  performancePercentage: string;
  completedLessons: number;
  classesData: { name: string; value: number }[];
  studentsByYearData: { name: string; value: number }[];
}

interface AdvisorDashboardData {
  totalStudents: number;
  totalClasses: number;
  totalPrograms: number;
  enrollmentData: { name: string; value: number }[];
  performanceData: { name: string; value: number }[];
}

// Dashboard data types
interface DashboardProps {
  role: 'Student' | 'Teacher' | 'Advisor';
}

const Home: React.FC = () => {
  const [role, setRole] = useState<DashboardProps['role']>('Student');
  const [dashboardData, setDashboardData] = useState<
    StudentDashboardData | TeacherDashboardData | AdvisorDashboardData | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Retrieve role and fetch dashboard data
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole') || 'Student';
    setRole(storedRole as DashboardProps['role']);

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        switch (storedRole) {
          case 'Student':
            const studentData = await getStudentDashboardData();
            setDashboardData(studentData);
            break;
          case 'Teacher':
            const teacherData = await getTeacherDashboardData();
            setDashboardData(teacherData);
            break;
          case 'Advisor':
            const advisorData = await getAdvisorDashboardData();
            setDashboardData(advisorData);
            break;
          default:
            throw new Error('Invalid role');
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Shared dashboard components
  const DashboardCard = ({ 
    icon, 
    title, 
    value, 
    color 
  }: { 
    icon: React.ReactNode, 
    title: string, 
    value: string | number, 
    color: string 
  }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div 
        className="rounded-full p-3 bg-opacity-10 animate-pulse"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm tracking-wider uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 animate-text bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text">
          {value}
        </h3>
      </div>
    </div>
  );

  const PieChartComponent = ({ 
    data, 
    title 
  }: { 
    data: { name: string; value: number }[], 
    title: ReactElement<any, any> | string
  }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={[ 
                  'var(--primary-color)', 
                  '#22c55e', 
                  '#f43f5e', 
                  '#6366f1', 
                  '#f97316'
                ][index % 5]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: '10px', 
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
            cursor={{ fill: 'transparent' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  // Loading and Error States
  if (loading) {
    return (
      <PageTemplate>
        <div className="flex justify-center items-center h-full space-x-4">
          <LoaderPinwheel className="animate-spin text-primary-500" size={48} />
          <p className="text-2xl text-gray-600">Loading Dashboard...</p>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate>
        <div className="flex justify-center items-center h-full space-x-4 bg-red-50 p-8 rounded-2xl">
          <AlertTriangle className="text-red-500" size={48} />
          <div>
            <h2 className="text-2xl font-bold text-red-600">Dashboard Error</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </PageTemplate>
    );
  }


  const StudentDashboard = () => {
    const [animateConfetti, setAnimateConfetti] = useState(false);
    const studentData = dashboardData as StudentDashboardData;
  
    // Playful confetti animation trigger
    const triggerConfetti = () => {
      setAnimateConfetti(true);
      setTimeout(() => setAnimateConfetti(false), 6000);
    };
  
    return (
      <div className="space-y-8 relative overflow-hidden">
        {/* Playful Confetti Animation */}
        {animateConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, index) => (
              <div 
                key={index} 
                className="absolute confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    '#10b981', '#6366f1', '#f59e0b', 
                    '#ec4899', '#14b8a6'
                  ][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}
  
        {/* Hero Section with Enhanced Animation */}
        <div 
          className={`
            bg-[linear-gradient(to_right,var(--primary-color),var(--secondary-color))] 
            rounded-2xl p-8 text-white shadow-lg 
            transition-all duration-500 
          `}
          onClick={triggerConfetti}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-4 animate-bounce">
                Welcome, Student! 
                <Sparkles 
                  className="inline-block ml-3 text-yellow-300 animate-spin" 
                  size={40} 
                />
              </h1>
              <p className="text-xl opacity-80 flex items-center">
                Ready to explore and learn today? 
                <Rocket 
                  className="ml-3 animate-[bounce_2s_infinite]" 
                  size={30} 
                />
              </p>
            </div>
            <GraduationCap 
              size={100} 
              className="text-white/20 animate-[wiggle_3s_infinite]" 
            />
          </div>
        </div>
  
        {/* Dashboard Cards with Hover and Click Animations */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              icon: <BookOpen className="text-emerald-500" />, 
              title: "Total Courses", 
              value: studentData.totalCourses, 
              color: "#10b981",
            },
            { 
              icon: <ClipboardList className="text-indigo-500" />, 
              title: "Assignments", 
              value: studentData.assignments, 
              color: "#6366f1" ,
              badge: true
            },
            { 
              icon: <Calendar className="text-amber-500" />, 
              title: "Upcoming Events", 
              value: studentData.upcomingEvents, 
              color: "#f59e0b",
            }
          ].map((card, index) => (
            <div 
              key={card.title}
              className={`
                relative group cursor-pointer 
                transition-all duration-300 
                hover:scale-105 hover:shadow-xl
              `}
              
            >
              <DashboardCard 
                icon={card.icon}
                title={card.title}
                value={card.value}
                color={card.color}
              />
              {card.badge && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-bounce">
                  {card.value}
                </div>
              )}
            </div>
          ))}
        </div>
  
        {/* Pie Charts with Enhanced Interactions */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { 
              data: studentData.attendanceData, 
              title: "Attendance Overview",
              icon: <Medal className="inline-block ml-2 text-yellow-500" />
            },
            { 
              data: studentData.gradesData, 
              title: "Grade Distribution",
              icon: <TrendingUp className="inline-block ml-2 text-green-500" />
            }
          ].map((chart) => (
            <div 
              className="group relative hover:scale-[1.02] transition-transform duration-300"
              key={chart.title}
            >
              <PieChartComponent 
                data={chart.data} 
                title={
                  <span>
                    {chart.title}
                    {chart.icon}
                  </span>
                } 
              />
              <div className="
                absolute inset-0 
                bg-gradient-to-r from-transparent to-blue-100/20 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 
                pointer-events-none
                rounded-2xl
              "></div>
            </div>
          ))}
        </div>
  
        {/* Action Buttons with Playful Hover Effects */}
        <div className="flex space-x-4">
          {[
            { 
              text: "View Courses", 
              icon: <BookOpen className="mr-2" />,
              className: "hover:bg-emerald-500 hover:text-white group"
            },
            { 
              text: "Track Progress", 
              icon: <Star className="mr-2" />,
              className: "hover:bg-indigo-500 hover:text-white group"
            }
          ].map((button) => (
            <button 
              key={button.text}
              className={`
                themed-button 
                transition-all duration-300 
                ${button.className}
              `}
            >
              {button.icon}
              <span className="transition-transform group-hover:scale-110">
                {button.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Teacher Dashboard
  const TeacherDashboard = () => {
    const teacherData = dashboardData as TeacherDashboardData;

    return (
      <div className="space-y-8">
        <div className="bg-[linear-gradient(to_right,var(--primary-color),var(--secondary-color))] rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-4">
                Teacher Dashboard
              </h1>
              <p className="text-xl opacity-80">
                Manage your classes and track student progress
              </p>
            </div>
            <School size={100} className="text-white/20" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <DashboardCard 
            icon={<Users className="text-indigo-500" />} 
            title="Total Students" 
            value={teacherData.totalStudents} 
            color="#6366f1" 
          />
          <DashboardCard 
            icon={<TrendingUp className="text-emerald-500" />} 
            title="Performance" 
            value={teacherData.performancePercentage} 
            color="#10b981" 
          />
          <DashboardCard 
            icon={<BookmarkCheck className="text-amber-500" />} 
            title="Completed Lessons" 
            value={teacherData.completedLessons} 
            color="#f59e0b" 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PieChartComponent 
            data={teacherData.classesData} 
            title="Classes Distribution" 
          />
          <PieChartComponent 
            data={teacherData.studentsByYearData} 
            title="Students by Year" 
          />
        </div>

        <div className="flex space-x-4">
          <button className="themed-button">
            <Users className="mr-2" /> Manage Students
          </button>
          <button className="themed-button">
            <ClipboardList className="mr-2" /> View Reports
          </button>
        </div>
      </div>
    );
  };

  // Advisor Dashboard
  const AdvisorDashboard = () => {
    const advisorData = dashboardData as AdvisorDashboardData;

    return (
      <div className="space-y-8">
        <div className="bg-[linear-gradient(to_right,var(--primary-color),var(--secondary-color))] rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-4">
                Advisor Overview
              </h1>
              <p className="text-xl opacity-80">
                Strategic insights and institutional performance
              </p>
            </div>
            <Users size={100} className="text-white/20" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <DashboardCard 
            icon={<Users className="text-purple-500" />} 
            title="Total Students" 
            value={advisorData.totalStudents} 
            color="#8b5cf6" 
          />
          <DashboardCard 
            icon={<School className="text-emerald-500" />} 
            title="Total Classes" 
            value={advisorData.totalClasses} 
            color="#10b981" 
          />
          <DashboardCard 
            icon={<BookOpen className="text-indigo-500" />} 
            title="Programs" 
            value={advisorData.totalPrograms} 
            color="#6366f1" 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PieChartComponent 
            data={advisorData.enrollmentData} 
            title="Student Enrollment" 
          />
          <PieChartComponent 
            data={advisorData.performanceData} 
            title="Student Performance" 
          />
        </div>

        <div className="flex space-x-4">
          <button className="themed-button">
            <TrendingUp className="mr-2" /> Performance Analysis
          </button>
          <button className="themed-button">
            <ClipboardList className="mr-2" /> Institutional Reports
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <PageTemplate>
      {role === 'Student' && <StudentDashboard />}
      {role === 'Teacher' && <TeacherDashboard />}
      {role === 'Advisor' && <AdvisorDashboard />}
    </PageTemplate>
  );
};

export default Home;