/**
 * Playwright 스크립트: 스크린샷 및 WebM 영상 캡처
 * 
 * 사용법:
 * 1. npm install playwright
 * 2. npx playwright install chromium
 * 3. node capture-screenshots.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');
const VIDEO_DIR = path.join(__dirname, 'videos');
const GIF_DIR = path.join(__dirname, 'gifs');

// 테스트 계정 정보
const TEST_USER = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'admin'
};

// 캡처할 페이지 목록
const PAGES_TO_CAPTURE = [
  { name: 'landing', path: '/', description: '랜딩 페이지' },
  { name: 'login', path: '/login', description: '로그인 페이지', interaction: 'fillLogin' },
  { name: 'dashboard', path: '/dashboard', description: '대시보드', needsAuth: true },
  { name: 'diagnose', path: '/diagnose', description: '진단 페이지', needsAuth: true, interaction: 'searchBusiness' },
  { name: 'results', path: '/results', description: '진단 결과', needsAuth: true, scroll: true },
  { name: 'statistics', path: '/statistics', description: '통계 페이지' },
  { name: 'insights', path: '/insights', description: '인사이트' },
  { name: 'faq', path: '/faq', description: 'FAQ', interaction: 'expandFAQ' },
  { name: 'success-stories', path: '/success-stories', description: '성공 사례' },
];

async function ensureDirectories() {
  [OUTPUT_DIR, VIDEO_DIR, GIF_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function login(page) {
  // 직접 API 호출로 로그인
  const loginResponse = await page.request.post('http://localhost:8000/api/auth/login-custom', {
    data: {
      email: TEST_USER.email,
      password: TEST_USER.password
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (loginResponse.ok()) {
    const data = await loginResponse.json();
    const token = data.token;
    
    // 토큰을 localStorage에 저장 (Zustand store 형식에 맞게)
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    await page.evaluate((authToken) => {
      // Zustand persist store 형식으로 저장
      localStorage.setItem('auth-storage', JSON.stringify({
        state: { authToken },
        version: 0
      }));
    }, token);
    
    // 대시보드로 이동
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    console.log('  ✅ Login successful');
  } else {
    console.log('  ⚠️ Login failed, continuing without auth...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
  }
}

async function performInteraction(page, interaction) {
  switch (interaction) {
    case 'fillLogin':
      // 로그인 폼 채우기 (제출하지 않음)
      await page.fill('input[type="email"], input[name="email"]', 'user@example.com');
      await page.waitForTimeout(300);
      await page.fill('input[type="password"], input[name="password"]', '●●●●●●●●');
      await page.waitForTimeout(500);
      break;
      
    case 'searchBusiness':
      // 비즈니스 검색 폼 채우기
      await page.waitForTimeout(1000);
      const searchInput = await page.$('input[placeholder*="가게"], input[placeholder*="검색"], input[type="text"]');
      if (searchInput) {
        await searchInput.fill('춘리');
        await page.waitForTimeout(500);
      }
      break;
      
    case 'expandFAQ':
      // FAQ 아코디언 펼치기
      await page.waitForTimeout(500);
      const accordionTriggers = await page.$$('[data-radix-collection-item], button[data-state]');
      if (accordionTriggers.length > 0) {
        await accordionTriggers[0].click();
        await page.waitForTimeout(500);
      }
      if (accordionTriggers.length > 1) {
        await accordionTriggers[1].click();
        await page.waitForTimeout(500);
      }
      break;
  }
}

async function captureScreenshot(page, name, scroll = false) {
  const screenshotPath = path.join(OUTPUT_DIR, `${name}.png`);
  
  if (scroll) {
    // 스크롤하면서 전체 페이지 캡처
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      animations: 'allow'
    });
  } else {
    await page.screenshot({ 
      path: screenshotPath,
      animations: 'allow'
    });
  }
  
  console.log(`📸 Screenshot saved: ${screenshotPath}`);
}

async function recordVideo(context, page, name, actions) {
  const videoPath = path.join(VIDEO_DIR, `${name}.webm`);
  
  // 새 컨텍스트와 페이지 생성 (비디오 녹화용)
  const videoContext = await context.browser().newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const videoPage = await videoContext.newPage();
  
  try {
    await actions(videoPage);
    await videoPage.waitForTimeout(500);
  } finally {
    await videoPage.close();
    await videoContext.close();
  }
  
  // 비디오 파일 이름 변경
  const files = fs.readdirSync(VIDEO_DIR);
  const latestVideo = files
    .filter(f => f.endsWith('.webm'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time)[0];
  
  if (latestVideo) {
    const oldPath = path.join(VIDEO_DIR, latestVideo.name);
    try {
      fs.renameSync(oldPath, videoPath);
      console.log(`🎬 Video saved: ${videoPath}`);
    } catch (e) {
      console.log(`🎬 Video saved as: ${latestVideo.name}`);
    }
  }
}

async function capturePageWithVideo(browser, pageConfig, isLoggedIn) {
  console.log(`\n📍 Capturing: ${pageConfig.description} (${pageConfig.path})`);
  
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
    // 로그인 필요시 로그인
    if (pageConfig.needsAuth && !isLoggedIn) {
      await login(page);
    }
    
    // 페이지 이동
    await page.goto(`${BASE_URL}${pageConfig.path}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500); // 애니메이션 완료 대기
    
    // 상호작용 수행
    if (pageConfig.interaction) {
      await performInteraction(page, pageConfig.interaction);
    }
    
    // 스크롤 효과 (영상용)
    if (pageConfig.scroll) {
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'smooth' }));
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(800);
    }
    
    // 스크린샷 캡처
    await captureScreenshot(page, pageConfig.name, pageConfig.scroll);
    
  } finally {
    await page.close();
    await videoContext.close();
  }
  
  // 비디오 파일 이름 변경
  await renameLatestVideo(pageConfig.name);
}

async function renameLatestVideo(name) {
  const targetPath = path.join(VIDEO_DIR, `${name}.webm`);
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // 파일 쓰기 완료 대기
  
  const files = fs.readdirSync(VIDEO_DIR);
  const videos = files
    .filter(f => f.endsWith('.webm') && !PAGES_TO_CAPTURE.some(p => f === `${p.name}.webm`))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs
    }))
    .sort((a, b) => b.time - a.time);
  
  if (videos.length > 0) {
    const oldPath = path.join(VIDEO_DIR, videos[0].name);
    try {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      fs.renameSync(oldPath, targetPath);
      console.log(`🎬 Video saved: ${targetPath}`);
    } catch (e) {
      console.log(`🎬 Video saved as: ${videos[0].name}`);
    }
  }
}

async function captureResultsPageDemo(browser) {
  console.log('\n🎥 Recording Results Page Demo...');
  
  const videoContext = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await videoContext.newPage();
  
  try {
    // 로그인
    await login(page);
    
    // 결과 페이지로 이동
    await page.goto(`${BASE_URL}/results`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 스크롤하면서 각 섹션 보여주기
    const sections = [0, 400, 800, 1200, 1600, 2000, 2400];
    
    for (const scrollPos of sections) {
      await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'smooth' }), scrollPos);
      await page.waitForTimeout(1200);
    }
    
    // 맨 위로 돌아가기
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
  } finally {
    await page.close();
    await videoContext.close();
  }
  
  await renameLatestVideo('results-demo');
}

async function captureDiagnoseFlow(browser) {
  console.log('\n🎥 Recording Diagnose Flow Demo...');
  
  const videoContext = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await videoContext.newPage();
  
  try {
    // 로그인
    await login(page);
    
    // 진단 페이지로 이동
    await page.goto(`${BASE_URL}/diagnose`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // 검색어 입력 (천천히 타이핑 효과)
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.click();
      await page.waitForTimeout(300);
      
      const searchText = '춘리';
      for (const char of searchText) {
        await searchInput.type(char, { delay: 150 });
      }
      await page.waitForTimeout(800);
      
      // 검색 버튼 클릭
      const searchButton = await page.$('button:has-text("검색"), button[type="submit"]');
      if (searchButton) {
        await searchButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
  } finally {
    await page.close();
    await videoContext.close();
  }
  
  await renameLatestVideo('diagnose-flow');
}

async function main() {
  console.log('🚀 Starting screenshot and video capture...\n');
  
  await ensureDirectories();
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security']
  });
  
  try {
    // 각 페이지 캡처
    for (const pageConfig of PAGES_TO_CAPTURE) {
      await capturePageWithVideo(browser, pageConfig, false);
    }
    
    // 특별 데모 영상 녹화
    await captureResultsPageDemo(browser);
    await captureDiagnoseFlow(browser);
    
    console.log('\n✅ All captures completed!');
    console.log(`\n📁 Screenshots: ${OUTPUT_DIR}`);
    console.log(`📁 Videos: ${VIDEO_DIR}`);
    console.log('\n💡 To convert WebM to GIF, run:');
    console.log('   node convert-to-gif.js');
    
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
