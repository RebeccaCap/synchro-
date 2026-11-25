/**
 * Hint or error text under a field. The slot always takes up one line, so
 * showing or clearing a message never moves the fields below it.
 */
export default function FieldMessage({ id, hint, error }) {
  return (
    <div className="mt-0.5 min-h-5 text-sm">
      {error ? (
        <p id={id && `${id}-error`} role="alert" className="text-red-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={id && `${id}-hint`} className="text-ink/60 dark:text-paper/60">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
