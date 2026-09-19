document.querySelectorAll('.tab').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
  });
});

const alertsThemeButton=document.querySelector('.theme-toggle');
const storedAlertsTheme=localStorage.getItem('ships-theme');
if(storedAlertsTheme)document.documentElement.dataset.theme=storedAlertsTheme;
function syncAlertsTheme(){const dark=document.documentElement.dataset.theme==='dark';if(alertsThemeButton){alertsThemeButton.innerHTML=`<i class="fa-solid fa-${dark?'sun':'moon'}"></i>`;alertsThemeButton.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');}}
syncAlertsTheme();
alertsThemeButton?.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=dark?'light':'dark';localStorage.setItem('ships-theme',dark?'light':'dark');syncAlertsTheme();});
