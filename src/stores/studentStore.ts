import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { Exam, Student } from '@/types';
import { generateMockExams } from '@/utils/mockData';

const STORAGE_KEY_EXAMS = 'student_scores_exams';
const STORAGE_KEY_EXAM_ID = 'student_scores_current_exam_id';

export const useStudentStore = defineStore('student', () => {
  const savedExams = localStorage.getItem(STORAGE_KEY_EXAMS);
  const savedCurrentId = localStorage.getItem(STORAGE_KEY_EXAM_ID);

  const exams = ref<Exam[]>(savedExams ? JSON.parse(savedExams) : []);
  const currentExamId = ref<string | null>(savedCurrentId ? JSON.parse(savedCurrentId) : null);

  watch(exams, (newVal) => {
    const hasRealData = newVal.some(e => !e.id.startsWith('mock-'));
    if (hasRealData) {
      localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(newVal.filter(e => !e.id.startsWith('mock-'))));
    } else {
      localStorage.removeItem(STORAGE_KEY_EXAMS);
    }
  }, { deep: true });

  watch(currentExamId, (newVal) => {
    const isReal = newVal && !newVal.startsWith('mock-');
    if (isReal) {
      localStorage.setItem(STORAGE_KEY_EXAM_ID, JSON.stringify(newVal));
    } else {
      localStorage.removeItem(STORAGE_KEY_EXAM_ID);
    }
  });

  const sortedExams = computed(() =>
    [...exams.value].sort((a, b) => a.date.localeCompare(b.date)),
  );

  const currentExam = computed(
    () => exams.value.find((e) => e.id === currentExamId.value) ?? null,
  );

  const previousExam = computed(() => {
    if (!currentExam.value) return null;
    const list = sortedExams.value;
    const idx = list.findIndex((e) => e.id === currentExam.value!.id);
    return idx > 0 ? list[idx - 1]! : null;
  });

  const students = computed<Student[]>(
    () => currentExam.value?.students ?? [],
  );

  const currentSubjects = computed<string[]>(
    () => currentExam.value?.subjects ?? [],
  );

  const hasData = computed(() => exams.value.length > 0);

  function addOrReplaceExam(exam: Exam) {
    if (exams.value.length > 0 && exams.value.every(e => e.id.startsWith('mock-'))) {
      exams.value = [];
    }

    const idx = exams.value.findIndex((e) => e.id === exam.id);
    if (idx >= 0) {
      exams.value.splice(idx, 1, exam);
    } else {
      exams.value.push(exam);
    }
    currentExamId.value = exam.id;
  }

  function setCurrentExam(examId: string) {
    if (exams.value.some((e) => e.id === examId)) {
      currentExamId.value = examId;
    }
  }

  function loadMockData(templateId?: string) {
    const mock = generateMockExams(templateId);
    exams.value = mock;
    currentExamId.value = mock[mock.length - 1]?.id ?? null;
  }

  function clearAll() {
    exams.value = [];
    currentExamId.value = null;
  }

  function getStudentById(id: string): Student | undefined {
    return currentExam.value?.students.find((s) => s.id === id);
  }

  return {
    exams,
    currentExamId,
    sortedExams,
    currentExam,
    previousExam,
    students,
    currentSubjects,
    hasData,
    addOrReplaceExam,
    setCurrentExam,
    loadMockData,
    clearAll,
    getStudentById,
  };
});
