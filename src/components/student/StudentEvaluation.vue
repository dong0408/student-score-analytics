<script setup lang="ts">
import { computed } from 'vue';
import type { Student } from '@/types';
import { evaluateStudent } from '@/utils/evaluation';

const props = defineProps<{
  student: Student;
}>();

const evaluation = computed(() => evaluateStudent(props.student));

const tagColor: Record<string, string> = {
  优秀: 'bg-green-100 text-green-700',
  良好: 'bg-blue-100 text-blue-700',
  中等: 'bg-yellow-100 text-yellow-700',
  待提升: 'bg-red-100 text-red-700',
  偏科: 'bg-orange-100 text-orange-700',
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in evaluation.tags"
        :key="tag"
        class="px-3 py-1 rounded-full text-xs font-medium"
        :class="tagColor[tag] ?? 'bg-gray-100 text-gray-700'"
      >
        {{ tag }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-2">🌟 优势科目</h4>
        <ul class="space-y-1">
          <li
            v-for="s in evaluation.strongSubjects"
            :key="s.subject"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">{{ s.subject }}</span>
            <span class="font-semibold text-green-600">{{ s.score }}</span>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-2">📉 薄弱科目</h4>
        <ul class="space-y-1">
          <li
            v-for="s in evaluation.weakSubjects"
            :key="s.subject"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">{{ s.subject }}</span>
            <span class="font-semibold text-orange-600">{{ s.score }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-4">
      <h4 class="text-sm font-semibold text-gray-700 mb-2">📢 综合评价</h4>
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ evaluation.comment }}
      </p>
    </div>

    <div class="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
      <span class="text-sm text-gray-600">平均分</span>
      <span class="text-2xl font-bold text-primary-700">
        {{ evaluation.average.toFixed(1) }}
      </span>
    </div>
  </div>
</template>
