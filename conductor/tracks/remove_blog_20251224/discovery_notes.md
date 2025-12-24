# Discovery Notes: Remove Blog Feature

## Files to Delete
- `components/landing/blog-section.tsx`
- `components/landing/blog-card.tsx`
- `components/landing/BlogPost.tsx`
- `components/landing/mdx-components.tsx`

## Files to Modify
- `app/page.tsx`: Remove `<BlogSection />` import and usage.
- `components/landing/header.tsx`: Remove "Blogs" navigation link.
- `components/landing/footer.tsx`: Remove "Blogs" footer link.
- `components/landing/CombinedFooter.tsx`: Remove "Blogs" footer link.

## Dependency Analysis
- `next-mdx-remote` is imported in `BlogPost.tsx` but is **not** present in `package.json`. This suggests it might be a phantom dependency or I missed something fundamental. Since it's not in `package.json`, `bun remove` is not needed for it.
- No other blog-exclusive dependencies were found in `package.json`.

## Routes
- Links point to `/blogs`, but no `app/blogs` or `app/(pages)/blogs` directory exists.
- No dynamic route `[...slug]` seems to handle it either.
- Conclusion: The blog feature appears to be partially implemented or previously removed, leaving behind these UI components and dead links.
