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
function cover(k){const u=String(k.sampul||'').split('|').map(safe).filter(Boolean);if(u.length)return u;const s=SYM[k.mapel]||['★','✦','◆'];
 return PAL.map((p,i)=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p[(i)%2]}"/><stop offset="1" stop-color="${p[(i+1)%2]}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="${60+i*90}" cy="40" r="70" fill="#fff" opacity=".12"/><text x="160" y="125" font-size="90" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="800">${esc(s[i])}</text></svg>`))}
// ---- render
function render(){const p=D.profil,g=D.pengaturan||{};
 if(g.judul_situs)document.title=g.judul_situs;if(/^#[0-9a-f]{6}$/i.test(g.warna_aksen||''))document.documentElement.style.setProperty('--p',g.warna_aksen);
 if(g.deskripsi_meta){const m=document.querySelector('meta[name=description]');m&&m.setAttribute('content',g.deskripsi_meta)}
 if(g.mode==='maintenance'&&!$('#mt'))document.body.insertAdjacentHTML('beforeend','<div id="mt" style="position:fixed;inset:0;z-index:99999;background:#F4F1FF;display:grid;place-items:center;text-align:center;padding:24px"><div><h1>ZulfaSpace sedang diperbarui</h1><p class="hand">Segera kembali ✨</p></div></div>');else if(g.mode!=='maintenance'&&$('#mt'))$('#mt').remove();
 $('#nm').textContent=p.nama.split(' ')[0];$('#jab').textContent=p.jabatan.toUpperCase();$('#hl').textContent=p.headline+' ✨';$('#rg').textContent=p.ringkasan;
 $('#thn').textContent='⭐ '+p.tahun+'+ Tahun Pengalaman';$('#wa').href='https://wa.me/'+p.wa+'?text='+encodeURIComponent('Halo Bu Zulfa, saya melihat portofolio ZulfaSpace.');
 const fh=String(p.foto||'').split('|').map(s=>s.trim()).filter(safe);slideshow($('#heroSl'),fh.length?fh:['img/profil-1.jpg','img/profil-2.jpg'],4000);
 $('#soc').innerHTML=[['ig','📷'],['tiktok','🎵'],['github','⌨️'],['linkedin','💼']].filter(x=>safe(p[x[0]])).map(x=>`<a href="${esc(p[x[0]])}" target="_blank" rel="noopener" aria-label="${x[0]}">${x[1]}</a>`).join('')+`<a href="mailto:${esc(p.email)}" aria-label="Email">✉️</a>`;
 const ms=[...new Set(D.karya.map(k=>k.mapel))],ch=ms.concat(['Canva Certified','Pythagoras Interaktif','Pecahan Visual','Pseudocode','LKPD']).map(x=>`<span>${esc(x)}</span>`).join('');$('#chips').innerHTML=`<div>${ch+ch}</div>`;
 const kw=D.karya.filter(k=>k.jenis=='website').length;
 $('#stats').innerHTML=[[p.tahun+'+','Tahun Pengalaman Mengajar'],[D.karya.length+'+','Karya Edukatif'],[kw+'','Web Interaktif Aktif']].map(s=>`<div class="card stat rv"><b>${esc(s[0])}</b>${esc(s[1])}</div>`).join('');
 const R=j=>D.riwayat.filter(r=>r.jenis==j).sort((a,b)=>a.urutan-b.urutan);
 $('#riwayat').innerHTML=[['pendidikan','🎓 Pendidikan'],['pengalaman','💼 Pengalaman'],['kompetensi','🧠 Kompetensi']].map(([j,t])=>`<div class="rv"><h3>${t}</h3>`+R(j).map(r=>j=='kompetensi'?`<div class="card"><b>${esc(r.judul)}</b><div class="bar"><i style="width:${+r.instansi||+r.periode||85}%"></i></div><small>${esc(r.desk)}</small></div>`:`<div class="card"><small>${esc(r.periode)}</small><h3 style="font-size:17px">${esc(r.judul)}</h3>${esc(r.instansi)}<br><small style="color:var(--mut);font-weight:400">${esc(r.desk)}</small></div>`).join('')+'</div>').join('');
 $('#kin').innerHTML=`📧 ${esc(p.email)}<br>📍 ${esc(g.lokasi||'Tanjungpinang, Kepulauan Riau')}`;filters();cards();reveal()}
function filters(){const ms=['Semua',...new Set(D.karya.filter(k=>k.jenis==J).map(k=>k.mapel))];$('#mapel').innerHTML=ms.map(m=>`<button class="${m==M?'on':''}">${esc(m)}</button>`).join('')}
function cards(){const L=D.karya.filter(k=>k.tampil!==false&&k.jenis==J&&(M=='Semua'||k.mapel==M)).sort((a,b)=>a.urutan-b.urutan);
 $('#cards').innerHTML=L.map(k=>{const w=k.jenis=='website';return`<article class="card pc rv" data-id="${esc(k.id)}"><div class="sl"></div><div class="pb"><span class="tag">${esc(k.mapel)}</span><h3>${esc(k.judul)}</h3><p>${esc(k.desk)}</p>`+
 (w?(safe(k.tautan)?`<a class="btn pri shine" data-t="${esc(k.id)}" target="_blank" rel="noopener" href="${esc(k.tautan)}">Buka Website</a>`:''):(safe(k.unduh)?`<a class="btn cta shine" data-u="${esc(k.id)}" target="_blank" rel="noopener" href="${esc(k.unduh)}">Unduh PDF</a>`:'<small>File segera tersedia</small>'))+'</div></article>'}).join('')||'<p>Belum ada karya.</p>';
 L.forEach(k=>slideshow($('[data-id="'+k.id+'"] .sl'),cover(k),3000+Math.random()*1500));reveal()}
document.addEventListener('click',e=>{const b=e.target.closest('button'),a=e.target.closest('a');
 if(b&&b.parentNode.id=='tabs'){J=b.dataset.j;M='Semua';document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x==b));filters();cards()}
 else if(b&&b.parentNode.id=='mapel'){M=b.textContent;filters();cards()}
 if(a&&(a.id=='wa'||a.id=='hire'||/^mailto:/.test(a.getAttribute('href')||'')))track('klik_kontak',a.id||'email');if(a&&a.dataset.t)track('klik_karya',a.dataset.t);if(a&&a.dataset.u)track('unduh_file',a.dataset.u);document.body.classList.remove('menu')});
function reveal(){const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.1});document.querySelectorAll('.rv:not(.in)').forEach(x=>io.observe(x))}
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
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.l-=.022;x.fillStyle=`hsla(${p.h},95%,62%,${Math.max(p.l,0)})`;x.beginPath();x.arc(p.x,p.y,p.s*p.l,0,7);x.fill()});P=P.filter(p=>p.l>0);requestAnimationFrame(loop)})()}
const th=$('#th'),dk=()=>document.documentElement.dataset.theme=='dark';th.textContent=dk()?'☀️':'🌙';th.onclick=()=>{const d=dk()?'light':'dark';document.documentElement.dataset.theme=d;try{localStorage.setItem('zs_th',d)}catch(e){}th.textContent=dk()?'☀️':'🌙'};
// ---- init: tampil langsung dari data bawaan, lalu segarkan dari GAS
render();fx();track('kunjungan','beranda');
if(OK)fetch(GAS+'?action=getPublic').then(r=>r.json()).then(r=>{if(r.success&&r.data&&r.data.karya&&r.data.karya.length){D=r.data;render()}}).catch(()=>{});
})();
