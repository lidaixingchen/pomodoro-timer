<template>
  <div class="flex flex-col gap-6 h-full">
    <!-- Today Stats Cards Grid -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Total Pomodoros today -->
      <div class="neo-card bg-neo-accent p-4 text-center flex flex-col justify-center items-center">
        <span class="text-xs md:text-sm font-black uppercase text-black border-b-2 border-black pb-1 mb-2">
          今日完成
        </span>
        <span class="text-3xl md:text-4xl font-black text-black font-mono">
          {{ sessionStore.todayCompletedCount }} <span class="text-base font-black">个</span>
        </span>
      </div>

      <!-- Total Focus Time today -->
      <div class="neo-card bg-neo-custom p-4 text-center flex flex-col justify-center items-center">
        <span class="text-xs md:text-sm font-black uppercase text-black border-b-2 border-black pb-1 mb-2">
          专注时长
        </span>
        <span class="text-3xl md:text-4xl font-black text-black font-mono">
          {{ sessionStore.todayTotalDuration }} <span class="text-base font-black">分钟</span>
        </span>
      </div>
    </div>

    <!-- 7-Day Trend Chart -->
    <div class="neo-card bg-white flex flex-col">
      <h3 class="text-md md:text-lg font-black text-black border-b-3 border-black pb-2 mb-4 flex items-center gap-2">
        📈 近 7 日趋势
      </h3>
      <div class="h-44 md:h-52 relative">
        <Line :data="lineChartData" :options="lineChartOptions" />
      </div>
    </div>

    <!-- Category Distribution Chart -->
    <div class="neo-card bg-white flex flex-col">
      <h3 class="text-md md:text-lg font-black text-black border-b-3 border-black pb-2 mb-4 flex items-center gap-2">
        📊 专注分类分布
      </h3>
      <div class="h-44 md:h-52 relative flex items-center justify-center">
        <Pie :data="pieChartData" :options="pieChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/sessionStore'
import { Line, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'

// 注册 Chart.js 核心组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const sessionStore = useSessionStore()

// 7日趋势折线图数据
const lineChartData = computed(() => {
  const { labels, data } = sessionStore.getLast7DaysSessions
  return {
    labels,
    datasets: [
      {
        label: '完成番茄钟',
        data,
        borderColor: '#000000',
        borderWidth: 4,
        backgroundColor: '#FFDE47', // neo-accent
        pointBackgroundColor: '#FF5A5F', // neo-work
        pointBorderColor: '#000000',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false,
        tension: 0 // 新粗野主义风格：折线直角连接，不进行平滑
      }
    ]
  }
})

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#000000',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      titleFont: { weight: 'bold' as const },
      bodyFont: { weight: 'bold' as const },
      borderColor: '#000000',
      borderWidth: 2,
      displayColors: false,
      padding: 8
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { color: '#000000', width: 3 },
      ticks: { 
        color: '#000000', 
        font: { weight: 'bold' as const, family: 'monospace' } 
      }
    },
    y: {
      grid: { color: '#E5E7EB', lineWidth: 1 },
      border: { color: '#000000', width: 3 },
      ticks: { 
        color: '#000000', 
        font: { weight: 'bold' as const, family: 'monospace' },
        stepSize: 1,
        precision: 0
      }
    }
  }
}

// 计划占比分布数据
const pieChartData = computed(() => {
  const { labels, data } = sessionStore.getSessionsGroupedByPlan
  
  if (data.length === 0) {
    return {
      labels: ['暂无数据'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['#E5E7EB'],
          borderColor: '#000000',
          borderWidth: 3
        }
      ]
    }
  }

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#FF5A5F', // neo-work
          '#38BDF8', // neo-custom
          '#FFDE47', // neo-accent
          '#00E676', // neo-break
          '#C084FC', // purple
          '#F472B6'  // pink
        ],
        borderColor: '#000000',
        borderWidth: 3
      }
    ]
  }
})

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#000000',
        font: { weight: 'bold' as const, size: 11 },
        padding: 12,
        usePointStyle: true,
        pointStyle: 'rect'
      }
    },
    tooltip: {
      backgroundColor: '#000000',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      titleFont: { weight: 'bold' as const },
      bodyFont: { weight: 'bold' as const },
      borderColor: '#000000',
      borderWidth: 2,
      padding: 8
    }
  }
}
</script>
