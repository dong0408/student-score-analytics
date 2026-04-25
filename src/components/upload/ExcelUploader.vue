<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ExcelParseError } from '@/types';
import { parseExcelFile, downloadSampleExcel } from '@/utils/excel';
import { useStudentStore } from '@/stores/studentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getTemplateById } from '@/utils/gradeTemplates';

const router = useRouter();
const store = useStudentStore();
const settings = useSettingsStore();

const isDragging = ref(false);
const isParsing = ref(false);
const errors = ref<ExcelParseError[]>([]);
const successMessage = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);

const selectedTemplate = computed(() =>
  getTemplateById(settings.selectedTemplateId),
);

async function handleFile(file: File) {
  errors.value = [];
  successMessage.value = '';
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    errors.value = [{ row: 0, message: '仅支持 .xlsx / .xls 格式' }];
    return;
  }

  isParsing.value = true;
  try {
    const {
      students,
      subjects,
      errors: parseErrors,
    } = await parseExcelFile(file);
    errors.value = parseErrors;

    if (students.length > 0) {
      const examId = `import-${Date.now()}`;
      store.addOrReplaceExam({
        id: examId,
        name: file.name.replace(/\.(xlsx|xls)$/i, ''),
        date: new Date().toISOString().slice(0, 10),
        grade: selectedTemplate.value?.grade,
        subjects,
        students,
      });
      settings.ensureValidSubject(subjects);
      successMessage.value = `成功导入 ${students.length} 名学生，识别 ${subjects.length} 个科目`;
      setTimeout(() => {
        router.push(
          settings.role === 'subjectTeacher' && settings.currentSubject
            ? `/subject/${encodeURIComponent(settings.currentSubject)}`
            : '/dashboard',
        );
      }, 800);
    } else if (parseErrors.length === 0) {
      errors.value = [{ row: 0, message: '未解析到任何学生数据' }];
    }
  } catch (err) {
    errors.value = [
      { row: 0, message: `解析失败: ${(err as Error).message}` },
    ];
  } finally {
    isParsing.value = false;
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) handleFile(file);
}

function onChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) handleFile(file);
}

function onClick() {
  fileInputRef.value?.click();
}

function loadMock() {
  store.loadMockData(settings.selectedTemplateId);
  const firstSubject = store.currentSubjects[0];
  if (firstSubject) settings.ensureValidSubject(store.currentSubjects);
  successMessage.value = `已加载【${selectedTemplate.value?.name}】示例数据`;
  setTimeout(() => {
    router.push(
      settings.role === 'subjectTeacher' && settings.currentSubject
        ? `/subject/${encodeURIComponent(settings.currentSubject)}`
        : '/dashboard',
    );
  }, 500);
}

function downloadTemplate() {
  if (!selectedTemplate.value) return;
  downloadSampleExcel(selectedTemplate.value);
}
</script>

<template>
  <div>
    <div
      class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
      :class="[
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/50',
      ]"
      @click="onClick"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop="onDrop"
    >
      <div class="text-4xl mb-2">📂</div>
      <p class="text-base font-medium text-gray-700 mb-1">
        拖拽 Excel 文件到这里，或点击选择
      </p>
      <p class="text-xs text-gray-500 mb-2">
        支持 .xlsx / .xls · 系统会自动识别所有科目列
      </p>
      <p class="text-xs text-gray-400">
        必填列：学号 / 姓名 / 班级 · 其他数值列自动视为科目
      </p>
      <input
        ref="fileInputRef"
        type="file"
        accept=".xlsx,.xls"
        class="hidden"
        @change="onChange"
      />
    </div>

    <div class="flex flex-wrap gap-3 mt-4">
      <button
        class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        @click="loadMock"
      >
        🎯 加载【{{ selectedTemplate?.name ?? '默认' }}】示例数据
      </button>
      <button
        class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        @click="downloadTemplate"
      >
        📥 下载【{{ selectedTemplate?.name ?? '默认' }}】Excel 模板
      </button>
    </div>

    <div
      v-if="isParsing"
      class="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm"
    >
      正在解析 Excel 文件...
    </div>

    <div
      v-if="successMessage"
      class="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
    >
      ✅ {{ successMessage }}
    </div>

    <div
      v-if="errors.length > 0"
      class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
    >
      <p class="font-medium mb-1">⚠️ 解析时发现 {{ errors.length }} 个问题：</p>
      <ul class="list-disc list-inside max-h-40 overflow-auto">
        <li v-for="(e, i) in errors.slice(0, 10)" :key="i">
          {{ e.message }}
        </li>
        <li v-if="errors.length > 10">
          ... 还有 {{ errors.length - 10 }} 个问题
        </li>
      </ul>
    </div>
  </div>
</template>
