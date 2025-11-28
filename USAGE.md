# 🎅 How to Use the Christmas AR Gift App

## Quick Start Guide

### Step 1: Launch the Application

1. Open your iPad's web browser (Safari recommended)
2. Navigate to the application URL
3. Wait for the app to load

### Step 2: Grant Camera Permission

When prompted, tap **"Allow"** to grant camera access. This is required for the hand detection to work.

### Step 3: Position Your Hand

1. Hold your hand in front of the camera
2. Open your hand with fingers extended
3. Keep your palm facing the camera
4. Ensure good lighting for best results

### Step 4: Receive Your Gift! 🎁

Once the app detects your open hand, a Christmas gift will appear on your palm!

## Tips for Best Results

### ✅ Do:
- Use good, even lighting
- Keep your hand steady and clearly visible
- Open your fingers wide
- Face your palm toward the camera
- Stay within 1-2 feet of the camera
- Hold your hand in the center of the frame

### ❌ Don't:
- Use in very dark environments
- Move your hand too quickly
- Cover your fingers or palm
- Use the app in direct sunlight (causes glare)
- Hold your hand too close or too far from camera

## Troubleshooting

### "Unable to access camera"
**Solution:** Check browser permissions:
1. Go to Settings > Safari > Camera
2. Ensure camera access is allowed
3. Refresh the page

### Gift not appearing
**Possible causes:**
- Hand is not open enough → Extend your fingers more
- Poor lighting → Move to a brighter area
- Hand not detected → Move closer to camera
- Too many objects in frame → Clear the background

### App is slow or laggy
**Solutions:**
- Close other browser tabs
- Close background apps on iPad
- Ensure iPad is not in Low Power Mode
- Restart the browser

### Video is upside down or mirrored
This is normal! The app uses the front-facing camera which may appear mirrored.

## Features Explained

### Hand Detection
The app uses AI (TensorFlow.js with MediaPipe) to:
- Identify your hand in real-time
- Track 21 points on your hand
- Determine if your hand is open
- Calculate the center of your palm

### Open Hand Criteria
Your hand is considered "open" when:
- At least 3 fingers are extended
- Fingers are pointing away from palm
- Hand is facing the camera

### Gift Placement
The gift is placed at the center of your palm, calculated from:
- Your wrist position
- Base of your index finger
- Base of your pinky finger

## Fun Ideas

### 🎄 Christmas Party
- Set up at your holiday party entrance
- Let guests "receive" virtual gifts
- Take photos/videos of the AR experience

### 👨‍👩‍👧‍👦 Family Fun
- Kids love seeing the magical gift appear!
- Try catching multiple gifts with both hands
- Create festive videos to share

### 📸 Photo Opportunities
- Take screenshots when the gift appears
- Try different hand positions
- Share on social media with #ChristmasAR

### 🎮 Challenges
- See how steady you can keep the gift
- Try with both hands simultaneously
- Time how long you can hold the gift

## Technical Details

### Browser Compatibility
✅ **Supported:**
- Safari on iOS/iPadOS 14+
- Chrome on Android 9+
- Desktop Chrome/Edge (for testing)

❌ **Not Supported:**
- Internet Explorer
- Very old browser versions
- Browsers without camera API support

### Performance
- Runs at ~30 FPS on modern iPads
- Uses ~100-200 MB RAM
- Requires active camera permission
- Works offline after initial load (except model download)

## Privacy & Security

- ✅ All processing happens on your device
- ✅ No video or photos are uploaded
- ✅ No data is stored or transmitted
- ✅ Camera feed is not recorded
- ✅ Hand detection is real-time only

## Support

Having issues? Check:
1. Camera permissions are enabled
2. You're using a supported browser
3. Your device has camera access
4. Lighting is adequate

## Enjoy the Magic! 🎅🎄✨

Have a wonderful holiday season and enjoy your virtual Christmas gifts!

