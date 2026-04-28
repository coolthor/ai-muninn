<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Draft posts

Posts with `draft: true` in frontmatter are **hidden in production builds** and visible only in `next dev`. The filter lives in `lib/blog.ts` (search `HIDE_DRAFTS`) and is applied at the source — `getAllPosts`, `getPost`, and `getAllSlugs` all respect it. A draft is invisible everywhere at once: blog index, series listing, tag pages, sitemap, single-post URL.

Frontmatter:
```yaml
draft: true   # remove when ready to publish
```

If you've pushed a post and it's not showing up in production, **check `draft: true`**. That's the gotcha — no error, no warning, the post just silently disappears.

To preview a draft against a production-like build locally:
```bash
SHOW_DRAFTS=1 pnpm build && pnpm start
```

To list all current drafts:
```bash
grep -l "^draft: true" content/blog/{en,zh-TW}/*.mdx
```
