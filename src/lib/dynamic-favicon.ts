/**
 * Live browser-tab favicon: an Apple-style calendar tile that shows TODAY's
 * weekday + date, redrawn at each local midnight. Web-only and a no-op elsewhere.
 * (An installed PWA's home-screen icon stays static — only the tab icon is live.)
 */

const RED = '#FF3B30';
const DARK = '#1C1C1E';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof (ctx as any).roundRect === 'function') {
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFavicon() {
  const S = 64;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const now = new Date();
  const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
  const day = String(now.getDate());
  const headerH = S * 0.3;
  const r = S * 0.18;

  // White rounded card.
  roundRect(ctx, 1, 1, S - 2, S - 2, r);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Red header band (clipped to the card).
  ctx.save();
  ctx.clip();
  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, S, headerH);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(headerH * 0.62)}px Helvetica, Arial, sans-serif`;
  ctx.fillText(weekday, S / 2, headerH * 0.55);
  ctx.fillStyle = DARK;
  ctx.font = `600 ${Math.round(S * 0.46)}px Helvetica, Arial, sans-serif`;
  ctx.fillText(day, S / 2, headerH + (S - headerH) * 0.52);

  const url = canvas.toDataURL('image/png');
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';
  link.href = url;
}

/** Start the live favicon. Returns a cleanup fn. No-op when there's no DOM. */
export function startDynamicFavicon(): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    drawFavicon();
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    timer = setTimeout(schedule, next.getTime() - now.getTime());
  };
  schedule();
  return () => clearTimeout(timer);
}
