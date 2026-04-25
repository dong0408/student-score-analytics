import type {
  ClassAnalysis,
  Exam,
  ScoreBand,
  Student,
  SubjectAnalysis,
  SubjectDetailAnalysis,
  Trend,
} from '@/types';
import {
  extractSubjectScores,
  mean,
  median,
  rankStudentsBySubject,
  rate,
  stdDev,
} from './statistics';

const TREND_THRESHOLD = 2;
const PASS_SCORE = 60;
const GOOD_SCORE = 75;
const EXCELLENT_SCORE = 85;

function computeTrend(delta: number): Trend {
  if (delta > TREND_THRESHOLD) return 'up';
  if (delta < -TREND_THRESHOLD) return 'down';
  return 'stable';
}

function subjectBands(scores: number[]): ScoreBand[] {
  const bands: { range: string; min: number; max: number }[] = [
    { range: '0-59', min: 0, max: 60 },
    { range: '60-69', min: 60, max: 70 },
    { range: '70-79', min: 70, max: 80 },
    { range: '80-89', min: 80, max: 90 },
    { range: '90-100', min: 90, max: 101 },
  ];
  return bands.map((band) => ({
    range: band.range,
    count: scores.filter((n) => n >= band.min && n < band.max).length,
  }));
}

function averageTotal(students: Student[]): number {
  if (students.length === 0) return 0;
  return students.reduce((sum, s) => sum + s.total, 0) / students.length;
}

function averageTotalPerStudent(students: Student[]): number[] {
  return students.map((s) =>
    s.scores.length > 0 ? s.total / s.scores.length : 0,
  );
}

function classDistribution(students: Student[]): ScoreBand[] {
  return subjectBands(averageTotalPerStudent(students));
}

export function analyzeClass(exam: Exam, prevExam?: Exam): ClassAnalysis {
  const students = exam.students;
  const className = students[0]?.className ?? exam.name;
  const subjects = exam.subjects;

  const subjectAnalyses: SubjectAnalysis[] = subjects.map((subject) => {
    const scores = extractSubjectScores(students, subject);
    const average = mean(scores);
    const max = scores.length > 0 ? Math.max(...scores) : 0;
    const min = scores.length > 0 ? Math.min(...scores) : 0;
    const passRate = rate(scores, (n) => n >= PASS_SCORE);
    const excellentRate = rate(scores, (n) => n >= EXCELLENT_SCORE);

    let delta = 0;
    let trend: Trend = 'stable';
    if (prevExam) {
      const prevScores = extractSubjectScores(prevExam.students, subject);
      delta = average - mean(prevScores);
      trend = computeTrend(delta);
    }

    return {
      subject,
      average,
      max,
      min,
      trend,
      delta,
      passRate,
      excellentRate,
    };
  });

  const totalAverage = averageTotal(students);
  const previousTotalAverage = prevExam
    ? averageTotal(prevExam.students)
    : undefined;
  const totalDelta =
    previousTotalAverage !== undefined ? totalAverage - previousTotalAverage : 0;

  return {
    className,
    grade: exam.grade,
    studentCount: students.length,
    totalAverage,
    previousTotalAverage,
    totalTrend: prevExam ? computeTrend(totalDelta) : 'stable',
    totalDelta,
    subjectAnalyses,
    distribution: classDistribution(students),
  };
}

export function analyzeSubject(
  exam: Exam,
  subject: string,
  prevExam?: Exam,
): SubjectDetailAnalysis {
  const students = exam.students;
  const scores = extractSubjectScores(students, subject);

  const average = mean(scores);
  const med = median(scores);
  const max = scores.length > 0 ? Math.max(...scores) : 0;
  const min = scores.length > 0 ? Math.min(...scores) : 0;
  const sd = stdDev(scores);

  const passRate = rate(scores, (n) => n >= PASS_SCORE);
  const excellentRate = rate(scores, (n) => n >= EXCELLENT_SCORE);
  const goodRate = rate(
    scores,
    (n) => n >= GOOD_SCORE && n < EXCELLENT_SCORE,
  );
  const failRate = rate(scores, (n) => n < PASS_SCORE);

  const ranked = rankStudentsBySubject(students, subject, 'desc');
  const topStudents = ranked.slice(0, 10);
  const bottomStudents = [...ranked].reverse().slice(0, 10);

  let delta = 0;
  let trend: Trend = 'stable';
  let previousAverage: number | undefined;
  if (prevExam) {
    const prevScores = extractSubjectScores(prevExam.students, subject);
    previousAverage = mean(prevScores);
    delta = average - previousAverage;
    trend = computeTrend(delta);
  }

  return {
    subject,
    studentCount: scores.length,
    average,
    median: med,
    max,
    min,
    stdDev: sd,
    passRate,
    excellentRate,
    goodRate,
    failRate,
    distribution: subjectBands(scores),
    topStudents,
    bottomStudents,
    trend,
    delta,
    previousAverage,
    rankedStudents: ranked,
  };
}

export function getStudentExamHistory(
  studentId: string,
  exams: Exam[],
): {
  examName: string;
  date: string;
  scores: Record<string, number>;
  total: number;
}[] {
  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  return sorted
    .map((exam) => {
      const student = exam.students.find((s) => s.id === studentId);
      if (!student) return null;
      const scoreMap: Record<string, number> = {};
      student.scores.forEach((s) => {
        scoreMap[s.subject] = s.score;
      });
      return {
        examName: exam.name,
        date: exam.date,
        scores: scoreMap,
        total: student.total,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
}

export function getSubjectTrendAcrossExams(
  subject: string,
  exams: Exam[],
): { examName: string; average: number }[] {
  return [...exams]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((e) => e.subjects.includes(subject))
    .map((exam) => ({
      examName: exam.name,
      average: Number(mean(extractSubjectScores(exam.students, subject)).toFixed(2)),
    }));
}
