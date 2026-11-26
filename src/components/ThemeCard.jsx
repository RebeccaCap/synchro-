/**
 * Card with a purple-to-orange accent line along the top, a title and a short
 * description. Fills the height of its grid row so cards in a row line up.
 */
export default function ThemeCard({ title, description }) {
  return (
    <div
      className="
        glass
        relative
        h-full
        p-6
        pt-8
        overflow-hidden
      "
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purpleLight dark:from-purpleDark to-orangeLight dark:to-orangeDark" />

      <h3 className="text-xl font-semibold leading-tight tracking-tight text-ink dark:text-paper">
        {title}
      </h3>
      <p className="mt-3 leading-relaxed text-ink/70 dark:text-paper/70">{description}</p>
    </div>
  );
}
