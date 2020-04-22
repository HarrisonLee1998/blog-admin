export default function({ app, redirect, $axios }) {
  $axios.onError(() => {
    app.$notifier.showMessage({ content: 'axios请求失败', color: 'error' })
  })
  $axios.onResponse((response) => {
    if (response.data.status === 'NOT_FOUND') {
      redirect('/404')
    }
  })
}
