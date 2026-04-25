export interface SubjectScore {
  subject: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  scores: SubjectScore[];
  total: number;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  grade?: string;
  subjects: string[];
  students: Student[];
}

export type Trend = 'up' | 'down' | 'stable';

export interface SubjectAnalysis {
  subject: string;
  average: number;
  max: number;
  min: number;
  trend: Trend;
  delta: number;
  passRate: number;
  excellentRate: number;
}

export interface ScoreBand {
  range: string;
  count: number;
}

export interface ClassAnalysis {
  className: string;
  grade?: string;
  studentCount: number;
  totalAverage: number;
  previousTotalAverage?: number;
  totalTrend: Trend;
  totalDelta: number;
  subjectAnalyses: SubjectAnalysis[];
  distribution: ScoreBand[];
}

export interface RankedStudent {
  rank: number;
  student: Student;
  score: number;
}

export interface SubjectDetailAnalysis {
  subject: string;
  studentCount: number;
  average: number;
  median: number;
  max: number;
  min: number;
  stdDev: number;
  passRate: number;
  excellentRate: number;
  goodRate: number;
  failRate: number;
  distribution: ScoreBand[];
  topStudents: RankedStudent[];
  bottomStudents: RankedStudent[];
  trend: Trend;
  delta: number;
  previousAverage?: number;
  rankedStudents: RankedStudent[];
}

export interface StudentEvaluation {
  strongSubjects: SubjectScore[];
  weakSubjects: SubjectScore[];
  average: number;
  comment: string;
  tags: string[];
}

export interface ExcelParseError {
  row: number;
  message: string;
}

export interface ExcelParseResult {
  students: Student[];
  subjects: string[];
  errors: ExcelParseError[];
}

export type TeacherRole = 'classTeacher' | 'subjectTeacher';

export type GradeCategory = 'junior' | 'senior' | 'gaokao' | 'custom';

export interface GradeTemplate {
  id: string;
  name: string;
  category: GradeCategory;
  grade: string;
  subjects: string[];
  description?: string;
}
