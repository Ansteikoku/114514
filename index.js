async function loadBoards() {
  const { data: boards, error } = await supabase
    .from('boards')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('板取得失敗', error)
    return
  }

  const genres = {}
  boards.forEach(b => {
    if (!genres[b.genre]) genres[b.genre] = []
    genres[b.genre].push(b)
  })

  const genreContainer = document.getElementById('board-genres')
  genreContainer.innerHTML = ''

  for (const genre in genres) {
    const h2 = document.createElement('h2')
    h2.textContent = genre
    genreContainer.appendChild(h2)

    const ul = document.createElement('ul')
    genres[genre].forEach(b => {
      const li = document.createElement('li')
      const link = document.createElement('a')
      link.href = `thread.html?board=${b.slug}`
      link.textContent = b.name
      li.appendChild(link)
      ul.appendChild(li)
    })
    genreContainer.appendChild(ul)
  }

  // 運営状況
  const opStatus = boards.find(b => b.name === '運営状況')
  if (opStatus) {
    const opDiv = document.getElementById('operation-status')
    opDiv.innerHTML = `<h2>運営状況</h2><p>${opStatus.description || '現在の運営情報はありません。'}</p>`
  }
}

async function searchThreads(keyword) {
  if (!keyword.trim()) return

  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .or(`title.ilike.%${keyword}%,body.ilike.%${keyword}%`)
    .order('last_activity_at', { ascending: false })

  const resultDiv = document.getElementById('search-results')
  if (error) {
    resultDiv.textContent = '検索エラー'
    return
  }

  if (data.length === 0) {
    resultDiv.textContent = '該当スレッドがありません'
    return
  }

  const ul = document.createElement('ul')
  data.forEach(thread => {
    const li = document.createElement('li')
    li.textContent = thread.title || '(無題)'
    ul.appendChild(li)
  })
  resultDiv.innerHTML = `<h2>検索結果</h2>`
  resultDiv.appendChild(ul)
}

window.onload = () => {
  loadBoards()

  const form = document.getElementById('search-form')
  form.addEventListener('submit', e => {
    e.preventDefault()
    const keyword = document.getElementById('search-keyword').value
    searchThreads(keyword)
  })
}
