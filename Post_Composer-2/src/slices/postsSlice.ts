import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
}

interface PostsState {
  ids: string[];
  entities: Record<string, Post>;
}

const initialState: PostsState = {
  ids: [],
  entities: {}
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      const post = action.payload;
      if (!state.entities[post.id]) {
        state.ids.push(post.id);
      }
      state.entities[post.id] = post;
    }
  }
});

export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
