<script setup lang="ts">
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import BaseChart from './BaseChart.vue';

const props = defineProps<{
  indicators: { name: string; max: number }[];
  series: { name: string; value: number[]; color?: string }[];
  height?: string;
}>();

const option = computed<EChartsOption>(() => ({
  tooltip: {},
  legend: { top: 0 },
  radar: {
    indicator: props.indicators,
    splitNumber: 4,
    axisName: { color: '#374151', fontSize: 12 },
    splitLine: { lineStyle: { color: '#e5e7eb' } },
    splitArea: { areaStyle: { color: ['#f9fafb', 'transparent'] } },
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  series: [
    {
      type: 'radar',
      data: props.series.map((s) => ({
        name: s.name,
        value: s.value,
        areaStyle: { opacity: 0.2 },
        lineStyle: { width: 2 },
        itemStyle: s.color ? { color: s.color } : undefined,
      })),
    },
  ],
}));
</script>

<template>
  <BaseChart :option="option" :height="height" />
</template>
