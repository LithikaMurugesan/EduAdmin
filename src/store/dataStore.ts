import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Student,
  Department,
  University,
  Course,
  Enrollment,
  ActivityLog,
  Profile,
  Faculty,
  StudentInsert,
  DepartmentInsert,
  UniversityInsert,
  CourseInsert,
  EnrollmentInsert,
  ActivityLogInsert,
  ProfileInsert,
  FacultyInsert,
  StudentUpdate,
  DepartmentUpdate,
  UniversityUpdate,
  CourseUpdate,
  EnrollmentUpdate,
  ProfileUpdate,
  FacultyUpdate,
} from '@/types';

interface DataStore {
  students: Student[];
  departments: Department[];
  universities: University[];
  courses: Course[];
  enrollments: Enrollment[];
  activityLogs: ActivityLog[];
  profiles: Profile[];
  faculty: Faculty[];
  addStudent: (student: StudentInsert) => Student;
  updateStudent: (id: string, updates: StudentUpdate) => Student | null;
  deleteStudent: (id: string) => void;
  restoreStudent: (id: string) => void;
  getStudents: () => Student[];
  getAllStudents: () => Student[];

 
  addDepartment: (department: DepartmentInsert) => Department;
  updateDepartment: (id: string, updates: DepartmentUpdate) => Department | null;
  deleteDepartment: (id: string) => void;
  restoreDepartment: (id: string) => void;
  getDepartments: () => Department[];
  getAllDepartments: () => Department[];


  addUniversity: (university: UniversityInsert) => University;
  updateUniversity: (id: string, updates: UniversityUpdate) => University | null;
  deleteUniversity: (id: string) => void;
  restoreUniversity: (id: string) => void;
  getUniversities: () => University[];
  getAllUniversities: () => University[];


  addCourse: (course: CourseInsert) => Course;
  updateCourse: (id: string, updates: CourseUpdate) => Course | null;
  deleteCourse: (id: string) => void;
  restoreCourse: (id: string) => void;
  getCourses: () => Course[];
  getAllCourses: () => Course[];

  addEnrollment: (enrollment: EnrollmentInsert) => Enrollment;
  updateEnrollment: (id: string, updates: EnrollmentUpdate) => Enrollment | null;
  deleteEnrollment: (id: string) => void;
  restoreEnrollment: (id: string) => void;
  getEnrollments: () => Enrollment[];
  getAllEnrollments: () => Enrollment[];


  addActivityLog: (log: ActivityLogInsert) => void;
  getActivityLogs: () => ActivityLog[];


  addProfile: (profile: ProfileInsert) => Profile;
  updateProfile: (id: string, updates: ProfileUpdate) => Profile | null;
  getProfiles: () => Profile[];


  addFaculty: (faculty: FacultyInsert) => Faculty;
  updateFaculty: (id: string, updates: FacultyUpdate) => Faculty | null;
  deleteFaculty: (id: string) => void;
  restoreFaculty: (id: string) => void;
  getFaculty: () => Faculty[];
  getAllFaculty: () => Faculty[];
}

