var nejsBasicExtensions=(()=>{var N=Object.defineProperty;var nt=Object.getOwnPropertyDescriptor;var ot=Object.getOwnPropertyNames;var it=Object.prototype.hasOwnProperty;var ct=(r,t)=>{for(var e in t)N(r,e,{get:t[e],enumerable:!0})},at=(r,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of ot(t))!it.call(r,o)&&o!==e&&N(r,o,{get:()=>t[o],enumerable:!(s=nt(t,o))||s.enumerable});return r};var ft=r=>at(N({},"__esModule",{value:!0}),r);var xt={};ct(xt,{Controls:()=>y,Extensions:()=>O,Patches:()=>R,all:()=>st,default:()=>St});var ut=r=>/(\w+)]/.exec(Object.prototype.toString.call(r))[1],w=class extends Error{constructor(t,e){super(`${ut(t)} disallows tampering with ${e}.`),Object.assign(this,{owner:t,key:e})}get[Symbol.toStringTag](){return this.constructor.name}};var lt=r=>/(\w+)]/.exec(Object.prototype.toString.call(r))[1],S=class extends Error{constructor(t,e){super(`${lt(t)} does not have a property named '${e}'.`),Object.assign(this,{owner:t,key:e})}get[Symbol.toStringTag](){return this.constructor.name}};var x=class{constructor(t,e=!1){this.started=!1,this.preventRevert=e,this.patch=t,this.patchName=t.owner?.name??t.owner?.constructor?.name??/(\w+)]/.exec(Object.prototype.toString.call(t.owner))[1],this.state={needsApplication:!1,needsReversion:!1}}start(){return this.started||(this.state.needsApplication=!this.patch.applied,this.state.needsReversion=this.patch.applied,this.started=!0,this.state.needsApplication&&this.patch.apply()),this}stop(){return this.started&&((this.preventRevert||this.patch.applied)&&this.patch.revert(),this.state.needsApplication=!1,this.state.needsReversion=!1,this.started=!1),this}get[Symbol.toStringTag](){return`${this.constructor.name}:${this.patchName}`}[Symbol.for("nodejs.util.inspect.custom")](t,e,s){let o=this[Symbol.toStringTag],n=`(started: ${this.started} needed: ${this.state.needsApplication})`;return s(`${o} ${n}`,{...e,depth:t})}};var m=class{constructor(t,e=globalThis,s=void 0){let o=c=>c==null,n=(c,u=["string","symbol"])=>!o(c)&&!!u.find(f=>f===typeof c),i=c=>n(c,["object"]);if(!n(t))throw console.error("Property",t,`(type: ${typeof t})`,"owningObject",e,`(type: ${typeof e})`,"condition",s,`(type: ${typeof s})`),new TypeError("Property must be non-null and either a string or symbol");if(!i(e))throw new TypeError("Cannot create Patch entry as owning object is invalid");Object.assign(this,{key:t,descriptor:Object.getOwnPropertyDescriptor(e,t),owner:e,condition:typeof s=="function"?s:void 0})}get computed(){return this.isAccessor?this.descriptor.get.bind(this.owner).call():this.descriptor.value}get isData(){return Reflect.has(this.descriptor,"value")}get isAccessor(){return Reflect.has(this.descriptor,"get")}get isReadOnly(){return Reflect.has(this.descriptor,"configurable")&&!this.descriptor.configurable||Reflect.has(this.descriptor,"writable")&&!this.descriptor.writable}get isAllowed(){return this.condition&&typeof this.condition=="function"?this.condition():!0}get[Symbol.toStringTag](){return this.constructor.name}[Symbol.for("nodejs.util.inspect.custom")](t,e,s){let o=this.isData?" Data":" Accessor",n=this.isReadOnly?" [ReadOnly]":"";return`PatchEntry<${this.key}${o}${n}>`}};var a=class r{constructor(t,e,s={}){Object.assign(this,{owner:t,options:s}),this.patchConflicts={},this.patchEntries={},this.patchesOwner=e,this.patchCount=0,this.patchesApplied=0;let o=this?.options.condition;Reflect.ownKeys(e).forEach(n=>{let i=this?.options?.conditions?.[n]??o;try{this.patchEntries[n]=new m(n,this.patchesOwner,i),this.patchCount+=1}catch(c){console.error(`Failed to process patch for ${n}
`,c)}if(Reflect.has(this.owner,n))try{this.patchConflicts[n]=new m(n,this.owner)}catch(c){console.error(`Cannot capture conflicting patch key ${n}
`,c)}}),r.patches.has(t)||r.patches.set(t,[]),r.patches.get(t).push(this)}get entries(){return Reflect.ownKeys(this.patchEntries).map(t=>[t,this.patchEntries[t]])}get patches(){return this.entries.reduce((t,[e,s])=>(t[e]=s.computed,t),{})}get conflicts(){return Reflect.ownKeys(this.patchConflicts).map(t=>[t,this.patchConflicts[t]])}get applied(){return this.patchesApplied>0}get isPartiallyPatched(){return this.applied}get isFullyPatched(){return this.patchCount==this.patchesApplied}apply(t){let e=this.entries,s={patches:e.length,applied:0,errors:[],notApplied:e.length};e.forEach(([,o])=>{if(o.isAllowed){Object.defineProperty(this.owner,o.key,o.descriptor);let n=Object.getOwnPropertyDescriptor(this.owner,o.key);this.#t(n,o.descriptor)?(s.applied+=1,s.notApplied-=1):s.errors.push([o,new Error(`Could not apply patch for key ${o.key}`)])}}),this.patchesApplied=s.applied,typeof t=="function"&&t(s)}createToggle(t=!1){return new x(this,t)}revert(t){if(!this.applied)return;let e=this.entries,s=this.conflicts,o={patches:e.length,reverted:0,restored:0,conflicts:s.length,errors:[],stillApplied:0};e.forEach(([,n])=>{delete this.owner[n.key]?(this.patchesApplied-=1,o.reverted+=1):o.errors.push([n,new Error(`Failed to revert patch ${n.key}`)])}),s.forEach(([,n])=>{Object.defineProperty(this.owner,n.key,n.descriptor);let i=Object.getOwnPropertyDescriptor(this.owner,n.key);this.#t(n.descriptor,i)?o.restored+=1:o.errors.push([n,new Error(`Failed to restore original ${n.key}`)])}),o.stillApplied=this.patchesApplied,typeof t=="function"&&t(o)}release(){let t=r.patches.get(this.owner);t.splice(t.find(e=>e===this),1)}owner=null;options=null;#t(t,e){if(!t||!e)return!1;let s=!0;return s=s&&t.configurable===e.configurable,s=s&&t.enumerable===e.enumerable,s=s&&t.value===e.value,s=s&&t.writable===e.writable,s=s&&t.get===e.get,s=s&&t.set===e.set,s}static patches=new Map;static enableFor(t){if(r.patches.has(t))for(let e of r.patches.get(t))e.apply()}static disableFor(t){if(r.patches.has(t))for(let e of r.patches.get(t))e.revert()}};var pt=["number","boolean","bigint","string","symbol"],l=class r extends a{constructor(t,e,s=globalThis,o={}){let n=r.determineInput(t),{key:i,extension:c,valid:u}=n;if(c=e||c,!u)throw new S(s,i);let f=Object.getOwnPropertyDescriptor(s,i);if(f&&(Reflect.has(f,"writable")&&!f.writable||Reflect.has(f,"configurable")&&!f.configurable))throw new w(s,i);super(s,{[i]:c},o),this.key=i,this.class=n.class,this.function=n.function}get isFunction(){return!!this.function}get isClass(){return!!this.class}get isPrimitive(){return~pt.indexOf(typeof this.value)}get isObject(){return Object(this.value)===this.value}static determineInput(t){let e={key:null,extension:null,valid:!1};return t instanceof Function?(e={key:t.name,extension:t,valid:!0},/^class .*/.exec(t.toString())&&(e.class=t),/^(async )?function .*/.exec(t.toString())&&(e.function=t)):(typeof t=="string"||t instanceof String)&&(e={key:t,extension:null,valid:!0}),e}[Symbol.for("nodejs.util.inspect.custom")](t,e,s){return`Extension<${this.key}>`}get[Symbol.toStringTag](){return this.constructor.name}};var p=new a(Object,{isNullDefined(r){return r==null},hasStringTag(r){return Object.isObject(r)&&Reflect.has(r,Symbol.toStringTag)},getStringTag(r,t=!1){if(Object.hasStringTag(r))return r[Symbol.toStringTag];if(!t)return r&&typeof r=="function"?r.name:/\s(.+)]/.exec(Object.prototype.toString.call(r))[1]},getType(r,t=globalThis){let e=Object.getStringTag(r);switch(e){case"Null":return null;case"Undefined":return;default:return t[e]}},isObject(r){return r&&(r instanceof Object||typeof r=="object")},isPrimitive(r){if(r===null)return!0;switch(typeof r){case"string":case"number":case"bigint":case"boolean":case"undefined":case"symbol":return!0;default:return!1}},isValidKey(r){return typeof r=="string"||typeof r=="symbol"},stripTo(r,t,e=!0){if(!r||typeof r!="object")throw new TypeError("Object.stripTo requires an object to strip. Received",r);let s={};if(!Array.isArray(t))return s;for(let o of t)if(Reflect.has(r,o)){let i={...Object.getOwnPropertyDescriptor(r,o)};(typeof i.get=="function"||typeof i.set=="function")&&e&&(i.get=i.get?.bind(r),i.set=i.set?.bind(r)),Object.defineProperty(s,o,i)}return s}}),q=new a(Object.prototype,{stripTo(r,t=!0){return Object.stripTo(this,r,t)}});var{getStringTag:z}=p.patches,T=new a(Function,{isAsync(r){let t=/(\w+)]/g.exec(Object.prototype.toString.call(r))[1];return r instanceof Function&&t.includes("Async")},isAsyncGenerator(r){let t=z(r);return r instanceof Function&&t=="AsyncGeneratorFunction"},isBigArrow(r){return r instanceof Function&&String(r).includes("=>")&&!String(r).startsWith("bound")&&!Reflect.has(r,"prototype")},isBound(r){return r instanceof Function&&String(r).startsWith("bound")&&!Reflect.has(r,"prototype")},isClass(r){return r instanceof Function&&!!/^class\s/.exec(String(r))},isFunction(r){return r instanceof Function&&!Function.isClass(r)},isGenerator(r){let t=z(r);return r instanceof Function&&t=="GeneratorFunction"}}),H=new a(Function.prototype,{get isAsync(){return Function.isAsync(this)},get isAsyncGenerator(){return Function.isAsyncGenerator(this)},get isBigArrow(){return Function.isBigArrow(this)},get isBound(){return Function.isBound(this)},get isClass(){return Function.isClass(this)},get isFunction(){return Function.isFunction(this)},get isGenerator(){return Function.isGenerator(this)}});var J=new a(Map.prototype,{getKey(r,t=!0){for(let[e,s]of this)return t&&r===s&&!t&&r==s?e:null}});var Q=new a(Set.prototype,{concat(...r){for(let t of r){if(typeof t=="string"||!Reflect.has(t,Symbol.iterator)){this.add(t);continue}for(let e of t)this.add(e)}},contains(r){for(let t of this)if(r==t)return!0;return!1},every(r,t){if(typeof r!="function")throw new TypeError(`everyFn must be a function! Received ${String(r)}`);let e=0;for(let s of this)r.call(t,s,NaN,this)&&e++;return e===this.size},find(r,t){if(typeof r!="function")throw new TypeError(`findFn must be a function! Received ${String(r)}`);for(let e of this)if(r.call(t,e,NaN,this))return e},findLast(r,t){if(typeof r!="function")throw new TypeError(`findFn must be a function! Received ${String(r)}`);let e=[];for(let s of this)r.call(t,s,NaN,this)&&e.push(s);if(e.length)return e[e.length-1]},get length(){return this.size},map(r,t){if(typeof r!="function")throw new TypeError(`mapFn must be a function! Received ${String(r)}`);let e=[];for(let s of this)e.push(r.call(t,s,NaN,this));return e},reduce(r,t,e){if(typeof r!="function")throw new TypeError(`reduceFn must be a Function! Received ${String(r)}`);let s=t;for(let o of this)s=r.call(e,s,o,NaN,this);return s},some(r,t){if(typeof r!="function")throw new TypeError(`someFn must be a function! Received ${String(r)}`);for(let e of this)if(r.call(t,e,NaN,this))return!0;return!1}});var{isObject:X}=p.patches,P=new a(Reflect,{hasAll(r,...t){return Object.isObject(r)&&t.flat(1/0).map(e=>Reflect.has(r,e)).every(e=>e)},ownDescriptors(r){if(!X(r))throw new TypeError("The supplied object must be non-null and an object");let t={},e=Reflect.ownKeys(r);for(let s of e)t[s]=Object.getOwnPropertyDescriptor(s);return t},hasSome(r,...t){return X(r)&&t.flat(1/0).map(e=>Reflect.has(r,e)).some(e=>e)},entries(r){return!r||typeof r!="object"?[]:Reflect.ownKeys(r).map(t=>[t,Object.getOwnPropertyDescriptor(r,t)])},values(r){return Reflect.entries.map(([,t])=>t)}});var Z=new a(String,{isString(r){return r&&(typeof r=="string"||r instanceof String)?r.length>0:!1}});var v=new a(Symbol,{isSymbol(r){return r&&typeof r=="symbol"},isRegistered(r,t=!1){if(!Symbol.isSymbol(r)){if(t)throw new TypeError("allowOnlySymbols specified; value is not a symbol");return!1}return Symbol.keyFor(r)!==void 0},isNonRegistered(r,t=!1){return!Symbol.isRegistered(r,t)}});var _=new a(Array.prototype,{contains(r){return!!this.find(t=>t===r)},findEntry(r){let t=this.entries(),e=1;for(let s of t)if(r(s[e]))return s},get first(){return this[0]},get last(){return this[this.length-1]}});var{isObject:d,isValidKey:k}=p.patches,{hasSome:$}=P.patches,E=class r{#t=void 0;#e=void 0;constructor(t,e){if((t??e)===void 0&&(this.#t=r.enigmatic),r.isDescriptor(t)?(this.#t=t,this.#e=void 0):d(t)&&k(e)&&(this.#t=Object.getOwnPropertyDescriptor(t,e),this.#e=t),!this.isDescriptor)throw console.error("Current descriptor:",this.#t),new Error("Not a valid descriptor:",this.#t)}get isAccessor(){return r.isAccessor(this.#t)}get isData(){return r.isData(this.#t)}get isDescriptor(){return r.isDescriptor(this.#t)}get configurable(){return!!this.#t?.configurable}set configurable(t){(this.#t||{}).configurable=!!t}get enumerable(){return this.#t?.enumerable}set enumerable(t){(this.#t||{}).enumerable=t}get writable(){return this.#t?.writable}set writable(t){(this.#t||{}).writable=t}get value(){return this.#t?.value}set value(t){(this.#t||{}).value=t}get get(){return this.#t?.get}get boundGet(){return d(this.#e)?this.get?.bind(this.#e):this.get}set get(t){(this.#t||{}).get=t}get set(){return(this.#t||{}).set}get boundSet(){return d(this.#e)?this.set?.bind(this.#e):this.set}set set(t){(this.#t||{}).set=t}get hasObject(){return d(this.#e)}get object(){return this.#e}set object(t){this.#e=Object(t)}[Symbol.for("nodejs.util.inspect.custom")](t,e,s){return`Descriptor${this.isAccessor?" (Accessor)":this.isData?" (Data)":""} ${s(this.#t,{...e,depth:t})}`}static for(t,e,s=!1){return!d(t)||!k(e)||!Reflect.has(t,e)?null:s?new r(Object.getOwnPropertyDescriptor(t,e)):Object.getOwnPropertyDescriptor(t,e)}applyTo(t,e){if(!d(t)||!k(e))throw new Error("Cannot apply descriptor to non-object or invalid key");return Object.defineProperty(t,e,this.#t)}[Symbol.toPrimitive](t){switch(t){case"string":if(this.isAccessor){let e=Reflect.has(this.#t,"get")?"getter":"",s=Reflect.has(this.#t,"set")?"setter":"";return`Accessor (${e}${e&&s?", ":""}${s})`}else if(this.isData){let e=Reflect.has(this.#t,"value")?"value":"",s=Reflect.has(this.#t,"writable")?"writable":"";return`Data (${e}${e&&s?", ":""}${s})`}break;case"number":return NaN;default:return this.#t}}get[Symbol.toStringTag](){return this.constructor.name}static getData(t,e){if(!d(t)||!Reflect.has(t,e))return;let s=r.for(t,e,!0);return s.isData?s.value:null}static getAccessor(t,e){if(!d(t)||!Reflect.has(t,e))return;let s=r.for(t,e,!0);return s.isAccessor?s.get.bind(t)():null}static base(t=!1,e=!1){return{enumerable:t,configurable:e}}static accessor(t,e,{enumerable:s,configurable:o}=r.base()){return{get:t,set:e,enumerable:s,configurable:o}}static data(t,e=!0,{enumerable:s,configurable:o}=r.base()){return{value:t,enumerable:s,writable:e,configurable:o}}static isDescriptor(t){let e=[...r.SHARED_KEYS,...r.ACCESSOR_KEYS,...r.DATA_KEYS];return $(t,e)}static isData(t,e){let o=(typeof t=="object"||t instanceof Object)&&e instanceof String?r.for(t,e):t,{DATA_KEYS:n}=this,i=!1;return $(o,n)&&(i=!0),i}static isAccessor(t,e){let o=t&&e&&(typeof t=="object"||t instanceof Object)&&(e instanceof String||typeof e=="symbol")?r.for(t,e):t,{ACCESSOR_KEYS:n}=this,i=!1;return $(o,n)&&(i=!0),i}static get flexible(){return this.base(!0,!0)}static get enigmatic(){return this.base(!1,!0)}static get intrinsic(){return this.base(!1,!1)}static get transparent(){return this.base(!0,!1)}static get SHARED_KEYS(){return["configurable","enumerable"]}static get ACCESSOR_KEYS(){return["get","set"]}static get DATA_KEYS(){return["value","writable"]}},I=new l(E);var{isClass:ht,isFunction:D}=T.patches,dt=Symbol.for("nodejs.util.inspect.custom"),tt=new a(globalThis,{maskAs(r,t,e){let{prototype:s,toPrimitive:o}=GenericMask({...e,prototype:t}),n={configurable:!0,enumerable:!1},i=D(s)?s.prototype:s,c=ht(s)?s:i?.constructor;return!c&&!i?null:(Object.setPrototypeOf(r,i),Object.defineProperties(r,{valueOf:{value(){return String(o("default",r))},...n},[Symbol.toPrimitive]:{value(u){return o(u,r)},...n},[Symbol.toStringTag]:{value:c.name,...n},[Symbol.species]:{get(){return c},...n},[dt]:{...n,value(u,f,h){return h(this[Symbol.toPrimitive](),{...f,depth:u})}}}),r)},maskAsString(r,t,e){return r&&Reflect.has(r,t)?maskAs(r,StringMask(t??"value",e)):null},maskAsNumber(r,t,e){return r&&Reflect.has(r,t)?maskAs(r,NumberMask(t??"value",e)):null},GenericMask({prototype:r,targetKey:t="value",toPrimitive:e}){let s={targetKey:t,toPrimitive:e,prototype:r};return D(e)||(s.toPrimitive=(o,n)=>{let i=n[t],c=typeof i=="number"&&Number.isFinite(i)||typeof i=="string"&&!isNaN(parseFloat(i))&&isFinite(i);switch(o){case"string":return c?String(i):i??String(n);case"number":return c?Number(i):NaN;case"default":default:return c?Number(i):i}}),s},StringMask(r,t){let e={targetKey:r,toPrimitive:t,prototype:String.prototype};return D(t)||(e.toPrimitive=function(o,n){switch(o){case"default":return n[r];case"number":return parseInt(n[r],36);case"string":return String(n[r]);default:return n}}),e},NumberMask(r,t){let e={targetKey:r,toPrimitive:t,prototype:Number.prototype};return D(t)||(e.toPrimitive=function(o,n){switch(o){case"default":return n[r];case"number":return Number(n[r]);case"string":return String(n[r]);default:return n}}),e}});var F=class r extends Set{#t=!1;objectifying(t=!0){return this.objectifyValues=t,this}get objectifyValues(){return this.#t}set objectifyValues(t){this.#t=!!t}add(t){if(this.#t&&(typeof t=="number"||typeof t=="string"||typeof t=="boolean"||typeof t=="bigint")&&(t=Object(t)),typeof t=="symbol"&&Symbol.keyFor(t)!==void 0)throw new TypeError("RefSet cannot accept registered symbols as values");if(typeof t!="object"&&typeof t!="symbol")throw new TypeError("RefSet values must be objects, non-registered symbols, or objectified primitives");if(t==null)throw new TypeError("RefSet values cannot be null or undefined");super.add(new WeakRef(t))}addAll(t){if(!t||typeof t!="object"||!Reflect.has(t,Symbol.iterator))throw new TypeError("The supplied values are either falsey or non-iterable");for(let e of t)this.add(e)}clean(){for(let t of this)t.deref()||this.delete(t);return this}entries(){return Array.from(super.entries()).map(([e,s])=>[s.deref(),s.deref()]).filter(([e,s])=>!!s)}forEach(t,e){let s=this;super.forEach(function(o){let n=o.deref();n&&t.call(e,n,n,s)})}values(){let t=[];for(let e of this){let s=e.deref();s&&t.push(s)}return t}keys(){return this.values()}has(t){if(this.#t)return this.contains(t);for(let e of this.values())if(e===t)return!0;return!1}contains(t){return!!Array.from(this.values()).filter(e=>t==e).length}filter(t,e){let s=[];for(let o of this){let n=o?.deref();n&&t.call(e,n,NaN,this)&&s.push(n)}return s}find(t,e){for(let s of this){let o=s?.deref();if(o&&t.call(e,o,NaN,this))return o}}map(t,e,s,o){let n=[],i=!0,c=!0;for(let u of this){let f=u?.deref();if(f){let h=t.call(e,f,NaN,this);(i||c)&&(this.#e(h)||(i=!1,c&&(c=this.#e(Object(h))))),n.push(h)}}if(s){if(i)return new r(n).objectifying(o?this.objectifyValues:!1);if(c)return new r(n.map(u=>this.#e(u)?u:Object(u))).objectifying()}return n}get[Symbol.toStringTag](){return this.constructor.name}#e(t){return!(typeof t=="symbol"&&Symbol.keyFor(t)===void 0||typeof t!="object"&&typeof t!="symbol"||t==null)}},V=new l(F);var et=new a(WeakRef,{isValidReference(r){return!(typeof r=="symbol"&&Symbol.keyFor(r)===void 0||typeof r!="object"&&typeof r!="symbol"||r==null)}});var A=class{#t=[];constructor(t,...e){t!=null&&typeof t[Symbol.iterator]=="function"?this.#t=[...t,...e]:this.#t=[t,...e]}*[Symbol.iterator](){for(let t of this.#t)yield t}get asArray(){return this.#t}get[Symbol.toStringTag](){return this.constructor.name}static isIterable(t){return Object.prototype.toString.call(t?.[Symbol.iterator])==="[object GeneratorFunction]"}},b=class{#t=void 0;constructor(t,e){if(!t||!Reflect.has(t,Symbol.iterator))throw new TypeError("Value used to instantiate Iterator is not iterable");this.#e=t,this.#r=t[Symbol.iterator](),this.#t=typeof e=="function"?e:void 0}get asArray(){return Array.from(this.#e)}get iterable(){return this.#e}next(){let t=this.#r.next(),e=t;return e.done?{value:void 0,done:!0}:(this.#t&&typeof this.#t=="function"&&(e.value=this.#t(t.value)),{value:e.value,done:!1})}reset(){this.#r=this.#e[Symbol.iterator]()}[Symbol.iterator](){return this}get[Symbol.toStringTag](){return this.constructor.name}#e=null;#r=null},C=new l(A),M=new l(b);var{isObject:yt,isNullDefined:mt,isValidKey:bt}=p.patches,{isRegistered:gt}=v.patches,{isValidReference:rt}=et.patches,G=class r extends Map{#t=!1;constructor(...t){super(...t)}objectifying(t=!0){return this.objectifyValues=t,this}asObject(){let t={};for(let[e,s]of this){let o=bt(e)?e:String(e),n=s?.valueOf()||s;t[o]=n}return t}get objectifyValues(){return this.#t}get(t,e){let s=super.get(t);return!s||!s?.deref()?e:s?.deref()}set objectifyValues(t){this.#t=!!t}set(t,e){let s=e;if(this.#t&&(typeof s=="number"||typeof s=="string"||typeof s=="boolean"||typeof s=="bigint")&&(s=Object(s)),typeof s=="symbol"&&Symbol.keyFor(s)!==void 0)throw new TypeError("RefMap cannot accept registered symbols as values");if(typeof s!="object"&&typeof s!="symbol")throw new TypeError("RefMap values must be objects, non-registered symbols, or objectified primitives");if(s==null)throw new TypeError("RefMap values cannot be null or undefined");let o=new WeakRef(s);super.set(t,o)}setAll(t){if(!A.isIterable(t))throw new TypeError("The supplied list of entries must be an array of arrays in the format [[key1, value1], [key2, value2], ...].");let e=s=>{let[o,n]=s;!o||!yt(n)||!gt(n)||this.set(o,n)};for(let s of t)e(s);return this}clean(){for(let[t,e]of this)e||this.delete(t);return this}entries(){let t=super.entries();return new b(t,s=>{if(s){let[o,n]=s,i=n?.deref();return[o,i]}return s})}forEach(t,e){for(let[s,o]of super.entries()){let n=o?.deref();n&&t.call(e,n,s,this)}}values(){return new b(super.values(),function(e){return e?.deref()||e})}hasValue(t,e=!0){if(mt(t))return!1;this.#t&&(e=!1);for(let[s,o]of this)if(e&&t===o||!e&&t==o)return!0;return!1}filter(t,e){let s=[];for(let[o,n]of this)t.call(e,n,o,this)&&s.push([o,n]);return s}find(t,e){for(let[s,o]of this){let n=super.get(s),i=t.call(e,n,s,map);if(i||(i=t.call(e,o,s,map)),i)return o}return null}map(t,e,s,o){if(typeof t!="function")throw new TypeError("mapFn must be a function! Received",t);let n=[],i=[],c=o&&this.objectifyValues,u=o===void 0,f=c;for(let[h,U]of this){let[,j]=[0,1],g=t.call(e,[h,U],h,this);rt(g[j])||rt(Object(g[j]))&&(c=!0,u&&!f&&(f=!0,g[j]=Object(g[j]))),n.push(g)}return s?new r(n).objectifying(f):n}*[Symbol.iterator](){for(let[t,e]of this.entries())yield[t,e]}get[Symbol.toStringTag](){return this.constructor.name}},K=new l(G);var B=class{#t=[];constructor(t,...e){t!=null&&typeof t[Symbol.iterator]=="function"?this.#t=[...t,...e]:this.#t=[t,...e]}async*[Symbol.asyncIterator](){for(let t of this.#t)yield Promise.resolve(t)}get[Symbol.toStringTag](){return this.constructor.name}static isAsyncIterable(t){return Object.prototype.toString.call(t?.[Symbol.asyncIterator])==="[object AsyncGeneratorFunction]"}},W=class{constructor(t){if(!t||!Reflect.has(t,Symbol.asyncIterator))throw new TypeError("Value used to instantiate AsyncIterator is not an async iterable");this.#t=t,this.#e=t[Symbol.asyncIterator]()}async asArray(){let t=[];for await(let e of this)t.push(e);return t}get asyncIterable(){return this.#t}async next(){let t=await this.#e.next();return t.done?{value:void 0,done:!0}:{value:t.value,done:!1}}async reset(){this.#e=this.#t[Symbol.asyncIterator]()}[Symbol.asyncIterator](){return this}get[Symbol.toStringTag](){return this.constructor.name}#t=null;#e=null},Y=new l(B),L=new l(W);var R=new Map([[Object,p],[Function,T],[Reflect,P],[String,Z],[Symbol,v],[Object.prototype,q],[Function.prototype,H],[Array.prototype,_],[Map.prototype,J],[Set.prototype,Q],[globalThis,tt]]),O={[I.key]:I,[Y.key]:Y,[L.key]:L,[C.key]:C,[M.key]:M,[V.key]:V,[K.key]:K},y={};Object.assign(y,{enableAll(){y.enablePatches(),y.enableExtensions()},enablePatches(){R.forEach(r=>{r.apply()})},enableExtensions(){Object.values(O).forEach(r=>{r.apply()})},disableAll(r){y.disablePatches(),y.disableExtensions()},disablePatches(){R.forEach(r=>{r.revert()})},disableExtensions(){Object.values(O).forEach(r=>{r.revert()})}});var st=[...Array.from(R.values()),...Array.from(Object.values(O))].reduce((e,s)=>(Reflect.ownKeys(s.patchEntries).reduce((o,n)=>{let i=s.patchEntries[n];return i.isAccessor?e[n]=new E(i.descriptor):e[n]=i.computed,e},e),e),{}),wt={...y,extensions:O,patches:R,all:st},St=wt;return ft(xt);})();
//# sourceMappingURL=basic-extensions.bundle.1.7.0.js.map