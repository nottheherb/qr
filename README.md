# Simple QR

Text on the left, a live QR code on the right, and a PNG download. Text stays in the browser. The PNG is black and white with no margin, at least 2048 × 2048 pixels, with whole pixels per QR module.

```sh
cd web
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` creates the static production app in `web/dist`.

Unicode, emoji, whitespace, and multiline text are preserved. Text that exceeds a single QR code's capacity displays an error.

## Publish on GitHub Pages

1. Sign in on this computer with `gh auth login -h github.com`.
2. From this repository's root, create and push the public GitHub repository with `gh repo create qr --public --source=. --remote=origin --push`.
3. Open the new repository on GitHub. Under **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
4. Under **Actions → Deploy to GitHub Pages**, choose **Run workflow** if the initial push ran before Pages was enabled. The site will be at `https://YOUR_USERNAME.github.io/qr/` (or the name you chose for the repository).

Future pushes to `main` deploy automatically. The QR text is handled in the browser; it is not sent to a server.
