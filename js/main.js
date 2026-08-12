try{
  var mwTheme=localStorage.getItem('mw-theme');
  if(mwTheme==='dark'||mwTheme==='light'){document.documentElement.dataset.theme=mwTheme;}
}catch(e){}

(function(){
  'use strict';

  /* ---------- theme toggle ---------- */
  var root=document.documentElement;
  var btn=document.getElementById('themeToggle');
  var sysDark=matchMedia('(prefers-color-scheme: dark)');
  function effective(){
    if(root.dataset.theme==='dark')return'dark';
    if(root.dataset.theme==='light')return'light';
    return sysDark.matches?'dark':'light';
  }
  function paintBtn(){
    var next=effective()==='dark'?'light':'dark';
    btn.textContent=next==='dark'?'Dark':'Light';
    btn.setAttribute('aria-label','Switch to '+next+' theme');
  }
  btn.addEventListener('click',function(){
    var next=effective()==='dark'?'light':'dark';
    root.dataset.theme=next;
    try{localStorage.setItem('mw-theme',next);}catch(e){}
    paintBtn();
  });
  if(sysDark.addEventListener){sysDark.addEventListener('change',paintBtn);}
  paintBtn();

  /* ---------- kinetic headline ---------- */
  var reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var coarse=matchMedia('(hover: none), (pointer: coarse)');
  var title=document.getElementById('heroTitle');
  var letters=Array.prototype.slice.call(document.querySelectorAll('#heroTitle .kx'));
  if(!title||!letters.length)return;

  /* rest state matches the CSS default so JS takeover is seamless */
  var REST=0.5;
  var state=letters.map(function(el,i){return{el:el,f:REST,i:i};});

  var px=-1e5,py=-1e5,lastMove=-1e5;
  var running=false,rafId=0,visible=true;

  function axes(f){
    var w=280+f*620;   /* wght 280..900  (rest ~590) */
    var x=74+f*52;     /* wdth  74..126  (rest ~100) */
    return"'wght' "+w.toFixed(1)+", 'wdth' "+x.toFixed(1);
  }
  function smooth(t){return t<=0?0:t>=1?1:t*t*(3-2*t);}

  function frame(now){
    rafId=0;
    if(!running)return;
    var wave=coarse.matches||(now-lastMove>2600);
    var k,s,f,changed=false;

    if(wave){
      for(k=0;k<state.length;k++){
        s=state[k];
        f=0.34+0.30*Math.sin(now/950-s.i*0.55);
        s.t=f;
      }
    }else{
      /* reads first: one layout pass, then all writes */
      var rects=[];
      for(k=0;k<state.length;k++){rects.push(state[k].el.getBoundingClientRect());}
      var head=title.getBoundingClientRect();
      var near=px>head.left-180&&px<head.right+180&&py>head.top-180&&py<head.bottom+180;
      var R=Math.max(190,Math.min(window.innerWidth,1100)*0.27);
      for(k=0;k<state.length;k++){
        s=state[k];
        var r=rects[k];
        var dx=(r.left+r.right)/2-px;
        var dy=(r.top+r.bottom)/2-py;
        var g=smooth(1-Math.sqrt(dx*dx+dy*dy)/R);
        s.t=near?(0.14+0.86*g):REST;
      }
    }
    for(k=0;k<state.length;k++){
      s=state[k];
      var d=s.t-s.f;
      if(Math.abs(d)>0.0015){
        s.f+=d*0.14;
        s.el.style.fontVariationSettings=axes(s.f);
        changed=true;
      }
    }
    if(changed||running){rafId=requestAnimationFrame(frame);}
  }

  function start(){
    if(running||reduce.matches||!visible)return;
    running=true;
    if(!rafId){rafId=requestAnimationFrame(frame);}
  }
  function stop(){
    running=false;
    if(rafId){cancelAnimationFrame(rafId);rafId=0;}
  }
  function resetStatic(){
    stop();
    for(var k=0;k<state.length;k++){
      state[k].f=REST;
      state[k].el.style.fontVariationSettings='';
    }
  }

  window.addEventListener('pointermove',function(e){
    px=e.clientX;py=e.clientY;lastMove=performance.now();
  },{passive:true});

  if('IntersectionObserver'in window){
    new IntersectionObserver(function(entries){
      visible=entries[0].isIntersecting;
      if(visible){start();}else{stop();}
    },{rootMargin:'80px'}).observe(title);
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){stop();}else{start();}
  });
  function onReduceChange(){
    if(reduce.matches){resetStatic();}else{start();}
  }
  if(reduce.addEventListener){reduce.addEventListener('change',onReduceChange);}

  start();
})();
