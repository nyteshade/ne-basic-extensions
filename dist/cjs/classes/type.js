"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeExtensions = exports.Type = void 0;
const extension_1 = require("@nejs/extension");
const introspector_js_1 = require("./introspector.js");
class Type {
    mapped = new Map(Type.mapped.entries());
    of(value) { return Type.of(value); }
    class(value) { return Type.class(value); }
    isPrimitive(value) { return Type.isPrimitive(value); }
    static is(value, ofType) {
        const name = Type.of(value);
        return name === Type.name(ofType);
    }
    static of(value) {
        return typeof value;
    }
    static named(value) {
        const tag = / (.*?)\]/.exec(Object.prototype.toString.call(value))?.[1];
        const name = (value?.[Symbol.toStringTag] ??
            tag ??
            (value instanceof Function ? value.name : undefined) ??
            Type.mapped.get(typeof value).name);
        return name;
    }
    static class(value, mapped) {
        mapped = mapped ?? Type.mapped;
        const name = (value?.[Symbol.toStringTag] ??
            (value instanceof Function ? value.name : undefined) ??
            typeof value);
        const type = mapped.has(name)
            ? Type.mapped.get(name)
            : value?.constructor;
        if (Type.of(type) === 'function' && !mapped.has(name) && this !== Type) {
            mapped.set(name, type);
            mapped.set(type, name);
        }
        return !type ? mapped.get(typeof value) : type;
    }
    static isPrimitive(value) {
        return new Set([...Type.primitives]).has(typeof value);
    }
    static get primitives() {
        return function* () {
            yield 'bigint';
            yield 'boolean';
            yield 'number';
            yield 'string';
            yield 'symbol';
            yield 'undefined';
        };
    }
    static get typeOfTypes() {
        return function* () {
            yield 'bigint';
            yield 'boolean';
            yield 'function';
            yield 'number';
            yield 'object';
            yield 'string';
            yield 'symbol';
            yield 'undefined';
        };
    }
    static mapped = new Map([
        ['bigint', BigInt],
        ['boolean', Boolean],
        ['function', Function],
        ['number', Number],
        ['object', Object],
        ['string', String],
        ['symbol', Symbol],
        ['undefined', undefined],
        [BigInt, 'bigint'],
        [Boolean, 'boolean'],
        [Function, 'function'],
        [Number, 'number'],
        [Object, 'object'],
        [String, 'string'],
        [Symbol, 'symbol'],
        [BigInt.name, BigInt],
        [Boolean.name, Boolean],
        [Function.name, Function],
        [Number.name, Number],
        [Object.name, Object],
        [String.name, String],
        [Symbol.name, Symbol],
        [undefined, 'undefined'],
    ]);
    serverJs = {
        nodejs: {
            'v21.1.0': {
                version: 'v21.1.0',
                date: new Date('2024-04-21T15:58:12.490Z'),
                classes: introspector_js_1.Introspector.addExpansion([
                    'AbortController', 'AbortSignal', 'AggregateError', 'Array',
                    'ArrayBuffer', 'BigInt', 'BigInt64Array', 'BigUint64Array', 'Blob',
                    'Boolean', 'BroadcastChannel', 'Buffer', 'ByteLengthQueuingStrategy',
                    'CompressionStream', 'CountQueuingStrategy', 'Crypto', 'CryptoKey',
                    'CustomEvent', 'DataView', 'Date', 'DecompressionStream', 'DOMException',
                    'Error', 'EvalError', 'Event', 'EventTarget', 'File',
                    'FinalizationRegistry', 'Float32Array', 'Float64Array', 'FormData',
                    'Function', 'Headers', 'Int16Array', 'Int32Array', 'Int8Array', 'Map',
                    'MessageChannel', 'MessageEvent', 'MessagePort', 'Navigator', 'Number',
                    'Object', 'Performance', 'PerformanceEntry', 'PerformanceMark',
                    'PerformanceMeasure', 'PerformanceObserver',
                    'PerformanceObserverEntryList', 'PerformanceResourceTiming', 'Promise',
                    'Proxy', 'RangeError', 'ReadableByteStreamController', 'ReadableStream',
                    'ReadableStreamBYOBReader', 'ReadableStreamBYOBRequest',
                    'ReadableStreamDefaultController', 'ReadableStreamDefaultReader',
                    'ReferenceError', 'RegExp', 'Request', 'Response', 'Set',
                    'SharedArrayBuffer', 'String', 'SubtleCrypto', 'Symbol', 'SyntaxError',
                    'TextDecoder', 'TextDecoderStream', 'TextEncoder', 'TextEncoderStream',
                    'TransformStream', 'TransformStreamDefaultController', 'TypeError',
                    'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray',
                    'URIError', 'URL', 'URLSearchParams', 'WeakMap', 'WeakRef', 'WeakSet',
                    'WritableStream', 'WritableStreamDefaultController',
                    'WritableStreamDefaultWriter'
                ]),
                nodeSpecificClasses: introspector_js_1.Introspector.addExpansion([
                    'Buffer', 'CryptoKey', 'SharedArrayBuffer', 'SubtleCrypto',
                ]),
                functions: introspector_js_1.Introspector.addExpansion([
                    'assert', 'atob', 'btoa', 'clearImmediate', 'clearInterval',
                    'clearTimeout', 'decodeURI', 'decodeURIComponent', 'encodeURI',
                    'encodeURIComponent', 'escape', 'eval', 'events', 'fetch', 'isFinite',
                    'isNaN', 'parseFloat', 'parseInt', 'queueMicrotask', 'require',
                    'setImmediate', 'setInterval', 'setTimeout', 'stream', 'structuredClone',
                    'unescape',
                ]),
                objects: introspector_js_1.Introspector.addExpansion([
                    'Atomics', 'Intl', 'JSON', 'Math', 'Reflect', 'WebAssembly',
                    '_', '_error', 'async_hooks', 'buffer', 'child_process', 'cluster',
                    'console', 'constants', 'crypto', 'dgram', 'diagnostics_channel', 'dns',
                    'domain', 'fs', 'global', 'globalThis', 'http', 'http2',
                    'https', 'inspector', 'module', 'navigator', 'net', 'os',
                    'path', 'perf_hooks', 'performance', 'process', 'punycode', 'querystring',
                    'readline', 'repl', 'string_decoder', 'sys', 'timers', 'tls',
                    'trace_events', 'tty', 'url', 'util', 'v8', 'vm',
                    'wasi', 'worker_threads', 'zlib'
                ]),
                properties: introspector_js_1.Introspector.addExpansion(['Infinity', 'NaN', 'undefined']),
                symbols: introspector_js_1.Introspector.addExpansion([Symbol.toStringTag])
            },
        },
        qjs: {
            'v': {
                version: 'v',
                classes: introspector_js_1.Introspector.addExpansion([
                    'AggregateError', 'Array', 'ArrayBuffer', 'BigInt', 'BigInt64Array',
                    'BigUint64Array', 'Boolean', 'DataView', 'Date', 'Error', 'EvalError',
                    'Float32Array', 'Float64Array', 'Function', 'Int16Array', 'Int32Array',
                    'Int8Array', 'InternalError', 'Map', 'Number', 'Object', 'Promise',
                    'Proxy', 'RangeError', 'ReferenceError', 'RegExp', 'Set',
                    'SharedArrayBuffer', 'String', 'Symbol', 'SyntaxError', 'TypeError',
                    'URIError', 'Uint16Array', 'Uint32Array', 'Uint8Array',
                    'Uint8ClampedArray', 'WeakMap', 'WeakSet',
                ]),
                functions: introspector_js_1.Introspector.addExpansion([
                    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',
                    'escape', 'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt',
                    'print', 'unescape'
                ]),
                objects: introspector_js_1.Introspector.addExpansion([
                    'Atomics', 'JSON', 'Math', 'Reflect', '_', 'console',
                    'globalThis', 'os', 'scriptArgs', 'std',
                ]),
                properties: introspector_js_1.Introspector.addExpansion([
                    'Infinity', 'NaN', 'undefined'
                ]),
                symbols: introspector_js_1.Introspector.addExpansion([]),
            }
        }
    };
    browser = {
        arc: {
            version: 'Version 1.39.0 (48951)',
            userAgent: [
                'Mozilla/5.0',
                '(Macintosh; Intel Mac OS X 10_15_7)',
                'AppleWebKit/537.36',
                '(KHTML, like Gecko)',
                'Chrome/124.0.0.0',
                'Safari/537.36'
            ].join(' '),
            types: {
                classes: introspector_js_1.Introspector.addExpansion([
                    'AbortController', 'AbortSignal', 'AggregateError', 'Array',
                    'ArrayBuffer', 'BigInt', 'BigInt64Array', 'BigUint64Array', 'Blob',
                    'Boolean', 'BroadcastChannel', 'ByteLengthQueuingStrategy',
                    'CompressionStream', 'CountQueuingStrategy', 'Crypto', 'CustomEvent',
                    'DOMException', 'DataView', 'Date', 'DecompressionStream', 'Error',
                    'EvalError', 'Event', 'EventTarget', 'File', 'FinalizationRegistry',
                    'Float32Array', 'Float64Array', 'FormData', 'Function', 'Headers',
                    'Int16Array', 'Int32Array', 'Int8Array', 'Map', 'MessageChannel',
                    'MessageEvent', 'MessagePort', 'Navigator', 'Number', 'Object',
                    'Performance', 'PerformanceEntry', 'PerformanceMark',
                    'PerformanceMeasure', 'PerformanceObserver',
                    'PerformanceObserverEntryList', 'PerformanceResourceTiming', 'Promise',
                    'Proxy', 'RangeError', 'ReadableByteStreamController', 'ReadableStream',
                    'ReadableStreamBYOBReader', 'ReadableStreamBYOBRequest',
                    'ReadableStreamDefaultController', 'ReadableStreamDefaultReader',
                    'ReferenceError', 'RegExp', 'Request', 'Response', 'Set', 'String',
                    'Symbol', 'SyntaxError', 'TextDecoder', 'TextDecoderStream',
                    'TextEncoder', 'TextEncoderStream', 'TransformStream',
                    'TransformStreamDefaultController', 'TypeError', 'URIError', 'URL',
                    'URLSearchParams', 'Uint16Array', 'Uint32Array', 'Uint8Array',
                    'Uint8ClampedArray', 'WeakMap', 'WeakRef', 'WeakSet', 'WritableStream',
                    'WritableStreamDefaultController', 'WritableStreamDefaultWriter'
                ]),
                browserClasses: introspector_js_1.Introspector.addExpansion([
                    "AbstractRange", "AnalyserNode", "Animation", "AnimationEffect",
                    "AnimationEvent", "AnimationPlaybackEvent", "AnimationTimeline", "Attr",
                    "Audio", "AudioBuffer", "AudioBufferSourceNode", "AudioContext",
                    "AudioData", "AudioDestinationNode", "AudioListener", "AudioNode",
                    "AudioParam", "AudioParamMap", "AudioProcessingEvent",
                    "AudioScheduledSourceNode", "AudioSinkInfo", "AudioWorkletNode",
                    "BackgroundFetchManager", "BackgroundFetchRecord",
                    "BackgroundFetchRegistration", "BarProp", "BaseAudioContext",
                    "BeforeInstallPromptEvent", "BeforeUnloadEvent", "BiquadFilterNode",
                    "BlobEvent", "BluetoothUUID", "BrowserCaptureMediaStreamTrack",
                    "CDATASection", "CSSAnimation", "CSSConditionRule", "CSSContainerRule",
                    "CSSCounterStyleRule", "CSSFontFaceRule", "CSSFontPaletteValuesRule",
                    "CSSGroupingRule", "CSSImageValue", "CSSImportRule", "CSSKeyframeRule",
                    "CSSKeyframesRule", "CSSKeywordValue", "CSSLayerBlockRule",
                    "CSSLayerStatementRule", "CSSMathClamp", "CSSMathInvert", "CSSMathMax",
                    "CSSMathMin", "CSSMathNegate", "CSSMathProduct", "CSSMathSum",
                    "CSSMathValue", "CSSMatrixComponent", "CSSMediaRule", "CSSNamespaceRule",
                    "CSSNumericArray", "CSSNumericValue", "CSSPageRule", "CSSPerspective",
                    "CSSPositionValue", "CSSPropertyRule", "CSSRotate", "CSSRule",
                    "CSSRuleList", "CSSScale", "CSSScopeRule", "CSSSkew", "CSSSkewX",
                    "CSSSkewY", "CSSStartingStyleRule", "CSSStyleDeclaration", "CSSStyleRule",
                    "CSSStyleSheet", "CSSStyleValue", "CSSSupportsRule",
                    "CSSTransformComponent", "CSSTransformValue", "CSSTransition",
                    "CSSTranslate", "CSSUnitValue", "CSSUnparsedValue",
                    "CSSVariableReferenceValue", "CanvasCaptureMediaStreamTrack",
                    "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D",
                    "ChannelMergerNode", "ChannelSplitterNode", "CharacterBoundsUpdateEvent",
                    "CharacterData", "ClipboardEvent", "CloseEvent", "Comment",
                    "CompositionEvent", "ConstantSourceNode",
                    "ContentVisibilityAutoStateChangeEvent", "ConvolverNode", "CropTarget",
                    "CustomElementRegistry", "CustomStateSet", "DOMError",
                    "DOMImplementation", "DOMMatrix", "DOMMatrixReadOnly", "DOMParser",
                    "DOMPoint", "DOMPointReadOnly", "DOMQuad", "DOMRect", "DOMRectList",
                    "DOMRectReadOnly", "DOMStringList", "DOMStringMap", "DOMTokenList",
                    "DataTransfer", "DataTransferItem", "DataTransferItemList", "DelayNode",
                    "DelegatedInkTrailPresenter", "Document", "DocumentFragment",
                    "DocumentPictureInPictureEvent", "DocumentTimeline", "DocumentType",
                    "DragEvent", "DynamicsCompressorNode", "EditContext", "Element",
                    "ElementInternals", "EncodedAudioChunk", "EncodedVideoChunk",
                    "ErrorEvent", "EventCounts", "EventSource", "External", "FeaturePolicy",
                    "FileList", "FileReader", "FocusEvent", "FontFace",
                    "FontFaceSetLoadEvent", "FormDataEvent", "FragmentDirective", "GainNode",
                    "Gamepad", "GamepadButton", "GamepadEvent", "GamepadHapticActuator",
                    "Geolocation", "GeolocationCoordinates", "GeolocationPosition",
                    "GeolocationPositionError", "HTMLAllCollection", "HTMLAnchorElement",
                    "HTMLAreaElement", "HTMLAudioElement", "HTMLBRElement", "HTMLBaseElement",
                    "HTMLBodyElement", "HTMLButtonElement", "HTMLCanvasElement",
                    "HTMLCollection", "HTMLDListElement", "HTMLDataElement",
                    "HTMLDataListElement", "HTMLDetailsElement", "HTMLDialogElement",
                    "HTMLDirectoryElement", "HTMLDivElement", "HTMLDocument", "HTMLElement",
                    "HTMLEmbedElement", "HTMLFieldSetElement", "HTMLFontElement",
                    "HTMLFormControlsCollection", "HTMLFormElement", "HTMLFrameElement",
                    "HTMLFrameSetElement", "HTMLHRElement", "HTMLHeadElement",
                    "HTMLHeadingElement", "HTMLHtmlElement", "HTMLIFrameElement",
                    "HTMLImageElement", "HTMLInputElement", "HTMLLIElement",
                    "HTMLLabelElement", "HTMLLegendElement", "HTMLLinkElement",
                    "HTMLMapElement", "HTMLMarqueeElement", "HTMLMediaElement",
                    "HTMLMenuElement", "HTMLMetaElement", "HTMLMeterElement",
                    "HTMLModElement", "HTMLOListElement", "HTMLObjectElement",
                    "HTMLOptGroupElement", "HTMLOptionElement", "HTMLOptionsCollection",
                    "HTMLOutputElement", "HTMLParagraphElement", "HTMLParamElement",
                    "HTMLPictureElement", "HTMLPreElement", "HTMLProgressElement",
                    "HTMLQuoteElement", "HTMLScriptElement", "HTMLSelectElement",
                    "HTMLSlotElement", "HTMLSourceElement", "HTMLSpanElement",
                    "HTMLStyleElement", "HTMLTableCaptionElement", "HTMLTableCellElement",
                    "HTMLTableColElement", "HTMLTableElement", "HTMLTableRowElement",
                    "HTMLTableSectionElement", "HTMLTemplateElement", "HTMLTextAreaElement",
                    "HTMLTimeElement", "HTMLTitleElement", "HTMLTrackElement",
                    "HTMLUListElement", "HTMLUnknownElement", "HTMLVideoElement",
                    "HashChangeEvent", "Highlight", "HighlightRegistry", "History",
                    "IDBCursor", "IDBCursorWithValue", "IDBDatabase", "IDBFactory",
                    "IDBIndex", "IDBKeyRange", "IDBObjectStore", "IDBOpenDBRequest",
                    "IDBRequest", "IDBTransaction", "IDBVersionChangeEvent", "IIRFilterNode",
                    "IdleDeadline", "Image", "ImageBitmap", "ImageBitmapRenderingContext",
                    "ImageCapture", "ImageData", "ImageTrack", "ImageTrackList", "Ink",
                    "InputDeviceCapabilities", "InputDeviceInfo", "InputEvent",
                    "IntersectionObserver", "IntersectionObserverEntry", "Iterator",
                    "KeyboardEvent", "KeyframeEffect", "LargestContentfulPaint",
                    "LaunchParams", "LaunchQueue", "LayoutShift", "LayoutShiftAttribution",
                    "Location", "MathMLElement", "MediaCapabilities",
                    "MediaElementAudioSourceNode", "MediaEncryptedEvent", "MediaError",
                    "MediaList", "MediaMetadata", "MediaQueryList", "MediaQueryListEvent",
                    "MediaRecorder", "MediaSession", "MediaSource", "MediaSourceHandle",
                    "MediaStream", "MediaStreamAudioDestinationNode",
                    "MediaStreamAudioSourceNode", "MediaStreamEvent", "MediaStreamTrack",
                    "MediaStreamTrackEvent", "MediaStreamTrackGenerator",
                    "MediaStreamTrackProcessor", "MediaStreamTrackVideoStats", "MimeType",
                    "MimeTypeArray", "MouseEvent", "MutationEvent", "MutationObserver",
                    "MutationRecord", "NamedNodeMap", "NavigateEvent", "Navigation",
                    "NavigationActivation", "NavigationCurrentEntryChangeEvent",
                    "NavigationDestination", "NavigationHistoryEntry", "NavigationTransition",
                    "NavigatorUAData", "NetworkInformation", "Node", "NodeFilter",
                    "NodeIterator", "NodeList", "Notification",
                    "OfflineAudioCompletionEvent", "OfflineAudioContext", "OffscreenCanvas",
                    "OffscreenCanvasRenderingContext2D", "Option", "OscillatorNode",
                    "OverconstrainedError", "PageRevealEvent", "PageSwapEvent",
                    "PageTransitionEvent", "PannerNode", "Path2D",
                    "PerformanceElementTiming", "PerformanceEventTiming",
                    "PerformanceLongAnimationFrameTiming", "PerformanceLongTaskTiming",
                    "PerformanceNavigation", "PerformanceNavigationTiming",
                    "PerformancePaintTiming", "PerformanceScriptTiming",
                    "PerformanceServerTiming", "PerformanceTiming", "PeriodicSyncManager",
                    "PeriodicWave", "PermissionStatus", "Permissions",
                    "PictureInPictureEvent", "PictureInPictureWindow", "Plugin",
                    "PluginArray", "PointerEvent", "PopStateEvent",
                    "ProcessingInstruction", "Profiler", "ProgressEvent",
                    "PromiseRejectionEvent", "PushManager", "PushSubscription",
                    "PushSubscriptionOptions", "RTCCertificate", "RTCDTMFSender",
                    "RTCDTMFToneChangeEvent", "RTCDataChannel", "RTCDataChannelEvent",
                    "RTCDtlsTransport", "RTCEncodedAudioFrame", "RTCEncodedVideoFrame",
                    "RTCError", "RTCErrorEvent", "RTCIceCandidate", "RTCIceTransport",
                    "RTCPeerConnection", "RTCPeerConnectionIceErrorEvent",
                    "RTCPeerConnectionIceEvent", "RTCRtpReceiver", "RTCRtpSender",
                    "RTCRtpTransceiver", "RTCSctpTransport", "RTCSessionDescription",
                    "RTCStatsReport", "RTCTrackEvent", "RadioNodeList", "Range",
                    "RemotePlayback", "ReportingObserver", "ResizeObserver",
                    "ResizeObserverEntry", "ResizeObserverSize", "SVGAElement", "SVGAngle",
                    "SVGAnimateElement", "SVGAnimateMotionElement",
                    "SVGAnimateTransformElement", "SVGAnimatedAngle", "SVGAnimatedBoolean",
                    "SVGAnimatedEnumeration", "SVGAnimatedInteger", "SVGAnimatedLength",
                    "SVGAnimatedLengthList", "SVGAnimatedNumber", "SVGAnimatedNumberList",
                    "SVGAnimatedPreserveAspectRatio", "SVGAnimatedRect",
                    "SVGAnimatedString", "SVGAnimatedTransformList", "SVGAnimationElement",
                    "SVGCircleElement", "SVGClipPathElement",
                    "SVGComponentTransferFunctionElement", "SVGDefsElement", "SVGDescElement",
                    "SVGElement", "SVGEllipseElement", "SVGFEBlendElement",
                    "SVGFEColorMatrixElement", "SVGFEComponentTransferElement",
                    "SVGFECompositeElement", "SVGFEConvolveMatrixElement",
                    "SVGFEDiffuseLightingElement", "SVGFEDisplacementMapElement",
                    "SVGFEDistantLightElement", "SVGFEDropShadowElement", "SVGFEFloodElement",
                    "SVGFEFuncAElement", "SVGFEFuncBElement", "SVGFEFuncGElement",
                    "SVGFEFuncRElement", "SVGFEGaussianBlurElement", "SVGFEImageElement",
                    "SVGFEMergeElement", "SVGFEMergeNodeElement", "SVGFEMorphologyElement",
                    "SVGFEOffsetElement", "SVGFEPointLightElement",
                    "SVGFESpecularLightingElement", "SVGFESpotLightElement",
                    "SVGFETileElement", "SVGFETurbulenceElement", "SVGFilterElement",
                    "SVGForeignObjectElement", "SVGGElement", "SVGGeometryElement",
                    "SVGGradientElement", "SVGGraphicsElement", "SVGImageElement",
                    "SVGLength", "SVGLengthList", "SVGLineElement",
                    "SVGLinearGradientElement", "SVGMPathElement", "SVGMarkerElement",
                    "SVGMaskElement", "SVGMatrix", "SVGMetadataElement", "SVGNumber",
                    "SVGNumberList", "SVGPathElement", "SVGPatternElement", "SVGPoint",
                    "SVGPointList", "SVGPolygonElement", "SVGPolylineElement",
                    "SVGPreserveAspectRatio", "SVGRadialGradientElement", "SVGRect",
                    "SVGRectElement", "SVGSVGElement", "SVGScriptElement", "SVGSetElement",
                    "SVGStopElement", "SVGStringList", "SVGStyleElement", "SVGSwitchElement",
                    "SVGSymbolElement", "SVGTSpanElement", "SVGTextContentElement",
                    "SVGTextElement", "SVGTextPathElement", "SVGTextPositioningElement",
                    "SVGTitleElement", "SVGTransform", "SVGTransformList", "SVGUnitTypes",
                    "SVGUseElement", "SVGViewElement", "Scheduler", "Scheduling", "Screen",
                    "ScreenOrientation", "ScriptProcessorNode", "ScrollTimeline",
                    "SecurityPolicyViolationEvent", "Selection", "ShadowRoot",
                    "SharedWorker", "SourceBuffer", "SourceBufferList", "SpeechSynthesis",
                    "SpeechSynthesisErrorEvent", "SpeechSynthesisEvent",
                    "SpeechSynthesisUtterance", "SpeechSynthesisVoice", "StaticRange",
                    "StereoPannerNode", "Storage", "StorageEvent", "StylePropertyMap",
                    "StylePropertyMapReadOnly", "StyleSheet", "StyleSheetList",
                    "SubmitEvent", "SyncManager", "TaskAttributionTiming", "TaskController",
                    "TaskPriorityChangeEvent", "TaskSignal", "Text", "TextEvent",
                    "TextFormat", "TextFormatUpdateEvent", "TextMetrics", "TextTrack",
                    "TextTrackCue", "TextTrackCueList", "TextTrackList", "TextUpdateEvent",
                    "TimeRanges", "ToggleEvent", "Touch", "TouchEvent", "TouchList",
                    "TrackEvent", "TransitionEvent", "TreeWalker", "TrustedHTML",
                    "TrustedScript", "TrustedScriptURL", "TrustedTypePolicy",
                    "TrustedTypePolicyFactory", "UIEvent", "URLPattern", "UserActivation",
                    "VTTCue", "ValidityState", "VideoColorSpace", "VideoFrame",
                    "VideoPlaybackQuality", "ViewTimeline", "ViewTransition",
                    "VirtualKeyboardGeometryChangeEvent", "VisibilityStateEntry",
                    "VisualViewport", "WaveShaperNode", "WebGL2RenderingContext",
                    "WebGLActiveInfo", "WebGLBuffer", "WebGLContextEvent", "WebGLFramebuffer",
                    "WebGLProgram", "WebGLQuery", "WebGLRenderbuffer",
                    "WebGLRenderingContext", "WebGLSampler", "WebGLShader",
                    "WebGLShaderPrecisionFormat", "WebGLSync", "WebGLTexture",
                    "WebGLTransformFeedback", "WebGLUniformLocation",
                    "WebGLVertexArrayObject", "WebKitCSSMatrix", "WebKitMutationObserver",
                    "WebSocket", "WebSocketError", "WebSocketStream", "WheelEvent", "Window",
                    "WindowControlsOverlay", "WindowControlsOverlayGeometryChangeEvent",
                    "Worker", "XMLDocument", "XMLHttpRequest", "XMLHttpRequestEventTarget",
                    "XMLHttpRequestUpload", "XMLSerializer", "XPathEvaluator",
                    "XPathExpression", "XPathResult", "XSLTProcessor"
                ]),
            },
            methods: {
                get classes() { return addExpansion(fetcher('function', /^[A-Z]/)); },
                get functions() { },
                get objects() { },
            }
        },
        safari: {}
    };
}
exports.Type = Type;
exports.TypeExtensions = new extension_1.Extension(Type);
//# sourceMappingURL=type.js.map