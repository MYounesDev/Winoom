import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch function for all components
export const fetchData = async (endpoint:string, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Generic post function
export const postData = async (endpoint:string, data = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};





// Fetch functions
export const getAnnouncements = async () => {
  return fetchData("announcements");
}


export const getSchoolImages = async () => {
  return fetchData("schoolImages");
}



//pages data
export const getClasses = async () => {
  return fetchData('getClasses');
};


export const getStudentClass = async () => {
  return fetchData('getStudentClass');
};

export const getHomework = async () => {
  return fetchData('homework');
};

export const getLessons = async () => {
  return fetchData('lessons');
};

export const getBooks = async () => {
  return fetchData('books');
};

export const getCalendar = async () => {
  return fetchData('calendar');
};

export const getStudents = async () => {
  return fetchData('students');
};

export const getTeachers = async () => {
  return fetchData('Teachers');
};

export const getNotes = async () => {
  return fetchData('notes');
};

export const getReports = async () => {
  return fetchData('reports');
};




export const getStudentDashboardData = async () => {
  return fetchData("studentDashboardData");
}

export const getTeacherDashboardData = async () => {
  return fetchData("teacherDashboardData");
}

export const getAdvisorDashboardData = async () => {
  return fetchData("advisorDashboardData");
}








export const submitHomework = async (submitData: any) => {
  return postData('submitHomework', submitData);
};

export const editHomework = async (editData: any) => {
  return postData('editHomework', editData);
};

export const askQuestionAboutHomework = async (questionData: any) => {
  return postData('askQuestionAboutHomework', questionData);
};




// Post functions
export const postStudents = async (studentsData = {}) => {
  return postData('students', studentsData);
};

export const postEvent = async (eventData = {}) => {
  return postData('calendar', eventData);
};

export const postTeachers = async (teachersData = {}) => {
  return postData('Teachers', teachersData);
};
