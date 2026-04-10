#!/bin/bash
# Script to generate app icons from SVG

# This script uses ImageMagick to create app icons
# Run: magick convert -background none gokul_icon.svg -resize 192x192 ic_launcher.png

# For now, we'll create a simple green grocery store icon using ImageMagick
# Install ImageMagick if needed: choco install imagemagick

echo "Creating Gokul Stores app icon..."

# Create a simple SVG icon with green leaf (represents fresh groceries)
cat > gokul_icon.svg << 'EOF'
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="96" cy="96" r="96" fill="#059669"/>

  <!-- Leaf shape (groceries/organic symbol) -->
  <path d="M 96 30 Q 120 50 120 80 Q 120 110 96 130 Q 72 110 72 80 Q 72 50 96 30 Z" fill="#ffffff" opacity="0.9"/>

  <!-- Shopping bag outline -->
  <g transform="translate(50, 90)">
    <path d="M 10 20 L 15 5 L 75 5 L 80 20 L 10 20 Z" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
    <line x1="25" y1="20" x2="25" y2="80" stroke="#ffffff" stroke-width="3"/>
    <line x1="65" y1="20" x2="65" y2="80" stroke="#ffffff" stroke-width="3"/>
    <path d="M 15 20 L 20 80 Q 45 95 75 80 L 80 20" fill="#ffffff" opacity="0.3"/>
  </g>
</svg>
EOF

echo "SVG icon created: gokul_icon.svg"
echo ""
echo "To generate PNG icons from this SVG, use:"
echo "magick convert -background none gokul_icon.svg -density 300 -resize 48x48 ic_launcher_mdpi.png"
echo "magick convert -background none gokul_icon.svg -density 300 -resize 72x72 ic_launcher_hdpi.png"
echo ""
echo "Or use an online tool: https://romannurik.github.io/AndroidAssetStudio/"

