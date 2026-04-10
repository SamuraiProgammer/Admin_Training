let courses = [];
let courseDetails = [];

export const saveCourseCard = (data) => {
  const newCourse = { ...data, _id: Date.now().toString() };
  courses.push(newCourse);
  return newCourse;
};

export const getCourses = () => courses;

export const saveCourseDetail = (data) => {
  courseDetails.push(data);
};

export const getCourseById = (id) => {
  return courses.find((c) => c._id === id);
};

export const updateCourse = (id, updatedData) => {
  courses = courses.map((c) =>
    c._id === id ? { ...c, ...updatedData } : c
  );
};

export const updateCourseDetail = (coursecardid, updatedData) => {
  courseDetails = courseDetails.map((c) =>
    c.coursecardid === coursecardid ? { ...c, ...updatedData } : c
  );
};

export const getCourseDetailById = (id) => {
  return courseDetails.find(c => c.coursecardid === id);
};