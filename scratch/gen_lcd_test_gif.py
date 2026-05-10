r"""Generate a 320x240 GIF89a test image for Ryujin LCD upload."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

img = Image.new("RGB", (320, 240), (10, 10, 30))
draw = ImageDraw.Draw(img)
draw.rectangle([0, 0, 319, 239], outline=(0, 200, 255), width=3)
try:
    font = ImageFont.truetype("arial.ttf", 60)
except Exception:
    font = ImageFont.load_default()
text = "POLYLUX"
bbox = draw.textbbox((0, 0), text, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
draw.text(((320 - tw) // 2 - bbox[0], (240 - th) // 2 - bbox[1]),
          text, fill=(255, 100, 0), font=font)

try:
    font2 = ImageFont.truetype("arial.ttf", 20)
except Exception:
    font2 = ImageFont.load_default()
text2 = "standalone"
bbox = draw.textbbox((0, 0), text2, font=font2)
tw = bbox[2] - bbox[0]
draw.text(((320 - tw) // 2 - bbox[0], 195), text2, fill=(180, 180, 180), font=font2)

out = Path(r"C:\Users\vlad\Desktop\polylux_lcd_test.gif")
img.save(out)
size = out.stat().st_size
print(f"Saved {out} ({size} bytes)")

with out.open("rb") as f:
    magic = f.read(10)
print(f"  magic+dims: {magic[:6]!r} + width={int.from_bytes(magic[6:8],'little')} height={int.from_bytes(magic[8:10],'little')}")
