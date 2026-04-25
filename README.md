# 学生成绩分析管理系统

> Student Score Analytics System — 基于 Vue 3 + Vite + Pinia + ECharts 的前端成绩分析工具

替代教师使用 Excel 手工统计成绩，自动分析班级成绩变化趋势，提供学生个人成绩分析与评价，并通过图表直观展示数据。

## ✨ 核心功能

- 📥 **Excel 一键导入** — 支持拖拽上传 `.xlsx` 文件，自动解析与校验
- 📊 **班级成绩分析** — 各科均分、进步/退步趋势、分数段分布
- 👥 **学生列表管理** — 支持搜索、按总分/单科排序
- 🎯 **学生个人详情** — 雷达图 + 折线图 + 自动生成评语
- 📈 **多维数据可视化** — 柱状图 / 折线图 / 雷达图 / 饼图 / 直方图
- 🤖 **智能评价引擎** — 基于规则识别优势/薄弱科目，生成个性化评语
`
## 🛠 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 3.5 (Composition API + `<script setup>`) |
| 构建 | Vite 5 |
| 语言 | TypeScript |
| 状态管理 | Pinia (Setup Store) |
| 路由 | Vue Router 4 |
| 样式 | TailwindCSS 3 |
| 图表 | ECharts 5 |
| Excel 解析 | SheetJS (xlsx) |

## 📦 安装 & 运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 生产构建
pnpm run build

# 预览构建产物
pnpm run preview

# 类型检查
pnpm run type-check
```

开发服务器默认监听 `http://localhost:5173`。

## 📁 项目结构

```
student-score-analytics/
├── public/                      # 静态资源
├── src/
│   ├── assets/styles/main.css   # Tailwind + 自定义样式
│   ├── components/
│   │   ├── common/              # 通用组件（Header、Card）
│   │   ├── upload/              # Excel 上传组件
│   │   ├── charts/              # 图表组件（ECharts 封装）
│   │   └── student/             # 学生相关组件
│   ├── views/                   # 页面视图
│   │   ├── HomeView.vue         # /
│   │   ├── DashboardView.vue    # /dashboard
│   │   ├── StudentsView.vue     # /students
│   │   └── StudentDetailView.vue # /student/:id
│   ├── stores/                  # Pinia store
│   ├── utils/                   # 工具函数（excel/analysis/evaluation/mockData）
│   ├── types/                   # TypeScript 类型定义
│   ├── router/                  # Vue Router 配置
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 📋 Excel 格式要求

上传的 Excel 文件（第一个工作表）必须包含以下列（列名需完全一致）：

| 学号 | 姓名 | 班级 | 语文 | 数学 | 英语 | 总分（可选） |
| --- | --- | --- | --- | --- | --- | --- |
| S001 | 张三 | 三年级1班 | 88 | 95 | 82 | 265 |

- 学号、姓名、班级 为必填字符串
- 各科分数为 0-150 之间的数字
- 总分列可选（为空时自动计算）

可在首页点击 **"下载示例 Excel 模板"** 获取模板文件。

## 🎨 自动评价规则

系统基于以下规则自动生成学生评语：

- **平均分 ≥ 85** → 标注为「优秀」
- **平均分 75-85** → 标注为「良好」
- **平均分 60-75** → 标注为「中等」
- **平均分 < 60** → 标注为「待提升」
- **某科 < 60** → 标注为「偏科」，提示加强
- **最高分 - 最低分 ≥ 30** → 提示各科差距较大

评语自动组合 "总体评价 + 优势科目 + 薄弱科目 + 建议" 四部分。

## 🚀 使用指南

1. 启动开发服务器后，首页默认加载了 3 次考试的示例数据
2. 点击顶部导航切换到 "班级分析" 查看整体图表
3. 在 "学生列表" 中点击任一学生进入详情页
4. 在详情页可查看该学生的雷达图、历次成绩趋势和自动评语
5. 右上角可切换不同次考试查看对比分析
6. 如需导入自己的数据，回到首页上传 Excel 文件即可

## 📝 License

MIT
