/**
 * 랜딩 페이지 캡처 (튜토리얼 모달 닫기)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');
const VIDEO_DIR = path.join(__dirname, 'videos');

async function main() {
  console.log('🚀 Capturing Landing Page...\n');
  
  const browser = await chromium.launch({ headless: true });
  
  const videoContext = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await videoContext.newPage();
  
  try {
    // 이미 온보딩을 완료한 것처럼 localStorage 설정
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState('networkidle');
    
    // 온보딩 완료 표시 (정확한 키 이름 사용)
    await page.evaluate(() => {
      localStorage.setItem('onboarding_completed', 'true');
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // 스크린샷 캡처
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'landing.png'),
      animations: 'allow'
    });
    console.log('📸 Screenshot saved: landing.png');
    
    // 전체 페이지 스크린샷
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'landing-full.png'),
      fullPage: true,
      animations: 'allow'
    });
    console.log('📸 Full page screenshot saved: landing-full.png');
    
    // 스크롤 데모
    console.log('🎬 Recording scroll demo...');
    const positions = [0, 500, 1000, 1500, 0];
    for (const pos of positions) {
      await page.evaluate((scrollPos) => {
        window.scrollTo({ top: scrollPos, behavior: 'smooth' });
      }, pos);
      await page.waitForTimeout(1200);
    }
    
    await page.waitForTimeout(500);
    
  } finally {
    await page.close();
    await videoContext.close();
    await browser.close();
  }
  
  // 비디오 이름 변경
  await new Promise(r => setTimeout(r, 1000));
  
  const files = fs.readdirSync(VIDEO_DIR);
  const videos = files
    .filter(f => f.endsWith('.webm') && !f.startsWith('landing'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);
  
  if (videos.length > 0) {
    const oldPath = path.join(VIDEO_DIR, videos[0].name);
    const newPath = path.join(VIDEO_DIR, 'landing.webm');
    try {
      if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      fs.renameSync(oldPath, newPath);
      console.log('🎬 Video saved: landing.webm');
    } catch (e) {
      console.log('🎬 Video saved as:', videos[0].name);
    }
  }
  
  console.log('\n✅ Landing capture completed!');
}

main().catch(console.error);
