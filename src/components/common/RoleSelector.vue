<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settingsStore';
import { useStudentStore } from '@/stores/studentStore';
import type { TeacherRole } from '@/types';

const router = useRouter();
const settings = useSettingsStore();
const store = useStudentStore();

const roleOptions: { value: TeacherRole; label: string; icon: string }[] = [
  { value: 'classTeacher', label: '班主任', icon: '👩‍🏫' },
  { value: 'subjectTeacher', label: '科任老师', icon: '👨‍🏫' },
];

const subjects = computed(() => store.currentSubjects);

function onRoleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const role = target.value as TeacherRole;
  settings.setRole(role);

  if (role === 'subjectTeacher') {
    const subj = settings.currentSubject ?? subjects.value[0];
    if (subj) router.push(`/subject/${encodeURIComponent(subj)}`);
  } else {
    router.push('/dashboard');
  }
}

function onSubjectChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  settings.setSubject(target.value);
  router.push(`/subject/${encodeURIComponent(target.value)}`);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <select
      :value="settings.role"
      class="text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      title="切换教师角色"
      @change="onRoleChange"
    >
      <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
        {{ opt.icon }} {{ opt.label }}
      </option>
    </select>
    <select
      v-if="settings.role === 'subjectTeacher' && subjects.length > 0"
      :value="settings.currentSubject ?? ''"
      class="text-sm border border-primary-300 rounded-lg px-2.5 py-1.5 bg-primary-50 text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
      title="任教科目"
      @change="onSubjectChange"
    >
      <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
    </select>
  </div>
</template>
