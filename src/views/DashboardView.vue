<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStudentStore } from '@/stores/studentStore';
import { analyzeClass } from '@/utils/analysis';
import AppCard from '@/components/common/AppCard.vue';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import HistogramChart from '@/components/charts/HistogramChart.vue';

const router = useRouter();
const store = useStudentStore();

const analysis = computed(() => {
  if (!store.currentExam) return null;
  return analyzeClass(store.currentExam, store.previousExam ?? undefined);
});

const subjectBarSeries = computed(() => {
  if (!analysis.value) return [];
  return [
    {
      name: '本次均分',
      data: analysis.value.subjectAnalyses.map((s) =>
        Number(s.average.toFixed(1)),
      ),
      color: '#3b82f6',
    },
  ];
});

const trendLineData = computed(() => {
  const sorted = store.sortedExams;
  if (sorted.length === 0) return { categories: [], series: [] };

  const categories = sorted.map((e) => e.name);
  const subjects = store.currentSubjects;

  const colors = [
    '#3b82f6', '#10b981', '#f97316', '#8b5cf6',
    '#ef4444', '#14b8a6', '#f59e0b', '#6366f1',
  ];
  const series = subjects.map((subject, i) => ({
    name: subject,
    color: colors[i % colors.length],
    data: sorted.map((exam) => {
      const scores = exam.students
        .map((s) => s.scores.find((x) => x.subject === subject)?.score)
        .filter((n): n is number => typeof n === 'number');
      if (scores.length === 0) return 0;
      return Number(
        (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      );
    }),
  }));

  return { categories, series };
});

const pieData = computed(() => {
  if (!analysis.value) return [];
  return analysis.value.distribution
    .filter((d) => d.count > 0)
    .map((d) => ({ name: d.range, value: d.count }));
});

function trendIcon(trend: string) {
  if (trend === 'up') return '📈';
  if (trend === 'down') return '📉';
  return '➡️';
}

function trendColor(trend: string) {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-600';
}

function goToSubject(subject: string) {
  router.push(`/subject/${encodeURIComponent(subject)}`);
}
</script>

<template>
  <div>
    <div v-if="!analysis" class="text-center py-20">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-gray-600 mb-4">暂无数据，请先上传 Excel 或加载示例数据</p>
      <router-link
        to="/"
        class="inline-block px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        去首页上传
      </router-link>
    </div>

    <div v-else>
      <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ analysis.className }} · 班级总览
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ store.currentExam?.name }}
            <span v-if="analysis.grade"> · {{ analysis.grade }}</span>
            · {{ analysis.studentCount }} 名学生
            · 共 {{ analysis.subjectAnalyses.length }} 个科目
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">班级总分均分</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ analysis.totalAverage.toFixed(1) }}
          </p>
          <p
            v-if="analysis.previousTotalAverage !== undefined"
            class="text-xs mt-1"
            :class="trendColor(analysis.totalTrend)"
          >
            {{ trendIcon(analysis.totalTrend) }}
            {{ analysis.totalDelta > 0 ? '+' : ''
            }}{{ analysis.totalDelta.toFixed(1) }} 相比上次
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">班级单科均分</p>
          <p class="text-2xl font-bold text-primary-700">
            {{
              (
                analysis.subjectAnalyses.reduce(
                  (s, a) => s + a.average,
                  0,
                ) / (analysis.subjectAnalyses.length || 1)
              ).toFixed(1)
            }}
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">最高总分</p>
          <p class="text-2xl font-bold text-green-600">
            {{ Math.max(...store.students.map((s) => s.total)) }}
          </p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-gray-500 mb-1">最低总分</p>
          <p class="text-2xl font-bold text-red-600">
            {{ Math.min(...store.students.map((s) => s.total)) }}
          </p>
        </AppCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AppCard title="📊 各科平均分" subtitle="点击图表下方表格可进入单科详情">
          <BarChart
            :categories="analysis.subjectAnalyses.map((s) => s.subject)"
            :series="subjectBarSeries"
            y-axis-name="分数"
            height="300px"
          />
        </AppCard>

        <AppCard title="📈 历次考试各科趋势" subtitle="所有科目均分随时间变化">
          <LineChart
            v-if="trendLineData.categories.length > 1"
            :categories="trendLineData.categories"
            :series="trendLineData.series"
            y-axis-name="均分"
            height="300px"
          />
          <div v-else class="py-12 text-center text-gray-500 text-sm">
            需要至少 2 次考试才能显示趋势图
          </div>
        </AppCard>

        <AppCard title="📉 班级总分分布" subtitle="学生平均分所在分数段人数">
          <HistogramChart :bands="analysis.distribution" height="300px" />
        </AppCard>

        <AppCard title="🥧 成绩段占比" subtitle="各分数段学生占比">
          <PieChart :data="pieData" height="300px" />
        </AppCard>
      </div>

      <AppCard title="📋 各科详情对比" subtitle="点击任一行进入单科深度分析">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">科目</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">平均分</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">最高</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">最低</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">及格率</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">优秀率</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">变化</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="s in analysis.subjectAnalyses"
                :key="s.subject"
                class="hover:bg-primary-50/50 cursor-pointer"
                @click="goToSubject(s.subject)"
              >
                <td class="px-4 py-2 font-medium text-gray-900">
                  {{ s.subject }}
                </td>
                <td class="px-4 py-2 font-semibold text-primary-700">
                  {{ s.average.toFixed(1) }}
                </td>
                <td class="px-4 py-2 text-green-600">{{ s.max }}</td>
                <td class="px-4 py-2 text-red-600">{{ s.min }}</td>
                <td class="px-4 py-2">{{ s.passRate.toFixed(0) }}%</td>
                <td class="px-4 py-2">{{ s.excellentRate.toFixed(0) }}%</td>
                <td class="px-4 py-2" :class="trendColor(s.trend)">
                  {{ trendIcon(s.trend) }}
                  {{ s.delta > 0 ? '+' : '' }}{{ s.delta.toFixed(1) }}
                </td>
                <td class="px-4 py-2">
                  <button
                    class="text-primary-600 text-xs hover:text-primary-800"
                    @click.stop="goToSubject(s.subject)"
                  >
                    详情 →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  </div>
</template>
