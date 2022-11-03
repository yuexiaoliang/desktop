<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import { SlideInOut } from 'vue3-transitions';
import { ref } from 'vue';

import Doc from './Doc.vue';
import { vscodeVim, git } from '@/data/index';

interface TabItem {
  title: string;
  type: string;
  icon: string;
}
const tabList: TabItem[] = [
  { title: 'Git Command', type: 'git', icon: 'git' },
  { title: 'VSCodeVim Command', type: 'vscodeVim', icon: 'vimeo' }
];

const currentTab = ref<TabItem>(tabList[0]);
const onTabItemClick = (tab: TabItem) => {
  currentTab.value = tab;
};
</script>

<template>
  <div class="quick-manual">
    <!-- @ts-ignore -->
    <SlideInOut group entry="left" exit="right" :duration="{ enter: 800, leave: 300 } as any" tag="div" class="content-wrap">
      <section class="content" v-if="currentTab.type === 'git'">
        <h2 class="title">{{ currentTab.title }}</h2>

        <div class="body">
          <Doc :data="git"></Doc>
        </div>
      </section>

      <section class="content" v-if="currentTab.type === 'vscodeVim'">
        <h2 class="title">{{ currentTab.title }}</h2>

        <div class="body">
          <Doc :data="vscodeVim"></Doc>
        </div>
      </section>
    </SlideInOut>

    <nav class="tabbar">
      <span v-for="item in tabList" :key="item.title" class="tabbar__item" :class="{ 'tabbar__item--active': currentTab.type === item.type }" @click="onTabItemClick(item)">
        <Icon class="icon" :name="item.icon"></Icon>
      </span>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.quick-manual {
  --tabbar-height: 40px;

  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .content-wrap {
    height: calc(100% - var(--tabbar-height));
    padding: 0 10px;
  }

  .content {
    height: 100%;

    .title {
      position: relative;
      margin: 0;
      padding: 15px 0 6px;
      font-size: 18px;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 3px;
        background-color: var(--color-stress);
        border-radius: 3px;
      }
    }

    .body {
      @extend .s-scrollbar;
      margin-top: 20px;
      height: calc(100% - 50px);

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .tabbar {
    display: flex;
    width: 100%;
    height: var(--tabbar-height);

    &__item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: var(--quick-manual--color);
      font-size: 24px;
      cursor: pointer;

      &--active {
        color: var(--quick-manual--color-active);
      }
    }
  }
}
</style>
