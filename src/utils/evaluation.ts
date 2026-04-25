import type { Student, StudentEvaluation } from '@/types';

const EXCELLENT_THRESHOLD = 85;
const FAIL_THRESHOLD = 60;
const GOOD_THRESHOLD = 75;

export function evaluateStudent(student: Student): StudentEvaluation {
  const sorted = [...student.scores].sort((a, b) => b.score - a.score);
  const strong = sorted.slice(0, Math.min(2, sorted.length));
  const weak = sorted
    .slice(-Math.min(2, sorted.length))
    .reverse();
  const average =
    student.scores.length > 0
      ? student.scores.reduce((sum, s) => sum + s.score, 0) /
        student.scores.length
      : 0;

  const tags: string[] = [];
  const parts: string[] = [];

  if (average >= EXCELLENT_THRESHOLD) {
    tags.push('优秀');
    parts.push(
      `该学生整体表现优秀（均分 ${average.toFixed(1)}），建议继续保持`,
    );
  } else if (average >= GOOD_THRESHOLD) {
    tags.push('良好');
    parts.push(`该学生整体表现良好（均分 ${average.toFixed(1)}）`);
  } else if (average >= FAIL_THRESHOLD) {
    tags.push('中等');
    parts.push(
      `该学生成绩处于中等水平（均分 ${average.toFixed(1)}），仍有进步空间`,
    );
  } else {
    tags.push('待提升');
    parts.push(
      `该学生整体成绩偏低（均分 ${average.toFixed(1)}），需要重点关注`,
    );
  }

  if (strong[0] && strong[0].score >= EXCELLENT_THRESHOLD) {
    parts.push(`${strong[0].subject}成绩突出（${strong[0].score}分）`);
  }

  const failing = student.scores.filter((s) => s.score < FAIL_THRESHOLD);
  if (failing.length) {
    tags.push('偏科');
    parts.push(
      `${failing.map((s) => s.subject).join('、')}成绩不及格，需要重点提升`,
    );
  }

  if (student.scores.length > 1) {
    const maxScore = Math.max(...student.scores.map((s) => s.score));
    const minScore = Math.min(...student.scores.map((s) => s.score));
    if (maxScore - minScore >= 30) {
      if (!tags.includes('偏科')) tags.push('偏科');
      parts.push(
        `各科差距较大（${maxScore - minScore}分），建议加强弱势科目`,
      );
    }
  }

  if (parts.length === 1) {
    parts.push('各科发展较为均衡');
  }

  return {
    strongSubjects: strong,
    weakSubjects: weak,
    average,
    comment: parts.join('；') + '。',
    tags,
  };
}
