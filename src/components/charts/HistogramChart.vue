<script setup lang="ts">
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import BaseChart from './BaseChart.vue';

const props = defineProps<{
  bands: { range: string; count: number }[];
  height?: string;
}>();

const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6'];

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: 20,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.bands.map((b) => b.range),
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: {
    type: 'value',
    name: '人数',
    minInterval: 1,
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
    splitLine: { lineStyle: { color: '#f3f4f6' } },
  },
  series: [
    {
      type: 'bar',
      data: props.bands.map((b, i) => ({
        value: b.count,
        itemStyle: { color: colors[i % colors.length] },
      })),
      label: { show: true, position: 'top', color: '#374151' },
      barMaxWidth: 50,
    },
  ],
}));
</script>

<template>
  <BaseChart :option="option" :height="height" />
</template>
