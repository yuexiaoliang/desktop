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
  changePerText: string
  rankingChange?: number
  rankingChangeText?: string
  isFresh?: boolean
  isFavorite?: boolean
}


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
      isFavorite: favoriteList.value.includes(item.instId)
    }

    if (!oldList.length) return result

    const oldItem = oldList.find(old => old.instId === item.instId)

    if (!oldItem) {
      result.isFresh = true
      return result
    }

    const oldIndex = oldList.indexOf(oldItem)
    const newIndex = listRaw.value.indexOf(item)

    const rankingChange = oldIndex - newIndex
    const rankingChangeText = rankingChange > 0 ? `↑ ${rankingChange}` : `↓ ${Math.abs(rankingChange)}`

    if (rankingChange) {
      result.rankingChange = rankingChange
      result.rankingChangeText = rankingChangeText
    } else {
      result.rankingChange = oldItem.rankingChange
      result.rankingChangeText = oldItem.rankingChangeText
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

      <li v-for="(item, index) in list" class="okx-list__item">
        <span class="index" :class="`index-${index + 1}`">{{ index + 1 }}</span>

        <span class="name" :class="{ 'name--favorite': item.isFavorite }" @click="onNameClick(item)">{{ item.name }}</span>

        <span class="last-price">{{ item.lastPrice }}</span>

        <span class="ranking-change"
          :class="{ 'ranking-change--up': item.rankingChange && item.rankingChange > 0, 'ranking-change--down': item.rankingChange && item.rankingChange < 0 }">{{
            item.rankingChangeText
          }}</span>

        <span v-if="item.isFresh" class="fresh">新</span>

        <span class="change-per">{{ item.changePerText }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.okx {
  height: 100%;
  padding: 5px;

  &-list {
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
      align-items: baseline;
      align-content: center;
      flex-wrap: wrap;
      margin: 0;
      padding: 0 5px;
      border-radius: 4px;
      transition: background-color 0.1s ease;

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

      .ranking-change {
        margin-left: auto;
        font-size: 12px;

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

      .fresh {
        margin-left: 10px;
        color: yellow;
      }

      .change-per {
        width: 70px;
        text-align: right;
        color: yellow;
      }
    }
  }
}
</style>