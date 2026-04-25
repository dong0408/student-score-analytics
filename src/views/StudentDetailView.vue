<script setup lang="ts">
import { computed } from 'vue';
import { useStudentStore } from '@/stores/studentStore';
import { getStudentExamHistory } from '@/utils/analysis';
import AppCard from '@/components/common/AppCard.vue';
import RadarChart from '@/components/charts/RadarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import StudentEvaluation from '@/components/student/StudentEvaluation.vue';

const props = defineProps<{ id: string }>();

const store = useStudentStore();

const student = computed(() => store.getStudentById(props.id));

const radarData = computed(() => {
  if (!student.value) return { indicators: [], series: [] };
  return {
    indicators: student.value.scores.map((s) => ({
      name: s.subject,
      max: 100,
    })),
    series: [
      {
        name: student.value.name,
        value: student.value.scores.map((s) => s.score),
        color: '#3b82f6',
      },
    ],
  };
});

const history = computed(() =>
  student.value ? getStudentExamHistory(student.value.id, store.exams) : [],
);

const lineData = computed(() => {
  if (history.value.length === 0 || !student.value) {
    return { categories: [], series: [] };
  }
  const subjects = student.value.scores.map((s) => s.subject);
  const colors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

  return {
    categories: history.value.map((h) => h.examName),
    series: subjects.map((subject, i) => ({
      name: subject,
      color: colors[i % colors.length],
      data: history.value.map((h) => h.scores[subject] ?? 0),
    })),
  };
});
</script>

<template>
  <div>
    <div v-if="!student" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-gray-600 mb-4">未找到 ID 为 {{ id }} 的学生</p>
      <router-link
        to="/students"
        class="inline-block px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        返回学生列表
      </router-link>
    </div>

    <div v-else>
      <router-link
        to="/students"
        class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4"
      >
        ← 返回学生列表
      </router-link>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AppCard class="lg:col-span-1">
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="w-14 h-14 rounded-full bg-primary-100 text-primary-700 text-xl font-bold flex items-center justify-center"
              >
                {{ student.name.charAt(0) }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ student.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ student.id }} · {{ student.className }}
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="s in student.scores"
              :key="s.subject"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-600">{{ s.subject }}</span>
              <div class="flex items-center gap-2 flex-1 ml-4">
                <div
                  class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full rounded-full transition-all"
                    :class="
                      s.score >= 85
                        ? 'bg-green-500'
                        : s.score >= 60
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                    "
                    :style="{ width: `${s.score}%` }"
                  ></div>
                </div>
                <span
                  class="text-sm font-semibold w-10 text-right"
                  :class="{
                    'text-red-600': s.score < 60,
                    'text-green-600': s.score >= 90,
                  }"
                >
                  {{ s.score }}
                </span>
              </div>
            </div>
            <div
              class="flex justify-between pt-3 border-t border-gray-100"
            >
              <span class="text-sm font-medium text-gray-700">总分</span>
              <span class="text-lg font-bold text-primary-700">
                {{ student.total }}
              </span>
            </div>
          </div>
        </AppCard>

        <AppCard
          class="lg:col-span-2"
          title="📊 能力雷达图"
          subtitle="各科成绩维度分布"
        >
          <RadarChart
            :indicators="radarData.indicators"
            :series="radarData.series"
            height="360px"
          />
        </AppCard>

        <AppCard
          class="lg:col-span-2"
          title="📈 成绩变化趋势"
          subtitle="历次考试各科成绩变化"
        >
          <LineChart
            v-if="lineData.categories.length > 1"
            :categories="lineData.categories"
            :series="lineData.series"
            y-axis-name="分数"
          />
          <div v-else class="py-12 text-center text-gray-500 text-sm">
            需要至少 2 次考试才能显示趋势图
          </div>
        </AppCard>

        <AppCard
          class="lg:col-span-1"
          title="🤖 智能评价"
          subtitle="基于规则引擎自动生成"
        >
          <StudentEvaluation :student="student" />
        </AppCard>
      </div>
    </div>
  </div>
</template>
