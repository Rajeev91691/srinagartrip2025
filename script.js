const galleryImages = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close');

let currentIndex = 0;
let currentScale = 1;
let slideshowInterval = null;
let controlFadeTimeout = null;

window.addEventListener('DOMContentLoaded', () => {
  lightbox.style.display = 'none';
});

// Arrows
const nextBtn = document.createElement('span');
nextBtn.id = 'next';
nextBtn.classList.add('arrow');
nextBtn.innerHTML = '&#10095;';
lightbox.appendChild(nextBtn);

const prevBtn = document.createElement('span');
prevBtn.id = 'prev';
prevBtn.classList.add('arrow');
prevBtn.innerHTML = '&#10094;';
lightbox.appendChild(prevBtn);

// Tools
const tools = document.createElement('div');
tools.classList.add('lightbox-controls');

const downloadBtn = document.createElement('span');
downloadBtn.classList.add('control-icon');
downloadBtn.title = 'Download';
downloadBtn.innerHTML = '&#128190;';
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = lightboxImg.src;
  link.download = 'image.jpg';
  link.click();
});

const fullscreenBtn = document.createElement('span');
fullscreenBtn.classList.add('control-icon');
fullscreenBtn.title = 'Fullscreen';
fullscreenBtn.innerHTML = '&#x26F6;';
fullscreenBtn.addEventListener('click', () => {
  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (!isFullscreen) {
    if (lightbox.requestFullscreen) lightbox.requestFullscreen();
    else if (lightbox.webkitRequestFullscreen) lightbox.webkitRequestFullscreen();
    else if (lightbox.msRequestFullscreen) lightbox.msRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }
});

const slideshowBtn = document.createElement('span');
slideshowBtn.classList.add('control-icon');
slideshowBtn.title = 'Slideshow';
slideshowBtn.innerHTML = '&#9658;';
slideshowBtn.addEventListener('click', () => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    slideshowBtn.innerHTML = '&#9658;';
  } else {
    slideshowInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      showImage(currentIndex);
    }, 2000);
    slideshowBtn.innerHTML = '&#10074;&#10074;';
  }
});

tools.appendChild(downloadBtn);
tools.appendChild(fullscreenBtn);
tools.appendChild(slideshowBtn);
lightbox.appendChild(tools);

// Fullscreen change handling
function toggleFullscreenClass() {
  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  lightbox.classList.toggle('fullscreen', !!isFullscreen);
  if (isFullscreen) {
    lightbox.classList.remove('show-controls');
    lightbox.addEventListener('mousemove', showControlsTemporarily);
  } else {
    lightbox.classList.add('show-controls');
    lightbox.removeEventListener('mousemove', showControlsTemporarily);
    clearTimeout(controlFadeTimeout);
  }
}

function showControlsTemporarily() {
  lightbox.classList.add('show-controls');
  clearTimeout(controlFadeTimeout);
  controlFadeTimeout = setTimeout(() => {
    lightbox.classList.remove('show-controls');
  }, 2000);
}

document.addEventListener('fullscreenchange', toggleFullscreenClass);
document.addEventListener('webkitfullscreenchange', toggleFullscreenClass);
document.addEventListener('msfullscreenchange', toggleFullscreenClass);

// Open Lightbox
galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    showImage(index);
  });
});

function showImage(index) {
  lightboxImg.src = galleryImages[index].src;
  lightbox.style.display = 'flex';
  lightbox.classList.add('open');
  document.body.classList.add('no-scroll');
  currentScale = 1;
  lightboxImg.style.transform = 'scale(1)';
  lightboxImg.style.transformOrigin = 'center center';
}

// Close Lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightbox.classList.remove('open');
  document.body.classList.remove('no-scroll');
  currentScale = 1;
  lightboxImg.style.transform = 'scale(1)';
  lightboxImg.style.transformOrigin = 'center center';
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    slideshowBtn.innerHTML = '&#9658;';
  }
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
});

// Arrow Navigation
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex);
});
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex);
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'Escape') closeBtn.click();
  }
});

// Zoom on Wheel
lightbox.addEventListener('wheel', (e) => {
  e.preventDefault();
  const rect = lightboxImg.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  const originX = (offsetX / rect.width) * 100;
  const originY = (offsetY / rect.height) * 100;
  lightboxImg.style.transformOrigin = `${originX}% ${originY}%`;

  if (e.deltaY < 0) {
    currentScale = Math.min(currentScale + 0.1, 3);
  } else {
    currentScale = Math.max(currentScale - 0.1, 1);
  }

  lightboxImg.style.transform = `scale(${currentScale})`;
});
function createSnowflakes(count = 50) {
  for (let i = 0; i < count; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${2 + Math.random() * 3}s`;
    snowflake.style.fontSize = `${10 + Math.random() * 20}px`;
    document.body.appendChild(snowflake);
  }
}
createSnowflakes();

// Pause snowfall when lightbox opens
function updateSnowfall() {
  if (lightbox.classList.contains('open')) {
    document.body.classList.add('snow-paused');
  } else {
    document.body.classList.remove('snow-paused');
  }
}

// Hook to existing showImage and close actions
const originalShowImage = showImage;
showImage = function(index) {
  originalShowImage(index);
  updateSnowfall();
};

closeBtn.addEventListener('click', updateSnowfall);
