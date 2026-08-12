# AIXCEL SIGNAL product film

The 21-second SIGNAL walkthrough follows one synthetic buyer question through five evidence states: question, observed answer, source evidence, ranked action, and operating boundary. It contains no client data or performance guarantee.

## Commands

```console
npm install
npm run dev
npm run lint
npm run capture
```

`npm run capture` renders the Remotion composition through a local Player capture pipeline and writes the release assets to `site/assets/`:

- `signal-product-film.mp4`
- `signal-product-film.webm`
- `signal-film-poster.webp`
- `og-aixcel-signal.png`

The Player capture path exists because the standard Remotion renderer cannot complete its Chrome DevTools handshake in the current Windows workspace. The rendered frames still come from `SignalFilm.tsx`, use Remotion timing and transitions, and are encoded at 1920 by 1080, 30 fps.

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` when the bundled Playwright Chromium is not installed in its default local cache. Set `SIGNAL_CAPTURE_STILLS_ONLY=1` to refresh the poster and social card from an existing MP4.
