import{a as n}from"./chunk-AM4DWAU2.js";var x=e=>new URL(e,document.baseURI).href;function b(e,t,s,o=e*.8){if(s)return t(o,0),()=>{};let a=0,i=!1,c=performance.now(),l=p=>{if(i)return;let r=Math.max(0,p-c)/1e3;t(r%e,Math.floor(r/e)),a=requestAnimationFrame(l)};return a=requestAnimationFrame(l),()=>{i=!0,cancelAnimationFrame(a)}}var m=(e,t)=>{e&&e.textContent!==t&&(e.textContent=t)},M=(e,t,s)=>{e&&e.getAttribute(t)!==String(s)&&e.setAttribute(t,String(s))},w=e=>`0:${String(Math.floor(e)).padStart(2,"0")}`,y=({mark:e=""}={})=>`
  <div class="in-hero">
    ${e}
    <small>${n("intro.demo.goToStop")}</small>
    <strong>Edlichstra\xDFe</strong>
    <div class="in-line"><span class="badge tram">3</span><span>\u2192 Hauptbahnhof</span></div>
    <div class="in-count"><b class="in-num">6</b><i class="in-unit">min</i></div>
    <div class="in-leavebar">${n("intro.demo.leaveIn")}</div>
  </div>`;function f(e,t){e.innerHTML=`
    <div class="in-race" data-phase="splash">
      <figure class="in-phone slow">
        <div class="in-screen">
          <div class="in-scr splash"><span class="in-logo"></span><span class="in-spin"></span><small>${n("intro.demo.loading")}</small></div>
          <div class="in-scr home">
            <span class="in-bar"></span>
            <span class="in-banner"><b>${n("intro.demo.offers")}</b><i></i></span>
            <span class="in-tiles"><i></i><i></i><i></i><i></i><i></i><i></i></span>
            <span class="in-tabs"><i></i><i></i><i></i><i></i></span>
          </div>
          <div class="in-scr search">
            <span class="in-bar"></span>
            <small>${n("intro.demo.from")}</small><span class="in-field"><i class="a"></i></span>
            <small>${n("intro.demo.to")}</small><span class="in-field"><i class="b"></i></span>
            <span class="in-go">${n("intro.demo.search")}</span>
          </div>
          <div class="in-scr wait"><span class="in-spin"></span></div>
          <div class="in-scr list">
            <span class="in-bar"></span>
            <span class="in-row"><b>12:04</b><i></i><em>+3</em></span>
            <span class="in-row"><b>12:10</b><i></i></span>
            <span class="in-row"><b>12:14</b><i></i><em>+1</em></span>
            <span class="in-think">${n("intro.demo.think")}</span>
          </div>
        </div>
        <figcaption><span>${n("intro.demo.typical")}</span><b class="in-clock" data-clock="slow">0:00</b></figcaption>
      </figure>
      <figure class="in-phone fast">
        <div class="in-screen">
          <div class="in-scr skeleton"><i></i><i></i><i></i></div>
          <div class="in-scr app">
            <span class="in-apptop"><img src="${x("assets/img/icon.svg")}" alt="" width="14" height="14"><b>nextTram</b></span>
            ${y()}
            <span class="in-later"><span class="badge tram">7</span><i></i><b>11 min</b></span>
          </div>
        </div>
        <figcaption><span>nextTram</span><b class="in-clock" data-clock="fast">0:00</b></figcaption>
      </figure>
    </div>`;let s=e.firstElementChild,o=s.querySelector('[data-clock="slow"]'),a=s.querySelector('[data-clock="fast"]'),i=[[0,"splash"],[2.4,"home"],[4.2,"search"],[6.9,"wait"],[7.9,"list"]];return b(12.5,c=>{let l=i.filter(([p])=>c>=p).pop()?.[1]??"splash";M(s,"data-phase",l),s.classList.toggle("ready",c>=.75),s.classList.toggle("thinking",c>=8.8),s.classList.toggle("fading",c>=12),m(a,c>=.75?"0:01 \u2713":"0:00"),a?.classList.toggle("ok",c>=.75),m(o,w(Math.min(c,11.4)*1.6))},t.reduced,10)}var L=()=>`
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
    <text class="m-door" x="-1" y="9.4">${n("intro.demo.frontDoor")}</text><text class="m-door" x="4.6" y="0.1">${n("intro.demo.backExit")}</text>
    <path class="m-short" d="M-1 5 2.6 .95 7.4 .75V-15"/>
    <circle class="m-homering" cx="-1" cy="5" r="1.5"/><circle class="m-home" cx="-1" cy="5" r=".6"/>
    <circle class="m-node" cx="10" cy="-15" r=".62"/><circle class="m-nodein" cx="10" cy="-15" r=".36"/>
    <circle class="m-sign" cx="6" cy="-17.6" r="1.05"/><text class="m-h" x="6" y="-17">H</text>
  </svg>`;function k(e){let t=e==="shortcut"?`<div class="in-hud">
           <div class="in-walkset"><span>${n("intro.demo.yourWalk")}</span>
             <span class="in-stepper"><i data-minus>\u2212</i><b data-walk>5 min</b><i>+</i></span>
           </div>
           <div class="in-pill" data-leave>${n("intro.demo.leaveInPill",{n:2})}</div>
         </div>`:`<div class="in-hud run">
           <div class="in-dep"><span class="badge tram">3</span><span class="in-dir">\u2192 Hauptbahnhof</span><b data-dep>2 min</b></div>
           <div class="in-pill now" data-run>${n("intro.demo.runNow")}</div>
         </div>`;return(s,o)=>{s.innerHTML=`<div class="in-3d" data-mode="${e}">${L()}</div>${t}`;let a=s.querySelector(".in-3d"),i=r=>s.querySelector(r),c=!1,l=5,p=r=>{if(!c)if(r.mode==="shortcut"){if(m(i("[data-walk]"),`${r.walkMin} min`),i("[data-leave] b").textContent=String(r.leaveMin),r.walkMin!==l){let d=i("[data-minus]");d.classList.remove("tap"),d.offsetWidth,r.walkMin<l&&d.classList.add("tap"),l=r.walkMin}i(".in-hud").classList.toggle("saved",r.phase==="saved")}else{let d=r.phase==="caught";m(i("[data-dep]"),d?n("intro.demo.onBoard"):r.depMin>0?`${r.depMin} min`:n("intro.demo.now"));let h=i("[data-run]");h.classList.contains("ok")!==d&&(h.classList.toggle("ok",d),h.classList.toggle("now",!d),h.innerHTML=d?n("intro.demo.made"):n("intro.demo.runNow"))}};return e==="shortcut"&&p({mode:e,walkMin:3,leaveMin:4,phase:"saved"}),l=3,o.scene(a).then(r=>{c||!r||(e==="shortcut"&&(l=5,p({mode:e,walkMin:5,leaveMin:2,phase:"street"})),r.attach(a),r.play(e,p),a.classList.add("live"))}),()=>{c=!0,o.sceneNow()?.pause()}}}var H=matchMedia("(prefers-reduced-motion: reduce)").matches;function T(){let e=null,t=null;return{reduced:H,dark:!0,scene(s){return t||(t=import("./scene-QISRFIST.js").then(o=>{try{e=o.createScene(s,{reduced:H,dark:!0,onLost:()=>s.closest(".in-3d")?.classList.remove("live")})}catch{e=null}return e}).catch(()=>null)),t},sceneNow:()=>e}}function S(e,t,s=!1){let o=T(),a=null;new IntersectionObserver(([i])=>{if(i.isIntersecting&&!a)a=t(o);else if(!i.isIntersecting&&a){if(s){o.sceneNow()?.pause();return}a(),a=null}},{rootMargin:"200px 0px"}).observe(e)}var u=document.querySelector('[data-demo="fast"]'),v=document.querySelector("[data-taps]");u&&S(u,e=>{if(e.reduced){let i=f(u,e);return v?.classList.add("is-on"),i}let t=null,s=0,o=null,a=()=>{v?.classList.remove("is-on"),t=f(u,e);let i=u.querySelector(".in-race");o=new MutationObserver(()=>{i?.classList.contains("fading")&&(o?.disconnect(),t?.(),t=null,v?.classList.add("is-on"),s=window.setTimeout(a,4200))}),i&&o.observe(i,{attributes:!0,attributeFilter:["class"]})};return a(),()=>{o?.disconnect(),t?.(),clearTimeout(s),v?.classList.remove("is-on")}});var g=document.querySelector('[data-demo="walk"]');if(g){let e=k("shortcut");S(g,t=>e(g,t))}
