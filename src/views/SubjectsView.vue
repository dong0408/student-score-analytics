<script setup lang="ts">
import { computed } from 'vue';
import { useStudentStore } from '@/stores/studentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { analyzeClass } from '@/utils/analysis';
import SubjectOverviewCard from '@/components/subject/SubjectOverviewCard.vue';

const store = useStudentStore();
const settings = useSettingsStore();

const analysis = computed(() => {
  if (!store.currentExam) return null;
  return analyzeClass(store.currentExam, store.previousExam ?? undefined);
});

const visibleSubjects = computed(() => {
  if (!analysis.value) return [];
  if (settings.role === 'subjectTeacher' && settings.currentSubject) {
    return analysis.value.subjectAnalyses.filter(
      (s) => s.subject === settings.currentSubject,
    );
  }
  return analysis.value.subjectAnalyses;
});
</script>

<template>
  <div>
    <div v-if="!analysis" class="text-center py-20">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-gray-600 mb-4">暂无数据，请先在首页上传成绩</p>
      <router-link
        to="/"
        class="inline-block px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        去首页上传
      </router-link>
    </div>

    <div v-else>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">📚 各科概览</h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ store.currentExam?.name }} · 共
          {{ analysis.subjectAnalyses.length }} 个科目
          <span v-if="settings.role === 'subjectTeacher'">
            · 当前只显示您任教的【{{ settings.currentSubject }}】
          </span>
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SubjectOverviewCard
          v-for="sa in visibleSubjects"
          :key="sa.subject"
          :analysis="sa"
        />
      </div>
    </div>
  </div>
</template>
