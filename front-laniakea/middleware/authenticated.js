export default function ({ store, redirect }) {
  if (!store.state.auth) {
    return redirect('/login')
  } else if (store.state.auth) {
    if (store.state.auth.role < 2) {
      return redirect('/')
    }
  }
}
