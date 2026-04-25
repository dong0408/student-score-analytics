<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

const props = defineProps<{
  option: EChartsOption;
  height?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
const chartInstance = shallowRef<echarts.ECharts | null>(null);
let resizeObserver: ResizeObserver | null = null;

function initChart() {
  if (!containerRef.value) return;
  chartInstance.value = echarts.init(containerRef.value);
  chartInstance.value.setOption(props.option);

  resizeObserver = new ResizeObserver(() => {
    chartInstance.value?.resize();
  });
  resizeObserver.observe(containerRef.value);
}

watch(
  () => props.option,
  (newOption) => {
    chartInstance.value?.setOption(newOption, true);
  },
  { deep: true },
);

onMounted(initChart);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chartInstance.value?.dispose();
  chartInstance.value = null;
});
</script>

<template>
  <div
    ref="containerRef"
    class="w-full"
    :style="{ height: height || '320px' }"
  ></div>
</template>
