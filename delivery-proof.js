const canvas=document.getElementById('signature-canvas');const clearButton=document.getElementById('clear-signature');const submitButton=document.getElementById('submit-proof');const photoInput=document.getElementById('photo-upload-input');const photoPreview=document.getElementById('photo-preview');
if(canvas){
  const ctx=canvas.getContext('2d');
  const setCanvasSize=()=>{
    const ratio=Math.min(window.devicePixelRatio||1,2);
    const rect=canvas.getBoundingClientRect();
    canvas.width=rect.width*ratio;
    canvas.height=rect.height*ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.lineWidth=2.6;
    ctx.strokeStyle='#14231f';
    ctx.fillStyle='#f8fbf7';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  };
  setCanvasSize();
  let drawing=false;
  let lastX=0; let lastY=0;
  const getPoint=(event)=>{
    const rect=canvas.getBoundingClientRect();
    const x=(event.clientX-rect.left)*(canvas.width/rect.width);
    const y=(event.clientY-rect.top)*(canvas.height/rect.height);
    return {x,y};
  };
  const startDrawing=(event)=>{drawing=true;const pos=getPoint(event);lastX=pos.x;lastY=pos.y;ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(lastX,lastY);ctx.stroke();};
  const draw=(event)=>{if(!drawing) return;const pos=getPoint(event);ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(pos.x,pos.y);ctx.stroke();lastX=pos.x;lastY=pos.y;};
  canvas.addEventListener('pointerdown',startDrawing);
  canvas.addEventListener('pointermove',draw);
  canvas.addEventListener('pointerup',()=>drawing=false);
  canvas.addEventListener('pointerleave',()=>drawing=false);
  clearButton?.addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#f8fbf7';ctx.fillRect(0,0,canvas.width,canvas.height);});
  window.addEventListener('resize',setCanvasSize);
}

photoInput?.addEventListener('change',event=>{
  const [file]=event.target.files||[];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=(loadEvent)=>{
    const img=document.createElement('img');
    img.src=loadEvent.target.result;
    photoPreview.innerHTML='';
    photoPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

submitButton?.addEventListener('click',()=>{
  const noteField=document.getElementById('delivery-notes');
  const text=noteField?noteField.value.trim():'');
  submitButton.innerHTML='<i class="fa-solid fa-check"></i> Proof submitted';
  submitButton.disabled=true;
  submitButton.style.opacity='0.8';
  if(text){
    noteField.value = text + '\nSubmitted successfully.';
  }
});

const proofThemeButton=document.querySelector('.theme-toggle');
const storedTheme=localStorage.getItem('ships-theme');
if(storedTheme)document.documentElement.dataset.theme=storedTheme;
function syncProofTheme(){const dark=document.documentElement.dataset.theme==='dark';if(proofThemeButton){proofThemeButton.innerHTML=`<i class="fa-solid fa-${dark?'sun':'moon'}"></i>`;proofThemeButton.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');}}
syncProofTheme();
proofThemeButton?.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=dark?'light':'dark';localStorage.setItem('ships-theme',dark?'light':'dark');syncProofTheme();});
