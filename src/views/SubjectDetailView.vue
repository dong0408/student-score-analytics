<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppCard from '@/components/common/AppCard.vue';
import HistogramChart from '@/components/charts/HistogramChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import { useStudentStore } from '@/stores/studentStore';
import {
  analyzeSubject,
  getSubjectTrendAcrossExams,
} from '@/utils/analysis';

const props = defineProps<{ name: string }>();

const router = useRouter();
const store = useStudentStore();
const search = ref('');

const decodedName = computed(() => decodeURIComponent(props.name));

const analysis = computed(() => {
  if (!store.currentExam) return null;
  if (!store.currentExam.subjects.includes(decodedName.value)) return null;
  return analyzeSubject(
    store.currentExam,
    decodedName.value,
    store.previousExam ?? undefined,
  );
});

const trendSeries = computed(() => {
  const data = getSubjectTrendAcrossExams(decodedName.value, store.exams);
  return {
    categories: data.map((d) => d.examName),
    series: [
      {
        name: decodedName.value,
        data: data.map((d) => d.average),
        color: '#3b82f6',
      },
    ],
  };
});

const pieData = computed(() => {
  if (!analysis.value) return [];
  return [
    {
      name: `优秀 (≥85)`,
      value: Math.round(
        (analysis.value.excellentRate / 100) * analysis.value.studentCount,
      ),
    },
    {
      name: `良好 (75-85)`,
      value: Math.round(
        (analysis.value.goodRate / 100) * analysis.value.studentCount,
      ),
    },
    {
      name: `及格 (60-75)`,
      value: Math.round(
        ((analysis.value.passRate -
          analysis.value.goodRate -
          analysis.value.excellentRate) /
          100) *
          analysis.value.studentCount,
      ),
    },
    {
      name: `不及格 (<60)`,
      value: Math.round(
        (analysis.value.failRate / 100) * analysis.value.studentCount,
      ),
    },
  ].filter((d) => d.value > 0);
});

const filteredRanked = computed(() => {
  if (!analysis.value) return [];
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return analysis.value.rankedStudents;
  return analysis.value.rankedStudents.filter(
    (r) =>
      r.student.name.toLowerCase().includes(keyword) ||
      r.student.id.toLowerCase().includes(keyword),
  );
});

function goToStudent(id: string) {
  router.push(`/student/${id}`);
}

function trendLabel(trend: string): string {
  if (trend === 'up') return '📈 进步';
  if (trend === 'down') return '📉 退步';
  return '➡️ 持平';
}

function trendColor(trend: string): string {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-600';
}
</script>

