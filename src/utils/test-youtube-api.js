// Test script for YouTube metadata API
// Run this in browser console when app is running

async function testYouTubeAPI() {
  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  ];

  console.log('Testing YouTube Metadata API...\n');

  for (const url of testUrls) {
    try {
      console.log(`Testing URL: ${url}`);
      
      const response = await fetch('/api/youtube-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const metadata = await response.json();
        console.log('✅ Success:', metadata);
      } else {
        const error = await response.json();
        console.log('❌ Error:', error);
      }
      
      console.log('---\n');
    } catch (error) {
      console.log('❌ Network Error:', error);
      console.log('---\n');
    }
  }
}

// Usage: Run testYouTubeAPI() in browser console
window.testYouTubeAPI = testYouTubeAPI;
