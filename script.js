// Helper
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Hamburger
const hamburger = $('#hamburger');
const navLinks = $('#nav-links');
hamburger && hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
$$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('active')));

// Dark mode toggle
const themeToggle = $('#theme-toggle');
function applyTheme(theme){
  if(theme==='dark') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  themeToggle.checked = (theme==='dark');
}
const savedTheme = localStorage.getItem('site-theme');
if(savedTheme) applyTheme(savedTheme);
else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
themeToggle.addEventListener('change', ()=>{
  const newTheme = themeToggle.checked?'dark':'light';
  applyTheme(newTheme);
  localStorage.setItem('site-theme',newTheme);
  updateFormStatusColor();
});

// Typed text
const typedEl = $('#typed-text');
const words = ["Data Science Student","CSE Enthusiast","AI/ML Learner"];
let wIndex=0,cIndex=0,deleting=false;
function typeLoop(){
  if(!typedEl) return;
  const current = words[wIndex];
  if(deleting){
    cIndex=Math.max(0,cIndex-1);
    typedEl.textContent=current.substring(0,cIndex);
    if(cIndex===0){deleting=false;wIndex=(wIndex+1)%words.length;setTimeout(typeLoop,200);return;}
    setTimeout(typeLoop,50);
  }else{
    cIndex=Math.min(current.length,cIndex+1);
    typedEl.textContent=current.substring(0,cIndex);
    if(cIndex===current.length){deleting=true;setTimeout(typeLoop,900);return;}
    setTimeout(typeLoop,120);
  }
}
typeLoop();

// Back to top
const backToTop=document.createElement('button');
backToTop.id='back-to-top';
backToTop.title='Back to top';
backToTop.innerHTML='↑';
document.body.appendChild(backToTop);
let arrowTimeout;
window.addEventListener('scroll',()=>{
  backToTop.style.display=window.scrollY>300?'block':'none';
  if(arrowTimeout) clearTimeout(arrowTimeout);
  if(window.scrollY>300){
    arrowTimeout=setTimeout(()=>{backToTop.style.display='none';},5000);
  }
});
backToTop.addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'});
  if(arrowTimeout) clearTimeout(arrowTimeout);
  arrowTimeout=setTimeout(()=>{backToTop.style.display='none';},5000);
});

// Contact Form
const form=$('#contact-form');
const formStatus=$('#form-status');
function updateFormStatusColor(){
  if(!formStatus)return;
  if(document.body.classList.contains('dark')) formStatus.style.color='#fff';
  else formStatus.style.color='#000';
}
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const formData=new FormData(form);
    const data={name:formData.get("name"),email:formData.get("email"),message:formData.get("message")};
    formStatus.innerHTML=`<span class="spinner"></span> Sending...`;
    updateFormStatusColor();
    fetch("https://script.google.com/macros/s/AKfycbxSh1UB9BQqR82bokusHPHW4cZFCJQXbZpq7VCSO8KJmI7iuTy3xuRgnDX1d7dSJGQZ/exec",{
      method:"POST",body:JSON.stringify(data)
    })
    .then(res=>res.text())
    .then(()=>{
      formStatus.textContent="Message sent successfully!";
      updateFormStatusColor();
      setTimeout(()=>{formStatus.textContent="";},5000);
      form.reset();
    })
    .catch(()=>{
      formStatus.textContent="Error sending message.";
      formStatus.style.color='crimson';
    });
  });
}

// Set hero height dynamically
function setHeroHeight() {
  const hero = document.querySelector('.hero');
  if(hero) hero.style.minHeight = window.innerHeight + 'px';
}

// Match card heights
function matchCardHeights(sectionId){
  const cards=document.querySelectorAll(`#${sectionId} .cards-container .card`);
  if(cards.length>0){
    const maxHeight=Math.max(...Array.from(cards).map(c=>c.offsetHeight));
    cards.forEach(c=>c.style.height=maxHeight+'px');
  }
}

// Adjust all sections
function adjustAllSections(){
  setHeroHeight();
  ['experience','education','certificates'].forEach(matchCardHeights);
}

// Initial adjustment
window.addEventListener('load', adjustAllSections);

// On resize / orientation
window.addEventListener('resize', adjustAllSections);
window.addEventListener('orientationchange', adjustAllSections);