<template>
  <div>
    <div v-if="!analysis" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-gray-600 mb-4">
        未找到【{{ decodedName }}】科目数据
      </p>
      <router-link
        to="/subjects"
        class="inline-block px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        返回各科概览
      </router-link>
    </div>

    <div v-else>
      <router-link
        to="/subjects"
        class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4"
      >
        ← 返回各科概览
      </router-link>

      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            📘 {{ analysis.subject }} · 学科分析
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ store.currentExam?.name }} · 参评学生 {{ analysis.studentCount }} 人
            <span class="ml-2" :class="trendColor(analysis.trend)">
              · {{ trendLabel(analysis.trend) }}
              {{ analysis.delta > 0 ? '+' : '' }}{{ analysis.delta.toFixed(1) }}
            </span>
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">平均分</p>
          <p class="text-xl font-bold text-primary-700">
            {{ analysis.average.toFixed(1) }}
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">中位数</p>
          <p class="text-xl font-bold text-gray-900">
            {{ analysis.median.toFixed(1) }}
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">最高分</p>
          <p class="text-xl font-bold text-green-600">{{ analysis.max }}</p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">最低分</p>
          <p class="text-xl font-bold text-red-600">{{ analysis.min }}</p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">标准差</p>
          <p class="text-xl font-bold text-gray-900">
            {{ analysis.stdDev.toFixed(1) }}
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">及格率</p>
          <p class="text-xl font-bold text-gray-900">
            {{ analysis.passRate.toFixed(0) }}%
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">优秀率</p>
          <p class="text-xl font-bold text-green-700">
            {{ analysis.excellentRate.toFixed(0) }}%
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">不及格率</p>
          <p class="text-xl font-bold text-red-600">
            {{ analysis.failRate.toFixed(0) }}%
          </p>
        </AppCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AppCard title="📊 分数段分布" subtitle="学生本科目成绩落在各分数段的人数">
          <HistogramChart :bands="analysis.distribution" />
        </AppCard>

        <AppCard title="🥧 等级占比" subtitle="优秀/良好/及格/不及格学生占比">
          <PieChart v-if="pieData.length > 0" :data="pieData" />
          <div v-else class="py-12 text-center text-gray-500 text-sm">
            暂无分布数据
          </div>
        </AppCard>

        <AppCard
          v-if="trendSeries.categories.length > 1"
          title="📈 历次考试趋势"
          subtitle="本科目历次考试均分变化"
        >
          <LineChart
            :categories="trendSeries.categories"
            :series="trendSeries.series"
            y-axis-name="均分"
          />
        </AppCard>

        <AppCard title="🏆 成绩榜单" subtitle="Top 10 / Bottom 10">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-2">
                🥇 前 10 名
              </p>
              <div class="space-y-1">
                <button
                  v-for="r in analysis.topStudents"
                  :key="r.student.id"
                  type="button"
                  class="w-full flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-primary-50 text-left"
                  @click="goToStudent(r.student.id)"
                >
                  <span class="flex items-center gap-2">
                    <span
                      class="w-5 h-5 text-xs flex items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold"
                    >
                      {{ r.rank }}
                    </span>
                    <span class="text-gray-900">{{ r.student.name }}</span>
                  </span>
                  <span class="font-semibold text-green-700">{{ r.score }}</span>
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-2">
                ⚠️ 后 10 名
              </p>
              <div class="space-y-1">
                <button
                  v-for="r in analysis.bottomStudents"
                  :key="r.student.id"
                  type="button"
                  class="w-full flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-red-50 text-left"
                  @click="goToStudent(r.student.id)"
                >
                  <span class="flex items-center gap-2">
                    <span
                      class="w-5 h-5 text-xs flex items-center justify-center rounded-full bg-red-100 text-red-700 font-semibold"
                    >
                      {{ r.rank }}
                    </span>
                    <span class="text-gray-900">{{ r.student.name }}</span>
                  </span>
                  <span class="font-semibold text-red-600">{{ r.score }}</span>
                </button>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <AppCard title="📋 全体学生成绩（按分数降序）" subtitle="点击姓名可进入该学生详情">
        <div class="mb-3">
          <input
            v-model="search"
            type="text"
            placeholder="🔍 搜索学号或姓名..."
            class="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">排名</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">学号</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">姓名</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">{{ analysis.subject }}</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">总分</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="r in filteredRanked"
                :key="r.student.id"
                class="hover:bg-primary-50/50 cursor-pointer"
                @click="goToStudent(r.student.id)"
              >
                <td class="px-4 py-2 font-mono text-gray-500">
                  #{{ r.rank }}
                </td>
                <td class="px-4 py-2 font-mono text-gray-600">
                  {{ r.student.id }}
                </td>
                <td class="px-4 py-2 font-medium text-gray-900">
                  {{ r.student.name }}
                </td>
                <td
                  class="px-4 py-2 font-semibold"
                  :class="{
                    'text-green-600': r.score >= 85,
                    'text-red-600': r.score < 60,
                    'text-gray-900': r.score >= 60 && r.score < 85,
                  }"
                >
                  {{ r.score }}
                </td>
                <td class="px-4 py-2 text-gray-600">{{ r.student.total }}</td>
                <td class="px-4 py-2">
                  <button
                    class="text-primary-600 hover:text-primary-800 text-xs"
                    @click.stop="goToStudent(r.student.id)"
                  >
                    详情 →
                  </button>
                </td>
              </tr>
              <tr v-if="filteredRanked.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                  暂无匹配的学生
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  </div>
</template>
