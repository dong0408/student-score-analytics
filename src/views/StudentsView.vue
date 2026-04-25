<script setup lang="ts">
import { useStudentStore } from '@/stores/studentStore';
import AppCard from '@/components/common/AppCard.vue';
import StudentTable from '@/components/student/StudentTable.vue';

const store = useStudentStore();
</script>

<template>
  <div>
    <div v-if="store.students.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">👥</div>
      <p class="text-gray-600 mb-4">暂无学生数据</p>
      <router-link
        to="/"
        class="inline-block px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        去首页上传
      </router-link>
    </div>
    <div v-else>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">学生列表</h2>
        <p class="text-sm text-gray-500 mt-1">
          当前考试：{{ store.currentExam?.name }} · 共
          {{ store.students.length }} 名学生 ·
          {{ store.currentSubjects.length }} 个科目（点击表头排序，点击学生查看详情）
        </p>
      </div>

      <AppCard>
        <StudentTable
          :students="store.students"
          :subjects="store.currentSubjects"
        />
      </AppCard>
    </div>
  </div>
</template>
