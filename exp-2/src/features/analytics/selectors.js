import { createSelector } from '@reduxjs/toolkit'

const selectPosts = (state) => state.posts
const selectPlatforms = (state) => state.platforms
const selectDrafts = (state) => state.drafts

export const selectPostSummaries = createSelector(
  [selectPosts, selectPlatforms],
  (posts, platforms) =>
    posts.allIds.map((postId) => {
      const post = posts.byId[postId]
      const platform = platforms.byId[post.platformId]
      return {
        ...post,
        platformName: platform?.name ?? 'Unknown',
      }
    }),
)

export const selectPlatformUsage = createSelector(
  [selectPosts, selectPlatforms],
  (posts, platforms) =>
    platforms.allIds.map((platformId) => {
      const platform = platforms.byId[platformId]
      const count = posts.allIds.filter((postId) => posts.byId[postId].platformId === platformId).length
      return {
        id: platform.id,
        name: platform.name,
        count,
      }
    }),
)

export const selectDraftCount = createSelector([selectDrafts], (drafts) => drafts.allIds.length)
