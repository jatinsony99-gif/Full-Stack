import { useEffect, useState } from 'react'
import { createToken, hasAccess, verifyToken } from './auth.js'
import './App.css'

const DEMO_USERS = {
  admin: { username: 'adminUser', role: 'admin' },
  editor: { username: 'editorUser', role: 'editor' },
  user: { username: 'studentUser', role: 'user' },
}

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

function App() {
  const [selectedRole, setSelectedRole] = useState('admin')
  const [inputName, setInputName] = useState('adminUser')
  const [token, setToken] = useState(getStoredToken)
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Experiment 1.3</p>
          <h1>JWT Authentication + RBAC</h1>
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
              Tokens verify identity, and role checks decide which resources a user can access.
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
                <option value="user">User</option>
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
            <ProtectedPanel title="User Profile" requiredRole="user" user={user}>
              <ul>
                <li>Read access granted</li>
                <li>Dashboard settings visible</li>
                <li>Profile details available</li>
              </ul>
            </ProtectedPanel>

            <ProtectedPanel title="Editor Console" requiredRole="editor" user={user}>
              <ul>
                <li>Publish content</li>
                <li>Manage article drafts</li>
                <li>Review submissions</li>
              </ul>
            </ProtectedPanel>

            <ProtectedPanel title="Admin Panel" requiredRole="admin" user={user}>
              <ul>
                <li>Manage users and permissions</li>
                <li>Audit access logs</li>
                <li>Change application configuration</li>
              </ul>
            </ProtectedPanel>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
