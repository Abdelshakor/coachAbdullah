const WHATSAPP_NUMBER = "201146165846"; // بدون +
const INSTAGRAM_URL = "https://www.instagram.com/dr.3bodlift/";
const TRANSFORMATIONS_FALLBACK = [
  {"image":"./assets/img/youssef-egypt-recomp.png","title":"Youssef (Egypt) — Recomp — 3 Months","caption_ar":"يوسف • مصر 🇪🇬 • 3 شهور • الهدف: Recomp (خسارة دهون + زيادة عضل)","caption_en":"Youssef • Egypt 🇪🇬 • 3 Months • Goal: Recomp (lose fat + gain muscle)"},
  {"image":"./assets/img/hamza-jordan-bulking.png","title":"Hamza (Jordan) — Bulking — 6 Months","caption_ar":"حمزة • الأردن 🇯🇴 • 6 شهور • الهدف: Bulking (زيادة كتلة عضلية)","caption_en":"Hamza • Jordan 🇯🇴 • 6 Months • Goal: Bulking (muscle gain)"},
  {"image":"./assets/img/hamza-jordan-minicut.png","title":"Hamza (Jordan) — Mini cut — 3 Months","caption_ar":"حمزة • الأردن 🇯🇴 • 3 شهور • الهدف: Mini cut (تنشيف سريع)","caption_en":"Hamza • Jordan 🇯🇴 • 3 Months • Goal: Mini cut (quick cut)"}
];


function setLang(lang){
  const ar = document.querySelectorAll(".lang-ar");
  const en = document.querySelectorAll(".lang-en");
  const btnAr = document.getElementById("btnAr");
  const btnEn = document.getElementById("btnEn");

  if(lang === "ar"){
    document.documentElement.lang = "ar";
    document.body.dir = "rtl";
    ar.forEach(x => x.classList.add("active"));
    en.forEach(x => x.classList.remove("active"));
    btnAr?.classList.add("primary");
    btnEn?.classList.remove("primary");
  }else{
    document.documentElement.lang = "en";
    document.body.dir = "ltr";
    en.forEach(x => x.classList.add("active"));
    ar.forEach(x => x.classList.remove("active"));
    btnEn?.classList.add("primary");
    btnAr?.classList.remove("primary");
  }
  localStorage.setItem("site_lang", lang);
}

function toggleMobileMenu(){
  document.getElementById("mobileMenu")?.classList.toggle("open");
}

function waLink(message){
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function startOnWhatsApp(){
  const name = document.getElementById("fName")?.value?.trim() || "";
  const age = document.getElementById("fAge")?.value?.trim() || "";
  const goal = document.getElementById("fGoal")?.value || "";
  const level = document.getElementById("fLevel")?.value || "";
  const note = document.getElementById("fNote")?.value?.trim() || "";

  const lang = localStorage.getItem("site_lang") || "ar";
  const header = lang === "ar" ? "مرحبًا دكتور عبدالله، عايز أبدأ Online Coaching" : "Hi Dr. Abdallah, I'd like to start Online Coaching";
  const msg =
`${header}
---------------------
Name: ${name || "-"}
Age: ${age || "-"}
Goal: ${goal || "-"}
Level: ${level || "-"}
Note: ${note || "-"}`;

  window.open(waLink(msg), "_blank");
}

function packageOnWhatsApp(pkgName){
  const lang = localStorage.getItem("site_lang") || "ar";
  const msg = lang === "ar"
    ? `مرحبًا دكتور عبدالله، عايز أشترك في باقة ${pkgName} لمدة 3 شهور.`
    : `Hi Dr. Abdallah, I'd like to subscribe to the ${pkgName} package (3 months).`;
  window.open(waLink(msg), "_blank");
}

function bindFAQ(){
  document.querySelectorAll(".acc-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const item = btn.closest(".acc-item");
      item.classList.toggle("open");
    });
  });
}


async function renderTransformations(){
  const grid = document.getElementById("transformGrid");
  if(!grid) return;

  try{
    const res = await fetch("./transformations.json", {cache:"no-store"});
    const items = await res.json();

    grid.innerHTML = items.map(it => `
      <div class="gallery-item" data-gallery data-src="${it.image}" data-title="${it.title}">
        <img src="${it.image}" alt="${it.title}" />
        <div class="cap">
          <span class="lang lang-ar">${it.caption_ar}</span>
          <span class="lang lang-en">${it.caption_en}</span>
        </div>
      </div>
    `).join("");
  }catch(e){
    // If fetch fails (e.g., file://), keep grid empty
    grid.innerHTML = "";
  }
}

function bindGallery(){
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const close = ()=> modal.classList.remove("open");

  document.querySelectorAll("[data-gallery]").forEach(card=>{
    card.addEventListener("click", ()=>{
      const src = card.getAttribute("data-src");
      const title = card.getAttribute("data-title") || "Transformation";
      modalImg.src = src;
      modalTitle.textContent = title;
      modal.classList.add("open");
    });
  });

  document.getElementById("modalClose")?.addEventListener("click", close);
  modal?.addEventListener("click", (e)=>{ if(e.target === modal) close(); });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") close(); });
}

function bindStickyWhatsApp(){
  document.getElementById("waFloat")?.addEventListener("click", ()=>{
    const lang = localStorage.getItem("site_lang") || "ar";
    const msg = lang === "ar"
      ? "مرحبًا دكتور عبدالله، عايز أعرف تفاصيل الباقات وأبدأ." 
      : "Hi Dr. Abdallah, I’d like package details and to start.";
    window.open(waLink(msg), "_blank");
  });
}


function bindInstagramLinks(){
  ["instaBtn","instaMobile","instaFooter"].forEach(id=>{
    const el = document.getElementById(id);
    if(el){ el.setAttribute("href", INSTAGRAM_URL); }
  });
}


function awaitMaybeRender(){
  // When opened via file://, fetch may fail. That is OK. On GitHub Pages it will work.
  renderTransformations().then(()=>{
    // Re-bind gallery after render
    bindGallery();
  });
}


(function init(){
  const saved = localStorage.getItem("site_lang");
  setLang(saved || "ar");
  bindInstagramLinks();
  awaitMaybeRender();
  bindFAQ();
  bindGallery();
  bindStickyWhatsApp();

  document.getElementById("btnAr")?.addEventListener("click", ()=>setLang("ar"));
  document.getElementById("btnEn")?.addEventListener("click", ()=>setLang("en"));
  document.getElementById("hamburger")?.addEventListener("click", toggleMobileMenu);

  document.querySelectorAll("[data-wa-start]").forEach(el=>{
    el.addEventListener("click", (e)=>{ e.preventDefault(); startOnWhatsApp(); });
  });

  document.querySelectorAll("[data-wa-package]").forEach(el=>{
    el.addEventListener("click", (e)=>{
      e.preventDefault();
      packageOnWhatsApp(el.getAttribute("data-wa-package"));
    });
  });
})();
