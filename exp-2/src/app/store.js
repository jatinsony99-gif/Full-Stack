import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice.js'
import platformsReducer from '../features/platforms/platformsSlice.js'
import draftsReducer from '../features/drafts/draftsSlice.js'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    drafts: draftsReducer,
  },
})
