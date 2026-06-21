(function(){'use strict';
var dm=document.getElementById('dark-mode-toggle');
if(localStorage.getItem('mk-dark')==='true'){document.body.classList.add('dark');dm.textContent='☀️'}
dm.addEventListener('click',function(){
  var d=document.body.classList.toggle('dark');
  localStorage.setItem('mk-dark',d);
  this.textContent=d?'☀️':'🌙';
});
var st=document.getElementById('sidebar-toggle'),sb=document.getElementById('sidebar'),ov=document.getElementById('sidebar-overlay');
if(st){st.addEventListener('click',function(){sb.classList.toggle('open');ov.classList.toggle('open');})}
if(ov){ov.addEventListener('click',function(){sb.classList.remove('open');ov.classList.remove('open');})}
window.addEventListener('scroll',function(){
  var p=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  document.getElementById('reading-progress').style.width=(p>0?p:0)+'%';
});
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.markdown-body pre').forEach(function(pre){
    if(pre.querySelector('.copy-btn'))return;
    var b=document.createElement('button');b.className='copy-btn';b.textContent='copy';
    b.addEventListener('click',function(){
      var c=pre.querySelector('code'),t=c?c.textContent:pre.textContent;
      navigator.clipboard.writeText(t).then(function(){b.textContent='copied!';setTimeout(function(){b.textContent='copy';},2000);});
    });
    pre.appendChild(b);
  });
  document.querySelectorAll('.markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4,.markdown-body h5,.markdown-body h6').forEach(function(h){
    if(!h.id)return;
    var a=document.createElement('a');a.className='anchor-link';a.href='#'+h.id;a.textContent='#';
    h.appendChild(a);
  });
});
var tl=document.querySelectorAll('.toc-inner a');
if(tl.length>0){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){tl.forEach(function(l){l.classList.remove('active');});
        document.querySelector('.toc-inner a[href="#'+e.target.id+'"]')?.classList.add('active');}
    });
  },{rootMargin:'-80px 0px -70% 0px'});
  document.querySelectorAll('.markdown-body h1,.markdown-body h2,.markdown-body h3').forEach(function(h){if(h.id)obs.observe(h);});
}
var si=document.getElementById('search-input'),sr=document.getElementById('search-results'),idx=[],sel=-1;
var root=window.SITE_ROOT||'';
fetch(root+'search-index.json').then(function(r){return r.json();}).then(function(d){idx=d;}).catch(function(){});
function dos(q){
  if(!q||q.length<2){sr.classList.remove('show');sel=-1;return;}
  var Q=q.toLowerCase();
  var r=idx.filter(function(i){return i.title.toLowerCase().includes(Q)||i.content.toLowerCase().includes(Q);}).slice(0,10);
  if(!r.length){sr.classList.remove('show');sel=-1;return;}
  sr.innerHTML=r.map(function(i,index){
    var t=i.title.replace(new RegExp(Q.replace(/[.*+?^$()|[]\]/g,'\$&'),'gi'),function(m){return '<mark>'+m+'</mark>';});
    return '<div class="search-result-item" data-idx="'+index+'" data-url="'+i.url+'"><div class="sr-title">'+t+'</div></div>';
  }).join('');
  sr.classList.add('show');sel=-1;
}
si.addEventListener('input',function(){dos(this.value);});
si.addEventListener('keydown',function(e){
  var items=sr.querySelectorAll('.search-result-item');
  if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,items.length-1);updateSel(items);}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,-1);updateSel(items);}
  else if(e.key==='Enter'&&sel>=0&&items[sel]){window.location.href=items[sel].dataset.url;}
  else if(e.key==='Escape'){sr.classList.remove('show');this.blur();}
});
function updateSel(items){items.forEach(function(el,i){el.classList.toggle('active',i===sel);});
  if(sel>=0&&items[sel])items[sel].scrollIntoView({block:'nearest'});}
sr.addEventListener('click',function(e){var it=e.target.closest('.search-result-item');if(it)window.location.href=it.dataset.url;});
document.addEventListener('click',function(e){if(!e.target.closest('.header-search'))sr.classList.remove('show');});
})();
