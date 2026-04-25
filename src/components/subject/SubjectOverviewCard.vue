<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { SubjectAnalysis } from '@/types';

const props = defineProps<{
  analysis: SubjectAnalysis;
}>();

const router = useRouter();

const trendClass = computed(() => {
  if (props.analysis.trend === 'up') return 'text-green-600';
  if (props.analysis.trend === 'down') return 'text-red-600';
  return 'text-gray-500';
});

const trendIcon = computed(() => {
  if (props.analysis.trend === 'up') return '📈';
  if (props.analysis.trend === 'down') return '📉';
  return '➡️';
});

function goToDetail() {
  router.push(`/subject/${encodeURIComponent(props.analysis.subject)}`);
}
</script>

<template>
  <button
    type="button"
    class="w-full text-left bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
    @click="goToDetail"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ analysis.subject }}
      </h3>
      <span class="text-sm" :class="trendClass">
        {{ trendIcon }}
        {{ analysis.delta > 0 ? '+' : ''
        }}{{ analysis.delta.toFixed(1) }}
      </span>
    </div>

    <div class="flex items-end gap-2 mb-3">
      <span class="text-3xl font-bold text-primary-700">
        {{ analysis.average.toFixed(1) }}
      </span>
      <span class="text-xs text-gray-500 pb-1">平均分</span>
    </div>

    <div class="grid grid-cols-2 gap-3 text-sm mb-3">
      <div>
        <p class="text-xs text-gray-500">及格率</p>
        <p class="font-semibold text-gray-900">
          {{ analysis.passRate.toFixed(1) }}%
        </p>
      </div>
      <div>
        <p class="text-xs text-gray-500">优秀率</p>
        <p class="font-semibold text-gray-900">
          {{ analysis.excellentRate.toFixed(1) }}%
        </p>
      </div>
      <div>
        <p class="text-xs text-gray-500">最高分</p>
        <p class="font-semibold text-green-600">{{ analysis.max }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500">最低分</p>
        <p class="font-semibold text-red-600">{{ analysis.min }}</p>
      </div>
    </div>

    <p class="text-xs text-primary-600 font-medium text-right">
      查看详细分析 →
    </p>
  </button>
</template>
