<template>
  <div v-if="loading" class="loading-page">
    <div class="wrapper">
      <div class="rubik-loader" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    timer: null,
    msg: 'Loading',
    msg1: '',
    count: 0
  }),
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
    },
    setMsg() {
      const dot = ['', '.', '..', '...']
      this.msg1 = dot[this.count % dot.length]
      this.count++
    }
  }
}

/*
.loading-page
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(255,255,255,1);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
  font-style: italic;
*/
</script>

<style lang="css" scoped>
* {
  box-sizing: border-box;
}

.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}

.rubik-loader {
  width: 64px;
  height: 64px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: url(http://i.giphy.com/3og0ISeflb7vrNzy2A.gif);
  background-repeat: no-repeat;
  background-position: center;
}
</style>
