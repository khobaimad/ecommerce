const $=s=>document.querySelector(s),fmt=n=>n+'\u00a0DH',FREE=300,SHIP=35;
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const P=[
{id:1,img:'miel-thym',top:0.092,n:'Miel de thym',s:'Thym',w:'500 g',p:120,c:'miel',col:'#E59A00',t:'Récolte 2026',d:'Ambré et aromatique, avec une pointe poivrée.'},
{id:2,img:'miel-oranger',top:0.113,n:'Miel d’oranger',s:'Oranger',w:'500 g',p:95,c:'miel',col:'#F2B93B',t:'',d:'Clair et floral, parfait dans un thé à la menthe.'},
{id:3,img:'miel-euphorbe',top:0.211,n:'Miel d’euphorbe',s:'Euphorbe',w:'500 g',p:190,c:'miel',col:'#B86100',t:'Rare',d:'Sombre et puissant, récolté dans le Souss.'},
{id:4,img:'miel-jujubier',top:0.106,n:'Miel de jujubier',s:'Sidr',w:'500 g',p:260,c:'miel',col:'#8A4A00',t:'Édition limitée',d:'Dense et boisé, à déguster à la cuillère.'},
{id:5,img:'amlou',top:0.058,n:'Amlou amande-argan',s:'Amlou',w:'500 g',p:85,c:'gourmand',col:'#A8691F',t:'',d:'La pâte à tartiner marocaine : amandes, argan, miel.'},
{id:6,img:'huile-argan',top:0.108,n:'Huile d’argan alimentaire',s:'Argan',w:'250 ml',p:140,c:'gourmand',col:'#C98A1B',t:'',d:'Pressée à froid, avec un goût de noisette grillée.'},
{id:7,img:'pollen',top:0.092,n:'Pollen de fleurs',s:'Pollen',w:'500 g',p:75,c:'ruche',col:'#F2A900',t:'',d:'Des granules à saupoudrer sur un yaourt ou un porridge.'},
{id:8,img:'gelee-royale',top:0.358,n:'Gelée royale',s:'Gelée',w:'50 g',p:220,c:'ruche',col:'#F6DC8A',t:'Cure de 10 jours',d:'Fraîche, à conserver au réfrigérateur.'}];

const pic=(x,alt,lazy)=>`<img src="images/${x.img}.webp" alt="${alt}" width="560" height="640" data-top="${x.top}"${lazy?' loading="lazy"':''} decoding="async">`;
const jar=(c,s)=>`<svg viewBox="0 0 120 150" aria-hidden="true"><rect x="28" y="6" width="64" height="24" rx="6" fill="#4D2A00"/><path d="M22 46q0-14 14-14h48q14 0 14 14v82q0 14-14 14H36q-14 0-14-14z" fill="${c}"/><path d="M22 46q0-14 14-14h48q14 0 14 14v8H22z" fill="#000" opacity=".12"/><rect x="34" y="72" width="52" height="40" rx="7" fill="#F9E6A8"/><text x="60" y="96" text-anchor="middle" font-family="Young Serif,Georgia,serif" font-size="${s.length>6?9.5:11}" fill="#4D2A00">${s}</text><path d="M31 62v62" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/></svg>`;

/* hero: honey drips on load */
const H=[60,100,75,130,65,110,85,125,70,105,80,120,60,95];
$('#honey').innerHTML=H.map((h,i)=>`<i class="drip" style="--x:${((i+.5)*100/H.length).toFixed(1)}%;--w:${12+(i*5)%9}px;--h:${h}px;--d:${(.2+(i*5%14)*.11).toFixed(2)}s"></i>`).join('');
$('#heroArt').innerHTML=jar('#F2A900','Nahla');

/* state */
let cat='tous',cart={},done=null;
try{cart=JSON.parse(localStorage.getItem('nahla-cart')||'{}')||{}}catch(e){cart={}}
const save=()=>{try{localStorage.setItem('nahla-cart',JSON.stringify(cart))}catch(e){}};
const items=()=>Object.keys(cart).map(id=>({...P.find(x=>x.id==id),q:cart[id]})).filter(x=>x.id);

function grid(){
  $('#grid').innerHTML=P.filter(x=>cat==='tous'||x.c===cat).map((x,i)=>`<article class="card" style="--i:${i}"><div class="art">${x.t?`<span class="tag">${x.t}</span>`:''}${pic(x,x.n,1)}</div><div class="info"><h3>${x.n}</h3><p>${x.d}</p><div class="buy"><span class="price">${fmt(x.p)}<small>${x.w}</small></span><button class="btn" data-add="${x.id}" aria-label="Ajouter ${x.n} au panier">Ajouter</button></div></div></article>`).join('');
}

