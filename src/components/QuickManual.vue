<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import { ref } from 'vue';

import Doc from './Doc.vue';
import { vscodeVim, git } from '@/data/index';
import Okx from './Okx.vue';

interface TabItem {
  title: string;
  type: string;
  icon: string;
}
const tabList: TabItem[] = [
  // { title: 'OKX', type: 'okx', icon: 'web__bitebi' },
  { title: 'VSCodeVim Command', type: 'vscodeVim', icon: 'vimeo' },
  { title: 'Git Command', type: 'git', icon: 'git' },
];

const currentTab = ref<TabItem>(tabList[0]);
const onTabItemClick = (tab: TabItem) => {
  currentTab.value = tab;
};
</script>

<template>
  <div class="quick-manual">
    <!-- @ts-ignore -->
    <div class="content-wrap">
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

      <section class="content" v-if="currentTab.type === 'okx'">
        <h2 class="title">{{ currentTab.title }}</h2>

        <div class="body">
          <Okx></Okx>
        </div>
      </section>
    </div>

    <nav class="tabbar">
      <span v-for="item in tabList" :key="item.title" class="tabbar__item"
        :class="{ 'tabbar__item--active': currentTab.type === item.type }" @click="onTabItemClick(item)">
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
    padding: 0;
  }

  .content {
    height: 100%;

    .title {
      position: relative;
      margin: 0 10px;
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
