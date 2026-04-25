<script setup lang="ts">
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import BaseChart from './BaseChart.vue';

const props = defineProps<{
  categories: string[];
  series: { name: string; data: number[]; color?: string }[];
  yAxisName?: string;
  height?: string;
  smooth?: boolean;
}>();

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { top: 0 },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: 40,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.categories,
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: {
    type: 'value',
    name: props.yAxisName,
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
    splitLine: { lineStyle: { color: '#f3f4f6' } },
  },
  series: props.series.map((s) => ({
    name: s.name,
    type: 'line',
    data: s.data,
    smooth: props.smooth ?? true,
    symbol: 'circle',
    symbolSize: 8,
    itemStyle: s.color ? { color: s.color } : undefined,
    lineStyle: { width: 2.5 },
  })),
}));
</script>

<template>
  <BaseChart :option="option" :height="height" />
</template>
