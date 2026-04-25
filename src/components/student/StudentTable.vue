<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Student } from '@/types';

const props = defineProps<{
  students: Student[];
  subjects: string[];
}>();

const router = useRouter();
const search = ref('');
const sortKey = ref<'total' | string>('total');
const sortOrder = ref<'asc' | 'desc'>('desc');

const filteredSorted = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  const list = keyword
    ? props.students.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.id.toLowerCase().includes(keyword),
      )
    : [...props.students];

  return list.sort((a, b) => {
    let av = 0;
    let bv = 0;
    if (sortKey.value === 'total') {
      av = a.total;
      bv = b.total;
    } else {
      av = a.scores.find((x) => x.subject === sortKey.value)?.score ?? 0;
      bv = b.scores.find((x) => x.subject === sortKey.value)?.score ?? 0;
    }
    return sortOrder.value === 'desc' ? bv - av : av - bv;
  });
});

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'desc';
  }
}

function sortIcon(key: string) {
  if (sortKey.value !== key) return '⇅';
  return sortOrder.value === 'desc' ? '↓' : '↑';
}

function getScore(student: Student, subject: string): number {
  return student.scores.find((s) => s.subject === subject)?.score ?? 0;
}

function goToDetail(id: string) {
  router.push(`/student/${id}`);
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 搜索学号或姓名..."
        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <span class="text-sm text-gray-500">
        共 {{ filteredSorted.length }} 名学生
      </span>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
              学号
            </th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
              姓名
            </th>
            <th
              v-for="subject in subjects"
              :key="subject"
              class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer select-none hover:bg-gray-100 whitespace-nowrap"
              @click="toggleSort(subject)"
            >
              {{ subject }} {{ sortIcon(subject) }}
            </th>
            <th
              class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer select-none hover:bg-gray-100 whitespace-nowrap"
              @click="toggleSort('total')"
            >
              总分 {{ sortIcon('total') }}
            </th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr
            v-for="student in filteredSorted"
            :key="student.id"
            class="hover:bg-primary-50/50 transition-colors cursor-pointer"
            @click="goToDetail(student.id)"
          >
            <td class="px-3 py-3 text-gray-600 font-mono">{{ student.id }}</td>
            <td class="px-3 py-3 font-medium text-gray-900">
              {{ student.name }}
            </td>
            <td
              v-for="subject in subjects"
              :key="subject"
              class="px-3 py-3"
              :class="{
                'text-red-600 font-semibold': getScore(student, subject) < 60,
                'text-green-600 font-semibold':
                  getScore(student, subject) >= 90,
              }"
            >
              {{ getScore(student, subject) }}
            </td>
            <td class="px-3 py-3 font-semibold text-primary-700">
              {{ student.total }}
            </td>
            <td class="px-3 py-3">
              <button
                class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                @click.stop="goToDetail(student.id)"
              >
                详情 →
              </button>
            </td>
          </tr>
          <tr v-if="filteredSorted.length === 0">
            <td :colspan="subjects.length + 4" class="px-4 py-8 text-center text-gray-500">
              暂无匹配的学生
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
