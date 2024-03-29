<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { createWebSocketClient } from '@/utils/webSocket'
import { useStorageAsync } from '@vueuse/core'

interface ListItemRaw {
  changePer: string
  instId: string
  instType: string
  lastPrice: string
  turnOver24h: string
  volume24h: string
}

interface ListItem extends ListItemRaw {
  name: string
  // 涨跌幅文本
  changePerText: string
  // 排名变化
  rankingChange?: number
  // 排名变化文本
  rankingChangeText?: string
  // 已经存在的轮次
  wheelCount: number
  // 是否是新的
  isFresh?: boolean
  // 是否是收藏的
  isFavorite?: boolean
}

const wheelCount = ref(0)

// 使用示例
const ws = createWebSocketClient({
  url: 'wss://wspri.okx.com:8443/ws/v5/inner-public',
  pingInterval: 30000,
  reconnectInterval: 10000,
  maxReconnectAttempts: 5,
  open() {
    ws.send({
      op: 'subscribe',
      args: [
        {
          channel: 'up-rank-s',
          ccy: 'USDT'
        },
      ]
    });
  },
  message(data) {
    if (!data.data?.[0]?.utc8) return;
    listRaw.value = data.data[0].utc8

    if (wheelCount.value > 5000) wheelCount.value = 0;
    wheelCount.value += 1
  }
});
ws.connect()

const favoriteList = useStorageAsync<string[]>('okx-favorite', [])

const listRaw = ref<ListItemRaw[]>([])

let oldList: ListItem[] = []

const list = computed<ListItem[]>(() => {
  return listRaw.value.map(item => {
    const result: ListItem = {
      ...item,
      name: item.instId.split('-')[0],
      changePerText: (Number(item.changePer) * 100).toFixed(2) + '%',
      isFresh: false,
      isFavorite: favoriteList.value.includes(item.instId),
      wheelCount: 1
    }

    if (!oldList.length) return result

    const oldItem = oldList.find(old => old.instId === item.instId)

    if (!oldItem) {
      return result
    }

    result.wheelCount = oldItem.wheelCount + 1
    result.isFresh = result.wheelCount < wheelCount.value && result.wheelCount <= 10

    const oldIndex = oldList.indexOf(oldItem)
    const newIndex = listRaw.value.indexOf(item)

    const rankingChange = oldIndex - newIndex
    const rankingChangeText = rankingChange ? rankingChange > 0 ? `↑ ${rankingChange}` : `↓ ${Math.abs(rankingChange)}` : ''

    if (rankingChange !== oldItem.rankingChange) {
      result.rankingChange = rankingChange
      result.rankingChangeText = rankingChangeText
    }

    return result
  })
})

watch(() => list.value, (old) => {
  oldList = old
}, {
  deep: true,
  immediate: true
})

const onNameClick = (item: ListItem) => {
  if (item.isFavorite) {
    favoriteList.value = favoriteList.value.filter(fav => fav !== item.instId)
  } else {
    favoriteList.value = [...favoriteList.value, item.instId]
  }
}

onUnmounted(() => {
  ws.close()
})
</script>

<template>
  <div class="okx">
    <ul class="okx-list">
      <li v-for="(item, index) in list" class="okx-list__item" :class="{
        'okx-list__item--emphasis': item?.isFresh && index < 5
      }">
        <div class="index" :class="`index-${index + 1}`">{{ index + 1 }}</div>

        <div class="name" :class="{ 'name--favorite': item.isFavorite }" @click="onNameClick(item)">{{ item.name
        }}</div>

        <div class="last-price">{{ item.lastPrice }}</div>


        <div class="center">
          <span v-if="item.wheelCount < wheelCount && item.wheelCount < 50" class="wheel-count"
            :class="{ 'fresh': item.isFresh }">{{ wheelCount }} / {{
              item.wheelCount }}</span>

          <span class="ranking-change"
            :class="{ 'ranking-change--up': item.rankingChange && item.rankingChange > 0, 'ranking-change--down': item.rankingChange && item.rankingChange < 0 }">
            {{ item.rankingChangeText }}
          </span>
        </div>


        <span class="change-per">{{ item.changePerText }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.okx {
  position: relative;
  height: 100%;
  padding: 5px;

  &::after {
    content: '见好就收';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 180px;
    color: #fff;
    opacity: .02;
    // 文字纵向
    writing-mode: vertical-lr;
    // 文字间隔
    letter-spacing: 10px;
  }

  &-list {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 0;
    font-size: 14px;
    list-style: none;

    &__item {
      flex: 1;
      display: flex;
      align-items: center;
      align-content: center;
      flex-wrap: wrap;
      margin: 0;
      padding: 0 5px;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      border: 1px solid transparent;

      &:hover {
        background-color: #000;
      }

      .index {
        padding-right: 10px;
        min-width: 25px;
        text-align: right;
        color: #777;

        &-1 {
          color: yellow;
          font-weight: bold;
        }

        &-2 {
          color: #aea400;
          font-weight: bold;
        }

        &-3 {
          color: #aaa;
          font-weight: bold;
        }
      }

      .name {
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;

        &--favorite {
          color: yellow;
        }
      }

      .last-price {
        margin-left: 10px;
        font-size: 12px;
        color: #999;
      }

      .center {
        display: flex;
        margin-left: auto;
        font-size: 12px;
      }

      .ranking-change {
        width: 30px;
        text-align: right;

        &--up {
          color: greenyellow;
        }

        &--down {
          color: red;
        }

        &--fresh {
          color: yellow;
        }
      }

      .wheel-count {
        margin-left: 10px;
        color: #c9c9c9;
        transform: scale(0.9);

        &.fresh {
          color: yellow;
        }
      }

      .change-per {
        width: 60px;
        text-align: right;
        color: yellow;
      }


      &--emphasis {
        border: 1px solid yellow;

        .change-per {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: -5px;
          height: 100%;
          font-weight: bold;
          background-color: yellow;
          color: #000;
        }
      }
    }
  }
}
</style>