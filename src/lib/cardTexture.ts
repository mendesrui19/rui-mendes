import * as THREE from "three";

export const PHOTO_PATH = "/assets/rui.jpg";

export const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
export const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

type Source = CanvasImageSource & { width: number; height: number };

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: Source,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const ir = img.width / img.height;
  const tr = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (ir > tr) {
    sw = img.height * tr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / tr;
    sy = Math.max(0, (img.height - sh) * 0.1);
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawFittedCover(
  ctx: CanvasRenderingContext2D,
  img: Source,
  rect: { x: number; y: number; w: number; h: number },
  W: number,
  H: number,
) {
  const rx = rect.x * W;
  const ry = rect.y * H;
  const rw = rect.w * W;
  const rh = rect.h * H;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();
  ctx.filter = "grayscale(1) contrast(0.96) brightness(0.92)";
  drawCover(ctx, img, rx, ry, rw, rh);
  ctx.filter = "none";
  ctx.restore();
  return { rx, ry, rw, rh };
}

function paintBack(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; w: number; h: number },
  W: number,
  H: number,
) {
  const rx = rect.x * W;
  const ry = rect.y * H;
  const rw = rect.w * W;
  const rh = rect.h * H;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();

  const bg = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
  bg.addColorStop(0, "#10241a");
  bg.addColorStop(1, "#07140e");
  ctx.fillStyle = bg;
  ctx.fillRect(rx, ry, rw, rh);

  ctx.strokeStyle = "rgba(168, 214, 180, 0.38)";
  ctx.lineWidth = Math.max(8, rw * 0.025);
  ctx.strokeRect(rx + 18, ry + 18, rw - 36, rh - 36);

  ctx.fillStyle = "rgba(168, 214, 180, 0.9)";
  ctx.font = `600 ${Math.round(rw * 0.055)}px 'IBM Plex Mono', ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillText("RUI.DEV", rx + rw / 2, ry + rh * 0.42);

  ctx.fillStyle = "#f4f7f2";
  ctx.font = `800 ${Math.round(rw * 0.11)}px Outfit, sans-serif`;
  ctx.fillText("RUI", rx + rw / 2, ry + rh * 0.52);
  ctx.fillText("MENDES", rx + rw / 2, ry + rh * 0.6);

  ctx.fillStyle = "rgba(157, 206, 173, 0.85)";
  ctx.font = `500 ${Math.round(rw * 0.045)}px 'IBM Plex Mono', ui-monospace, monospace`;
  ctx.fillText("FRONTEND DEVELOPER", rx + rw / 2, ry + rh * 0.68);

  ctx.restore();
}

function paintFrontOverlay(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();

  ctx.fillStyle = "rgba(8, 8, 8, 0.08)";
  ctx.fillRect(rx, ry, rw, rh);

  ctx.strokeStyle = "rgba(200, 200, 200, 0.22)";
  ctx.lineWidth = Math.max(5, rw * 0.016);
  ctx.strokeRect(rx + 12, ry + 12, rw - 24, rh - 24);

  ctx.restore();
}

export function composeCardAtlas(baseMap: THREE.Texture, photo: Source): THREE.CanvasTexture {
  const baseImg = baseMap.image as Source;
  const W = baseImg?.width || 1024;
  const H = baseImg?.height || 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const empty = new THREE.CanvasTexture(canvas);
    empty.needsUpdate = true;
    return empty;
  }

  if (baseImg) ctx.drawImage(baseImg, 0, 0, W, H);
  else {
    ctx.fillStyle = "#102018";
    ctx.fillRect(0, 0, W, H);
  }

  const front = drawFittedCover(ctx, photo, FRONT_UV_RECT, W, H);
  paintFrontOverlay(ctx, front.rx, front.ry, front.rw, front.rh);
  paintBack(ctx, BACK_UV_RECT, W, H);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = baseMap.flipY;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}
