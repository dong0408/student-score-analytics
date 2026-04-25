<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div v-if="title || subtitle || $slots.header" class="mb-4">
      <slot name="header">
        <h3 v-if="title" class="text-base font-semibold text-gray-900">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <slot />
  </div>
</template>