function renderCart(){
  const it=items(),n=it.reduce((a,x)=>a+x.q,0),sub=it.reduce((a,x)=>a+x.q*x.p,0),ship=!sub||sub>=FREE?0:SHIP;
  $('#cnt').textContent=n;
  if(done){
    $('#lines').innerHTML=`<div class="empty"><h3>Merci, commande reçue</h3><p>Commande ${done}. Nous vous appelons pour confirmer la livraison.</p><button class="btn" data-close>Retour à la boutique</button></div>`;
    $('#sum').hidden=true;$('#ship').hidden=true;return;
  }
  $('#sum').hidden=!it.length;$('#ship').hidden=false;
  $('#shipTxt').textContent=sub>=FREE?'La livraison est offerte.':`Plus que ${fmt(FREE-sub)} pour la livraison offerte.`;
  $('#bar').style.width=Math.min(100,sub*100/FREE)+'%';
  $('#lines').innerHTML=it.length?it.map(x=>`<div class="ln">${pic(x,'')}<div><b>${x.n}</b><small>${x.w}</small><div class="qty"><button data-m="${x.id}" aria-label="Retirer un">−</button><span>${x.q}</span><button data-p="${x.id}" aria-label="Ajouter un">+</button></div></div><div style="text-align:right"><b>${fmt(x.p*x.q)}</b><button class="rm" data-rm="${x.id}">Retirer</button></div></div>`).join(''):`<div class="empty"><h3>Votre panier est vide</h3><p>Le miel de thym est un bon début.</p><button class="btn" data-close>Voir la boutique</button></div>`;
  $('#sub').textContent=fmt(sub);$('#shp').textContent=ship?fmt(ship):'Offerte';$('#tot').textContent=fmt(sub+ship);
}
const upd=()=>{save();renderCart()};

function bump(){const c=$('#cnt');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}
function fly(el){
  if(RM||!el)return;
  const r=el.getBoundingClientRect(),c=$('#open').getBoundingClientRect(),g=el.cloneNode(true);
  Object.assign(g.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:'auto',zIndex:45,pointerEvents:'none',transform:'none'});
  document.body.appendChild(g);
  g.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${c.left-r.left}px,${c.top-r.top}px) scale(.15)`,opacity:.35}],{duration:700,easing:'cubic-bezier(.5,0,.8,.4)'}).onfinish=()=>g.remove();
}
function add(id,b){
  cart[id]=(cart[id]||0)+1;upd();fly(b.closest('.card').querySelector('.art img'));bump();
  b.textContent='Ajouté ✓';setTimeout(()=>b.textContent='Ajouter',1300);
}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),3200)}
function toggle(o){
  document.body.classList.toggle('open',o);$('#drawer').inert=!o;
  if(o)$('#x').focus();else{$('#open').focus();if(done)setTimeout(()=>{done=null;renderCart()},450)}
}

document.addEventListener('click',e=>{
  const b=e.target.closest('button,#scrim');if(!b)return;const d=b.dataset;
  if(d.add)add(+d.add,b);
  else if(d.p){cart[d.p]++;upd()}
  else if(d.m){if(--cart[d.m]<1)delete cart[d.m];upd()}
  else if(d.rm){delete cart[d.rm];upd()}
  else if(d.cat){cat=d.cat;document.querySelectorAll('.chip').forEach(c=>{c.classList.toggle('on',c===b);c.setAttribute('aria-pressed',c===b)});grid()}
  else if('close' in d||b.id==='scrim'||b.id==='x'){toggle(false);if(d.close!==undefined)location.hash='#boutique'}
  else if(b.id==='open')toggle(true);
  else if(b.id==='buy'){done='NH-'+Math.floor(10000+Math.random()*90000);cart={};save();renderCart()}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('open'))toggle(false)});
$('#nl').addEventListener('submit',e=>{e.preventDefault();e.target.reset();toast('Merci, vous recevrez la prochaine récolte en premier.')});

$('#drawer').inert=true;grid();renderCart();

/* abeille : suit la souris, et s’arrête au-dessus du produit survolé */
(()=>{
  if(RM||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const bee=document.createElement('div');
  bee.className='bee';bee.setAttribute('aria-hidden','true');
  bee.innerHTML=`<svg viewBox="0 0 40 32"><defs><clipPath id="bc"><ellipse cx="18" cy="19" rx="11" ry="8"/></clipPath></defs>
