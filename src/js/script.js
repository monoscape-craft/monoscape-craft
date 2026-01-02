const projectImages = import.meta.glob('../assets/images/projects/*.{jpg,png,mp4}', { eager: true, as: 'url' });

const getAssetUrl = (fileName) => {
  const key = `../assets/images/${fileName}`;
  return projectImages[key] || ''; 
};

const observeScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
};

const setupProjectDetail = () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id'); 

  if (!slug) return;

  const basic = window.worksData.find(item => item.id === slug);
  const detail = window.projectDetails[slug];

  if (!detail || !basic) return;

  try {
    document.getElementById('p-page-title').innerText = `${basic.title} | monoscape-craft`;
    document.getElementById('p-title').innerText = basic.title;
    document.getElementById('p-category').innerText = basic.category;
    document.getElementById('p-year').innerText = detail.year || '----';
    document.getElementById('p-role').innerText = detail.role;
    document.getElementById('p-duration').innerText = detail.duration;
    document.getElementById('p-tools').innerText = detail.tools;
    document.getElementById('p-concept').innerHTML = detail.concept;
    const addCommentEl = document.getElementById('p-additionalComments');
    if (detail.additionalComments && detail.additionalComments.trim() !== "") {
      addCommentEl.innerHTML = detail.additionalComments;
      addCommentEl.closest('.description-section').style.display = 'block';
    } else {
      addCommentEl.closest('.description-section').style.display = 'none';
    }

    const heroContainer = document.getElementById('p-hero-container');
    const isVideo = basic.file.endsWith('.mp4');
    const needsMockup = basic.category === 'Web Design' || basic.category === 'Web Development';

    heroContainer.className = needsMockup ? 'pc-mock-style' : '';
    heroContainer.style = needsMockup ? '' : 'background:transparent; padding:0; aspect-ratio:auto; box-shadow:none;';
    
    const fileName = basic.file.replace(/poster_|thumb_/g, "");
    if (isVideo) {
      const poster = basic.file.replace('thumb_', 'poster_').replace('.mp4', '.jpg');
      heroContainer.innerHTML = `<video src="${getAssetUrl(`projects/${fileName}`)}" poster="${getAssetUrl(`projects/${poster}`)}" controls playsinline muted></video>`;
    } else {
      heroContainer.innerHTML = `<img src="${getAssetUrl(`projects/${fileName}`)}" alt="${basic.title}">`;
    }

    const slider = document.getElementById('p-detail-slider');
    const isBanner = basic.category === 'Web Graphics / Link Banner & Promotion Banner';
    slider.className = isBanner ? 'banner-grid' : 'concept-slider';

    if (detail.details?.[0]) {
      slider.innerHTML = detail.details.map(file => {
        const fileName = file.trim();
        const assetPath = getAssetUrl(`projects/${fileName}`);
        const isVideoFile = fileName.endsWith('.mp4');
        const posterPath = isVideoFile ? getAssetUrl(`projects/${fileName.replace(/\.mp4$/, '.jpg')}`) : assetPath;

        return `
          <div class="concept-item ${isVideoFile ? 'is-video' : ''}" onclick='openModal("${fileName}", ${JSON.stringify(detail.details)})'>
            ${isVideoFile 
              ? `<video src="${assetPath}" poster="${posterPath}" muted playsinline></video>
                <div class="play-icon"></div>` 
              : `<img src="${assetPath}">`
            }
            <div class="thumb-info"><span>Zoom</span></div>
          </div>`;
      }).join('');
    }
  } catch (e) { console.error(e); }
};

let currentImageList = [], currentIndex = 0;

window.openModal = (fullPath, list = []) => {
  currentImageList = list.length > 0 ? list : [fullPath.split('/').pop()];
  currentIndex = currentImageList.findIndex(f => fullPath.includes(f));
  renderModalContent();
  const modal = document.getElementById('modalOverlay');
  if(modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
};

const renderModalContent = () => {
  const content = document.getElementById('modalContent');
  // const file = currentImageList[currentIndex];
  // const path = `${import.meta.env.BASE_URL}/images/projects/${file}`; 
  // content.innerHTML = file.endsWith('.mp4') ? `<video src="${path}" controls autoplay></video>` : `<img src="${path}">`;
  const file = currentImageList[currentIndex];
  const path = getAssetUrl(`projects/${file}`);
  content.innerHTML = file.endsWith('.mp4') ? `<video src="${path}" controls autoplay></video>` : `<img src="${path}">`;
};

const setupModalEvents = () => {
  const modal = document.getElementById('modalOverlay');
  if (!modal) return;
  modal.onclick = () => { modal.style.display = 'none'; document.getElementById('modalContent').innerHTML = ''; document.body.style.overflow = ''; };
  
  const next = document.getElementById('modalNext');
  const prev = document.getElementById('modalPrev');
  if (next) next.onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % currentImageList.length; renderModalContent(); };
  if (prev) prev.onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + currentImageList.length) % currentImageList.length; renderModalContent(); };
};

const loadData = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/works.json`);
    const data = await response.json();
    window.worksData = data.worksData;
    window.projectDetails = data.projectDetails;
    initApp();
  } catch (e) { console.error(e); }
};

const updateCopyrightYear = () => {
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
};

const initApp = () => {
  if (window.location.pathname.includes('/projects/')) setupProjectDetail();
  setupModalEvents();
  observeScroll();
};

window.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateCopyrightYear();
});
