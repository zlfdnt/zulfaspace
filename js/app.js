(function(){'use strict';
const $=s=>document.querySelector(s),GAS=(window.APP_CONFIG||{}).GAS_URL||'',OK=GAS&&!/GANTI|XXXX/.test(GAS);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https:\/\//.test(u||'')?u:'';
let D=window.FALLBACK,J='website',M='Semua';
// ---- API (POST wajib text/plain agar tanpa preflight)
async function api(action,data){const r=await fetch(OK?GAS:'',{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,data})});return r.json()}
const Q=[];function track(j,t){Q.push({j,t,p:innerWidth<768?'ponsel':innerWidth<1100?'tablet':'laptop'})}
function flush(){if(OK&&Q.length)navigator.sendBeacon?navigator.sendBeacon(GAS,new Blob([JSON.stringify({action:'track',data:Q.splice(0)})],{type:'text/plain'})):api('track',Q.splice(0))}
addEventListener('visibilitychange',()=>document.hidden&&flush());setInterval(flush,20000);
// ---- slideshow generik (hero & kartu)
function slideshow(box,imgs,ms){clearInterval(box._t);box.innerHTML=imgs.map((s,i)=>`<img src="${esc(s)}" alt="" loading="lazy" class="${i?'':'on'}">`).join('')+(imgs.length>1&&box.classList.contains('sl')?`<div class="dots">${imgs.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:'');
 if(imgs.length<2)return;let n=0;const go=k=>{const im=box.querySelectorAll('img'),dt=box.querySelectorAll('.dots i');im[n].classList.remove('on');dt[n]&&dt[n].classList.remove('on');n=(k+im.length)%im.length;im[n].classList.add('on');dt[n]&&dt[n].classList.add('on')};
 const st=()=>box._t=setInterval(()=>go(n+1),ms);st();box.onmouseenter=()=>clearInterval(box._t);box.onmouseleave=st}
// ---- sampul otomatis (SVG) bila url_gambar_sampul kosong; pisahkan banyak gambar dengan |
const PAL=[['#7C5CF0','#3BA7F0'],['#FF7A29','#7C5CF0'],['#3BA7F0','#7C5CF0']],SYM={Matematika:['π','∑','△'],Koding:['</>','{ }','▶'],Asesmen:['✓','A+','?']};
function cover(k){const u=String(k.sampul||'').split('|').map(safe).filter(Boolean);if(u.length)return u;const s=SYM[k.mapel]||['★','✦','◆'],t=esc(String(k.desk||'').slice(0,36));
 const deco=['<circle cx="270" cy="40" r="70" fill="#fff" opacity=".12"/><circle cx="40" cy="175" r="50" fill="#fff" opacity=".1"/>','<pattern id="d" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#fff" opacity=".35"/></pattern><rect width="320" height="200" fill="url(#d)"/>','<path d="M0 150Q80 100 160 150T320 140V200H0Z" fill="#fff" opacity=".14"/>'];
 return PAL.map((p,i)=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p[i%2]}"/><stop offset="1" stop-color="${p[(i+1)%2]}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/>${deco[i]}<text x="160" y="112" font-size="80" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="800">${esc(s[i])}</text><text x="16" y="184" font-size="13" fill="#fff" font-family="sans-serif" font-weight="600" opacity=".92">${t}</text></svg>`))}