<g class="wing"><ellipse cx="15" cy="9" rx="6" ry="5" fill="#F9E6A8" fill-opacity=".9" stroke="#4D2A00" stroke-opacity=".35"/></g>
<g class="wing" style="animation-delay:-.07s"><ellipse cx="23" cy="9.5" rx="6" ry="4.5" fill="#F9E6A8" fill-opacity=".9" stroke="#4D2A00" stroke-opacity=".35"/></g>
<path d="M8 19l-5 1.2l5 1.2z" fill="#4D2A00"/>
<ellipse cx="18" cy="19" rx="11" ry="8" fill="#F2A900"/>
<g clip-path="url(#bc)"><path d="M14 9v20M21 9v20" stroke="#4D2A00" stroke-width="4"/></g>
<circle cx="30.5" cy="18" r="5.5" fill="#4D2A00"/>
<circle cx="32.5" cy="16.3" r="1.3" fill="#F9E6A8"/>
<path d="M32 13q1.5-5 5-5" stroke="#4D2A00" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`;
  document.body.appendChild(bee);
  const sv=bee.firstChild;
  let mx=innerWidth/2,my=innerHeight/2,x=mx,y=my,seen=false,face=1,tilt=0;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(!seen){seen=true;x=mx;y=my}bee.classList.add('on')});
  document.documentElement.addEventListener('mouseleave',()=>bee.classList.remove('on'));
  const loop=t=>{
    const under=seen&&!document.body.classList.contains('open')?document.elementFromPoint(mx,my):null;
    const card=under?under.closest('.card'):null,step=!card&&under?under.closest('.steps li'):null;
    let tx,ty;
    if(card){ /* posée en vol stationnaire au-dessus du pot */
      const im=card.querySelector('.art img'),r=im.getBoundingClientRect();
      tx=r.left+r.width/2;ty=r.top+r.height*(+im.dataset.top||0)-14+Math.sin(t/260)*5;
    }else if(step){ /* se pose sur l’illustration de l’étape */
      const r=(step.querySelector('.anim')||step).getBoundingClientRect();
      tx=r.left+r.width*.5;ty=r.top+r.height*.05-10+Math.sin(t/500)*1.5;
    }else{ /* suit la souris en zigzaguant un peu */
      tx=mx-36+Math.cos(t/190)*7;ty=my-30+Math.sin(t/140)*7;
    }
    const vx=(tx-x)*.12;x+=vx;y+=(ty-y)*.12;
    if(Math.abs(vx)>.6)face=vx>0?1:-1;
    bee.classList.toggle('land',!!step);
    tilt+=((card||step?0:Math.max(-22,Math.min(22,vx*1.6)))-tilt)*.15;
    sv.style.transform=`scaleX(${face})`;
    bee.style.transform=`translate(${x-19}px,${y-16}px) rotate(${tilt}deg)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

/* curseur : louche à miel qui goutte */
(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const cur=document.createElement('div');
  cur.className='cur';cur.setAttribute('aria-hidden','true');
  cur.innerHTML=`<svg viewBox="0 0 96 96"><defs>
<linearGradient id="hw" x1="0" x2="1"><stop offset="0" stop-color="#E9B56A"/><stop offset="1" stop-color="#B8742A"/></linearGradient>
<linearGradient id="hh" x1="0" x2="1"><stop offset="0" stop-color="#F9E6A8"/><stop offset=".4" stop-color="#F2A900"/><stop offset="1" stop-color="#CC6F00"/></linearGradient></defs>
<g transform="translate(50 34) rotate(35)">
<rect x="-2.6" y="-40" width="5.2" height="76" rx="2.6" fill="url(#hw)"/>
<rect x="-10" y="30" width="20" height="30" rx="9" fill="url(#hh)"/>
<path d="M-9 38h18M-10 44h20M-10 50h20M-8.5 56h17" stroke="#CC6F00" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>
<path d="M-6 36v18" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>
<path class="hang" d="M-4 58q0 9 4 12q4-3 4-12z" fill="url(#hh)"/></g></svg>`;
  document.body.appendChild(cur);
  document.documentElement.classList.add('dip');
  let mx=0,my=0;
  addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cur.style.transform=`translate(${mx-16}px,${my-83}px)`;
    cur.classList.add('on');
    cur.classList.toggle('off',!!e.target.closest('input,textarea'));
    cur.classList.toggle('hot',!!e.target.closest('a,button,.chip'));
  },{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>cur.classList.remove('on'));
  if(RM)return;
  const drop=()=>{ /* une goutte se détache du miel au bout de la louche */
    if(!cur.classList.contains('on')||cur.classList.contains('off')||document.hidden)return;
    const d=document.createElement('i');d.className='dr';
    d.style.left=(mx-9.8)+'px';d.style.top=(my+3.5)+'px';
    document.body.appendChild(d);
    const dy=Math.max(40,Math.min(240,innerHeight-my-10));
    d.animate([
      {transform:'translateY(0) rotate(45deg) scale(.6)',opacity:1},
      {transform:`translateY(${dy*.15}px) rotate(45deg) scale(1)`,opacity:1,offset:.12},
      {transform:`translateY(${dy}px) rotate(45deg) scale(.9)`,opacity:0}
    ],{duration:900,easing:'cubic-bezier(.5,0,1,.7)'}).onfinish=()=>d.remove();
  };
  setTimeout(()=>{drop();setInterval(drop,2400)},2040);
})();

