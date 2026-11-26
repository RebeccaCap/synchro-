// Shared page layout. Every section of the index page uses these, so spacing
// and the distance from the screen edge are changed in one place.

/** Vertical padding of every section. */
export const SECTION_SPACING = "py-12 md:py-16";

/** Width and horizontal padding: ~6% of the viewport from the edge on desktop. */
export const CONTAINER = "w-full max-w-[1600px] mx-auto px-5 md:px-10 lg:px-[6vw]";

/**
 * The hero and the section after it are tighter, so the first row of logos
 * sits above the fold on a laptop screen.
 */
export const HERO_SPACING = "pt-10 pb-2 md:pt-12 md:pb-4";
export const SECTION_SPACING_AFTER_HERO = "pt-10 pb-12 md:pt-14 md:pb-16";
