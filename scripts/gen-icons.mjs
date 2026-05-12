// One-off icon generator. Produces apple-touch-icon, icon-192, icon-512 PNGs.
// Run: node scripts/gen-icons.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "..", "public");
mkdirSync(publicDir, { recursive: true });

const BG = [0x22, 0x2c, 0x38];
const FG = [0xc9, 0xd1, 0xda];
const ACCENT = [0x7e, 0x87, 0x94];

function makeIcon(size) {
  const bytes = new Uint8Array(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 3;
      bytes[i] = BG[0]; bytes[i + 1] = BG[1]; bytes[i + 2] = BG[2];
    }
  }

  const margin = Math.round(size * 0.18);
  const inner = size - margin * 2;
  const cells = 7;
  const cell = inner / cells;
  const dotRadius = Math.max(2, Math.floor(cell * 0.22));

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const cx = Math.round(margin + cell * (c + 0.5));
      const cy = Math.round(margin + cell * (r + 0.5));
      const isDiag = r === c;
      const color = isDiag ? FG : ACCENT;
      const radius = isDiag ? dotRadius + 1 : dotRadius;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy <= radius * radius) {
            const x = cx + dx, y = cy + dy;
            if (x >= 0 && x < size && y >= 0 && y < size) {
              const i = (y * size + x) * 3;
              bytes[i] = color[0]; bytes[i + 1] = color[1]; bytes[i + 2] = color[2];
            }
          }
        }
      }
    }
  }

  const stride = size * 3;
  const filtered = new Uint8Array((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    filtered[y * (stride + 1)] = 0;
    filtered.set(bytes.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }

  return encodePng(size, size, filtered);
}

function encodePng(width, height, filteredData) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = deflateSync(Buffer.from(filteredData));
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ 0xffffffff;
}

for (const [name, size] of [["apple-touch-icon", 180], ["icon-192", 192], ["icon-512", 512]]) {
  const png = makeIcon(size);
  const out = resolve(publicDir, `${name}.png`);
  writeFileSync(out, png);
  console.log(`wrote ${out} (${png.length} bytes)`);
}
