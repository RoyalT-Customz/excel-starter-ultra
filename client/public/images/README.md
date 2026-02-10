# Lesson Images

This folder contains images used in the Excel lessons.

## Images Included

The following images have been generated and are ready to use:

1. **excel-interface.png** ✅ - Diagram showing the Excel interface with cells, rows, columns, and ribbon labeled
2. **excel-ribbon.png** ✅ - Overview of the Excel ribbon showing different tabs (Home, Insert, etc.)
3. **entering-data.png** ✅ - Example demonstrating how to enter data into cells
4. **formatting-tools.png** ✅ - Overview of formatting tools in the Home tab (Bold, Italic, Colors, etc.)
5. **creating-charts.png** ✅ - Example chart showing how charts are created in Excel
6. **save-button.png** ✅ - Diagram showing the Save button location and keyboard shortcut

## Regenerating Images

If you need to regenerate these images, run:
```bash
node server/scripts/generate-images.js
```

This script uses the `canvas` library to create programmatic images. Make sure `canvas` is installed:
```bash
npm install canvas --save
```

## Replacing with Real Screenshots

These are placeholder/diagram images. You can replace them with actual Excel screenshots:

1. Take screenshots of Excel showing the relevant features
2. Add labels or annotations if helpful (arrows, text boxes)
3. Save images in this folder with the exact filenames listed above
4. The lesson viewer will automatically display them

## Image Guidelines

- **Format:** PNG or JPG
- **Size:** Recommended 800-1200px width for best display
- **Style:** Clear screenshots with labels/annotations are helpful for beginners
- **Naming:** Use lowercase with hyphens (e.g., `excel-interface.png`)

