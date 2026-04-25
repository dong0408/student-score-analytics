<script setup lang="ts">
import { computed } from 'vue';
import type { GradeTemplate } from '@/types';
import { GRADE_TEMPLATES } from '@/utils/gradeTemplates';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const groups = computed(() => {
  const map = new Map<string, { label: string; items: GradeTemplate[] }>();
  GRADE_TEMPLATES.forEach((t) => {
    const key =
      t.category === 'junior'
        ? '初中'
        : t.category === 'senior'
          ? '高中（传统文理科）'
          : t.category === 'gaokao'
            ? '高中（新高考 3+1+2）'
            : '自定义';
    if (!map.has(key)) map.set(key, { label: key, items: [] });
    map.get(key)!.items.push(t);
  });
  return Array.from(map.values());
});

function select(id: string) {
  emit('update:modelValue', id);
}
</script>

<template>
  <div class="space-y-5">
    <div v-for="group in groups" :key="group.label">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {{ group.label }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          v-for="t in group.items"
          :key="t.id"
          type="button"
          class="text-left p-3 rounded-lg border transition-all"
          :class="[
            props.modelValue === t.id
              ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30',
          ]"
          @click="select(t.id)"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-gray-900 text-sm">
              {{ t.name }}
            </span>
            <span
              v-if="props.modelValue === t.id"
              class="text-primary-600 text-sm"
            >
              ✓
            </span>
          </div>
          <p class="text-xs text-gray-500 mb-2">
            {{ t.description }}
          </p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="s in t.subjects"
              :key="s"
              class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
            >
              {{ s }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
