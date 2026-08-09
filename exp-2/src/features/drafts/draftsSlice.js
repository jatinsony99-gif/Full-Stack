import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    draft1: { id: 'draft1', title: 'Draft campaign', platformId: 'platform1' },
  },
  allIds: ['draft1'],
}

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    addDraft: (state, action) => {
      const draft = action.payload
      state.byId[draft.id] = draft
      state.allIds.push(draft.id)
    },
    removeDraft: (state, action) => {
      const id = action.payload
      delete state.byId[id]
      state.allIds = state.allIds.filter((draftId) => draftId !== id)
    },
  },
})

export const { addDraft, removeDraft } = draftsSlice.actions
export default draftsSlice.reducer