// ---- render
function render(){const p=D.profil,g=D.pengaturan||{};
 TY.r=String(g.peran||'Guru Matematika|Pengembang Media Interaktif|Penyusun Modul & LKPD').split('|').map(x=>x.trim()).filter(Boolean);if(!TY.s){TY.s=1;typer()}
 if(g.judul_situs)document.title=g.judul_situs;if(/^#[0-9a-f]{6}$/i.test(g.warna_aksen||''))document.documentElement.style.setProperty('--p',g.warna_aksen);
 if(g.deskripsi_meta){const m=document.querySelector('meta[name=description]');m&&m.setAttribute('content',g.deskripsi_meta)}
 if(g.mode==='maintenance'&&!$('#mt'))document.body.insertAdjacentHTML('beforeend','<div id="mt" style="position:fixed;inset:0;z-index:99999;background:#F4F1FF;display:grid;place-items:center;text-align:center;padding:24px"><div><h1>ZulfaSpace sedang diperbarui</h1><p class="hand">Segera kembali ✨</p></div></div>');else if(g.mode!=='maintenance'&&$('#mt'))$('#mt').remove();
 $('#nm').textContent=p.nama.split(' ')[0];$('#jab').textContent=p.jabatan.toUpperCase();$('#hl').textContent=p.headline+' ✨';$('#rg').textContent=p.ringkasan;
 $('#thn').textContent='⭐ '+p.tahun+'+ Tahun Pengalaman';$('#wa').href='https://wa.me/'+p.wa+'?text='+encodeURIComponent('Halo Bu Zulfa, saya melihat portofolio ZulfaSpace.');
 const fh=String(p.foto||'').split('|').map(s=>s.trim()).filter(safe);slideshow($('#heroSl'),fh.length?fh:['img/profil-1.jpg','img/profil-2.jpg'],4000);
 $('#soc').innerHTML=[['ig','📷'],['tiktok','🎵'],['github','⌨️'],['linkedin','💼']].filter(x=>safe(p[x[0]])).map(x=>`<a href="${esc(p[x[0]])}" target="_blank" rel="noopener" aria-label="${x[0]}">${x[1]}</a>`).join('')+`<a href="mailto:${esc(p.email)}" aria-label="Email">✉️</a>`;
 const ms=[...new Set(D.karya.map(k=>k.mapel))],dft=[...new Set(ms.concat(['Canva Certified','Pythagoras Interaktif','Pecahan Visual','Pseudocode','LKPD']))],cl=String(g.chip_keahlian||'').split(',').map(x=>x.trim()).filter(Boolean),ch=(cl.length?cl:dft).map(x=>`<span>${esc(x)}</span>`).join('');$('#chips').innerHTML=`<div>${ch+ch}</div>`;
 const lb=String(g.label_hero||'').split('|').map(x=>x.trim());['f1','f2','f3'].forEach((c,i)=>{if(lb[i])$('.'+c).textContent=lb[i]});if(g.footer_teks)$('#ft').textContent=g.footer_teks;if(g.hashtag)$('#ht').textContent=g.hashtag;
 const kw=D.karya.filter(k=>k.jenis=='website').length;
 $('#stats').innerHTML=[[p.tahun+'+','Tahun Pengalaman Mengajar'],[D.karya.length+'+','Karya Edukatif'],[kw+'','Web Interaktif Aktif']].map(s=>`<div class="card stat rv"><b>${esc(s[0])}</b>${esc(s[1])}</div>`).join('');
 const yr=x=>/sekarang/i.test(x)?9999:Math.max(0,...(String(x).match(/\d{4}/g)||[]).map(Number)),R=j=>D.riwayat.filter(r=>r.jenis==j).sort((a,b)=>j=='kompetensi'?a.urutan-b.urutan:yr(b.periode)-yr(a.periode)||a.urutan-b.urutan);
 const tl=(j,t,ic,c)=>{const L=R(j);return`<div class="rv"><div class="th"><span class="ic ${c}">${ic}</span><h3>${t}</h3><small>${L.length}</small></div><div class="tl ${c}">`+L.map(r=>`<div class="ti"><span class="dot"></span><div class="card"><span class="per">${esc(r.periode)}</span><h4>${esc(r.judul)}</h4><p class="ins">${esc(r.instansi)}</p>${r.desk?`<p class="ds">${esc(r.desk)}</p>`:''}</div></div>`).join('')+'</div></div>'};
 $('#riwayat').innerHTML=`<div class="tgrid">${tl('pendidikan','Pendidikan','🎓','p')}${tl('pengalaman','Pengalaman & Organisasi','💼','o')}</div><div class="rv"><div class="th" style="margin-top:56px"><span class="ic b">🧠</span><h3>Kompetensi</h3></div><div class="skills">`+R('kompetensi').map(r=>{const v=Math.min(100,+r.instansi||+r.periode||85);return`<div class="card sk"><div class="ring" style="--v:${v}"><b>${v}%</b></div><h4>${esc(r.judul)}</h4><p class="ds">${esc(r.desk)}</p></div>`}).join('')+'</div></div>';
 $('#kin').innerHTML=`📧 ${esc(p.email)}<br>📍 ${esc(g.lokasi||'Tanjungpinang, Kepulauan Riau')}`;filters();cards();counts();reveal()}
function filters(){const ms=['Semua',...new Set(D.karya.filter(k=>k.jenis==J).map(k=>k.mapel))];$('#mapel').innerHTML=ms.map(m=>`<button class="${m==M?'on':''}">${esc(m)}</button>`).join('')}
function cards(){const L=D.karya.filter(k=>k.tampil!==false&&k.jenis==J&&(M=='Semua'||k.mapel==M)).sort((a,b)=>a.urutan-b.urutan);
 const B0=k=>{try{const a=JSON.parse(k.berkas||'[]');return Array.isArray(a)?a.filter(f=>safe(f.u)):[]}catch(e){return[]}};
 $('#cards').innerHTML=L.map(k=>{const B=B0(k),w=k.jenis=='website'&&safe(k.tautan),u=!B.length&&safe(k.unduh);return`<article class="card pc rv" data-id="${esc(k.id)}"><div class="sl"></div><div class="pb"><span class="tag">${esc(k.mapel)}</span><h3>${esc(k.judul)}</h3><p>${esc(k.desk)}</p><div class="acts">`+
  (w?`<a class="btn pri shine" data-t="${esc(k.id)}" target="_blank" rel="noopener" href="${esc(k.tautan)}">Buka Website <i class="ar">→</i></a>`:'')+
  (B.length>1?`<button class="btn cta shine" data-b="${esc(k.id)}">⬇ Unduh Materi (${B.length})</button>`:B.length?`<a class="btn cta shine" data-u="${esc(k.id)}" target="_blank" rel="noopener" href="${esc(B[0].u)}">⬇ Unduh ${esc(extOf(B[0].n))}</a>`:u?`<a class="btn cta shine" data-u="${esc(k.id)}" target="_blank" rel="noopener" href="${esc(k.unduh)}">⬇ Unduh</a>`:'')+
  (!w&&!B.length&&!u?'<small>Segera tersedia</small>':'')+'</div></div></article>'}).join('')||'<p>Belum ada karya.</p>';
 L.forEach(k=>slideshow($('[data-id="'+k.id+'"] .sl'),cover(k),3000+Math.random()*1500));reveal()}
document.addEventListener('click',e=>{if(e.target.closest('#upb')){scrollTo({top:0,behavior:'smooth'});return}const b=e.target.closest('button'),a=e.target.closest('a');if(b&&b.dataset.b){openFiles(b.dataset.b);return}
 if(b&&b.parentNode.id=='tabs'){J=b.dataset.j;M='Semua';document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x==b));filters();cards()}
 else if(b&&b.parentNode.id=='mapel'){M=b.textContent;filters();cards()}
 if(a&&(a.id=='wa'||a.id=='hire'||/^mailto:/.test(a.getAttribute('href')||'')))track('klik_kontak',a.id||'email');if(a&&a.dataset.t)track('klik_karya',a.dataset.t);if(a&&a.dataset.u)track('unduh_file',a.dataset.u);document.body.classList.remove('menu')});
