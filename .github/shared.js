const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BASE=location.pathname.replace(/\/$/,'');
const me=()=>{try{return JSON.parse(atob(localStorage.token.split('.')[1])).id}catch{return null}};
async function api(p,m='GET',b){
  const r=await fetch(BASE+'/api'+p,{method:m,headers:{'Content-Type':'application/json',Authorization:'Bearer '+(localStorage.token||'')},body:b?JSON.stringify(b):undefined});
  const d=await r.json();if(!r.ok)throw new Error(d.error||'Error');return d;
}
function start(init){
  const a=$('auth');
  if(localStorage.token){a.innerHTML='Hi <b>'+esc(localStorage.name)+'</b> <button onclick="localStorage.clear();location.reload()">Logout</button> <a href="/">All tasks</a>';init();return;}
  a.innerHTML='<div class=card><input id=an placeholder=Name><input id=ae placeholder=Email><input id=ap type=password placeholder=Password><br><button onclick="go(\'login\')">Login</button><button onclick="go(\'register\')">Register</button></div>';
}
async function go(t){
  try{const d=await api('/'+t,'POST',{name:$('an').value,email:$('ae').value,password:$('ap').value});
  localStorage.token=d.token;localStorage.name=d.name;location.reload();}catch(x){alert(x.message)}
}