/* étapes : une petite animation qui illustre chaque étape */
(()=>{
  const hx=(cx,cy,r)=>`M${cx} ${cy-r}l${(r*.866).toFixed(2)} ${r/2}v${r}l${(-r*.866).toFixed(2)} ${r/2}l${(-r*.866).toFixed(2)} ${-r/2}v${-r}z`;
  const cells=[[40.5,29],[52.6,29],[64.7,29],[46.6,39.5],[58.7,39.5],[40.5,50],[52.6,50],[64.7,50]].map(([x,y])=>hx(x,y,7)).join('');
  const jarP='M22 52q0-10 10-10h40q10 0 10 10v44q0 10-10 10H32q-10 0-10-10z';
  const A=[
    /* 1 · Récolte : un cadre de miel sort de la ruche */
    `<svg class="anim" viewBox="0 0 104 120" aria-hidden="true">
<g class="il-fr"><rect x="34" y="19" width="37" height="43" fill="#F2A900"/><path d="${cells}" fill="none" stroke="#CC6F00" stroke-width="1.2"/><rect class="il-o" x="34" y="19" width="37" height="43" fill="none"/><rect class="il-o" x="25" y="13" width="55" height="6" rx="2" fill="#CC6F00"/></g>
<rect class="il-bg" x="14" y="62" width="76" height="46" rx="4"/>
<rect class="il-o" x="14" y="62" width="76" height="46" rx="4" fill="rgba(242,169,0,.18)"/>
<path class="il-o" d="M14 85h76" fill="none"/></svg>`,
    /* 2 · Extraction à froid : l’extracteur tourne, le miel est projeté */
    `<svg class="anim" viewBox="0 0 104 120" aria-hidden="true">
<circle class="il-bg" cx="52" cy="64" r="36"/>
<circle class="il-o" cx="52" cy="64" r="36" fill="rgba(242,169,0,.18)"/>
<circle cx="52" cy="64" r="29" fill="rgba(242,169,0,.25)"/>
<g class="il-spin"><rect x="23" y="60.5" width="58" height="7" rx="3.5" fill="#CC6F00"/><rect x="48.5" y="35" width="7" height="58" rx="3.5" fill="#CC6F00"/><rect x="23" y="57" width="10" height="14" rx="2" fill="#F2A900"/><rect x="71" y="57" width="10" height="14" rx="2" fill="#F2A900"/><rect x="45" y="35" width="14" height="10" rx="2" fill="#F2A900"/><rect x="45" y="83" width="14" height="10" rx="2" fill="#F2A900"/></g>
${[20,80,140,200,260,320].map((a,k)=>`<circle class="il-dp" cx="52" cy="64" r="2.8" fill="#F2A900" style="--a:${a}deg;--dl:${(-k*.3).toFixed(1)}s"/>`).join('')}
<circle cx="52" cy="64" r="5" style="fill:var(--bandink)"/>
<path class="il-snow" d="M90 7V25M82.2 11.5L97.8 20.5M82.2 20.5L97.8 11.5" fill="none" stroke-width="2" stroke-linecap="round" style="stroke:var(--bandink)"/></svg>`,
    /* 3 · Mise en pot : le pot se remplit, reçoit son couvercle puis son étiquette */
    `<svg class="anim" viewBox="0 0 104 120" aria-hidden="true"><defs><clipPath id="ij"><path d="${jarP}"/></clipPath></defs>
<g class="il-jg">
<path d="M44 0h16l-4 9h-8z" fill="#CC6F00"/>
<path d="${jarP}" fill="rgba(242,169,0,.15)"/>
<rect class="il-stm" x="49" y="9" width="6" height="97" rx="3" fill="#F2A900"/>
<g clip-path="url(#ij)"><rect class="il-hl" x="20" y="50" width="64" height="58" fill="#F2A900"/></g>
<path class="il-o" d="${jarP}" fill="none"/>
<g class="il-lid"><rect x="25" y="28" width="54" height="14" rx="4" fill="#CC6F00"/><rect class="il-o" x="25" y="28" width="54" height="14" rx="4" fill="none"/></g>
<g class="il-lbl"><rect x="32" y="64" width="40" height="26" rx="5" fill="#F9E6A8" stroke="#CC6F00" stroke-width="1.5"/><path d="M40 74h24M43 81h18" stroke="#4D2A00" stroke-width="2" stroke-linecap="round"/></g></g></svg>`
  ];
  document.querySelectorAll('.steps li').forEach((li,i)=>{
    li.insertAdjacentHTML('afterbegin',A[i]||'');
    li.style.setProperty('--sd',`${-i*.9}s`);
  });
})();
