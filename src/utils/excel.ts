import * as XLSX from 'xlsx';
import type {
  ExcelParseError,
  ExcelParseResult,
  GradeTemplate,
  Student,
  SubjectScore,
} from '@/types';

const REQUIRED_COLUMNS = ['学号', '姓名', '班级'] as const;
const RESERVED_COLUMNS = new Set(['学号', '姓名', '班级', '年级', '总分', '排名', '备注']);

type RawRow = Record<string, unknown>;

function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toNumberValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function detectSubjectColumns(firstRow: RawRow): string[] {
  return Object.keys(firstRow).filter((key) => !RESERVED_COLUMNS.has(key));
}

export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return {
      students: [],
      subjects: [],
      errors: [{ row: 0, message: '工作簿为空，请检查 Excel 文件' }],
    };
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: '' });

  const errors: ExcelParseError[] = [];
  const students: Student[] = [];

  if (rows.length === 0) {
    return {
      students,
      subjects: [],
      errors: [{ row: 0, message: 'Excel 文件没有数据行' }],
    };
  }

  const firstRow = rows[0]!;
  const missing = REQUIRED_COLUMNS.filter(
    (col) => !Object.prototype.hasOwnProperty.call(firstRow, col),
  );
  if (missing.length) {
    return {
      students,
      subjects: [],
      errors: [
        { row: 0, message: `缺少必要列: ${missing.join('、')}（学号/姓名/班级 必填）` },
      ],
    };
  }

  const subjects = detectSubjectColumns(firstRow);
  if (subjects.length === 0) {
    return {
      students,
      subjects: [],
      errors: [
        {
          row: 0,
          message:
            '未检测到任何科目列。请确保表格包含学号、姓名、班级之外的科目成绩列',
        },
      ],
    };
  }

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const id = toStringValue(row['学号']);
    const name = toStringValue(row['姓名']);
    const className = toStringValue(row['班级']);

    if (!id || !name || !className) {
      errors.push({
        row: rowNum,
        message: `第 ${rowNum} 行: 学号/姓名/班级 不能为空`,
      });
      return;
    }

    const scores: SubjectScore[] = [];
    let hasError = false;

    for (const subject of subjects) {
      const score = toNumberValue(row[subject]);
      if (score === null) {
        errors.push({
          row: rowNum,
          message: `第 ${rowNum} 行 ${name} 的 ${subject} 成绩无效`,
        });
        hasError = true;
        continue;
      }
      if (score < 0 || score > 100) {
        errors.push({
          row: rowNum,
          message: `第 ${rowNum} 行 ${name} 的 ${subject} 成绩超出 0-100 范围`,
        });
        hasError = true;
        continue;
      }
      scores.push({ subject, score });
    }

    if (hasError) return;

    const providedTotal = toNumberValue(row['总分']);
    const computedTotal = scores.reduce((sum, s) => sum + s.score, 0);
    const total =
      providedTotal !== null && Math.abs(providedTotal - computedTotal) < 0.1
        ? providedTotal
        : computedTotal;

    students.push({ id, name, className, scores, total });
  });

  return { students, subjects, errors };
}

function randomSampleScore(base: number, variance = 8): number {
  const raw = base + (Math.random() - 0.5) * variance * 2;
  return Math.max(40, Math.min(100, Math.round(raw)));
}

export function downloadSampleExcel(template: GradeTemplate): void {
  const sampleNames = ['张三', '李四', '王芳', '陈磊', '赵敏', '孙宇', '周涛', '吴佳'];
  const sampleRows = sampleNames.map((name, i) => {
    const row: Record<string, string | number> = {
      学号: `S${String(i + 1).padStart(3, '0')}`,
      姓名: name,
      班级: `${template.grade}1班`,
      年级: template.grade,
    };
    let total = 0;
    template.subjects.forEach((subject) => {
      const score = randomSampleScore(75 + Math.random() * 15);
      row[subject] = score;
      total += score;
    });
    row['总分'] = total;
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const cols = [
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
    { wch: 10 },
    ...template.subjects.map(() => ({ wch: 8 })),
    { wch: 10 },
  ];
  worksheet['!cols'] = cols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '成绩单');
  XLSX.writeFile(workbook, `${template.name}成绩模板.xlsx`);
}
