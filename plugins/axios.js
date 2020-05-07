export default function({ app, redirect, $axios, store }) {
  $axios.onError((error) => {
    try {
      // console.log(error.response)
      if (error.response.status === 401) {
        redirect('/login')
      } else {
        app.$notifier.showMessage({ content: 'axios请求失败', color: 'error' })
      }
    } catch (error) {
      app.$notifier.showMessage({ content: 'axios请求失败', color: 'error' })
    }
  })

  $axios.onRequest((config) => {
    return config
  })

  $axios.onResponse((response) => {
    if (response.data.status === 'UNAUTHORIZED') {
      redirect('/login')
    } else if (response.data.status === 'NOT_FOUND') {
      redirect('/404')
    } else if (response.data.status === 'INTERNAL_SERVER_ERROR') {
      app.$notifier.showMessage({ content: '内部服务器错误', color: 'error' })
    }
  })
}
