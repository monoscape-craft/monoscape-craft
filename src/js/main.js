import { gsap } from "gsap";

const runOpening = () => {
  const layer = document.getElementById('opening-layer');
  const textField = document.getElementById('opening-text');
  
  if (!layer || !textField || sessionStorage.getItem('hasVisited')) {
    if (layer) layer.style.display = 'none';
    return;
  }

  const message = "Thank you for visiting";
  
  textField.innerHTML = [...message].map(char => 
    `<span>${char === " " ? "&nbsp;" : char}</span>`
  ).join("");

  const iconSpan = document.createElement("span");
  iconSpan.className = "opening-icon";
  iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"/></svg>`;
  textField.appendChild(iconSpan);

  const spans = textField.querySelectorAll("span");
  gsap.set(spans, { transformOrigin: "center bottom" });

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(layer, {
        duration: 1.0,
        yPercent: -100,
        ease: "power4.inOut",
        onComplete: () => {
          layer.style.display = "none";
          sessionStorage.setItem('hasVisited', 'true');
        }
      });
    }
  });

  spans.forEach((span, i) => {
    const charTl = gsap.timeline();
    
    let startTime = 0.5 + (i * 0.05);
    if (i === 0) startTime = 0;
    if (i === spans.length - 1) startTime = (i * 0.05) + 0.8;

    charTl.from(span, {
      y: -300,
      duration: 1.2,
      ease: "bounce.out",
    }, 0);

    charTl.fromTo(span, 
      { scaleX: 0.2, scaleY: 2, opacity: 0 },
      { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.6, ease: "back.out(4)" }, 
      0.4
    );

    if (i === spans.length - 1) {
      charTl.to(span, { rotation: 360, duration: 1, ease: "back.out" }, 0.6);
    }

    tl.add(charTl, startTime);
  });
};

const observeScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
};

const renderWorks = (data) => {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  const path = `${import.meta.env.BASE_URL}/images/top/`;
  
  let displayData;
  const savedOrder = sessionStorage.getItem('worksOrder');

  if (savedOrder) {
    const orderIds = JSON.parse(savedOrder);
    displayData = orderIds.map(id => data.find(item => item.id === id)).filter(Boolean);
  } else {
    displayData = [...data].sort(() => Math.random() - 0.5);
    const orderIds = displayData.map(item => item.id);
    sessionStorage.setItem('worksOrder', JSON.stringify(orderIds));
  }

  grid.innerHTML = displayData.map(item => {
    const isVideo = item.file.endsWith('.mp4');
    const posterName = item.file.replace('thumb_', 'poster_').replace('.mp4', '.jpg');
    const mediaHtml = isVideo 
      ? `<video src="${path}${item.file}" poster="${path}${posterName}" muted playsinline autoplay loop></video>`
      : `<img src="${path}${item.file}" alt="${item.title}">`;
    const slug = item.id;

    return `
      <a href="${import.meta.env.BASE_URL}projects/projects.html?id=${slug}" class="work-card fade-in">
        <div class="image-wrapper">${mediaHtml}</div>
        <div class="work-info">
          <h3>${item.title}</h3>
          <p>${item.category}</p>
        </div>
      </a>`;
  }).join('');
  observeScroll();
};

const initTop = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/works.json`);
    const json = await response.json();
    runOpening(); 
    renderWorks(json.worksData);
  } catch (e) {
    console.error("Data Load Error:", e);
  }
};

const updateCopyrightYear = () => {
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
};

window.addEventListener("DOMContentLoaded", () => {
  initTop();
  updateCopyrightYear();
});
