(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const f of document.querySelectorAll('link[rel="modulepreload"]'))u(f);new MutationObserver(f=>{for(const p of f)if(p.type==="childList")for(const m of p.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&u(m)}).observe(document,{childList:!0,subtree:!0});function c(f){const p={};return f.integrity&&(p.integrity=f.integrity),f.referrerPolicy&&(p.referrerPolicy=f.referrerPolicy),f.crossOrigin==="use-credentials"?p.credentials="include":f.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function u(f){if(f.ep)return;f.ep=!0;const p=c(f);fetch(f.href,p)}})();var su={exports:{}},Xi={};var Zg;function my(){if(Zg)return Xi;Zg=1;var i=Symbol.for("react.transitional.element"),o=Symbol.for("react.fragment");function c(u,f,p){var m=null;if(p!==void 0&&(m=""+p),f.key!==void 0&&(m=""+f.key),"key"in f){p={};for(var b in f)b!=="key"&&(p[b]=f[b])}else p=f;return f=p.ref,{$$typeof:i,type:u,key:m,ref:f!==void 0?f:null,props:p}}return Xi.Fragment=o,Xi.jsx=c,Xi.jsxs=c,Xi}var Jg;function hy(){return Jg||(Jg=1,su.exports=my()),su.exports}var a=hy(),cu={exports:{}},Ee={};var e0;function by(){if(e0)return Ee;e0=1;var i=Symbol.for("react.transitional.element"),o=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),p=Symbol.for("react.consumer"),m=Symbol.for("react.context"),b=Symbol.for("react.forward_ref"),x=Symbol.for("react.suspense"),h=Symbol.for("react.memo"),S=Symbol.for("react.lazy"),w=Symbol.for("react.activity"),N=Symbol.iterator;function L(v){return v===null||typeof v!="object"?null:(v=N&&v[N]||v["@@iterator"],typeof v=="function"?v:null)}var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},U=Object.assign,C={};function T(v,k,te){this.props=v,this.context=k,this.refs=C,this.updater=te||B}T.prototype.isReactComponent={},T.prototype.setState=function(v,k){if(typeof v!="object"&&typeof v!="function"&&v!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,v,k,"setState")},T.prototype.forceUpdate=function(v){this.updater.enqueueForceUpdate(this,v,"forceUpdate")};function E(){}E.prototype=T.prototype;function D(v,k,te){this.props=v,this.context=k,this.refs=C,this.updater=te||B}var Q=D.prototype=new E;Q.constructor=D,U(Q,T.prototype),Q.isPureReactComponent=!0;var q=Array.isArray;function J(){}var M={H:null,A:null,T:null,S:null},$=Object.prototype.hasOwnProperty;function W(v,k,te){var X=te.ref;return{$$typeof:i,type:v,key:k,ref:X!==void 0?X:null,props:te}}function F(v,k){return W(v.type,k,v.props)}function V(v){return typeof v=="object"&&v!==null&&v.$$typeof===i}function A(v){var k={"=":"=0",":":"=2"};return"$"+v.replace(/[=:]/g,function(te){return k[te]})}var Y=/\/+/g;function ie(v,k){return typeof v=="object"&&v!==null&&v.key!=null?A(""+v.key):k.toString(36)}function O(v){switch(v.status){case"fulfilled":return v.value;case"rejected":throw v.reason;default:switch(typeof v.status=="string"?v.then(J,J):(v.status="pending",v.then(function(k){v.status==="pending"&&(v.status="fulfilled",v.value=k)},function(k){v.status==="pending"&&(v.status="rejected",v.reason=k)})),v.status){case"fulfilled":return v.value;case"rejected":throw v.reason}}throw v}function j(v,k,te,X,le){var ge=typeof v;(ge==="undefined"||ge==="boolean")&&(v=null);var de=!1;if(v===null)de=!0;else switch(ge){case"bigint":case"string":case"number":de=!0;break;case"object":switch(v.$$typeof){case i:case o:de=!0;break;case S:return de=v._init,j(de(v._payload),k,te,X,le)}}if(de)return le=le(v),de=X===""?"."+ie(v,0):X,q(le)?(te="",de!=null&&(te=de.replace(Y,"$&/")+"/"),j(le,k,te,"",function(ue){return ue})):le!=null&&(V(le)&&(le=F(le,te+(le.key==null||v&&v.key===le.key?"":(""+le.key).replace(Y,"$&/")+"/")+de)),k.push(le)),1;de=0;var ae=X===""?".":X+":";if(q(v))for(var pe=0;pe<v.length;pe++)X=v[pe],ge=ae+ie(X,pe),de+=j(X,k,te,ge,le);else if(pe=L(v),typeof pe=="function")for(v=pe.call(v),pe=0;!(X=v.next()).done;)X=X.value,ge=ae+ie(X,pe++),de+=j(X,k,te,ge,le);else if(ge==="object"){if(typeof v.then=="function")return j(O(v),k,te,X,le);throw k=String(v),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(v).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.")}return de}function K(v,k,te){if(v==null)return v;var X=[],le=0;return j(v,X,"","",function(ge){return k.call(te,ge,le++)}),X}function I(v){if(v._status===-1){var k=v._result;k=k(),k.then(function(te){(v._status===0||v._status===-1)&&(v._status=1,v._result=te)},function(te){(v._status===0||v._status===-1)&&(v._status=2,v._result=te)}),v._status===-1&&(v._status=0,v._result=k)}if(v._status===1)return v._result.default;throw v._result}var R=typeof reportError=="function"?reportError:function(v){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var k=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof v=="object"&&v!==null&&typeof v.message=="string"?String(v.message):String(v),error:v});if(!window.dispatchEvent(k))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",v);return}console.error(v)},H={map:K,forEach:function(v,k,te){K(v,function(){k.apply(this,arguments)},te)},count:function(v){var k=0;return K(v,function(){k++}),k},toArray:function(v){return K(v,function(k){return k})||[]},only:function(v){if(!V(v))throw Error("React.Children.only expected to receive a single React element child.");return v}};return Ee.Activity=w,Ee.Children=H,Ee.Component=T,Ee.Fragment=c,Ee.Profiler=f,Ee.PureComponent=D,Ee.StrictMode=u,Ee.Suspense=x,Ee.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=M,Ee.__COMPILER_RUNTIME={__proto__:null,c:function(v){return M.H.useMemoCache(v)}},Ee.cache=function(v){return function(){return v.apply(null,arguments)}},Ee.cacheSignal=function(){return null},Ee.cloneElement=function(v,k,te){if(v==null)throw Error("The argument must be a React element, but you passed "+v+".");var X=U({},v.props),le=v.key;if(k!=null)for(ge in k.key!==void 0&&(le=""+k.key),k)!$.call(k,ge)||ge==="key"||ge==="__self"||ge==="__source"||ge==="ref"&&k.ref===void 0||(X[ge]=k[ge]);var ge=arguments.length-2;if(ge===1)X.children=te;else if(1<ge){for(var de=Array(ge),ae=0;ae<ge;ae++)de[ae]=arguments[ae+2];X.children=de}return W(v.type,le,X)},Ee.createContext=function(v){return v={$$typeof:m,_currentValue:v,_currentValue2:v,_threadCount:0,Provider:null,Consumer:null},v.Provider=v,v.Consumer={$$typeof:p,_context:v},v},Ee.createElement=function(v,k,te){var X,le={},ge=null;if(k!=null)for(X in k.key!==void 0&&(ge=""+k.key),k)$.call(k,X)&&X!=="key"&&X!=="__self"&&X!=="__source"&&(le[X]=k[X]);var de=arguments.length-2;if(de===1)le.children=te;else if(1<de){for(var ae=Array(de),pe=0;pe<de;pe++)ae[pe]=arguments[pe+2];le.children=ae}if(v&&v.defaultProps)for(X in de=v.defaultProps,de)le[X]===void 0&&(le[X]=de[X]);return W(v,ge,le)},Ee.createRef=function(){return{current:null}},Ee.forwardRef=function(v){return{$$typeof:b,render:v}},Ee.isValidElement=V,Ee.lazy=function(v){return{$$typeof:S,_payload:{_status:-1,_result:v},_init:I}},Ee.memo=function(v,k){return{$$typeof:h,type:v,compare:k===void 0?null:k}},Ee.startTransition=function(v){var k=M.T,te={};M.T=te;try{var X=v(),le=M.S;le!==null&&le(te,X),typeof X=="object"&&X!==null&&typeof X.then=="function"&&X.then(J,R)}catch(ge){R(ge)}finally{k!==null&&te.types!==null&&(k.types=te.types),M.T=k}},Ee.unstable_useCacheRefresh=function(){return M.H.useCacheRefresh()},Ee.use=function(v){return M.H.use(v)},Ee.useActionState=function(v,k,te){return M.H.useActionState(v,k,te)},Ee.useCallback=function(v,k){return M.H.useCallback(v,k)},Ee.useContext=function(v){return M.H.useContext(v)},Ee.useDebugValue=function(){},Ee.useDeferredValue=function(v,k){return M.H.useDeferredValue(v,k)},Ee.useEffect=function(v,k){return M.H.useEffect(v,k)},Ee.useEffectEvent=function(v){return M.H.useEffectEvent(v)},Ee.useId=function(){return M.H.useId()},Ee.useImperativeHandle=function(v,k,te){return M.H.useImperativeHandle(v,k,te)},Ee.useInsertionEffect=function(v,k){return M.H.useInsertionEffect(v,k)},Ee.useLayoutEffect=function(v,k){return M.H.useLayoutEffect(v,k)},Ee.useMemo=function(v,k){return M.H.useMemo(v,k)},Ee.useOptimistic=function(v,k){return M.H.useOptimistic(v,k)},Ee.useReducer=function(v,k,te){return M.H.useReducer(v,k,te)},Ee.useRef=function(v){return M.H.useRef(v)},Ee.useState=function(v){return M.H.useState(v)},Ee.useSyncExternalStore=function(v,k,te){return M.H.useSyncExternalStore(v,k,te)},Ee.useTransition=function(){return M.H.useTransition()},Ee.version="19.2.3",Ee}var t0;function Gu(){return t0||(t0=1,cu.exports=by()),cu.exports}var d=Gu(),uu={exports:{}},Qi={},du={exports:{}},fu={};var n0;function yy(){return n0||(n0=1,(function(i){function o(j,K){var I=j.length;j.push(K);e:for(;0<I;){var R=I-1>>>1,H=j[R];if(0<f(H,K))j[R]=K,j[I]=H,I=R;else break e}}function c(j){return j.length===0?null:j[0]}function u(j){if(j.length===0)return null;var K=j[0],I=j.pop();if(I!==K){j[0]=I;e:for(var R=0,H=j.length,v=H>>>1;R<v;){var k=2*(R+1)-1,te=j[k],X=k+1,le=j[X];if(0>f(te,I))X<H&&0>f(le,te)?(j[R]=le,j[X]=I,R=X):(j[R]=te,j[k]=I,R=k);else if(X<H&&0>f(le,I))j[R]=le,j[X]=I,R=X;else break e}}return K}function f(j,K){var I=j.sortIndex-K.sortIndex;return I!==0?I:j.id-K.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var p=performance;i.unstable_now=function(){return p.now()}}else{var m=Date,b=m.now();i.unstable_now=function(){return m.now()-b}}var x=[],h=[],S=1,w=null,N=3,L=!1,B=!1,U=!1,C=!1,T=typeof setTimeout=="function"?setTimeout:null,E=typeof clearTimeout=="function"?clearTimeout:null,D=typeof setImmediate<"u"?setImmediate:null;function Q(j){for(var K=c(h);K!==null;){if(K.callback===null)u(h);else if(K.startTime<=j)u(h),K.sortIndex=K.expirationTime,o(x,K);else break;K=c(h)}}function q(j){if(U=!1,Q(j),!B)if(c(x)!==null)B=!0,J||(J=!0,A());else{var K=c(h);K!==null&&O(q,K.startTime-j)}}var J=!1,M=-1,$=5,W=-1;function F(){return C?!0:!(i.unstable_now()-W<$)}function V(){if(C=!1,J){var j=i.unstable_now();W=j;var K=!0;try{e:{B=!1,U&&(U=!1,E(M),M=-1),L=!0;var I=N;try{t:{for(Q(j),w=c(x);w!==null&&!(w.expirationTime>j&&F());){var R=w.callback;if(typeof R=="function"){w.callback=null,N=w.priorityLevel;var H=R(w.expirationTime<=j);if(j=i.unstable_now(),typeof H=="function"){w.callback=H,Q(j),K=!0;break t}w===c(x)&&u(x),Q(j)}else u(x);w=c(x)}if(w!==null)K=!0;else{var v=c(h);v!==null&&O(q,v.startTime-j),K=!1}}break e}finally{w=null,N=I,L=!1}K=void 0}}finally{K?A():J=!1}}}var A;if(typeof D=="function")A=function(){D(V)};else if(typeof MessageChannel<"u"){var Y=new MessageChannel,ie=Y.port2;Y.port1.onmessage=V,A=function(){ie.postMessage(null)}}else A=function(){T(V,0)};function O(j,K){M=T(function(){j(i.unstable_now())},K)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(j){j.callback=null},i.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):$=0<j?Math.floor(1e3/j):5},i.unstable_getCurrentPriorityLevel=function(){return N},i.unstable_next=function(j){switch(N){case 1:case 2:case 3:var K=3;break;default:K=N}var I=N;N=K;try{return j()}finally{N=I}},i.unstable_requestPaint=function(){C=!0},i.unstable_runWithPriority=function(j,K){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var I=N;N=j;try{return K()}finally{N=I}},i.unstable_scheduleCallback=function(j,K,I){var R=i.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?R+I:R):I=R,j){case 1:var H=-1;break;case 2:H=250;break;case 5:H=1073741823;break;case 4:H=1e4;break;default:H=5e3}return H=I+H,j={id:S++,callback:K,priorityLevel:j,startTime:I,expirationTime:H,sortIndex:-1},I>R?(j.sortIndex=I,o(h,j),c(x)===null&&j===c(h)&&(U?(E(M),M=-1):U=!0,O(q,I-R))):(j.sortIndex=H,o(x,j),B||L||(B=!0,J||(J=!0,A()))),j},i.unstable_shouldYield=F,i.unstable_wrapCallback=function(j){var K=N;return function(){var I=N;N=K;try{return j.apply(this,arguments)}finally{N=I}}}})(fu)),fu}var a0;function xy(){return a0||(a0=1,du.exports=yy()),du.exports}var pu={exports:{}},Dt={};var r0;function vy(){if(r0)return Dt;r0=1;var i=Gu();function o(x){var h="https://react.dev/errors/"+x;if(1<arguments.length){h+="?args[]="+encodeURIComponent(arguments[1]);for(var S=2;S<arguments.length;S++)h+="&args[]="+encodeURIComponent(arguments[S])}return"Minified React error #"+x+"; visit "+h+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(){}var u={d:{f:c,r:function(){throw Error(o(522))},D:c,C:c,L:c,m:c,X:c,S:c,M:c},p:0,findDOMNode:null},f=Symbol.for("react.portal");function p(x,h,S){var w=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:f,key:w==null?null:""+w,children:x,containerInfo:h,implementation:S}}var m=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function b(x,h){if(x==="font")return"";if(typeof h=="string")return h==="use-credentials"?h:""}return Dt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=u,Dt.createPortal=function(x,h){var S=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!h||h.nodeType!==1&&h.nodeType!==9&&h.nodeType!==11)throw Error(o(299));return p(x,h,null,S)},Dt.flushSync=function(x){var h=m.T,S=u.p;try{if(m.T=null,u.p=2,x)return x()}finally{m.T=h,u.p=S,u.d.f()}},Dt.preconnect=function(x,h){typeof x=="string"&&(h?(h=h.crossOrigin,h=typeof h=="string"?h==="use-credentials"?h:"":void 0):h=null,u.d.C(x,h))},Dt.prefetchDNS=function(x){typeof x=="string"&&u.d.D(x)},Dt.preinit=function(x,h){if(typeof x=="string"&&h&&typeof h.as=="string"){var S=h.as,w=b(S,h.crossOrigin),N=typeof h.integrity=="string"?h.integrity:void 0,L=typeof h.fetchPriority=="string"?h.fetchPriority:void 0;S==="style"?u.d.S(x,typeof h.precedence=="string"?h.precedence:void 0,{crossOrigin:w,integrity:N,fetchPriority:L}):S==="script"&&u.d.X(x,{crossOrigin:w,integrity:N,fetchPriority:L,nonce:typeof h.nonce=="string"?h.nonce:void 0})}},Dt.preinitModule=function(x,h){if(typeof x=="string")if(typeof h=="object"&&h!==null){if(h.as==null||h.as==="script"){var S=b(h.as,h.crossOrigin);u.d.M(x,{crossOrigin:S,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0})}}else h==null&&u.d.M(x)},Dt.preload=function(x,h){if(typeof x=="string"&&typeof h=="object"&&h!==null&&typeof h.as=="string"){var S=h.as,w=b(S,h.crossOrigin);u.d.L(x,S,{crossOrigin:w,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0,type:typeof h.type=="string"?h.type:void 0,fetchPriority:typeof h.fetchPriority=="string"?h.fetchPriority:void 0,referrerPolicy:typeof h.referrerPolicy=="string"?h.referrerPolicy:void 0,imageSrcSet:typeof h.imageSrcSet=="string"?h.imageSrcSet:void 0,imageSizes:typeof h.imageSizes=="string"?h.imageSizes:void 0,media:typeof h.media=="string"?h.media:void 0})}},Dt.preloadModule=function(x,h){if(typeof x=="string")if(h){var S=b(h.as,h.crossOrigin);u.d.m(x,{as:typeof h.as=="string"&&h.as!=="script"?h.as:void 0,crossOrigin:S,integrity:typeof h.integrity=="string"?h.integrity:void 0})}else u.d.m(x)},Dt.requestFormReset=function(x){u.d.r(x)},Dt.unstable_batchedUpdates=function(x,h){return x(h)},Dt.useFormState=function(x,h,S){return m.H.useFormState(x,h,S)},Dt.useFormStatus=function(){return m.H.useHostTransitionStatus()},Dt.version="19.2.3",Dt}var i0;function wy(){if(i0)return pu.exports;i0=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(o){console.error(o)}}return i(),pu.exports=vy(),pu.exports}var l0;function Sy(){if(l0)return Qi;l0=1;var i=xy(),o=Gu(),c=wy();function u(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function p(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function m(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function b(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function x(e){if(p(e)!==e)throw Error(u(188))}function h(e){var t=e.alternate;if(!t){if(t=p(e),t===null)throw Error(u(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var s=l.alternate;if(s===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===s.child){for(s=l.child;s;){if(s===n)return x(l),e;if(s===r)return x(l),t;s=s.sibling}throw Error(u(188))}if(n.return!==r.return)n=l,r=s;else{for(var g=!1,y=l.child;y;){if(y===n){g=!0,n=l,r=s;break}if(y===r){g=!0,r=l,n=s;break}y=y.sibling}if(!g){for(y=s.child;y;){if(y===n){g=!0,n=s,r=l;break}if(y===r){g=!0,r=s,n=l;break}y=y.sibling}if(!g)throw Error(u(189))}}if(n.alternate!==r)throw Error(u(190))}if(n.tag!==3)throw Error(u(188));return n.stateNode.current===n?e:t}function S(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=S(e),t!==null)return t;e=e.sibling}return null}var w=Object.assign,N=Symbol.for("react.element"),L=Symbol.for("react.transitional.element"),B=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),C=Symbol.for("react.strict_mode"),T=Symbol.for("react.profiler"),E=Symbol.for("react.consumer"),D=Symbol.for("react.context"),Q=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),J=Symbol.for("react.suspense_list"),M=Symbol.for("react.memo"),$=Symbol.for("react.lazy"),W=Symbol.for("react.activity"),F=Symbol.for("react.memo_cache_sentinel"),V=Symbol.iterator;function A(e){return e===null||typeof e!="object"?null:(e=V&&e[V]||e["@@iterator"],typeof e=="function"?e:null)}var Y=Symbol.for("react.client.reference");function ie(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Y?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case U:return"Fragment";case T:return"Profiler";case C:return"StrictMode";case q:return"Suspense";case J:return"SuspenseList";case W:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case B:return"Portal";case D:return e.displayName||"Context";case E:return(e._context.displayName||"Context")+".Consumer";case Q:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case M:return t=e.displayName||null,t!==null?t:ie(e.type)||"Memo";case $:t=e._payload,e=e._init;try{return ie(e(t))}catch{}}return null}var O=Array.isArray,j=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K=c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,I={pending:!1,data:null,method:null,action:null},R=[],H=-1;function v(e){return{current:e}}function k(e){0>H||(e.current=R[H],R[H]=null,H--)}function te(e,t){H++,R[H]=e.current,e.current=t}var X=v(null),le=v(null),ge=v(null),de=v(null);function ae(e,t){switch(te(ge,t),te(le,e),te(X,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?wg(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=wg(t),e=Sg(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}k(X),te(X,e)}function pe(){k(X),k(le),k(ge)}function ue(e){e.memoizedState!==null&&te(de,e);var t=X.current,n=Sg(t,e.type);t!==n&&(te(le,e),te(X,n))}function me(e){le.current===e&&(k(X),k(le)),de.current===e&&(k(de),Gi._currentValue=I)}var Ve,ht;function et(e){if(Ve===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ve=t&&t[1]||"",ht=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ve+e+ht}var Jt=!1;function en(e,t){if(!e||Jt)return"";Jt=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var ce=function(){throw Error()};if(Object.defineProperty(ce.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(ce,[])}catch(ne){var ee=ne}Reflect.construct(e,[],ce)}else{try{ce.call()}catch(ne){ee=ne}e.call(ce.prototype)}}else{try{throw Error()}catch(ne){ee=ne}(ce=e())&&typeof ce.catch=="function"&&ce.catch(function(){})}}catch(ne){if(ne&&ee&&typeof ne.stack=="string")return[ne.stack,ee.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var l=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,"name");l&&l.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var s=r.DetermineComponentFrameRoot(),g=s[0],y=s[1];if(g&&y){var z=g.split(`
`),Z=y.split(`
`);for(l=r=0;r<z.length&&!z[r].includes("DetermineComponentFrameRoot");)r++;for(;l<Z.length&&!Z[l].includes("DetermineComponentFrameRoot");)l++;if(r===z.length||l===Z.length)for(r=z.length-1,l=Z.length-1;1<=r&&0<=l&&z[r]!==Z[l];)l--;for(;1<=r&&0<=l;r--,l--)if(z[r]!==Z[l]){if(r!==1||l!==1)do if(r--,l--,0>l||z[r]!==Z[l]){var re=`
`+z[r].replace(" at new "," at ");return e.displayName&&re.includes("<anonymous>")&&(re=re.replace("<anonymous>",e.displayName)),re}while(1<=r&&0<=l);break}}}finally{Jt=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?et(n):""}function tn(e,t){switch(e.tag){case 26:case 27:case 5:return et(e.type);case 16:return et("Lazy");case 13:return e.child!==t&&t!==null?et("Suspense Fallback"):et("Suspense");case 19:return et("SuspenseList");case 0:case 15:return en(e.type,!1);case 11:return en(e.type.render,!1);case 1:return en(e.type,!0);case 31:return et("Activity");default:return""}}function Bn(e){try{var t="",n=null;do t+=tn(e,n),n=e,e=e.return;while(e);return t}catch(r){return`
Error generating stack: `+r.message+`
`+r.stack}}var $a=Object.prototype.hasOwnProperty,qn=i.unstable_scheduleCallback,En=i.unstable_cancelCallback,fe=i.unstable_shouldYield,be=i.unstable_requestPaint,ze=i.unstable_now,tt=i.unstable_getCurrentPriorityLevel,dt=i.unstable_ImmediatePriority,At=i.unstable_UserBlockingPriority,nn=i.unstable_NormalPriority,Yo=i.unstable_LowPriority,pl=i.unstable_IdlePriority,Fo=i.log,Vo=i.unstable_setDisableYieldValue,Ha=null,$t=null;function Mn(e){if(typeof Fo=="function"&&Vo(e),$t&&typeof $t.setStrictMode=="function")try{$t.setStrictMode(Ha,e)}catch{}}var Ht=Math.clz32?Math.clz32:oe,Xo=Math.log,Qo=Math.LN2;function oe(e){return e>>>=0,e===0?32:31-(Xo(e)/Qo|0)|0}var Re=256,Ne=262144,ft=4194304;function pn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Wn(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var l=0,s=e.suspendedLanes,g=e.pingedLanes;e=e.warmLanes;var y=r&134217727;return y!==0?(r=y&~s,r!==0?l=pn(r):(g&=y,g!==0?l=pn(g):n||(n=y&~e,n!==0&&(l=pn(n))))):(y=r&~s,y!==0?l=pn(y):g!==0?l=pn(g):n||(n=r&~e,n!==0&&(l=pn(n)))),l===0?0:t!==0&&t!==l&&(t&s)===0&&(s=l&-l,n=t&-t,s>=n||s===32&&(n&4194048)!==0)?t:l}function an(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Ia(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ri(){var e=ft;return ft<<=1,(ft&62914560)===0&&(ft=4194304),e}function ii(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function fa(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ah(e,t,n,r,l,s){var g=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var y=e.entanglements,z=e.expirationTimes,Z=e.hiddenUpdates;for(n=g&~n;0<n;){var re=31-Ht(n),ce=1<<re;y[re]=0,z[re]=-1;var ee=Z[re];if(ee!==null)for(Z[re]=null,re=0;re<ee.length;re++){var ne=ee[re];ne!==null&&(ne.lane&=-536870913)}n&=~ce}r!==0&&nd(e,r,0),s!==0&&l===0&&e.tag!==0&&(e.suspendedLanes|=s&~(g&~t))}function nd(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-Ht(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function ad(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ht(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}function rd(e,t){var n=t&-t;return n=(n&42)!==0?1:Po(n),(n&(e.suspendedLanes|t))!==0?0:n}function Po(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Zo(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function id(){var e=K.p;return e!==0?e:(e=window.event,e===void 0?32:Gg(e.type))}function ld(e,t){var n=K.p;try{return K.p=e,t()}finally{K.p=n}}var pa=Math.random().toString(36).slice(2),Ut="__reactFiber$"+pa,Yt="__reactProps$"+pa,dr="__reactContainer$"+pa,Jo="__reactEvents$"+pa,rh="__reactListeners$"+pa,ih="__reactHandles$"+pa,od="__reactResources$"+pa,li="__reactMarker$"+pa;function es(e){delete e[Ut],delete e[Yt],delete e[Jo],delete e[rh],delete e[ih]}function fr(e){var t=e[Ut];if(t)return t;for(var n=e.parentNode;n;){if(t=n[dr]||n[Ut]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=zg(e);e!==null;){if(n=e[Ut])return n;e=zg(e)}return t}e=n,n=e.parentNode}return null}function pr(e){if(e=e[Ut]||e[dr]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function oi(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(u(33))}function gr(e){var t=e[od];return t||(t=e[od]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function zt(e){e[li]=!0}var sd=new Set,cd={};function Ka(e,t){mr(e,t),mr(e+"Capture",t)}function mr(e,t){for(cd[e]=t,e=0;e<t.length;e++)sd.add(t[e])}var lh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ud={},dd={};function oh(e){return $a.call(dd,e)?!0:$a.call(ud,e)?!1:lh.test(e)?dd[e]=!0:(ud[e]=!0,!1)}function gl(e,t,n){if(oh(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var r=t.toLowerCase().slice(0,5);if(r!=="data-"&&r!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function ml(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function Gn(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+r)}}function gn(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function fd(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function sh(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var l=r.get,s=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(g){n=""+g,s.call(this,g)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(g){n=""+g},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ts(e){if(!e._valueTracker){var t=fd(e)?"checked":"value";e._valueTracker=sh(e,t,""+e[t])}}function pd(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=fd(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function hl(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var ch=/[\n"\\]/g;function mn(e){return e.replace(ch,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function ns(e,t,n,r,l,s,g,y){e.name="",g!=null&&typeof g!="function"&&typeof g!="symbol"&&typeof g!="boolean"?e.type=g:e.removeAttribute("type"),t!=null?g==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+gn(t)):e.value!==""+gn(t)&&(e.value=""+gn(t)):g!=="submit"&&g!=="reset"||e.removeAttribute("value"),t!=null?as(e,g,gn(t)):n!=null?as(e,g,gn(n)):r!=null&&e.removeAttribute("value"),l==null&&s!=null&&(e.defaultChecked=!!s),l!=null&&(e.checked=l&&typeof l!="function"&&typeof l!="symbol"),y!=null&&typeof y!="function"&&typeof y!="symbol"&&typeof y!="boolean"?e.name=""+gn(y):e.removeAttribute("name")}function gd(e,t,n,r,l,s,g,y){if(s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(e.type=s),t!=null||n!=null){if(!(s!=="submit"&&s!=="reset"||t!=null)){ts(e);return}n=n!=null?""+gn(n):"",t=t!=null?""+gn(t):n,y||t===e.value||(e.value=t),e.defaultValue=t}r=r??l,r=typeof r!="function"&&typeof r!="symbol"&&!!r,e.checked=y?e.checked:!!r,e.defaultChecked=!!r,g!=null&&typeof g!="function"&&typeof g!="symbol"&&typeof g!="boolean"&&(e.name=g),ts(e)}function as(e,t,n){t==="number"&&hl(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function hr(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+gn(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function md(e,t,n){if(t!=null&&(t=""+gn(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+gn(n):""}function hd(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(u(92));if(O(r)){if(1<r.length)throw Error(u(93));r=r[0]}n=r}n==null&&(n=""),t=n}n=gn(t),e.defaultValue=n,r=e.textContent,r===n&&r!==""&&r!==null&&(e.value=r),ts(e)}function br(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var uh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function bd(e,t,n){var r=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?r?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":r?e.setProperty(t,n):typeof n!="number"||n===0||uh.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function yd(e,t,n){if(t!=null&&typeof t!="object")throw Error(u(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf("--")===0?e.setProperty(r,""):r==="float"?e.cssFloat="":e[r]="");for(var l in t)r=t[l],t.hasOwnProperty(l)&&n[l]!==r&&bd(e,l,r)}else for(var s in t)t.hasOwnProperty(s)&&bd(e,s,t[s])}function rs(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var dh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),fh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function bl(e){return fh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Yn(){}var is=null;function ls(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var yr=null,xr=null;function xd(e){var t=pr(e);if(t&&(e=t.stateNode)){var n=e[Yt]||null;e:switch(e=t.stateNode,t.type){case"input":if(ns(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+mn(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=r[Yt]||null;if(!l)throw Error(u(90));ns(r,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&pd(r)}break e;case"textarea":md(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&hr(e,!!n.multiple,t,!1)}}}var os=!1;function vd(e,t,n){if(os)return e(t,n);os=!0;try{var r=e(t);return r}finally{if(os=!1,(yr!==null||xr!==null)&&(ro(),yr&&(t=yr,e=xr,xr=yr=null,xd(t),e)))for(t=0;t<e.length;t++)xd(e[t])}}function si(e,t){var n=e.stateNode;if(n===null)return null;var r=n[Yt]||null;if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(u(231,t,typeof n));return n}var Fn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ss=!1;if(Fn)try{var ci={};Object.defineProperty(ci,"passive",{get:function(){ss=!0}}),window.addEventListener("test",ci,ci),window.removeEventListener("test",ci,ci)}catch{ss=!1}var ga=null,cs=null,yl=null;function wd(){if(yl)return yl;var e,t=cs,n=t.length,r,l="value"in ga?ga.value:ga.textContent,s=l.length;for(e=0;e<n&&t[e]===l[e];e++);var g=n-e;for(r=1;r<=g&&t[n-r]===l[s-r];r++);return yl=l.slice(e,1<r?1-r:void 0)}function xl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function vl(){return!0}function Sd(){return!1}function Ft(e){function t(n,r,l,s,g){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=s,this.target=g,this.currentTarget=null;for(var y in e)e.hasOwnProperty(y)&&(n=e[y],this[y]=n?n(s):s[y]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?vl:Sd,this.isPropagationStopped=Sd,this}return w(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=vl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=vl)},persist:function(){},isPersistent:vl}),t}var qa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wl=Ft(qa),ui=w({},qa,{view:0,detail:0}),ph=Ft(ui),us,ds,di,Sl=w({},ui,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ps,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==di&&(di&&e.type==="mousemove"?(us=e.screenX-di.screenX,ds=e.screenY-di.screenY):ds=us=0,di=e),us)},movementY:function(e){return"movementY"in e?e.movementY:ds}}),jd=Ft(Sl),gh=w({},Sl,{dataTransfer:0}),mh=Ft(gh),hh=w({},ui,{relatedTarget:0}),fs=Ft(hh),bh=w({},qa,{animationName:0,elapsedTime:0,pseudoElement:0}),yh=Ft(bh),xh=w({},qa,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),vh=Ft(xh),wh=w({},qa,{data:0}),kd=Ft(wh),Sh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},jh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Th(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=kh[e])?!!t[e]:!1}function ps(){return Th}var Ch=w({},ui,{key:function(e){if(e.key){var t=Sh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=xl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?jh[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ps,charCode:function(e){return e.type==="keypress"?xl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?xl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Rh=Ft(Ch),Eh=w({},Sl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=Ft(Eh),zh=w({},ui,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ps}),Nh=Ft(zh),Ah=w({},qa,{propertyName:0,elapsedTime:0,pseudoElement:0}),Uh=Ft(Ah),Oh=w({},Sl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Bh=Ft(Oh),Mh=w({},qa,{newState:0,oldState:0}),Lh=Ft(Mh),_h=[9,13,27,32],gs=Fn&&"CompositionEvent"in window,fi=null;Fn&&"documentMode"in document&&(fi=document.documentMode);var Dh=Fn&&"TextEvent"in window&&!fi,Cd=Fn&&(!gs||fi&&8<fi&&11>=fi),Rd=" ",Ed=!1;function zd(e,t){switch(e){case"keyup":return _h.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Nd(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function $h(e,t){switch(e){case"compositionend":return Nd(t);case"keypress":return t.which!==32?null:(Ed=!0,Rd);case"textInput":return e=t.data,e===Rd&&Ed?null:e;default:return null}}function Hh(e,t){if(vr)return e==="compositionend"||!gs&&zd(e,t)?(e=wd(),yl=cs=ga=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Cd&&t.locale!=="ko"?null:t.data;default:return null}}var Ih={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ad(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ih[e.type]:t==="textarea"}function Ud(e,t,n,r){yr?xr?xr.push(r):xr=[r]:yr=r,t=fo(t,"onChange"),0<t.length&&(n=new wl("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var pi=null,gi=null;function Kh(e){mg(e,0)}function jl(e){var t=oi(e);if(pd(t))return e}function Od(e,t){if(e==="change")return t}var Bd=!1;if(Fn){var ms;if(Fn){var hs="oninput"in document;if(!hs){var Md=document.createElement("div");Md.setAttribute("oninput","return;"),hs=typeof Md.oninput=="function"}ms=hs}else ms=!1;Bd=ms&&(!document.documentMode||9<document.documentMode)}function Ld(){pi&&(pi.detachEvent("onpropertychange",_d),gi=pi=null)}function _d(e){if(e.propertyName==="value"&&jl(gi)){var t=[];Ud(t,gi,e,ls(e)),vd(Kh,t)}}function qh(e,t,n){e==="focusin"?(Ld(),pi=t,gi=n,pi.attachEvent("onpropertychange",_d)):e==="focusout"&&Ld()}function Wh(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return jl(gi)}function Gh(e,t){if(e==="click")return jl(t)}function Yh(e,t){if(e==="input"||e==="change")return jl(t)}function Fh(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var rn=typeof Object.is=="function"?Object.is:Fh;function mi(e,t){if(rn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!$a.call(t,l)||!rn(e[l],t[l]))return!1}return!0}function Dd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function $d(e,t){var n=Dd(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Dd(n)}}function Hd(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Hd(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Id(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=hl(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=hl(e.document)}return t}function bs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Vh=Fn&&"documentMode"in document&&11>=document.documentMode,wr=null,ys=null,hi=null,xs=!1;function Kd(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;xs||wr==null||wr!==hl(r)||(r=wr,"selectionStart"in r&&bs(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),hi&&mi(hi,r)||(hi=r,r=fo(ys,"onSelect"),0<r.length&&(t=new wl("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=wr)))}function Wa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Sr={animationend:Wa("Animation","AnimationEnd"),animationiteration:Wa("Animation","AnimationIteration"),animationstart:Wa("Animation","AnimationStart"),transitionrun:Wa("Transition","TransitionRun"),transitionstart:Wa("Transition","TransitionStart"),transitioncancel:Wa("Transition","TransitionCancel"),transitionend:Wa("Transition","TransitionEnd")},vs={},qd={};Fn&&(qd=document.createElement("div").style,"AnimationEvent"in window||(delete Sr.animationend.animation,delete Sr.animationiteration.animation,delete Sr.animationstart.animation),"TransitionEvent"in window||delete Sr.transitionend.transition);function Ga(e){if(vs[e])return vs[e];if(!Sr[e])return e;var t=Sr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in qd)return vs[e]=t[n];return e}var Wd=Ga("animationend"),Gd=Ga("animationiteration"),Yd=Ga("animationstart"),Xh=Ga("transitionrun"),Qh=Ga("transitionstart"),Ph=Ga("transitioncancel"),Fd=Ga("transitionend"),Vd=new Map,ws="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");ws.push("scrollEnd");function zn(e,t){Vd.set(e,t),Ka(t,[e])}var kl=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},hn=[],jr=0,Ss=0;function Tl(){for(var e=jr,t=Ss=jr=0;t<e;){var n=hn[t];hn[t++]=null;var r=hn[t];hn[t++]=null;var l=hn[t];hn[t++]=null;var s=hn[t];if(hn[t++]=null,r!==null&&l!==null){var g=r.pending;g===null?l.next=l:(l.next=g.next,g.next=l),r.pending=l}s!==0&&Xd(n,l,s)}}function Cl(e,t,n,r){hn[jr++]=e,hn[jr++]=t,hn[jr++]=n,hn[jr++]=r,Ss|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function js(e,t,n,r){return Cl(e,t,n,r),Rl(e)}function Ya(e,t){return Cl(e,null,null,t),Rl(e)}function Xd(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var l=!1,s=e.return;s!==null;)s.childLanes|=n,r=s.alternate,r!==null&&(r.childLanes|=n),s.tag===22&&(e=s.stateNode,e===null||e._visibility&1||(l=!0)),e=s,s=s.return;return e.tag===3?(s=e.stateNode,l&&t!==null&&(l=31-Ht(n),e=s.hiddenUpdates,r=e[l],r===null?e[l]=[t]:r.push(t),t.lane=n|536870912),s):null}function Rl(e){if(50<Di)throw Di=0,Uc=null,Error(u(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var kr={};function Zh(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ln(e,t,n,r){return new Zh(e,t,n,r)}function ks(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Vn(e,t){var n=e.alternate;return n===null?(n=ln(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Qd(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function El(e,t,n,r,l,s){var g=0;if(r=e,typeof e=="function")ks(e)&&(g=1);else if(typeof e=="string")g=ay(e,n,X.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case W:return e=ln(31,n,t,l),e.elementType=W,e.lanes=s,e;case U:return Fa(n.children,l,s,t);case C:g=8,l|=24;break;case T:return e=ln(12,n,t,l|2),e.elementType=T,e.lanes=s,e;case q:return e=ln(13,n,t,l),e.elementType=q,e.lanes=s,e;case J:return e=ln(19,n,t,l),e.elementType=J,e.lanes=s,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case D:g=10;break e;case E:g=9;break e;case Q:g=11;break e;case M:g=14;break e;case $:g=16,r=null;break e}g=29,n=Error(u(130,e===null?"null":typeof e,"")),r=null}return t=ln(g,n,t,l),t.elementType=e,t.type=r,t.lanes=s,t}function Fa(e,t,n,r){return e=ln(7,e,r,t),e.lanes=n,e}function Ts(e,t,n){return e=ln(6,e,null,t),e.lanes=n,e}function Pd(e){var t=ln(18,null,null,0);return t.stateNode=e,t}function Cs(e,t,n){return t=ln(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Zd=new WeakMap;function bn(e,t){if(typeof e=="object"&&e!==null){var n=Zd.get(e);return n!==void 0?n:(t={value:e,source:t,stack:Bn(t)},Zd.set(e,t),t)}return{value:e,source:t,stack:Bn(t)}}var Tr=[],Cr=0,zl=null,bi=0,yn=[],xn=0,ma=null,Ln=1,_n="";function Xn(e,t){Tr[Cr++]=bi,Tr[Cr++]=zl,zl=e,bi=t}function Jd(e,t,n){yn[xn++]=Ln,yn[xn++]=_n,yn[xn++]=ma,ma=e;var r=Ln;e=_n;var l=32-Ht(r)-1;r&=~(1<<l),n+=1;var s=32-Ht(t)+l;if(30<s){var g=l-l%5;s=(r&(1<<g)-1).toString(32),r>>=g,l-=g,Ln=1<<32-Ht(t)+l|n<<l|r,_n=s+e}else Ln=1<<s|n<<l|r,_n=e}function Rs(e){e.return!==null&&(Xn(e,1),Jd(e,1,0))}function Es(e){for(;e===zl;)zl=Tr[--Cr],Tr[Cr]=null,bi=Tr[--Cr],Tr[Cr]=null;for(;e===ma;)ma=yn[--xn],yn[xn]=null,_n=yn[--xn],yn[xn]=null,Ln=yn[--xn],yn[xn]=null}function ef(e,t){yn[xn++]=Ln,yn[xn++]=_n,yn[xn++]=ma,Ln=t.id,_n=t.overflow,ma=e}var Ot=null,pt=null,Ke=!1,ha=null,vn=!1,zs=Error(u(519));function ba(e){var t=Error(u(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw yi(bn(t,e)),zs}function tf(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[Ut]=e,t[Yt]=r,n){case"dialog":$e("cancel",t),$e("close",t);break;case"iframe":case"object":case"embed":$e("load",t);break;case"video":case"audio":for(n=0;n<Hi.length;n++)$e(Hi[n],t);break;case"source":$e("error",t);break;case"img":case"image":case"link":$e("error",t),$e("load",t);break;case"details":$e("toggle",t);break;case"input":$e("invalid",t),gd(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case"select":$e("invalid",t);break;case"textarea":$e("invalid",t),hd(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||r.suppressHydrationWarning===!0||xg(t.textContent,n)?(r.popover!=null&&($e("beforetoggle",t),$e("toggle",t)),r.onScroll!=null&&$e("scroll",t),r.onScrollEnd!=null&&$e("scrollend",t),r.onClick!=null&&(t.onclick=Yn),t=!0):t=!1,t||ba(e,!0)}function nf(e){for(Ot=e.return;Ot;)switch(Ot.tag){case 5:case 31:case 13:vn=!1;return;case 27:case 3:vn=!0;return;default:Ot=Ot.return}}function Rr(e){if(e!==Ot)return!1;if(!Ke)return nf(e),Ke=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Fc(e.type,e.memoizedProps)),n=!n),n&&pt&&ba(e),nf(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));pt=Eg(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));pt=Eg(e)}else t===27?(t=pt,Aa(e.type)?(e=Zc,Zc=null,pt=e):pt=t):pt=Ot?Sn(e.stateNode.nextSibling):null;return!0}function Va(){pt=Ot=null,Ke=!1}function Ns(){var e=ha;return e!==null&&(Pt===null?Pt=e:Pt.push.apply(Pt,e),ha=null),e}function yi(e){ha===null?ha=[e]:ha.push(e)}var As=v(null),Xa=null,Qn=null;function ya(e,t,n){te(As,t._currentValue),t._currentValue=n}function Pn(e){e._currentValue=As.current,k(As)}function Us(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Os(e,t,n,r){var l=e.child;for(l!==null&&(l.return=e);l!==null;){var s=l.dependencies;if(s!==null){var g=l.child;s=s.firstContext;e:for(;s!==null;){var y=s;s=l;for(var z=0;z<t.length;z++)if(y.context===t[z]){s.lanes|=n,y=s.alternate,y!==null&&(y.lanes|=n),Us(s.return,n,e),r||(g=null);break e}s=y.next}}else if(l.tag===18){if(g=l.return,g===null)throw Error(u(341));g.lanes|=n,s=g.alternate,s!==null&&(s.lanes|=n),Us(g,n,e),g=null}else g=l.child;if(g!==null)g.return=l;else for(g=l;g!==null;){if(g===e){g=null;break}if(l=g.sibling,l!==null){l.return=g.return,g=l;break}g=g.return}l=g}}function Er(e,t,n,r){e=null;for(var l=t,s=!1;l!==null;){if(!s){if((l.flags&524288)!==0)s=!0;else if((l.flags&262144)!==0)break}if(l.tag===10){var g=l.alternate;if(g===null)throw Error(u(387));if(g=g.memoizedProps,g!==null){var y=l.type;rn(l.pendingProps.value,g.value)||(e!==null?e.push(y):e=[y])}}else if(l===de.current){if(g=l.alternate,g===null)throw Error(u(387));g.memoizedState.memoizedState!==l.memoizedState.memoizedState&&(e!==null?e.push(Gi):e=[Gi])}l=l.return}e!==null&&Os(t,e,n,r),t.flags|=262144}function Nl(e){for(e=e.firstContext;e!==null;){if(!rn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Qa(e){Xa=e,Qn=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Bt(e){return af(Xa,e)}function Al(e,t){return Xa===null&&Qa(e),af(e,t)}function af(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Qn===null){if(e===null)throw Error(u(308));Qn=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Qn=Qn.next=t;return n}var Jh=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,r){e.push(r)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},eb=i.unstable_scheduleCallback,tb=i.unstable_NormalPriority,kt={$$typeof:D,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Bs(){return{controller:new Jh,data:new Map,refCount:0}}function xi(e){e.refCount--,e.refCount===0&&eb(tb,function(){e.controller.abort()})}var vi=null,Ms=0,zr=0,Nr=null;function nb(e,t){if(vi===null){var n=vi=[];Ms=0,zr=Dc(),Nr={status:"pending",value:void 0,then:function(r){n.push(r)}}}return Ms++,t.then(rf,rf),t}function rf(){if(--Ms===0&&vi!==null){Nr!==null&&(Nr.status="fulfilled");var e=vi;vi=null,zr=0,Nr=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ab(e,t){var n=[],r={status:"pending",value:null,reason:null,then:function(l){n.push(l)}};return e.then(function(){r.status="fulfilled",r.value=t;for(var l=0;l<n.length;l++)(0,n[l])(t)},function(l){for(r.status="rejected",r.reason=l,l=0;l<n.length;l++)(0,n[l])(void 0)}),r}var lf=j.S;j.S=function(e,t){qp=ze(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&nb(e,t),lf!==null&&lf(e,t)};var Pa=v(null);function Ls(){var e=Pa.current;return e!==null?e:ct.pooledCache}function Ul(e,t){t===null?te(Pa,Pa.current):te(Pa,t.pool)}function of(){var e=Ls();return e===null?null:{parent:kt._currentValue,pool:e}}var Ar=Error(u(460)),_s=Error(u(474)),Ol=Error(u(542)),Bl={then:function(){}};function sf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function cf(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Yn,Yn),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,df(e),e;default:if(typeof t.status=="string")t.then(Yn,Yn);else{if(e=ct,e!==null&&100<e.shellSuspendCounter)throw Error(u(482));e=t,e.status="pending",e.then(function(r){if(t.status==="pending"){var l=t;l.status="fulfilled",l.value=r}},function(r){if(t.status==="pending"){var l=t;l.status="rejected",l.reason=r}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,df(e),e}throw Ja=t,Ar}}function Za(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Ja=n,Ar):n}}var Ja=null;function uf(){if(Ja===null)throw Error(u(459));var e=Ja;return Ja=null,e}function df(e){if(e===Ar||e===Ol)throw Error(u(483))}var Ur=null,wi=0;function Ml(e){var t=wi;return wi+=1,Ur===null&&(Ur=[]),cf(Ur,e,t)}function Si(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Ll(e,t){throw t.$$typeof===N?Error(u(525)):(e=Object.prototype.toString.call(t),Error(u(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function ff(e){function t(G,_){if(e){var P=G.deletions;P===null?(G.deletions=[_],G.flags|=16):P.push(_)}}function n(G,_){if(!e)return null;for(;_!==null;)t(G,_),_=_.sibling;return null}function r(G){for(var _=new Map;G!==null;)G.key!==null?_.set(G.key,G):_.set(G.index,G),G=G.sibling;return _}function l(G,_){return G=Vn(G,_),G.index=0,G.sibling=null,G}function s(G,_,P){return G.index=P,e?(P=G.alternate,P!==null?(P=P.index,P<_?(G.flags|=67108866,_):P):(G.flags|=67108866,_)):(G.flags|=1048576,_)}function g(G){return e&&G.alternate===null&&(G.flags|=67108866),G}function y(G,_,P,se){return _===null||_.tag!==6?(_=Ts(P,G.mode,se),_.return=G,_):(_=l(_,P),_.return=G,_)}function z(G,_,P,se){var Se=P.type;return Se===U?re(G,_,P.props.children,se,P.key):_!==null&&(_.elementType===Se||typeof Se=="object"&&Se!==null&&Se.$$typeof===$&&Za(Se)===_.type)?(_=l(_,P.props),Si(_,P),_.return=G,_):(_=El(P.type,P.key,P.props,null,G.mode,se),Si(_,P),_.return=G,_)}function Z(G,_,P,se){return _===null||_.tag!==4||_.stateNode.containerInfo!==P.containerInfo||_.stateNode.implementation!==P.implementation?(_=Cs(P,G.mode,se),_.return=G,_):(_=l(_,P.children||[]),_.return=G,_)}function re(G,_,P,se,Se){return _===null||_.tag!==7?(_=Fa(P,G.mode,se,Se),_.return=G,_):(_=l(_,P),_.return=G,_)}function ce(G,_,P){if(typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint")return _=Ts(""+_,G.mode,P),_.return=G,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case L:return P=El(_.type,_.key,_.props,null,G.mode,P),Si(P,_),P.return=G,P;case B:return _=Cs(_,G.mode,P),_.return=G,_;case $:return _=Za(_),ce(G,_,P)}if(O(_)||A(_))return _=Fa(_,G.mode,P,null),_.return=G,_;if(typeof _.then=="function")return ce(G,Ml(_),P);if(_.$$typeof===D)return ce(G,Al(G,_),P);Ll(G,_)}return null}function ee(G,_,P,se){var Se=_!==null?_.key:null;if(typeof P=="string"&&P!==""||typeof P=="number"||typeof P=="bigint")return Se!==null?null:y(G,_,""+P,se);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case L:return P.key===Se?z(G,_,P,se):null;case B:return P.key===Se?Z(G,_,P,se):null;case $:return P=Za(P),ee(G,_,P,se)}if(O(P)||A(P))return Se!==null?null:re(G,_,P,se,null);if(typeof P.then=="function")return ee(G,_,Ml(P),se);if(P.$$typeof===D)return ee(G,_,Al(G,P),se);Ll(G,P)}return null}function ne(G,_,P,se,Se){if(typeof se=="string"&&se!==""||typeof se=="number"||typeof se=="bigint")return G=G.get(P)||null,y(_,G,""+se,Se);if(typeof se=="object"&&se!==null){switch(se.$$typeof){case L:return G=G.get(se.key===null?P:se.key)||null,z(_,G,se,Se);case B:return G=G.get(se.key===null?P:se.key)||null,Z(_,G,se,Se);case $:return se=Za(se),ne(G,_,P,se,Se)}if(O(se)||A(se))return G=G.get(P)||null,re(_,G,se,Se,null);if(typeof se.then=="function")return ne(G,_,P,Ml(se),Se);if(se.$$typeof===D)return ne(G,_,P,Al(_,se),Se);Ll(_,se)}return null}function ye(G,_,P,se){for(var Se=null,Xe=null,ve=_,Ue=_=0,Ie=null;ve!==null&&Ue<P.length;Ue++){ve.index>Ue?(Ie=ve,ve=null):Ie=ve.sibling;var Qe=ee(G,ve,P[Ue],se);if(Qe===null){ve===null&&(ve=Ie);break}e&&ve&&Qe.alternate===null&&t(G,ve),_=s(Qe,_,Ue),Xe===null?Se=Qe:Xe.sibling=Qe,Xe=Qe,ve=Ie}if(Ue===P.length)return n(G,ve),Ke&&Xn(G,Ue),Se;if(ve===null){for(;Ue<P.length;Ue++)ve=ce(G,P[Ue],se),ve!==null&&(_=s(ve,_,Ue),Xe===null?Se=ve:Xe.sibling=ve,Xe=ve);return Ke&&Xn(G,Ue),Se}for(ve=r(ve);Ue<P.length;Ue++)Ie=ne(ve,G,Ue,P[Ue],se),Ie!==null&&(e&&Ie.alternate!==null&&ve.delete(Ie.key===null?Ue:Ie.key),_=s(Ie,_,Ue),Xe===null?Se=Ie:Xe.sibling=Ie,Xe=Ie);return e&&ve.forEach(function(La){return t(G,La)}),Ke&&Xn(G,Ue),Se}function Te(G,_,P,se){if(P==null)throw Error(u(151));for(var Se=null,Xe=null,ve=_,Ue=_=0,Ie=null,Qe=P.next();ve!==null&&!Qe.done;Ue++,Qe=P.next()){ve.index>Ue?(Ie=ve,ve=null):Ie=ve.sibling;var La=ee(G,ve,Qe.value,se);if(La===null){ve===null&&(ve=Ie);break}e&&ve&&La.alternate===null&&t(G,ve),_=s(La,_,Ue),Xe===null?Se=La:Xe.sibling=La,Xe=La,ve=Ie}if(Qe.done)return n(G,ve),Ke&&Xn(G,Ue),Se;if(ve===null){for(;!Qe.done;Ue++,Qe=P.next())Qe=ce(G,Qe.value,se),Qe!==null&&(_=s(Qe,_,Ue),Xe===null?Se=Qe:Xe.sibling=Qe,Xe=Qe);return Ke&&Xn(G,Ue),Se}for(ve=r(ve);!Qe.done;Ue++,Qe=P.next())Qe=ne(ve,G,Ue,Qe.value,se),Qe!==null&&(e&&Qe.alternate!==null&&ve.delete(Qe.key===null?Ue:Qe.key),_=s(Qe,_,Ue),Xe===null?Se=Qe:Xe.sibling=Qe,Xe=Qe);return e&&ve.forEach(function(gy){return t(G,gy)}),Ke&&Xn(G,Ue),Se}function ot(G,_,P,se){if(typeof P=="object"&&P!==null&&P.type===U&&P.key===null&&(P=P.props.children),typeof P=="object"&&P!==null){switch(P.$$typeof){case L:e:{for(var Se=P.key;_!==null;){if(_.key===Se){if(Se=P.type,Se===U){if(_.tag===7){n(G,_.sibling),se=l(_,P.props.children),se.return=G,G=se;break e}}else if(_.elementType===Se||typeof Se=="object"&&Se!==null&&Se.$$typeof===$&&Za(Se)===_.type){n(G,_.sibling),se=l(_,P.props),Si(se,P),se.return=G,G=se;break e}n(G,_);break}else t(G,_);_=_.sibling}P.type===U?(se=Fa(P.props.children,G.mode,se,P.key),se.return=G,G=se):(se=El(P.type,P.key,P.props,null,G.mode,se),Si(se,P),se.return=G,G=se)}return g(G);case B:e:{for(Se=P.key;_!==null;){if(_.key===Se)if(_.tag===4&&_.stateNode.containerInfo===P.containerInfo&&_.stateNode.implementation===P.implementation){n(G,_.sibling),se=l(_,P.children||[]),se.return=G,G=se;break e}else{n(G,_);break}else t(G,_);_=_.sibling}se=Cs(P,G.mode,se),se.return=G,G=se}return g(G);case $:return P=Za(P),ot(G,_,P,se)}if(O(P))return ye(G,_,P,se);if(A(P)){if(Se=A(P),typeof Se!="function")throw Error(u(150));return P=Se.call(P),Te(G,_,P,se)}if(typeof P.then=="function")return ot(G,_,Ml(P),se);if(P.$$typeof===D)return ot(G,_,Al(G,P),se);Ll(G,P)}return typeof P=="string"&&P!==""||typeof P=="number"||typeof P=="bigint"?(P=""+P,_!==null&&_.tag===6?(n(G,_.sibling),se=l(_,P),se.return=G,G=se):(n(G,_),se=Ts(P,G.mode,se),se.return=G,G=se),g(G)):n(G,_)}return function(G,_,P,se){try{wi=0;var Se=ot(G,_,P,se);return Ur=null,Se}catch(ve){if(ve===Ar||ve===Ol)throw ve;var Xe=ln(29,ve,null,G.mode);return Xe.lanes=se,Xe.return=G,Xe}}}var er=ff(!0),pf=ff(!1),xa=!1;function Ds(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function $s(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function va(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function wa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(Pe&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,t=Rl(e),Xd(e,null,n),t}return Cl(e,r,t,n),Rl(e)}function ji(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ad(e,n)}}function Hs(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var g={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};s===null?l=s=g:s=s.next=g,n=n.next}while(n!==null);s===null?l=s=t:s=s.next=t}else l=s=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:s,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Is=!1;function ki(){if(Is){var e=Nr;if(e!==null)throw e}}function Ti(e,t,n,r){Is=!1;var l=e.updateQueue;xa=!1;var s=l.firstBaseUpdate,g=l.lastBaseUpdate,y=l.shared.pending;if(y!==null){l.shared.pending=null;var z=y,Z=z.next;z.next=null,g===null?s=Z:g.next=Z,g=z;var re=e.alternate;re!==null&&(re=re.updateQueue,y=re.lastBaseUpdate,y!==g&&(y===null?re.firstBaseUpdate=Z:y.next=Z,re.lastBaseUpdate=z))}if(s!==null){var ce=l.baseState;g=0,re=Z=z=null,y=s;do{var ee=y.lane&-536870913,ne=ee!==y.lane;if(ne?(He&ee)===ee:(r&ee)===ee){ee!==0&&ee===zr&&(Is=!0),re!==null&&(re=re.next={lane:0,tag:y.tag,payload:y.payload,callback:null,next:null});e:{var ye=e,Te=y;ee=t;var ot=n;switch(Te.tag){case 1:if(ye=Te.payload,typeof ye=="function"){ce=ye.call(ot,ce,ee);break e}ce=ye;break e;case 3:ye.flags=ye.flags&-65537|128;case 0:if(ye=Te.payload,ee=typeof ye=="function"?ye.call(ot,ce,ee):ye,ee==null)break e;ce=w({},ce,ee);break e;case 2:xa=!0}}ee=y.callback,ee!==null&&(e.flags|=64,ne&&(e.flags|=8192),ne=l.callbacks,ne===null?l.callbacks=[ee]:ne.push(ee))}else ne={lane:ee,tag:y.tag,payload:y.payload,callback:y.callback,next:null},re===null?(Z=re=ne,z=ce):re=re.next=ne,g|=ee;if(y=y.next,y===null){if(y=l.shared.pending,y===null)break;ne=y,y=ne.next,ne.next=null,l.lastBaseUpdate=ne,l.shared.pending=null}}while(!0);re===null&&(z=ce),l.baseState=z,l.firstBaseUpdate=Z,l.lastBaseUpdate=re,s===null&&(l.shared.lanes=0),Ca|=g,e.lanes=g,e.memoizedState=ce}}function gf(e,t){if(typeof e!="function")throw Error(u(191,e));e.call(t)}function mf(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)gf(n[e],t)}var Or=v(null),_l=v(0);function hf(e,t){e=la,te(_l,e),te(Or,t),la=e|t.baseLanes}function Ks(){te(_l,la),te(Or,Or.current)}function qs(){la=_l.current,k(Or),k(_l)}var on=v(null),wn=null;function Sa(e){var t=e.alternate;te(St,St.current&1),te(on,e),wn===null&&(t===null||Or.current!==null||t.memoizedState!==null)&&(wn=e)}function Ws(e){te(St,St.current),te(on,e),wn===null&&(wn=e)}function bf(e){e.tag===22?(te(St,St.current),te(on,e),wn===null&&(wn=e)):ja()}function ja(){te(St,St.current),te(on,on.current)}function sn(e){k(on),wn===e&&(wn=null),k(St)}var St=v(0);function Dl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Qc(n)||Pc(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Zn=0,Ae=null,it=null,Tt=null,$l=!1,Br=!1,tr=!1,Hl=0,Ci=0,Mr=null,rb=0;function vt(){throw Error(u(321))}function Gs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!rn(e[n],t[n]))return!1;return!0}function Ys(e,t,n,r,l,s){return Zn=s,Ae=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,j.H=e===null||e.memoizedState===null?ep:oc,tr=!1,s=n(r,l),tr=!1,Br&&(s=xf(t,n,r,l)),yf(e),s}function yf(e){j.H=zi;var t=it!==null&&it.next!==null;if(Zn=0,Tt=it=Ae=null,$l=!1,Ci=0,Mr=null,t)throw Error(u(300));e===null||Ct||(e=e.dependencies,e!==null&&Nl(e)&&(Ct=!0))}function xf(e,t,n,r){Ae=e;var l=0;do{if(Br&&(Mr=null),Ci=0,Br=!1,25<=l)throw Error(u(301));if(l+=1,Tt=it=null,e.updateQueue!=null){var s=e.updateQueue;s.lastEffect=null,s.events=null,s.stores=null,s.memoCache!=null&&(s.memoCache.index=0)}j.H=tp,s=t(n,r)}while(Br);return s}function ib(){var e=j.H,t=e.useState()[0];return t=typeof t.then=="function"?Ri(t):t,e=e.useState()[0],(it!==null?it.memoizedState:null)!==e&&(Ae.flags|=1024),t}function Fs(){var e=Hl!==0;return Hl=0,e}function Vs(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Xs(e){if($l){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}$l=!1}Zn=0,Tt=it=Ae=null,Br=!1,Ci=Hl=0,Mr=null}function It(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Tt===null?Ae.memoizedState=Tt=e:Tt=Tt.next=e,Tt}function jt(){if(it===null){var e=Ae.alternate;e=e!==null?e.memoizedState:null}else e=it.next;var t=Tt===null?Ae.memoizedState:Tt.next;if(t!==null)Tt=t,it=e;else{if(e===null)throw Ae.alternate===null?Error(u(467)):Error(u(310));it=e,e={memoizedState:it.memoizedState,baseState:it.baseState,baseQueue:it.baseQueue,queue:it.queue,next:null},Tt===null?Ae.memoizedState=Tt=e:Tt=Tt.next=e}return Tt}function Il(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ri(e){var t=Ci;return Ci+=1,Mr===null&&(Mr=[]),e=cf(Mr,e,t),t=Ae,(Tt===null?t.memoizedState:Tt.next)===null&&(t=t.alternate,j.H=t===null||t.memoizedState===null?ep:oc),e}function Kl(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ri(e);if(e.$$typeof===D)return Bt(e)}throw Error(u(438,String(e)))}function Qs(e){var t=null,n=Ae.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=Ae.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(l){return l.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Il(),Ae.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=F;return t.index++,n}function Jn(e,t){return typeof t=="function"?t(e):t}function ql(e){var t=jt();return Ps(t,it,e)}function Ps(e,t,n){var r=e.queue;if(r===null)throw Error(u(311));r.lastRenderedReducer=n;var l=e.baseQueue,s=r.pending;if(s!==null){if(l!==null){var g=l.next;l.next=s.next,s.next=g}t.baseQueue=l=s,r.pending=null}if(s=e.baseState,l===null)e.memoizedState=s;else{t=l.next;var y=g=null,z=null,Z=t,re=!1;do{var ce=Z.lane&-536870913;if(ce!==Z.lane?(He&ce)===ce:(Zn&ce)===ce){var ee=Z.revertLane;if(ee===0)z!==null&&(z=z.next={lane:0,revertLane:0,gesture:null,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null}),ce===zr&&(re=!0);else if((Zn&ee)===ee){Z=Z.next,ee===zr&&(re=!0);continue}else ce={lane:0,revertLane:Z.revertLane,gesture:null,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null},z===null?(y=z=ce,g=s):z=z.next=ce,Ae.lanes|=ee,Ca|=ee;ce=Z.action,tr&&n(s,ce),s=Z.hasEagerState?Z.eagerState:n(s,ce)}else ee={lane:ce,revertLane:Z.revertLane,gesture:Z.gesture,action:Z.action,hasEagerState:Z.hasEagerState,eagerState:Z.eagerState,next:null},z===null?(y=z=ee,g=s):z=z.next=ee,Ae.lanes|=ce,Ca|=ce;Z=Z.next}while(Z!==null&&Z!==t);if(z===null?g=s:z.next=y,!rn(s,e.memoizedState)&&(Ct=!0,re&&(n=Nr,n!==null)))throw n;e.memoizedState=s,e.baseState=g,e.baseQueue=z,r.lastRenderedState=s}return l===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Zs(e){var t=jt(),n=t.queue;if(n===null)throw Error(u(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,s=t.memoizedState;if(l!==null){n.pending=null;var g=l=l.next;do s=e(s,g.action),g=g.next;while(g!==l);rn(s,t.memoizedState)||(Ct=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,r]}function vf(e,t,n){var r=Ae,l=jt(),s=Ke;if(s){if(n===void 0)throw Error(u(407));n=n()}else n=t();var g=!rn((it||l).memoizedState,n);if(g&&(l.memoizedState=n,Ct=!0),l=l.queue,tc(jf.bind(null,r,l,e),[e]),l.getSnapshot!==t||g||Tt!==null&&Tt.memoizedState.tag&1){if(r.flags|=2048,Lr(9,{destroy:void 0},Sf.bind(null,r,l,n,t),null),ct===null)throw Error(u(349));s||(Zn&127)!==0||wf(r,t,n)}return n}function wf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ae.updateQueue,t===null?(t=Il(),Ae.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Sf(e,t,n,r){t.value=n,t.getSnapshot=r,kf(t)&&Tf(e)}function jf(e,t,n){return n(function(){kf(t)&&Tf(e)})}function kf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!rn(e,n)}catch{return!0}}function Tf(e){var t=Ya(e,2);t!==null&&Zt(t,e,2)}function Js(e){var t=It();if(typeof e=="function"){var n=e;if(e=n(),tr){Mn(!0);try{n()}finally{Mn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jn,lastRenderedState:e},t}function Cf(e,t,n,r){return e.baseState=n,Ps(e,it,typeof r=="function"?r:Jn)}function lb(e,t,n,r,l){if(Yl(e))throw Error(u(485));if(e=t.action,e!==null){var s={payload:l,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(g){s.listeners.push(g)}};j.T!==null?n(!0):s.isTransition=!1,r(s),n=t.pending,n===null?(s.next=t.pending=s,Rf(t,s)):(s.next=n.next,t.pending=n.next=s)}}function Rf(e,t){var n=t.action,r=t.payload,l=e.state;if(t.isTransition){var s=j.T,g={};j.T=g;try{var y=n(l,r),z=j.S;z!==null&&z(g,y),Ef(e,t,y)}catch(Z){ec(e,t,Z)}finally{s!==null&&g.types!==null&&(s.types=g.types),j.T=s}}else try{s=n(l,r),Ef(e,t,s)}catch(Z){ec(e,t,Z)}}function Ef(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(r){zf(e,t,r)},function(r){return ec(e,t,r)}):zf(e,t,n)}function zf(e,t,n){t.status="fulfilled",t.value=n,Nf(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Rf(e,n)))}function ec(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status="rejected",t.reason=n,Nf(t),t=t.next;while(t!==r)}e.action=null}function Nf(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Af(e,t){return t}function Uf(e,t){if(Ke){var n=ct.formState;if(n!==null){e:{var r=Ae;if(Ke){if(pt){t:{for(var l=pt,s=vn;l.nodeType!==8;){if(!s){l=null;break t}if(l=Sn(l.nextSibling),l===null){l=null;break t}}s=l.data,l=s==="F!"||s==="F"?l:null}if(l){pt=Sn(l.nextSibling),r=l.data==="F!";break e}}ba(r)}r=!1}r&&(t=n[0])}}return n=It(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Af,lastRenderedState:t},n.queue=r,n=Pf.bind(null,Ae,r),r.dispatch=n,r=Js(!1),s=lc.bind(null,Ae,!1,r.queue),r=It(),l={state:t,dispatch:null,action:e,pending:null},r.queue=l,n=lb.bind(null,Ae,l,s,n),l.dispatch=n,r.memoizedState=e,[t,n,!1]}function Of(e){var t=jt();return Bf(t,it,e)}function Bf(e,t,n){if(t=Ps(e,t,Af)[0],e=ql(Jn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var r=Ri(t)}catch(g){throw g===Ar?Ol:g}else r=t;t=jt();var l=t.queue,s=l.dispatch;return n!==t.memoizedState&&(Ae.flags|=2048,Lr(9,{destroy:void 0},ob.bind(null,l,n),null)),[r,s,e]}function ob(e,t){e.action=t}function Mf(e){var t=jt(),n=it;if(n!==null)return Bf(t,n,e);jt(),t=t.memoizedState,n=jt();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function Lr(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=Ae.updateQueue,t===null&&(t=Il(),Ae.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function Lf(){return jt().memoizedState}function Wl(e,t,n,r){var l=It();Ae.flags|=e,l.memoizedState=Lr(1|t,{destroy:void 0},n,r===void 0?null:r)}function Gl(e,t,n,r){var l=jt();r=r===void 0?null:r;var s=l.memoizedState.inst;it!==null&&r!==null&&Gs(r,it.memoizedState.deps)?l.memoizedState=Lr(t,s,n,r):(Ae.flags|=e,l.memoizedState=Lr(1|t,s,n,r))}function _f(e,t){Wl(8390656,8,e,t)}function tc(e,t){Gl(2048,8,e,t)}function sb(e){Ae.flags|=4;var t=Ae.updateQueue;if(t===null)t=Il(),Ae.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Df(e){var t=jt().memoizedState;return sb({ref:t,nextImpl:e}),function(){if((Pe&2)!==0)throw Error(u(440));return t.impl.apply(void 0,arguments)}}function $f(e,t){return Gl(4,2,e,t)}function Hf(e,t){return Gl(4,4,e,t)}function If(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Kf(e,t,n){n=n!=null?n.concat([e]):null,Gl(4,4,If.bind(null,t,e),n)}function nc(){}function qf(e,t){var n=jt();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Gs(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Wf(e,t){var n=jt();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Gs(t,r[1]))return r[0];if(r=e(),tr){Mn(!0);try{e()}finally{Mn(!1)}}return n.memoizedState=[r,t],r}function ac(e,t,n){return n===void 0||(Zn&1073741824)!==0&&(He&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Gp(),Ae.lanes|=e,Ca|=e,n)}function Gf(e,t,n,r){return rn(n,t)?n:Or.current!==null?(e=ac(e,n,r),rn(e,t)||(Ct=!0),e):(Zn&42)===0||(Zn&1073741824)!==0&&(He&261930)===0?(Ct=!0,e.memoizedState=n):(e=Gp(),Ae.lanes|=e,Ca|=e,t)}function Yf(e,t,n,r,l){var s=K.p;K.p=s!==0&&8>s?s:8;var g=j.T,y={};j.T=y,lc(e,!1,t,n);try{var z=l(),Z=j.S;if(Z!==null&&Z(y,z),z!==null&&typeof z=="object"&&typeof z.then=="function"){var re=ab(z,r);Ei(e,t,re,dn(e))}else Ei(e,t,r,dn(e))}catch(ce){Ei(e,t,{then:function(){},status:"rejected",reason:ce},dn())}finally{K.p=s,g!==null&&y.types!==null&&(g.types=y.types),j.T=g}}function cb(){}function rc(e,t,n,r){if(e.tag!==5)throw Error(u(476));var l=Ff(e).queue;Yf(e,l,t,I,n===null?cb:function(){return Vf(e),n(r)})}function Ff(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:I,baseState:I,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jn,lastRenderedState:I},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Vf(e){var t=Ff(e);t.next===null&&(t=e.alternate.memoizedState),Ei(e,t.next.queue,{},dn())}function ic(){return Bt(Gi)}function Xf(){return jt().memoizedState}function Qf(){return jt().memoizedState}function ub(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=dn();e=va(n);var r=wa(t,e,n);r!==null&&(Zt(r,t,n),ji(r,t,n)),t={cache:Bs()},e.payload=t;return}t=t.return}}function db(e,t,n){var r=dn();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Yl(e)?Zf(t,n):(n=js(e,t,n,r),n!==null&&(Zt(n,e,r),Jf(n,t,r)))}function Pf(e,t,n){var r=dn();Ei(e,t,n,r)}function Ei(e,t,n,r){var l={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Yl(e))Zf(t,l);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var g=t.lastRenderedState,y=s(g,n);if(l.hasEagerState=!0,l.eagerState=y,rn(y,g))return Cl(e,t,l,0),ct===null&&Tl(),!1}catch{}if(n=js(e,t,l,r),n!==null)return Zt(n,e,r),Jf(n,t,r),!0}return!1}function lc(e,t,n,r){if(r={lane:2,revertLane:Dc(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Yl(e)){if(t)throw Error(u(479))}else t=js(e,n,r,2),t!==null&&Zt(t,e,2)}function Yl(e){var t=e.alternate;return e===Ae||t!==null&&t===Ae}function Zf(e,t){Br=$l=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Jf(e,t,n){if((n&4194048)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ad(e,n)}}var zi={readContext:Bt,use:Kl,useCallback:vt,useContext:vt,useEffect:vt,useImperativeHandle:vt,useLayoutEffect:vt,useInsertionEffect:vt,useMemo:vt,useReducer:vt,useRef:vt,useState:vt,useDebugValue:vt,useDeferredValue:vt,useTransition:vt,useSyncExternalStore:vt,useId:vt,useHostTransitionStatus:vt,useFormState:vt,useActionState:vt,useOptimistic:vt,useMemoCache:vt,useCacheRefresh:vt};zi.useEffectEvent=vt;var ep={readContext:Bt,use:Kl,useCallback:function(e,t){return It().memoizedState=[e,t===void 0?null:t],e},useContext:Bt,useEffect:_f,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Wl(4194308,4,If.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Wl(4194308,4,e,t)},useInsertionEffect:function(e,t){Wl(4,2,e,t)},useMemo:function(e,t){var n=It();t=t===void 0?null:t;var r=e();if(tr){Mn(!0);try{e()}finally{Mn(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=It();if(n!==void 0){var l=n(t);if(tr){Mn(!0);try{n(t)}finally{Mn(!1)}}}else l=t;return r.memoizedState=r.baseState=l,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:l},r.queue=e,e=e.dispatch=db.bind(null,Ae,e),[r.memoizedState,e]},useRef:function(e){var t=It();return e={current:e},t.memoizedState=e},useState:function(e){e=Js(e);var t=e.queue,n=Pf.bind(null,Ae,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:nc,useDeferredValue:function(e,t){var n=It();return ac(n,e,t)},useTransition:function(){var e=Js(!1);return e=Yf.bind(null,Ae,e.queue,!0,!1),It().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=Ae,l=It();if(Ke){if(n===void 0)throw Error(u(407));n=n()}else{if(n=t(),ct===null)throw Error(u(349));(He&127)!==0||wf(r,t,n)}l.memoizedState=n;var s={value:n,getSnapshot:t};return l.queue=s,_f(jf.bind(null,r,s,e),[e]),r.flags|=2048,Lr(9,{destroy:void 0},Sf.bind(null,r,s,n,t),null),n},useId:function(){var e=It(),t=ct.identifierPrefix;if(Ke){var n=_n,r=Ln;n=(r&~(1<<32-Ht(r)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Hl++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=rb++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:ic,useFormState:Uf,useActionState:Uf,useOptimistic:function(e){var t=It();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=lc.bind(null,Ae,!0,n),n.dispatch=t,[e,t]},useMemoCache:Qs,useCacheRefresh:function(){return It().memoizedState=ub.bind(null,Ae)},useEffectEvent:function(e){var t=It(),n={impl:e};return t.memoizedState=n,function(){if((Pe&2)!==0)throw Error(u(440));return n.impl.apply(void 0,arguments)}}},oc={readContext:Bt,use:Kl,useCallback:qf,useContext:Bt,useEffect:tc,useImperativeHandle:Kf,useInsertionEffect:$f,useLayoutEffect:Hf,useMemo:Wf,useReducer:ql,useRef:Lf,useState:function(){return ql(Jn)},useDebugValue:nc,useDeferredValue:function(e,t){var n=jt();return Gf(n,it.memoizedState,e,t)},useTransition:function(){var e=ql(Jn)[0],t=jt().memoizedState;return[typeof e=="boolean"?e:Ri(e),t]},useSyncExternalStore:vf,useId:Xf,useHostTransitionStatus:ic,useFormState:Of,useActionState:Of,useOptimistic:function(e,t){var n=jt();return Cf(n,it,e,t)},useMemoCache:Qs,useCacheRefresh:Qf};oc.useEffectEvent=Df;var tp={readContext:Bt,use:Kl,useCallback:qf,useContext:Bt,useEffect:tc,useImperativeHandle:Kf,useInsertionEffect:$f,useLayoutEffect:Hf,useMemo:Wf,useReducer:Zs,useRef:Lf,useState:function(){return Zs(Jn)},useDebugValue:nc,useDeferredValue:function(e,t){var n=jt();return it===null?ac(n,e,t):Gf(n,it.memoizedState,e,t)},useTransition:function(){var e=Zs(Jn)[0],t=jt().memoizedState;return[typeof e=="boolean"?e:Ri(e),t]},useSyncExternalStore:vf,useId:Xf,useHostTransitionStatus:ic,useFormState:Mf,useActionState:Mf,useOptimistic:function(e,t){var n=jt();return it!==null?Cf(n,it,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Qs,useCacheRefresh:Qf};tp.useEffectEvent=Df;function sc(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:w({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var cc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=dn(),l=va(r);l.payload=t,n!=null&&(l.callback=n),t=wa(e,l,r),t!==null&&(Zt(t,e,r),ji(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=dn(),l=va(r);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=wa(e,l,r),t!==null&&(Zt(t,e,r),ji(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=dn(),r=va(n);r.tag=2,t!=null&&(r.callback=t),t=wa(e,r,n),t!==null&&(Zt(t,e,n),ji(t,e,n))}};function np(e,t,n,r,l,s,g){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,g):t.prototype&&t.prototype.isPureReactComponent?!mi(n,r)||!mi(l,s):!0}function ap(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&cc.enqueueReplaceState(t,t.state,null)}function nr(e,t){var n=t;if("ref"in t){n={};for(var r in t)r!=="ref"&&(n[r]=t[r])}if(e=e.defaultProps){n===t&&(n=w({},n));for(var l in e)n[l]===void 0&&(n[l]=e[l])}return n}function rp(e){kl(e)}function ip(e){console.error(e)}function lp(e){kl(e)}function Fl(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(r){setTimeout(function(){throw r})}}function op(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(l){setTimeout(function(){throw l})}}function uc(e,t,n){return n=va(n),n.tag=3,n.payload={element:null},n.callback=function(){Fl(e,t)},n}function sp(e){return e=va(e),e.tag=3,e}function cp(e,t,n,r){var l=n.type.getDerivedStateFromError;if(typeof l=="function"){var s=r.value;e.payload=function(){return l(s)},e.callback=function(){op(t,n,r)}}var g=n.stateNode;g!==null&&typeof g.componentDidCatch=="function"&&(e.callback=function(){op(t,n,r),typeof l!="function"&&(Ra===null?Ra=new Set([this]):Ra.add(this));var y=r.stack;this.componentDidCatch(r.value,{componentStack:y!==null?y:""})})}function fb(e,t,n,r,l){if(n.flags|=32768,r!==null&&typeof r=="object"&&typeof r.then=="function"){if(t=n.alternate,t!==null&&Er(t,n,l,!0),n=on.current,n!==null){switch(n.tag){case 31:case 13:return wn===null?io():n.alternate===null&&wt===0&&(wt=3),n.flags&=-257,n.flags|=65536,n.lanes=l,r===Bl?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Mc(e,r,l)),!1;case 22:return n.flags|=65536,r===Bl?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Mc(e,r,l)),!1}throw Error(u(435,n.tag))}return Mc(e,r,l),io(),!1}if(Ke)return t=on.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=l,r!==zs&&(e=Error(u(422),{cause:r}),yi(bn(e,n)))):(r!==zs&&(t=Error(u(423),{cause:r}),yi(bn(t,n))),e=e.current.alternate,e.flags|=65536,l&=-l,e.lanes|=l,r=bn(r,n),l=uc(e.stateNode,r,l),Hs(e,l),wt!==4&&(wt=2)),!1;var s=Error(u(520),{cause:r});if(s=bn(s,n),_i===null?_i=[s]:_i.push(s),wt!==4&&(wt=2),t===null)return!0;r=bn(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=l&-l,n.lanes|=e,e=uc(n.stateNode,r,e),Hs(n,e),!1;case 1:if(t=n.type,s=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||s!==null&&typeof s.componentDidCatch=="function"&&(Ra===null||!Ra.has(s))))return n.flags|=65536,l&=-l,n.lanes|=l,l=sp(l),cp(l,e,n,r),Hs(n,l),!1}n=n.return}while(n!==null);return!1}var dc=Error(u(461)),Ct=!1;function Mt(e,t,n,r){t.child=e===null?pf(t,null,n,r):er(t,e.child,n,r)}function up(e,t,n,r,l){n=n.render;var s=t.ref;if("ref"in r){var g={};for(var y in r)y!=="ref"&&(g[y]=r[y])}else g=r;return Qa(t),r=Ys(e,t,n,g,s,l),y=Fs(),e!==null&&!Ct?(Vs(e,t,l),ea(e,t,l)):(Ke&&y&&Rs(t),t.flags|=1,Mt(e,t,r,l),t.child)}function dp(e,t,n,r,l){if(e===null){var s=n.type;return typeof s=="function"&&!ks(s)&&s.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=s,fp(e,t,s,r,l)):(e=El(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!xc(e,l)){var g=s.memoizedProps;if(n=n.compare,n=n!==null?n:mi,n(g,r)&&e.ref===t.ref)return ea(e,t,l)}return t.flags|=1,e=Vn(s,r),e.ref=t.ref,e.return=t,t.child=e}function fp(e,t,n,r,l){if(e!==null){var s=e.memoizedProps;if(mi(s,r)&&e.ref===t.ref)if(Ct=!1,t.pendingProps=r=s,xc(e,l))(e.flags&131072)!==0&&(Ct=!0);else return t.lanes=e.lanes,ea(e,t,l)}return fc(e,t,n,r,l)}function pp(e,t,n,r){var l=r.children,s=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode==="hidden"){if((t.flags&128)!==0){if(s=s!==null?s.baseLanes|n:n,e!==null){for(r=t.child=e.child,l=0;r!==null;)l=l|r.lanes|r.childLanes,r=r.sibling;r=l&~s}else r=0,t.child=null;return gp(e,t,s,n,r)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ul(t,s!==null?s.cachePool:null),s!==null?hf(t,s):Ks(),bf(t);else return r=t.lanes=536870912,gp(e,t,s!==null?s.baseLanes|n:n,n,r)}else s!==null?(Ul(t,s.cachePool),hf(t,s),ja(),t.memoizedState=null):(e!==null&&Ul(t,null),Ks(),ja());return Mt(e,t,l,n),t.child}function Ni(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function gp(e,t,n,r,l){var s=Ls();return s=s===null?null:{parent:kt._currentValue,pool:s},t.memoizedState={baseLanes:n,cachePool:s},e!==null&&Ul(t,null),Ks(),bf(t),e!==null&&Er(e,t,r,!0),t.childLanes=l,null}function Vl(e,t){return t=Ql({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function mp(e,t,n){return er(t,e.child,null,n),e=Vl(t,t.pendingProps),e.flags|=2,sn(t),t.memoizedState=null,e}function pb(e,t,n){var r=t.pendingProps,l=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Ke){if(r.mode==="hidden")return e=Vl(t,r),t.lanes=536870912,Ni(null,e);if(Ws(t),(e=pt)?(e=Rg(e,vn),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ma!==null?{id:Ln,overflow:_n}:null,retryLane:536870912,hydrationErrors:null},n=Pd(e),n.return=t,t.child=n,Ot=t,pt=null)):e=null,e===null)throw ba(t);return t.lanes=536870912,null}return Vl(t,r)}var s=e.memoizedState;if(s!==null){var g=s.dehydrated;if(Ws(t),l)if(t.flags&256)t.flags&=-257,t=mp(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(u(558));else if(Ct||Er(e,t,n,!1),l=(n&e.childLanes)!==0,Ct||l){if(r=ct,r!==null&&(g=rd(r,n),g!==0&&g!==s.retryLane))throw s.retryLane=g,Ya(e,g),Zt(r,e,g),dc;io(),t=mp(e,t,n)}else e=s.treeContext,pt=Sn(g.nextSibling),Ot=t,Ke=!0,ha=null,vn=!1,e!==null&&ef(t,e),t=Vl(t,r),t.flags|=4096;return t}return e=Vn(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Xl(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(u(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function fc(e,t,n,r,l){return Qa(t),n=Ys(e,t,n,r,void 0,l),r=Fs(),e!==null&&!Ct?(Vs(e,t,l),ea(e,t,l)):(Ke&&r&&Rs(t),t.flags|=1,Mt(e,t,n,l),t.child)}function hp(e,t,n,r,l,s){return Qa(t),t.updateQueue=null,n=xf(t,r,n,l),yf(e),r=Fs(),e!==null&&!Ct?(Vs(e,t,s),ea(e,t,s)):(Ke&&r&&Rs(t),t.flags|=1,Mt(e,t,n,s),t.child)}function bp(e,t,n,r,l){if(Qa(t),t.stateNode===null){var s=kr,g=n.contextType;typeof g=="object"&&g!==null&&(s=Bt(g)),s=new n(r,s),t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=cc,t.stateNode=s,s._reactInternals=t,s=t.stateNode,s.props=r,s.state=t.memoizedState,s.refs={},Ds(t),g=n.contextType,s.context=typeof g=="object"&&g!==null?Bt(g):kr,s.state=t.memoizedState,g=n.getDerivedStateFromProps,typeof g=="function"&&(sc(t,n,g,r),s.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(g=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),g!==s.state&&cc.enqueueReplaceState(s,s.state,null),Ti(t,r,s,l),ki(),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!0}else if(e===null){s=t.stateNode;var y=t.memoizedProps,z=nr(n,y);s.props=z;var Z=s.context,re=n.contextType;g=kr,typeof re=="object"&&re!==null&&(g=Bt(re));var ce=n.getDerivedStateFromProps;re=typeof ce=="function"||typeof s.getSnapshotBeforeUpdate=="function",y=t.pendingProps!==y,re||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(y||Z!==g)&&ap(t,s,r,g),xa=!1;var ee=t.memoizedState;s.state=ee,Ti(t,r,s,l),ki(),Z=t.memoizedState,y||ee!==Z||xa?(typeof ce=="function"&&(sc(t,n,ce,r),Z=t.memoizedState),(z=xa||np(t,n,z,r,ee,Z,g))?(re||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=Z),s.props=r,s.state=Z,s.context=g,r=z):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{s=t.stateNode,$s(e,t),g=t.memoizedProps,re=nr(n,g),s.props=re,ce=t.pendingProps,ee=s.context,Z=n.contextType,z=kr,typeof Z=="object"&&Z!==null&&(z=Bt(Z)),y=n.getDerivedStateFromProps,(Z=typeof y=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(g!==ce||ee!==z)&&ap(t,s,r,z),xa=!1,ee=t.memoizedState,s.state=ee,Ti(t,r,s,l),ki();var ne=t.memoizedState;g!==ce||ee!==ne||xa||e!==null&&e.dependencies!==null&&Nl(e.dependencies)?(typeof y=="function"&&(sc(t,n,y,r),ne=t.memoizedState),(re=xa||np(t,n,re,r,ee,ne,z)||e!==null&&e.dependencies!==null&&Nl(e.dependencies))?(Z||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,ne,z),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,ne,z)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||g===e.memoizedProps&&ee===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||g===e.memoizedProps&&ee===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=ne),s.props=r,s.state=ne,s.context=z,r=re):(typeof s.componentDidUpdate!="function"||g===e.memoizedProps&&ee===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||g===e.memoizedProps&&ee===e.memoizedState||(t.flags|=1024),r=!1)}return s=r,Xl(e,t),r=(t.flags&128)!==0,s||r?(s=t.stateNode,n=r&&typeof n.getDerivedStateFromError!="function"?null:s.render(),t.flags|=1,e!==null&&r?(t.child=er(t,e.child,null,l),t.child=er(t,null,n,l)):Mt(e,t,n,l),t.memoizedState=s.state,e=t.child):e=ea(e,t,l),e}function yp(e,t,n,r){return Va(),t.flags|=256,Mt(e,t,n,r),t.child}var pc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function gc(e){return{baseLanes:e,cachePool:of()}}function mc(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=un),e}function xp(e,t,n){var r=t.pendingProps,l=!1,s=(t.flags&128)!==0,g;if((g=s)||(g=e!==null&&e.memoizedState===null?!1:(St.current&2)!==0),g&&(l=!0,t.flags&=-129),g=(t.flags&32)!==0,t.flags&=-33,e===null){if(Ke){if(l?Sa(t):ja(),(e=pt)?(e=Rg(e,vn),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ma!==null?{id:Ln,overflow:_n}:null,retryLane:536870912,hydrationErrors:null},n=Pd(e),n.return=t,t.child=n,Ot=t,pt=null)):e=null,e===null)throw ba(t);return Pc(e)?t.lanes=32:t.lanes=536870912,null}var y=r.children;return r=r.fallback,l?(ja(),l=t.mode,y=Ql({mode:"hidden",children:y},l),r=Fa(r,l,n,null),y.return=t,r.return=t,y.sibling=r,t.child=y,r=t.child,r.memoizedState=gc(n),r.childLanes=mc(e,g,n),t.memoizedState=pc,Ni(null,r)):(Sa(t),hc(t,y))}var z=e.memoizedState;if(z!==null&&(y=z.dehydrated,y!==null)){if(s)t.flags&256?(Sa(t),t.flags&=-257,t=bc(e,t,n)):t.memoizedState!==null?(ja(),t.child=e.child,t.flags|=128,t=null):(ja(),y=r.fallback,l=t.mode,r=Ql({mode:"visible",children:r.children},l),y=Fa(y,l,n,null),y.flags|=2,r.return=t,y.return=t,r.sibling=y,t.child=r,er(t,e.child,null,n),r=t.child,r.memoizedState=gc(n),r.childLanes=mc(e,g,n),t.memoizedState=pc,t=Ni(null,r));else if(Sa(t),Pc(y)){if(g=y.nextSibling&&y.nextSibling.dataset,g)var Z=g.dgst;g=Z,r=Error(u(419)),r.stack="",r.digest=g,yi({value:r,source:null,stack:null}),t=bc(e,t,n)}else if(Ct||Er(e,t,n,!1),g=(n&e.childLanes)!==0,Ct||g){if(g=ct,g!==null&&(r=rd(g,n),r!==0&&r!==z.retryLane))throw z.retryLane=r,Ya(e,r),Zt(g,e,r),dc;Qc(y)||io(),t=bc(e,t,n)}else Qc(y)?(t.flags|=192,t.child=e.child,t=null):(e=z.treeContext,pt=Sn(y.nextSibling),Ot=t,Ke=!0,ha=null,vn=!1,e!==null&&ef(t,e),t=hc(t,r.children),t.flags|=4096);return t}return l?(ja(),y=r.fallback,l=t.mode,z=e.child,Z=z.sibling,r=Vn(z,{mode:"hidden",children:r.children}),r.subtreeFlags=z.subtreeFlags&65011712,Z!==null?y=Vn(Z,y):(y=Fa(y,l,n,null),y.flags|=2),y.return=t,r.return=t,r.sibling=y,t.child=r,Ni(null,r),r=t.child,y=e.child.memoizedState,y===null?y=gc(n):(l=y.cachePool,l!==null?(z=kt._currentValue,l=l.parent!==z?{parent:z,pool:z}:l):l=of(),y={baseLanes:y.baseLanes|n,cachePool:l}),r.memoizedState=y,r.childLanes=mc(e,g,n),t.memoizedState=pc,Ni(e.child,r)):(Sa(t),n=e.child,e=n.sibling,n=Vn(n,{mode:"visible",children:r.children}),n.return=t,n.sibling=null,e!==null&&(g=t.deletions,g===null?(t.deletions=[e],t.flags|=16):g.push(e)),t.child=n,t.memoizedState=null,n)}function hc(e,t){return t=Ql({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Ql(e,t){return e=ln(22,e,null,t),e.lanes=0,e}function bc(e,t,n){return er(t,e.child,null,n),e=hc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function vp(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Us(e.return,t,n)}function yc(e,t,n,r,l,s){var g=e.memoizedState;g===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l,treeForkCount:s}:(g.isBackwards=t,g.rendering=null,g.renderingStartTime=0,g.last=r,g.tail=n,g.tailMode=l,g.treeForkCount=s)}function wp(e,t,n){var r=t.pendingProps,l=r.revealOrder,s=r.tail;r=r.children;var g=St.current,y=(g&2)!==0;if(y?(g=g&1|2,t.flags|=128):g&=1,te(St,g),Mt(e,t,r,n),r=Ke?bi:0,!y&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&vp(e,n,t);else if(e.tag===19)vp(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Dl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),yc(t,!1,l,n,s,r);break;case"backwards":case"unstable_legacy-backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Dl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}yc(t,!0,n,null,s,r);break;case"together":yc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function ea(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ca|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Er(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(u(153));if(t.child!==null){for(e=t.child,n=Vn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Vn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function xc(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Nl(e)))}function gb(e,t,n){switch(t.tag){case 3:ae(t,t.stateNode.containerInfo),ya(t,kt,e.memoizedState.cache),Va();break;case 27:case 5:ue(t);break;case 4:ae(t,t.stateNode.containerInfo);break;case 10:ya(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ws(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated!==null?(Sa(t),t.flags|=128,null):(n&t.child.childLanes)!==0?xp(e,t,n):(Sa(t),e=ea(e,t,n),e!==null?e.sibling:null);Sa(t);break;case 19:var l=(e.flags&128)!==0;if(r=(n&t.childLanes)!==0,r||(Er(e,t,n,!1),r=(n&t.childLanes)!==0),l){if(r)return wp(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),te(St,St.current),r)break;return null;case 22:return t.lanes=0,pp(e,t,n,t.pendingProps);case 24:ya(t,kt,e.memoizedState.cache)}return ea(e,t,n)}function Sp(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Ct=!0;else{if(!xc(e,n)&&(t.flags&128)===0)return Ct=!1,gb(e,t,n);Ct=(e.flags&131072)!==0}else Ct=!1,Ke&&(t.flags&1048576)!==0&&Jd(t,bi,t.index);switch(t.lanes=0,t.tag){case 16:e:{var r=t.pendingProps;if(e=Za(t.elementType),t.type=e,typeof e=="function")ks(e)?(r=nr(e,r),t.tag=1,t=bp(null,t,e,r,n)):(t.tag=0,t=fc(null,t,e,r,n));else{if(e!=null){var l=e.$$typeof;if(l===Q){t.tag=11,t=up(null,t,e,r,n);break e}else if(l===M){t.tag=14,t=dp(null,t,e,r,n);break e}}throw t=ie(e)||e,Error(u(306,t,""))}}return t;case 0:return fc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,l=nr(r,t.pendingProps),bp(e,t,r,l,n);case 3:e:{if(ae(t,t.stateNode.containerInfo),e===null)throw Error(u(387));r=t.pendingProps;var s=t.memoizedState;l=s.element,$s(e,t),Ti(t,r,null,n);var g=t.memoizedState;if(r=g.cache,ya(t,kt,r),r!==s.cache&&Os(t,[kt],n,!0),ki(),r=g.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:g.cache},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){t=yp(e,t,r,n);break e}else if(r!==l){l=bn(Error(u(424)),t),yi(l),t=yp(e,t,r,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,pt=Sn(e.firstChild),Ot=t,Ke=!0,ha=null,vn=!0,n=pf(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Va(),r===l){t=ea(e,t,n);break e}Mt(e,t,r,n)}t=t.child}return t;case 26:return Xl(e,t),e===null?(n=Og(t.type,null,t.pendingProps,null))?t.memoizedState=n:Ke||(n=t.type,e=t.pendingProps,r=po(ge.current).createElement(n),r[Ut]=t,r[Yt]=e,Lt(r,n,e),zt(r),t.stateNode=r):t.memoizedState=Og(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ue(t),e===null&&Ke&&(r=t.stateNode=Ng(t.type,t.pendingProps,ge.current),Ot=t,vn=!0,l=pt,Aa(t.type)?(Zc=l,pt=Sn(r.firstChild)):pt=l),Mt(e,t,t.pendingProps.children,n),Xl(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Ke&&((l=r=pt)&&(r=Wb(r,t.type,t.pendingProps,vn),r!==null?(t.stateNode=r,Ot=t,pt=Sn(r.firstChild),vn=!1,l=!0):l=!1),l||ba(t)),ue(t),l=t.type,s=t.pendingProps,g=e!==null?e.memoizedProps:null,r=s.children,Fc(l,s)?r=null:g!==null&&Fc(l,g)&&(t.flags|=32),t.memoizedState!==null&&(l=Ys(e,t,ib,null,null,n),Gi._currentValue=l),Xl(e,t),Mt(e,t,r,n),t.child;case 6:return e===null&&Ke&&((e=n=pt)&&(n=Gb(n,t.pendingProps,vn),n!==null?(t.stateNode=n,Ot=t,pt=null,e=!0):e=!1),e||ba(t)),null;case 13:return xp(e,t,n);case 4:return ae(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=er(t,null,r,n):Mt(e,t,r,n),t.child;case 11:return up(e,t,t.type,t.pendingProps,n);case 7:return Mt(e,t,t.pendingProps,n),t.child;case 8:return Mt(e,t,t.pendingProps.children,n),t.child;case 12:return Mt(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,ya(t,t.type,r.value),Mt(e,t,r.children,n),t.child;case 9:return l=t.type._context,r=t.pendingProps.children,Qa(t),l=Bt(l),r=r(l),t.flags|=1,Mt(e,t,r,n),t.child;case 14:return dp(e,t,t.type,t.pendingProps,n);case 15:return fp(e,t,t.type,t.pendingProps,n);case 19:return wp(e,t,n);case 31:return pb(e,t,n);case 22:return pp(e,t,n,t.pendingProps);case 24:return Qa(t),r=Bt(kt),e===null?(l=Ls(),l===null&&(l=ct,s=Bs(),l.pooledCache=s,s.refCount++,s!==null&&(l.pooledCacheLanes|=n),l=s),t.memoizedState={parent:r,cache:l},Ds(t),ya(t,kt,l)):((e.lanes&n)!==0&&($s(e,t),Ti(t,null,null,n),ki()),l=e.memoizedState,s=t.memoizedState,l.parent!==r?(l={parent:r,cache:r},t.memoizedState=l,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=l),ya(t,kt,r)):(r=s.cache,ya(t,kt,r),r!==l.cache&&Os(t,[kt],n,!0))),Mt(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(u(156,t.tag))}function ta(e){e.flags|=4}function vc(e,t,n,r,l){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(l&335544128)===l)if(e.stateNode.complete)e.flags|=8192;else if(Xp())e.flags|=8192;else throw Ja=Bl,_s}else e.flags&=-16777217}function jp(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Dg(t))if(Xp())e.flags|=8192;else throw Ja=Bl,_s}function Pl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?ri():536870912,e.lanes|=t,Hr|=t)}function Ai(e,t){if(!Ke)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function gt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&65011712,r|=l.flags&65011712,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function mb(e,t,n){var r=t.pendingProps;switch(Es(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return gt(t),null;case 1:return gt(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),Pn(kt),pe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Rr(t)?ta(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ns())),gt(t),null;case 26:var l=t.type,s=t.memoizedState;return e===null?(ta(t),s!==null?(gt(t),jp(t,s)):(gt(t),vc(t,l,null,r,n))):s?s!==e.memoizedState?(ta(t),gt(t),jp(t,s)):(gt(t),t.flags&=-16777217):(e=e.memoizedProps,e!==r&&ta(t),gt(t),vc(t,l,e,r,n)),null;case 27:if(me(t),n=ge.current,l=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&ta(t);else{if(!r){if(t.stateNode===null)throw Error(u(166));return gt(t),null}e=X.current,Rr(t)?tf(t):(e=Ng(l,r,n),t.stateNode=e,ta(t))}return gt(t),null;case 5:if(me(t),l=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&ta(t);else{if(!r){if(t.stateNode===null)throw Error(u(166));return gt(t),null}if(s=X.current,Rr(t))tf(t);else{var g=po(ge.current);switch(s){case 1:s=g.createElementNS("http://www.w3.org/2000/svg",l);break;case 2:s=g.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;default:switch(l){case"svg":s=g.createElementNS("http://www.w3.org/2000/svg",l);break;case"math":s=g.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;case"script":s=g.createElement("div"),s.innerHTML="<script><\/script>",s=s.removeChild(s.firstChild);break;case"select":s=typeof r.is=="string"?g.createElement("select",{is:r.is}):g.createElement("select"),r.multiple?s.multiple=!0:r.size&&(s.size=r.size);break;default:s=typeof r.is=="string"?g.createElement(l,{is:r.is}):g.createElement(l)}}s[Ut]=t,s[Yt]=r;e:for(g=t.child;g!==null;){if(g.tag===5||g.tag===6)s.appendChild(g.stateNode);else if(g.tag!==4&&g.tag!==27&&g.child!==null){g.child.return=g,g=g.child;continue}if(g===t)break e;for(;g.sibling===null;){if(g.return===null||g.return===t)break e;g=g.return}g.sibling.return=g.return,g=g.sibling}t.stateNode=s;e:switch(Lt(s,l,r),l){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}r&&ta(t)}}return gt(t),vc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&ta(t);else{if(typeof r!="string"&&t.stateNode===null)throw Error(u(166));if(e=ge.current,Rr(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,l=Ot,l!==null)switch(l.tag){case 27:case 5:r=l.memoizedProps}e[Ut]=t,e=!!(e.nodeValue===n||r!==null&&r.suppressHydrationWarning===!0||xg(e.nodeValue,n)),e||ba(t,!0)}else e=po(e).createTextNode(r),e[Ut]=t,t.stateNode=e}return gt(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Rr(t),n!==null){if(e===null){if(!r)throw Error(u(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(557));e[Ut]=t}else Va(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;gt(t),e=!1}else n=Ns(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(sn(t),t):(sn(t),null);if((t.flags&128)!==0)throw Error(u(558))}return gt(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(l=Rr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(u(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(u(317));l[Ut]=t}else Va(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;gt(t),l=!1}else l=Ns(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=l),l=!0;if(!l)return t.flags&256?(sn(t),t):(sn(t),null)}return sn(t),(t.flags&128)!==0?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,l=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(l=r.alternate.memoizedState.cachePool.pool),s=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(s=r.memoizedState.cachePool.pool),s!==l&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Pl(t,t.updateQueue),gt(t),null);case 4:return pe(),e===null&&Kc(t.stateNode.containerInfo),gt(t),null;case 10:return Pn(t.type),gt(t),null;case 19:if(k(St),r=t.memoizedState,r===null)return gt(t),null;if(l=(t.flags&128)!==0,s=r.rendering,s===null)if(l)Ai(r,!1);else{if(wt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=Dl(e),s!==null){for(t.flags|=128,Ai(r,!1),e=s.updateQueue,t.updateQueue=e,Pl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Qd(n,e),n=n.sibling;return te(St,St.current&1|2),Ke&&Xn(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&ze()>no&&(t.flags|=128,l=!0,Ai(r,!1),t.lanes=4194304)}else{if(!l)if(e=Dl(s),e!==null){if(t.flags|=128,l=!0,e=e.updateQueue,t.updateQueue=e,Pl(t,e),Ai(r,!0),r.tail===null&&r.tailMode==="hidden"&&!s.alternate&&!Ke)return gt(t),null}else 2*ze()-r.renderingStartTime>no&&n!==536870912&&(t.flags|=128,l=!0,Ai(r,!1),t.lanes=4194304);r.isBackwards?(s.sibling=t.child,t.child=s):(e=r.last,e!==null?e.sibling=s:t.child=s,r.last=s)}return r.tail!==null?(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=ze(),e.sibling=null,n=St.current,te(St,l?n&1|2:n&1),Ke&&Xn(t,r.treeForkCount),e):(gt(t),null);case 22:case 23:return sn(t),qs(),r=t.memoizedState!==null,e!==null?e.memoizedState!==null!==r&&(t.flags|=8192):r&&(t.flags|=8192),r?(n&536870912)!==0&&(t.flags&128)===0&&(gt(t),t.subtreeFlags&6&&(t.flags|=8192)):gt(t),n=t.updateQueue,n!==null&&Pl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&k(Pa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Pn(kt),gt(t),null;case 25:return null;case 30:return null}throw Error(u(156,t.tag))}function hb(e,t){switch(Es(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Pn(kt),pe(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return me(t),null;case 31:if(t.memoizedState!==null){if(sn(t),t.alternate===null)throw Error(u(340));Va()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(sn(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(u(340));Va()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return k(St),null;case 4:return pe(),null;case 10:return Pn(t.type),null;case 22:case 23:return sn(t),qs(),e!==null&&k(Pa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Pn(kt),null;case 25:return null;default:return null}}function kp(e,t){switch(Es(t),t.tag){case 3:Pn(kt),pe();break;case 26:case 27:case 5:me(t);break;case 4:pe();break;case 31:t.memoizedState!==null&&sn(t);break;case 13:sn(t);break;case 19:k(St);break;case 10:Pn(t.type);break;case 22:case 23:sn(t),qs(),e!==null&&k(Pa);break;case 24:Pn(kt)}}function Ui(e,t){try{var n=t.updateQueue,r=n!==null?n.lastEffect:null;if(r!==null){var l=r.next;n=l;do{if((n.tag&e)===e){r=void 0;var s=n.create,g=n.inst;r=s(),g.destroy=r}n=n.next}while(n!==l)}}catch(y){rt(t,t.return,y)}}function ka(e,t,n){try{var r=t.updateQueue,l=r!==null?r.lastEffect:null;if(l!==null){var s=l.next;r=s;do{if((r.tag&e)===e){var g=r.inst,y=g.destroy;if(y!==void 0){g.destroy=void 0,l=t;var z=n,Z=y;try{Z()}catch(re){rt(l,z,re)}}}r=r.next}while(r!==s)}}catch(re){rt(t,t.return,re)}}function Tp(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{mf(t,n)}catch(r){rt(e,e.return,r)}}}function Cp(e,t,n){n.props=nr(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(r){rt(e,t,r)}}function Oi(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n=="function"?e.refCleanup=n(r):n.current=r}}catch(l){rt(e,t,l)}}function Dn(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r=="function")try{r()}catch(l){rt(e,t,l)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(l){rt(e,t,l)}else n.current=null}function Rp(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&r.focus();break e;case"img":n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(l){rt(e,e.return,l)}}function wc(e,t,n){try{var r=e.stateNode;Db(r,e.type,n,t),r[Yt]=t}catch(l){rt(e,e.return,l)}}function Ep(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Aa(e.type)||e.tag===4}function Sc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ep(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Aa(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function jc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Yn));else if(r!==4&&(r===27&&Aa(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(jc(e,t,n),e=e.sibling;e!==null;)jc(e,t,n),e=e.sibling}function Zl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Aa(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Zl(e,t,n),e=e.sibling;e!==null;)Zl(e,t,n),e=e.sibling}function zp(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,l=t.attributes;l.length;)t.removeAttributeNode(l[0]);Lt(t,r,n),t[Ut]=e,t[Yt]=n}catch(s){rt(e,e.return,s)}}var na=!1,Rt=!1,kc=!1,Np=typeof WeakSet=="function"?WeakSet:Set,Nt=null;function bb(e,t){if(e=e.containerInfo,Gc=vo,e=Id(e),bs(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var g=0,y=-1,z=-1,Z=0,re=0,ce=e,ee=null;t:for(;;){for(var ne;ce!==n||l!==0&&ce.nodeType!==3||(y=g+l),ce!==s||r!==0&&ce.nodeType!==3||(z=g+r),ce.nodeType===3&&(g+=ce.nodeValue.length),(ne=ce.firstChild)!==null;)ee=ce,ce=ne;for(;;){if(ce===e)break t;if(ee===n&&++Z===l&&(y=g),ee===s&&++re===r&&(z=g),(ne=ce.nextSibling)!==null)break;ce=ee,ee=ce.parentNode}ce=ne}n=y===-1||z===-1?null:{start:y,end:z}}else n=null}n=n||{start:0,end:0}}else n=null;for(Yc={focusedElem:e,selectionRange:n},vo=!1,Nt=t;Nt!==null;)if(t=Nt,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Nt=e;else for(;Nt!==null;){switch(t=Nt,s=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)l=e[n],l.ref.impl=l.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&s!==null){e=void 0,n=t,l=s.memoizedProps,s=s.memoizedState,r=n.stateNode;try{var ye=nr(n.type,l);e=r.getSnapshotBeforeUpdate(ye,s),r.__reactInternalSnapshotBeforeUpdate=e}catch(Te){rt(n,n.return,Te)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Xc(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Xc(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(u(163))}if(e=t.sibling,e!==null){e.return=t.return,Nt=e;break}Nt=t.return}}function Ap(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:ra(e,n),r&4&&Ui(5,n);break;case 1:if(ra(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(g){rt(n,n.return,g)}else{var l=nr(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(l,t,e.__reactInternalSnapshotBeforeUpdate)}catch(g){rt(n,n.return,g)}}r&64&&Tp(n),r&512&&Oi(n,n.return);break;case 3:if(ra(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{mf(e,t)}catch(g){rt(n,n.return,g)}}break;case 27:t===null&&r&4&&zp(n);case 26:case 5:ra(e,n),t===null&&r&4&&Rp(n),r&512&&Oi(n,n.return);break;case 12:ra(e,n);break;case 31:ra(e,n),r&4&&Bp(e,n);break;case 13:ra(e,n),r&4&&Mp(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Cb.bind(null,n),Yb(e,n))));break;case 22:if(r=n.memoizedState!==null||na,!r){t=t!==null&&t.memoizedState!==null||Rt,l=na;var s=Rt;na=r,(Rt=t)&&!s?ia(e,n,(n.subtreeFlags&8772)!==0):ra(e,n),na=l,Rt=s}break;case 30:break;default:ra(e,n)}}function Up(e){var t=e.alternate;t!==null&&(e.alternate=null,Up(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&es(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var bt=null,Vt=!1;function aa(e,t,n){for(n=n.child;n!==null;)Op(e,t,n),n=n.sibling}function Op(e,t,n){if($t&&typeof $t.onCommitFiberUnmount=="function")try{$t.onCommitFiberUnmount(Ha,n)}catch{}switch(n.tag){case 26:Rt||Dn(n,t),aa(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Rt||Dn(n,t);var r=bt,l=Vt;Aa(n.type)&&(bt=n.stateNode,Vt=!1),aa(e,t,n),Ki(n.stateNode),bt=r,Vt=l;break;case 5:Rt||Dn(n,t);case 6:if(r=bt,l=Vt,bt=null,aa(e,t,n),bt=r,Vt=l,bt!==null)if(Vt)try{(bt.nodeType===9?bt.body:bt.nodeName==="HTML"?bt.ownerDocument.body:bt).removeChild(n.stateNode)}catch(s){rt(n,t,s)}else try{bt.removeChild(n.stateNode)}catch(s){rt(n,t,s)}break;case 18:bt!==null&&(Vt?(e=bt,Tg(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Vr(e)):Tg(bt,n.stateNode));break;case 4:r=bt,l=Vt,bt=n.stateNode.containerInfo,Vt=!0,aa(e,t,n),bt=r,Vt=l;break;case 0:case 11:case 14:case 15:ka(2,n,t),Rt||ka(4,n,t),aa(e,t,n);break;case 1:Rt||(Dn(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"&&Cp(n,t,r)),aa(e,t,n);break;case 21:aa(e,t,n);break;case 22:Rt=(r=Rt)||n.memoizedState!==null,aa(e,t,n),Rt=r;break;default:aa(e,t,n)}}function Bp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Vr(e)}catch(n){rt(t,t.return,n)}}}function Mp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Vr(e)}catch(n){rt(t,t.return,n)}}function yb(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Np),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Np),t;default:throw Error(u(435,e.tag))}}function Jl(e,t){var n=yb(e);t.forEach(function(r){if(!n.has(r)){n.add(r);var l=Rb.bind(null,e,r);r.then(l,l)}})}function Xt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r],s=e,g=t,y=g;e:for(;y!==null;){switch(y.tag){case 27:if(Aa(y.type)){bt=y.stateNode,Vt=!1;break e}break;case 5:bt=y.stateNode,Vt=!1;break e;case 3:case 4:bt=y.stateNode.containerInfo,Vt=!0;break e}y=y.return}if(bt===null)throw Error(u(160));Op(s,g,l),bt=null,Vt=!1,s=l.alternate,s!==null&&(s.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Lp(t,e),t=t.sibling}var Nn=null;function Lp(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Xt(t,e),Qt(e),r&4&&(ka(3,e,e.return),Ui(3,e),ka(5,e,e.return));break;case 1:Xt(t,e),Qt(e),r&512&&(Rt||n===null||Dn(n,n.return)),r&64&&na&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var l=Nn;if(Xt(t,e),Qt(e),r&512&&(Rt||n===null||Dn(n,n.return)),r&4){var s=n!==null?n.memoizedState:null;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){e:{r=e.type,n=e.memoizedProps,l=l.ownerDocument||l;t:switch(r){case"title":s=l.getElementsByTagName("title")[0],(!s||s[li]||s[Ut]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=l.createElement(r),l.head.insertBefore(s,l.querySelector("head > title"))),Lt(s,r,n),s[Ut]=e,zt(s),r=s;break e;case"link":var g=Lg("link","href",l).get(r+(n.href||""));if(g){for(var y=0;y<g.length;y++)if(s=g[y],s.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&s.getAttribute("rel")===(n.rel==null?null:n.rel)&&s.getAttribute("title")===(n.title==null?null:n.title)&&s.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){g.splice(y,1);break t}}s=l.createElement(r),Lt(s,r,n),l.head.appendChild(s);break;case"meta":if(g=Lg("meta","content",l).get(r+(n.content||""))){for(y=0;y<g.length;y++)if(s=g[y],s.getAttribute("content")===(n.content==null?null:""+n.content)&&s.getAttribute("name")===(n.name==null?null:n.name)&&s.getAttribute("property")===(n.property==null?null:n.property)&&s.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&s.getAttribute("charset")===(n.charSet==null?null:n.charSet)){g.splice(y,1);break t}}s=l.createElement(r),Lt(s,r,n),l.head.appendChild(s);break;default:throw Error(u(468,r))}s[Ut]=e,zt(s),r=s}e.stateNode=r}else _g(l,e.type,e.stateNode);else e.stateNode=Mg(l,r,e.memoizedProps);else s!==r?(s===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):s.count--,r===null?_g(l,e.type,e.stateNode):Mg(l,r,e.memoizedProps)):r===null&&e.stateNode!==null&&wc(e,e.memoizedProps,n.memoizedProps)}break;case 27:Xt(t,e),Qt(e),r&512&&(Rt||n===null||Dn(n,n.return)),n!==null&&r&4&&wc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Xt(t,e),Qt(e),r&512&&(Rt||n===null||Dn(n,n.return)),e.flags&32){l=e.stateNode;try{br(l,"")}catch(ye){rt(e,e.return,ye)}}r&4&&e.stateNode!=null&&(l=e.memoizedProps,wc(e,l,n!==null?n.memoizedProps:l)),r&1024&&(kc=!0);break;case 6:if(Xt(t,e),Qt(e),r&4){if(e.stateNode===null)throw Error(u(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(ye){rt(e,e.return,ye)}}break;case 3:if(ho=null,l=Nn,Nn=go(t.containerInfo),Xt(t,e),Nn=l,Qt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Vr(t.containerInfo)}catch(ye){rt(e,e.return,ye)}kc&&(kc=!1,_p(e));break;case 4:r=Nn,Nn=go(e.stateNode.containerInfo),Xt(t,e),Qt(e),Nn=r;break;case 12:Xt(t,e),Qt(e);break;case 31:Xt(t,e),Qt(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,Jl(e,r)));break;case 13:Xt(t,e),Qt(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(to=ze()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,Jl(e,r)));break;case 22:l=e.memoizedState!==null;var z=n!==null&&n.memoizedState!==null,Z=na,re=Rt;if(na=Z||l,Rt=re||z,Xt(t,e),Rt=re,na=Z,Qt(e),r&8192)e:for(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,l&&(n===null||z||na||Rt||ar(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){z=n=t;try{if(s=z.stateNode,l)g=s.style,typeof g.setProperty=="function"?g.setProperty("display","none","important"):g.display="none";else{y=z.stateNode;var ce=z.memoizedProps.style,ee=ce!=null&&ce.hasOwnProperty("display")?ce.display:null;y.style.display=ee==null||typeof ee=="boolean"?"":(""+ee).trim()}}catch(ye){rt(z,z.return,ye)}}}else if(t.tag===6){if(n===null){z=t;try{z.stateNode.nodeValue=l?"":z.memoizedProps}catch(ye){rt(z,z.return,ye)}}}else if(t.tag===18){if(n===null){z=t;try{var ne=z.stateNode;l?Cg(ne,!0):Cg(z.stateNode,!1)}catch(ye){rt(z,z.return,ye)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,Jl(e,n))));break;case 19:Xt(t,e),Qt(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,Jl(e,r)));break;case 30:break;case 21:break;default:Xt(t,e),Qt(e)}}function Qt(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Ep(r)){n=r;break}r=r.return}if(n==null)throw Error(u(160));switch(n.tag){case 27:var l=n.stateNode,s=Sc(e);Zl(e,s,l);break;case 5:var g=n.stateNode;n.flags&32&&(br(g,""),n.flags&=-33);var y=Sc(e);Zl(e,y,g);break;case 3:case 4:var z=n.stateNode.containerInfo,Z=Sc(e);jc(e,Z,z);break;default:throw Error(u(161))}}catch(re){rt(e,e.return,re)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function _p(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;_p(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function ra(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Ap(e,t.alternate,t),t=t.sibling}function ar(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:ka(4,t,t.return),ar(t);break;case 1:Dn(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Cp(t,t.return,n),ar(t);break;case 27:Ki(t.stateNode);case 26:case 5:Dn(t,t.return),ar(t);break;case 22:t.memoizedState===null&&ar(t);break;case 30:ar(t);break;default:ar(t)}e=e.sibling}}function ia(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var r=t.alternate,l=e,s=t,g=s.flags;switch(s.tag){case 0:case 11:case 15:ia(l,s,n),Ui(4,s);break;case 1:if(ia(l,s,n),r=s,l=r.stateNode,typeof l.componentDidMount=="function")try{l.componentDidMount()}catch(Z){rt(r,r.return,Z)}if(r=s,l=r.updateQueue,l!==null){var y=r.stateNode;try{var z=l.shared.hiddenCallbacks;if(z!==null)for(l.shared.hiddenCallbacks=null,l=0;l<z.length;l++)gf(z[l],y)}catch(Z){rt(r,r.return,Z)}}n&&g&64&&Tp(s),Oi(s,s.return);break;case 27:zp(s);case 26:case 5:ia(l,s,n),n&&r===null&&g&4&&Rp(s),Oi(s,s.return);break;case 12:ia(l,s,n);break;case 31:ia(l,s,n),n&&g&4&&Bp(l,s);break;case 13:ia(l,s,n),n&&g&4&&Mp(l,s);break;case 22:s.memoizedState===null&&ia(l,s,n),Oi(s,s.return);break;case 30:break;default:ia(l,s,n)}t=t.sibling}}function Tc(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&xi(n))}function Cc(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&xi(e))}function An(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Dp(e,t,n,r),t=t.sibling}function Dp(e,t,n,r){var l=t.flags;switch(t.tag){case 0:case 11:case 15:An(e,t,n,r),l&2048&&Ui(9,t);break;case 1:An(e,t,n,r);break;case 3:An(e,t,n,r),l&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&xi(e)));break;case 12:if(l&2048){An(e,t,n,r),e=t.stateNode;try{var s=t.memoizedProps,g=s.id,y=s.onPostCommit;typeof y=="function"&&y(g,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(z){rt(t,t.return,z)}}else An(e,t,n,r);break;case 31:An(e,t,n,r);break;case 13:An(e,t,n,r);break;case 23:break;case 22:s=t.stateNode,g=t.alternate,t.memoizedState!==null?s._visibility&2?An(e,t,n,r):Bi(e,t):s._visibility&2?An(e,t,n,r):(s._visibility|=2,_r(e,t,n,r,(t.subtreeFlags&10256)!==0||!1)),l&2048&&Tc(g,t);break;case 24:An(e,t,n,r),l&2048&&Cc(t.alternate,t);break;default:An(e,t,n,r)}}function _r(e,t,n,r,l){for(l=l&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var s=e,g=t,y=n,z=r,Z=g.flags;switch(g.tag){case 0:case 11:case 15:_r(s,g,y,z,l),Ui(8,g);break;case 23:break;case 22:var re=g.stateNode;g.memoizedState!==null?re._visibility&2?_r(s,g,y,z,l):Bi(s,g):(re._visibility|=2,_r(s,g,y,z,l)),l&&Z&2048&&Tc(g.alternate,g);break;case 24:_r(s,g,y,z,l),l&&Z&2048&&Cc(g.alternate,g);break;default:_r(s,g,y,z,l)}t=t.sibling}}function Bi(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,l=r.flags;switch(r.tag){case 22:Bi(n,r),l&2048&&Tc(r.alternate,r);break;case 24:Bi(n,r),l&2048&&Cc(r.alternate,r);break;default:Bi(n,r)}t=t.sibling}}var Mi=8192;function Dr(e,t,n){if(e.subtreeFlags&Mi)for(e=e.child;e!==null;)$p(e,t,n),e=e.sibling}function $p(e,t,n){switch(e.tag){case 26:Dr(e,t,n),e.flags&Mi&&e.memoizedState!==null&&ry(n,Nn,e.memoizedState,e.memoizedProps);break;case 5:Dr(e,t,n);break;case 3:case 4:var r=Nn;Nn=go(e.stateNode.containerInfo),Dr(e,t,n),Nn=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Mi,Mi=16777216,Dr(e,t,n),Mi=r):Dr(e,t,n));break;default:Dr(e,t,n)}}function Hp(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Li(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];Nt=r,Kp(r,e)}Hp(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Ip(e),e=e.sibling}function Ip(e){switch(e.tag){case 0:case 11:case 15:Li(e),e.flags&2048&&ka(9,e,e.return);break;case 3:Li(e);break;case 12:Li(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,eo(e)):Li(e);break;default:Li(e)}}function eo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];Nt=r,Kp(r,e)}Hp(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:ka(8,t,t.return),eo(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,eo(t));break;default:eo(t)}e=e.sibling}}function Kp(e,t){for(;Nt!==null;){var n=Nt;switch(n.tag){case 0:case 11:case 15:ka(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:xi(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,Nt=r;else e:for(n=e;Nt!==null;){r=Nt;var l=r.sibling,s=r.return;if(Up(r),r===n){Nt=null;break e}if(l!==null){l.return=s,Nt=l;break e}Nt=s}}}var xb={getCacheForType:function(e){var t=Bt(kt),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Bt(kt).controller.signal}},vb=typeof WeakMap=="function"?WeakMap:Map,Pe=0,ct=null,De=null,He=0,at=0,cn=null,Ta=!1,$r=!1,Rc=!1,la=0,wt=0,Ca=0,rr=0,Ec=0,un=0,Hr=0,_i=null,Pt=null,zc=!1,to=0,qp=0,no=1/0,ao=null,Ra=null,Et=0,Ea=null,Ir=null,oa=0,Nc=0,Ac=null,Wp=null,Di=0,Uc=null;function dn(){return(Pe&2)!==0&&He!==0?He&-He:j.T!==null?Dc():id()}function Gp(){if(un===0)if((He&536870912)===0||Ke){var e=Ne;Ne<<=1,(Ne&3932160)===0&&(Ne=262144),un=e}else un=536870912;return e=on.current,e!==null&&(e.flags|=32),un}function Zt(e,t,n){(e===ct&&(at===2||at===9)||e.cancelPendingCommit!==null)&&(Kr(e,0),za(e,He,un,!1)),fa(e,n),((Pe&2)===0||e!==ct)&&(e===ct&&((Pe&2)===0&&(rr|=n),wt===4&&za(e,He,un,!1)),$n(e))}function Yp(e,t,n){if((Pe&6)!==0)throw Error(u(327));var r=!n&&(t&127)===0&&(t&e.expiredLanes)===0||an(e,t),l=r?jb(e,t):Bc(e,t,!0),s=r;do{if(l===0){$r&&!r&&za(e,t,0,!1);break}else{if(n=e.current.alternate,s&&!wb(n)){l=Bc(e,t,!1),s=!1;continue}if(l===2){if(s=t,e.errorRecoveryDisabledLanes&s)var g=0;else g=e.pendingLanes&-536870913,g=g!==0?g:g&536870912?536870912:0;if(g!==0){t=g;e:{var y=e;l=_i;var z=y.current.memoizedState.isDehydrated;if(z&&(Kr(y,g).flags|=256),g=Bc(y,g,!1),g!==2){if(Rc&&!z){y.errorRecoveryDisabledLanes|=s,rr|=s,l=4;break e}s=Pt,Pt=l,s!==null&&(Pt===null?Pt=s:Pt.push.apply(Pt,s))}l=g}if(s=!1,l!==2)continue}}if(l===1){Kr(e,0),za(e,t,0,!0);break}e:{switch(r=e,s=l,s){case 0:case 1:throw Error(u(345));case 4:if((t&4194048)!==t)break;case 6:za(r,t,un,!Ta);break e;case 2:Pt=null;break;case 3:case 5:break;default:throw Error(u(329))}if((t&62914560)===t&&(l=to+300-ze(),10<l)){if(za(r,t,un,!Ta),Wn(r,0,!0)!==0)break e;oa=t,r.timeoutHandle=jg(Fp.bind(null,r,n,Pt,ao,zc,t,un,rr,Hr,Ta,s,"Throttled",-0,0),l);break e}Fp(r,n,Pt,ao,zc,t,un,rr,Hr,Ta,s,null,-0,0)}}break}while(!0);$n(e)}function Fp(e,t,n,r,l,s,g,y,z,Z,re,ce,ee,ne){if(e.timeoutHandle=-1,ce=t.subtreeFlags,ce&8192||(ce&16785408)===16785408){ce={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Yn},$p(t,s,ce);var ye=(s&62914560)===s?to-ze():(s&4194048)===s?qp-ze():0;if(ye=iy(ce,ye),ye!==null){oa=s,e.cancelPendingCommit=ye(tg.bind(null,e,t,s,n,r,l,g,y,z,re,ce,null,ee,ne)),za(e,s,g,!Z);return}}tg(e,t,s,n,r,l,g,y,z)}function wb(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var l=n[r],s=l.getSnapshot;l=l.value;try{if(!rn(s(),l))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function za(e,t,n,r){t&=~Ec,t&=~rr,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var l=t;0<l;){var s=31-Ht(l),g=1<<s;r[s]=-1,l&=~g}n!==0&&nd(e,n,t)}function ro(){return(Pe&6)===0?($i(0),!1):!0}function Oc(){if(De!==null){if(at===0)var e=De.return;else e=De,Qn=Xa=null,Xs(e),Ur=null,wi=0,e=De;for(;e!==null;)kp(e.alternate,e),e=e.return;De=null}}function Kr(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,Ib(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),oa=0,Oc(),ct=e,De=n=Vn(e.current,null),He=t,at=0,cn=null,Ta=!1,$r=an(e,t),Rc=!1,Hr=un=Ec=rr=Ca=wt=0,Pt=_i=null,zc=!1,(t&8)!==0&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var l=31-Ht(r),s=1<<l;t|=e[l],r&=~s}return la=t,Tl(),n}function Vp(e,t){Ae=null,j.H=zi,t===Ar||t===Ol?(t=uf(),at=3):t===_s?(t=uf(),at=4):at=t===dc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,cn=t,De===null&&(wt=1,Fl(e,bn(t,e.current)))}function Xp(){var e=on.current;return e===null?!0:(He&4194048)===He?wn===null:(He&62914560)===He||(He&536870912)!==0?e===wn:!1}function Qp(){var e=j.H;return j.H=zi,e===null?zi:e}function Pp(){var e=j.A;return j.A=xb,e}function io(){wt=4,Ta||(He&4194048)!==He&&on.current!==null||($r=!0),(Ca&134217727)===0&&(rr&134217727)===0||ct===null||za(ct,He,un,!1)}function Bc(e,t,n){var r=Pe;Pe|=2;var l=Qp(),s=Pp();(ct!==e||He!==t)&&(ao=null,Kr(e,t)),t=!1;var g=wt;e:do try{if(at!==0&&De!==null){var y=De,z=cn;switch(at){case 8:Oc(),g=6;break e;case 3:case 2:case 9:case 6:on.current===null&&(t=!0);var Z=at;if(at=0,cn=null,qr(e,y,z,Z),n&&$r){g=0;break e}break;default:Z=at,at=0,cn=null,qr(e,y,z,Z)}}Sb(),g=wt;break}catch(re){Vp(e,re)}while(!0);return t&&e.shellSuspendCounter++,Qn=Xa=null,Pe=r,j.H=l,j.A=s,De===null&&(ct=null,He=0,Tl()),g}function Sb(){for(;De!==null;)Zp(De)}function jb(e,t){var n=Pe;Pe|=2;var r=Qp(),l=Pp();ct!==e||He!==t?(ao=null,no=ze()+500,Kr(e,t)):$r=an(e,t);e:do try{if(at!==0&&De!==null){t=De;var s=cn;t:switch(at){case 1:at=0,cn=null,qr(e,t,s,1);break;case 2:case 9:if(sf(s)){at=0,cn=null,Jp(t);break}t=function(){at!==2&&at!==9||ct!==e||(at=7),$n(e)},s.then(t,t);break e;case 3:at=7;break e;case 4:at=5;break e;case 7:sf(s)?(at=0,cn=null,Jp(t)):(at=0,cn=null,qr(e,t,s,7));break;case 5:var g=null;switch(De.tag){case 26:g=De.memoizedState;case 5:case 27:var y=De;if(g?Dg(g):y.stateNode.complete){at=0,cn=null;var z=y.sibling;if(z!==null)De=z;else{var Z=y.return;Z!==null?(De=Z,lo(Z)):De=null}break t}}at=0,cn=null,qr(e,t,s,5);break;case 6:at=0,cn=null,qr(e,t,s,6);break;case 8:Oc(),wt=6;break e;default:throw Error(u(462))}}kb();break}catch(re){Vp(e,re)}while(!0);return Qn=Xa=null,j.H=r,j.A=l,Pe=n,De!==null?0:(ct=null,He=0,Tl(),wt)}function kb(){for(;De!==null&&!fe();)Zp(De)}function Zp(e){var t=Sp(e.alternate,e,la);e.memoizedProps=e.pendingProps,t===null?lo(e):De=t}function Jp(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=hp(n,t,t.pendingProps,t.type,void 0,He);break;case 11:t=hp(n,t,t.pendingProps,t.type.render,t.ref,He);break;case 5:Xs(t);default:kp(n,t),t=De=Qd(t,la),t=Sp(n,t,la)}e.memoizedProps=e.pendingProps,t===null?lo(e):De=t}function qr(e,t,n,r){Qn=Xa=null,Xs(t),Ur=null,wi=0;var l=t.return;try{if(fb(e,l,t,n,He)){wt=1,Fl(e,bn(n,e.current)),De=null;return}}catch(s){if(l!==null)throw De=l,s;wt=1,Fl(e,bn(n,e.current)),De=null;return}t.flags&32768?(Ke||r===1?e=!0:$r||(He&536870912)!==0?e=!1:(Ta=e=!0,(r===2||r===9||r===3||r===6)&&(r=on.current,r!==null&&r.tag===13&&(r.flags|=16384))),eg(t,e)):lo(t)}function lo(e){var t=e;do{if((t.flags&32768)!==0){eg(t,Ta);return}e=t.return;var n=mb(t.alternate,t,la);if(n!==null){De=n;return}if(t=t.sibling,t!==null){De=t;return}De=t=e}while(t!==null);wt===0&&(wt=5)}function eg(e,t){do{var n=hb(e.alternate,e);if(n!==null){n.flags&=32767,De=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){De=e;return}De=e=n}while(e!==null);wt=6,De=null}function tg(e,t,n,r,l,s,g,y,z){e.cancelPendingCommit=null;do oo();while(Et!==0);if((Pe&6)!==0)throw Error(u(327));if(t!==null){if(t===e.current)throw Error(u(177));if(s=t.lanes|t.childLanes,s|=Ss,ah(e,n,s,g,y,z),e===ct&&(De=ct=null,He=0),Ir=t,Ea=e,oa=n,Nc=s,Ac=l,Wp=r,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Eb(nn,function(){return lg(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||r){r=j.T,j.T=null,l=K.p,K.p=2,g=Pe,Pe|=4;try{bb(e,t,n)}finally{Pe=g,K.p=l,j.T=r}}Et=1,ng(),ag(),rg()}}function ng(){if(Et===1){Et=0;var e=Ea,t=Ir,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=j.T,j.T=null;var r=K.p;K.p=2;var l=Pe;Pe|=4;try{Lp(t,e);var s=Yc,g=Id(e.containerInfo),y=s.focusedElem,z=s.selectionRange;if(g!==y&&y&&y.ownerDocument&&Hd(y.ownerDocument.documentElement,y)){if(z!==null&&bs(y)){var Z=z.start,re=z.end;if(re===void 0&&(re=Z),"selectionStart"in y)y.selectionStart=Z,y.selectionEnd=Math.min(re,y.value.length);else{var ce=y.ownerDocument||document,ee=ce&&ce.defaultView||window;if(ee.getSelection){var ne=ee.getSelection(),ye=y.textContent.length,Te=Math.min(z.start,ye),ot=z.end===void 0?Te:Math.min(z.end,ye);!ne.extend&&Te>ot&&(g=ot,ot=Te,Te=g);var G=$d(y,Te),_=$d(y,ot);if(G&&_&&(ne.rangeCount!==1||ne.anchorNode!==G.node||ne.anchorOffset!==G.offset||ne.focusNode!==_.node||ne.focusOffset!==_.offset)){var P=ce.createRange();P.setStart(G.node,G.offset),ne.removeAllRanges(),Te>ot?(ne.addRange(P),ne.extend(_.node,_.offset)):(P.setEnd(_.node,_.offset),ne.addRange(P))}}}}for(ce=[],ne=y;ne=ne.parentNode;)ne.nodeType===1&&ce.push({element:ne,left:ne.scrollLeft,top:ne.scrollTop});for(typeof y.focus=="function"&&y.focus(),y=0;y<ce.length;y++){var se=ce[y];se.element.scrollLeft=se.left,se.element.scrollTop=se.top}}vo=!!Gc,Yc=Gc=null}finally{Pe=l,K.p=r,j.T=n}}e.current=t,Et=2}}function ag(){if(Et===2){Et=0;var e=Ea,t=Ir,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=j.T,j.T=null;var r=K.p;K.p=2;var l=Pe;Pe|=4;try{Ap(e,t.alternate,t)}finally{Pe=l,K.p=r,j.T=n}}Et=3}}function rg(){if(Et===4||Et===3){Et=0,be();var e=Ea,t=Ir,n=oa,r=Wp;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Et=5:(Et=0,Ir=Ea=null,ig(e,e.pendingLanes));var l=e.pendingLanes;if(l===0&&(Ra=null),Zo(n),t=t.stateNode,$t&&typeof $t.onCommitFiberRoot=="function")try{$t.onCommitFiberRoot(Ha,t,void 0,(t.current.flags&128)===128)}catch{}if(r!==null){t=j.T,l=K.p,K.p=2,j.T=null;try{for(var s=e.onRecoverableError,g=0;g<r.length;g++){var y=r[g];s(y.value,{componentStack:y.stack})}}finally{j.T=t,K.p=l}}(oa&3)!==0&&oo(),$n(e),l=e.pendingLanes,(n&261930)!==0&&(l&42)!==0?e===Uc?Di++:(Di=0,Uc=e):Di=0,$i(0)}}function ig(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,xi(t)))}function oo(){return ng(),ag(),rg(),lg()}function lg(){if(Et!==5)return!1;var e=Ea,t=Nc;Nc=0;var n=Zo(oa),r=j.T,l=K.p;try{K.p=32>n?32:n,j.T=null,n=Ac,Ac=null;var s=Ea,g=oa;if(Et=0,Ir=Ea=null,oa=0,(Pe&6)!==0)throw Error(u(331));var y=Pe;if(Pe|=4,Ip(s.current),Dp(s,s.current,g,n),Pe=y,$i(0,!1),$t&&typeof $t.onPostCommitFiberRoot=="function")try{$t.onPostCommitFiberRoot(Ha,s)}catch{}return!0}finally{K.p=l,j.T=r,ig(e,t)}}function og(e,t,n){t=bn(n,t),t=uc(e.stateNode,t,2),e=wa(e,t,2),e!==null&&(fa(e,2),$n(e))}function rt(e,t,n){if(e.tag===3)og(e,e,n);else for(;t!==null;){if(t.tag===3){og(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Ra===null||!Ra.has(r))){e=bn(n,e),n=sp(2),r=wa(t,n,2),r!==null&&(cp(n,r,t,e),fa(r,2),$n(r));break}}t=t.return}}function Mc(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new vb;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(Rc=!0,l.add(n),e=Tb.bind(null,e,t,n),t.then(e,e))}function Tb(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,ct===e&&(He&n)===n&&(wt===4||wt===3&&(He&62914560)===He&&300>ze()-to?(Pe&2)===0&&Kr(e,0):Ec|=n,Hr===He&&(Hr=0)),$n(e)}function sg(e,t){t===0&&(t=ri()),e=Ya(e,t),e!==null&&(fa(e,t),$n(e))}function Cb(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),sg(e,n)}function Rb(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(u(314))}r!==null&&r.delete(t),sg(e,n)}function Eb(e,t){return qn(e,t)}var so=null,Wr=null,Lc=!1,co=!1,_c=!1,Na=0;function $n(e){e!==Wr&&e.next===null&&(Wr===null?so=Wr=e:Wr=Wr.next=e),co=!0,Lc||(Lc=!0,Nb())}function $i(e,t){if(!_c&&co){_c=!0;do for(var n=!1,r=so;r!==null;){if(e!==0){var l=r.pendingLanes;if(l===0)var s=0;else{var g=r.suspendedLanes,y=r.pingedLanes;s=(1<<31-Ht(42|e)+1)-1,s&=l&~(g&~y),s=s&201326741?s&201326741|1:s?s|2:0}s!==0&&(n=!0,fg(r,s))}else s=He,s=Wn(r,r===ct?s:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),(s&3)===0||an(r,s)||(n=!0,fg(r,s));r=r.next}while(n);_c=!1}}function zb(){cg()}function cg(){co=Lc=!1;var e=0;Na!==0&&Hb()&&(e=Na);for(var t=ze(),n=null,r=so;r!==null;){var l=r.next,s=ug(r,t);s===0?(r.next=null,n===null?so=l:n.next=l,l===null&&(Wr=n)):(n=r,(e!==0||(s&3)!==0)&&(co=!0)),r=l}Et!==0&&Et!==5||$i(e),Na!==0&&(Na=0)}function ug(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,s=e.pendingLanes&-62914561;0<s;){var g=31-Ht(s),y=1<<g,z=l[g];z===-1?((y&n)===0||(y&r)!==0)&&(l[g]=Ia(y,t)):z<=t&&(e.expiredLanes|=y),s&=~y}if(t=ct,n=He,n=Wn(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(at===2||at===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&En(r),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||an(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&En(r),Zo(n)){case 2:case 8:n=At;break;case 32:n=nn;break;case 268435456:n=pl;break;default:n=nn}return r=dg.bind(null,e),n=qn(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&En(r),e.callbackPriority=2,e.callbackNode=null,2}function dg(e,t){if(Et!==0&&Et!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(oo()&&e.callbackNode!==n)return null;var r=He;return r=Wn(e,e===ct?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Yp(e,r,t),ug(e,ze()),e.callbackNode!=null&&e.callbackNode===n?dg.bind(null,e):null)}function fg(e,t){if(oo())return null;Yp(e,t,!0)}function Nb(){Kb(function(){(Pe&6)!==0?qn(dt,zb):cg()})}function Dc(){if(Na===0){var e=zr;e===0&&(e=Re,Re<<=1,(Re&261888)===0&&(Re=256)),Na=e}return Na}function pg(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:bl(""+e)}function gg(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function Ab(e,t,n,r,l){if(t==="submit"&&n&&n.stateNode===l){var s=pg((l[Yt]||null).action),g=r.submitter;g&&(t=(t=g[Yt]||null)?pg(t.formAction):g.getAttribute("formAction"),t!==null&&(s=t,g=null));var y=new wl("action","action",null,r,l);e.push({event:y,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Na!==0){var z=g?gg(l,g):new FormData(l);rc(n,{pending:!0,data:z,method:l.method,action:s},null,z)}}else typeof s=="function"&&(y.preventDefault(),z=g?gg(l,g):new FormData(l),rc(n,{pending:!0,data:z,method:l.method,action:s},s,z))},currentTarget:l}]})}}for(var $c=0;$c<ws.length;$c++){var Hc=ws[$c],Ub=Hc.toLowerCase(),Ob=Hc[0].toUpperCase()+Hc.slice(1);zn(Ub,"on"+Ob)}zn(Wd,"onAnimationEnd"),zn(Gd,"onAnimationIteration"),zn(Yd,"onAnimationStart"),zn("dblclick","onDoubleClick"),zn("focusin","onFocus"),zn("focusout","onBlur"),zn(Xh,"onTransitionRun"),zn(Qh,"onTransitionStart"),zn(Ph,"onTransitionCancel"),zn(Fd,"onTransitionEnd"),mr("onMouseEnter",["mouseout","mouseover"]),mr("onMouseLeave",["mouseout","mouseover"]),mr("onPointerEnter",["pointerout","pointerover"]),mr("onPointerLeave",["pointerout","pointerover"]),Ka("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ka("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ka("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ka("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ka("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ka("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Hi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Bb=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Hi));function mg(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var s=void 0;if(t)for(var g=r.length-1;0<=g;g--){var y=r[g],z=y.instance,Z=y.currentTarget;if(y=y.listener,z!==s&&l.isPropagationStopped())break e;s=y,l.currentTarget=Z;try{s(l)}catch(re){kl(re)}l.currentTarget=null,s=z}else for(g=0;g<r.length;g++){if(y=r[g],z=y.instance,Z=y.currentTarget,y=y.listener,z!==s&&l.isPropagationStopped())break e;s=y,l.currentTarget=Z;try{s(l)}catch(re){kl(re)}l.currentTarget=null,s=z}}}}function $e(e,t){var n=t[Jo];n===void 0&&(n=t[Jo]=new Set);var r=e+"__bubble";n.has(r)||(hg(t,e,2,!1),n.add(r))}function Ic(e,t,n){var r=0;t&&(r|=4),hg(n,e,r,t)}var uo="_reactListening"+Math.random().toString(36).slice(2);function Kc(e){if(!e[uo]){e[uo]=!0,sd.forEach(function(n){n!=="selectionchange"&&(Bb.has(n)||Ic(n,!1,e),Ic(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[uo]||(t[uo]=!0,Ic("selectionchange",!1,t))}}function hg(e,t,n,r){switch(Gg(t)){case 2:var l=sy;break;case 8:l=cy;break;default:l=au}n=l.bind(null,t,n,e),l=void 0,!ss||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function qc(e,t,n,r,l){var s=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var g=r.tag;if(g===3||g===4){var y=r.stateNode.containerInfo;if(y===l)break;if(g===4)for(g=r.return;g!==null;){var z=g.tag;if((z===3||z===4)&&g.stateNode.containerInfo===l)return;g=g.return}for(;y!==null;){if(g=fr(y),g===null)return;if(z=g.tag,z===5||z===6||z===26||z===27){r=s=g;continue e}y=y.parentNode}}r=r.return}vd(function(){var Z=s,re=ls(n),ce=[];e:{var ee=Vd.get(e);if(ee!==void 0){var ne=wl,ye=e;switch(e){case"keypress":if(xl(n)===0)break e;case"keydown":case"keyup":ne=Rh;break;case"focusin":ye="focus",ne=fs;break;case"focusout":ye="blur",ne=fs;break;case"beforeblur":case"afterblur":ne=fs;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ne=jd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ne=mh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ne=Nh;break;case Wd:case Gd:case Yd:ne=yh;break;case Fd:ne=Uh;break;case"scroll":case"scrollend":ne=ph;break;case"wheel":ne=Bh;break;case"copy":case"cut":case"paste":ne=vh;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ne=Td;break;case"toggle":case"beforetoggle":ne=Lh}var Te=(t&4)!==0,ot=!Te&&(e==="scroll"||e==="scrollend"),G=Te?ee!==null?ee+"Capture":null:ee;Te=[];for(var _=Z,P;_!==null;){var se=_;if(P=se.stateNode,se=se.tag,se!==5&&se!==26&&se!==27||P===null||G===null||(se=si(_,G),se!=null&&Te.push(Ii(_,se,P))),ot)break;_=_.return}0<Te.length&&(ee=new ne(ee,ye,null,n,re),ce.push({event:ee,listeners:Te}))}}if((t&7)===0){e:{if(ee=e==="mouseover"||e==="pointerover",ne=e==="mouseout"||e==="pointerout",ee&&n!==is&&(ye=n.relatedTarget||n.fromElement)&&(fr(ye)||ye[dr]))break e;if((ne||ee)&&(ee=re.window===re?re:(ee=re.ownerDocument)?ee.defaultView||ee.parentWindow:window,ne?(ye=n.relatedTarget||n.toElement,ne=Z,ye=ye?fr(ye):null,ye!==null&&(ot=p(ye),Te=ye.tag,ye!==ot||Te!==5&&Te!==27&&Te!==6)&&(ye=null)):(ne=null,ye=Z),ne!==ye)){if(Te=jd,se="onMouseLeave",G="onMouseEnter",_="mouse",(e==="pointerout"||e==="pointerover")&&(Te=Td,se="onPointerLeave",G="onPointerEnter",_="pointer"),ot=ne==null?ee:oi(ne),P=ye==null?ee:oi(ye),ee=new Te(se,_+"leave",ne,n,re),ee.target=ot,ee.relatedTarget=P,se=null,fr(re)===Z&&(Te=new Te(G,_+"enter",ye,n,re),Te.target=P,Te.relatedTarget=ot,se=Te),ot=se,ne&&ye)t:{for(Te=Mb,G=ne,_=ye,P=0,se=G;se;se=Te(se))P++;se=0;for(var Se=_;Se;Se=Te(Se))se++;for(;0<P-se;)G=Te(G),P--;for(;0<se-P;)_=Te(_),se--;for(;P--;){if(G===_||_!==null&&G===_.alternate){Te=G;break t}G=Te(G),_=Te(_)}Te=null}else Te=null;ne!==null&&bg(ce,ee,ne,Te,!1),ye!==null&&ot!==null&&bg(ce,ot,ye,Te,!0)}}e:{if(ee=Z?oi(Z):window,ne=ee.nodeName&&ee.nodeName.toLowerCase(),ne==="select"||ne==="input"&&ee.type==="file")var Xe=Od;else if(Ad(ee))if(Bd)Xe=Yh;else{Xe=Wh;var ve=qh}else ne=ee.nodeName,!ne||ne.toLowerCase()!=="input"||ee.type!=="checkbox"&&ee.type!=="radio"?Z&&rs(Z.elementType)&&(Xe=Od):Xe=Gh;if(Xe&&(Xe=Xe(e,Z))){Ud(ce,Xe,n,re);break e}ve&&ve(e,ee,Z),e==="focusout"&&Z&&ee.type==="number"&&Z.memoizedProps.value!=null&&as(ee,"number",ee.value)}switch(ve=Z?oi(Z):window,e){case"focusin":(Ad(ve)||ve.contentEditable==="true")&&(wr=ve,ys=Z,hi=null);break;case"focusout":hi=ys=wr=null;break;case"mousedown":xs=!0;break;case"contextmenu":case"mouseup":case"dragend":xs=!1,Kd(ce,n,re);break;case"selectionchange":if(Vh)break;case"keydown":case"keyup":Kd(ce,n,re)}var Ue;if(gs)e:{switch(e){case"compositionstart":var Ie="onCompositionStart";break e;case"compositionend":Ie="onCompositionEnd";break e;case"compositionupdate":Ie="onCompositionUpdate";break e}Ie=void 0}else vr?zd(e,n)&&(Ie="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Ie="onCompositionStart");Ie&&(Cd&&n.locale!=="ko"&&(vr||Ie!=="onCompositionStart"?Ie==="onCompositionEnd"&&vr&&(Ue=wd()):(ga=re,cs="value"in ga?ga.value:ga.textContent,vr=!0)),ve=fo(Z,Ie),0<ve.length&&(Ie=new kd(Ie,e,null,n,re),ce.push({event:Ie,listeners:ve}),Ue?Ie.data=Ue:(Ue=Nd(n),Ue!==null&&(Ie.data=Ue)))),(Ue=Dh?$h(e,n):Hh(e,n))&&(Ie=fo(Z,"onBeforeInput"),0<Ie.length&&(ve=new kd("onBeforeInput","beforeinput",null,n,re),ce.push({event:ve,listeners:Ie}),ve.data=Ue)),Ab(ce,e,Z,n,re)}mg(ce,t)})}function Ii(e,t,n){return{instance:e,listener:t,currentTarget:n}}function fo(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,s=l.stateNode;if(l=l.tag,l!==5&&l!==26&&l!==27||s===null||(l=si(e,n),l!=null&&r.unshift(Ii(e,l,s)),l=si(e,t),l!=null&&r.push(Ii(e,l,s))),e.tag===3)return r;e=e.return}return[]}function Mb(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function bg(e,t,n,r,l){for(var s=t._reactName,g=[];n!==null&&n!==r;){var y=n,z=y.alternate,Z=y.stateNode;if(y=y.tag,z!==null&&z===r)break;y!==5&&y!==26&&y!==27||Z===null||(z=Z,l?(Z=si(n,s),Z!=null&&g.unshift(Ii(n,Z,z))):l||(Z=si(n,s),Z!=null&&g.push(Ii(n,Z,z)))),n=n.return}g.length!==0&&e.push({event:t,listeners:g})}var Lb=/\r\n?/g,_b=/\u0000|\uFFFD/g;function yg(e){return(typeof e=="string"?e:""+e).replace(Lb,`
`).replace(_b,"")}function xg(e,t){return t=yg(t),yg(e)===t}function lt(e,t,n,r,l,s){switch(n){case"children":typeof r=="string"?t==="body"||t==="textarea"&&r===""||br(e,r):(typeof r=="number"||typeof r=="bigint")&&t!=="body"&&br(e,""+r);break;case"className":ml(e,"class",r);break;case"tabIndex":ml(e,"tabindex",r);break;case"dir":case"role":case"viewBox":case"width":case"height":ml(e,n,r);break;case"style":yd(e,r,s);break;case"data":if(t!=="object"){ml(e,"data",r);break}case"src":case"href":if(r===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(r==null||typeof r=="function"||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(n);break}r=bl(""+r),e.setAttribute(n,r);break;case"action":case"formAction":if(typeof r=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof s=="function"&&(n==="formAction"?(t!=="input"&&lt(e,t,"name",l.name,l,null),lt(e,t,"formEncType",l.formEncType,l,null),lt(e,t,"formMethod",l.formMethod,l,null),lt(e,t,"formTarget",l.formTarget,l,null)):(lt(e,t,"encType",l.encType,l,null),lt(e,t,"method",l.method,l,null),lt(e,t,"target",l.target,l,null)));if(r==null||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(n);break}r=bl(""+r),e.setAttribute(n,r);break;case"onClick":r!=null&&(e.onclick=Yn);break;case"onScroll":r!=null&&$e("scroll",e);break;case"onScrollEnd":r!=null&&$e("scrollend",e);break;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(u(61));if(n=r.__html,n!=null){if(l.children!=null)throw Error(u(60));e.innerHTML=n}}break;case"multiple":e.multiple=r&&typeof r!="function"&&typeof r!="symbol";break;case"muted":e.muted=r&&typeof r!="function"&&typeof r!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(r==null||typeof r=="function"||typeof r=="boolean"||typeof r=="symbol"){e.removeAttribute("xlink:href");break}n=bl(""+r),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(n,""+r):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":r&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":r===!0?e.setAttribute(n,""):r!==!1&&r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(n,r):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":r!=null&&typeof r!="function"&&typeof r!="symbol"&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case"rowSpan":case"start":r==null||typeof r=="function"||typeof r=="symbol"||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case"popover":$e("beforetoggle",e),$e("toggle",e),gl(e,"popover",r);break;case"xlinkActuate":Gn(e,"http://www.w3.org/1999/xlink","xlink:actuate",r);break;case"xlinkArcrole":Gn(e,"http://www.w3.org/1999/xlink","xlink:arcrole",r);break;case"xlinkRole":Gn(e,"http://www.w3.org/1999/xlink","xlink:role",r);break;case"xlinkShow":Gn(e,"http://www.w3.org/1999/xlink","xlink:show",r);break;case"xlinkTitle":Gn(e,"http://www.w3.org/1999/xlink","xlink:title",r);break;case"xlinkType":Gn(e,"http://www.w3.org/1999/xlink","xlink:type",r);break;case"xmlBase":Gn(e,"http://www.w3.org/XML/1998/namespace","xml:base",r);break;case"xmlLang":Gn(e,"http://www.w3.org/XML/1998/namespace","xml:lang",r);break;case"xmlSpace":Gn(e,"http://www.w3.org/XML/1998/namespace","xml:space",r);break;case"is":gl(e,"is",r);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=dh.get(n)||n,gl(e,n,r))}}function Wc(e,t,n,r,l,s){switch(n){case"style":yd(e,r,s);break;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(u(61));if(n=r.__html,n!=null){if(l.children!=null)throw Error(u(60));e.innerHTML=n}}break;case"children":typeof r=="string"?br(e,r):(typeof r=="number"||typeof r=="bigint")&&br(e,""+r);break;case"onScroll":r!=null&&$e("scroll",e);break;case"onScrollEnd":r!=null&&$e("scrollend",e);break;case"onClick":r!=null&&(e.onclick=Yn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!cd.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(l=n.endsWith("Capture"),t=n.slice(2,l?n.length-7:void 0),s=e[Yt]||null,s=s!=null?s[n]:null,typeof s=="function"&&e.removeEventListener(t,s,l),typeof r=="function")){typeof s!="function"&&s!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,l);break e}n in e?e[n]=r:r===!0?e.setAttribute(n,""):gl(e,n,r)}}}function Lt(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":$e("error",e),$e("load",e);var r=!1,l=!1,s;for(s in n)if(n.hasOwnProperty(s)){var g=n[s];if(g!=null)switch(s){case"src":r=!0;break;case"srcSet":l=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(u(137,t));default:lt(e,t,s,g,n,null)}}l&&lt(e,t,"srcSet",n.srcSet,n,null),r&&lt(e,t,"src",n.src,n,null);return;case"input":$e("invalid",e);var y=s=g=l=null,z=null,Z=null;for(r in n)if(n.hasOwnProperty(r)){var re=n[r];if(re!=null)switch(r){case"name":l=re;break;case"type":g=re;break;case"checked":z=re;break;case"defaultChecked":Z=re;break;case"value":s=re;break;case"defaultValue":y=re;break;case"children":case"dangerouslySetInnerHTML":if(re!=null)throw Error(u(137,t));break;default:lt(e,t,r,re,n,null)}}gd(e,s,y,z,Z,g,l,!1);return;case"select":$e("invalid",e),r=g=s=null;for(l in n)if(n.hasOwnProperty(l)&&(y=n[l],y!=null))switch(l){case"value":s=y;break;case"defaultValue":g=y;break;case"multiple":r=y;default:lt(e,t,l,y,n,null)}t=s,n=g,e.multiple=!!r,t!=null?hr(e,!!r,t,!1):n!=null&&hr(e,!!r,n,!0);return;case"textarea":$e("invalid",e),s=l=r=null;for(g in n)if(n.hasOwnProperty(g)&&(y=n[g],y!=null))switch(g){case"value":r=y;break;case"defaultValue":l=y;break;case"children":s=y;break;case"dangerouslySetInnerHTML":if(y!=null)throw Error(u(91));break;default:lt(e,t,g,y,n,null)}hd(e,r,l,s);return;case"option":for(z in n)n.hasOwnProperty(z)&&(r=n[z],r!=null)&&(z==="selected"?e.selected=r&&typeof r!="function"&&typeof r!="symbol":lt(e,t,z,r,n,null));return;case"dialog":$e("beforetoggle",e),$e("toggle",e),$e("cancel",e),$e("close",e);break;case"iframe":case"object":$e("load",e);break;case"video":case"audio":for(r=0;r<Hi.length;r++)$e(Hi[r],e);break;case"image":$e("error",e),$e("load",e);break;case"details":$e("toggle",e);break;case"embed":case"source":case"link":$e("error",e),$e("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(Z in n)if(n.hasOwnProperty(Z)&&(r=n[Z],r!=null))switch(Z){case"children":case"dangerouslySetInnerHTML":throw Error(u(137,t));default:lt(e,t,Z,r,n,null)}return;default:if(rs(t)){for(re in n)n.hasOwnProperty(re)&&(r=n[re],r!==void 0&&Wc(e,t,re,r,n,void 0));return}}for(y in n)n.hasOwnProperty(y)&&(r=n[y],r!=null&&lt(e,t,y,r,n,null))}function Db(e,t,n,r){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var l=null,s=null,g=null,y=null,z=null,Z=null,re=null;for(ne in n){var ce=n[ne];if(n.hasOwnProperty(ne)&&ce!=null)switch(ne){case"checked":break;case"value":break;case"defaultValue":z=ce;default:r.hasOwnProperty(ne)||lt(e,t,ne,null,r,ce)}}for(var ee in r){var ne=r[ee];if(ce=n[ee],r.hasOwnProperty(ee)&&(ne!=null||ce!=null))switch(ee){case"type":s=ne;break;case"name":l=ne;break;case"checked":Z=ne;break;case"defaultChecked":re=ne;break;case"value":g=ne;break;case"defaultValue":y=ne;break;case"children":case"dangerouslySetInnerHTML":if(ne!=null)throw Error(u(137,t));break;default:ne!==ce&&lt(e,t,ee,ne,r,ce)}}ns(e,g,y,z,Z,re,s,l);return;case"select":ne=g=y=ee=null;for(s in n)if(z=n[s],n.hasOwnProperty(s)&&z!=null)switch(s){case"value":break;case"multiple":ne=z;default:r.hasOwnProperty(s)||lt(e,t,s,null,r,z)}for(l in r)if(s=r[l],z=n[l],r.hasOwnProperty(l)&&(s!=null||z!=null))switch(l){case"value":ee=s;break;case"defaultValue":y=s;break;case"multiple":g=s;default:s!==z&&lt(e,t,l,s,r,z)}t=y,n=g,r=ne,ee!=null?hr(e,!!n,ee,!1):!!r!=!!n&&(t!=null?hr(e,!!n,t,!0):hr(e,!!n,n?[]:"",!1));return;case"textarea":ne=ee=null;for(y in n)if(l=n[y],n.hasOwnProperty(y)&&l!=null&&!r.hasOwnProperty(y))switch(y){case"value":break;case"children":break;default:lt(e,t,y,null,r,l)}for(g in r)if(l=r[g],s=n[g],r.hasOwnProperty(g)&&(l!=null||s!=null))switch(g){case"value":ee=l;break;case"defaultValue":ne=l;break;case"children":break;case"dangerouslySetInnerHTML":if(l!=null)throw Error(u(91));break;default:l!==s&&lt(e,t,g,l,r,s)}md(e,ee,ne);return;case"option":for(var ye in n)ee=n[ye],n.hasOwnProperty(ye)&&ee!=null&&!r.hasOwnProperty(ye)&&(ye==="selected"?e.selected=!1:lt(e,t,ye,null,r,ee));for(z in r)ee=r[z],ne=n[z],r.hasOwnProperty(z)&&ee!==ne&&(ee!=null||ne!=null)&&(z==="selected"?e.selected=ee&&typeof ee!="function"&&typeof ee!="symbol":lt(e,t,z,ee,r,ne));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Te in n)ee=n[Te],n.hasOwnProperty(Te)&&ee!=null&&!r.hasOwnProperty(Te)&&lt(e,t,Te,null,r,ee);for(Z in r)if(ee=r[Z],ne=n[Z],r.hasOwnProperty(Z)&&ee!==ne&&(ee!=null||ne!=null))switch(Z){case"children":case"dangerouslySetInnerHTML":if(ee!=null)throw Error(u(137,t));break;default:lt(e,t,Z,ee,r,ne)}return;default:if(rs(t)){for(var ot in n)ee=n[ot],n.hasOwnProperty(ot)&&ee!==void 0&&!r.hasOwnProperty(ot)&&Wc(e,t,ot,void 0,r,ee);for(re in r)ee=r[re],ne=n[re],!r.hasOwnProperty(re)||ee===ne||ee===void 0&&ne===void 0||Wc(e,t,re,ee,r,ne);return}}for(var G in n)ee=n[G],n.hasOwnProperty(G)&&ee!=null&&!r.hasOwnProperty(G)&&lt(e,t,G,null,r,ee);for(ce in r)ee=r[ce],ne=n[ce],!r.hasOwnProperty(ce)||ee===ne||ee==null&&ne==null||lt(e,t,ce,ee,r,ne)}function vg(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function $b(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),r=0;r<n.length;r++){var l=n[r],s=l.transferSize,g=l.initiatorType,y=l.duration;if(s&&y&&vg(g)){for(g=0,y=l.responseEnd,r+=1;r<n.length;r++){var z=n[r],Z=z.startTime;if(Z>y)break;var re=z.transferSize,ce=z.initiatorType;re&&vg(ce)&&(z=z.responseEnd,g+=re*(z<y?1:(y-Z)/(z-Z)))}if(--r,t+=8*(s+g)/(l.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Gc=null,Yc=null;function po(e){return e.nodeType===9?e:e.ownerDocument}function wg(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Sg(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Fc(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Vc=null;function Hb(){var e=window.event;return e&&e.type==="popstate"?e===Vc?!1:(Vc=e,!0):(Vc=null,!1)}var jg=typeof setTimeout=="function"?setTimeout:void 0,Ib=typeof clearTimeout=="function"?clearTimeout:void 0,kg=typeof Promise=="function"?Promise:void 0,Kb=typeof queueMicrotask=="function"?queueMicrotask:typeof kg<"u"?function(e){return kg.resolve(null).then(e).catch(qb)}:jg;function qb(e){setTimeout(function(){throw e})}function Aa(e){return e==="head"}function Tg(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"||n==="/&"){if(r===0){e.removeChild(l),Vr(t);return}r--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")r++;else if(n==="html")Ki(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Ki(n);for(var s=n.firstChild;s;){var g=s.nextSibling,y=s.nodeName;s[li]||y==="SCRIPT"||y==="STYLE"||y==="LINK"&&s.rel.toLowerCase()==="stylesheet"||n.removeChild(s),s=g}}else n==="body"&&Ki(e.ownerDocument.body);n=l}while(n);Vr(t)}function Cg(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=r}while(n)}function Xc(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Xc(n),es(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function Wb(e,t,n,r){for(;e.nodeType===1;){var l=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(r){if(!e[li])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(s=e.getAttribute("rel"),s==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(s!==l.rel||e.getAttribute("href")!==(l.href==null||l.href===""?null:l.href)||e.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin)||e.getAttribute("title")!==(l.title==null?null:l.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(s=e.getAttribute("src"),(s!==(l.src==null?null:l.src)||e.getAttribute("type")!==(l.type==null?null:l.type)||e.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin))&&s&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var s=l.name==null?null:""+l.name;if(l.type==="hidden"&&e.getAttribute("name")===s)return e}else return e;if(e=Sn(e.nextSibling),e===null)break}return null}function Gb(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Sn(e.nextSibling),e===null))return null;return e}function Rg(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Sn(e.nextSibling),e===null))return null;return e}function Qc(e){return e.data==="$?"||e.data==="$~"}function Pc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Yb(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var r=function(){t(),n.removeEventListener("DOMContentLoaded",r)};n.addEventListener("DOMContentLoaded",r),e._reactRetry=r}}function Sn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Zc=null;function Eg(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Sn(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function zg(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function Ng(e,t,n){switch(t=po(n),e){case"html":if(e=t.documentElement,!e)throw Error(u(452));return e;case"head":if(e=t.head,!e)throw Error(u(453));return e;case"body":if(e=t.body,!e)throw Error(u(454));return e;default:throw Error(u(451))}}function Ki(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);es(e)}var jn=new Map,Ag=new Set;function go(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var sa=K.d;K.d={f:Fb,r:Vb,D:Xb,C:Qb,L:Pb,m:Zb,X:ey,S:Jb,M:ty};function Fb(){var e=sa.f(),t=ro();return e||t}function Vb(e){var t=pr(e);t!==null&&t.tag===5&&t.type==="form"?Vf(t):sa.r(e)}var Gr=typeof document>"u"?null:document;function Ug(e,t,n){var r=Gr;if(r&&typeof t=="string"&&t){var l=mn(t);l='link[rel="'+e+'"][href="'+l+'"]',typeof n=="string"&&(l+='[crossorigin="'+n+'"]'),Ag.has(l)||(Ag.add(l),e={rel:e,crossOrigin:n,href:t},r.querySelector(l)===null&&(t=r.createElement("link"),Lt(t,"link",e),zt(t),r.head.appendChild(t)))}}function Xb(e){sa.D(e),Ug("dns-prefetch",e,null)}function Qb(e,t){sa.C(e,t),Ug("preconnect",e,t)}function Pb(e,t,n){sa.L(e,t,n);var r=Gr;if(r&&e&&t){var l='link[rel="preload"][as="'+mn(t)+'"]';t==="image"&&n&&n.imageSrcSet?(l+='[imagesrcset="'+mn(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(l+='[imagesizes="'+mn(n.imageSizes)+'"]')):l+='[href="'+mn(e)+'"]';var s=l;switch(t){case"style":s=Yr(e);break;case"script":s=Fr(e)}jn.has(s)||(e=w({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),jn.set(s,e),r.querySelector(l)!==null||t==="style"&&r.querySelector(qi(s))||t==="script"&&r.querySelector(Wi(s))||(t=r.createElement("link"),Lt(t,"link",e),zt(t),r.head.appendChild(t)))}}function Zb(e,t){sa.m(e,t);var n=Gr;if(n&&e){var r=t&&typeof t.as=="string"?t.as:"script",l='link[rel="modulepreload"][as="'+mn(r)+'"][href="'+mn(e)+'"]',s=l;switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":s=Fr(e)}if(!jn.has(s)&&(e=w({rel:"modulepreload",href:e},t),jn.set(s,e),n.querySelector(l)===null)){switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Wi(s)))return}r=n.createElement("link"),Lt(r,"link",e),zt(r),n.head.appendChild(r)}}}function Jb(e,t,n){sa.S(e,t,n);var r=Gr;if(r&&e){var l=gr(r).hoistableStyles,s=Yr(e);t=t||"default";var g=l.get(s);if(!g){var y={loading:0,preload:null};if(g=r.querySelector(qi(s)))y.loading=5;else{e=w({rel:"stylesheet",href:e,"data-precedence":t},n),(n=jn.get(s))&&Jc(e,n);var z=g=r.createElement("link");zt(z),Lt(z,"link",e),z._p=new Promise(function(Z,re){z.onload=Z,z.onerror=re}),z.addEventListener("load",function(){y.loading|=1}),z.addEventListener("error",function(){y.loading|=2}),y.loading|=4,mo(g,t,r)}g={type:"stylesheet",instance:g,count:1,state:y},l.set(s,g)}}}function ey(e,t){sa.X(e,t);var n=Gr;if(n&&e){var r=gr(n).hoistableScripts,l=Fr(e),s=r.get(l);s||(s=n.querySelector(Wi(l)),s||(e=w({src:e,async:!0},t),(t=jn.get(l))&&eu(e,t),s=n.createElement("script"),zt(s),Lt(s,"link",e),n.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},r.set(l,s))}}function ty(e,t){sa.M(e,t);var n=Gr;if(n&&e){var r=gr(n).hoistableScripts,l=Fr(e),s=r.get(l);s||(s=n.querySelector(Wi(l)),s||(e=w({src:e,async:!0,type:"module"},t),(t=jn.get(l))&&eu(e,t),s=n.createElement("script"),zt(s),Lt(s,"link",e),n.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},r.set(l,s))}}function Og(e,t,n,r){var l=(l=ge.current)?go(l):null;if(!l)throw Error(u(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Yr(n.href),n=gr(l).hoistableStyles,r=n.get(t),r||(r={type:"style",instance:null,count:0,state:null},n.set(t,r)),r):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Yr(n.href);var s=gr(l).hoistableStyles,g=s.get(e);if(g||(l=l.ownerDocument||l,g={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},s.set(e,g),(s=l.querySelector(qi(e)))&&!s._p&&(g.instance=s,g.state.loading=5),jn.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},jn.set(e,n),s||ny(l,e,n,g.state))),t&&r===null)throw Error(u(528,""));return g}if(t&&r!==null)throw Error(u(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Fr(n),n=gr(l).hoistableScripts,r=n.get(t),r||(r={type:"script",instance:null,count:0,state:null},n.set(t,r)),r):{type:"void",instance:null,count:0,state:null};default:throw Error(u(444,e))}}function Yr(e){return'href="'+mn(e)+'"'}function qi(e){return'link[rel="stylesheet"]['+e+"]"}function Bg(e){return w({},e,{"data-precedence":e.precedence,precedence:null})}function ny(e,t,n,r){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?r.loading=1:(t=e.createElement("link"),r.preload=t,t.addEventListener("load",function(){return r.loading|=1}),t.addEventListener("error",function(){return r.loading|=2}),Lt(t,"link",n),zt(t),e.head.appendChild(t))}function Fr(e){return'[src="'+mn(e)+'"]'}function Wi(e){return"script[async]"+e}function Mg(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var r=e.querySelector('style[data-href~="'+mn(n.href)+'"]');if(r)return t.instance=r,zt(r),r;var l=w({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement("style"),zt(r),Lt(r,"style",l),mo(r,n.precedence,e),t.instance=r;case"stylesheet":l=Yr(n.href);var s=e.querySelector(qi(l));if(s)return t.state.loading|=4,t.instance=s,zt(s),s;r=Bg(n),(l=jn.get(l))&&Jc(r,l),s=(e.ownerDocument||e).createElement("link"),zt(s);var g=s;return g._p=new Promise(function(y,z){g.onload=y,g.onerror=z}),Lt(s,"link",r),t.state.loading|=4,mo(s,n.precedence,e),t.instance=s;case"script":return s=Fr(n.src),(l=e.querySelector(Wi(s)))?(t.instance=l,zt(l),l):(r=n,(l=jn.get(s))&&(r=w({},n),eu(r,l)),e=e.ownerDocument||e,l=e.createElement("script"),zt(l),Lt(l,"link",r),e.head.appendChild(l),t.instance=l);case"void":return null;default:throw Error(u(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(r=t.instance,t.state.loading|=4,mo(r,n.precedence,e));return t.instance}function mo(e,t,n){for(var r=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),l=r.length?r[r.length-1]:null,s=l,g=0;g<r.length;g++){var y=r[g];if(y.dataset.precedence===t)s=y;else if(s!==l)break}s?s.parentNode.insertBefore(e,s.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Jc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function eu(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var ho=null;function Lg(e,t,n){if(ho===null){var r=new Map,l=ho=new Map;l.set(n,r)}else l=ho,r=l.get(n),r||(r=new Map,l.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),l=0;l<n.length;l++){var s=n[l];if(!(s[li]||s[Ut]||e==="link"&&s.getAttribute("rel")==="stylesheet")&&s.namespaceURI!=="http://www.w3.org/2000/svg"){var g=s.getAttribute(t)||"";g=e+g;var y=r.get(g);y?y.push(s):r.set(g,[s])}}return r}function _g(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function ay(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Dg(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function ry(e,t,n,r){if(n.type==="stylesheet"&&(typeof r.media!="string"||matchMedia(r.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var l=Yr(r.href),s=t.querySelector(qi(l));if(s){t=s._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=bo.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=s,zt(s);return}s=t.ownerDocument||t,r=Bg(r),(l=jn.get(l))&&Jc(r,l),s=s.createElement("link"),zt(s);var g=s;g._p=new Promise(function(y,z){g.onload=y,g.onerror=z}),Lt(s,"link",r),n.instance=s}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=bo.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var tu=0;function iy(e,t){return e.stylesheets&&e.count===0&&xo(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&xo(e,e.stylesheets),e.unsuspend){var s=e.unsuspend;e.unsuspend=null,s()}},6e4+t);0<e.imgBytes&&tu===0&&(tu=62500*$b());var l=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&xo(e,e.stylesheets),e.unsuspend)){var s=e.unsuspend;e.unsuspend=null,s()}},(e.imgBytes>tu?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(l)}}:null}function bo(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)xo(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var yo=null;function xo(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,yo=new Map,t.forEach(ly,e),yo=null,bo.call(e))}function ly(e,t){if(!(t.state.loading&4)){var n=yo.get(e);if(n)var r=n.get(null);else{n=new Map,yo.set(e,n);for(var l=e.querySelectorAll("link[data-precedence],style[data-precedence]"),s=0;s<l.length;s++){var g=l[s];(g.nodeName==="LINK"||g.getAttribute("media")!=="not all")&&(n.set(g.dataset.precedence,g),r=g)}r&&n.set(null,r)}l=t.instance,g=l.getAttribute("data-precedence"),s=n.get(g)||r,s===r&&n.set(null,l),n.set(g,l),this.count++,r=bo.bind(this),l.addEventListener("load",r),l.addEventListener("error",r),s?s.parentNode.insertBefore(l,s.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(l,e.firstChild)),t.state.loading|=4}}var Gi={$$typeof:D,Provider:null,Consumer:null,_currentValue:I,_currentValue2:I,_threadCount:0};function oy(e,t,n,r,l,s,g,y,z){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ii(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ii(0),this.hiddenUpdates=ii(null),this.identifierPrefix=r,this.onUncaughtError=l,this.onCaughtError=s,this.onRecoverableError=g,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=z,this.incompleteTransitions=new Map}function $g(e,t,n,r,l,s,g,y,z,Z,re,ce){return e=new oy(e,t,n,g,z,Z,re,ce,y),t=1,s===!0&&(t|=24),s=ln(3,null,null,t),e.current=s,s.stateNode=e,t=Bs(),t.refCount++,e.pooledCache=t,t.refCount++,s.memoizedState={element:r,isDehydrated:n,cache:t},Ds(s),e}function Hg(e){return e?(e=kr,e):kr}function Ig(e,t,n,r,l,s){l=Hg(l),r.context===null?r.context=l:r.pendingContext=l,r=va(t),r.payload={element:n},s=s===void 0?null:s,s!==null&&(r.callback=s),n=wa(e,r,t),n!==null&&(Zt(n,e,t),ji(n,e,t))}function Kg(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function nu(e,t){Kg(e,t),(e=e.alternate)&&Kg(e,t)}function qg(e){if(e.tag===13||e.tag===31){var t=Ya(e,67108864);t!==null&&Zt(t,e,67108864),nu(e,67108864)}}function Wg(e){if(e.tag===13||e.tag===31){var t=dn();t=Po(t);var n=Ya(e,t);n!==null&&Zt(n,e,t),nu(e,t)}}var vo=!0;function sy(e,t,n,r){var l=j.T;j.T=null;var s=K.p;try{K.p=2,au(e,t,n,r)}finally{K.p=s,j.T=l}}function cy(e,t,n,r){var l=j.T;j.T=null;var s=K.p;try{K.p=8,au(e,t,n,r)}finally{K.p=s,j.T=l}}function au(e,t,n,r){if(vo){var l=ru(r);if(l===null)qc(e,t,r,wo,n),Yg(e,r);else if(dy(l,e,t,n,r))r.stopPropagation();else if(Yg(e,r),t&4&&-1<uy.indexOf(e)){for(;l!==null;){var s=pr(l);if(s!==null)switch(s.tag){case 3:if(s=s.stateNode,s.current.memoizedState.isDehydrated){var g=pn(s.pendingLanes);if(g!==0){var y=s;for(y.pendingLanes|=2,y.entangledLanes|=2;g;){var z=1<<31-Ht(g);y.entanglements[1]|=z,g&=~z}$n(s),(Pe&6)===0&&(no=ze()+500,$i(0))}}break;case 31:case 13:y=Ya(s,2),y!==null&&Zt(y,s,2),ro(),nu(s,2)}if(s=ru(r),s===null&&qc(e,t,r,wo,n),s===l)break;l=s}l!==null&&r.stopPropagation()}else qc(e,t,r,null,n)}}function ru(e){return e=ls(e),iu(e)}var wo=null;function iu(e){if(wo=null,e=fr(e),e!==null){var t=p(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=m(t),e!==null)return e;e=null}else if(n===31){if(e=b(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return wo=e,null}function Gg(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(tt()){case dt:return 2;case At:return 8;case nn:case Yo:return 32;case pl:return 268435456;default:return 32}default:return 32}}var lu=!1,Ua=null,Oa=null,Ba=null,Yi=new Map,Fi=new Map,Ma=[],uy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Yg(e,t){switch(e){case"focusin":case"focusout":Ua=null;break;case"dragenter":case"dragleave":Oa=null;break;case"mouseover":case"mouseout":Ba=null;break;case"pointerover":case"pointerout":Yi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Fi.delete(t.pointerId)}}function Vi(e,t,n,r,l,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[l]},t!==null&&(t=pr(t),t!==null&&qg(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function dy(e,t,n,r,l){switch(t){case"focusin":return Ua=Vi(Ua,e,t,n,r,l),!0;case"dragenter":return Oa=Vi(Oa,e,t,n,r,l),!0;case"mouseover":return Ba=Vi(Ba,e,t,n,r,l),!0;case"pointerover":var s=l.pointerId;return Yi.set(s,Vi(Yi.get(s)||null,e,t,n,r,l)),!0;case"gotpointercapture":return s=l.pointerId,Fi.set(s,Vi(Fi.get(s)||null,e,t,n,r,l)),!0}return!1}function Fg(e){var t=fr(e.target);if(t!==null){var n=p(t);if(n!==null){if(t=n.tag,t===13){if(t=m(n),t!==null){e.blockedOn=t,ld(e.priority,function(){Wg(n)});return}}else if(t===31){if(t=b(n),t!==null){e.blockedOn=t,ld(e.priority,function(){Wg(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function So(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ru(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);is=r,n.target.dispatchEvent(r),is=null}else return t=pr(n),t!==null&&qg(t),e.blockedOn=n,!1;t.shift()}return!0}function Vg(e,t,n){So(e)&&n.delete(t)}function fy(){lu=!1,Ua!==null&&So(Ua)&&(Ua=null),Oa!==null&&So(Oa)&&(Oa=null),Ba!==null&&So(Ba)&&(Ba=null),Yi.forEach(Vg),Fi.forEach(Vg)}function jo(e,t){e.blockedOn===t&&(e.blockedOn=null,lu||(lu=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,fy)))}var ko=null;function Xg(e){ko!==e&&(ko=e,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){ko===e&&(ko=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],l=e[t+2];if(typeof r!="function"){if(iu(r||n)===null)continue;break}var s=pr(n);s!==null&&(e.splice(t,3),t-=3,rc(s,{pending:!0,data:l,method:n.method,action:r},r,l))}}))}function Vr(e){function t(z){return jo(z,e)}Ua!==null&&jo(Ua,e),Oa!==null&&jo(Oa,e),Ba!==null&&jo(Ba,e),Yi.forEach(t),Fi.forEach(t);for(var n=0;n<Ma.length;n++){var r=Ma[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ma.length&&(n=Ma[0],n.blockedOn===null);)Fg(n),n.blockedOn===null&&Ma.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var l=n[r],s=n[r+1],g=l[Yt]||null;if(typeof s=="function")g||Xg(n);else if(g){var y=null;if(s&&s.hasAttribute("formAction")){if(l=s,g=s[Yt]||null)y=g.formAction;else if(iu(l)!==null)continue}else y=g.action;typeof y=="function"?n[r+1]=y:(n.splice(r,3),r-=3),Xg(n)}}}function Qg(){function e(s){s.canIntercept&&s.info==="react-transition"&&s.intercept({handler:function(){return new Promise(function(g){return l=g})},focusReset:"manual",scroll:"manual"})}function t(){l!==null&&(l(),l=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var s=navigation.currentEntry;s&&s.url!=null&&navigation.navigate(s.url,{state:s.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var r=!1,l=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),l!==null&&(l(),l=null)}}}function ou(e){this._internalRoot=e}To.prototype.render=ou.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(u(409));var n=t.current,r=dn();Ig(n,r,e,t,null,null)},To.prototype.unmount=ou.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ig(e.current,2,null,e,null,null),ro(),t[dr]=null}};function To(e){this._internalRoot=e}To.prototype.unstable_scheduleHydration=function(e){if(e){var t=id();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ma.length&&t!==0&&t<Ma[n].priority;n++);Ma.splice(n,0,e),n===0&&Fg(e)}};var Pg=o.version;if(Pg!=="19.2.3")throw Error(u(527,Pg,"19.2.3"));K.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(u(188)):(e=Object.keys(e).join(","),Error(u(268,e)));return e=h(t),e=e!==null?S(e):null,e=e===null?null:e.stateNode,e};var py={bundleType:0,version:"19.2.3",rendererPackageName:"react-dom",currentDispatcherRef:j,reconcilerVersion:"19.2.3"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Co=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Co.isDisabled&&Co.supportsFiber)try{Ha=Co.inject(py),$t=Co}catch{}}return Qi.createRoot=function(e,t){if(!f(e))throw Error(u(299));var n=!1,r="",l=rp,s=ip,g=lp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(l=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(g=t.onRecoverableError)),t=$g(e,1,!1,null,null,n,r,null,l,s,g,Qg),e[dr]=t.current,Kc(e),new ou(t)},Qi.hydrateRoot=function(e,t,n){if(!f(e))throw Error(u(299));var r=!1,l="",s=rp,g=ip,y=lp,z=null;return n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onUncaughtError!==void 0&&(s=n.onUncaughtError),n.onCaughtError!==void 0&&(g=n.onCaughtError),n.onRecoverableError!==void 0&&(y=n.onRecoverableError),n.formState!==void 0&&(z=n.formState)),t=$g(e,1,!0,t,n??null,r,l,z,s,g,y,Qg),t.context=Hg(null),n=t.current,r=dn(),r=Po(r),l=va(r),l.callback=null,wa(n,l,r),n=r,t.current.lanes=n,fa(t,n),$n(t),e[dr]=t.current,Kc(e),new To(t)},Qi.version="19.2.3",Qi}var o0;function jy(){if(o0)return uu.exports;o0=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(o){console.error(o)}}return i(),uu.exports=Sy(),uu.exports}var ky=jy();var s0="popstate";function Ty(i={}){function o(u,f){let{pathname:p,search:m,hash:b}=u.location;return $o("",{pathname:p,search:m,hash:b},f.state&&f.state.usr||null,f.state&&f.state.key||"default")}function c(u,f){return typeof f=="string"?f:ti(f)}return pm(o,c,null,i)}function Cy(i={}){function o(f,p){let{pathname:m="/",search:b="",hash:x=""}=ur(f.location.hash.substring(1));return!m.startsWith("/")&&!m.startsWith(".")&&(m="/"+m),$o("",{pathname:m,search:b,hash:x},p.state&&p.state.usr||null,p.state&&p.state.key||"default")}function c(f,p){let m=f.document.querySelector("base"),b="";if(m&&m.getAttribute("href")){let x=f.location.href,h=x.indexOf("#");b=h===-1?x:x.slice(0,h)}return b+"#"+(typeof p=="string"?p:ti(p))}function u(f,p){fn(f.pathname.charAt(0)==="/",`relative pathnames are not supported in hash history.push(${JSON.stringify(p)})`)}return pm(o,c,u,i)}function xt(i,o){if(i===!1||i===null||typeof i>"u")throw new Error(o)}function fn(i,o){if(!i){typeof console<"u"&&console.warn(o);try{throw new Error(o)}catch{}}}function Ry(){return Math.random().toString(36).substring(2,10)}function c0(i,o){return{usr:i.state,key:i.key,idx:o}}function $o(i,o,c=null,u){return{pathname:typeof i=="string"?i:i.pathname,search:"",hash:"",...typeof o=="string"?ur(o):o,state:c,key:o&&o.key||u||Ry()}}function ti({pathname:i="/",search:o="",hash:c=""}){return o&&o!=="?"&&(i+=o.charAt(0)==="?"?o:"?"+o),c&&c!=="#"&&(i+=c.charAt(0)==="#"?c:"#"+c),i}function ur(i){let o={};if(i){let c=i.indexOf("#");c>=0&&(o.hash=i.substring(c),i=i.substring(0,c));let u=i.indexOf("?");u>=0&&(o.search=i.substring(u),i=i.substring(0,u)),i&&(o.pathname=i)}return o}function pm(i,o,c,u={}){let{window:f=document.defaultView,v5Compat:p=!1}=u,m=f.history,b="POP",x=null,h=S();h==null&&(h=0,m.replaceState({...m.state,idx:h},""));function S(){return(m.state||{idx:null}).idx}function w(){b="POP";let C=S(),T=C==null?null:C-h;h=C,x&&x({action:b,location:U.location,delta:T})}function N(C,T){b="PUSH";let E=$o(U.location,C,T);c&&c(E,C),h=S()+1;let D=c0(E,h),Q=U.createHref(E);try{m.pushState(D,"",Q)}catch(q){if(q instanceof DOMException&&q.name==="DataCloneError")throw q;f.location.assign(Q)}p&&x&&x({action:b,location:U.location,delta:1})}function L(C,T){b="REPLACE";let E=$o(U.location,C,T);c&&c(E,C),h=S();let D=c0(E,h),Q=U.createHref(E);m.replaceState(D,"",Q),p&&x&&x({action:b,location:U.location,delta:0})}function B(C){return Ey(C)}let U={get action(){return b},get location(){return i(f,m)},listen(C){if(x)throw new Error("A history only accepts one active listener");return f.addEventListener(s0,w),x=C,()=>{f.removeEventListener(s0,w),x=null}},createHref(C){return o(f,C)},createURL:B,encodeLocation(C){let T=B(C);return{pathname:T.pathname,search:T.search,hash:T.hash}},push:N,replace:L,go(C){return m.go(C)}};return U}function Ey(i,o=!1){let c="http://localhost";typeof window<"u"&&(c=window.location.origin!=="null"?window.location.origin:window.location.href),xt(c,"No window.location.(origin|href) available to create URL");let u=typeof i=="string"?i:ti(i);return u=u.replace(/ $/,"%20"),!o&&u.startsWith("//")&&(u=c+u),new URL(u,c)}function gm(i,o,c="/"){return zy(i,o,c,!1)}function zy(i,o,c,u){let f=typeof o=="string"?ur(o):o,p=da(f.pathname||"/",c);if(p==null)return null;let m=mm(i);Ny(m);let b=null;for(let x=0;b==null&&x<m.length;++x){let h=Iy(p);b=$y(m[x],h,u)}return b}function mm(i,o=[],c=[],u="",f=!1){let p=(m,b,x=f,h)=>{let S={relativePath:h===void 0?m.path||"":h,caseSensitive:m.caseSensitive===!0,childrenIndex:b,route:m};if(S.relativePath.startsWith("/")){if(!S.relativePath.startsWith(u)&&x)return;xt(S.relativePath.startsWith(u),`Absolute route path "${S.relativePath}" nested under path "${u}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),S.relativePath=S.relativePath.slice(u.length)}let w=ua([u,S.relativePath]),N=c.concat(S);m.children&&m.children.length>0&&(xt(m.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${w}".`),mm(m.children,o,N,w,x)),!(m.path==null&&!m.index)&&o.push({path:w,score:_y(w,m.index),routesMeta:N})};return i.forEach((m,b)=>{if(m.path===""||!m.path?.includes("?"))p(m,b);else for(let x of hm(m.path))p(m,b,!0,x)}),o}function hm(i){let o=i.split("/");if(o.length===0)return[];let[c,...u]=o,f=c.endsWith("?"),p=c.replace(/\?$/,"");if(u.length===0)return f?[p,""]:[p];let m=hm(u.join("/")),b=[];return b.push(...m.map(x=>x===""?p:[p,x].join("/"))),f&&b.push(...m),b.map(x=>i.startsWith("/")&&x===""?"/":x)}function Ny(i){i.sort((o,c)=>o.score!==c.score?c.score-o.score:Dy(o.routesMeta.map(u=>u.childrenIndex),c.routesMeta.map(u=>u.childrenIndex)))}var Ay=/^:[\w-]+$/,Uy=3,Oy=2,By=1,My=10,Ly=-2,u0=i=>i==="*";function _y(i,o){let c=i.split("/"),u=c.length;return c.some(u0)&&(u+=Ly),o&&(u+=Oy),c.filter(f=>!u0(f)).reduce((f,p)=>f+(Ay.test(p)?Uy:p===""?By:My),u)}function Dy(i,o){return i.length===o.length&&i.slice(0,-1).every((u,f)=>u===o[f])?i[i.length-1]-o[o.length-1]:0}function $y(i,o,c=!1){let{routesMeta:u}=i,f={},p="/",m=[];for(let b=0;b<u.length;++b){let x=u[b],h=b===u.length-1,S=p==="/"?o:o.slice(p.length)||"/",w=Ho({path:x.relativePath,caseSensitive:x.caseSensitive,end:h},S),N=x.route;if(!w&&h&&c&&!u[u.length-1].route.index&&(w=Ho({path:x.relativePath,caseSensitive:x.caseSensitive,end:!1},S)),!w)return null;Object.assign(f,w.params),m.push({params:f,pathname:ua([p,w.pathname]),pathnameBase:Gy(ua([p,w.pathnameBase])),route:N}),w.pathnameBase!=="/"&&(p=ua([p,w.pathnameBase]))}return m}function Ho(i,o){typeof i=="string"&&(i={path:i,caseSensitive:!1,end:!0});let[c,u]=Hy(i.path,i.caseSensitive,i.end),f=o.match(c);if(!f)return null;let p=f[0],m=p.replace(/(.)\/+$/,"$1"),b=f.slice(1);return{params:u.reduce((h,{paramName:S,isOptional:w},N)=>{if(S==="*"){let B=b[N]||"";m=p.slice(0,p.length-B.length).replace(/(.)\/+$/,"$1")}const L=b[N];return w&&!L?h[S]=void 0:h[S]=(L||"").replace(/%2F/g,"/"),h},{}),pathname:p,pathnameBase:m,pattern:i}}function Hy(i,o=!1,c=!0){fn(i==="*"||!i.endsWith("*")||i.endsWith("/*"),`Route path "${i}" will be treated as if it were "${i.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/,"/*")}".`);let u=[],f="^"+i.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(m,b,x)=>(u.push({paramName:b,isOptional:x!=null}),x?"/?([^\\/]+)?":"/([^\\/]+)")).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return i.endsWith("*")?(u.push({paramName:"*"}),f+=i==="*"||i==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):c?f+="\\/*$":i!==""&&i!=="/"&&(f+="(?:(?=\\/|$))"),[new RegExp(f,o?void 0:"i"),u]}function Iy(i){try{return i.split("/").map(o=>decodeURIComponent(o).replace(/\//g,"%2F")).join("/")}catch(o){return fn(!1,`The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${o}).`),i}}function da(i,o){if(o==="/")return i;if(!i.toLowerCase().startsWith(o.toLowerCase()))return null;let c=o.endsWith("/")?o.length-1:o.length,u=i.charAt(c);return u&&u!=="/"?null:i.slice(c)||"/"}var bm=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ky=i=>bm.test(i);function qy(i,o="/"){let{pathname:c,search:u="",hash:f=""}=typeof i=="string"?ur(i):i,p;if(c)if(Ky(c))p=c;else{if(c.includes("//")){let m=c;c=c.replace(/\/\/+/g,"/"),fn(!1,`Pathnames cannot have embedded double slashes - normalizing ${m} -> ${c}`)}c.startsWith("/")?p=d0(c.substring(1),"/"):p=d0(c,o)}else p=o;return{pathname:p,search:Yy(u),hash:Fy(f)}}function d0(i,o){let c=o.replace(/\/+$/,"").split("/");return i.split("/").forEach(f=>{f===".."?c.length>1&&c.pop():f!=="."&&c.push(f)}),c.length>1?c.join("/"):"/"}function gu(i,o,c,u){return`Cannot include a '${i}' character in a manually specified \`to.${o}\` field [${JSON.stringify(u)}].  Please separate it out to the \`to.${c}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Wy(i){return i.filter((o,c)=>c===0||o.route.path&&o.route.path.length>0)}function ym(i){let o=Wy(i);return o.map((c,u)=>u===o.length-1?c.pathname:c.pathnameBase)}function xm(i,o,c,u=!1){let f;typeof i=="string"?f=ur(i):(f={...i},xt(!f.pathname||!f.pathname.includes("?"),gu("?","pathname","search",f)),xt(!f.pathname||!f.pathname.includes("#"),gu("#","pathname","hash",f)),xt(!f.search||!f.search.includes("#"),gu("#","search","hash",f)));let p=i===""||f.pathname==="",m=p?"/":f.pathname,b;if(m==null)b=c;else{let w=o.length-1;if(!u&&m.startsWith("..")){let N=m.split("/");for(;N[0]==="..";)N.shift(),w-=1;f.pathname=N.join("/")}b=w>=0?o[w]:"/"}let x=qy(f,b),h=m&&m!=="/"&&m.endsWith("/"),S=(p||m===".")&&c.endsWith("/");return!x.pathname.endsWith("/")&&(h||S)&&(x.pathname+="/"),x}var ua=i=>i.join("/").replace(/\/\/+/g,"/"),Gy=i=>i.replace(/\/+$/,"").replace(/^\/*/,"/"),Yy=i=>!i||i==="?"?"":i.startsWith("?")?i:"?"+i,Fy=i=>!i||i==="#"?"":i.startsWith("#")?i:"#"+i,Vy=class{constructor(i,o,c,u=!1){this.status=i,this.statusText=o||"",this.internal=u,c instanceof Error?(this.data=c.toString(),this.error=c):this.data=c}};function Xy(i){return i!=null&&typeof i.status=="number"&&typeof i.statusText=="string"&&typeof i.internal=="boolean"&&"data"in i}function Qy(i){return i.map(o=>o.route.path).filter(Boolean).join("/").replace(/\/\/*/g,"/")||"/"}var vm=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function wm(i,o){let c=i;if(typeof c!="string"||!bm.test(c))return{absoluteURL:void 0,isExternal:!1,to:c};let u=c,f=!1;if(vm)try{let p=new URL(window.location.href),m=c.startsWith("//")?new URL(p.protocol+c):new URL(c),b=da(m.pathname,o);m.origin===p.origin&&b!=null?c=b+m.search+m.hash:f=!0}catch{fn(!1,`<Link to="${c}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:u,isExternal:f,to:c}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var Sm=["POST","PUT","PATCH","DELETE"];new Set(Sm);var Py=["GET",...Sm];new Set(Py);var ai=d.createContext(null);ai.displayName="DataRouter";var qo=d.createContext(null);qo.displayName="DataRouterState";var Zy=d.createContext(!1),jm=d.createContext({isTransitioning:!1});jm.displayName="ViewTransition";var Jy=d.createContext(new Map);Jy.displayName="Fetchers";var ex=d.createContext(null);ex.displayName="Await";var Cn=d.createContext(null);Cn.displayName="Navigation";var cl=d.createContext(null);cl.displayName="Location";var Kn=d.createContext({outlet:null,matches:[],isDataRoute:!1});Kn.displayName="Route";var Yu=d.createContext(null);Yu.displayName="RouteError";var km="REACT_ROUTER_ERROR",tx="REDIRECT",nx="ROUTE_ERROR_RESPONSE";function ax(i){if(i.startsWith(`${km}:${tx}:{`))try{let o=JSON.parse(i.slice(28));if(typeof o=="object"&&o&&typeof o.status=="number"&&typeof o.statusText=="string"&&typeof o.location=="string"&&typeof o.reloadDocument=="boolean"&&typeof o.replace=="boolean")return o}catch{}}function rx(i){if(i.startsWith(`${km}:${nx}:{`))try{let o=JSON.parse(i.slice(40));if(typeof o=="object"&&o&&typeof o.status=="number"&&typeof o.statusText=="string")return new Vy(o.status,o.statusText,o.data)}catch{}}function ix(i,{relative:o}={}){xt(ul(),"useHref() may be used only in the context of a <Router> component.");let{basename:c,navigator:u}=d.useContext(Cn),{hash:f,pathname:p,search:m}=dl(i,{relative:o}),b=p;return c!=="/"&&(b=p==="/"?c:ua([c,p])),u.createHref({pathname:b,search:m,hash:f})}function ul(){return d.useContext(cl)!=null}function Ge(){return xt(ul(),"useLocation() may be used only in the context of a <Router> component."),d.useContext(cl).location}var Tm="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function Cm(i){d.useContext(Cn).static||d.useLayoutEffect(i)}function _e(){let{isDataRoute:i}=d.useContext(Kn);return i?yx():lx()}function lx(){xt(ul(),"useNavigate() may be used only in the context of a <Router> component.");let i=d.useContext(ai),{basename:o,navigator:c}=d.useContext(Cn),{matches:u}=d.useContext(Kn),{pathname:f}=Ge(),p=JSON.stringify(ym(u)),m=d.useRef(!1);return Cm(()=>{m.current=!0}),d.useCallback((x,h={})=>{if(fn(m.current,Tm),!m.current)return;if(typeof x=="number"){c.go(x);return}let S=xm(x,JSON.parse(p),f,h.relative==="path");i==null&&o!=="/"&&(S.pathname=S.pathname==="/"?o:ua([o,S.pathname])),(h.replace?c.replace:c.push)(S,h.state,h)},[o,c,p,f,i])}d.createContext(null);function Fe(){let{matches:i}=d.useContext(Kn),o=i[i.length-1];return o?o.params:{}}function dl(i,{relative:o}={}){let{matches:c}=d.useContext(Kn),{pathname:u}=Ge(),f=JSON.stringify(ym(c));return d.useMemo(()=>xm(i,JSON.parse(f),u,o==="path"),[i,f,u,o])}function ox(i,o){return Rm(i,o)}function Rm(i,o,c,u,f){xt(ul(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:p}=d.useContext(Cn),{matches:m}=d.useContext(Kn),b=m[m.length-1],x=b?b.params:{},h=b?b.pathname:"/",S=b?b.pathnameBase:"/",w=b&&b.route;{let E=w&&w.path||"";zm(h,!w||E.endsWith("*")||E.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${h}" (under <Route path="${E}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${E}"> to <Route path="${E==="/"?"*":`${E}/*`}">.`)}let N=Ge(),L;if(o){let E=typeof o=="string"?ur(o):o;xt(S==="/"||E.pathname?.startsWith(S),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${S}" but pathname "${E.pathname}" was given in the \`location\` prop.`),L=E}else L=N;let B=L.pathname||"/",U=B;if(S!=="/"){let E=S.replace(/^\//,"").split("/");U="/"+B.replace(/^\//,"").split("/").slice(E.length).join("/")}let C=gm(i,{pathname:U});fn(w||C!=null,`No routes matched location "${L.pathname}${L.search}${L.hash}" `),fn(C==null||C[C.length-1].route.element!==void 0||C[C.length-1].route.Component!==void 0||C[C.length-1].route.lazy!==void 0,`Matched leaf route at location "${L.pathname}${L.search}${L.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let T=fx(C&&C.map(E=>Object.assign({},E,{params:Object.assign({},x,E.params),pathname:ua([S,p.encodeLocation?p.encodeLocation(E.pathname.replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:E.pathname]),pathnameBase:E.pathnameBase==="/"?S:ua([S,p.encodeLocation?p.encodeLocation(E.pathnameBase.replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:E.pathnameBase])})),m,c,u,f);return o&&T?d.createElement(cl.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",...L},navigationType:"POP"}},T):T}function sx(){let i=bx(),o=Xy(i)?`${i.status} ${i.statusText}`:i instanceof Error?i.message:JSON.stringify(i),c=i instanceof Error?i.stack:null,u="rgba(200,200,200, 0.5)",f={padding:"0.5rem",backgroundColor:u},p={padding:"2px 4px",backgroundColor:u},m=null;return console.error("Error handled by React Router default ErrorBoundary:",i),m=d.createElement(d.Fragment,null,d.createElement("p",null,"💿 Hey developer 👋"),d.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",d.createElement("code",{style:p},"ErrorBoundary")," or"," ",d.createElement("code",{style:p},"errorElement")," prop on your route.")),d.createElement(d.Fragment,null,d.createElement("h2",null,"Unexpected Application Error!"),d.createElement("h3",{style:{fontStyle:"italic"}},o),c?d.createElement("pre",{style:f},c):null,m)}var cx=d.createElement(sx,null),Em=class extends d.Component{constructor(i){super(i),this.state={location:i.location,revalidation:i.revalidation,error:i.error}}static getDerivedStateFromError(i){return{error:i}}static getDerivedStateFromProps(i,o){return o.location!==i.location||o.revalidation!=="idle"&&i.revalidation==="idle"?{error:i.error,location:i.location,revalidation:i.revalidation}:{error:i.error!==void 0?i.error:o.error,location:o.location,revalidation:i.revalidation||o.revalidation}}componentDidCatch(i,o){this.props.onError?this.props.onError(i,o):console.error("React Router caught the following error during render",i)}render(){let i=this.state.error;if(this.context&&typeof i=="object"&&i&&"digest"in i&&typeof i.digest=="string"){const c=rx(i.digest);c&&(i=c)}let o=i!==void 0?d.createElement(Kn.Provider,{value:this.props.routeContext},d.createElement(Yu.Provider,{value:i,children:this.props.component})):this.props.children;return this.context?d.createElement(ux,{error:i},o):o}};Em.contextType=Zy;var mu=new WeakMap;function ux({children:i,error:o}){let{basename:c}=d.useContext(Cn);if(typeof o=="object"&&o&&"digest"in o&&typeof o.digest=="string"){let u=ax(o.digest);if(u){let f=mu.get(o);if(f)throw f;let p=wm(u.location,c);if(vm&&!mu.get(o))if(p.isExternal||u.reloadDocument)window.location.href=p.absoluteURL||p.to;else{const m=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(p.to,{replace:u.replace}));throw mu.set(o,m),m}return d.createElement("meta",{httpEquiv:"refresh",content:`0;url=${p.absoluteURL||p.to}`})}}return i}function dx({routeContext:i,match:o,children:c}){let u=d.useContext(ai);return u&&u.static&&u.staticContext&&(o.route.errorElement||o.route.ErrorBoundary)&&(u.staticContext._deepestRenderedBoundaryId=o.route.id),d.createElement(Kn.Provider,{value:i},c)}function fx(i,o=[],c=null,u=null,f=null){if(i==null){if(!c)return null;if(c.errors)i=c.matches;else if(o.length===0&&!c.initialized&&c.matches.length>0)i=c.matches;else return null}let p=i,m=c?.errors;if(m!=null){let S=p.findIndex(w=>w.route.id&&m?.[w.route.id]!==void 0);xt(S>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(m).join(",")}`),p=p.slice(0,Math.min(p.length,S+1))}let b=!1,x=-1;if(c)for(let S=0;S<p.length;S++){let w=p[S];if((w.route.HydrateFallback||w.route.hydrateFallbackElement)&&(x=S),w.route.id){let{loaderData:N,errors:L}=c,B=w.route.loader&&!N.hasOwnProperty(w.route.id)&&(!L||L[w.route.id]===void 0);if(w.route.lazy||B){b=!0,x>=0?p=p.slice(0,x+1):p=[p[0]];break}}}let h=c&&u?(S,w)=>{u(S,{location:c.location,params:c.matches?.[0]?.params??{},unstable_pattern:Qy(c.matches),errorInfo:w})}:void 0;return p.reduceRight((S,w,N)=>{let L,B=!1,U=null,C=null;c&&(L=m&&w.route.id?m[w.route.id]:void 0,U=w.route.errorElement||cx,b&&(x<0&&N===0?(zm("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),B=!0,C=null):x===N&&(B=!0,C=w.route.hydrateFallbackElement||null)));let T=o.concat(p.slice(0,N+1)),E=()=>{let D;return L?D=U:B?D=C:w.route.Component?D=d.createElement(w.route.Component,null):w.route.element?D=w.route.element:D=S,d.createElement(dx,{match:w,routeContext:{outlet:S,matches:T,isDataRoute:c!=null},children:D})};return c&&(w.route.ErrorBoundary||w.route.errorElement||N===0)?d.createElement(Em,{location:c.location,revalidation:c.revalidation,component:U,error:L,children:E(),routeContext:{outlet:null,matches:T,isDataRoute:!0},onError:h}):E()},null)}function Fu(i){return`${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function px(i){let o=d.useContext(ai);return xt(o,Fu(i)),o}function gx(i){let o=d.useContext(qo);return xt(o,Fu(i)),o}function mx(i){let o=d.useContext(Kn);return xt(o,Fu(i)),o}function Vu(i){let o=mx(i),c=o.matches[o.matches.length-1];return xt(c.route.id,`${i} can only be used on routes that contain a unique "id"`),c.route.id}function hx(){return Vu("useRouteId")}function bx(){let i=d.useContext(Yu),o=gx("useRouteError"),c=Vu("useRouteError");return i!==void 0?i:o.errors?.[c]}function yx(){let{router:i}=px("useNavigate"),o=Vu("useNavigate"),c=d.useRef(!1);return Cm(()=>{c.current=!0}),d.useCallback(async(f,p={})=>{fn(c.current,Tm),c.current&&(typeof f=="number"?await i.navigate(f):await i.navigate(f,{fromRouteId:o,...p}))},[i,o])}var f0={};function zm(i,o,c){!o&&!f0[i]&&(f0[i]=!0,fn(!1,c))}d.memo(xx);function xx({routes:i,future:o,state:c,onError:u}){return Rm(i,void 0,c,u,o)}function Be(i){xt(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function Nm({basename:i="/",children:o=null,location:c,navigationType:u="POP",navigator:f,static:p=!1,unstable_useTransitions:m}){xt(!ul(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let b=i.replace(/^\/*/,"/"),x=d.useMemo(()=>({basename:b,navigator:f,static:p,unstable_useTransitions:m,future:{}}),[b,f,p,m]);typeof c=="string"&&(c=ur(c));let{pathname:h="/",search:S="",hash:w="",state:N=null,key:L="default"}=c,B=d.useMemo(()=>{let U=da(h,b);return U==null?null:{location:{pathname:U,search:S,hash:w,state:N,key:L},navigationType:u}},[b,h,S,w,N,L,u]);return fn(B!=null,`<Router basename="${b}"> is not able to match the URL "${h}${S}${w}" because it does not start with the basename, so the <Router> won't render anything.`),B==null?null:d.createElement(Cn.Provider,{value:x},d.createElement(cl.Provider,{children:o,value:B}))}function vx({children:i,location:o}){return ox(Hu(i),o)}function Hu(i,o=[]){let c=[];return d.Children.forEach(i,(u,f)=>{if(!d.isValidElement(u))return;let p=[...o,f];if(u.type===d.Fragment){c.push.apply(c,Hu(u.props.children,p));return}xt(u.type===Be,`[${typeof u.type=="string"?u.type:u.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),xt(!u.props.index||!u.props.children,"An index route cannot have child routes.");let m={id:u.props.id||p.join("-"),caseSensitive:u.props.caseSensitive,element:u.props.element,Component:u.props.Component,index:u.props.index,path:u.props.path,middleware:u.props.middleware,loader:u.props.loader,action:u.props.action,hydrateFallbackElement:u.props.hydrateFallbackElement,HydrateFallback:u.props.HydrateFallback,errorElement:u.props.errorElement,ErrorBoundary:u.props.ErrorBoundary,hasErrorBoundary:u.props.hasErrorBoundary===!0||u.props.ErrorBoundary!=null||u.props.errorElement!=null,shouldRevalidate:u.props.shouldRevalidate,handle:u.props.handle,lazy:u.props.lazy};u.props.children&&(m.children=Hu(u.props.children,p)),c.push(m)}),c}var Lo="get",_o="application/x-www-form-urlencoded";function Wo(i){return typeof HTMLElement<"u"&&i instanceof HTMLElement}function wx(i){return Wo(i)&&i.tagName.toLowerCase()==="button"}function Sx(i){return Wo(i)&&i.tagName.toLowerCase()==="form"}function jx(i){return Wo(i)&&i.tagName.toLowerCase()==="input"}function kx(i){return!!(i.metaKey||i.altKey||i.ctrlKey||i.shiftKey)}function Tx(i,o){return i.button===0&&(!o||o==="_self")&&!kx(i)}function Iu(i=""){return new URLSearchParams(typeof i=="string"||Array.isArray(i)||i instanceof URLSearchParams?i:Object.keys(i).reduce((o,c)=>{let u=i[c];return o.concat(Array.isArray(u)?u.map(f=>[c,f]):[[c,u]])},[]))}function Cx(i,o){let c=Iu(i);return o&&o.forEach((u,f)=>{c.has(f)||o.getAll(f).forEach(p=>{c.append(f,p)})}),c}var Ro=null;function Rx(){if(Ro===null)try{new FormData(document.createElement("form"),0),Ro=!1}catch{Ro=!0}return Ro}var Ex=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function hu(i){return i!=null&&!Ex.has(i)?(fn(!1,`"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${_o}"`),null):i}function zx(i,o){let c,u,f,p,m;if(Sx(i)){let b=i.getAttribute("action");u=b?da(b,o):null,c=i.getAttribute("method")||Lo,f=hu(i.getAttribute("enctype"))||_o,p=new FormData(i)}else if(wx(i)||jx(i)&&(i.type==="submit"||i.type==="image")){let b=i.form;if(b==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let x=i.getAttribute("formaction")||b.getAttribute("action");if(u=x?da(x,o):null,c=i.getAttribute("formmethod")||b.getAttribute("method")||Lo,f=hu(i.getAttribute("formenctype"))||hu(b.getAttribute("enctype"))||_o,p=new FormData(b,i),!Rx()){let{name:h,type:S,value:w}=i;if(S==="image"){let N=h?`${h}.`:"";p.append(`${N}x`,"0"),p.append(`${N}y`,"0")}else h&&p.append(h,w)}}else{if(Wo(i))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');c=Lo,u=null,f=_o,m=i}return p&&f==="text/plain"&&(m=p,p=void 0),{action:u,method:c.toLowerCase(),encType:f,formData:p,body:m}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Xu(i,o){if(i===!1||i===null||typeof i>"u")throw new Error(o)}function Nx(i,o,c,u){let f=typeof i=="string"?new URL(i,typeof window>"u"?"server://singlefetch/":window.location.origin):i;return c?f.pathname.endsWith("/")?f.pathname=`${f.pathname}_.${u}`:f.pathname=`${f.pathname}.${u}`:f.pathname==="/"?f.pathname=`_root.${u}`:o&&da(f.pathname,o)==="/"?f.pathname=`${o.replace(/\/$/,"")}/_root.${u}`:f.pathname=`${f.pathname.replace(/\/$/,"")}.${u}`,f}async function Ax(i,o){if(i.id in o)return o[i.id];try{let c=await import(i.module);return o[i.id]=c,c}catch(c){return console.error(`Error loading route module \`${i.module}\`, reloading page...`),console.error(c),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function Ux(i){return i==null?!1:i.href==null?i.rel==="preload"&&typeof i.imageSrcSet=="string"&&typeof i.imageSizes=="string":typeof i.rel=="string"&&typeof i.href=="string"}async function Ox(i,o,c){let u=await Promise.all(i.map(async f=>{let p=o.routes[f.route.id];if(p){let m=await Ax(p,c);return m.links?m.links():[]}return[]}));return _x(u.flat(1).filter(Ux).filter(f=>f.rel==="stylesheet"||f.rel==="preload").map(f=>f.rel==="stylesheet"?{...f,rel:"prefetch",as:"style"}:{...f,rel:"prefetch"}))}function p0(i,o,c,u,f,p){let m=(x,h)=>c[h]?x.route.id!==c[h].route.id:!0,b=(x,h)=>c[h].pathname!==x.pathname||c[h].route.path?.endsWith("*")&&c[h].params["*"]!==x.params["*"];return p==="assets"?o.filter((x,h)=>m(x,h)||b(x,h)):p==="data"?o.filter((x,h)=>{let S=u.routes[x.route.id];if(!S||!S.hasLoader)return!1;if(m(x,h)||b(x,h))return!0;if(x.route.shouldRevalidate){let w=x.route.shouldRevalidate({currentUrl:new URL(f.pathname+f.search+f.hash,window.origin),currentParams:c[0]?.params||{},nextUrl:new URL(i,window.origin),nextParams:x.params,defaultShouldRevalidate:!0});if(typeof w=="boolean")return w}return!0}):[]}function Bx(i,o,{includeHydrateFallback:c}={}){return Mx(i.map(u=>{let f=o.routes[u.route.id];if(!f)return[];let p=[f.module];return f.clientActionModule&&(p=p.concat(f.clientActionModule)),f.clientLoaderModule&&(p=p.concat(f.clientLoaderModule)),c&&f.hydrateFallbackModule&&(p=p.concat(f.hydrateFallbackModule)),f.imports&&(p=p.concat(f.imports)),p}).flat(1))}function Mx(i){return[...new Set(i)]}function Lx(i){let o={},c=Object.keys(i).sort();for(let u of c)o[u]=i[u];return o}function _x(i,o){let c=new Set;return new Set(o),i.reduce((u,f)=>{let p=JSON.stringify(Lx(f));return c.has(p)||(c.add(p),u.push({key:p,link:f})),u},[])}function Am(){let i=d.useContext(ai);return Xu(i,"You must render this element inside a <DataRouterContext.Provider> element"),i}function Dx(){let i=d.useContext(qo);return Xu(i,"You must render this element inside a <DataRouterStateContext.Provider> element"),i}var Qu=d.createContext(void 0);Qu.displayName="FrameworkContext";function Um(){let i=d.useContext(Qu);return Xu(i,"You must render this element inside a <HydratedRouter> element"),i}function $x(i,o){let c=d.useContext(Qu),[u,f]=d.useState(!1),[p,m]=d.useState(!1),{onFocus:b,onBlur:x,onMouseEnter:h,onMouseLeave:S,onTouchStart:w}=o,N=d.useRef(null);d.useEffect(()=>{if(i==="render"&&m(!0),i==="viewport"){let U=T=>{T.forEach(E=>{m(E.isIntersecting)})},C=new IntersectionObserver(U,{threshold:.5});return N.current&&C.observe(N.current),()=>{C.disconnect()}}},[i]),d.useEffect(()=>{if(u){let U=setTimeout(()=>{m(!0)},100);return()=>{clearTimeout(U)}}},[u]);let L=()=>{f(!0)},B=()=>{f(!1),m(!1)};return c?i!=="intent"?[p,N,{}]:[p,N,{onFocus:Pi(b,L),onBlur:Pi(x,B),onMouseEnter:Pi(h,L),onMouseLeave:Pi(S,B),onTouchStart:Pi(w,L)}]:[!1,N,{}]}function Pi(i,o){return c=>{i&&i(c),c.defaultPrevented||o(c)}}function Hx({page:i,...o}){let{router:c}=Am(),u=d.useMemo(()=>gm(c.routes,i,c.basename),[c.routes,i,c.basename]);return u?d.createElement(Kx,{page:i,matches:u,...o}):null}function Ix(i){let{manifest:o,routeModules:c}=Um(),[u,f]=d.useState([]);return d.useEffect(()=>{let p=!1;return Ox(i,o,c).then(m=>{p||f(m)}),()=>{p=!0}},[i,o,c]),u}function Kx({page:i,matches:o,...c}){let u=Ge(),{future:f,manifest:p,routeModules:m}=Um(),{basename:b}=Am(),{loaderData:x,matches:h}=Dx(),S=d.useMemo(()=>p0(i,o,h,p,u,"data"),[i,o,h,p,u]),w=d.useMemo(()=>p0(i,o,h,p,u,"assets"),[i,o,h,p,u]),N=d.useMemo(()=>{if(i===u.pathname+u.search+u.hash)return[];let U=new Set,C=!1;if(o.forEach(E=>{let D=p.routes[E.route.id];!D||!D.hasLoader||(!S.some(Q=>Q.route.id===E.route.id)&&E.route.id in x&&m[E.route.id]?.shouldRevalidate||D.hasClientLoader?C=!0:U.add(E.route.id))}),U.size===0)return[];let T=Nx(i,b,f.unstable_trailingSlashAwareDataRequests,"data");return C&&U.size>0&&T.searchParams.set("_routes",o.filter(E=>U.has(E.route.id)).map(E=>E.route.id).join(",")),[T.pathname+T.search]},[b,f.unstable_trailingSlashAwareDataRequests,x,u,p,S,o,i,m]),L=d.useMemo(()=>Bx(w,p),[w,p]),B=Ix(w);return d.createElement(d.Fragment,null,N.map(U=>d.createElement("link",{key:U,rel:"prefetch",as:"fetch",href:U,...c})),L.map(U=>d.createElement("link",{key:U,rel:"modulepreload",href:U,...c})),B.map(({key:U,link:C})=>d.createElement("link",{key:U,nonce:c.nonce,...C})))}function qx(...i){return o=>{i.forEach(c=>{typeof c=="function"?c(o):c!=null&&(c.current=o)})}}var Wx=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{Wx&&(window.__reactRouterVersion="7.12.0")}catch{}function Gx({basename:i,children:o,unstable_useTransitions:c,window:u}){let f=d.useRef();f.current==null&&(f.current=Ty({window:u,v5Compat:!0}));let p=f.current,[m,b]=d.useState({action:p.action,location:p.location}),x=d.useCallback(h=>{c===!1?b(h):d.startTransition(()=>b(h))},[c]);return d.useLayoutEffect(()=>p.listen(x),[p,x]),d.createElement(Nm,{basename:i,children:o,location:m.location,navigationType:m.action,navigator:p,unstable_useTransitions:c})}function Yx({basename:i,children:o,unstable_useTransitions:c,window:u}){let f=d.useRef();f.current==null&&(f.current=Cy({window:u,v5Compat:!0}));let p=f.current,[m,b]=d.useState({action:p.action,location:p.location}),x=d.useCallback(h=>{c===!1?b(h):d.startTransition(()=>b(h))},[c]);return d.useLayoutEffect(()=>p.listen(x),[p,x]),d.createElement(Nm,{basename:i,children:o,location:m.location,navigationType:m.action,navigator:p,unstable_useTransitions:c})}var Om=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,On=d.forwardRef(function({onClick:o,discover:c="render",prefetch:u="none",relative:f,reloadDocument:p,replace:m,state:b,target:x,to:h,preventScrollReset:S,viewTransition:w,unstable_defaultShouldRevalidate:N,...L},B){let{basename:U,unstable_useTransitions:C}=d.useContext(Cn),T=typeof h=="string"&&Om.test(h),E=wm(h,U);h=E.to;let D=ix(h,{relative:f}),[Q,q,J]=$x(u,L),M=Qx(h,{replace:m,state:b,target:x,preventScrollReset:S,relative:f,viewTransition:w,unstable_defaultShouldRevalidate:N,unstable_useTransitions:C});function $(F){o&&o(F),F.defaultPrevented||M(F)}let W=d.createElement("a",{...L,...J,href:E.absoluteURL||D,onClick:E.isExternal||p?o:$,ref:qx(B,q),target:x,"data-discover":!T&&c==="render"?"true":void 0});return Q&&!T?d.createElement(d.Fragment,null,W,d.createElement(Hx,{page:D})):W});On.displayName="Link";var Fx=d.forwardRef(function({"aria-current":o="page",caseSensitive:c=!1,className:u="",end:f=!1,style:p,to:m,viewTransition:b,children:x,...h},S){let w=dl(m,{relative:h.relative}),N=Ge(),L=d.useContext(qo),{navigator:B,basename:U}=d.useContext(Cn),C=L!=null&&t1(w)&&b===!0,T=B.encodeLocation?B.encodeLocation(w).pathname:w.pathname,E=N.pathname,D=L&&L.navigation&&L.navigation.location?L.navigation.location.pathname:null;c||(E=E.toLowerCase(),D=D?D.toLowerCase():null,T=T.toLowerCase()),D&&U&&(D=da(D,U)||D);const Q=T!=="/"&&T.endsWith("/")?T.length-1:T.length;let q=E===T||!f&&E.startsWith(T)&&E.charAt(Q)==="/",J=D!=null&&(D===T||!f&&D.startsWith(T)&&D.charAt(T.length)==="/"),M={isActive:q,isPending:J,isTransitioning:C},$=q?o:void 0,W;typeof u=="function"?W=u(M):W=[u,q?"active":null,J?"pending":null,C?"transitioning":null].filter(Boolean).join(" ");let F=typeof p=="function"?p(M):p;return d.createElement(On,{...h,"aria-current":$,className:W,ref:S,style:F,to:m,viewTransition:b},typeof x=="function"?x(M):x)});Fx.displayName="NavLink";var Vx=d.forwardRef(({discover:i="render",fetcherKey:o,navigate:c,reloadDocument:u,replace:f,state:p,method:m=Lo,action:b,onSubmit:x,relative:h,preventScrollReset:S,viewTransition:w,unstable_defaultShouldRevalidate:N,...L},B)=>{let{unstable_useTransitions:U}=d.useContext(Cn),C=Jx(),T=e1(b,{relative:h}),E=m.toLowerCase()==="get"?"get":"post",D=typeof b=="string"&&Om.test(b),Q=q=>{if(x&&x(q),q.defaultPrevented)return;q.preventDefault();let J=q.nativeEvent.submitter,M=J?.getAttribute("formmethod")||m,$=()=>C(J||q.currentTarget,{fetcherKey:o,method:M,navigate:c,replace:f,state:p,relative:h,preventScrollReset:S,viewTransition:w,unstable_defaultShouldRevalidate:N});U&&c!==!1?d.startTransition(()=>$()):$()};return d.createElement("form",{ref:B,method:E,action:T,onSubmit:u?x:Q,...L,"data-discover":!D&&i==="render"?"true":void 0})});Vx.displayName="Form";function Xx(i){return`${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Bm(i){let o=d.useContext(ai);return xt(o,Xx(i)),o}function Qx(i,{target:o,replace:c,state:u,preventScrollReset:f,relative:p,viewTransition:m,unstable_defaultShouldRevalidate:b,unstable_useTransitions:x}={}){let h=_e(),S=Ge(),w=dl(i,{relative:p});return d.useCallback(N=>{if(Tx(N,o)){N.preventDefault();let L=c!==void 0?c:ti(S)===ti(w),B=()=>h(i,{replace:L,state:u,preventScrollReset:f,relative:p,viewTransition:m,unstable_defaultShouldRevalidate:b});x?d.startTransition(()=>B()):B()}},[S,h,w,c,u,o,i,f,p,m,b,x])}function Pu(i){fn(typeof URLSearchParams<"u","You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.");let o=d.useRef(Iu(i)),c=d.useRef(!1),u=Ge(),f=d.useMemo(()=>Cx(u.search,c.current?null:o.current),[u.search]),p=_e(),m=d.useCallback((b,x)=>{const h=Iu(typeof b=="function"?b(new URLSearchParams(f)):b);c.current=!0,p("?"+h,x)},[p,f]);return[f,m]}var Px=0,Zx=()=>`__${String(++Px)}__`;function Jx(){let{router:i}=Bm("useSubmit"),{basename:o}=d.useContext(Cn),c=hx(),u=i.fetch,f=i.navigate;return d.useCallback(async(p,m={})=>{let{action:b,method:x,encType:h,formData:S,body:w}=zx(p,o);if(m.navigate===!1){let N=m.fetcherKey||Zx();await u(N,c,m.action||b,{unstable_defaultShouldRevalidate:m.unstable_defaultShouldRevalidate,preventScrollReset:m.preventScrollReset,formData:S,body:w,formMethod:m.method||x,formEncType:m.encType||h,flushSync:m.flushSync})}else await f(m.action||b,{unstable_defaultShouldRevalidate:m.unstable_defaultShouldRevalidate,preventScrollReset:m.preventScrollReset,formData:S,body:w,formMethod:m.method||x,formEncType:m.encType||h,replace:m.replace,state:m.state,fromRouteId:c,flushSync:m.flushSync,viewTransition:m.viewTransition})},[u,f,o,c])}function e1(i,{relative:o}={}){let{basename:c}=d.useContext(Cn),u=d.useContext(Kn);xt(u,"useFormAction must be used inside a RouteContext");let[f]=u.matches.slice(-1),p={...dl(i||".",{relative:o})},m=Ge();if(i==null){p.search=m.search;let b=new URLSearchParams(p.search),x=b.getAll("index");if(x.some(S=>S==="")){b.delete("index"),x.filter(w=>w).forEach(w=>b.append("index",w));let S=b.toString();p.search=S?`?${S}`:""}}return(!i||i===".")&&f.route.index&&(p.search=p.search?p.search.replace(/^\?/,"?index&"):"?index"),c!=="/"&&(p.pathname=p.pathname==="/"?c:ua([c,p.pathname])),ti(p)}function t1(i,{relative:o}={}){let c=d.useContext(jm);xt(c!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:u}=Bm("useViewTransitionState"),f=dl(i,{relative:o});if(!c.isTransitioning)return!1;let p=da(c.currentLocation.pathname,u)||c.currentLocation.pathname,m=da(c.nextLocation.pathname,u)||c.nextLocation.pathname;return Ho(f.pathname,m)!=null||Ho(f.pathname,p)!=null}const Mm=d.createContext(null),Lm="indiverse:cart:v1";function n1(i,o){try{return JSON.parse(i)??o}catch{return o}}function a1(i){return i?._id||i?.id||null}function Zi(i,o=0){const c=Number(i);return Number.isFinite(c)?c:o}function Ku(i){return String(i||"").trim()||""}function sr(i){return Ku(i).toLowerCase()}function r1({profileKey:i,itemType:o,sourceId:c,productId:u,selectedSize:f,selectedColor:p}){const m=sr(i),b=sr(o),x=Ku(c),h=Ku(u||""),S=sr(f),w=sr(p);return b==="product"||h||S||w?`pk:${m}|type:product|pid:${h||x}|size:${S}|color:${w}`:`pk:${m}|type:${b||"item"}|id:${x}`}function bu(i){const o=sr(i);return o?o==="products"?"product":o==="flowers"?"flower":o:""}function i1(){if(typeof window>"u")return[];const i=window.localStorage.getItem(Lm),o=n1(i,[]);return Array.isArray(o)?o:[]}function l1({children:i}){const[o,c]=d.useState(()=>i1());d.useEffect(()=>{if(!(typeof window>"u"))try{window.localStorage.setItem(Lm,JSON.stringify(o))}catch(h){console.log("[CartContext] localStorage write failed",h)}},[o]);const u=(h,S=1,w={})=>{if(!h)return;const N=a1(h);if(!N)return;const L=Zi(S,0);if(L===0)return;const B=w?.profileKey||h?.profileKey||null,U=!!(w?.productId||w?.selectedSize||w?.selectedColor),C=w?.itemType||h?.itemType||h?.type||(U?"product":"item"),T=bu(C)||"item",E=w?.productId||(T==="product"?String(N):null),D=w?.selectedSize||h?.selectedSize||null,Q=w?.selectedColor||h?.selectedColor||null,q=r1({profileKey:B,itemType:T,sourceId:N,productId:E,selectedSize:D,selectedColor:Q});c(J=>{const M=J.findIndex($=>$.lineKey===q);if(M!==-1){const $=[...J],W=$[M],F=Zi(W.quantity,0)+L;return F<=0?($.splice(M,1),$):($[M]={...W,name:h.name??W.name,priceCents:Zi(h.priceCents,W.priceCents||0),imageUrl:h.imageUrl??W.imageUrl??null,category:h.category??W.category??null,inStock:h.inStock??W.inStock??!0,itemType:T??W.itemType??"item",productId:E??W.productId??null,selectedSize:D??W.selectedSize??null,selectedColor:Q??W.selectedColor??null,size:W.size??null,type:W.type??null,profileKey:B??W.profileKey??null,quantity:F,lineKey:q},$)}return L<=0?J:[...J,{id:String(N),lineKey:q,name:h.name||"Item",priceCents:Zi(h.priceCents,0),quantity:L,imageUrl:h.imageUrl||null,category:h.category||null,inStock:h.inStock??!0,itemType:T,productId:E?String(E):null,selectedSize:D?String(D):null,selectedColor:Q?String(Q):null,size:h.size||null,type:h.type||null,profileKey:B}]})},f=h=>{if(!h)return;if(typeof h=="string"){const N=h;c(L=>L.filter(B=>B.lineKey!==N&&B.id!==N));return}const S=h?.lineKey||null,w=h?.id||h?._id||null;c(N=>N.filter(L=>!(S&&L.lineKey===S||w&&L.id===String(w))))},p=(h,S={})=>{const w=sr(h);if(!w)return;const N=bu(S?.onlyItemType||"");c(L=>L.filter(B=>sr(B?.profileKey)!==w?!0:N?bu(B?.itemType||B?.type||"")!==N:!1))},m=()=>c([]),b=d.useMemo(()=>o.reduce((h,S)=>h+Zi(S.quantity,0),0),[o]),x=d.useMemo(()=>({items:o,cartCount:b,addItem:u,removeItem:f,clearCartForProfile:p,clearCart:m}),[o,b]);return a.jsx(Mm.Provider,{value:x,children:i})}function Zu(){const i=d.useContext(Mm);if(!i)throw new Error("useCart must be used within a CartProvider");return i}let _m=[];function o1(i){return Array.isArray(i)?i.filter(Boolean):[]}function Dm(i){return String(i||"").trim().toLowerCase()}function s1(i){if(!i)return null;const o=Dm(i.key);return o?{...i,key:o}:null}function Do(i={}){_m=o1(i?.profiles).map(s1).filter(Boolean)}function c1(){return _m.filter(i=>i?.enabled!==!1)}function Rn(i){const o=Dm(i);return o&&c1().find(c=>c.key===o)||null}const $m=typeof window<"u"&&String(window.location?.hostname||"").includes("github.io"),Hm="https://montech-remote-config.s3.amazonaws.com/superapp/config.json";let Ji=null;const Im="indiverse:remoteConfig:lastGood";function u1(){try{if(typeof window>"u")return null;const i=window.localStorage.getItem(Im);if(!i)return null;const o=JSON.parse(i);return o&&typeof o=="object"?o:null}catch{return null}}function d1(i){try{if(typeof window>"u")return;window.localStorage.setItem(Im,JSON.stringify(i))}catch{}}async function f1(i){try{return await i.text()}catch{return""}}async function p1({url:i=Hm,timeoutMs:o=12e3}={}){const c=String(i||"").trim();if(!c)throw new Error("remote config url missing");const u=new AbortController,f=setTimeout(()=>u.abort(),o);console.log("[remoteConfig] fetch start",{finalUrl:c,IS_GITHUB_PAGES:$m});try{const p=await fetch(c,{signal:u.signal});if(!p.ok){const b=await f1(p);throw new Error(`remote config fetch failed: ${p.status}${b?` | ${b.slice(0,160)}`:""}`)}return await p.json()}catch(p){throw new Error(p?.message||String(p))}finally{clearTimeout(f)}}function g1(){return Ji||(Ji=(async()=>{try{const c=await p1();return Do(c),d1(c),console.log("✅ bootRemoteConfigOnce: loaded remote",{url:Hm,version:c?.version,mode:c?.mode,profileKeys:(c?.profiles||[]).map(u=>u?.key).filter(Boolean)}),c}catch(c){console.log("⚠️ remote config fetch failed, falling back",{message:c?.message||c,IS_GITHUB_PAGES:$m})}const i=u1();if(i)return Do(i),console.log("✅ bootRemoteConfigOnce: using cached config",{version:i?.version,mode:i?.mode,profileKeys:(i?.profiles||[]).map(c=>c?.key).filter(Boolean)}),i;const o={version:"fallback-empty",mode:"local",profiles:[]};return Do(o),console.log("✅ bootRemoteConfigOnce: using minimal fallback",o),o})().catch(i=>{throw console.log("❌ bootRemoteConfigOnce failed hard:",i?.message||i),Ji=null,i}),Ji)}function m1(){const i=_e(),{profileKey:o,featureKey:c}=Fe(),u=String(o||"").toLowerCase(),f=String(c||"").toLowerCase();return a.jsxs("div",{style:{minHeight:"100vh",background:"#000",color:"#fff",padding:24,fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},children:[a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"},children:[a.jsxs("div",{children:[a.jsx("div",{style:{fontSize:22,fontWeight:900,letterSpacing:.8},children:f.toUpperCase()}),a.jsxs("div",{style:{opacity:.7,marginTop:6},children:["Profile: ",a.jsx("span",{style:{opacity:.95},children:u})]})]}),a.jsx("button",{onClick:()=>i(`/world/${encodeURIComponent(u)}`),style:{borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.08)",color:"#fff",padding:"10px 14px",cursor:"pointer",fontWeight:800},children:"✕ Close"})]}),a.jsxs("div",{style:{marginTop:18,opacity:.8,lineHeight:1.55},children:["This feature route is wired and working — you just haven’t built the web page for it yet.",a.jsx("br",{}),"When you’re ready, create a real page and swap it into the router."]}),a.jsx("div",{style:{marginTop:18},children:a.jsx("button",{onClick:()=>i(-1),style:{borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(2,6,23,0.55)",color:"#e5e7eb",padding:"10px 14px",cursor:"pointer",fontWeight:800},children:"← Back"})})]})}const h1="https://montech-remote-config.s3.amazonaws.com/assets/test/bgvideo-1767903039953.mov",Km="https://montech-remote-config.s3.amazonaws.com/superapp/config.json";function b1(i){const o=String(i||"").toLowerCase().split("?")[0];return o.endsWith(".mp4")||o.endsWith(".mov")||o.endsWith(".m4v")||o.endsWith(".webm")}function y1(i){const o=String(i||"").toLowerCase().split("?")[0];return o.endsWith(".jpg")||o.endsWith(".jpeg")||o.endsWith(".png")||o.endsWith(".webp")||o.endsWith(".gif")}async function x1({url:i=Km,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function v1(i){return(Array.isArray(i?.profiles)?i.profiles:[]).map(c=>({key:c?.key||"",label:c?.label||c?.name||c?.key||"Unknown",enabled:c?.enabled!==!1,apiBaseUrl:c?.apiBaseUrl||null,endpoints:c?.endpoints||null,assets:c?.assets||{},icon:c?.icon||null})).filter(c=>c.key)}function w1(i,o=5e3){const c=d.useRef(null),u=d.useCallback(()=>{c.current||(c.current=setTimeout(()=>{c.current=null,i?.()},o))},[i,o]),f=d.useCallback(()=>{c.current&&(clearTimeout(c.current),c.current=null)},[]);return d.useMemo(()=>({onMouseDown:u,onMouseUp:f,onMouseLeave:f,onTouchStart:u,onTouchEnd:f,onTouchCancel:f}),[u,f])}const S1=d.memo(function({mod:o}){const c=o?.assets?.iconUrl||"";return!c?a.jsx("div",{className:"iconFallback",children:a.jsx("span",{className:"iconLetter",children:(o?.label||"?").charAt(0)})}):b1(c)?a.jsx("video",{className:"iconMedia",src:c,muted:!0,loop:!0,playsInline:!0,autoPlay:!0,preload:"metadata",onError:()=>{}}):y1(c)?a.jsx("img",{className:"iconMedia",src:c,alt:o?.label||"icon",loading:"lazy"}):a.jsx("div",{className:"iconFallback",children:a.jsx("span",{className:"iconLetter",children:(o?.label||"?").charAt(0)})})});function j1(){const i=_e(),[o,c]=d.useState([]),[u,f]=d.useState(!1),[p,m]=d.useState(h1),[b,x]=d.useState(!1),h=d.useCallback(async({force:U=!1}={})=>{try{f(!0);const C=await x1({url:Km});Do(C);const T=C?.assets?.universeBgVideoUrl||C?.universeBgVideoUrl||null;T&&m(T),console.log("🧾 universeBgVideoUrl:",T||"(default)",p),console.log("🧾 cfg.profiles[0].assets.iconUrl:",C?.profiles?.[0]?.assets?.iconUrl),console.log("✅ remote config loaded:",{version:C?.version,mode:C?.mode,profiles:(C?.profiles||[]).map(Q=>Q?.key).filter(Boolean)});const E=v1(C).filter(Q=>Q.enabled!==!1);console.log("✅ registry profiles AFTER:",E.map(Q=>Q.key));const D=E.find(Q=>Q.key==="lamont");console.log("🧾 lamont iconUrl:",D?.assets?.iconUrl),c(E)}catch(C){console.log("Remote config failed (using fallback empty list):",C?.message),c([])}finally{f(!1)}},[p]);d.useEffect(()=>{h({force:!0})},[]),d.useEffect(()=>{const U=()=>{x(!0),setTimeout(()=>x(!1),1e3)};U();const C=setInterval(U,8e3);return()=>clearInterval(C)},[]);const S=w1(()=>i("/vaultgate"),5e3),w=d.useMemo(()=>({transform:`scale(${b?1.1:1})`,transition:"transform 500ms ease"}),[b]),N=U=>{i(`/profile/${encodeURIComponent(U)}`)},L=()=>{i("/auth/signup",{state:{nextRoute:"music"}})},B=o.length;return a.jsxs("div",{className:"root",children:[p?a.jsx("video",{className:"bgVideo",src:p,muted:!0,loop:!0,autoPlay:!0,playsInline:!0,preload:"metadata"}):a.jsx("div",{className:"bgFallback"}),a.jsx("div",{className:"scroll",children:a.jsxs("div",{className:"container",children:[a.jsxs("div",{className:"headerWrapper",children:[a.jsx("div",{className:"superTitle",children:"MONTECH"}),a.jsx("div",{className:"title",children:"indiVerse"}),a.jsx("div",{className:"subtitle",children:"Choose a world to enter. Each app is its own universe, with its own vibe, music, and people."}),a.jsxs("div",{className:"pillRow",children:[a.jsx("div",{className:"pillWrap",...S,title:"Hold 5 seconds to open VaultGate",children:a.jsxs("div",{className:"pill",children:[a.jsx("span",{className:"pillIcon","aria-hidden":!0,children:"🪐"}),a.jsxs("span",{className:"pillText",children:[B," Active Realms"]})]})}),a.jsx("button",{className:"refreshBtn",onClick:()=>h({force:!0}),disabled:u,children:u?"Refreshing…":"Refresh"})]})]}),a.jsxs("div",{className:"grid",children:[o.map(U=>a.jsxs("button",{className:"iconTile",onClick:()=>N(U.key),children:[a.jsx("div",{className:"iconOuterGradient",style:w,children:a.jsx("div",{className:"iconOuter",children:a.jsxs("div",{className:"mediaClip",children:[a.jsx(S1,{mod:U}),a.jsx("div",{className:"mediaFallbackOverlay","aria-hidden":!0})]})})}),a.jsx("div",{className:"iconLabel",title:U.label,children:U.label})]},U.key)),a.jsxs("button",{className:"iconTile",onClick:L,children:[a.jsx("div",{className:"iconOuterGradient",style:w,children:a.jsx("div",{className:"iconOuter",children:a.jsx("div",{className:"iconFallback",children:a.jsx("span",{className:"signinIcon","aria-hidden":!0,children:"⎋"})})})}),a.jsx("div",{className:"iconLabel",children:"Sign In"})]})]}),a.jsx("div",{className:"footer",children:a.jsx("div",{className:"footerText",children:"Built by Montech • One codebase, multiple universes."})})]})}),a.jsx("style",{children:`
        .root {
          position: relative;
          min-height: 100vh;
          background: #000;
          overflow: hidden;
          color: #fff;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        }

        .bgVideo, .bgFallback {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          background: #000;
          transform: translateZ(0);
        }

        .scroll {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          overflow: auto;
        }

        .container {
          padding: 70px 20px 40px;
          max-width: 980px;
          margin: 0 auto;
        }

        .headerWrapper { margin-bottom: 28px; }

        .superTitle {
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .title {
          font-size: 34px;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 800;
          text-align: center;
        }

        .subtitle {
          font-size: 14px;
          color: #9ca3af;
          text-align: center;
          line-height: 20px;
          margin: 0 8px;
        }

        .pillRow {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pillWrap { cursor: pointer; user-select: none; }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148,163,184,0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 18px 24px rgba(0,0,0,0.35);
        }

        .pillIcon { font-size: 14px; }
        .pillText { color: #e5e7eb; font-size: 12px; }

        .refreshBtn{
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.35);
          background: rgba(2,6,23,0.55);
          color: #e5e7eb;
          cursor: pointer;
        }
        .refreshBtn:disabled { opacity: 0.6; cursor: not-allowed; }

        .grid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 14px;
          justify-items: center;
        }

        @media (min-width: 640px){
          .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 980px){
          .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        .iconTile {
          width: 100%;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          text-decoration: none;
        }
        .iconTile:active { transform: scale(0.98); opacity: 0.95; }

        .iconOuterGradient {
          width: 110px;
          height: 110px;
          border-radius: 32px;
          padding: 2.5px;
          margin-bottom: 2px;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 18px 24px rgba(0,0,0,0.45);
        }

        .iconOuter {
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          background: #020617;
          border: 1px solid rgba(30,64,175,0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .mediaClip { position: relative; width: 100%; height: 100%; }
        .iconMedia {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mediaFallbackOverlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(transparent 55%, rgba(0,0,0,0.35));
          opacity: 0.9;
        }

        .iconFallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
        }
        .iconLetter { font-size: 30px; font-weight: 800; color: #fff; }

        .signinIcon {
          font-size: 34px;
          color: #00ffff;
          text-shadow: 0 0 12px rgba(0,255,255,0.35);
        }

        .iconLabel {
          color: #e5e7eb;
          font-size: 14px;
          text-align: center;
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .footer { margin-top: 14px; display: flex; justify-content: center; }
        .footerText { font-size: 11px; color: #6b7280; }
      `})]})}const k1="https://montech-remote-config.s3.amazonaws.com/superapp/config.json";function g0(i){return typeof i=="string"&&/^https?:\/\//i.test(i)}function T1(i){const o=String(i||"").toLowerCase().split("?")[0];return o.endsWith(".mp4")||o.endsWith(".mov")||o.endsWith(".m4v")||o.endsWith(".webm")}function C1(i){const o=String(i||"").toLowerCase().split("?")[0];return o.endsWith(".jpg")||o.endsWith(".jpeg")||o.endsWith(".png")||o.endsWith(".webp")}async function R1({url:i=k1,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function E1(i,o){return(Array.isArray(i?.profiles)?i.profiles:[]).find(u=>String(u?.key||"").trim()===String(o).trim())||null}function z1(){const i=_e(),{profileKey:o}=Fe(),c=o||"lamont",[u,f]=d.useState(null),[p,m]=d.useState(!0),[b,x]=d.useState(!1),[h,S]=d.useState(0),[w,N]=d.useState(!1),L=d.useRef(!1);d.useEffect(()=>{let Q=!0;return m(!0),R1().then(q=>{Q&&f(q)}).catch(q=>console.log("❌ remote config failed:",q?.message)).finally(()=>Q&&m(!1)),()=>{Q=!1}},[]);const B=d.useMemo(()=>E1(u,c),[u,c]),U=d.useMemo(()=>{const Q=B?.worldTitle||B?.brandTopTitle||B?.label||B?.key||c;return String(Q).trim()||c},[B,c]),C=d.useMemo(()=>{const Q=B?.assets?.bgVideoUrl,q=B?.assets?.iconUrl;return g0(Q)?Q:g0(q)?q:null},[B]),T=d.useMemo(()=>C?T1(C)?"video":C1(C)?"image":"none":"none",[C]);d.useEffect(()=>{x(!1),N(!1),L.current=!1,S(0);const Q=setTimeout(()=>S(1),60);return()=>clearTimeout(Q)},[c]);const E=()=>i("/"),D=()=>{L.current||(L.current=!0,S(0),N(!0),setTimeout(()=>{x(!0),i(`/universe/${encodeURIComponent(c)}`)},820))};return!p&&!B?a.jsxs("div",{className:"ph-root",children:[a.jsx("div",{className:"ph-bgFallback"}),a.jsx("div",{className:"ph-topBar",children:a.jsxs("button",{className:"ph-topBtn",onClick:E,children:[a.jsx("span",{"aria-hidden":!0,children:"🪐"}),a.jsx("span",{children:"INDIverse"})]})}),a.jsx("div",{className:"ph-center",children:a.jsxs("div",{style:{opacity:.85},children:["Profile not found: ",c]})}),a.jsx(m0,{})]}):a.jsxs("div",{className:"ph-root",children:[T==="video"?a.jsx("video",{className:"ph-bgBlur",src:C,muted:!0,loop:!0,autoPlay:!0,playsInline:!0,preload:"metadata"}):T==="image"?a.jsx("img",{className:"ph-bgBlur",src:C,alt:""}):a.jsx("div",{className:"ph-bgFallback"}),T!=="none"&&a.jsxs("div",{className:"ph-portalWrap","aria-hidden":!0,children:[a.jsx("div",{className:`ph-portalRing ${w?"ph-portalEntering":""}`,children:T==="video"?a.jsx("video",{className:"ph-portalMedia",src:C,muted:!0,loop:!0,autoPlay:!0,playsInline:!0,preload:"metadata"}):a.jsx("img",{className:"ph-portalMedia",src:C,alt:""})}),a.jsx("div",{className:`ph-profileLabel ${w?"ph-profileLabelEntering":""}`,children:U})]}),a.jsx("div",{className:`ph-overlay ${w?"ph-overlayEntering":""}`}),a.jsx("div",{className:"ph-topBar",children:a.jsxs("button",{className:"ph-topBtn",onClick:E,children:[a.jsx("span",{"aria-hidden":!0,children:"🪐"}),a.jsx("span",{children:"INDIverse"})]})}),!b&&a.jsx("div",{className:"ph-enterLayer",style:{opacity:h,transition:"opacity 900ms ease"},children:a.jsx("div",{className:"ph-enterButtonWrapper",children:a.jsx("button",{className:"ph-enterButton",onClick:D,children:a.jsx("span",{className:"ph-enterText",children:"ENTER"})})})}),a.jsx(m0,{})]})}function m0(){return a.jsx("style",{children:`
      .ph-root{
        min-height: 100vh;
        background:#000;
        color:#fff;
        overflow:hidden;
        position:relative;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      }

      /* ✅ FULLSCREEN BLUR BACKGROUND */
      .ph-bgBlur{
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
        filter: blur(28px) saturate(1.08);
        transform: scale(1.12);
        opacity: 0.78;
        background: #000;
      }

      .ph-bgFallback{
        position: fixed;
        inset: 0;
        z-index: 0;
        background: #000;
      }

      /* ✅ PORTAL */
      .ph-portalWrap{
        position: fixed;
        inset: 0;
        z-index: 1;
        display:flex;
        flex-direction: column;
        align-items:center;
        justify-content:center;
        gap: 14px;
        pointer-events:none;
        padding: 18px;
      }

      .ph-portalRing{
        width: min(78vw, 560px);
        height: min(78vw, 560px);
        border-radius: 50%;
        padding: 6px;
        overflow:hidden;

        background: radial-gradient(
          circle at 30% 20%,
          rgba(255,255,255,0.20),
          rgba(255,255,255,0.05) 35%,
          rgba(0,0,0,0.0) 70%
        );

        border: 1px solid rgba(255,255,255,0.16);
        box-shadow:
          0 24px 60px rgba(0,0,0,0.55),
          0 0 40px rgba(0,255,255,0.10),
          inset 0 0 22px rgba(255,255,255,0.10);

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        /* ✅ subtle pulse */
        animation: phPulse 7.5s ease-in-out infinite;
        transform: translateZ(0);
      }

      @keyframes phPulse{
        0%   { transform: scale(1); }
        50%  { transform: scale(1.014); }
        100% { transform: scale(1); }
      }

      .ph-portalMedia{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display:block;
        background:#000;
      }

      /* ENTER "go through portal" */
      .ph-portalEntering{
        animation: none;
        transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), filter 820ms cubic-bezier(0.22, 1, 0.36, 1);
        transform: scale(1.22);
        filter: brightness(1.18) saturate(1.1);
      }

      .ph-profileLabel{
        text-align: center;
        font-weight: 800;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-size: 12px;
        color: rgba(229,231,235,0.88);
        text-shadow: 0 8px 24px rgba(0,0,0,0.6);
        user-select: none;
      }

      .ph-profileLabelEntering{
        transition: opacity 520ms ease;
        opacity: 0.0;
      }

      /* overlay */
      .ph-overlay{
        position: fixed;
        inset: 0;
        z-index: 2;
        background: linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.86));
        transition: opacity 820ms ease;
        opacity: 1;
      }

      .ph-overlayEntering{
        opacity: 0.82;
      }

      /* top bar */
      .ph-topBar{
        position: fixed;
        top: 16px;
        left: 16px;
        right: 16px;
        z-index: 6;
        display:flex;
        justify-content: space-between;
        pointer-events: none;
      }

      .ph-topBtn{
        pointer-events: auto;
        display:flex;
        align-items:center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(15,23,42,0.55);
        border: 1px solid rgba(148,163,184,0.35);
        color: #e5e7eb;
        cursor: pointer;
      }

      /* enter UI */
      .ph-enterLayer{
        position: relative;
        z-index: 5;
        min-height: 100vh;
        padding-top: 120px;
        padding-left: 20px;
        padding-right: 20px;
      }

      .ph-enterButtonWrapper{
        min-height: calc(100vh - 120px);
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding-bottom: 62px;
      }

      .ph-enterButton{
        width: 220px;
        border-radius: 999px;
        border: 1px solid rgba(148,163,184,0.35);
        background: rgba(2,6,23,0.55);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        padding: 16px 0;
        cursor:pointer;
        box-shadow: 0 18px 30px rgba(0,0,0,0.45);
        transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
      }

      .ph-enterButton:hover{
        border-color: rgba(0,255,255,0.35);
      }

      .ph-enterButton:active{
        transform: scale(0.98);
        opacity: 0.95;
      }

      .ph-enterText{
        display:block;
        text-align:center;
        color:#fff;
        font-weight: 800;
        font-size: 18px;
        letter-spacing: 1px;
      }

      .ph-center{
        position: relative;
        z-index: 5;
        min-height: 100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 24px;
      }

      /* mobile tuning */
      @media (max-width: 420px){
        .ph-portalRing{
          width: min(86vw, 520px);
          height: min(86vw, 520px);
        }
        .ph-enterButtonWrapper{ padding-bottom: 50px; }
      }

      /* reduce motion */
      @media (prefers-reduced-motion: reduce){
        .ph-portalRing{ animation: none; }
        .ph-portalEntering{ transition: none; transform: none; filter: none; }
        .ph-overlay{ transition: none; }
      }
    `})}const N1="https://montech-remote-config.s3.amazonaws.com/superapp/config.json",ut={bgFade:700,titleIn:1200,subIn:900,breatheUp:350,breatheDown:350,sceneFadeOut:650};function h0(i){return typeof i=="string"&&/^https?:\/\//i.test(i)}async function A1({url:i=N1,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function U1(i,o){return(Array.isArray(i?.profiles)?i.profiles:[]).find(u=>String(u?.key||"").trim()===String(o).trim())||null}function O1(i){const o=i?.assets?.introBgImageUrl;if(h0(o))return o;const c=i?.assets?.iconUrl;return h0(c)?c:null}function B1(){const i=_e(),{profileKey:o}=Fe(),c=o||"lamont",[u,f]=d.useState(null),[p,m]=d.useState(!0),b=d.useRef(null);d.useEffect(()=>{let N=!0;return m(!0),A1().then(L=>N&&f(L)).catch(L=>console.log("❌ remote config failed:",L?.message)).finally(()=>N&&m(!1)),()=>{N=!1}},[]);const x=d.useMemo(()=>U1(u,c),[u,c]),h=d.useMemo(()=>O1(x),[x]),S=x?.introTitle||"Welcome to my universe.",w=x?.introSubtitle||"I am ineffible.";return d.useEffect(()=>{const N=b.current;if(!N)return;N.classList.remove("us-animate"),N.offsetHeight,N.classList.add("us-animate");const L=ut.bgFade+ut.titleIn+ut.subIn+ut.breatheUp+ut.breatheDown+ut.sceneFadeOut,B=setTimeout(()=>{try{localStorage.setItem("profileKey",c)}catch{}i(`/world/${encodeURIComponent(c)}`)},L+40);return()=>clearTimeout(B)},[i,c,S,w,h]),!p&&!x?a.jsx("div",{style:{minHeight:"100vh",background:"#000",color:"#fff",display:"grid",placeItems:"center"},children:a.jsxs("div",{style:{opacity:.85},children:["Profile not found: ",c]})}):a.jsxs("div",{ref:b,className:"us-root",children:[a.jsx("div",{className:"us-bg",style:h?{backgroundImage:`url(${h})`}:void 0}),a.jsx("div",{className:"us-dim"}),a.jsx("div",{className:"us-blob us-blobA"}),a.jsx("div",{className:"us-blob us-blobB"}),a.jsx("div",{className:"us-blob us-blobC"}),a.jsxs("div",{className:"us-center",children:[a.jsx("div",{className:"us-title",children:S}),a.jsx("div",{className:"us-sub",children:w})]}),a.jsx("style",{children:`
        .us-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          overflow:hidden;
          position:relative;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          opacity: 1;
        }

        .us-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: none;
          z-index: 0;
          transform: translateZ(0);
        }

        .us-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          opacity: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.58), rgba(0,0,0,0.75));
        }

        .us-center{
          position: relative;
          z-index: 3;
          min-height: 100vh;
          display:flex;
          flex-direction: column;
          align-items:center;
          justify-content:center;
          padding: 0 24px;
          text-align:center;
        }

        .us-title{
          font-size: 28px;
          font-weight: 800;
          opacity: 0;
          transform: scale(0.985);
        }

        .us-sub{
          margin-top: 12px;
          color: #c9c9d4;
          font-size: 16px;
          opacity: 0;
          transform: translateY(6px);
        }

        /* blobs */
        .us-blob{
          position: fixed;
          border-radius: 999px;
          z-index: 2;
          filter: blur(0px);
          opacity: 0.22;
          pointer-events:none;
        }

        .us-blobA{
          width: 300px; height: 300px;
          top: -110px; left: -70px;
          background: radial-gradient(circle at 30% 20%, rgba(124,58,237,0.30), rgba(34,211,238,0.18));
          animation: blobFloatA 11s ease-in-out infinite;
        }

        .us-blobB{
          width: 220px; height: 220px;
          bottom: -90px; right: -30px;
          background: radial-gradient(circle at 30% 20%, rgba(34,211,238,0.22), rgba(124,58,237,0.14));
          opacity: 0.20;
          animation: blobFloatB 9.5s ease-in-out infinite;
        }

        .us-blobC{
          width: 200px; height: 200px;
          top: 160px; left: 58vw;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.10), rgba(124,58,237,0.10));
          opacity: 0.18;
          animation: blobFloatC 12s ease-in-out infinite;
        }

        @keyframes blobFloatA{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(10px,-18px) scale(1.02); }
          100%{ transform: translate(0,0) scale(1); }
        }
        @keyframes blobFloatB{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(-10px,-14px) scale(1.02); }
          100%{ transform: translate(0,0) scale(1); }
        }
        @keyframes blobFloatC{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(8px,-10px) scale(1.02); }
          100%{ transform: translate(0,0) scale(1); }
        }

        /* Animation sequence driven by CSS delays */
        .us-root.us-animate .us-dim{
          animation: usDimIn ${ut.bgFade}ms cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .us-root.us-animate .us-title{
          animation:
            usTitleIn ${ut.titleIn}ms cubic-bezier(0.22,1,0.36,1) forwards ${ut.bgFade}ms,
            usBreatheUp ${ut.breatheUp}ms cubic-bezier(0.22,1,0.36,1) forwards ${ut.bgFade+ut.titleIn+ut.subIn}ms,
            usBreatheDown ${ut.breatheDown}ms cubic-bezier(0.22,1,0.36,1) forwards ${ut.bgFade+ut.titleIn+ut.subIn+ut.breatheUp}ms;
        }

        .us-root.us-animate .us-sub{
          animation: usSubIn ${ut.subIn}ms cubic-bezier(0.22,1,0.36,1) forwards ${ut.bgFade+ut.titleIn}ms;
        }

        .us-root.us-animate{
          animation: usSceneOut ${ut.sceneFadeOut}ms ease-in-out forwards ${ut.bgFade+ut.titleIn+ut.subIn+ut.breatheUp+ut.breatheDown}ms;
        }

        @keyframes usDimIn{
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes usTitleIn{
          from { opacity: 0; transform: scale(0.985); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes usSubIn{
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes usBreatheUp{
          from { transform: scale(1); }
          to   { transform: scale(1.01); }
        }
        @keyframes usBreatheDown{
          from { transform: scale(1.01); }
          to   { transform: scale(1); }
        }
        @keyframes usSceneOut{
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce){
          .us-root.us-animate .us-dim,
          .us-root.us-animate .us-title,
          .us-root.us-animate .us-sub,
          .us-root.us-animate{
            animation: none !important;
          }
        }
      `})]})}const M1="https://montech-remote-config.s3.amazonaws.com/superapp/config.json",L1=[{key:"about",label:"About",ionicon:"person",to:"about",size:110,x:24,y:90},{key:"videos",label:"Videos",ionicon:"videocam",to:"videos",size:132,x:220,y:150},{key:"playlist",label:"Playlist",ionicon:"musical-notes",to:"playlist",size:118,x:24,y:280},{key:"music",label:"Music",ionicon:"radio",to:"music",size:118,x:210,y:280},{key:"fashion",label:"Fashion",ionicon:"shirt",to:"fashion",size:140,x:200,y:400},{key:"contact",label:"Connect",ionicon:"mail",to:"contact",size:110,x:40,y:460}],_1=[{key:"projects",label:"Projects",to:"projects"},{key:"energy",label:"Energy",to:"energy"},{key:"games",label:"Games",to:"games"}],qm="__MUNIVERSE__";function yu(i){return typeof i=="string"&&/^https?:\/\//i.test(i)}function xu(i){const o=typeof i=="string"?i.trim():"";return o||null}async function D1({url:i=M1,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function $1(i,o){return(Array.isArray(i?.profiles)?i.profiles:[]).find(u=>String(u?.key||"").trim()===String(o||"").trim())||null}function H1(i){const o=Array.isArray(i?.homeItems)&&i.homeItems.length?i.homeItems:L1,c=o.some(f=>f?.x!=null||f?.y!=null),u=f=>({portalKey:f?.portalKey||null,params:f?.params||null});if(!c){const f=[{x:.12,y:.18,size:120},{x:.64,y:.22,size:140},{x:.12,y:.48,size:128},{x:.64,y:.52,size:128},{x:.4,y:.74,size:116},{x:.14,y:.8,size:116}];return o.map((p,m)=>{const b=f[m%f.length];return{key:String(p.key??`item-${m}`),label:String(p.label??p.key??"Item"),ionicon:p.ionicon||p.icon||"ellipse",to:p.to?String(p.to):String(p.key),...u(p),size:Number(p.size??b.size),_rx:Number(p.x??b.x),_ry:Number(p.y??b.y),_layoutMode:"ratio"}})}return o.map((f,p)=>({key:String(f.key??`item-${p}`),label:String(f.label??f.key??"Item"),ionicon:f.ionicon||f.icon||"ellipse",to:f.to?String(f.to):String(f.key),...u(f),size:Number(f.size??118),x:Number(f.x??24),y:Number(f.y??90),_layoutMode:"px"}))}function I1(i){const c=(Array.isArray(i?.navTabs)&&i.navTabs.length?i.navTabs:_1).filter(Boolean).map((f,p)=>({key:String(f.key??`tab-${p}`),label:String(f.label??f.key??"Tab"),to:String(f.to??f.key??"")})).filter(f=>!!f.to);return c.some(f=>String(f.key).toLowerCase()==="muniverse"||String(f.to).toLowerCase()==="muniverse")||c.push({key:"muniverse",label:"indiVerse",to:qm}),c}function K1(){const[i,o]=d.useState(!1);return d.useEffect(()=>{const c=()=>{try{o(localStorage.getItem("auth:isAuthed")==="1")}catch{o(!1)}};return c(),window.addEventListener("focus",c),window.addEventListener("storage",c),()=>{window.removeEventListener("focus",c),window.removeEventListener("storage",c)}},[]),{isAuthed:i}}function q1(i=""){const o=String(i||"").trim().toLowerCase(),c={person:"👤","person-circle":"👤",people:"👥","musical-notes":"🎵",radio:"📻",list:"📃",hammer:"🛠️",chatbubbles:"💬",call:"📞",mail:"✉️",shirt:"👕",videocam:"🎬",heart:"❤️",sparkles:"✨",flower:"🌸",rose:"🌹",cart:"🛒",cash:"💵",images:"🖼️",camera:"📷",globe:"🌍",link:"🔗",play:"▶️"};return c[o]?c[o]:o.includes("person")?"👤":o.includes("people")?"👥":o.includes("musical")||o.includes("music")?"🎵":o.includes("video")?"🎬":o.includes("shirt")?"👕":o.includes("chat")?"💬":o.includes("call")?"📞":o.includes("mail")?"✉️":o.includes("image")?"🖼️":o.includes("camera")?"📷":o.includes("globe")?"🌍":o.includes("link")?"🔗":o.includes("play")?"▶️":"◉"}function W1(i,o,c){const u=o?.to||o?.key||"",f=String(u).trim().toLowerCase().replace(/\s+/g,"").replace(/[-_]/g,"");return["products","product","productscreen","shop","store"].includes(f)?{path:`/world/${i}/products`,state:{profileKey:i,bgUrl:c}}:["cart","cartscreen","checkout"].includes(f)?{path:`/world/${i}/cart?mode=products`,state:{profileKey:i,bgUrl:c}}:["flowerorders","flowerorder","flowers","flower","florals","floral","consultation","consultations","bookflowers","orderflowers"].includes(f)?{path:`/world/${i}/flowerorders`,state:{profileKey:i,bgUrl:c}}:["about","contact","videos","playlist","music","fashion","energy","games"].includes(f)?{path:`/world/${i}/${f}`,state:{profileKey:i,bgUrl:c}}:{path:`/world/${i}/${f}`,state:{profileKey:i,bgUrl:c}}}function G1(){const i=_e(),{profileKey:o}=Fe(),c=Ge(),u=(o||"lamont").toLowerCase(),{isAuthed:f}=K1(),[p,m]=d.useState(null),[b,x]=d.useState(!0),[h,S]=d.useState(!1),w=d.useRef(0),N=d.useRef(performance.now()),[,L]=d.useState(0),B=d.useRef(null),[U,C]=d.useState({w:0,h:0}),T=d.useRef(Object.create(null)),E=d.useRef(Object.create(null));d.useEffect(()=>{let R=!0;return x(!0),D1().then(H=>R&&m(H)).catch(H=>console.log("❌ remote config failed:",H?.message)).finally(()=>R&&x(!1)),()=>{R=!1}},[]);const D=d.useMemo(()=>$1(p,u),[p,u]),Q=d.useMemo(()=>{const R=xu(c?.state?.bgUrl),H=xu(D?.assets?.introBgImageUrl),v=xu(D?.assets?.iconUrl);return R&&yu(R)?R:H&&yu(H)?H:v&&yu(v)?v:null},[c?.state?.bgUrl,D]),q=Q,J=d.useMemo(()=>{const R=D?.worldTitle||D?.label||"INDIVERSE";return String(R).toUpperCase()},[D]),M=D?.tagline||"presence • style • energy",$=d.useMemo(()=>H1(D),[D]),W=d.useMemo(()=>I1(D),[D]),[F,V]=d.useState(W?.[0]?.label||"");d.useEffect(()=>{W?.length&&V(W[0].label)},[u,W]),d.useEffect(()=>{const R=B.current;if(!R)return;const H=new ResizeObserver(()=>{const k=R.getBoundingClientRect();C({w:k.width,h:k.height})});H.observe(R);const v=R.getBoundingClientRect();return C({w:v.width,h:v.height}),()=>H.disconnect()},[]),d.useEffect(()=>{const R=()=>{w.current=requestAnimationFrame(R),L(H=>(H+1)%6e5)};return w.current=requestAnimationFrame(R),()=>cancelAnimationFrame(w.current)},[]),d.useEffect(()=>()=>{const R=T.current;Object.keys(R).forEach(H=>{clearTimeout(R[H]),delete R[H]})},[u]);const A=d.useCallback(()=>{const R=`/world/${encodeURIComponent(u)}/chat`,H={profileKey:u,bgUrl:q};if(!f){i("/auth/login",{state:{profileKey:u,nextRoute:R,nextState:H}});return}i(R,{state:H})},[u,f,i,q]),Y=d.useCallback((R,H)=>{const v=`${String(R.key||H)}`;if(E.current[v])return;if(String(R.to||"").toLowerCase()==="linkportal"){i(`/portal/${encodeURIComponent(u)}/${encodeURIComponent(R.portalKey||"")}`,{state:{profileKey:u,bgUrl:q,...R.params||{}}});return}const{path:k,state:te}=W1(u,R,q);i(k,{state:{...te,...R.params||{}}})},[u,i,q]),ie=d.useCallback(R=>{if(V(R.label),R.to===qm){i("/");return}const H=String(R.to||R.key||"").trim().toLowerCase()||"main";i(`/world/${encodeURIComponent(u)}/${encodeURIComponent(H)}`,{state:{profileKey:u,bgUrl:q}})},[u,i,q]),O=R=>{const H=String(R.key||"").toLowerCase(),v=String(R.to||"").toLowerCase();return H==="contact"||v==="contact"},j=(R,H)=>{if(!O(R))return;const v=`${String(R.key||H)}`;E.current[v]=!1,!T.current[v]&&(T.current[v]=setTimeout(()=>{T.current[v]=null,E.current[v]=!0,i(`/world/${encodeURIComponent(u)}/owner/login`,{state:{profileKey:u,bgUrl:q},replace:!1})},3e3))},K=(R,H)=>{if(!O(R))return;const v=`${String(R.key||H)}`,k=T.current[v];k&&clearTimeout(k),delete T.current[v]},I=(R,H)=>{const k=(performance.now()-N.current)/1e3,te=6+H%5,X=6+(H+2)%5,le=Math.sin(k*(.35+H*.03))*te,ge=Math.cos(k*(.3+H*.025))*X;let de=24,ae=90;R._layoutMode==="ratio"?(de=Math.round((U.w||0)*(R._rx??.2)),ae=Math.round((U.h||0)*(R._ry??.2))):(de=R.x??24,ae=R.y??90);const pe=Number(R.size||118),ue=10,me=Math.max(ue,(U.w||0)-pe-ue),Ve=Math.max(ue,(U.h||0)-pe-ue),ht=Math.max(ue,Math.min(me,de)),et=Math.max(ue,Math.min(Ve,ae));return{width:pe,height:pe,left:ht,top:et,transform:`translate3d(${le}px, ${ge}px, 0)`}};return!b&&!D?a.jsxs("div",{className:"ms-root",children:[a.jsx("div",{className:"ms-bgFallback"}),a.jsxs("div",{className:"ms-center",style:{zIndex:3},children:[a.jsxs("div",{style:{opacity:.85},children:["Profile not found: ",u]}),a.jsx("button",{className:"ms-ghostBtn",onClick:()=>i("/"),children:"← Back to indiVerse"})]}),a.jsx(b0,{})]}):a.jsxs("div",{className:"ms-root",children:[a.jsx("div",{className:"ms-bg",style:Q?{backgroundImage:`url(${Q})`}:void 0}),a.jsx("div",{className:"ms-dim"}),a.jsxs("div",{className:`ms-content ${h?"ms-contentIn":""}`,children:[a.jsxs("div",{className:"ms-headerWrap",children:[a.jsxs("div",{className:"ms-headerRow",children:[a.jsx("div",{className:"ms-title",children:J}),a.jsxs("button",{className:"ms-messagePill",onClick:A,children:[a.jsx("span",{className:"ms-pillIcon","aria-hidden":!0,children:"💬"}),a.jsx("span",{className:"ms-messageText",children:"Message me"})]})]}),a.jsx("div",{className:"ms-tagline",children:M})]}),a.jsx("div",{className:"ms-field",ref:B,children:$.map((R,H)=>a.jsx("button",{className:"ms-bubbleWrap",style:I(R,H),onMouseDown:()=>j(R,H),onMouseUp:()=>K(R,H),onMouseLeave:()=>K(R,H),onTouchStart:()=>j(R,H),onTouchEnd:()=>K(R,H),onTouchCancel:()=>K(R,H),onClick:()=>Y(R,H),title:R.label,children:a.jsxs("div",{className:"ms-bubble",children:[a.jsx("div",{className:"ms-bubbleShine"}),a.jsxs("div",{className:"ms-bubbleInner",children:[a.jsx("div",{className:"ms-bubbleIcon","aria-hidden":!0,children:q1(R.ionicon)}),a.jsx("div",{className:"ms-bubbleLabel",children:R.label})]})]})},`${R.key}-${H}`))}),a.jsx("div",{className:"ms-bottomNavHint",children:a.jsx("div",{className:"ms-navPill",children:W.map(R=>a.jsx("button",{className:`ms-navItem ${F===R.label?"ms-navItemActive":""}`,onClick:()=>ie(R),children:a.jsx("span",{className:`ms-navText ${F===R.label?"ms-navTextActive":"ms-navTextDim"}`,children:R.label})},R.key))})})]}),Q?a.jsx("img",{src:Q,alt:"",style:{display:"none"},onLoad:()=>S(!0),onError:()=>S(!0)}):a.jsx("span",{style:{display:"none"},children:h||S(!0)}),a.jsx(b0,{})]})}function b0(){return a.jsx("style",{children:`
      .ms-root{
        min-height: 100vh;
        background:#000;
        color:#fff;
        overflow:hidden;
        position:relative;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      .ms-bg{
        position: fixed;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
        transform: translateZ(0);
      }
      .ms-bgFallback{
        position: fixed;
        inset: 0;
        z-index: 0;
        background: #000;
      }
      .ms-dim{
        position: fixed;
        inset: 0;
        z-index: 1;
        background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.75));
      }
      .ms-content{
        position: relative;
        z-index: 2;
        min-height: 100vh;
        opacity: 0;
        transition: opacity 800ms ease;
      }
      .ms-contentIn{ opacity: 1; }
      .ms-headerWrap{
        padding-top: 64px;
        padding-left: 22px;
        padding-right: 22px;
      }
      .ms-headerRow{
        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 12px;
      }
      .ms-title{
        font-size: 42px;
        font-weight: 800;
        letter-spacing: 4px;
        color: #fff;
        line-height: 1;
      }
      .ms-tagline{
        margin-top: 6px;
        color: #cfd3dc;
        letter-spacing: 1px;
        font-size: 13px;
        text-transform: uppercase;
      }
      .ms-messagePill{
        display:flex;
        align-items:center;
        gap: 8px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.72);
        color:#000;
        padding: 8px 12px;
        cursor:pointer;
        font-weight: 800;
        font-size: 12px;
        letter-spacing: 0.8px;
        box-shadow: 0 18px 28px rgba(0,0,0,0.35);
        transition: transform 120ms ease, opacity 120ms ease;
      }
      .ms-messagePill:active{ transform: scale(0.98); opacity: 0.92; }
      .ms-field{
        position: relative;
        height: calc(100vh - 220px);
        min-height: 420px;
        margin-top: 8px;
      }
      .ms-bubbleWrap{
        position: absolute;
        border: none;
        background: transparent;
        padding: 0;
        border-radius: 999px;
        cursor: pointer;
        will-change: transform;
      }
      .ms-bubble{
        width: 100%;
        height: 100%;
        border-radius: 999px;
        overflow:hidden;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 18px 40px rgba(0,0,0,0.40);
        transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
      }
      .ms-bubbleWrap:active .ms-bubble{
        transform: scale(0.97);
        opacity: 0.95;
        border-color: rgba(0,255,255,0.20);
      }
      .ms-bubbleShine{
        position:absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 70%);
        pointer-events:none;
      }
      .ms-bubbleInner{
        height: 100%;
        display:flex;
        flex-direction: column;
        align-items:center;
        justify-content:center;
        gap: 6px;
      }
      .ms-bubbleIcon{
        font-size: 28px;
        filter: drop-shadow(0 8px 18px rgba(0,0,0,0.35));
      }
      .ms-bubbleLabel{
        color:#fff;
        font-weight: 700;
        letter-spacing: 0.6px;
        font-size: 13px;
        text-shadow: 0 10px 22px rgba(0,0,0,0.5);
      }
      .ms-bottomNavHint{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 18px;
        z-index: 3;
        display:flex;
        justify-content:center;
        padding: 0 16px;
      }
      .ms-navPill{
        display:flex;
        gap: 10px;
        padding: 10px 16px;
        border-radius: 999px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .ms-navItem{
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 999px;
      }
      .ms-navItemActive{
        background: rgba(255,255,255,0.08);
      }
      .ms-navText{
        font-weight: 700;
        letter-spacing: 0.8px;
        font-size: 12px;
      }
      .ms-navTextActive{ color: #fff; }
      .ms-navTextDim{ color: #cfd3dc; }
      .ms-ghostBtn{
        margin-top: 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(2,6,23,0.55);
        color: #e5e7eb;
        padding: 10px 14px;
        cursor:pointer;
      }
      .ms-center{
        position: relative;
        z-index: 3;
        min-height: 100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction: column;
        padding: 24px;
        text-align: center;
      }
      @media (max-width: 420px){
        .ms-title{ font-size: 34px; }
        .ms-field{ height: calc(100vh - 240px); }
      }
      @media (prefers-reduced-motion: reduce){
        .ms-bubbleWrap{ transform: none !important; }
        .ms-content{ transition: none; }
      }
    `})}function Y1(i){return String(i||"").trim().toLowerCase()}function ir(i){return String(i||"").trim()}function F1(){return"https://indiverse-backend.onrender.com".trim().replace(/\/+$/,"")||""}async function V1(i,{headers:o={},body:c}={}){const u=`${F1()}${i}`,f=await fetch(u,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","Cache-Control":"no-cache",Pragma:"no-cache",...o},body:c,credentials:"include"}),p=await f.text().catch(()=>"");let m=null;try{m=p?JSON.parse(p):null}catch{m=null}if(!f.ok){const b=m?.error||m?.message||(p?p.slice(0,240):"")||`Request failed (${f.status})`;throw new Error(b)}return m||{}}function X1(){const i=_e(),o=Ge(),{profileKey:c}=Fe(),u=d.useMemo(()=>Y1(c)||"lamont",[c]),f=d.useMemo(()=>{const F=o?.state?.bgUrl,V=typeof F=="string"?F.trim():"";return/^https?:\/\//i.test(V)?V:null},[o?.state?.bgUrl]),[p,m]=d.useState(""),[b,x]=d.useState(""),[h,S]=d.useState(""),[w,N]=d.useState(""),[L,B]=d.useState(""),[U,C]=d.useState(""),[T,E]=d.useState(""),[D,Q]=d.useState(!1),[q,J]=d.useState(null),M=o?.state?.presetArrangement||null;d.useEffect(()=>{if(!M)return;const F=M.quantity||1,V=M.name||"Custom arrangement";C(A=>A||String(V)),E(A=>A||`Requested quantity: ${F}

`)},[M]);const $=d.useCallback(F=>{J(String(F||"")),window.clearTimeout($._t),$._t=window.setTimeout(()=>J(null),2600)},[]);d.useEffect(()=>()=>window.clearTimeout($._t),[]);const W=d.useCallback(async()=>{const F=ir(p),V=ir(b),A=ir(U);if(!F||!V||!A){$("Name, phone, and floral needs are required.");return}try{Q(!0),await V1("/api/flowers/orders",{headers:{"x-profile-key":String(u)},body:JSON.stringify({name:F,phone:V,occasion:ir(h)||null,deliveryDate:ir(w)||null,deliveryAddress:ir(L)||null,bouquetType:A,notes:ir(T)||null})}),$("Inquiry sent 🌹 I’ll follow up soon."),m(""),x(""),S(""),N(""),B(""),C(""),E("")}catch(Y){$(Y?.message||"Something went wrong submitting your inquiry.")}finally{Q(!1)}},[p,b,U,h,w,L,T,u,$]);return a.jsxs("div",{className:"fo-root",children:[a.jsx("div",{className:"fo-bg",style:f?{backgroundImage:`url(${f})`}:void 0}),a.jsx("div",{className:"fo-dim"}),a.jsxs("div",{className:"fo-shell",children:[a.jsxs("div",{className:"fo-top",children:[a.jsx("button",{className:"fo-back",onClick:()=>i(-1),"aria-label":"Back",children:"‹"}),a.jsxs("div",{className:"fo-topCenter",children:[a.jsxs("div",{className:"fo-titleRow",children:[a.jsx("span",{className:"fo-flower","aria-hidden":!0,children:"🌹"}),a.jsx("div",{className:"fo-title",children:"Floral Consultation"})]}),a.jsx("div",{className:"fo-sub",children:"events • occasions • bespoke arrangements"})]}),a.jsx("div",{className:"fo-spacer"})]}),a.jsx("div",{className:"fo-card",children:a.jsxs("div",{className:"fo-cardInner",children:[a.jsx("div",{className:"fo-cardTitle",children:"Share a few details about your florals"}),a.jsx("div",{className:"fo-cardHint",children:"I’ll review your inquiry and reach out personally to confirm details, availability, and pricing."}),a.jsxs("div",{className:"fo-grid",children:[a.jsx(lr,{label:"Name *",children:a.jsx("input",{value:p,onChange:F=>m(F.target.value),placeholder:"Full name or contact name"})}),a.jsx(lr,{label:"Phone *",children:a.jsx("input",{value:b,onChange:F=>x(F.target.value),placeholder:"Best number for consultation",inputMode:"tel"})}),a.jsx(lr,{label:"Occasion",children:a.jsx("input",{value:h,onChange:F=>S(F.target.value),placeholder:"Wedding, celebration, corporate event, private dinner..."})}),a.jsx(lr,{label:"Event / delivery date",children:a.jsx("input",{value:w,onChange:F=>N(F.target.value),placeholder:"MM/DD or date range"})}),a.jsx(lr,{label:"Location",wide:!0,children:a.jsx("textarea",{value:L,onChange:F=>B(F.target.value),placeholder:"Venue, city, or delivery address",rows:2})}),a.jsx(lr,{label:"Floral needs *",wide:!0,children:a.jsx("textarea",{value:U,onChange:F=>C(F.target.value),placeholder:"Bridal bouquet, tablescapes, ceremony florals, installations, gifting, etc.",rows:2})}),a.jsx(lr,{label:"Additional details",wide:!0,children:a.jsx("textarea",{value:T,onChange:F=>E(F.target.value),placeholder:"Color palette, inspiration, guest count, budget range, or any design notes.",rows:4})})]}),a.jsx("button",{className:"fo-submit",onClick:W,disabled:D,children:a.jsx("span",{className:"fo-submitInner",children:D?"Sending...":"Submit consultation request"})}),a.jsxs("div",{className:"fo-small",children:[M?a.jsxs("span",{children:["Prefilled from arrangement: ",a.jsx("b",{children:String(M?.name||"")})]}):a.jsx("span",{}),a.jsxs("span",{className:"fo-smallRight",children:["profileKey: ",u]})]})]})})]}),q?a.jsx("div",{className:"fo-toast",children:q}):null,a.jsx("style",{children:`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.18);
          --ink: #05060b;
          --rose1: #ff4b5c;
          --rose2: #ff7b88;
        }

        .fo-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }
        .fo-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
          transform: translateZ(0);
        }
        .fo-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 22% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.90));
        }

        .fo-shell{
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 0 auto;
          padding: 22px 18px 40px;
        }

        .fo-top{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          padding-top: 14px;
        }
        .fo-back{
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          font-size: 22px;
          font-weight: 900;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .fo-back:hover{ border-color: var(--stroke2); }
        .fo-back:active{ transform: scale(0.98); opacity: 0.92; }

        .fo-topCenter{
          flex: 1;
          min-width: 0;
          display:flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .fo-titleRow{
          display:flex;
          align-items:center;
          gap: 10px;
        }
        .fo-flower{ font-size: 20px; }
        .fo-title{
          font-size: 28px;
          font-weight: 950;
          letter-spacing: 0.8px;
          line-height: 1.06;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .fo-sub{
          margin-top: 6px;
          color: rgba(255,255,255,0.75);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .fo-spacer{ width: 40px; }

        .fo-card{
          margin-top: 18px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 54px rgba(0,0,0,0.45);
          overflow:hidden;
        }
        .fo-cardInner{
          padding: 18px 18px 16px;
        }
        .fo-cardTitle{
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .fo-cardHint{
          margin-top: 8px;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          line-height: 1.35;
        }

        .fo-grid{
          margin-top: 14px;
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .fo-field{
          display:flex;
          flex-direction: column;
          gap: 6px;
        }
        .fo-fieldWide{ grid-column: 1 / -1; }

        .fo-label{
          color: rgba(255,255,255,0.78);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .fo-field input,
        .fo-field textarea{
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 10px 12px;
          color: #fff;
          font-size: 14px;
          background: rgba(0,0,0,0.45);
          outline: none;
          resize: vertical;
        }
        .fo-field input::placeholder,
        .fo-field textarea::placeholder{
          color: rgba(154,160,178,0.92);
        }
        .fo-field input:focus,
        .fo-field textarea:focus{
          border-color: rgba(255,255,255,0.28);
        }

        .fo-submit{
          margin-top: 16px;
          width: 100%;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          padding: 0;
          overflow:hidden;
          box-shadow: 0 18px 40px rgba(0,0,0,0.35);
          opacity: 1;
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .fo-submit:active{ transform: scale(0.99); opacity: 0.94; }
        .fo-submit:disabled{ opacity: 0.6; cursor: not-allowed; }
        .fo-submitInner{
          display:flex;
          align-items:center;
          justify-content:center;
          height: 48px;
          background: linear-gradient(90deg, var(--rose1), var(--rose2));
          color:#fff;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 13px;
        }

        .fo-small{
          margin-top: 12px;
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 10px;
          color: rgba(255,255,255,0.55);
          font-size: 11px;
        }
        .fo-smallRight{ opacity: 0.85; }

        .fo-toast{
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 18px;
          z-index: 99;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.70);
          color: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 60px rgba(0,0,0,0.55);
          max-width: min(720px, calc(100% - 28px));
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        @media (max-width: 820px){
          .fo-grid{ grid-template-columns: 1fr; }
          .fo-title{ font-size: 24px; }
        }
        @media (prefers-reduced-motion: reduce){
          .fo-back, .fo-submit{ transition: none; }
        }
      `})]})}function lr({label:i,children:o,wide:c=!1}){return a.jsxs("div",{className:`fo-field ${c?"fo-fieldWide":""}`,children:[a.jsx("div",{className:"fo-label",children:i}),o]})}const y0=`
Hey — welcome to IndiVerse.

This creator hasn’t added an About section yet.
But you can still explore what’s live right now: music, products, and updates.

Want to reach them directly?
Send a message and you’ll get a response when they’re available.
`;function x0(i){return String(i||"").trim().toLowerCase()}function v0(i){const o=x0(i);if(o)return o;try{const c=x0(localStorage.getItem("profileKey"));if(c)return c}catch{}return"lamont"}function Q1(i){return typeof i=="string"&&/^https?:\/\//i.test(i.trim())}async function P1(i,{profileKey:o}={}){const u=`${"https://indiverse-backend.onrender.com".replace(/\/+$/,"")}${i}`,f=await fetch(u,{method:"GET",headers:{Accept:"application/json",...o?{"x-profile-key":o}:{},"Cache-Control":"no-cache",Pragma:"no-cache"},credentials:"include"});if(!f.ok){const p=await f.text().catch(()=>"");throw new Error(`GET ${i} failed (${f.status}): ${p||f.statusText}`)}return f.json()}function Z1(){const i=_e(),{profileKey:o}=Fe(),c=Ge(),u=d.useMemo(()=>{const A=c?.state?.bgUrl,Y=typeof A=="string"?A.trim():"";return Q1(Y)?Y:null},[c?.state?.bgUrl]),[f,p]=d.useState(()=>v0(o)),m=d.useMemo(()=>{const A=f||"owner";return A==="lamont"?"Lamont":A.charAt(0).toUpperCase()+A.slice(1)},[f]),[b,x]=d.useState(""),[h,S]=d.useState(""),[w,N]=d.useState(!1),[L,B]=d.useState(!1),[U,C]=d.useState(!1),[T,E]=d.useState(null),[D,Q]=d.useState(""),q=d.useRef(null),J=d.useRef(null),M=d.useCallback(()=>{J.current&&(clearInterval(J.current),J.current=null)},[]);d.useEffect(()=>{const A=v0(o);p(A);try{localStorage.setItem("profileKey",A)}catch{}},[o]);const $=d.useCallback(async(A="load")=>{M(),N(!1),B(!0),Q("");try{try{localStorage.setItem("profileKey",String(f))}catch{}const Y=Date.now(),ie=await P1(`/api/about?ts=${Y}`,{profileKey:f}),O=typeof ie?.bio=="string"?ie.bio:"",j=ie?.updatedAt||null;console.log("[AboutPage] fetched",{reason:A,profileKey:f,bioLen:O.length,updatedAt:j}),E(j),x(O||y0)}catch(Y){const ie=String(Y?.message||"");console.warn("[AboutPage] load error:",ie||Y),E(null),x(y0),ie.includes("(404)")?Q("About not set yet (API 404)."):ie.includes("(401)")||ie.includes("(403)")?Q("Not authorized (profileKey/auth)."):Q(ie||"Failed to load")}finally{B(!1)}},[f,M]);d.useEffect(()=>{$("mount/route")},[c.key,f]),d.useEffect(()=>{const A=()=>$("windowFocus"),Y=()=>{document.visibilityState==="visible"&&$("visibility")};return window.addEventListener("focus",A),document.addEventListener("visibilitychange",Y),()=>{window.removeEventListener("focus",A),document.removeEventListener("visibilitychange",Y)}},[$]),d.useEffect(()=>{if(!b)return;M(),S(""),N(!1);const A=18;let Y=0;return J.current=setInterval(()=>{if(Y+=1,Y>=b.length){M(),S(b),N(!0);return}S(b.slice(0,Y))},A),()=>M()},[b,M]),d.useEffect(()=>{const A=q.current;if(!A)return;const Y=window.setTimeout(()=>{A.scrollTop=A.scrollHeight},30);return()=>window.clearTimeout(Y)},[h]);const W=d.useMemo(()=>{if(!T)return"";try{return new Date(T).toLocaleString()}catch{return String(T)}},[T]),F=d.useCallback(async()=>{C(!0),await $("manualRefresh"),C(!1)},[$]),V=d.useCallback(()=>{i(`/world/${encodeURIComponent(f)}`)},[f,i]);return a.jsxs("div",{className:"ap-root",children:[a.jsx("div",{className:"ap-bg",style:u?{backgroundImage:`url(${u})`,backgroundSize:"cover",backgroundPosition:"center"}:void 0}),a.jsx("div",{className:"ap-vignette"}),a.jsx("div",{className:"ap-noise"}),a.jsxs("div",{className:"ap-shell",children:[a.jsxs("header",{className:"ap-header",children:[a.jsxs("div",{className:"ap-headLeft",children:[a.jsxs("div",{className:"ap-titleRow",children:[a.jsxs("h1",{className:"ap-title",children:["About ",m]}),a.jsx("span",{className:"ap-dot"}),a.jsx("div",{className:"ap-subtitle",children:"presence • style • energy"})]}),a.jsxs("div",{className:"ap-metaRow",children:[W?a.jsxs("div",{className:"ap-meta",children:["Updated: ",W]}):a.jsx("div",{className:"ap-meta ap-metaDim",children:"—"}),L?a.jsx("span",{className:"ap-pill ap-pillInfo",children:"Fetching…"}):null,U?a.jsx("span",{className:"ap-pill ap-pillInfo",children:"Refreshing…"}):null,D?a.jsx("span",{className:"ap-pill ap-pillWarn",children:D}):null]})]}),a.jsxs("div",{className:"ap-actions",children:[a.jsx("button",{className:"ap-iconBtn",onClick:F,disabled:L||U,title:"Refresh","aria-label":"Refresh",children:"⟳"}),a.jsx("button",{className:"ap-iconBtn",onClick:V,title:"Back to World","aria-label":"Back to World",children:"←"}),a.jsx("button",{className:"ap-iconBtn",onClick:()=>i(-1),title:"Close","aria-label":"Close",children:"✕"})]})]}),a.jsxs("main",{className:"ap-main",children:[a.jsxs("div",{className:"ap-card",children:[a.jsx("div",{className:"ap-cardGlow"}),a.jsx("div",{className:"ap-cardEdge"}),a.jsx("div",{className:"ap-scroll",ref:q,children:a.jsxs("pre",{className:"ap-body",children:[h||(L?"Loading…":""),!w&&a.jsx("span",{className:"ap-cursor blink-cursor",children:"|"})]})})]}),a.jsx("div",{className:"ap-hint",children:"Tip: switch tabs and come back — this page refetches automatically."})]})]}),a.jsx("style",{children:`
        .ap-root{
          min-height:100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .ap-bg{
          position:fixed;
          inset:0;
          z-index:0;
          transform: translateZ(0);
          /* default background if no image provided */
          background:
            radial-gradient(1200px 700px at 22% 12%, rgba(255,255,255,0.08), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 18%, rgba(34,197,94,0.10), rgba(0,0,0,0) 60%),
            radial-gradient(1100px 800px at 50% 80%, rgba(0,255,255,0.08), rgba(0,0,0,0) 62%),
            linear-gradient(180deg, rgba(0,0,0,0.58), rgba(0,0,0,0.92));
          background-repeat:no-repeat;
          background-size:cover;
          background-position:center;
          filter: saturate(1.05) contrast(1.05);
        }

        /* Vignette + dim on top of image */
        .ap-vignette{
          position:fixed;
          inset:0;
          z-index:1;
          pointer-events:none;
          background:
            radial-gradient(1200px 900px at 50% 18%, rgba(0,0,0,0.18), rgba(0,0,0,0.62) 62%),
            linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0.86));
        }

        .ap-noise{
          position:fixed;
          inset:0;
          z-index:2;
          pointer-events:none;
          opacity:0.08;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        .ap-shell{
          position:relative;
          z-index:3;
          max-width: 1040px;
          margin: 0 auto;
          padding: 28px 18px 34px;
        }

        .ap-header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:14px;
          padding-top: 10px;
        }

        .ap-titleRow{
          display:flex;
          align-items:baseline;
          gap:10px;
          flex-wrap:wrap;
        }

        .ap-title{
          margin:0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.6px;
          line-height: 1.1;
        }

        .ap-dot{
          width:7px; height:7px;
          border-radius:999px;
          background: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }

        .ap-subtitle{
          color:#cfd3dc;
          font-size: 12px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          opacity: 0.95;
        }

        .ap-metaRow{
          margin-top: 10px;
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
        }

        .ap-meta{
          color:#94a3b8;
          font-size: 12px;
          letter-spacing: 0.2px;
        }
        .ap-metaDim{ opacity: 0.6; }

        .ap-pill{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.4px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          max-width: min(72vw, 720px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ap-pillInfo{ color:#e5e7eb; }
        .ap-pillWarn{
          color:#fecaca;
          border-color: rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.10);
        }

        .ap-actions{
          display:flex;
          align-items:center;
          gap:10px;
          padding-top: 2px;
        }

        .ap-iconBtn{
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          color:#fff;
          cursor:pointer;
          display:grid;
          place-items:center;
          box-shadow: 0 18px 40px rgba(0,0,0,0.35);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          font-weight: 900;
        }
        .ap-iconBtn:hover{ border-color: rgba(0,255,255,0.20); }
        .ap-iconBtn:active{ transform: scale(0.97); opacity: 0.92; }
        .ap-iconBtn:disabled{ opacity: 0.55; cursor: not-allowed; }

        .ap-main{
          margin-top: 18px;
        }

        .ap-card{
          position:relative;
          border-radius: 22px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 28px 70px rgba(0,0,0,0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .ap-cardGlow{
          position:absolute;
          inset:-1px;
          background:
            radial-gradient(600px 280px at 30% 18%, rgba(255,255,255,0.12), rgba(0,0,0,0) 62%),
            radial-gradient(520px 260px at 78% 24%, rgba(34,197,94,0.10), rgba(0,0,0,0) 64%),
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
          pointer-events:none;
        }

        .ap-cardEdge{
          position:absolute;
          inset:0;
          pointer-events:none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }

        .ap-scroll{
          position:relative;
          max-height: min(68vh, 680px);
          overflow:auto;
          padding: 18px 18px 20px;
        }

        .ap-body{
          margin:0;
          white-space: pre-wrap;
          word-break: break-word;
          color:#f9fafb;
          font-size: 14px;
          line-height: 22px;
          letter-spacing: 0.25px;
          font-weight: 450;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
        }

        .ap-cursor{ color:#22c55e; font-weight: 900; }

        .ap-hint{
          margin-top: 10px;
          color:#94a3b8;
          font-size: 11px;
          letter-spacing: 0.2px;
          opacity: 0.9;
        }

        .blink-cursor{ animation: blink 0.9s infinite; }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        @media (max-width: 520px){
          .ap-title{ font-size: 22px; }
          .ap-shell{ padding: 20px 14px 28px; }
          .ap-iconBtn{ width: 38px; height: 38px; }
          .ap-scroll{ padding: 16px; }
        }

        @media (prefers-reduced-motion: reduce){
          .blink-cursor{ animation:none; }
        }
      `})]})}const J1="https://images.unsplash.com/photo-1520975682071-a4a3a8a92dd7?auto=format&fit=crop&w=1600&q=60";function w0(i){return String(i||"").trim().toLowerCase()}function e5(i){const o=w0(i);if(o)return o;try{const c=w0(localStorage.getItem("profileKey"));if(c)return c}catch{}return"lamont"}function S0(i){return String(i||"").trim().split(/\s+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" ")}function Wm(i){return String(i||"").replace(/[^\d]/g,"")}function t5(i){return/\S+\s+\S+/.test(String(i||"").trim())}function n5(i){return Wm(i).length>=10}function j0(i){const o=Wm(i);if(o.length<10)return i;const c=o.slice(0,3),u=o.slice(3,6),f=o.slice(6,10);return`(${c}) ${u}-${f}${o.length>10?` +${o.slice(10)}`:""}`}async function a5(i,{profileKey:o,method:c="GET",body:u}={}){const p=`${"https://indiverse-backend.onrender.com".replace(/\/+$/,"")}${i}`,m=await fetch(p,{method:c,headers:{Accept:"application/json",...c!=="GET"?{"Content-Type":"application/json"}:{},...o?{"x-profile-key":o}:{},"Cache-Control":"no-cache",Pragma:"no-cache"},credentials:"include",...u?{body:JSON.stringify(u)}:{}}),b=await m.text().catch(()=>""),x=b?(()=>{try{return JSON.parse(b)}catch{return null}})():null;if(!m.ok){const h=x?.message||x?.error||(b&&b.length<220?b:"")||m.statusText;throw new Error(`${c} ${i} failed (${m.status}): ${h||"Request failed"}`)}return x??{}}function Eo({role:i,children:o}){const c=i==="ai";return a.jsx("div",{style:{display:"flex",justifyContent:c?"flex-start":"flex-end",margin:"10px 0"},children:a.jsx("div",{style:{maxWidth:"82%",borderRadius:18,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.14)",background:c?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",boxShadow:"0 12px 30px rgba(0,0,0,0.35)",lineHeight:"20px",whiteSpace:"pre-wrap"},children:o})})}function Kt({children:i,onClick:o,variant:c="ghost",disabled:u,title:f}){const p={base:{borderRadius:999,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.16)",cursor:u?"not-allowed":"pointer",opacity:u?.6:1,fontWeight:800,letterSpacing:.6,fontSize:12,display:"inline-flex",alignItems:"center",gap:8,userSelect:"none"},ghost:{background:"rgba(255,255,255,0.08)",color:"#fff"},primary:{background:"rgba(255,255,255,0.85)",color:"#000",border:"1px solid rgba(255,255,255,0.24)"},danger:{background:"rgba(239,68,68,0.14)",color:"#fecaca",border:"1px solid rgba(239,68,68,0.25)"}};return a.jsx("button",{title:f,onClick:u?void 0:o,style:{...p.base,...c==="primary"?p.primary:c==="danger"?p.danger:p.ghost},children:i})}function r5(){const i=_e(),{profileKey:o}=Fe(),c=Ge(),u=d.useMemo(()=>e5(o),[o]);d.useEffect(()=>{try{localStorage.setItem("profileKey",u)}catch{}},[u]);const f=d.useMemo(()=>{const ue=c?.state?.bgUrl,me=typeof ue=="string"?ue.trim():"";return me||J1},[c?.state?.bgUrl]),p=d.useMemo(()=>{const ue=u||"owner";return ue==="lamont"?"Lamont":ue.charAt(0).toUpperCase()+ue.slice(1)},[u]),[m,b]=d.useState(""),[x,h]=d.useState(""),[S,w]=d.useState(""),[N,L]=d.useState(""),[B,U]=d.useState(""),[C,T]=d.useState(""),[E,D]=d.useState(""),[Q,q]=d.useState(()=>c?.state?.mode==="connect"),[J,M]=d.useState(0),[$,W]=d.useState(""),[F,V]=d.useState(!1),[A,Y]=d.useState(""),ie=d.useRef(null),O=d.useRef(null);d.useEffect(()=>()=>{C&&URL.revokeObjectURL(C)},[C]);const j=d.useMemo(()=>{const ue=[{role:"ai",text:`Hey — I’m ${p}’s assistant.`},{role:"ai",text:`Add anyone you want. Or connect yourself so ${p} recognizes you.`}];return!m&&!x?(ue.push({role:"ai",text:"Who are we adding? Enter first and last name."}),ue):(ue.push({role:"user",text:`${m} ${x}`.trim()}),S?(ue.push({role:"user",text:j0(S)}),J===2&&!N||(ue.push({role:"user",text:N||"(No address)"}),J===3&&!B)||(ue.push({role:"user",text:B||"(No note)"}),J<5)||(ue.push({role:"user",text:C?"(Selfie added)":"(No selfie)"}),ue.push({role:"ai",text:"Confirm the details below."})),ue):(ue.push({role:"ai",text:"Got it — what’s their phone number?"}),ue))},[p,m,x,S,N,B,C,J]);d.useEffect(()=>{const ue=ie.current;if(!ue)return;const me=window.setTimeout(()=>{ue.scrollTop=ue.scrollHeight},30);return()=>window.clearTimeout(me)},[j,J]);const K=d.useCallback(()=>{if(Y(""),!t5($)){Y("Please enter first and last name.");return}const ue=$.trim().split(/\s+/),me=S0(ue[0]),Ve=S0(ue.slice(1).join(" "));b(me),h(Ve),W(""),M(1)},[$]),I=d.useCallback(()=>{if(Y(""),!n5($)){Y("Please enter a valid phone number (10+ digits).");return}w($.trim()),W(""),M(2)},[$]),R=d.useCallback(()=>{Y(""),$.trim()&&L($.trim()),W(""),M(3)},[$]),H=d.useCallback(()=>{Y(""),L(""),W(""),M(3)},[]),v=d.useCallback(()=>{Y(""),$.trim()&&U($.trim()),W(""),M(4)},[$]),k=d.useCallback(()=>{Y(""),U(""),W(""),M(4)},[]),te=d.useCallback(()=>{Y(""),O.current?.click?.()},[]),X=d.useCallback(ue=>{const me=ue?.target?.files?.[0];if(!me)return;try{C&&URL.revokeObjectURL(C)}catch{}const Ve=URL.createObjectURL(me);T(Ve),D(me.name||"selfie.jpg"),M(5)},[C]),le=d.useCallback(()=>{if(Y(""),C)try{URL.revokeObjectURL(C)}catch{}T(""),D(""),M(5)},[C]),ge=d.useCallback(ue=>{Y(""),M(ue),W("");const me=ie.current;me&&(me.scrollTop=me.scrollHeight)},[]),de=d.useCallback(async()=>{if(Y(""),!m||!x||!S){Y("Missing required fields: name + phone.");return}try{V(!0);const Ve=(await a5("/api/contacts",{profileKey:u,method:"POST",body:{firstName:m,lastName:x,phone:S,address:N||"",note:B||"",selfieUrl:C||""}}))?.contact||null,ht=Ve?._id||Ve?.id||null,et=Ve?.phone||S;if(!ht)throw new Error("Contact created but missing contact._id in response.");if(Q)try{localStorage.setItem(`chatContactId:${u}`,String(ht)),localStorage.setItem(`chatPhone:${u}`,String(et))}catch{}Y(""),alert(Q?"Saved + connected. You can open Direct Line now.":`Saved to ${p}’s contact list.`),i(`/world/${encodeURIComponent(u)}`,{state:{profileKey:u,bgUrl:f}})}catch(ue){Y(String(ue?.message||"Failed to save contact."))}finally{V(!1)}},[m,x,S,N,B,C,u,Q,p,i,f]),ae=d.useMemo(()=>{const ue={value:$,onChange:me=>W(me.target.value),onSend:null,placeholder:"",hint:"",icon:"",type:"text"};return J===0?{...ue,icon:"👤",placeholder:"e.g., Jordan Smith",hint:"First + last name",onSend:K}:J===1?{...ue,icon:"📞",placeholder:"Phone number",hint:"10+ digits",onSend:I,type:"tel"}:J===2?{...ue,icon:"📍",placeholder:"Address (optional)",hint:"Press Enter to save, or Skip",onSend:R}:J===3?{...ue,icon:"💬",placeholder:"Tiny note (optional)",hint:"Press Enter to save, or Skip",onSend:v}:null},[J,$,K,I,R,v]),pe=d.useMemo(()=>c?.state?.title||`Connect • ${p}`,[c?.state?.title,p]);return a.jsxs("div",{style:Ce.page,children:[a.jsx("div",{style:{...Ce.bg,backgroundImage:`url(${f})`}}),a.jsx("div",{style:Ce.dim}),a.jsxs("div",{style:Ce.shell,children:[a.jsxs("div",{style:Ce.topBar,children:[a.jsxs("div",{style:Ce.topLeft,children:[a.jsx("div",{style:Ce.pillTitle,children:pe}),a.jsx("div",{style:Ce.pillSub,children:"Phonebook + optional identity binding"})]}),a.jsx("div",{style:Ce.topActions,children:a.jsx(Kt,{onClick:()=>i(-1),title:"Close",children:"✕ Close"})})]}),a.jsxs("div",{style:Ce.card,children:[a.jsx("div",{style:Ce.cardOverlay}),a.jsxs("div",{ref:ie,style:Ce.chat,children:[j.map((ue,me)=>a.jsx(Eo,{role:ue.role,children:a.jsx("div",{style:{color:"#fff"},children:ue.text})},me)),J===2&&!N&&a.jsxs(Eo,{role:"ai",children:[a.jsx("div",{style:{color:"#fff"},children:"Add an address? (optional)"}),a.jsxs("div",{style:{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"},children:[a.jsx(Kt,{onClick:H,children:"Skip"}),a.jsx(Kt,{variant:"primary",onClick:R,disabled:F,children:"Save address"})]})]}),J===3&&!B&&a.jsxs(Eo,{role:"ai",children:[a.jsx("div",{style:{color:"#fff"},children:"Add a note? (optional)"}),a.jsxs("div",{style:{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"},children:[a.jsx(Kt,{onClick:k,children:"Skip"}),a.jsx(Kt,{variant:"primary",onClick:v,disabled:F,children:"Save note"})]})]}),J===4&&!C&&a.jsxs(Eo,{role:"ai",children:[a.jsx("div",{style:{color:"#fff"},children:`Do you want to add a selfie so ${p} recognizes you?`}),a.jsxs("div",{style:{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"},children:[a.jsx(Kt,{variant:"primary",onClick:te,children:"📷 Add Selfie"}),a.jsx(Kt,{onClick:le,children:"Skip"})]})]}),J>=5&&a.jsx("div",{style:Ce.confirmWrap,children:a.jsxs("div",{style:Ce.confirmCard,children:[a.jsxs("div",{style:Ce.confirmHead,children:[a.jsx("div",{style:Ce.confirmTitle,children:"Confirm contact"}),a.jsx("div",{style:Ce.confirmHint,children:"You can edit any field before saving."})]}),a.jsxs("div",{style:Ce.grid,children:[a.jsxs("div",{style:Ce.block,children:[a.jsx("div",{style:Ce.blockLabel,children:"Name"}),a.jsx("div",{style:Ce.blockValue,children:`${m} ${x}`.trim()}),a.jsx("div",{style:Ce.blockActions,children:a.jsx(Kt,{onClick:()=>ge(0),children:"✎ Edit"})})]}),a.jsxs("div",{style:Ce.block,children:[a.jsx("div",{style:Ce.blockLabel,children:"Phone"}),a.jsx("div",{style:Ce.blockValue,children:j0(S)}),a.jsx("div",{style:Ce.blockActions,children:a.jsx(Kt,{onClick:()=>ge(1),children:"✎ Edit"})})]}),a.jsxs("div",{style:Ce.block,children:[a.jsx("div",{style:Ce.blockLabel,children:"Address"}),a.jsx("div",{style:Ce.blockValue,children:N||a.jsx("span",{style:{opacity:.75},children:"(none)"})}),a.jsx("div",{style:Ce.blockActions,children:a.jsx(Kt,{onClick:()=>ge(2),children:"✎ Edit"})})]}),a.jsxs("div",{style:Ce.block,children:[a.jsx("div",{style:Ce.blockLabel,children:"Note"}),a.jsx("div",{style:Ce.blockValue,children:B||a.jsx("span",{style:{opacity:.75},children:"(none)"})}),a.jsx("div",{style:Ce.blockActions,children:a.jsx(Kt,{onClick:()=>ge(3),children:"✎ Edit"})})]})]}),a.jsxs("div",{style:{marginTop:10},children:[a.jsx("div",{style:Ce.blockLabel,children:"Photo"}),a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,marginTop:8,flexWrap:"wrap"},children:[C?a.jsxs("div",{style:Ce.selfieRow,children:[a.jsx("img",{src:C,alt:"selfie",style:Ce.selfieImg}),a.jsxs("div",{children:[a.jsx("div",{style:{fontWeight:800},children:E||"selfie"}),a.jsx("div",{style:{opacity:.75,fontSize:12},children:"Stored for this device unless you add uploads later."})]})]}):a.jsx("div",{style:{opacity:.85},children:"(none)"}),a.jsx("div",{style:{display:"flex",gap:10},children:a.jsx(Kt,{onClick:()=>ge(4),children:"✎ Edit"})})]})]}),a.jsxs("div",{style:Ce.meToggle,onClick:()=>q(ue=>!ue),role:"button",tabIndex:0,children:[a.jsx("div",{style:Ce.checkbox,children:Q?"☑":"☐"}),a.jsxs("div",{style:{flex:1},children:[a.jsx("div",{style:Ce.meTitle,children:"This is me (enable Direct Line on this device)"}),a.jsx("div",{style:Ce.meSub,children:"Leave OFF if you’re only adding someone to the phone book."})]})]}),a.jsxs("div",{style:Ce.confirmActions,children:[a.jsx(Kt,{onClick:()=>i(`/world/${encodeURIComponent(u)}`,{state:{profileKey:u,bgUrl:f}}),children:"← Back"}),a.jsx(Kt,{variant:"primary",disabled:F,onClick:de,title:"Save Contact",children:F?"Saving…":"✓ Save Contact"})]}),!!A&&a.jsx("div",{style:Ce.errorNote,children:A})]})})]}),ae&&J<4&&a.jsxs("div",{style:Ce.composerWrap,children:[a.jsxs("div",{style:Ce.composer,children:[a.jsx("div",{style:Ce.composerIcon,children:ae.icon}),a.jsx("input",{value:ae.value,onChange:ae.onChange,placeholder:ae.placeholder,type:ae.type,style:Ce.input,onKeyDown:ue=>{ue.key==="Enter"&&ae.onSend?.()},autoComplete:"off"}),a.jsx(Kt,{variant:"primary",onClick:ae.onSend,disabled:F,children:"Send"})]}),a.jsxs("div",{style:Ce.composerHint,children:[a.jsx("span",{style:{opacity:.75},children:ae.hint}),J===2&&a.jsx("span",{style:{opacity:.75},children:" • or "}),J===2&&a.jsx("span",{style:{cursor:"pointer",textDecoration:"underline"},onClick:H,children:"Skip address"}),J===3&&a.jsx("span",{style:{opacity:.75},children:" • or "}),J===3&&a.jsx("span",{style:{cursor:"pointer",textDecoration:"underline"},onClick:k,children:"Skip note"})]}),!!A&&J<5&&a.jsx("div",{style:Ce.errorInline,children:A})]}),a.jsx("input",{ref:O,type:"file",accept:"image/*",capture:"user",style:{display:"none"},onChange:X})]}),a.jsx("div",{style:Ce.footer,children:"Tip: This page inherits the world background so it feels like you never left."})]})]})}const Ce={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflow:"hidden",fontFamily:"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"},bg:{position:"fixed",inset:0,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transform:"translateZ(0)",zIndex:0},dim:{position:"fixed",inset:0,zIndex:1,background:"radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.70) 78%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.88))"},shell:{position:"relative",zIndex:2,maxWidth:980,margin:"0 auto",padding:"18px 18px 28px"},topBar:{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginTop:6,marginBottom:12},topLeft:{display:"flex",flexDirection:"column",gap:6},pillTitle:{fontWeight:900,letterSpacing:1.2,fontSize:16,textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:10},pillSub:{color:"#cfd3dc",fontSize:12,letterSpacing:.5},topActions:{display:"flex",gap:10,alignItems:"center"},card:{position:"relative",borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.16)",background:"rgba(255,255,255,0.06)",boxShadow:"0 20px 60px rgba(0,0,0,0.45)"},cardOverlay:{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))"},chat:{position:"relative",maxHeight:"72vh",overflowY:"auto",padding:18},composerWrap:{borderTop:"1px solid rgba(255,255,255,0.10)",padding:14,background:"rgba(0,0,0,0.20)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"},composer:{display:"flex",gap:10,alignItems:"center",borderRadius:999,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.08)"},composerIcon:{width:32,textAlign:"center",fontSize:16},input:{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",padding:"8px 6px",fontSize:14},composerHint:{marginTop:8,fontSize:12,color:"#94a3b8"},errorInline:{marginTop:10,fontSize:12,color:"#fca5a5"},confirmWrap:{marginTop:4,paddingBottom:10},confirmCard:{borderRadius:20,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.24)",padding:14,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"},confirmHead:{marginBottom:10},confirmTitle:{fontSize:16,fontWeight:900,letterSpacing:.6},confirmHint:{marginTop:4,fontSize:12,color:"#cfd3dc"},grid:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:12,marginTop:10},block:{borderRadius:16,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",padding:12},blockLabel:{color:"#cfd3dc",fontSize:11,letterSpacing:.8,textTransform:"uppercase",fontWeight:900},blockValue:{marginTop:6,fontWeight:800},blockActions:{marginTop:10,display:"flex",gap:10},selfieRow:{display:"flex",gap:12,alignItems:"center",borderRadius:16,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",padding:10},selfieImg:{width:74,height:74,borderRadius:16,objectFit:"cover",border:"1px solid rgba(255,255,255,0.14)"},meToggle:{marginTop:12,display:"flex",gap:12,alignItems:"flex-start",padding:12,borderRadius:18,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.22)",cursor:"pointer",userSelect:"none"},checkbox:{width:28,height:28,borderRadius:10,display:"grid",placeItems:"center",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",fontWeight:900},meTitle:{fontWeight:900},meSub:{marginTop:4,color:"#cfd3dc",fontSize:12,lineHeight:"16px"},confirmActions:{marginTop:12,display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"},errorNote:{marginTop:12,padding:10,borderRadius:14,border:"1px solid rgba(239,68,68,0.25)",background:"rgba(239,68,68,0.10)",color:"#fecaca",fontSize:12,fontWeight:800},footer:{marginTop:10,fontSize:11,color:"#94a3b8"}},i5=document?.getElementById?.("contactpage-responsive-style");if(!i5&&typeof document<"u"){const i=document.createElement("style");i.id="contactpage-responsive-style",i.innerHTML=`
    @media (max-width: 820px){
      ._contact_grid_fix{ grid-template-columns: 1fr !important; }
    }
  `,document.head.appendChild(i)}const l5="https://images.unsplash.com/photo-1520975682071-a4a3a8a92dd7?auto=format&fit=crop&w=1600&q=60";function k0(i){return String(i||"").trim().toLowerCase()}function o5(i){const o=k0(i);if(o)return o;try{const c=k0(localStorage.getItem("profileKey"));if(c)return c}catch{}return"lamont"}function s5(i){return typeof i=="string"&&/^https?:\/\//i.test(i)}function zo(i){return typeof i=="string"&&/\.(mp4|mov|m4v|webm)(\?|$)/i.test(i)}function vu(i){const o=String(i||"").toLowerCase();return o.includes("youtube")?"YouTube":o.includes("instagram")?"Instagram":o.includes("facebook")?"Facebook":o.includes("local")?"Local":"Original"}function T0(i){const o=String(i||"").toLowerCase();return o.includes("youtube")?"▶️":o.includes("instagram")?"📸":o.includes("facebook")?"f":o.includes("local")?"🎞️":"◉"}async function c5(i,{profileKey:o}={}){const u=`${"https://indiverse-backend.onrender.com".replace(/\/+$/,"")}${i}`,f=await fetch(u,{method:"GET",headers:{Accept:"application/json",...o?{"x-profile-key":o}:{},"Cache-Control":"no-cache",Pragma:"no-cache"},credentials:"include"}),p=await f.text().catch(()=>""),m=p?(()=>{try{return JSON.parse(p)}catch{return null}})():null;if(!f.ok){const b=m?.message||m?.error||(p&&p.length<220?p:"")||f.statusText;throw new Error(`GET ${i} failed (${f.status}): ${b||"Request failed"}`)}return m??{}}function el({children:i,onClick:o,variant:c="ghost",disabled:u,title:f}){const p={base:{borderRadius:999,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.16)",cursor:u?"not-allowed":"pointer",opacity:u?.6:1,fontWeight:900,letterSpacing:.7,fontSize:12,display:"inline-flex",alignItems:"center",gap:8,userSelect:"none",background:"rgba(255,255,255,0.08)",color:"#fff"},primary:{background:"rgba(255,255,255,0.86)",color:"#000",border:"1px solid rgba(255,255,255,0.25)"}};return a.jsx("button",{title:f,onClick:u?void 0:o,style:{...p.base,...c==="primary"?p.primary:null},children:i})}function u5({open:i,onClose:o,children:c}){const u=d.useRef(null);return d.useEffect(()=>{if(!i)return;const f=p=>{p.key==="Escape"&&o?.()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[i,o]),i?a.jsxs("div",{style:wu.modalRoot,role:"dialog","aria-modal":"true",children:[a.jsx("div",{style:wu.backdrop,onClick:o}),a.jsx("div",{style:wu.sheet,ref:u,children:c})]}):null}const wu={modalRoot:{position:"fixed",inset:0,zIndex:50,display:"grid",placeItems:"center",padding:16},backdrop:{position:"absolute",inset:0,background:"rgba(0,0,0,0.70)",backdropFilter:"blur(8px)"},sheet:{position:"relative",zIndex:2,width:"min(980px, 96vw)",borderRadius:22,overflow:"hidden",border:"1px solid rgba(255,255,255,0.16)",background:"rgba(15,23,42,0.55)",boxShadow:"0 30px 90px rgba(0,0,0,0.55)"}};function d5(){const i=_e(),{profileKey:o}=Fe(),c=Ge(),u=d.useMemo(()=>o5(o),[o]);d.useEffect(()=>{try{localStorage.setItem("profileKey",u)}catch{}},[u]);const f=d.useMemo(()=>(typeof c?.state?.bgUrl=="string"?c.state.bgUrl.trim():"")||l5,[c?.state?.bgUrl]),p=d.useMemo(()=>{const q=u||"owner";return q==="lamont"?"Lamont":q.charAt(0).toUpperCase()+q.slice(1)},[u]),[m,b]=d.useState([]),[x,h]=d.useState(!0),[S,w]=d.useState(""),[N,L]=d.useState(!1),[B,U]=d.useState(null),[C,T]=d.useState(!0),E=d.useCallback(async(q="load")=>{try{h(!0),w("");const J=Date.now(),M=await c5(`/api/videos?ts=${J}`,{profileKey:u}),W=(Array.isArray(M)?M:Array.isArray(M?.videos)?M.videos:[]).filter(Boolean).map((F,V)=>({id:String(F.id||F._id||`v-${V}`),title:String(F.title||"Untitled"),source:String(F.source||F.platform||"other").toLowerCase(),url:typeof F.url=="string"?F.url:"",thumbUri:typeof F.thumbUri=="string"?F.thumbUri:typeof F.thumbUrl=="string"?F.thumbUrl:""})).filter(F=>!!F.url);b(W)}catch(J){w(String(J?.message||"Unable to load videos"))}finally{h(!1)}},[u]);d.useEffect(()=>{E("mount")},[E]),d.useEffect(()=>{const q=()=>E("focus"),J=()=>{document.visibilityState==="visible"&&E("visible")};return window.addEventListener("focus",q),document.addEventListener("visibilitychange",J),()=>{window.removeEventListener("focus",q),document.removeEventListener("visibilitychange",J)}},[E]);const D=d.useCallback(q=>{if(q?.url){if(zo(q.url)){U(q),T(!0),L(!0);return}try{window.open(q.url,"_blank","noopener,noreferrer")}catch{}}},[]),Q=d.useMemo(()=>{const q=m.length;return q===1?"1 video":`${q} videos`},[m.length]);return a.jsxs("div",{style:qe.page,children:[a.jsx("div",{style:{...qe.bg,backgroundImage:`url(${f})`}}),a.jsx("div",{style:qe.dim}),a.jsxs("div",{style:qe.shell,children:[a.jsxs("div",{style:qe.header,children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[a.jsxs("div",{style:qe.titleRow,children:[a.jsx("div",{style:qe.title,children:"Videos"}),a.jsx("div",{style:qe.kicker,children:"presence • reels • energy"})]}),a.jsxs("div",{style:qe.meta,children:[p," • ",Q]})]}),a.jsxs("div",{style:qe.actions,children:[a.jsx(el,{onClick:()=>E("manual"),disabled:x,title:"Refresh",children:"⟳ Refresh"}),a.jsx(el,{onClick:()=>i(`/world/${encodeURIComponent(u)}`,{state:{profileKey:u,bgUrl:f}}),title:"Close",children:"✕ Close"})]})]}),a.jsxs("div",{style:qe.panel,children:[a.jsx("div",{style:qe.panelOverlay}),x?a.jsxs("div",{style:qe.center,children:[a.jsx("div",{style:qe.spinner}),a.jsx("div",{style:{marginTop:10,color:"#cfd3dc",fontWeight:800,letterSpacing:.4},children:"Loading videos…"})]}):S?a.jsxs("div",{style:qe.center,children:[a.jsx("div",{style:{color:"#fecaca",fontWeight:900,marginBottom:10},children:S}),a.jsx(el,{variant:"primary",onClick:()=>E("retry"),children:"Try again"})]}):m.length===0?a.jsxs("div",{style:qe.center,children:[a.jsx("div",{style:{fontWeight:900,letterSpacing:.5},children:"No videos yet"}),a.jsx("div",{style:{marginTop:8,color:"#cfd3dc"},children:"Add some in the owner panel and they’ll appear here."})]}):a.jsx("div",{style:qe.grid,children:m.map(q=>a.jsx("button",{onClick:()=>D(q),style:qe.cardBtn,title:q.title,children:a.jsxs("div",{style:qe.card,children:[a.jsxs("div",{style:qe.mediaWrap,children:[q.thumbUri&&s5(q.thumbUri)?a.jsx("img",{src:q.thumbUri,alt:"",style:qe.thumb}):a.jsxs("div",{style:qe.thumbFallback,children:[a.jsx("div",{style:{fontSize:26},children:T0(q.source)}),a.jsx("div",{style:{marginTop:8,opacity:.85,fontWeight:900},children:vu(q.source)}),a.jsx("div",{style:{marginTop:6,opacity:.65,fontSize:12},children:zo(q.url)?"Tap to play":"Tap to open"})]}),a.jsx("div",{style:qe.mediaShade}),a.jsxs("div",{style:qe.badge,children:[a.jsx("span",{style:{opacity:.9},children:T0(q.source)}),a.jsx("span",{children:vu(q.source)})]}),a.jsx("div",{style:qe.playPill,children:zo(q.url)?"▶ Play":"↗ Open"})]}),a.jsxs("div",{style:qe.cardBody,children:[a.jsx("div",{style:qe.cardTitle,title:q.title,children:q.title}),a.jsx("div",{style:qe.cardSub,children:zo(q.url)?"Inline playback":"External link"})]})]})},q.id))})]}),a.jsx("div",{style:qe.footer,children:"Tip: MP4/WebM/MOV plays in-app. YouTube/IG/Facebook opens in a new tab."})]}),a.jsxs(u5,{open:N,onClose:()=>{L(!1),U(null)},children:[a.jsxs("div",{style:qe.modalTop,children:[a.jsxs("div",{style:{minWidth:0},children:[a.jsx("div",{style:qe.modalTitle,children:B?.title||"Video"}),a.jsx("div",{style:qe.modalSub,children:vu(B?.source||"")})]}),a.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center"},children:[a.jsx(el,{onClick:()=>T(q=>!q),title:"Toggle mute",children:C?"🔇 Muted":"🔊 Sound"}),a.jsx(el,{onClick:()=>L(!1),title:"Close player",children:"✕"})]})]}),a.jsx("div",{style:qe.playerWrap,children:B?.url?a.jsx("video",{src:B.url,style:qe.video,controls:!0,autoPlay:!0,playsInline:!0,muted:C},B.url):a.jsx("div",{style:qe.center,children:"No source"})})]})]})}const qe={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflow:"hidden",fontFamily:"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"},bg:{position:"fixed",inset:0,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transform:"translateZ(0)",zIndex:0},dim:{position:"fixed",inset:0,zIndex:1,background:"radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.70) 78%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.90))"},shell:{position:"relative",zIndex:2,maxWidth:1120,margin:"0 auto",padding:"18px 18px 28px"},header:{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-end",marginTop:6,marginBottom:12,flexWrap:"wrap"},titleRow:{display:"flex",flexDirection:"column",gap:6},title:{fontSize:26,fontWeight:950,letterSpacing:1.2,textTransform:"uppercase"},kicker:{color:"#cfd3dc",fontSize:12,letterSpacing:.8,textTransform:"uppercase"},meta:{color:"#94a3b8",fontSize:12,letterSpacing:.3,fontWeight:800},actions:{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"},panel:{position:"relative",borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.16)",background:"rgba(255,255,255,0.06)",boxShadow:"0 20px 60px rgba(0,0,0,0.45)"},panelOverlay:{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))"},center:{minHeight:"60vh",display:"grid",placeItems:"center",textAlign:"center",padding:18},spinner:{width:42,height:42,borderRadius:999,border:"3px solid rgba(255,255,255,0.18)",borderTopColor:"rgba(255,255,255,0.75)",animation:"spin 0.9s linear infinite"},grid:{position:"relative",padding:14,display:"grid",gap:14,gridTemplateColumns:"repeat(3, minmax(0, 1fr))"},cardBtn:{border:"none",background:"transparent",padding:0,cursor:"pointer",textAlign:"left"},card:{borderRadius:18,overflow:"hidden",border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.22)",boxShadow:"0 18px 40px rgba(0,0,0,0.35)",transform:"translateY(0px)",transition:"transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease"},mediaWrap:{position:"relative",width:"100%",aspectRatio:"16 / 9",overflow:"hidden"},thumb:{width:"100%",height:"100%",objectFit:"cover",display:"block",transform:"scale(1.02)"},thumbFallback:{width:"100%",height:"100%",display:"grid",placeItems:"center",background:"rgba(255,255,255,0.06)",color:"#fff"},mediaShade:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.78))",pointerEvents:"none"},badge:{position:"absolute",top:10,left:10,display:"inline-flex",gap:8,alignItems:"center",borderRadius:999,padding:"6px 10px",background:"rgba(15,23,42,0.85)",border:"1px solid rgba(255,255,255,0.14)",fontWeight:900,fontSize:11,letterSpacing:.6,textTransform:"uppercase"},playPill:{position:"absolute",right:10,bottom:10,borderRadius:999,padding:"6px 10px",background:"rgba(255,255,255,0.86)",color:"#000",border:"1px solid rgba(255,255,255,0.25)",fontWeight:950,letterSpacing:.6,fontSize:11},cardBody:{padding:12},cardTitle:{fontWeight:950,letterSpacing:.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},cardSub:{marginTop:6,color:"#cfd3dc",fontSize:12,letterSpacing:.3},footer:{marginTop:10,fontSize:11,color:"#94a3b8"},modalTop:{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",padding:14,borderBottom:"1px solid rgba(255,255,255,0.12)",background:"rgba(0,0,0,0.20)"},modalTitle:{fontWeight:950,letterSpacing:.4,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},modalSub:{marginTop:4,color:"#cfd3dc",fontSize:12},playerWrap:{position:"relative",background:"#000"},video:{width:"100%",height:"auto",aspectRatio:"16 / 9",display:"block"}};if(typeof document<"u"&&!document.getElementById("videospage-keyframes")){const i=document.createElement("style");i.id="videospage-keyframes",i.innerHTML=`
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 980px){
      ._videos_grid_fix{ grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (max-width: 620px){
      ._videos_grid_fix{ grid-template-columns: 1fr !important; }
    }
  `,document.head.appendChild(i)}const f5="https://montech-remote-config.s3.amazonaws.com/superapp/config.json";function p5(i){return String(i||"").trim().toLowerCase()}function il(i){const o=typeof i=="string"?i.trim():"";return o||null}function Su(i){return typeof i=="string"&&/^https?:\/\//i.test(i)}async function g5({url:i=f5,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function m5(i,o){const c=Array.isArray(i?.profiles)?i.profiles:[],u=String(o||"").trim();return c.find(f=>String(f?.key||"").trim()===u)||null}async function C0(i,{profileKey:o}={}){const u=`${"https://indiverse-backend.onrender.com".replace(/\/+$/,"")}${i}`,f=await fetch(u,{method:"GET",headers:{Accept:"application/json",...o?{"x-profile-key":o}:{},"Cache-Control":"no-cache",Pragma:"no-cache"},credentials:"include"});if(!f.ok){const p=await f.text().catch(()=>"");throw new Error(`GET ${i} failed (${f.status}): ${p||f.statusText}`)}return f.json()}function h5(i){return Array.isArray(i)?i:Array.isArray(i?.items)?i.items:Array.isArray(i?.tracks)?i.tracks:Array.isArray(i?.data)?i.data:Array.isArray(i?.result?.items)?i.result.items:Array.isArray(i?.result?.tracks)?i.result.tracks:[]}function R0(i){return h5(i).map(c=>{const u=String(c?._id||c?.id||c?.trackId||"").trim();return{...c,_id:u||void 0,id:u||void 0,title:String(c?.title||c?.name||"Untitled"),artist:String(c?.artist||c?.artistName||c?.by||""),album:String(c?.album||c?.albumName||""),tag:String(c?.tag||c?.mood||c?.genre||""),spotifyUrl:il(c?.spotifyUrl||c?.spotify||c?.spotify_link||c?.spotifyLink),thumbnailUrl:il(c?.thumbnailUrl||c?.thumbUrl||c?.coverUrl||c?.artworkUrl||c?.imageUrl||c?.image)}}).filter(c=>c._id||c.id)}function E0(i){const o=Date.parse(i);return Number.isFinite(o)?o:0}function b5(){const i=_e(),o=Ge(),{profileKey:c}=Fe(),u=d.useMemo(()=>p5(c)||"lamont",[c]),[f,p]=d.useState(null),m=d.useMemo(()=>m5(f,u),[f,u]),b=d.useMemo(()=>{const A=il(o?.state?.bgUrl),Y=il(m?.assets?.introBgImageUrl),ie=il(m?.assets?.iconUrl);return A&&Su(A)?A:Y&&Su(Y)?Y:ie&&Su(ie)?ie:null},[o?.state?.bgUrl,m]),x=d.useMemo(()=>{const A=m?.ownerName||m?.label||(u==="lamont"?"Lamont":u.charAt(0).toUpperCase()+u.slice(1));return String(A||"Playlist")},[m,u]),[h,S]=d.useState([]),[w,N]=d.useState(!0),[L,B]=d.useState(""),[U,C]=d.useState(""),[T,E]=d.useState(""),[D,Q]=d.useState(""),[q,J]=d.useState("recent"),M=d.useRef(!0);d.useEffect(()=>(M.current=!0,g5().then(A=>M.current&&p(A)).catch(()=>{}).finally(()=>{}),()=>{M.current=!1}),[]);const $=d.useCallback(async(A="load")=>{N(!0),B(""),C("");try{const Y=Date.now();let ie=await C0(`/api/tracks/public?ts=${Y}`,{profileKey:u}),O=R0(ie);if(O.length)C("public");else{const j=await C0(`/api/tracks?ts=${Y}`,{profileKey:u}).catch(()=>null),K=R0(j);K.length?(O=K,C("fallback")):C("public")}if(!M.current)return;S(O),E(new Date().toLocaleString()),console.log("[PlaylistPage] fetched",{reason:A,profileKey:u,count:O.length})}catch(Y){if(!M.current)return;S([]),B(String(Y?.message||"Failed to load playlist"))}finally{M.current&&N(!1)}},[u]);d.useEffect(()=>(M.current=!0,$("mount"),()=>{M.current=!1}),[$]);const W=d.useMemo(()=>{const A=D.trim().toLowerCase();let Y=h;A&&(Y=Y.filter(O=>`${O.title} ${O.artist} ${O.album} ${O.tag}`.toLowerCase().includes(A)));const ie=[...Y];return q==="az"?ie.sort((O,j)=>String(O.title).localeCompare(String(j.title))):q==="za"?ie.sort((O,j)=>String(j.title).localeCompare(String(O.title))):ie.sort((O,j)=>E0(j.updatedAt||j.createdAt)-E0(O.updatedAt||O.createdAt)),ie},[h,D,q]),F=d.useMemo(()=>`${W.length} track${W.length===1?"":"s"}`,[W.length]),V=A=>{A.spotifyUrl&&window.open(A.spotifyUrl,"_blank","noopener,noreferrer")};return a.jsxs("div",{className:"pl-root",children:[a.jsx("div",{className:"pl-bg",style:b?{backgroundImage:`url(${b})`}:void 0}),a.jsx("div",{className:"pl-dim"}),a.jsxs("div",{className:"pl-shell",children:[a.jsxs("div",{className:"pl-topRow",children:[a.jsxs("div",{children:[a.jsx("div",{className:"pl-kicker",children:"PLAYLIST"}),a.jsxs("div",{className:"pl-titleRow",children:[a.jsx("div",{className:"pl-titleBig",children:"Now Playing"}),a.jsxs("div",{className:"pl-subline",children:[a.jsx("span",{className:"pl-dot",children:x}),a.jsx("span",{className:"pl-dot",children:"•"}),a.jsx("span",{className:"pl-dot",children:u}),a.jsx("span",{className:"pl-dot",children:"•"}),a.jsx("span",{className:"pl-dot",children:U||"public"}),T?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"pl-dot",children:"•"}),a.jsx("span",{className:"pl-dot",style:{opacity:.75},children:T})]}):null]}),L?a.jsxs("div",{className:"pl-error",children:["Note: ",L]}):null]})]}),a.jsxs("div",{className:"pl-actions",children:[a.jsx("div",{className:"pl-pill",title:"Tracks",children:F}),a.jsx("button",{className:"pl-iconBtn",onClick:()=>$("manual"),title:"Refresh","aria-label":"Refresh",children:"⟳"}),a.jsx("button",{className:"pl-iconBtn",onClick:()=>i(-1),title:"Close","aria-label":"Close",children:"✕"})]})]}),a.jsxs("div",{className:"pl-controls",children:[a.jsxs("div",{className:"pl-search",children:[a.jsx("span",{className:"pl-searchIcon","aria-hidden":!0,children:"⌕"}),a.jsx("input",{value:D,onChange:A=>Q(A.target.value),className:"pl-searchInput",placeholder:"Search title, artist, album…",spellCheck:!1})]}),a.jsxs("div",{className:"pl-sortWrap",children:[a.jsx("div",{className:"pl-sortLabel",children:"SORT"}),a.jsxs("select",{className:"pl-select",value:q,onChange:A=>J(A.target.value),children:[a.jsx("option",{value:"recent",children:"Recent"}),a.jsx("option",{value:"az",children:"Title A → Z"}),a.jsx("option",{value:"za",children:"Title Z → A"})]})]})]}),w?a.jsx("div",{className:"pl-center",children:a.jsx("div",{className:"pl-muted",children:"Loading playlist…"})}):W.length===0?a.jsx("div",{className:"pl-center",children:a.jsx("div",{className:"pl-muted",children:"No tracks yet. Check back soon."})}):a.jsx("div",{className:"pl-grid",children:W.map((A,Y)=>a.jsxs("div",{className:"pl-card",children:[a.jsx("div",{className:"pl-cover","aria-hidden":!0,children:A.thumbnailUrl?a.jsx("img",{src:A.thumbnailUrl,alt:"",className:"pl-coverImg"}):a.jsx("div",{className:"pl-coverFallback",children:a.jsx("div",{className:"pl-monogram",children:x?.slice(0,2)?.toUpperCase()||"IV"})})}),a.jsxs("div",{className:"pl-meta",children:[a.jsx("div",{className:"pl-title",children:A.title||"Untitled"}),a.jsx("div",{className:"pl-sub",children:(A.artist||"—")+(A.album?` • ${A.album}`:"")}),A.tag?a.jsx("div",{className:"pl-tag",children:A.tag}):null]}),a.jsx("button",{className:"pl-openBtn",onClick:()=>V(A),disabled:!A.spotifyUrl,title:A.spotifyUrl?"Open in Spotify":"No spotifyUrl on this track",style:A.spotifyUrl?void 0:{opacity:.55,borderColor:"rgba(255,255,255,0.10)",color:"rgba(255,255,255,0.55)"},children:"▶ Open"})]},`${A._id||A.id}-${Y}`))}),a.jsxs("div",{className:"pl-footnote",children:["Tip: This is a public playlist — “Open” will deep-link to Spotify only if ",a.jsx("code",{children:"spotifyUrl"})," exists."]})]}),a.jsx("style",{children:`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.16);
          --textDim: rgba(255,255,255,0.72);
        }

        .pl-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .pl-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: translateZ(0);
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
        }
        .pl-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 30% 10%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 80% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.86));
        }

        .pl-shell{
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 22px 28px;
        }

        /* header */
        .pl-topRow{
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .pl-kicker{
          font-size: 12px;
          letter-spacing: 2.8px;
          font-weight: 900;
          opacity: 0.78;
        }
        .pl-titleBig{
          font-size: 44px;
          font-weight: 950;
          letter-spacing: 0.4px;
          line-height: 1.04;
          margin-top: 6px;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .pl-subline{
          margin-top: 10px;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          letter-spacing: 0.5px;
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items:center;
        }
        .pl-dot{ display:inline-block; }
        .pl-error{
          margin-top: 10px;
          color: rgba(252,165,165,0.95);
          font-size: 12px;
          letter-spacing: 0.2px;
        }

        /* actions */
        .pl-actions{
          display:flex;
          align-items:center;
          gap:10px;
          padding-top: 6px;
        }
        .pl-pill{
          height: 34px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.35);
          color: #fff;
          display:flex;
          align-items:center;
          gap:8px;
          font-weight: 900;
          letter-spacing: .6px;
          font-size: 12px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
        }
        .pl-iconBtn{
          width: 34px;
          height: 34px;
          padding: 0;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .pl-iconBtn:hover{ border-color: var(--stroke2); }
        .pl-iconBtn:active{ transform: scale(0.98); opacity: 0.92; }

        /* controls */
        .pl-controls{
          margin-top: 18px;
          display:flex;
          gap: 14px;
          align-items:center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .pl-search{
          flex: 1;
          min-width: 280px;
          height: 44px;
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
        }
        .pl-searchIcon{
          opacity: 0.75;
          font-weight: 900;
        }
        .pl-searchInput{
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color:#fff;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .pl-searchInput::placeholder{
          color: rgba(255,255,255,0.55);
        }

        .pl-sortWrap{
          display:flex;
          align-items:center;
          gap:10px;
          padding: 6px 10px;
          border-radius: 14px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
        }
        .pl-sortLabel{
          color: var(--textDim);
          font-size: 11px;
          letter-spacing: .8px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .pl-select{
          height: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color:#fff;
          padding: 0 10px;
          font-weight: 900;
          letter-spacing: .3px;
          outline: none;
          cursor:pointer;
        }

        /* grid */
        .pl-grid{
          margin-top: 16px;
          display:grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
          align-items: stretch;
        }
        .pl-card{
          grid-column: span 6;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.42);
          overflow:hidden;
          min-height: 118px;
          display:flex;
          align-items:center;
          padding: 14px;
          gap: 12px;
          transition: transform 140ms ease, border-color 140ms ease;
        }
        .pl-card:hover{
          transform: translateY(-1px);
          border-color: var(--stroke2);
        }

        .pl-cover{
          width: 56px;
          height: 56px;
          border-radius: 14px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          flex: 0 0 auto;
          background: rgba(0,0,0,0.25);
          display:grid;
          place-items:center;
        }
        .pl-coverImg{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
        }
        .pl-coverFallback{
          width:100%;
          height:100%;
          background: radial-gradient(circle at 30% 25%, rgba(59,130,246,0.65), rgba(0,0,0,0.10) 55%),
                      linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
          display:grid;
          place-items:center;
        }
        .pl-monogram{
          font-weight: 950;
          letter-spacing: 1px;
          font-size: 14px;
          opacity: 0.92;
        }

        .pl-meta{ flex: 1; min-width: 0; }
        .pl-title{
          font-size: 16px;
          font-weight: 950;
          letter-spacing: .2px;
          line-height: 1.2;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pl-sub{
          margin-top: 4px;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
          letter-spacing: .2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pl-tag{
          display:inline-flex;
          align-items:center;
          height: 22px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.78);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .4px;
          margin-top: 8px;
        }

        .pl-openBtn{
          height: 32px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(34,197,94,0.40);
          background: rgba(0,0,0,0.45);
          color: rgba(34,197,94,0.95);
          font-weight: 950;
          letter-spacing: .3px;
          display:flex;
          align-items:center;
          gap:8px;
          cursor:pointer;
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
          flex: 0 0 auto;
          user-select: none;
        }
        .pl-openBtn:active{ transform: scale(0.98); opacity: 0.92; }
        .pl-openBtn:hover{ border-color: rgba(34,197,94,0.6); }

        /* states */
        .pl-center{
          margin-top: 26px;
          min-height: 44vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
        }
        .pl-muted{
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.3px;
        }

        .pl-footnote{
          margin-top: 14px;
          color: rgba(255,255,255,0.62);
          font-size: 12px;
          letter-spacing: 0.2px;
        }
        .pl-footnote code{
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 2px 6px;
          border-radius: 8px;
          color: rgba(255,255,255,0.85);
        }

        @media (max-width: 980px){
          .pl-titleBig{ font-size: 36px; }
          .pl-card{ grid-column: span 12; }
        }

        @media (prefers-reduced-motion: reduce){
          .pl-card{ transition: none; }
          .pl-iconBtn{ transition:none; }
          .pl-openBtn{ transition:none; }
        }
      `})]})}const y5="https://montech-remote-config.s3.amazonaws.com/superapp/config.json",z0=[{id:"rl-knit",brand:"Ralph Lauren",name:"Cable-Knit Sweater",type:"Knitwear",description:"Heavy cable-knit for cold days, still clean enough for a night out.",styleNote:"",tag:"Everyday",image:"https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-1287238_alternate10?$rl_4x5_pdp$",video:""},{id:"lebron-beanie",brand:"Fitted Beanie",name:"LeBron-Inspired Beanie",type:"Headwear",description:"Low-key statement piece that frames the face on and off camera.",styleNote:"",tag:"Studio",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbW7klcKLJnB1U0aY-gOnbkYPuuvPTpF_EtraU9tWyxhE7IntjxhFXpS4z2L_6100JPbDZaQpF",video:""},{id:"anta-sneakers",brand:"ANTA",name:"Hela Style Roots",type:"Sneakers",description:"Performance pair with a modern silhouette for everyday wear.",styleNote:"",tag:"Street",image:"",video:"https://anta.com/cdn/shop/videos/c/vp/10511818e24a467b9c5fa1c09af4230b/10511818e24a467b9c5fa1c09af4230b.HD-1080p-7.2Mbps-59695614.mp4?v=0"}];function ll(i){const o=typeof i=="string"?i.trim():"";return o||null}function ju(i){return typeof i=="string"&&/^https?:\/\//i.test(i)}function x5(i){return String(i||"").trim().toLowerCase()}async function v5({url:i=y5,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function w5(i,o){const c=Array.isArray(i?.profiles)?i.profiles:[],u=String(o||"").trim();return c.find(f=>String(f?.key||"").trim()===u)||null}async function S5(i,{profileKey:o}={}){const u=`${"https://indiverse-backend.onrender.com".replace(/\/+$/,"")}${i}`,f=await fetch(u,{method:"GET",headers:{Accept:"application/json",...o?{"x-profile-key":o}:{},"Cache-Control":"no-cache",Pragma:"no-cache"},credentials:"include"});if(!f.ok){const p=await f.text().catch(()=>"");throw new Error(`GET ${i} failed (${f.status}): ${p||f.statusText}`)}return f.json()}function j5(i){return(Array.isArray(i)?i:Array.isArray(i?.items)?i.items:[]).map(c=>({id:String(c?.id||c?._id||"").trim()||void 0,brand:String(c?.brand||""),name:String(c?.name||""),type:String(c?.type||""),description:String(c?.description||""),styleNote:String(c?.styleNote||""),tag:String(c?.tag||""),image:ll(c?.image),video:ll(c?.video)})).filter(c=>!!c.id)}function k5(i,o){return i?.ownerName||i?.label||(o?o.charAt(0).toUpperCase()+o.slice(1):"Fashion")}function T5(){const i=_e(),o=Ge(),{profileKey:c}=Fe(),u=d.useMemo(()=>x5(c)||"lamont",[c]),[f,p]=d.useState(null),m=d.useMemo(()=>w5(f,u),[f,u]),b=d.useMemo(()=>{const M=ll(o?.state?.bgUrl),$=ll(m?.assets?.introBgImageUrl),W=ll(m?.assets?.iconUrl);return M&&ju(M)?M:$&&ju($)?$:W&&ju(W)?W:null},[o?.state?.bgUrl,m]),x=d.useMemo(()=>k5(m,u),[m,u]),[h,S]=d.useState([]),[w,N]=d.useState(!0),[L,B]=d.useState(""),[U,C]=d.useState(null),[T,E]=d.useState("");d.useEffect(()=>{let M=!0;return v5().then($=>M&&p($)).catch(()=>{}).finally(()=>{}),()=>{M=!1}},[]);const D=d.useCallback(async()=>{N(!0),B("");try{const M=Date.now(),$=await S5(`/api/fashion?ts=${M}`,{profileKey:u}),W=j5($);W.length?S(W):(S(z0),B("No items yet — showing backup looks."))}catch(M){S(z0),B(String(M?.message||"Failed to load fashion. Showing backup looks."))}finally{N(!1)}},[u]);d.useEffect(()=>{D()},[D]);const Q=d.useMemo(()=>{const M=new Set;return h.forEach($=>{$.tag&&M.add($.tag)}),Array.from(M)},[h]),q=d.useMemo(()=>{const M=T.trim().toLowerCase();return h.filter($=>U&&$.tag!==U?!1:M?`${$.brand} ${$.name} ${$.type} ${$.tag} ${$.description} ${$.styleNote}`.toLowerCase().includes(M):!0)},[h,U,T]),J=d.useMemo(()=>[x,...["Closet","Vibe","Story"]],[x]);return a.jsxs("div",{className:"fs-root",children:[a.jsx("div",{className:"fs-bg",style:b?{backgroundImage:`url(${b})`}:void 0}),a.jsx("div",{className:"fs-dim"}),a.jsxs("div",{className:"fs-shell",children:[a.jsxs("div",{className:"fs-topBar",children:[a.jsxs("div",{className:"fs-left",children:[a.jsx("div",{className:"fs-kicker",children:"FASHION"}),a.jsx("div",{className:"fs-title",children:"Lookbook"}),a.jsxs("div",{className:"fs-sub",children:[a.jsx("span",{children:u}),a.jsx("span",{className:"fs-dot",children:"•"}),a.jsxs("span",{children:[q.length," item",q.length===1?"":"s"]})]}),a.jsx("div",{className:"fs-chipRow",children:J.map(M=>a.jsx("span",{className:"fs-metaChip",children:M},M))}),L?a.jsx("div",{className:"fs-error",children:L}):null]}),a.jsxs("div",{className:"fs-actions",children:[a.jsx("button",{className:"fs-iconBtn",onClick:D,title:"Refresh","aria-label":"Refresh",children:"⟳"}),a.jsx("button",{className:"fs-iconBtn",onClick:()=>i(-1),title:"Close","aria-label":"Close",children:"✕"})]})]}),a.jsxs("div",{className:"fs-controls",children:[a.jsxs("div",{className:"fs-search",children:[a.jsx("span",{className:"fs-searchIcon","aria-hidden":!0,children:"⌕"}),a.jsx("input",{className:"fs-searchInput",value:T,onChange:M=>E(M.target.value),placeholder:"Search brand, piece, type…",spellCheck:!1})]}),Q.length?a.jsxs("div",{className:"fs-tags",children:[a.jsx("button",{className:`fs-tag ${U?"":"fs-tagActive"}`,onClick:()=>C(null),children:"All"}),Q.map(M=>a.jsx("button",{className:`fs-tag ${U===M?"fs-tagActive":""}`,onClick:()=>C($=>$===M?null:M),children:M},M))]}):null]}),w?a.jsx("div",{className:"fs-center",children:a.jsx("div",{className:"fs-muted",children:"Loading looks…"})}):q.length===0?a.jsx("div",{className:"fs-center",children:a.jsx("div",{className:"fs-muted",children:"Nothing in this filter yet. Try “All”."})}):a.jsx("div",{className:"fs-grid",children:q.map(M=>a.jsxs("div",{className:"fs-card",children:[a.jsxs("div",{className:"fs-media",children:[M.video?a.jsx("video",{className:"fs-mediaEl",src:M.video,muted:!0,playsInline:!0,loop:!0,autoPlay:!0,preload:"metadata"}):M.image?a.jsx("img",{className:"fs-mediaEl",src:M.image,alt:""}):a.jsx("div",{className:"fs-noMedia",children:"No media"}),a.jsx("div",{className:"fs-mediaGrad"}),M.brand?a.jsx("div",{className:"fs-brandPill",children:M.brand}):null,M.tag?a.jsx("div",{className:"fs-tagPill",children:M.tag}):null]}),a.jsxs("div",{className:"fs-cardBody",children:[a.jsx("div",{className:"fs-piece",children:M.name||"Untitled"}),a.jsxs("div",{className:"fs-type",children:[M.type||"—",M.tag?` • ${M.tag}`:""]}),M.styleNote?a.jsx("div",{className:"fs-desc",children:M.styleNote}):M.description?a.jsx("div",{className:"fs-desc fs-descDim",children:M.description}):null]})]},M.id))})]}),a.jsx("style",{children:`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.16);
        }

        .fs-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .fs-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
          transform: translateZ(0);
        }
        .fs-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 22% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.88));
        }

        .fs-shell{
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 26px 22px 28px;
        }

        .fs-topBar{
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .fs-left{ min-width: 0; }

        .fs-kicker{
          font-size: 12px;
          letter-spacing: 2.8px;
          font-weight: 950;
          opacity: 0.78;
        }
        .fs-title{
          font-size: 44px;
          font-weight: 950;
          letter-spacing: 0.4px;
          margin-top: 6px;
          line-height: 1.04;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .fs-sub{
          margin-top: 10px;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          letter-spacing: 0.5px;
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items:center;
        }
        .fs-dot{ opacity: 0.8; }

        .fs-chipRow{
          margin-top: 10px;
          display:flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .fs-metaChip{
          height: 26px;
          display:inline-flex;
          align-items:center;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.32);
          color: rgba(255,255,255,0.78);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .4px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .fs-error{
          margin-top: 10px;
          color: rgba(252,165,165,0.95);
          font-size: 12px;
          letter-spacing: 0.2px;
        }

        .fs-actions{
          display:flex;
          align-items:center;
          gap:10px;
          padding-top: 6px;
        }
        .fs-iconBtn{
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .fs-iconBtn:hover{ border-color: var(--stroke2); }
        .fs-iconBtn:active{ transform: scale(0.98); opacity: 0.92; }

        .fs-controls{
          margin-top: 18px;
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .fs-search{
          flex: 1;
          min-width: 280px;
          height: 44px;
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
        }
        .fs-searchIcon{ opacity: 0.75; font-weight: 900; }
        .fs-searchInput{
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color:#fff;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .fs-searchInput::placeholder{ color: rgba(255,255,255,0.55); }

        .fs-tags{
          display:flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items:center;
        }
        .fs-tag{
          height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.35);
          color: rgba(255,255,255,0.78);
          font-weight: 950;
          font-size: 12px;
          letter-spacing: 0.3px;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .fs-tag:hover{ border-color: rgba(255,255,255,0.20); }
        .fs-tag:active{ transform: scale(0.98); opacity: 0.92; }
        .fs-tagActive{
          background: rgba(255,255,255,0.86);
          border-color: rgba(255,255,255,0.86);
          color: #0b0b12;
        }

        .fs-grid{
          margin-top: 14px;
          display:grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
        }

        .fs-card{
          grid-column: span 4;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.42);
          overflow:hidden;
          transition: transform 140ms ease, border-color 140ms ease;
        }
        .fs-card:hover{
          transform: translateY(-1px);
          border-color: var(--stroke2);
        }

        .fs-media{
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow:hidden;
          background: rgba(0,0,0,0.25);
        }
        .fs-mediaEl{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display:block;
        }
        .fs-noMedia{
          width: 100%;
          height: 100%;
          display:grid;
          place-items:center;
          color: rgba(255,255,255,0.65);
          font-size: 12px;
          letter-spacing: .2px;
        }
        .fs-mediaGrad{
          position:absolute;
          left:0; right:0; bottom:0;
          height: 52%;
          background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.80));
          pointer-events:none;
        }

        .fs-brandPill{
          position:absolute;
          top: 10px;
          left: 10px;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.16);
          display:flex;
          align-items:center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .35px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .fs-tagPill{
          position:absolute;
          bottom: 10px;
          left: 10px;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(15,23,42,0.72);
          border: 1px solid rgba(199,210,254,0.24);
          display:flex;
          align-items:center;
          color: rgba(199,210,254,0.95);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .35px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .fs-cardBody{
          padding: 12px 12px 14px;
        }
        .fs-piece{
          font-size: 15px;
          font-weight: 950;
          letter-spacing: .2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fs-type{
          margin-top: 4px;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
          letter-spacing: .2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fs-desc{
          margin-top: 8px;
          font-size: 12px;
          line-height: 1.35;
          color: rgba(255,255,255,0.80);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fs-descDim{ color: rgba(255,255,255,0.66); }

        .fs-center{
          margin-top: 22px;
          min-height: 44vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
        }
        .fs-muted{
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.3px;
        }

        @media (max-width: 1080px){
          .fs-card{ grid-column: span 6; }
        }
        @media (max-width: 740px){
          .fs-title{ font-size: 36px; }
          .fs-card{ grid-column: span 12; }
        }
        @media (prefers-reduced-motion: reduce){
          .fs-card, .fs-iconBtn, .fs-tag{ transition: none; }
        }
      `})]})}const C5="https://montech-remote-config.s3.amazonaws.com/superapp/config.json";function R5(i){return String(i||"").trim().toLowerCase()}function ku(i){const o=typeof i=="string"?i.trim():"";return o||null}function Tu(i){return typeof i=="string"&&/^https?:\/\//i.test(i.trim())}function E5(i){return typeof i=="string"&&/^[a-f0-9]{24}$/i.test(i.trim())}function Gm(i){try{const o=String(i||"").trim();if(!o)return null;const c=o.split(".");if(c.length<2)return null;const u=c[1].replace(/-/g,"+").replace(/_/g,"/"),f=u.length%4?"=".repeat(4-u.length%4):"",p=atob(u+f);return JSON.parse(p)}catch{return null}}function z5(i){const o=Gm(i);if(!o)return null;const c=o.userId||o.id||o._id||null;if(c)return String(c);const u=o.sub?String(o.sub):"";return E5(u)?u:null}function N5(){return"https://indiverse-backend.onrender.com".trim().replace(/\/+$/,"")}async function Cu(i,{method:o="GET",headers:c={},body:u}={}){const p=`${N5()}${i}`,m=await fetch(p,{method:o,headers:{Accept:"application/json",...u?{"Content-Type":"application/json"}:{},"Cache-Control":"no-cache",Pragma:"no-cache",...c},body:u,credentials:"include"}),b=await m.text().catch(()=>"");if(!m.ok)throw new Error(`${o} ${i} failed (${m.status}): ${b||m.statusText}`);return b?JSON.parse(b):{}}async function A5({url:i=C5,timeoutMs:o=9e3}={}){const c=new AbortController,u=setTimeout(()=>c.abort(),o);try{const f=await fetch(i,{cache:"no-store",signal:c.signal});if(!f.ok)throw new Error(`remote config fetch failed: ${f.status}`);return await f.json()}finally{clearTimeout(u)}}function U5(i,o){const c=Array.isArray(i?.profiles)?i.profiles:[],u=String(o||"").trim();return c.find(f=>String(f?.key||"").trim()===u)||null}function N0(i,o="usd"){const c=Number(i||0)/100;try{return new Intl.NumberFormat("en-US",{style:"currency",currency:String(o||"usd").toUpperCase()}).format(c)}catch{return`$${c.toFixed(2)}`}}function A0(i){const o=Math.max(0,Math.floor(Number(i||0))),c=Math.floor(o/60),u=o%60;return`${c}:${String(u).padStart(2,"0")}`}function O5(){const i=_e(),o=Ge(),{profileKey:c}=Fe(),u=d.useMemo(()=>R5(c)||"lamont",[c]),[f,p]=d.useState(()=>localStorage.getItem("buyerToken")||""),m=!!f,b=d.useMemo(()=>z5(f),[f]);d.useEffect(()=>{const fe=()=>p(localStorage.getItem("buyerToken")||"");return window.addEventListener("focus",fe),window.addEventListener("storage",fe),fe(),()=>{window.removeEventListener("focus",fe),window.removeEventListener("storage",fe)}},[o?.key]),d.useEffect(()=>{const fe=Gm(f);console.log("[MusicPage] auth =>",{isAuthed:m,hasToken:!!f,tokenParts:f?f.split(".").length:0,buyerUserId:b||null,jwtKeys:fe?Object.keys(fe):[],sub:fe?.sub||null})},[m,f,b]);const[x,h]=d.useState(null),S=d.useMemo(()=>U5(x,u),[x,u]),w=d.useMemo(()=>{const fe=ku(o?.state?.bgUrl),be=ku(S?.assets?.introBgImageUrl),ze=ku(S?.assets?.iconUrl);return fe&&Tu(fe)?fe:be&&Tu(be)?be:ze&&Tu(ze)?ze:null},[o?.state?.bgUrl,S]),N=d.useMemo(()=>S?.label||S?.brandTopTitle||S?.OWNER_NAME||(u?u.charAt(0).toUpperCase()+u.slice(1):"Owner"),[S,u]);d.useEffect(()=>{let fe=!0;return A5().then(be=>fe&&h(be)).catch(()=>{}),()=>{fe=!1}},[]);const[L,B]=d.useState([]),[U,C]=d.useState([]),[T,E]=d.useState(!0),[D,Q]=d.useState(null),[q,J]=d.useState(""),M=d.useRef(null),[$,W]=d.useState(null),[F,V]=d.useState(null),[A,Y]=d.useState(!0),[ie,O]=d.useState(!1),[j,K]=d.useState(!1),[I,R]=d.useState(0),[H,v]=d.useState(0),k=d.useRef(null),te=d.useCallback((fe={})=>{const be={"x-profile-key":String(u||""),...fe};return f&&(be.Authorization=`Bearer ${f}`),b&&(be["x-user-id"]=String(b)),be},[u,f,b]),X=d.useCallback(()=>{k.current&&(clearInterval(k.current),k.current=null)},[]),le=d.useCallback(async()=>{X();try{const fe=M.current;fe&&(fe.pause(),fe.src="",M.current=null)}catch{}W(null),V(null),O(!1),R(0),v(0)},[X]),ge=d.useCallback(fe=>(fe||[]).map(be=>({...be,isOwned:typeof be.isOwned=="boolean"?be.isOwned:!!be.isUnlocked})),[]),de=d.useCallback(async()=>{J("");try{const fe=await Cu("/api/music/catalog",{headers:te()});B(Array.isArray(fe?.albums)?fe.albums:[]),C(ge(Array.isArray(fe?.tracks)?fe.tracks:[]))}catch(fe){console.error("[MusicPage] reloadCatalog error =>",fe?.message||fe),J(String(fe?.message||"Unable to load music right now."))}},[te,ge]);d.useEffect(()=>{let fe=!0;(async()=>{try{E(!0),await de()}finally{fe&&E(!1)}})();const be=()=>de();return window.addEventListener("focus",be),()=>{fe=!1,window.removeEventListener("focus",be),le()}},[u]);const ae=d.useMemo(()=>{if(!D)return U;const fe=L.find(be=>be._id===D);return fe?U.filter(be=>!!(be.albumId&&be.albumId===D||be.albumTitle&&be.albumTitle===fe.title)):U},[U,L,D]),pe=d.useMemo(()=>D?L.find(fe=>fe._id===D)?.title:null,[L,D]),ue=d.useCallback(()=>m&&f?!0:(i("/auth/login",{state:{nextRoute:`/world/${u}/music`,nextState:{bgUrl:w}}}),!1),[m,f,i,u,w]),me=d.useCallback(async({itemType:fe,itemId:be})=>{if(!ue())throw new Error("Please log in to unlock.");const ze=fe==="track"?{itemType:"track",trackId:be}:fe==="album"?{itemType:"album",albumId:be}:{itemType:fe,itemId:be},tt=await Cu("/api/checkout/session",{method:"POST",headers:{"x-profile-key":String(u||""),Authorization:`Bearer ${String(f)}`,...b?{"x-user-id":String(b)}:{}},body:JSON.stringify(ze)});if(!tt?.url)throw new Error("No checkout URL returned");return String(tt.url)},[ue,u,f,b]),Ve=d.useCallback(async fe=>{const be=String(fe||"").trim();if(!be)throw new Error("Missing checkout url");window.open(be,"_blank","noopener,noreferrer")},[]),ht=d.useCallback(async(fe,be=!0)=>{try{await le();const ze=be?"preview":"full";Y(be),W(fe._id),V(fe),O(!1),R(0),v(0);const tt=await Cu(`/api/music/tracks/${fe._id}/stream?mode=${ze}`,{headers:te()});if(!tt?.url)throw new Error("No stream url returned");const dt=new Audio;dt.src=tt.url,dt.preload="auto",dt.crossOrigin="anonymous",M.current=dt,dt.onloadedmetadata=()=>{const nn=Number.isFinite(dt.duration)?dt.duration:0;v(nn||(fe.durationSeconds?Number(fe.durationSeconds):0))};const At=Math.max(1,Number(fe.previewSeconds||30));X(),k.current=setInterval(()=>{if(!M.current)return;const nn=Number(M.current.currentTime||0);R(nn),be&&nn>=At&&le()},250),dt.onended=()=>{if(!be&&j)try{dt.currentTime=0,dt.play().catch(()=>{})}catch{}else le()},await dt.play(),O(!0)}catch(ze){console.error("[MusicPage] play error =>",ze?.message||ze),le(),alert("Playback error: unable to play this track right now.")}},[te,j,le,X]),et=d.useCallback(async()=>{const fe=M.current;if(fe)try{ie?(fe.pause(),O(!1)):(await fe.play(),O(!0))}catch(be){console.error("[MusicPage] toggle play/pause error =>",be?.message||be)}},[ie]),Jt=d.useCallback(fe=>{const be=M.current;if(!be)return;let tt=Number.isFinite(be.duration)?be.duration:H||0;if(A&&F){const At=Math.max(1,Number(F.previewSeconds||30));tt=Math.min(tt||At,At)}const dt=Math.max(0,Math.min(Number(fe||0),tt||0));try{be.currentTime=dt,R(dt)}catch{}},[H,A,F]),en=d.useCallback(fe=>{Jt(I+fe)},[Jt,I]),tn=d.useMemo(()=>A&&F?Math.max(1,Number(F.previewSeconds||30)):Math.max(0,H||(F?.durationSeconds?Number(F.durationSeconds):0)),[A,F,H]),Bn=d.useMemo(()=>Math.max(0,Math.min(100,I/(tn||1)*100)),[I,tn]),$a=d.useCallback(async fe=>{if(!(!ue()||!confirm(`Open checkout to unlock "${fe.title}"?`)))try{const ze=await me({itemType:"track",itemId:String(fe._id)});await Ve(ze)}catch(ze){alert(ze?.message||"Could not start checkout.")}},[ue,me,Ve]),qn=d.useCallback(async fe=>{if(!(!ue()||!confirm(`Open checkout to unlock album "${fe.title}"?`)))try{const ze=await me({itemType:"album",itemId:String(fe._id)});await Ve(ze)}catch(ze){alert(ze?.message||"Could not start checkout.")}},[ue,me,Ve]),En=d.useCallback(()=>{le(),i(-1)},[i,le]);return a.jsxs("div",{className:"ms-root",children:[a.jsx("div",{className:"ms-bg",style:w?{backgroundImage:`url(${w})`}:void 0}),a.jsx("div",{className:"ms-dim"}),a.jsxs("div",{className:"ms-shell",children:[a.jsxs("div",{className:"ms-top",children:[a.jsx("button",{className:"ms-iconBtn",onClick:En,"aria-label":"Close",children:"✕"}),a.jsxs("div",{className:"ms-topCenter",children:[a.jsx("div",{className:"ms-title",children:"Music"}),m?null:a.jsx("div",{className:"ms-authHint",children:"Sign in to unlock full tracks."})]}),a.jsxs("div",{className:"ms-chip",children:[a.jsx("span",{className:"ms-chipIcon",children:"♫"}),a.jsxs("span",{className:"ms-chipText",children:[N," Radio"]})]})]}),q?a.jsx("div",{className:"ms-error",children:q}):null,T?a.jsx("div",{className:"ms-center",children:a.jsx("div",{className:"ms-muted",children:"Loading vibes…"})}):a.jsxs("div",{className:"ms-body",children:[L.length?a.jsxs("div",{className:"ms-section ms-narrow",children:[a.jsxs("div",{className:"ms-sectionHead",children:[a.jsx("div",{className:"ms-sectionTitle",children:"Albums"}),D?a.jsx("button",{className:"ms-clear",onClick:()=>Q(null),children:"Clear"}):null]}),a.jsx("div",{className:"ms-albums",children:L.map(fe=>{const be=N0(fe.priceCents||0,fe.currency||"usd"),ze=D===fe._id;return a.jsxs("button",{className:`ms-albumCard ${ze?"ms-albumCardSelected":""}`,onClick:()=>Q(tt=>tt===fe._id?null:fe._id),children:[a.jsx("div",{className:"ms-albumArt",children:fe.coverImageUrl?a.jsx("img",{src:fe.coverImageUrl,alt:""}):a.jsx("div",{className:"ms-albumArtPh",children:"♫"})}),a.jsxs("div",{className:"ms-albumInfo",children:[a.jsxs("div",{className:"ms-albumTop",children:[a.jsx("div",{className:"ms-albumTitle",title:fe.title,children:fe.title}),a.jsxs("button",{className:"ms-unlockBtn",onClick:tt=>{tt.stopPropagation(),qn(fe)},title:"Unlock (opens web checkout)",children:[a.jsx("span",{className:"ms-globe",children:"🌐"}),a.jsx("span",{children:"Unlock"}),a.jsx("span",{className:"ms-price",children:be})]})]}),a.jsxs("div",{className:"ms-albumMeta",children:[fe.trackCount||0," tracks • Album"]}),ze?a.jsx("div",{className:"ms-viewing",children:"Viewing"}):null]})]},fe._id)})})]}):null,a.jsxs("div",{className:"ms-section ms-narrow ms-sectionGrow",children:[a.jsxs("div",{className:"ms-sectionTitle",children:["Tracks",pe?` • ${pe}`:""]}),a.jsx("div",{className:"ms-tracks",children:ae.map(fe=>{const be=!!fe.isOwned,ze=N0(fe.priceCents||0,fe.currency||"usd"),tt=$===fe._id,dt=fe.durationSeconds?Math.round(Number(fe.durationSeconds)/60):0,At=`${fe.albumTitle||"Single"}${dt?` • ${dt} min`:""}`,nn=tt&&ie?"⏸":"▶";return a.jsxs("div",{className:`ms-trackRow ${tt?"ms-trackRowActive":""}`,children:[a.jsxs("div",{className:"ms-trackLeft",children:[a.jsx("div",{className:"ms-trackArt",children:fe.coverImageUrl?a.jsx("img",{src:fe.coverImageUrl,alt:""}):a.jsx("div",{className:"ms-trackArtPh",children:"♫"})}),a.jsx("button",{className:`ms-playBtn ${tt?"ms-playBtnActive":""}`,onClick:()=>{tt&&M.current?et():ht(fe,!be)},"aria-label":"Play/Pause",title:be?"Play":"Play preview",children:nn}),a.jsxs("div",{className:"ms-trackText",children:[a.jsx("div",{className:"ms-trackTitle",title:fe.title,children:fe.title}),a.jsx("div",{className:"ms-trackSub",title:At,children:At})]})]}),a.jsxs("div",{className:"ms-trackActions",children:[be?a.jsx("div",{className:"ms-ownedPill",title:"Unlocked",children:"✓ Unlocked"}):a.jsxs("button",{className:"ms-unlockPill",onClick:()=>$a(fe),title:"Unlock (opens web checkout)",children:[a.jsx("span",{className:"ms-globe",children:"🌐"}),a.jsx("span",{className:"ms-unlockWord",children:"Unlock"}),a.jsx("span",{className:"ms-price",children:ze})]}),a.jsx("div",{className:`ms-badge ${be?"ms-badgeOwned":""}`,children:be?"Full Access":"30s Preview"})]})]},fe._id)})})]})]}),F?a.jsxs("div",{className:"ms-player",children:[a.jsxs("div",{className:"ms-playerTop",children:[a.jsx("div",{className:"ms-playerArt",children:F.coverImageUrl?a.jsx("img",{src:F.coverImageUrl,alt:""}):a.jsx("div",{className:"ms-playerArtPh",children:"♫"})}),a.jsxs("div",{className:"ms-playerText",children:[a.jsx("div",{className:"ms-playerTitle",title:F.title,children:F.title}),a.jsx("div",{className:"ms-playerSub",title:F.albumTitle||"Single",children:(F.albumTitle||"Single")+(A?" • Preview":"")})]}),a.jsxs("div",{className:"ms-playerTime",children:[A0(I)," / ",A0(tn)]})]}),a.jsx("div",{className:"ms-bar",role:"slider","aria-label":"Seek",onClick:fe=>{const be=fe.currentTarget.getBoundingClientRect(),ze=(fe.clientX-be.left)/be.width;Jt(ze*tn)},children:a.jsx("div",{className:"ms-barFill",style:{width:`${Bn}%`}})}),a.jsxs("div",{className:"ms-controls",children:[a.jsx("button",{className:"ms-ctl",onClick:()=>en(-10),title:"Rewind 10s",children:"⏮"}),a.jsx("button",{className:"ms-ctl ms-ctlPrimary",onClick:et,title:"Play/Pause",children:ie?"⏸":"▶"}),a.jsx("button",{className:"ms-ctl",onClick:()=>en(10),title:"Forward 10s",children:"⏭"}),a.jsx("button",{className:"ms-ctl",onClick:le,title:"Stop",children:"⏹"}),a.jsx("button",{className:`ms-ctl ${j?"ms-repeatOn":""}`,onClick:()=>{A||K(fe=>!fe)},title:A?"Repeat disabled in preview":"Repeat",disabled:A,children:"⟲"})]}),a.jsxs("div",{className:"ms-playerNote",children:["Tip: Locked tracks play a short preview. Use ",a.jsx("span",{className:"ms-noteStrong",children:"Unlock"})," to open checkout."]})]}):null]}),a.jsx("style",{children:`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.16);
          --cyan: #00ffff;
        }

        .ms-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .ms-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
          transform: translateZ(0);
        }
        .ms-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 22% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.90));
        }

        .ms-shell{
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 22px 22px 140px;
        }

        .ms-narrow{
          max-width: 980px;
          margin: 0 auto;
        }

        .ms-top{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }
        .ms-iconBtn{
          width: 36px; height: 36px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .ms-iconBtn:hover{ border-color: var(--stroke2); }
        .ms-iconBtn:active{ transform: scale(0.98); opacity: 0.92; }

        .ms-topCenter{
          flex: 1;
          display:flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
        }
        .ms-title{
          font-size: 34px;
          font-weight: 950;
          letter-spacing: 0.6px;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
          line-height: 1.06;
        }
        .ms-authHint{
          margin-top: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.2px;
        }

        .ms-chip{
          height: 34px;
          display:flex;
          align-items:center;
          gap: 8px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
          white-space: nowrap;
        }
        .ms-chipIcon{ opacity: 0.9; }
        .ms-chipText{
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.4px;
          color: rgba(255,255,255,0.88);
        }

        .ms-error{
          margin-top: 6px;
          color: rgba(252,165,165,0.95);
          font-size: 12px;
          letter-spacing: 0.2px;
        }

        .ms-center{
          margin-top: 22px;
          min-height: 44vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
        }
        .ms-muted{
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.3px;
        }

        .ms-body{
          display:flex;
          flex-direction: column;
          gap: 18px;
        }

        .ms-sectionGrow{ margin-top: 6px; }

        .ms-sectionHead{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .ms-sectionTitle{
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.9px;
          color: rgba(255,255,255,0.90);
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .ms-sectionHead .ms-sectionTitle{ margin-bottom: 0; }

        .ms-clear{
          height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.86);
          cursor:pointer;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.3px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Albums */
        .ms-albums{
          display:grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 12px;
        }
        .ms-albumCard{
          grid-column: span 6;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.42);
          overflow:hidden;
          padding: 12px;
          display:flex;
          gap: 12px;
          align-items:center;
          cursor:pointer;
          text-align:left;
          color:#fff;
          transition: transform 140ms ease, border-color 140ms ease;
        }
        .ms-albumCard:hover{ transform: translateY(-1px); border-color: var(--stroke2); }
        .ms-albumCardSelected{ border-color: rgba(0,255,255,0.55); }

        .ms-albumArt{
          width: 82px; height: 82px;
          border-radius: 16px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.25);
          flex: 0 0 auto;
        }
        .ms-albumArt img{ width:100%; height:100%; object-fit: cover; display:block; }
        .ms-albumArtPh{
          width:100%; height:100%;
          display:grid; place-items:center;
          color: rgba(0,255,255,0.9);
          font-weight: 950;
          font-size: 18px;
          background: radial-gradient(500px 220px at 30% 20%, rgba(0,255,255,0.18), rgba(0,0,0,0) 60%);
        }
        .ms-albumInfo{ flex:1; min-width:0; }
        .ms-albumTop{ display:flex; align-items:center; justify-content: space-between; gap: 12px; }
        .ms-albumTitle{
          font-weight: 950;
          font-size: 14px;
          letter-spacing: 0.2px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width:0;
          flex: 1;
        }
        .ms-albumMeta{ margin-top: 6px; color: rgba(255,255,255,0.68); font-size: 12px; }
        .ms-viewing{ margin-top: 6px; font-size: 11px; font-weight: 950; color: rgba(0,255,255,0.95); }

        .ms-unlockBtn{
          height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.55);
          color: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          gap: 8px;
          cursor:pointer;
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .ms-unlockBtn:hover{ border-color: rgba(255,255,255,0.22); }
        .ms-globe{ opacity: 0.9; }
        .ms-price{ opacity: 0.88; }

        /* Tracks (NEW: compact, no “long pill” look) */
        .ms-tracks{
          display:flex;
          flex-direction: column;
          gap: 12px;
        }

        .ms-trackRow{
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 52px rgba(0,0,0,0.42);
          padding: 12px 12px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 14px;
        }
        .ms-trackRow:hover{
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }
        .ms-trackRowActive{
          border-color: rgba(0,255,255,0.34);
          box-shadow: 0 22px 60px rgba(0,0,0,0.50);
        }

        .ms-trackLeft{
          display:flex;
          align-items:center;
          gap: 12px;
          min-width:0;
        }

        .ms-trackArt{
          width: 46px;
          height: 46px;
          border-radius: 14px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.25);
          flex: 0 0 auto;
        }
        .ms-trackArt img{ width:100%; height:100%; object-fit: cover; display:block; }
        .ms-trackArtPh{
          width:100%; height:100%;
          display:grid; place-items:center;
          color: rgba(0,255,255,0.9);
          font-weight: 950;
          font-size: 14px;
          background: radial-gradient(400px 180px at 30% 20%, rgba(0,255,255,0.16), rgba(0,0,0,0) 60%);
        }

        .ms-playBtn{
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(0,255,255,0.55);
          background: rgba(0,0,0,0.35);
          color: rgba(0,255,255,0.95);
          display:grid;
          place-items:center;
          cursor:pointer;
          flex: 0 0 auto;
          transition: transform 120ms ease, background 120ms ease;
        }
        .ms-playBtn:hover{ background: rgba(0,255,255,0.10); }
        .ms-playBtn:active{ transform: scale(0.98); }
        .ms-playBtnActive{ background: rgba(0,255,255,0.12); }

        .ms-trackText{ min-width:0; }
        .ms-trackTitle{
          font-weight: 950;
          font-size: 15px;
          letter-spacing: 0.2px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 52vw;
        }
        .ms-trackSub{
          margin-top: 5px;
          color: rgba(255,255,255,0.64);
          font-size: 12px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 52vw;
        }

        /* RIGHT SIDE: compact “action stack” */
        .ms-trackActions{
          display:flex;
          flex-direction: column;
          align-items:flex-end;
          gap: 8px;
          min-width: 190px;
        }

        .ms-unlockPill{
          height: 34px;
          width: 100%;
          justify-content: center;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.55);
          color: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          gap: 8px;
          cursor:pointer;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .ms-unlockPill:hover{ border-color: rgba(255,255,255,0.22); }
        .ms-unlockWord{ opacity: 0.95; }

        .ms-ownedPill{
          height: 34px;
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(0,255,0,0.28);
          background: rgba(0,0,0,0.45);
          color: rgba(0,255,0,0.92);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .ms-badge{
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(0,255,255,0.30);
          color: rgba(0,255,255,0.95);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.25px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(0,0,0,0.26);
          width: fit-content;
        }
        .ms-badgeOwned{
          border-color: rgba(0,255,0,0.35);
          color: rgba(0,255,0,0.95);
        }

        /* Player */
        .ms-player{
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 16px;
          width: min(1200px, calc(100% - 32px));
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.38);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 20px 70px rgba(0,0,0,0.55);
          padding: 12px 12px 10px;
          z-index: 5;
        }

        .ms-playerTop{
          display:flex;
          align-items:center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .ms-playerArt{
          width: 44px;
          height: 44px;
          border-radius: 12px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.25);
          flex: 0 0 auto;
        }
        .ms-playerArt img{ width:100%; height:100%; object-fit: cover; display:block; }
        .ms-playerArtPh{ width:100%; height:100%; display:grid; place-items:center; color: rgba(0,255,255,0.9); font-weight: 950; }

        .ms-playerText{ flex: 1; min-width:0; }
        .ms-playerTitle{ font-weight: 950; font-size: 13px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ms-playerSub{ margin-top: 4px; color: rgba(255,255,255,0.62); font-size: 12px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ms-playerTime{ color: rgba(255,255,255,0.80); font-size: 12px; font-weight: 900; white-space: nowrap; }

        .ms-bar{ height: 6px; border-radius: 999px; background: rgba(255,255,255,0.10); overflow:hidden; cursor:pointer; margin-bottom: 10px; }
        .ms-barFill{ height: 100%; border-radius: 999px; background: var(--cyan); width: 0%; }

        .ms-controls{ display:flex; align-items:center; justify-content: space-between; gap: 10px; }
        .ms-ctl{
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.92);
          display:grid;
          place-items:center;
          cursor:pointer;
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .ms-ctl:active{ transform: scale(0.98); opacity: 0.92; }
        .ms-ctlPrimary{ background: var(--cyan); border-color: var(--cyan); color: #020617; font-weight: 950; }
        .ms-repeatOn{ background: var(--cyan); border-color: var(--cyan); color: #020617; }
        .ms-ctl:disabled{ opacity: 0.45; cursor:not-allowed; }

        .ms-playerNote{ margin-top: 8px; color: rgba(255,255,255,0.62); font-size: 12px; }
        .ms-noteStrong{ color: rgba(255,255,255,0.88); font-weight: 950; }

        @media (max-width: 980px){
          .ms-albumCard{ grid-column: span 12; }
          .ms-trackActions{ min-width: 170px; }
          .ms-trackTitle, .ms-trackSub{ max-width: 46vw; }
        }
        @media (max-width: 720px){
          .ms-title{ font-size: 28px; }
          .ms-chip{ display:none; }

          .ms-trackRow{
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .ms-trackActions{
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            min-width: 0;
          }
          .ms-unlockPill, .ms-ownedPill{ width: auto; padding: 0 12px; }
          .ms-trackTitle, .ms-trackSub{ max-width: 70vw; }
        }
        @media (prefers-reduced-motion: reduce){
          .ms-iconBtn, .ms-albumCard, .ms-playBtn, .ms-ctl, .ms-trackRow{ transition: none; }
        }
      `})]})}const Ru={box:{key:"box",label:"Box 4–4–4–4",description:"Balanced reset for calm focus.",pattern:[{phase:"Inhale",seconds:4},{phase:"Hold",seconds:4},{phase:"Exhale",seconds:4},{phase:"Hold",seconds:4}]},calm:{key:"calm",label:"Calm 4–2–6",description:"Long exhales to release tension.",pattern:[{phase:"Inhale",seconds:4},{phase:"Hold",seconds:2},{phase:"Exhale",seconds:6}]}},B5=["box","calm"],U0=["I breathe in clarity and exhale what no longer serves me.","Nothing outside of me controls my peace; I choose how I respond.","I allow myself to feel, to heal, and to grow at my own pace.","Every breath brings me back to myself, present and grounded.","I am enough, even in the moments I feel undone."],M5=["Calm","Focused","Recharging","Grateful","Processing","Grounded"];function L5(i){switch(i){case"Inhale":return 1.12;case"Exhale":return .86;default:return 1}}function _5(i){return i==="Inhale"?"radial-gradient(circle at 30% 30%, rgba(120,220,255,0.85), rgba(120,220,255,0.18) 60%, rgba(120,220,255,0.06))":i==="Exhale"?"radial-gradient(circle at 30% 30%, rgba(190,150,255,0.78), rgba(120,100,255,0.16) 60%, rgba(120,100,255,0.06))":"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.48), rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.04))"}function D5({text:i,speed:o=30}){const[c,u]=d.useState("");return d.useEffect(()=>{let f=0;u("");const p=setInterval(()=>{f+=1,u(i.slice(0,f)),f>=i.length&&clearInterval(p)},o);return()=>clearInterval(p)},[i,o]),a.jsxs("div",{style:je.card,children:[a.jsx("div",{style:je.cardSheen}),a.jsx("div",{style:je.cardHeaderRow,children:a.jsx("div",{style:je.cardKicker,children:"Affirmation"})}),a.jsx("div",{style:je.affText,children:c})]})}function $5(){const{profileKey:i}=Fe(),o=_e(),[c,u]=d.useState("box"),[f,p]=d.useState(!1),[m,b]=d.useState(0),[x,h]=d.useState(null),S=d.useRef(null),w=Ru[c],N=w.pattern[m],L=N.phase,B=d.useMemo(()=>{const T=Math.floor(Date.now()/864e5);return U0[T%U0.length]},[]),U=d.useMemo(()=>L5(L),[L]),C=d.useMemo(()=>_5(L),[L]);return d.useEffect(()=>{b(0),p(!1),S.current&&(clearTimeout(S.current),S.current=null)},[c]),d.useEffect(()=>{if(!f){S.current&&(clearTimeout(S.current),S.current=null);return}const T=N.seconds*1e3;return S.current=setTimeout(()=>{b(E=>{const D=Ru[c].pattern;return(E+1)%D.length})},T),()=>{S.current&&(clearTimeout(S.current),S.current=null)}},[f,m,c,N.seconds]),a.jsxs("div",{style:je.page,children:[a.jsx("div",{style:je.bg}),a.jsxs("div",{style:je.header,children:[a.jsx("button",{onClick:()=>o(`/world/${i}`),style:je.backBtn,"aria-label":"Back",children:a.jsx("span",{style:je.chev,children:"‹"})}),a.jsxs("div",{style:je.headerCenter,children:[a.jsx("div",{style:je.title,children:"Energy"}),a.jsx("div",{style:je.subtitle,children:"BREATH • WORDS • PRESENCE"})]}),a.jsx("div",{style:{width:40}})]}),a.jsxs("div",{style:je.container,children:[a.jsxs("div",{style:je.card,children:[a.jsx("div",{style:je.cardSheen}),a.jsxs("div",{style:je.cardHeaderRow,children:[a.jsxs("div",{children:[a.jsx("div",{style:je.cardKicker,children:"Breathing"}),a.jsx("div",{style:je.cardTitle,children:w.label}),a.jsx("div",{style:je.cardDesc,children:w.description})]}),a.jsxs("div",{style:je.phasePill,children:[a.jsx("div",{style:je.phaseBig,children:N.phase}),a.jsxs("div",{style:je.phaseSmall,children:[N.seconds,"s"]})]})]}),a.jsxs("div",{style:je.breathGrid,children:[a.jsxs("div",{style:je.controlsCol,children:[a.jsx("div",{style:je.chipsRow,children:B5.map(T=>{const E=T===c;return a.jsx("button",{onClick:()=>u(T),style:{...je.chip,...E?je.chipActive:null},children:a.jsx("span",{style:{...je.chipText,...E?je.chipTextActive:null},children:Ru[T].label})},T)})}),a.jsxs("div",{style:je.ctaRow,children:[a.jsxs("button",{onClick:()=>p(T=>!T),style:{...je.ctaBtn,...f?je.ctaBtnRunning:null},children:[a.jsx("span",{style:je.ctaIcon,children:f?"❚❚":"▶"}),a.jsx("span",{style:je.ctaText,children:f?"Pause":"Start"})]}),a.jsxs(On,{to:`/world/${i}`,style:je.link,children:["Return to ",i]})]}),a.jsxs("div",{style:je.tipBox,children:[a.jsx("div",{style:je.tipTitle,children:"Tip"}),a.jsx("div",{style:je.tipText,children:"Match the orb. Inhale as it expands. Exhale as it softens."})]})]}),a.jsx("div",{style:je.orbCol,children:a.jsx("div",{style:je.orbWrap,children:a.jsx("div",{style:{...je.orb,backgroundImage:C,transform:`scale(${U})`}})})})]})]}),a.jsx(D5,{text:B}),a.jsxs("div",{style:je.card,children:[a.jsx("div",{style:je.cardSheen}),a.jsx("div",{style:je.cardHeaderRow,children:a.jsxs("div",{children:[a.jsx("div",{style:je.cardKicker,children:"Check-in"}),a.jsx("div",{style:je.cardTitle,children:"How are you moving right now?"})]})}),a.jsx("div",{style:je.moodRow,children:M5.map(T=>{const E=T===x;return a.jsx("button",{onClick:()=>h(T),style:{...je.chip,...E?je.chipActive:null},children:a.jsx("span",{style:{...je.chipText,...E?je.chipTextActive:null},children:T})},T)})}),x&&a.jsxs("div",{style:je.moodReflection,children:["Noted. Today you’re feeling ",a.jsx("b",{children:x.toLowerCase()}),"."]})]}),a.jsx("div",{style:{height:28}})]})]})}const je={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflowX:"hidden",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},bg:{position:"fixed",inset:0,background:"radial-gradient(900px 520px at 20% 0%, rgba(120,220,255,0.10), transparent 60%),radial-gradient(850px 520px at 80% 20%, rgba(190,150,255,0.10), transparent 60%),linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.96))",pointerEvents:"none"},header:{position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:12,padding:"12px 16px 10px",backdropFilter:"blur(10px)",backgroundColor:"rgba(0,0,0,0.35)",borderBottom:"1px solid rgba(255,255,255,0.08)"},backBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer",display:"grid",placeItems:"center"},chev:{fontSize:22,lineHeight:"22px",transform:"translateX(-1px)"},headerCenter:{flex:1,textAlign:"center"},title:{fontSize:20,fontWeight:850,letterSpacing:.8},subtitle:{marginTop:3,fontSize:11,color:"#cfd3dc",letterSpacing:1.2},container:{width:"100%",maxWidth:980,margin:"0 auto",padding:"18px 16px",display:"flex",flexDirection:"column",gap:14},card:{position:"relative",borderRadius:22,overflow:"hidden",padding:16,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(14px)",boxShadow:"0 18px 50px rgba(0,0,0,0.55)"},cardSheen:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",pointerEvents:"none"},cardHeaderRow:{position:"relative",display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start"},cardKicker:{color:"#a5b0ff",fontSize:11,letterSpacing:.9,textTransform:"uppercase"},cardTitle:{marginTop:6,fontSize:16,fontWeight:800,letterSpacing:.2},cardDesc:{marginTop:6,fontSize:12,color:"#cfd3dc",maxWidth:520,lineHeight:"18px"},phasePill:{minWidth:92,padding:"10px 12px",borderRadius:16,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.28)",textAlign:"right"},phaseBig:{fontSize:13,fontWeight:800},phaseSmall:{marginTop:2,fontSize:12,color:"#cfd3dc"},breathGrid:{position:"relative",marginTop:14,display:"grid",gridTemplateColumns:"1.05fr 0.95fr",gap:14,alignItems:"center"},controlsCol:{display:"flex",flexDirection:"column",gap:12},chipsRow:{display:"flex",flexWrap:"wrap",gap:8},chip:{padding:"7px 11px",borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(0,0,0,0.35)",cursor:"pointer"},chipActive:{background:"#fff",borderColor:"#fff"},chipText:{color:"#e0e4ff",fontSize:11,letterSpacing:.6},chipTextActive:{color:"#000",fontWeight:800},ctaRow:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},ctaBtn:{border:0,borderRadius:999,padding:"10px 14px",background:"#fff",color:"#000",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10},ctaBtnRunning:{background:"rgba(255,255,255,0.86)"},ctaIcon:{fontSize:13,fontWeight:900},ctaText:{fontSize:13,fontWeight:900,letterSpacing:.6},link:{color:"rgba(0,255,255,0.85)",textDecoration:"none",fontSize:12},tipBox:{padding:12,borderRadius:16,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(0,0,0,0.25)"},tipTitle:{fontSize:11,letterSpacing:.8,textTransform:"uppercase",color:"#a5b0ff"},tipText:{marginTop:6,fontSize:12,color:"#cfd3dc",lineHeight:"18px"},orbCol:{display:"grid",placeItems:"center"},orbWrap:{width:"100%",display:"grid",placeItems:"center",padding:"8px 0"},orb:{width:170,height:170,borderRadius:999,border:"1px solid rgba(255,255,255,0.20)",backgroundColor:"rgba(255,255,255,0.08)",boxShadow:"0 24px 48px rgba(0,0,0,0.65), inset 0 0 26px rgba(255,255,255,0.06)",transition:"transform 900ms ease-in-out, filter 900ms ease-in-out",filter:"saturate(1.15)"},affText:{position:"relative",marginTop:10,fontSize:14,lineHeight:"20px"},moodRow:{position:"relative",marginTop:12,display:"flex",flexWrap:"wrap",gap:8},moodReflection:{position:"relative",marginTop:12,fontSize:12,color:"#cfd3dc"}};if(typeof window<"u"){const i=()=>{const o=window.innerWidth||0;document.documentElement.dataset.energyNarrow=o<720?"1":"0"};i(),window.addEventListener("resize",i)}const O0=je.breathGrid;je.breathGrid={...O0,gridTemplateColumns:typeof document<"u"&&document.documentElement.dataset.energyNarrow==="1"?"1fr":O0.gridTemplateColumns};const or=1,tl=50;function H5(i,o,c,u){const f=parseInt(i,10);return Number.isFinite(f)?Math.max(o,Math.min(c,f)):u}function Ym(){const[i,o]=d.useState([]);return{bursts:i,fire:(u=90)=>{const f=`${Date.now()}-${Math.random()}`,p=Array.from({length:u}).map((m,b)=>({id:`${f}-${b}`,left:Math.random()*100,delay:Math.random()*160,dur:900+Math.random()*900,rot:(Math.random()*720-360).toFixed(0),drift:(Math.random()*120-60).toFixed(0),size:5+Math.random()*6,opacity:.65+Math.random()*.35,hue:Math.floor(Math.random()*360)}));o(m=>[...m,{id:f,pieces:p}]),setTimeout(()=>{o(m=>m.filter(b=>b.id!==f))},2200)}}}function B0({label:i,active:o,onClick:c}){return a.jsx("button",{onClick:c,style:{...we.tab,...o?we.tabActive:null},children:a.jsx("span",{style:{...we.tabText,...o?we.tabTextActive:null},children:i})})}function Fm({bursts:i}){return i.length?a.jsx("div",{style:we.confettiLayer,"aria-hidden":!0,children:i.map(o=>o.pieces.map(c=>a.jsx("span",{style:{...we.confettiPiece,left:`${c.left}%`,width:c.size,height:c.size*1.6,opacity:c.opacity,background:`hsl(${c.hue} 90% 60%)`,animationDuration:`${c.dur}ms`,animationDelay:`${c.delay}ms`,transform:"translateX(0px) rotate(0deg)","--drift":`${c.drift}px`,"--rot":`${c.rot}deg`}},c.id)))}):null}function I5(){const{bursts:i,fire:o}=Ym(),[c,u]=d.useState(()=>Math.floor(Math.random()*(tl-or+1))+or),[f,p]=d.useState(""),[m,b]=d.useState("Pick a number and take a shot."),[x,h]=d.useState(0),[S,w]=d.useState(!1),[N,L]=d.useState(Date.now()),[B,U]=d.useState(0);d.useEffect(()=>{if(S)return;const E=setInterval(()=>U(Math.floor((Date.now()-N)/1e3)),1e3);return()=>clearInterval(E)},[N,S]);const C=()=>{u(Math.floor(Math.random()*(tl-or+1))+or),p(""),b("New number locked in. Take your guess."),h(0),w(!1),U(0),L(Date.now())},T=()=>{const E=H5(f,-999999,999999,NaN);if(!Number.isFinite(E)){b("Type a number first.");return}if(E<or||E>tl){b(`Keep it between ${or} and ${tl}.`);return}const D=x+1;h(D),E===c?(b(`You got it in ${D} ${D===1?"try":"tries"} 🎉`),w(!0),o(110)):E<c?b("Too low. Try going higher."):b("Too high. Try going lower.")};return a.jsxs("div",{style:we.card,children:[a.jsx("div",{style:we.cardSheen}),a.jsx(Fm,{bursts:i}),a.jsxs("div",{style:we.cardHeader,children:[a.jsxs("div",{children:[a.jsx("div",{style:we.kicker,children:"Guessing Game"}),a.jsxs("div",{style:we.h2,children:["Pick ",or,"–",tl]}),a.jsx("div",{style:we.desc,children:"Try to land the secret number with as few attempts as possible."})]}),a.jsx("div",{style:we.iconBadge,title:"dice","aria-label":"dice",children:"🎲"})]}),a.jsx("div",{style:we.hint,children:m}),a.jsxs("div",{style:we.row,children:[a.jsx("input",{value:f,onChange:E=>p(E.target.value),inputMode:"numeric",placeholder:"Your guess",style:we.input,onKeyDown:E=>{E.key==="Enter"&&T()}}),a.jsx("button",{onClick:T,style:we.primaryBtn,children:"Guess"})]}),a.jsxs("div",{style:we.statsRow,children:[a.jsxs("div",{style:we.stat,children:["Attempts: ",a.jsx("b",{style:we.statB,children:x})]}),a.jsxs("div",{style:we.stat,children:["Time: ",a.jsxs("b",{style:we.statB,children:[B,"s"]})]})]}),S&&a.jsx("button",{onClick:C,style:we.secondaryBtn,children:"↻ Play Again"})]})}function K5(){const{bursts:i,fire:o}=Ym(),[c,u]=d.useState("idle"),[f,p]=d.useState(null),[m,b]=d.useState("Click “Start Round”, then wait for the cue."),x=d.useRef(null),h=d.useRef(null),S=()=>{x.current&&(clearTimeout(x.current),x.current=null)};d.useEffect(()=>()=>S(),[]);const w=()=>{S(),p(null),u("waiting"),b("Wait for it…");const B=1500+Math.random()*1500;x.current=setTimeout(()=>{h.current=Date.now(),u("ready"),b("Tap now!")},B)},N=()=>{if(c==="waiting"){S(),u("result"),p(null),b("Too early 🫠 Start another round.");return}if(c==="ready"){const B=Date.now(),U=B-(h.current||B);p(U),u("result"),U<300?(b(`Lightning fast: ${U} ms ⚡`),o(120)):U<500?b(`Nice reflexes: ${U} ms 👌`):b(`Reaction: ${U} ms — you can go faster 😌`)}},L=d.useMemo(()=>c==="ready"?{...we.orb,backgroundImage:we.orbReadyBg,boxShadow:we.orbReadyShadow}:c==="result"?{...we.orb,backgroundImage:we.orbResultBg}:c==="waiting"?{...we.orb,opacity:.9}:we.orb,[c]);return a.jsxs("div",{style:we.card,children:[a.jsx("div",{style:we.cardSheen}),a.jsx(Fm,{bursts:i}),a.jsxs("div",{style:we.cardHeader,children:[a.jsxs("div",{children:[a.jsx("div",{style:we.kicker,children:"Reflex Game"}),a.jsx("div",{style:we.h2,children:"Reaction timer"}),a.jsx("div",{style:we.desc,children:"Start, wait for the light, then click the pad as fast as you can."})]}),a.jsx("div",{style:we.iconBadge,title:"flash","aria-label":"flash",children:"⚡"})]}),a.jsx("div",{style:we.hint,children:m}),a.jsx("button",{onClick:N,style:we.tapPad,children:a.jsxs("div",{style:we.tapInner,children:[a.jsx("div",{style:L}),a.jsx("div",{style:we.tapText,children:c==="ready"?"TAP!":"Tap inside when it lights up"})]})}),a.jsxs("div",{style:we.bottomRow,children:[a.jsxs("button",{onClick:w,style:we.secondaryBtn,children:["▶ ",c==="waiting"?"Restart Round":"Start Round"]}),f!=null&&a.jsxs("div",{style:we.stat,children:["Last: ",a.jsxs("b",{style:we.statB,children:[f," ms"]})]})]})]})}function q5(){const{profileKey:i}=Fe(),o=_e(),[c,u]=d.useState("guess");return a.jsxs("div",{style:we.page,children:[a.jsx("style",{children:W5}),a.jsx("div",{style:we.bg}),a.jsxs("div",{style:we.header,children:[a.jsx("button",{onClick:()=>o(`/world/${i}`),style:we.backBtn,"aria-label":"Back",children:a.jsx("span",{style:we.chev,children:"‹"})}),a.jsxs("div",{style:we.headerCenter,children:[a.jsx("div",{style:we.title,children:"Games"}),a.jsx("div",{style:we.subtitle,children:"LIGHT PLAY • QUICK RESET"})]}),a.jsx("div",{style:{width:40}})]}),a.jsxs("div",{style:we.container,children:[a.jsxs("div",{style:we.selectorCard,children:[a.jsx("div",{style:we.selectorSheen}),a.jsxs("div",{style:we.selectorInner,children:[a.jsx(B0,{label:"Guessing",active:c==="guess",onClick:()=>u("guess")}),a.jsx(B0,{label:"Reflex",active:c==="reflex",onClick:()=>u("reflex")})]}),a.jsx("div",{style:we.selectorMeta,children:a.jsxs(On,{to:`/world/${i}`,style:we.link,children:["Return to ",i]})})]}),c==="guess"?a.jsx(I5,{}):a.jsx(K5,{}),a.jsx("div",{style:{height:28}})]})]})}const we={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflowX:"hidden",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},bg:{position:"fixed",inset:0,background:"radial-gradient(900px 520px at 18% 0%, rgba(120,220,255,0.09), transparent 60%),radial-gradient(850px 520px at 82% 20%, rgba(190,150,255,0.09), transparent 60%),linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.96))",pointerEvents:"none"},header:{position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:12,padding:"12px 16px 10px",backdropFilter:"blur(10px)",backgroundColor:"rgba(0,0,0,0.35)",borderBottom:"1px solid rgba(255,255,255,0.08)"},backBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer",display:"grid",placeItems:"center"},chev:{fontSize:22,lineHeight:"22px",transform:"translateX(-1px)"},headerCenter:{flex:1,textAlign:"center"},title:{fontSize:20,fontWeight:850,letterSpacing:.8},subtitle:{marginTop:3,fontSize:11,color:"#cfd3dc",letterSpacing:1.2},container:{width:"100%",maxWidth:980,margin:"0 auto",padding:"18px 16px",display:"flex",flexDirection:"column",gap:14},selectorCard:{position:"relative",borderRadius:18,overflow:"hidden",padding:10,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(14px)",boxShadow:"0 18px 50px rgba(0,0,0,0.55)"},selectorSheen:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",pointerEvents:"none"},selectorInner:{position:"relative",display:"flex",gap:8},selectorMeta:{position:"relative",marginTop:8,display:"flex",justifyContent:"center"},tab:{flex:1,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.35)",borderRadius:999,padding:"10px 12px",cursor:"pointer"},tabActive:{background:"#fff",borderColor:"#fff"},tabText:{color:"#e0e4ff",fontSize:12,fontWeight:700,letterSpacing:.7},tabTextActive:{color:"#000",fontWeight:900},card:{position:"relative",borderRadius:22,overflow:"hidden",padding:16,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(14px)",boxShadow:"0 18px 50px rgba(0,0,0,0.55)"},cardSheen:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",pointerEvents:"none"},cardHeader:{position:"relative",display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start"},kicker:{color:"#a5b0ff",fontSize:11,letterSpacing:.9,textTransform:"uppercase"},h2:{marginTop:6,fontSize:16,fontWeight:900,letterSpacing:.2},desc:{marginTop:6,fontSize:12,color:"#cfd3dc",maxWidth:620,lineHeight:"18px"},iconBadge:{width:36,height:36,borderRadius:12,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.28)",display:"grid",placeItems:"center",fontSize:16},hint:{position:"relative",marginTop:10,marginBottom:12,color:"#e9ecff",fontSize:13},row:{position:"relative",display:"flex",gap:10,alignItems:"center"},input:{flex:1,borderRadius:999,border:"1px solid rgba(255,255,255,0.22)",padding:"10px 12px",color:"#fff",background:"rgba(0,0,0,0.35)",outline:"none"},primaryBtn:{border:0,borderRadius:999,padding:"10px 14px",background:"#fff",color:"#000",cursor:"pointer",fontWeight:900,letterSpacing:.6},secondaryBtn:{border:0,borderRadius:999,padding:"10px 14px",background:"#fff",color:"#000",cursor:"pointer",fontWeight:900,letterSpacing:.6,marginTop:12,display:"inline-flex",alignItems:"center",gap:8},statsRow:{position:"relative",marginTop:10,display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"},stat:{color:"#cfd3dc",fontSize:12},statB:{fontWeight:900,color:"#fff"},tapPad:{position:"relative",width:"100%",marginTop:8,borderRadius:18,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.35)",padding:16,cursor:"pointer",textAlign:"center"},tapInner:{display:"grid",placeItems:"center",gap:10,padding:"10px 0"},tapText:{color:"#cfd3dc",fontSize:12,letterSpacing:.6},orb:{width:120,height:120,borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",backgroundImage:"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.36), rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.03))",boxShadow:"0 18px 42px rgba(0,0,0,0.65), inset 0 0 22px rgba(255,255,255,0.06)",transition:"filter 200ms ease"},orbReadyBg:"radial-gradient(circle at 30% 30%, rgba(120,220,255,0.92), rgba(120,220,255,0.18) 60%, rgba(120,220,255,0.06))",orbReadyShadow:"0 20px 52px rgba(0,0,0,0.65), 0 0 0 6px rgba(120,220,255,0.08), inset 0 0 22px rgba(255,255,255,0.06)",orbResultBg:"radial-gradient(circle at 30% 30%, rgba(190,150,255,0.75), rgba(120,100,255,0.14) 60%, rgba(120,100,255,0.06))",bottomRow:{position:"relative",marginTop:12,display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"},link:{color:"rgba(0,255,255,0.85)",textDecoration:"none",fontSize:12},confettiLayer:{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:5},confettiPiece:{position:"absolute",top:"-12px",borderRadius:2,animationName:"confettiFall",animationTimingFunction:"cubic-bezier(0.2, 0.8, 0.2, 1)",animationFillMode:"forwards"}},W5=`
@keyframes confettiFall {
  0%   { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translateX(var(--drift)) translateY(520px) rotate(var(--rot)); opacity: 0; }
}

/* responsive stacking */
@media (max-width: 720px) {
  .__games_container { padding: 14px 12px; }
}
`;function Ju(i){return String(i||"").trim().toLowerCase()}function G5(i){return String(i).trim().replace(/\/+$/,"")}function Vm(i){const o=Ju(i),c=o?Rn(o):null,u=c?.apiBaseUrl||c?.endpoints?.apiBaseUrl||void 0||"https://indiverse-backend.onrender.com";return G5(u)}async function qu(i,o,c={}){const u=Ju(i);if(!u)throw new Error("Missing profileKey for profileFetchRaw");const f=Vm(u);if(!f)throw new Error(`Missing apiBaseUrl for profileKey=${u}`);const p=String(o||"").startsWith("/")?o:`/${o}`,m=`${f}${p}`;console.log("🌐 [profileFetchRaw] base=",f,"url=",m,"profileKey=",u);const b={...c.headers||{},"x-profile-key":u};return fetch(m,{...c,headers:b})}async function M0(i,o,c={}){const u=Ju(i);if(!u)return{ok:!1,error:"Missing profileKey for profileFetch"};const f=Vm(u);if(!f)return{ok:!1,error:`Missing apiBaseUrl for profileKey=${u}`};const p=String(o||"").startsWith("/")?o:`/${o}`,m=`${f}${p}`;console.log("🌐 [profileFetch] base=",f,"url=",m,"profileKey=",u);const b={...c.headers||{},"x-profile-key":u};let x;try{x=await fetch(m,{...c,headers:b})}catch(w){return{ok:!1,error:w?.message||"Network error"}}const h=await x.text();let S=null;try{S=h?JSON.parse(h):null}catch{S=h||null}if(!x.ok){const w=S&&(S.error||S.message)||`Request failed (${x.status})`;return{ok:!1,status:x.status,error:w,raw:S}}return S&&typeof S=="object"?S:{ok:!0,status:x.status,data:S}}function Y5(i){const o=Number(i||0);if(!o||o<=0)return"Pricing on request";const c=(o/100).toFixed(0);return`$${Number(c).toLocaleString()}`}function L0(i,o){return String(i?._id||i?.id||o||"")}function F5(){const{profileKey:i="lamont"}=Fe(),o=_e(),{cartCount:c}=Zu(),[u,f]=d.useState([]),[p,m]=d.useState(!0),[b,x]=d.useState(!1),[h,S]=d.useState(null),w=d.useCallback(async(D={isRefresh:!1})=>{try{D.isRefresh?x(!0):m(!0);const Q=await qu(i,"/api/products",{method:"GET",headers:{Accept:"application/json"}});if(!Q.ok){const J=await Q.text().catch(()=>"");throw console.log("[ProductsPage] non-OK",Q.status,J.slice(0,300)),new Error("Failed to load products")}const q=await Q.json();f(Array.isArray(q)?q:[]),S(null)}catch(Q){console.log("Error loading products:",Q),S("Unable to load products at the moment.")}finally{m(!1),x(!1)}},[i]);d.useEffect(()=>{let D=!0;return(async()=>D&&await w({isRefresh:!1}))(),()=>{D=!1}},[w]);const N=d.useMemo(()=>Array.isArray(u)?[...u]:[],[u]),L=u.length%2===1,B=u.length-1,U=u.length===1,C=()=>o(`/world/${i}`),T=()=>o(`/world/${i}/cart?mode=products`),E=D=>{const Q=L0(D);Q&&o(`/world/${i}/products/${Q}`,{state:{product:D,profileKey:i,cartMode:"products"}})};return a.jsxs("div",{style:Me.page,children:[a.jsx("div",{style:Me.bg}),a.jsxs("div",{style:Me.header,children:[a.jsx("button",{onClick:C,style:Me.iconBtn,"aria-label":"Back",children:"‹"}),a.jsxs("div",{style:Me.headerCenter,children:[a.jsxs("div",{style:Me.titleRow,children:[a.jsx("span",{style:Me.dot}),a.jsx("div",{style:Me.title,children:"Products"})]}),a.jsx("div",{style:Me.subtitle,children:"DROPS • ESSENTIALS • EXCLUSIVE"})]}),a.jsxs("button",{onClick:T,style:Me.iconBtn,"aria-label":"Cart",children:["🛒",c>0&&a.jsx("span",{style:Me.cartBadge,children:c>9?"9+":c})]})]}),a.jsxs("div",{style:Me.container,children:[a.jsxs("div",{style:Me.topRow,children:[a.jsx("button",{onClick:()=>w({isRefresh:!0}),style:Me.refreshBtn,disabled:p||b,title:"Refresh",children:b?"Refreshing…":"Refresh"}),a.jsxs(On,{to:`/world/${i}`,style:Me.link,children:["Return to ",i]})]}),p?a.jsxs("div",{style:Me.center,children:[a.jsx("div",{className:"pp-spin",style:Me.spinner}),a.jsx("div",{style:Me.muted,children:"Loading products…"})]}):h?a.jsx("div",{style:Me.center,children:a.jsx("div",{style:Me.error,children:h})}):u.length===0?a.jsx("div",{style:Me.center,children:a.jsx("div",{style:Me.muted,children:"No products yet. Check back soon."})}):a.jsx("div",{className:`pp-grid ${U?"pp-grid--single":""}`,style:Me.grid,children:N.map((D,Q)=>{const q=L0(D,Q),M=!U&&L&&Q===B,$=D?.imageUrl||"",W=D?.name||"Item",F=Y5(D?.priceCents),V=D?.inStock!==!1;return a.jsx("button",{onClick:()=>E(D),className:`pp-tileBtn ${M?"pp-span-sm":""}`,style:Me.tileBtn,title:W,children:a.jsx("div",{className:"pp-tile",style:Me.tile,children:a.jsxs("div",{className:"pp-mediaWrap",style:Me.mediaWrap,children:[$?a.jsx("img",{src:$,alt:W,className:"pp-media",style:Me.media,loading:"lazy",onError:A=>{A.currentTarget.style.display="none"}}):a.jsxs("div",{style:Me.mediaPlaceholder,children:[a.jsx("div",{style:{fontSize:16,opacity:.9},children:"🖼️"}),a.jsx("div",{style:Me.mediaPlaceholderText,children:"No image"})]}),a.jsxs("div",{style:Me.topOverlay,children:[a.jsx("div",{style:Me.pill,children:"PRODUCT"}),!V&&a.jsx("div",{style:{...Me.pill,...Me.pillDanger},children:"OUT"})]}),a.jsx("div",{style:Me.bottomOverlay,children:a.jsxs("div",{style:Me.bottomRow,children:[a.jsx("div",{style:Me.name,title:W,children:W}),a.jsx("div",{style:Me.price,children:F})]})}),a.jsx("div",{style:Me.fadeTop}),a.jsx("div",{style:Me.fadeBottom})]})})},q)})}),a.jsx("div",{style:{height:28}})]}),a.jsx("style",{children:V5})]})}const Me={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflowX:"hidden",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},bg:{position:"fixed",inset:0,background:"radial-gradient(900px 520px at 18% 0%, rgba(96,165,250,0.10), transparent 60%),radial-gradient(850px 520px at 82% 20%, rgba(249,115,115,0.09), transparent 60%),linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.99))",pointerEvents:"none"},header:{position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:10,padding:"12px 14px 10px",backdropFilter:"blur(10px)",backgroundColor:"rgba(0,0,0,0.40)",borderBottom:"1px solid rgba(255,255,255,0.08)"},iconBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer",display:"grid",placeItems:"center",position:"relative",fontSize:18},cartBadge:{position:"absolute",top:-6,right:-8,minWidth:18,height:18,padding:"0 5px",borderRadius:999,background:"#f97373",color:"#fff",fontSize:10,fontWeight:900,display:"grid",placeItems:"center",border:"1px solid rgba(0,0,0,0.35)"},headerCenter:{flex:1,textAlign:"center"},titleRow:{display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center"},dot:{width:9,height:9,borderRadius:999,background:"rgba(96,165,250,0.95)",boxShadow:"0 0 0 5px rgba(96,165,250,0.12)"},title:{fontSize:18,fontWeight:900,letterSpacing:1},subtitle:{marginTop:3,fontSize:10,color:"#cfd3dc",letterSpacing:1.2},container:{width:"100%",maxWidth:1380,margin:"0 auto",padding:"14px 12px"},topRow:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:12},refreshBtn:{border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.35)",color:"#fff",borderRadius:999,padding:"9px 12px",cursor:"pointer",fontWeight:800,letterSpacing:.6,fontSize:12},link:{color:"rgba(0,255,255,0.85)",textDecoration:"none",fontSize:12},center:{minHeight:240,display:"grid",placeItems:"center",gap:10,padding:24,textAlign:"center"},spinner:{width:18,height:18,borderRadius:999,border:"2px solid rgba(255,255,255,0.18)",borderTopColor:"#fff"},muted:{color:"#cfd3dc",fontSize:13},error:{color:"#fca5a5",fontSize:13},grid:{display:"grid",gap:10},tileBtn:{border:0,padding:0,background:"transparent",cursor:"pointer",textAlign:"left"},tile:{borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(0,0,0,0.35)",boxShadow:"0 14px 34px rgba(0,0,0,0.42)"},mediaWrap:{position:"relative",width:"100%",aspectRatio:"1 / 1",background:"rgba(15,23,42,0.92)",overflow:"hidden"},media:{width:"100%",height:"100%",display:"block",objectFit:"cover",objectPosition:"center"},mediaPlaceholder:{width:"100%",height:"100%",display:"grid",placeItems:"center",gap:6,color:"rgba(255,255,255,0.8)"},mediaPlaceholderText:{fontSize:11,fontWeight:800,opacity:.8},fadeTop:{position:"absolute",top:0,left:0,right:0,height:56,background:"linear-gradient(rgba(0,0,0,0.55), transparent)",pointerEvents:"none"},fadeBottom:{position:"absolute",left:0,right:0,bottom:0,height:76,background:"linear-gradient(transparent, rgba(0,0,0,0.75))",pointerEvents:"none"},topOverlay:{position:"absolute",top:8,left:8,right:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,pointerEvents:"none"},pill:{padding:"5px 9px",borderRadius:999,background:"rgba(0,0,0,0.55)",border:"1px solid rgba(255,255,255,0.18)",fontSize:9,fontWeight:900,letterSpacing:.9},pillDanger:{background:"rgba(185,28,28,0.55)",border:"1px solid rgba(255,255,255,0.20)"},bottomOverlay:{position:"absolute",left:8,right:8,bottom:8,pointerEvents:"none"},bottomRow:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8},name:{flex:1,fontSize:12,fontWeight:900,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},price:{color:"#f97373",fontWeight:900,fontSize:11}},V5=`
@keyframes ppSpin { to { transform: rotate(360deg); } }
.pp-spin { animation: ppSpin 0.9s linear infinite; }

/* ✅ IG feed: more columns as screen grows */
.pp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 720px)  { .pp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 980px)  { .pp-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (min-width: 1220px) { .pp-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
@media (min-width: 1500px) { .pp-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } }

/* ✅ single product: centered, compact */
.pp-grid--single {
  grid-template-columns: minmax(0, 420px);
  justify-content: center;
}

/* ✅ odd last item spans ONLY on small screens (2-col) */
.pp-span-sm { }
@media (max-width: 719px) {
  .pp-span-sm { grid-column: 1 / -1; }
}

/* hover */
.pp-tile { transition: transform 140ms ease, box-shadow 140ms ease; }
.pp-tileBtn:hover .pp-tile { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(0,0,0,0.55); }

/* focus */
button:focus { outline: none; }
button:focus-visible { outline: 2px solid rgba(0,255,255,0.6); outline-offset: 2px; border-radius: 14px; }
`;function _0(i){const o=Number(i||0);if(!o||o<=0)return"Pricing on request";const c=(o/100).toFixed(0);return`$${Number(c).toLocaleString()}`}function D0(i){const o=[],c=new Set;for(const u of Array.isArray(i)?i:[]){const f=String(u||"").trim();if(!f)continue;const p=f.toLowerCase();c.has(p)||(c.add(p),o.push(f))}return o}function No(i,o){return String(i||"").trim().toLowerCase()===String(o||"").trim().toLowerCase()}function X5(i){return String(i?._id||i?.id||"")}function Q5(){const{profileKey:i="lamont",productId:o=""}=Fe(),c=_e(),u=Ge(),{addItem:f}=Zu(),p=u?.state?.product||null,[m,b]=d.useState(p),[x,h]=d.useState(!p),[S,w]=d.useState(null),[N,L]=d.useState(1),B=d.useMemo(()=>D0(m?.sizes),[m]),U=d.useMemo(()=>D0(m?.colors),[m]),[C,T]=d.useState(""),[E,D]=d.useState("");d.useEffect(()=>{let j=!0;async function K(){if(p){b(p),h(!1),w(null);return}h(!0),w(null);try{const I=await qu(i,`/api/products/${encodeURIComponent(o)}`,{method:"GET",headers:{Accept:"application/json"}});if(I.ok){const R=await I.json();if(!j)return;b(R),h(!1);return}}catch{}try{const I=await qu(i,"/api/products",{method:"GET",headers:{Accept:"application/json"}});if(!I.ok)throw new Error("Failed list fetch");const R=await I.json(),H=(Array.isArray(R)?R:[]).find(v=>X5(v)===String(o));if(!j)return;if(H){b(H),h(!1);return}w("Product not found.")}catch{if(!j)return;w("Unable to load product at the moment.")}finally{if(!j)return;h(!1)}}return K(),()=>{j=!1}},[i,o,p]),d.useEffect(()=>{L(1),T(B.length===1?B[0]:""),D(U.length===1?U[0]:"")},[m?._id,m?.id]),d.useEffect(()=>{m&&(C&&B.length>0?B.some(K=>No(K,C))||T(B.length===1?B[0]:""):!C&&B.length===1&&T(B[0]))},[B.join("|")]),d.useEffect(()=>{m&&(E&&U.length>0?U.some(K=>No(K,E))||D(U.length===1?U[0]:""):!E&&U.length===1&&D(U[0]))},[U.join("|")]);const Q=!!m?.priceCents&&Number(m.priceCents)>0,q=d.useMemo(()=>m?_0(m?.priceCents):"",[m]),J=d.useMemo(()=>m?Q?_0(Number(m.priceCents)*N):"Pricing on request":"",[m,Q,N]),M=B.length>0,$=U.length>0,W=()=>m?m?.inStock===!1?(window.alert("Out of stock: This item is currently unavailable."),!1):M&&!C?(window.alert("Select a size before continuing."),!1):$&&!E?(window.alert("Select a color before continuing."),!1):!0:!1,F=d.useMemo(()=>{const j=String(m?._id||m?.id||o||"");return{profileKey:i,itemType:"product",productId:j,selectedSize:C||void 0,selectedColor:E||void 0}},[i,m,o,C,E]),V=()=>c(`/world/${i}/products`),A=()=>L(j=>j>1?j-1:1),Y=()=>L(j=>j<99?j+1:99),ie=()=>{W()&&(f(m,N,F),window.alert(`Added to cart: ${N} × ${m?.name||"Item"}`))},O=()=>{W()&&(f(m,N,F),c(`/world/${i}/cart?mode=products&fromBuyNow=1`))};return a.jsxs("div",{style:he.page,children:[a.jsx("div",{style:he.bg}),a.jsxs("div",{style:he.header,children:[a.jsx("button",{onClick:V,style:he.iconBtn,"aria-label":"Back",children:"‹"}),a.jsxs("div",{style:he.headerCenter,children:[a.jsx("div",{style:he.headerTitle,title:m?.name||"Product",children:m?.name||"Product"}),a.jsx("div",{style:he.headerSub,children:"DROPS • ESSENTIALS • EXCLUSIVE"})]}),a.jsx("div",{style:{width:40}})]}),a.jsxs("div",{style:he.container,children:[x?a.jsxs("div",{style:he.center,children:[a.jsx("div",{className:"pd-spin",style:he.spinner}),a.jsx("div",{style:he.muted,children:"Loading product…"})]}):S?a.jsxs("div",{style:he.center,children:[a.jsx("div",{style:he.error,children:S}),a.jsx(On,{to:`/world/${i}/products`,style:he.link,children:"Back to products"})]}):m?a.jsx(a.Fragment,{children:a.jsxs("div",{className:"pd-grid",style:he.grid,children:[a.jsxs("div",{className:"pd-left",style:he.leftCol,children:[a.jsxs("div",{className:"pd-gallery",style:he.galleryCard,children:[a.jsx("div",{style:he.sheen}),m?.imageUrl?a.jsx("img",{src:m.imageUrl,alt:m?.name||"Product",style:he.galleryImg,onError:j=>{j.currentTarget.style.display="none"}}):a.jsxs("div",{style:he.galleryPlaceholder,children:[a.jsx("div",{style:{fontSize:24},children:"🧊"}),a.jsx("div",{style:he.galleryPlaceholderText,children:"Image coming soon"})]}),a.jsxs("div",{style:he.galleryOverlayTop,children:[a.jsx("div",{style:he.pill,children:"PRODUCT"}),m?.inStock===!1?a.jsx("div",{style:{...he.pill,...he.pillDanger},children:"OUT"}):null]})]}),a.jsxs("div",{className:"pd-links",style:he.linksRow,children:[a.jsx(On,{to:`/world/${i}/products`,style:he.link,children:"← Back to products"}),a.jsx(On,{to:`/world/${i}/cart?mode=products`,style:he.link,children:"Open cart"})]})]}),a.jsxs("div",{className:"pd-right",style:he.rightCol,children:[a.jsxs("div",{style:he.detailsCard,children:[a.jsx("div",{style:he.sheen}),a.jsxs("div",{style:he.topRow,children:[a.jsxs("div",{style:{minWidth:0,flex:1},children:[a.jsx("div",{style:he.name,children:m?.name}),m?.category?a.jsx("div",{style:he.meta,children:String(m.category).toUpperCase()}):null,m?.description?a.jsx("div",{style:he.desc,children:m.description}):null]}),a.jsxs("div",{style:he.priceBox,children:[a.jsx("div",{style:he.priceLabel,children:"Price"}),a.jsx("div",{style:he.priceValue,children:q})]})]}),B.length>0&&a.jsxs("div",{style:he.section,children:[a.jsx("div",{style:he.sectionLabel,children:"Size"}),a.jsx("div",{style:he.chipRow,children:B.map(j=>{const K=No(C,j);return a.jsx("button",{onClick:()=>T(j),style:{...he.chip,...K?he.chipActive:null},children:a.jsx("span",{style:{...he.chipText,...K?he.chipTextActive:null},children:j})},j)})})]}),U.length>0&&a.jsxs("div",{style:he.section,children:[a.jsx("div",{style:he.sectionLabel,children:"Color"}),a.jsx("div",{style:he.chipRow,children:U.map(j=>{const K=No(E,j);return a.jsx("button",{onClick:()=>D(j),style:{...he.chip,...K?he.chipActive:null},children:a.jsx("span",{style:{...he.chipText,...K?he.chipTextActive:null},children:j})},j)})})]}),a.jsxs("div",{style:he.summaryRow,children:[a.jsxs("div",{style:he.qtyBlock,children:[a.jsx("div",{style:he.sectionLabel,children:"Quantity"}),a.jsxs("div",{style:he.qtyControls,children:[a.jsx("button",{onClick:A,style:he.qtyBtn,"aria-label":"Decrease",children:"−"}),a.jsx("div",{style:he.qtyValue,children:N}),a.jsx("button",{onClick:Y,style:he.qtyBtn,"aria-label":"Increase",children:"+"})]})]}),a.jsxs("div",{style:he.subBlock,children:[a.jsx("div",{style:he.sectionLabel,children:"Subtotal"}),a.jsx("div",{style:he.subtotal,children:J})]})]}),(M||$)&&a.jsxs("div",{style:he.helper,children:[M&&!C?"Select a size. ":"",$&&!E?"Select a color.":""]}),a.jsxs("div",{className:"pd-linksMobile",style:he.linksRowMobile,children:[a.jsx(On,{to:`/world/${i}/products`,style:he.link,children:"← Back to products"}),a.jsx(On,{to:`/world/${i}/cart?mode=products`,style:he.link,children:"Open cart"})]})]}),a.jsxs("div",{className:"pd-cta",style:he.ctaBar,children:[a.jsx("button",{onClick:ie,style:he.ctaSecondary,children:"Add to cart"}),a.jsx("button",{onClick:O,style:{...he.ctaPrimary,...m?.inStock===!1?he.ctaDisabled:null},disabled:m?.inStock===!1,children:"Buy now"})]})]})]})}):a.jsx("div",{style:he.center,children:a.jsx("div",{style:he.error,children:"Product not found."})}),a.jsx("div",{style:{height:28}})]}),a.jsx("style",{children:P5})]})}const he={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflowX:"hidden",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},bg:{position:"fixed",inset:0,background:"radial-gradient(900px 520px at 18% 0%, rgba(96,165,250,0.10), transparent 60%),radial-gradient(850px 520px at 82% 20%, rgba(249,115,115,0.09), transparent 60%),linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.98))",pointerEvents:"none"},header:{position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:12,padding:"12px 16px 10px",backdropFilter:"blur(10px)",backgroundColor:"rgba(0,0,0,0.35)",borderBottom:"1px solid rgba(255,255,255,0.08)"},iconBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer",display:"grid",placeItems:"center",fontSize:22,lineHeight:"22px"},headerCenter:{flex:1,textAlign:"center"},headerTitle:{fontSize:18,fontWeight:900,letterSpacing:.6,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},headerSub:{marginTop:3,fontSize:11,color:"#cfd3dc",letterSpacing:1.2},container:{width:"100%",maxWidth:1180,margin:"0 auto",padding:"18px 16px"},grid:{display:"grid",gridTemplateColumns:"1fr",gap:14},leftCol:{minWidth:0},rightCol:{minWidth:0},galleryCard:{position:"relative",borderRadius:22,overflow:"hidden",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(14px)",boxShadow:"0 18px 50px rgba(0,0,0,0.55)"},galleryImg:{width:"100%",height:520,objectFit:"cover",objectPosition:"center",display:"block"},galleryPlaceholder:{height:520,display:"grid",placeItems:"center",gap:8,background:"rgba(15,23,42,0.9)"},galleryPlaceholderText:{color:"#cfd3dc",fontSize:12},galleryOverlayTop:{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,pointerEvents:"none"},detailsCard:{position:"relative",borderRadius:22,overflow:"hidden",padding:16,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(14px)",boxShadow:"0 18px 50px rgba(0,0,0,0.55)"},sheen:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",pointerEvents:"none"},topRow:{position:"relative",display:"flex",gap:14,alignItems:"flex-start",justifyContent:"space-between"},name:{fontSize:20,fontWeight:900},meta:{marginTop:6,fontSize:11,color:"#e5e7eb",letterSpacing:1,opacity:.9},desc:{marginTop:10,color:"#cbd5f5",fontSize:13,lineHeight:"18px"},priceBox:{position:"relative",minWidth:160,borderRadius:16,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.35)",textAlign:"right"},priceLabel:{fontSize:10,letterSpacing:1.2,textTransform:"uppercase",color:"#cfd3dc"},priceValue:{marginTop:6,color:"#f97373",fontWeight:900,fontSize:14},section:{position:"relative",marginTop:14},sectionLabel:{color:"#cfd3dc",fontSize:12,textTransform:"uppercase",letterSpacing:.8},chipRow:{marginTop:10,display:"flex",flexWrap:"wrap",gap:10},chip:{borderRadius:999,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.20)",background:"rgba(0,0,0,0.35)",cursor:"pointer"},chipActive:{border:"1px solid rgba(249,115,115,0.9)",background:"rgba(249,115,115,0.18)"},chipText:{color:"#e5e7eb",fontSize:12,fontWeight:900},chipTextActive:{color:"#fff"},summaryRow:{position:"relative",marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,alignItems:"end"},qtyBlock:{minWidth:0},subBlock:{minWidth:0,textAlign:"right"},qtyControls:{marginTop:10,display:"inline-flex",alignItems:"center",gap:10},qtyBtn:{width:36,height:36,borderRadius:999,border:"1px solid rgba(255,255,255,0.20)",background:"rgba(0,0,0,0.35)",color:"#fff",cursor:"pointer",fontSize:18,fontWeight:900,display:"grid",placeItems:"center"},qtyValue:{minWidth:24,textAlign:"center",fontWeight:900},subtotal:{marginTop:10,fontWeight:900,fontSize:16},helper:{position:"relative",marginTop:10,color:"#9ca3af",fontSize:11,textAlign:"center"},ctaBar:{marginTop:12,display:"flex",gap:10,padding:12,borderRadius:18,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(15,23,42,0.80)",backdropFilter:"blur(12px)"},ctaSecondary:{flex:1,borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(0,0,0,0.35)",color:"#fff",padding:"12px 14px",cursor:"pointer",fontWeight:900,letterSpacing:.8,textTransform:"uppercase",fontSize:12},ctaPrimary:{flex:1,borderRadius:999,border:0,background:"linear-gradient(90deg, #ff4b5c, #ff7b88)",color:"#fff",padding:"12px 14px",cursor:"pointer",fontWeight:900,letterSpacing:.8,textTransform:"uppercase",fontSize:12},ctaDisabled:{opacity:.55,cursor:"not-allowed"},linksRow:{marginTop:10,display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"},linksRowMobile:{display:"none",marginTop:14,justifyContent:"space-between",gap:12,flexWrap:"wrap"},link:{color:"rgba(0,255,255,0.85)",textDecoration:"none",fontSize:12},center:{minHeight:260,display:"grid",placeItems:"center",gap:10,padding:24,textAlign:"center"},spinner:{width:18,height:18,borderRadius:999,border:"2px solid rgba(255,255,255,0.18)",borderTopColor:"#fff"},muted:{color:"#cfd3dc",fontSize:13},error:{color:"#fca5a5",fontSize:13},pill:{padding:"6px 10px",borderRadius:999,background:"rgba(0,0,0,0.55)",border:"1px solid rgba(255,255,255,0.18)",fontSize:10,fontWeight:900,letterSpacing:.9},pillDanger:{background:"rgba(185,28,28,0.55)",border:"1px solid rgba(255,255,255,0.20)"}},P5=`
@keyframes pdSpin { to { transform: rotate(360deg); } }
.pd-spin { animation: pdSpin 0.9s linear infinite; }

.pd-grid { grid-template-columns: 1fr; }
@media (min-width: 980px) {
  .pd-grid { grid-template-columns: 1.1fr 0.9fr; align-items: start; }
  .pd-left { position: sticky; top: 86px; }
  .pd-cta { position: sticky; top: calc(86px + 540px + 14px); }
}

/* Mobile: show links inside details, not under image */
@media (max-width: 979px) {
  .pd-links { display: none !important; }
  .pd-linksMobile { display: flex !important; }
}

/* hover polish */
button:focus { outline: none; }
button:focus-visible { outline: 2px solid rgba(0,255,255,0.6); outline-offset: 2px; border-radius: 14px; }
`;function Eu(i){const o=Number(i||0);return!o||o<=0?"Pricing on request":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(o/100)}function Io(i){return String(i||"").trim().toLowerCase()}function Z5(i){return Io(i)==="products"?"products":"flowers"}function J5(i){const o=Io(i);return o?o==="products"?"product":o==="flowers"?"flower":o:""}function $0(i){return i?.productId||i?.id||i?._id||null}function e2(){const i=["buyerUserId_v1","buyerUserId","userId","auth:userId","indiverse:userId"];for(const c of i){const u=localStorage.getItem(c);if(u&&String(u).trim())return String(u).trim()}const o=localStorage.getItem("buyerUser");if(o)try{const c=JSON.parse(o);return c?.id||c?._id||c?.userId||c?.user?.id||c?.user?._id||null}catch{}return null}function t2(){const i=_e(),{profileKey:o}=Fe(),[c]=Pu(),u=Z5(c.get("mode")||c.get("cartMode")),f=Io(o),{items:p,addItem:m,removeItem:b,clearCartForProfile:x}=Zu(),[h,S]=d.useState(!1),w=d.useMemo(()=>(p||[]).filter(V=>{if(Io(V?.profileKey)!==f)return!1;const Y=J5(V?.itemType||V?.type||"");return u==="products"?Y?Y==="product":!!(V?.selectedSize||V?.selectedColor||Array.isArray(V?.sizes)||Array.isArray(V?.colors)):Y?Y==="arrangement"||Y==="flower":!(V?.selectedSize||V?.selectedColor||Array.isArray(V?.sizes)||Array.isArray(V?.colors))}),[p,u,f]),N=d.useMemo(()=>w.length>0&&w.every(V=>V?.priceCents&&Number(V.priceCents)>0),[w]),L=d.useMemo(()=>w.reduce((V,A)=>{const Y=Number(A?.quantity||1),ie=Number(A?.priceCents||0);return ie>0?V+ie*Y:V},0),[w]),B=N?Eu(L):"Pricing on request",U=d.useMemo(()=>w.reduce((V,A)=>V+Number(A?.quantity||1),0),[w]),C=w.length===0,T=C?"Your cart is empty":`${U} item${U===1?"":"s"} • Stripe-secured checkout`,E=u==="products"?"Browse products":"Browse arrangements",D=u==="products"?`/world/${o}/products`:`/world/${o}/arrangements`,Q=V=>m(V,1,{profileKey:o}),q=V=>{Number(V?.quantity||1)<=1||m(V,-1,{profileKey:o})},J=V=>{if(V?.lineKey)return b(V.lineKey);const A=V?.id||V?._id||null;if(A)return b(String(A));b(V)},M=()=>{if(u==="products"){x?.(o,{onlyItemType:"product"});return}x?.(o)},$=V=>{const A=V?.checkoutUrl||V?.url||null;if(!A)throw new Error("Checkout URL was not returned by the server.");window.location.href=A},W=async()=>{if(!w.length){alert(u==="products"?"Add a product to your cart first.":"Add an arrangement to your cart first.");return}if(!N){alert("Some items require pricing confirmation. Please request a consultation instead.");return}S(!0);try{if(u==="products"){const A=e2();if(!A){alert("Please log in — you must be logged in to checkout."),i(`/auth/login?next=${encodeURIComponent(`/world/${o}/cart?mode=products`)}`);return}const Y={userId:A,items:w.map(O=>({productId:String($0(O)||""),quantity:Number(O?.quantity||1),selectedSize:O?.selectedSize||O?.size||null,selectedColor:O?.selectedColor||O?.color||null}))},ie=await M0(o,"/api/checkout/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Y)});if(!ie?.ok)throw new Error(ie?.error||"Unable to start checkout.");$(ie);return}const V=await M0(o,"/api/flowers/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:w.map(A=>({id:String($0(A)||""),name:A?.name||"Arrangement",priceCents:Number(A?.priceCents||0),quantity:Number(A?.quantity||1),imageUrl:A?.imageUrl||null}))})});if(!V?.ok)throw new Error(V?.error||"Unable to start checkout.");$(V)}catch(V){console.log("Checkout error:",V),alert(V?.message||"Something went wrong starting checkout.")}finally{S(!1)}},F=()=>{const V=w.map(A=>`${Number(A?.quantity||1)} × ${A?.name||(u==="products"?"Product":"Arrangement")}`).join(`
`);alert(`Consultation request:

${V}

(Implement your web contact form / order request page next.)`)};return a.jsxs("div",{style:Oe.page,children:[a.jsx("div",{style:Oe.bg}),a.jsxs("div",{style:Oe.headerRow,children:[a.jsx("button",{onClick:()=>i(-1),style:Oe.iconBtn,"aria-label":"Back",children:"←"}),a.jsxs("div",{style:Oe.headerCenter,children:[a.jsxs("div",{style:Oe.headerTitleRow,children:[a.jsx("div",{style:Oe.cartDot}),a.jsx("div",{style:Oe.h1,children:"Cart"})]}),a.jsx("div",{style:Oe.sub,children:T})]}),a.jsx("div",{style:{width:36}})]}),C?a.jsxs("div",{style:Oe.center,children:[a.jsx("div",{style:Oe.emptyText,children:"Your cart is currently empty."}),a.jsx(On,{to:D,style:Oe.primaryLink,children:E})]}):a.jsxs(a.Fragment,{children:[a.jsx("div",{style:Oe.list,children:w.map((V,A)=>{const Y=Number(V?.quantity||1),ie=Number(V?.priceCents||0),O=ie>0?ie*Y:0,j=u==="products"?[V?.selectedSize?`Size: ${V.selectedSize}`:null,V?.selectedColor?`Color: ${V.selectedColor}`:null].filter(Boolean).join(" • "):V?.size||"";return a.jsx("div",{style:Oe.card,children:a.jsxs("div",{style:Oe.cardInner,children:[V?.imageUrl?a.jsx("img",{src:V.imageUrl,alt:V?.name||"Item",style:Oe.image}):a.jsx("div",{style:Oe.imagePh,children:a.jsx("span",{style:{opacity:.8},children:u==="products"?"▢":"✿"})}),a.jsxs("div",{style:Oe.cardText,children:[a.jsxs("div",{style:Oe.nameRow,children:[a.jsx("div",{style:Oe.name,title:V?.name||"",children:V?.name||(u==="products"?"Product":"Arrangement")}),a.jsx("button",{onClick:()=>J(V),style:Oe.trashBtn,"aria-label":"Remove",children:"✕"})]}),V?.category?a.jsx("div",{style:Oe.meta,children:String(V.category).toUpperCase()}):null,j?a.jsx("div",{style:Oe.meta,children:String(j).toUpperCase()}):null,a.jsxs("div",{style:Oe.rowBetween,children:[a.jsx("div",{style:Oe.unitPrice,children:ie>0?Eu(ie):"Pricing on request"}),a.jsxs("div",{style:Oe.qtyControl,children:[a.jsx("button",{onClick:()=>q(V),disabled:Y<=1,style:{...Oe.qtyBtn,opacity:Y<=1?.4:1,cursor:Y<=1?"not-allowed":"pointer"},children:"−"}),a.jsx("div",{style:Oe.qtyValue,children:Y}),a.jsx("button",{onClick:()=>Q(V),style:Oe.qtyBtn,children:"+"})]})]}),ie>0?a.jsxs("div",{style:Oe.lineTotalRow,children:[a.jsx("div",{style:Oe.lineTotalLabel,children:"Line total"}),a.jsx("div",{style:Oe.lineTotalValue,children:Eu(O)})]}):null]})]})},String(V?.lineKey||V?.id||V?._id||A))})}),a.jsxs("div",{style:Oe.footer,children:[a.jsxs("div",{style:Oe.summaryRow,children:[a.jsxs("div",{children:[a.jsx("div",{style:Oe.summaryLabel,children:"Subtotal"}),a.jsx("div",{style:Oe.summaryHint,children:"Taxes & delivery handled during Stripe checkout."})]}),a.jsx("div",{style:Oe.summaryValue,children:B})]}),a.jsxs("div",{style:Oe.footerBtns,children:[a.jsx("button",{onClick:M,style:Oe.clearBtn,children:"Clear Cart"}),a.jsx("button",{onClick:N?W:F,disabled:h,style:{...Oe.checkoutBtn,opacity:h?.8:1},children:h?"Opening…":N?"Checkout with Stripe":"Request consultation"})]})]})]})]})}const Oe={page:{minHeight:"100vh",background:"#000",color:"#fff",position:"relative",overflowX:"hidden",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},bg:{position:"fixed",inset:0,background:"radial-gradient(1000px 600px at 20% 10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(249,115,115,0.14), transparent 60%), linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,1))",zIndex:0},headerRow:{position:"sticky",top:0,zIndex:5,padding:"18px 18px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(10px)",background:"rgba(0,0,0,0.55)",borderBottom:"1px solid rgba(255,255,255,0.08)"},iconBtn:{width:36,height:36,borderRadius:18,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(0,0,0,0.35)",color:"#fff",cursor:"pointer"},headerCenter:{textAlign:"center",flex:1},headerTitleRow:{display:"flex",alignItems:"center",justifyContent:"center",gap:8},cartDot:{width:10,height:10,borderRadius:999,background:"rgba(165,180,252,0.9)",boxShadow:"0 0 14px rgba(165,180,252,0.5)"},h1:{fontSize:20,fontWeight:900,letterSpacing:1.1},sub:{marginTop:2,fontSize:11,letterSpacing:1,textTransform:"uppercase",color:"#cfd3dc"},center:{minHeight:"65vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,padding:24,position:"relative",zIndex:1},emptyText:{color:"#cfd3dc",fontSize:14,textAlign:"center"},primaryLink:{textDecoration:"none",color:"#fff",background:"linear-gradient(90deg, #4f46e5, #6366f1)",padding:"10px 16px",borderRadius:999,fontWeight:800,letterSpacing:.8,textTransform:"uppercase",fontSize:12},list:{padding:"14px 18px 120px",display:"grid",gap:14,position:"relative",zIndex:1,maxWidth:900,margin:"0 auto"},card:{borderRadius:18,overflow:"hidden",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",backdropFilter:"blur(10px)",boxShadow:"0 18px 40px rgba(0,0,0,0.35)"},cardInner:{display:"flex"},image:{width:110,height:110,objectFit:"cover"},imagePh:{width:110,height:110,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(15,23,42,0.9)",borderRight:"1px solid rgba(255,255,255,0.08)",fontSize:22},cardText:{flex:1,padding:12,display:"flex",flexDirection:"column",gap:6,minWidth:0},nameRow:{display:"flex",alignItems:"center",gap:10},name:{flex:1,fontWeight:900,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},trashBtn:{width:28,height:28,borderRadius:999,border:"none",background:"transparent",color:"#fca5a5",cursor:"pointer",fontSize:18,lineHeight:"28px"},meta:{color:"#e5e7eb",fontSize:11,letterSpacing:.8,opacity:.85},unitPrice:{color:"#f97373",fontWeight:900,fontSize:14},rowBetween:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginTop:4},qtyControl:{display:"flex",alignItems:"center",gap:8,background:"rgba(15,23,42,0.9)",borderRadius:999,border:"1px solid rgba(148,163,184,0.6)",padding:"4px 6px"},qtyBtn:{width:26,height:26,borderRadius:999,border:"none",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer",fontWeight:900},qtyValue:{minWidth:22,textAlign:"center",fontWeight:900},lineTotalRow:{display:"flex",justifyContent:"space-between",marginTop:6},lineTotalLabel:{color:"#9ca3af",fontSize:11},lineTotalValue:{color:"#f97373",fontSize:13,fontWeight:900},footer:{position:"fixed",left:0,right:0,bottom:0,padding:"12px 18px 16px",background:"rgba(15,23,42,0.96)",borderTop:"1px solid rgba(255,255,255,0.10)",backdropFilter:"blur(12px)",zIndex:6},summaryRow:{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:12,maxWidth:900,margin:"0 auto 10px"},summaryLabel:{color:"#e5e7eb",fontSize:13,fontWeight:700},summaryHint:{color:"#9ca3af",fontSize:11,marginTop:2},summaryValue:{color:"#f97373",fontSize:16,fontWeight:900},footerBtns:{display:"flex",gap:10,maxWidth:900,margin:"0 auto"},clearBtn:{flex:1,borderRadius:999,border:"1px solid rgba(248,113,113,0.35)",background:"rgba(0,0,0,0.25)",color:"#fecaca",padding:"12px 14px",fontWeight:900,letterSpacing:.8,textTransform:"uppercase",fontSize:12,cursor:"pointer"},checkoutBtn:{flex:2,borderRadius:999,border:"none",background:"linear-gradient(90deg, #22c55e, #16a34a)",color:"#fff",padding:"12px 14px",fontWeight:900,letterSpacing:1,textTransform:"uppercase",fontSize:12,cursor:"pointer"}},n2="https://indiverse-backend.onrender.com".trim()||"https://indiverse-backend.onrender.com",a2="web";let H0=null;function r2(){try{return H0?H0():null}catch{return null}}let i2=null;const I0="buyerUserId_v1";let nl=null;function K0(){return Math.random().toString(16).slice(2)+Date.now().toString(16)}async function l2(){if(nl)return nl;try{const i=localStorage.getItem(I0);if(i)return nl=i,i;const o=`buyer_web_${K0()}`;return localStorage.setItem(I0,o),nl=o,o}catch{const i=`buyer_web_${K0()}`;return nl=i,i}}function o2(i){return typeof FormData<"u"&&i instanceof FormData}function s2(i={}){return{...i,"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}}function c2(i,o){const c=String(i).replace(/\/+$/,""),u=String(o||""),f=u.startsWith("/")?u:`/${u}`;return`${c}${f}`}function u2(i){const o=`_ts=${Date.now()}`;return i.includes("?")?`${i}&${o}`:`${i}?${o}`}function Ao(i,o){if(!i)return!1;const c=String(o||"").toLowerCase();return Object.keys(i).some(u=>String(u).toLowerCase()===c)}function Uo(i,o,c){const u=String(o||"").toLowerCase(),p=Object.keys(i||{}).find(m=>String(m).toLowerCase()===u);p?i[p]=c:i[o]=c}async function Xm(i,o={}){const{profileKey:c,headers:u,auth:f="buyer",userId:p,includeUserId:m=!0,...b}=o,x=u2(c2(n2,i)),h=String(b.method||"GET").toUpperCase(),S=b.body!=null,w=o2(b.body);let N={Accept:"application/json","profile-lead":a2,...u||{}};if(N=s2(N),c&&!Ao(N,"x-profile-key")&&Uo(N,"x-profile-key",String(c)),S&&!w&&!Ao(N,"Content-Type")&&Uo(N,"Content-Type","application/json"),m&&!Ao(N,"x-user-id")){const B=String(p||await l2()||"").trim();B&&Uo(N,"x-user-id",B)}if(f!=="none"&&!Ao(N,"Authorization")){const B=r2();B&&Uo(N,"Authorization",`Bearer ${String(B)}`)}return await fetch(x,{...b,method:h,headers:N,mode:"cors",credentials:"include",cache:"no-store"})}const d2="https://montech-remote-config.s3.amazonaws.com/assets/test/bgvideo-1767903039953.mov";function Xr(i){return String(i||"").trim()}function f2(){const i=_e(),[o]=Pu(),[c,u]=d.useState(""),[f,p]=d.useState(""),[m,b]=d.useState(o.get("email")||""),[x,h]=d.useState(""),[S,w]=d.useState(!1),N=d.useMemo(()=>Xr(c).length>0&&Xr(f).length>0&&Xr(m).length>0&&String(x||"").length>=8,[c,f,m,x]),L=async()=>{const B=Xr(c),U=Xr(f),C=Xr(m).toLowerCase(),T=String(x||"");if(!B||!U||!C||!T){alert("All fields are required.");return}if(!C.includes("@")){alert("Enter a valid email.");return}if(T.length<8){alert("Password must be at least 8 characters.");return}try{w(!0);const E=await Xm("/api/auth/register",{method:"POST",body:JSON.stringify({firstName:B,lastName:U,email:C,password:T})}),D=await E.json().catch(()=>null);if(!E.ok||!D||D?.ok===!1||D?.error)throw new Error(D?.error||"Signup failed");alert("Account created. You can now sign in."),i(`/auth/login?email=${encodeURIComponent(C)}`)}catch(E){alert(E?.message||"Signup failed. Try again.")}finally{w(!1)}};return a.jsxs("div",{style:st.root,children:[a.jsx("video",{src:d2,style:st.video,autoPlay:!0,muted:!0,loop:!0,playsInline:!0}),a.jsx("div",{style:st.overlay}),a.jsx("div",{style:st.topRow,children:a.jsx("button",{onClick:()=>i(-1),style:st.backBtn,disabled:S,children:"← Back"})}),a.jsxs("div",{style:st.content,children:[a.jsxs("div",{style:st.header,children:[a.jsx("div",{style:st.superTitle,children:"MONTECH"}),a.jsx("div",{style:st.indiTitle,children:"INDIverse"})]}),a.jsxs("div",{style:st.cardWrap,children:[a.jsxs("div",{style:st.card,children:[a.jsx("div",{style:st.title,children:"SIGN UP"}),a.jsx("div",{style:st.sub,children:"Create your account."}),a.jsxs("div",{style:st.row,children:[a.jsxs("div",{style:st.half,children:[a.jsx("div",{style:st.label,children:"First name"}),a.jsx("input",{value:c,onChange:B=>u(B.target.value),placeholder:"First",style:st.input,disabled:S})]}),a.jsxs("div",{style:st.half,children:[a.jsx("div",{style:st.label,children:"Last name"}),a.jsx("input",{value:f,onChange:B=>p(B.target.value),placeholder:"Last",style:st.input,disabled:S})]})]}),a.jsxs("div",{style:{marginTop:10},children:[a.jsx("div",{style:st.label,children:"Email"}),a.jsx("input",{value:m,onChange:B=>b(B.target.value),placeholder:"you@example.com",style:st.input,disabled:S,autoComplete:"email"})]}),a.jsxs("div",{style:{marginTop:10},children:[a.jsx("div",{style:st.label,children:"Password"}),a.jsx("input",{value:x,onChange:B=>h(B.target.value),placeholder:"••••••••",style:st.input,disabled:S,type:"password",autoComplete:"new-password"}),a.jsx("div",{style:st.hint,children:"At least 8 characters."})]}),a.jsx("button",{onClick:L,disabled:S||!N,style:{...st.primaryBtn,opacity:S||!N?.55:1},children:S?"Creating…":"Create account"}),a.jsx("button",{onClick:()=>i(`/auth/login?email=${encodeURIComponent(m||"")}`),style:st.linkBtn,disabled:S,children:"Already have an account? Sign in"})]}),a.jsx("div",{style:st.poweredBy,children:"Powered by Montech"})]})]})]})}const st={root:{minHeight:"100vh",background:"#000",position:"relative",overflow:"hidden",fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial"},video:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:"scale(1.02)"},overlay:{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.82), rgba(0,0,0,0.92))"},topRow:{position:"relative",zIndex:2,padding:"20px 16px 0"},backBtn:{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:999,border:"1px solid rgba(148,163,184,0.25)",background:"rgba(15,23,42,0.45)",color:"#e5e7eb",fontWeight:800,cursor:"pointer"},content:{position:"relative",zIndex:2,padding:"16px 18px 24px",maxWidth:520,margin:"0 auto",minHeight:"calc(100vh - 60px)",display:"flex",flexDirection:"column"},header:{marginTop:10,marginBottom:12,textAlign:"center"},superTitle:{color:"#6b7280",fontSize:13,letterSpacing:3,textTransform:"uppercase",marginBottom:4},indiTitle:{fontSize:34,color:"#fff",fontWeight:900},cardWrap:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"},card:{borderRadius:22,padding:18,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(14px)"},title:{color:"#fff",fontSize:24,fontWeight:900,letterSpacing:2},sub:{color:"rgba(255,255,255,0.7)",marginTop:6,marginBottom:8},row:{display:"flex",gap:10},half:{flex:1},label:{color:"rgba(255,255,255,0.8)",fontWeight:800,marginBottom:6,fontSize:12},input:{width:"100%",padding:"12px 12px",borderRadius:14,border:"1px solid rgba(255,255,255,0.16)",background:"rgba(255,255,255,0.06)",color:"#fff",outline:"none",fontSize:14},hint:{marginTop:6,color:"rgba(255,255,255,0.45)",fontSize:12},primaryBtn:{marginTop:16,padding:"14px 14px",borderRadius:16,background:"rgba(255,255,255,0.9)",border:"none",width:"100%",fontWeight:900,letterSpacing:1,cursor:"pointer"},linkBtn:{marginTop:12,width:"100%",background:"transparent",border:"none",color:"rgba(255,255,255,0.72)",textDecoration:"underline",cursor:"pointer",fontSize:13},poweredBy:{marginTop:12,textAlign:"center",color:"rgba(255,255,255,0.35)",fontSize:12,letterSpacing:.4}};function ca(i){return String(i||"").trim()}function p2(){const i=_e(),o=Ge(),[c]=Pu(),u=d.useMemo(()=>ca(c.get("email")),[c]),f=d.useMemo(()=>ca(c.get("next")),[c]),p=ca(o?.state?.nextRoute)||f||"",m=o?.state?.nextState||null,[b,x]=d.useState(u||""),[h,S]=d.useState(""),[w,N]=d.useState(!1),[L,B]=d.useState(!1),U=()=>{if(p){i(p,m?{state:m}:void 0);return}i("/")},C=async()=>{const T=ca(b).toLowerCase(),E=String(h||"");if(!T||!E){alert("Enter email and password.");return}N(!0);try{const D=await Xm("/api/auth/login",{method:"POST",body:JSON.stringify({email:T,password:E})}),Q=await D.json().catch(()=>null);if(!D.ok||!Q){alert(Q?.error||"Unable to log in.");return}const q=ca(Q?.token)||ca(Q?.buyerToken)||ca(Q?.accessToken)||ca(Q?.jwt)||"";q&&(localStorage.setItem("buyerToken",q),localStorage.setItem("auth:isAuthed","1"));const J=ca(Q?.userId||Q?.id||Q?._id);J&&localStorage.setItem("buyerUserId",J),U()}catch(D){alert(D?.message||"Something went wrong.")}finally{N(!1)}};return a.jsxs("div",{style:qt.root,children:[a.jsx("div",{style:qt.bg}),a.jsx("div",{style:qt.center,children:a.jsxs("div",{style:qt.card,children:[a.jsx("div",{style:qt.title,children:"Sign in"}),a.jsx("div",{style:qt.sub,children:"Your IndiVerse account"}),a.jsxs("div",{style:qt.field,children:[a.jsx("span",{style:qt.icon,children:"✉️"}),a.jsx("input",{style:qt.input,placeholder:"Email",value:b,onChange:T=>x(T.target.value),autoCapitalize:"none",autoComplete:"email"})]}),a.jsxs("div",{style:qt.field,children:[a.jsx("span",{style:qt.icon,children:"🔒"}),a.jsx("input",{style:qt.input,placeholder:"Password",value:h,onChange:T=>S(T.target.value),type:L?"text":"password",onKeyDown:T=>T.key==="Enter"?C():null,autoComplete:"current-password"}),a.jsx("button",{onClick:()=>B(T=>!T),style:qt.eyeBtn,type:"button",disabled:w,children:L?"🙈":"👁️"})]}),a.jsx("button",{onClick:C,disabled:w,style:qt.btn,children:w?"Logging in…":"Login"}),a.jsx("button",{onClick:()=>i(-1),style:qt.link,disabled:w,children:"Back"})]})})]})}const qt={root:{minHeight:"100vh",background:"#05060b",position:"relative",fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Arial"},bg:{position:"absolute",inset:0,background:"linear-gradient(180deg, #0b1020, #090b14, #06070d)"},center:{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16},card:{width:"min(520px, 92vw)",borderRadius:18,padding:16,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(14px)"},title:{color:"#fff",fontSize:22,fontWeight:800},sub:{marginTop:6,color:"rgba(255,255,255,0.7)"},field:{marginTop:14,height:50,borderRadius:14,padding:"0 12px",border:"1px solid rgba(255,255,255,0.10)",display:"flex",alignItems:"center",gap:10},icon:{opacity:.75},input:{flex:1,color:"#fff",fontSize:16,background:"transparent",border:"none",outline:"none"},eyeBtn:{background:"transparent",border:"none",cursor:"pointer",opacity:.85,fontSize:16},btn:{marginTop:16,height:50,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.14)",border:"none",color:"#fff",fontWeight:800,cursor:"pointer",width:"100%"},link:{marginTop:12,width:"100%",background:"transparent",border:"none",color:"rgba(255,255,255,0.75)",cursor:"pointer"}},g2=3e3,m2="/auth/login";function h2(){const[i,o]=d.useState(!1),[c,u]=d.useState("");return d.useEffect(()=>{const f=()=>{try{const p=localStorage.getItem("auth:isAuthed")==="1",m=String(localStorage.getItem("buyerToken")||"").trim();o(p),u(m)}catch{o(!1),u("")}};return f(),window.addEventListener("focus",f),window.addEventListener("storage",f),()=>{window.removeEventListener("focus",f),window.removeEventListener("storage",f)}},[]),{booting:!1,isAuthed:i,token:c}}function b2(i){return String(i||"").trim().toLowerCase()||""}function rl(){try{return new Date().toISOString()}catch{return""}}async function q0(i,o={}){return fetch(i,o)}function y2(i,o){return(Array.isArray(i)?i:Array.isArray(i?.messages)?i.messages:[]).map(u=>({id:String(u._id||u.id||`${u.createdAt||""}:${Math.random()}`),from:u.sender==="owner"?o:"user",text:u.body||u.text||"",createdAt:u.createdAt||rl()}))}function x2(){const i=_e(),o=Fe();Ge();const{isAuthed:c,token:u}=h2(),p=b2(o?.profileKey)||"",m=p?p.toUpperCase():"Owner",b=p||"owner",[x,h]=d.useState([{id:"intro-1",from:b,text:`This is your direct line to ${m}.`,createdAt:rl(),_intro:!0},{id:"intro-2",from:b,text:"Share what you're working on. I read everything and reply when I can.",createdAt:rl(),_intro:!0}]),[S,w]=d.useState(""),[N,L]=d.useState(!1),[B,U]=d.useState(!1),[C,T]=d.useState(null),[E,D]=d.useState(!1),Q=d.useRef(null),q=d.useRef(null),J=d.useRef(!1),M=c&&!!u,$=d.useCallback((A=!0)=>{const Y=Q.current;if(Y)try{Y.scrollTo({top:Y.scrollHeight,behavior:A?"smooth":"auto"})}catch{}},[]);d.useEffect(()=>{const A=setTimeout(()=>$(!0),50);return()=>clearTimeout(A)},[x,$]);const W=d.useCallback(async()=>{if(M&&p&&!J.current){J.current=!0;try{B||L(!0),T(null);const A=await q0("/api/chat/me/messages",{headers:{Authorization:`Bearer ${u}`,"x-profile-key":p}}),Y=await A.json().catch(()=>({}));if(!A.ok)throw new Error(Y?.error||"Failed to load messages.");const ie=y2(Y,b);h(O=>[...O.filter(K=>K._intro),...ie]),B||U(!0)}catch(A){console.error("[ChatPage] loadMessages error:",A),T(A?.message||"Failed to load messages.")}finally{L(!1),J.current=!1}}},[M,p,u,b,B]);d.useEffect(()=>{M&&W()},[M,W]),d.useEffect(()=>{if(!M||!p)return;const A=()=>{q.current||(q.current=setInterval(W,g2))},Y=()=>{q.current&&clearInterval(q.current),q.current=null},ie=()=>document.visibilityState==="visible"?A():Y();return ie(),document.addEventListener("visibilitychange",ie),()=>{document.removeEventListener("visibilitychange",ie),Y()}},[M,p,W]);const F=d.useCallback(async()=>{const A=String(S||"").trim();if(!A||E||!M)return;const Y={id:`user-${Date.now()}`,from:"user",text:A,createdAt:rl()};h(ie=>[...ie,Y]),w(""),D(!0),setTimeout(()=>$(!0),30);try{const ie=await q0("/api/chat/me/messages",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`,"x-profile-key":p},body:JSON.stringify({body:A})}),O=await ie.json().catch(()=>({}));if(!ie.ok)throw new Error(O?.error||"Failed to send message.");const j=O?.message||O;h(K=>[...K.filter(R=>R.id!==Y.id),{id:String(j._id||j.id||`srv-${Date.now()}`),from:j.sender==="owner"?b:"user",text:j.body||j.text||A,createdAt:j.createdAt||rl()}])}catch(ie){console.error("[ChatPage] send error:",ie),T(ie?.message||"Failed to send message.")}finally{D(!1)}},[S,E,M,u,p,b,$]),V=()=>{i(m2,{state:{profileKey:p,nextRoute:`/world/${encodeURIComponent(p)}/chat`,nextState:{profileKey:p}}})};return a.jsxs("div",{style:Je.page,children:[a.jsx("style",{children:Je.css()}),a.jsxs("div",{style:Je.header,children:[a.jsx("button",{style:Je.iconBtn,onClick:()=>i(`/world/${encodeURIComponent(p||"")}`),title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1,minWidth:0,textAlign:"center"},children:[a.jsx("div",{style:Je.title,children:"Direct Line"}),a.jsxs("div",{style:Je.subtitle,children:[m," • private messages"]})]}),a.jsxs("div",{style:Je.badge,children:[a.jsx("span",{style:{fontSize:12},children:"★"}),a.jsx("span",{style:Je.badgeText,children:"Member"})]})]}),M?a.jsxs(a.Fragment,{children:[a.jsx("div",{style:Je.chatWrap,children:N?a.jsxs("div",{style:Je.center,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:Je.muted,children:"Loading messages…"})]}):C?a.jsxs("div",{style:Je.center,children:[a.jsx("div",{style:Je.error,children:C}),a.jsx("button",{style:Je.retryBtn,onClick:W,children:"Retry"})]}):a.jsx("div",{ref:Q,style:Je.list,children:a.jsx("div",{style:{padding:"10px 16px 20px"},children:x.map(A=>a.jsx(v2,{ownerKey:b,from:A.from,text:A.text,ownerLetter:(m?.[0]||"O").toUpperCase()},A.id))})})}),a.jsxs("div",{style:Je.composerWrap,children:[a.jsxs("div",{style:Je.composer,children:[a.jsx("span",{style:{color:"#fff",opacity:.9},children:"💬"}),a.jsx("textarea",{value:S,onChange:A=>w(A.target.value),placeholder:"what's up...",style:Je.textarea,rows:1,onKeyDown:A=>{A.key==="Enter"&&!A.shiftKey&&(A.preventDefault(),F())}}),a.jsx("button",{style:{...Je.sendBtn,opacity:E?.85:1},onClick:F,disabled:E,children:E?a.jsx("span",{className:"miniSpinner"}):"Send"})]}),a.jsx("div",{style:Je.footerHint,children:"No filters. Be honest. I’ll respond as I’m able."})]})]}):a.jsx("div",{style:Je.lockWrap,children:a.jsxs("div",{style:Je.lockCard,children:[a.jsxs("div",{style:Je.lockHeader,children:[a.jsx("div",{style:Je.lockTitle,children:"Direct Line Locked"}),a.jsx("div",{style:{opacity:.9},children:"🔒"})]}),a.jsx("div",{style:Je.lockText,children:"Please log in to use Direct Line."}),a.jsx("button",{style:Je.primaryBtn,onClick:V,children:"Go to Login"})]})})]})}function v2({ownerKey:i,from:o,text:c,ownerLetter:u}){const f=o===i;return a.jsxs("div",{style:{display:"flex",justifyContent:f?"flex-start":"flex-end",gap:8,margin:"10px 0"},children:[f?a.jsx("div",{style:Je.avatar,children:u}):null,a.jsx("div",{style:{...Je.bubble,...f?Je.bOwner:Je.bUser},children:a.jsx("div",{style:Je.msg,children:c})})]})}const Je={page:{minHeight:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.98))",color:"#e5e7eb",fontFamily:"ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"},header:{display:"flex",alignItems:"center",gap:12,padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.10)",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)",background:"rgba(0,0,0,0.70)"},iconBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",color:"#fff",fontWeight:900,cursor:"pointer"},title:{color:"#fff",fontSize:18,fontWeight:900,letterSpacing:.8},subtitle:{color:"#cfd3dc",fontSize:11,letterSpacing:.6,marginTop:2,textTransform:"uppercase"},badge:{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderRadius:999,background:"#fff",color:"#000",fontWeight:900},badgeText:{fontSize:11,letterSpacing:.6},chatWrap:{flex:1,display:"flex",flexDirection:"column"},list:{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"},bubble:{maxWidth:"78%",padding:"10px 12px",borderRadius:18,border:"1px solid rgba(255,255,255,0.16)"},bOwner:{borderTopLeftRadius:6,background:"linear-gradient(180deg, rgba(124,58,237,0.35), rgba(15,23,42,0.7))"},bUser:{borderTopRightRadius:6,background:"linear-gradient(180deg, rgba(255,255,255,0.18), rgba(148,163,184,0.3))"},msg:{color:"#fff",fontSize:14,lineHeight:"20px",whiteSpace:"pre-wrap"},avatar:{width:26,height:26,borderRadius:999,background:"rgba(148,163,255,0.40)",display:"flex",alignItems:"center",justifyContent:"center",color:"#0b1020",fontWeight:900,marginTop:2,flex:"0 0 auto"},composerWrap:{position:"sticky",bottom:0,zIndex:10,padding:"10px 12px 14px",borderTop:"1px solid rgba(255,255,255,0.08)",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(10px)"},composer:{borderRadius:999,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.14)",display:"flex",alignItems:"flex-end",gap:10,background:"rgba(15,23,42,0.90)"},textarea:{flex:1,resize:"none",border:"none",outline:"none",background:"transparent",color:"#fff",fontSize:14,lineHeight:"20px",maxHeight:120,padding:"2px 0"},sendBtn:{background:"#fff",color:"#000",fontWeight:900,border:"none",borderRadius:999,padding:"10px 14px",cursor:"pointer",minWidth:72},footerHint:{marginTop:6,color:"#6b7280",fontSize:11,textAlign:"center"},lockWrap:{padding:"24px 18px"},lockCard:{borderRadius:24,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(15,23,42,0.90)",padding:16},lockHeader:{display:"flex",alignItems:"center",justifyContent:"space-between"},lockTitle:{color:"#fff",fontSize:16,fontWeight:900,letterSpacing:.6},lockText:{color:"#e5edff",fontSize:13,lineHeight:"20px",marginTop:10},primaryBtn:{marginTop:12,width:"100%",borderRadius:999,border:"none",background:"#fff",color:"#000",fontWeight:900,letterSpacing:.8,padding:"12px 14px",cursor:"pointer"},center:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:24},muted:{color:"#9ca3af",fontSize:13,textAlign:"center"},error:{color:"#fca5a5",textAlign:"center",fontWeight:900},retryBtn:{marginTop:10,padding:"8px 14px",borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(15,23,42,0.75)",color:"#fff",fontWeight:900,cursor:"pointer"},h1:{color:"#fff",fontSize:18,fontWeight:900},css:()=>`
    .spinner{ width:18px;height:18px;border:2px solid rgba(255,255,255,0.25);border-top-color: rgba(255,255,255,0.85);border-radius:999px;animation: spin 0.9s linear infinite;}
    .miniSpinner{ display:inline-block;width:14px;height:14px;border:2px solid rgba(0,0,0,0.25);border-top-color: rgba(0,0,0,0.85);border-radius:999px;animation: spin 0.7s linear infinite;}
    @keyframes spin { to { transform: rotate(360deg); } }
  `};function Qm(i){return String(i||"").trim().toLowerCase()}function w2(i){const o=Qm(i);try{return localStorage.getItem(`ownerToken:${o}`)||localStorage.getItem("ownerToken")||""}catch{return""}}async function Un(i,o={}){const{profileKey:c,method:u="GET",headers:f={},body:p,token:m,auth:b="owner"}=o,x=Qm(c);if(!x)throw new Error("ownerFetch: missing profileKey");const h={...f,"x-profile-key":x},S=m||(b==="owner"?w2(x):"");return S&&(h.Authorization=`Bearer ${S}`),fetch(i,{method:u,headers:h,body:p})}function W0(i){return(Array.isArray(i)?i:Array.isArray(i?.items)?i.items:[]).map(c=>{const u=String(c?._id||c?.id||"").trim();return{...c,id:u||void 0,_id:c?._id||u||void 0}}).filter(c=>c.id||c._id)}function G0(i){const o=String(i||"").toLowerCase();return/\.(mp4|mov|m4v|webm)(\?|$)/i.test(o)}function S2(i){const o=[],c=new Set;return i.forEach(u=>{const f=String(u||"").trim();if(!f)return;const p=f.toLowerCase();c.has(p)||(c.add(p),o.push(f))}),o}function j2(i){return String(i||"").trim()}function k2({open:i,title:o,children:c,onClose:u,footer:f}){return i?a.jsx("div",{style:xe.modalOverlay,onMouseDown:u,role:"presentation",children:a.jsxs("div",{style:xe.modalCard,onMouseDown:p=>p.stopPropagation(),role:"dialog","aria-modal":"true",children:[a.jsx("div",{style:xe.modalTitle,children:o}),a.jsx("div",{style:xe.modalBody,children:c}),f?a.jsx("div",{style:{marginTop:12},children:f}):null,a.jsx("button",{style:xe.modalCloseBtn,onClick:u,children:"Close"})]})}):null}function zu({open:i,title:o,options:c,selected:u,onSelect:f,onClose:p,footer:m}){return a.jsx(k2,{open:i,title:o,onClose:p,footer:m,children:a.jsx("div",{style:{maxHeight:360,overflowY:"auto"},children:c.map(b=>{const x=String(b.value)===String(u);return a.jsxs("button",{onClick:()=>f(b.value),style:{...xe.modalRow,...x?xe.modalRowActive:null},children:[a.jsx("span",{style:{...xe.modalRowText,...x?xe.modalRowTextActive:null},children:b.label}),x?a.jsx("span",{style:{opacity:.9},children:"✓"}):null]},String(b.value))})})})}function T2({toast:i}){if(!i)return null;const o=i.type==="success"?"rgba(22,163,74,0.98)":"rgba(239,68,68,0.98)";return a.jsxs("div",{style:{...xe.toast,backgroundColor:o},children:[a.jsx("div",{style:xe.toastIcon,children:i.type==="success"?"✓":"!"}),a.jsx("div",{style:xe.toastText,children:i.message})]})}function C2(){const i=_e(),o=Fe();Ge();const c=j2(o?.profileKey).toLowerCase(),[u,f]=d.useState(""),[p,m]=d.useState(""),[b,x]=d.useState(""),[h,S]=d.useState(""),[w,N]=d.useState(""),[L,B]=d.useState(""),[U,C]=d.useState([]),[T,E]=d.useState(!0),[D,Q]=d.useState(!1),[q,J]=d.useState(null),[M,$]=d.useState(null),[W,F]=d.useState(!1),[V,A]=d.useState(!1),[Y,ie]=d.useState(!1),[O,j]=d.useState(""),K=d.useMemo(()=>!!c,[c]),I=d.useRef(null),R=(ae,pe)=>{$({type:ae,message:pe}),window.clearTimeout(R._t),R._t=window.setTimeout(()=>$(null),2400)},H=()=>{f(""),m(""),x(""),S(""),N(""),B(""),j("")},v=d.useMemo(()=>["Knitwear","Headwear","Sneakers","Outerwear","Accessories","Shirts","Pants","Sets","Other"].map(ae=>({label:ae,value:ae})),[]),k=d.useMemo(()=>{const ae=U.map(me=>me.tag).filter(Boolean),pe=["Street","Studio","Everyday","Statement","Clean","Vintage","Gym"];return S2([...ae,...pe]).map(me=>({label:me,value:me}))},[U]),te=b||"Select type…",X=h||"Select tag…";d.useEffect(()=>{if(!c){C([]),E(!1),J("Missing profileKey in route.");return}let ae=!0;E(!0),J(null),I.current&&I.current.abort();const pe=new AbortController;return I.current=pe,(async()=>{try{const ue=await Un("/api/owner/fashion",{profileKey:c,signal:pe.signal}),me=await ue.json().catch(()=>({}));if(!ue.ok)throw new Error(me?.error||"Failed to load fashion items.");const Ve=W0(me);ae&&C(Ve)}catch(ue){if(!ae||ue?.name==="AbortError")return;console.error("OwnerFashionPage load error:",ue),J(ue?.message||"Failed to load fashion items.")}finally{ae&&E(!1)}})(),()=>{ae=!1,pe.abort()}},[c]);const le=async()=>{if(!c){R("error","Missing profileKey.");return}const ae=u.trim(),pe=p.trim(),ue=b.trim(),me=h.trim(),Ve=w.trim(),ht=L.trim();if(!ae||!pe||!ue){R("error","Brand, name, and type are required.");return}if(!ht){R("error","Paste an image/video URL.");return}if(!D)try{Q(!0),J(null);const et={brand:ae,name:pe,type:ue,styleNote:Ve||null,tag:me||null,image:G0(ht)?null:ht,video:G0(ht)?ht:null},Jt=await Un("/api/owner/fashion",{profileKey:c,method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(et)}),en=await Jt.json().catch(()=>({}));if(!Jt.ok)throw new Error(en?.error||"Failed to add fashion item.");const tn=W0([en])[0];if(!tn)throw new Error("Save succeeded but item was invalid.");C(Bn=>[tn,...Bn]),H(),R("success","Piece added"),window.scrollTo({top:0,behavior:"smooth"})}catch(et){console.error("OwnerFashionPage save error:",et),J(et?.message||"Failed to add fashion item."),R("error",et?.message||"Failed to add fashion item.")}finally{Q(!1)}},ge=async ae=>{if(!c){R("error","Missing profileKey.");return}const pe=String(ae||"").trim();if(!pe){R("error","Delete failed: missing id.");return}if(window.confirm(`Delete piece?

This will remove it from your fashion list.`))try{const me=await Un(`/api/owner/fashion/${encodeURIComponent(pe)}`,{profileKey:c,method:"DELETE"}),Ve=await me.json().catch(()=>({}));if(!me.ok)throw new Error(Ve?.error||"Failed to delete fashion item.");C(ht=>ht.filter(et=>String(et._id||et.id)!==pe)),R("success","Piece removed")}catch(me){console.error("OwnerFashionPage delete error:",me),R("error",me?.message||"Failed to delete fashion item.")}},de=a.jsxs("div",{children:[a.jsx("div",{style:xe.modalHelper,children:"Add a new tag:"}),a.jsxs("div",{style:xe.customTagRow,children:[a.jsx("input",{value:O,onChange:ae=>j(ae.target.value),placeholder:"e.g. Photoshoot, Winter, Clean",style:xe.customTagInput}),a.jsx("button",{style:xe.customTagAddBtn,onClick:()=>{const ae=String(O||"").trim();ae&&(S(ae),ie(!1),A(!1),j(""))},children:"Add"})]})]});return a.jsxs("div",{style:xe.page,children:[a.jsx("style",{children:xe.css()}),a.jsx(T2,{toast:M}),a.jsxs("div",{style:xe.header,children:[a.jsx("button",{style:xe.backBtn,onClick:()=>i(-1),title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:xe.title,children:"Owner Fashion"}),a.jsx("div",{style:xe.subtitle,children:"Add a piece in under 20 seconds."}),K?null:a.jsx("div",{style:xe.subtitle,children:"Missing profileKey for this page."})]}),a.jsx("div",{style:{width:40}})]}),c?null:a.jsxs("div",{style:xe.missingBox,children:[a.jsx("div",{style:xe.missingTitle,children:"Missing profileKey"}),a.jsx("div",{style:xe.missingText,children:"Open this page as: /world/<profileKey>/owner/fashion"})]}),a.jsxs("div",{style:xe.body,children:[q?a.jsx("div",{style:xe.errorBox,children:a.jsx("div",{style:xe.errorText,children:q})}):null,a.jsx("div",{style:xe.label,children:"Brand"}),a.jsx("div",{style:xe.inputWrap,children:a.jsx("input",{value:u,onChange:ae=>f(ae.target.value),style:xe.input,placeholder:"Ralph Lauren, ANTA, etc."})}),a.jsx("div",{style:{...xe.label,marginTop:12},children:"Name"}),a.jsx("div",{style:xe.inputWrap,children:a.jsx("input",{value:p,onChange:ae=>m(ae.target.value),style:xe.input,placeholder:"Cable-Knit Sweater, Hela Roots..."})}),a.jsx("div",{style:{...xe.label,marginTop:12},children:"Type"}),a.jsxs("button",{style:xe.pickerWrap,onClick:()=>F(!0),children:[a.jsx("span",{style:{...xe.pickerText,...b?null:xe.pickerPlaceholder},children:te}),a.jsx("span",{style:{opacity:.9},children:"▾"})]}),a.jsx("div",{style:{...xe.label,marginTop:12},children:"Tag"}),a.jsxs("button",{style:xe.pickerWrap,onClick:()=>A(!0),children:[a.jsx("span",{style:{...xe.pickerText,...h?null:xe.pickerPlaceholder},children:X}),a.jsx("span",{style:{opacity:.9},children:"▾"})]}),a.jsx("div",{style:{...xe.label,marginTop:12},children:"Style note"}),a.jsx("div",{style:xe.inputWrapMultiline,children:a.jsx("textarea",{value:w,onChange:ae=>N(ae.target.value),style:xe.textarea,placeholder:"How you wear it, why it matters…",rows:3})}),a.jsx("div",{style:{...xe.label,marginTop:12},children:"Media URL"}),a.jsx("div",{style:xe.inputWrap,children:a.jsx("input",{value:L,onChange:ae=>B(ae.target.value),style:xe.input,placeholder:"Paste image or video URL (mp4, mov...)"})}),a.jsx("button",{onClick:le,disabled:!K||D,style:{...xe.saveBtn,opacity:!K||D?.6:1},children:D?"Saving…":"Add Piece"}),a.jsx("div",{style:{...xe.sectionTitle,marginTop:18},children:"Current pieces"}),T?a.jsx("div",{style:xe.loadingRow,children:"Loading pieces…"}):U.length===0?a.jsx("div",{style:xe.emptyText,children:"No pieces yet. Add one above."}):a.jsx("div",{style:xe.list,children:U.map(ae=>{const pe=String(ae._id||ae.id||"").trim(),ue=ae.video?"Video":ae.image?"Image":"Unknown";return a.jsx("div",{style:xe.itemCard,children:a.jsxs("div",{style:xe.itemRow,children:[a.jsx("div",{style:xe.monogram,children:(ae.brand?.[0]||"F").toUpperCase()}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:xe.itemTitle,children:ae.name}),a.jsxs("div",{style:xe.itemMeta,children:[ae.brand," • ",ae.type,ae.tag?` • ${ae.tag}`:""]}),ae.styleNote?a.jsx("div",{style:xe.itemNote,children:ae.styleNote}):null,a.jsx("div",{style:xe.itemMedia,children:ue})]}),a.jsx("button",{style:xe.deleteBtn,onClick:()=>ge(pe),title:"Delete",children:"🗑"})]})},pe)})})]}),a.jsx(zu,{open:W,title:"Select type",options:v,selected:b,onSelect:ae=>{x(String(ae)),F(!1)},onClose:()=>F(!1)}),a.jsx(zu,{open:V,title:"Select tag",options:[...k,{label:"Add custom…",value:"__custom__"},{label:"No tag",value:""}],selected:h,onSelect:ae=>{if(ae==="__custom__"){ie(!0);return}S(String(ae)),A(!1)},onClose:()=>A(!1)}),a.jsx(zu,{open:Y,title:"Custom tag",options:[],selected:null,onSelect:()=>{},onClose:()=>{ie(!1),A(!1)},footer:de})]})}const xe={page:{minHeight:"100vh",background:"linear-gradient(180deg, rgba(2,6,23,1), rgba(2,6,23,0.98))",color:"#e5e7eb",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},header:{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.10)",position:"sticky",top:0,zIndex:10,background:"rgba(2,6,23,0.72)",backdropFilter:"blur(10px)"},backBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",color:"#fff",fontWeight:900,cursor:"pointer"},title:{fontSize:18,fontWeight:900,letterSpacing:.6,color:"#fff"},subtitle:{marginTop:4,fontSize:12,color:"#9ca3af"},missingBox:{margin:"12px 18px 0",padding:12,borderRadius:14,border:"1px solid rgba(248,113,113,0.7)",background:"rgba(248,113,113,0.08)"},missingTitle:{color:"#fecaca",fontWeight:900,fontSize:13},missingText:{marginTop:6,color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:600},body:{padding:"16px 18px 40px",maxWidth:860,margin:"0 auto"},label:{fontSize:12,textTransform:"uppercase",letterSpacing:1.2,color:"#9ca3af",marginBottom:6},inputWrap:{borderRadius:999,border:"1px solid #374151",background:"rgba(15,23,42,0.70)",overflow:"hidden"},inputWrapMultiline:{borderRadius:18,border:"1px solid #374151",background:"rgba(15,23,42,0.70)",overflow:"hidden"},input:{width:"100%",padding:"12px 14px",outline:"none",border:"none",background:"transparent",color:"#f9fafb",fontSize:14},textarea:{width:"100%",padding:"12px 14px",outline:"none",border:"none",background:"transparent",color:"#f9fafb",fontSize:14,lineHeight:"20px",resize:"vertical"},pickerWrap:{width:"100%",borderRadius:999,border:"1px solid #374151",background:"rgba(15,23,42,0.70)",padding:"12px 14px",color:"#f9fafb",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"},pickerText:{fontSize:14},pickerPlaceholder:{color:"#6b7280"},saveBtn:{marginTop:14,width:"100%",borderRadius:999,border:"none",padding:"12px 14px",cursor:"pointer",fontWeight:900,letterSpacing:.6,background:"linear-gradient(90deg, #22c55e, #16a34a)",color:"#052e16"},sectionTitle:{fontSize:12,textTransform:"uppercase",letterSpacing:1.2,color:"#e5e7eb",fontWeight:800},loadingRow:{marginTop:10,color:"#9ca3af"},emptyText:{marginTop:10,color:"#6b7280"},list:{marginTop:10,display:"grid",gap:10},itemCard:{borderRadius:16,border:"1px solid #374151",background:"rgba(15,23,42,0.86)",padding:12},itemRow:{display:"flex",alignItems:"center",gap:12},monogram:{width:38,height:38,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#e5e7eb",background:"rgba(59,130,246,0.25)",border:"1px solid rgba(129,140,248,0.65)",flex:"0 0 auto"},itemTitle:{color:"#fff",fontWeight:800,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},itemMeta:{marginTop:2,color:"#cbd5f5",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},itemNote:{marginTop:6,color:"#9ca3af",fontSize:12,lineHeight:"18px"},itemMedia:{marginTop:6,color:"#6b7280",fontSize:11,letterSpacing:.4},deleteBtn:{width:38,height:38,borderRadius:999,border:"1px solid rgba(248,113,113,0.7)",background:"rgba(239,68,68,0.10)",color:"#fecaca",cursor:"pointer",flex:"0 0 auto"},errorBox:{marginBottom:10,padding:12,borderRadius:14,border:"1px solid rgba(248,113,113,0.7)",background:"rgba(248,113,113,0.08)"},errorText:{color:"#fecaca",fontWeight:800,fontSize:13},modalOverlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.58)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:999},modalCard:{width:"min(560px, 92vw)",borderRadius:18,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(15,23,42,0.98)",padding:14,boxShadow:"0 24px 60px rgba(0,0,0,0.55)"},modalTitle:{color:"#fff",fontWeight:900,letterSpacing:1,textTransform:"uppercase",fontSize:13,marginBottom:10},modalBody:{},modalRow:{width:"100%",textAlign:"left",borderRadius:12,border:"1px solid rgba(255,255,255,0.10)",background:"rgba(2,6,23,0.35)",padding:"12px 12px",marginBottom:8,cursor:"pointer",color:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12},modalRowActive:{background:"rgba(59,130,246,0.18)",border:"1px solid rgba(129,140,248,0.55)"},modalRowText:{fontWeight:700,fontSize:13},modalRowTextActive:{color:"#fff"},modalCloseBtn:{marginTop:12,width:"100%",borderRadius:12,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",color:"#e5e7eb",padding:"10px 12px",fontWeight:900,cursor:"pointer"},modalHelper:{color:"#cbd5f5",fontSize:12,marginBottom:8,fontWeight:700},customTagRow:{display:"flex",gap:10,alignItems:"center"},customTagInput:{flex:1,height:42,borderRadius:12,padding:"0 12px",color:"#f9fafb",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(2,6,23,0.35)",outline:"none"},customTagAddBtn:{height:42,padding:"0 14px",borderRadius:12,border:"1px solid rgba(34,197,94,0.5)",background:"rgba(34,197,94,0.18)",color:"#bbf7d0",fontWeight:900,cursor:"pointer"},toast:{position:"fixed",right:16,top:16,zIndex:1e3,display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:999,boxShadow:"0 18px 40px rgba(0,0,0,0.45)",border:"1px solid rgba(255,255,255,0.12)"},toastIcon:{width:22,height:22,borderRadius:999,background:"rgba(255,255,255,0.88)",color:"#111827",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,flex:"0 0 auto"},toastText:{color:"#ecfdf5",fontWeight:800,fontSize:13},css:()=>`
    * { box-sizing: border-box; }
    button { font-family: inherit; }
  `};function Y0(i,o){if(!Array.isArray(i))return o;const c=i.map(u=>String(u||"").trim()).filter(Boolean);return c.length>=2?c:o}function R2(i){const o=String(i||"").trim();return o?/^https?:\/\//i.test(o)?o:`https://${o}`:null}function F0(){const i=_e(),o=Ge(),c=Fe(),u=c.profileKey||"lamont",f=c.portalKey||null,p=d.useRef(null),[m,b]=d.useState(!0),x=d.useMemo(()=>Rn(u),[u]),h=d.useMemo(()=>{const q=o?.state?.portal;if(q)return q;const J=x?.portals||null;return f&&J&&J[f]?J[f]:x?.portal||null},[o?.state,x,f]),S=String(h?.title||x?.label||"PORTAL").toUpperCase(),w=String(h?.subtitle||"").trim(),N=String(h?.buttonText||"Enter").trim(),L=d.useMemo(()=>R2(h?.url),[h?.url]),B=d.useMemo(()=>typeof h?.videoUrl=="string"?h.videoUrl:h?.videoUrl?.uri?h.videoUrl.uri:typeof h?.video=="string"?h.video:h?.video?.uri?h.video.uri:null,[h]),U=d.useMemo(()=>Y0(h?.gradientColors,["rgba(0,0,0,0.35)","rgba(0,0,0,0.88)"]),[h?.gradientColors]),C=d.useMemo(()=>Y0(h?.ctaColors,["#FFD54A","#FFB300"]),[h?.ctaColors]),T=()=>{if(L)try{window.open(L,"_blank","noopener,noreferrer")}catch{window.location.href=L}},E=()=>{window.history.length>1?i(-1):i(`/world/${u}`)};d.useEffect(()=>{const q=J=>{J.key==="Escape"&&E()};return window.addEventListener("keydown",q),()=>window.removeEventListener("keydown",q)},[u]);const D=d.useMemo(()=>{const q=U[0],J=U[U.length-1];return{background:`linear-gradient(to bottom, ${q}, ${J})`}},[U]),Q=d.useMemo(()=>{const q=C[0],J=C[C.length-1];return{background:`linear-gradient(90deg, ${q}, ${J})`}},[C]);return a.jsxs("div",{style:Wt.container,children:[B?a.jsx("video",{ref:p,src:B,style:Wt.video,autoPlay:!0,loop:!0,playsInline:!0,muted:m}):a.jsx("div",{style:Wt.fallbackBg}),a.jsx("div",{style:{...Wt.overlay,...D}}),a.jsx("div",{style:Wt.closeWrap,children:a.jsx("button",{type:"button",onClick:E,style:Wt.closeButton,"aria-label":"Close",children:"✕"})}),a.jsx("div",{style:Wt.content,children:a.jsxs("div",{style:Wt.stack,children:[a.jsx("div",{style:Wt.title,children:S}),!!w&&a.jsx("div",{style:Wt.subtitle,children:w}),a.jsx("button",{type:"button",onClick:T,disabled:!L,style:{...Wt.enterButton,...L?null:Wt.disabledButton},children:a.jsx("div",{style:{...Wt.enterGradient,...Q},children:a.jsx("span",{style:Wt.enterText,children:N.toUpperCase()})})}),!L&&a.jsxs("div",{style:Wt.missingUrl,children:["Missing ",a.jsx("code",{children:"portal.url"})," (set it in ",a.jsx("code",{children:"profile.portals"})," or route state)"]})]})})]})}const Wt={container:{position:"relative",width:"100%",minHeight:"100vh",backgroundColor:"#000",overflow:"hidden"},video:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:"scale(1.02)"},fallbackBg:{position:"absolute",inset:0,backgroundColor:"#000"},overlay:{position:"absolute",inset:0},closeWrap:{position:"absolute",top:18,left:18,zIndex:10},closeButton:{width:38,height:38,borderRadius:999,border:"1px solid rgba(255,255,255,0.35)",background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:18,cursor:"pointer",display:"grid",placeItems:"center",userSelect:"none"},content:{position:"relative",zIndex:2,minHeight:"100vh",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 24px 80px",textAlign:"center"},stack:{width:"min(520px, 100%)",display:"flex",flexDirection:"column",alignItems:"center"},title:{fontSize:34,fontWeight:800,letterSpacing:4,color:"#fff",marginBottom:8,textTransform:"uppercase"},subtitle:{color:"#f5f5f5",fontSize:14,letterSpacing:1,marginBottom:28,textTransform:"uppercase",opacity:.95},enterButton:{border:"none",padding:0,background:"transparent",borderRadius:999,overflow:"hidden",minWidth:220,cursor:"pointer",transform:"translateZ(0)"},disabledButton:{opacity:.45,cursor:"not-allowed"},enterGradient:{padding:"14px 26px",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center"},enterText:{color:"#000",fontWeight:800,letterSpacing:1.2,fontSize:14},missingUrl:{marginTop:14,color:"rgba(255,255,255,0.75)",fontSize:12,lineHeight:1.4}},E2="https://montech-remote-config.s3.amazonaws.com/superapp/config.json",z2="https://indiverse-backend.onrender.com",N2=["MONTECH_SECURE_OS v1.0","Initializing encrypted channel...","Verifying device fingerprint...","Access level required: OWNER","","Manual override enabled."],V0=N2.join(`
`);function ni(i){return String(i||"").trim().toLowerCase()}async function A2(){const i=await fetch(E2,{cache:"no-store"});if(!i.ok)throw new Error(`Remote config fetch failed (${i.status})`);return i.json()}function U2(i,o){if(!i||!o)return null;const c=String(o);return Array.isArray(i?.profiles)?i.profiles.find(u=>ni(u?.key)===c)||null:i?.worlds&&typeof i.worlds=="object"?i.worlds[c]||null:typeof i=="object"&&i[c]||null}function O2(i){return`ownerToken:${ni(i)}`}function B2(i,o){localStorage.setItem(O2(i),o),localStorage.setItem("ownerToken",o),localStorage.setItem("profileKey",ni(i)),localStorage.setItem("lastOwnerProfileKey",ni(i))}async function M2(i,{method:o="GET",profileKey:c,body:u}={}){const f=`${z2}${i}`,p=await fetch(f,{method:o,headers:{"content-type":"application/json","x-profile-key":ni(c)},body:u});let m=null;try{m=await p.json()}catch{}if(!p.ok){const b=m?.error||m?.message||`Request failed (${p.status})`;throw new Error(b)}return m}function L2(){const i=_e(),o=Fe(),c=Ge(),u=o?.profileKey||c?.state?.profileKey||"",f=d.useMemo(()=>ni(u),[u]),[p,m]=d.useState(null),b=p?.label||p?.brandTopTitle||f||"Owner",[x,h]=d.useState(""),[S,w]=d.useState(!1),[N,L]=d.useState(""),[B,U]=d.useState(""),[C,T]=d.useState(!1),[E,D]=d.useState("idle"),[Q,q]=d.useState(""),J=d.useRef(null),M=d.useRef(null),[$,W]=d.useState(!1);d.useEffect(()=>{f||(D("error"),q("Missing profileKey. Open this page as /world/:profileKey/owner/login"))},[f]),d.useEffect(()=>{let Y=!0;return(async()=>{if(f)try{const ie=await A2(),O=U2(ie,f);Y&&m(O)}catch{}})(),()=>{Y=!1}},[f]),d.useEffect(()=>{let Y=0;const ie=setInterval(()=>{h(V0.slice(0,Y)),Y+=1,Y>V0.length&&(clearInterval(ie),w(!0),setTimeout(()=>J.current?.focus?.(),400))},28);return()=>clearInterval(ie)},[]);function F(){W(!0),window.setTimeout(()=>W(!1),420)}async function V(){if(C)return;if(!f){D("error"),q("Missing profileKey."),F();return}const Y=String(N||"").trim(),ie=String(B||"");if(!Y||!ie){D("error"),q("Both email and password are required."),F();return}T(!0),D("submitting"),q("");try{const O=await M2("/api/admin/login",{method:"POST",profileKey:f,body:JSON.stringify({email:Y,password:ie})}),j=O?.token||O?.data?.token||O?.json?.token||O?.result?.token||"";if(!j){D("error"),q("No token returned from server."),F(),T(!1);return}B2(f,j),D("success"),T(!1),window.setTimeout(()=>{i(`/world/${f}/owner/home`,{replace:!0,state:{profileKey:f,bgUrl:c?.state?.bgUrl||null}})},650)}catch(O){D("error"),q(O?.message||"Network error, please try again."),F(),T(!1)}}function A(){window.history.length>1?i(-1):f?i(`/world/${f}`,{replace:!0}):i("/",{replace:!0})}return a.jsxs("div",{style:Ye.page,children:[a.jsx("style",{children:_2}),a.jsxs("div",{style:Ye.headerRow,children:[a.jsx("button",{onClick:A,style:Ye.backBtn,"aria-label":"Back",children:"‹"}),a.jsxs("div",{style:Ye.headerTitle,children:[b," • Owner Console"]}),a.jsx("div",{style:{width:36}})]}),a.jsx("div",{style:Ye.centerWrap,children:a.jsxs("div",{className:$?"shake":"",style:Ye.card,children:[a.jsxs("div",{style:Ye.cardHeader,children:[a.jsxs("div",{style:Ye.windowDots,children:[a.jsx("span",{style:{...Ye.dot,background:"#f97373"}}),a.jsx("span",{style:{...Ye.dot,background:"#facc15"}}),a.jsx("span",{style:{...Ye.dot,background:"#4ade80"}})]}),a.jsx("div",{style:Ye.cardTitle,children:"monarch-owner:~"}),a.jsx("div",{style:Ye.shield,children:"🛡️"})]}),a.jsxs("div",{style:Ye.terminalBody,children:[a.jsxs("pre",{style:Ye.pre,children:[x,S?null:a.jsx("span",{style:Ye.cursor,children:"▋"})]}),S&&a.jsxs(a.Fragment,{children:[a.jsxs("div",{style:Ye.promptLine,children:[a.jsx("span",{style:{...Ye.prompt,color:"#22c55e"},children:"> "}),a.jsx("span",{style:{...Ye.prompt,color:"#e5e7eb"},children:"email: "}),a.jsx("input",{ref:J,value:N,onChange:Y=>L(Y.target.value),placeholder:"owner@monarch.app",style:Ye.inputInline,autoCapitalize:"none",autoCorrect:"off",inputMode:"email",onKeyDown:Y=>{Y.key==="Enter"&&M.current?.focus?.()}})]}),a.jsxs("div",{style:Ye.promptLine,children:[a.jsx("span",{style:{...Ye.prompt,color:"#22c55e"},children:"> "}),a.jsx("span",{style:{...Ye.prompt,color:"#e5e7eb"},children:"password: "}),a.jsx("input",{ref:M,value:B,onChange:Y=>U(Y.target.value),placeholder:"••••••••",style:Ye.inputInline,type:"password",onKeyDown:Y=>{Y.key==="Enter"&&V()}})]}),E==="submitting"&&a.jsxs("div",{style:Ye.statusLine,children:[a.jsx("span",{style:{...Ye.prompt,color:"#38bdf8"},children:"> Authenticating "}),a.jsx("span",{className:"spinner"})]}),E==="error"&&a.jsxs(a.Fragment,{children:[a.jsx("div",{style:{...Ye.line,color:"#f97373"},children:`> ACCESS DENIED: ${Q}`}),a.jsx("div",{style:{...Ye.line,color:"#f97316"},children:"> Logging event to audit trail..."})]}),E==="success"&&a.jsxs(a.Fragment,{children:[a.jsx("div",{style:{...Ye.line,color:"#4ade80"},children:"> ACCESS GRANTED."}),a.jsx("div",{style:{...Ye.line,color:"#a5b4fc"},children:`> Welcome back, ${b}. You are allowed to be the architect of your world.`})]}),E==="idle"&&a.jsx("div",{style:{...Ye.line,color:"#6b7280"},children:"> Press ENTER on password or click Execute to submit."}),a.jsx("button",{onClick:V,disabled:C,style:{...Ye.button,opacity:C?.7:1},children:a.jsx("span",{style:Ye.buttonInner,children:C?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"spinner"}),a.jsx("span",{children:"Executing…"})]}):a.jsxs(a.Fragment,{children:[a.jsx("span",{children:"⌁"}),a.jsx("span",{children:"Execute"})]})})})]})]})]})})]})}const Ye={page:{minHeight:"100vh",color:"#e5e7eb",background:"radial-gradient(1200px 600px at 20% 10%, rgba(79,70,229,0.22), transparent 60%),radial-gradient(900px 500px at 80% 30%, rgba(124,58,237,0.18), transparent 60%),linear-gradient(180deg, #020617, #050816, #0b1120)",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},headerRow:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 18px 10px"},backBtn:{width:36,height:36,borderRadius:10,border:"1px solid rgba(148,163,184,0.25)",background:"rgba(15,23,42,0.55)",color:"#e5e7eb",cursor:"pointer",fontSize:20,lineHeight:"34px"},headerTitle:{fontSize:14,fontWeight:600,letterSpacing:.6,opacity:.95,textAlign:"center"},centerWrap:{display:"flex",justifyContent:"center",padding:"22px 18px 38px"},card:{width:"min(620px, 96vw)",borderRadius:24,padding:14,border:"1px solid rgba(148,163,184,0.35)",background:"rgba(15,23,42,0.62)",boxShadow:"0 18px 60px rgba(0,0,0,0.45)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",overflow:"hidden"},cardHeader:{display:"flex",alignItems:"center",gap:10,paddingBottom:10,borderBottom:"1px solid rgba(148,163,184,0.25)",marginBottom:12},windowDots:{display:"flex",gap:6,marginRight:2},dot:{width:9,height:9,borderRadius:999},cardTitle:{flex:1,color:"#9ca3af",fontSize:12},shield:{fontSize:16,opacity:.9},terminalBody:{minHeight:220},pre:{margin:0,whiteSpace:"pre-wrap",fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',fontSize:12,lineHeight:"18px",color:"#e5e7eb"},cursor:{color:"#22c55e"},promptLine:{display:"flex",alignItems:"center",marginTop:6,gap:0,fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',fontSize:12},prompt:{fontSize:12},inputInline:{flex:1,background:"transparent",border:"none",outline:"none",color:"#e5e7eb",fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',fontSize:12,padding:"2px 0"},statusLine:{display:"flex",alignItems:"center",gap:8,marginTop:8},line:{marginTop:6,fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',fontSize:12,lineHeight:"18px"},button:{marginTop:12,borderRadius:999,border:"1px solid rgba(148,163,184,0.25)",cursor:"pointer",background:"linear-gradient(90deg, #4f46e5, #7c3aed)",padding:0},buttonInner:{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 14px",color:"#fff",fontWeight:700,fontSize:12,letterSpacing:.6}},_2=`
@keyframes shake {
  0% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-6px); }
  60% { transform: translateX(6px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
.shake { animation: shake 0.42s ease-in-out; }

.spinner{
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: rgba(255,255,255,0.95);
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`,D2=.55,X0=1.1,$2=[{key:"about",label:"About",ionicon:"person-circle",to:"ownerabout",size:130},{key:"contacts",label:"Contacts",ionicon:"people",to:"ownercontacts",size:140},{key:"messages",label:"Messages",ionicon:"chatbubbles",to:"ownermessages",size:130},{key:"playlist",label:"Playlist",ionicon:"list",to:"ownerplaylist",size:145},{key:"music",label:"Music",ionicon:"musical-notes",to:"ownermusic",size:140},{key:"fashion",label:"Fashion",ionicon:"shirt",to:"ownerfashion",size:135},{key:"videos",label:"Videos",ionicon:"videocam",to:"ownervideos",size:135}];function cr(i){return String(i||"").trim().toLowerCase()}function H2(i){return(Array.isArray(i?.ownerItems)&&i.ownerItems.length?i.ownerItems:$2).filter(Boolean).map((c,u)=>({key:String(c.key??`owner-${u}`),label:String(c.label??c.key??"Item"),ionicon:c.ionicon||c.icon||"ellipse",to:String(c.to??c.key??""),size:Number(c.size??132),params:c.params||null})).filter(c=>!!c.to)}function I2(i){return`ownerToken:${cr(i)}`}function K2(i){try{const o=cr(i);return o&&localStorage.getItem(I2(o))||""}catch{return""}}function q2(){try{return cr(localStorage.getItem("profileKey"))}catch{return""}}async function W2(i){try{return await i.json()}catch{return{}}}async function G2(i,{profileKey:o,method:c="GET",body:u}={}){const f=cr(o),p=K2(f);return fetch(i,{method:c,headers:{...u?{"content-type":"application/json"}:{},"x-profile-key":f,...p?{Authorization:`Bearer ${p}`}:{}},body:u})}function Y2(i=""){const o=String(i).toLowerCase();return o.includes("person")?"👤":o.includes("people")||o.includes("contacts")?"👥":o.includes("chat")?"💬":o.includes("list")||o.includes("playlist")?"📃":o.includes("music")||o.includes("musical")?"🎵":o.includes("shirt")||o.includes("fashion")?"👕":o.includes("video")||o.includes("videocam")?"🎬":o.includes("home")?"🏠":"◉"}function F2(){const i=_e(),o=Fe(),c=Ge(),u=cr(o?.profileKey),f=cr(c?.state?.profileKey),p=q2(),m=u||f||p||"",[b,x]=d.useState(m||null),[h,S]=d.useState("Synchronizing owner profile…"),[w,N]=d.useState("ok"),[L,B]=d.useState(c?.state?.bgUrl||null),[U,C]=d.useState(!1),T=d.useRef(0),E=d.useRef(performance.now()),[,D]=d.useState(0);d.useEffect(()=>C(!0),[]),d.useEffect(()=>{const K=u||f||p||"";x(K||null),B(c?.state?.bgUrl||null)},[u,f,c?.state?.bgUrl]);const Q=d.useMemo(()=>b?Rn(b):null,[b]),q=Q?.label||"Owner",J=String(Q?.brandTopTitle||Q?.label||"OWNER").toUpperCase(),M=Q?.accent||"#818cf8",$=d.useMemo(()=>H2(Q),[Q]),W=d.useMemo(()=>$.map((K,I)=>({ax:[5,6,4,6,5][I%5]*X0,ay:[4,4,6,6,5][I%5]*X0,sx:.35+I*.03,sy:.3+I*.025})),[$]);d.useEffect(()=>{const K=()=>{T.current=requestAnimationFrame(K),D(I=>(I+1)%6e5)};return T.current=requestAnimationFrame(K),()=>cancelAnimationFrame(T.current)},[]);const F=d.useCallback(K=>{const I=cr(K)||b||"";if(!I){i("/",{replace:!0});return}i(`/world/${encodeURIComponent(I)}/owner/login`,{replace:!0,state:{profileKey:I,bgUrl:L}})},[i,b,L]);d.useEffect(()=>{if(!b){S("Missing profileKey. Open OwnerHome with { profileKey }."),N("warn");return}try{}catch{}let K=!1;return(async()=>{try{const I=await G2("/api/owner/profile",{profileKey:b}),R=await W2(I);if(K)return;if(I.status===401||I.status===403){S("Session expired. Please log in again."),N("warn"),F(b);return}if(!I.ok||R?.ok===!1){S(R?.error||R?.message||`Sync failed (${I.status})`),N("warn");return}S("Owner link secure. All systems nominal."),N("ok")}catch(I){if(K)return;S(I?.message||"Unable to sync profile. Check connection or token."),N("warn")}})(),()=>{K=!0}},[b,F]);const V=w==="ok"?"#22c55e":w==="warn"?"#facc15":"#f97373",A=()=>{if(!b){i("/",{replace:!1});return}i(`/world/${encodeURIComponent(b)}`,{state:{profileKey:b,bgUrl:L}})},Y=d.useMemo(()=>({ownerabout:"about",ownerhome:"home",ownerlogin:"login",ownervideos:"videos",ownercontacts:"contacts",ownermessages:"messages",ownerchat:"chat",ownerplaylist:"playlist",ownermusic:"music",ownerfashion:"fashion",ownerflowerorders:"flowerorders",ownerproducts:"products",ownerportfolio:"portfolio"}),[]),ie=d.useMemo(()=>new Set(["home","about","login","videos","products","playlist","contacts","music","messages","chat","fashion","flowerorders","portfolio"]),[]),O=K=>{if(!K?.to)return;if(!b){S("Missing profileKey. Cannot open owner tools."),N("warn");return}const I=String(K.to||"").trim().toLowerCase();if(I==="portal"||I.startsWith("portal:")||I==="linkportal"||I==="ownerportal"){const v=I.startsWith("portal:")?I.split(":")[1]:null,k=String(K?.params?.portalKey||v||"").trim(),te=`/world/${encodeURIComponent(b)}/portal`;i(k?`${te}/${encodeURIComponent(k)}`:te,{state:{profileKey:b,bgUrl:L,...K?.params?.portal?{portal:K.params.portal}:{},...K?.params||{}}});return}const H=Y[I]||I.replace(/^owner/,"");if(ie.has(H)){i(`/world/${encodeURIComponent(b)}/owner/${H}`,{state:{profileKey:b,bgUrl:L,...K.params||{}}});return}i(`/world/${encodeURIComponent(b)}/${encodeURIComponent(I)}`,{state:{profileKey:b,bgUrl:L,...K.params||{}}})},j=K=>{const R=(performance.now()-E.current)/1e3*D2,H=W[K]||{ax:5,ay:4,sx:.35,sy:.3},v=Math.sin(R*H.sx)*H.ax,k=Math.cos(R*H.sy)*H.ay;return`translate3d(${v}px, ${k}px, 0)`};return a.jsxs("div",{style:kn.page,children:[a.jsx("style",{children:X2}),a.jsx("div",{style:{...kn.glowOne,background:V2(M,.35)}}),a.jsx("div",{style:kn.glowTwo}),a.jsxs("div",{className:`oh-wrap ${U?"oh-in":""}`,children:[a.jsxs("div",{style:kn.headerWrap,children:[a.jsxs("div",{children:[a.jsx("div",{style:kn.title,children:J}),a.jsx("div",{style:kn.subtitle,children:"Owner Console"}),b?null:a.jsxs("div",{style:{...kn.subtitle,color:"#fca5a5",marginTop:8},children:["Missing profileKey (open with ","{"," profileKey ","}",")."]})]}),a.jsxs("button",{className:"oh-backBtn",onClick:A,children:[a.jsx("span",{style:{fontSize:14},children:"🏠"}),a.jsx("span",{style:{fontWeight:800,letterSpacing:.7,fontSize:12},children:"Back to app"})]})]}),a.jsx("div",{style:kn.field,children:$.map((K,I)=>a.jsx("button",{className:"oh-tile",style:{width:K.size,height:K.size,transform:j(I)},onClick:()=>O(K),title:K.label,children:a.jsxs("div",{className:"oh-tileInner",children:[a.jsx("div",{className:"oh-icon","aria-hidden":!0,children:Y2(K.ionicon)}),a.jsx("div",{className:"oh-label",children:K.label})]})},K.key))}),a.jsx("div",{style:kn.bottom,children:a.jsxs("div",{style:kn.bottomPill,children:[a.jsx("span",{style:{...kn.statusDot,background:V}}),a.jsx("div",{style:kn.bottomText,children:q+" mode • "+h})]})})]})]})}function V2(i,o=1){const c=String(i).replace("#","").trim(),u=c.length===3?c.split("").map(b=>b+b).join(""):c;if(u.length!==6)return`rgba(129,140,248,${o})`;const f=parseInt(u.slice(0,2),16),p=parseInt(u.slice(2,4),16),m=parseInt(u.slice(4,6),16);return`rgba(${f},${p},${m},${o})`}const kn={page:{minHeight:"100vh",background:"linear-gradient(180deg, #020617, #0b1220, #020617)",color:"#e5e7eb",overflow:"hidden",position:"relative",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},glowOne:{position:"fixed",width:260,height:260,borderRadius:999,top:-40,right:-60,opacity:.65,filter:"blur(80px)",pointerEvents:"none"},glowTwo:{position:"fixed",width:260,height:260,borderRadius:999,background:"rgba(236,72,153,0.26)",bottom:-60,left:-40,opacity:.55,filter:"blur(80px)",pointerEvents:"none"},headerWrap:{paddingTop:46,paddingLeft:22,paddingRight:22,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14},title:{fontSize:30,fontWeight:900,letterSpacing:4},subtitle:{marginTop:8,color:"#9ca3af",letterSpacing:.9,fontSize:12,textTransform:"uppercase"},field:{paddingTop:18,paddingLeft:18,paddingRight:18,display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignContent:"flex-start",gap:16,minHeight:"calc(100vh - 210px)"},bottom:{paddingLeft:22,paddingRight:22,paddingBottom:22,display:"flex",justifyContent:"center"},bottomPill:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:999,background:"rgba(15,23,42,0.85)",border:"1px solid rgba(148,163,184,0.6)",maxWidth:760,width:"fit-content"},bottomText:{color:"#9ca3af",fontSize:12,letterSpacing:.7,whiteSpace:"nowrap"},statusDot:{width:8,height:8,borderRadius:999,display:"inline-block"}},X2=`
.oh-wrap{
  position: relative;
  z-index: 2;
  min-height: 100vh;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 650ms ease, transform 650ms ease;
}
.oh-in{ opacity: 1; transform: translateY(0); }

.oh-backBtn{
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(148,163,248,0.55);
  background: rgba(15,23,42,0.65);
  color: #e5e7eb;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  cursor: pointer;
  box-shadow: 0 18px 36px rgba(0,0,0,0.35);
}
.oh-backBtn:active{ transform: scale(0.99); opacity: 0.92; }

.oh-tile{
  border: none;
  border-radius: 26px;
  overflow: hidden;
  background: rgba(15,23,42,0.72);
  border: 1px solid rgba(129,140,248,0.6);
  box-shadow: 0 18px 40px rgba(0,0,0,0.40);
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease, border-color 140ms ease;
  display:flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
}
.oh-tile:hover{ border-color: rgba(34,211,238,0.45); }
.oh-tile:active{ opacity: 0.95; }

.oh-tileInner{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  gap: 10px;
  padding: 12px;
  background:
    radial-gradient(circle at 35% 20%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 70%);
}

.oh-icon{
  font-size: 28px;
  filter: drop-shadow(0 8px 18px rgba(0,0,0,0.35));
}
.oh-label{
  color: #e5e7eb;
  font-weight: 800;
  letter-spacing: 0.8px;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 520px){
  .oh-label{ font-size: 12px; }
}
@media (prefers-reduced-motion: reduce){
  .oh-wrap{ transition: none; }
  .oh-tile{ transition: none; }
}
`,Pm="https://indiverse-backend.onrender.com";function fl(i){return String(i||"").trim().toLowerCase()}function ed(i){return`ownerToken:${fl(i)}`}function Zm(i){try{return localStorage.getItem(ed(i))||""}catch{return""}}function Q2(i,o){const c=fl(i);localStorage.setItem(ed(c),o),localStorage.setItem("ownerToken",o),localStorage.setItem("profileKey",c),localStorage.setItem("lastOwnerProfileKey",c)}function Q0(i){try{localStorage.removeItem(ed(i))}catch{}try{localStorage.removeItem("ownerToken")}catch{}}async function P0(i,{method:o="GET",profileKey:c,body:u,headers:f}={}){const p=`${Pm}${i}`,m=await fetch(p,{method:o,headers:{...f||{},"content-type":"application/json","x-profile-key":fl(c)},body:u});let b=null;try{b=await m.json()}catch{}if(!m.ok){const x=b?.error||b?.message||`Request failed (${m.status})`,h=new Error(x);throw h.status=m.status,h.body=b,h}return b}async function P2(i,{method:o="GET",profileKey:c,body:u,headers:f}={}){const p=`${Pm}${i}`,m=Zm(c);return await fetch(p,{method:o,headers:{...f||{},"x-profile-key":fl(c),...m?{Authorization:`Bearer ${m}`}:{}},body:u})}function Z2(i){try{return new Date(i).toLocaleString()}catch{return String(i||"")}}function J2(){const i=_e(),o=Fe(),c=Ge(),u=o?.profileKey||c?.state?.profileKey||"",f=d.useMemo(()=>fl(u),[u]),p=d.useMemo(()=>f?Rn(f):null,[f]),m=p?.label||p?.brandTopTitle||f||"Owner",[b,x]=d.useState(""),[h,S]=d.useState(!1),[w,N]=d.useState(!1),[L,B]=d.useState(!1),[U,C]=d.useState(null),[T,E]=d.useState(null),[D,Q]=d.useState(""),[q,J]=d.useState(""),[M,$]=d.useState(!1),[W,F]=d.useState(!1),V=d.useRef(null),A=d.useCallback(()=>{B(!0),V.current&&window.clearTimeout(V.current),V.current=window.setTimeout(()=>B(!1),2200)},[]);d.useEffect(()=>()=>{V.current&&window.clearTimeout(V.current)},[]),d.useEffect(()=>{if(!f){F(!1);return}F(!!Zm(f))},[f]),d.useEffect(()=>{let I=!0;return(async()=>{if(!f){C("Missing profileKey. Open this page as /world/:profileKey/owner/about"),x(""),E(null),S(!0);return}try{C(null),S(!1);const R=await P0(`/api/about?ts=${Date.now()}`,{profileKey:f});if(!I)return;x(R?.bio||""),E(R?.updatedAt||null)}catch(R){if(!I)return;C(R?.message||"Failed to load bio.")}finally{I&&S(!0)}})(),()=>{I=!1}},[f]);const Y=()=>{window.history.length>1?i(-1):f?i(`/world/${f}`,{replace:!0}):i("/",{replace:!0})},ie=d.useCallback(()=>{if(!f){i("/",{replace:!0});return}i(`/world/${f}/owner/login`,{replace:!0,state:{profileKey:f,bgUrl:c?.state?.bgUrl||null}})},[i,f,c?.state?.bgUrl]),O=async()=>{if(!M){if(!f){C("Missing profileKey. Open this page as /world/:profileKey/owner/about");return}try{$(!0),C(null);const I=String(D||"").trim(),R=String(q||"");if(!I||!R)throw new Error("Enter email + password.");const H=await P0("/api/admin/login",{method:"POST",profileKey:f,body:JSON.stringify({email:I,password:R})}),v=String(H?.token||"");if(!v)throw new Error("Login failed: no token returned.");Q2(f,v),F(!0),J(""),A()}catch(I){C(I?.message||"Login failed.")}finally{$(!1)}}},j=()=>{f&&(Q0(f),F(!1),J(""),A())},K=async()=>{if(!w){if(!f){C("Missing profileKey. Open this page as /world/:profileKey/owner/about");return}if(!W){C("Owner login required to save.");return}try{N(!0),C(null);const I=await P2("/api/owner/about",{method:"PUT",profileKey:f,headers:{"content-type":"application/json"},body:JSON.stringify({bio:b})}),R=await I.text().catch(()=>"");let H={};try{H=R?JSON.parse(R):{}}catch{}if(console.log("[OwnerAboutWeb][SAVE]",{status:I.status,ok:I.ok,bodyPreview:String(R||"").slice(0,220)}),!I.ok){const v=H?.error||H?.message||`Save failed (${I.status})`,k=new Error(v);throw k.status=I.status,(I.status===401||I.status===403)&&(k.code="OWNER_UNAUTHORIZED"),k}E(H?.updatedAt||new Date().toISOString()),typeof H?.bio=="string"&&x(H.bio),A()}catch(I){if(I?.code==="OWNER_UNAUTHORIZED"||I?.status===401||I?.status===403){F(!1),Q0(f),C("Session expired. Please log in again."),ie();return}C(I?.message||"Failed to save bio.")}finally{N(!1)}}};return a.jsxs("div",{className:"oa-root",children:[a.jsx("style",{children:ev}),a.jsxs("div",{className:"oa-header",children:[a.jsx("button",{className:"oa-backBtn",onClick:Y,"aria-label":"Back",children:"‹"}),a.jsxs("div",{className:"oa-headerText",children:[a.jsx("div",{className:"oa-title",children:"About / Bio"}),a.jsx("div",{className:"oa-subtitle",children:f?`This text powers the About screen for ${m}. • ${f}`:"Missing profileKey for this page."})]}),a.jsx("div",{style:{width:36}})]}),a.jsxs("div",{className:"oa-body",children:[U?a.jsx("div",{className:"oa-errorBox",children:a.jsx("div",{className:"oa-errorText",children:U})}):null,a.jsxs("div",{className:"oa-authRow",children:[a.jsxs("div",{className:"oa-authTitle",children:["Owner Auth ",W?"• Logged in":"• Not logged in"]}),W?a.jsxs("button",{className:"oa-miniBtn",onClick:j,children:[a.jsx("span",{style:{opacity:.9},children:"⎋"}),a.jsx("span",{children:"Logout"})]}):null]}),W?null:a.jsxs("div",{className:"oa-authCard",children:[a.jsx("input",{className:"oa-input",value:D,onChange:I=>Q(I.target.value),placeholder:"Owner email",autoCapitalize:"none",autoCorrect:"off",inputMode:"email",disabled:!f}),a.jsx("input",{className:"oa-input",value:q,onChange:I=>J(I.target.value),placeholder:"Owner password",type:"password",disabled:!f,onKeyDown:I=>{I.key==="Enter"&&O()}}),a.jsxs("button",{className:"oa-authBtn",onClick:O,disabled:M||!f,children:[M?a.jsx("span",{className:"oa-spinner"}):a.jsx("span",{children:"🔑"}),a.jsx("span",{children:f?"Login":"Missing profileKey"})]})]}),a.jsx("div",{className:"oa-label",children:"Bio"}),a.jsx("div",{className:"oa-textAreaWrap",children:h?a.jsx("textarea",{className:"oa-textarea",value:b,onChange:I=>x(I.target.value),placeholder:"Write your story here – who you are, what you stand for, your journey, & your philosophy.",disabled:!f}):a.jsxs("div",{className:"oa-loading",children:[a.jsx("span",{className:"oa-spinner"}),a.jsx("div",{className:"oa-loadingText",children:"Loading bio…"})]})}),a.jsxs("button",{className:"oa-saveBtn",onClick:K,disabled:!W||!f||w,style:{opacity:!W||!f?.55:w?.8:1},children:[w?a.jsx("span",{className:"oa-spinner"}):a.jsx("span",{children:"💾"}),a.jsx("span",{children:f?W?"Save Bio":"Login to Save":"Missing profileKey"})]}),T?a.jsxs("div",{className:"oa-meta",children:["Last updated: ",Z2(T)]}):null]}),L?a.jsxs("div",{className:"oa-toast",children:[a.jsx("div",{className:"oa-toastCheck",children:"✓"}),a.jsx("div",{className:"oa-toastText",children:W?"Saved / Auth OK":"Done"})]}):null]})}const ev=`
.oa-root{
  min-height: 100vh;
  color:#e5e7eb;
  background:
    radial-gradient(1200px 600px at 20% 10%, rgba(79,70,229,0.22), transparent 60%),
    radial-gradient(900px 500px at 80% 30%, rgba(34,211,238,0.10), transparent 60%),
    linear-gradient(180deg, #020617, #020617, #020617);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  padding: 0 18px;
}

.oa-header{
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 18px 0 14px;
}
.oa-backBtn{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(55,65,81,0.9);
  background: rgba(15,23,42,0.9);
  color:#e5e7eb;
  font-size: 22px;
  line-height: 32px;
  cursor:pointer;
}
.oa-headerText{ flex: 1; min-width: 0; }
.oa-title{
  color:#f9fafb;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.4px;
}
.oa-subtitle{
  margin-top: 3px;
  font-size: 12px;
  color:#9ca3af;
}

.oa-body{ padding-bottom: 26px; }

.oa-errorBox{
  margin-bottom: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.7);
}
.oa-errorText{ color:#fecaca; font-size: 12px; }

.oa-authRow{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.oa-authTitle{ color:#cbd5e1; font-size: 12px; letter-spacing: 0.6px; }

.oa-miniBtn{
  display:inline-flex;
  align-items:center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color:#e5e7eb;
  cursor:pointer;
  font-size: 12px;
  font-weight: 700;
}

.oa-authCard{
  border-radius: 14px;
  border: 1px solid #374151;
  background: rgba(15,23,42,0.55);
  box-shadow: 0 18px 50px rgba(0,0,0,0.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow:hidden;
  padding: 12px;
  margin-bottom: 14px;
  display:flex;
  flex-direction: column;
  gap: 10px;
}
.oa-input{
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.15);
  border-radius: 12px;
  padding: 10px 12px;
  color:#f9fafb;
  font-size: 14px;
  outline:none;
}
.oa-input:disabled{ opacity: 0.6; }

.oa-authBtn{
  border-radius: 999px;
  border: 1px solid rgba(96,165,250,0.35);
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  padding: 10px 14px;
  color:#eff6ff;
  font-weight: 800;
  font-size: 13px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.oa-authBtn:disabled{ opacity: 0.75; cursor:not-allowed; }

.oa-label{
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #9ca3af;
  margin-bottom: 6px;
  margin-top: 4px;
}

.oa-textAreaWrap{
  border-radius: 14px;
  border: 1px solid #374151;
  overflow:hidden;
  min-height: 260px;
  max-height: 420px;
  background: rgba(15,23,42,0.7);
  position: relative;
}
.oa-textarea{
  width: 100%;
  height: 100%;
  min-height: 260px;
  max-height: 420px;
  resize: vertical;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 14px;
  color:#f9fafb;
  font-size: 15px;
  line-height: 22px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}
.oa-textarea:disabled{ opacity: 0.65; }

.oa-loading{
  height: 260px;
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.oa-loadingText{ color:#9ca3af; font-size: 13px; }

.oa-saveBtn{
  margin-top: 16px;
  border-radius: 999px;
  border: 1px solid rgba(34,197,94,0.35);
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 11px 20px;
  color:#ecfdf5;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.3px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.oa-saveBtn:disabled{ cursor:not-allowed; }

.oa-meta{ margin-top: 10px; font-size: 12px; color: #6b7280; }

.oa-toast{
  position: fixed;
  right: 16px;
  top: 16px;
  z-index: 50;
  display:flex;
  align-items:center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(22,163,74,0.98);
  box-shadow: 0 18px 60px rgba(0,0,0,0.45);
}
.oa-toastCheck{
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: #bbf7d0;
  color: #022c22;
  font-weight: 900;
}
.oa-toastText{ color:#ecfdf5; font-weight: 700; font-size: 13px; }

.oa-spinner{
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: rgba(255,255,255,0.95);
  display:inline-block;
  animation: oa_spin 0.8s linear infinite;
}
@keyframes oa_spin{ to { transform: rotate(360deg); } }

@media (max-width: 520px){
  .oa-root{ padding: 0 14px; }
}
`,Z0=[{value:"",label:"No platform / original"},{value:"instagram",label:"Instagram"},{value:"facebook",label:"Facebook"},{value:"youtube",label:"YouTube"},{value:"tiktok",label:"TikTok"},{value:"original",label:"Original upload"}];function Pr(i){return String(i||"").trim().toLowerCase()}function tv(i){return`ownerToken:${Pr(i)}`}function nv(i){try{return localStorage.getItem(tv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}function av(){try{return Pr(localStorage.getItem("profileKey"))}catch{return""}}function Jm(i){if(!i)return null;const o=String(i._id||i.id||"");return o?{_id:o,title:i.title||"Untitled",source:i.source||i.platform||"other",url:i.url||"",thumbUri:i.thumbUri||i.thumbUrl||null,isFeatured:!!i.isFeatured,isPublished:i.isPublished!==void 0?!!i.isPublished:!0,tags:Array.isArray(i.tags)?i.tags:[],createdAt:i.createdAt||null}:null}function J0(i){const o=new Set,c=[];for(const u of i||[]){const f=Jm(u);f&&(o.has(f._id)||(o.add(f._id),c.push(f)))}return c}async function Nu(i){try{return await i.json()}catch{return{}}}async function Au(i,{profileKey:o,method:c="GET",body:u}={}){const f=nv(o);return fetch(i,{method:c,headers:{...u?{"content-type":"application/json"}:{},"x-profile-key":Pr(o),...f?{Authorization:`Bearer ${f}`}:{}},body:u})}function rv(){const i=_e(),o=Fe(),c=Ge(),u=Pr(o?.profileKey),f=Pr(c?.state?.profileKey),p=av(),m=u||f||p||"",[b,x]=d.useState(m||null),[h,S]=d.useState(""),[w,N]=d.useState(""),[L,B]=d.useState(""),[U,C]=d.useState([]),[T,E]=d.useState(!0),[D,Q]=d.useState(!1),[q,J]=d.useState(null),[M,$]=d.useState(null),[W,F]=d.useState(!1),V=d.useMemo(()=>!!b,[b]),A=d.useMemo(()=>b?Rn(b):null,[b]),Y=A?.label||A?.brandTopTitle||"Owner",ie=A?.accent||"#818cf8",[O,j]=d.useState(c?.state?.bgUrl||null);d.useEffect(()=>{const X=u||f||p||"";x(X||null),j(c?.state?.bgUrl||null)},[u,f,c?.state?.bgUrl]);const K=(X,le)=>{$({type:X,message:le}),window.setTimeout(()=>$(null),2600)},I=d.useCallback(X=>{const le=Pr(X)||b||"";if(!le){i("/",{replace:!0});return}i(`/world/${encodeURIComponent(le)}/owner/login`,{replace:!0,state:{profileKey:le,bgUrl:O}})},[i,b,O]),R=()=>{S(""),N(""),B(""),F(!1)},H=d.useCallback(async()=>{if(!b){E(!1),C([]),J("Missing profileKey. Open this page as /world/:profileKey/owner/videos");return}try{J(null),E(!0);const X=await Au("/api/owner/videos",{profileKey:b}),le=await Nu(X);if(X.status===401||X.status===403){C([]),I(b);return}if(!X.ok){const de=le?.error||le?.message||`Failed to load videos (${X.status})`;throw new Error(de)}const ge=Array.isArray(le)?le:Array.isArray(le?.videos)?le.videos:[];C(J0(ge))}catch(X){const le=X?.message||"Failed to load videos.";J(le),String(le).toLowerCase().includes("unauthorized")&&I(b)}finally{E(!1)}},[b,I]);d.useEffect(()=>{H()},[H]);const v=async()=>{const X=String(h||"").trim(),le=String(L||"").trim(),ge=String(w||"").trim().toLowerCase();if(!le)return K("error","Video URL is required.");if(!b)return K("error","Missing profileKey for this page.");if(!D)try{Q(!0),J(null);const de={title:X,url:le,...ge?{source:ge}:{}},ae=await Au("/api/owner/videos",{profileKey:b,method:"POST",body:JSON.stringify(de)}),pe=await Nu(ae);if(ae.status===401||ae.status===403){I(b);return}if(!ae.ok){const me=pe?.error||pe?.message||`Failed to add video (${ae.status})`;throw new Error(me)}const ue=Jm(pe);if(!ue)throw new Error("Server returned an invalid video payload.");C(me=>J0([ue,...me])),R(),K("success","Video added")}catch(de){const ae=de?.message||"Failed to add video.";J(ae),K("error",ae),String(ae).toLowerCase().includes("unauthorized")&&I(b)}finally{Q(!1)}},k=async X=>{const le=String(X||"");if(le){if(!b)return K("error","Missing profileKey.");try{const ge=await Au(`/api/owner/videos/${encodeURIComponent(le)}`,{profileKey:b,method:"DELETE"}),de=await Nu(ge);if(ge.status===401||ge.status===403){I(b);return}if(!ge.ok){const ae=de?.error||de?.message||`Failed to delete (${ge.status})`;throw new Error(ae)}C(ae=>ae.filter(pe=>pe._id!==le)),K("success","Video removed")}catch(ge){const de=ge?.message||"Failed to delete video.";K("error",de),String(de).toLowerCase().includes("unauthorized")&&I(b)}}},te=Z0.find(X=>X.value===w)?.label||"Select platform (optional)";return a.jsxs("div",{style:nt.page,children:[a.jsx("style",{children:lv}),a.jsx("div",{style:{...nt.glowOne,background:iv(ie,.35)}}),a.jsx("div",{style:nt.glowTwo}),a.jsxs("div",{style:nt.wrap,children:[a.jsxs("div",{style:nt.header,children:[a.jsx("button",{className:"ov-back",onClick:()=>i(-1),title:"Back","aria-label":"Back",children:"‹"}),a.jsxs("div",{style:{flex:1},children:[a.jsxs("div",{style:nt.title,children:[Y," Videos"]}),a.jsxs("div",{style:nt.subtitle,children:["Drop the reels & clips you want showing in your video grid.",b?` • ${b}`:""]}),V?null:a.jsx("div",{style:nt.subtitle,children:"Missing profileKey for this page."})]}),a.jsx("div",{style:{width:36}})]}),q?a.jsx("div",{style:nt.errorBox,children:a.jsx("div",{style:nt.errorText,children:q})}):null,a.jsx("div",{style:nt.label,children:"Title (optional)"}),a.jsx("div",{style:nt.inputWrap,children:a.jsx("input",{value:h,onChange:X=>S(X.target.value),style:nt.input,placeholder:"Reel title, performance clip, etc.",disabled:!V})}),a.jsx("div",{style:{height:10}}),a.jsx("div",{style:nt.label,children:"Platform (optional)"}),a.jsxs("div",{style:{position:"relative"},children:[a.jsxs("button",{className:"ov-select",disabled:!V,onClick:()=>V&&F(X=>!X),children:[a.jsx("span",{style:{color:w?"#f9fafb":"#6b7280",overflow:"hidden",textOverflow:"ellipsis"},children:te}),a.jsx("span",{style:{opacity:.7},children:W?"▲":"▼"})]}),W?a.jsx("div",{style:nt.dropdown,children:Z0.map(X=>a.jsx("button",{className:"ov-opt",onClick:()=>{N(X.value),F(!1)},children:X.label},X.value||"none"))}):null]}),a.jsx("div",{style:{height:10}}),a.jsx("div",{style:nt.label,children:"Video URL"}),a.jsx("div",{style:nt.inputWrap,children:a.jsx("input",{value:L,onChange:X=>B(X.target.value),style:nt.input,placeholder:"https://instagram.com/reel/... or mp4 link",disabled:!V,onKeyDown:X=>{X.key==="Enter"&&v()}})}),a.jsx("button",{className:"ov-add",onClick:v,disabled:!V||D,children:D?"Adding…":"Add Video"}),a.jsx("div",{style:{...nt.sectionTitle,marginTop:18},children:"Current videos"}),T?a.jsx("div",{style:nt.loadingBox,children:"Loading videos…"}):U.length===0?a.jsx("div",{style:nt.emptyText,children:"No videos yet. Drop your first reel link to start."}):a.jsx("div",{style:{marginTop:10,paddingBottom:26},children:U.map(X=>a.jsx("div",{style:nt.videoTile,children:a.jsxs("div",{style:nt.videoRow,children:[a.jsx("div",{style:nt.monogram,children:(X.title?.[0]||"V").toUpperCase()}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:nt.videoTitle,children:X.title||"(No title)"}),a.jsxs("div",{style:nt.videoMeta,children:[String(X.source||"other")," • ",X.url]}),a.jsxs("div",{style:nt.videoThumb,children:["Thumb: ",X.thumbUri?"✅":"❌"]})]}),a.jsx("button",{className:"ov-del",onClick:()=>k(X._id),title:"Delete",children:"🗑️"})]})},X._id))})]}),M?a.jsxs("div",{style:{...nt.toast,backgroundColor:M.type==="success"?"rgba(22,163,74,0.98)":"rgba(239,68,68,0.98)"},children:[a.jsx("div",{style:nt.toastBadge,children:M.type==="success"?"✓":"!"}),a.jsx("div",{style:nt.toastText,children:M.message})]}):null]})}function iv(i,o=1){const c=String(i).replace("#","").trim(),u=c.length===3?c.split("").map(b=>b+b).join(""):c;if(u.length!==6)return`rgba(129,140,248,${o})`;const f=parseInt(u.slice(0,2),16),p=parseInt(u.slice(2,4),16),m=parseInt(u.slice(4,6),16);return`rgba(${f},${p},${m},${o})`}const nt={page:{minHeight:"100vh",background:"linear-gradient(180deg, #020617, #0b1220, #020617)",color:"#e5e7eb",overflow:"hidden",position:"relative",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},glowOne:{position:"fixed",width:260,height:260,borderRadius:999,top:-40,right:-60,opacity:.65,filter:"blur(80px)",pointerEvents:"none"},glowTwo:{position:"fixed",width:260,height:260,borderRadius:999,background:"rgba(236,72,153,0.26)",bottom:-60,left:-40,opacity:.55,filter:"blur(80px)",pointerEvents:"none"},wrap:{position:"relative",zIndex:2,maxWidth:860,margin:"0 auto",padding:"18px 18px 40px"},header:{display:"flex",alignItems:"center",gap:12,paddingTop:12,paddingBottom:14},title:{color:"#f9fafb",fontSize:18,fontWeight:800,letterSpacing:.4},subtitle:{marginTop:4,fontSize:12,color:"#9ca3af"},label:{fontSize:12,textTransform:"uppercase",letterSpacing:1.2,color:"#9ca3af",marginBottom:6},inputWrap:{borderRadius:999,border:"1px solid #374151",background:"rgba(15,23,42,0.72)",overflow:"hidden",minHeight:44,display:"flex",alignItems:"center"},input:{width:"100%",border:"none",outline:"none",background:"transparent",color:"#f9fafb",padding:"12px 14px",fontSize:14},sectionTitle:{color:"#e5e7eb",fontSize:13,fontWeight:800,letterSpacing:.6,textTransform:"uppercase"},loadingBox:{marginTop:10,padding:"12px 0",color:"#9ca3af"},emptyText:{marginTop:10,color:"#6b7280",fontSize:13},videoTile:{borderRadius:16,border:"1px solid #374151",background:"rgba(15,23,42,0.72)",padding:10,marginBottom:10},videoRow:{display:"flex",alignItems:"center",gap:10},monogram:{width:36,height:36,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(56,189,248,0.18)",border:"1px solid rgba(129,140,248,0.9)",fontWeight:900,color:"#e5e7eb"},videoTitle:{color:"#f9fafb",fontWeight:800,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},videoMeta:{color:"#cbd5f5",fontSize:11,marginTop:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},videoThumb:{color:"#9ca3af",fontSize:11,marginTop:3},errorBox:{marginBottom:10,padding:10,borderRadius:10,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.7)"},errorText:{color:"#fecaca",fontSize:12},dropdown:{position:"absolute",top:48,left:0,right:0,borderRadius:16,border:"1px solid #374151",background:"rgba(15,23,42,0.98)",overflow:"hidden",zIndex:20},toast:{position:"fixed",right:16,top:16,display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:999,boxShadow:"0 18px 36px rgba(0,0,0,0.35)",zIndex:50},toastBadge:{width:22,height:22,borderRadius:999,background:"#bbf7d0",color:"#022c22",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900},toastText:{color:"#ecfdf5",fontWeight:700,fontSize:13}},lv=`
.ov-back{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(55,65,81,0.9);
  background: rgba(15,23,42,0.9);
  color: #e5e7eb;
  cursor: pointer;
  font-size: 20px;
  line-height: 34px;
}
.ov-back:active{ opacity: 0.8; }

.ov-select{
  width: 100%;
  border-radius: 999px;
  border: 1px solid #374151;
  background: rgba(15,23,42,0.72);
  color: #e5e7eb;
  cursor: pointer;
  min-height: 44px;
  padding: 10px 14px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
.ov-select:disabled{ opacity: 0.65; cursor: not-allowed; }

.ov-opt{
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #e5e7eb;
  padding: 10px 14px;
  cursor: pointer;
}
.ov-opt:hover{ background: rgba(55,65,81,0.55); }

.ov-add{
  margin-top: 14px;
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(56,189,248,0.35);
  background: linear-gradient(90deg, #38bdf8, #a855f7);
  color: #ecfeff;
  font-weight: 900;
  letter-spacing: 0.4px;
  padding: 12px 16px;
  cursor: pointer;
}
.ov-add:disabled{ opacity: 0.7; cursor: not-allowed; }
.ov-add:active{ transform: scale(0.997); opacity: 0.95; }

.ov-del{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(248,113,113,0.55);
  background: rgba(239,68,68,0.10);
  cursor: pointer;
}
.ov-del:active{ opacity: 0.85; }
`,ov="https://indiverse-backend.onrender.com";function Ko(i){return String(i||"").trim().toLowerCase()}function sv(i){return`ownerToken:${Ko(i)}`}function cv(i){try{return localStorage.getItem(sv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}async function em(i){try{return await i.json()}catch{return{}}}async function tm(i,{profileKey:o,method:c="GET",body:u}={}){const f=cv(o);return await fetch(`${ov}${i}`,{method:c,headers:{"content-type":"application/json","x-profile-key":Ko(o),...f?{Authorization:`Bearer ${f}`}:{}},body:u})}function uv(i){try{const o=new Date(i);return Number.isNaN(o.getTime())?"":o.toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return""}}function dv(i){const o=String(i||"new").toLowerCase();return o==="confirmed"?{bg:"rgba(46,204,113,0.25)",bd:"rgba(46,204,113,0.45)"}:o==="completed"?{bg:"rgba(52,152,219,0.25)",bd:"rgba(52,152,219,0.45)"}:o==="cancelled"?{bg:"rgba(231,76,60,0.25)",bd:"rgba(231,76,60,0.45)"}:{bg:"rgba(255,255,255,0.10)",bd:"rgba(255,255,255,0.18)"}}function fv(){const i=_e(),o=Fe(),c=Ge(),u=Ko(o?.profileKey),f=Ko(c?.state?.profileKey),p=u||f||"",[m,b]=d.useState([]),[x,h]=d.useState(""),[S,w]=d.useState(!0),[N,L]=d.useState(!1),[B,U]=d.useState(""),[C,T]=d.useState(""),E=d.useMemo(()=>!!p,[p]),D=d.useCallback(()=>{if(!p){i("/",{replace:!0});return}i(`/world/${encodeURIComponent(p)}/owner/login`,{replace:!0,state:{profileKey:p,bgUrl:c?.state?.bgUrl||null}})},[i,p,c?.state?.bgUrl]),Q=d.useCallback(async($="load")=>{if(!p){b([]),w(!1),L(!1),T("Missing profileKey. Open this page as /world/:profileKey/owner/flowerorders");return}try{T(""),$==="refresh"?L(!0):w(!0);const W=await tm("/api/owner/flowers/orders",{profileKey:p}),F=await em(W);if(W.status===401||W.status===403){b([]),T("Session expired. Please log in again."),D();return}if(!W.ok)throw new Error(F?.error||F?.message||`Failed to fetch flower orders (${W.status})`);const V=Array.isArray(F)?F:Array.isArray(F?.items)?F.items:[];b(V)}catch(W){T(W?.message||"Unable to load flower orders.")}finally{w(!1),L(!1)}},[p,D]);d.useEffect(()=>{Q("load")},[Q]);const q=d.useCallback(async($,W)=>{if(!p){T("Missing profileKey.");return}if($)try{U($),T("");const F=await tm(`/api/owner/flowers/orders/${encodeURIComponent($)}`,{profileKey:p,method:"PATCH",body:JSON.stringify({status:W})}),V=await em(F);if(F.status===401||F.status===403){T("Session expired. Please log in again."),D();return}if(!F.ok)throw new Error(V?.error||V?.message||`Failed to update (${F.status})`);const A=V;b(Y=>Y.map(ie=>String(ie?._id)===String(A?._id)?A:ie))}catch(F){T(F?.message||"Unable to update order status.")}finally{U("")}},[p,D]),J=d.useCallback($=>{window.confirm(`Cancel this order?

This will mark the order as cancelled.`)&&q($,"cancelled")},[q]),M=()=>{window.history.length>1?i(-1):p?i(`/world/${encodeURIComponent(p)}/owner/home`,{replace:!0,state:{profileKey:p}}):i("/",{replace:!0})};return a.jsxs("div",{style:mt.page,children:[a.jsx("style",{children:pv}),a.jsxs("div",{style:mt.header,children:[a.jsx("button",{className:"btnIcon",onClick:M,"aria-label":"Back",children:"‹"}),a.jsxs("div",{style:{flex:1},children:[a.jsxs("div",{style:mt.titleRow,children:[a.jsx("span",{style:{fontSize:18},children:"🌹"}),a.jsx("div",{style:mt.title,children:"Flower Consultations"})]}),a.jsxs("div",{style:mt.subtitle,children:["requests • occasions • deliveries",p?` • ${p}`:""]})]}),a.jsx("button",{className:"btnPill",onClick:()=>Q("refresh"),disabled:!E||N,title:"Refresh",children:N?"Refreshing…":"Refresh"})]}),E?null:a.jsxs("div",{style:mt.bannerErr,children:[a.jsx("div",{style:{fontWeight:900},children:"Missing profileKey"}),a.jsxs("div",{style:{marginTop:6,opacity:.9,fontSize:12},children:["Open: ",a.jsx("code",{style:mt.code,children:"/world/:profileKey/owner/flowerorders"})]})]}),C?a.jsxs("div",{style:mt.bannerWarn,children:[a.jsx("div",{style:{fontWeight:900},children:"Notice"}),a.jsx("div",{style:{marginTop:6,fontSize:12},children:C})]}):null,S?a.jsxs("div",{style:mt.loading,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:{opacity:.75,fontSize:13},children:"Loading flower orders…"})]}):m.length===0?a.jsxs("div",{style:mt.empty,children:[a.jsx("div",{style:{fontSize:16,fontWeight:800},children:"No flower orders yet 🌹"}),a.jsx("div",{style:{marginTop:8,opacity:.75,fontSize:13,textAlign:"center"},children:"When someone submits the flower form, orders will land here."})]}):a.jsx("div",{style:mt.list,children:m.map($=>{const W=String($?._id||$?.id||""),F=x===W,V=String($?.status||"new").toLowerCase(),A=dv(V);return a.jsxs("button",{className:"card",onClick:()=>h(Y=>Y===W?"":W),children:[a.jsxs("div",{style:mt.cardTop,children:[a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:mt.cardTitle,children:$?.bouquetType||"Flower order"}),a.jsxs("div",{style:mt.cardSub,children:[$?.name||"—"," • ",$?.phone||"—"]})]}),a.jsxs("div",{style:{textAlign:"right"},children:[a.jsx("span",{style:{...mt.statusPill,background:A.bg,borderColor:A.bd},children:V}),a.jsx("div",{style:mt.cardTime,children:$?.createdAt?uv($.createdAt):""})]})]}),a.jsxs("div",{style:mt.badges,children:[$?.occasion?a.jsxs("span",{className:"badge",children:["🎁 ",$.occasion]}):null,$?.deliveryDate?a.jsxs("span",{className:"badge",children:["🗓️ ",$.deliveryDate]}):null]}),F?a.jsxs("div",{style:mt.expanded,children:[$?.deliveryAddress?a.jsxs("div",{style:mt.detail,children:[a.jsx("div",{style:mt.detailLabel,children:"Address"}),a.jsx("div",{style:mt.detailValue,children:$.deliveryAddress})]}):null,$?.notes?a.jsxs("div",{style:mt.detail,children:[a.jsx("div",{style:mt.detailLabel,children:"Notes"}),a.jsx("div",{style:mt.detailValue,children:$.notes})]}):null,a.jsxs("div",{style:mt.actions,children:[a.jsx("button",{className:"btnGreen",onClick:Y=>{Y.preventDefault(),Y.stopPropagation(),q(W,"confirmed")},disabled:B===W,children:B===W?"Updating…":"Mark confirmed"}),a.jsx("button",{className:"btnOutline",onClick:Y=>{Y.preventDefault(),Y.stopPropagation(),q(W,"completed")},disabled:B===W,children:B===W?"Updating…":"Mark completed"}),a.jsx("button",{className:"btnRed",onClick:Y=>{Y.preventDefault(),Y.stopPropagation(),J(W)},disabled:B===W,children:"Cancel"})]})]}):null]},W)})})]})}const mt={page:{minHeight:"100vh",background:"linear-gradient(180deg, #020617, #0b1220, #020617)",color:"#e5e7eb",padding:"18px",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},header:{display:"flex",alignItems:"center",gap:12,paddingTop:12,paddingBottom:14},titleRow:{display:"flex",alignItems:"center",gap:8},title:{fontSize:20,fontWeight:900,letterSpacing:.6},subtitle:{marginTop:6,color:"#9ca3af",fontSize:12,textTransform:"uppercase",letterSpacing:1},bannerErr:{borderRadius:14,padding:12,background:"rgba(231,76,60,0.12)",border:"1px solid rgba(231,76,60,0.30)",marginBottom:10},bannerWarn:{borderRadius:14,padding:12,background:"rgba(250,204,21,0.10)",border:"1px solid rgba(250,204,21,0.26)",marginBottom:10},code:{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:8},loading:{marginTop:60,display:"flex",alignItems:"center",justifyContent:"center",gap:12},empty:{marginTop:80,display:"flex",flexDirection:"column",alignItems:"center"},list:{marginTop:8,display:"flex",flexDirection:"column",gap:12},cardTop:{display:"flex",alignItems:"flex-start",gap:12},cardTitle:{fontSize:15,fontWeight:800,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},cardSub:{marginTop:6,fontSize:12,color:"#cbd5e1"},cardTime:{marginTop:6,fontSize:11,color:"#9ca3af"},statusPill:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"4px 10px",borderRadius:999,fontSize:11,fontWeight:800,letterSpacing:.8,textTransform:"uppercase",border:"1px solid rgba(255,255,255,0.18)"},badges:{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"},expanded:{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:10},detailLabel:{fontSize:11,color:"#9ca3af",textTransform:"uppercase",letterSpacing:1},detailValue:{marginTop:4,fontSize:13,color:"#fff",whiteSpace:"pre-wrap"},detail:{},actions:{marginTop:8,display:"flex",gap:10,flexWrap:"wrap"}},pv=`
.card{
  text-align: left;
  width: 100%;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(15,23,42,0.72);
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
}
.card:hover{ border-color: rgba(255,255,255,0.20); }
.card:active{ transform: scale(0.998); opacity: 0.98; }

.badge{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-size: 12px;
}

.btnIcon{
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.25);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.btnIcon:active{ opacity: 0.85; }

.btnPill{
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.25);
  color: #e5e7eb;
  padding: 9px 12px;
  cursor: pointer;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.6px;
}
.btnPill:disabled{ opacity: 0.6; cursor: default; }

.btnGreen, .btnOutline, .btnRed{
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 900;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  font-size: 12px;
  cursor: pointer;
}
.btnGreen{
  border: 1px solid rgba(46,204,113,0.40);
  background: rgba(46,204,113,0.22);
  color: #fff;
}
.btnOutline{
  border: 1px solid rgba(255,255,255,0.26);
  background: transparent;
  color: #fff;
}
.btnRed{
  border: 1px solid rgba(231,76,60,0.42);
  background: rgba(231,76,60,0.22);
  color: #fff;
}
.btnGreen:disabled, .btnOutline:disabled, .btnRed:disabled{
  opacity: 0.6;
  cursor: default;
}

.spinner{
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.9);
  animation: spin 0.8s linear infinite;
}
@keyframes spin{ to{ transform: rotate(360deg);} }
`;function td(i){return String(i||"").trim().toLowerCase()}function gv(i){return`ownerToken:${td(i)}`}function mv(i){try{return localStorage.getItem(gv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}async function Oo(i){try{return await i.json()}catch{return null}}async function Bo(i,{profileKey:o,method:c="GET",body:u}={}){const f=td(o),p=mv(f);return await fetch(i,{method:c,headers:{"content-type":"application/json","x-profile-key":f,...p?{Authorization:`Bearer ${p}`}:{}},body:u})}function hv(i,o="usd"){const c=Number(i||0)/100;try{return new Intl.NumberFormat("en-US",{style:"currency",currency:String(o||"usd").toUpperCase()}).format(c)}catch{return`$${c.toFixed(2)}`}}function Uu(i){return i?String(i).split(",").map(o=>o.trim()).filter(Boolean):[]}function Ou(i){return!Array.isArray(i)||!i.length?"":i.join(", ")}const nm={_id:null,name:"",description:"",category:"",imageUrl:"",imageUrlsCsv:"",priceDollars:"",currency:"usd",sizesCsv:"",colorsCsv:"",inStock:!0,stockQtyText:"",isPublished:!0};function bv(){const i=_e(),o=Ge(),c=Fe(),u=td(c?.profileKey),[f]=d.useState(u||""),[p,m]=d.useState(!0),[b,x]=d.useState(!1),[h,S]=d.useState(!1),[w,N]=d.useState([]),[L,B]=d.useState({published:"all",inStock:"all",search:""}),[U,C]=d.useState(!1),[T,E]=d.useState(nm),D=d.useMemo(()=>!!f,[f]),Q=o?.state?.bgUrl||null,q=()=>{f?i(`/world/${encodeURIComponent(f)}/owner/home`,{state:{profileKey:f,bgUrl:Q}}):i("/",{replace:!0})},J=d.useCallback(()=>{if(!f)return i("/",{replace:!0});i(`/world/${encodeURIComponent(f)}/owner/login`,{replace:!0,state:{profileKey:f,bgUrl:Q}})},[i,f,Q]);function M(O){const j=String(O.name||"").trim();if(!j)throw new Error("Name is required");const K=String(O.priceDollars||"").trim(),I=Number(K);if(!Number.isFinite(I)||I<0)throw new Error("Price must be a valid number");const R=Math.round(I*100),H=String(O.stockQtyText||"").trim(),v=H===""?null:Number.parseInt(H,10);if(v!==null&&(!Number.isFinite(v)||v<0))throw new Error("Stock Qty must be empty or a number ≥ 0");return{name:j,description:String(O.description||"").trim(),category:String(O.category||"").trim(),imageUrl:String(O.imageUrl||"").trim(),imageUrls:Uu(O.imageUrlsCsv),priceCents:R,currency:String(O.currency||"usd").trim().toLowerCase()||"usd",sizes:Uu(O.sizesCsv),colors:Uu(O.colorsCsv),inStock:!!O.inStock,stockQty:v,isPublished:!!O.isPublished}}const $=d.useCallback(async({isRefresh:O=!1}={})=>{if(f)try{O?x(!0):m(!0);const j=new URLSearchParams;L.published!=="all"&&j.set("published",L.published),L.inStock!=="all"&&j.set("inStock",L.inStock),L.search&&j.set("search",L.search),j.set("limit","200"),j.set("skip","0");const K=await Bo(`/api/owner/products?${j.toString()}`,{profileKey:f}),I=await Oo(K);if(K.status===401||K.status===403){J();return}if(!K.ok){const R=I?.error||I?.message||`Request failed (${K.status}${K.statusText?` ${K.statusText}`:""})`;throw new Error(R)}N(Array.isArray(I?.items)?I.items:[])}catch(j){alert(j?.message||"Unable to load products")}finally{m(!1),x(!1)}},[f,L,J]);d.useEffect(()=>{f&&$()},[$,f]);const W=()=>{E({...nm}),C(!0)},F=O=>{E({_id:O?._id||null,name:O?.name||"",description:O?.description||"",category:O?.category||"",imageUrl:O?.imageUrl||"",imageUrlsCsv:Ou(O?.imageUrls||[]),priceDollars:typeof O?.priceCents=="number"?(O.priceCents/100).toFixed(2):"",currency:O?.currency||"usd",sizesCsv:Ou(O?.sizes||[]),colorsCsv:Ou(O?.colors||[]),inStock:O?.inStock!==void 0?!!O.inStock:!0,stockQtyText:O?.stockQty===null||O?.stockQty===void 0?"":String(O.stockQty),isPublished:O?.isPublished!==void 0?!!O.isPublished:!0}),C(!0)},V=()=>{h||C(!1)},A=async()=>{if(f)try{S(!0);const O=M(T),j=!!T._id,K=j?`/api/owner/products/${T._id}`:"/api/owner/products",R=await Bo(K,{profileKey:f,method:j?"PATCH":"POST",body:JSON.stringify(O)}),H=await Oo(R);if(R.status===401||R.status===403){J();return}if(!R.ok){const k=H?.error||H?.message||`Request failed (${R.status}${R.statusText?` ${R.statusText}`:""})`;throw new Error(k)}const v=H?.item;N(k=>{const te=Array.isArray(k)?[...k]:[];if(!v?._id)return te;const X=te.findIndex(le=>String(le?._id)===String(v._id));return X>=0?te[X]=v:te.unshift(v),te}),C(!1)}catch(O){alert(O?.message||"Unable to save product")}finally{S(!1)}},Y=async O=>{const j=O?._id;if(!(!j||!window.confirm(`Delete "${O?.name||"this product"}"? This cannot be undone.`)))try{S(!0);const I=await Bo(`/api/owner/products/${j}`,{profileKey:f,method:"DELETE"}),R=await Oo(I);if(I.status===401||I.status===403){J();return}if(!I.ok)throw new Error(R?.error||R?.message||`Delete failed (${I.status})`);N(H=>Array.isArray(H)?H.filter(v=>String(v?._id)!==String(j)):[]),C(!1)}catch(I){alert(I?.message||"Unable to delete product")}finally{S(!1)}},ie=async O=>{if(!O?._id)return;const j=!O.isPublished;N(K=>K.map(I=>String(I?._id)===String(O._id)?{...I,isPublished:j}:I));try{const K=await Bo(`/api/owner/products/${O._id}`,{profileKey:f,method:"PATCH",body:JSON.stringify({isPublished:j})}),I=await Oo(K);if(K.status===401||K.status===403){J();return}if(!K.ok)throw new Error(I?.error||I?.message||`Update failed (${K.status})`);const R=I?.item;R?._id&&N(H=>H.map(v=>String(v?._id)===String(R._id)?R:v))}catch(K){$(),alert(K?.message||"Unable to update product")}};return D?a.jsxs("div",{style:ke.page,children:[a.jsx("style",{children:am}),a.jsxs("div",{style:ke.header,children:[a.jsx("button",{style:ke.backBtn,onClick:q,children:"← Back"}),a.jsx("div",{style:ke.headerTitle,children:"Products"}),a.jsx("div",{style:ke.headerRight,children:a.jsx("button",{style:ke.headerBtn,onClick:W,children:"+ Add"})})]}),a.jsx("div",{style:ke.toolbar,children:a.jsx("button",{style:ke.button,onClick:()=>$({isRefresh:!0}),children:b?"Refreshing…":"Refresh"})}),a.jsxs("div",{style:ke.filters,children:[a.jsx("input",{value:L.search,onChange:O=>B(j=>({...j,search:O.target.value})),placeholder:"Search…",style:ke.search,onKeyDown:O=>{O.key==="Enter"&&$()}}),a.jsxs("div",{style:ke.filterRow,children:[a.jsx(Qr,{on:L.published==="all",onClick:()=>B(O=>({...O,published:"all"})),children:"All"}),a.jsx(Qr,{on:L.published==="true",onClick:()=>B(O=>({...O,published:"true"})),children:"Published"}),a.jsx(Qr,{on:L.published==="false",onClick:()=>B(O=>({...O,published:"false"})),children:"Hidden"}),a.jsx("span",{style:{width:10}}),a.jsx(Qr,{on:L.inStock==="all",onClick:()=>B(O=>({...O,inStock:"all"})),children:"Any stock"}),a.jsx(Qr,{on:L.inStock==="true",onClick:()=>B(O=>({...O,inStock:"true"})),children:"In stock"}),a.jsx(Qr,{on:L.inStock==="false",onClick:()=>B(O=>({...O,inStock:"false"})),children:"Out"})]}),a.jsx("button",{style:ke.apply,onClick:()=>$(),children:"Apply"})]}),p?a.jsxs("div",{style:ke.center,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:ke.muted,children:"Loading…"})]}):w.length===0?a.jsx("div",{style:ke.center,children:a.jsx("div",{style:ke.muted,children:"No products yet."})}):a.jsx("div",{style:ke.list,children:w.map(O=>a.jsxs("button",{style:ke.row,onClick:()=>F(O),children:[a.jsxs("div",{style:{flex:1,textAlign:"left"},children:[a.jsx("div",{style:ke.rowTitle,children:O.name||"(untitled)"}),a.jsxs("div",{style:ke.rowSub,children:[O.category?`${O.category} • `:"",hv(O.priceCents,O.currency),O.stockQty!==null&&O.stockQty!==void 0?` • qty: ${O.stockQty}`:""]})]}),a.jsxs("div",{style:ke.rowRight,onClick:j=>j.stopPropagation(),children:[a.jsx("div",{style:ke.badgeText,children:O.isPublished?"Published":"Hidden"}),a.jsxs("label",{style:ke.switchWrap,children:[a.jsx("input",{type:"checkbox",checked:!!O.isPublished,onChange:()=>ie(O)}),a.jsx("span",{style:ke.switchUi})]})]})]},O._id))}),U&&a.jsx("div",{style:ke.overlay,onMouseDown:O=>O.target===O.currentTarget&&V(),children:a.jsxs("div",{style:ke.modal,children:[a.jsxs("div",{style:ke.modalHeader,children:[a.jsx("button",{style:ke.modalLink,onClick:V,disabled:h,children:"Close"}),a.jsx("div",{style:ke.modalTitle,children:T._id?"Edit Product":"New Product"}),a.jsx("button",{style:{...ke.modalLink,opacity:h?.6:1},onClick:A,disabled:h,children:h?"Saving…":"Save"})]}),a.jsxs("div",{style:ke.modalBody,children:[a.jsx(Hn,{label:"Name",value:T.name,onChange:O=>E(j=>({...j,name:O}))}),a.jsx(Hn,{label:"Description",value:T.description,onChange:O=>E(j=>({...j,description:O})),multiline:!0}),a.jsx(Hn,{label:"Category",value:T.category,onChange:O=>E(j=>({...j,category:O}))}),a.jsx(Hn,{label:"Image URL",value:T.imageUrl,onChange:O=>E(j=>({...j,imageUrl:O}))}),a.jsx(Hn,{label:"Gallery URLs (comma separated)",value:T.imageUrlsCsv,onChange:O=>E(j=>({...j,imageUrlsCsv:O}))}),a.jsxs("div",{style:ke.twoCol,children:[a.jsx("div",{style:{flex:1},children:a.jsx(Hn,{label:"Price (USD)",value:T.priceDollars,onChange:O=>E(j=>({...j,priceDollars:O})),inputMode:"decimal"})}),a.jsx("div",{style:{width:12}}),a.jsx("div",{style:{flex:1},children:a.jsx(Hn,{label:"Currency",value:T.currency,onChange:O=>E(j=>({...j,currency:O}))})})]}),a.jsx(Hn,{label:"Sizes (comma separated)",value:T.sizesCsv,onChange:O=>E(j=>({...j,sizesCsv:O}))}),a.jsx(Hn,{label:"Colors (comma separated)",value:T.colorsCsv,onChange:O=>E(j=>({...j,colorsCsv:O}))}),a.jsxs("div",{style:ke.switchRow,children:[a.jsx("div",{style:ke.switchLabel,children:"In Stock"}),a.jsxs("label",{style:ke.switchWrap,children:[a.jsx("input",{type:"checkbox",checked:!!T.inStock,onChange:O=>E(j=>({...j,inStock:O.target.checked}))}),a.jsx("span",{style:ke.switchUi})]})]}),a.jsx(Hn,{label:"Stock Qty (blank = not tracked)",value:T.stockQtyText,onChange:O=>E(j=>({...j,stockQtyText:O})),inputMode:"numeric"}),a.jsxs("div",{style:ke.switchRow,children:[a.jsx("div",{style:ke.switchLabel,children:"Published"}),a.jsxs("label",{style:ke.switchWrap,children:[a.jsx("input",{type:"checkbox",checked:!!T.isPublished,onChange:O=>E(j=>({...j,isPublished:O.target.checked}))}),a.jsx("span",{style:ke.switchUi})]})]}),!!T._id&&a.jsx("button",{style:{...ke.deleteButton,opacity:h?.7:1},disabled:h,onClick:()=>Y({_id:T._id,name:T.name}),children:"Delete Product"})]})]})})]}):a.jsxs("div",{style:ke.page,children:[a.jsx("style",{children:am}),a.jsxs("div",{style:ke.header,children:[a.jsx("button",{style:ke.backBtn,onClick:q,children:"← Back"}),a.jsx("div",{style:ke.headerTitle,children:"Products"}),a.jsx("div",{style:{width:80}})]}),a.jsxs("div",{style:ke.center,children:[a.jsx("div",{style:ke.errTitle,children:"Missing profileKey"}),a.jsxs("div",{style:ke.errText,children:["Open this page as ",a.jsx("code",{children:"/world/:profileKey/owner/products"})]})]})]})}function Qr({on:i,onClick:o,children:c}){return a.jsx("button",{type:"button",onClick:o,style:{...ke.chip,...i?ke.chipOn:null},children:c})}function Hn({label:i,value:o,onChange:c,multiline:u,inputMode:f}){return a.jsxs("div",{style:ke.field,children:[a.jsx("div",{style:ke.label,children:i}),u?a.jsx("textarea",{value:o,onChange:p=>c(p.target.value),style:{...ke.input,...ke.inputMulti},rows:4}):a.jsx("input",{value:o,onChange:p=>c(p.target.value),style:ke.input,inputMode:f})]})}const ke={page:{minHeight:"100vh",background:"#0b0b0b",color:"#fff",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},header:{display:"flex",alignItems:"center",gap:10,padding:"12px 12px 10px",borderBottom:"1px solid #222",position:"sticky",top:0,background:"#0b0b0b",zIndex:5},backBtn:{padding:"8px 10px",borderRadius:10,border:"1px solid transparent",background:"transparent",color:"#fff",cursor:"pointer",fontWeight:800},headerTitle:{flex:1,textAlign:"center",fontWeight:900,letterSpacing:.6},headerRight:{width:80,display:"flex",justifyContent:"flex-end"},headerBtn:{padding:"8px 10px",background:"#1a1a1a",borderRadius:10,border:"1px solid #2a2a2a",color:"#fff",cursor:"pointer",fontWeight:800},toolbar:{padding:12,borderBottom:"1px solid #222"},button:{padding:"10px 14px",background:"#1a1a1a",borderRadius:10,border:"1px solid #2a2a2a",color:"#fff",cursor:"pointer",fontWeight:700},filters:{padding:12,borderBottom:"1px solid #222"},search:{height:42,width:"100%",borderRadius:10,border:"1px solid #2a2a2a",padding:"0 12px",color:"#fff",background:"#111",marginBottom:10,outline:"none"},filterRow:{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"},chip:{padding:"6px 10px",borderRadius:999,border:"1px solid #2a2a2a",background:"#121212",color:"#ddd",fontSize:12,cursor:"pointer"},chipOn:{background:"#1f1f1f",color:"#fff"},apply:{marginTop:10,padding:"8px 12px",borderRadius:10,background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#fff",fontWeight:800,cursor:"pointer"},list:{paddingBottom:24},row:{width:"100%",display:"flex",gap:12,padding:12,borderBottom:"1px solid #161616",alignItems:"center",background:"transparent",color:"#fff",cursor:"pointer",textAlign:"left"},rowTitle:{fontSize:16,fontWeight:700},rowSub:{color:"#aaa",marginTop:2,fontSize:13},rowRight:{display:"flex",alignItems:"flex-end",gap:8},badgeText:{color:"#aaa",fontSize:12},center:{padding:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},muted:{color:"#aaa",marginTop:10},errTitle:{fontSize:18,fontWeight:900,marginBottom:8},errText:{color:"#aaa",textAlign:"center"},overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",padding:14,zIndex:50},modal:{width:"min(920px, 100%)",maxHeight:"92vh",background:"#0b0b0b",borderRadius:16,border:"1px solid #222",overflow:"hidden",boxShadow:"0 30px 80px rgba(0,0,0,0.6)"},modalHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 12px",borderBottom:"1px solid #222",position:"sticky",top:0,background:"#0b0b0b",zIndex:2},modalTitle:{fontWeight:900},modalLink:{background:"transparent",border:"1px solid transparent",color:"#fff",cursor:"pointer",fontWeight:800,padding:"6px 8px",borderRadius:10},modalBody:{padding:12,overflow:"auto"},field:{marginBottom:12},label:{color:"#bbb",marginBottom:6,fontSize:12},input:{width:"100%",minHeight:42,borderRadius:10,border:"1px solid #2a2a2a",padding:"10px 12px",color:"#fff",background:"#111",outline:"none"},inputMulti:{minHeight:100,resize:"vertical"},twoCol:{display:"flex"},switchRow:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",marginBottom:8,borderBottom:"1px solid rgba(255,255,255,0.06)"},switchLabel:{color:"#ddd",fontWeight:700},switchWrap:{position:"relative",display:"inline-flex",alignItems:"center",gap:8},switchUi:{display:"none"},deleteButton:{marginTop:14,padding:"12px 12px",borderRadius:10,border:"1px solid #3a1a1a",background:"#1a0f0f",color:"#ffb4b4",cursor:"pointer",fontWeight:900}},am=`
/* tiny spinner */
.spinner{
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.9);
  border-radius: 999px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* toggle switches (simple) */
label[style*="switchWrap"] input{
  width: 44px;
  height: 26px;
  appearance: none;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.20);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  outline: none;
}
label[style*="switchWrap"] input:checked{
  background: rgba(34,197,94,0.28);
  border-color: rgba(34,197,94,0.45);
}
label[style*="switchWrap"] input::after{
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 160ms ease;
}
label[style*="switchWrap"] input:checked::after{
  transform: translateX(18px);
}
`;function Zr(i){return String(i||"").trim().toLowerCase()}function yv(){try{return Zr(localStorage.getItem("profileKey"))}catch{return""}}function xv(i){return`ownerToken:${Zr(i)}`}function vv(i){try{return localStorage.getItem(xv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}async function Bu(i){try{return await i.json()}catch{return{}}}async function Mu(i,{profileKey:o,method:c="GET",body:u}={}){const f=Zr(o),p=vv(f);return await fetch(i,{method:c,headers:{"content-type":"application/json","x-profile-key":f,...p?{Authorization:`Bearer ${p}`}:{}},body:u})}function eh(i){if(!i)return null;const o=String(i._id||i.id||"").trim();return o?{...i,_id:o,id:o,title:i.title||"Untitled",artist:i.artist||"",tag:i.tag||"",monogram:i.monogram||"LM"}:null}function rm(i){const o=Array.isArray(i)?i:Array.isArray(i?.items)?i.items:[],c=new Set,u=[];for(const f of o){const p=eh(f);p&&(c.has(p.id)||(c.add(p.id),u.push(p)))}return u}function wv(){const i=_e(),o=Fe(),c=Ge(),u=Zr(o?.profileKey),f=yv(),p=u||f||"",[m,b]=d.useState(p||""),[x,h]=d.useState(!1),[S,w]=d.useState("Owner"),[N,L]=d.useState("#818cf8"),B=c?.state?.bgUrl||null,[U,C]=d.useState(""),[T,E]=d.useState(""),[D,Q]=d.useState([]),[q,J]=d.useState(!0),[M,$]=d.useState(!1),[W,F]=d.useState(null),[V,A]=d.useState(null),Y=d.useRef(null),ie=d.useMemo(()=>!!m,[m]),O=(H,v)=>{A({type:H,message:v}),Y.current&&clearTimeout(Y.current),Y.current=setTimeout(()=>A(null),2600)},j=d.useCallback(H=>{const v=Zr(H||m);if(!v)return i("/",{replace:!0});i(`/world/${encodeURIComponent(v)}/owner/login`,{replace:!0,state:{profileKey:v,bgUrl:B}})},[i,m,B]),K=()=>{if(!m)return i("/",{replace:!1});i(`/world/${encodeURIComponent(m)}/owner/home`,{state:{profileKey:m,bgUrl:B}})};d.useEffect(()=>{let H=!0;return(async()=>{try{const v=Zr(u||f||"");if(!H)return;if(b(v||""),!v){w("Owner"),L("#818cf8"),h(!0);return}const k=Rn(v);w(k?.label||k?.brandTopTitle||"Owner"),L(k?.accent||"#818cf8"),h(!0)}catch{if(!H)return;h(!0)}})(),()=>{H=!1}},[u]),d.useEffect(()=>{if(!x)return;if(!m){J(!1),Q([]),F("Missing profileKey. Open this page with /world/:profileKey/owner/playlist.");return}let H=!0;return(async()=>{try{F(null),J(!0);const v=await Mu("/api/owner/tracks",{profileKey:m}),k=await Bu(v);if(v.status===401||v.status===403){H&&(F("Session expired. Please log in again."),J(!1)),j(m);return}if(!v.ok){const X=k?.error||k?.message||"Failed to load tracks.";throw new Error(X)}const te=rm(k);H&&Q(te)}catch(v){if(!H)return;F(v?.message||"Failed to load tracks.")}finally{H&&J(!1)}})(),()=>{H=!1}},[x,m,j]);const I=async()=>{const H=String(U||"").trim();if(ie){if(!H){O("error","Spotify link is required.");return}if(!M)try{$(!0),F(null);const v=await Mu("/api/owner/tracks",{method:"POST",profileKey:m,body:JSON.stringify({spotifyUrl:H,tag:String(T||"").trim()||void 0})}),k=await Bu(v);if(v.status===401||v.status===403){O("error","Session expired. Please log in again."),j(m);return}if(!v.ok){const le=k?.error||k?.message||"Failed to add track.";throw new Error(le)}const te=k?.item||k?.data||k,X=eh(te);X?.id&&Q(le=>rm([X,...le])),C(""),E(""),O("success","Track added to playlist")}catch(v){const k=v?.message||"Failed to add track.";F(k),O("error",k)}finally{$(!1)}}},R=async H=>{const v=String(H||"").trim();if(!(!v||!m||!window.confirm("Remove this track from the playlist?")))try{const te=await Mu(`/api/owner/tracks/${encodeURIComponent(v)}`,{method:"DELETE",profileKey:m}),X=await Bu(te);if(te.status===401||te.status===403){O("error","Session expired. Please log in again."),j(m);return}if(!te.ok){const le=X?.error||X?.message||"Failed to delete track.";throw new Error(le)}Q(le=>le.filter(ge=>String(ge._id||ge.id)!==v)),O("success","Track removed")}catch(te){O("error",te?.message||"Failed to delete track.")}};return a.jsxs("div",{style:Ze.page,children:[a.jsx("style",{children:Sv(N)}),a.jsxs("div",{style:Ze.header,children:[a.jsx("button",{style:Ze.backBtn,onClick:K,title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1},children:[a.jsxs("div",{style:Ze.title,children:[S," Playlist"]}),a.jsxs("div",{style:Ze.subtitle,children:["Paste Spotify tracks that power your energy",m?` • ${m}`:""]}),ie?null:a.jsx("div",{style:{...Ze.subtitle,color:"#fca5a5"},children:"Missing profileKey for this page."})]}),a.jsx("div",{style:{width:42}})]}),W?a.jsx("div",{style:Ze.errorBox,children:a.jsx("div",{style:Ze.errorText,children:W})}):null,a.jsxs("div",{style:Ze.form,children:[a.jsx("div",{style:Ze.label,children:"Spotify link"}),a.jsx("div",{style:Ze.inputWrap,children:a.jsx("input",{value:U,onChange:H=>C(H.target.value),style:Ze.input,placeholder:"https://open.spotify.com/track/...",disabled:!ie,autoCapitalize:"none",autoCorrect:"off",onKeyDown:H=>{H.key==="Enter"&&I()}})}),a.jsx("div",{style:{height:10}}),a.jsx("div",{style:Ze.label,children:"Tag / mood"}),a.jsx("div",{style:Ze.inputWrap,children:a.jsx("input",{value:T,onChange:H=>E(H.target.value),style:Ze.input,placeholder:"ex: Lock-in mode, Night drive, Healing",disabled:!ie,onKeyDown:H=>{H.key==="Enter"&&I()}})}),a.jsx("button",{style:{...Ze.addBtn,opacity:!ie||M?.7:1,cursor:!ie||M?"not-allowed":"pointer"},onClick:I,disabled:!ie||M,children:M?"Adding…":"＋ Add to Playlist"})]}),a.jsx("div",{style:Ze.sectionTitle,children:"Current playlist"}),q?a.jsxs("div",{style:Ze.loadingBox,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:Ze.loadingText,children:"Loading tracks…"})]}):D.length===0?a.jsx("div",{style:Ze.emptyText,children:"No tracks yet. Drop in a Spotify link to start."}):a.jsx("div",{style:Ze.list,children:D.map(H=>a.jsx("div",{style:Ze.trackTile,children:a.jsxs("div",{style:Ze.trackRow,children:[a.jsx("div",{style:Ze.monogramCircle,children:String(H.monogram||"LM").slice(0,3)}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:Ze.trackTitle,title:H.title,children:H.title}),a.jsx("div",{style:Ze.trackArtist,title:H.artist,children:H.artist}),H.tag?a.jsx("div",{style:Ze.trackTag,title:H.tag,children:H.tag}):null]}),a.jsx("button",{style:Ze.trashBtn,onClick:()=>R(H._id||H.id),title:"Remove",children:"🗑️"})]})},String(H._id||H.id)))}),V?a.jsxs("div",{style:{...Ze.toast,background:V.type==="success"?"rgba(22,163,74,0.96)":"rgba(239,68,68,0.96)"},children:[a.jsx("div",{style:Ze.toastDot,children:V.type==="success"?"✓":"!"}),a.jsx("div",{style:Ze.toastText,children:V.message})]}):null]})}const Ze={page:{minHeight:"100vh",background:"linear-gradient(180deg, #020617, #020617, #020617)",color:"#e5e7eb",padding:18,fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},header:{display:"flex",alignItems:"center",gap:12,paddingBottom:14},backBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(55,65,81,0.9)",background:"rgba(15,23,42,0.9)",color:"#e5e7eb",fontWeight:900,cursor:"pointer"},title:{color:"#f9fafb",fontSize:18,fontWeight:900,letterSpacing:.4},subtitle:{marginTop:4,fontSize:12,color:"#9ca3af"},errorBox:{marginBottom:12,padding:"10px 12px",borderRadius:12,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.55)"},errorText:{color:"#fecaca",fontSize:12,fontWeight:700},form:{borderRadius:16,border:"1px solid rgba(55,65,81,0.65)",background:"rgba(15,23,42,0.55)",padding:12,marginBottom:14},label:{fontSize:12,textTransform:"uppercase",letterSpacing:1.2,color:"#9ca3af",marginBottom:6,fontWeight:800},inputWrap:{borderRadius:999,border:"1px solid rgba(55,65,81,0.9)",overflow:"hidden",background:"rgba(2,6,23,0.65)"},input:{width:"100%",border:"none",outline:"none",background:"transparent",color:"#f9fafb",padding:"12px 14px",fontSize:14},addBtn:{marginTop:12,width:"100%",borderRadius:999,border:"1px solid rgba(34,197,94,0.45)",background:"linear-gradient(90deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",color:"#ecfdf5",padding:"11px 14px",fontWeight:900,letterSpacing:.3},sectionTitle:{marginTop:6,marginBottom:10,color:"#e5e7eb",fontSize:12,fontWeight:900,letterSpacing:1.1,textTransform:"uppercase"},loadingBox:{padding:18,display:"flex",gap:10,alignItems:"center"},loadingText:{color:"#9ca3af",fontSize:13},emptyText:{color:"#6b7280",fontSize:13,padding:6},list:{display:"flex",flexDirection:"column",gap:10,paddingBottom:26},trackTile:{borderRadius:16,border:"1px solid rgba(55,65,81,0.9)",background:"radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 70%)",padding:10},trackRow:{display:"flex",alignItems:"center",gap:10},monogramCircle:{width:38,height:38,borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,background:"rgba(59,130,246,0.22)",border:"1px solid rgba(129,140,248,0.7)",color:"#e5e7eb",flex:"0 0 auto"},trackTitle:{fontWeight:900,color:"#f9fafb",fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},trackArtist:{color:"#cbd5f5",fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2},trackTag:{color:"#9ca3af",fontSize:11,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2},trashBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(248,113,113,0.55)",background:"rgba(239,68,68,0.10)",cursor:"pointer",color:"#fecaca",fontSize:16},toast:{position:"fixed",right:16,top:16,display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:999,border:"1px solid rgba(255,255,255,0.16)",boxShadow:"0 18px 40px rgba(0,0,0,0.45)",zIndex:999},toastDot:{width:22,height:22,borderRadius:999,background:"rgba(255,255,255,0.88)",color:"#052e1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900},toastText:{color:"#ecfdf5",fontWeight:800,fontSize:13,letterSpacing:.2}};function Sv(i){return`
  .spinner{
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: ${i||"rgba(255,255,255,0.85)"};
    border-radius: 999px;
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  `}function Jr(i){return String(i||"").trim().toLowerCase()}function jv(){try{return Jr(localStorage.getItem("profileKey"))}catch{return""}}function kv(i){return`ownerToken:${Jr(i)}`}function Tv(i){try{return localStorage.getItem(kv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}async function Cv(i){try{return await i.json()}catch{return{}}}async function Rv(i,{profileKey:o,method:c="GET",body:u}={}){const f=Jr(o),p=Tv(f);return await fetch(i,{method:c,headers:{"content-type":"application/json","x-profile-key":f,...p?{Authorization:`Bearer ${p}`}:{}},body:u})}const Ev=(i,o)=>{const c=i?.trim?.()[0]||"",u=o?.trim?.()[0]||"";return(c+u).toUpperCase()},im=(i,o=0)=>{const c=i?._id||i?.id;if(c)return String(c);const u=String(i?.phone||"").trim(),f=String(i?.firstName||"").trim(),p=String(i?.lastName||"").trim(),m=`${u}-${f}-${p}`.replace(/\s+/g,"");return m&&m!=="--"?m:`contact-${o}`};function zv(){const i=String(navigator?.userAgent||"").toLowerCase();return i.includes("iphone")||i.includes("ipad")||i.includes("mac os")}function Lu(i){try{window.location.href=i}catch{}}function Nv(){const i=_e(),o=Fe(),c=Ge(),u=Jr(o?.profileKey),f=jv(),p=u||f||"",[m,b]=d.useState(p||""),[x,h]=d.useState(!1),S=c?.state?.bgUrl||null,[w,N]=d.useState("Owner"),[L,B]=d.useState("#818cf8"),[U,C]=d.useState([]),[T,E]=d.useState(""),[D,Q]=d.useState(null),[q,J]=d.useState(!0),[M,$]=d.useState(!1),[W,F]=d.useState(null),V=d.useRef(!1),A=d.useMemo(()=>!!m,[m]),Y=d.useCallback(k=>{const te=Jr(k||m);if(!te)return i("/",{replace:!0});i(`/world/${encodeURIComponent(te)}/owner/login`,{replace:!0,state:{profileKey:te,bgUrl:S}})},[i,m,S]),ie=()=>{if(!m)return i("/",{replace:!1});i(`/world/${encodeURIComponent(m)}/owner/home`,{state:{profileKey:m,bgUrl:S}})};d.useEffect(()=>{let k=!0;return(async()=>{try{const te=Jr(u||f||"");if(!k)return;if(b(te||""),!te){N("Owner"),B("#818cf8"),h(!0);return}const X=Rn(te);N(X?.label||X?.brandTopTitle||"Owner"),B(X?.accent||"#818cf8"),h(!0)}catch{if(!k)return;h(!0)}})(),()=>{k=!1}},[u]);const O=d.useCallback(async({isRefresh:k=!1}={})=>{if(!m){C([]),F('Missing profileKey. Open: /world/:profileKey/owner/contacts (or set localStorage("profileKey")).'),J(!1),$(!1);return}if(!V.current){V.current=!0;try{F(null),k?$(!0):J(!0);const te=await Rv("/api/owner/contacts",{profileKey:m,method:"GET"}),X=await Cv(te);if(te.status===401||te.status===403){C([]),F("Session expired. Please log in again."),Y(m);return}if(!te.ok||X?.ok===!1)throw new Error(X?.error||X?.message||"Failed to load contacts.");const le=Array.isArray(X)?X:Array.isArray(X?.contacts)?X.contacts:[];C(le)}catch(te){const X=te?.message||"Failed to load contacts.";F(X),String(X).toLowerCase().includes("unauthorized")&&(C([]),Y(m))}finally{J(!1),$(!1),V.current=!1}}},[m,Y]);d.useEffect(()=>{x&&O()},[x,O]);const j=d.useMemo(()=>{let k=U;const te=String(T||"").trim().toLowerCase();return te&&(k=k.filter(X=>{const le=`${X.firstName||""} ${X.lastName||""}`.toLowerCase(),ge=String(X.phone||"").toLowerCase();return le.includes(te)||ge.includes(te)})),[...k].sort((X,le)=>{const ge=`${X.firstName||""} ${X.lastName||""}`.trim().toLowerCase(),de=`${le.firstName||""} ${le.lastName||""}`.trim().toLowerCase();return ge<de?-1:ge>de?1:0})},[U,T]),K=(k,te)=>{const X=im(k,te);Q(le=>le===X?null:X)},I=k=>{k&&Lu(`tel:${k}`)},R=k=>{k&&Lu(`sms:${k}`)},H=k=>{k&&Lu(`facetime:${k}`)},v=k=>{m&&i(`/world/${encodeURIComponent(m)}/owner/messages`,{state:{profileKey:m,bgUrl:S,contact:k,contactId:k?._id||k?.id||null}})};return a.jsxs("div",{style:Le.page(L),children:[a.jsx("style",{children:Av(L)}),a.jsxs("div",{style:Le.header,children:[a.jsx("button",{style:Le.backBtn,onClick:ie,title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1},children:[a.jsx("div",{style:Le.title,children:"Contacts"}),a.jsxs("div",{style:Le.subtitle,children:[w," • ",U.length," contact",U.length===1?"":"s",m?` • ${m}`:""]}),A?null:a.jsx("div",{style:{...Le.subtitle,color:"#fca5a5"},children:"Missing profileKey. Cannot load owner contacts."})]}),a.jsx("button",{style:{...Le.ghostBtn,opacity:M?.7:1},onClick:()=>O({isRefresh:!0}),disabled:!A||M,title:"Refresh",children:"⟳"})]}),a.jsxs("div",{style:Le.searchWrap,children:[a.jsx("span",{style:{opacity:.9},children:"🔎"}),a.jsx("input",{value:T,onChange:k=>E(k.target.value),placeholder:"Search name or phone",style:Le.searchInput}),T?a.jsx("button",{style:Le.clearBtn,onClick:()=>E(""),title:"Clear",children:"✕"}):null]}),W?a.jsxs("div",{style:Le.errorBanner,children:[a.jsx("div",{style:Le.errorText,children:W}),a.jsx("button",{style:Le.retryBtn,onClick:()=>O({isRefresh:!0}),children:"Retry"})]}):null,q?a.jsxs("div",{style:Le.center,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:Le.muted,children:"Loading contacts…"})]}):j.length===0?a.jsxs("div",{style:Le.center,children:[a.jsx("div",{style:Le.emptyTitle,children:"No contacts yet"}),a.jsx("div",{style:Le.muted,children:"Once people fill out your contact form, they’ll appear here."})]}):a.jsx("div",{style:Le.list,children:j.map((k,te)=>{const X=im(k,te),le=D===X,ge=Ev(k.firstName,k.lastName),de=`${k.firstName||""} ${k.lastName||""}`.trim()||"(No name)",ae=String(k.phone||"").trim(),pe=k.note&&k.note.length>40?k.note.slice(0,40)+"…":k.note||"";return a.jsxs("div",{style:Le.card,children:[a.jsxs("div",{style:Le.cardTopRow,children:[a.jsx("div",{style:Le.avatarSquare,children:ge||"??"}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:Le.cardName,title:de,children:de}),ae?a.jsx("div",{style:Le.cardPhone,title:ae,children:ae}):null,pe?a.jsx("div",{style:Le.cardNote,title:k.note||"",children:pe}):null]}),a.jsx("button",{style:Le.expandBtn,onClick:()=>K(k,te),title:le?"Collapse":"Expand",children:le?"▴":"▾"})]}),le?a.jsxs("div",{style:Le.expandedArea,children:[a.jsx("div",{style:Le.expandedLabel,children:"Quick actions"}),a.jsxs("div",{style:Le.actionsRow,children:[ae?a.jsx("button",{style:Le.actionBtn,onClick:()=>I(ae),children:"📞 Call"}):null,ae?a.jsx("button",{style:Le.actionBtn,onClick:()=>R(ae),children:"💬 Text"}):null,a.jsx("button",{style:Le.actionBtn,onClick:()=>v(k),children:"🧠 Chat"}),zv()&&ae?a.jsx("button",{style:Le.actionBtn,onClick:()=>H(ae),children:"🎥 FaceTime"}):null]}),k.address?a.jsxs("div",{style:{marginTop:10},children:[a.jsx("div",{style:Le.expandedLabel,children:"Address"}),a.jsx("div",{style:Le.expandedValue,children:k.address})]}):null,k.note?a.jsxs("div",{style:{marginTop:10},children:[a.jsx("div",{style:Le.expandedLabel,children:"Note"}),a.jsx("div",{style:Le.expandedValue,children:k.note})]}):null,k.selfieUrl?a.jsxs("div",{style:{marginTop:10},children:[a.jsx("div",{style:Le.expandedLabel,children:"Selfie"}),a.jsx("img",{src:k.selfieUrl,alt:"selfie",style:Le.selfieImage,onError:ue=>{ue.currentTarget.style.display="none"}})]}):null]}):null]},X)})})]})}const Le={page:i=>({minHeight:"100vh",background:"linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.92))",color:"#e5e7eb",padding:16,fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',position:"relative"}),header:{display:"flex",alignItems:"center",gap:12,paddingBottom:12},backBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.10)",color:"#fff",fontWeight:900,cursor:"pointer"},ghostBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.08)",color:"#fff",fontWeight:900,cursor:"pointer"},title:{color:"#fff",fontSize:22,fontWeight:900,letterSpacing:.8},subtitle:{marginTop:4,color:"#cfd3dc",fontSize:12},searchWrap:{borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.06)",padding:"10px 12px",display:"flex",alignItems:"center",gap:10,marginBottom:10,overflow:"hidden"},searchInput:{flex:1,border:"none",outline:"none",background:"transparent",color:"#fff",fontSize:14},clearBtn:{border:"none",background:"transparent",color:"#cfd3dc",cursor:"pointer",fontWeight:900},errorBanner:{marginBottom:10,padding:10,borderRadius:12,background:"rgba(255,0,0,0.12)",border:"1px solid rgba(255,0,0,0.40)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10},errorText:{color:"#ffb3b3",fontSize:12,fontWeight:800,flex:1},retryBtn:{borderRadius:999,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.22)",background:"rgba(15,23,42,0.75)",color:"#fff",fontWeight:900,cursor:"pointer"},list:{display:"flex",flexDirection:"column",gap:12,paddingBottom:24},card:{borderRadius:18,border:"1px solid rgba(255,255,255,0.14)",background:"radial-gradient(circle at 25% 15%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 70%)",padding:10},cardTopRow:{display:"flex",alignItems:"flex-start",gap:10},avatarSquare:{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.20)",color:"#fff",fontWeight:900,letterSpacing:.8,flex:"0 0 auto"},cardName:{color:"#fff",fontWeight:900,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},cardPhone:{color:"#cfd3dc",fontSize:13,marginTop:2},cardNote:{color:"#9ea4b5",fontSize:11,marginTop:2},expandBtn:{width:34,height:34,borderRadius:999,border:"1px solid rgba(148,163,184,0.65)",background:"rgba(15,23,42,0.80)",color:"#fff",cursor:"pointer",fontWeight:900,flex:"0 0 auto"},expandedArea:{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.12)"},expandedLabel:{color:"#9ca3af",fontSize:11,textTransform:"uppercase",letterSpacing:.6,fontWeight:900},expandedValue:{color:"#e5e7eb",fontSize:13,marginTop:4,whiteSpace:"pre-wrap"},actionsRow:{display:"flex",flexWrap:"wrap",gap:8,marginTop:8},actionBtn:{borderRadius:999,padding:"8px 12px",border:"1px solid rgba(148,163,184,0.65)",background:"rgba(15,23,42,0.85)",color:"#fff",fontWeight:900,cursor:"pointer"},selfieImage:{marginTop:8,width:"100%",maxHeight:360,objectFit:"cover",borderRadius:12,border:"1px solid rgba(255,255,255,0.18)"},center:{padding:26,display:"flex",flexDirection:"column",alignItems:"center",gap:10},emptyTitle:{color:"#fff",fontSize:18,fontWeight:900},muted:{color:"#cfd3dc",fontSize:13,textAlign:"center"}};function Av(i){return`
    .spinner{
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: ${i||"rgba(255,255,255,0.85)"};
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}const Uv=3e3;function ei(i){return String(i||"").trim().toLowerCase()}function Ov(){try{return ei(localStorage.getItem("profileKey"))}catch{return""}}function Bv(i){return`ownerToken:${ei(i)}`}function Mv(i){try{return localStorage.getItem(Bv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}async function Lv(i){try{return await i.json()}catch{return{}}}async function _v(i,{profileKey:o,method:c="GET",body:u}={}){const f=ei(o),p=Mv(f);return await fetch(i,{method:c,headers:{"content-type":"application/json","x-profile-key":f,...p?{Authorization:`Bearer ${p}`}:{}},body:u})}function Dv(i){if(!i)return"";const o=new Date(i),u=new Date-o,f=Math.floor(u/6e4),p=Math.floor(u/36e5),m=Math.floor(u/864e5);return f<1?"Now":f<60?`${f}m`:p<24?`${p}h`:m===1?"Yesterday":o.toLocaleDateString([],{month:"short",day:"numeric"})}function $v(i){return Array.isArray(i)?i:Array.isArray(i?.threads)?i.threads:Array.isArray(i?.data)?i.data:Array.isArray(i?.items)?i.items:[]}const th=i=>`${i?.firstName||""} ${i?.lastName||""}`.trim()||"(No name)";function Hv(i){return!!i&&typeof i=="object"&&!Array.isArray(i)}function ol(i){const o=[i?.user,i?.authUser,i?.account,i?.customer,i?.profile,i?.identity];for(const c of o)if(Hv(c))return c;return null}function nh(i){const o=ol(i),c=`${o?.firstName||""} ${o?.lastName||""}`.trim()||o?.name||o?.fullName||o?.displayName||o?.username||o?.handle||"";return c?String(c).trim():o?.email?String(o.email).trim():i?.userId?`User ${String(i.userId).slice(0,8)}…`:"(Unknown user)"}function Iv(i){return i?.contact?th(i.contact):i?.threadType==="auth"||i?.userId?nh(i):"(Unknown user)"}function Kv(i){const o=i?.lastMessage?.body||"";return o?o.length>60?o.slice(0,57)+"…":o:"No messages yet. Tap to open."}function qv(i){if(i?.contact){const p=i.contact?.firstName?.trim?.()[0]||"",m=i.contact?.lastName?.trim?.()[0]||"";return(p+m).toUpperCase()||"?"}const o=ol(i),c=(o?.firstName||o?.name||o?.displayName||o?.username||"").trim?.()[0]||"",u=(o?.lastName||"").trim?.()[0]||"";return(c+u).toUpperCase().trim()||"U"}function Wv(i){return(i||[]).map(o=>{const c=o?.threadType==="auth"?`auth:${o?.userId||""}`:`c:${o?.contact?._id||o?.contactId||""}`,u=o?.lastAt||o?.lastMessage?.createdAt||"",f=Number(o?.unreadCount||0);return`${c}:${u}:${f}`}).join("|")}function Gv(){const i=_e(),o=Fe(),c=Ge(),u=ei(o?.profileKey),f=Ov(),p=u||f||"",[m,b]=d.useState(p||""),[x,h]=d.useState(!1),S=c?.state?.bgUrl||null,[w,N]=d.useState("Owner"),[L,B]=d.useState("#818cf8"),[U,C]=d.useState([]),[T,E]=d.useState(!0),[D,Q]=d.useState(!1),[q,J]=d.useState(null),[M,$]=d.useState(""),W=d.useRef(!1),F=d.useRef(""),V=d.useRef(!1),A=d.useRef(null),Y=d.useMemo(()=>!!m,[m]),ie=d.useCallback(R=>{const H=ei(R||m);if(!H)return i("/",{replace:!0});i(`/world/${encodeURIComponent(H)}/owner/login`,{replace:!0,state:{profileKey:H,bgUrl:S}})},[i,m,S]),O=()=>{if(!m)return i("/",{replace:!1});i(`/world/${encodeURIComponent(m)}/owner/home`,{state:{profileKey:m,bgUrl:S}})};d.useEffect(()=>{let R=!0;return(async()=>{try{const H=ei(u||f||"");if(!R)return;if(b(H||""),!H){N("Owner"),B("#818cf8"),h(!0);return}const v=Rn(H);N(v?.label||v?.brandTopTitle||"Owner"),B(v?.accent||"#818cf8"),h(!0)}catch{if(!R)return;h(!0)}})(),()=>{R=!1}},[u]);const j=d.useCallback(async({isRefresh:R=!1}={})=>{if(!x)return;if(!m){C([]),J("Missing profileKey. Open this page with /world/:profileKey/owner/messages."),E(!1),Q(!1);return}if(V.current)return;V.current=!0;const H=!W.current;try{J(null),H&&E(!0),R&&Q(!0);const v=await _v("/api/owner/chat/threads",{profileKey:m}),k=await Lv(v);if(v.status===401||v.status===403){C([]),J("Session expired. Please log in again."),ie(m);return}if(!v.ok||k?.ok===!1)throw new Error(k?.error||k?.message||`Failed to load message threads (${v.status}).`);const X=$v(k).filter(ge=>{const de=ge?.lastAt||ge?.lastMessage?.createdAt,ae=!!ge?.lastMessage?.body||!!de,pe=Number(ge?.unreadCount||0);return ae||pe>0}),le=Wv(X);le!==F.current&&(F.current=le,C(X)),W.current||(W.current=!0)}catch(v){const k=v?.message||"Failed to load messages.";J(k),String(k).toLowerCase().includes("unauthorized")&&(C([]),ie(m))}finally{E(!1),Q(!1),V.current=!1}},[x,m,ie]);d.useEffect(()=>{x&&j()},[x,j]),d.useEffect(()=>{if(!x||!m)return;const R=()=>{A.current||(A.current=setInterval(()=>j(),Uv))},H=()=>{A.current&&clearInterval(A.current),A.current=null},v=()=>{document.visibilityState==="visible"?R():H()};return document.visibilityState==="visible"&&R(),document.addEventListener("visibilitychange",v),()=>{document.removeEventListener("visibilitychange",v),H()}},[x,m,j]);const K=d.useMemo(()=>{const R=String(M||"").trim().toLowerCase();return R?U.filter(H=>{const v=(H?.contact?th(H.contact):nh(H)).toLowerCase(),k=String(H?.contact?.phone||"").toLowerCase(),te=String(H?.lastMessage?.body||"").toLowerCase(),X=String(H?.userId||"").toLowerCase(),le=String(ol(H)?.email||"").toLowerCase();return v.includes(R)||k.includes(R)||te.includes(R)||X.includes(R)||le.includes(R)}):U},[U,M]),I=d.useCallback(R=>{if(!m)return;const v=R?.threadType==="auth"||!!R?.userId&&!R?.contact?{profileKey:m,bgUrl:S,threadType:"auth",userId:R?.userId||null,user:ol(R),contact:null,contactId:null}:{profileKey:m,bgUrl:S,threadType:"contact",contact:R?.contact||null,contactId:R?.contact?._id||R?.contactId||null,user:null};i(`/world/${encodeURIComponent(m)}/owner/chat`,{state:v})},[i,m,S]);return a.jsxs("div",{style:We.page(L),children:[a.jsx("style",{children:Yv(L)}),a.jsxs("div",{style:We.header,children:[a.jsx("button",{style:We.backBtn,onClick:O,title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsxs("div",{style:We.title,children:[w," Messages"]}),a.jsxs("div",{style:We.subtitle,children:[U.length," thread",U.length===1?"":"s",m?` • ${m}`:""]}),Y?null:a.jsx("div",{style:{...We.subtitle,color:"#fca5a5"},children:"Missing profileKey."})]}),a.jsx("button",{style:{...We.ghostBtn,opacity:D?.7:1},onClick:()=>j({isRefresh:!0}),disabled:!Y||D,title:"Refresh",children:"⟳"})]}),a.jsxs("div",{style:We.searchWrap,children:[a.jsx("span",{style:{opacity:.9},children:"🔎"}),a.jsx("input",{value:M,onChange:R=>$(R.target.value),placeholder:"Search name, phone, userId, email, or message",style:We.searchInput}),M?a.jsx("button",{style:We.clearBtn,onClick:()=>$(""),title:"Clear",children:"✕"}):null]}),q?a.jsxs("div",{style:We.errorBanner,children:[a.jsx("div",{style:We.errorText,children:q}),a.jsx("button",{style:We.retryBtn,onClick:()=>j({isRefresh:!0}),children:"Retry"})]}):null,T?a.jsxs("div",{style:We.center,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:We.muted,children:"Loading messages…"})]}):m?K.length===0?a.jsxs("div",{style:We.center,children:[a.jsx("div",{style:We.emptyTitle,children:"No conversations yet"}),a.jsx("div",{style:We.muted,children:"Once people start messaging you, their chats will appear here."})]}):a.jsx("div",{style:We.list,children:K.map((R,H)=>{const v=Iv(R),k=Kv(R),te=qv(R),X=Dv(R?.lastAt||R?.lastMessage?.createdAt),le=Number(R?.unreadCount||0),ge=R?.contact?.phone?String(R.contact.phone):"",de=R?.threadType==="auth"||!!R?.userId&&!R?.contact,pe=ol(R)?.email||(R?.userId?`${String(R.userId).slice(0,12)}…`:""),ue=(R?.threadType==="auth"?`auth:${R?.userId||H}`:`c:${R?.contact?._id||R?.contactId||R?._id||H}`)||String(H);return a.jsx("button",{style:We.threadRowBtn,onClick:()=>I(R),title:"Open thread",children:a.jsxs("div",{style:We.threadRow,children:[a.jsx("div",{style:We.avatar,children:te||"?"}),a.jsxs("div",{style:We.threadMid,children:[a.jsxs("div",{style:We.nameRow,children:[a.jsx("div",{style:We.threadName,title:v,children:v}),ge?a.jsx("div",{style:We.threadMeta,title:ge,children:ge}):de&&pe?a.jsx("div",{style:We.threadMeta,title:pe,children:pe}):null]}),a.jsx("div",{style:We.threadSub,title:k,children:k})]}),a.jsxs("div",{style:We.threadRight,children:[le?a.jsx("div",{style:We.unreadPill,children:a.jsx("span",{style:We.unreadText,children:le>99?"99+":String(le)})}):null,X?a.jsx("div",{style:We.time,children:X}):null,a.jsx("div",{style:{opacity:.7},children:"›"})]})]})},ue)})}):a.jsxs("div",{style:We.center,children:[a.jsx("div",{style:We.emptyTitle,children:"Missing profileKey"}),a.jsx("div",{style:We.muted,children:"Open with /world/:profileKey/owner/messages."})]})]})}const We={page:i=>({minHeight:"100vh",background:"linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.92))",color:"#e5e7eb",padding:16,fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',position:"relative"}),header:{display:"flex",alignItems:"center",gap:12,paddingBottom:12},backBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.10)",color:"#fff",fontWeight:900,cursor:"pointer"},ghostBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.08)",color:"#fff",fontWeight:900,cursor:"pointer"},title:{color:"#fff",fontSize:22,fontWeight:900,letterSpacing:.8},subtitle:{marginTop:4,color:"#cfd3dc",fontSize:12},searchWrap:{borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.06)",padding:"10px 12px",display:"flex",alignItems:"center",gap:10,marginBottom:10,overflow:"hidden"},searchInput:{flex:1,border:"none",outline:"none",background:"transparent",color:"#fff",fontSize:14},clearBtn:{border:"none",background:"transparent",color:"#cfd3dc",cursor:"pointer",fontWeight:900},errorBanner:{marginBottom:10,padding:10,borderRadius:12,background:"rgba(255,0,0,0.12)",border:"1px solid rgba(255,0,0,0.40)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10},errorText:{color:"#ffb3b3",fontSize:12,fontWeight:900,flex:1},retryBtn:{borderRadius:999,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.22)",background:"rgba(15,23,42,0.75)",color:"#fff",fontWeight:900,cursor:"pointer"},list:{display:"flex",flexDirection:"column",gap:10,paddingBottom:24},threadRowBtn:{border:"none",background:"transparent",padding:0,textAlign:"left",cursor:"pointer"},threadRow:{borderRadius:18,border:"1px solid rgba(255,255,255,0.12)",background:"radial-gradient(circle at 25% 15%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 70%)",padding:12,display:"flex",alignItems:"center",gap:12},avatar:{width:42,height:42,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(96,165,250,0.30)",border:"1px solid rgba(191,219,254,0.90)",color:"#0b1020",fontWeight:900,letterSpacing:.8,flex:"0 0 auto"},threadMid:{flex:1,minWidth:0},nameRow:{display:"flex",alignItems:"baseline",gap:10},threadName:{color:"#f9fafb",fontWeight:900,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"},threadMeta:{color:"#94a3b8",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:"1 1 auto"},threadSub:{color:"#cfd3dc",opacity:.85,fontSize:12,marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},threadRight:{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:6,flex:"0 0 auto"},unreadPill:{minWidth:22,height:22,padding:"0 7px",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(34,197,94,0.95)",border:"1px solid rgba(187,247,208,0.95)"},unreadText:{color:"#052e16",fontWeight:900,fontSize:11},time:{color:"#9ca3af",fontSize:11},center:{padding:26,display:"flex",flexDirection:"column",alignItems:"center",gap:10},emptyTitle:{color:"#fff",fontSize:18,fontWeight:900},muted:{color:"#cfd3dc",fontSize:13,textAlign:"center"}};function Yv(i){return`
    .spinner{
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: ${i||"rgba(255,255,255,0.85)"};
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}const Fv=3e3;function Go(i){return String(i||"").trim().toLowerCase()||""}function Vv(i){return!!i&&typeof i=="object"&&!Array.isArray(i)}function Wu(i){return Vv(i)?i:null}function Xv(i,o){const c=Wu(i),u=`${c?.firstName||""} ${c?.lastName||""}`.trim()||c?.name||c?.fullName||c?.displayName||c?.username||c?.handle||"";return u?String(u).trim():c?.email?String(c.email).trim():o?`User ${String(o).slice(0,8)}…`:"(Unknown user)"}function Qv(i){return Array.isArray(i)?i:Array.isArray(i?.messages)?i.messages:Array.isArray(i?.data)?i.data:[]}async function _u(i){try{return await i.json()}catch{return{}}}function Pv(){try{return Go(localStorage.getItem("profileKey"))}catch{return""}}function Zv(i){return`ownerToken:${Go(i)}`}function Jv(i){try{return localStorage.getItem(Zv(i))||localStorage.getItem("ownerToken")||""}catch{return""}}async function Tn(i,{profileKey:o,method:c="GET",body:u}={}){const f=Go(o),p=Jv(f);return await fetch(i,{method:c,headers:{"content-type":"application/json","x-profile-key":f,...p?{Authorization:`Bearer ${p}`}:{}},body:u})}async function ew(i,o){let c=await Tn(`/api/owner/messages/${encodeURIComponent(o)}`,{profileKey:i,method:"GET"});return c.status!==404||(c=await Tn(`/api/contacts/${encodeURIComponent(o)}/messages`,{profileKey:i,method:"GET"}),c.status!==404)?c:Tn(`/api/messages?contactId=${encodeURIComponent(o)}`,{profileKey:i,method:"GET"})}async function tw(i,o,c){let u=await Tn("/api/owner/messages",{profileKey:i,method:"POST",body:JSON.stringify({contactId:o,body:c})});return u.status!==404||(u=await Tn(`/api/contacts/${encodeURIComponent(o)}/messages`,{profileKey:i,method:"POST",body:JSON.stringify({body:c,sender:"owner"})}),u.status!==404)?u:Tn("/api/messages",{profileKey:i,method:"POST",body:JSON.stringify({contactId:o,body:c,sender:"owner"})})}async function nw(i,o){let c=await Tn(`/api/contacts/${encodeURIComponent(o)}/messages`,{profileKey:i,method:"DELETE"});return c.status!==404||(c=await Tn(`/api/messages?contactId=${encodeURIComponent(o)}`,{profileKey:i,method:"DELETE"}),c.status!==404)?c:Tn("/api/messages/clear",{profileKey:i,method:"POST",body:JSON.stringify({contactId:o})})}async function aw(i,o){return Tn(`/api/owner/chat/${encodeURIComponent(o)}/messages`,{profileKey:i,method:"GET"})}async function rw(i,o,c){return Tn(`/api/owner/chat/${encodeURIComponent(o)}/messages`,{profileKey:i,method:"POST",body:JSON.stringify({body:c})})}async function iw(i,o){return Tn(`/api/owner/chat/${encodeURIComponent(o)}/messages`,{profileKey:i,method:"DELETE"})}function lw(i){if(!i)return"";try{return new Date(i).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}catch{return""}}function ow(){const i=_e(),o=Fe(),c=Ge(),u=Go(o?.profileKey),f=Pv(),p=u||f||"",m=c?.state||{},b=String(m?.threadType||"contact").toLowerCase(),x=m?.userId?String(m.userId):null,h=m?.contact||{},S=m?.contactId||h?._id||h?.id||null,w=b==="auth"||!!x&&!S,[N,L]=d.useState(()=>Wu(m?.user)),[B,U]=d.useState([]),[C,T]=d.useState(""),[E,D]=d.useState(!0),[Q,q]=d.useState(!1),[J,M]=d.useState(!1),[$,W]=d.useState(null),F=d.useRef(null),V=d.useRef(!1),A=d.useRef(!1),Y=d.useRef(null),ie=d.useMemo(()=>p?Rn(p):null,[p]),O=ie?.label||ie?.brandTopTitle||"Owner",j=ie?.accent||"#818cf8",K=`${h?.firstName||""} ${h?.lastName||""}`.trim(),I=d.useMemo(()=>w?Xv(N,x):K||h?.name||"Unknown",[w,N,x,K,h?.name]),R=d.useMemo(()=>{const de=[];return!w&&h?.phone&&de.push(String(h.phone)),w&&x&&de.push(`userId ${String(x).slice(0,12)}…`),p&&de.push(p),de.join(" • ")},[w,h?.phone,x,p]),H=d.useCallback(()=>{if(!p)return i("/",{replace:!0});i(`/world/${encodeURIComponent(p)}/owner/login`,{replace:!0,state:{profileKey:p}})},[i,p]),v=d.useCallback((de=!0)=>{const ae=F.current;if(ae)try{ae.scrollTo({top:ae.scrollHeight,behavior:de?"smooth":"auto"})}catch{}},[]);d.useEffect(()=>{const de=setTimeout(()=>v(!0),40);return()=>clearTimeout(de)},[C,v]);const k=d.useCallback(async()=>{if(!p){D(!1),W("Missing profileKey.");return}if(w){if(!x){D(!1),W("Missing userId for auth thread.");return}}else if(!S){D(!1),W("Missing contact id.");return}if(A.current)return;A.current=!0;const de=!V.current;try{de&&D(!0),W(null);const ae=w?await aw(p,x):await ew(p,S),pe=await _u(ae);if(ae.status===401||ae.status===403){U([]),W("Session expired. Please log in again."),H();return}if(!ae.ok)throw new Error(pe?.error||pe?.message||"Failed to load messages");w&&Wu(pe?.user)&&L(pe.user);const ue=Qv(pe);U(me=>{const Ve=me.length?String(me[me.length-1]?._id||me[me.length-1]?.id):null,ht=ue.length?String(ue[ue.length-1]?._id||ue[ue.length-1]?.id):null;return me.length===ue.length&&Ve&&ht&&Ve===ht?me:ue}),de&&(V.current=!0,setTimeout(()=>v(!1),50))}catch(ae){W(ae?.message||"Failed to load messages")}finally{D(!1),A.current=!1}},[p,w,x,S,H,v]);d.useEffect(()=>{k()},[k]),d.useEffect(()=>{if(!p||w&&!x||!w&&!S)return;const de=()=>{Y.current||(Y.current=setInterval(k,Fv))},ae=()=>{Y.current&&clearInterval(Y.current),Y.current=null},pe=()=>{document.visibilityState==="visible"?de():ae()};return document.visibilityState==="visible"&&de(),document.addEventListener("visibilitychange",pe),()=>{document.removeEventListener("visibilitychange",pe),ae()}},[p,w,x,S,k]);const te=d.useCallback(async()=>{if(!p)return W("Missing profileKey.");const de=String(C||"").trim();if(!de||Q)return;if(w){if(!x)return W("Missing userId for auth thread.")}else if(!S)return W("Missing contactId.");const ae={_id:`tmp-${Date.now()}`,sender:"owner",body:de,createdAt:new Date().toISOString(),_optimistic:!0};U(pe=>[...pe,ae]),T(""),q(!0),setTimeout(()=>v(!0),40);try{const pe=w?await rw(p,x,de):await tw(p,S,de),ue=await _u(pe);if(pe.status===401||pe.status===403){W("Session expired. Please log in again."),H();return}if(!pe.ok)throw new Error(ue?.error||ue?.message||"Failed to send message");const me=ue?.message||ue;U(Ve=>[...Ve.filter(et=>String(et._id||et.id)!==String(ae._id)),me]),setTimeout(()=>v(!0),50)}catch(pe){W(pe?.message||"Failed to send message"),U(ue=>ue.filter(me=>String(me._id||me.id)!==String(ae._id))),T(de)}finally{q(!1)}},[p,C,Q,w,x,S,H,v]),X=d.useCallback(async()=>{if(!p)return W("Missing profileKey.");if(J)return;if(w){if(!x)return W("Missing userId for auth thread.")}else if(!S)return W("Missing contactId.");if(window.confirm(`Delete chat?

This will delete all messages in this thread. This cannot be undone.`))try{M(!0),W(null);const ae=w?await iw(p,x):await nw(p,S),pe=await _u(ae);if(ae.status===401||ae.status===403){W("Session expired. Please log in again."),H();return}if(!ae.ok)throw new Error(pe?.error||pe?.message||"Failed to delete chat");U([]),alert("Chat cleared.")}catch(ae){W(ae?.message||"Failed to delete chat")}finally{M(!1)}},[p,J,w,x,S,H]),le=()=>{if(!p)return i("/",{replace:!1});i(`/world/${encodeURIComponent(p)}/owner/messages`,{state:{profileKey:p}})},ge=!p||Q||(w?!x:!S);return a.jsxs("div",{style:yt.page(j),children:[a.jsx("style",{children:sw(j)}),a.jsxs("div",{style:yt.header,children:[a.jsx("button",{style:yt.iconBtn,onClick:le,title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:yt.headerName,title:I,children:I}),R?a.jsx("div",{style:yt.headerSub,children:R}):null]}),a.jsx("button",{style:yt.iconBtn,onClick:()=>{const de=window.prompt("Type: r = refresh, d = delete","r");de&&(de.toLowerCase()==="d"?X():k())},title:"Menu",children:"⋯"})]}),a.jsx("div",{style:yt.body,children:E?a.jsxs("div",{style:yt.center,children:[a.jsx("div",{className:"spinner"}),a.jsx("div",{style:yt.muted,children:"Loading messages…"})]}):$?a.jsxs("div",{style:yt.center,children:[a.jsx("div",{style:yt.errorText,children:$}),a.jsx("button",{style:yt.retryBtn,onClick:k,children:"Retry"})]}):a.jsx("div",{ref:F,style:yt.list,onScroll:()=>{},children:a.jsx("div",{style:{padding:"10px 16px 12px"},children:B.map((de,ae)=>{const pe=de?.sender==="owner",ue=String(de?.body||""),me=lw(de?.createdAt);return a.jsxs("div",{style:{display:"flex",justifyContent:pe?"flex-end":"flex-start",margin:"10px 0",gap:8},children:[pe?null:a.jsx("div",{style:yt.smallAvatar,children:(I?.[0]||"A").toUpperCase()}),a.jsxs("div",{style:{...yt.bubble,...pe?yt.bUser:yt.bOwner},children:[a.jsx("div",{style:yt.msg,children:ue}),a.jsx("div",{style:yt.time,children:me})]})]},String(de?._id||de?.id||ae))})})})}),a.jsxs("div",{style:yt.composerWrap,children:[a.jsxs("div",{style:yt.composer,children:[a.jsx("span",{style:{color:"#fff",opacity:.9},children:"💬"}),a.jsx("textarea",{value:C,onChange:de=>T(de.target.value),placeholder:"what's up...",style:yt.textarea,rows:1,onKeyDown:de=>{de.key==="Enter"&&!de.shiftKey&&(de.preventDefault(),te())},disabled:!p||(w?!x:!S)}),a.jsx("button",{style:{...yt.sendBtn,opacity:ge?.6:1},disabled:ge,onClick:te,title:"Send",children:Q?a.jsx("span",{className:"miniSpinner"}):"Send"})]}),a.jsx("div",{style:{paddingBottom:10,display:"flex",justifyContent:"center"},children:a.jsxs("div",{style:{fontSize:11,color:"rgba(148,163,184,0.85)"},children:[O," chat • ",w?"auth":"contact",J?" • deleting…":""]})})]})]})}const yt={page:i=>({minHeight:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(180deg, #050509, #0b1220, #020617)",color:"#e5e7eb",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'}),header:{padding:"12px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.10)",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)",background:"rgba(2,6,23,0.65)"},iconBtn:{width:40,height:40,borderRadius:999,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.08)",color:"#fff",fontWeight:900,cursor:"pointer"},headerName:{color:"#fff",fontSize:16,fontWeight:900,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},headerSub:{color:"#94a3b8",fontSize:12,marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},body:{flex:1,display:"flex",flexDirection:"column"},list:{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"},center:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:24},muted:{color:"#9ca3af",fontSize:13,textAlign:"center"},errorText:{color:"#fca5a5",textAlign:"center",fontWeight:800},retryBtn:{padding:"8px 14px",borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(15,23,42,0.75)",color:"#fff",fontWeight:900,cursor:"pointer"},smallAvatar:{width:26,height:26,borderRadius:999,background:"rgba(148,163,255,0.40)",border:"1px solid rgba(191,219,254,0.70)",display:"flex",alignItems:"center",justifyContent:"center",color:"#0b1020",fontWeight:900,flex:"0 0 auto"},bubble:{maxWidth:"78%",borderRadius:18,border:"1px solid rgba(255,255,255,0.16)",padding:"10px 12px",backdropFilter:"blur(10px)"},bOwner:{borderTopLeftRadius:6,background:"linear-gradient(180deg, rgba(124,58,237,0.35), rgba(15,23,42,0.70))"},bUser:{borderTopRightRadius:6,background:"linear-gradient(180deg, rgba(255,255,255,0.18), rgba(148,163,184,0.30))"},msg:{color:"#fff",fontSize:14,lineHeight:"20px",whiteSpace:"pre-wrap"},time:{color:"#9ca3af",fontSize:11,marginTop:6,textAlign:"right"},composerWrap:{position:"sticky",bottom:0,zIndex:10,padding:"10px 12px 0",background:"linear-gradient(180deg, rgba(2,6,23,0), rgba(2,6,23,0.85) 30%, rgba(2,6,23,0.96))",backdropFilter:"blur(10px)",borderTop:"1px solid rgba(255,255,255,0.08)"},composer:{borderRadius:999,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(15,23,42,0.90)",display:"flex",alignItems:"flex-end",gap:10,padding:"10px 12px"},textarea:{flex:1,resize:"none",border:"none",outline:"none",background:"transparent",color:"#fff",fontSize:14,lineHeight:"20px",maxHeight:120,padding:"2px 0"},sendBtn:{borderRadius:999,border:"none",background:"#ffffff",color:"#000",fontWeight:900,padding:"10px 14px",cursor:"pointer",minWidth:72}};function sw(i){return`
    .spinner{
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: ${i};
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }
    .miniSpinner{
      display:inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(0,0,0,0.25);
      border-top-color: rgba(0,0,0,0.85);
      border-radius: 999px;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}function Du(i){return String(i||"").trim().toLowerCase()}function cw(){try{return localStorage.getItem("activeProfileKey")||""}catch{return""}}function lm(i){const o=Number(i||0)/100;return Number.isFinite(o)?`$${o.toFixed(2)}`:"$0.00"}function om(i){const o=parseFloat(String(i||"").trim());return Number.isNaN(o)||o<0?null:Math.round(o*100)}async function _a(i){return i.json().catch(()=>({}))}function Da(i){return String(i||"").toLowerCase().includes("unauthorized")}async function $u({uploadUrl:i,file:o,contentType:c}){const u=await fetch(i,{method:"PUT",headers:c?{"Content-Type":c}:void 0,body:o});if(!u.ok)throw new Error(`Upload to S3 failed (status ${u.status})`)}function sm({open:i,title:o,onClose:c,children:u,footer:f}){return i?a.jsx("div",{className:"omodalBack",onMouseDown:c,children:a.jsxs("div",{className:"omodalCard",onMouseDown:p=>p.stopPropagation(),children:[a.jsxs("div",{className:"omodalHeader",children:[a.jsx("div",{className:"omodalTitle",children:o}),a.jsx("button",{className:"oiconBtn",onClick:c,"aria-label":"Close",children:"✕"})]}),a.jsx("div",{className:"omodalBody",children:u}),f?a.jsx("div",{className:"omodalFooter",children:f}):null]})}):null}function uw(){const i=_e(),{profileKey:o}=Fe(),c=Ge(),[u,f]=d.useState(null),[p,m]=d.useState(!1),[b,x]=d.useState("Owner"),[h,S]=d.useState({albumCount:0,trackCount:0}),[w,N]=d.useState([]),[L,B]=d.useState([]),[U,C]=d.useState(!0),[T,E]=d.useState(!1),[D,Q]=d.useState(!1),[q,J]=d.useState(null),[M,$]=d.useState(""),[W,F]=d.useState(""),[V,A]=d.useState(""),[Y,ie]=d.useState("30"),[O,j]=d.useState(""),[K,I]=d.useState(""),[R,H]=d.useState(""),[v,k]=d.useState(""),[te,X]=d.useState(""),[le,ge]=d.useState(!1),[de,ae]=d.useState(!1),[pe,ue]=d.useState(!1),[me,Ve]=d.useState(null),[ht,et]=d.useState(""),[Jt,en]=d.useState(""),[tn,Bn]=d.useState(""),[$a,qn]=d.useState(""),[En,fe]=d.useState(!1),[be,ze]=d.useState(!1);d.useMemo(()=>!!u,[u]);const tt=d.useCallback(oe=>{const Re=Du(oe||u||o),Ne=encodeURIComponent(c.pathname+c.search);i(`/owner/login?profileKey=${encodeURIComponent(Re)}&next=${Ne}`,{replace:!0})},[i,u,o,c.pathname,c.search]);d.useEffect(()=>{const oe=Du(o)||Du(cw());f(oe||null),x("Owner"),m(!0)},[o]);const dt=d.useMemo(()=>{const oe=[...w];return oe.sort((Re,Ne)=>String(Re.title||"").localeCompare(String(Ne.title||""))),oe},[w]),At=d.useCallback(async()=>{if(u){C(!0);try{const oe=await Un("/api/owner/music/catalog",{profileKey:u}),Re=await _a(oe);if(!oe.ok){const Ne=Re?.error||"Failed to load catalog";if(Da(Ne)){tt(u);return}throw new Error(Ne)}S(Re.stats||{albumCount:0,trackCount:0}),N(Array.isArray(Re.albums)?Re.albums:[]),B(Array.isArray(Re.tracks)?Re.tracks:[])}catch(oe){console.error("OwnerMusicPage load error:",oe),alert(oe?.message||"Unable to load catalog.")}finally{C(!1)}}},[u,tt]);d.useEffect(()=>{!p||!u||At()},[p,u,At]);const nn=()=>{Ve(null),et(""),en(""),Bn(""),qn(""),ue(!0)},Yo=oe=>{Ve(oe),et(oe?.title||""),en(typeof oe?.priceCents=="number"?(oe.priceCents/100).toFixed(2):""),Bn(oe?.coverImageUrl||""),qn(oe?.coverImageKey||""),ue(!0)},pl=async()=>{if(!u)return;const oe=String(ht||"").trim();if(!oe)return alert("Missing title");const Re=om(Jt);if(Re===null)return alert("Enter a valid price in dollars.");const Ne={title:oe,priceCents:Re,coverImageKey:$a||null,coverImageUrl:tn||null};fe(!0);try{let ft="/api/owner/music/albums",pn="POST";me?._id&&(ft=`/api/owner/music/albums/${me._id}`,pn="PUT");const Wn=await Un(ft,{profileKey:u,method:pn,headers:{"Content-Type":"application/json"},body:JSON.stringify(Ne)}),an=await _a(Wn);if(!Wn.ok){const Ia=an?.error||"Failed to save album";if(Da(Ia))return tt(u);throw new Error(Ia)}await At(),ue(!1)}catch(ft){console.error("saveAlbum error:",ft),alert(ft?.message||"Could not save album.")}finally{fe(!1)}},Fo=async()=>{if(me?._id&&confirm(`Delete album "${me.title}"? Tracks will become singles.`))try{const oe=await Un(`/api/owner/music/albums/${me._id}`,{profileKey:u,method:"DELETE"}),Re=await _a(oe);if(!oe.ok){const Ne=Re?.error||"Failed to delete album";if(Da(Ne))return tt(u);throw new Error(Ne)}await At(),ue(!1)}catch(oe){console.error("deleteAlbum error:",oe),alert(oe?.message||"Could not delete album.")}},Vo=async oe=>{if(oe&&u){ze(!0);try{const Re=await Un("/api/owner/music/upload-url",{profileKey:u,method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:oe.name||"album-cover.jpg",contentType:oe.type||"image/jpeg"})}),Ne=await _a(Re);if(!Re.ok){const ft=Ne?.error||"Failed to get artwork upload URL.";if(Da(ft))return tt(u);throw new Error(ft)}if(!Ne?.uploadUrl||!Ne?.key)throw new Error("Upload URL response missing uploadUrl/key");await $u({uploadUrl:Ne.uploadUrl,file:oe,contentType:oe.type}),qn(Ne.key),Bn(Ne.publicUrl||URL.createObjectURL(oe)),alert("Album artwork uploaded.")}catch(Re){console.error("album artwork upload error:",Re),alert(Re?.message||"Could not upload artwork.")}finally{ze(!1)}}},Ha=()=>{J(null),$(""),F(""),A(""),ie("30"),I(""),H(""),k(""),X(""),j(dt?.[0]?._id||""),E(!0)},$t=oe=>{const Re=oe.coverImageUrl||oe.albumCoverImageUrl||"";J(oe),$(oe?.title||""),F(typeof oe?.priceCents=="number"?(oe.priceCents/100).toFixed(2):""),A(typeof oe?.durationSeconds=="number"?String(oe.durationSeconds):""),ie(typeof oe?.previewSeconds=="number"?String(oe.previewSeconds):"30"),j(oe?.albumId||""),I(oe?.s3KeyPreview||""),H(oe?.s3KeyFull||""),k(Re),X(oe?.coverImageKey||""),E(!0)},Mn=async()=>{if(!u)return;const oe=String(M||"").trim();if(!oe)return alert("Missing track title");const Re=parseInt(V,10);if(!Number.isFinite(Re)||Re<=0)return alert("Enter duration in seconds (e.g. 240)");const Ne=om(W);if(Ne===null)return alert("Enter a valid price in dollars.");const ft=parseInt(Y,10),pn=Number.isFinite(ft)&&ft>0?ft:30,Wn={title:oe,durationSeconds:Re,priceCents:Ne,previewSeconds:pn,albumId:O||null,s3KeyPreview:String(K||"").trim()||null,s3KeyFull:String(R||"").trim()||null,coverImageKey:te||null,coverImageUrl:v||null};Q(!0);try{let an="/api/owner/music/tracks",Ia="POST";q?._id&&(an=`/api/owner/music/tracks/${q._id}`,Ia="PUT");const ri=await Un(an,{profileKey:u,method:Ia,headers:{"Content-Type":"application/json"},body:JSON.stringify(Wn)}),ii=await _a(ri);if(!ri.ok){const fa=ii?.error||"Failed to save track";if(Da(fa))return tt(u);throw new Error(fa)}await At(),E(!1)}catch(an){console.error("saveTrack error:",an),alert(an?.message||"Could not save track.")}finally{Q(!1)}},Ht=async()=>{if(q?._id&&confirm(`Delete track "${q.title}"?`))try{const oe=await Un(`/api/owner/music/tracks/${q._id}`,{profileKey:u,method:"DELETE"}),Re=await _a(oe);if(!oe.ok){const Ne=Re?.error||"Failed to delete track";if(Da(Ne))return tt(u);throw new Error(Ne)}await At(),E(!1)}catch(oe){console.error("deleteTrack error:",oe),alert(oe?.message||"Could not delete track.")}},Xo=async oe=>{if(oe&&u){ge(!0);try{const Re=await Un("/api/owner/music/upload-url",{profileKey:u,method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:oe.name||"cover.jpg",contentType:oe.type||"image/jpeg"})}),Ne=await _a(Re);if(!Re.ok){const ft=Ne?.error||"Failed to get artwork upload URL.";if(Da(ft))return tt(u);throw new Error(ft)}if(!Ne?.uploadUrl||!Ne?.key)throw new Error("Upload URL response missing uploadUrl/key");await $u({uploadUrl:Ne.uploadUrl,file:oe,contentType:oe.type}),X(Ne.key),k(Ne.publicUrl||URL.createObjectURL(oe)),alert("Artwork uploaded.")}catch(Re){console.error("track artwork upload error:",Re),alert(Re?.message||"Could not upload artwork.")}finally{ge(!1)}}},Qo=async oe=>{if(oe&&u){ae(!0);try{const Re=await Un("/api/owner/music/upload-url",{profileKey:u,method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:oe.name||"track.m4a",contentType:oe.type||"audio/m4a"})}),Ne=await _a(Re);if(!Re.ok){const ft=Ne?.error||"Failed to get upload URL.";if(Da(ft))return tt(u);throw new Error(ft)}if(!Ne?.uploadUrl||!Ne?.key)throw new Error("Upload URL response missing uploadUrl/key");await $u({uploadUrl:Ne.uploadUrl,file:oe,contentType:oe.type}),H(Ne.key),I(ft=>ft||Ne.key),alert("Upload complete. Full key set (and preview key set if empty).")}catch(Re){console.error("full upload error:",Re),alert(Re?.message||"Could not upload audio.")}finally{ae(!1)}}};return a.jsxs("div",{className:"opage",children:[a.jsxs("div",{className:"oheader",children:[a.jsx("button",{className:"oiconBtn",onClick:()=>i(-1),title:"Back",children:"✕"}),a.jsxs("div",{className:"oheaderCenter",children:[a.jsxs("div",{className:"otitle",children:[b," Music"]}),a.jsxs("div",{className:"osubtitle",children:["Manage your catalog & pricing",u?` • ${u}`:""]})]}),a.jsxs("div",{className:"ochip",children:[a.jsx("span",{className:"ochipDot"}),a.jsxs("span",{children:[h.trackCount," tracks"]})]})]}),u?U?a.jsxs("div",{className:"oload",children:[a.jsx("div",{className:"ospin"}),a.jsx("div",{className:"oloadTxt",children:"Loading catalog…"})]}):a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"ostats",children:[a.jsxs("div",{className:"ostat",children:[a.jsx("div",{className:"ostatNum",children:h.albumCount}),a.jsx("div",{className:"ostatLabel",children:"Albums"})]}),a.jsxs("div",{className:"ostat",children:[a.jsx("div",{className:"ostatNum",children:h.trackCount}),a.jsx("div",{className:"ostatLabel",children:"Tracks"})]}),a.jsxs("div",{className:"oactions",children:[a.jsx("button",{className:"oactBtn",onClick:nn,title:"New album",children:"＋ Album"}),a.jsx("button",{className:"oactBtn",onClick:Ha,title:"New track",children:"＋ Track"})]})]}),a.jsxs("div",{className:"osection",children:[a.jsx("div",{className:"osecTitle",children:"Albums"}),dt.length===0?a.jsx("div",{className:"oempty",children:"No albums yet. Create one above."}):a.jsx("div",{className:"ogrid",children:dt.map(oe=>a.jsx("button",{className:"ocard",onClick:()=>Yo(oe),children:a.jsxs("div",{className:"ocardRow",children:[a.jsx("div",{className:"ocover",children:oe.coverImageUrl?a.jsx("img",{src:oe.coverImageUrl,alt:""}):a.jsx("div",{className:"ocoverPh",children:"♫"})}),a.jsxs("div",{className:"oflex1",children:[a.jsx("div",{className:"ocardTitle",children:oe.title}),a.jsxs("div",{className:"ocardMeta",children:[oe.trackCount||0," tracks"]})]}),a.jsxs("div",{className:"oright",children:[a.jsx("div",{className:"oprice",children:lm(oe.priceCents)}),a.jsx("div",{className:"oedit",children:"Edit"})]})]})},oe._id))})]}),a.jsxs("div",{className:"osection",children:[a.jsx("div",{className:"osecTitle",children:"Tracks"}),L.length===0?a.jsx("div",{className:"oempty",children:"No tracks yet. Create one above."}):a.jsx("div",{className:"olist",children:L.map(oe=>{const Re=oe.coverImageUrl||oe.albumCoverImageUrl||"";return a.jsxs("button",{className:"orow",onClick:()=>$t(oe),children:[a.jsxs("div",{className:"orowLeft",children:[a.jsx("div",{className:"obubble",children:Re?a.jsx("img",{src:Re,alt:""}):a.jsx("span",{children:"♪"})}),a.jsxs("div",{className:"oflex1",children:[a.jsx("div",{className:"orowTitle",children:oe.title}),a.jsxs("div",{className:"orowMeta",children:[oe.albumTitle||"Single"," • ",Math.round((oe.durationSeconds||0)/60)," min • Preview:"," ",oe.previewSeconds||30,"s"]}),(oe.s3KeyFull||oe.s3KeyPreview)&&a.jsxs("div",{className:"orowS3",children:[oe.s3KeyPreview||"no preview key"," | ",oe.s3KeyFull||"no full key"]})]})]}),a.jsxs("div",{className:"orowRight",children:[a.jsx("div",{className:"oprice",children:lm(oe.priceCents)}),a.jsx("div",{className:"oedit",children:"Edit"})]})]},oe._id)})})]})]}):a.jsx("div",{className:"obox warn",children:"Missing profileKey for this page. Use /owner/:profileKey/music or set localStorage.activeProfileKey"}),a.jsx(sm,{open:T,title:q?"Edit Track":"New Track",onClose:()=>{D||de||le||E(!1)},footer:a.jsxs("div",{className:"omodalFootRow",children:[q?a.jsx("button",{className:"odanger",onClick:Ht,disabled:D||de||le,children:"Delete"}):a.jsx("div",{}),a.jsx("div",{className:"oflex1"}),a.jsx("button",{className:"osecond",onClick:()=>E(!1),disabled:D||de||le,children:"Cancel"}),a.jsx("button",{className:"oprimary",onClick:Mn,disabled:D||de||le,children:D?"Saving…":"Save"})]}),children:a.jsxs("div",{className:"oform",children:[a.jsx("label",{className:"olabel",children:"Title"}),a.jsx("input",{className:"oinput",value:M,onChange:oe=>$(oe.target.value),placeholder:"Track title"}),a.jsxs("div",{className:"orow2",children:[a.jsxs("div",{children:[a.jsx("label",{className:"olabel",children:"Price (USD)"}),a.jsx("input",{className:"oinput",value:W,onChange:oe=>F(oe.target.value),placeholder:"1.99"})]}),a.jsxs("div",{children:[a.jsx("label",{className:"olabel",children:"Duration (seconds)"}),a.jsx("input",{className:"oinput",value:V,onChange:oe=>A(oe.target.value),placeholder:"240"})]})]}),a.jsx("label",{className:"olabel",children:"Preview length (seconds)"}),a.jsx("input",{className:"oinput",value:Y,onChange:oe=>ie(oe.target.value),placeholder:"30"}),a.jsx("label",{className:"olabel",children:"Album (optional)"}),a.jsxs("div",{className:"ochips",children:[a.jsx("button",{className:`ochipBtn ${O?"":"active"}`,onClick:()=>j(""),children:"Single"}),dt.map(oe=>a.jsx("button",{className:`ochipBtn ${O===oe._id?"active":""}`,onClick:()=>j(oe._id),children:oe.title},oe._id))]}),a.jsx("label",{className:"olabel",children:"Artwork (optional)"}),a.jsxs("div",{className:"ouploadRow",children:[a.jsx("div",{className:"oprev",children:v?a.jsx("img",{src:v,alt:""}):a.jsx("div",{className:"oprevPh",children:"IMG"})}),a.jsxs("label",{className:`ouploadBtn ${le?"disabled":""}`,children:[le?"Uploading…":"Upload Artwork",a.jsx("input",{type:"file",accept:"image/*",style:{display:"none"},disabled:le,onChange:oe=>Xo(oe.target.files?.[0])})]})]}),a.jsx("label",{className:"olabel",children:"S3 key (preview – optional)"}),a.jsx("input",{className:"oinput",value:K,onChange:oe=>I(oe.target.value),placeholder:"tracks/02-deep1-preview.m4a"}),a.jsx("label",{className:"olabel",children:"S3 key (full track)"}),a.jsxs("div",{className:"ouploadRow",children:[a.jsx("input",{className:"oinput",value:R,onChange:oe=>H(oe.target.value),placeholder:"tracks/02-deep1.m4a"}),a.jsxs("label",{className:`ouploadBtn ${de?"disabled":""}`,children:[de?"Uploading…":"Upload Audio",a.jsx("input",{type:"file",accept:"audio/*",style:{display:"none"},disabled:de,onChange:oe=>Qo(oe.target.files?.[0])})]})]})]})}),a.jsx(sm,{open:pe,title:me?"Edit Album":"New Album",onClose:()=>{En||be||ue(!1)},footer:a.jsxs("div",{className:"omodalFootRow",children:[me?a.jsx("button",{className:"odanger",onClick:Fo,disabled:En||be,children:"Delete"}):a.jsx("div",{}),a.jsx("div",{className:"oflex1"}),a.jsx("button",{className:"osecond",onClick:()=>ue(!1),disabled:En||be,children:"Cancel"}),a.jsx("button",{className:"oprimary",onClick:pl,disabled:En||be,children:En?"Saving…":"Save"})]}),children:a.jsxs("div",{className:"oform",children:[a.jsx("label",{className:"olabel",children:"Album title"}),a.jsx("input",{className:"oinput",value:ht,onChange:oe=>et(oe.target.value),placeholder:"Album title"}),a.jsx("label",{className:"olabel",children:"Price (USD)"}),a.jsx("input",{className:"oinput",value:Jt,onChange:oe=>en(oe.target.value),placeholder:"9.99"}),a.jsx("label",{className:"olabel",children:"Album artwork"}),a.jsxs("div",{className:"ouploadRow",children:[a.jsx("div",{className:"oprev",children:tn?a.jsx("img",{src:tn,alt:""}):a.jsx("div",{className:"oprevPh",children:"IMG"})}),a.jsxs("label",{className:`ouploadBtn ${be?"disabled":""}`,children:[be?"Uploading…":"Upload Artwork",a.jsx("input",{type:"file",accept:"image/*",style:{display:"none"},disabled:be,onChange:oe=>Vo(oe.target.files?.[0])})]})]})]})}),a.jsx("style",{children:dw})]})}const dw=`
.opage{
  min-height:100vh;
  padding:18px;
  background: radial-gradient(1200px 600px at 20% 0%, rgba(34,211,238,.12), transparent 60%),
              radial-gradient(900px 500px at 80% 10%, rgba(99,102,241,.10), transparent 55%),
              linear-gradient(180deg, #050509, #0b0b14 65%, #151521);
  color:#e5e7eb;
}
.oheader{
  display:flex; align-items:center; gap:12px;
  margin-bottom:14px;
}
.oiconBtn{
  width:34px; height:34px; border-radius:999px;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(2,6,23,.25);
  color:#fff; cursor:pointer;
}
.oheaderCenter{ flex:1; }
.otitle{ font-size:18px; font-weight:800; letter-spacing:.3px; }
.osubtitle{ font-size:12px; color:#9ca3af; margin-top:3px; }

.ochip{
  display:flex; align-items:center; gap:8px;
  padding:8px 12px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(2,6,23,.25);
  font-size:12px;
}
.ochipDot{ width:8px; height:8px; border-radius:999px; background:#22d3ee; box-shadow:0 0 18px rgba(34,211,238,.55); }

.obox{
  border:1px solid rgba(255,255,255,.12);
  background: rgba(2,6,23,.30);
  border-radius:14px;
  padding:12px;
}
.obox.warn{ border-color: rgba(248,113,113,.6); color:#fecaca; }

.oload{ margin-top:40px; display:flex; flex-direction:column; align-items:center; gap:10px; }
.ospin{
  width:26px; height:26px; border-radius:999px;
  border:2px solid rgba(255,255,255,.18);
  border-top-color:#22d3ee;
  animation: spin 1s linear infinite;
}
@keyframes spin{ to { transform: rotate(360deg); } }
.oloadTxt{ color:#9ca3af; font-size:13px; }

.ostats{
  display:flex; align-items:center; gap:12px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(2,6,23,.28);
  border-radius:18px;
  padding:12px;
  margin: 14px 0 16px;
  backdrop-filter: blur(10px);
}
.ostat{ min-width:110px; }
.ostatNum{ font-size:18px; font-weight:900; color:#fff; }
.ostatLabel{ font-size:11px; color:#9ca3af; margin-top:2px; }
.oactions{ margin-left:auto; display:flex; gap:10px; }
.oactBtn{
  border-radius:999px;
  border:1px solid rgba(34,211,238,.55);
  background: rgba(34,211,238,.10);
  color:#e0f2fe;
  padding:8px 12px;
  font-weight:800;
  cursor:pointer;
}

.osection{ margin-top:14px; }
.osecTitle{ font-size:14px; font-weight:900; letter-spacing:.4px; margin: 10px 0 10px; }
.oempty{ color:#9ca3af; font-style:italic; font-size:12px; }

.ogrid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:10px; }
.ocard{
  border-radius:18px;
  border:1px solid rgba(255,255,255,.08);
  background: rgba(2,6,23,.28);
  padding:10px;
  color:inherit;
  text-align:left;
  cursor:pointer;
}
.ocardRow{ display:flex; align-items:center; gap:10px; }
.ocover{ width:54px; height:54px; border-radius:14px; overflow:hidden; border:1px solid rgba(34,211,238,.25); background: rgba(15,23,42,.6); display:flex; align-items:center; justify-content:center; }
.ocover img{ width:100%; height:100%; object-fit:cover; }
.ocoverPh{ color:#22d3ee; font-weight:900; }
.oflex1{ flex:1; }
.ocardTitle{ font-weight:800; color:#fff; }
.ocardMeta{ font-size:11px; color:#9ca3af; margin-top:2px; }
.oright{ text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
.oprice{ font-weight:800; color:#fff; }
.oedit{ font-size:11px; color:#9ca3af; }

.olist{ display:flex; flex-direction:column; gap:10px; }
.orow{
  display:flex; align-items:center; justify-content:space-between;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.06);
  background: rgba(2,6,23,.25);
  padding:10px;
  color:inherit;
  text-align:left;
  cursor:pointer;
}
.orowLeft{ display:flex; align-items:center; gap:10px; flex:1; }
.obubble{
  width:42px; height:42px; border-radius:999px;
  overflow:hidden;
  border:1px solid rgba(34,211,238,.55);
  background: rgba(15,23,42,.6);
  display:flex; align-items:center; justify-content:center;
}
.obubble img{ width:100%; height:100%; object-fit:cover; }
.orowTitle{ font-weight:800; color:#fff; }
.orowMeta{ font-size:11px; color:#9ca3af; margin-top:2px; }
.orowS3{ font-size:10px; color:#4ade80; margin-top:2px; }
.orowRight{ display:flex; flex-direction:column; align-items:flex-end; gap:6px; margin-left:12px; }

.omodalBack{
  position:fixed; inset:0;
  background: rgba(2,6,23,.72);
  display:flex; align-items:center; justify-content:center;
  padding:16px;
  z-index:50;
}
.omodalCard{
  width:min(860px, 100%);
  max-height: 90vh;
  overflow:auto;
  border-radius:22px;
  border:1px solid rgba(148,163,184,.6);
  background: rgba(2,6,23,.55);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 80px rgba(0,0,0,.55);
}
.omodalHeader{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 14px 8px;
}
.omodalTitle{ font-weight:900; letter-spacing:.3px; }
.omodalBody{ padding: 10px 14px 12px; }
.omodalFooter{ padding: 10px 14px 14px; border-top: 1px solid rgba(255,255,255,.06); }
.omodalFootRow{ display:flex; align-items:center; gap:10px; }

.oform{ display:flex; flex-direction:column; gap:8px; }
.olabel{ font-size:12px; color:#9ca3af; }
.oinput{
  border-radius:12px;
  border:1px solid rgba(148,163,184,.6);
  background: rgba(15,23,42,.45);
  color:#f9fafb;
  padding:10px 10px;
  outline:none;
}
.orow2{ display:grid; grid-template-columns: 1fr 1fr; gap:10px; }

.ochips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:2px; }
.ochipBtn{
  border-radius:999px;
  border:1px solid rgba(148,163,184,.6);
  background: transparent;
  color:#cbd5e1;
  padding:6px 10px;
  cursor:pointer;
  font-size:12px;
}
.ochipBtn.active{
  border-color: rgba(34,211,238,.75);
  background: rgba(34,211,238,.10);
  color:#e0f2fe;
  font-weight:800;
}

.ouploadRow{ display:flex; align-items:center; gap:10px; }
.oprev{
  width:64px; height:64px; border-radius:14px;
  border:1px solid rgba(148,163,184,.6);
  background: rgba(15,23,42,.55);
  overflow:hidden;
  display:flex; align-items:center; justify-content:center;
}
.oprev img{ width:100%; height:100%; object-fit:cover; }
.oprevPh{ font-size:12px; color:#9ca3af; font-weight:800; }

.ouploadBtn{
  border-radius:999px;
  border:1px solid rgba(34,211,238,.55);
  background: rgba(34,211,238,.10);
  color:#e0f2fe;
  padding:8px 12px;
  cursor:pointer;
  font-weight:900;
  font-size:12px;
  user-select:none;
}
.ouploadBtn.disabled{ opacity:.65; cursor:not-allowed; }

.osecond{
  border-radius:999px;
  border:1px solid rgba(148,163,184,.6);
  background: transparent;
  color:#e5e7eb;
  padding:8px 12px;
  cursor:pointer;
}
.oprimary{
  border-radius:999px;
  border:1px solid rgba(34,211,238,.75);
  background: rgba(34,211,238,.85);
  color:#0f172a;
  padding:8px 14px;
  cursor:pointer;
  font-weight:900;
}
.odanger{
  border-radius:999px;
  border:1px solid rgba(248,113,113,.75);
  background: rgba(248,113,113,.12);
  color:#fecaca;
  padding:8px 12px;
  cursor:pointer;
  font-weight:900;
}
`;function sl(i){return String(i||"").trim().toLowerCase()}function fw(i){return`ownerToken:${sl(i)}`}function pw(i){try{const o=sl(i);return o&&localStorage.getItem(fw(o))||""}catch{return""}}async function Mo(i){try{return await i.json()}catch{return{}}}async function al(i,{profileKey:o,method:c="GET",headers:u={},body:f}={}){const p=sl(o),m=pw(p);return fetch(i,{method:c,headers:{...f?{"content-type":"application/json"}:{},"x-profile-key":p,...m?{Authorization:`Bearer ${m}`}:{},...u},body:f})}function gw(){const i=_e(),o=Fe(),c=Ge(),u=sl(o?.profileKey),f=sl(c?.state?.profileKey),p=u||f||"",b=d.useMemo(()=>p?Rn(p):null,[p])?.accent||"#818cf8",[x,h]=d.useState([]),[S,w]=d.useState(!0),[N,L]=d.useState(!1),[B,U]=d.useState({level:"ok",text:"Ready."}),C=d.useRef(null),T=d.useCallback(()=>{if(!p){i("/",{replace:!0});return}i(`/world/${encodeURIComponent(p)}/owner/login`,{replace:!0,state:{profileKey:p,bgUrl:c?.state?.bgUrl||null}})},[i,p,c?.state?.bgUrl]),E=d.useCallback(async()=>{if(!p){h([]),w(!1),U({level:"warn",text:"Missing profileKey."});return}w(!0);try{const $=await al("/api/owner/portfolio",{profileKey:p}),W=await Mo($);if($.status===401||$.status===403){h([]),U({level:"warn",text:"Session expired. Please log in again."}),T();return}if(!$.ok)throw new Error(W?.error||`Load failed (${$.status})`);const F=Array.isArray(W?.items)?W.items:Array.isArray(W)?W:[];h(F),U({level:"ok",text:"Portfolio synced."})}catch($){console.log("LOAD ERROR:",$?.message||$),U({level:"err",text:$?.message||"Failed to load portfolio items."})}finally{w(!1)}},[p,T]);d.useEffect(()=>{E()},[E]);const D=()=>{p?i(`/world/${encodeURIComponent(p)}/owner/home`,{state:{profileKey:p}}):i("/")},Q=()=>{if(!p){U({level:"warn",text:"Missing profileKey. Open with /world/:profileKey/owner/portfolio"});return}N||C.current?.click?.()},q=d.useCallback(async $=>{if(!p||!$||N)return;const W=String($.type||"").toLowerCase();if(!(W.startsWith("image/")||/\.(png|jpg|jpeg|webp)$/i.test(String($.name||"")))){U({level:"warn",text:"Please select an image (png/jpg/webp)."});return}L(!0),U({level:"ok",text:"Uploading…"});try{const V=await al("/api/owner/profile",{profileKey:p});if(V.status===401||V.status===403){U({level:"warn",text:"Session expired. Please log in again."}),T();return}if(!V.ok){const I=await V.text().catch(()=>"");throw new Error(I||"Owner auth failed (check token / login)")}const A=String($.name||`upload-${Date.now()}.jpg`),Y=await al("/api/owner/portfolio/upload-url",{profileKey:p,method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({filename:A,contentType:W||"image/jpeg"})}),ie=await Mo(Y);if(Y.status===401||Y.status===403){U({level:"warn",text:"Session expired. Please log in again."}),T();return}if(!Y.ok)throw new Error(ie?.error||`upload-url HTTP ${Y.status}`);if(!ie?.uploadUrl||!ie?.key)throw new Error("upload-url missing uploadUrl/key");const O=await fetch(ie.uploadUrl,{method:"PUT",headers:{...W?{"Content-Type":W}:{}},body:$});if(!O.ok){const I=await O.text().catch(()=>"");throw new Error(I||`Upload to S3 failed (${O.status})`)}const j=await al("/api/owner/portfolio",{profileKey:p,method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key:ie.key,contentType:W||"image/jpeg"})}),K=await Mo(j);if(j.status===401||j.status===403){U({level:"warn",text:"Session expired. Please log in again."}),T();return}if(!j.ok)throw new Error(K?.error||`save HTTP ${j.status}`);U({level:"ok",text:"Uploaded. Refreshing…"}),await E(),U({level:"ok",text:"Upload complete."})}catch(V){console.log("UPLOAD ERROR:",V?.message||V),U({level:"err",text:V?.message||"Upload failed."})}finally{L(!1),C.current&&(C.current.value="")}},[p,N,T,E]),J=d.useCallback(async $=>{if(!(!p||!window.confirm(`Delete image?

This will remove it from the portfolio.`)))try{const F=await al(`/api/owner/portfolio/${encodeURIComponent($)}`,{profileKey:p,method:"DELETE"}),V=await Mo(F);if(F.status===401||F.status===403){U({level:"warn",text:"Session expired. Please log in again."}),T();return}if(!F.ok)throw new Error(V?.error||"Delete failed");U({level:"ok",text:"Deleted. Refreshing…"}),await E()}catch(F){U({level:"err",text:F?.message||"Failed to delete."})}},[p,T,E]),M=B.level==="ok"?"#22c55e":B.level==="warn"?"#facc15":"#fb7185";return a.jsxs("div",{style:_t.page,children:[a.jsx("style",{children:hw}),a.jsx("div",{style:{..._t.glowOne,background:mw(b,.35)}}),a.jsx("div",{style:_t.glowTwo}),a.jsxs("div",{style:_t.wrap,children:[a.jsxs("div",{style:_t.headerRow,children:[a.jsx("button",{className:"op-btn",onClick:D,title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1},children:[a.jsx("div",{style:_t.title,children:"OWNER PORTFOLIO"}),a.jsx("div",{style:_t.subTitle,children:"upload images to Kerry portfolio"}),p?null:a.jsx("div",{style:{marginTop:8,color:"#fca5a5",fontSize:12,fontWeight:800},children:"Missing profileKey (open with /world/:profileKey/owner/portfolio)."})]}),a.jsx("button",{className:"op-btn",onClick:Q,disabled:N||!p,title:"Upload",children:N?"…":"+"}),a.jsx("input",{ref:C,type:"file",accept:"image/*",style:{display:"none"},onChange:$=>q($.target.files?.[0])})]}),a.jsxs("div",{style:_t.statusPill,children:[a.jsx("span",{style:{..._t.statusDot,background:M}}),a.jsx("div",{style:_t.statusText,children:B.text})]}),S?a.jsxs("div",{style:_t.center,children:[a.jsx("div",{className:"op-spinner"}),a.jsx("div",{style:{color:"rgba(255,255,255,0.75)",fontWeight:800},children:"Loading…"})]}):x.length?a.jsx("div",{style:_t.list,children:x.map($=>a.jsx("div",{className:"op-card",children:a.jsxs("div",{style:_t.cardRow,children:[a.jsx("div",{style:_t.thumb,children:"🖼️"}),a.jsxs("div",{style:{flex:1,minWidth:0},children:[a.jsx("div",{style:_t.itemTitle,title:$.key,children:$.key}),a.jsx("div",{style:_t.itemSub,children:$?.createdAt?new Date($.createdAt).toLocaleString():""})]}),a.jsx("button",{className:"op-trash",onClick:()=>J($._id),title:"Delete",children:"🗑️"})]})},String($._id)))}):a.jsx("div",{style:_t.center,children:a.jsx("div",{style:{color:"rgba(255,255,255,0.75)",fontWeight:800},children:"No images yet. Tap + to upload."})})]})]})}function mw(i,o=1){const c=String(i).replace("#","").trim(),u=c.length===3?c.split("").map(b=>b+b).join(""):c;if(u.length!==6)return`rgba(129,140,248,${o})`;const f=parseInt(u.slice(0,2),16),p=parseInt(u.slice(2,4),16),m=parseInt(u.slice(4,6),16);return`rgba(${f},${p},${m},${o})`}const _t={page:{minHeight:"100vh",background:"linear-gradient(180deg, #020617, #0b1220, #020617)",color:"#e5e7eb",overflow:"hidden",position:"relative",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},glowOne:{position:"fixed",width:260,height:260,borderRadius:999,top:-40,right:-60,opacity:.65,filter:"blur(80px)",pointerEvents:"none"},glowTwo:{position:"fixed",width:260,height:260,borderRadius:999,background:"rgba(236,72,153,0.26)",bottom:-60,left:-40,opacity:.55,filter:"blur(80px)",pointerEvents:"none"},wrap:{position:"relative",zIndex:2,padding:"26px 18px 26px",maxWidth:980,margin:"0 auto"},headerRow:{display:"flex",alignItems:"center",gap:12,paddingTop:12,paddingBottom:10},title:{fontSize:16,fontWeight:900,letterSpacing:2,color:"#fff"},subTitle:{marginTop:6,color:"rgba(255,255,255,0.72)",fontSize:12,letterSpacing:1,textTransform:"uppercase"},statusPill:{marginTop:10,display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:999,background:"rgba(15,23,42,0.85)",border:"1px solid rgba(148,163,184,0.6)",width:"fit-content",maxWidth:"100%"},statusDot:{width:8,height:8,borderRadius:999},statusText:{color:"#9ca3af",fontSize:12,letterSpacing:.7,whiteSpace:"nowrap"},center:{minHeight:360,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12},list:{marginTop:14,display:"grid",gridTemplateColumns:"1fr",gap:12},cardRow:{display:"flex",alignItems:"center",gap:12},thumb:{width:44,height:44,borderRadius:14,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(0,0,0,0.35)",display:"grid",placeItems:"center"},itemTitle:{color:"#fff",fontWeight:900,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},itemSub:{color:"rgba(255,255,255,0.65)",marginTop:4,fontSize:11}},hw=`
.op-btn{
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 900;
  display:grid;
  place-items:center;
}
.op-btn:disabled{ opacity: 0.5; cursor: not-allowed; }
.op-btn:active{ opacity: 0.92; transform: scale(0.99); }

.op-card{
  border-radius: 20px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.05);
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
}
.op-trash{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #fff;
  cursor: pointer;
  display:grid;
  place-items:center;
}
.op-trash:active{ opacity: 0.9; transform: scale(0.99); }

.op-spinner{
  width: 18px; height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.85);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
`,cm=10,um=16;async function bw(i,{profileKey:o,method:c="GET",body:u}={}){const f=String(o||"").trim().toLowerCase();if(!f)throw new Error("Missing profileKey");const p=Rn(f),m=p?.apiBaseUrl||p?.apiBaseUrlDev?.device||"";if(!m)throw new Error("Missing apiBaseUrl for profile.");const b=`${m}${i.startsWith("/")?i:`/${i}`}`;return fetch(b,{method:c,headers:{...u?{"content-type":"application/json"}:{},"x-profile-key":f},body:u})}function yw(){const i=_e(),o=Fe(),c=Ge(),u=String(o?.profileKey||"").trim().toLowerCase(),f=String(c?.state?.profileKey||"").trim().toLowerCase(),p=u||f||"",b=d.useMemo(()=>p?Rn(p):null,[p])?.accent||"#818cf8",[x,h]=d.useState([]),[S,w]=d.useState(!0),[N,L]=d.useState(""),B=d.useCallback(async()=>{if(!p){h([]),w(!1),L("Missing profileKey.");return}w(!0),L("");try{const T=await bw("/api/portfolio",{profileKey:p,method:"GET"}),E=await T.json().catch(()=>({}));if(!T.ok)throw new Error(E?.error||"Failed to load portfolio");h(Array.isArray(E?.items)?E.items:[])}catch(T){console.log(T),h([]),L(T?.message||"Failed to load portfolio.")}finally{w(!1)}},[p]);d.useEffect(()=>{B()},[B]);const U=()=>{p?i(`/world/${encodeURIComponent(p)}`,{state:{profileKey:p}}):i("/")},C=T=>{i(`/world/${encodeURIComponent(p)}/portfolio/view`,{state:{url:T?.url,id:T?._id,profileKey:p}})};return a.jsxs("div",{style:Gt.page,children:[a.jsx("style",{children:vw}),a.jsx("div",{style:{...Gt.glowOne,background:xw(b,.35)}}),a.jsx("div",{style:Gt.glowTwo}),a.jsxs("div",{style:Gt.wrap,children:[a.jsxs("div",{style:Gt.headerRow,children:[a.jsx("button",{className:"pf-btn",onClick:U,title:"Back",children:"←"}),a.jsxs("div",{style:{flex:1},children:[a.jsx("div",{style:Gt.headerTitle,children:"PORTFOLIO"}),a.jsx("div",{style:Gt.headerSub,children:"images curated by Kerry"}),p?null:a.jsx("div",{style:{marginTop:8,color:"#fca5a5",fontSize:12,fontWeight:800},children:"Missing profileKey (open with /world/:profileKey/portfolio)."})]}),a.jsx("button",{className:"pf-btn",onClick:B,title:"Refresh",children:"⟳"})]}),S?a.jsxs("div",{style:Gt.center,children:[a.jsx("div",{className:"pf-spinner"}),a.jsx("div",{style:Gt.dim,children:"Loading…"})]}):N?a.jsxs("div",{style:Gt.center,children:[a.jsx("div",{style:Gt.dim,children:N}),a.jsx("button",{className:"pf-retry",onClick:B,children:"Retry"})]}):x.length?a.jsx("div",{style:Gt.grid,children:x.map(T=>a.jsx("button",{className:"pf-tile",onClick:()=>C(T),title:"Open",children:a.jsx("img",{src:T.url,alt:"",style:Gt.img,loading:"lazy"})},String(T._id)))}):a.jsx("div",{style:Gt.center,children:a.jsx("div",{style:Gt.dim,children:"No portfolio images yet."})})]})]})}function xw(i,o=1){const c=String(i).replace("#","").trim(),u=c.length===3?c.split("").map(b=>b+b).join(""):c;if(u.length!==6)return`rgba(129,140,248,${o})`;const f=parseInt(u.slice(0,2),16),p=parseInt(u.slice(2,4),16),m=parseInt(u.slice(4,6),16);return`rgba(${f},${p},${m},${o})`}const Gt={page:{minHeight:"100vh",background:"linear-gradient(180deg, #020617, #0b1220, #020617)",color:"#e5e7eb",overflow:"hidden",position:"relative",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},glowOne:{position:"fixed",width:260,height:260,borderRadius:999,top:-40,right:-60,opacity:.65,filter:"blur(80px)",pointerEvents:"none"},glowTwo:{position:"fixed",width:260,height:260,borderRadius:999,background:"rgba(236,72,153,0.26)",bottom:-60,left:-40,opacity:.55,filter:"blur(80px)",pointerEvents:"none"},wrap:{position:"relative",zIndex:2,maxWidth:980,margin:"0 auto",padding:"26px 18px 26px"},headerRow:{display:"flex",alignItems:"center",gap:12,paddingTop:12,paddingBottom:10},headerTitle:{color:"#fff",fontSize:18,fontWeight:900,letterSpacing:3},headerSub:{marginTop:6,color:"rgba(255,255,255,0.72)",fontSize:12,letterSpacing:1,textTransform:"uppercase"},center:{minHeight:420,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:"0 24px"},dim:{color:"rgba(255,255,255,0.75)",textAlign:"center",fontWeight:800},grid:{marginTop:10,display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:cm,padding:`${cm}px ${um}px ${um}px`},img:{width:"100%",height:"100%",objectFit:"cover",display:"block"}},vw=`
.pf-btn{
  width: 38px; height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 900;
  display:grid;
  place-items:center;
}
.pf-btn:active{ opacity: 0.92; transform: scale(0.99); }

.pf-retry{
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #fff;
  cursor: pointer;
  font-weight: 900;
}

.pf-tile{
  border: none;
  padding: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease;
}
.pf-tile:hover{ border-color: rgba(34,211,238,0.45); }
.pf-tile:active{ opacity: 0.9; transform: scale(0.99); }

.pf-spinner{
  width: 18px; height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.85);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
`;function ww(i,o,c){return Math.max(o,Math.min(c,i))}function Sw(){const i=_e(),o=Fe(),c=Ge(),u=String(o?.profileKey||"").trim().toLowerCase(),f=String(c?.state?.profileKey||"").trim().toLowerCase(),p=u||f||"",m=d.useMemo(()=>String(c?.state?.url||"").trim(),[c?.state?.url]),[b,x]=d.useState(!1),[h,S]=d.useState(1),w=d.useRef(1),[N,L]=d.useState(0),[B,U]=d.useState(0),C=d.useRef({tx:0,ty:0}),T=d.useRef(!1),E=d.useRef({x:0,y:0,tx:0,ty:0}),D=d.useRef(null);d.useEffect(()=>x(!0),[]);const Q=()=>{C.current={tx:0,ty:0},L(0),U(0)},q=A=>{const Y=ww(A,1,4);w.current=Y,S(Y),Y<=1.02&&(w.current=1,S(1),Q())},J=()=>{window.history.length>1?i(-1):p?i(`/world/${encodeURIComponent(p)}/portfolio`,{replace:!0}):i("/",{replace:!0})};d.useEffect(()=>{const A=Y=>{Y.key==="Escape"&&J()};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[p]);const M=()=>{const A=w.current<=1.05;q(A?2:1)},$=A=>{w.current<=1.01||(T.current=!0,(A.currentTarget||D.current)?.setPointerCapture?.(A.pointerId),E.current={x:A.clientX,y:A.clientY,tx:C.current.tx,ty:C.current.ty})},W=A=>{if(!T.current)return;const Y=A.clientX-E.current.x,ie=A.clientY-E.current.y,O=E.current.tx+Y,j=E.current.ty+ie;C.current={tx:O,ty:j},L(O),U(j)},F=()=>{T.current=!1},V=A=>{if(!A.ctrlKey)return;A.preventDefault();const Y=A.deltaY>0?-1:1,O=w.current+Y*.12;q(O)};return m?a.jsxs("div",{style:In.page,children:[a.jsx("style",{children:dm}),a.jsx("div",{style:In.bg,className:b?"pv-fade-in":"pv-fade-out"}),a.jsx("div",{ref:D,className:"pv-stage",onDoubleClick:M,onPointerDown:$,onPointerMove:W,onPointerUp:F,onPointerCancel:F,onWheel:V,onContextMenu:A=>A.preventDefault(),title:"Double-click to zoom • ctrl+wheel to zoom • drag to pan",children:a.jsx("img",{src:m,alt:"",draggable:!1,className:"pv-img",style:{transform:`translate3d(${N}px, ${B}px, 0) scale(${h})`,opacity:b?1:0,cursor:h>1.01?T.current?"grabbing":"grab":"zoom-in"}})}),a.jsx("div",{style:In.topOverlay,children:a.jsx("button",{className:"pv-close",onClick:J,"aria-label":"Close",children:"✕"})}),a.jsxs("div",{style:In.hintPill,children:[a.jsx("span",{style:In.dot}),a.jsxs("span",{style:In.hintText,children:[Math.round(h*100),"% • double-click zoom • ctrl+wheel pinch • drag to pan"]})]})]}):a.jsxs("div",{style:In.page,children:[a.jsx("style",{children:dm}),a.jsx("div",{style:In.topOverlay,children:a.jsx("button",{className:"pv-close",onClick:J,"aria-label":"Close",children:"✕"})}),a.jsx("div",{style:In.center,children:a.jsx("div",{style:In.dim,children:"Missing image URL. Go back and select an image again."})})]})}const In={page:{minHeight:"100vh",background:"#000",position:"relative",overflow:"hidden",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},bg:{position:"absolute",inset:0,background:"linear-gradient(180deg, #05070D, #000)"},topOverlay:{position:"absolute",top:"max(16px, env(safe-area-inset-top))",left:16,zIndex:50,display:"flex",alignItems:"center",justifyContent:"flex-start"},center:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:2},dim:{color:"rgba(255,255,255,0.75)",fontWeight:900,textAlign:"center"},hintPill:{position:"absolute",bottom:"max(18px, env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:999,background:"rgba(15,23,42,0.85)",border:"1px solid rgba(148,163,184,0.55)",boxShadow:"0 18px 40px rgba(0,0,0,0.35)",maxWidth:"calc(100vw - 24px)"},dot:{width:8,height:8,borderRadius:999,background:"#22c55e",display:"inline-block"},hintText:{color:"#9ca3af",fontSize:12,fontWeight:800,letterSpacing:.6,whiteSpace:"nowrap"}},dm=`
.pv-fade-in{ opacity: 1; transition: opacity 220ms ease; }
.pv-fade-out{ opacity: 0; }

.pv-stage{
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  touch-action: none; /* allow pointer drag without scrolling */
}

.pv-img{
  width: 100vw;
  height: 100vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform, opacity;
  transition: opacity 220ms ease;
}

.pv-close{
  width: 40px;
  height: 40px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.35);
  color: #fff;
  cursor: pointer;
  display:grid;
  place-items:center;
  font-weight: 900;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
}
.pv-close:active{ opacity: 0.78; transform: scale(0.98); }

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .pv-fade-in, .pv-img{ transition: none; }
}
`;function fm({name:i}){return a.jsxs("div",{style:{minHeight:"100vh",background:"#000",color:"#fff",padding:24,fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},children:[a.jsx("h2",{style:{margin:0,fontSize:22},children:i}),a.jsx("p",{style:{opacity:.7,marginTop:10},children:"Stub page. Replace with a real screen."}),a.jsx("a",{href:"/",style:{color:"#0ff"},children:"← Back to Universe"})]})}function jw({children:i}){const[o,c]=d.useState(!1),[u,f]=d.useState(null);return d.useEffect(()=>{let p=!0;return g1().then(()=>p&&c(!0)).catch(m=>p&&f(m?.message||"Failed to load remote config")),()=>{p=!1}},[]),o?i:a.jsx("div",{style:{minHeight:"100vh",background:"#000",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"'},children:a.jsxs("div",{style:{maxWidth:520},children:[a.jsx("div",{style:{fontSize:18,fontWeight:800,letterSpacing:1},children:"Loading indiVerse…"}),a.jsx("div",{style:{marginTop:10,opacity:.7,fontSize:13},children:"Booting remote config so deep links work."}),u?a.jsxs("div",{style:{marginTop:14,color:"#fca5a5",fontSize:13},children:[u,a.jsx("div",{style:{marginTop:10},children:a.jsx("button",{onClick:()=>window.location.reload(),style:{borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(2,6,23,0.55)",color:"#e5e7eb",padding:"10px 14px",cursor:"pointer"},children:"Retry"})})]}):null]})})}function kw(){return a.jsx(l1,{children:a.jsx(jw,{children:a.jsx(Gx,{children:a.jsxs(vx,{children:[a.jsx(Be,{path:"/",element:a.jsx(j1,{})}),a.jsx(Be,{path:"/vaultgate",element:a.jsx(fm,{name:"VaultGate"})}),a.jsx(Be,{path:"/auth/signup",element:a.jsx(f2,{})}),a.jsx(Be,{path:"/auth/login",element:a.jsx(p2,{})}),a.jsx(Be,{path:"/profile/:profileKey",element:a.jsx(z1,{})}),a.jsx(Be,{path:"/universe/:profileKey",element:a.jsx(B1,{})}),a.jsx(Be,{path:"/world/:profileKey",element:a.jsx(G1,{})}),a.jsx(Be,{path:"/world/:profileKey/about",element:a.jsx(Z1,{})}),a.jsx(Be,{path:"/world/:profileKey/contact",element:a.jsx(r5,{})}),a.jsx(Be,{path:"/world/:profileKey/videos",element:a.jsx(d5,{})}),a.jsx(Be,{path:"/world/:profileKey/playlist",element:a.jsx(b5,{})}),a.jsx(Be,{path:"/world/:profileKey/fashion",element:a.jsx(T5,{})}),a.jsx(Be,{path:"/world/:profileKey/music",element:a.jsx(O5,{})}),a.jsx(Be,{path:"/world/:profileKey/energy",element:a.jsx($5,{})}),a.jsx(Be,{path:"/world/:profileKey/games",element:a.jsx(q5,{})}),a.jsx(Be,{path:"/world/:profileKey/chat",element:a.jsx(x2,{})}),a.jsx(Be,{path:"/world/:profileKey/products",element:a.jsx(F5,{})}),a.jsx(Be,{path:"/world/:profileKey/products/:productId",element:a.jsx(Q5,{})}),a.jsx(Be,{path:"/world/:profileKey/cart",element:a.jsx(t2,{})}),a.jsx(Be,{path:"/world/:profileKey/portfolio",element:a.jsx(yw,{})}),a.jsx(Be,{path:"/world/:profileKey/portfolio/view",element:a.jsx(Sw,{})}),a.jsx(Be,{path:"/world/:profileKey/flowerorders",element:a.jsx(X1,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/login",element:a.jsx(L2,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/home",element:a.jsx(F2,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/about",element:a.jsx(J2,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/videos",element:a.jsx(rv,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/flowerorders",element:a.jsx(fv,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/products",element:a.jsx(bv,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/playlist",element:a.jsx(wv,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/contacts",element:a.jsx(Nv,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/messages",element:a.jsx(Gv,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/chat",element:a.jsx(ow,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/fashion",element:a.jsx(C2,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/music",element:a.jsx(uw,{})}),a.jsx(Be,{path:"/portal/:profileKey",element:a.jsx(F0,{})}),a.jsx(Be,{path:"/portal/:profileKey/:portalKey",element:a.jsx(F0,{})}),a.jsx(Be,{path:"/world/:profileKey/owner/portfolio",element:a.jsx(gw,{})}),a.jsx(Be,{path:"/world/:profileKey/:featureKey",element:a.jsx(m1,{})}),a.jsx(Be,{path:"*",element:a.jsx(fm,{name:"404"})})]})})})})}ky.createRoot(document.getElementById("root")).render(a.jsx(d.StrictMode,{children:a.jsx(Yx,{children:a.jsx(kw,{})})}));
