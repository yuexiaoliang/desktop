<script setup lang="ts">
import { ref } from 'vue';
import logo from '/logo.svg';
import QuickManual from '@/components/QuickManual.vue';
import Notes from './components/Notes.vue';

const todo = ref(['Score Next', '文档补充', '完善简历', '图表库']);
</script>

<template>
  <div class="layout">
    <aside class="layout__aside layout__aside--left"></aside>

    <div class="layout__main">
      <div class="layout__content">
        <img class="logo" :src="logo" alt="logo" />
      </div>
      <footer class="layout__footer">
        <Notes class="notes" :list="todo"></Notes>
      </footer>
    </div>

    <aside class="layout__aside layout__aside--right">
      <QuickManual />
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  padding-bottom: var(--task-bar-height);
  height: 100vh;
  background-color: var(--layout--bg-color);
  color: var(--layout--color);
  overflow: hidden;

  &__aside {
    &--left {
      width: var(--layout--aside-left-width);
      margin-bottom: 10px;
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      background: url('@/assets/images/cell-bg.png');
    }

    &--right {
      @extend .s-container;
      margin: 10px;
      width: var(--layout--aside-right-width);
    }
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__content {
    @extend .s-container;

    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    .logo {
      display: block;
      width: 150px;
      opacity: 0.2;
      transition: opacity 0.3s;
    }

    &:hover {
      .logo {
        opacity: 0.8;
      }
    }
  }

  &__footer {
    @extend .s-container;
    display: flex;
    margin: 0 0 10px;
    height: var(--layout--footer-height);

    .notes {
      margin-left: auto;
    }
  }
}
</style>
