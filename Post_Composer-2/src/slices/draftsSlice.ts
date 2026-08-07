import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Draft {
  id: string;
  title: string;
  content: string;
  status: "draft" | "published";
}

interface DraftsState {
  ids: string[];
  entities: Record<string, Draft>;
}

const initialState: DraftsState = {
  ids: [],
  entities: {}
};

const draftsSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    addDraft: (state, action: PayloadAction<Omit<Draft, "id" | "status">>) => {
      const draftId = `draft-${Date.now()}`;
      const draft: Draft = {
        id: draftId,
        status: "draft",
        ...action.payload
      };
      state.ids.push(draft.id);
      state.entities[draft.id] = draft;
    },
    publishDraft: (
      state,
      action: PayloadAction<{ draftId: string; platformId: string }>
    ) => {
      const { draftId } = action.payload;
      const draft = state.entities[draftId];
      if (draft) {
        draft.status = "published";
      }
    }
  }
});

export const { addDraft, publishDraft } = draftsSlice.actions;
export default draftsSlice.reducer;
