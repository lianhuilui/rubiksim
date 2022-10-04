(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const f of s)if(f.type==="childList")for(const h of f.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function l(s){const f={};return s.integrity&&(f.integrity=s.integrity),s.referrerpolicy&&(f.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?f.credentials="include":s.crossorigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function i(s){if(s.ep)return;s.ep=!0;const f=l(s);fetch(s.href,f)}})();function me(){}function ut(e){return e()}function Xe(){return Object.create(null)}function de(e){e.forEach(ut)}function _t(e){return typeof e=="function"}function He(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function pt(e){return Object.keys(e).length===0}function _(e,t){e.appendChild(t)}function G(e,t,l){e.insertBefore(t,l||null)}function $(e){e.parentNode.removeChild(e)}function Ge(e,t){for(let l=0;l<e.length;l+=1)e[l]&&e[l].d(t)}function w(e){return document.createElement(e)}function H(e){return document.createTextNode(e)}function P(){return H(" ")}function V(e,t,l,i){return e.addEventListener(t,l,i),()=>e.removeEventListener(t,l,i)}function p(e,t,l){l==null?e.removeAttribute(t):e.getAttribute(t)!==l&&e.setAttribute(t,l)}function Le(e){return e===""?null:+e}function bt(e){return Array.from(e.childNodes)}function ce(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function _e(e,t){e.value=t==null?"":t}function Ke(e,t,l,i){l===null?e.style.removeProperty(t):e.style.setProperty(t,l,i?"important":"")}function D(e,t,l){e.classList[l?"add":"remove"](t)}let Pe;function Se(e){Pe=e}function mt(){if(!Pe)throw new Error("Function called outside component initialization");return Pe}function kt(e){mt().$$.after_update.push(e)}function ct(e,t){const l=e.$$.callbacks[t.type];l&&l.slice().forEach(i=>i.call(this,t))}const Fe=[],oe=[],Ae=[],Ue=[],dt=Promise.resolve();let Je=!1;function gt(){Je||(Je=!0,dt.then(ht))}function De(){return gt(),dt}function We(e){Ae.push(e)}function ke(e){Ue.push(e)}const $e=new Set;let qe=0;function ht(){const e=Pe;do{for(;qe<Fe.length;){const t=Fe[qe];qe++,Se(t),wt(t.$$)}for(Se(null),Fe.length=0,qe=0;oe.length;)oe.pop()();for(let t=0;t<Ae.length;t+=1){const l=Ae[t];$e.has(l)||($e.add(l),l())}Ae.length=0}while(Fe.length);for(;Ue.length;)Ue.pop()();Je=!1,$e.clear(),Se(e)}function wt(e){if(e.fragment!==null){e.update(),de(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(We)}}const Me=new Set;let be;function Ce(){be={r:0,c:[],p:be}}function Ie(){be.r||de(be.c),be=be.p}function O(e,t){e&&e.i&&(Me.delete(e),e.i(t))}function R(e,t,l,i){if(e&&e.o){if(Me.has(e))return;Me.add(e),be.c.push(()=>{Me.delete(e),i&&(l&&e.d(1),i())}),e.o(t)}else i&&i()}function we(e,t,l){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=l,l(e.$$.ctx[i]))}function fe(e){e&&e.c()}function re(e,t,l,i){const{fragment:s,on_mount:f,on_destroy:h,after_update:a}=e.$$;s&&s.m(t,l),i||We(()=>{const g=f.map(ut).filter(_t);h?h.push(...g):de(g),e.$$.on_mount=[]}),a.forEach(We)}function se(e,t){const l=e.$$;l.fragment!==null&&(de(l.on_destroy),l.fragment&&l.fragment.d(t),l.on_destroy=l.fragment=null,l.ctx=[])}function vt(e,t){e.$$.dirty[0]===-1&&(Fe.push(e),gt(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Ve(e,t,l,i,s,f,h,a=[-1]){const g=Pe;Se(e);const o=e.$$={fragment:null,ctx:null,props:f,update:me,not_equal:s,bound:Xe(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(g?g.$$.context:[])),callbacks:Xe(),dirty:a,skip_bound:!1,root:t.target||g.$$.root};h&&h(o.root);let k=!1;if(o.ctx=l?l(e,t.props||{},(n,r,...b)=>{const d=b.length?b[0]:r;return o.ctx&&s(o.ctx[n],o.ctx[n]=d)&&(!o.skip_bound&&o.bound[n]&&o.bound[n](d),k&&vt(e,n)),r}):[],o.update(),k=!0,de(o.before_update),o.fragment=i?i(o.ctx):!1,t.target){if(t.hydrate){const n=bt(t.target);o.fragment&&o.fragment.l(n),n.forEach($)}else o.fragment&&o.fragment.c();t.intro&&O(e.$$.fragment),re(e,t.target,t.anchor,t.customElement),ht()}Se(g)}class Qe{$destroy(){se(this,1),this.$destroy=me}$on(t,l){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(l),()=>{const s=i.indexOf(l);s!==-1&&i.splice(s,1)}}$set(t){this.$$set&&!pt(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function zt(e){let t,l,i,s,f,h;return{c(){t=w("div"),l=H(e[1]),p(t,"style",i=e[0]&&e[2]?"background-color: "+e[2]+";":""),p(t,"class",s="h-10 p-2 "+(e[0]?e[3]:"")+" rounded-lg "+(e[0]?"border-solid":"border-none")+" border-2 text-center svelte-mesu7o")},m(a,g){G(a,t,g),_(t,l),f||(h=[V(t,"click",e[4]),V(t,"click",e[5])],f=!0)},p(a,[g]){g&2&&ce(l,a[1]),g&5&&i!==(i=a[0]&&a[2]?"background-color: "+a[2]+";":"")&&p(t,"style",i),g&9&&s!==(s="h-10 p-2 "+(a[0]?a[3]:"")+" rounded-lg "+(a[0]?"border-solid":"border-none")+" border-2 text-center svelte-mesu7o")&&p(t,"class",s)},i:me,o:me,d(a){a&&$(t),f=!1,de(h)}}}function yt(e,t,l){let{checked:i=!1}=t,{text:s="O"}=t,{bgcolor:f=""}=t,{toggleClass:h=f?"":"bg-green-600"}=t,a=()=>{console.log("toggle"),l(0,i=!i)};function g(o){ct.call(this,e,o)}return e.$$set=o=>{"checked"in o&&l(0,i=o.checked),"text"in o&&l(1,s=o.text),"bgcolor"in o&&l(2,f=o.bgcolor),"toggleClass"in o&&l(3,h=o.toggleClass)},[i,s,f,h,a,g]}class ue extends Qe{constructor(t){super(),Ve(this,t,yt,zt,He,{checked:0,text:1,bgcolor:2,toggleClass:3})}}function Ye(e,t,l){const i=e.slice();return i[5]=t[l],i}function Ze(e){let t,l;return{c(){t=w("span"),l=H("\xA0"),Ke(t,"background-color",e[5])},m(i,s){G(i,t,s),_(t,l)},p:me,d(i){i&&$(t)}}}function Ct(e){let t,l,i,s,f,h,a=e[3],g=[];for(let o=0;o<a.length;o+=1)g[o]=Ze(Ye(e,a,o));return{c(){t=w("button"),l=H(e[2]),i=P(),s=w("div");for(let o=0;o<g.length;o+=1)g[o].c();p(s,"class","svelte-63dooi"),p(t,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),D(t,"bg-green-600",e[1]==e[0])},m(o,k){G(o,t,k),_(t,l),_(t,i),_(t,s);for(let n=0;n<g.length;n+=1)g[n].m(s,null);f||(h=V(t,"click",e[4]),f=!0)},p(o,[k]){if(k&4&&ce(l,o[2]),k&8){a=o[3];let n;for(n=0;n<a.length;n+=1){const r=Ye(o,a,n);g[n]?g[n].p(r,k):(g[n]=Ze(r),g[n].c(),g[n].m(s,null))}for(;n<g.length;n+=1)g[n].d(1);g.length=a.length}k&3&&D(t,"bg-green-600",o[1]==o[0])},i:me,o:me,d(o){o&&$(t),Ge(g,o),f=!1,h()}}}function It(e,t,l){let{color:i=""}=t,{selected:s=""}=t,{name:f="default"}=t,h=i.split(",");function a(g){ct.call(this,e,g)}return e.$$set=g=>{"color"in g&&l(0,i=g.color),"selected"in g&&l(1,s=g.selected),"name"in g&&l(2,f=g.name)},[i,s,f,h,a]}class Et extends Qe{constructor(t){super(),Ve(this,t,It,Ct,He,{color:0,selected:1,name:2})}}function xe(e,t,l){const i=e.slice();return i[42]=t[l],i[43]=t,i[44]=l,i}function et(e,t,l){const i=e.slice();return i[45]=t[l],i}function tt(e){let t,l,i,s,f,h,a,g,o,k=e[0].width+"",n,r,b,d,z,X,q,Q,N;function U(T){e[19](T)}let x={text:"Pixelated"};return e[0].pixelated!==void 0&&(x.checked=e[0].pixelated),z=new ue({props:x}),oe.push(()=>we(z,"checked",U)),{c(){t=w("div"),l=w("div"),i=w("div"),s=w("span"),s.textContent="Width",f=P(),h=w("input"),g=P(),o=w("span"),n=H(k),r=P(),b=w("div"),d=w("div"),fe(z.$$.fragment),p(s,"class","svelte-oug5tb"),Ke(h,"flex","1"),p(h,"type","range"),p(h,"min","3"),p(h,"max",a=e[0].max_width),p(h,"step","3"),p(h,"class","svelte-oug5tb"),p(o,"class","svelte-oug5tb"),p(i,"class","flex slider-wrapper svelte-oug5tb"),p(d,"class","d-block"),p(b,"class","flex"),p(l,"class","flex flex-col"),p(t,"class","bg-white text-black p-2")},m(T,W){G(T,t,W),_(t,l),_(l,i),_(i,s),_(i,f),_(i,h),_e(h,e[0].width),_(i,g),_(i,o),_(o,n),_(l,r),_(l,b),_(b,d),re(z,d,null),q=!0,Q||(N=[V(h,"change",e[18]),V(h,"input",e[18])],Q=!0)},p(T,W){(!q||W[0]&1&&a!==(a=T[0].max_width))&&p(h,"max",a),W[0]&1&&_e(h,T[0].width),(!q||W[0]&1)&&k!==(k=T[0].width+"")&&ce(n,k);const L={};!X&&W[0]&1&&(X=!0,L.checked=T[0].pixelated,ke(()=>X=!1)),z.$set(L)},i(T){q||(O(z.$$.fragment,T),q=!0)},o(T){R(z.$$.fragment,T),q=!1},d(T){T&&$(t),se(z),Q=!1,de(N)}}}function lt(e){let t,l,i,s,f,h,a,g,o,k,n,r,b,d,z=e[0].rubiks_scale+"",X,q,Q,N,U,x,T,W=e[0].grid_size+"",L,I,j,J;function ae(B){e[20](B)}let le={text:"rubiks"};e[0].show_rubiks!==void 0&&(le.checked=e[0].show_rubiks),s=new ue({props:le}),oe.push(()=>we(s,"checked",ae));function ge(B){e[21](B)}let A={text:"Show Grid"};return e[0].show_grid!==void 0&&(A.checked=e[0].show_grid),a=new ue({props:A}),oe.push(()=>we(a,"checked",ge)),{c(){t=w("div"),l=w("div"),i=w("div"),fe(s.$$.fragment),h=P(),fe(a.$$.fragment),o=P(),k=w("div"),n=H(`Scale\r
            `),r=w("input"),b=P(),d=w("span"),X=H(z),q=P(),Q=w("span"),Q.textContent="\xA0",N=H(`\r
            Grid Size\r
            `),U=w("input"),x=P(),T=w("span"),L=H(W),p(i,"class","flex"),p(r,"type","range"),p(r,"max","40"),Ke(Q,"margin-left","10px"),p(U,"type","range"),p(U,"max","10"),p(k,"class","flex"),p(l,"class","flex flex-col"),p(t,"class","bg-white text-black p-2")},m(B,Z){G(B,t,Z),_(t,l),_(l,i),re(s,i,null),_(i,h),re(a,i,null),_(l,o),_(l,k),_(k,n),_(k,r),_e(r,e[0].rubiks_scale),_(k,b),_(k,d),_(d,X),_(k,q),_(k,Q),_(k,N),_(k,U),_e(U,e[0].grid_size),_(k,x),_(k,T),_(T,L),I=!0,j||(J=[V(r,"change",e[22]),V(r,"input",e[22]),V(U,"change",e[23]),V(U,"input",e[23])],j=!0)},p(B,Z){const pe={};!f&&Z[0]&1&&(f=!0,pe.checked=B[0].show_rubiks,ke(()=>f=!1)),s.$set(pe);const K={};!g&&Z[0]&1&&(g=!0,K.checked=B[0].show_grid,ke(()=>g=!1)),a.$set(K),Z[0]&1&&_e(r,B[0].rubiks_scale),(!I||Z[0]&1)&&z!==(z=B[0].rubiks_scale+"")&&ce(X,z),Z[0]&1&&_e(U,B[0].grid_size),(!I||Z[0]&1)&&W!==(W=B[0].grid_size+"")&&ce(L,W)},i(B){I||(O(s.$$.fragment,B),O(a.$$.fragment,B),I=!0)},o(B){R(s.$$.fragment,B),R(a.$$.fragment,B),I=!1},d(B){B&&$(t),se(s),se(a),j=!1,de(J)}}}function nt(e){let t,l,i,s,f,h,a,g,o,k,n,r,b,d,z,X,q,Q,N,U;function x(I){e[24](I)}let T={text:"Gray"};e[0].gray_scale_input!==void 0&&(T.checked=e[0].gray_scale_input),f=new ue({props:T}),oe.push(()=>we(f,"checked",x));function W(I){e[25](I)}let L={text:"Nearest Gray Pixel"};return e[0].gray_scale_nearest_pixel!==void 0&&(L.checked=e[0].gray_scale_nearest_pixel),n=new ue({props:L}),oe.push(()=>we(n,"checked",W)),z=new ue({props:{text:"No Dithering",checked:e[0].dithering==""}}),z.$on("click",e[26]),q=new ue({props:{text:"Patterned Dithering",checked:e[0].dithering=="pattern"}}),q.$on("click",e[27]),N=new ue({props:{text:"Floyd Steinberg",checked:e[0].dithering=="fs"}}),N.$on("click",e[28]),{c(){t=w("div"),l=w("div"),i=w("span"),i.textContent="Input Image",s=P(),fe(f.$$.fragment),a=P(),g=w("div"),o=w("span"),o.textContent="Nearest Pixel",k=P(),fe(n.$$.fragment),b=P(),d=w("div"),fe(z.$$.fragment),X=P(),fe(q.$$.fragment),Q=P(),fe(N.$$.fragment),p(i,"class","p-2"),p(l,"class","flex"),p(o,"class","p-2"),p(g,"class","flex"),p(d,"class","flex"),p(t,"class","bg-white text-black p-2")},m(I,j){G(I,t,j),_(t,l),_(l,i),_(l,s),re(f,l,null),_(t,a),_(t,g),_(g,o),_(g,k),re(n,g,null),_(t,b),_(t,d),re(z,d,null),_(d,X),re(q,d,null),_(d,Q),re(N,d,null),U=!0},p(I,j){const J={};!h&&j[0]&1&&(h=!0,J.checked=I[0].gray_scale_input,ke(()=>h=!1)),f.$set(J);const ae={};!r&&j[0]&1&&(r=!0,ae.checked=I[0].gray_scale_nearest_pixel,ke(()=>r=!1)),n.$set(ae);const le={};j[0]&1&&(le.checked=I[0].dithering==""),z.$set(le);const ge={};j[0]&1&&(ge.checked=I[0].dithering=="pattern"),q.$set(ge);const A={};j[0]&1&&(A.checked=I[0].dithering=="fs"),N.$set(A)},i(I){U||(O(f.$$.fragment,I),O(n.$$.fragment,I),O(z.$$.fragment,I),O(q.$$.fragment,I),O(N.$$.fragment,I),U=!0)},o(I){R(f.$$.fragment,I),R(n.$$.fragment,I),R(z.$$.fragment,I),R(q.$$.fragment,I),R(N.$$.fragment,I),U=!1},d(I){I&&$(t),se(f),se(n),se(z),se(q),se(N)}}}function it(e){let t,l,i,s,f,h=e[7],a=[];for(let r=0;r<h.length;r+=1)a[r]=rt(et(e,h,r));const g=r=>R(a[r],1,1,()=>{a[r]=null});let o=e[0].individual_pallette_colors,k=[];for(let r=0;r<o.length;r+=1)k[r]=st(xe(e,o,r));const n=r=>R(k[r],1,1,()=>{k[r]=null});return{c(){t=w("div"),l=w("div");for(let r=0;r<a.length;r+=1)a[r].c();i=P(),s=w("div");for(let r=0;r<k.length;r+=1)k[r].c();p(l,"class","flex"),p(t,"class","bg-white text-black p-2"),p(s,"class","flex")},m(r,b){G(r,t,b),_(t,l);for(let d=0;d<a.length;d+=1)a[d].m(l,null);G(r,i,b),G(r,s,b);for(let d=0;d<k.length;d+=1)k[d].m(s,null);f=!0},p(r,b){if(b[0]&2177){h=r[7];let d;for(d=0;d<h.length;d+=1){const z=et(r,h,d);a[d]?(a[d].p(z,b),O(a[d],1)):(a[d]=rt(z),a[d].c(),O(a[d],1),a[d].m(l,null))}for(Ce(),d=h.length;d<a.length;d+=1)g(d);Ie()}if(b[0]&1){o=r[0].individual_pallette_colors;let d;for(d=0;d<o.length;d+=1){const z=xe(r,o,d);k[d]?(k[d].p(z,b),O(k[d],1)):(k[d]=st(z),k[d].c(),O(k[d],1),k[d].m(s,null))}for(Ce(),d=o.length;d<k.length;d+=1)n(d);Ie()}},i(r){if(!f){for(let b=0;b<h.length;b+=1)O(a[b]);for(let b=0;b<o.length;b+=1)O(k[b]);f=!0}},o(r){a=a.filter(Boolean);for(let b=0;b<a.length;b+=1)R(a[b]);k=k.filter(Boolean);for(let b=0;b<k.length;b+=1)R(k[b]);f=!1},d(r){r&&$(t),Ge(a,r),r&&$(i),r&&$(s),Ge(k,r)}}}function rt(e){let t,l;function i(...s){return e[29](e[45],...s)}return t=new Et({props:{selected:e[0].pallette,name:e[45].name,color:e[45].colors}}),t.$on("click",i),{c(){fe(t.$$.fragment)},m(s,f){re(t,s,f),l=!0},p(s,f){e=s;const h={};f[0]&1&&(h.selected=e[0].pallette),t.$set(h)},i(s){l||(O(t.$$.fragment,s),l=!0)},o(s){R(t.$$.fragment,s),l=!1},d(s){se(t,s)}}}function st(e){let t,l,i;function s(h){e[30](h,e[42])}let f={text:e[42].color,bgcolor:e[42].on?e[42].color:"white"};return e[42].on!==void 0&&(f.checked=e[42].on),t=new ue({props:f}),oe.push(()=>we(t,"checked",s)),{c(){fe(t.$$.fragment)},m(h,a){re(t,h,a),i=!0},p(h,a){e=h;const g={};a[0]&1&&(g.text=e[42].color),a[0]&1&&(g.bgcolor=e[42].on?e[42].color:"white"),!l&&a[0]&1&&(l=!0,g.checked=e[42].on,ke(()=>l=!1)),t.$set(g)},i(h){i||(O(t.$$.fragment,h),i=!0)},o(h){R(t.$$.fragment,h),i=!1},d(h){se(t,h)}}}function ot(e){let t,l,i,s,f,h,a;return{c(){t=w("p"),l=H("debug: "),i=H(e[6]),s=P(),f=w("input"),p(f,"type","range"),p(f,"min","0"),p(f,"max","100"),p(f,"step","0.1")},m(g,o){G(g,t,o),_(t,l),_(t,i),G(g,s,o),G(g,f,o),_e(f,e[0].debug_range),h||(a=[V(f,"change",e[31]),V(f,"input",e[31])],h=!0)},p(g,o){o[0]&64&&ce(i,g[6]),o[0]&1&&_e(f,g[0].debug_range)},d(g){g&&$(t),g&&$(s),g&&$(f),h=!1,de(a)}}}function at(e){let t;return{c(){t=w("div"),t.textContent="Drop to load image",p(t,"class","rounded-lg border-solid border-2 p-8 text-white text-center m-auto w-fit")},m(l,i){G(l,t,i)},d(l){l&&$(t)}}}function ft(e){let t,l=e[1].resizedwidth+"",i,s,f=e[1].resizedheight+"",h,a,g=e[1].resizedwidth*e[1].resizedheight+"",o,k,n=e[1].resizedheight*e[1].resizedwidth/9+"",r;return{c(){t=H("Image Size: "),i=H(l),s=H(" x "),h=H(f),a=H(" = "),o=H(g),k=H(`\r
      | Total Rubiks: `),r=H(n)},m(b,d){G(b,t,d),G(b,i,d),G(b,s,d),G(b,h,d),G(b,a,d),G(b,o,d),G(b,k,d),G(b,r,d)},p(b,d){d[0]&2&&l!==(l=b[1].resizedwidth+"")&&ce(i,l),d[0]&2&&f!==(f=b[1].resizedheight+"")&&ce(h,f),d[0]&2&&g!==(g=b[1].resizedwidth*b[1].resizedheight+"")&&ce(o,g),d[0]&2&&n!==(n=b[1].resizedheight*b[1].resizedwidth/9+"")&&ce(r,n)},d(b){b&&$(t),b&&$(i),b&&$(s),b&&$(h),b&&$(a),b&&$(o),b&&$(k),b&&$(r)}}}function Ft(e){let t,l,i,s,f,h,a,g,o,k,n,r,b,d,z,X,q,Q,N,U,x,T,W,L,I,j,J,ae,le,ge,A,B,Z,pe,K,ve,ze,Te,Oe,M,Ee,Ne;function Re(m){e[17](m)}let Be={text:"debug"};e[1].show_debug!==void 0&&(Be.checked=e[1].show_debug),z=new ue({props:Be}),oe.push(()=>we(z,"checked",Re));let u=e[1].current=="img"&&tt(e),y=e[1].current=="rubiks"&&lt(e),c=e[1].current=="processing"&&nt(e),F=e[1].current=="pallette"&&it(e),v=e[1].show_debug&&ot(e),E=!e[2]&&e[1].hovering&&at(),S=e[1].resizedheight&&e[1].resizedwidth&&ft(e);return{c(){t=w("main"),l=w("div"),i=w("div"),s=w("div"),f=w("button"),f.textContent="Image",h=P(),a=w("button"),a.textContent="Pallette",g=P(),o=w("button"),o.textContent="Processing",k=P(),n=w("button"),n.textContent="Rubiks",r=P(),b=w("div"),d=P(),fe(z.$$.fragment),q=P(),u&&u.c(),Q=P(),y&&y.c(),N=P(),c&&c.c(),U=P(),F&&F.c(),x=P(),v&&v.c(),T=P(),W=w("div"),L=w("div"),I=w("div"),j=w("div"),J=w("canvas"),ge=P(),A=w("canvas"),pe=P(),K=w("canvas"),Te=P(),E&&E.c(),Oe=P(),S&&S.c(),p(f,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),D(f,"bg-gray-400",e[1].current=="img"),p(a,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),D(a,"bg-gray-400",e[1].current=="pallette"),p(o,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),D(o,"bg-gray-400",e[1].current=="processing"),p(n,"class","h-10 p-2 rounded-lg border-solid border-2 text-center"),D(n,"bg-gray-400",e[1].current=="rubiks"),p(b,"class","spacer svelte-oug5tb"),p(s,"class","flex"),p(i,"class","bg-white text-black p-2"),p(J,"class","small svelte-oug5tb"),p(J,"id","canvas"),p(J,"width",ae=e[1].canvaswidth),p(J,"height",le=e[1].canvasheight),D(J,"shown",e[2]),D(J,"pixelated",e[0].pixelated),p(A,"id","output_canvas"),p(A,"width",B=e[1].resizedwidth),p(A,"height",Z=e[1].resizedheight),p(A,"class","svelte-oug5tb"),D(A,"small",e[0].show_rubiks),D(A,"shown",e[2]),D(A,"pixelated",e[0].pixelated),p(K,"id","rubiks_canvas"),p(K,"width",ve=e[1].resizedwidth*e[0].rubiks_scale),p(K,"height",ze=e[1].resizedheight*e[0].rubiks_scale),p(K,"class","svelte-oug5tb"),D(K,"shown",e[2]&&e[0].show_rubiks),D(K,"pixelated",e[0].pixelated),p(j,"class","flex-col"),p(I,"class","flex"),p(L,"ondragover","return false"),p(L,"id","drop_zone"),p(L,"class","bg-black h-full"),p(W,"class","bg-green-800 grow justify-center"),p(l,"class","flex flex-col bg-red-800 h-screen")},m(m,C){G(m,t,C),_(t,l),_(l,i),_(i,s),_(s,f),_(s,h),_(s,a),_(s,g),_(s,o),_(s,k),_(s,n),_(s,r),_(s,b),_(s,d),re(z,s,null),_(l,q),u&&u.m(l,null),_(l,Q),y&&y.m(l,null),_(l,N),c&&c.m(l,null),_(l,U),F&&F.m(l,null),_(l,x),v&&v.m(l,null),_(l,T),_(l,W),_(W,L),_(L,I),_(I,j),_(j,J),e[32](J),_(j,ge),_(j,A),e[33](A),_(j,pe),_(j,K),e[34](K),_(L,Te),E&&E.m(L,null),_(l,Oe),S&&S.m(l,null),M=!0,Ee||(Ne=[V(f,"click",e[13]),V(a,"click",e[14]),V(o,"click",e[15]),V(n,"click",e[16]),V(L,"drop",e[8]),V(L,"dragenter",e[9]),V(L,"dragleave",e[10])],Ee=!0)},p(m,C){(!M||C[0]&2)&&D(f,"bg-gray-400",m[1].current=="img"),(!M||C[0]&2)&&D(a,"bg-gray-400",m[1].current=="pallette"),(!M||C[0]&2)&&D(o,"bg-gray-400",m[1].current=="processing"),(!M||C[0]&2)&&D(n,"bg-gray-400",m[1].current=="rubiks");const ne={};!X&&C[0]&2&&(X=!0,ne.checked=m[1].show_debug,ke(()=>X=!1)),z.$set(ne),m[1].current=="img"?u?(u.p(m,C),C[0]&2&&O(u,1)):(u=tt(m),u.c(),O(u,1),u.m(l,Q)):u&&(Ce(),R(u,1,1,()=>{u=null}),Ie()),m[1].current=="rubiks"?y?(y.p(m,C),C[0]&2&&O(y,1)):(y=lt(m),y.c(),O(y,1),y.m(l,N)):y&&(Ce(),R(y,1,1,()=>{y=null}),Ie()),m[1].current=="processing"?c?(c.p(m,C),C[0]&2&&O(c,1)):(c=nt(m),c.c(),O(c,1),c.m(l,U)):c&&(Ce(),R(c,1,1,()=>{c=null}),Ie()),m[1].current=="pallette"?F?(F.p(m,C),C[0]&2&&O(F,1)):(F=it(m),F.c(),O(F,1),F.m(l,x)):F&&(Ce(),R(F,1,1,()=>{F=null}),Ie()),m[1].show_debug?v?v.p(m,C):(v=ot(m),v.c(),v.m(l,T)):v&&(v.d(1),v=null),(!M||C[0]&2&&ae!==(ae=m[1].canvaswidth))&&p(J,"width",ae),(!M||C[0]&2&&le!==(le=m[1].canvasheight))&&p(J,"height",le),(!M||C[0]&4)&&D(J,"shown",m[2]),(!M||C[0]&1)&&D(J,"pixelated",m[0].pixelated),(!M||C[0]&2&&B!==(B=m[1].resizedwidth))&&p(A,"width",B),(!M||C[0]&2&&Z!==(Z=m[1].resizedheight))&&p(A,"height",Z),(!M||C[0]&1)&&D(A,"small",m[0].show_rubiks),(!M||C[0]&4)&&D(A,"shown",m[2]),(!M||C[0]&1)&&D(A,"pixelated",m[0].pixelated),(!M||C[0]&3&&ve!==(ve=m[1].resizedwidth*m[0].rubiks_scale))&&p(K,"width",ve),(!M||C[0]&3&&ze!==(ze=m[1].resizedheight*m[0].rubiks_scale))&&p(K,"height",ze),(!M||C[0]&5)&&D(K,"shown",m[2]&&m[0].show_rubiks),(!M||C[0]&1)&&D(K,"pixelated",m[0].pixelated),!m[2]&&m[1].hovering?E||(E=at(),E.c(),E.m(L,null)):E&&(E.d(1),E=null),m[1].resizedheight&&m[1].resizedwidth?S?S.p(m,C):(S=ft(m),S.c(),S.m(l,null)):S&&(S.d(1),S=null)},i(m){M||(O(z.$$.fragment,m),O(u),O(y),O(c),O(F),M=!0)},o(m){R(z.$$.fragment,m),R(u),R(y),R(c),R(F),M=!1},d(m){m&&$(t),se(z),u&&u.d(),y&&y.d(),c&&c.d(),F&&F.d(),v&&v.d(),e[32](null),e[33](null),e[34](null),E&&E.d(),S&&S.d(),Ee=!1,de(Ne)}}}function je(e,t){return{r:e.r-t.r,g:e.g-t.g,b:e.b-t.b}}function St(e,t,l){let i,s=!1,f=[{name:"rbk",colors:"#013082,#BB2328,#01B351,#FE8F25,#F5FF42,#ECF3F6"},{name:"rbkng",colors:"#013082,#BB2328,#FE8F25,#F5FF42,#ECF3F6"},{name:"b&w",colors:"#000,#fff"},{name:"gray",colors:"#000,#888,#fff"},{name:"rgb",colors:"#000,#f00,#0f0,#00f,#fff"},{name:"cmyk",colors:"#000,#0ff,#f0f,#ff0,#fff"}],h=function(u){if(u.length==4){let[v,E,S,m]=u.split("");u="#"+E+E+S+S+m+m}let y=parseInt(u.substring(1,3),16),c=parseInt(u.substring(3,5),16),F=parseInt(u.substring(5,7),16);return{r:y,g:c,b:F}},a=function(u){return"#"+u.r.toString(16).padStart(2,"0")+u.g.toString(16).padStart(2,"0")+u.b.toString(16).padStart(2,"0")},g=function(u){return Math.floor((u.r+u.g+u.b)/3)},o=function(u){let y=g(u);return{r:y,g:y,b:y}},k=function(u,y){let c=y.split(","),F=c[0],v=null;return c.forEach((E,S)=>{let m=h(E),C=n.gray_scale_nearest_pixel?je(o(m),u):je(m,u),ne,ie,ye,he;ne=Math.abs(C.r),ie=Math.abs(C.g),ye=Math.abs(C.b),he=ne*ne+ye*ye+ie*ie,(v==null||v>he)&&(v=he,F=m)}),F},n={pixelated:!0,width:0,dithering:"fs",max_width:999,show_rubiks:!0,show_grid:!0,rubiks_scale:8,gray_scale_input:!1,gray_scale_nearest_pixel:!1,grid_size:2,pallette:f[0].colors,individual_pallette_colors:[],debug_range:100},r={current:"",hovering:!1,show_debug:!1,resizedwidth:0,resizedheight:0,canvaswidth:100,canvasheight:100},b,d,z,X=function(u){u.preventDefault();let y=u;if(y.dataTransfer.items)if(y.dataTransfer.items.length==1){let c=y.dataTransfer.items[0];if(c.kind==="file"){const F=c.getAsFile();U(F)}else console.log("kind is not file, but: "+c.kind)}else l(6,i="Error: can only load one file");l(1,r.hovering=!1,r)},q=function(){console.log("drag enter"),l(1,r.hovering=!0,r)},Q=function(){l(1,r.hovering=!1,r)},N,U=function(u){console.log(u);let y=b.getContext("2d");N=new Image,N.onload=async function(){l(1,r.canvasheight=N.height,r),l(1,r.canvaswidth=N.width,r),l(0,n.width=Math.min(99,r.canvaswidth),n),l(0,n.max_width=Math.min(r.canvaswidth,999),n),l(2,s=!0),await De(),y.drawImage(N,0,0,N.width,N.height)},N.src=URL.createObjectURL(u)},x=function(u){l(0,n.pallette=u,n),l(0,n.individual_pallette_colors=[],n),u.split(",").forEach(y=>{n.individual_pallette_colors.push({color:y,on:!0})})},T=function(u){r.current==u?l(1,r.current="",r):l(1,r.current=u,r)};kt(async()=>{if(n.width&&s&&N){let u=d.getContext("2d"),y=r.canvasheight/r.canvaswidth*n.width;l(1,r.resizedwidth=parseInt(n.width/3)*3,r),l(1,r.resizedheight=parseInt(y/3)*3,r),await De(),u.drawImage(N,0,0,r.resizedwidth,r.resizedheight),await De();let c=u.getImageData(0,0,r.resizedwidth,r.resizedheight);if(n.gray_scale_input)for(let v=0;v<c.height;v++)for(let E=0;E<c.width;E++){let S=(v*r.resizedwidth+E)*4,m=c.data[S+0],C=c.data[S+1],ne=c.data[S+2],ie=Math.round((m+C+ne)/3);c.data[S]=ie,c.data[S+1]=ie,c.data[S+2]=ie}for(let v=0;v<c.height;v++)for(let E=0;E<c.width;E++){let S=(v*r.resizedwidth+E)*4;if(r.show_debug&&n.debug_range<100&&S/c.data.length*100>n.debug_range)break;let m=c.data[S+0],C=c.data[S+1],ne=c.data[S+2];c.data[S+3];let ie={r:m,g:C,b:ne},ye=n.pallette;n.individual_pallette_colors.length&&(ye=n.individual_pallette_colors.filter(Y=>Y.on).map(Y=>Y.color).join(","));let he=k(ie,ye);if(c.data[S]=he.r,c.data[S+1]=he.g,c.data[S+2]=he.b,n.dithering=="fs"){let Y=je(ie,he);if(E<c.width-1){let ee=(v*r.resizedwidth+E+1)*4;c.data[ee]=c.data[ee]+Y.r*7/16,c.data[ee+1]=c.data[ee+1]+Y.g*7/16,c.data[ee+2]=c.data[ee+2]+Y.b*7/16}if(v<c.height-1){if(E>0){let te=((v+1)*r.resizedwidth+E-1)*4;c.data[te]=c.data[te]+Y.r*3/16,c.data[te+1]=c.data[te+1]+Y.g*3/16,c.data[te+2]=c.data[te+2]+Y.b*3/16}let ee=((v+1)*r.resizedwidth+E)*4;if(c.data[ee]=c.data[ee]+Y.r*5/16,c.data[ee+1]=c.data[ee+1]+Y.g*5/16,c.data[ee+2]=c.data[ee+2]+Y.b*5/16,E<c.width-1){let te=((v+1)*r.resizedwidth+E+1)*4;c.data[te]=c.data[te]+Y.r*1/16,c.data[te+1]=c.data[te+1]+Y.g*1/16,c.data[te+2]=c.data[te+2]+Y.b*1/16}}}}u.putImageData(c,0,0),await De();let F=z.getContext("2d");for(let v=0;v<c.height;v++)for(let E=0;E<c.width;E++){let S="#ffffff",m=(v*c.width+E)*4,C=c.data[m+0],ne=c.data[m+1],ie=c.data[m+2];S=a({r:C,g:ne,b:ie}),F.fillStyle=S,F.fillRect(E*n.rubiks_scale,v*n.rubiks_scale,E+n.rubiks_scale+1,v+n.rubiks_scale+1)}if(n.show_grid&&n.grid_size>0){F.lineWidth=n.grid_size,F.strokeStyle="#000000";for(let v=0;v<c.height;v++)F.beginPath(),F.moveTo(0,v*n.rubiks_scale),F.lineTo(c.width*n.rubiks_scale,v*n.rubiks_scale),F.stroke();for(let v=0;v<c.width;v++)F.beginPath(),F.moveTo(v*n.rubiks_scale,0),F.lineTo(v*n.rubiks_scale,c.height*n.rubiks_scale),F.stroke()}}});const W=()=>{T("img")},L=()=>{T("pallette")},I=()=>{T("processing")},j=()=>{T("rubiks")};function J(u){e.$$.not_equal(r.show_debug,u)&&(r.show_debug=u,l(1,r))}function ae(){n.width=Le(this.value),l(0,n)}function le(u){e.$$.not_equal(n.pixelated,u)&&(n.pixelated=u,l(0,n))}function ge(u){e.$$.not_equal(n.show_rubiks,u)&&(n.show_rubiks=u,l(0,n))}function A(u){e.$$.not_equal(n.show_grid,u)&&(n.show_grid=u,l(0,n))}function B(){n.rubiks_scale=Le(this.value),l(0,n)}function Z(){n.grid_size=Le(this.value),l(0,n)}function pe(u){e.$$.not_equal(n.gray_scale_input,u)&&(n.gray_scale_input=u,l(0,n))}function K(u){e.$$.not_equal(n.gray_scale_nearest_pixel,u)&&(n.gray_scale_nearest_pixel=u,l(0,n))}const ve=()=>l(0,n.dithering="",n),ze=()=>l(0,n.dithering="pattern",n),Te=()=>l(0,n.dithering="fs",n),Oe=(u,y,c)=>{x(u.colors)};function M(u,y){e.$$.not_equal(y.on,u)&&(y.on=u,l(0,n))}function Ee(){n.debug_range=Le(this.value),l(0,n)}function Ne(u){oe[u?"unshift":"push"](()=>{b=u,l(3,b)})}function Re(u){oe[u?"unshift":"push"](()=>{d=u,l(4,d)})}function Be(u){oe[u?"unshift":"push"](()=>{z=u,l(5,z)})}return e.$$.update=()=>{e.$$.dirty[0]&3&&l(6,i=("UI = "+JSON.stringify(r)+`
CONFIG:`+JSON.stringify(n)).replaceAll(",",", "))},[n,r,s,b,d,z,i,f,X,q,Q,x,T,W,L,I,j,J,ae,le,ge,A,B,Z,pe,K,ve,ze,Te,Oe,M,Ee,Ne,Re,Be]}class Pt extends Qe{constructor(t){super(),Ve(this,t,St,Ft,He,{},null,[-1,-1])}}new Pt({target:document.getElementById("app")});
