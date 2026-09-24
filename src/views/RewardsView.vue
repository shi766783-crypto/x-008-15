<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h2>积分兑换</h2>
        <p class="page-sub">用积分兑换虚拟称号与徽章，展示在个人中心</p>
      </div>
      <div class="points-pill">🏅 我的积分 {{ store.points }}</div>
    </div>

    <div class="seg">
      <button
        v-for="f in FILTERS"
        :key="f.value"
        class="seg-btn"
        :class="{ active: filter === f.value }"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="rewards-grid">
      <div v-for="r in filteredRewards" :key="r.id" class="reward-card card" :class="{ owned: r.redeemed }">
        <div class="reward-icon">{{ r.icon }}</div>
        <div class="reward-name">{{ r.name }}</div>
        <div class="reward-desc">{{ r.desc }}</div>
        <span class="reward-type">{{ r.type === 'title' ? '称号' : '徽章' }}</span>
        <div class="reward-foot">
          <span class="reward-cost">🏅 {{ r.points }} 积分</span>
          <button
            class="btn btn-primary sm"
            :disabled="r.redeemed || !r.affordable"
            @click="redeem(r)"
          >
            {{ r.redeemed ? '已兑换' : r.affordable ? '立即兑换' : '积分不足' }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="!filteredRewards.length" class="empty">暂无可兑换的项目</div>

    <h3 class="block-title">兑换历史（{{ history.length }}）</h3>
    <div v-if="history.length" class="card list">
      <div v-for="h in history" :key="h.id" class="list-row">
        <span class="hist-icon">{{ h.icon }}</span>
        <span class="row-main">
          <b>{{ h.name }}</b>
          <em>{{ h.type === 'title' ? '称号' : '徽章' }} · 兑换于 {{ formatTime(h.redeemedAt) }}</em>
        </span>
        <span class="hist-points">-{{ h.points }} 积分</span>
      </div>
    </div>
    <div v-else class="card empty">还没有兑换记录，去挑一个喜欢的称号或徽章吧</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore, refreshKeys, controllersApi } from '../data/store.js'

const store = useStore()
const { reward } = controllersApi

const FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'title', label: '称号' },
  { value: 'badge', label: '徽章' }
]
const filter = ref('all')

const rewards = computed(() => reward.rewardViews())
const filteredRewards = computed(() =>
  filter.value === 'all' ? rewards.value : rewards.value.filter((r) => r.type === filter.value)
)
const history = computed(() => [...store.redemptions].sort((a, b) => b.redeemedAt - a.redeemedAt))

const pad = (n) => String(n).padStart(2, '0')
const formatTime = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const redeem = (r) => {
  const result = reward.redeemReward(r.id)
  if (!result.ok) {
    alert(result.message)
    return
  }
  refreshKeys('points', 'redemptions')
  alert(result.message)
}
</script>

<style scoped>
.points-pill {
  background: linear-gradient(135deg, #f0c957, #e89b2d);
  color: #3d2c00;
  font-weight: 800;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
}
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.reward-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 18px 14px;
  gap: 6px;
  position: relative;
}
.reward-card.owned {
  border-color: rgba(232, 155, 45, 0.5);
  background: linear-gradient(180deg, rgba(240, 201, 87, 0.1), var(--card-bg) 60%);
}
.reward-icon {
  font-size: 40px;
  line-height: 1;
}
.reward-name {
  font-weight: 700;
  font-size: 15px;
}
.reward-desc {
  font-size: 12px;
  color: var(--text-secondary);
  min-height: 34px;
  line-height: 1.4;
}
.reward-type {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: rgba(79, 141, 249, 0.12);
  padding: 2px 10px;
  border-radius: 999px;
}
.reward-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
}
.reward-cost {
  font-size: 13px;
  font-weight: 700;
  color: #b8860b;
}
.btn.sm { padding: 6px 12px; font-size: 12px; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.block-title {
  font-size: 15px;
  margin: 24px 0 10px;
}
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
.hist-icon { font-size: 22px; }
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
.hist-points {
  font-weight: 800;
  color: var(--expense);
  font-size: 13px;
  white-space: nowrap;
}
</style>
