import { storage } from '../../core/storage.js'
import { STORAGE_KEYS } from '../../core/constants.js'
import { uid } from '../../core/utils.js'
import { getPoints, spendPoints } from './challengeController.js'

export const REDEMPTION_ITEMS = [
  { id: 'title_penny_wise', type: 'title', name: '精打细算', desc: '会过日子的生活家', icon: '🧮', cost: 20 },
  { id: 'badge_piggy', type: 'badge', name: '小金猪徽章', desc: '攒下人生第一桶金', icon: '🐷', cost: 30 },
  { id: 'title_ledger_keeper', type: 'title', name: '账房先生', desc: '每一笔账都清清楚楚', icon: '📖', cost: 40 },
  { id: 'badge_coin', type: 'badge', name: '金币收藏家', desc: '积少成多，聚沙成塔', icon: '🪙', cost: 50 },
  { id: 'title_savings_master', type: 'title', name: '理财达人', desc: '让每一分钱都物尽其用', icon: '💰', cost: 60 },
  { id: 'badge_honor', type: 'badge', name: '荣耀勋章', desc: '坚持记账的闪耀见证', icon: '🎖️', cost: 80 },
  { id: 'badge_diamond', type: 'badge', name: '钻石之恒', desc: '恒久远的理财之心', icon: '💎', cost: 90 },
  { id: 'title_wealth_lord', type: 'title', name: '家财万贯', desc: '家庭财务的定海神针', icon: '👑', cost: 100 }
]

export function loadRedemptions() {
  return storage.getJSON(STORAGE_KEYS.redemptions) || []
}

export function isRedeemed(itemId) {
  return loadRedemptions().some((r) => r.itemId === itemId)
}

export function redeem(itemId) {
  const item = REDEMPTION_ITEMS.find((i) => i.id === itemId)
  if (!item) return { ok: false, reason: 'not_found' }
  if (isRedeemed(itemId)) return { ok: false, reason: 'duplicate' }
  if (getPoints() < item.cost) return { ok: false, reason: 'insufficient' }

  spendPoints(item.cost)
  const record = {
    id: uid(),
    itemId: item.id,
    name: item.name,
    icon: item.icon,
    type: item.type,
    cost: item.cost,
    redeemedAt: Date.now()
  }
  const list = loadRedemptions()
  list.push(record)
  storage.setJSON(STORAGE_KEYS.redemptions, list)
  return { ok: true, record }
}
