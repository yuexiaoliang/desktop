<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { deepClone } from '@/utils/common'

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
  rankingChange?: string
  rankingChangeUp?: boolean
  rankingChangeDown?: boolean
  isFresh?: boolean
}

const ws = createWebSocket()

const listRaw = ref<ListItemRaw[]>([])

let oldList: ListItem[] = []

const list = computed<ListItem[]>(() => {
  return listRaw.value.map(item => {
    const result: ListItem = {
      ...item,
      name: item.instId.split('-')[0],
      changePerText: (Number(item.changePer) * 100).toFixed(2) + '%'
    }

    if (!oldList.length) return result

    // 上升或者下降N名
    const oldItem = oldList.find(old => old.instId === item.instId)

    if (!oldItem) {
      result.isFresh = true
      result.rankingChange = '新'
      return result
    }

    result.rankingChange = ''
    result.isFresh = false

    const oldIndex = oldList.indexOf(oldItem)
    const newIndex = listRaw.value.indexOf(item)
    const change = oldIndex - newIndex

    const rankingChange = change > 0 ? `↑ ${change}` : `↓ ${Math.abs(change)}`
    const rankingChangeUp = change > 0
    const rankingChangeDown = change < 0

    if (change) {
      result.rankingChange = rankingChange
      result.rankingChangeUp = rankingChangeUp
      result.rankingChangeDown = rankingChangeDown
    } else {
      result.rankingChange = oldItem.rankingChange
      result.rankingChangeUp = oldItem.rankingChangeUp
      result.rankingChangeDown = oldItem.rankingChangeDown
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

onUnmounted(() => {
  // ws.value.close()
})

// 创建 WebSocket 链接
function createWebSocket() {
  const ws = ref<WebSocket>(new WebSocket('wss://wspri.okx.com:8443/ws/v5/inner-public'))

  ws.value.onopen = () => {
    // 构造请求体数据
    const requestBody = {
      op: 'subscribe',
      args: [
        {
          channel: 'up-rank-s',
          ccy: 'USDT'
        },
      ]
    };

    // 将请求体数据转换为 JSON 字符串
    const requestBodyString = JSON.stringify(requestBody);

    // 发送请求体数据给后端
    ws.value.send(requestBodyString);
  };

  ws.value.onmessage = (event) => {
    // 将接收到的数据转换为 JSON 对象
    const data = JSON.parse(event.data);

    if (!data.data?.[0]?.utc8) return;

    listRaw.value = data.data[0].utc8
  }

  return ws;
}

</script>

<template>
  <div class="okx">
    <ul class="okx-list">

      <li v-for="item in list" class="okx-list__item">
        <span class="name">{{ item.name }}</span>
        <span class="last-price">{{ item.lastPrice }}</span>
        <span class="ranking-change"
          :class="{ 'ranking-change--up': item.rankingChangeUp, 'ranking-change--down': item.rankingChangeDown, 'ranking-change--fresh': item.isFresh }">{{
            item.rankingChange
          }}</span>
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

      .name {
        font-size: 14px;
        font-weight: bold;
      }

      .last-price {
        margin-left: 10px;
        font-size: 12px;
        color: #555;
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

      .change-per {
        width: 80px;
        text-align: right;
        color: yellow;
      }
    }
  }
}
</style>