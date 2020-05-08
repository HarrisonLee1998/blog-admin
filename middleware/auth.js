/* eslint-disable require-await */
// export default async function(context) {
//   // 这里只需要发起请求，所有的后续处理，在axios拦截器那里进行
//   const { $axios, route } = context
//   if (route.path !== '/login') {
//     try {
//       await $axios({
//         url: '/api/admin/token/check',
//         method: 'POST'
//       })
//     } catch (error) {
//       // console.log('error occured')
//     }
//   }
// }
export default async function({ $auth, redirect, app }) {
  const user = $auth.$state.user
  console.log('user' + user)
  if (user && user.admin) {
  } else {
    app.$notifier.showMessage({
      content: 'Please Login In First!',
      color: 'error'
    })
    // redirect('/')
  }
}
