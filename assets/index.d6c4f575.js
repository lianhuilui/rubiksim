(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function l(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerpolicy&&(a.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?a.credentials="include":r.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=l(r);fetch(r.href,a)}})();function Se(){}function Wt(e){return e()}function kt(){return Object.create(null)}function ve(e){e.forEach(Wt)}function Zt(e){return typeof e=="function"}function gt(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function $t(e){return Object.keys(e).length===0}function u(e,t){e.appendChild(t)}function B(e,t,l){e.insertBefore(t,l||null)}function E(e){e.parentNode.removeChild(e)}function qe(e,t){for(let l=0;l<e.length;l+=1)e[l]&&e[l].d(t)}function b(e){return document.createElement(e)}function M(e){return document.createTextNode(e)}function C(){return M(" ")}function ht(){return M("")}function T(e,t,l,i){return e.addEventListener(t,l,i),()=>e.removeEventListener(t,l,i)}function d(e,t,l){l==null?e.removeAttribute(t):e.getAttribute(t)!==l&&e.setAttribute(t,l)}function Ce(e){return e===""?null:+e}function xt(e){return Array.from(e.childNodes)}function de(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function ge(e,t){e.value=t==null?"":t}function be(e,t,l,i){l===null?e.style.removeProperty(t):e.style.setProperty(t,l,i?"important":"")}let et;function el(){if(et===void 0){et=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{et=!0}}return et}function tl(e,t){getComputedStyle(e).position==="static"&&(e.style.position="relative");const i=b("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=el();let a;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",a=T(window,"message",s=>{s.source===i.contentWindow&&t()})):(i.src="about:blank",i.onload=()=>{a=T(i.contentWindow,"resize",t)}),u(e,i),()=>{(r||a&&i.contentWindow)&&a(),E(i)}}function q(e,t,l){e.classList[l?"add":"remove"](t)}let Je;function He(e){Je=e}function ll(){if(!Je)throw new Error("Function called outside component initialization");return Je}function nl(e){ll().$$.after_update.push(e)}function Ht(e,t){const l=e.$$.callbacks[t.type];l&&l.slice().forEach(i=>i.call(this,t))}const We=[],he=[],nt=[],ft=[],Jt=Promise.resolve();let ut=!1;function Kt(){ut||(ut=!0,Jt.then(Vt))}function tt(){return Kt(),Jt}function rt(e){nt.push(e)}function Pe(e){ft.push(e)}const st=new Set;let lt=0;function Vt(){const e=Je;do{for(;lt<We.length;){const t=We[lt];lt++,He(t),il(t.$$)}for(He(null),We.length=0,lt=0;he.length;)he.pop()();for(let t=0;t<nt.length;t+=1){const l=nt[t];st.has(l)||(st.add(l),l())}nt.length=0}while(We.length);for(;ft.length;)ft.pop()();ut=!1,st.clear(),He(e)}function il(e){if(e.fragment!==null){e.update(),ve(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(rt)}}const it=new Set;let Ge;function Ie(){Ge={r:0,c:[],p:Ge}}function Ee(){Ge.r||ve(Ge.c),Ge=Ge.p}function S(e,t){e&&e.i&&(it.delete(e),e.i(t))}function W(e,t,l,i){if(e&&e.o){if(it.has(e))return;it.add(e),Ge.c.push(()=>{it.delete(e),i&&(l&&e.d(1),i())}),e.o(t)}else i&&i()}function Re(e,t,l){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=l,l(e.$$.ctx[i]))}function ke(e){e&&e.c()}function pe(e,t,l,i){const{fragment:r,on_mount:a,on_destroy:s,after_update:c}=e.$$;r&&r.m(t,l),i||rt(()=>{const n=a.map(Wt).filter(Zt);s?s.push(...n):ve(n),e.$$.on_mount=[]}),c.forEach(rt)}function me(e,t){const l=e.$$;l.fragment!==null&&(ve(l.on_destroy),l.fragment&&l.fragment.d(t),l.on_destroy=l.fragment=null,l.ctx=[])}function rl(e,t){e.$$.dirty[0]===-1&&(We.push(e),Kt(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function _t(e,t,l,i,r,a,s,c=[-1]){const n=Je;He(e);const o=e.$$={fragment:null,ctx:null,props:a,update:Se,not_equal:r,bound:kt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(n?n.$$.context:[])),callbacks:kt(),dirty:c,skip_bound:!1,root:t.target||n.$$.root};s&&s(o.root);let m=!1;if(o.ctx=l?l(e,t.props||{},(w,g,...p)=>{const f=p.length?p[0]:g;return o.ctx&&r(o.ctx[w],o.ctx[w]=f)&&(!o.skip_bound&&o.bound[w]&&o.bound[w](f),m&&rl(e,w)),g}):[],o.update(),m=!0,ve(o.before_update),o.fragment=i?i(o.ctx):!1,t.target){if(t.hydrate){const w=xt(t.target);o.fragment&&o.fragment.l(w),w.forEach(E)}else o.fragment&&o.fragment.c();t.intro&&S(e.$$.fragment),pe(e,t.target,t.anchor,t.customElement),Vt()}He(n)}class pt{$destroy(){me(this,1),this.$destroy=Se}$on(t,l){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(l),()=>{const r=i.indexOf(l);r!==-1&&i.splice(r,1)}}$set(t){this.$$set&&!$t(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function ol(e){let t,l,i,r,a,s;return{c(){t=b("div"),l=M(e[1]),d(t,"style",i=e[0]&&e[2]?"background-color: "+e[2]+";":""),d(t,"class",r="h-10 p-2 "+(e[0]?e[3]:"")+" rounded-lg "+(e[0]?"border-solid":"border-none")+" border-2 text-center svelte-mesu7o")},m(c,n){B(c,t,n),u(t,l),a||(s=[T(t,"click",e[4]),T(t,"click",e[5])],a=!0)},p(c,[n]){n&2&&de(l,c[1]),n&5&&i!==(i=c[0]&&c[2]?"background-color: "+c[2]+";":"")&&d(t,"style",i),n&9&&r!==(r="h-10 p-2 "+(c[0]?c[3]:"")+" rounded-lg "+(c[0]?"border-solid":"border-none")+" border-2 text-center svelte-mesu7o")&&d(t,"class",r)},i:Se,o:Se,d(c){c&&E(t),a=!1,ve(s)}}}function sl(e,t,l){let{checked:i=!1}=t,{text:r="O"}=t,{bgcolor:a=""}=t,{toggleClass:s=a?"":"bg-green-600"}=t,c=()=>{console.log("toggle"),l(0,i=!i)};function n(o){Ht.call(this,e,o)}return e.$$set=o=>{"checked"in o&&l(0,i=o.checked),"text"in o&&l(1,r=o.text),"bgcolor"in o&&l(2,a=o.bgcolor),"toggleClass"in o&&l(3,s=o.toggleClass)},[i,r,a,s,c,n]}class we extends pt{constructor(t){super(),_t(this,t,sl,ol,gt,{checked:0,text:1,bgcolor:2,toggleClass:3})}}function wt(e,t,l){const i=e.slice();return i[5]=t[l],i}function vt(e){let t,l;return{c(){t=b("span"),l=M("\xA0"),be(t,"background-color",e[5])},m(i,r){B(i,t,r),u(t,l)},p:Se,d(i){i&&E(t)}}}function al(e){let t,l,i,r,a,s,c=e[3],n=[];for(let o=0;o<c.length;o+=1)n[o]=vt(wt(e,c,o));return{c(){t=b("button"),l=M(e[2]),i=C(),r=b("div");for(let o=0;o<n.length;o+=1)n[o].c();d(r,"class","svelte-63dooi"),d(t,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),q(t,"bg-green-600",e[1]==e[0])},m(o,m){B(o,t,m),u(t,l),u(t,i),u(t,r);for(let w=0;w<n.length;w+=1)n[w].m(r,null);a||(s=T(t,"click",e[4]),a=!0)},p(o,[m]){if(m&4&&de(l,o[2]),m&8){c=o[3];let w;for(w=0;w<c.length;w+=1){const g=wt(o,c,w);n[w]?n[w].p(g,m):(n[w]=vt(g),n[w].c(),n[w].m(r,null))}for(;w<n.length;w+=1)n[w].d(1);n.length=c.length}m&3&&q(t,"bg-green-600",o[1]==o[0])},i:Se,o:Se,d(o){o&&E(t),qe(n,o),a=!1,s()}}}function cl(e,t,l){let{color:i=""}=t,{selected:r=""}=t,{name:a="default"}=t,s=i.split(",");function c(n){Ht.call(this,e,n)}return e.$$set=n=>{"color"in n&&l(0,i=n.color),"selected"in n&&l(1,r=n.selected),"name"in n&&l(2,a=n.name)},[i,r,a,s,c]}class fl extends pt{constructor(t){super(),_t(this,t,cl,al,gt,{color:0,selected:1,name:2})}}const dt=(e,t)=>({r:e.r-t.r,g:e.g-t.g,b:e.b-t.b}),ul=(e,t)=>({r:e.r+t.r,g:e.g+t.g,b:e.b+t.b}),dl=(e,t,l)=>Math.max(e,Math.min(t,l));let at={};const Qt=e=>{if(at[e])return at[e];{if(e.length==4){let[a,s,c,n]=e.split("");e="#"+s+s+c+c+n+n}let t=parseInt(e.substring(1,3),16),l=parseInt(e.substring(3,5),16),i=parseInt(e.substring(5,7),16),r={r:t,g:l,b:i};return at[e]=r,r}},mt=(e,t,l)=>{let i=dt(l?Yt(e):e,t),r=Math.abs(i.r),a=Math.abs(i.g),s=Math.abs(i.b);return r*r+s*s+a*a};let ct={};const gl=(e,t,l)=>{let i;ct[t]?i=ct[t]:(i=t.split(","),ct[t]=i);let r=i[0],a=null;return i.forEach((s,c)=>{let n=Qt(s),o=mt(n,e,l);(a==null||a>o)&&(a=o,r=n)}),r},hl=(e,t,l)=>{let i=t[0],r=null;return t.forEach((a,s)=>{let c=mt(a,e,l);(r==null||r>c)&&(r=c,i=a)}),i},Xt=e=>Math.floor((e.r+e.g+e.b)/3),_l=e=>"#"+e.r.toString(16).padStart(2,"0")+e.g.toString(16).padStart(2,"0")+e.b.toString(16).padStart(2,"0"),Yt=e=>{let t=Xt(e);return{r:t,g:t,b:t}};function pl(e){let t=0;for(let l=0,i=e.length;l<i;l++){let r=e.charCodeAt(l);t=(t<<5)-t+r,t|=0}return t}const bt=(e,t,l)=>(t*l+e)*4;let ml=function(e,t,l,i){let r=e.width,a=bt(t,l,r);e.data[a]=i.r,e.data[a+1]=i.g,e.data[a+2]=i.b},bl=function(e,t,l){e.data[t]=l},kl=function(e,t,l){let i=e.width,r=bt(t,l,i);return{r:e.data[r],g:e.data[r+1],b:e.data[r+2]}};const I={getPixelDataRGB:kl,setPixelDataRGB:ml,setPixelDataRaw:bl,calc_i:bt,hashCode:pl,Rgb2Gray:Yt,RgbGrayValue:Xt,RgbToHex:_l,nearestPixel:gl,nearestPixel2:hl,clamp:dl,pixelAdd:ul,pixelDiff:dt,hexToRgb:Qt,calculatePixelDifference:mt};function zt(e,t,l){const i=e.slice();return i[60]=t[l],i}function yt(e,t,l){const i=e.slice();return i[63]=t[l],i[64]=t,i[65]=l,i}function Dt(e,t,l){const i=e.slice();return i[66]=t[l],i[67]=t,i[68]=l,i}function Pt(e,t,l){const i=e.slice();return i[69]=t[l],i}function Rt(e,t,l){const i=e.slice();return i[72]=t[l],i}function Ct(e){let t,l,i,r,a,s,c,n,o,m=e[0].width+"",w,g,p,f,z,F,y,P,le,N,J,ne;function ie(v){e[29](v)}let V={text:"Pixelated"};e[0].pixelated!==void 0&&(V.checked=e[0].pixelated),z=new we({props:V}),he.push(()=>Re(z,"checked",ie));function K(v){e[30](v)}let O={text:"Cache"};return e[0].cache!==void 0&&(O.checked=e[0].cache),P=new we({props:O}),he.push(()=>Re(P,"checked",K)),{c(){t=b("div"),l=b("div"),i=b("div"),r=b("span"),r.textContent="Width",a=C(),s=b("input"),n=C(),o=b("span"),w=M(m),g=C(),p=b("div"),f=b("div"),ke(z.$$.fragment),y=C(),ke(P.$$.fragment),d(r,"class","svelte-7lre2h"),be(s,"flex","1"),d(s,"type","range"),d(s,"min","3"),d(s,"max",c=e[0].max_width),d(s,"step","3"),d(s,"class","svelte-7lre2h"),d(o,"class","svelte-7lre2h"),d(i,"class","flex slider-wrapper svelte-7lre2h"),d(f,"class","d-block"),d(p,"class","flex"),d(l,"class","flex flex-col"),d(t,"class","bg-white text-black p-2")},m(v,G){B(v,t,G),u(t,l),u(l,i),u(i,r),u(i,a),u(i,s),ge(s,e[0].width),u(i,n),u(i,o),u(o,w),u(l,g),u(l,p),u(p,f),pe(z,f,null),u(f,y),pe(P,f,null),N=!0,J||(ne=[T(s,"change",e[28]),T(s,"input",e[28])],J=!0)},p(v,G){(!N||G[0]&1&&c!==(c=v[0].max_width))&&d(s,"max",c),G[0]&1&&ge(s,v[0].width),(!N||G[0]&1)&&m!==(m=v[0].width+"")&&de(w,m);const j={};!F&&G[0]&1&&(F=!0,j.checked=v[0].pixelated,Pe(()=>F=!1)),z.$set(j);const _e={};!le&&G[0]&1&&(le=!0,_e.checked=v[0].cache,Pe(()=>le=!1)),P.$set(_e)},i(v){N||(S(z.$$.fragment,v),S(P.$$.fragment,v),N=!0)},o(v){W(z.$$.fragment,v),W(P.$$.fragment,v),N=!1},d(v){v&&E(t),me(z),me(P),J=!1,ve(ne)}}}function It(e){let t,l,i,r,a,s,c,n,o,m,w,g,p,f,z=e[0].rubiks_scale+"",F,y,P,le,N,J,ne,ie=e[0].grid_size+"",V,K,O,v;function G(A){e[31](A)}let j={text:"rubiks"};e[0].show_rubiks!==void 0&&(j.checked=e[0].show_rubiks),r=new we({props:j}),he.push(()=>Re(r,"checked",G));function _e(A){e[32](A)}let Z={text:"Show Grid"};return e[0].show_grid!==void 0&&(Z.checked=e[0].show_grid),c=new we({props:Z}),he.push(()=>Re(c,"checked",_e)),{c(){t=b("div"),l=b("div"),i=b("div"),ke(r.$$.fragment),s=C(),ke(c.$$.fragment),o=C(),m=b("div"),w=M(`Scale\r
            `),g=b("input"),p=C(),f=b("span"),F=M(z),y=C(),P=b("span"),P.textContent="\xA0",le=M(`\r
            Grid Size\r
            `),N=b("input"),J=C(),ne=b("span"),V=M(ie),d(i,"class","flex"),d(g,"type","range"),d(g,"max","40"),be(P,"margin-left","10px"),d(N,"type","range"),d(N,"max","10"),d(m,"class","flex"),d(l,"class","flex flex-col"),d(t,"class","bg-white text-black p-2")},m(A,X){B(A,t,X),u(t,l),u(l,i),pe(r,i,null),u(i,s),pe(c,i,null),u(l,o),u(l,m),u(m,w),u(m,g),ge(g,e[0].rubiks_scale),u(m,p),u(m,f),u(f,F),u(m,y),u(m,P),u(m,le),u(m,N),ge(N,e[0].grid_size),u(m,J),u(m,ne),u(ne,V),K=!0,O||(v=[T(g,"change",e[33]),T(g,"input",e[33]),T(N,"change",e[34]),T(N,"input",e[34])],O=!0)},p(A,X){const re={};!a&&X[0]&1&&(a=!0,re.checked=A[0].show_rubiks,Pe(()=>a=!1)),r.$set(re);const ye={};!n&&X[0]&1&&(n=!0,ye.checked=A[0].show_grid,Pe(()=>n=!1)),c.$set(ye),X[0]&1&&ge(g,A[0].rubiks_scale),(!K||X[0]&1)&&z!==(z=A[0].rubiks_scale+"")&&de(F,z),X[0]&1&&ge(N,A[0].grid_size),(!K||X[0]&1)&&ie!==(ie=A[0].grid_size+"")&&de(V,ie)},i(A){K||(S(r.$$.fragment,A),S(c.$$.fragment,A),K=!0)},o(A){W(r.$$.fragment,A),W(c.$$.fragment,A),K=!1},d(A){A&&E(t),me(r),me(c),O=!1,ve(v)}}}function Et(e){let t,l,i,r,a,s,c=e[0].mockup_pixel_size+"",n,o,m,w,g,p,f,z=e[0].mockup_x+"",F,y,P,le,N,J=e[0].mockup_y+"",ne,ie,V;function K(G,j){return G[1].mockup_hovering?wl:vl}let O=K(e),v=O(e);return{c(){t=b("div"),l=b("div"),v.c(),i=M(`\r
\r
        Mock Up Pixel\r
        `),r=b("input"),a=C(),s=b("span"),n=M(c),o=C(),m=b("br"),w=M(`\r
        Mock Up Position\r
        `),g=b("input"),p=C(),f=b("span"),F=M(z),y=C(),P=b("input"),le=C(),N=b("span"),ne=M(J),be(l,"height","100px"),d(l,"ondragover","return false"),d(l,"id","mockup_drop_zone"),d(l,"class","bg-red-500 h-full p-4"),d(r,"type","range"),d(r,"min","1"),d(r,"max","25"),d(g,"type","range"),d(g,"min","-500"),d(g,"max","500"),d(P,"type","range"),d(P,"min","-500"),d(P,"max","500"),d(t,"class","bg-white text-black p-2")},m(G,j){B(G,t,j),u(t,l),v.m(l,null),u(t,i),u(t,r),ge(r,e[0].mockup_pixel_size),u(t,a),u(t,s),u(s,n),u(t,o),u(t,m),u(t,w),u(t,g),ge(g,e[0].mockup_x),u(t,p),u(t,f),u(f,F),u(t,y),u(t,P),ge(P,e[0].mockup_y),u(t,le),u(t,N),u(N,ne),ie||(V=[T(l,"drop",e[15]),T(l,"dragenter",e[16]),T(l,"dragleave",e[17]),T(r,"change",e[35]),T(r,"input",e[35]),T(g,"change",e[36]),T(g,"input",e[36]),T(P,"change",e[37]),T(P,"input",e[37])],ie=!0)},p(G,j){O!==(O=K(G))&&(v.d(1),v=O(G),v&&(v.c(),v.m(l,null))),j[0]&1&&ge(r,G[0].mockup_pixel_size),j[0]&1&&c!==(c=G[0].mockup_pixel_size+"")&&de(n,c),j[0]&1&&ge(g,G[0].mockup_x),j[0]&1&&z!==(z=G[0].mockup_x+"")&&de(F,z),j[0]&1&&ge(P,G[0].mockup_y),j[0]&1&&J!==(J=G[0].mockup_y+"")&&de(ne,J)},d(G){G&&E(t),v.d(),ie=!1,ve(V)}}}function wl(e){let t;return{c(){t=M("Release to load file")},m(l,i){B(l,t,i)},d(l){l&&E(t)}}}function vl(e){let t;return{c(){t=M("Drop Mock Up Image here")},m(l,i){B(l,t,i)},d(l){l&&E(t)}}}function Bt(e){let t,l,i,r,a,s,c,n,o,m,w,g,p,f,z,F,y,P,le,N,J;function ne(v){e[38](v)}let ie={text:"Gray"};e[0].gray_scale_input!==void 0&&(ie.checked=e[0].gray_scale_input),a=new we({props:ie}),he.push(()=>Re(a,"checked",ne));function V(v){e[39](v)}let K={text:"Nearest Gray Pixel"};e[0].gray_scale_nearest_pixel!==void 0&&(K.checked=e[0].gray_scale_nearest_pixel),w=new we({props:K}),he.push(()=>Re(w,"checked",V)),z=new we({props:{text:"No Dithering",checked:e[0].dithering==""}}),z.$on("click",e[40]),y=new we({props:{text:"Patterned Dithering",checked:e[0].dithering=="pattern"}}),y.$on("click",e[41]);let O=e[0].dithering=="pattern"&&Gt(e);return N=new we({props:{text:"Floyd Steinberg",checked:e[0].dithering=="fs"}}),N.$on("click",e[43]),{c(){t=b("div"),l=b("div"),i=b("span"),i.textContent="Input Image:",r=C(),ke(a.$$.fragment),c=C(),n=b("div"),o=b("span"),o.textContent="Nearest Pixel:",m=C(),ke(w.$$.fragment),p=C(),f=b("div"),ke(z.$$.fragment),F=C(),ke(y.$$.fragment),P=C(),O&&O.c(),le=C(),ke(N.$$.fragment),d(i,"class","p-2"),d(l,"class","flex"),d(o,"class","p-2"),d(n,"class","flex"),d(f,"class","flex"),d(t,"class","bg-white text-black p-2")},m(v,G){B(v,t,G),u(t,l),u(l,i),u(l,r),pe(a,l,null),u(t,c),u(t,n),u(n,o),u(n,m),pe(w,n,null),u(t,p),u(t,f),pe(z,f,null),u(f,F),pe(y,f,null),u(f,P),O&&O.m(f,null),u(f,le),pe(N,f,null),J=!0},p(v,G){const j={};!s&&G[0]&1&&(s=!0,j.checked=v[0].gray_scale_input,Pe(()=>s=!1)),a.$set(j);const _e={};!g&&G[0]&1&&(g=!0,_e.checked=v[0].gray_scale_nearest_pixel,Pe(()=>g=!1)),w.$set(_e);const Z={};G[0]&1&&(Z.checked=v[0].dithering==""),z.$set(Z);const A={};G[0]&1&&(A.checked=v[0].dithering=="pattern"),y.$set(A),v[0].dithering=="pattern"?O?O.p(v,G):(O=Gt(v),O.c(),O.m(f,le)):O&&(O.d(1),O=null);const X={};G[0]&1&&(X.checked=v[0].dithering=="fs"),N.$set(X)},i(v){J||(S(a.$$.fragment,v),S(w.$$.fragment,v),S(z.$$.fragment,v),S(y.$$.fragment,v),S(N.$$.fragment,v),J=!0)},o(v){W(a.$$.fragment,v),W(w.$$.fragment,v),W(z.$$.fragment,v),W(y.$$.fragment,v),W(N.$$.fragment,v),J=!1},d(v){v&&E(t),me(a),me(w),me(z),me(y),O&&O.d(),me(N)}}}function Gt(e){let t,l,i,r=e[11],a=[];for(let s=0;s<r.length;s+=1)a[s]=St(Rt(e,r,s));return{c(){t=b("span"),t.textContent="Matrix:",l=C();for(let s=0;s<a.length;s+=1)a[s].c();i=ht(),d(t,"class","h-10 p-2")},m(s,c){B(s,t,c),B(s,l,c);for(let n=0;n<a.length;n+=1)a[n].m(s,c);B(s,i,c)},p(s,c){if(c[0]&2049){r=s[11];let n;for(n=0;n<r.length;n+=1){const o=Rt(s,r,n);a[n]?a[n].p(o,c):(a[n]=St(o),a[n].c(),a[n].m(i.parentNode,i))}for(;n<a.length;n+=1)a[n].d(1);a.length=r.length}},d(s){s&&E(t),s&&E(l),qe(a,s),s&&E(i)}}}function St(e){let t,l=e[72].length+"",i,r,a,s;function c(){return e[42](e[72])}return{c(){t=b("button"),i=M(l),r=C(),d(t,"class","h-10 p-2 rounded-lg border-solid border-2"),q(t,"bg-green-600",e[0].matrix==e[72])},m(n,o){B(n,t,o),u(t,i),u(t,r),a||(s=T(t,"click",c),a=!0)},p(n,o){e=n,o[0]&2049&&q(t,"bg-green-600",e[0].matrix==e[72])},d(n){n&&E(t),a=!1,s()}}}function Tt(e){let t,l,i,r,a,s=e[10],c=[];for(let g=0;g<s.length;g+=1)c[g]=Nt(Pt(e,s,g));const n=g=>W(c[g],1,1,()=>{c[g]=null});let o=e[0].individual_pallette_colors,m=[];for(let g=0;g<o.length;g+=1)m[g]=Mt(Dt(e,o,g));const w=g=>W(m[g],1,1,()=>{m[g]=null});return{c(){t=b("div"),l=b("div");for(let g=0;g<c.length;g+=1)c[g].c();i=C(),r=b("div");for(let g=0;g<m.length;g+=1)m[g].c();d(l,"class","flex"),d(t,"class","bg-white text-black p-2"),d(r,"class","flex")},m(g,p){B(g,t,p),u(t,l);for(let f=0;f<c.length;f+=1)c[f].m(l,null);B(g,i,p),B(g,r,p);for(let f=0;f<m.length;f+=1)m[f].m(r,null);a=!0},p(g,p){if(p[0]&263169){s=g[10];let f;for(f=0;f<s.length;f+=1){const z=Pt(g,s,f);c[f]?(c[f].p(z,p),S(c[f],1)):(c[f]=Nt(z),c[f].c(),S(c[f],1),c[f].m(l,null))}for(Ie(),f=s.length;f<c.length;f+=1)n(f);Ee()}if(p[0]&1){o=g[0].individual_pallette_colors;let f;for(f=0;f<o.length;f+=1){const z=Dt(g,o,f);m[f]?(m[f].p(z,p),S(m[f],1)):(m[f]=Mt(z),m[f].c(),S(m[f],1),m[f].m(r,null))}for(Ie(),f=o.length;f<m.length;f+=1)w(f);Ee()}},i(g){if(!a){for(let p=0;p<s.length;p+=1)S(c[p]);for(let p=0;p<o.length;p+=1)S(m[p]);a=!0}},o(g){c=c.filter(Boolean);for(let p=0;p<c.length;p+=1)W(c[p]);m=m.filter(Boolean);for(let p=0;p<m.length;p+=1)W(m[p]);a=!1},d(g){g&&E(t),qe(c,g),g&&E(i),g&&E(r),qe(m,g)}}}function Nt(e){let t,l;function i(...r){return e[44](e[69],...r)}return t=new fl({props:{selected:e[0].pallette,name:e[69].name,color:e[69].colors}}),t.$on("click",i),{c(){ke(t.$$.fragment)},m(r,a){pe(t,r,a),l=!0},p(r,a){e=r;const s={};a[0]&1&&(s.selected=e[0].pallette),t.$set(s)},i(r){l||(S(t.$$.fragment,r),l=!0)},o(r){W(t.$$.fragment,r),l=!1},d(r){me(t,r)}}}function Mt(e){let t,l,i;function r(s){e[45](s,e[66])}let a={text:e[66].color,bgcolor:e[66].on?e[66].color:"white"};return e[66].on!==void 0&&(a.checked=e[66].on),t=new we({props:a}),he.push(()=>Re(t,"checked",r)),{c(){ke(t.$$.fragment)},m(s,c){pe(t,s,c),i=!0},p(s,c){e=s;const n={};c[0]&1&&(n.text=e[66].color),c[0]&1&&(n.bgcolor=e[66].on?e[66].color:"white"),!l&&c[0]&1&&(l=!0,n.checked=e[66].on,Pe(()=>l=!1)),t.$set(n)},i(s){i||(S(t.$$.fragment,s),i=!0)},o(s){W(t.$$.fragment,s),i=!1},d(s){me(t,s)}}}function Ot(e){let t,l,i,r,a,s,c,n,o,m,w,g=e[0].dithering=="pattern"&&Ft(e),p=e[0].dithering=="fs"&&Ut(e);return{c(){t=b("code"),l=M(e[9]),i=C(),r=b("input"),s=C(),g&&g.c(),c=C(),p&&p.c(),n=ht(),d(r,"type","range"),d(r,"min","-1"),d(r,"max",a=e[1].total_pixels),d(r,"step","1")},m(f,z){B(f,t,z),u(t,l),B(f,i,z),B(f,r,z),ge(r,e[0].debug_range),B(f,s,z),g&&g.m(f,z),B(f,c,z),p&&p.m(f,z),B(f,n,z),o=!0,m||(w=[T(r,"change",e[46]),T(r,"input",e[46])],m=!0)},p(f,z){(!o||z[0]&512)&&de(l,f[9]),(!o||z[0]&2&&a!==(a=f[1].total_pixels))&&d(r,"max",a),z[0]&1&&ge(r,f[0].debug_range),f[0].dithering=="pattern"?g?g.p(f,z):(g=Ft(f),g.c(),g.m(c.parentNode,c)):g&&(g.d(1),g=null),f[0].dithering=="fs"?p?(p.p(f,z),z[0]&1&&S(p,1)):(p=Ut(f),p.c(),S(p,1),p.m(n.parentNode,n)):p&&(Ie(),W(p,1,1,()=>{p=null}),Ee())},i(f){o||(S(p),o=!0)},o(f){W(p),o=!1},d(f){f&&E(t),f&&E(i),f&&E(r),f&&E(s),g&&g.d(f),f&&E(c),p&&p.d(f),f&&E(n),m=!1,ve(w)}}}function Ft(e){let t,l=e[0].matrix,i=[];for(let r=0;r<l.length;r+=1)i[r]=Lt(zt(e,l,r));return{c(){for(let r=0;r<i.length;r+=1)i[r].c();t=ht()},m(r,a){for(let s=0;s<i.length;s+=1)i[s].m(r,a);B(r,t,a)},p(r,a){if(a[0]&1){l=r[0].matrix;let s;for(s=0;s<l.length;s+=1){const c=zt(r,l,s);i[s]?i[s].p(c,a):(i[s]=Lt(c),i[s].c(),i[s].m(t.parentNode,t))}for(;s<i.length;s+=1)i[s].d(1);i.length=l.length}},d(r){qe(i,r),r&&E(t)}}}function At(e){let t,l,i=e[63]+"",r,a,s;function c(){e[47].call(t,e[64],e[65])}return{c(){t=b("input"),l=C(),r=M(i),d(t,"type","range"),d(t,"step","0.01"),d(t,"max","1.0"),d(t,"min","0.0")},m(n,o){B(n,t,o),ge(t,e[63]),B(n,l,o),B(n,r,o),a||(s=[T(t,"change",c),T(t,"input",c)],a=!0)},p(n,o){e=n,o[0]&1&&ge(t,e[63]),o[0]&1&&i!==(i=e[63]+"")&&de(r,i)},d(n){n&&E(t),n&&E(l),n&&E(r),a=!1,ve(s)}}}function Lt(e){let t,l,i=e[60],r=[];for(let a=0;a<i.length;a+=1)r[a]=At(yt(e,i,a));return{c(){t=b("div");for(let a=0;a<r.length;a+=1)r[a].c();l=C(),d(t,"class","flex")},m(a,s){B(a,t,s);for(let c=0;c<r.length;c+=1)r[c].m(t,null);u(t,l)},p(a,s){if(s[0]&1){i=a[60];let c;for(c=0;c<i.length;c+=1){const n=yt(a,i,c);r[c]?r[c].p(n,s):(r[c]=At(n),r[c].c(),r[c].m(t,l))}for(;c<r.length;c+=1)r[c].d(1);r.length=i.length}},d(a){a&&E(t),qe(r,a)}}}function Ut(e){let t,l,i;function r(s){e[48](s)}let a={text:"Cap"};return e[0].cap!==void 0&&(a.checked=e[0].cap),t=new we({props:a}),he.push(()=>Re(t,"checked",r)),{c(){ke(t.$$.fragment)},m(s,c){pe(t,s,c),i=!0},p(s,c){const n={};!l&&c[0]&1&&(l=!0,n.checked=s[0].cap,Pe(()=>l=!1)),t.$set(n)},i(s){i||(S(t.$$.fragment,s),i=!0)},o(s){W(t.$$.fragment,s),i=!1},d(s){me(t,s)}}}function qt(e){let t;return{c(){t=b("div"),t.textContent="Drop to load image",d(t,"class","rounded-lg border-solid border-2 p-8 text-white text-center m-auto w-fit")},m(l,i){B(l,t,i)},d(l){l&&E(t)}}}function jt(e){let t,l=e[1].resizedwidth+"",i,r,a=e[1].resizedheight+"",s,c,n=e[1].resizedwidth*e[1].resizedheight+"",o,m,w=e[1].resizedheight*e[1].resizedwidth/9+"",g,p,f,z,F;return{c(){t=M("Image Size: "),i=M(l),r=M(" x "),s=M(a),c=M(" = "),o=M(n),m=M(`\r
      | Total Rubiks: `),g=M(w),p=M(`\r
\r
      WIDTH: `),f=M(e[2]),z=M(`\r
      HEIGHT: `),F=M(e[4])},m(y,P){B(y,t,P),B(y,i,P),B(y,r,P),B(y,s,P),B(y,c,P),B(y,o,P),B(y,m,P),B(y,g,P),B(y,p,P),B(y,f,P),B(y,z,P),B(y,F,P)},p(y,P){P[0]&2&&l!==(l=y[1].resizedwidth+"")&&de(i,l),P[0]&2&&a!==(a=y[1].resizedheight+"")&&de(s,a),P[0]&2&&n!==(n=y[1].resizedwidth*y[1].resizedheight+"")&&de(o,n),P[0]&2&&w!==(w=y[1].resizedheight*y[1].resizedwidth/9+"")&&de(g,w),P[0]&4&&de(f,y[2]),P[0]&16&&de(F,y[4])},d(y){y&&E(t),y&&E(i),y&&E(r),y&&E(s),y&&E(c),y&&E(o),y&&E(m),y&&E(g),y&&E(p),y&&E(f),y&&E(z),y&&E(F)}}}function zl(e){let t,l,i,r,a,s,c,n,o,m,w,g,p,f,z,F,y,P,le,N,J,ne,ie,V,K,O,v,G,j,_e,Z,A,X,re,ye,Te,Ke,oe,Ne,Me,Ve,De,se,Oe,Fe,Qe,Xe,Y,Ae,Le,Ye,Ze,L,je,$e;function ot(h){e[27](h)}let xe={text:"debug"};e[1].show_debug!==void 0&&(xe.checked=e[1].show_debug),J=new we({props:xe}),he.push(()=>Re(J,"checked",ot));let $=e[1].current=="img"&&Ct(e),x=e[1].current=="rubiks"&&It(e),ue=e[1].current=="mockup"&&Et(e),ee=e[1].current=="processing"&&Bt(e),te=e[1].current=="pallette"&&Tt(e),_=e[1].show_debug&&Ot(e),D=!e[3]&&e[1].hovering&&qt(),k=e[1].resizedheight&&e[1].resizedwidth&&jt(e);return{c(){t=b("main"),l=b("div"),i=b("div"),r=b("div"),a=b("button"),a.textContent="Output Image",s=C(),c=b("button"),c.textContent="Pallette",n=C(),o=b("button"),o.textContent="Processing",m=C(),w=b("button"),w.textContent="Rubiks",g=C(),p=b("button"),p.textContent="Mock Up",f=C(),z=b("button"),z.textContent="Test",F=C(),y=b("button"),y.textContent="Screen Cap",P=M(`\r
        hello\r
        `),le=b("div"),N=C(),ke(J.$$.fragment),ie=C(),$&&$.c(),V=C(),x&&x.c(),K=C(),ue&&ue.c(),O=C(),ee&&ee.c(),v=C(),te&&te.c(),G=C(),_&&_.c(),j=C(),_e=b("div"),Z=b("div"),A=b("div"),X=b("div"),re=b("canvas"),Ke=C(),oe=b("canvas"),Ve=C(),De=b("div"),se=b("canvas"),Xe=C(),Y=b("canvas"),Ye=C(),D&&D.c(),Ze=C(),k&&k.c(),d(a,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),q(a,"bg-gray-400",e[1].current=="img"),d(c,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),q(c,"bg-gray-400",e[1].current=="pallette"),d(o,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),q(o,"bg-gray-400",e[1].current=="processing"),d(w,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),q(w,"bg-gray-400",e[1].current=="rubiks"),d(p,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),q(p,"bg-gray-400",e[1].current=="mockup"),d(le,"class","spacer svelte-7lre2h"),d(r,"class","flex"),d(i,"class","bg-white text-black p-2"),d(re,"class","small svelte-7lre2h"),d(re,"id","canvas"),d(re,"width",ye=e[1].canvaswidth),d(re,"height",Te=e[1].canvasheight),q(re,"shown",e[3]),q(re,"pixelated",e[0].pixelated),d(oe,"id","output_canvas"),d(oe,"width",Ne=e[1].resizedwidth),d(oe,"height",Me=e[1].resizedheight),d(oe,"class","svelte-7lre2h"),q(oe,"small",e[0].show_rubiks),q(oe,"shown",e[3]),q(oe,"pixelated",e[0].pixelated),be(se,"position","absolute"),d(se,"id","bgcanvas"),d(se,"width",Oe=e[1].mockupwidth),d(se,"height",Fe=e[1].mockupheight),d(se,"class","svelte-7lre2h"),rt(()=>e[52].call(se)),q(se,"shown",e[0].has_mockup),be(Y,"position","absolute"),be(Y,"top",e[4]/2-e[1].resizedheight*e[0].mockup_pixel_size*e[2]/e[1].mockupwidth/2+e[0].mockup_y*e[2]/e[1].mockupwidth+"px"),be(Y,"left",e[2]/2-e[1].resizedwidth*e[0].mockup_pixel_size*e[2]/e[1].mockupwidth/2+e[0].mockup_x*e[2]/e[1].mockupwidth+"px"),be(Y,"width",e[1].resizedwidth*e[0].mockup_pixel_size*e[2]/e[1].mockupwidth+"px"),d(Y,"id","rubiks_canvas"),d(Y,"width",Ae=e[1].resizedwidth*e[0].rubiks_scale),d(Y,"height",Le=e[1].resizedheight*e[0].rubiks_scale),d(Y,"class","svelte-7lre2h"),q(Y,"shown",e[3]&&e[0].show_rubiks),q(Y,"pixelated",e[0].pixelated),be(De,"position","relative"),d(De,"id","canvas_wrapper"),d(X,"class","flex-col"),d(A,"class","flex"),d(Z,"ondragover","return false"),d(Z,"id","drop_zone"),d(Z,"class","bg-white h-full"),d(_e,"class","bg-green-800 grow justify-center"),d(l,"class","flex flex-col bg-red-800 h-screen")},m(h,R){B(h,t,R),u(t,l),u(l,i),u(i,r),u(r,a),u(r,s),u(r,c),u(r,n),u(r,o),u(r,m),u(r,w),u(r,g),u(r,p),u(r,f),u(r,z),u(r,F),u(r,y),u(r,P),u(r,le),u(r,N),pe(J,r,null),u(l,ie),$&&$.m(l,null),u(l,V),x&&x.m(l,null),u(l,K),ue&&ue.m(l,null),u(l,O),ee&&ee.m(l,null),u(l,v),te&&te.m(l,null),u(l,G),_&&_.m(l,null),u(l,j),u(l,_e),u(_e,Z),u(Z,A),u(A,X),u(X,re),e[49](re),u(X,Ke),u(X,oe),e[50](oe),u(X,Ve),u(X,De),u(De,se),e[51](se),Qe=tl(se,e[52].bind(se)),u(De,Xe),u(De,Y),e[53](Y),u(Z,Ye),D&&D.m(Z,null),u(l,Ze),k&&k.m(l,null),L=!0,je||($e=[T(a,"click",e[21]),T(c,"click",e[22]),T(o,"click",e[23]),T(w,"click",e[24]),T(p,"click",e[25]),T(y,"click",e[26]),T(Z,"drop",e[12]),T(Z,"dragenter",e[13]),T(Z,"dragleave",e[14])],je=!0)},p(h,R){(!L||R[0]&2)&&q(a,"bg-gray-400",h[1].current=="img"),(!L||R[0]&2)&&q(c,"bg-gray-400",h[1].current=="pallette"),(!L||R[0]&2)&&q(o,"bg-gray-400",h[1].current=="processing"),(!L||R[0]&2)&&q(w,"bg-gray-400",h[1].current=="rubiks"),(!L||R[0]&2)&&q(p,"bg-gray-400",h[1].current=="mockup");const Be={};!ne&&R[0]&2&&(ne=!0,Be.checked=h[1].show_debug,Pe(()=>ne=!1)),J.$set(Be),h[1].current=="img"?$?($.p(h,R),R[0]&2&&S($,1)):($=Ct(h),$.c(),S($,1),$.m(l,V)):$&&(Ie(),W($,1,1,()=>{$=null}),Ee()),h[1].current=="rubiks"?x?(x.p(h,R),R[0]&2&&S(x,1)):(x=It(h),x.c(),S(x,1),x.m(l,K)):x&&(Ie(),W(x,1,1,()=>{x=null}),Ee()),h[1].current=="mockup"?ue?ue.p(h,R):(ue=Et(h),ue.c(),ue.m(l,O)):ue&&(ue.d(1),ue=null),h[1].current=="processing"?ee?(ee.p(h,R),R[0]&2&&S(ee,1)):(ee=Bt(h),ee.c(),S(ee,1),ee.m(l,v)):ee&&(Ie(),W(ee,1,1,()=>{ee=null}),Ee()),h[1].current=="pallette"?te?(te.p(h,R),R[0]&2&&S(te,1)):(te=Tt(h),te.c(),S(te,1),te.m(l,G)):te&&(Ie(),W(te,1,1,()=>{te=null}),Ee()),h[1].show_debug?_?(_.p(h,R),R[0]&2&&S(_,1)):(_=Ot(h),_.c(),S(_,1),_.m(l,j)):_&&(Ie(),W(_,1,1,()=>{_=null}),Ee()),(!L||R[0]&2&&ye!==(ye=h[1].canvaswidth))&&d(re,"width",ye),(!L||R[0]&2&&Te!==(Te=h[1].canvasheight))&&d(re,"height",Te),(!L||R[0]&8)&&q(re,"shown",h[3]),(!L||R[0]&1)&&q(re,"pixelated",h[0].pixelated),(!L||R[0]&2&&Ne!==(Ne=h[1].resizedwidth))&&d(oe,"width",Ne),(!L||R[0]&2&&Me!==(Me=h[1].resizedheight))&&d(oe,"height",Me),(!L||R[0]&1)&&q(oe,"small",h[0].show_rubiks),(!L||R[0]&8)&&q(oe,"shown",h[3]),(!L||R[0]&1)&&q(oe,"pixelated",h[0].pixelated),(!L||R[0]&2&&Oe!==(Oe=h[1].mockupwidth))&&d(se,"width",Oe),(!L||R[0]&2&&Fe!==(Fe=h[1].mockupheight))&&d(se,"height",Fe),(!L||R[0]&1)&&q(se,"shown",h[0].has_mockup),(!L||R[0]&23)&&be(Y,"top",h[4]/2-h[1].resizedheight*h[0].mockup_pixel_size*h[2]/h[1].mockupwidth/2+h[0].mockup_y*h[2]/h[1].mockupwidth+"px"),(!L||R[0]&7)&&be(Y,"left",h[2]/2-h[1].resizedwidth*h[0].mockup_pixel_size*h[2]/h[1].mockupwidth/2+h[0].mockup_x*h[2]/h[1].mockupwidth+"px"),(!L||R[0]&7)&&be(Y,"width",h[1].resizedwidth*h[0].mockup_pixel_size*h[2]/h[1].mockupwidth+"px"),(!L||R[0]&3&&Ae!==(Ae=h[1].resizedwidth*h[0].rubiks_scale))&&d(Y,"width",Ae),(!L||R[0]&3&&Le!==(Le=h[1].resizedheight*h[0].rubiks_scale))&&d(Y,"height",Le),(!L||R[0]&9)&&q(Y,"shown",h[3]&&h[0].show_rubiks),(!L||R[0]&1)&&q(Y,"pixelated",h[0].pixelated),!h[3]&&h[1].hovering?D||(D=qt(),D.c(),D.m(Z,null)):D&&(D.d(1),D=null),h[1].resizedheight&&h[1].resizedwidth?k?k.p(h,R):(k=jt(h),k.c(),k.m(l,null)):k&&(k.d(1),k=null)},i(h){L||(S(J.$$.fragment,h),S($),S(x),S(ee),S(te),S(_),L=!0)},o(h){W(J.$$.fragment,h),W($),W(x),W(ee),W(te),W(_),L=!1},d(h){h&&E(t),me(J),$&&$.d(),x&&x.d(),ue&&ue.d(),ee&&ee.d(),te&&te.d(),_&&_.d(),e[49](null),e[50](null),e[51](null),Qe(),e[53](null),D&&D.d(),k&&k.d(),je=!1,ve($e)}}}function yl(e,t,l){let i,r,a=!1,s=[{name:"rbk",colors:"#013082,#BB2328,#01B351,#FE8F25,#F5FF42,#ECF3F6"},{name:"rbkng",colors:"#013082,#BB2328,#FE8F25,#F5FF42,#ECF3F6"},{name:"b&w",colors:"#000,#fff"},{name:"gray",colors:"#000,#666,#fff"},{name:"grayscale",colors:"#000,#111,#222,#333,#444,#555,#666,#777,#888,#999,#aaa,#bbb,#ccc,#ddd,#eee,#fff"},{name:"rgb",colors:"#000,#f00,#0f0,#00f,#fff"},{name:"cmyk",colors:"#000,#0ff,#f0f,#ff0,#fff"}],c=[[[0/4,2/4],[3/4,1/4]],[[0/16,8/16,2/16,10/16],[12/16,4/16,14/16,6/16],[3/16,11/16,1/16,9/16],[15/16,7/16,13/16,5/16]]],n={loadedfile:"",cache:!0,cap:!1,pixelated:!0,has_mockup:!1,mockup_pixel_size:1,mockup_x:0,mockup_y:0,width:0,height:0,dithering:"pattern",max_width:600,show_rubiks:!0,show_grid:!1,rubiks_scale:8,gray_scale_input:!1,gray_scale_nearest_pixel:!1,grid_size:2,pallette:s[0].colors,individual_pallette_colors:[],debug_range:-1,matrix:c[0]},o={current:"",hovering:!1,mockup_hovering:!1,mockupheight:100,mockupwidth:100,show_debug:!1,resizedwidth:0,resizedheight:0,total_pixels:0,canvaswidth:100,canvasheight:100},m,w,g,p,f,z,F="",y={},P=function(_){_.preventDefault();let D=_;if(D.dataTransfer.items)if(D.dataTransfer.items.length==1){let k=D.dataTransfer.items[0];if(k.kind==="file"){const h=k.getAsFile();v(h)}else console.log("kind is not file, but: "+k.kind)}else l(9,r="Error: can only load one file");l(1,o.hovering=!1,o)},le=function(){console.log("drag enter"),l(1,o.hovering=!0,o)},N=function(){l(1,o.hovering=!1,o)},J=function(_){_.preventDefault();let D=_;if(D.dataTransfer.items)if(D.dataTransfer.items.length==1){let k=D.dataTransfer.items[0];if(k.kind==="file"){const h=k.getAsFile();l(0,n.has_mockup=!0,n),O(h)}else console.log("kind is not file, but: "+k.kind)}else l(9,r="Error: can only load one file");l(1,o.mockup_hovering=!1,o)},ne=function(){console.log("drag enter"),l(1,o.mockup_hovering=!0,o)},ie=function(){l(1,o.mockup_hovering=!1,o)},V,K,O=function(_){let D=p.getContext("2d");K=new Image,K.onload=async function(){await tt(),l(1,o.mockupheight=K.height,o),l(1,o.mockupwidth=K.width,o),await tt(),D.drawImage(K,0,0,K.width,K.height)},K.src=URL.createObjectURL(_)},v=function(_){l(0,n.loadedfile=_.name,n);let D=g.getContext("2d");V=new Image,V.onload=async function(){l(1,o.canvasheight=V.height,o),l(1,o.canvaswidth=V.width,o),l(0,n.width=Math.min(99,o.canvaswidth),n),l(0,n.max_width=Math.min(o.canvaswidth,999),n),l(3,a=!0),y={},await tt(),D.drawImage(V,0,0,V.width,V.height)},V.src=URL.createObjectURL(_)},G=function(_){l(0,n.pallette=_,n),l(0,n.individual_pallette_colors=[],n),_.split(",").forEach(D=>{n.individual_pallette_colors.push({color:D,on:!0})})},j=function(_){o.current==_?l(1,o.current="",o):l(1,o.current=_,o)};nl(async()=>{if(!n.width){console.log("no width, ending here");return}if(!a){console.log("no image loaded, ending here");return}if(!V){console.log("originalImage is empty","ending here");return}let _=o.canvasheight/o.canvaswidth*n.width;if(l(0,n.height=_,n),l(1,o.resizedwidth=parseInt(n.width/3)*3,o),l(1,o.resizedheight=parseInt(_/3)*3,o),l(1,o.total_pixels=o.resizedheight*o.resizedwidth,o),await tt(),_<1){console.log("height is less than 1","ending here");return}if(F=I.hashCode(JSON.stringify(i)),n.cache&&F&&y[F]){console.log("found",i.loadedfile,F,"from cache");let D=f.getContext("2d"),k=y[F].data,h=new ImageData(k.data,k.width,k.height);D.putImageData(h,0,0)}else{console.log("GENERATING IMAGE",JSON.stringify(i),F);let D=f.getContext("2d");D.drawImage(V,0,0,o.resizedwidth,o.resizedheight);let k=D.getImageData(0,0,o.resizedwidth,o.resizedheight);if(n.gray_scale_input)for(let U=0,ae=0;U<k.height;U++)for(let Q=0;Q<k.width;Q++,ae+=4){let Ue=I.getPixelDataRGB(k,Q,U),ze=Math.round((Ue.r+Ue.g+Ue.b)/3);I.setPixelDataRaw(k,ae,ze),I.setPixelDataRaw(k,ae+1,ze),I.setPixelDataRaw(k,ae+2,ze)}let h=n.pallette;n.individual_pallette_colors.length&&(h=n.individual_pallette_colors.filter(U=>U.on).map(U=>U.color).join(","));let R=h.split(",").length,Be=h.split(",");Be.forEach((U,ae)=>{Be[ae]=I.hexToRgb(U)});for(let U=0,ae=0;U<k.height;U++)for(let Q=0;Q<k.width;Q++,ae+=4){let Ue=I.getPixelDataRGB(k,Q,U),ze=I.nearestPixel2(Ue,Be,n.gray_scale_nearest_pixel);if(n.dithering=="")I.setPixelDataRaw(k,ae,ze.r),I.setPixelDataRaw(k,ae+1,ze.g),I.setPixelDataRaw(k,ae+2,ze.b);else if(n.dithering=="fs"){I.setPixelDataRaw(k,ae,ze.r),I.setPixelDataRaw(k,ae+1,ze.g),I.setPixelDataRaw(k,ae+2,ze.b);let H=I.pixelDiff(Ue,ze);if(Q<k.width-1){let ce=I.getPixelDataRGB(k,Q+1,U);n.cap?I.setPixelDataRGB(k,Q+1,U,{r:I.clamp(0,255,ce.r+H.r*7/16),g:I.clamp(0,255,ce.g+H.g*7/16),b:I.clamp(0,255,ce.b+H.b*7/16)}):I.setPixelDataRGB(k,Q+1,U,{r:ce.r+H.r*7/16,g:ce.g+H.g*7/16,b:ce.b+H.b*7/16})}if(U<k.height-1){if(Q>0){let fe=I.getPixelDataRGB(k,Q-1,U+1);n.cap?I.setPixelDataRGB(k,Q-1,U+1,{r:I.clamp(0,255,fe.r+H.r*3/16),g:I.clamp(0,255,fe.g+H.g*3/16),b:I.clamp(0,255,fe.b+H.b*3/16)}):I.setPixelDataRGB(k,Q-1,U+1,{r:fe.r+H.r*3/16,g:fe.g+H.g*3/16,b:fe.b+H.b*3/16})}let ce=I.getPixelDataRGB(k,Q,U+1);if(n.cap?I.setPixelDataRGB(k,Q,U+1,{r:I.clamp(0,255,ce.r+H.r*5/16),g:I.clamp(0,255,ce.g+H.g*5/16),b:I.clamp(0,255,ce.b+H.b*5/16)}):I.setPixelDataRGB(k,Q,U+1,{r:ce.r+H.r*5/16,g:ce.g+H.g*5/16,b:ce.b+H.b*5/16}),Q<k.width-1){let fe=I.getPixelDataRGB(k,Q+1,U+1);n.cap?I.setPixelDataRGB(k,Q+1,U+1,{r:I.clamp(0,255,fe.r+H.r*1/16),g:I.clamp(0,255,fe.g+H.g*1/16),b:I.clamp(0,255,fe.b+H.b*1/16)}):I.setPixelDataRGB(k,Q+1,U+1,{r:fe.r+H.r*1/16,g:fe.g+H.g*1/16,b:fe.b+H.b*1/16})}}}else if(n.dithering=="pattern"){let H=I.getPixelDataRGB(k,Q,U),ce=255/R*(n.matrix[Q%n.matrix[0].length][U%n.matrix.length]-.5),fe=I.nearestPixel2({r:H.r+ce,g:H.g+ce,b:H.b+ce},Be,n.gray_scale_nearest_pixel);I.setPixelDataRaw(k,ae,fe.r),I.setPixelDataRaw(k,ae+1,fe.g),I.setPixelDataRaw(k,ae+2,fe.b)}}if(D.putImageData(k,0,0),n.cache){let U=new ImageData(new Uint8ClampedArray(k.data),k.width,k.height);console.log("adding",F,"to cache"),y[F]={data:U,params:Object.assign({},i),config:Object.assign({},n)}}}if(n.show_rubiks){let D=z.getContext("2d"),h=f.getContext("2d").getImageData(0,0,o.resizedwidth,o.resizedheight);if(D.imageSmoothingEnabled=!1,D.drawImage(f,0,0,o.resizedwidth*n.rubiks_scale,o.resizedheight*n.rubiks_scale),n.show_grid&&n.grid_size>0){D.lineWidth=n.grid_size,D.strokeStyle="#000000";for(let R=0;R<h.height;R++)D.beginPath(),D.moveTo(0,R*n.rubiks_scale),D.lineTo(h.width*n.rubiks_scale,R*n.rubiks_scale),D.stroke();for(let R=0;R<h.width;R++)D.beginPath(),D.moveTo(R*n.rubiks_scale,0),D.lineTo(R*n.rubiks_scale,h.height*n.rubiks_scale),D.stroke()}}});const _e=()=>{j("img")},Z=()=>{j("pallette")},A=()=>{j("processing")},X=()=>{j("rubiks")},re=()=>{j("mockup")},ye=()=>{};function Te(_){e.$$.not_equal(o.show_debug,_)&&(o.show_debug=_,l(1,o))}function Ke(){n.width=Ce(this.value),l(0,n)}function oe(_){e.$$.not_equal(n.pixelated,_)&&(n.pixelated=_,l(0,n))}function Ne(_){e.$$.not_equal(n.cache,_)&&(n.cache=_,l(0,n))}function Me(_){e.$$.not_equal(n.show_rubiks,_)&&(n.show_rubiks=_,l(0,n))}function Ve(_){e.$$.not_equal(n.show_grid,_)&&(n.show_grid=_,l(0,n))}function De(){n.rubiks_scale=Ce(this.value),l(0,n)}function se(){n.grid_size=Ce(this.value),l(0,n)}function Oe(){n.mockup_pixel_size=Ce(this.value),l(0,n)}function Fe(){n.mockup_x=Ce(this.value),l(0,n)}function Qe(){n.mockup_y=Ce(this.value),l(0,n)}function Xe(_){e.$$.not_equal(n.gray_scale_input,_)&&(n.gray_scale_input=_,l(0,n))}function Y(_){e.$$.not_equal(n.gray_scale_nearest_pixel,_)&&(n.gray_scale_nearest_pixel=_,l(0,n))}const Ae=()=>l(0,n.dithering="",n),Le=()=>l(0,n.dithering="pattern",n),Ye=_=>{l(0,n.matrix=_,n)},Ze=()=>l(0,n.dithering="fs",n),L=(_,D,k)=>{G(_.colors)};function je(_,D){e.$$.not_equal(D.on,_)&&(D.on=_,l(0,n))}function $e(){n.debug_range=Ce(this.value),l(0,n)}function ot(_,D){_[D]=Ce(this.value),l(0,n)}function xe(_){e.$$.not_equal(n.cap,_)&&(n.cap=_,l(0,n))}function $(_){he[_?"unshift":"push"](()=>{g=_,l(5,g)})}function x(_){he[_?"unshift":"push"](()=>{f=_,l(7,f)})}function ue(_){he[_?"unshift":"push"](()=>{p=_,l(6,p)})}function ee(){w=this.clientHeight,m=this.clientWidth,l(4,w),l(2,m)}function te(_){he[_?"unshift":"push"](()=>{z=_,l(8,z)})}return e.$$.update=()=>{e.$$.dirty[0]&1&&l(20,i={loadedfile:n.loadedfile,width:n.width,height:n.height,dithering:n.dithering,gray_scale_input:n.gray_scale_input,gray_scale_nearest_pixel:n.gray_scale_nearest_pixel,pallette:n.pallette,individual_pallette_colors:n.individual_pallette_colors,matrix:n.matrix}),e.$$.dirty[0]&1048583&&l(9,r=("UI = "+JSON.stringify(o)+`
params: `+JSON.stringify(i)+`
CONFIG:`+JSON.stringify(n)+"CLIENT WIDTH:"+m).replaceAll(",",", "))},[n,o,m,a,w,g,p,f,z,r,s,c,P,le,N,J,ne,ie,G,j,i,_e,Z,A,X,re,ye,Te,Ke,oe,Ne,Me,Ve,De,se,Oe,Fe,Qe,Xe,Y,Ae,Le,Ye,Ze,L,je,$e,ot,xe,$,x,ue,ee,te]}class Dl extends pt{constructor(t){super(),_t(this,t,yl,zl,gt,{},null,[-1,-1,-1])}}new Dl({target:document.getElementById("app")});
