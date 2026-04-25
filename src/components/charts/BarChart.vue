<script setup lang="ts">
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import BaseChart from './BaseChart.vue';

const props = defineProps<{
  categories: string[];
  series: { name: string; data: number[]; color?: string }[];
  yAxisName?: string;
  height?: string;
  showLabel?: boolean;
}>();

const option = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  legend: {
    show: props.series.length > 1,
    top: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: props.series.length > 1 ? 40 : 20,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
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
    type: 'bar',
    data: s.data,
    itemStyle: s.color ? { color: s.color } : undefined,
    label: {
      show: props.showLabel ?? true,
      position: 'top',
      color: '#374151',
      fontSize: 11,
    },
    barMaxWidth: 40,
  })),
}));
</script>

<template>
  <BaseChart :option="option" :height="height" />
</template>
