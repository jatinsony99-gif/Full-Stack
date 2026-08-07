import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addDraft, publishDraft } from "./slices/draftsSlice";
import { addPlatform } from "./slices/platformsSlice";
import { addPost } from "./slices/postsSlice";
import { platformRules, validatePostContent, type PlatformId } from "./lib/platformRules";

const platformOptions = Object.values(platformRules);

function App() {
  const dispatch = useAppDispatch();
  const platforms = useAppSelector((state) => state.platforms.entities);
  const platformIds = useAppSelector((state) => state.platforms.ids);
  const drafts = useAppSelector((state) => state.drafts.entities);
  const draftIds = useAppSelector((state) => state.drafts.ids);
  const posts = useAppSelector((state) => state.posts.entities);
  const postIds = useAppSelector((state) => state.posts.ids);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(["twitter"]);
  const [mediaCount, setMediaCount] = useState(0);

  const selectedPlatformRules = useMemo(
    () => selectedPlatforms.map((platformId) => validatePostContent(draftContent, mediaCount, platformId)),
    [draftContent, mediaCount, selectedPlatforms]
  );

  const isComposerValid = selectedPlatformRules.every((result) => result.isValid);
  const hasSelection = selectedPlatforms.length > 0;

  const handleCreateDraft = useCallback(() => {
    if (!draftTitle.trim() || !draftContent.trim() || !hasSelection || !isComposerValid) return;
    dispatch(addDraft({ title: draftTitle, content: draftContent }));
    setDraftTitle("");
    setDraftContent("");
    setMediaCount(0);
  }, [dispatch, draftTitle, draftContent, hasSelection, isComposerValid]);

  const handleAddPlatform = useCallback((platformId: PlatformId) => {
    setSelectedPlatforms((current) => {
      if (current.includes(platformId)) {
        return current.filter((item) => item !== platformId);
      }
      return [...current, platformId];
    });
    dispatch(addPlatform(platformRules[platformId]));
  }, [dispatch]);

  const handlePublishDraft = useCallback(
    (draftId: string, platformId: PlatformId) => {
      const draft = drafts[draftId];
      if (!draft || draft.status !== "draft") return;
      const validation = validatePostContent(draft.content, mediaCount, platformId);
      if (!validation.isValid) return;
      dispatch(publishDraft({ draftId, platformId }));
      dispatch(
        addPost({
          id: `${draftId}-${platformId}`,
          title: draft.title,
          content: draft.content,
          platform: platformId
        })
      );
    },
    [dispatch, drafts, mediaCount]
  );

  const platformList = useMemo(
    () => platformIds.map((id) => platforms[id]),
    [platformIds, platforms]
  );
  const draftList = useMemo(
    () => draftIds.map((id) => drafts[id]),
    [draftIds, drafts]
  );
  const postList = useMemo(
    () => postIds.map((id) => posts[id]),
    [postIds, posts]
  );

  return (
    <div className="app-shell">
      <header>
        <h1>Adaptive Post Composer</h1>
        <p>Create, validate, and publish content for multiple platforms in one flexible workspace.</p>
      </header>

      <section className="card composer-card">
        <div className="section-heading">
          <div>
            <h2>Compose post</h2>
            <p>Choose one or more platforms and keep the copy within each set of rules.</p>
          </div>
          <div className={`status-pill ${isComposerValid ? "good" : "needs-attention"}`}>
            {isComposerValid ? "Ready to save" : "Needs review"}
          </div>
        </div>

        <label>
          Post title
          <input
            type="text"
            placeholder="Add a short title"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
          />
        </label>

        <label>
          Post content
          <textarea
            rows={8}
            placeholder="Write your post here..."
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
          />
        </label>

        <label>
          Media attachments
          <input
            type="number"
            min="0"
            max="6"
            value={mediaCount}
            onChange={(event) => setMediaCount(Number(event.target.value))}
          />
        </label>

        <div className="platform-grid">
          {platformOptions.map((option) => {
            const isSelected = selectedPlatforms.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                className={`platform-chip ${isSelected ? "selected" : ""}`}
                onClick={() => handleAddPlatform(option.id as PlatformId)}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        <div className="validation-list">
          {selectedPlatformRules.map((result) => (
            <div key={result.platformId} className="validation-card">
              <div className="validation-header">
                <strong>{platformRules[result.platformId].name}</strong>
                <span>{result.charCount}/{result.maxLength}</span>
              </div>
              <p>{platformRules[result.platformId].description}</p>
              <div className="meta-row">
                <span>Remaining: {result.charRemaining}</span>
                <span>Hashtags: {result.hashtagCount}</span>
              </div>
              {result.issues.map((issue) => (
                <div key={`${result.platformId}-${issue.message}`} className={`issue ${issue.level}`}>
                  {issue.message}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="button" onClick={handleCreateDraft} disabled={!hasSelection || !isComposerValid}>
          Save draft
        </button>
      </section>

      <section className="card two-column">
        <div>
          <h2>Selected platforms</h2>
          <ul>
            {platformList.map((platform) => (
              <li key={platform.id}>{platform.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Drafts</h2>
          <ul>
            {draftList.map((draft) => (
              <li key={draft.id} className="draft-item">
                <strong>{draft.title}</strong>
                <p>{draft.content}</p>
                <p>Status: {draft.status}</p>
                <button
                  type="button"
                  onClick={() => handlePublishDraft(draft.id, selectedPlatforms[0] ?? "twitter")}
                >
                  Publish to {selectedPlatforms[0] ? platformRules[selectedPlatforms[0]].name : "platform"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <h2>Published posts</h2>
        <ul>
          {postList.map((post) => (
            <li key={post.id} className="post-item">
              <strong>{post.title}</strong>
              <p>{post.content}</p>
              <span className="post-platform">Published to {platformRules[post.platform as PlatformId]?.name ?? post.platform}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
