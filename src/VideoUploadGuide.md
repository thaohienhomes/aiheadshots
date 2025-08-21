# Video Upload Guide for AI Headshot Platform

## How to Add Videos to Your Project

### 1. Create a Videos Directory
Create a `public/videos/` directory in your project root:
```
your-project/
├── public/
│   ├── videos/
│   │   ├── headshot-demo.mp4
│   │   ├── headshot-demo.webm
│   │   └── poster-image.jpg
│   └── ...
├── components/
└── ...
```

### 2. Video File Requirements

#### Recommended Formats:
- **MP4 (H.264)**: Primary format for broad compatibility
- **WebM**: Modern format for better compression
- **Duration**: 30-60 seconds for demo videos
- **Resolution**: 800x800px (square aspect ratio to match the container)
- **File Size**: Keep under 10MB for good performance

#### Video Specifications:
```
Format: MP4 (H.264)
Resolution: 800x800px or 1024x1024px
Frame Rate: 30fps
Bitrate: 2-4 Mbps
Audio: Optional (usually muted for hero videos)
```

### 3. Adding Your Video Files

1. **Add video files** to `/public/videos/`:
   - `headshot-demo.mp4` (primary)
   - `headshot-demo.webm` (fallback)

2. **Add poster image** (optional):
   - `poster-image.jpg` - shown before video loads

3. **Update the video sources** in `HeroSection.tsx`:
   ```tsx
   <source src="/videos/your-demo-video.mp4" type="video/mp4" />
   <source src="/videos/your-demo-video.webm" type="video/webm" />
   ```

### 4. Video Optimization Tips

#### Using FFmpeg (Command Line):
```bash
# Convert to MP4 with optimal settings
ffmpeg -i input-video.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -vf "scale=800:800:force_original_aspect_ratio=increase,crop=800:800" output-video.mp4

# Convert to WebM
ffmpeg -i input-video.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -vf "scale=800:800:force_original_aspect_ratio=increase,crop=800:800" output-video.webm

# Create poster image from video
ffmpeg -i input-video.mp4 -ss 00:00:01 -vframes 1 -vf "scale=800:800:force_original_aspect_ratio=increase,crop=800:800" poster-image.jpg
```

#### Online Tools:
- **CloudConvert**: https://cloudconvert.com/
- **HandBrake**: Free video converter
- **Online Video Converter**: https://www.onlinevideoconverter.com/

### 5. Alternative: Using Placeholder Video

If you don't have a video yet, you can use a high-quality placeholder:

```tsx
// In HeroSection.tsx, update the poster and add a placeholder source
<video
  ref={videoRef}
  className="w-full h-full object-cover"
  muted={isMuted}
  loop
  playsInline
  poster="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face"
>
  {/* Use a placeholder video URL for testing */}
  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
  
  {/* Your actual videos */}
  <source src="/videos/headshot-demo.mp4" type="video/mp4" />
  <source src="/videos/headshot-demo.webm" type="video/webm" />
</video>
```

### 6. Performance Considerations

#### Lazy Loading:
```tsx
<video
  ref={videoRef}
  preload="metadata" // Only load metadata initially
  // ... other props
>
```

#### Multiple Quality Options:
```tsx
// Add different quality versions
<source src="/videos/headshot-demo-hd.mp4" type="video/mp4" media="(min-width: 1024px)" />
<source src="/videos/headshot-demo-sd.mp4" type="video/mp4" />
```

### 7. Video Content Ideas

For your AI headshot demo video, consider showing:
- **Before/After transformation**: Split screen or transition
- **Processing steps**: Upload → Analysis → Enhancement → Result
- **Multiple examples**: Different people, styles, backgrounds
- **Feature highlights**: Speed, quality, AI models used

### 8. Troubleshooting

#### Common Issues:
1. **Video won't play**: Check file path and format
2. **Large file size**: Optimize with lower bitrate
3. **Poor quality**: Increase resolution or bitrate
4. **Browser compatibility**: Ensure multiple formats

#### Testing:
```javascript
// Add to browser console to test video loading
const video = document.querySelector('video');
console.log('Video ready state:', video.readyState);
console.log('Video duration:', video.duration);
```

### 9. Production Deployment

When deploying to production:
1. **CDN**: Consider using a CDN for video delivery
2. **Compression**: Use modern formats (WebM, AV1)
3. **Adaptive streaming**: For longer videos, use HLS or DASH
4. **Analytics**: Track video engagement

### 10. Example Implementation

Here's the complete video element with all optimizations:

```tsx
<video
  ref={videoRef}
  className="w-full h-full object-cover"
  muted={isMuted}
  loop
  playsInline
  preload="metadata"
  poster="/videos/poster-image.jpg"
  onPlay={() => setIsVideoPlaying(true)}
  onPause={() => setIsVideoPlaying(false)}
  onEnded={() => setIsVideoPlaying(false)}
  onLoadedData={() => console.log('Video loaded')}
  onError={(e) => console.error('Video error:', e)}
>
  {/* High quality for desktop */}
  <source 
    src="/videos/headshot-demo-hd.mp4" 
    type="video/mp4" 
    media="(min-width: 1024px)" 
  />
  
  {/* Standard quality for mobile */}
  <source 
    src="/videos/headshot-demo.mp4" 
    type="video/mp4" 
  />
  
  {/* WebM fallback */}
  <source 
    src="/videos/headshot-demo.webm" 
    type="video/webm" 
  />
  
  {/* Fallback content */}
  <p>Your browser doesn't support video playback.</p>
</video>
```

This setup provides a professional video showcase that enhances your AI headshot platform's user experience while maintaining optimal performance across all devices.