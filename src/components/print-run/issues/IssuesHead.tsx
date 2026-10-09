/* The section head travels with the pinned stage rather than scrolling away
   above it, so the run always says what it is and always offers a way out. */
export function IssuesHead() {
  return (
    <header className="pr-section-head">
      <div>
        <span className="mono pr-eyebrow">The issues</span>
        <h2 className="pr-h2">Four products. All live.</h2>
      </div>
      <a className="pr-skip" href="#end">
        Skip to contact
      </a>
    </header>
  );
}
