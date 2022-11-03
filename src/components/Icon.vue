<script setup lang="ts">
import { computed } from 'vue';
import '@/assets/iconfont/iconfont.css';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 'inherit',
  color: 'inherit'
});

const size = computed(() => (typeof props.size === 'number' ? props.size + 'px' : props.size));
</script>

<template>
  <div class="iconfont" :class="`icon-${props.name}`"></div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: v-bind(size);
  color: v-bind(color);
}
</style>
