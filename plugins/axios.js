export default function({ app, redirect, $axios }) {
  $axios.onError(() => {
    app.$notifier.showMessage({ content: 'axios请求失败', color: 'error' })
  })
  $axios.onResponse((response) => {
    if (response.data.status === 'NOT_FOUND') {
      redirect('/404')
    } else if (response.data.status === 'INTERNAL_SERVER_ERROR') {
      app.$notifier.showMessage({ content: '内部服务器错误', color: 'error' })
    }
  })
}
