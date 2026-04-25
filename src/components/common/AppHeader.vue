<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStudentStore } from '@/stores/studentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import RoleSelector from './RoleSelector.vue';

const route = useRoute();
const store = useStudentStore();
const settings = useSettingsStore();

const navItems = computed(() => {
  if (settings.role === 'subjectTeacher') {
    const subject = settings.currentSubject ?? '';
    return [
      { name: 'home', label: '首页', path: '/' },
      {
        name: 'subjectDetail',
        label: subject ? `${subject} 分析` : '学科分析',
        path: subject ? `/subject/${encodeURIComponent(subject)}` : '/subjects',
      },
      { name: 'students', label: '学生列表', path: '/students' },
    ];
  }
  return [
    { name: 'home', label: '首页', path: '/' },
    { name: 'dashboard', label: '班级总览', path: '/dashboard' },
    { name: 'subjects', label: '各科概览', path: '/subjects' },
    { name: 'students', label: '学生列表', path: '/students' },
  ];
});

const examOptions = computed(() =>
  store.sortedExams.map((e) => ({ label: e.name, value: e.id })),
);

function handleExamChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  store.setCurrentExam(target.value);
}

function isActive(name: string): boolean {
  if (route.name === name) return true;
  if (name === 'subjectDetail' && route.name === 'subjectDetail') return true;
  return false;
}

watch(
  () => store.currentSubjects,
  (subjects) => {
    if (subjects.length > 0) settings.ensureValidSubject(subjects);
  },
  { immediate: true },
);
</script>

<template>
  <header
    class="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">
        <div class="flex items-center gap-3 flex-shrink-0">
          <div
            class="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold"
          >
            📊
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">
              学生成绩分析管理系统
            </h1>
            <p class="text-xs text-gray-500 hidden sm:block">
              Student Score Analytics
            </p>
          </div>
        </div>

        <nav class="hidden lg:flex items-center gap-1 flex-1 justify-center">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            :class="[
              isActive(item.name)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="flex items-center gap-2">
          <RoleSelector />
          <select
            v-if="store.hasData"
            :value="store.currentExamId ?? ''"
            class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 max-w-[160px]"
            @change="handleExamChange"
          >
            <option
              v-for="opt in examOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <nav
        class="lg:hidden flex items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto"
      >
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex-shrink-0 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
          :class="[
            isActive(item.name)
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600',
          ]"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>
