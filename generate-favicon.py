from PIL import Image, ImageDraw
import math, random

SIZE = 256
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

palette = [
    (255, 107, 53),   # vibrant orange
    (30, 39, 97),     # deep navy
    (123, 45, 142),   # rich purple
    (240, 194, 127),  # warm gold
]

random.seed(42)

for _ in range(600):
    x = random.randint(-20, SIZE + 20)
    y = random.randint(-20, SIZE + 20)
    r = random.randint(8, 60)
    color = random.choice(palette)
    alpha = random.randint(80, 200)
    overlay = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.ellipse([x - r, y - r, x + r, y + r], fill=(*color, alpha))
    img = Image.alpha_composite(img, overlay)

img = img.filter(__import__("PIL.ImageFilter", fromlist=["GaussianBlur"]).GaussianBlur(radius=12))

mask = Image.new("L", (SIZE, SIZE), 0)
mask_draw = ImageDraw.Draw(mask)
corner = 48
mask_draw.rounded_rectangle([0, 0, SIZE, SIZE], radius=corner, fill=255)
img.putalpha(mask)

img.save("src/app/favicon.ico", format="ICO", sizes=[(64, 64), (32, 32), (16, 16)])

preview = img.resize((64, 64), Image.LANCZOS)
preview.save("src/app/icon.png", format="PNG")

print("Generated src/app/favicon.ico and src/app/icon.png")
