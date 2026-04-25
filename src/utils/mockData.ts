import type { Exam, GradeTemplate, Student } from '@/types';
import { getDefaultTemplate, getTemplateById } from './gradeTemplates';

const STUDENT_NAMES = [
  '张伟', '王芳', '李强', '刘洋', '陈静', '杨军', '赵丽', '黄磊',
  '周敏', '吴浩', '徐婷', '孙鹏', '马超', '朱琳', '胡斌', '林欣',
  '何娜', '高远', '郭雪', '罗翔', '梁晨', '宋佳', '唐杰', '韩雪',
  '冯博', '邓璐', '曹辉', '彭丽', '曾昊', '谢颖',
];

function randomScore(base: number, variance: number): number {
  const raw = base + (Math.random() - 0.5) * variance * 2;
  return Math.max(30, Math.min(100, Math.round(raw)));
}

function createStudent(
  index: number,
  subjects: string[],
  subjectBases: Record<string, number>,
  grade: string,
): Student {
  const id = `S${String(index + 1).padStart(3, '0')}`;
  const name = STUDENT_NAMES[index] ?? `学生${index + 1}`;
  const className = `${grade}1班`;

  const abilityBias = (Math.random() - 0.5) * 20;
  const scores = subjects.map((subject) => ({
    subject,
    score: randomScore((subjectBases[subject] ?? 78) + abilityBias, 8),
  }));
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return { id, name, className, scores, total };
}

function buildExam(
  template: GradeTemplate,
  examId: string,
  examName: string,
  date: string,
  adjust: number,
): Exam {
  const subjectBases: Record<string, number> = {};
  template.subjects.forEach((subject) => {
    const baseMap: Record<string, number> = {
      语文: 78,
      数学: 74,
      英语: 76,
      物理: 72,
      化学: 74,
      生物: 80,
      政治: 82,
      历史: 80,
      地理: 79,
    };
    subjectBases[subject] = (baseMap[subject] ?? 76) + adjust;
  });

  const students = STUDENT_NAMES.map((_, idx) =>
    createStudent(idx, template.subjects, subjectBases, template.grade),
  );

  return {
    id: examId,
    name: examName,
    date,
    grade: template.grade,
    subjects: template.subjects,
    students,
  };
}

export function generateMockExams(templateId?: string): Exam[] {
  const template = templateId
    ? (getTemplateById(templateId) ?? getDefaultTemplate())
    : getDefaultTemplate();

  return [
    buildExam(template, 'mock-1', `${template.name} · 期初测试`, '2024-03-10', -4),
    buildExam(template, 'mock-2', `${template.name} · 期中考试`, '2024-05-12', 0),
    buildExam(template, 'mock-3', `${template.name} · 期末考试`, '2024-07-05', 3),
  ];
}
