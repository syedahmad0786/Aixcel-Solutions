import {spawn} from "node:child_process";
import {once} from "node:events";
import {createServer} from "node:http";
import {existsSync} from "node:fs";
import {mkdir, readFile, rm} from "node:fs/promises";
import {dirname, extname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {build} from "esbuild";
import {chromium} from "playwright-core";

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceDir = resolve(projectDir, "../..");
const captureDir = join(projectDir, ".capture");
const publicDir = join(projectDir, "public");
const siteAssetsDir = join(workspaceDir, "site", "assets");
const mp4Path = join(siteAssetsDir, "signal-product-film.mp4");
const webmPath = join(siteAssetsDir, "signal-product-film.webm");
const posterPngPath = join(captureDir, "signal-film-poster.png");
const posterWebpPath = join(siteAssetsDir, "signal-film-poster.webp");
const socialPath = join(siteAssetsDir, "og-aixcel-signal.png");

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
]);

const run = async (command, args, options = {}) => {
  const child = spawn(command, args, {stdio: "inherit", ...options});
  const [code] = await once(child, "exit");
  if (code !== 0) throw new Error(`${command} exited with code ${code}`);
};

const findBrowser = () => {
  const explicit = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  if (explicit && existsSync(explicit)) return explicit;
  const localAppData = process.env.LOCALAPPDATA;
  const candidates = localAppData ? [
    join(localAppData, "ms-playwright", "chromium-1208", "chrome-win64", "chrome.exe"),
    join(localAppData, "ms-playwright", "chromium_headless_shell-1208", "chrome-headless-shell-win64", "chrome-headless-shell.exe"),
  ] : [];
  const found = candidates.find(existsSync);
  if (!found) throw new Error("Playwright Chromium was not found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE.");
  return found;
};

await rm(captureDir, {recursive: true, force: true});
await mkdir(captureDir, {recursive: true});
await mkdir(siteAssetsDir, {recursive: true});

await build({
  entryPoints: [join(projectDir, "src", "capture-entry.tsx")],
  outfile: join(captureDir, "player.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["chrome120"],
  minify: true,
  jsx: "automatic",
});

const captureHtml = await readFile(join(projectDir, "capture.html"));
const allowedPublicFiles = new Set(["signal-symbol-light.svg", "SchibstedGrotesk.woff2", "IBMPlexSans.woff2", "IBMPlexMono.woff2"]);
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    let filePath;
    if (pathname === "/" || pathname === "/index.html") filePath = join(captureDir, "index.html");
    else if (pathname === "/player.js") filePath = join(captureDir, "player.js");
    else {
      const fileName = pathname.slice(1);
      if (!allowedPublicFiles.has(fileName)) {
        console.log(`[capture server 404] ${pathname}`);
        response.writeHead(404).end("Not found");
        return;
      }
      filePath = join(publicDir, fileName);
    }
    const body = pathname === "/" || pathname === "/index.html" ? captureHtml : await readFile(filePath);
    response.writeHead(200, {"Content-Type": contentTypes.get(extname(filePath)) ?? "application/octet-stream", "Cache-Control": "no-store"});
    response.end(body);
  } catch (error) {
    response.writeHead(500).end(error instanceof Error ? error.message : String(error));
  }
});

server.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
if (!address || typeof address === "string") throw new Error("Could not open capture server");
const baseUrl = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch({headless: true, executablePath: findBrowser()});
const stillsOnly = process.env.SIGNAL_CAPTURE_STILLS_ONLY === "1";
let renderError;

try {
  if (!stillsOnly) {
    const filmPage = await browser.newPage({viewport: {width: 1920, height: 1080}, deviceScaleFactor: 1});
    filmPage.on("pageerror", (error) => { renderError = error; });
    filmPage.on("console", (message) => console.log(`[capture browser] ${message.type()}: ${message.text()}`));
    filmPage.on("requestfailed", (request) => console.log(`[capture request failed] ${request.url()} ${request.failure()?.errorText ?? ""}`));
    await filmPage.goto(`${baseUrl}/?mode=film`, {waitUntil: "commit", timeout: 30000});
    await filmPage.waitForFunction(() => window.__signalReady === true, null, {timeout: 30000});

    const encoder = spawn("ffmpeg", [
      "-hide_banner", "-loglevel", "warning", "-y",
      "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", "30", "-i", "-",
      "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-vf", "format=yuv420p", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      mp4Path,
    ], {stdio: ["pipe", "inherit", "inherit"]});

    for (let frame = 0; frame < 630; frame += 1) {
      if (renderError) throw renderError;
      await filmPage.evaluate(async (nextFrame) => window.__signalSeek?.(nextFrame), frame);
      const image = await filmPage.screenshot({type: "jpeg", quality: 92});
      if (!encoder.stdin.write(image)) await once(encoder.stdin, "drain");
      if (frame % 60 === 0) console.log(`Rendered SIGNAL film frame ${frame}/629`);
    }
    encoder.stdin.end();
    const [encoderCode] = await once(encoder, "exit");
    if (encoderCode !== 0) throw new Error(`ffmpeg MP4 encoder exited with code ${encoderCode}`);
    await filmPage.close();
  }

  await run("ffmpeg", ["-hide_banner", "-loglevel", "warning", "-y", "-ss", "20", "-i", mp4Path, "-frames:v", "1", "-update", "1", posterPngPath]);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "warning", "-y", "-i", posterPngPath, "-vf", "scale=1200:675,crop=1200:630:0:22", "-frames:v", "1", "-update", "1", socialPath]);

  if (!stillsOnly || !existsSync(webmPath)) {
    await run("ffmpeg", ["-hide_banner", "-loglevel", "warning", "-y", "-i", mp4Path, "-an", "-c:v", "libvpx-vp9", "-deadline", "good", "-cpu-used", "2", "-crf", "31", "-b:v", "0", webmPath]);
  }
  await run("ffmpeg", ["-hide_banner", "-loglevel", "warning", "-y", "-i", posterPngPath, "-c:v", "libwebp", "-quality", "88", posterWebpPath]);
  console.log("SIGNAL film, poster, and social card rendered successfully.");
} finally {
  await browser.close();
  server.close();
  await once(server, "close");
}
