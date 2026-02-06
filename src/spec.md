# Specification

## Summary
**Goal:** Restore the original user-uploaded images for the product named exactly "Brown leather Luxury Watch For Unisex Rs. 19" by removing any auto-generated square image references, and ensure the storefront shows only the images stored on the product record.

**Planned changes:**
- Update backend seeded/initialized data so the product "Brown leather Luxury Watch For Unisex Rs. 19" has an `images` array containing only the original previously-uploaded image URLs (no auto-generated square images).
- Add conditional upgrade logic (migration) so existing deployments rewrite that product’s `images` array to only the original uploaded image URLs, without trapping, duplicating products, or repeatedly rewriting when already correct.
- Remove any frontend special-casing for this product’s images so catalog cards and the product details gallery render `product.images` from the backend, with fallback to `/assets/generated/watch-placeholder.dim_800x800.png` if an image fails to load.

**User-visible outcome:** The "Brown leather Luxury Watch For Unisex Rs. 19" product shows only the user’s original uploaded images across the catalog card and product gallery (no auto-generated square images), and broken images fall back to the placeholder instead of showing a broken-image icon.
