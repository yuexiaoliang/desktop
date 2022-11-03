<script setup lang="ts">
import logo from '/logo.svg';
import QuickManual from '@/components/QuickManual.vue';
</script>

<template>
  <div class="layout">
    <aside class="layout__aside layout__aside--left">
      <div class="cell" v-for="i in 24" :key="i"></div>
    </aside>

    <div class="layout__main">
      <div class="layout__content">
        <img class="logo" :src="logo" alt="logo" />
      </div>
      <footer class="layout__footer"></footer>
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
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
    }

    &--right {
      @extend .s-container;
      margin: 10px;
      width: var(--layout--aside-right-width);
    }

    .cell {
      @extend .s-container;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 0 0 10px;
      width: var(--desktop-cell-width);
      height: var(--desktop-cell-width);
      border-style: dashed;

      &::after {
        $w: calc(100% - 10px);
        content: '';
        display: block;
        width: $w;
        height: $w;
        border-radius: 50%;
        border: 1px dashed var(--border-color);
        opacity: 0.6;
      }
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
    margin: 0 0 10px;
    height: var(--layout--footer-height);
  }
}
</style>
