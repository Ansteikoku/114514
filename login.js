const form = document.getElementById('login-form')
const message = document.getElementById('message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  message.textContent = ''

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    message.textContent = 'ログイン失敗: ' + error.message
  } else {
    message.textContent = 'ログイン成功！'
    window.location.href = 'admin.html'
  }
})

window.onload = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    window.location.href = 'admin.html'
  }
}
