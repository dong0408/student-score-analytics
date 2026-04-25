import type { RankedStudent, Student } from '@/types';

export function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

export function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

export function stdDev(nums: number[]): number {
  if (nums.length === 0) return 0;
  const avg = mean(nums);
  const variance =
    nums.reduce((sum, n) => sum + (n - avg) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

export function rate(scores: number[], predicate: (n: number) => boolean): number {
  if (scores.length === 0) return 0;
  return (scores.filter(predicate).length / scores.length) * 100;
}

export function rankStudentsBySubject(
  students: Student[],
  subject: string,
  order: 'asc' | 'desc' = 'desc',
): RankedStudent[] {
  const withScore = students
    .map((student) => {
      const scoreEntry = student.scores.find((s) => s.subject === subject);
      return scoreEntry ? { student, score: scoreEntry.score } : null;
    })
    .filter((v): v is { student: Student; score: number } => v !== null);

  withScore.sort((a, b) =>
    order === 'desc' ? b.score - a.score : a.score - b.score,
  );

  return withScore.map((item, idx) => ({
    rank: idx + 1,
    student: item.student,
    score: item.score,
  }));
}

export function extractSubjectScores(
  students: Student[],
  subject: string,
): number[] {
  return students
    .map((s) => s.scores.find((x) => x.subject === subject)?.score)
    .filter((n): n is number => typeof n === 'number' && Number.isFinite(n));
}
