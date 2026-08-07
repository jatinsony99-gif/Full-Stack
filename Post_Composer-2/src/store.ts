import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import platformsReducer from "./slices/platformsSlice";
import draftsReducer from "./slices/draftsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    drafts: draftsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
