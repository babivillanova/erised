# 🎄 Christmas AR Gift Experience

An interactive augmented reality web application for iPad that detects open hands and places virtual Christmas gifts on them using computer vision.

## ✨ Features

- **Real-time Hand Detection**: Uses TensorFlow.js and MediaPipe Hands for accurate hand tracking
- **Open Hand Recognition**: Automatically detects when your hand is open
- **Gift Overlay**: Places a festive Christmas gift on your palm
- **Full-Screen Experience**: Optimized for iPad with immersive full-screen camera view
- **Festive Design**: Christmas-themed UI with decorative elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- An iPad or device with a camera
- Modern web browser (Safari, Chrome)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your iPad browser and navigate to the local development URL (typically `http://localhost:3000`)

4. Grant camera permissions when prompted

### Building for Production

```bash
npm run build
npm start
```

## 🎮 How to Use

1. **Launch the app** on your iPad
2. **Allow camera access** when prompted
3. **Open your hand** with fingers extended and palm facing the camera
4. **Watch** as a Christmas gift appears on your palm!

The app works best when:
- Your hand is clearly visible to the camera
- There's good lighting in the room
- Your palm is facing the camera
- At least 3 fingers are extended

## 🛠️ Technology Stack

- **Next.js 14+**: React framework for production
- **TypeScript**: Type-safe development
- **TensorFlow.js**: Machine learning in the browser
- **MediaPipe Hands**: Hand landmark detection
- **Tailwind CSS**: Utility-first styling

## 📁 Project Structure

```
erised/
├── app/
│   ├── components/
│   │   └── HandDetectionCamera.tsx  # Main AR component
│   ├── layout.tsx                   # App layout with metadata
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── common/
│   └── loadingSpinner.js            # Loading indicator
├── public/
│   └── images/
│       └── gift.svg                 # Gift illustration
└── package.json
```

## 🎨 Customization

### Change the Gift Image

Replace `/public/images/gift.png` or `/public/images/gift.svg` with your own gift design.

### Adjust Hand Detection Sensitivity

In `HandDetectionCamera.tsx`, modify the `isHandOpen()` function:

```typescript
// Change the threshold (currently 3 fingers)
const extendedCount = [...].filter(Boolean).length;
return extendedCount >= 3; // Adjust this number
```

### Modify Gift Size

In the `drawGift()` function, adjust the base size:

```typescript
const size = 100 * scale; // Change 100 to your desired size
```

## 🎅 Christmas Theming

The app includes festive elements:
- 🎄 Christmas tree decorations
- ⭐ Sparkling stars
- 🎁 Gift box with ribbon and bow
- Christmas color scheme (red and green)
- Animated elements for a magical feel

## 📱 iPad Optimization

The app is optimized for iPad with:
- Full-screen viewport
- Touch-friendly interface
- High-resolution camera support
- Proper scaling for different iPad sizes
- No zoom or scroll

## 🔧 Troubleshooting

### Camera not working
- Ensure you've granted camera permissions
- Check if another app is using the camera
- Try refreshing the page
- On iOS, make sure you're using Safari or a compatible browser

### Hand detection not working
- Ensure good lighting
- Keep your hand clearly visible
- Try opening your fingers more
- Move closer or farther from the camera

### Performance issues
- Close other browser tabs
- Ensure your device isn't in low power mode
- Try reducing the number of hands detected (edit `maxHands` in the code)

## 📄 License

This project is open source and available under the MIT License.

## 🎁 Happy Holidays!

Enjoy spreading Christmas cheer with this festive AR experience! 🎅🎄✨
