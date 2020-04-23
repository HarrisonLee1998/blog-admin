<template>
  <div v-if="loading" id="loading" :class="isDark ? 'dark' : 'light'">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    timer: null,
    isDark: false
  }),
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'theme/toggleTheme') {
        this.isDark = state.theme.isDark
      }
    })
  },
  methods: {
    start() {
      this.loading = true
      this.setTimer()
    },
    finish() {
      this.loading = false
      this.clearTimer()
    },
    setTimer() {
      this.timer = setInterval(this.setMsg, 200)
    },
    clearTimer() {
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="css" scoped>
#loading {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 11;
}
.dark {
  background-color: #000;
}
.dark li {
  background-color: #fff;
}

.light {
  background-color: #fff;
}

.light li {
  background-color: #000;
}

ul {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}
ul li {
  list-style: none;
  width: 6px;
  height: 20px;
  margin: 0 4px;
  animation: animate 0.7s infinite alternate;
}

@keyframes animate {
  0% {
    transform: scaleY(1);
  }
  25% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1);
  }
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(3);
  }
}

ul li:nth-child(1) {
  animation-delay: 0.1s;
}
ul li:nth-child(2) {
  animation-delay: 0.2s;
}
ul li:nth-child(3) {
  animation-delay: 0.3s;
}
ul li:nth-child(4) {
  animation-delay: 0.4s;
}
ul li:nth-child(5) {
  animation-delay: 0.5s;
}
ul li:nth-child(6) {
  animation-delay: 0.6s;
}
</style>
