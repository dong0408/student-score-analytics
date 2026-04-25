import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { TeacherRole } from '@/types';
import { DEFAULT_TEMPLATE_ID, getTemplateById } from '@/utils/gradeTemplates';
import { useStudentStore } from './studentStore';

export const useSettingsStore = defineStore('settings', () => {
  const role = ref<TeacherRole>('classTeacher');
  const currentSubject = ref<string | null>(null);
  const selectedTemplateId = ref<string>(DEFAULT_TEMPLATE_ID);

  const selectedTemplate = computed(
    () => getTemplateById(selectedTemplateId.value) ?? null,
  );

  function setRole(r: TeacherRole) {
    role.value = r;
    if (r === 'subjectTeacher' && !currentSubject.value) {
      const studentStore = useStudentStore();
      const firstSubject = studentStore.currentExam?.subjects[0];
      if (firstSubject) currentSubject.value = firstSubject;
    }
  }

  function setSubject(subject: string) {
    currentSubject.value = subject;
  }

  function setTemplate(id: string) {
    selectedTemplateId.value = id;
  }

  function ensureValidSubject(availableSubjects: string[]) {
    if (
      currentSubject.value &&
      !availableSubjects.includes(currentSubject.value)
    ) {
      currentSubject.value = availableSubjects[0] ?? null;
    }
    if (!currentSubject.value && availableSubjects.length > 0) {
      currentSubject.value = availableSubjects[0] ?? null;
    }
  }

  return {
    role,
    currentSubject,
    selectedTemplateId,
    selectedTemplate,
    setRole,
    setSubject,
    setTemplate,
    ensureValidSubject,
  };
});
