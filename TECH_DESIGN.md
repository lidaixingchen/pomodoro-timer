# 技术设计

## 技术栈

- Vue3 + TypeScript + Vite
- Tailwind CSS
- Pinia（状态管理）
- Vue Chart（如果需要统计图表）
- date-fns（日期处理库）

## 项目结构

## 数据管理
localStorage 存储 pomodoro 计划数据（localStorage）。
数据字段：id（唯一标识）、name（计划名称）、type（计划类型）、duration（计划时长）、breakDuration（休息时长）、createdAt（创建时间）。

