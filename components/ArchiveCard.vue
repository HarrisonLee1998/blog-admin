<template>
  <div class="ma-1">
    <!--图片-->
    <nuxt-link class="archive-card" :to="'/archive/' + archive.title">
      <img :src="archive.imgUrl === '' ? defaultUrl : archive.imgUrl" />
      <div class="archive-title">
        {{ archive.title }} ({{ archive.articleNums }})
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    archive: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultUrl:
        'https://cdn.harrisonlee.net/beach_waves_coast_166129_1366x768.jpg'
    }
  }
}
</script>

<style lang="css" scoped>
.archive-card {
  position: relative;
  cursor: pointer;
  margin-bottom: 10%;
  display: block;
}
/* .archive-card:hover{
  -webkit-box-shadow:  #ccc 0 0 10px;
  -moz-box-shadow:  #ccc 0 0 10px;
  box-shadow: #ccc 0 0 10px;
}*/
img {
  width: 100%;
  height: 100%;
}
.archive-title {
  width: 100%;
  height: 100%;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* .dark-mode .archive-title {
  background-color: rgba(255, 255, 255, 0.5);
  color: #000;
}

.dark-mode .archive-title:hover {
  background-color: rgba(255, 255, 255, 0.2);
} */

.archive-title {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.archive-title:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

@media screen and (min-width: 680px) {
  .archive-card {
    width: 355px;
    height: 200px;
    overflow: hidden;
  }
}

@media screen and (max-width: 680px) {
  .archive-card {
    height: 240px;
  }
}
</style>
