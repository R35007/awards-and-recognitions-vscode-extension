# Change Log

All notable changes to the "recognition" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [2.0.0] - 2026-03-07

- Added: Pointer-based click origin support for confetti (`getPointerOriginScript`).
- Changed
  - Card configuration now uses a `styles` object instead of a single `background` string (`awardsAndRecognitions.cards`).
  - Webview card rendering now applies the full `styles` object and preserves text/selection behavior.
  - Confetti scripts updated to respect a click-origin when present and to improve firing behavior across styles.

- Breaking Changes: If you previously provided `background` in `awardsAndRecognitions.cards`, migrate to `styles: { background: "..." }`.

## [1.0.0] - 2026-03-07

- Initial release of **Awards and Recognitions**.
- Activity Bar container and dedicated webview for recognition cards.
- Commands for previous card, next card, refresh, and open settings.
- Auto-cycling cards with configurable interval (`awardsAndRecognitions.cardsInterval`).
- Configurable card content via `awardsAndRecognitions.cards` (`title`, `message`, `background`).
- Confetti support with multiple styles: `random`, `cannon`, `realistic`, `fireworks`, `stars`, `emoji`, `snow`, and `schoolPride`.
- Confetti behavior controls for navigation, refresh, click, and particle count.
- Built-in fallback motivational messages and dark gradient backgrounds.
