#!/usr/bin/env python3
"""
Generate Gokul Stores App Icon
Creates a green leaf + shopping bag icon in multiple Android sizes
"""

from PIL import Image, ImageDraw
import os

def create_icon(size, output_path):
    """Create Gokul Stores icon at specified size"""
    # Create image with white background
    img = Image.new('RGB', (size, size), color='#059669')  # Emerald green background
    draw = ImageDraw.Draw(img, 'RGBA')

    # Draw white leaf shape (centered)
    margin = size // 6
    leaf_points = [
        (size // 2, margin),  # Top point
        (size - margin, size // 3),  # Right
        (size - margin // 2, size // 2),  # Right-mid
        (size - margin, 2 * size // 3),  # Right-lower
        (size // 2, size - margin),  # Bottom
        (margin, 2 * size // 3),  # Left-lower
        (margin // 2, size // 2),  # Left-mid
        (margin, size // 3),  # Left
    ]

    # Draw filled leaf (white with slight transparency for smoothness)
    draw.polygon(leaf_points, fill=(255, 255, 255, 230))

    # Draw shopping bag outline on bottom right
    bag_x = size * 0.55
    bag_y = size * 0.55
    bag_w = size // 5
    bag_h = size // 5

    # Shopping bag shape
    bag_outline = [
        (bag_x, bag_y),
        (bag_x + bag_w, bag_y),
        (bag_x + bag_w, bag_y + bag_h * 0.7),
        (bag_x, bag_y + bag_h * 0.7),
    ]

    draw.polygon(bag_outline, fill=(255, 255, 255, 200))

    # Save image
    img.save(output_path, 'PNG')
    print(f"✓ Created {output_path}")

# Android icon sizes
icon_sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

base_path = r'C:\Users\Admin\Downloads\gokul-stores\android\app\src\main\res'

print("🎨 Generating Gokul Stores App Icon...\n")

for density, size in icon_sizes.items():
    mipmap_dir = os.path.join(base_path, f'mipmap-{density}')

    # Create ic_launcher.png (background)
    icon_path = os.path.join(mipmap_dir, 'ic_launcher.png')
    create_icon(size, icon_path)

    # Create ic_launcher_foreground.png (same for now, can be customized)
    foreground_path = os.path.join(mipmap_dir, 'ic_launcher_foreground.png')
    create_icon(size, foreground_path)

    # Create ic_launcher_round.png (rounded version)
    img = Image.new('RGB', (size, size), color='#059669')
    draw = ImageDraw.Draw(img, 'RGBA')

    # Oval mask for rounded effect
    margin = size // 6
    leaf_points = [
        (size // 2, margin),
        (size - margin, size // 3),
        (size - margin // 2, size // 2),
        (size - margin, 2 * size // 3),
        (size // 2, size - margin),
        (margin, 2 * size // 3),
        (margin // 2, size // 2),
        (margin, size // 3),
    ]
    draw.polygon(leaf_points, fill=(255, 255, 255, 230))

    round_path = os.path.join(mipmap_dir, 'ic_launcher_round.png')
    img.save(round_path, 'PNG')
    print(f"✓ Created {round_path}")

print("\n✅ All icons generated successfully!")
print(f"\nIcon Details:")
print(f"  Design: Green leaf with shopping bag")
print(f"  Colors: Emerald Green (#059669) background, White icons")
print(f"  Sizes: {', '.join([f'{k}: {v}x{v}' for k, v in icon_sizes.items()])}")

