import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    post1: { id: 'post1', title: 'Launch update', content: 'We shipped a faster dashboard.', platformId: 'platform1' },
    post2: { id: 'post2', title: 'Community recap', content: 'Creators shared their best tips this week.', platformId: 'platform2' },
  },
  allIds: ['post1', 'post2'],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      const { id, title, content, platformId } = action.payload
      state.byId[id] = { id, title, content, platformId }
      state.allIds.push(id)
    },
    removePost: (state, action) => {
      const id = action.payload
      delete state.byId[id]
      state.allIds = state.allIds.filter((postId) => postId !== id)
    },
  },
})

export const { addPost, removePost } = postsSlice.actions
export default postsSlice.reducer
