<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h2>积分兑换</h2>
        <p class="page-sub">用积分兑换专属称号与徽章，将在个人中心展示</p>
      </div>
      <div class="points-pill">🏅 积分 {{ store.points }}</div>
    </div>

    <div class="shop-grid">
      <div v-for="item in items" :key="item.id" class="card shop-item" :class="{ owned: isOwned(item.id) }">
        <div class="shop-icon">{{ item.icon }}</div>
        <div class="shop-name">
          {{ item.name }}
          <span class="badge" :class="{ done: item.type === 'title' }">{{ item.type === 'title' ? '称号' : '徽章' }}</span>
        </div>
        <div class="shop-desc">{{ item.desc }}</div>
        <div class="shop-foot">
          <span class="shop-cost">
            🏅 {{ item.cost }}
            <em v-if="!isOwned(item.id) && !affordable(item.cost)">还差 {{ item.cost - store.points }}</em>
          </span>
          <button v-if="isOwned(item.id)" class="btn sm owned-btn" @click="onRedeem(item)">已兑换</button>
          <button v-else class="btn btn-primary sm" :disabled="!affordable(item.cost)" @click="onRedeem(item)">
            {{ affordable(item.cost) ? '兑换' : '积分不足' }}
          </button>
        </div>
      </div>
    </div>

    <h3 class="block-title">兑换记录</h3>
    <div v-if="history.length" class="card list">
      <div v-for="r in history" :key="r.id" class="list-row">
        <span class="his-icon">{{ r.icon }}</span>
        <span class="row-main">
          <b>{{ r.name }}</b>
          <em>{{ formatTime(r.redeemedAt) }}</em>
        </span>
        <span class="his-cost">-{{ r.cost }} 积分</span>
      </div>
    </div>
    <div v-else class="card empty">还没有兑换记录，快去挑选心仪的称号与徽章吧</div>

    <div v-if="toast.text" class="toast" :class="toast.type">{{ toast.text }}</div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useStore, refreshKeys, controllersApi } from '../data/store.js'

const store = useStore()
const { redemption } = controllersApi

const items = computed(() => redemption.REDEMPTION_ITEMS)
const ownedIds = computed(() => new Set((store.redemptions || []).map((r) => r.itemId)))
const isOwned = (id) => ownedIds.value.has(id)
const affordable = (cost) => store.points >= cost
const history = computed(() => [...(store.redemptions || [])].sort((a, b) => b.redeemedAt - a.redeemedAt))

const toast = reactive({ text: '', type: 'ok' })
let toastTimer = null
const showToast = (text, type = 'ok') => {
  toast.text = text
  toast.type = type
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.text = ''), 2400)
}

const onRedeem = (item) => {
  const result = redemption.redeem(item.id)
  if (result.ok) {
    refreshKeys('points', 'redemptions')
    showToast(`兑换成功！已消耗 ${item.cost} 积分`)
  } else if (result.reason === 'duplicate') {
    showToast('该物品已兑换过，不能重复兑换', 'warn')
  } else if (result.reason === 'insufficient') {
    showToast(`积分不足，还差 ${item.cost - store.points} 积分`, 'warn')
  }
}

const formatTime = (ts) => {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<style scoped>
.page-head { align-items: flex-start; }
.points-pill {
  background: linear-gradient(135deg, #f0c957, #e89b2d);
  color: #3d2c00;
  font-weight: 800;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
}
.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.shop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 18px 12px 14px;
}
.shop-item.owned {
  background: linear-gradient(180deg, rgba(240, 201, 87, 0.08), var(--card-bg));
  border-color: rgba(224, 155, 45, 0.4);
}
.shop-icon { font-size: 36px; }
.shop-name {
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.shop-desc {
  font-size: 12px;
  color: var(--text-secondary);
  min-height: 32px;
  line-height: 1.4;
}
.shop-foot {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.shop-cost {
  font-weight: 800;
  color: #b8860b;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.3;
}
.shop-cost em {
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  color: var(--expense);
}
.btn.sm { padding: 6px 12px; font-size: 12px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.owned-btn {
  background: rgba(240, 201, 87, 0.18);
  border-color: transparent;
  color: #b8860b;
}
.block-title { font-size: 15px; margin: 24px 0 12px; }
.card.list {
  display: flex;
  flex-direction: column;
  padding: 6px 16px;
}
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}
.list-row:last-child { border-bottom: none; }
.his-icon { font-size: 22px; }
.row-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.row-main b { font-size: 14px; }
.row-main em {
  font-style: normal;
  font-size: 12px;
  color: var(--text-secondary);
}
.his-cost {
  font-weight: 800;
  color: var(--expense);
  font-size: 13px;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
  z-index: 200;
  animation: toast-in 0.2s ease;
}
.toast.warn { background: var(--expense); }
@keyframes toast-in {
  from { transform: translate(-50%, 10px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
</style>
