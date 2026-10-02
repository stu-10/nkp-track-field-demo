import { Race } from './race.js';
const $=id=>document.getElementById(id), race=new Race(), canvas=$('track'), ctx=canvas.getContext('2d');
let previous=performance.now(), saved=false, best=null;
try { const n=Number(localStorage.getItem('cng-best')); if(n>0 && Number.isFinite(n)) best=n; } catch {}
function bestText(){ $('best').textContent=best ? best.toFixed(2)+'s' : '—'; } bestText();
fetch('/version.json').then(r=>r.json()).then(v=>{ $('version').textContent=`v${v.version} · ${v.commit.slice(0,7)}`; $('banner').textContent=v.banner; }).catch(()=>{});
function show(title,message,button='Race again') { $('overlay').classList.remove('hidden'); $('headline').textContent=title; $('message').textContent=message; $('start').firstChild.textContent=button+' '; $('status').textContent=title+' '+message; }
$('start').addEventListener('click',()=>{ race.start(performance.now()); saved=false; $('overlay').classList.add('hidden'); $('status').textContent='On your marks. Wait for GO.'; });
function step(side){race.step(side,performance.now());}
document.addEventListener('keydown',e=>{if(['a','l','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();if(!e.repeat)step(e.key==='a'||e.key==='ArrowLeft'?'left':'right');}});
for(const side of ['left','right'])$(side).addEventListener('pointerdown',e=>{e.preventDefault();step(side);});
document.addEventListener('visibilitychange',()=>{if(document.hidden && ['countdown','running'].includes(race.state)){race.reset();show('Race paused','The tab was hidden. Start a fresh race.');}});
function athlete(x,y,color,phase){ctx.fillStyle='#ead3bd';ctx.fillRect(x-4,y-38,10,10);ctx.fillStyle=color;ctx.fillRect(x-6,y-28,13,17);ctx.fillStyle='#ece9f5';const s=Math.sin(phase)*9;ctx.fillRect(x-6+s,y-11,5,14);ctx.fillRect(x+2-s,y-11,5,14);ctx.fillStyle='#16131f';ctx.fillRect(x-7+s,y+1,9,4);ctx.fillRect(x+1-s,y+1,9,4);ctx.fillStyle='#ead3bd';ctx.fillRect(x-11-s/2,y-26,5,14);ctx.fillRect(x+8+s/2,y-26,5,14);}
function draw(now){
 const w=1100;ctx.fillStyle='#25212e';ctx.fillRect(0,0,w,400);
 for(let row=0;row<4;row++)for(let col=0;col<80;col++){ctx.fillStyle=['#514466','#756288','#aaa0b9','#393241'][(row*3+col*7)%4];ctx.fillRect(col*14+3,18+row*14,7,7);}
 ctx.fillStyle='#19161f';ctx.fillRect(0,82,w,40);ctx.fillStyle='#b6a0ff';ctx.font='bold 13px monospace';ctx.fillText('CLOUD NATIVE GAMES     /     COMMIT → BUILD → DEPLOY',28,107);
 ctx.fillStyle='#7855fa';ctx.fillRect(0,122,w,242);
 for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#7050e6':'#7855fa';ctx.fillRect(0,124+i*48,w,46);ctx.fillStyle='#d9cdfd';ctx.fillRect(0,122+i*48,w,2);}
 const finish=970;for(let y=124;y<364;y+=12)for(let x=finish;x<finish+24;x+=12){ctx.fillStyle=((x-finish)/12+(y-124)/12)%2?'#2c2344':'#fff';ctx.fillRect(x,y,12,12);}
 ctx.fillStyle='#eee8ff';ctx.fillRect(95,122,2,242);ctx.font='12px monospace';ctx.fillText('START',70,388);ctx.fillText('100m',955,388);
 for(let lane=0;lane<5;lane++){ctx.fillStyle='#ded2ff';ctx.font='bold 16px monospace';ctx.fillText(String(lane+1),22,153+lane*48);}
 const active=race.state==='running'||race.state==='finished';
 for(let i=0;i<5;i++){let d=i===2?race.distance:active?Math.min(100,race.elapsed*(7.5+i*.22)):0;athlete(100+d*8.7,156+i*48,i===2?'#fff':['#cbbaff','#514071','#ad91ed','#342a4c'][i>2?i-1:i],active?now*.016+i:0);}
 if(race.state==='countdown'){ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.font='bold 64px monospace';ctx.fillText(String(Math.max(1,Math.ceil((race.startAt-now)/1000))),550,240);ctx.font='16px monospace';ctx.fillText('WAIT FOR GO!',550,271);ctx.textAlign='left';}
 if(race.state==='running' && race.elapsed<.65){ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 60px monospace';ctx.fillText('GO!',550,230);ctx.textAlign='left';}
}
function frame(now){const dt=Math.min((now-previous)/1000,.05);previous=now;race.update(now,dt);draw(now);$('time').innerHTML=race.elapsed.toFixed(2)+'<span>s</span>';$('distance').innerHTML=Math.floor(race.distance)+'<span>m</span>';
 if(race.state==='false-start'&&!saved){saved=true;show('False start!','Wait for the countdown to finish before taking your first step.');}
 if(race.state==='finished'&&!saved){saved=true;const record=!best||race.elapsed<best;if(record){best=race.elapsed;try{localStorage.setItem('cng-best',String(best));}catch{}bestText();}$('callout').textContent=record?'NEW PERSONAL BEST':'FINISH LINE';show(race.elapsed.toFixed(2)+' seconds',record?'A new record. Ready to go faster?':'Great finish. Try a steadier rhythm for more speed.');}
 requestAnimationFrame(frame);
}requestAnimationFrame(frame);
