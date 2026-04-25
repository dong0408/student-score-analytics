<script setup lang="ts">
import { useStudentStore } from '@/stores/studentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import AppCard from '@/components/common/AppCard.vue';
import ExcelUploader from '@/components/upload/ExcelUploader.vue';
import GradeTemplateSelector from '@/components/common/GradeTemplateSelector.vue';
import type { TeacherRole } from '@/types';

const store = useStudentStore();
const settings = useSettingsStore();

function selectRole(role: TeacherRole) {
  settings.setRole(role);
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        📊 学生成绩分析管理系统
      </h1>
      <p class="text-gray-600 text-base">
        支持初中 / 高中多科目、全年级，适合班主任与科任老师共同使用
      </p>
    </div>

    <AppCard class="mb-6">
      <template #header>
        <h2 class="text-base font-semibold text-gray-900">① 选择使用角色</h2>
        <p class="text-sm text-gray-500 mt-1">
          不同角色看到的分析维度不同，可随时在顶部切换
        </p>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          class="text-left p-4 rounded-xl border-2 transition-all"
          :class="
            settings.role === 'classTeacher'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          "
          @click="selectRole('classTeacher')"
        >
          <div class="flex items-center gap-3 mb-1">
            <span class="text-3xl">👩‍🏫</span>
            <span class="font-semibold text-gray-900">班主任</span>
            <span
              v-if="settings.role === 'classTeacher'"
              class="ml-auto text-primary-600"
            >
              ✓
            </span>
          </div>
          <p class="text-xs text-gray-500 ml-11">
            关注全班整体 · 各科均分 · 学生排名 · 全科对比
          </p>
        </button>
        <button
          type="button"
          class="text-left p-4 rounded-xl border-2 transition-all"
          :class="
            settings.role === 'subjectTeacher'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          "
          @click="selectRole('subjectTeacher')"
        >
          <div class="flex items-center gap-3 mb-1">
            <span class="text-3xl">👨‍🏫</span>
            <span class="font-semibold text-gray-900">科任老师</span>
            <span
              v-if="settings.role === 'subjectTeacher'"
              class="ml-auto text-primary-600"
            >
              ✓
            </span>
          </div>
          <p class="text-xs text-gray-500 ml-11">
            聚焦单个学科 · 分数分布 · 及格/优秀率 · Top / Bottom 榜单
          </p>
        </button>
      </div>
    </AppCard>

    <AppCard class="mb-6">
      <template #header>
        <h2 class="text-base font-semibold text-gray-900">② 选择年级模板</h2>
        <p class="text-sm text-gray-500 mt-1">
          选择最匹配的模板后，加载示例数据或下载对应 Excel 模板
        </p>
      </template>
      <GradeTemplateSelector
        :model-value="settings.selectedTemplateId"
        @update:model-value="settings.setTemplate"
      />
    </AppCard>

    <AppCard>
      <template #header>
        <h2 class="text-base font-semibold text-gray-900">
          ③ 上传成绩表或加载示例
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          系统会自动识别 Excel 中的所有科目列，无需修改格式
        </p>
      </template>
      <ExcelUploader />
    </AppCard>

    <div
      v-if="store.hasData"
      class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center"
    >
      <div>
        <p class="text-sm font-medium text-green-800">
          ✅ 已加载 {{ store.exams.length }} 次考试 · {{ store.students.length }} 名学生
          · {{ store.currentSubjects.length }} 个科目
        </p>
      </div>
      <div class="flex gap-2">
        <router-link
          :to="
            settings.role === 'subjectTeacher' && settings.currentSubject
              ? `/subject/${encodeURIComponent(settings.currentSubject)}`
              : '/dashboard'
          "
          class="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
        >
          {{ settings.role === 'subjectTeacher' ? '去看我的学科' : '查看班级分析' }}
          →
        </router-link>
      </div>
    </div>
  </div>
</template>
