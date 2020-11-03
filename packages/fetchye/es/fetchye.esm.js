import e,{useReducer as r,useContext as t,useRef as n,useEffect as o,useMemo as a}from"react";import{loadingAction as i,setAction as c,errorAction as u,ACTION_NAMESPACE as s,SET_DATA as f,IS_LOADING as l,ERROR as p,CLEAR_ERROR as d,DELETE_DATA as y,FetchyeContext as h,defaultFetcher as m,defaultEqualityChecker as v,useSubscription as b}from"fetchye-core";import g from"crypto";const w=async({dispatch:e,computedKey:r,fetcher:t,fetchClient:n,options:o})=>{e(i({hash:r.hash}));const{payload:a,error:s}=await t(n,r.key,o);return e(s?u({hash:r.hash,error:s}):c({hash:r.hash,value:a})),{data:a,error:s}};function S(e,r,t){return e(t={path:r,exports:{},require:function(e,r){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==r&&t.path)}},t.exports),t.exports}var _=S((function(e,r){function t(e,r){return function(e,r){var t;t="passthrough"!==r.algorithm?g.createHash(r.algorithm):new u;void 0===t.write&&(t.write=t.update,t.end=t.update);c(r,t).dispatch(e),t.update||t.end("");if(t.digest)return t.digest("buffer"===r.encoding?void 0:r.encoding);var n=t.read();if("buffer"===r.encoding)return n;return n.toString(r.encoding)}(e,r=a(e,r))}(r=e.exports=t).sha1=function(e){return t(e)},r.keys=function(e){return t(e,{excludeValues:!0,algorithm:"sha1",encoding:"hex"})},r.MD5=function(e){return t(e,{algorithm:"md5",encoding:"hex"})},r.keysMD5=function(e){return t(e,{algorithm:"md5",encoding:"hex",excludeValues:!0})};var n=g.getHashes?g.getHashes().slice():["sha1","md5"];n.push("passthrough");var o=["buffer","hex","binary","base64"];function a(e,r){r=r||{};var t={};if(t.algorithm=r.algorithm||"sha1",t.encoding=r.encoding||"hex",t.excludeValues=!!r.excludeValues,t.algorithm=t.algorithm.toLowerCase(),t.encoding=t.encoding.toLowerCase(),t.ignoreUnknown=!0===r.ignoreUnknown,t.respectType=!1!==r.respectType,t.respectFunctionNames=!1!==r.respectFunctionNames,t.respectFunctionProperties=!1!==r.respectFunctionProperties,t.unorderedArrays=!0===r.unorderedArrays,t.unorderedSets=!1!==r.unorderedSets,t.unorderedObjects=!1!==r.unorderedObjects,t.replacer=r.replacer||void 0,t.excludeKeys=r.excludeKeys||void 0,void 0===e)throw new Error("Object argument required.");for(var a=0;a<n.length;++a)n[a].toLowerCase()===t.algorithm.toLowerCase()&&(t.algorithm=n[a]);if(-1===n.indexOf(t.algorithm))throw new Error('Algorithm "'+t.algorithm+'"  not supported. supported values: '+n.join(", "));if(-1===o.indexOf(t.encoding)&&"passthrough"!==t.algorithm)throw new Error('Encoding "'+t.encoding+'"  not supported. supported values: '+o.join(", "));return t}function i(e){if("function"!=typeof e)return!1;return null!=/^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e))}function c(e,r,t){t=t||[];var n=function(e){return r.update?r.update(e,"utf8"):r.write(e,"utf8")};return{dispatch:function(r){e.replacer&&(r=e.replacer(r));var t=typeof r;return null===r&&(t="null"),this["_"+t](r)},_object:function(r){var o=Object.prototype.toString.call(r),a=/\[object (.*)\]/i.exec(o);a=(a=a?a[1]:"unknown:["+o+"]").toLowerCase();var c;if((c=t.indexOf(r))>=0)return this.dispatch("[CIRCULAR:"+c+"]");if(t.push(r),"undefined"!=typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(r))return n("buffer:"),n(r);if("object"===a||"function"===a||"asyncfunction"===a){var u=Object.keys(r);e.unorderedObjects&&(u=u.sort()),!1===e.respectType||i(r)||u.splice(0,0,"prototype","__proto__","constructor"),e.excludeKeys&&(u=u.filter((function(r){return!e.excludeKeys(r)}))),n("object:"+u.length+":");var s=this;return u.forEach((function(t){s.dispatch(t),n(":"),e.excludeValues||s.dispatch(r[t]),n(",")}))}if(!this["_"+a]){if(e.ignoreUnknown)return n("["+a+"]");throw new Error('Unknown object type "'+a+'"')}this["_"+a](r)},_array:function(r,o){o=void 0!==o?o:!1!==e.unorderedArrays;var a=this;if(n("array:"+r.length+":"),!o||r.length<=1)return r.forEach((function(e){return a.dispatch(e)}));var i=[],s=r.map((function(r){var n=new u,o=t.slice();return c(e,n,o).dispatch(r),i=i.concat(o.slice(t.length)),n.read().toString()}));return t=t.concat(i),s.sort(),this._array(s,!1)},_date:function(e){return n("date:"+e.toJSON())},_symbol:function(e){return n("symbol:"+e.toString())},_error:function(e){return n("error:"+e.toString())},_boolean:function(e){return n("bool:"+e.toString())},_string:function(e){n("string:"+e.length+":"),n(e.toString())},_function:function(r){n("fn:"),i(r)?this.dispatch("[native]"):this.dispatch(r.toString()),!1!==e.respectFunctionNames&&this.dispatch("function-name:"+String(r.name)),e.respectFunctionProperties&&this._object(r)},_number:function(e){return n("number:"+e.toString())},_xml:function(e){return n("xml:"+e.toString())},_null:function(){return n("Null")},_undefined:function(){return n("Undefined")},_regexp:function(e){return n("regex:"+e.toString())},_uint8array:function(e){return n("uint8array:"),this.dispatch(Array.prototype.slice.call(e))},_uint8clampedarray:function(e){return n("uint8clampedarray:"),this.dispatch(Array.prototype.slice.call(e))},_int8array:function(e){return n("uint8array:"),this.dispatch(Array.prototype.slice.call(e))},_uint16array:function(e){return n("uint16array:"),this.dispatch(Array.prototype.slice.call(e))},_int16array:function(e){return n("uint16array:"),this.dispatch(Array.prototype.slice.call(e))},_uint32array:function(e){return n("uint32array:"),this.dispatch(Array.prototype.slice.call(e))},_int32array:function(e){return n("uint32array:"),this.dispatch(Array.prototype.slice.call(e))},_float32array:function(e){return n("float32array:"),this.dispatch(Array.prototype.slice.call(e))},_float64array:function(e){return n("float64array:"),this.dispatch(Array.prototype.slice.call(e))},_arraybuffer:function(e){return n("arraybuffer:"),this.dispatch(new Uint8Array(e))},_url:function(e){return n("url:"+e.toString())},_map:function(r){n("map:");var t=Array.from(r);return this._array(t,!1!==e.unorderedSets)},_set:function(r){n("set:");var t=Array.from(r);return this._array(t,!1!==e.unorderedSets)},_blob:function(){if(e.ignoreUnknown)return n("[blob]");throw Error('Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n')},_domwindow:function(){return n("domwindow")},_process:function(){return n("process")},_timer:function(){return n("timer")},_pipe:function(){return n("pipe")},_tcp:function(){return n("tcp")},_udp:function(){return n("udp")},_tty:function(){return n("tty")},_statwatcher:function(){return n("statwatcher")},_securecontext:function(){return n("securecontext")},_connection:function(){return n("connection")},_zlib:function(){return n("zlib")},_context:function(){return n("context")},_nodescript:function(){return n("nodescript")},_httpparser:function(){return n("httpparser")},_dataview:function(){return n("dataview")},_signal:function(){return n("signal")},_fsevent:function(){return n("fsevent")},_tlswrap:function(){return n("tlswrap")}}}function u(){return{buf:"",write:function(e){this.buf+=e},end:function(e){this.buf+=e},read:function(){return this.buf}}}r.writeToStream=function(e,r,t){return void 0===t&&(t=r,r={}),c(r=a(e,r),t).dispatch(e)}}));const O=(e,r)=>{if("function"==typeof e){let t;try{t=e(r)}catch(e){return!1}return!!t&&{key:t,hash:_([t,r],{respectType:!1})}}return{key:e,hash:_([e,r],{respectType:!1})}},x=({loading:e,data:r,numOfRenders:t,options:n})=>{if(1===t){if(n.defer)return!1;if(!r)return!0}return!!e},E=e=>{return e?e instanceof Error?null===(r=e.toString)||void 0===r?void 0:r.call(e):e:null;var r};function j(e={errors:{},loading:{},data:{}},r){if(!r.type.startsWith(s))return e;switch(r.type){case y:{const{[r.hash]:t,...n}=e.data;return{...e,data:{...n}}}case d:{const{[r.hash]:t,...n}=e.errors;return{...e,errors:{...n}}}case p:{const{[r.hash]:t,...n}=e.loading;return{...e,errors:{...e.errors,[r.hash]:r.error},loading:{...n}}}case l:return{...e,loading:{...e.loading,[r.hash]:r.hash}};case f:{const{[r.hash]:t,...n}=e.loading;return{...e,data:{...e.data,[r.hash]:r.value},loading:{...n}}}default:return e}}const C=(e={},r)=>{var t,n,o;return{data:null===(t=e.data)||void 0===t?void 0:t[r],loading:!!(null===(n=e.loading)||void 0===n?void 0:n[r]),error:null===(o=e.errors)||void 0===o?void 0:o[r]}};function $({cacheSelector:e=(e=>e)}={}){return{getCacheByKey:C,reducer:j,cacheSelector:e}}const k=(e={})=>{const{fallbackFetchClient:n=fetch,fallbackCache:o=$(),fallbackFetcher:a=m}=e,[i,c]=r(o.reducer,o.reducer(void 0,{type:""})),u=e=>({current:o.getCacheByKey(i,e)}),s=t(h),{cache:f=o,defaultFetcher:l=a,useFetchyeSelector:p=u,dispatch:d=c,fetchClient:y=n}=s||{};return{cache:f,defaultFetcher:l,useFetchyeSelector:p,dispatch:d,fetchClient:y,headless:!0}},T=e=>{const{defer:r,mapOptionsToKey:t,initialData:n,...o}=e;return o},P=(e,r,t)=>1===t?e||r:e,A=(e,{mapOptionsToKey:r=(e=>e),...t}={},a)=>{var i,c,u;const{defaultFetcher:s,useFetchyeSelector:f,dispatch:l,fetchClient:p}=k(),d="function"==typeof a?a:s,y=O(e,T(r(t))),h=f(y.hash),m=n(0);return m.current+=1,o((()=>{var e;if(t.defer||!y)return;if(1===m.current&&(null===(e=t.initialData)||void 0===e?void 0:e.data))return;const{loading:r,data:n,error:o}=h.current;r||n||o||w({dispatch:l,computedKey:y,fetcher:d,fetchClient:p,options:t})})),{isLoading:x({loading:h.current.loading,data:h.current.data||(null===(i=t.initialData)||void 0===i?void 0:i.data),numOfRenders:m.current,options:t}),error:P(h.current.error,null===(c=t.initialData)||void 0===c?void 0:c.error,m.current),data:P(h.current.data,null===(u=t.initialData)||void 0===u?void 0:u.data,m.current),run:()=>w({dispatch:l,computedKey:y,fetcher:d,fetchClient:p,options:t})}},N=({cache:e=$(),store:{getState:r,dispatch:t}={},fetchClient:n})=>async(o,{mapOptionsToKey:a=(e=>e),...i}={},c=m)=>{const{cacheSelector:u}=e,s=O(o,T(a(i)));if(!r||!t||!u){const e=await w({dispatch:()=>{},computedKey:s,fetcher:c,fetchClient:n,options:i});return{data:E(e.data),error:E(e.error)}}const f=u(r()),{data:l,loading:p,error:d}=e.getCacheByKey(f,s.hash);if(!l&&!d&&!p){const e=await w({dispatch:t,computedKey:s,fetcher:c,fetchClient:n,options:i});return{data:E(e.data),error:E(e.error)}}return{data:E(l),error:E(d)}}
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */;var F="function"==typeof Symbol&&Symbol.for,I=F?Symbol.for("react.element"):60103,R=F?Symbol.for("react.portal"):60106,D=F?Symbol.for("react.fragment"):60107,V=F?Symbol.for("react.strict_mode"):60108,M=F?Symbol.for("react.profiler"):60114,K=F?Symbol.for("react.provider"):60109,B=F?Symbol.for("react.context"):60110,U=F?Symbol.for("react.async_mode"):60111,q=F?Symbol.for("react.concurrent_mode"):60111,L=F?Symbol.for("react.forward_ref"):60112,z=F?Symbol.for("react.suspense"):60113,W=F?Symbol.for("react.suspense_list"):60120,H=F?Symbol.for("react.memo"):60115,J=F?Symbol.for("react.lazy"):60116,Y=F?Symbol.for("react.block"):60121,G=F?Symbol.for("react.fundamental"):60117,Q=F?Symbol.for("react.responder"):60118,X=F?Symbol.for("react.scope"):60119;function Z(e){if("object"==typeof e&&null!==e){var r=e.$$typeof;switch(r){case I:switch(e=e.type){case U:case q:case D:case M:case V:case z:return e;default:switch(e=e&&e.$$typeof){case B:case L:case J:case H:case K:return e;default:return r}}case R:return r}}}function ee(e){return Z(e)===q}var re={AsyncMode:U,ConcurrentMode:q,ContextConsumer:B,ContextProvider:K,Element:I,ForwardRef:L,Fragment:D,Lazy:J,Memo:H,Portal:R,Profiler:M,StrictMode:V,Suspense:z,isAsyncMode:function(e){return ee(e)||Z(e)===U},isConcurrentMode:ee,isContextConsumer:function(e){return Z(e)===B},isContextProvider:function(e){return Z(e)===K},isElement:function(e){return"object"==typeof e&&null!==e&&e.$$typeof===I},isForwardRef:function(e){return Z(e)===L},isFragment:function(e){return Z(e)===D},isLazy:function(e){return Z(e)===J},isMemo:function(e){return Z(e)===H},isPortal:function(e){return Z(e)===R},isProfiler:function(e){return Z(e)===M},isStrictMode:function(e){return Z(e)===V},isSuspense:function(e){return Z(e)===z},isValidElementType:function(e){return"string"==typeof e||"function"==typeof e||e===D||e===q||e===M||e===V||e===z||e===W||"object"==typeof e&&null!==e&&(e.$$typeof===J||e.$$typeof===H||e.$$typeof===K||e.$$typeof===B||e.$$typeof===L||e.$$typeof===G||e.$$typeof===Q||e.$$typeof===X||e.$$typeof===Y)},typeOf:Z},te=S((function(e,r){"production"!==process.env.NODE_ENV&&function(){var e="function"==typeof Symbol&&Symbol.for,t=e?Symbol.for("react.element"):60103,n=e?Symbol.for("react.portal"):60106,o=e?Symbol.for("react.fragment"):60107,a=e?Symbol.for("react.strict_mode"):60108,i=e?Symbol.for("react.profiler"):60114,c=e?Symbol.for("react.provider"):60109,u=e?Symbol.for("react.context"):60110,s=e?Symbol.for("react.async_mode"):60111,f=e?Symbol.for("react.concurrent_mode"):60111,l=e?Symbol.for("react.forward_ref"):60112,p=e?Symbol.for("react.suspense"):60113,d=e?Symbol.for("react.suspense_list"):60120,y=e?Symbol.for("react.memo"):60115,h=e?Symbol.for("react.lazy"):60116,m=e?Symbol.for("react.block"):60121,v=e?Symbol.for("react.fundamental"):60117,b=e?Symbol.for("react.responder"):60118,g=e?Symbol.for("react.scope"):60119;function w(e){if("object"==typeof e&&null!==e){var r=e.$$typeof;switch(r){case t:var d=e.type;switch(d){case s:case f:case o:case i:case a:case p:return d;default:var m=d&&d.$$typeof;switch(m){case u:case l:case h:case y:case c:return m;default:return r}}case n:return r}}}var S=s,_=f,O=u,x=c,E=t,j=l,C=o,$=h,k=y,T=n,P=i,A=a,N=p,F=!1;function I(e){return w(e)===f}r.AsyncMode=S,r.ConcurrentMode=_,r.ContextConsumer=O,r.ContextProvider=x,r.Element=E,r.ForwardRef=j,r.Fragment=C,r.Lazy=$,r.Memo=k,r.Portal=T,r.Profiler=P,r.StrictMode=A,r.Suspense=N,r.isAsyncMode=function(e){return F||(F=!0,console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")),I(e)||w(e)===s},r.isConcurrentMode=I,r.isContextConsumer=function(e){return w(e)===u},r.isContextProvider=function(e){return w(e)===c},r.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===t},r.isForwardRef=function(e){return w(e)===l},r.isFragment=function(e){return w(e)===o},r.isLazy=function(e){return w(e)===h},r.isMemo=function(e){return w(e)===y},r.isPortal=function(e){return w(e)===n},r.isProfiler=function(e){return w(e)===i},r.isStrictMode=function(e){return w(e)===a},r.isSuspense=function(e){return w(e)===p},r.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===o||e===f||e===i||e===a||e===p||e===d||"object"==typeof e&&null!==e&&(e.$$typeof===h||e.$$typeof===y||e.$$typeof===c||e.$$typeof===u||e.$$typeof===l||e.$$typeof===v||e.$$typeof===b||e.$$typeof===g||e.$$typeof===m)},r.typeOf=w}()})),ne=S((function(e){"production"===process.env.NODE_ENV?e.exports=re:e.exports=te})),oe=Object.getOwnPropertySymbols,ae=Object.prototype.hasOwnProperty,ie=Object.prototype.propertyIsEnumerable;function ce(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}var ue=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(r).map((function(e){return r[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,r){for(var t,n,o=ce(e),a=1;a<arguments.length;a++){for(var i in t=Object(arguments[a]))ae.call(t,i)&&(o[i]=t[i]);if(oe){n=oe(t);for(var c=0;c<n.length;c++)ie.call(t,n[c])&&(o[n[c]]=t[n[c]])}}return o},se="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",fe=function(){};if("production"!==process.env.NODE_ENV){var le=se,pe={},de=Function.call.bind(Object.prototype.hasOwnProperty);fe=function(e){var r="Warning: "+e;"undefined"!=typeof console&&console.error(r);try{throw new Error(r)}catch(e){}}}function ye(e,r,t,n,o){if("production"!==process.env.NODE_ENV)for(var a in e)if(de(e,a)){var i;try{if("function"!=typeof e[a]){var c=Error((n||"React class")+": "+t+" type `"+a+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+typeof e[a]+"`.");throw c.name="Invariant Violation",c}i=e[a](r,a,n,t,null,le)}catch(e){i=e}if(!i||i instanceof Error||fe((n||"React class")+": type specification of "+t+" `"+a+"` is invalid; the type checker function must return `null` or an `Error` but returned a "+typeof i+". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."),i instanceof Error&&!(i.message in pe)){pe[i.message]=!0;var u=o?o():"";fe("Failed "+t+" type: "+i.message+(null!=u?u:""))}}}ye.resetWarningCache=function(){"production"!==process.env.NODE_ENV&&(pe={})};var he=ye,me=Function.call.bind(Object.prototype.hasOwnProperty),ve=function(){};function be(){return null}"production"!==process.env.NODE_ENV&&(ve=function(e){var r="Warning: "+e;"undefined"!=typeof console&&console.error(r);try{throw new Error(r)}catch(e){}});var ge=function(e,r){var t="function"==typeof Symbol&&Symbol.iterator;var n="<<anonymous>>",o={array:u("array"),bool:u("boolean"),func:u("function"),number:u("number"),object:u("object"),string:u("string"),symbol:u("symbol"),any:c(be),arrayOf:function(e){return c((function(r,t,n,o,a){if("function"!=typeof e)return new i("Property `"+a+"` of component `"+n+"` has invalid PropType notation inside arrayOf.");var c=r[t];if(!Array.isArray(c))return new i("Invalid "+o+" `"+a+"` of type `"+f(c)+"` supplied to `"+n+"`, expected an array.");for(var u=0;u<c.length;u++){var s=e(c,u,n,o,a+"["+u+"]",se);if(s instanceof Error)return s}return null}))},element:c((function(r,t,n,o,a){var c=r[t];return e(c)?null:new i("Invalid "+o+" `"+a+"` of type `"+f(c)+"` supplied to `"+n+"`, expected a single ReactElement.")})),elementType:c((function(e,r,t,n,o){var a=e[r];return ne.isValidElementType(a)?null:new i("Invalid "+n+" `"+o+"` of type `"+f(a)+"` supplied to `"+t+"`, expected a single ReactElement type.")})),instanceOf:function(e){return c((function(r,t,o,a,c){if(!(r[t]instanceof e)){var u=e.name||n;return new i("Invalid "+a+" `"+c+"` of type `"+(((s=r[t]).constructor&&s.constructor.name?s.constructor.name:n)+"` supplied to `")+o+"`, expected instance of `"+u+"`.")}var s;return null}))},node:c((function(e,r,t,n,o){return s(e[r])?null:new i("Invalid "+n+" `"+o+"` supplied to `"+t+"`, expected a ReactNode.")})),objectOf:function(e){return c((function(r,t,n,o,a){if("function"!=typeof e)return new i("Property `"+a+"` of component `"+n+"` has invalid PropType notation inside objectOf.");var c=r[t],u=f(c);if("object"!==u)return new i("Invalid "+o+" `"+a+"` of type `"+u+"` supplied to `"+n+"`, expected an object.");for(var s in c)if(me(c,s)){var l=e(c,s,n,o,a+"."+s,se);if(l instanceof Error)return l}return null}))},oneOf:function(e){if(!Array.isArray(e))return"production"!==process.env.NODE_ENV&&ve(arguments.length>1?"Invalid arguments supplied to oneOf, expected an array, got "+arguments.length+" arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).":"Invalid argument supplied to oneOf, expected an array."),be;function r(r,t,n,o,c){for(var u=r[t],s=0;s<e.length;s++)if(a(u,e[s]))return null;var f=JSON.stringify(e,(function(e,r){return"symbol"===l(r)?String(r):r}));return new i("Invalid "+o+" `"+c+"` of value `"+String(u)+"` supplied to `"+n+"`, expected one of "+f+".")}return c(r)},oneOfType:function(e){if(!Array.isArray(e))return"production"!==process.env.NODE_ENV&&ve("Invalid argument supplied to oneOfType, expected an instance of array."),be;for(var r=0;r<e.length;r++){var t=e[r];if("function"!=typeof t)return ve("Invalid argument supplied to oneOfType. Expected an array of check functions, but received "+p(t)+" at index "+r+"."),be}return c((function(r,t,n,o,a){for(var c=0;c<e.length;c++)if(null==(0,e[c])(r,t,n,o,a,se))return null;return new i("Invalid "+o+" `"+a+"` supplied to `"+n+"`.")}))},shape:function(e){return c((function(r,t,n,o,a){var c=r[t],u=f(c);if("object"!==u)return new i("Invalid "+o+" `"+a+"` of type `"+u+"` supplied to `"+n+"`, expected `object`.");for(var s in e){var l=e[s];if(l){var p=l(c,s,n,o,a+"."+s,se);if(p)return p}}return null}))},exact:function(e){return c((function(r,t,n,o,a){var c=r[t],u=f(c);if("object"!==u)return new i("Invalid "+o+" `"+a+"` of type `"+u+"` supplied to `"+n+"`, expected `object`.");var s=ue({},r[t],e);for(var l in s){var p=e[l];if(!p)return new i("Invalid "+o+" `"+a+"` key `"+l+"` supplied to `"+n+"`.\nBad object: "+JSON.stringify(r[t],null,"  ")+"\nValid keys: "+JSON.stringify(Object.keys(e),null,"  "));var d=p(c,l,n,o,a+"."+l,se);if(d)return d}return null}))}};function a(e,r){return e===r?0!==e||1/e==1/r:e!=e&&r!=r}function i(e){this.message=e,this.stack=""}function c(e){if("production"!==process.env.NODE_ENV)var t={},o=0;function a(a,c,u,s,f,l,p){if(s=s||n,l=l||u,p!==se){if(r){var d=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");throw d.name="Invariant Violation",d}if("production"!==process.env.NODE_ENV&&"undefined"!=typeof console){var y=s+":"+u;!t[y]&&o<3&&(ve("You are manually calling a React.PropTypes validation function for the `"+l+"` prop on `"+s+"`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."),t[y]=!0,o++)}}return null==c[u]?a?null===c[u]?new i("The "+f+" `"+l+"` is marked as required in `"+s+"`, but its value is `null`."):new i("The "+f+" `"+l+"` is marked as required in `"+s+"`, but its value is `undefined`."):null:e(c,u,s,f,l)}var c=a.bind(null,!1);return c.isRequired=a.bind(null,!0),c}function u(e){return c((function(r,t,n,o,a,c){var u=r[t];return f(u)!==e?new i("Invalid "+o+" `"+a+"` of type `"+l(u)+"` supplied to `"+n+"`, expected `"+e+"`."):null}))}function s(r){switch(typeof r){case"number":case"string":case"undefined":return!0;case"boolean":return!r;case"object":if(Array.isArray(r))return r.every(s);if(null===r||e(r))return!0;var n=function(e){var r=e&&(t&&e[t]||e["@@iterator"]);if("function"==typeof r)return r}(r);if(!n)return!1;var o,a=n.call(r);if(n!==r.entries){for(;!(o=a.next()).done;)if(!s(o.value))return!1}else for(;!(o=a.next()).done;){var i=o.value;if(i&&!s(i[1]))return!1}return!0;default:return!1}}function f(e){var r=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":function(e,r){return"symbol"===e||!!r&&("Symbol"===r["@@toStringTag"]||"function"==typeof Symbol&&r instanceof Symbol)}(r,e)?"symbol":r}function l(e){if(null==e)return""+e;var r=f(e);if("object"===r){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return r}function p(e){var r=l(e);switch(r){case"array":case"object":return"an "+r;case"boolean":case"date":case"regexp":return"a "+r;default:return r}}return i.prototype=Error.prototype,o.checkPropTypes=he,o.resetWarningCache=he.resetWarningCache,o.PropTypes=o,o};function we(){}function Se(){}Se.resetWarningCache=we;S((function(e){if("production"!==process.env.NODE_ENV){var r=ne;e.exports=ge(r.isElement,!0)}else e.exports=function(){function e(e,r,t,n,o,a){if(a!==se){var i=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}function r(){return e}e.isRequired=e;var t={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,elementType:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:Se,resetWarningCache:we};return t.PropTypes=t,t}()}));const _e=({fetchyeState:e,subscribe:t,getCacheByKey:a,equalityChecker:i})=>c=>{const[,u]=r((e=>e+1),0),s=a(e.current,c),f=n(s),l=n(s);return o((()=>{function r(){const r=a(e.current,c);f.current=l.current,l.current=r,i(l.current,f.current)||u()}return l.current=a(e.current,c),r(),t(r)}),[c]),l},Oe=({cache:r=$(),fetcher:t=m,equalityChecker:o=v,fetchClient:i=fetch,initialData:c=r.reducer(void 0,{type:""}),children:u})=>{const[s,f]=b(),[l,p]=((e,r,t)=>{const o=n(r);return[o,r=>{o.current=e(o.current,r),t()}]})(r.reducer,c,s),d=a((()=>({dispatch:p,cache:r,defaultFetcher:t,useFetchyeSelector:_e({fetchyeState:l,subscribe:f,getCacheByKey:r.getCacheByKey,equalityChecker:o}),fetchClient:i})),[r,o,i,t,f,l,p]);return e.createElement(h.Provider,{value:d},u)};export{Oe as FetchyeProvider,$ as SimpleCache,N as makeServerFetchye,A as useFetchye};
