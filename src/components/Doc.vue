<script setup lang="ts">
export interface DocDataItem {
  type: 'line' | 'command';
  command?: string;
  desc?: string;
}

export type DocData = DocDataItem[];

interface DocProps {
  type?: string;
  data: DocData;
}

withDefaults(defineProps<DocProps>(), {
  type: 'line'
});
</script>

<template>
  <div class="doc">
    <ul class="list">
      <li class="list__item" v-for="item in data" :key="item.command">
        <template v-if="item.type === 'command'">
          <code class="command">{{ item.command }}</code>
          <p class="desc">{{ item.desc }}</p>
        </template>

        <template v-if="item.type === 'line'">
          <div class="line">---</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.doc {
  margin-top: 20px;
  padding: 0 10px;

  .list {
    margin: 0;
    padding: 0;
    list-style-type: none;

    &__item {
      padding: 0;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 1;

      .command {
        font-size: 14px;
        color: var(--doc--command-color);
      }

      .desc {
        margin: 6px 0 0 0;
        color: var(--doc--desc-color);
      }

      .line {
        color: var(--doc--line-color);
        font-size: 16px;
      }
    }
  }
}
</style>
