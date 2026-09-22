const $=(selector, context=document)=>context.querySelector(selector);
const navToggle=$('.nav-toggle');
const nav=$('#primary-nav');
navToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');navToggle?.setAttribute('aria-expanded','false');}));
const quoteForm=$('#quote-form');
quoteForm?.addEventListener('submit',(event)=>{event.preventDefault();const from=$('#from').value.trim();const to=$('#to').value.trim();const result=$('.form-result');if(!from||!to)return;result.textContent=`Thanks — we’ll prepare an illustrative estimate for ${from} to ${to}.`;});
