# Redux Toolkit Centralized State

A small Vite + React + Redux Toolkit project demonstrating centralized global state for posts, platforms, and drafts.

## Features

- `@reduxjs/toolkit` slices for `posts`, `platforms`, and `drafts`
- Normalized state shape with `ids` and `entities`
- Typed hooks `useAppDispatch` and `useAppSelector`
- Simple UI for creating drafts, adding platforms, and publishing posts

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
