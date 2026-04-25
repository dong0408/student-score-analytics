<script setup lang="ts">
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import BaseChart from './BaseChart.vue';

const props = defineProps<{
  data: { name: string; value: number }[];
  title?: string;
  height?: string;
}>();

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left', top: 'middle' },
  series: [
    {
      name: props.title ?? '',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: '{b}\n{d}%',
        fontSize: 12,
      },
      data: props.data,
    },
  ],
}));
</script>

<template>
  <BaseChart :option="option" :height="height" />
</template>
