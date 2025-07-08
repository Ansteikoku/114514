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
  errorDiv.textContent = ''

  try {
    const { data: boards, error } = await supabase
      .from('boards')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    if (!boards || boards.length === 0) {
      errorDiv.textContent = '板データが見つかりません。'
      return
    }

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
      const h2 = document.createElement('h2')
      h2.textContent = genre
      container.appendChild(h2)

      const ul = document.createElement('ul')
      genres[genre].forEach(board => {
        const li = document.createElement('li')
        const link = document.createElement('a')
        link.href = `thread.html?board=${board.slug}`
        link.textContent = board.name
        li.appendChild(link)
        ul.appendChild(li)
      })
      container.appendChild(ul)
    }
  } catch (e) {
    console.error('エラー:', e)
    errorDiv.textContent = 'データ取得に失敗しました: ' + e.message
  }
}

async function searchThreads(keyword) {
  const errorDiv = document.getElementById('error-message')
  errorDiv.textContent = ''

  try {
    if (!keyword.trim()) return

    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .ilike('title', `%${keyword}%`)

    if (error) throw error

    const resultDiv = document.getElementById('search-results')
    resultDiv.innerHTML = ''

    if (!data || data.length === 0) {
      resultDiv.textContent = '該当するスレッドはありません。'
      return
    }

    const ul = document.createElement('ul')
    data.forEach(thread => {
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = `thread.html?id=${thread.id}`
      a.textContent = thread.title || '(無題)'
      li.appendChild(a)
      ul.appendChild(li)
    })

    resultDiv.appendChild(ul)
  } catch (e) {
    console.error('検索エラー:', e)
    errorDiv.textContent = '検索に失敗しました: ' + e.message
  }
}
