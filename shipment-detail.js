const shipmentThemeButton=document.querySelector('.shipment-header .theme-toggle');
const storedShipmentTheme=localStorage.getItem('ships-theme');
if(storedShipmentTheme)document.documentElement.dataset.theme=storedShipmentTheme;
function syncShipmentTheme(){const dark=document.documentElement.dataset.theme==='dark';if(shipmentThemeButton){shipmentThemeButton.innerHTML=`<i class="fa-solid fa-${dark?'sun':'moon'}"></i>`;shipmentThemeButton.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode')}}
syncShipmentTheme();
shipmentThemeButton?.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=dark?'light':'dark';localStorage.setItem('ships-theme',dark?'light':'dark');syncShipmentTheme()});

document.querySelector('#toggle-updates')?.addEventListener('click',event=>{const list=document.querySelector('#updates-list');const showing=list.classList.toggle('show-all');event.currentTarget.textContent=showing?'Show fewer updates':'Show all updates'});
document.querySelector('#print-shipment')?.addEventListener('click',()=>window.print());
document.querySelector('#share-shipment')?.addEventListener('click',async event=>{const shareData={title:'Ships shipment SH-2048-AL',text:'Track shipment SH-2048-AL on Ships.',url:window.location.href};try{if(navigator.share){await navigator.share(shareData);event.currentTarget.innerHTML='<i class="fa-solid fa-check"></i> Shared'}else{await navigator.clipboard.writeText(window.location.href);event.currentTarget.innerHTML='<i class="fa-solid fa-check"></i> Link copied'}}catch(error){if(error.name!=='AbortError')event.currentTarget.textContent='Copy link failed'}setTimeout(()=>{event.currentTarget.innerHTML='<i class="fa-solid fa-share-nodes"></i> Share'},2200)});
const map=document.querySelector('.route-map');let zoom=1;document.querySelectorAll('.map-controls button').forEach((button,index)=>button.addEventListener('click',()=>{zoom=Math.min(1.35,Math.max(.9,zoom+(index===0?.1:-.1)));map.querySelector('svg').style.transform=`scale(${zoom})`;map.querySelector('svg').style.transformOrigin='center'}));
