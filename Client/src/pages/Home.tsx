import React, { useState, useEffect } from 'react';
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
  ActivityIcon,
  AlertTriangle
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
        <h3 className="text-2xl font-bold text-gray-800 animate-text bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
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
    title: string 
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
          <ActivityIcon className="animate-spin text-primary-500" size={48} />
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

  // Student Dashboard
  const StudentDashboard = () => {
    const studentData = dashboardData as StudentDashboardData;

    return (
      <div className="space-y-8">
        <div className="bg-[linear-gradient(to_right,var(--primary-color),var(--secondary-color))] rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-4 animate-bounce">
                Welcome, Student! 🎉
              </h1>
              <p className="text-xl opacity-80">
                Ready to explore and learn today?
              </p>
            </div>
            <GraduationCap size={100} className="text-white/20" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <DashboardCard 
            icon={<BookOpen className="text-emerald-500" />} 
            title="Total Courses" 
            value={studentData.totalCourses} 
            color="#10b981" 
          />
          <DashboardCard 
            icon={<ClipboardList className="text-indigo-500" />} 
            title="Assignments" 
            value={studentData.assignments} 
            color="#6366f1" 
          />
          <DashboardCard 
            icon={<Calendar className="text-amber-500" />} 
            title="Upcoming Events" 
            value={studentData.upcomingEvents} 
            color="#f59e0b" 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PieChartComponent 
            data={studentData.attendanceData} 
            title="Attendance Overview" 
          />
          <PieChartComponent 
            data={studentData.gradesData} 
            title="Grade Distribution" 
          />
        </div>

        <div className="flex space-x-4">
          <button className="themed-button">
            <BookOpen className="mr-2" /> View Courses
          </button>
          <button className="themed-button">
            <Star className="mr-2" /> Track Progress
          </button>
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