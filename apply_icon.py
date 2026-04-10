#!/usr/bin/env python3
"""
Apply user-provided icons to Android app
Uses the icons from public folder and converts them to Android sizes
"""

from PIL import Image
import os

# Source icons from public folder
source_192 = r'C:\Users\Admin\Downloads\gokul-stores\public\icon-192x192.png'
source_512 = r'C:\Users\Admin\Downloads\gokul-stores\public\icon-512x512.png'

# Android icon sizes
icon_sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

base_path = r'C:\Users\Admin\Downloads\gokul-stores\android\app\src\main\res'

print("🎨 Applying User-Provided Icon to Android App...\n")

# Load the source image (use 512 if available, otherwise 192)
try:
    if os.path.exists(source_512):
        source_img = Image.open(source_512)
        print(f"✓ Loaded source icon: icon-512x512.png")
    else:
        source_img = Image.open(source_192)
        print(f"✓ Loaded source icon: icon-192x192.png")
except Exception as e:
    print(f"✗ Error loading source icon: {e}")
    exit(1)

# Convert to RGBA if needed
if source_img.mode != 'RGBA':
    source_img = source_img.convert('RGBA')

print(f"✓ Icon mode: {source_img.mode}")
print(f"✓ Icon size: {source_img.size[0]}x{source_img.size[1]}\n")

# Generate all Android sizes
for density, size in icon_sizes.items():
    mipmap_dir = os.path.join(base_path, f'mipmap-{density}')

    # Resize for this density
    resized = source_img.resize((size, size), Image.Resampling.LANCZOS)

    # ic_launcher.png (background)
    icon_path = os.path.join(mipmap_dir, 'ic_launcher.png')
    resized.save(icon_path, 'PNG')
    print(f"✓ Created {density}: ic_launcher.png ({size}x{size})")

    # ic_launcher_foreground.png (same)
    foreground_path = os.path.join(mipmap_dir, 'ic_launcher_foreground.png')
    resized.save(foreground_path, 'PNG')
    print(f"✓ Created {density}: ic_launcher_foreground.png ({size}x{size})")

    # ic_launcher_round.png (rounded version)
    round_path = os.path.join(mipmap_dir, 'ic_launcher_round.png')
    resized.save(round_path, 'PNG')
    print(f"✓ Created {density}: ic_launcher_round.png ({size}x{size})")
    print()

print("✅ All icons applied successfully!")
print(f"\nIcon Details:")
print(f"  Source: public/icon-192x192.png or icon-512x512.png")
print(f"  Destination: android/app/src/main/res/mipmap-*/")
print(f"  Total Files: 15 PNG files")
print(f"  Densities: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi")

