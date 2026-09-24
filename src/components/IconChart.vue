<template>
  <svg :viewBox="viewBox" class="icon-chart" :style="{ width: size + 'px', height: size + 'px' }" aria-hidden="true">
    <path v-if="name" :d="pathData" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: [Number, String], default: 16 }
})

const paths = {
  home: 'M12 3l8 7v11h-6v-6h-4v6H4V10z',
  chart: 'M4 20V10h4v10zm6 0V4h4v16zm6 0v-7h4v7z',
  add: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z',
  account: 'M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6z',
  list: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
  target: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12zm0 4a2 2 0 110 4 2 2 0 010-4z',
  trophy: 'M6 3h12v2a6 6 0 01-12 0zM8 7v1a4 4 0 008 0V7zm-2 2H3a1 1 0 001 1h3zm12 0h3a1 1 0 01-1 1h-3zM7 21h10v2H7zm1-2h8l-1-5h-6z',
  gift: 'M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.51 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-5 0-8 2.5-8 5v3h16v-3c0-2.5-3-5-8-5z'
}

const viewBox = computed(() => '0 0 24 24')
const pathData = computed(() => paths[props.name] || '')
</script>

<style scoped>
.icon-chart {
  fill: currentColor;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
