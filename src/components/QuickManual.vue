<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import { SlideInOut, FadeInOut } from 'vue3-transitions';
import { ref } from 'vue';

interface TabItem {
  title: string;
  icon: string;
}
const tabList: TabItem[] = [
  { title: 'VSCodeVim', icon: 'vimeo' },
  { title: 'Git', icon: 'git' }
];

const currentTab = ref<TabItem>(tabList[0]);
const onTabItemClick = (tab: TabItem) => {
  currentTab.value = tab;
};
</script>

<template>
  <div class="quick-manual">
    <SlideInOut group entry="left" exit="right" :duration="{ enter: 800, leave: 400 }" tag="div" class="content-wrap">
      <section class="content" v-if="currentTab.title === 'Git'">
        <h2 class="title">{{ currentTab.title }}</h2>

        <div class="body">
          <img src="~@/assets/docs/Git.jpg" alt="Git" />
        </div>
      </section>

      <section class="content" v-if="currentTab.title === 'VSCodeVim'">
        <h2 class="title">{{ currentTab.title }}</h2>

        <div class="body">
          <img src="~@/assets/docs/VSCodeVim.png" alt="VSCodeVim" />
        </div>
      </section>
    </SlideInOut>

    <nav class="tabbar">
      <span v-for="item in tabList" :key="item.title" class="tabbar__item" :class="{ 'tabbar__item--active': currentTab.title === item.title }" @click="onTabItemClick(item)">
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
      margin: 0;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
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
