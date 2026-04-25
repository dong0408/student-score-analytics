import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首页' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: '班级总览' },
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: () => import('@/views/SubjectsView.vue'),
      meta: { title: '各科概览' },
    },
    {
      path: '/subject/:name',
      name: 'subjectDetail',
      component: () => import('@/views/SubjectDetailView.vue'),
      props: true,
      meta: { title: '学科分析' },
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('@/views/StudentsView.vue'),
      meta: { title: '学生列表' },
    },
    {
      path: '/student/:id',
      name: 'studentDetail',
      component: () => import('@/views/StudentDetailView.vue'),
      props: true,
      meta: { title: '学生详情' },
    },
  ],
});

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? '';
  document.title = title
    ? `${title} | 学生成绩分析管理系统`
    : '学生成绩分析管理系统';
});

export default router;
