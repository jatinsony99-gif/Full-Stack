import { useDispatch, useSelector } from 'react-redux'
import { addDraft, removeDraft } from './features/drafts/draftsSlice.js'
import { addPlatform } from './features/platforms/platformsSlice.js'
import { addPost, removePost } from './features/posts/postsSlice.js'
import {
  selectDraftCount,
  selectPlatformUsage,
  selectPostSummaries,
} from './features/analytics/selectors.js'
import './styles.css'

function App() {
  const dispatch = useDispatch()
  const postSummaries = useSelector(selectPostSummaries)
  const platformUsage = useSelector(selectPlatformUsage)
  const draftCount = useSelector(selectDraftCount)

  const addSampleData = () => {
    dispatch(addPlatform({ id: 'platform3', name: 'Instagram' }))
    dispatch(addPost({ id: 'post3', title: 'Visual teaser', content: 'Share the new preview art.', platformId: 'platform3' }))
    dispatch(addDraft({ id: 'draft2', title: 'Story outline', platformId: 'platform3' }))
  }

  return (
    <main className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Redux Toolkit experiment</p>
          <h1>Centralized content planning</h1>
          <p className="intro">
            Posts, platforms, and drafts now flow through a global store with memoized selectors for fast, scalable access.
          </p>
        </div>
        <button type="button" className="action-btn" onClick={addSampleData}>
          Seed sample data
        </button>
      </header>

      <section className="stats-grid">
        <article className="card">
          <h2>Drafts</h2>
          <strong>{draftCount}</strong>
          <p>Active draft items in the store.</p>
        </article>
        <article className="card">
          <h2>Platforms</h2>
          <ul>
            {platformUsage.map((platform) => (
              <li key={platform.id}>
                {platform.name}: {platform.count}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="content-grid">
        <article className="card">
          <h2>Post summaries</h2>
          <ul>
            {postSummaries.map((post) => (
              <li key={post.id}>
                <strong>{post.title}</strong>
                <span> · {post.platformName}</span>
                <button type="button" onClick={() => dispatch(removePost(post.id))}>Remove</button>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Draft queue</h2>
          <ul>
            {Array.from({ length: draftCount }, (_, index) => {
              const draftId = `draft${index + 1}`
              return (
                <li key={draftId}>
                  {draftId}
                  <button type="button" onClick={() => dispatch(removeDraft(draftId))}>Remove</button>
                </li>
              )
            })}
          </ul>
        </article>
      </section>
    </main>
  )
}

export default App
