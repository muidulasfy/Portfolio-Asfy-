// Restore the user's chosen theme before the page interactions initialize.
try {
  if (localStorage.getItem("asfy-theme") === "light") {
    document.body.classList.add("soft-light");
  }
} catch (error) {
  // Theme switching still works for this page if storage is unavailable.
}


// Premium intro loader: progress animation with a safe timeout fallback.
(function(){
  const loader=document.getElementById("premiumLoader");
  if(!loader)return;
  document.body.classList.add("is-loading");
  const percent=document.getElementById("loaderPercent");
  const bar=document.getElementById("loaderProgressBar");
  const status=document.getElementById("loaderStatus");
  const stages=[{at:0,text:"INITIALIZING EXPERIENCE"},{at:28,text:"PREPARING THE INTERFACE"},{at:57,text:"SETTING THE SCENE"},{at:82,text:"ALMOST READY"},{at:100,text:"WELCOME IN"}];
  let value=0,finished=false;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const started=performance.now();
  const duration=reduced?350:1550;
  function finish(){
    if(finished)return;finished=true;
    if(percent)percent.textContent="100";
    if(bar)bar.style.width="100%";
    if(status)status.textContent="WELCOME IN";
    setTimeout(()=>{loader.classList.add("is-done");document.body.classList.remove("is-loading");setTimeout(()=>loader.remove(),850);},reduced?100:180);
  }
  function tick(now){
    if(finished)return;
    const p=Math.min(1,(now-started)/duration);
    // Ease out for a polished, non-linear loading counter.
    value=Math.min(99,Math.round((1-Math.pow(1-p,2.4))*100));
    if(percent)percent.textContent=String(value).padStart(2,"0");
    if(bar)bar.style.width=value+"%";
    const stage=[...stages].reverse().find(s=>value>=s.at);
    if(status&&stage)status.textContent=stage.text;
    if(p<1)requestAnimationFrame(tick);else finish();
  }
  if(document.readyState==="complete")requestAnimationFrame(tick);
  else window.addEventListener("load",()=>requestAnimationFrame(tick),{once:true});
  // Do not leave a user stuck behind the intro if a third-party asset hangs.
  setTimeout(finish,3200);
})();

document.addEventListener("DOMContentLoaded",()=>{
 const nav=document.getElementById("navigation"),toggle=document.getElementById("menuToggle"),progress=document.getElementById("scrollProgress"),stage=document.getElementById("heroStage");
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const cursor=document.getElementById("customCursor");
 if(cursor && matchMedia("(hover:hover) and (pointer:fine)").matches){
  let cursorX=-100,cursorY=-100;
  document.addEventListener("pointermove",e=>{
   cursorX=e.clientX;cursorY=e.clientY;
   cursor.style.transform=`translate3d(${cursorX}px,${cursorY}px,0) translate(-50%,-50%)`;
  },{passive:true});
  document.querySelectorAll("a,button,.skill-node,.skill-row,.work-card").forEach(el=>{
   el.addEventListener("pointerenter",()=>cursor.classList.add("cursor-hover"));
   el.addEventListener("pointerleave",()=>cursor.classList.remove("cursor-hover"));
  });
  document.addEventListener("pointerdown",()=>cursor.classList.add("cursor-hover"));
  document.addEventListener("pointerup",()=>cursor.classList.remove("cursor-hover"));
 }

 toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
 const themeToggle=document.getElementById("themeToggle");
 if(themeToggle){
  const syncThemeButton=()=>{
   const light=document.body.classList.contains("soft-light");
   const glyph=themeToggle.querySelector("span");
   if(glyph)glyph.textContent=light?"☾":"☼";
   themeToggle.setAttribute("aria-label",light?"Switch to dark mode":"Switch to light mode");
   themeToggle.setAttribute("aria-pressed",light?"true":"false");
   document.documentElement.style.colorScheme=light?"light":"dark";
  };
  syncThemeButton();
  themeToggle.addEventListener("click",()=>{
   const light=document.body.classList.toggle("soft-light");
   try { localStorage.setItem("asfy-theme", light ? "light" : "dark"); } catch (error) {}
   syncThemeButton();
  });
 }

 const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%";};
 addEventListener("scroll",update,{passive:true});update();
 if(stage&&matchMedia("(pointer:fine)").matches&&!reduce){
  let frame=0,px=0,py=0;
  stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect();px=(e.clientX-r.left-r.width/2)/(r.width/2);py=(e.clientY-r.top-r.height/2)/(r.height/2);if(!frame)frame=requestAnimationFrame(()=>{stage.style.setProperty("--tilt-x",`${py*-3}deg`);stage.style.setProperty("--tilt-y",`${px*4}deg`);stage.style.transform=`perspective(1000px) rotateX(${py*-2}deg) rotateY(${px*2.5}deg)`;frame=0;});});
  stage.addEventListener("pointerleave",()=>{stage.style.transform="";});
 }
 if(window.gsap&&window.ScrollTrigger&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".availability,.hero h1,.hero-intro,.hero-actions",{y:26,opacity:0,duration:.8,stagger:.13,ease:"power3.out",delay:.1});
  gsap.from(".workflow-card",{y:24,opacity:0,rotateX:7,duration:.85,stagger:.12,ease:"power3.out",delay:.25});
  gsap.from(".hero-cube",{scale:.78,opacity:0,duration:1.1,ease:"power3.out",delay:.2});
  gsap.from(".hero-tech-badge,.workflow-rail",{opacity:0,scale:.88,duration:.7,stagger:.06,delay:.45,ease:"back.out(1.5)"});
  gsap.utils.toArray(".section-top,.about-layout,.skills-heading,.skill-stage,.skill-row,.work-heading,.work-card,.education-card,.contact-layout,.contact-links a").forEach((el,i)=>{
   gsap.fromTo(el,{y:22,opacity:0},{y:0,opacity:1,duration:.7,delay:el.classList.contains("skill-row")?(i%4)*.035:0,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
  });
 }else{
  document.querySelectorAll(".section-top,.about-layout,.skills-heading,.skill-stage,.skill-row,.work-heading,.work-card,.education-card,.contact-layout,.contact-links a").forEach(el=>{el.style.opacity=1;el.style.transform="none";});
 }
 document.querySelectorAll(".magnetic").forEach(el=>{if(matchMedia("(pointer:fine)").matches&&!reduce){el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.07}px,${(e.clientY-r.top-r.height/2)*.1}px)`});el.addEventListener("pointerleave",()=>el.style.transform="");}});
});