const generateId = () => crypto.randomUUID();

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      students: [],
      departments: [],
      universities: [],
      courses: [],
      enrollments: [],
      activityLogs: [],
      profiles: [],
      faculty: [],

      
      addStudent: (studentData) => {
        const student: Student = {
          ...studentData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ students: [...state.students, student] }));

        get().addActivityLog({
          action: 'Create',
          entity_type: 'Student',
          entity_id: student.id,
          entity_name: student.full_name,
          details: `Student "${student.full_name}" (${student.student_id}) was enrolled`,
        });

        return student;
      },

      updateStudent: (id, updates) => {
        let updatedStudent: Student | null = null;
        set((state) => ({
          students: state.students.map((s) => {
            if (s.id === id) {
              updatedStudent = { ...s, ...updates, updated_at: new Date().toISOString() };
              return updatedStudent;
            }
            return s;
          }),
        }));

        if (updatedStudent) {
          get().addActivityLog({
            action: 'Update',
            entity_type: 'Student',
            entity_id: id,
            entity_name: updatedStudent.full_name,
            details: `Student "${updatedStudent.full_name}" was updated`,
          });
        }

        return updatedStudent;
      },

      deleteStudent: (id) => {
        const student = get().students.find((s) => s.id === id);
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, is_deleted: true } : s
          ),
        }));

        if (student) {
          get().addActivityLog({
            action: 'Delete',
            entity_type: 'Student',
            entity_id: id,
            entity_name: student.full_name,
            details: `Student "${student.full_name}" was deleted`,
          });
        }
      },

      restoreStudent: (id) => {
        const student = get().students.find((s) => s.id === id);
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, is_deleted: false } : s
          ),
        }));

        if (student) {
          get().addActivityLog({
            action: 'Restore',
            entity_type: 'Student',
            entity_id: id,
            entity_name: student.full_name,
            details: `Student "${student.full_name}" was restored`,
          });
        }
      },

      getStudents: () => get().students.filter((s) => !s.is_deleted),
      getAllStudents: () => get().students,

      addDepartment: (departmentData) => {
        const department: Department = {
          ...departmentData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ departments: [...state.departments, department] }));

        get().addActivityLog({
          action: 'Create',
          entity_type: 'Department',
          entity_id: department.id,
          entity_name: department.name,
          details: `Department "${department.name}" (${department.code}) was created`,
        });

        return department;
      },

      updateDepartment: (id, updates) => {
        let updatedDepartment: Department | null = null;
        set((state) => ({
          departments: state.departments.map((d) => {
            if (d.id === id) {
              updatedDepartment = { ...d, ...updates, updated_at: new Date().toISOString() };
              return updatedDepartment;
            }
            return d;
          }),
        }));

        if (updatedDepartment) {
          get().addActivityLog({
            action: 'Update',
            entity_type: 'Department',
            entity_id: id,
            entity_name: updatedDepartment.name,
            details: `Department "${updatedDepartment.name}" was updated`,
          });
        }

        return updatedDepartment;
      },

      deleteDepartment: (id) => {
        const department = get().departments.find((d) => d.id === id);
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, is_deleted: true } : d
          ),
        }));

        if (department) {
          get().addActivityLog({
            action: 'Delete',
            entity_type: 'Department',
            entity_id: id,
            entity_name: department.name,
            details: `Department "${department.name}" was deleted`,
          });
        }
      },

      restoreDepartment: (id) => {
        const department = get().departments.find((d) => d.id === id);
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, is_deleted: false } : d
          ),
        }));

        if (department) {
          get().addActivityLog({
            action: 'Restore',
            entity_type: 'Department',
            entity_id: id,
            entity_name: department.name,
            details: `Department "${department.name}" was restored`,
          });
        }
      },

      getDepartments: () => get().departments.filter((d) => !d.is_deleted),
      getAllDepartments: () => get().departments,

   
      addUniversity: (universityData) => {
        const university: University = {
          ...universityData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ universities: [...state.universities, university] }));

        get().addActivityLog({
          action: 'Create',
          entity_type: 'University',
          entity_id: university.id,
          entity_name: university.name,
          details: `University "${university.name}" (${university.code}) was created`,
        });

        return university;
      },

      updateUniversity: (id, updates) => {
        let updatedUniversity: University | null = null;
        set((state) => ({
          universities: state.universities.map((u) => {
            if (u.id === id) {
              updatedUniversity = { ...u, ...updates, updated_at: new Date().toISOString() };
              return updatedUniversity;
            }
            return u;
          }),
        }));

        if (updatedUniversity) {
          get().addActivityLog({
            action: 'Update',
            entity_type: 'University',
            entity_id: id,
            entity_name: updatedUniversity.name,
            details: `University "${updatedUniversity.name}" was updated`,
          });
        }

        return updatedUniversity;
      },

      deleteUniversity: (id) => {
        const university = get().universities.find((u) => u.id === id);
        set((state) => ({
          universities: state.universities.map((u) =>
            u.id === id ? { ...u, is_deleted: true } : u
          ),
        }));

        if (university) {
          get().addActivityLog({
            action: 'Delete',
            entity_type: 'University',
            entity_id: id,
            entity_name: university.name,
            details: `University "${university.name}" was deleted`,
          });
        }
      },

      restoreUniversity: (id) => {
        const university = get().universities.find((u) => u.id === id);
        set((state) => ({
          universities: state.universities.map((u) =>
            u.id === id ? { ...u, is_deleted: false } : u
          ),
        }));

        if (university) {
          get().addActivityLog({
            action: 'Restore',
            entity_type: 'University',
            entity_id: id,
            entity_name: university.name,
            details: `University "${university.name}" was restored`,
          });
        }
      },

      getUniversities: () => get().universities.filter((u) => !u.is_deleted),
      getAllUniversities: () => get().universities,

      
      addCourse: (courseData) => {
        const course: Course = {
          ...courseData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ courses: [...state.courses, course] }));

        get().addActivityLog({
          action: 'Create',
          entity_type: 'Course',
          entity_id: course.id,
          entity_name: course.course_name,
          details: `Course "${course.course_name}" (${course.course_code}) was created`,
        });

        return course;
      },

      updateCourse: (id, updates) => {
        let updatedCourse: Course | null = null;
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id === id) {
              updatedCourse = { ...c, ...updates, updated_at: new Date().toISOString() };
              return updatedCourse;
            }
            return c;
          }),
        }));

        if (updatedCourse) {
          get().addActivityLog({
            action: 'Update',
            entity_type: 'Course',
            entity_id: id,
            entity_name: updatedCourse.course_name,
            details: `Course "${updatedCourse.course_name}" was updated`,
          });
        }

        return updatedCourse;
      },

      deleteCourse: (id) => {
        const course = get().courses.find((c) => c.id === id);
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, is_deleted: true } : c
          ),
        }));

        if (course) {
          get().addActivityLog({
            action: 'Delete',
            entity_type: 'Course',
            entity_id: id,
            entity_name: course.course_name,
            details: `Course "${course.course_name}" was deleted`,
          });
        }
      },

      restoreCourse: (id) => {
        const course = get().courses.find((c) => c.id === id);
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, is_deleted: false } : c
          ),
        }));

        if (course) {
          get().addActivityLog({
            action: 'Restore',
            entity_type: 'Course',
            entity_id: id,
            entity_name: course.course_name,
            details: `Course "${course.course_name}" was restored`,
          });
        }
      },

      getCourses: () => get().courses.filter((c) => !c.is_deleted),
      getAllCourses: () => get().courses,

      addEnrollment: (enrollmentData) => {
        const enrollment: Enrollment = {
          ...enrollmentData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ enrollments: [...state.enrollments, enrollment] }));

        get().addActivityLog({
          action: 'Create',
          entity_type: 'Enrollment',
          entity_id: enrollment.id,
          details: `Enrollment was created`,
        });

        return enrollment;
      },

      updateEnrollment: (id, updates) => {
        let updatedEnrollment: Enrollment | null = null;
        set((state) => ({
          enrollments: state.enrollments.map((e) => {
            if (e.id === id) {
              updatedEnrollment = { ...e, ...updates, updated_at: new Date().toISOString() };
              return updatedEnrollment;
            }
            return e;
          }),
        }));

        if (updatedEnrollment) {
          get().addActivityLog({
            action: 'Update',
            entity_type: 'Enrollment',
            entity_id: id,
            details: `Enrollment was updated`,
          });
        }

        return updatedEnrollment;
      },

      deleteEnrollment: (id) => {
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === id ? { ...e, is_deleted: true } : e
          ),
        }));

        get().addActivityLog({
          action: 'Delete',
          entity_type: 'Enrollment',
          entity_id: id,
          details: `Enrollment was deleted`,
        });
      },

      restoreEnrollment: (id) => {
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === id ? { ...e, is_deleted: false } : e
          ),
        }));

        get().addActivityLog({
          action: 'Restore',
          entity_type: 'Enrollment',
          entity_id: id,
          details: `Enrollment was restored`,
        });
      },

      getEnrollments: () => get().enrollments.filter((e) => !e.is_deleted),
      getAllEnrollments: () => get().enrollments,

      addActivityLog: (logData) => {
        const log: ActivityLog = {
          ...logData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ activityLogs: [...state.activityLogs, log] }));
      },

      getActivityLogs: () => get().activityLogs,

      addProfile: (profileData) => {
        const profile: Profile = {
          ...profileData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ profiles: [...state.profiles, profile] }));
        return profile;
      },

      updateProfile: (id, updates) => {
        let updatedProfile: Profile | null = null;
        set((state) => ({
          profiles: state.profiles.map((p) => {
            if (p.id === id) {
              updatedProfile = { ...p, ...updates, updated_at: new Date().toISOString() };
              return updatedProfile;
            }
            return p;
          }),
        }));
        return updatedProfile;
      },

      getProfiles: () => get().profiles,

      addFaculty: (facultyData) => {
        const faculty: Faculty = {
          ...facultyData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ faculty: [...state.faculty, faculty] }));

        get().addActivityLog({
          action: 'Create',
          entity_type: 'Faculty',
          entity_id: faculty.id,
          entity_name: faculty.full_name,
          details: `Faculty "${faculty.full_name}" (${faculty.employee_id}) was added`,
        });

        return faculty;
      },

      updateFaculty: (id, updates) => {
        let updatedFaculty: Faculty | null = null;
        set((state) => ({
          faculty: state.faculty.map((f) => {
            if (f.id === id) {
              updatedFaculty = { ...f, ...updates, updated_at: new Date().toISOString() };
              return updatedFaculty;
            }
            return f;
          }),
        }));

        if (updatedFaculty) {
          get().addActivityLog({
            action: 'Update',
            entity_type: 'Faculty',
            entity_id: id,
            entity_name: updatedFaculty.full_name,
            details: `Faculty "${updatedFaculty.full_name}" was updated`,
          });
        }

        return updatedFaculty;
      },

      deleteFaculty: (id) => {
        const faculty = get().faculty.find((f) => f.id === id);
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, is_deleted: true } : f
          ),
        }));

        if (faculty) {
          get().addActivityLog({
            action: 'Delete',
            entity_type: 'Faculty',
            entity_id: id,
            entity_name: faculty.full_name,
            details: `Faculty "${faculty.full_name}" was deleted`,
          });
        }
      },

      restoreFaculty: (id) => {
        const faculty = get().faculty.find((f) => f.id === id);
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, is_deleted: false } : f
          ),
        }));

        if (faculty) {
          get().addActivityLog({
            action: 'Restore',
            entity_type: 'Faculty',
            entity_id: id,
            entity_name: faculty.full_name,
            details: `Faculty "${faculty.full_name}" was restored`,
          });
        }
      },

      getFaculty: () => get().faculty.filter((f) => !f.is_deleted),
      getAllFaculty: () => get().faculty,
    }),
    {
      name: 'university-management-storage',
    }
  )
);
