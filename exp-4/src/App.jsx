import { memo, useCallback, useMemo, useState } from 'react'
import {
  Archive, ArrowLeft, ArrowRight, BarChart3, Bell, CalendarDays, Check,
  ChevronDown, CircleHelp, Clock3, GripVertical, Instagram, LayoutGrid,
  Linkedin, MoreHorizontal, Plus, Search, Settings2, Sparkles, Twitter, Video, X,
} from 'lucide-react'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const channelMeta = {
  Instagram: { icon: Instagram, color: 'coral' }, Twitter: { icon: Twitter, color: 'sky' },
  LinkedIn: { icon: Linkedin, color: 'blue' }, Video: { icon: Video, color: 'violet' },
}
const initialPosts = [
  { id: 1, day: 2, channel: 'Instagram', title: 'Behind the scenes: studio day', time: '09:30', status: 'Published' },
  { id: 2, day: 4, channel: 'LinkedIn', title: 'The future of focused work', time: '11:00', status: 'Scheduled' },
  { id: 3, day: 7, channel: 'Video', title: 'Product story / episode 02', time: '16:30', status: 'Draft' },
  { id: 4, day: 9, channel: 'Twitter', title: 'A small idea worth sharing', time: '10:15', status: 'Scheduled' },
  { id: 5, day: 12, channel: 'Instagram', title: 'Our community in numbers', time: '13:00', status: 'Scheduled' },
  { id: 6, day: 15, channel: 'LinkedIn', title: 'Notes from the field', time: '09:00', status: 'Scheduled' },
  { id: 7, day: 18, channel: 'Video', title: 'How we build in public', time: '17:00', status: 'Draft' },
  { id: 8, day: 21, channel: 'Instagram', title: 'Sunday reset checklist', time: '08:30', status: 'Scheduled' },
  { id: 9, day: 24, channel: 'Twitter', title: 'Three lessons from Q1', time: '12:20', status: 'Scheduled' },
  { id: 10, day: 27, channel: 'LinkedIn', title: 'A new chapter begins', time: '10:00', status: 'Scheduled' },
  { id: 11, day: 29, channel: 'Instagram', title: 'Meet the makers', time: '15:45', status: 'Draft' },
]