function reveal(){const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target),setTimeout(()=>x.target.style.transitionDelay='',1200))),{threshold:.1});document.querySelectorAll('.rv:not(.in)').forEach((x,i)=>{x.style.transitionDelay=(i%6)*70+'ms';io.observe(x)})}
// ---- formulir kontak
$('#frm').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,s=$('#fs'),b=f.querySelector('button'),d=Object.fromEntries(new FormData(f));
 if(d.web)return;if(!d.nama.trim()||!d.pesan.trim()||!/^\S+@\S+\.\S+$/.test(d.email)){s.textContent='Mohon lengkapi nama, email valid, dan pesan.';return}
 if(!OK){s.textContent='Backend belum terhubung (isi js/config.js).';return}
 b.disabled=true;b.textContent='Mengirim...';try{const r=await api('kirimPesan',d);s.textContent=r.message||(r.success?'Terkirim!':'Gagal.');if(r.success)f.reset()}catch(x){s.textContent='Gagal mengirim, coba lagi.'}b.disabled=false;b.textContent='Kirim Pesan Sekarang'});
// ---- kursor "+" dengan partikel & jejak
function fx(){if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 document.body.classList.add('fx');const c=$('#fx'),x=c.getContext('2d'),cur=$('#cur');let W,H,mx=-99,my=-99,px=-99,py=-99,P=[],T=[];
 const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener('resize',rs);
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx}px,${my}px)`;const d=Math.hypot(mx-px,my-py);for(let i=0;i<Math.min(3,1+d/12);i++)P.push({x:mx,y:my,vx:(Math.random()-.5)*2.5,vy:(Math.random()-.5)*2.5-.4,l:1,h:[262,24,203][Math.random()*3|0],s:Math.random()*3+1});T.push({x:mx,y:my,l:1});px=mx;py=my});
 addEventListener('mousedown',()=>{for(let i=0;i<24;i++){const a=Math.PI*2*i/24;P.push({x:mx,y:my,vx:Math.cos(a)*4,vy:Math.sin(a)*4,l:1,h:24,s:3})}cur.style.fontSize='34px'});addEventListener('mouseup',()=>cur.style.fontSize='26px');
 (function loop(){x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
  x.lineCap='round';for(let i=1;i<T.length;i++){const a=T[i-1],b=T[i];x.strokeStyle=`hsla(262,90%,65%,${b.l*.5})`;x.lineWidth=b.l*5;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}T.forEach(t=>t.l-=.06);T=T.filter(t=>t.l>0);
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.l-=.022;x.fillStyle=`hsla(${p.h},95%,62%,${Math.max(p.l,0)})`;x.beginPath();x.arc(p.x,p.y,Math.max(p.s*p.l,0.1),0,7);x.fill()});P=P.filter(p=>p.l>0);requestAnimationFrame(loop)})()}
const th=$('#th'),dk=()=>document.documentElement.dataset.theme=='dark';th.textContent=dk()?'☀️':'🌙';th.onclick=()=>{const d=dk()?'light':'dark';document.documentElement.dataset.theme=d;try{localStorage.setItem('zs_th',d)}catch(e){}th.textContent=dk()?'☀️':'🌙'};
// ---- efek dinamis & materi
let SPV=0;const NV=[...document.querySelectorAll('.nav nav a')],SE=NV.map(a=>document.querySelector(a.getAttribute('href')));
addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;SPV=h>0?y/h:0;$('#sp').style.width=SPV*100+'%';$('#upb').classList.toggle('show',y>600);$('.nav').classList.toggle('sc',y>40);let c=0;SE.forEach((s,i)=>{if(s&&!s.hidden&&s.offsetTop-160<=y)c=i});NV.forEach((a,i)=>a.classList.toggle('on',i==c))},{passive:true});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.pc,.sk,.stat');if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--gx',(e.clientX-r.left)+'px');c.style.setProperty('--gy',(e.clientY-r.top)+'px');c.style.setProperty('--ry',(x*8)+'deg');c.style.setProperty('--rx',(-y*8)+'deg')});
 document.addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.pc,.sk,.stat');if(c){c.style.removeProperty('--rx');c.style.removeProperty('--ry')}})}
const TY={t:0,i:0,d:0,r:['Guru Matematika']};function typer(){const el=$('#typed');if(!el)return;const w=TY.r[TY.i%TY.r.length];TY.d?TY.t--:TY.t++;el.textContent=w.slice(0,TY.t);let ms=TY.d?35:70;if(!TY.d&&TY.t>=w.length){TY.d=1;ms=1600}else if(TY.d&&TY.t<=0){TY.d=0;TY.i++;ms=300}setTimeout(typer,ms)}
function counts(){document.querySelectorAll('.stat b').forEach(b=>{const n=parseInt(b.textContent),sf=b.textContent.replace(/[\d,.]/g,'');if(isNaN(n))return;const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();const t0=performance.now();(function s(t){const p=Math.min(1,(t-t0)/1200);b.textContent=Math.round(n*(1-Math.pow(1-p,3)))+sf;p<1&&requestAnimationFrame(s)})(t0)});io.observe(b)})}
const EXT={pdf:['PDF','#E5484D'],doc:['DOC','#2B6CD9'],docx:['DOC','#2B6CD9'],ppt:['PPT','#E8691A'],pptx:['PPT','#E8691A'],xls:['XLS','#1E9E5A'],xlsx:['XLS','#1E9E5A'],csv:['CSV','#1E9E5A'],zip:['ZIP','#6B6A80'],rar:['ZIP','#6B6A80'],mp4:['MP4','#B03FD4'],mov:['MP4','#B03FD4'],ggb:['GGB','#3BA7F0'],sb3:['SB3','#FF9F1C'],py:['PY','#3572A5']};
const fmt=b=>{b=+b;return !b?'':b<1e6?Math.max(1,Math.round(b/1e3))+' KB':b<1e9?(b/1e6).toFixed(1)+' MB':(b/1e9).toFixed(2)+' GB'};
const extOf=n=>(String(n||'').split('.').pop()||'FILE').toUpperCase().slice(0,4);
function openFiles(id){const k=D.karya.find(x=>x.id==id);if(!k)return;let B=[];try{B=JSON.parse(k.berkas||'[]').filter(f=>safe(f.u))}catch(e){}const m=document.createElement('div');m.className='mdl';
 m.innerHTML=`<div class="mbox"><button class="mx" aria-label="Tutup">✕</button><h3>${esc(k.judul)}</h3><p>${B.length} berkas materi</p>`+B.map(f=>{const e=(String(f.n).split('.').pop()||'').toLowerCase(),x=EXT[e]||[extOf(f.n),'#7C5CF0'];return`<div class="fr"><div class="fi" style="--c:${x[1]}">${esc(x[0])}</div><div><b>${esc(f.n)}</b><small>${fmt(f.s)}</small></div><a class="btn cta shine" data-u="${esc(k.id)}" target="_blank" rel="noopener" href="${esc(f.u)}">Unduh</a></div>`}).join('')+'</div>';
 document.body.appendChild(m);requestAnimationFrame(()=>m.classList.add('in'));const cl=()=>{m.classList.remove('in');setTimeout(()=>m.remove(),250);removeEventListener('keydown',kd)},kd=e=>{if(e.key=='Escape')cl()};m.onclick=e=>{if(e.target==m||e.target.closest('.mx'))cl()};addEventListener('keydown',kd)}
// ripple & magnetic pada tombol
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement('span');s.className='rp';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('.btn.cta,.btn.pri');if(!b)return;const r=b.getBoundingClientRect();b.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*.18)+'px');b.style.setProperty('--my',((e.clientY-r.top-r.height/2)*.28)+'px')});document.addEventListener('pointerout',e=>{const b=e.target.closest&&e.target.closest('.btn');if(b){b.style.removeProperty('--mx');b.style.removeProperty('--my')}})}
// favicon interaktif: berdenyut, cincin progres scroll, berubah saat tab ditinggalkan
(function(){const L=document.querySelector('link[rel=icon][data-dyn]');if(!L)return;document.querySelectorAll('link[rel=icon]:not([data-dyn])').forEach(n=>n.remove());const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');let f=0,hid=false,TT=document.title;
 function draw(){x.clearRect(0,0,64,64);const t=f/20*Math.PI*2,r=25+Math.sin(t)*2.2,g=x.createLinearGradient(6,6,58,58);g.addColorStop(0,hid?'#FF7A29':'#7C5CF0');g.addColorStop(1,hid?'#FDCB58':'#3BA7F0');x.fillStyle=g;x.beginPath();x.arc(32,32,r,0,7);x.fill();
  x.fillStyle='#fff';x.font='800 34px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(hid?'!':'Z',32,35);
  if(SPV>.01&&!hid){x.strokeStyle='#FDCB58';x.lineWidth=6;x.lineCap='round';x.beginPath();x.arc(32,32,29,-Math.PI/2,-Math.PI/2+SPV*Math.PI*2);x.stroke()}
  L.href=c.toDataURL('image/png')}
 setInterval(()=>{f=(f+1)%20;draw()},350);draw();
 document.addEventListener('visibilitychange',()=>{hid=document.hidden;if(hid){TT=document.title;document.title='Yuk lanjut belajar ✨ | ZulfaSpace'}else document.title=TT;draw()})})();
// ---- init: tampil langsung dari data bawaan, lalu segarkan dari GAS
let cd=null;try{cd=JSON.parse(localStorage.getItem('zs_d'))}catch(e){}if(cd&&cd.karya&&cd.karya.length)D=cd;
render();fx();track('kunjungan','beranda');
if(OK){const done=()=>document.body.classList.remove('skel');if(!cd)document.body.classList.add('skel');setTimeout(done,7000);
 fetch(GAS+'?action=getPublic').then(r=>r.json()).then(r=>{if(r.success&&r.data&&r.data.karya&&r.data.karya.length){D=r.data;try{localStorage.setItem('zs_d',JSON.stringify(D))}catch(e){}render()}done()}).catch(done)}
})();
