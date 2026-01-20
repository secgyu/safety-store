/**
 * 진단 결과 페이지 캡처 스크립트
 * 실제 진단을 수행하고 결과 페이지를 캡처합니다.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:8000';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');
const VIDEO_DIR = path.join(__dirname, 'videos');

const TEST_USER = {
  email: 'admin@example.com',
  password: 'admin123'
};

async function ensureDirectories() {
  [OUTPUT_DIR, VIDEO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function loginAndDiagnose(page) {
  // 로그인
  const loginResponse = await page.request.post(`${API_URL}/api/auth/login-custom`, {
    data: {
      email: TEST_USER.email,
      password: TEST_USER.password
    },
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!loginResponse.ok()) {
    console.log('❌ Login failed');
    return null;
  }
  
  const loginData = await loginResponse.json();
  const token = loginData.token;
  console.log('✅ Logged in successfully');
  
  // 사업장 검색
  const searchResponse = await page.request.get(`${API_URL}/api/diagnose/search?keyword=춘리`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!searchResponse.ok()) {
    console.log('❌ Search failed');
    return null;
  }
  
  const searchData = await searchResponse.json();
  console.log(`✅ Found ${searchData.total || searchData.results?.length || 0} businesses`);
  
  if (!searchData.results || searchData.results.length === 0) {
    console.log('⚠️ No businesses found');
    return null;
  }
  
  const business = searchData.results[0];
  console.log(`📍 Selected: ${business.businessName || business.business_name}`);
  
  // 진단 수행
  const diagnoseResponse = await page.request.post(`${API_URL}/api/diagnose/predict`, {
    data: { encoded_mct: business.encodedMct },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!diagnoseResponse.ok()) {
    console.log('❌ Diagnosis failed');
    const errorText = await diagnoseResponse.text();
    console.log('Error:', errorText);
    return null;
  }
  
  console.log('✅ Diagnosis completed');
  return token;
}

async function main() {
  console.log('🚀 Starting Results Page Capture...\n');
  
  await ensureDirectories();
  
  const browser = await chromium.launch({ headless: true });
  
  // 비디오 녹화용 컨텍스트
  const videoContext = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await videoContext.newPage();
  
  try {
    // 로그인 및 진단 수행
    const token = await loginAndDiagnose(page);
    
    if (!token) {
      console.log('❌ Could not complete diagnosis. Skipping results capture.');
      return;
    }
    
    // 토큰 저장하고 결과 페이지로 이동
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    await page.evaluate((authToken) => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: { authToken },
        version: 0
      }));
    }, token);
    
    // 결과 페이지로 이동
    await page.goto(`${BASE_URL}/results`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 스크린샷 캡처 (전체 페이지)
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'results.png'),
      fullPage: true,
      animations: 'allow'
    });
    console.log('📸 Screenshot saved: results.png');
    
    // 스크롤하면서 데모 영상 녹화
    console.log('🎬 Recording scroll demo...');
    
    const scrollPositions = [0, 400, 800, 1200, 1600, 2000, 2400, 0];
    for (const pos of scrollPositions) {
      await page.evaluate((scrollPos) => {
        window.scrollTo({ top: scrollPos, behavior: 'smooth' });
      }, pos);
      await page.waitForTimeout(1000);
    }
    
    await page.waitForTimeout(500);
    
  } finally {
    await page.close();
    await videoContext.close();
    await browser.close();
  }
  
  // 비디오 파일 이름 변경
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const files = fs.readdirSync(VIDEO_DIR);
  const videos = files
    .filter(f => f.endsWith('.webm') && !f.startsWith('results'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);
  
  if (videos.length > 0) {
    const oldPath = path.join(VIDEO_DIR, videos[0].name);
    const newPath = path.join(VIDEO_DIR, 'results-full.webm');
    try {
      if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      fs.renameSync(oldPath, newPath);
      console.log('🎬 Video saved: results-full.webm');
    } catch (e) {
      console.log('🎬 Video saved as:', videos[0].name);
    }
  }
  
  console.log('\n✅ Results capture completed!');
}

main().catch(console.error);
