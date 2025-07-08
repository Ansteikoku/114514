async function loadThreads(boardSlug) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('board_slug', boardSlug)
    .order('last_activity_at', { ascending: false })

  if (error) {
    console.error('スレッド取得失敗', error)
    return
  }

  const list = document.getElementById('thread-list')
  list.innerHTML = ''

  data.forEach(thread => {
    const li = document.createElement('li')
    li.textContent = thread.title || '(無題)'

    // 下げボタン
    const downBtn = document.createElement('button')
    downBtn.textContent = '下げ'
    downBtn.addEventListener('click', () => bumpDownThread(thread.id))

    li.appendChild(downBtn)
    list.appendChild(li)
  })
}

async function bumpDownThread(threadId) {
  const { error } = await supabase
    .from('threads')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', threadId)

  if (error) {
    alert('下げ処理に失敗しました')
  } else {
    alert('下げました')
    const urlParams = new URLSearchParams(window.location.search)
    const boardSlug = urlParams.get('board') || 'wakakusa'
    loadThreads(boardSlug)
  }
}

const urlParams = new URLSearchParams(window.location.search)
const boardSlug = urlParams.get('board') || 'wakakusa'
loadThreads(boardSlug)
