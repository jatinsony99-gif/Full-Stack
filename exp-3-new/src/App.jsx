import { useEffect, useState } from 'react'
import { canPerformAction, createToken, hasAccess, verifyToken } from './auth.js'
import './App.css'

const DEMO_USERS = {
  admin: { username: 'adminUser', role: 'admin' },
  editor: { username: 'editorUser', role: 'editor' },
  viewer: { username: 'studentUser', role: 'viewer' },
}

const INITIAL_POSTS = [
  {
    id: 1,
    title: 'Spring Product Launch',
    content:
      'Our new feature set is ready for release. The team has completed validation, design review, and launch planning across all regions.',
  },
  {
    id: 2,
    title: 'Marketing Campaign',
    content:
      'The content team is preparing the next campaign to increase awareness for the Q3 release cycle and partner onboarding.',
  },
]

function getStoredToken() {
  try {
    return localStorage.getItem('jwt-demo-token') || ''
  } catch {
    return ''
  }
}

function ProtectedPanel({ title, requiredRole, user, children }) {
  const canAccess = user && hasAccess(user, requiredRole)

  return (
    <section className={`panel ${canAccess ? 'panel--allowed' : 'panel--denied'}`}>
      <div className="panel-header">
        <h3>{title}</h3>
        <span className={`badge ${canAccess ? 'badge--ok' : 'badge--blocked'}`}>
          {canAccess ? 'Allowed' : 'Blocked'}
        </span>
      </div>
      {canAccess ? children : <p>Access denied. Requires {requiredRole} role.</p>}
    </section>
  )
}

function PostActions({ role, onCreate, onEdit, onDelete, post }) {
  const canCreate = canPerformAction({ role }, 'create')
  const canEdit = canPerformAction({ role }, 'edit')
  const canDelete = canPerformAction({ role }, 'delete')

  return (
    <div className="post-actions">
      <button type="button" className="action-btn action-btn--primary" onClick={onCreate} disabled={!canCreate}>
        Create Post
      </button>
      <button type="button" className="action-btn" onClick={() => onEdit(post)} disabled={!canEdit || !post}>
        Edit Post
      </button>
      <button type="button" className="action-btn action-btn--danger" onClick={() => onDelete(post.id)} disabled={!canDelete || !post}>
        Delete Post
      </button>
    </div>
  )
}

