import type { GradeTemplate } from '@/types';

export const GRADE_TEMPLATES: GradeTemplate[] = [
  {
    id: 'junior-1',
    name: '初一',
    category: 'junior',
    grade: '初一',
    subjects: ['语文', '数学', '英语', '政治', '历史', '地理', '生物'],
    description: '初中一年级常见科目（7 科）',
  },
  {
    id: 'junior-2',
    name: '初二',
    category: 'junior',
    grade: '初二',
    subjects: ['语文', '数学', '英语', '物理', '政治', '历史', '地理', '生物'],
    description: '初中二年级（加入物理，8 科）',
  },
  {
    id: 'junior-3',
    name: '初三',
    category: 'junior',
    grade: '初三',
    subjects: ['语文', '数学', '英语', '物理', '化学', '政治', '历史'],
    description: '初中三年级中考科目（7 科）',
  },
  {
    id: 'senior-arts',
    name: '高中文科',
    category: 'senior',
    grade: '高中',
    subjects: ['语文', '数学', '英语', '政治', '历史', '地理'],
    description: '传统高考文科组合',
  },
  {
    id: 'senior-science',
    name: '高中理科',
    category: 'senior',
    grade: '高中',
    subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
    description: '传统高考理科组合',
  },
  {
    id: 'gaokao-wuhuasheng',
    name: '新高考 · 物化生',
    category: 'gaokao',
    grade: '高中',
    subjects: ['语文', '数学', '英语', '物理', '化学', '生物'],
    description: '新高考 3+1+2 · 物理 + 化学 + 生物',
  },
  {
    id: 'gaokao-wuhuazheng',
    name: '新高考 · 物化政',
    category: 'gaokao',
    grade: '高中',
    subjects: ['语文', '数学', '英语', '物理', '化学', '政治'],
    description: '新高考 3+1+2 · 物理 + 化学 + 政治',
  },
  {
    id: 'gaokao-shizhengdi',
    name: '新高考 · 史政地',
    category: 'gaokao',
    grade: '高中',
    subjects: ['语文', '数学', '英语', '历史', '政治', '地理'],
    description: '新高考 3+1+2 · 历史 + 政治 + 地理',
  },
];

export const DEFAULT_TEMPLATE_ID = 'junior-3';

export function getTemplateById(id: string): GradeTemplate | undefined {
  return GRADE_TEMPLATES.find((t) => t.id === id);
}

export function getDefaultTemplate(): GradeTemplate {
  const tpl = getTemplateById(DEFAULT_TEMPLATE_ID);
  if (!tpl) throw new Error('Default template not found');
  return tpl;
}
