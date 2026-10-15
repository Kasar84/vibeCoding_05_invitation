/**
 * Re:Connect Alumni Invitation - Interactive Scripts
 * Features:
 * 1. Photo Slider with Smooth Animations & Touch Gestures
 * 2. Real-time Live Countdown to 2032.10.1 17:00 with Animations
 * 3. 300x300 Naver-style Map of Changgyeonggung Palace
 * 4. Ambient Web Audio BGM Synthesizer
 * 5. Floating Petals Particle Canvas
 * 6. RSVP, Guestbook, Calendar & Sharing Utilities
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Photo Section - Smooth Carousel & Touch Gesture
     ========================================================================== */
  const photoSliderContainer = document.getElementById('photoSliderContainer');
  const slideItems = document.querySelectorAll('.slide-item');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const sliderPlayPauseBtn = document.getElementById('sliderPlayPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  let currentSlide = 0;
  const totalSlides = slideItems.length;
  let slideInterval = null;
  let isAutoPlaying = true;

  function showSlide(index, direction = 'next') {
    if (index === currentSlide && slideItems[currentSlide].classList.contains('active')) return;

    const prevIndex = currentSlide;
    currentSlide = (index + totalSlides) % totalSlides;

    slideItems.forEach((slide, i) => {
      slide.classList.remove('active', 'prev-out');
      if (i === prevIndex) {
        slide.classList.add('prev-out');
      }
    });

    slideItems[currentSlide].classList.add('active');

    // Update dots
    dotBtns.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1, 'next');
  }

  function prevSlide() {
    showSlide(currentSlide - 1, 'prev');
  }

  function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3800);
    isAutoPlaying = true;
    if (playIcon && pauseIcon) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    }
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
    isAutoPlaying = false;
    if (playIcon && pauseIcon) {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      nextSlide();
      if (isAutoPlaying) startAutoPlay();
    });
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      prevSlide();
      if (isAutoPlaying) startAutoPlay();
    });
  }

  dotBtns.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      showSlide(idx);
      if (isAutoPlaying) startAutoPlay();
    });
  });

  if (sliderPlayPauseBtn) {
    sliderPlayPauseBtn.addEventListener('click', () => {
      if (isAutoPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  // 모바일 터치 스와이프 제스처
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  if (photoSliderContainer) {
    photoSliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    photoSliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    // 마우스 드래그 스와이프 (데스크탑 테스트 지원)
    let isMouseDown = false;
    let mouseStartX = 0;

    photoSliderContainer.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
    });

    photoSliderContainer.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const diffX = e.clientX - mouseStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) prevSlide();
        else nextSlide();
        if (isAutoPlaying) startAutoPlay();
      }
    });

    photoSliderContainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });
  }

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // 수평 이동이 수직 스크롤보다 클 때만 스와이프 처리
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      if (isAutoPlaying) startAutoPlay();
    }
  }

  startAutoPlay();

  /* --- Lightbox Modal --- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  slideItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // 화살표나 컨트롤 클릭 시에는 모달 제외
      if (e.target.closest('.slider-arrow') || e.target.closest('.slider-controls')) return;
      const img = item.querySelector('.slide-img');
      const caption = item.getAttribute('data-caption') || img.alt;
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);


  /* ==========================================================================
     2. Countdown Section - Real-time Live Countdown
     Target: 2032.10.01 17:00:00 (KST, UTC+9)
     ========================================================================== */
  const eventDate = new Date('2032-10-01T17:00:00+09:00');

  const elCdDays = document.getElementById('cdDays');
  const elCdHours = document.getElementById('cdHours');
  const elCdMinutes = document.getElementById('cdMinutes');
  const elCdSeconds = document.getElementById('cdSeconds');
  const elDdayBadge = document.getElementById('ddayBadge');
  const elCountdownStatusMsg = document.getElementById('countdownStatusMsg');

  let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

  function animateDigit(el, newValue) {
    if (el.textContent !== newValue) {
      el.textContent = newValue;
      el.classList.remove('tick');
      void el.offsetWidth; // Trigger reflow
      el.classList.add('tick');
    }
  }

  function updateCountdown() {
    const now = new Date();
    const diffMs = eventDate - now;

    if (diffMs <= 0) {
      elCdDays.textContent = '00';
      elCdHours.textContent = '00';
      elCdMinutes.textContent = '00';
      elCdSeconds.textContent = '00';
      if (elDdayBadge) elDdayBadge.textContent = 'D-DAY 오늘입니다!';
      if (elCountdownStatusMsg) elCountdownStatusMsg.textContent = '🎉 드디어 우리들의 소중한 만남의 날입니다! 환영합니다!';
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const strDays = String(days);
    const strHours = String(hours).padStart(2, '0');
    const strMinutes = String(minutes).padStart(2, '0');
    const strSeconds = String(seconds).padStart(2, '0');

    animateDigit(elCdDays, strDays);
    animateDigit(elCdHours, strHours);
    animateDigit(elCdMinutes, strMinutes);
    animateDigit(elCdSeconds, strSeconds);

    if (elDdayBadge) {
      elDdayBadge.textContent = `D-${days}일`;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 캘린더 등록 (Google Calendar & .ics)
  const addGoogleCalendarBtn = document.getElementById('addGoogleCalendarBtn');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');

  if (addGoogleCalendarBtn) {
    addGoogleCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent('Re:Connect SDU 동창회');
      const details = encodeURIComponent('세월이 흘러도 변하지 않는 우리들의 이야기, Re:Connect 동창회에 초대합니다.');
      const location = encodeURIComponent('창경궁 (서울특별시 종로구 창경궁로 185)');
      // 2032-10-01 17:00 KST = 2032-10-01 08:00 UTC
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20321001T080000Z/20321001T120000Z&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
    });
  }

  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SDU Alumni//Re:Connect//KO',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'SUMMARY:Re:Connect SDU 동창회',
        'DESCRIPTION:세월이 흘러도 변하지 않는 우리들의 이야기\\, Re:Connect 동창회에 초대합니다.',
        'LOCATION:창경궁 (서울특별시 종로구 창경궁로 185)',
        'DTSTART:20321001T080000Z',
        'DTEND:20321001T120000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'ReConnect_SDU_동창회.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('캘린더 일정 파일(.ics)이 다운로드되었습니다.');
    });
  }


  /* ==========================================================================
     3. Map Section - 300x300 Pixels Google Location Map of Changgyeonggung
     Embedded via official Google Maps responsive iframe
     ========================================================================== */

  // 주소 복사하기
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = '서울특별시 종로구 창경궁로 185 (와룡동 2-1)';
      copyToClipboard(address, '창경궁 주소가 복사되었습니다.');
    });
  }


  /* ==========================================================================
     4. Ambient Web Audio BGM Synthesizer (No external file needed)
     Warm & Nostalgic Pentatonic Arpeggio
     ========================================================================== */
  const bgmToggleBtn = document.getElementById('bgmToggleBtn');
  let audioCtx = null;
  let isBgmPlaying = false;
  let bgmTimer = null;

  // 감성적인 펜타토닉 멜로디 주파수 목록 (Hz)
  const melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25,
    392.00, 329.63, 440.00, 261.63, 293.66, 392.00, 523.25, 440.00
  ];
  let noteIndex = 0;

  function playPianoTone(freq, duration = 1.6) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'triangle'; // 부드럽고 따뜻한 톤
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // 피아노/벨 스타일 엔벨로프 (빠른 어택, 긴 서스테인 감쇄)
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  function startBgm() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isBgmPlaying = true;
    bgmToggleBtn.classList.add('active');

    function loopStep() {
      if (!isBgmPlaying) return;
      const freq = melodyNotes[noteIndex % melodyNotes.length];
      playPianoTone(freq, 1.8);
      // 부드러운 화음 베이스 추가 (3도 아래 옥타브)
      if (noteIndex % 4 === 0) {
        playPianoTone(freq / 2, 2.4);
      }
      noteIndex++;
      bgmTimer = setTimeout(loopStep, 800);
    }
    loopStep();
    showToast('🎵 배경음악이 재생됩니다.');
  }

  function stopBgm() {
    isBgmPlaying = false;
    bgmToggleBtn.classList.remove('active');
    if (bgmTimer) clearTimeout(bgmTimer);
    showToast('🔇 배경음악이 일시정지되었습니다.');
  }

  if (bgmToggleBtn) {
    bgmToggleBtn.addEventListener('click', () => {
      if (isBgmPlaying) {
        stopBgm();
      } else {
        startBgm();
      }
    });
  }


  /* ==========================================================================
     5. Petals Canvas Particle Animation
     ========================================================================== */
  const petalCanvas = document.getElementById('petalCanvas');
  const petalToggleBtn = document.getElementById('petalToggleBtn');
  let isPetalsEnabled = true;

  if (petalCanvas) {
    const ctx = petalCanvas.getContext('2d');
    let width = petalCanvas.width = window.innerWidth;
    let height = petalCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = petalCanvas.width = window.innerWidth;
      height = petalCanvas.height = window.innerHeight;
    });

    const petals = [];
    const petalCount = 22;

    class Petal {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedX = Math.random() * 1.2 - 0.4;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.4 + 0.35;
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.03 + 0.01;
      }
      update() {
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      }
      draw() {
        if (!isPetalsEnabled) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(Math.sin(this.flip), 1);
        ctx.beginPath();
        // 꽃잎 타원 모양
        ctx.ellipse(0, 0, this.size, this.size * 1.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 195, 205, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      const p = new Petal();
      p.y = Math.random() * height; // 초기 화면 분산
      petals.push(p);
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      if (isPetalsEnabled) {
        petals.forEach(p => {
          p.update();
          p.draw();
        });
      }
      requestAnimationFrame(animatePetals);
    }
    animatePetals();

    if (petalToggleBtn) {
      petalToggleBtn.addEventListener('click', () => {
        isPetalsEnabled = !isPetalsEnabled;
        petalToggleBtn.classList.toggle('active', isPetalsEnabled);
        showToast(isPetalsEnabled ? '🌸 꽃잎 효과를 켰습니다.' : '꽃잎 효과를 껐습니다.');
      });
    }
  }


  /* ==========================================================================
     6. RSVP Form Submission Handling
     ========================================================================== */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessMsg = document.getElementById('rsvpSuccessMsg');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(rsvpForm);
      const rsvpData = {
        name: formData.get('name'),
        attendance: formData.get('attendance'),
        guestCount: formData.get('guestCount'),
        contact: formData.get('contact'),
        message: formData.get('message'),
        date: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('reconnect_rsvp') || '[]');
        stored.push(rsvpData);
        localStorage.setItem('reconnect_rsvp', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage error', err);
      }

      rsvpForm.style.display = 'none';
      if (rsvpSuccessMsg) {
        rsvpSuccessMsg.classList.remove('hidden');
      }
      showToast('참석 여부가 정상적으로 등록되었습니다!');
    });
  }


  /* ==========================================================================
     7. Guestbook Section
     ========================================================================== */
  const guestbookForm = document.getElementById('guestbookForm');
  const gbAuthor = document.getElementById('gbAuthor');
  const gbContent = document.getElementById('gbContent');
  const guestbookList = document.getElementById('guestbookList');

  const defaultMessages = [
    { author: '김민수', text: '벌써 이렇게 시간이 흘렀네요! 다들 너무 보고 싶습니다.', date: '2026.10.15' },
    { author: '이지은', text: '창경궁 가을 경치도 보고 친구들도 만날 생각에 벌써 설레네요.', date: '2026.10.16' },
    { author: '박준호', text: '그때 그 시절 사진 보니 뭉클하네요. 무조건 참석합니다!', date: '2026.10.16' }
  ];

  function loadGuestbook() {
    let list = [];
    try {
      const stored = localStorage.getItem('reconnect_guestbook');
      if (stored) {
        list = JSON.parse(stored);
      } else {
        list = defaultMessages;
      }
    } catch (e) {
      list = defaultMessages;
    }

    if (guestbookList) {
      guestbookList.innerHTML = list.map(item => `
        <div class="gb-item">
          <div class="gb-meta">
            <span class="gb-author">${escapeHtml(item.author)}</span>
            <span class="gb-date">${item.date}</span>
          </div>
          <p class="gb-text">${escapeHtml(item.text)}</p>
        </div>
      `).join('');
    }
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = gbAuthor.value.trim();
      const text = gbContent.value.trim();
      if (!author || !text) return;

      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
      const newEntry = { author, text, date: todayStr };

      try {
        const stored = JSON.parse(localStorage.getItem('reconnect_guestbook') || JSON.stringify(defaultMessages));
        stored.unshift(newEntry);
        localStorage.setItem('reconnect_guestbook', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage save error', err);
      }

      gbAuthor.value = '';
      gbContent.value = '';
      loadGuestbook();
      showToast('축하 메시지가 등록되었습니다.');
    });
  }

  loadGuestbook();


  /* ==========================================================================
     8. Sharing & Toast Utilities
     ========================================================================== */
  const shareTopBtn = document.getElementById('shareTopBtn');
  const kakaoShareBtn = document.getElementById('kakaoShareBtn');
  const copyUrlBtn = document.getElementById('copyUrlBtn');
  const toast = document.getElementById('toast');

  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage);
      }).catch(() => {
        fallbackCopy(text, successMessage);
      });
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMessage);
    } catch (e) {
      showToast('복사에 실패했습니다. 직접 복사해 주세요.');
    }
    document.body.removeChild(tempInput);
  }

  function triggerShare() {
    const shareData = {
      title: 'Re:Connect 동창회 초대장',
      text: '세월이 흘러도 변하지 않는 우리들의 이야기, Re:Connect에 초대합니다.',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError') {
          copyToClipboard(window.location.href, '초대장 링크가 복사되었습니다!');
        }
      });
    } else {
      copyToClipboard(window.location.href, '초대장 링크가 복사되었습니다!');
    }
  }

  if (shareTopBtn) shareTopBtn.addEventListener('click', triggerShare);
  if (kakaoShareBtn) kakaoShareBtn.addEventListener('click', triggerShare);
  if (copyUrlBtn) copyUrlBtn.addEventListener('click', () => {
    copyToClipboard(window.location.href, '초대장 주소(URL)가 복사되었습니다!');
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
