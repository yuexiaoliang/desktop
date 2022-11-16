<script setup lang="ts">
interface Props {
  list: string[];
}
defineProps<Props>();
</script>

<template>
  <ul class="notes">
    <li class="notes__item" v-for="item in list" :key="item">{{ item }}</li>
  </ul>
</template>

<style lang="scss" scoped>
.notes {
  padding: 10px 15px;
  margin: 0;
  list-style-type: none;
  font-size: 12px;
  color: var(--color-stress);

  &__item {
    height: 20px;
    line-height: 20px;
  }
}
</style>
