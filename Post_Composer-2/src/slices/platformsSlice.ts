import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Platform {
  id: string;
  name: string;
}

interface PlatformsState {
  ids: string[];
  entities: Record<string, Platform>;
}

const initialState: PlatformsState = {
  ids: [],
  entities: {}
};

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    addPlatform: (state, action: PayloadAction<Platform>) => {
      const platform = action.payload;
      if (!state.entities[platform.id]) {
        state.ids.push(platform.id);
      }
      state.entities[platform.id] = platform;
    }
  }
});

export const { addPlatform } = platformsSlice.actions;
export default platformsSlice.reducer;