function App() {
  const [selectedRole, setSelectedRole] = useState('admin')
  const [inputName, setInputName] = useState('adminUser')
  const [token, setToken] = useState(getStoredToken)
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [editingPostId, setEditingPostId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [user, setUser] = useState(() => {
    const storedToken = getStoredToken()
    if (!storedToken) return null

    try {
      return verifyToken(storedToken)
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('jwt-demo-token')
      return
    }

    try {
      const payload = verifyToken(token)
      setUser(payload)
      localStorage.setItem('jwt-demo-token', token)
    } catch {
      setUser(null)
      localStorage.removeItem('jwt-demo-token')
    }
  }, [token])

  const handleLogin = (event) => {
    event.preventDefault()
    const username = inputName.trim() || DEMO_USERS[selectedRole].username
    const payload = { username, role: selectedRole }
    const nextToken = createToken(payload)
    setToken(nextToken)
  }

  const handleDemoLogin = (role) => {
    const demoUser = DEMO_USERS[role]
    setSelectedRole(role)
    setInputName(demoUser.username)
    setToken(createToken(demoUser))
  }

  const handleLogout = () => {
    setToken('')
    setUser(null)
  }

  const handleCreatePost = () => {
    if (!user || !canPerformAction(user, 'create')) return
    setEditingPostId(null)
    setFormData({ title: '', content: '' })
  }

  const handleEditPost = (post) => {
    if (!user || !canPerformAction(user, 'edit')) return
    setEditingPostId(post.id)
    setFormData({ title: post.title, content: post.content })
  }

  const handleDeletePost = (postId) => {
    if (!user || !canPerformAction(user, 'delete')) return
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId))
    if (editingPostId === postId) {
      setEditingPostId(null)
      setFormData({ title: '', content: '' })
    }
  }

  const handleSubmitPost = (event) => {
    event.preventDefault()
    if (!user || !formData.title.trim() || !formData.content.trim()) return

    if (editingPostId) {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === editingPostId ? { ...post, title: formData.title, content: formData.content } : post,
        ),
      )
    } else {
      setPosts((currentPosts) => [{
        id: Date.now(),
        title: formData.title,
        content: formData.content,
      }, ...currentPosts])
    }

    setEditingPostId(null)
    setFormData({ title: '', content: '' })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Experiment 3</p>
          <h1>Post RBAC Demo</h1>
        </div>
        {user && (
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      {!user ? (
        <section className="login-card">
          <div className="login-copy">
            <h2>Secure Access</h2>
            <p>
              Tokens verify identity, and role checks decide which actions a user can take.
            </p>
          </div>

          <div className="demo-roles">
            {Object.entries(DEMO_USERS).map(([role, account]) => (
              <button
                key={role}
                type="button"
                className={selectedRole === role ? 'chip chip--active' : 'chip'}
                onClick={() => handleDemoLogin(role)}
              >
                Login as {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Username
              <input
                type="text"
                value={inputName}
                onChange={(event) => setInputName(event.target.value)}
              />
            </label>

            <label>
              Role
              <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button type="submit" className="primary-btn">
              Sign in
            </button>
          </form>
        </section>
      ) : (
        <section className="dashboard">
          <div className="user-banner">
            <div>
              <p className="eyebrow">Authenticated user</p>
              <h2>{user.username}</h2>
            </div>
            <span className="user-role">Role: {user.role}</span>
          </div>

          <div className="token-box">
            <strong>Bearer token</strong>
            <code>{token}</code>
          </div>

          <div className="panel-grid">
            <ProtectedPanel title="Post Manager" requiredRole="viewer" user={user}>
              <div className="post-list">
                {user.role !== 'viewer' && (
                  <form className="post-form" onSubmit={handleSubmitPost}>
                    <h3>{editingPostId ? 'Edit Post' : 'Create Post'}</h3>
                    <label>
                      Post Title
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                        placeholder="Enter title"
                      />
                    </label>
                    <label>
                      Post Content
                      <textarea
                        value={formData.content}
                        onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))}
                        placeholder="Enter content"
                        rows="4"
                      />
                    </label>
                    <div className="form-actions">
                      <button type="submit" className="primary-btn">
                        {editingPostId ? 'Save Changes' : 'Publish Post'}
                      </button>
                      {formData.title || formData.content ? (
                        <button type="button" className="secondary-btn" onClick={() => setFormData({ title: '', content: '' })}>
                          Clear
                        </button>
                      ) : null}
                    </div>
                  </form>
                )}

                {posts.map((post) => (
                  <article key={post.id} className="post-card">
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <span className="role-tag">{user.role}</span>
                    </div>
                    <p>{post.content}</p>
                    {user.role === 'viewer' ? (
                      <p className="read-only-note">Viewer can only read the post.</p>
                    ) : (
                      <div className="inline-actions">
                        <button type="button" className="action-btn" onClick={() => handleEditPost(post)} disabled={!canPerformAction(user, 'edit')}>
                          Edit
                        </button>
                        <button type="button" className="action-btn action-btn--danger" onClick={() => handleDeletePost(post.id)} disabled={!canPerformAction(user, 'delete')}>
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </ProtectedPanel>

            <ProtectedPanel title="Editor Tools" requiredRole="editor" user={user}>
              <ul>
                <li>Create new posts</li>
                <li>Update article content</li>
                <li>Delete permission is blocked</li>
              </ul>
            </ProtectedPanel>

            <ProtectedPanel title="Admin Panel" requiredRole="admin" user={user}>
              <ul>
                <li>Create posts</li>
                <li>Edit posts</li>
                <li>Delete posts</li>
              </ul>
            </ProtectedPanel>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
