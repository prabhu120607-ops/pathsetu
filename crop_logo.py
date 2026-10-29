from PIL import Image

# Load the uploaded image
img = Image.open(r'C:\Users\prabh\.gemini\antigravity\brain\76414fc1-9966-4c3a-9a61-ebb149c296f4\.user_uploaded\media_1793260404257_e2ccb87e.jpg')
w, h = img.size

# Find the bounding box of the dark square
# The background is off-white (around 240-250), dark square is near black (< 50)
gray = img.convert('L')
# Find bbox where pixel < 120
pixels = gray.load()

left = w
top = h
right = 0
bottom = 0

for y in range(h):
    for x in range(w):
        if pixels[x, y] < 120:
            if x < left: left = x
            if x > right: right = x
            if y < top: top = y
            if y > bottom: bottom = y

print(f"Bounding box: {left}, {top}, {right}, {bottom}")
# Add a 2px margin if within image
cropped = img.crop((max(0, left), max(0, top), min(w, right + 1), min(h, bottom + 1)))

# Make it square if slightly off
cw, ch = cropped.size
print(f"Cropped size: {cw}x{ch}")

import os
os.makedirs('assets', exist_ok=True)
os.makedirs('public/assets', exist_ok=True)

# Save cropped as pathsetu-icon.png
cropped.save('assets/pathsetu-icon.png', 'PNG')
cropped.save('public/assets/pathsetu-icon.png', 'PNG')
print("Successfully saved cropped logo to assets/pathsetu-icon.png and public/assets/pathsetu-icon.png")