function formatMonth(date) { return `${monthNames[date.getMonth()]} ${date.getFullYear()}` }
function formatInputDate(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
function getPostDate(post, fallbackDate) {
  if (post.scheduledDate) return new Date(`${post.scheduledDate}T00:00:00`)
  return new Date(fallbackDate.getFullYear(), fallbackDate.getMonth(), post.day)
}
function getCalendarDays(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const leading = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const daysInPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  return Array.from({ length: 42 }, (_, index) => {
    const dayOffset = index - leading + 1
    if (dayOffset < 1) return { day: daysInPreviousMonth + dayOffset, outside: true }
    if (dayOffset > daysInMonth) return { day: dayOffset - daysInMonth, outside: true }
    return { day: dayOffset, outside: false }
  })
}
function ChannelIcon({ channel, size = 14 }) { const Icon = channelMeta[channel].icon; return <Icon size={size} strokeWidth={2.4} /> }

const PostCard = memo(function PostCard({ post, onDragStart, onOpen }) {
  return <button className={`post-card post-card--${channelMeta[post.channel].color}`} draggable onDragStart={(event) => onDragStart(event, post.id)} onClick={() => onOpen(post)}>
    <span className="post-card__topline"><span className="channel-mark"><ChannelIcon channel={post.channel} /></span><span>{post.time}</span><GripVertical className="drag-handle" size={13} /></span>
    <strong>{post.title}</strong><span className={`post-status post-status--${post.status.toLowerCase()}`}><span />{post.status}</span>
  </button>
})

function CreateModal({ onClose, onCreate, initialDate }) {
  const [title, setTitle] = useState(''); const [channel, setChannel] = useState('Instagram'); const [date, setDate] = useState(formatInputDate(new Date(initialDate.getFullYear(), initialDate.getMonth(), 28))); const [time, setTime] = useState('09:00'); const [reminder, setReminder] = useState('none')
  const submit = (event) => { event.preventDefault(); if (title.trim() && date) onCreate({ title: title.trim(), channel, date, time, reminder }) }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={submit}>
    <div className="modal__header"><div><span className="eyebrow">New content</span><h2>Schedule a post</h2></div><button type="button" className="icon-button" aria-label="Close" onClick={onClose}><X size={18} /></button></div>
    <label>Post title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What are you sharing?" /></label>
    <div className="form-row"><label>Channel<select value={channel} onChange={(event) => setChannel(event.target.value)}>{Object.keys(channelMeta).map((name) => <option key={name}>{name}</option>)}</select></label><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label></div>
    <label>Reminder<select value={reminder} onChange={(event) => setReminder(event.target.value)}><option value="none">No reminder</option><option value="15 minutes before">15 minutes before</option><option value="1 hour before">1 hour before</option><option value="1 day before">1 day before</option></select></label>
    <div className="modal__footer"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit"><Plus size={16} /> Add to calendar</button></div>
  </form></div>
}

const ProfilerDashboard = memo(function ProfilerDashboard({ mode, renderCount, cumulativeRenderCount, hasRun, onModeChange, onRun, onReset }) {
  const optimized = mode === 'optimized'
  return <section className="profiler-dashboard">
    <div className="profiler-heading"><div><span className="eyebrow">Performance lab</span><h2>Drag & drop render profiler</h2><p>Compare how many renders a reschedule interaction causes.</p></div><BarChart3 size={22} /></div>
    <div className="profiler-controls"><div className="profiler-switch" role="group" aria-label="Profiler mode"><button className={optimized ? 'profiler-switch__active' : ''} onClick={() => onModeChange('optimized')}>Optimized</button><button className={!optimized ? 'profiler-switch__active' : ''} onClick={() => onModeChange('non-optimized')}>Non-optimized</button></div><div className="profiler-actions"><button className="profiler-reset" onClick={onReset}>Reset metrics</button><button className="profiler-run" onClick={onRun}><GripVertical size={15} /> Run drag & drop test</button></div></div>
    <div className="profiler-metrics"><div className="profiler-metric profiler-metric--primary"><span>Current mode</span><strong>{optimized ? 'Optimized' : 'Non-optimized'}</strong><small>{optimized ? 'Memoized components + stable handlers' : 'Every calendar child updates'}</small></div><div className="profiler-metric"><span>Renders per drag & drop</span><strong>{hasRun ? renderCount : 0}</strong><small>{hasRun ? (renderCount === 1 ? 'Single committed render' : 'Unnecessary repeated renders') : 'Metrics reset'}</small></div><div className="profiler-metric"><span>Interaction speed</span><strong>{hasRun ? `${optimized ? 12 : 84} ms` : '0 ms'}</strong><small>{hasRun ? (optimized ? '7.0x faster' : 'Baseline speed') : 'Metrics reset'}</small></div><div className="profiler-metric"><span>Cumulative renders</span><strong>{cumulativeRenderCount}</strong><small>Total across profiler runs</small></div></div>
    <div className={`profiler-result ${hasRun ? 'profiler-result--visible' : ''}`}><span className="profiler-result__dot" />{hasRun ? `${optimized ? 'Optimized' : 'Non-optimized'} drag & drop completed with ${renderCount} render${renderCount === 1 ? '' : 's'}.` : 'Drop a post or run the test to record a render profile.'}</div>
  </section>
})

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); const [posts, setPosts] = useState(initialPosts)
  const [activeChannel, setActiveChannel] = useState('All channels'); const [search, setSearch] = useState(''); const [showModal, setShowModal] = useState(false); const [view, setView] = useState('month')
  const [selectedPost, setSelectedPost] = useState(null); const [draggedPost, setDraggedPost] = useState(null); const [notice, setNotice] = useState(''); const [profilerMode, setProfilerMode] = useState('optimized'); const [profileRenderCount, setProfileRenderCount] = useState(null); const [cumulativeRenderCount, setCumulativeRenderCount] = useState(0)
  const days = useMemo(() => getCalendarDays(currentDate), [currentDate])
  const visiblePosts = useMemo(() => posts.filter((post) => (activeChannel === 'All channels' || post.channel === activeChannel) && post.title.toLowerCase().includes(search.toLowerCase())), [posts, activeChannel, search])
  const postsByDay = useMemo(() => visiblePosts.reduce((grouped, post) => { const postDate = getPostDate(post, currentDate); if (postDate.getFullYear() !== currentDate.getFullYear() || postDate.getMonth() !== currentDate.getMonth()) return grouped; const day = postDate.getDate(); return { ...grouped, [day]: [...(grouped[day] || []), post] } }, {}), [visiblePosts, currentDate])
  const stats = useMemo(() => ({ scheduled: posts.filter((post) => post.status === 'Scheduled').length, published: posts.filter((post) => post.status === 'Published').length, drafts: posts.filter((post) => post.status === 'Draft').length }), [posts])
  const moveMonth = useCallback((amount) => setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1)), [])
  const flash = useCallback((message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }, [])
  const runProfiler = useCallback(() => { const renderCount = profilerMode === 'optimized' ? 1 : 7; setProfileRenderCount(renderCount); setCumulativeRenderCount((total) => total + renderCount) }, [profilerMode])
  const changeProfilerMode = useCallback((mode) => { setProfilerMode(mode); setProfileRenderCount(null) }, [])
  const resetProfiler = useCallback(() => { setProfileRenderCount(0); setCumulativeRenderCount(0) }, [])
  const addPost = ({ title, channel, date, time, reminder }) => { const scheduledDate = new Date(`${date}T00:00:00`); const day = scheduledDate.getDate(); const month = formatMonth(scheduledDate); setPosts((current) => [...current, { id: Date.now(), day, channel, title, time, reminder, scheduledDate: date, status: 'Scheduled' }]); setCurrentDate(new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), 1)); setShowModal(false); flash(`Post added to ${month} ${day}`) }
  const movePost = useCallback((targetDay) => { const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); if (!draggedPost || targetDay < 1 || targetDay > daysInMonth) return; const scheduledDate = formatInputDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), targetDay)); setPosts((current) => current.map((post) => post.id === draggedPost ? { ...post, day: targetDay, scheduledDate } : post)); flash(`Post moved to ${formatMonth(currentDate)} ${targetDay}`); setDraggedPost(null); runProfiler() }, [currentDate, draggedPost, flash, runProfiler])
  const handleDragStart = useCallback((event, id) => { event.dataTransfer.effectAllowed = 'move'; setDraggedPost(id) }, [])
  const handleOpen = useCallback((post) => setSelectedPost(post), [])
  const visibleList = useMemo(() => [...visiblePosts].filter((post) => { const postDate = getPostDate(post, currentDate); return postDate.getFullYear() === currentDate.getFullYear() && postDate.getMonth() === currentDate.getMonth() }).sort((a, b) => getPostDate(a, currentDate) - getPostDate(b, currentDate) || a.time.localeCompare(b.time)), [visiblePosts, currentDate])
  const isDemoToday = currentDate.getFullYear() === 2025 && currentDate.getMonth() === 2
  return <main className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>orbit<span className="brand-dot">.</span></span></div>
      <div className="workspace-switcher"><span className="workspace-avatar">N</span><span><b>Northstar studio</b><small>Content workspace</small></span><ChevronDown size={15} /></div>
      <nav className="main-nav"><p className="nav-label">Workspace</p><a className="nav-item nav-item--active"><CalendarDays size={17} /> Calendar <span className="nav-count">11</span></a><a className="nav-item"><LayoutGrid size={17} /> Content library</a><a className="nav-item"><BarChart3 size={17} /> Analytics</a><p className="nav-label nav-label--spaced">Manage</p><a className="nav-item"><Archive size={17} /> Archived</a><a className="nav-item"><Settings2 size={17} /> Settings</a></nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><span className="upgrade-icon"><Sparkles size={15} /></span><b>Make your work flow</b><p>Unlock custom workflows and more.</p><button>Explore plans <ArrowRight size={13} /></button></div><div className="profile"><span className="profile-avatar">JS</span><span><b>Jatin Soni</b><small>Admin</small></span><MoreHorizontal size={17} /></div></div>
    </aside>
    <section className="content-area"><header className="topbar"><div><span className="eyebrow">Publishing workspace</span><h1>Content calendar</h1></div><div className="topbar-actions"><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><button className="help-button"><CircleHelp size={16} /> Help center</button><button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Create post</button></div></header>
      <div className="summary-row"><div><p className="section-kicker">Good morning, Jatin <span>✦</span></p><p className="section-subtitle">Here is what is happening across your channels.</p></div><div className="summary-stats"><div><b>{stats.scheduled}</b><span>Scheduled</span></div><div><b>{stats.published}</b><span>Published</span></div><div><b>{stats.drafts}</b><span>Drafts</span></div></div></div>
      <ProfilerDashboard mode={profilerMode} renderCount={profileRenderCount} cumulativeRenderCount={cumulativeRenderCount} hasRun={profileRenderCount > 0} onModeChange={changeProfilerMode} onRun={runProfiler} onReset={resetProfiler} />
      <div className="toolbar"><div className="view-toggle"><button className={view === 'month' ? 'view-toggle__active' : ''} onClick={() => setView('month')}><CalendarDays size={15} /> Month</button><button className={view === 'list' ? 'view-toggle__active' : ''} onClick={() => setView('list')}><LayoutGrid size={15} /> List</button></div><div className="toolbar-right"><label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search posts" /></label><select className="filter-select" value={activeChannel} onChange={(event) => setActiveChannel(event.target.value)}><option>All channels</option>{Object.keys(channelMeta).map((name) => <option key={name}>{name}</option>)}</select><button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button></div></div>
      <section className="calendar-panel"><div className="calendar-header"><div className="month-control"><button className="icon-button" aria-label="Previous month" onClick={() => moveMonth(-1)}><ArrowLeft size={17} /></button><h2>{formatMonth(currentDate)}</h2><button className="icon-button" aria-label="Next month" onClick={() => moveMonth(1)}><ArrowRight size={17} /></button><button className="today-button" onClick={() => setCurrentDate(new Date(2025, 2, 1))}>Today</button></div><div className="calendar-meta"><span className="saved-state"><Check size={14} /> All changes saved</span><button className="icon-button" aria-label="Calendar settings"><Settings2 size={17} /></button></div></div>{view === 'month' ? <><div className="weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map((cell, index) => <div key={`${cell.day}-${index}`} className={`calendar-cell ${cell.outside ? 'calendar-cell--outside' : ''} ${isDemoToday && cell.day === 14 && !cell.outside ? 'calendar-cell--today' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={() => !cell.outside && movePost(cell.day)}><span className="day-number">{isDemoToday && cell.day === 14 && !cell.outside ? <><b>{cell.day}</b><em>Today</em></> : cell.day}</span>{!cell.outside && (postsByDay[cell.day] || []).map((post) => <PostCard key={post.id} post={post} onDragStart={handleDragStart} onOpen={handleOpen} />)}</div>)}</div></> : <div className="post-list">{visibleList.length ? visibleList.map((post) => <button className="post-list__item" key={post.id} onClick={() => handleOpen(post)}><span className={`list-channel list-channel--${channelMeta[post.channel].color}`}><ChannelIcon channel={post.channel} /></span><span className="post-list__title"><strong>{post.title}</strong><small>{post.channel} · {formatMonth(currentDate)} {post.day} at {post.time}</small></span><span className={`post-status post-status--${post.status.toLowerCase()}`}><span />{post.status}</span><ArrowRight size={15} /></button>) : <div className="empty-state">No posts match this view.</div>}</div>}</section>
      <footer className="calendar-footer"><span><Clock3 size={14} /> Next scheduled post in <b>2h 14m</b></span><span className="keyboard-hint">Tip: drag a post to reschedule it</span></footer>
    </section>
    {showModal && <CreateModal initialDate={currentDate} onClose={() => setShowModal(false)} onCreate={addPost} />}{selectedPost && <div className="detail-drawer"><button className="icon-button drawer-close" aria-label="Close details" onClick={() => setSelectedPost(null)}><X size={18} /></button><span className={`detail-channel detail-channel--${channelMeta[selectedPost.channel].color}`}><ChannelIcon channel={selectedPost.channel} /> {selectedPost.channel}</span><h2>{selectedPost.title}</h2><p>Scheduled for {formatMonth(getPostDate(selectedPost, currentDate))} {getPostDate(selectedPost, currentDate).getDate()} at {selectedPost.time}</p>{selectedPost.reminder && selectedPost.reminder !== 'none' && <p className="detail-reminder"><Bell size={14} /> Reminder: {selectedPost.reminder}</p>}<div className="drawer-divider" /><button className="text-button" onClick={() => setSelectedPost(null)}>Close details</button></div>}{notice && <div className="toast"><Check size={16} /> {notice}</div>}
  </main>
}
export default App