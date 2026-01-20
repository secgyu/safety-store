/**
 * WebM to High-Quality GIF 변환 스크립트
 * 
 * 사용법:
 * 1. npm install ffmpeg-static fluent-ffmpeg
 * 2. node convert-to-gif.js
 * 
 * 고품질 GIF 생성을 위해 palette 생성 후 변환합니다.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ffmpeg-static 사용
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = 'ffmpeg'; // fallback to system ffmpeg
}

const VIDEO_DIR = path.join(__dirname, 'videos');
const GIF_DIR = path.join(__dirname, 'gifs');

// GIF 변환 설정
const GIF_CONFIG = {
  fps: 15,           // 프레임 레이트 (높을수록 부드러움)
  width: 800,        // 출력 너비 (높을수록 선명)
  quality: 'high'    // 'high', 'medium', 'low'
};

function ensureGifDir() {
  if (!fs.existsSync(GIF_DIR)) {
    fs.mkdirSync(GIF_DIR, { recursive: true });
  }
}

function checkFFmpeg() {
  return ffmpegPath !== null;
}

async function convertToGif(inputPath, outputPath, config) {
  const { fps, width } = config;
  const palettePath = inputPath.replace('.webm', '-palette.png');
  
  return new Promise((resolve, reject) => {
    console.log(`  ⏳ Generating palette...`);
    
    // 1단계: 팔레트 생성 (고품질 GIF를 위해 필수)
    const paletteCmd = [
      '-y',
      '-i', inputPath,
      '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos,palettegen=max_colors=256:stats_mode=diff`,
      palettePath
    ];
    
    const paletteProcess = spawn(ffmpegPath, paletteCmd, { stdio: 'pipe' });
    
    paletteProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Palette generation failed with code ${code}`));
        return;
      }
      
      console.log(`  ⏳ Converting to GIF...`);
      
      // 2단계: 팔레트를 사용하여 GIF 생성
      const gifCmd = [
        '-y',
        '-i', inputPath,
        '-i', palettePath,
        '-lavfi', `fps=${fps},scale=${width}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
        outputPath
      ];
      
      const gifProcess = spawn(ffmpegPath, gifCmd, { stdio: 'pipe' });
      
      gifProcess.on('close', (code) => {
        // 팔레트 파일 삭제
        try {
          fs.unlinkSync(palettePath);
        } catch {}
        
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`GIF conversion failed with code ${code}`));
        }
      });
      
      gifProcess.on('error', reject);
    });
    
    paletteProcess.on('error', reject);
  });
}

async function convertAllVideos() {
  ensureGifDir();
  
  if (!checkFFmpeg()) {
    console.error('❌ ffmpeg not found! Please install:');
    console.log('   npm install ffmpeg-static');
    process.exit(1);
  }
  
  console.log(`📦 Using ffmpeg: ${ffmpegPath}\n`);
  
  const videos = fs.readdirSync(VIDEO_DIR)
    .filter(f => f.endsWith('.webm'));
  
  if (videos.length === 0) {
    console.log('❌ No WebM videos found in videos/ directory.');
    console.log('   Run capture-screenshots.js first!');
    process.exit(1);
  }
  
  console.log(`🎬 Found ${videos.length} videos to convert\n`);
  
  for (const video of videos) {
    const inputPath = path.join(VIDEO_DIR, video);
    const outputPath = path.join(GIF_DIR, video.replace('.webm', '.gif'));
    
    console.log(`📽️  Converting: ${video}`);
    
    try {
      await convertToGif(inputPath, outputPath, GIF_CONFIG);
      
      const stats = fs.statSync(outputPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`  ✅ Done: ${path.basename(outputPath)} (${sizeMB} MB)\n`);
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log('\n✅ All conversions completed!');
  console.log(`📁 GIFs saved to: ${GIF_DIR}`);
}

// 개별 파일 변환도 지원
const args = process.argv.slice(2);
if (args.length > 0) {
  const inputFile = args[0];
  if (fs.existsSync(inputFile)) {
    ensureGifDir();
    const outputPath = path.join(GIF_DIR, path.basename(inputFile).replace('.webm', '.gif'));
    convertToGif(inputFile, outputPath, GIF_CONFIG)
      .then(() => console.log(`✅ Converted: ${outputPath}`))
      .catch(console.error);
  } else {
    console.error(`❌ File not found: ${inputFile}`);
  }
} else {
  convertAllVideos().catch(console.error);
}
