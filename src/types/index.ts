
export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  enrollment_date?: string;
  department_id?: string;
  university_id?: string;
  status?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_of_department?: string;
  university_id?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

export interface University {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  established_year?: number;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  description?: string;
  credits?: number;
  department_id?: string;
  semester?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_date?: string;
  grade?: string;
  status?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_name?: string;
  details?: string;
  user_id?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
  updated_at?: string;
}

export interface Faculty {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  designation?: string;
  specialization?: string;
  date_of_joining?: string;
  user_id?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}


export type StudentInsert = Omit<Student, 'id' | 'created_at' | 'updated_at'>;
export type DepartmentInsert = Omit<Department, 'id' | 'created_at' | 'updated_at'>;
export type UniversityInsert = Omit<University, 'id' | 'created_at' | 'updated_at'>;
export type CourseInsert = Omit<Course, 'id' | 'created_at' | 'updated_at'>;
export type EnrollmentInsert = Omit<Enrollment, 'id' | 'created_at' | 'updated_at'>;
export type ActivityLogInsert = Omit<ActivityLog, 'id' | 'created_at'>;
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type FacultyInsert = Omit<Faculty, 'id' | 'created_at' | 'updated_at'>;


export type StudentUpdate = Partial<Omit<Student, 'id' | 'created_at'>>;
export type DepartmentUpdate = Partial<Omit<Department, 'id' | 'created_at'>>;
export type UniversityUpdate = Partial<Omit<University, 'id' | 'created_at'>>;
export type CourseUpdate = Partial<Omit<Course, 'id' | 'created_at'>>;
export type EnrollmentUpdate = Partial<Omit<Enrollment, 'id' | 'created_at'>>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
export type FacultyUpdate = Partial<Omit<Faculty, 'id' | 'created_at'>>;
