import{a as t}from"./chunk-AM4DWAU2.js";var v=e=>new URL(e,document.baseURI).href;function g(e,s,n,c=e*.8){if(n)return s(c,0),()=>{};let a=0,r=!1,o=performance.now(),l=p=>{if(r)return;let i=Math.max(0,p-o)/1e3;s(i%e,Math.floor(i/e)),a=requestAnimationFrame(l)};return a=requestAnimationFrame(l),()=>{r=!0,cancelAnimationFrame(a)}}var m=(e,s)=>{e&&e.textContent!==s&&(e.textContent=s)},x=(e,s,n)=>{e&&e.getAttribute(s)!==String(n)&&e.setAttribute(s,String(n))},b=e=>`0:${String(Math.floor(e)).padStart(2,"0")}`,M=({mark:e=""}={})=>`
  <div class="in-hero">
    ${e}
    <small>${t("intro.demo.goToStop")}</small>
    <strong>Edlichstra\xDFe</strong>
    <div class="in-line"><span class="badge tram">3</span><span>\u2192 Hauptbahnhof</span></div>
    <div class="in-count"><b class="in-num">6</b><i class="in-unit">min</i></div>
    <div class="in-leavebar">${t("intro.demo.leaveIn")}</div>
  </div>`;function w(e,s){e.innerHTML=`
    <div class="in-race" data-phase="splash">
      <figure class="in-phone slow">
        <div class="in-screen">
          <div class="in-scr splash"><span class="in-logo"></span><span class="in-spin"></span><small>${t("intro.demo.loading")}</small></div>
          <div class="in-scr home">
            <span class="in-bar"></span>
            <span class="in-banner"><b>${t("intro.demo.offers")}</b><i></i></span>
            <span class="in-tiles"><i></i><i></i><i></i><i></i><i></i><i></i></span>
            <span class="in-tabs"><i></i><i></i><i></i><i></i></span>
          </div>
          <div class="in-scr search">
            <span class="in-bar"></span>
            <small>${t("intro.demo.from")}</small><span class="in-field"><i class="a"></i></span>
            <small>${t("intro.demo.to")}</small><span class="in-field"><i class="b"></i></span>
            <span class="in-go">${t("intro.demo.search")}</span>
          </div>
          <div class="in-scr wait"><span class="in-spin"></span></div>
          <div class="in-scr list">
            <span class="in-bar"></span>
            <span class="in-row"><b>12:04</b><i></i><em>+3</em></span>
            <span class="in-row"><b>12:10</b><i></i></span>
            <span class="in-row"><b>12:14</b><i></i><em>+1</em></span>
            <span class="in-think">${t("intro.demo.think")}</span>
          </div>
        </div>
        <figcaption><span>${t("intro.demo.typical")}</span><b class="in-clock" data-clock="slow">0:00</b></figcaption>
      </figure>
      <figure class="in-phone fast">
        <div class="in-screen">
          <div class="in-scr skeleton"><i></i><i></i><i></i></div>
          <div class="in-scr app">
            <span class="in-apptop"><img src="${v("assets/img/icon.svg")}" alt="" width="14" height="14"><b>nextTram</b></span>
            ${M()}
            <span class="in-later"><span class="badge tram">7</span><i></i><b>11 min</b></span>
          </div>
        </div>
        <figcaption><span>nextTram</span><b class="in-clock" data-clock="fast">0:00</b></figcaption>
      </figure>
    </div>`;let n=e.firstElementChild,c=n.querySelector('[data-clock="slow"]'),a=n.querySelector('[data-clock="fast"]'),r=[[0,"splash"],[2.4,"home"],[4.2,"search"],[6.9,"wait"],[7.9,"list"]];return g(12.5,o=>{let l=r.filter(([p])=>o>=p).pop()?.[1]??"splash";x(n,"data-phase",l),n.classList.toggle("ready",o>=.75),n.classList.toggle("thinking",o>=8.8),n.classList.toggle("fading",o>=12),m(a,o>=.75?"0:01 \u2713":"0:00"),a?.classList.toggle("ok",o>=.75),m(c,b(Math.min(o,11.4)*1.6))},s.reduced,10)}var S=()=>`
  <svg class="in-map" viewBox="-13 -22 31 38" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="m-plate">
      <rect x="-8.7" y="-22.2" width="15.4" height="14.4" rx=".6"/><rect x="-8.7" y="-3.7" width="15.4" height="15.4" rx=".6"/>
      <rect x="-8.7" y="13.8" width="15.4" height="6" rx=".6"/><rect x="-23" y="-3.7" width="12.2" height="15.4" rx=".6"/>
      <rect x="-23" y="-22.2" width="12.2" height="14.4" rx=".6"/><rect x="13.3" y="-22.2" width="8" height="14.4" rx=".6"/>
    </g>
    <rect class="m-park" x="14" y="-3" width="8" height="14" rx=".6"/>
    <g class="m-roof">
      <path d="M-8-21.5H6v13H-8zM-5.4-18.9v7.8H3.4v-7.8z" fill-rule="evenodd"/>
      <path d="M-8-3H6v2.6H-8zM-8-.4h2.6v8.8H-8zM-8 8.4h5.7V11H-8zM.3 8.4H6V11H.3zM3.4 2H6v6.4H3.4z"/>
      <path d="M-8 14.5H6V17H-8zM-13-3h1.5v14H-13zM-13-21.5h1.5v13H-13zM14-21.5h4v13h-4z"/>
    </g>
    <path class="m-glow" d="M10-22V16"/>
    <path class="m-rail" d="M9.58-22V16M10.42-22V16"/>
    <rect class="m-platform" x="7.2" y="-18" width="1.5" height="6" rx=".3"/>
    <path class="m-street" d="M-1 5V12.75H7.4V-15"/>
    <text class="m-door" x="-1" y="9.4">${t("intro.demo.frontDoor")}</text><text class="m-door" x="4.6" y="0.1">${t("intro.demo.backExit")}</text>
    <path class="m-short" d="M-1 5 2.6 .95 7.4 .75V-15"/>
    <circle class="m-homering" cx="-1" cy="5" r="1.5"/><circle class="m-home" cx="-1" cy="5" r=".6"/>
    <circle class="m-node" cx="10" cy="-15" r=".62"/><circle class="m-nodein" cx="10" cy="-15" r=".36"/>
    <circle class="m-sign" cx="6" cy="-17.6" r="1.05"/><text class="m-h" x="6" y="-17">H</text>
  </svg>`;function y(e){let s=e==="shortcut"?`<div class="in-hud">
           <div class="in-walkset"><span>${t("intro.demo.yourWalk")}</span>
             <span class="in-stepper"><i data-minus>\u2212</i><b data-walk>5 min</b><i>+</i></span>
           </div>
           <div class="in-pill" data-leave>${t("intro.demo.leaveInPill",{n:2})}</div>
         </div>`:`<div class="in-hud run">
           <div class="in-dep"><span class="badge tram">3</span><span class="in-dir">\u2192 Hauptbahnhof</span><b data-dep>2 min</b></div>
           <div class="in-pill now" data-run>${t("intro.demo.runNow")}</div>
         </div>`;return(n,c)=>{n.innerHTML=`<div class="in-3d" data-mode="${e}">${S()}</div>${s}`;let a=n.querySelector(".in-3d"),r=i=>n.querySelector(i),o=!1,l=5,p=i=>{if(!o)if(i.mode==="shortcut"){if(m(r("[data-walk]"),`${i.walkMin} min`),r("[data-leave] b").textContent=String(i.leaveMin),i.walkMin!==l){let d=r("[data-minus]");d.classList.remove("tap"),d.offsetWidth,i.walkMin<l&&d.classList.add("tap"),l=i.walkMin}r(".in-hud").classList.toggle("saved",i.phase==="saved")}else{let d=i.phase==="caught";m(r("[data-dep]"),d?t("intro.demo.onBoard"):i.depMin>0?`${i.depMin} min`:t("intro.demo.now"));let u=r("[data-run]");u.classList.contains("ok")!==d&&(u.classList.toggle("ok",d),u.classList.toggle("now",!d),u.innerHTML=d?t("intro.demo.made"):t("intro.demo.runNow"))}};return e==="shortcut"&&p({mode:e,walkMin:3,leaveMin:4,phase:"saved"}),l=3,c.scene(a).then(i=>{o||!i||(e==="shortcut"&&(l=5,p({mode:e,walkMin:5,leaveMin:2,phase:"street"})),i.attach(a),i.play(e,p),a.classList.add("live"))}),()=>{o=!0,c.sceneNow()?.pause()}}}var k=matchMedia("(prefers-reduced-motion: reduce)").matches;function L(){let e=null,s=null;return{reduced:k,dark:!0,scene(n){return s||(s=import("./scene-QISRFIST.js").then(c=>{try{e=c.createScene(n,{reduced:k,dark:!0,onLost:()=>n.closest(".in-3d")?.classList.remove("live")})}catch{e=null}return e}).catch(()=>null)),s},sceneNow:()=>e}}function H(e,s,n=!1){let c=L(),a=null;new IntersectionObserver(([r])=>{if(r.isIntersecting&&!a)a=s(c);else if(!r.isIntersecting&&a){if(n){c.sceneNow()?.pause();return}a(),a=null}},{rootMargin:"200px 0px"}).observe(e)}var h=document.querySelector('[data-demo="fast"]');h&&H(h,e=>w(h,e));var f=document.querySelector('[data-demo="walk"]');if(f){let e=y("shortcut");H(f,s=>e(f,s))}
