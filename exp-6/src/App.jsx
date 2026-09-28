import { useState } from 'react'
import './App.css'

function App() {
  const [postText, setPostText] = useState('')
  const [posts, setPosts] = useState([])
  const [nextPostId, setNextPostId] = useState(1)
  const [editingPostId, setEditingPostId] = useState(null)
  const [editText, setEditText] = useState('')
  const [posted, setPosted] = useState(false)
  const characterCount = postText.length
  const isOverLimit = characterCount > 100
  const isPostDisabled = !postText.trim() || isOverLimit

  function handleSubmit(event) {
    event.preventDefault()
    if (isPostDisabled) return

    setPosts((currentPosts) => [
      ...currentPosts,
      { id: nextPostId, content: postText.trim(), createdAt: Date.now() },
    ])
    setNextPostId((id) => id + 1)
    setPostText('')
    setPosted(true)
  }

  function handleEdit(post) {
    setEditingPostId(post.id)
    setEditText(post.content)
  }

  function handleSaveEdit(postId) {
    if (!editText.trim() || editText.length > 100) return

    setPosts((currentPosts) => currentPosts.map((post) => (
      post.id === postId ? { ...post, content: editText.trim() } : post
    )))
    setEditingPostId(null)
    setEditText('')
  }

  function handleDelete(postId) {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId))
    if (editingPostId === postId) {
      setEditingPostId(null)
      setEditText('')
    }
  }

  return (
    <main className="page-shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Postbox home">
          <span className="wordmark-icon" aria-hidden="true">P</span>
          <span>POSTBOX</span>
        </a>
        <span className="masthead-note">YOUR PUBLIC SQUARE</span>
      </header>

      <section className="compose-area" id="top">
        <div className="intro">
          <p className="eyebrow"><span /> THE DAILY NOTE</p>
          <h1>Say it simply.</h1>
          <p className="intro-copy">A small thought can start a good conversation.</p>
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <div className="composer-topline">
            <span>NEW POST</span>
            <span className="privacy-label"><span aria-hidden="true">●</span> Public</span>
          </div>

          <div className="author-row">
            <div className="avatar" aria-hidden="true">Y</div>
            <div className="author-copy">
              <strong>You</strong>
              <span>Share an update</span>
            </div>
          </div>

          <label className="visually-hidden" htmlFor="post-content">Post content</label>
          <textarea
            id="post-content"
            value={postText}
            onChange={(event) => {
              setPostText(event.target.value)
              setPosted(false)
            }}
            placeholder="What’s on your mind?"
            aria-invalid={isOverLimit}
            aria-describedby={isOverLimit ? 'character-counter limit-message' : 'character-counter'}
          />

          <div className="composer-footer">
            <div className="counter-block">
              <div
                className={`character-counter${isOverLimit ? ' character-counter--over' : ''}`}
                id="character-counter"
                aria-live="polite"
              >
                <span>{characterCount}</span> / 100
              </div>
              {isOverLimit && <p className="limit-message" id="limit-message">Limit exceeded</p>}
            </div>
            <button className="post-button" type="submit" disabled={isPostDisabled}>
              <span>Post</span>
              <span className="post-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="character-meter" aria-hidden="true">
            <span
              className={isOverLimit ? 'character-meter-fill character-meter-fill--over' : 'character-meter-fill'}
              style={{ width: `${Math.min(characterCount, 100)}%` }}
            />
          </div>
          <p className="submit-status" role="status">{posted ? 'Your post is live.' : ''}</p>
        </form>

        <section className="history-section" aria-labelledby="history-title">
          <div className="history-heading">
            <h2 id="history-title">Posted history</h2>
            <span>{posts.length.toString().padStart(2, '0')}</span>
          </div>
          {posts.length === 0 ? (
            <p className="history-empty">Your published notes will appear here.</p>
          ) : (
            <ol className="post-history">
              {posts.map((post) => {
                const postedAt = Number.isFinite(post.createdAt) ? new Date(post.createdAt) : null

                return (
                <li className="history-post" key={post.id}>
                  <span className="history-post-number">{post.id.toString().padStart(2, '0')}</span>
                  {editingPostId === post.id ? (
                    <div className="history-edit">
                      <label className="visually-hidden" htmlFor={`edit-post-${post.id}`}>
                        Edit post {post.id}
                      </label>
                      <textarea
                        id={`edit-post-${post.id}`}
                        value={editText}
                        maxLength={100}
                        onChange={(event) => setEditText(event.target.value)}
                      />
                      <div className="history-edit-footer">
                        <span className="edit-character-count">{editText.length} / 100</span>
                        <div className="history-post-actions">
                          <button
                            className="history-action"
                            type="button"
                            disabled={!editText.trim()}
                            onClick={() => handleSaveEdit(post.id)}
                          >
                            Save
                          </button>
                          <button
                            className="history-action"
                            type="button"
                            onClick={() => {
                              setEditingPostId(null)
                              setEditText('')
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="history-post-main">
                      {postedAt ? (
                        <time className="history-post-date" dateTime={postedAt.toISOString()}>
                          {postedAt.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      ) : (
                        <span className="history-post-date">Date unavailable</span>
                      )}
                      <p>{post.content}</p>
                      <div className="history-post-actions">
                        <button className="history-action" type="button" onClick={() => handleEdit(post)}>
                          Edit
                        </button>
                        <button
                          className="history-action history-action--delete"
                          type="button"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
                )
              })}
            </ol>
          )}
        </section>

        <p className="page-footnote"><span aria-hidden="true">✳</span> MAKE ROOM FOR GOOD THOUGHTS</p>
      </section>
    </main>
  )
}

export default App
