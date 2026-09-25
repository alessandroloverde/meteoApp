<template>
  <div class="ios-status-bar" aria-hidden="true">
    <div class="ios-status-bar__notch" />
    <span class="ios-status-bar__time">{{ time }}</span>
    <div class="ios-status-bar__icons">
      <svg class="ios-status-bar__signal" viewBox="0 0 18 12" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5" width="3" height="7" rx="1" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg class="ios-status-bar__wifi" viewBox="0 0 18 13" aria-hidden="true">
        <path d="M9 2.2c2.6 0 5 1 6.8 2.7l1.4-1.6C15 1.3 12.1.2 9 .2 5.9.2 3 1.3.8 3.3l1.4 1.6C4 3.2 6.4 2.2 9 2.2z" />
        <path d="M9 6.2c1.5 0 2.8.6 3.8 1.6l1.4-1.6C12.9 4.8 11 4 9 4 7 4 5.1 4.8 3.8 6.2l1.4 1.6c1-1 2.3-1.6 3.8-1.6z" />
        <path d="M9 10.2c.4 0 .9.2 1.2.5l1.4-1.6C10.8 8.4 9.9 8 9 8 8.1 8 7.2 8.4 6.4 9.1l1.4 1.6c.3-.3.8-.5 1.2-.5z" />
        <circle cx="9" cy="11.6" r="1.1" />
      </svg>
      <div class="ios-status-bar__battery">
        <div class="ios-status-bar__battery-body">
          <div class="ios-status-bar__battery-fill" />
        </div>
        <div class="ios-status-bar__battery-cap" />
      </div>
    </div>
  </div>
</template>

<script setup>
const time = ref(formatTime())

function formatTime() {
  const d = new Date()
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

let timer = null
onMounted(() => {
  timer = setInterval(() => { time.value = formatTime() }, 30_000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.ios-status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  z-index: 1000;
  pointer-events: none;
  color: #fff;
  font: 600 15px/1 system-ui, -apple-system, 'SF Pro Text', sans-serif;
  -webkit-font-smoothing: antialiased;
}

// iPhone X-style notch — wider/taller than the Dynamic Island, as requested.
.ios-status-bar__notch {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 30px;
  background: #000;
  border-radius: 16px 16px 18px 18px;
  z-index: 2;
}

.ios-status-bar__time {
  position: absolute;
  top: 50%;
  left: 22px;
  transform: translateY(-50%);
  z-index: 1;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.ios-status-bar__icons {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
}

.ios-status-bar__signal,
.ios-status-bar__wifi {
  width: 18px;
  height: 12px;
  fill: #fff;
}

.ios-status-bar__battery {
  position: relative;
  display: flex;
  align-items: center;
}

.ios-status-bar__battery-body {
  position: relative;
  width: 25px;
  height: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  border-radius: 3.5px;
  padding: 1.5px;
  box-sizing: border-box;
}

.ios-status-bar__battery-fill {
  width: 80%;
  height: 100%;
  background: #fff;
  border-radius: 1.5px;
}

.ios-status-bar__battery-cap {
  width: 2px;
  height: 5px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0 2px 2px 0;
  margin-left: 1px;
}
</style>
