const $=(selector, context=document)=>context.querySelector(selector);
const $$=(selector, context=document)=>[...context.querySelectorAll(selector)];
const navToggle=$('.nav-toggle');
const nav=$('#primary-nav');
navToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');navToggle?.setAttribute('aria-expanded','false');}));

const backdrop=$('.modal-backdrop');
let activeModal=null;
const closeModal=()=>{if(!activeModal)return;activeModal.hidden=true;backdrop.hidden=true;document.body.classList.remove('modal-open');activeModal=null;};
const openModal=(id)=>{closeModal();activeModal=document.getElementById(id);if(!activeModal)return;activeModal.hidden=false;backdrop.hidden=false;document.body.classList.add('modal-open');activeModal.querySelector('input,select')?.focus();};
$$('.modal-trigger').forEach(trigger=>trigger.addEventListener('click',()=>openModal(trigger.dataset.modal)));
$$('.modal-close').forEach(button=>button.addEventListener('click',closeModal));
backdrop?.addEventListener('click',closeModal);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
$$('.modal-form').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const result=$('.form-result',form);result.textContent=form.dataset.success||'Thanks — your request has been received.';form.reset();}));

$('#inline-quote-form')?.addEventListener('submit',event=>{event.preventDefault();const from=$('#from').value.trim();const to=$('#to').value.trim();const result=$('.form-result');if(from&&to)result.textContent=`Thanks — we’ll prepare an illustrative estimate for ${from} to ${to}.`;});
