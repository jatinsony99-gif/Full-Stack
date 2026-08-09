import { describe, expect, it } from 'vitest'
import { selectPostSummaries, selectPlatformUsage } from './selectors.js'

describe('redux selectors', () => {
  const state = {
    posts: {
      byId: {
        post1: { id: 'post1', title: 'Launch update', content: 'Ship the new dashboard.', platformId: 'platform1' },
        post2: { id: 'post2', title: 'Team note', content: 'Review release checklist.', platformId: 'platform2' },
      },
      allIds: ['post1', 'post2'],
    },
    platforms: {
      byId: {
        platform1: { id: 'platform1', name: 'LinkedIn' },
        platform2: { id: 'platform2', name: 'X' },
      },
      allIds: ['platform1', 'platform2'],
    },
    drafts: {
      byId: {
        draft1: { id: 'draft1', title: 'Draft idea', platformId: 'platform1' },
      },
      allIds: ['draft1'],
    },
  }

  it('derives posts with platform names from normalized state', () => {
    expect(selectPostSummaries(state)).toEqual([
      { id: 'post1', title: 'Launch update', content: 'Ship the new dashboard.', platformId: 'platform1', platformName: 'LinkedIn' },
      { id: 'post2', title: 'Team note', content: 'Review release checklist.', platformId: 'platform2', platformName: 'X' },
    ])
  })

  it('counts posts by platform for the dashboard overview', () => {
    expect(selectPlatformUsage(state)).toEqual([
      { id: 'platform1', name: 'LinkedIn', count: 1 },
      { id: 'platform2', name: 'X', count: 1 },
    ])
  })
})
