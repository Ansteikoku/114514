window.onload = () => {
  loadBoards()

  const form = document.getElementById('search-form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    const keyword = document.getElementById('search-keyword').value
    searchThreads(keyword)
  })
}

async function loadBoards() {
  const errorDiv = document.getElementById('error-message')
  errorDiv.textContent = '板読み込み中...'

  try {
    const { data: boards, error } = await supabase
      .from('boards')
      .select('*')
      .order('sort_order', { ascending: true })

    console.log('取得されたboards:', boards)
    console.log('取得エラー:', error)

    if (error) {
      errorDiv.textContent = '❌ Supabaseエラー: ' + JSON.stringify(error, null, 2)
      return
    }

    if (!boards || boards.length === 0) {
      errorDiv.textContent = '⚠ データは取得できたが、板は1件も存在しません。'
      return
    }

    errorDiv.textContent = '' // エラー消す

    const genres = {}
    boards.forEach(board => {
      if (!genres[board.genre]) {
        genres[board.genre] = []
      }
      genres[board.genre].push(board)
    })

    const container = document.getElementById('board-genres')
    container.innerHTML = ''

    for (const genre in genres) {
      const h2 = document.createElement('
