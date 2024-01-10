var nejsBasicExtensions=(()=>{var R=Object.defineProperty;var F=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var I=Object.prototype.hasOwnProperty;var B=(e,t)=>{for(var s in t)R(e,s,{get:t[s],enumerable:!0})},K=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of C(t))!I.call(e,i)&&i!==s&&R(e,i,{get:()=>t[i],enumerable:!(r=F(t,i))||r.enumerable});return e};var Y=e=>K(R({},"__esModule",{value:!0}),e);var J={};B(J,{ArrayPrototypeExtensions:()=>D,DescriptorExtension:()=>E,FunctionExtensions:()=>d,GlobalFunctionsAndProps:()=>x,ObjectExtensions:()=>p,ReflectExtensions:()=>b,StringExtensions:()=>y,SymbolExtensions:()=>v,all:()=>W,disableAll:()=>H,enableAll:()=>U});var k=e=>/(\w+)]/.exec(Object.prototype.toString.call(e))[1],f=class extends Error{constructor(t,s){super(`${k(t)} disallows tampering with ${s}.`),Object.assign(this,{owner:t,key:s})}get[Symbol.toStringTag](){return this.constructor.name}};var M=e=>/(\w+)]/.exec(Object.prototype.toString.call(e))[1],h=class extends Error{constructor(t,s){super(`${M(t)} does not have a property named '${s}'.`),Object.assign(this,{owner:t,key:s})}get[Symbol.toStringTag](){return this.constructor.name}};var g=class{constructor(t,s=!1){this.started=!1,this.preventRevert=s,this.patch=t,this.patchName=t.owner?.name??t.owner?.constructor?.name??/(\w+)]/.exec(Object.prototype.toString.call(t.owner))[1],this.state={needsApplication:!1,needsReversion:!1}}start(){return this.started||(this.state.needsApplication=!this.patch.applied,this.state.needsReversion=this.patch.applied,this.started=!0,this.state.needsApplication&&this.patch.apply()),this}stop(){return this.started&&((this.preventRevert||this.patch.applied)&&this.patch.revert(),this.state.needsApplication=!1,this.state.needsReversion=!1,this.started=!1),this}get[Symbol.toStringTag](){return`${this.constructor.name}:${this.patchName}`}[Symbol.for("nodejs.util.inspect.custom")](t,s,r){let i=this[Symbol.toStringTag],n=`(started: ${this.started} needed: ${this.state.needsApplication})`;return r(`${i} ${n}`,{...s,depth:t})}};var c=class e{constructor(t,s,r={}){Object.assign(this,{owner:t,options:r,applied:!1}),this.patchConflicts={},this.patchEntries={},this.patchesOwner=s,Reflect.ownKeys(s).forEach(i=>{this.patchEntries[i]=new e.#t(i,this.patchesOwner),Reflect.has(this.owner,i)&&(this.patchConflicts[i]=new e.#t(i,this.owner))}),e.patches.has(t)||e.patches.set(t,[]),e.patches.get(t).push(this)}get patches(){return Reflect.ownKeys(this.patchEntries).map(t=>[t,this.patchEntries[t]])}get conflicts(){return Reflect.ownKeys(this.patchConflicts).map(t=>[t,this.patchConflicts[t]])}apply(){this.applied||(this.patches.forEach(([,t])=>{Object.defineProperty(this.owner,t.key,t.descriptor)}),this.applied=!0)}createToggle(t=!1){return new g(this,t)}revert(){this.applied&&(this.patches.forEach(([,t])=>{delete this.owner[t.key]}),this.conflicts.forEach(([,t])=>{Object.defineProperty(this.owner,t.key,t.descriptor)}),this.applied=!1)}release(){let t=e.patches.get(this.owner);t.splice(t.find(s=>s===this),1)}owner=null;options=null;static patches=new Map;static enableFor(t){if(e.patches.has(t))for(let s of e.patches.get(t))s.apply()}static disableFor(t){if(e.patches.has(t))for(let s of e.patches.get(t))s.revert()}static#t=class{constructor(t,s=globalThis){Object.assign(this,{key:t,descriptor:Object.getOwnPropertyDescriptor(s,t),owner:s})}get computed(){return this.isAccessor?this.descriptor.get.bind(this.owner).call():this.descriptor.value}get isData(){return Reflect.has(this.descriptor,"value")}get isAccessor(){return Reflect.has(this.descriptor,"get")}get isReadOnly(){return Reflect.has(this.descriptor,"configurable")&&!this.descriptor.configurable||Reflect.has(this.descriptor,"writable")&&!this.descriptor.writable}get[Symbol.toStringTag](){return this.constructor.name}[Symbol.for("nodejs.util.inspect.custom")](t,s,r){return`PatchEntry<${this.key}, ${this.isData?"Data":"Accessor"}${this.isReadOnly?" [ReadOnly]":""}>`}}};var m=class e extends c{constructor(t,s,r=globalThis,i={}){let{key:n,extension:o,valid:a}=e.determineInput(t);if(o=s||o,!a)throw new h(r,n);let l=Object.getOwnPropertyDescriptor(r,n);if(l&&(Reflect.has(l,"writable")&&!l.writable||Reflect.has(l,"configurable")&&!l.configurable))throw new f(r,n);super(r,{[n]:o},i),this.key=n}static determineInput(t){let s={key:null,extension:null,valid:!1};return t instanceof Function?s={key:t.name,extension:t,valid:!0}:(typeof t=="string"||t instanceof String)&&(s={key:t,extension:null,valid:!0}),s}[Symbol.for("nodejs.util.inspect.custom")](t,s,r){return`Extension<${this.key}>`}get[Symbol.toStringTag](){return this.constructor.name}};var d=new c(Function,{isClass(e){return e instanceof Function&&!!/^class\s/.exec(String(e))},isFunction(e){return e instanceof Function},isAsync(e){let t=/(\w+)]/g.exec(Object.prototype.toString.call(e))[1];return e instanceof Function&&t.includes("Async")},isBigArrow(e){return e instanceof Function&&String(e).includes("=>")&&!String(e).startsWith("bound")&&!Reflect.has(e,"prototype")},isBound(e){return e instanceof Function&&String(e).startsWith("bound")&&!Reflect.has(e,"prototype")}});var p=new c(Object,{getStringTag(e){return/\s(.+)]/.exec(Object.prototype.toString.call(e))[1]},getType(e,t=globalThis){let s=Object.getStringTag(e);switch(s){case"Null":return null;case"Undefined":return;default:return t[s]}},isObject(e){return e&&(e instanceof Object||typeof e=="object")},isPrimitive(e){if(e===null)return!0;switch(typeof e){case"string":case"number":case"bigint":case"boolean":case"undefined":case"symbol":return!0;default:return!1}},isValidKey(e){return typeof e=="string"||typeof e=="symbol"},stripTo(e,t,s=!0){let r={};if(!Array.isArray(t))return r;for(let i of t)if(Reflect.has(e,i)){let n=Object.getOwnPropertyDescriptor(e,i);(Reflect.has(n,"get")||Reflect.has(n,"set"))&&s&&(n.get=n?.get?.bind(e),n.set=n?.set?.bind(e)),Object.defineProperty(r,n)}return r}});var b=new c(Reflect,{hasAll(e,...t){return Object.isObject(e)&&t.flat(1/0).map(s=>Reflect.has(e,s)).every(s=>s)},ownDescriptors(e){let t={},s=()=>s.doIt?p.revert():"";if(s.doIt=!1,Object.isObject||(s.doIt=!0,p.apply()),!Object.isObject(e))return s(),{};let r=Reflect.ownKeys(e);for(let i of r)t[i]=Object.getOwnPropertyDescriptor(i);return s(),t},hasSome(e,...t){return Object.isObject(e)&&t.flat(1/0).map(s=>Reflect.has(e,s)).some(s=>s)},entries(e){return!e||typeof e!="object"?[]:Reflect.ownKeys(e).map(t=>[t,Object.getOwnPropertyDescriptor(e,t)])},values(e){return Reflect.entries.map(([,t])=>t)}});var y=new c(String,{isString(e){return e&&(typeof e=="string"||e instanceof String)?e.length>0:!1}});var v=new c(Symbol,{isSymbol(e){return e&&typeof e=="symbol"}});var D=new c(Array.prototype,{contains(e){return!!this.find(t=>t===e)},findEntry(e){let t=this.entries(),s=1;for(let r of t)if(e(r[s]))return r},get first(){return this[0]},get last(){return this[this.length-1]}});var S=p.patchEntries?.isObject?.computed,P=p.patchEntries?.isValidKey?.computed,G=y.patchEntries?.isString?.computed,w=b.patchEntries?.hasSome?.computed,T=class e{#t=e.enigmatic;constructor(t,s){if(this.#t=t,S(t)&&P(s)&&(this.#t=Object.getOwnPropertyDescriptor(t,s)),!this.isDescriptor)throw new Error("Not a valid descriptor:",this.#t)}get isAccessor(){return e.isAccessor(this.#t)}get isData(){return e.isData(this.#t)}get isDescriptor(){return e.isDescriptor(this.#t)}get configurable(){return!!this.#t?.configurable}set configurable(t){(this.#t||{}).configurable=!!t}get enumerable(){return this.#t?.enumerable}set enumerable(t){(this.#t||{}).enumerable=t}get writable(){return this.#t?.writable}set writable(t){(this.#t||{}).writable=t}get value(){return this.#t?.value}set value(t){(this.#t||{}).value=t}get get(){return this.#t?.get}set get(t){(this.#t||{}).get=t}get set(){return this.#t?.writable}set set(t){(this.#t||{}).set=t}static for(t,s){return!S(t)&&!P(s)?null:Object.getOwnPropertyDescriptor(t,s)}applyTo(t,s){if(!S(t)||!P(s))throw new Error("Cannot apply descriptor to non-object or invalid key");return Object.defineProperty(t,s,this.#t)}[Symbol.toPrimitive](t){switch(t){case"string":if(this.isAccessor){let s=Reflect.has(this.#t,"get")?"getter":"",r=Reflect.has(this.#t,"set")?"setter":"";return`Accessor (${s}${s&&r?", ":""}${r})`}else if(this.isData){let s=Reflect.has(this.#t,"value")?"value":"",r=Reflect.has(this.#t,"writable")?"writable":"";return`Data (${s}${s&&r?", ":""}${r})`}break;case"number":return NaN;default:return this.#t}}static getData(t,s){if(!S(t)||!G(s))return null;let r=e.all(t);if(r.has(s)){let i=r.get(s);if(e.isData(i))return i.value}}static getAccessor(t,s){if(!S(t))return null;let[r,i,n]=[0,1,2],o=[void 0,void 0,void 0],a=this.all(t),l=e.isDescriptor(t);if(a.has(s)||l){let u=l?t:a.get(s);if(e.isAccessor(u))return o[n]=a.object(s),o[r]=u?.get,o[i]=u?.set,Object.assign(o,{get(){this[r].bind(this[n])()},set(A){this[i].bind(this[n])(A)},get accessor(){return!0},get descriptor(){return u},get boundDescriptor(){return{...u,get:u.get?.bind(t),set:u.set?.bind(t)}}}),o}}static base(t=!1,s=!1){return{enumerable:t,configurable:s}}static accessor(t,s,{enumerable:r,configurable:i}=e.base()){return{get:t,set:s,enumerable:r,configurable:i}}static data(t,s=!0,{enumerable:r,configurable:i}=e.base()){return{value:t,enumerable:r,writable:s,configurable:i}}static isDescriptor(t){let s=[...e.SHARED_KEYS,...e.ACCESSOR_KEYS,...e.DATA_KEYS];return w(t,s)}static isData(t,s){let i=(typeof t=="object"||t instanceof Object)&&s instanceof String?e.for(t,s):t,{ACCESSOR_KEYS:n,DATA_KEYS:o}=this,a=!1;return w(i,n)?a=!1:w(i,o)&&(a=!0),a}static isAccessor(t,s){let i=t&&s&&(typeof t=="object"||t instanceof Object)&&(s instanceof String||typeof s=="symbol")?e.for(t,s):t,{ACCESSOR_KEYS:n,DATA_KEYS:o}=this,a=!1;return w(i,o)?a=!1:w(i,n)&&(a=!0),a}static get flexible(){return this.base(!0,!0)}static get enigmatic(){return this.base(!1,!0)}static get intrinsic(){return this.base(!1,!1)}static get transparent(){return this.base(!0,!1)}static get SHARED_KEYS(){return["configurable","enumerable"]}static get ACCESSOR_KEYS(){return["get","set"]}static get DATA_KEYS(){return["value","writable"]}},E=new m(T);var{isClass:V,isFunction:O}=d.patchEntries.isClass.computed,N=Symbol.for("nodejs.util.inspect.custom"),x=new c(globalThis,{asBigIntObject(e){let t={configurable:!0,enumerable:!1},s={value:e};return Object.defineProperties(s,{[Symbol.toPrimitive]:{value:function(){return e},...t},[Symbol.toStringTag]:{value:BigInt.name,...t},[Symbol.species]:{get(){return BigInt},...t},[N]:{...t,value(r,i,n){return n(this[Symbol.toPrimitive](),{...i,depth:r})}}}),Object.setPrototypeOf(s,BigInt.prototype),Reflect.ownKeys(BigInt.prototype).forEach(r=>{typeof s[r]=="function"&&(s[r]=function(...i){return BigInt.prototype[r].apply(this,i)}.bind(s.value))}),s},maskAs(e,t,s){let{prototype:r,toPrimitive:i}=GenericMask({...s,prototype:t}),n={configurable:!0,enumerable:!1},o=O(r)?r.prototype:r,a=V(r)?r:o?.constructor;return!a&&!o?null:(Object.setPrototypeOf(e,o),Object.defineProperties(e,{valueOf:{value(){return String(i("default",e))},...n},[Symbol.toPrimitive]:{value(l){return i(l,e)},...n},[Symbol.toStringTag]:{value:a.name,...n},[Symbol.species]:{get(){return a},...n},[N]:{...n,value(l,u,A){return A(this[Symbol.toPrimitive](),{...u,depth:l})}}}),e)},maskAsString(e,t,s){return e&&Reflect.has(e,t)?maskAs(e,StringMask(t??"value",s)):null},maskAsNumber(e,t,s){return e&&Reflect.has(e,t)?maskAs(e,NumberMask(t??"value",s)):null},GenericMask({prototype:e,targetKey:t="value",toPrimitive:s}){let r={targetKey:t,toPrimitive:s,prototype:e};return O(s)||(r.toPrimitive=(i,n)=>{let o=n[t],a=typeof o=="number"&&Number.isFinite(o)||typeof o=="string"&&!isNaN(parseFloat(o))&&isFinite(o);switch(i){case"string":return a?String(o):o??String(n);case"number":return a?Number(o):NaN;case"default":default:return a?Number(o):o}}),r},StringMask(e,t){let s={targetKey:e,toPrimitive:t,prototype:String.prototype};return O(t)||(s.toPrimitive=function(i,n){switch(i){case"default":return n[e];case"number":return parseInt(n[e],36);case"string":return String(n[e]);default:return n}}),s},NumberMask(e,t){let s={targetKey:e,toPrimitive:t,prototype:Number.prototype};return O(t)||(s.toPrimitive=function(i,n){switch(i){case"default":return n[e];case"number":return Number(n[e]);case"string":return String(n[e]);default:return n}}),s}});var $=[Object,Function,Reflect,String,Symbol,Array.prototype],j=[x,E];function U(e){let t=e||$;if(!t)throw new Error("Unable to enable features without owners list");t.forEach(s=>{c.enableFor(s)}),j.forEach(s=>{s.apply()})}function H(e){let t=e||$;if(!t)throw new Error("Unable to disable features without owners list");t.forEach(s=>{c.disableFor(s)}),j.forEach(s=>{s.revert()})}var W=[p,d,b,y,v,D,x,E].reduce((s,r)=>(Reflect.ownKeys(r.patchEntries).reduce((i,n)=>(s[n]=r.patchEntries[n].computed,s),s),s),{});return Y(J);})();
//# sourceMappingURL=basic-extensions.bundle.1.4.0.js.map
