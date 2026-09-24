import { storage } from '../../core/storage.js'
import { STORAGE_KEYS } from '../../core/constants.js'
import { getPoints, deductPoints } from './challengeController.js'

export const REWARD_TYPES = {
  TITLE: 'title',
  BADGE: 'badge'
}

// 可兑换的虚拟称号与徽章
export const REWARDS = [
  { id: 'title_rookie', type: 'title', name: '记账萌新', desc: '初入理财世界的新手称号', icon: '🌱', points: 50 },
  { id: 'title_diligent', type: 'title', name: '勤奋记账家', desc: '坚持记录每一笔收支', icon: '✍️', points: 120 },
  { id: 'title_saving_master', type: 'title', name: '储蓄大师', desc: '精打细算，储蓄有方', icon: '💰', points: 200 },
  { id: 'title_financial_free', type: 'title', name: '财务自由先锋', desc: '财务自由路上的追梦人', icon: '👑', points: 500 },
  { id: 'badge_shopper', type: 'badge', name: '精明消费徽章', desc: '理性消费的象征', icon: '🛍️', points: 80 },
  { id: 'badge_fire', type: 'badge', name: '热力记账徽章', desc: '记账热情如火', icon: '🔥', points: 150 },
  { id: 'badge_diamond', type: 'badge', name: '钻石守财徽章', desc: '坚如钻石的财富守护者', icon: '💎', points: 300 }
]

export function loadRedemptions() {
  return storage.getJSON(STORAGE_KEYS.redemptions) || []
}

function saveRedemptions(list) {
  storage.setJSON(STORAGE_KEYS.redemptions, list)
}

export function findReward(id) {
  return REWARDS.find((r) => r.id === id)
}

export function isRedeemed(id) {
  return loadRedemptions().some((r) => r.rewardId === id)
}

// 兑换：积分不足或重复兑换都会失败，并返回对应原因
export function redeemReward(id) {
  const reward = findReward(id)
  if (!reward) return { ok: false, message: '兑换项目不存在' }

  const records = loadRedemptions()
  if (records.some((r) => r.rewardId === id)) {
    return { ok: false, message: `「${reward.name}」已兑换过，无需重复兑换` }
  }

  if (getPoints() < reward.points) {
    return { ok: false, message: `积分不足，兑换「${reward.name}」还需 ${reward.points - getPoints()} 积分` }
  }

  if (!deductPoints(reward.points)) {
    return { ok: false, message: '积分不足，无法兑换' }
  }

  records.push({
    id: `rdp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    rewardId: reward.id,
    name: reward.name,
    type: reward.type,
    icon: reward.icon,
    points: reward.points,
    redeemedAt: Date.now()
  })
  saveRedemptions(records)

  return { ok: true, message: `兑换成功，已获得「${reward.name}」` }
}

// 合并兑换状态，供页面渲染
export function rewardViews() {
  const redeemedIds = new Set(loadRedemptions().map((r) => r.rewardId))
  const points = getPoints()
  return REWARDS.map((r) => ({
    ...r,
    redeemed: redeemedIds.has(r.id),
    affordable: points >= r.points
  }))
}
