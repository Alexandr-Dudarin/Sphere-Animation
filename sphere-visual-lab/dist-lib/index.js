import { useEffect as e, useMemo as t, useRef as n, useState as r } from "react";
import { Fragment as i, jsx as a, jsxs as o } from "react/jsx-runtime";
import { Canvas as s, useFrame as c, useThree as l } from "@react-three/fiber";
import * as u from "three";
import { AdditiveBlending as d, BackSide as f, CatmullRomCurve3 as p, Color as m, DoubleSide as h, Object3D as g, Vector3 as _, Vector4 as v } from "three";
var y = {
	root: "_root_18rec_1",
	darkBackground: "_darkBackground_18rec_10",
	stage: "_stage_18rec_21"
}, b = {
	size: 420,
	mode: "thinking",
	preset: "glass-petal",
	quality: "high",
	interactive: !0,
	glowIntensity: "high",
	speed: 1.1,
	background: "dark"
}, x = {
	"glass-petal": {
		coreRgb: "22 46 132",
		accentRgb: "88 194 255",
		haloRgb: "188 242 255",
		ringRgb: "108 150 255",
		violetRgb: "136 116 255",
		pinkRgb: "228 144 255",
		mintRgb: "126 255 229",
		whiteRgb: "255 255 255",
		noiseOpacity: .1,
		shellOpacity: 1.02,
		innerVolumeStrength: .92,
		echoStrength: .82,
		centerStrength: .86,
		scatterStrength: .88,
		pulseStrength: .84
	},
	"soft-ai": {
		coreRgb: "27 55 158",
		accentRgb: "68 181 255",
		haloRgb: "173 244 255",
		ringRgb: "91 143 255",
		violetRgb: "128 104 255",
		pinkRgb: "232 118 255",
		mintRgb: "108 255 223",
		whiteRgb: "255 255 255",
		noiseOpacity: .1,
		shellOpacity: .96,
		innerVolumeStrength: 1,
		echoStrength: .96,
		centerStrength: .98,
		scatterStrength: 1,
		pulseStrength: .94
	},
	"thinking-blue": {
		coreRgb: "20 44 176",
		accentRgb: "53 162 255",
		haloRgb: "137 238 255",
		ringRgb: "64 108 255",
		violetRgb: "112 126 255",
		pinkRgb: "198 150 255",
		mintRgb: "112 246 230",
		whiteRgb: "255 255 255",
		noiseOpacity: .12,
		shellOpacity: .9,
		innerVolumeStrength: .82,
		echoStrength: .76,
		centerStrength: .88,
		scatterStrength: .94,
		pulseStrength: .8
	},
	"searching-violet": {
		coreRgb: "52 47 168",
		accentRgb: "122 90 255",
		haloRgb: "198 175 255",
		ringRgb: "89 132 255",
		violetRgb: "158 122 255",
		pinkRgb: "255 96 184",
		mintRgb: "124 255 224",
		whiteRgb: "255 255 255",
		noiseOpacity: .14,
		shellOpacity: 1.08,
		innerVolumeStrength: 1.08,
		echoStrength: 1.08,
		centerStrength: 1.08,
		scatterStrength: 1.12,
		pulseStrength: 1.08
	},
	"calm-pearl": {
		coreRgb: "42 54 122",
		accentRgb: "145 196 255",
		haloRgb: "214 239 255",
		ringRgb: "167 180 255",
		violetRgb: "184 170 255",
		pinkRgb: "243 196 255",
		mintRgb: "190 255 241",
		whiteRgb: "255 252 255",
		noiseOpacity: .08,
		shellOpacity: .78,
		innerVolumeStrength: .68,
		echoStrength: .58,
		centerStrength: .74,
		scatterStrength: .7,
		pulseStrength: .62
	},
	"neon-core": {
		coreRgb: "18 32 118",
		accentRgb: "53 214 255",
		haloRgb: "157 248 255",
		ringRgb: "72 132 255",
		violetRgb: "121 98 255",
		pinkRgb: "255 74 202",
		mintRgb: "82 255 228",
		whiteRgb: "255 255 255",
		noiseOpacity: .13,
		shellOpacity: 1.12,
		innerVolumeStrength: 1.14,
		echoStrength: 1.2,
		centerStrength: 1.16,
		scatterStrength: 1.16,
		pulseStrength: 1.18
	},
	"bio-glow": {
		coreRgb: "20 72 88",
		accentRgb: "76 218 206",
		haloRgb: "185 255 240",
		ringRgb: "92 180 170",
		violetRgb: "126 152 255",
		pinkRgb: "205 170 255",
		mintRgb: "92 255 215",
		whiteRgb: "245 255 252",
		noiseOpacity: .09,
		shellOpacity: .88,
		innerVolumeStrength: 1.16,
		echoStrength: .78,
		centerStrength: .92,
		scatterStrength: .84,
		pulseStrength: .72
	},
	"prism-bloom": {
		coreRgb: "40 44 150",
		accentRgb: "255 188 102",
		haloRgb: "176 236 255",
		ringRgb: "124 130 255",
		violetRgb: "146 108 255",
		pinkRgb: "255 88 204",
		mintRgb: "106 255 172",
		whiteRgb: "255 250 255",
		noiseOpacity: .15,
		shellOpacity: 1.24,
		innerVolumeStrength: 1.4,
		echoStrength: 1.26,
		centerStrength: 1.2,
		scatterStrength: 1.18,
		pulseStrength: 1.14
	}
};
//#endregion
//#region src/components/SphereVisual/hooks/useReducedMotion.ts
function S() {
	let [t, n] = r(!1);
	return e(() => {
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = () => {
			n(e.matches);
		};
		return t(), typeof e.addEventListener == "function" ? (e.addEventListener("change", t), () => {
			e.removeEventListener("change", t);
		}) : (e.addListener(t), () => {
			e.removeListener(t);
		});
	}, []), t;
}
//#endregion
//#region src/components/SphereVisual/utils/lerp.ts
function C(e, t, n) {
	return e + (t - e) * n;
}
//#endregion
//#region src/components/SphereVisual/utils/normalizePointer.ts
function w(e, t, n) {
	if (n.width === 0 || n.height === 0) return {
		x: 0,
		y: 0
	};
	let r = (e - n.left) / n.width * 2 - 1, i = (t - n.top) / n.height * 2 - 1;
	return {
		x: Math.max(-1, Math.min(1, r)),
		y: Math.max(-1, Math.min(1, i))
	};
}
//#endregion
//#region src/components/SphereVisual/hooks/usePointerTracking.ts
var T = .12, E = .001, D = {
	x: 0,
	y: 0
};
function O(t) {
	let i = n(null), a = n(D), o = n(D), s = n(null), [c, l] = r(D);
	return e(() => {
		let e = i.current;
		if (!e || !t) {
			a.current = D, o.current = D, l((e) => e.x === 0 && e.y === 0 ? e : D);
			return;
		}
		let n = !1, r = () => {
			if (s.current = null, n) return;
			let e = o.current, t = a.current, i = C(e.x, t.x, T), c = C(e.y, t.y, T), u = Math.abs(t.x - i) <= E && Math.abs(t.y - c) <= E, d = u ? {
				x: t.x,
				y: t.y
			} : {
				x: i,
				y: c
			};
			o.current = d, l(d), u || (s.current = window.requestAnimationFrame(r));
		}, c = () => {
			if (n || s.current !== null) return;
			let e = o.current, t = a.current;
			Math.abs(t.x - e.x) <= E && Math.abs(t.y - e.y) <= E || (s.current = window.requestAnimationFrame(r));
		}, u = (t) => {
			let n = e.getBoundingClientRect(), r = w(t.clientX, t.clientY, n);
			a.current = {
				x: r.x,
				y: r.y
			}, c();
		}, d = () => {
			a.current = D, c();
		};
		return e.addEventListener("pointermove", u), e.addEventListener("pointerleave", d), () => {
			n = !0, e.removeEventListener("pointermove", u), e.removeEventListener("pointerleave", d), s.current !== null && (window.cancelAnimationFrame(s.current), s.current = null);
		};
	}, [t]), {
		containerRef: i,
		pointerX: c.x,
		pointerY: c.y
	};
}
var k = {
	root: "_root_17mb1_1",
	reducedMotion: "_reducedMotion_17mb1_38",
	backMist: "_backMist_17mb1_48",
	outerGlow: "_outerGlow_17mb1_49",
	vortexZone: "_vortexZone_17mb1_50",
	swirlA: "_swirlA_17mb1_51",
	swirlB: "_swirlB_17mb1_52",
	swirlC: "_swirlC_17mb1_53",
	swirlD: "_swirlD_17mb1_54",
	chromaBand: "_chromaBand_17mb1_55",
	tunnelGlow: "_tunnelGlow_17mb1_56",
	texture: "_texture_17mb1_57",
	centerEye: "_centerEye_17mb1_58",
	centerCore: "_centerCore_17mb1_59",
	glassShell: "_glassShell_17mb1_60",
	shellInner: "_shellInner_17mb1_61",
	glassHalo: "_glassHalo_17mb1_62",
	refraction: "_refraction_17mb1_63",
	frontCaustic: "_frontCaustic_17mb1_64",
	specular: "_specular_17mb1_65",
	frontRim: "_frontRim_17mb1_66",
	backMistPulse: "_backMistPulse_17mb1_1",
	outerGlowPulse: "_outerGlowPulse_17mb1_1",
	swirlSpin: "_swirlSpin_17mb1_1",
	swirlSpinReverse: "_swirlSpinReverse_17mb1_1",
	swirlBreathe: "_swirlBreathe_17mb1_1",
	microSpin: "_microSpin_17mb1_1",
	chromaPulse: "_chromaPulse_17mb1_1",
	tunnelPulse: "_tunnelPulse_17mb1_1",
	textureDrift: "_textureDrift_17mb1_1",
	eyeBreathe: "_eyeBreathe_17mb1_1",
	corePulse: "_corePulse_17mb1_1",
	shellBreathe: "_shellBreathe_17mb1_1",
	refractionShift: "_refractionShift_17mb1_1",
	causticShift: "_causticShift_17mb1_1",
	modeIdle: "_modeIdle_17mb1_479",
	modeThinking: "_modeThinking_17mb1_495",
	modeSearching: "_modeSearching_17mb1_515"
}, A = {
	idle: {
		rotationDuration: 18,
		pulseDuration: 7,
		orbitOpacity: .26,
		haloStrength: .72
	},
	thinking: {
		rotationDuration: 12,
		pulseDuration: 5,
		orbitOpacity: .42,
		haloStrength: 1
	},
	searching: {
		rotationDuration: 9,
		pulseDuration: 4,
		orbitOpacity: .52,
		haloStrength: 1.14
	}
}, j = {
	low: "16px",
	medium: "12px",
	high: "8px"
}, M = {
	low: .76,
	medium: .88,
	high: 1
}, N = {
	low: .72,
	medium: .88,
	high: 1
};
function P({ presetConfig: e, mode: t, quality: n, interactive: r, glowIntensity: i, speed: s, pointerX: c, pointerY: l, reducedMotion: u }) {
	let d = A[t], f = Math.max(s, .15);
	return /* @__PURE__ */ o("div", {
		className: [
			k.root,
			u ? k.reducedMotion : "",
			t === "idle" ? k.modeIdle : "",
			t === "thinking" ? k.modeThinking : "",
			t === "searching" ? k.modeSearching : ""
		].filter(Boolean).join(" "),
		style: {
			"--core-rgb": e.coreRgb,
			"--accent-rgb": e.accentRgb,
			"--halo-rgb": e.haloRgb,
			"--ring-rgb": e.ringRgb,
			"--noise-opacity": e.noiseOpacity,
			"--pointer-x": r ? c.toString() : "0",
			"--pointer-y": r ? l.toString() : "0",
			"--swirl-duration": `${d.rotationDuration / f}s`,
			"--counter-duration": `${d.rotationDuration * 1.45 / f}s`,
			"--micro-duration": `${d.rotationDuration * .72 / f}s`,
			"--breath-duration": `${d.pulseDuration / f}s`,
			"--detail-blur": j[n],
			"--shell-opacity": M[n].toString(),
			"--glow-alpha": Math.min(1, d.haloStrength * N[i]).toString(),
			"--flare-x": `${50 + c * 16}%`,
			"--flare-y": `${22 + l * 13}%`,
			"--violet-rgb": t === "searching" ? "156 122 255" : "132 111 255",
			"--pink-rgb": t === "searching" ? "255 97 186" : "233 116 255",
			"--mint-rgb": "108 255 223",
			"--amber-rgb": "255 196 112"
		},
		children: [
			/* @__PURE__ */ a("div", { className: k.backMist }),
			/* @__PURE__ */ a("div", { className: k.outerGlow }),
			/* @__PURE__ */ o("div", {
				className: k.vortexZone,
				children: [
					/* @__PURE__ */ a("div", { className: k.swirlA }),
					/* @__PURE__ */ a("div", { className: k.swirlB }),
					/* @__PURE__ */ a("div", { className: k.swirlC }),
					/* @__PURE__ */ a("div", { className: k.swirlD }),
					/* @__PURE__ */ a("div", { className: k.chromaBand }),
					/* @__PURE__ */ a("div", { className: k.tunnelGlow }),
					/* @__PURE__ */ a("div", { className: k.texture }),
					/* @__PURE__ */ a("div", { className: k.centerEye }),
					/* @__PURE__ */ a("div", { className: k.centerCore })
				]
			}),
			/* @__PURE__ */ a("div", { className: k.glassShell }),
			/* @__PURE__ */ a("div", { className: k.shellInner }),
			/* @__PURE__ */ a("div", { className: k.glassHalo }),
			/* @__PURE__ */ a("div", { className: k.refraction }),
			/* @__PURE__ */ a("div", { className: k.frontCaustic }),
			/* @__PURE__ */ a("div", { className: k.specular }),
			/* @__PURE__ */ a("div", { className: k.frontRim })
		]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/InnerScatterField.tsx
var ee = 440;
function F(e = "medium") {
	if (typeof e == "number") return u.MathUtils.clamp(e, .5, 2);
	switch (e) {
		case "low": return .82;
		case "high": return 1.28;
		default: return 1;
	}
}
function te() {
	let e = document.createElement("canvas");
	e.width = 64, e.height = 64;
	let t = e.getContext("2d");
	if (!t) return new u.Texture();
	let n = t.createRadialGradient(64 * .5, 64 * .5, 0, 64 * .5, 64 * .5, 64 * .5);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.22, "rgba(255,255,255,0.9)"), n.addColorStop(.52, "rgba(255,255,255,0.28)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 64, 64), t.fillStyle = n, t.fillRect(0, 0, 64, 64);
	let r = new u.CanvasTexture(e);
	return r.needsUpdate = !0, r;
}
function I(e, t, n, r) {
	let i = t * 3, a = r * n.speed, o = (1 - n.radius) ** 1.25, s = n.angle + a + n.radius * 5.6 + o * n.twist * 1.9 + Math.sin(a * .8 + n.phase) * .12, c = .92 + .05 * Math.sin(r * .75 + n.phase) + .025 * Math.cos(r * 1.1 + n.phase * .85), l = n.radius * c, u = o * .12, d = .012 * n.drift * Math.sin(s * 1.7 + n.phase) + .008 * n.drift * Math.cos(s * 2.1 - n.phase), f = Math.cos(s) * l * .84 + Math.cos(s * 2 + n.phase) * d - Math.cos(s) * u * .32, p = Math.sin(s) * l * .8 + Math.sin(s * 1.6 + n.phase) * d - Math.sin(s) * u * .26, m = n.depth * .06 + Math.sin(s * 1.18 + n.phase) * .013 + Math.cos(r * .62 + n.phase) * .006;
	e[i] = f, e[i + 1] = p, e[i + 2] = m;
}
function L({ speed: r = 1, reducedMotion: i = !1, glowIntensity: o = "medium", colors: s, scatterStrength: l }) {
	let d = n(null), f = F(o), p = u.MathUtils.clamp(l, .45, 1.7), m = Math.max(220, Math.round(ee * (.7 + p * .35))), { geometry: h, material: g, spriteTexture: _, positions: v, seeds: y } = t(() => {
		let e = te(), t = new Float32Array(m * 3), n = new Float32Array(m * 3), r = [];
		for (let e = 0; e < m; e += 1) {
			let i = .045 + Math.random() ** 1.65 * .76, a = {
				radius: i,
				angle: Math.random() * Math.PI * 2,
				phase: Math.random() * Math.PI * 2,
				speed: u.MathUtils.randFloat(.18, .34),
				drift: u.MathUtils.randFloat(.55, 1.1),
				depth: u.MathUtils.randFloatSpread(1),
				twist: u.MathUtils.randFloat(.85, 1.35)
			};
			r.push(a), I(t, e, a, 0);
			let o = s.halo.clone().lerp(s.mint, .35 + i * .2), c = s.violet.clone().lerp(s.pink, .35 + (1 - i) * .4), l = o.lerp(c, .22 + (1 - i) * .42).lerp(s.white, (1 - i) * .08), d = e * 3;
			n[d] = l.r, n[d + 1] = l.g, n[d + 2] = l.b;
		}
		let i = new u.BufferGeometry();
		return i.setAttribute("position", new u.BufferAttribute(t, 3)), i.setAttribute("color", new u.BufferAttribute(n, 3)), {
			geometry: i,
			material: new u.PointsMaterial({
				size: .026 * f * Math.sqrt(p),
				map: e,
				transparent: !0,
				opacity: .34 * f * p,
				vertexColors: !0,
				depthWrite: !1,
				blending: u.AdditiveBlending,
				sizeAttenuation: !0,
				alphaTest: .01
			}),
			spriteTexture: e,
			positions: t,
			seeds: r
		};
	}, [
		s,
		f,
		p,
		m
	]);
	return e(() => () => {
		h.dispose(), g.dispose(), _.dispose();
	}, [
		h,
		g,
		_
	]), c((e) => {
		let t = i ? .22 : 1, n = e.clock.getElapsedTime() * r * t;
		for (let e = 0; e < y.length; e += 1) I(v, e, y[e], n);
		h.attributes.position.needsUpdate = !0, d.current && (d.current.rotation.z = Math.sin(n * .26) * .045, d.current.rotation.x = Math.cos(n * .22) * .018, d.current.rotation.y = Math.sin(n * .16) * .026);
	}), /* @__PURE__ */ a("group", {
		ref: d,
		position: [
			0,
			0,
			-.03
		],
		children: /* @__PURE__ */ a("points", {
			geometry: h,
			frustumCulled: !1,
			children: /* @__PURE__ */ a("primitive", {
				object: g,
				attach: "material"
			})
		})
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/PetalField.tsx
var ne = new u.Vector3(0, 0, 1);
function re(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.22;
		default: return 1;
	}
}
function R(e, t, n, r, i = 0, a = 0) {
	let o = new u.Vector3(0, 0, i), s = new u.Vector3(0, e, i + a), c = new u.CubicBezierCurve3(o, new u.Vector3(t * 1.02, e * .18, i + a * .15), new u.Vector3(t * .92, e * .78, i + a * .8), s), l = new u.CubicBezierCurve3(s, new u.Vector3(-t * .92, e * .78, i + a * .8), new u.Vector3(-t * 1.02, e * .18, i + a * .15), o), d = [...c.getPoints(42), ...l.getPoints(42).slice(1)].map((e) => e.clone().applyAxisAngle(ne, n)), f = new u.CatmullRomCurve3(d, !1, "catmullrom", .45);
	return new u.TubeGeometry(f, 120, r, 12, !1);
}
function z(e, t, n, r, i, a, o, s, c = 0, l = 0) {
	return Array.from({ length: e }, (u, d) => {
		let f = d / e * Math.PI * 2 + r;
		return {
			wash: R(t, n, f, s, c, l),
			glow: R(t, n, f, o, c, l),
			mid: R(t, n, f, a, c, l),
			core: R(t, n, f, i, c, l)
		};
	});
}
function B(e, t, n, r, i) {
	return e.clone().lerp(t, r).lerp(n, i);
}
function ie(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 2.1) + 1) * .5;
	return {
		wash: B(n.halo, n.mint, n.violet, .18 + i * .18, .08 + a * .12),
		glow: B(n.violet, n.pink, n.mint, .18 + i * .28, .08 + a * .16),
		mid: B(n.mint, n.halo, n.violet, .28 + i * .18, .08 + a * .1),
		core: B(n.white, n.mint, n.violet, .2 + i * .16, .04 + a * .06)
	};
}
function ae(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + .7) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 3) + 1) * .5;
	return {
		wash: B(n.halo, n.violet, n.mint, .12 + i * .16, .06 + a * .08),
		glow: B(n.violet, n.pink, n.halo, .24 + i * .2, .1 + a * .08),
		mid: B(n.violet, n.pink, n.mint, .22 + i * .16, .06 + a * .12),
		core: B(n.white, n.violet, n.mint, .14 + i * .12, .04 + a * .08)
	};
}
function oe(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + 1.4) + 1) * .5;
	return {
		wash: n.halo.clone().lerp(n.violet, .12 + i * .08),
		glow: n.pink.clone().lerp(n.violet, .18 + i * .12),
		mid: n.mint.clone().lerp(n.violet, .16 + i * .12),
		core: n.white.clone().lerp(n.mint, .12 + i * .08)
	};
}
function se({ speed: e, reducedMotion: r, glowIntensity: i, colors: s }) {
	let l = n(null), d = n(null), f = n(null), p = n(null), m = n(null), h = re(i), g = t(() => z(8, .9, .19, 0, .0054, .0134, .025, .043, .008, .024), []), _ = t(() => z(8, .64, .132, Math.PI / 8, .0044, .0108, .0195, .032, .016, .013), []), v = t(() => z(8, .36, .07, 0, .003, .0068, .011, .017, .022, .006), []), y = t(() => s.white.clone().lerp(s.mint, .28), [s]), b = t(() => s.white.clone().lerp(s.pink, .1), [s]), x = t(() => s.halo.clone().lerp(s.mint, .22), [s]);
	return c((t) => {
		let n = t.clock.getElapsedTime(), i = r ? .35 : 1, a = Math.max(e, .15), o = Math.sin(n * .92 * i), s = Math.sin(n * .98 * i + .12), c = Math.sin(n * 1.08 * i + .68), u = Math.sin(n * 1.22 * i + 1.28);
		if (l.current) {
			let e = 1 + o * .008 * i;
			l.current.scale.setScalar(e), l.current.rotation.z = Math.sin(n * .14 * a) * .045, l.current.rotation.x = Math.sin(n * .08 * a) * .04, l.current.rotation.y = Math.cos(n * .09 * a) * .04;
		}
		let h = 1 + s * .038 * i, g = 1 + c * .026 * i, _ = 1 + u * .018 * i;
		if (d.current && (d.current.rotation.z = n * .085 * a * i, d.current.scale.setScalar(h)), f.current && (f.current.rotation.z = -n * .11 * a * i + Math.sin(n * .42 * i) * .03, f.current.scale.setScalar(g)), p.current && (p.current.rotation.z = n * .16 * a * i, p.current.scale.setScalar(_)), m.current) {
			let e = 1 + Math.sin(n * 1.14 * i + .4) * .05;
			m.current.scale.setScalar(e);
		}
	}), /* @__PURE__ */ o("group", {
		ref: l,
		renderOrder: 18,
		children: [
			/* @__PURE__ */ a("group", {
				ref: d,
				children: g.map((e, t) => {
					let n = ie(t, g.length, s);
					return /* @__PURE__ */ o("group", { children: [
						/* @__PURE__ */ a("mesh", {
							geometry: e.wash,
							renderOrder: 12,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.wash,
								transparent: !0,
								opacity: .016 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.glow,
							renderOrder: 13,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.glow,
								transparent: !0,
								opacity: .14 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.mid,
							renderOrder: 14,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.mid,
								transparent: !0,
								opacity: .34 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.core,
							renderOrder: 15,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.core,
								transparent: !0,
								opacity: .88,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						})
					] }, `outer-${t}`);
				})
			}),
			/* @__PURE__ */ a("group", {
				ref: f,
				children: _.map((e, t) => {
					let n = ae(t, _.length, s);
					return /* @__PURE__ */ o("group", { children: [
						/* @__PURE__ */ a("mesh", {
							geometry: e.wash,
							renderOrder: 16,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.wash,
								transparent: !0,
								opacity: .01 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.glow,
							renderOrder: 17,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.glow,
								transparent: !0,
								opacity: .095 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.mid,
							renderOrder: 18,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.mid,
								transparent: !0,
								opacity: .25 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.core,
							renderOrder: 19,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.core,
								transparent: !0,
								opacity: .78,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						})
					] }, `inner-${t}`);
				})
			}),
			/* @__PURE__ */ a("group", {
				ref: p,
				children: v.map((e, t) => {
					let n = oe(t, v.length, s);
					return /* @__PURE__ */ o("group", { children: [
						/* @__PURE__ */ a("mesh", {
							geometry: e.wash,
							renderOrder: 20,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.wash,
								transparent: !0,
								opacity: 0,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.glow,
							renderOrder: 21,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.glow,
								transparent: !0,
								opacity: .05 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.mid,
							renderOrder: 22,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.mid,
								transparent: !0,
								opacity: .12 * h,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						}),
						/* @__PURE__ */ a("mesh", {
							geometry: e.core,
							renderOrder: 23,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.core,
								transparent: !0,
								opacity: .62,
								blending: u.AdditiveBlending,
								depthWrite: !1,
								toneMapped: !1
							})
						})
					] }, `micro-${t}`);
				})
			}),
			/* @__PURE__ */ o("mesh", {
				ref: m,
				position: [
					0,
					0,
					.024
				],
				renderOrder: 24,
				children: [/* @__PURE__ */ a("sphereGeometry", { args: [
					.092,
					24,
					24
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					color: x,
					transparent: !0,
					opacity: .095 * h,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			}),
			/* @__PURE__ */ o("mesh", {
				position: [
					0,
					0,
					.026
				],
				renderOrder: 25,
				children: [/* @__PURE__ */ a("sphereGeometry", { args: [
					.062,
					24,
					24
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					color: y,
					transparent: !0,
					opacity: .18 * h,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			}),
			/* @__PURE__ */ o("mesh", {
				position: [
					0,
					0,
					.03
				],
				renderOrder: 26,
				children: [/* @__PURE__ */ a("sphereGeometry", { args: [
					.022,
					20,
					20
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					color: b,
					transparent: !0,
					opacity: .42,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			})
		]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/PetalPulseField.tsx
var ce = new u.Vector3(0, 0, 1);
function le(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.18;
		default: return 1;
	}
}
function ue(e, t, n, r, i = 0, a = 0) {
	let o = new u.Vector3(0, 0, i), s = new u.Vector3(0, e, i + a), c = new u.CubicBezierCurve3(o, new u.Vector3(t * 1.02, e * .18, i + a * .15), new u.Vector3(t * .92, e * .78, i + a * .8), s), l = new u.CubicBezierCurve3(s, new u.Vector3(-t * .92, e * .78, i + a * .8), new u.Vector3(-t * 1.02, e * .18, i + a * .15), o), d = [...c.getPoints(42), ...l.getPoints(42).slice(1)].map((e) => e.clone().applyAxisAngle(ce, n)), f = new u.CatmullRomCurve3(d, !1, "catmullrom", .45);
	return new u.TubeGeometry(f, 160, r, 12, !1);
}
function V(e, t, n, r, i, a = 0, o = 0) {
	return Array.from({ length: e }, (s, c) => ({ pulse: ue(t, n, c / e * Math.PI * 2 + r, i, a, o) }));
}
var de = "\n  varying vec2 vUv;\n\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", fe = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uSpeed;\n  uniform float uOffset;\n  uniform vec3 uBaseColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n\n  float loopDistance(float a, float b) {\n    float d = abs(a - b);\n    return min(d, 1.0 - d);\n  }\n\n  void main() {\n    float along = fract(vUv.x - uTime * uSpeed + uOffset);\n\n    float head = exp(-pow(loopDistance(along, 0.18) / 0.042, 2.0));\n    float tail = exp(-pow(loopDistance(along, 0.26) / 0.12, 2.0)) * 0.56;\n    float pulse = clamp(head + tail, 0.0, 1.0);\n\n    float body = 0.12 + 0.06 * sin((vUv.x + uOffset) * 24.0 - uTime * 1.15);\n    float shimmer = 0.92 + 0.08 * sin((vUv.x + uOffset) * 34.0 - uTime * 1.35);\n\n    vec3 color = mix(uBaseColor, uHotColor, pulse);\n    float alpha = uOpacity * (body + pulse * 1.22) * shimmer;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function H({ geometry: e, baseColor: r, hotColor: i, opacity: o, speed: s, reducedMotion: l, glowFactor: d, offset: f, speedFactor: p, pulseFactor: m }) {
	let h = n(null), g = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: o * d * m },
		uSpeed: { value: p },
		uOffset: { value: f },
		uBaseColor: { value: r.clone() },
		uHotColor: { value: i.clone() }
	}), [
		o,
		d,
		m,
		p,
		f,
		r,
		i
	]);
	return c((e) => {
		let t = e.clock.getElapsedTime(), n = l ? .42 : 1, r = Math.max(s, .15);
		h.current && (h.current.uniforms.uTime.value = t * r * n);
	}), /* @__PURE__ */ a("mesh", {
		geometry: e,
		renderOrder: 24,
		children: /* @__PURE__ */ a("shaderMaterial", {
			ref: h,
			uniforms: g,
			vertexShader: de,
			fragmentShader: fe,
			transparent: !0,
			depthWrite: !1,
			toneMapped: !1,
			blending: u.AdditiveBlending
		})
	});
}
function pe({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, pulseStrength: l }) {
	let d = n(null), f = n(null), p = le(i), m = u.MathUtils.clamp(l, .45, 1.7), h = t(() => V(10, .76, .17, 0, .0038, .012, .022), []), g = t(() => V(10, .58, .12, Math.PI / 10, .0032, .018, .012), []);
	return c((t) => {
		let n = t.clock.getElapsedTime(), i = r ? .42 : 1, a = Math.max(e, .15);
		if (d.current) {
			d.current.rotation.z = n * .08 * a * i;
			let e = 1 + Math.sin(n * .92 * i) * .012 * (.9 + m * .18);
			d.current.scale.setScalar(e);
		}
		if (f.current) {
			f.current.rotation.z = -n * .1 * a * i + Math.sin(n * .42 * i) * .024;
			let e = 1 + Math.sin(n * 1.08 * i + .6) * .01 * (.9 + m * .18);
			f.current.scale.setScalar(e);
		}
	}), /* @__PURE__ */ o("group", {
		renderOrder: 24,
		children: [/* @__PURE__ */ a("group", {
			ref: d,
			children: h.map((t, n) => n % 2 == 0 ? /* @__PURE__ */ a(H, {
				geometry: t.pulse,
				baseColor: s.mint.clone().lerp(s.halo, .3),
				hotColor: s.white.clone().lerp(s.mint, .14),
				opacity: .115,
				speed: e,
				reducedMotion: r,
				glowFactor: p,
				pulseFactor: m,
				offset: n / h.length,
				speedFactor: .38 + n * .01
			}, `outer-pulse-${n}`) : null)
		}), /* @__PURE__ */ a("group", {
			ref: f,
			children: g.map((t, n) => n % 3 == 0 ? /* @__PURE__ */ a(H, {
				geometry: t.pulse,
				baseColor: s.violet.clone().lerp(s.pink, .24),
				hotColor: s.white.clone().lerp(s.violet, .12),
				opacity: .1,
				speed: e,
				reducedMotion: r,
				glowFactor: p,
				pulseFactor: m,
				offset: n / g.length + .1,
				speedFactor: .45 + n * .008
			}, `inner-pulse-${n}`) : null)
		})]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/PetalEchoField.tsx
var me = new u.Vector3(0, 0, 1);
function he(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.2;
		default: return 1;
	}
}
function U(e, t, n, r, i = 0, a = 0) {
	let o = new u.Vector3(0, 0, i), s = new u.Vector3(0, e, i + a), c = new u.CubicBezierCurve3(o, new u.Vector3(t * 1.03, e * .18, i + a * .15), new u.Vector3(t * .94, e * .78, i + a * .82), s), l = new u.CubicBezierCurve3(s, new u.Vector3(-t * .94, e * .78, i + a * .82), new u.Vector3(-t * 1.03, e * .18, i + a * .15), o), d = [...c.getPoints(42), ...l.getPoints(42).slice(1)].map((e) => e.clone().applyAxisAngle(me, n)), f = new u.CatmullRomCurve3(d, !1, "catmullrom", .45);
	return new u.TubeGeometry(f, 120, r, 12, !1);
}
function ge(e, t, n, r, i, a, o, s = 0, c = 0) {
	return Array.from({ length: e }, (l, u) => {
		let d = u / e * Math.PI * 2 + r;
		return {
			haze: U(t, n, d, o, s, c),
			bloom: U(t, n, d, a, s, c),
			ghost: U(t, n, d, i, s, c)
		};
	});
}
function W(e, t, n, r, i) {
	return e.clone().lerp(t, r).lerp(n, i);
}
function _e(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + .3) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 2.4) + 1) * .5;
	return {
		haze: W(n.halo, n.violet, n.mint, .1 + i * .1, .04 + a * .06),
		bloom: W(n.violet, n.pink, n.mint, .18 + i * .16, .06 + a * .08),
		ghost: W(n.halo, n.white, n.violet, .14 + i * .1, .05 + a * .06)
	};
}
function ve(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + 1.2) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 3.1) + 1) * .5;
	return {
		haze: W(n.halo, n.violet, n.mint, .08 + i * .08, .04 + a * .05),
		bloom: W(n.violet, n.pink, n.halo, .15 + i * .13, .05 + a * .06),
		ghost: W(n.halo, n.white, n.mint, .1 + i * .08, .04 + a * .05)
	};
}
function ye({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, echoStrength: l }) {
	let d = n(null), f = n(null), p = n(null), m = he(i), h = u.MathUtils.clamp(l, .45, 1.7), g = t(() => ge(8, .95, .205, 0, .0115, .024, .043, -.012, .02), []), _ = t(() => ge(8, .82, .17, Math.PI / 8, .0095, .019, .034, -.008, .014), []);
	return c((t) => {
		let n = t.clock.getElapsedTime(), i = r ? .35 : 1, a = Math.max(e, .15);
		if (d.current) {
			let e = 1 + Math.sin(n * .78 * i) * .014;
			d.current.scale.setScalar(e), d.current.rotation.z = Math.sin(n * .1 * a * i) * .03;
		}
		f.current && (f.current.rotation.z = n * .028 * a * i), p.current && (p.current.rotation.z = -n * .038 * a * i + Math.sin(n * .42 * i) * .02);
	}), /* @__PURE__ */ o("group", {
		ref: d,
		renderOrder: 7,
		children: [/* @__PURE__ */ a("group", {
			ref: f,
			children: g.map((e, t) => {
				let n = _e(t, g.length, s);
				return /* @__PURE__ */ o("group", { children: [
					/* @__PURE__ */ a("mesh", {
						geometry: e.haze,
						renderOrder: 8,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.haze,
							transparent: !0,
							opacity: .034 * m * h,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}),
					/* @__PURE__ */ a("mesh", {
						geometry: e.bloom,
						renderOrder: 9,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.bloom,
							transparent: !0,
							opacity: .068 * m * h,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}),
					/* @__PURE__ */ a("mesh", {
						geometry: e.ghost,
						renderOrder: 10,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.ghost,
							transparent: !0,
							opacity: .094 * m * h,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					})
				] }, `outer-echo-${t}`);
			})
		}), /* @__PURE__ */ a("group", {
			ref: p,
			children: _.map((e, t) => {
				let n = ve(t, _.length, s);
				return /* @__PURE__ */ o("group", { children: [
					/* @__PURE__ */ a("mesh", {
						geometry: e.haze,
						renderOrder: 11,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.haze,
							transparent: !0,
							opacity: .026 * m * h,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}),
					/* @__PURE__ */ a("mesh", {
						geometry: e.bloom,
						renderOrder: 12,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.bloom,
							transparent: !0,
							opacity: .056 * m * h,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}),
					/* @__PURE__ */ a("mesh", {
						geometry: e.ghost,
						renderOrder: 13,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.ghost,
							transparent: !0,
							opacity: .08 * m * h,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					})
				] }, `inner-echo-${t}`);
			})
		})]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/InnerVolumeGlow.tsx
function be(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.24;
		default: return 1;
	}
}
var xe = "\n  varying vec2 vUv;\n\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", Se = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uPhase;\n  uniform float uCenterCut;\n  uniform float uEdgeStrength;\n  uniform float uBandA;\n  uniform float uBandB;\n\n  uniform vec3 uColorA;\n  uniform vec3 uColorB;\n  uniform vec3 uColorC;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 p = vUv * 2.0 - 1.0;\n    float r = length(p);\n    float a = atan(p.y, p.x);\n\n    if (r > 1.0) discard;\n\n    float bandOuter = exp(-pow((r - uBandA) / 0.12, 2.0));\n    float bandMid = exp(-pow((r - uBandB) / 0.18, 2.0));\n\n    float inwardA = 0.5 + 0.5 * sin(a * 4.0 + r * 7.8 - uTime * 0.2 + uPhase);\n    float inwardB = 0.5 + 0.5 * sin(a * 7.0 - r * 9.4 + uTime * 0.16 + uPhase * 1.31);\n    float inwardC = 0.5 + 0.5 * sin((p.x * 1.8 - p.y * 2.0) * 2.7 - uTime * 0.12 + uPhase * 2.0);\n\n    float edgeWarp =\n      0.026 * sin(a * 5.0 + uTime * 0.14 + uPhase) +\n      0.018 * sin(a * 9.0 - uTime * 0.09 + uPhase * 0.82) +\n      0.012 * sin(a * 13.0 + uTime * 0.06 + uPhase * 1.7);\n\n    float edgeFade = 1.0 - smoothstep(0.91 + edgeWarp, 1.0, r);\n\n    float centerSuppression = smoothstep(uCenterCut, 1.0, r);\n\n    float structure =\n      bandOuter * (uEdgeStrength + inwardA * 0.2 + inwardB * 0.14) +\n      bandMid * (0.34 + inwardB * 0.16 + inwardC * 0.12);\n\n    structure *= edgeFade;\n    structure *= centerSuppression;\n\n    vec3 color = mix(\n      uColorA,\n      uColorB,\n      clamp(bandOuter * 0.62 + inwardA * 0.24, 0.0, 1.0)\n    );\n\n    color = mix(\n      color,\n      uColorC,\n      clamp(bandMid * 0.22 + inwardB * 0.16, 0.0, 1.0)\n    );\n\n    float alpha = uOpacity * structure;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function Ce({ speed: e, reducedMotion: r, glowFactor: i, radius: s, opacity: l, z: d, phase: f, rotationSpeed: p, pulse: m, colors: h, renderOrder: g, centerCut: _, edgeStrength: v, bandA: y, bandB: b }) {
	let x = n(null), S = n(null), C = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: l * i },
		uPhase: { value: f },
		uCenterCut: { value: _ },
		uEdgeStrength: { value: v },
		uBandA: { value: y },
		uBandB: { value: b },
		uColorA: { value: h[0].clone() },
		uColorB: { value: h[1].clone() },
		uColorC: { value: h[2].clone() }
	}), [
		h,
		i,
		l,
		f,
		_,
		v,
		y,
		b
	]);
	return c((t) => {
		let n = t.clock.getElapsedTime(), a = r ? .4 : 1, o = n * Math.max(e, .15) * a;
		if (x.current) {
			x.current.rotation.z = f + o * p;
			let e = s * (1 + Math.sin(o * .42 + f) * m);
			x.current.scale.set(e, e, e);
		}
		S.current && (S.current.uniforms.uTime.value = o, S.current.uniforms.uOpacity.value = l * i * (.97 + Math.sin(o * .34 + f) * .035));
	}), /* @__PURE__ */ o("mesh", {
		ref: x,
		position: [
			0,
			0,
			d
		],
		renderOrder: g,
		children: [/* @__PURE__ */ a("planeGeometry", { args: [2, 2] }), /* @__PURE__ */ a("shaderMaterial", {
			ref: S,
			uniforms: C,
			vertexShader: xe,
			fragmentShader: Se,
			transparent: !0,
			depthWrite: !1,
			depthTest: !1,
			toneMapped: !1,
			blending: u.AdditiveBlending,
			side: u.DoubleSide
		})]
	});
}
function we({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, volumeStrength: l }) {
	let d = n(null), f = be(i), p = u.MathUtils.clamp(l, .45, 1.7), m = t(() => [
		s.halo.clone().lerp(s.white, .08),
		s.mint.clone().lerp(s.accent, .28),
		s.pink.clone().lerp(s.violet, .22)
	], [s]), h = t(() => [
		s.halo.clone().lerp(s.accent, .22),
		s.mint.clone().lerp(s.violet, .18),
		s.accent.clone().lerp(s.white, .16)
	], [s]), g = t(() => [
		s.accent.clone().lerp(s.halo, .28),
		s.violet.clone().lerp(s.pink, .24),
		s.mint.clone().lerp(s.accent, .18)
	], [s]);
	return c((t) => {
		let n = t.clock.getElapsedTime(), r = Math.max(e, .15);
		d.current && (d.current.rotation.x = Math.sin(n * .06 * r) * .012, d.current.rotation.y = Math.cos(n * .07 * r) * .012, d.current.rotation.z = Math.sin(n * .05 * r) * .01);
	}), /* @__PURE__ */ o("group", {
		ref: d,
		renderOrder: 6,
		children: [
			/* @__PURE__ */ a(Ce, {
				speed: e,
				reducedMotion: r,
				glowFactor: f,
				radius: 1.08,
				opacity: .28 * p,
				z: -.095,
				phase: .18,
				rotationSpeed: .02,
				pulse: .018,
				colors: m,
				renderOrder: 6,
				centerCut: .52,
				edgeStrength: .94,
				bandA: .9,
				bandB: .76
			}),
			/* @__PURE__ */ a(Ce, {
				speed: e,
				reducedMotion: r,
				glowFactor: f,
				radius: .98,
				opacity: .19 * p,
				z: -.04,
				phase: 1.24,
				rotationSpeed: -.028,
				pulse: .014,
				colors: h,
				renderOrder: 7,
				centerCut: .46,
				edgeStrength: .82,
				bandA: .86,
				bandB: .7
			}),
			/* @__PURE__ */ a(Ce, {
				speed: e,
				reducedMotion: r,
				glowFactor: f,
				radius: .82,
				opacity: .07 * p,
				z: .01,
				phase: 2.4,
				rotationSpeed: .038,
				pulse: .01,
				colors: g,
				renderOrder: 8,
				centerCut: .38,
				edgeStrength: .42,
				bandA: .76,
				bandB: .58
			})
		]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/GlassShell.tsx
function Te(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.2;
		default: return 1;
	}
}
var Ee = "\n  varying vec3 vWorldPos;\n  varying vec3 vWorldNormal;\n  varying vec3 vLocalPos;\n\n  void main() {\n    vLocalPos = normalize(position);\n\n    vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n    vWorldPos = worldPosition.xyz;\n    vWorldNormal = normalize(mat3(modelMatrix) * normal);\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", De = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform vec3 uHalo;\n  uniform vec3 uMint;\n  uniform vec3 uViolet;\n  uniform vec3 uPink;\n  uniform vec3 uAccent;\n  uniform vec3 uWhite;\n\n  varying vec3 vWorldPos;\n  varying vec3 vWorldNormal;\n  varying vec3 vLocalPos;\n\n  float angleDelta(float a, float b) {\n    return abs(atan(sin(a - b), cos(a - b)));\n  }\n\n  void main() {\n    vec3 N = normalize(vWorldNormal);\n    vec3 V = normalize(cameraPosition - vWorldPos);\n\n    float ndv = clamp(dot(N, V), 0.0, 1.0);\n    float fresnel = pow(1.0 - ndv, 2.72);\n\n    float rimSoft = smoothstep(0.06, 0.74, fresnel);\n    float rimStrong = smoothstep(0.22, 0.98, fresnel);\n\n    float body = smoothstep(0.03, 0.2, fresnel) * (1.0 - rimStrong) * 0.11;\n    float innerReflection = exp(-pow((fresnel - 0.22) / 0.11, 2.0)) * 0.34;\n\n    float angle = atan(vLocalPos.y, vLocalPos.x);\n\n    float bandA =\n      0.5 + 0.5 * sin(angle * 2.35 + vLocalPos.z * 4.8 + uTime * 0.34);\n    float bandB =\n      0.5 + 0.5 * sin(angle * 3.1 - uTime * 0.42 + vLocalPos.z * 5.4);\n    float latFlow =\n      0.5 + 0.5 * sin(vLocalPos.z * 7.2 + angle * 1.8 + uTime * 0.22);\n\n    vec3 spectralA = mix(uHalo, uMint, 0.54);\n    vec3 spectralB = mix(uViolet, uPink, 0.5);\n    vec3 spectralC = mix(uAccent, uWhite, 0.22);\n    vec3 spectralD = mix(uAccent, uMint, 0.44);\n\n    vec3 spectral = mix(spectralA, spectralB, bandA * 0.52 + bandB * 0.14);\n    spectral = mix(spectral, spectralC, innerReflection * 0.26 + bandB * 0.18);\n    spectral = mix(spectral, spectralD, latFlow * 0.24);\n\n    float travelA =\n      exp(-pow(angleDelta(angle, uTime * 0.36 + vLocalPos.z * 0.42) / 0.42, 2.0));\n    float travelB =\n      exp(-pow(angleDelta(angle, -uTime * 0.28 + 1.85 + vLocalPos.z * 0.24) / 0.34, 2.0));\n    float travelC =\n      exp(-pow(angleDelta(angle, uTime * 0.18 - 2.2 + vLocalPos.z * 0.3) / 0.7, 2.0));\n\n    float microSpark =\n      0.5 + 0.5 * sin(angle * 6.0 - uTime * 0.76 + vLocalPos.z * 6.4);\n\n    float movingHighlight =\n      rimStrong * (travelA * 0.42 + travelB * 0.22) +\n      rimSoft * travelC * 0.12;\n\n    vec3 color = spectral * (rimSoft * 0.56 + rimStrong * 0.46 + body * 0.22);\n    color += uWhite * movingHighlight * (0.72 + microSpark * 0.16);\n    color += mix(uMint, uWhite, 0.34) * innerReflection * 0.18;\n    color += mix(uViolet, uHalo, 0.42) * rimStrong * 0.05;\n    color += mix(uAccent, uWhite, 0.24) * rimSoft * 0.06;\n\n    float alpha = uOpacity * clamp(\n      rimStrong * 0.76 +\n      rimSoft * 0.22 +\n      innerReflection * 0.16 +\n      body * 0.18 +\n      movingHighlight * 0.22,\n      0.0,\n      1.0\n    );\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function Oe({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, shellStrength: l }) {
	let d = n(null), f = n(null), p = n(null), m = n(null), h = Te(i), g = u.MathUtils.clamp(l, .5, 1.6), _ = t(() => s.halo.clone().lerp(s.mint, .16).lerp(s.white, .04), [s]), v = t(() => s.mint.clone().lerp(s.white, .12).lerp(s.halo, .08), [s]), y = t(() => s.halo.clone().lerp(s.violet, .16).lerp(s.mint, .05), [s]), b = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: .34 * h * g },
		uHalo: { value: s.halo.clone().lerp(s.white, .05) },
		uMint: { value: s.mint.clone() },
		uViolet: { value: s.violet.clone() },
		uPink: { value: s.pink.clone() },
		uAccent: { value: s.accent.clone() },
		uWhite: { value: s.white.clone() }
	}), [
		s,
		h,
		g
	]);
	return c((t) => {
		let n = t.clock.getElapsedTime(), i = r ? .38 : 1, a = Math.max(e, .15);
		d.current && (d.current.uniforms.uTime.value = n * a * i, d.current.uniforms.uOpacity.value = .34 * h * g * (.975 + Math.sin(n * .72 * i) * .025)), f.current && (f.current.opacity = .038 * h * g * (.97 + Math.sin(n * .46 * i + .7) * .03)), p.current && (p.current.opacity = .02 * h * g * (.975 + Math.sin(n * .56 * i + 1.05) * .025)), m.current && (m.current.opacity = .014 * h * g * (.98 + Math.sin(n * .54 * i + 1.2) * .02));
	}), /* @__PURE__ */ o("group", { children: [
		/* @__PURE__ */ o("mesh", {
			renderOrder: 37,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				1.035,
				56,
				56
			] }), /* @__PURE__ */ a("meshBasicMaterial", {
				ref: f,
				color: _,
				transparent: !0,
				opacity: .038 * h * g,
				depthWrite: !1,
				toneMapped: !1,
				side: u.FrontSide,
				blending: u.NormalBlending
			})]
		}),
		/* @__PURE__ */ o("mesh", {
			renderOrder: 38,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				1.06,
				56,
				56
			] }), /* @__PURE__ */ a("meshBasicMaterial", {
				ref: p,
				color: v,
				transparent: !0,
				opacity: .02 * h * g,
				depthWrite: !1,
				toneMapped: !1,
				side: u.BackSide,
				blending: u.AdditiveBlending
			})]
		}),
		/* @__PURE__ */ o("mesh", {
			renderOrder: 40,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				1.092,
				72,
				72
			] }), /* @__PURE__ */ a("shaderMaterial", {
				ref: d,
				uniforms: b,
				vertexShader: Ee,
				fragmentShader: De,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1,
				side: u.FrontSide,
				blending: u.AdditiveBlending
			})]
		}),
		/* @__PURE__ */ o("mesh", {
			renderOrder: 41,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				1.128,
				56,
				56
			] }), /* @__PURE__ */ a("meshBasicMaterial", {
				ref: m,
				color: y,
				transparent: !0,
				opacity: .014 * h * g,
				depthWrite: !1,
				toneMapped: !1,
				side: u.BackSide,
				blending: u.AdditiveBlending
			})]
		})
	] });
}
//#endregion
//#region src/components/SphereVisual/renderers/three/Lights.tsx
var ke = {
	low: .72,
	medium: .9,
	high: 1.08
};
function Ae({ colors: e, glowIntensity: t }) {
	let n = ke[t];
	return /* @__PURE__ */ o(i, { children: [
		/* @__PURE__ */ a("ambientLight", { intensity: .28 }),
		/* @__PURE__ */ a("hemisphereLight", { args: [
			e.halo,
			e.accent,
			.72
		] }),
		/* @__PURE__ */ a("pointLight", {
			position: [
				2.25,
				2.05,
				2.8
			],
			color: e.halo,
			intensity: 2.25 * n
		}),
		/* @__PURE__ */ a("pointLight", {
			position: [
				-1.9,
				-1.45,
				2.3
			],
			color: e.violet,
			intensity: 1.65 * n
		}),
		/* @__PURE__ */ a("pointLight", {
			position: [
				.1,
				0,
				1.7
			],
			color: e.accent,
			intensity: 2.1 * n
		}),
		/* @__PURE__ */ a("pointLight", {
			position: [
				.25,
				.35,
				1.2
			],
			color: e.pink,
			intensity: 1.18 * n
		})
	] });
}
//#endregion
//#region src/components/SphereVisual/renderers/three/CenterCoreGlow.tsx
function je(e) {
	switch (e) {
		case "low": return .8;
		case "high": return 1.16;
		default: return 1;
	}
}
var Me = "\n  varying vec2 vUv;\n\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", Ne = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform vec3 uColorA;\n  uniform vec3 uColorB;\n  uniform vec3 uColorC;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 p = (vUv - 0.5) * 2.0;\n    float r = length(p);\n    float a = atan(p.y, p.x);\n\n    float baseMask = smoothstep(1.0, 0.08, r);\n    float petalHint = 0.5 + 0.5 * cos(a * 8.0);\n    float swirl = 0.5 + 0.5 * sin(a * 3.0 - r * 7.5 + uTime * 0.22);\n    float inner = exp(-pow(r / 0.7, 2.4));\n\n    vec3 color = mix(uColorA, uColorB, petalHint * 0.72);\n    color = mix(color, uColorC, swirl * 0.38);\n\n    float alpha =\n      uOpacity *\n      baseMask *\n      inner *\n      (0.7 + 0.3 * petalHint);\n\n    gl_FragColor = vec4(color, alpha);\n  }\n", Pe = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform vec3 uColorA;\n  uniform vec3 uColorB;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 p = (vUv - 0.5) * 2.0;\n    float r = length(p);\n\n    float softCore = exp(-pow(r / 0.48, 2.6));\n    float softBloom = exp(-pow(r / 0.78, 2.2)) * 0.55;\n    float drift = 0.96 + 0.04 * sin(uTime * 0.45 - r * 4.0);\n\n    vec3 color = mix(uColorA, uColorB, 0.38 + 0.18 * sin(uTime * 0.18));\n    float alpha = uOpacity * (softCore * 0.7 + softBloom * 0.3) * drift;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function Fe({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, centerStrength: l }) {
	let d = n(null), f = n(null), p = n(null), m = je(i), h = u.MathUtils.clamp(l, .45, 1.7), g = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: .22 * m * h },
		uColorA: { value: s.mint.clone().lerp(s.halo, .35) },
		uColorB: { value: s.violet.clone().lerp(s.pink, .26) },
		uColorC: { value: s.accent.clone().lerp(s.mint, .22) }
	}), [
		s,
		m,
		h
	]), _ = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: .16 * m * h },
		uColorA: { value: s.white.clone().lerp(s.mint, .26) },
		uColorB: { value: s.violet.clone().lerp(s.white, .52) }
	}), [
		s,
		m,
		h
	]);
	return c((t) => {
		let n = t.clock.getElapsedTime(), i = r ? .45 : 1, a = Math.max(e, .15);
		if (d.current) {
			let e = 1 + Math.sin(n * .82 * i) * .012 * i;
			d.current.scale.setScalar(e), d.current.rotation.z = Math.sin(n * .18 * a * i) * .025;
		}
		f.current && (f.current.uniforms.uTime.value = n * a * i, f.current.uniforms.uOpacity.value = .22 * m * h * (.95 + Math.sin(n * .52 * i) * .05)), p.current && (p.current.uniforms.uTime.value = n * a * i, p.current.uniforms.uOpacity.value = .16 * m * h * (.97 + Math.sin(n * .44 * i + .6) * .03));
	}), /* @__PURE__ */ o("group", {
		ref: d,
		renderOrder: 16,
		children: [/* @__PURE__ */ o("mesh", {
			position: [
				0,
				0,
				-.05
			],
			renderOrder: 16,
			children: [/* @__PURE__ */ a("planeGeometry", { args: [1.9, 1.9] }), /* @__PURE__ */ a("shaderMaterial", {
				ref: f,
				uniforms: g,
				vertexShader: Me,
				fragmentShader: Ne,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1,
				blending: u.AdditiveBlending
			})]
		}), /* @__PURE__ */ o("mesh", {
			position: [
				0,
				0,
				-.01
			],
			renderOrder: 17,
			children: [/* @__PURE__ */ a("planeGeometry", { args: [1.04, 1.04] }), /* @__PURE__ */ a("shaderMaterial", {
				ref: p,
				uniforms: _,
				vertexShader: Me,
				fragmentShader: Pe,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1,
				blending: u.AdditiveBlending
			})]
		})]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/SphereScene.tsx
function Ie(e) {
	return new u.Color(`rgb(${e.split(" ").join(", ")})`);
}
function Le(e) {
	let { presetConfig: r, mode: s, quality: l, interactive: d, glowIntensity: f, speed: p, pointerX: m, pointerY: h, reducedMotion: g, visualScale: _ } = e, v = n(null), y = t(() => ({
		accent: Ie(r.accentRgb),
		halo: Ie(r.haloRgb),
		violet: Ie(r.violetRgb),
		pink: Ie(r.pinkRgb),
		mint: Ie(r.mintRgb),
		white: Ie(r.whiteRgb ?? "255 255 255")
	}), [r]), b = Math.max(p, .15);
	return c((e) => {
		let t = e.clock.getElapsedTime(), n = g ? .06 : d ? 1 : .14, r = h * .08 * n, i = m * .1 * n;
		v.current && (v.current.rotation.x = u.MathUtils.lerp(v.current.rotation.x, r, .08), v.current.rotation.y = u.MathUtils.lerp(v.current.rotation.y, i, .08), v.current.rotation.z = u.MathUtils.lerp(v.current.rotation.z, Math.sin(t * .24 * b) * .008, .05));
	}), /* @__PURE__ */ o(i, { children: [/* @__PURE__ */ a(Ae, {
		colors: y,
		glowIntensity: f
	}), /* @__PURE__ */ o("group", {
		ref: v,
		scale: [
			_,
			_,
			_
		],
		children: [
			/* @__PURE__ */ o("mesh", { children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				1.12,
				40,
				40
			] }), /* @__PURE__ */ a("meshBasicMaterial", {
				color: y.halo,
				transparent: !0,
				opacity: .012,
				blending: u.AdditiveBlending,
				depthWrite: !1,
				side: u.BackSide,
				toneMapped: !1
			})] }),
			/* @__PURE__ */ a(we, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				volumeStrength: r.innerVolumeStrength
			}),
			/* @__PURE__ */ a(ye, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				echoStrength: r.echoStrength
			}),
			/* @__PURE__ */ a(se, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y
			}),
			/* @__PURE__ */ a(pe, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				pulseStrength: r.pulseStrength
			}),
			/* @__PURE__ */ a(Fe, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				centerStrength: r.centerStrength
			}),
			/* @__PURE__ */ a(L, {
				speed: p,
				reducedMotion: g,
				interactive: d,
				glowIntensity: f,
				colors: y,
				scatterStrength: r.scatterStrength
			}),
			/* @__PURE__ */ a(Oe, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				shellStrength: r.shellOpacity
			})
		]
	})] });
}
//#endregion
//#region src/components/SphereVisual/renderers/ThreeSphereCanvas.tsx
var Re = {
	low: 1,
	medium: [1, 1.5],
	high: [1, 2]
};
function ze({ quality: e, visualScale: t, frameloop: n, ...r }) {
	return /* @__PURE__ */ a(s, {
		frameloop: n,
		dpr: Re[e],
		camera: {
			position: [
				0,
				0,
				5.05
			],
			fov: 32
		},
		gl: {
			antialias: !0,
			alpha: !0,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl: e }) => {
			e.setClearColor(0, 0);
		},
		style: {
			width: "100%",
			height: "100%",
			pointerEvents: "none"
		},
		children: /* @__PURE__ */ a(Le, {
			quality: e,
			visualScale: t,
			...r
		})
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/ThreeSphereRenderer.tsx
function Be(e) {
	return /* @__PURE__ */ a("div", {
		style: {
			width: "100%",
			height: "100%",
			pointerEvents: "none"
		},
		children: /* @__PURE__ */ a(ze, { ...e })
	});
}
//#endregion
//#region src/components/SphereVisual/SphereVisual.tsx
var Ve = 440;
function He({ size: e = b.size, width: t, height: n, mode: r = b.mode, preset: i = b.preset, quality: o = b.quality, interactive: s = b.interactive, glowIntensity: c = b.glowIntensity, speed: l = b.speed, background: u = b.background, renderer: d = "three", frameloop: f = "always", className: p }) {
	let m = S(), h = s && !m, { containerRef: g, pointerX: _, pointerY: v } = O(h), C = t ?? e, w = n ?? e, T = x[i], E = [
		y.root,
		u === "dark" ? y.darkBackground : "",
		p ?? ""
	].filter(Boolean).join(" "), D = {
		width: C,
		height: w
	}, k = {
		presetConfig: T,
		mode: r,
		quality: o,
		interactive: h,
		glowIntensity: c,
		speed: l,
		pointerX: _,
		pointerY: v,
		reducedMotion: m,
		visualScale: e / Ve,
		frameloop: f
	};
	return /* @__PURE__ */ a("div", {
		className: E,
		style: D,
		children: /* @__PURE__ */ a("div", {
			ref: g,
			className: y.stage,
			children: d === "css" ? /* @__PURE__ */ a(P, {
				presetConfig: T,
				mode: r,
				quality: o,
				interactive: h,
				glowIntensity: c,
				speed: l,
				pointerX: _,
				pointerY: v,
				reducedMotion: m
			}) : /* @__PURE__ */ a(Be, { ...k })
		})
	});
}
//#endregion
//#region src/components/BinaryPlanetVisual/binaryMotion.ts
var Ue = -.12, We = .42, Ge = .38;
function Ke(e, t, n, r) {
	return Number.isFinite(e) ? Math.min(r, Math.max(n, e)) : t;
}
function qe(e, t) {
	let n = e % (Math.PI * 2), r = n;
	for (let e = 0; e < 6; e++) r -= (r - t * Math.sin(r) - n) / (1 - t * Math.cos(r));
	return r;
}
function Je(e, t, n, r) {
	let i = qe(e, r), a = t * (Math.cos(i) - r), o = t * Math.sqrt(1 - r ** 2) * Math.sin(i), s = 1 / (1 + n), c = -n * s;
	return [[
		a * c,
		o * c,
		0
	], [
		a * s,
		o * s,
		0
	]];
}
function Ye(e, t, n) {
	return e + (Number.isFinite(t) ? Math.min(.05, Math.max(0, t)) : 0) * n;
}
function Xe(e, t, n) {
	let r = n * Math.PI / 180, i = Math.cos(Ue), a = Math.sin(Ue), o = Math.cos(r), s = e.eccentricity, c = [e.massRatio / (1 + e.massRatio), 1 / (1 + e.massRatio)], l = 0, u = 0;
	return c.forEach((n, r) => {
		let c = t * n, d = c * Math.sqrt(1 - s * s), f = e.planets[r].radius * 1.12;
		l = Math.max(l, Math.abs(c * s * i) + Math.hypot(c * i, d * a * o) + f), u = Math.max(u, Math.abs(c * s * a) + Math.hypot(c * a, d * i * o) + f);
	}), {
		x: l,
		y: u
	};
}
function Ze(e, t, n, r) {
	return Math.max(0, Math.min(e, t * .92, n * .84 * r.x / r.y));
}
//#endregion
//#region src/components/BinaryPlanetVisual/binaryPresets.ts
var Qe = [
	{
		id: "ice-twins",
		title: "Ледяные близнецы",
		description: "Два холодных мира почти одного размера. Голубая и сиреневая атмосферы очерчивают их движение вокруг общего центра.",
		massRatio: .92,
		eccentricity: .08,
		planets: [{
			color: "#147db5",
			accent: "#b5e9f2",
			atmosphere: "#46cfff",
			radius: .51,
			bands: 0,
			seed: 1.4
		}, {
			color: "#6550aa",
			accent: "#d0ccf9",
			atmosphere: "#b2a0ff",
			radius: .49,
			bands: .15,
			seed: 7.3
		}]
	},
	{
		id: "ice-fire",
		title: "Лёд и пламя",
		description: "Синий мир и тёплая янтарная планета. Меньшая планета описывает более широкую орбиту; у сближения обе движутся быстрее.",
		massRatio: .62,
		eccentricity: .19,
		planets: [{
			color: "#096f9e",
			accent: "#9ddfe1",
			atmosphere: "#42cfff",
			radius: .54,
			bands: .08,
			seed: 2.1
		}, {
			color: "#a54c1b",
			accent: "#ffd295",
			atmosphere: "#ff9c51",
			radius: .41,
			bands: .45,
			seed: 5.8
		}]
	},
	{
		id: "violet-duet",
		title: "Фиолетовый дуэт",
		description: "Полосатый фиолетовый гигант и жемчужная планета. Мягкое свечение, разные размеры и неспешный орбитальный танец.",
		massRatio: .48,
		eccentricity: .13,
		planets: [{
			color: "#493580",
			accent: "#bf91cf",
			atmosphere: "#ae7fff",
			radius: .58,
			bands: .95,
			seed: 3.2
		}, {
			color: "#687d9e",
			accent: "#e3e8f1",
			atmosphere: "#a5d8ff",
			radius: .37,
			bands: .25,
			seed: 9.1
		}]
	}
];
function $e(e) {
	return Qe.find((t) => t.id === e) ?? Qe[0];
}
//#endregion
//#region src/components/BinaryPlanetVisual/binaryShaders.ts
var et = "\nvarying vec3 vNormal, vView, vLocal;\nvoid main() {\n  vec4 view = modelViewMatrix * vec4(position, 1.0);\n  vNormal = normalize(normalMatrix * normal);\n  vView = -view.xyz;\n  vLocal = normalize(position);\n  gl_Position = projectionMatrix * view;\n}", tt = "\nuniform vec3 uColor, uAccent, uAtmosphere;\nuniform float uSeed, uBands, uGlow;\nvarying vec3 vNormal, vView, vLocal;\nfloat hash(vec3 p) {\n  p = fract(p * 0.1031);\n  p += dot(p, p.yzx + 33.33);\n  return fract((p.x + p.y) * p.z);\n}\nfloat noise3(vec3 p) {\n  vec3 i = floor(p), f = fract(p);\n  f = f * f * (3.0 - 2.0 * f);\n  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),\n    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),\n    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),\n    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);\n}\nfloat fbm(vec3 p) {\n  return noise3(p) * 0.56 + noise3(p * 2.03 + 4.1) * 0.28 + noise3(p * 4.07 + 7.8) * 0.16;\n}\nvoid main() {\n  vec3 p = normalize(vLocal);\n  float broad = fbm(p * 3.8 + uSeed);\n  float detail = fbm(p * 12.0 + uSeed * 2.0);\n  float land = smoothstep(0.43, 0.66, broad + (detail - 0.5) * 0.18);\n  float belts = 0.5 + 0.5 * sin(p.y * 38.0 + broad * 9.0 + detail * 3.0);\n  float pattern = mix(land, smoothstep(0.12, 0.92, belts), uBands);\n  vec3 albedo = mix(uColor * 0.38, uAccent, pattern * 0.79);\n  float clouds = smoothstep(0.64, 0.80, fbm(p * 6.2 + vec3(uSeed, 4.0, 1.0)));\n  albedo = mix(albedo, uAccent, clouds * 0.52 * (1.0 - uBands));\n  vec3 n = normalize(vNormal), view = normalize(vView);\n  vec3 light = normalize(vec3(-0.65, 0.8, 1.15));\n  float daylight = max(dot(n, light), 0.0);\n  float rim = pow(1.0 - max(dot(n, view), 0.0), 3.6);\n  float sheen = pow(max(dot(n, normalize(light + view)), 0.0), 42.0) * (1.0 - pattern);\n  vec3 color = albedo * (0.12 + daylight * 1.12);\n  color += uAtmosphere * rim * (0.26 + daylight * 0.45) * uGlow;\n  color += uAccent * sheen * 0.24;\n  gl_FragColor = vec4(color, 1.0);\n  #include <colorspace_fragment>\n}", nt = "\nuniform vec3 uAtmosphere;\nuniform float uGlow;\nvarying vec3 vNormal, vView;\nvoid main() {\n  float facing = abs(dot(normalize(vNormal), normalize(vView)));\n  float rim = pow(1.0 - facing, 3.2);\n  float light = 0.6 + 0.4 * max(dot(normalize(vNormal), normalize(vec3(-0.65, 0.8, 1.15))), 0.0);\n  gl_FragColor = vec4(uAtmosphere * 1.1, rim * light * 0.55 * uGlow);\n  #include <colorspace_fragment>\n}", rt = "\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}", it = "\nuniform vec3 uColor;\nuniform float uTime, uGlow, uOpacity, uOffset;\nvarying vec2 vUv;\nvoid main() {\n  float flow = pow(0.5 + 0.5 * cos(vUv.x * 6.2831853 - uTime * 0.38 + uOffset), 12.0);\n  gl_FragColor = vec4(uColor * (0.75 + flow * 0.55), (0.27 + flow * 0.6) * uOpacity * uGlow);\n  #include <colorspace_fragment>\n}";
//#endregion
//#region src/components/BinaryPlanetVisual/BinaryPlanetScene.tsx
function at({ appearance: e, time: r, glow: i, segments: s, index: l }) {
	let u = n(null), p = t(() => ({
		uColor: { value: new m(e.color) },
		uAccent: { value: new m(e.accent) },
		uAtmosphere: { value: new m(e.atmosphere) },
		uSeed: { value: e.seed },
		uBands: { value: e.bands },
		uGlow: { value: i }
	}), [e, i]);
	return c(() => {
		u.current && u.current.rotation.set(.22 + l * .18, r.current * (l === 0 ? .12 : -.15) + l * 1.7, -.15);
	}), /* @__PURE__ */ o("group", {
		ref: u,
		children: [/* @__PURE__ */ o("mesh", { children: [/* @__PURE__ */ a("sphereGeometry", { args: [
			e.radius,
			s,
			s / 2
		] }), /* @__PURE__ */ a("shaderMaterial", {
			uniforms: p,
			vertexShader: et,
			fragmentShader: tt,
			toneMapped: !1
		})] }), /* @__PURE__ */ o("mesh", {
			scale: 1.09,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				e.radius,
				s,
				s / 2
			] }), /* @__PURE__ */ a("shaderMaterial", {
				uniforms: p,
				vertexShader: et,
				fragmentShader: nt,
				side: f,
				transparent: !0,
				depthWrite: !1,
				blending: d,
				toneMapped: !1
			})]
		})]
	});
}
function ot({ curve: e, color: r, time: s, glow: l, segments: u, index: f }) {
	let p = n(null), h = n(null), g = t(() => ({
		uColor: { value: new m(r) },
		uTime: { value: 0 },
		uGlow: { value: l },
		uOpacity: { value: .72 },
		uOffset: { value: f * Math.PI }
	}), [
		r,
		l,
		f
	]), _ = t(() => ({
		...g,
		uOpacity: { value: .08 }
	}), [g]);
	return c(() => {
		for (let e of [p, h]) e.current && (e.current.uniforms.uTime.value = s.current);
	}), /* @__PURE__ */ o(i, { children: [/* @__PURE__ */ o("mesh", { children: [/* @__PURE__ */ a("tubeGeometry", { args: [
		e,
		u * 2,
		.007,
		6,
		!0
	] }), /* @__PURE__ */ a("shaderMaterial", {
		ref: p,
		uniforms: g,
		vertexShader: rt,
		fragmentShader: it,
		transparent: !0,
		depthWrite: !1,
		toneMapped: !1
	})] }), /* @__PURE__ */ o("mesh", { children: [/* @__PURE__ */ a("tubeGeometry", { args: [
		e,
		u * 2,
		.025,
		6,
		!0
	] }), /* @__PURE__ */ a("shaderMaterial", {
		ref: h,
		uniforms: _,
		vertexShader: rt,
		fragmentShader: it,
		transparent: !0,
		depthWrite: !1,
		blending: d,
		toneMapped: !1
	})] })] });
}
function st(r) {
	let i = $e(r.preset), s = n(0), u = n(null), d = n(null), f = n(!0), { viewport: m, size: h, invalidate: g, frameloop: v } = l(), y = {
		low: 32,
		medium: 64,
		high: 96
	}[r.quality], b = t(() => [0, 1].map((e) => new p(Array.from({ length: 128 }, (t, n) => {
		let a = Je(n / 128 * Math.PI * 2, r.separation, i.massRatio, i.eccentricity)[e];
		return new _(...a);
	}), !0, "centripetal")), [r.separation, i]);
	e(() => {
		s.current = 0, f.current = !0, g();
	}, [
		r.resetKey,
		i,
		g
	]), e(() => {
		f.current = !0, g();
	}, [
		r.paused,
		r.speed,
		v,
		g
	]), c((e, t) => {
		!r.paused && v === "always" && !f.current && (s.current = Ye(s.current, t, r.speed)), v === "always" && (f.current = !1);
		let n = Je(We + s.current * Ge, r.separation, i.massRatio, i.eccentricity);
		u.current?.position.set(...n[0]), d.current?.position.set(...n[1]);
	}, -1);
	let x = Xe(i, r.separation, r.tilt);
	return /* @__PURE__ */ a("group", {
		scale: Ze(r.size, h.width, h.height, x) / h.width * m.width / (x.x * 2),
		rotation: [
			0,
			0,
			Ue
		],
		children: /* @__PURE__ */ o("group", {
			rotation: [
				r.tilt * Math.PI / 180,
				0,
				0
			],
			children: [
				r.showOrbits && b.map((e, t) => /* @__PURE__ */ a(ot, {
					curve: e,
					color: i.planets[t].atmosphere,
					time: s,
					glow: r.glowIntensity,
					segments: y,
					index: t
				}, t)),
				/* @__PURE__ */ a("group", {
					ref: u,
					children: /* @__PURE__ */ a(at, {
						appearance: i.planets[0],
						time: s,
						glow: r.glowIntensity,
						segments: y,
						index: 0
					})
				}),
				/* @__PURE__ */ a("group", {
					ref: d,
					children: /* @__PURE__ */ a(at, {
						appearance: i.planets[1],
						time: s,
						glow: r.glowIntensity,
						segments: y,
						index: 1
					})
				})
			]
		})
	});
}
var ct = {
	root: "_root_6woi1_1",
	dark: "_dark_6woi1_2",
	fallback: "_fallback_6woi1_3"
};
//#endregion
//#region src/components/BinaryPlanetVisual/BinaryPlanetVisual.tsx
function lt({ size: e = 620, width: t, height: n, preset: r = "ice-twins", quality: i = "medium", background: o = "dark", speed: c = .65, separation: l = 3.2, tilt: u = 48, glowIntensity: d = 1, showOrbits: f = !0, paused: p = !1, resetKey: m = 0, frameloop: h = "always", className: g = "" }) {
	let _ = S(), v = Ke(c, .65, 0, 2), y = Ke(e, 620, 1, 4096), b = p || _ || v === 0, x = b && h === "always" ? "demand" : h, C = $e(r);
	return /* @__PURE__ */ a("div", {
		className: `${ct.root} ${o === "dark" ? ct.dark : ""} ${g}`,
		style: {
			width: t ?? y,
			height: n ?? y
		},
		role: "img",
		"aria-label": `Система двух планет: ${C.title}`,
		"data-binary-planet": "",
		"data-binary-preset": C.id,
		"data-frameloop": x,
		children: /* @__PURE__ */ a(s, {
			orthographic: !0,
			frameloop: x,
			dpr: [1, {
				low: 1,
				medium: 1.5,
				high: 2
			}[i]],
			camera: {
				position: [
					0,
					0,
					10
				],
				zoom: 100,
				near: .1,
				far: 100
			},
			gl: {
				alpha: !0,
				antialias: !0,
				powerPreference: "low-power"
			},
			onCreated: ({ gl: e }) => e.setClearColor(0, 0),
			fallback: /* @__PURE__ */ a("div", {
				className: ct.fallback,
				children: "Для планет требуется поддержка WebGL."
			}),
			style: {
				width: "100%",
				height: "100%",
				pointerEvents: "none"
			},
			children: /* @__PURE__ */ a(st, {
				size: y,
				preset: C.id,
				quality: i,
				speed: v,
				separation: Ke(l, 3.2, 2.5, 4.5),
				tilt: Ke(u, 48, 10, 70),
				glowIntensity: Ke(d, 1, 0, 2),
				showOrbits: f,
				paused: b,
				resetKey: m
			})
		})
	});
}
//#endregion
//#region src/components/WaterRippleVisual/rippleConfig.ts
var G = {
	speed: .7,
	glowIntensity: 1.3,
	amplitude: .008,
	lineWidth: .02,
	damping: .55,
	rippleInterval: 4.8,
	tilt: 22,
	color: "#168dff"
}, ut = 1.35, dt = .38;
function ft(e, t, n, r, i) {
	let a = r * Math.PI / 180, o = Math.max(2.8 * Math.sin(a) + .15 * Math.cos(a), i ? (ut + dt) * Math.cos(a) : 0);
	return Math.min(e, t * .94, n * .88 * 5.6 / (2 * o));
}
//#endregion
//#region src/components/WaterRippleVisual/rippleTiming.ts
function K(e, t, n, r) {
	return Number.isFinite(e) ? Math.min(r, Math.max(n, e)) : t;
}
function pt(e, t, n) {
	return e + K(t, 0, 0, .05) * K(n, G.speed, 0, 3);
}
//#endregion
//#region src/components/WaterRippleVisual/rippleShaders.ts
var mt = "\n  uniform float uTime;\n  uniform float uInterval;\n  uniform float uDamping;\n  uniform float uAmplitude;\n\n  vec3 rippleAt(vec2 p) {\n    float r = length(p);\n    float travelTime = r / 0.84;\n    float retarded = uTime - travelTime;\n    float age = mod(max(retarded, 0.0), uInterval);\n    float envelope = smoothstep(0.0, 0.24, age)\n      * (1.0 - smoothstep(1.4, 2.8, age))\n      * step(0.0, retarded);\n    float edge = 1.0 - smoothstep(2.1, 2.8, r);\n    float attenuation = exp(-r * uDamping) * edge;\n    float phase = age * 12.8;\n    float wave = sin(phase);\n    float height = wave * envelope * attenuation * uAmplitude;\n    return vec3(height, wave, envelope * attenuation);\n  }\n", ht = `
  ${mt}
  varying vec2 vPoint;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPoint = position.xy;
    float dx = (rippleAt(vPoint + vec2(0.012, 0.0)).x
      - rippleAt(vPoint - vec2(0.012, 0.0)).x) / 0.024;
    float dy = (rippleAt(vPoint + vec2(0.0, 0.012)).x
      - rippleAt(vPoint - vec2(0.0, 0.012)).x) / 0.024;
    vNormal = normalize(normalMatrix * vec3(-dx, -dy, 1.0));
    // Keep the luminous rings in one plane. Relief only changes the normals,
    // so a shrinking wave amplitude cannot lift an entire ring on screen.
    vec4 mv = modelViewMatrix * vec4(position.xy, 0.0, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`, gt = `
  ${mt}
  uniform vec3 uColor;
  uniform float uGlow;
  uniform float uLineWidth;
  varying vec2 vPoint;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float r = length(vPoint);
    if (r > 2.8) discard;
    vec3 field = rippleAt(vPoint);
    // Convert phase to distance, with a pixel-sized antialiasing footprint.
    // Unlike a threshold on sin(phase), this keeps the line width explicit.
    float distanceToCrest = acos(clamp(field.y, -1.0, 1.0)) * (0.84 / 12.8);
    float aa = max(fwidth(r) * 0.65, 0.0008);
    float crest = 1.0 - smoothstep(uLineWidth * 0.5 - aa,
      uLineWidth * 0.5 + aa, distanceToCrest);
    float halo = exp(-pow(distanceToCrest / (uLineWidth * 2.2 + aa), 2.0));
    vec3 n = normalize(vNormal);
    vec3 view = normalize(vView);
    vec3 light = normalize(vec3(-0.35, 0.65, 1.0));
    float specular = pow(max(dot(n, normalize(light + view)), 0.0), 42.0);
    float fresnel = pow(1.0 - abs(dot(n, view)), 3.0);
    float edge = 1.0 - smoothstep(2.0, 2.8, r);
    float impactAge = mod(uTime, uInterval);
    float impact = exp(-r * r * 42.0) * exp(-impactAge * 5.5) * step(0.0, uTime);
    float energy = (crest * 1.6 + halo * 0.18) * field.z * uGlow;
    vec3 color = uColor * (0.035 * edge + energy);
    color += mix(uColor, vec3(0.72, 0.94, 1.0), 0.65)
      * (specular * field.z * 0.36 + crest * field.z * uGlow * 0.22);
    color += uColor * impact * uGlow * 1.6;
    float alpha = clamp(edge * 0.055 + field.z * (crest * 0.9 + halo * 0.2)
      * uGlow + fresnel * edge * 0.05 + impact * uGlow, 0.0, 0.98);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`, q = 1.83, _t = 2.43, J = .66, vt = .09, yt = .32, bt = .18;
function xt(e) {
	return -K(e, G.rippleInterval, 3, 10) - J + vt;
}
xt(G.rippleInterval);
var Y = .112, St = 1.5, Ct = .12, wt = q - Ct - Y * St, Tt = .1, Et = 2 * (wt - Y - Tt * J) / (J * J), Dt = (e) => e * e * (3 - 2 * e), X = (e) => Math.max(0, Math.min(1, e));
function Z(e, t, n, r = 1) {
	return {
		visible: r > 0,
		position: [
			0,
			0,
			e
		],
		scale: [
			t,
			n,
			t
		],
		tilt: 0,
		taper: 0,
		tip: 0,
		opacity: r
	};
}
function Ot(e, t, n = t) {
	let r = X(e / .12), i = n * Math.max(.03, 1 - r);
	return Z(i, t * (1 + .5 * r), i, 1 - r);
}
function kt(e, t) {
	let n = K(t, G.rippleInterval, 3, 10), r = (e % n + n) % n, i = e < 0 ? e : r < .55 ? r : r - n, a = ((e + J) % n + n) % n, o = X((a - vt) / (n - vt)), s = Dt(o), c = Y * Math.cbrt(.035 + .965 * o), l = c * (.72 + .78 * s), u = Ct * s, d = Z(q - u - l, c, l, Dt(X(a / vt)));
	d.taper = .28 * s;
	let f = Dt(X((o - .72) / .28)), p = Z(q - u / 2, .027 * (1 - f) + .003, Math.max(.004, u / 2 + .008));
	if (a < .09) {
		let e = a / vt;
		p = Z(q - Ct * (1 - e) / 2, .003 + e * .027, (Ct / 2 + .008) * (1 - e) + .008 * e);
	}
	let m = Z(0, Y, Y, 0), h = "forming";
	if (i >= -.66 && i < 0) {
		let e = i + J, t = e / J, n = 1 - Dt(X(t / .22)), r = .09 * Math.sin(e * 26) * Math.exp(-e * 3) * Math.sin(t * Math.PI), a = 1 + (St - 1) * n + r, o = Y / Math.sqrt(a / St);
		m = Z(wt - Tt * e - Et * e * e / 2, o, Y * a), m.taper = bt + (.28 - bt) * n, m.tip = yt * Dt(X(e / .1)) * (1 - .15 * t), m.tilt = .055 * Math.sin(e * 18) * Math.sin(t * Math.PI), h = "falling";
	} else i >= 0 && i < .12 && (m = Ot(i, Y * Math.sqrt(St), Y), m.taper = bt * (1 - i / .12), m.tip = yt * .85 * (1 - i / .12), h = "impact");
	let g = [{
		delay: .09,
		radius: .027,
		sign: -1
	}, {
		delay: .18,
		radius: .019,
		sign: 1
	}].map(({ delay: e, radius: t, sign: n }) => {
		let r = i + J - e, a = q - .085, o = Math.sqrt(2 * (a - t) / Et);
		if (r < 0 || r > o + .12) return Z(a, t, t, 0);
		if (r >= o) return Ot(r - o, t);
		let s = r / o, c = 1 + .08 * Math.sin(r * 24) * Math.sin(Math.PI * s), l = Z(a - Et * r * r / 2, t / Math.sqrt(c), t * c, Dt(X(r / .045)));
		return l.position[0] = n * .04 * Math.sin(Math.PI * s), l;
	});
	return {
		main: m,
		source: d,
		neck: p,
		satellites: g,
		stage: h
	};
}
function At(e, t, n) {
	let r = n * Math.PI / 180, i = _t * Math.cos(r) + .24 * Math.sin(r);
	return Math.min(e, t * .44 * 5.6 / i);
}
//#endregion
//#region src/components/WaterRippleVisual/dropShaders.ts
var jt = "\n  uniform float uTaper;\n  uniform float uTip;\n  varying vec3 vNormal;\n  void main() {\n    vec3 p = position;\n    float taper = 1.0 - uTaper * (p.y * 0.5 + 0.5);\n    vec3 n = vec3(normal.x / taper, normal.y, normal.z / taper);\n    n.y += uTaper * 0.5 * (p.x * n.x + p.z * n.z);\n    // Stretch only the upper hemisphere; keep the water contact point fixed.\n    float upper = max(p.y, 0.0);\n    n.y /= 1.0 + 3.0 * uTip * upper * upper;\n    p.y += uTip * upper * upper * upper;\n    p.xz *= taper;\n    vNormal = normalize(normalMatrix * n);\n    vec4 mv = modelViewMatrix * vec4(p, 1.0);\n    gl_Position = projectionMatrix * mv;\n  }\n", Mt = "\n  uniform vec3 uColor;\n  uniform float uOpacity;\n  uniform float uGlow;\n  varying vec3 vNormal;\n  void main() {\n    vec3 n = normalize(vNormal);\n    // The scene has an orthographic camera: all view rays are parallel.\n    float facing = abs(n.z);\n    float aa = max(fwidth(facing) * 0.55, 0.012);\n    float core = 1.0 - smoothstep(0.25 - aa, 0.52 + aa, facing);\n    float halo = pow(1.0 - facing, 4.0);\n    vec3 color = uColor * (core * 1.6 + halo * 0.22) * uGlow;\n    color += vec3(0.28, 0.68, 1.0) * core * 0.16 * uGlow;\n    gl_FragColor = vec4(color, (core * 0.98 + halo * 0.16 + 0.002) * uOpacity);\n    #include <colorspace_fragment>\n  }\n", Nt = "\n  varying float vAlong;\n  void main() {\n    vAlong = uv.x;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", Pt = "\n  uniform vec3 uColor;\n  uniform float uGlow;\n  uniform float uOpacity;\n  varying float vAlong;\n  void main() {\n    float fade = smoothstep(0.0, 0.28, vAlong);\n    gl_FragColor = vec4(uColor * uGlow * 1.2, uOpacity * fade);\n    #include <colorspace_fragment>\n  }\n";
//#endregion
//#region src/components/WaterRippleVisual/spoutGeometry.ts
function Ft() {
	let e = [
		[
			-1.18,
			-.22,
			2.4
		],
		[
			-.94,
			-.2,
			2.32
		],
		[
			-.66,
			-.17,
			2.17
		],
		[
			-.4,
			-.13,
			1.97
		],
		[
			-.17,
			-.075,
			1.83
		],
		[
			0,
			0,
			q
		]
	];
	return [
		e,
		e.map(([e, t, n]) => [
			e,
			-t,
			n
		]),
		[
			[
				-1.25,
				0,
				2.08
			],
			[
				-.99,
				0,
				1.86
			],
			[
				-.72,
				0,
				1.73
			],
			[
				-.46,
				0,
				1.69
			],
			[
				-.22,
				0,
				1.75
			],
			[
				0,
				0,
				q
			]
		]
	].map((e) => new p(e.map(([e, t, n]) => new _(e, t, n)), !1, "centripetal"));
}
//#endregion
//#region src/components/WaterRippleVisual/DropletSource.tsx
function It({ time: r, interval: i, color: s, glow: u, quality: d }) {
	let f = n([]), p = n([]), h = n([]), g = l((e) => e.invalidate), _ = t(() => Ft(), []), v = t(() => Array.from({ length: 5 }, () => ({
		uColor: { value: new m("#168dff") },
		uOpacity: { value: 0 },
		uGlow: { value: 1.3 },
		uTaper: { value: 0 },
		uTip: { value: 0 }
	})), []), y = t(() => Array.from({ length: 6 }, (e, t) => ({
		uColor: { value: new m("#168dff") },
		uOpacity: { value: t % 2 == 0 ? .72 : .08 },
		uGlow: { value: 1.3 }
	})), []);
	return e(() => {
		for (let e of [...p.current, ...h.current]) e && (e.uniforms.uColor.value.set(s), e.uniforms.uGlow.value = u);
		g();
	}, [
		s,
		u,
		g
	]), c(() => {
		let e = kt(r.current, i);
		[
			e.main,
			...e.satellites,
			e.source,
			e.neck
		].forEach((e, t) => {
			let n = f.current[t], r = p.current[t];
			!n || !r || (n.visible = e.visible, n.position.set(...e.position), n.scale.set(...e.scale), n.rotation.set(Math.PI / 2, 0, e.tilt), r.uniforms.uOpacity.value = e.opacity, r.uniforms.uTaper.value = e.taper, r.uniforms.uTip.value = e.tip);
		});
	}), /* @__PURE__ */ o("group", { children: [_.flatMap((e, t) => [.007, .022].map((n, r) => {
		let i = t * 2 + r;
		return /* @__PURE__ */ o("mesh", {
			renderOrder: 1,
			children: [/* @__PURE__ */ a("tubeGeometry", { args: [
				e,
				64,
				n,
				8,
				!1
			] }), /* @__PURE__ */ a("shaderMaterial", {
				ref: (e) => {
					h.current[i] = e;
				},
				uniforms: y[i],
				vertexShader: Nt,
				fragmentShader: Pt,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1
			})]
		}, `lip-${i}`);
	})), v.map((e, t) => /* @__PURE__ */ o("mesh", {
		visible: !1,
		renderOrder: 2,
		ref: (e) => {
			f.current[t] = e;
		},
		children: [/* @__PURE__ */ a("sphereGeometry", { args: [
			1,
			d === "low" ? 32 : 64,
			d === "low" ? 24 : 40
		] }), /* @__PURE__ */ a("shaderMaterial", {
			ref: (e) => {
				p.current[t] = e;
			},
			uniforms: e,
			vertexShader: jt,
			fragmentShader: Mt,
			transparent: !0,
			depthWrite: !1,
			toneMapped: !1
		})]
	}, `liquid-${t}`))] });
}
//#endregion
//#region src/components/WaterRippleVisual/WaterRippleScene.tsx
var Lt = {
	low: 64,
	medium: 112,
	high: 176
};
function Rt(r) {
	let i = r.variant === "droplet", s = n(null), u = n(i ? xt(r.rippleInterval) : 3.5), d = n(r.dropKey), f = n(r.variant), p = n(!0), g = l((e) => e.invalidate), _ = l((e) => e.frameloop), v = l((e) => e.viewport), y = l((e) => e.size), b = t(() => ({
		uTime: { value: 3.5 },
		uInterval: { value: 4.8 },
		uDamping: { value: .55 },
		uAmplitude: { value: G.amplitude },
		uLineWidth: { value: G.lineWidth },
		uGlow: { value: 1.3 },
		uColor: { value: new m("#168dff") }
	}), []);
	e(() => {
		if (!s.current) return;
		let e = s.current.uniforms;
		(d.current !== r.dropKey || f.current !== r.variant) && (u.current = i ? xt(r.rippleInterval) : 0, d.current = r.dropKey, f.current = r.variant), e.uTime.value = u.current, e.uInterval.value = r.rippleInterval, e.uDamping.value = r.damping, e.uAmplitude.value = r.amplitude, e.uLineWidth.value = r.lineWidth, e.uGlow.value = r.glowIntensity, e.uColor.value.set(r.color), g();
	}, [
		r.dropKey,
		r.rippleInterval,
		r.damping,
		r.amplitude,
		r.lineWidth,
		r.variant,
		r.glowIntensity,
		r.color,
		i,
		g
	]), e(() => {
		p.current = !0;
	}, [
		_,
		r.paused,
		r.speed
	]), c((e, t) => {
		s.current && (!r.paused && _ === "always" && !p.current && (u.current = pt(u.current, t, r.speed), s.current.uniforms.uTime.value = u.current), _ === "always" && (p.current = !1));
	}, -1);
	let x = ft(r.size, y.width, y.height, r.tilt, i), S = (i ? At(x, y.height, r.tilt) : x) / y.width * v.width / 5.6;
	return /* @__PURE__ */ o("group", {
		rotation: [
			-Math.PI / 2 + r.tilt * Math.PI / 180,
			0,
			0
		],
		scale: S,
		children: [/* @__PURE__ */ o("mesh", { children: [/* @__PURE__ */ a("planeGeometry", { args: [
			5.6,
			5.6,
			Lt[r.quality],
			Lt[r.quality]
		] }), /* @__PURE__ */ a("shaderMaterial", {
			ref: s,
			uniforms: b,
			vertexShader: ht,
			fragmentShader: gt,
			transparent: !0,
			depthWrite: !1,
			side: h,
			toneMapped: !1
		})] }), i && /* @__PURE__ */ a(It, {
			time: u,
			interval: r.rippleInterval,
			color: r.color,
			glow: r.glowIntensity,
			quality: r.quality
		})]
	});
}
var zt = 5.5, Bt = .62, Vt = 1.5;
function Ht() {
	return {
		next: 0,
		index: 0,
		impacts: []
	};
}
function Ut(e, t) {
	let n = Math.sin(e * 127.1 + t * 311.7) * 43758.5453;
	return n - Math.floor(n);
}
function Wt(e, t) {
	return e.filter((e) => t - e.time <= zt).slice(-64);
}
function Gt(e, t, n) {
	let r = 4.725 * Math.min(2, Math.max(.3, n));
	for (let n = 0; e.next <= t + .62 && n < 64; n++) {
		let t = e.index++, n = Ut(t, 1) * Math.PI * 2, i = Math.sqrt(Ut(t, 2)) * 1.7;
		e.impacts.push({
			x: Math.cos(n) * i,
			y: Math.sin(n) * i,
			time: e.next,
			strength: .55 + Ut(t, 5) * .4
		}), e.next += (.82 + Ut(t, 6) * .36) / r;
	}
	return e.impacts = Wt(e.impacts, t), e.impacts;
}
function Kt(e, t) {
	let n = (e - t + Bt) / Bt;
	return n >= -1e-10 && n < 1 ? 1.65 * (1 - Math.max(0, n) ** 2) : null;
}
function qt(e, t) {
	return !e || t.time - e.time >= .085 && Math.hypot(t.x - e.x, t.y - e.y) >= .12;
}
//#endregion
//#region src/components/WaterRippleVisual/waterCollectionShaders.ts
var Jt = "\nvarying vec2 vPoint;\nvarying vec2 vUv;\nvoid main() {\n  vPoint = position.xy;\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}", Yt = "\nuniform float uTime, uDamping, uLineWidth, uGlow;\nuniform vec3 uColor;\nuniform int uImpactCount;\nuniform vec4 uImpacts[64];\nvarying vec2 vPoint;\nvoid main() {\n  float core = 0.0;\n  float halo = 0.0;\n  float field = 0.0;\n  for (int i = 0; i < 64; i++) {\n    if (i >= uImpactCount) break;\n    float age = uTime - uImpacts[i].z;\n    float r = length(vPoint - uImpacts[i].xy);\n    float trail = age * 0.84 - r;\n    float envelope = smoothstep(0.0, 0.14, trail) * (1.0 - smoothstep(0.65, 1.35, trail));\n    envelope *= step(0.0, age) * exp(-r * uDamping * 0.65 - max(age, 0.0) * 0.12) * uImpacts[i].w;\n    float wave = sin(trail * 15.0);\n    float distanceToCrest = acos(clamp(wave, -1.0, 1.0)) / 15.0;\n    float aa = max(fwidth(r), 0.001);\n    float line = 1.0 - smoothstep(uLineWidth * 0.28, uLineWidth * 0.28 + aa, distanceToCrest);\n    core += line * envelope;\n    halo += exp(-pow(distanceToCrest / (uLineWidth * 1.7 + aa), 2.0)) * envelope;\n    field += wave * envelope;\n  }\n  float edge = 1.0 - smoothstep(2.2, 2.78, length(vPoint));\n  float light = (core * 0.95 + halo * 0.23) * edge;\n  // Intersections brighten or soften with the signed wave field.\n  light *= 0.86 + 0.14 * clamp(field + 0.5, 0.0, 1.5);\n  gl_FragColor = vec4(mix(uColor, vec3(0.68, 0.94, 1.0), min(core * 0.38, 0.6)) * uGlow,\n    clamp(light * uGlow, 0.0, 0.95));\n  #include <colorspace_fragment>\n}", Xt = "\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);\n}", Zt = "\nuniform vec3 uColor;\nuniform float uGlow;\nvarying vec2 vUv;\nvoid main() {\n  float x = abs(vUv.x - 0.5);\n  float tail = pow(1.0 - vUv.y, 1.2) * smoothstep(0.0, 0.12, vUv.y);\n  float core = exp(-x * x * 100.0);\n  gl_FragColor = vec4(mix(uColor, vec3(0.6, 0.94, 1.0), core * 0.6) * uGlow,\n    (core + exp(-x * x * 18.0) * 0.22) * tail * 0.8);\n  #include <colorspace_fragment>\n}";
//#endregion
//#region src/components/WaterRippleVisual/WaterCollectionScene.tsx
function Qt(e, t, n) {
	for (let r of e) {
		if (!r) continue;
		r.uniforms.uTime.value = t, r.uniforms.uImpactCount.value = n.length;
		let e = r.uniforms.uImpacts.value;
		for (let t = 0; t < 64; t++) {
			let r = n[t];
			e[t].set(r?.x ?? 0, r?.y ?? 0, r?.time ?? 0, r?.strength ?? 0);
		}
	}
}
function $t(r) {
	let i = n(r.variant === "interactive" ? 0 : 1.6), s = n(Ht()), u = n([]), d = n(r.dropKey), f = n(!0), p = n(null), _ = n(null), y = n([]), b = t(() => new g(), []), { viewport: x, size: S, invalidate: C, frameloop: w } = l(), T = r.variant === "rain", E = r.variant === "interactive", D = t(() => Array.from({ length: 2 }, () => ({
		uTime: { value: 0 },
		uColor: { value: new m("#168dff") },
		uGlow: { value: 1.3 },
		uDamping: { value: .55 },
		uLineWidth: { value: .02 },
		uImpactCount: { value: 0 },
		uImpacts: { value: Array.from({ length: 64 }, () => new v(0, 0, 0, 0)) }
	})), []);
	e(() => {
		d.current !== r.dropKey && (d.current = r.dropKey, E ? u.current = Wt([...u.current, {
			x: 0,
			y: 0,
			time: i.current,
			strength: 1
		}], i.current) : (i.current = 0, s.current = Ht()));
		for (let e of y.current) {
			if (!e) continue;
			let t = e.uniforms;
			t.uColor.value.set(r.color), t.uGlow.value = r.glowIntensity, t.uLineWidth.value = r.lineWidth, t.uDamping.value = r.damping;
		}
		C();
	}, [
		r.dropKey,
		r.color,
		r.glowIntensity,
		r.lineWidth,
		r.damping,
		r.intensity,
		E,
		C
	]), e(() => {
		f.current = !0;
	}, [
		w,
		r.paused,
		r.speed
	]), c((e, t) => {
		!r.paused && w === "always" && !f.current && (i.current = pt(i.current, t, r.speed)), w === "always" && (f.current = !1);
		let n = i.current, a = [];
		if (T && (a = Gt(s.current, n, r.intensity)), E && (u.current = Wt(u.current, n), a = u.current), Qt(y.current, n, a), _.current) {
			let e = 0;
			for (let t of a) {
				let i = Kt(n, t.time);
				if (i === null) continue;
				let a = (.12 + .12 * (1 - i / 1.65)) * Vt;
				b.position.set(t.x, t.y, i + a / 2), b.rotation.set(Math.PI / 2, 0, 0), b.scale.set(.038 * r.lineWidth / .02 * Vt, a, 1), b.updateMatrix(), _.current.setMatrixAt(e++, b.matrix);
			}
			_.current.count = e, _.current.instanceMatrix.needsUpdate = !0;
		}
	}, -1);
	function O(e, t) {
		if (!E || r.paused || !p.current) return;
		let n = p.current.worldToLocal(e.point.clone());
		if (Math.hypot(n.x, n.y) > 2.3) return;
		let a = {
			x: n.x,
			y: n.y,
			time: i.current,
			strength: t ? 1 : .7
		}, o = u.current.at(-1);
		(t || qt(o, a)) && (u.current = Wt([...u.current, a], i.current), C());
	}
	let k = r.tilt * Math.PI / 180, A = 2.8 * Math.sin(k), j = Math.max(2.8 * Math.sin(k), T ? 1.85 * Math.cos(k) + 1.7 * Math.sin(k) : 0), M = Math.min(r.size, S.width * .94, S.height * .82 * 5.6 / Math.max(j + A, .1)) / S.width * x.width / 5.6;
	return /* @__PURE__ */ o("group", {
		rotation: [
			-Math.PI / 2 + k,
			0,
			0
		],
		scale: M,
		position: [
			0,
			-(j - A) * M * .5,
			0
		],
		children: [/* @__PURE__ */ o("mesh", {
			ref: p,
			frustumCulled: !1,
			onPointerMove: E ? (e) => O(e, !1) : void 0,
			onPointerDown: E ? (e) => O(e, !0) : void 0,
			children: [/* @__PURE__ */ a("planeGeometry", { args: [5.6, 5.6] }), /* @__PURE__ */ a("shaderMaterial", {
				ref: (e) => {
					y.current[0] = e;
				},
				uniforms: D[0],
				vertexShader: Jt,
				fragmentShader: Yt,
				transparent: !0,
				depthWrite: !1,
				side: h,
				toneMapped: !1
			})]
		}), T && /* @__PURE__ */ o("instancedMesh", {
			ref: _,
			args: [
				void 0,
				void 0,
				64
			],
			frustumCulled: !1,
			children: [/* @__PURE__ */ a("planeGeometry", { args: [1, 1] }), /* @__PURE__ */ a("shaderMaterial", {
				ref: (e) => {
					y.current[1] = e;
				},
				uniforms: D[1],
				vertexShader: Xt,
				fragmentShader: Zt,
				transparent: !0,
				depthWrite: !1,
				side: h,
				toneMapped: !1
			})]
		})]
	});
}
var en = {
	root: "_root_v3i38_1",
	dark: "_dark_v3i38_9",
	fallback: "_fallback_v3i38_13"
}, tn = {
	low: 1,
	medium: 1.5,
	high: 2
};
function nn({ size: e = 520, width: t, height: n, quality: i = "medium", background: o = "dark", color: c = "#168dff", speed: l = G.speed, glowIntensity: u = 1.3, amplitude: d = G.amplitude, lineWidth: f = G.lineWidth, variant: p = "droplet", intensity: m = 1, damping: h = .55, rippleInterval: g, tilt: _ = 22, paused: v = !1, dropKey: y = 0, frameloop: b = "always", className: x = "" }) {
	let C = S(), [w, T] = r(0), E = K(e, 520, 1, 4096), D = K(l, G.speed, 0, 3), O = v || C || D === 0, k = O && b === "always" ? "demand" : b, A = p === "interactive", j = p === "ripples" || p === "droplet", M = p === "ripples" ? G.rippleInterval : 4, N = {
		size: E,
		quality: i,
		color: c,
		variant: p,
		speed: D,
		glowIntensity: K(u, 1.3, 0, 2),
		lineWidth: K(f, G.lineWidth, .004, .05),
		damping: K(h, .55, .2, 2),
		tilt: K(_, 22, 10, 75),
		paused: O,
		dropKey: y + (A ? w : 0)
	};
	return /* @__PURE__ */ a("div", {
		className: `${en.root} ${o === "dark" ? en.dark : ""} ${x}`,
		style: {
			width: t ?? E,
			height: n ?? E
		},
		role: A ? "button" : "img",
		tabIndex: A ? 0 : void 0,
		"aria-disabled": A ? O : void 0,
		"aria-label": A ? "Коснитесь воды или нажмите Enter для новой волны" : "Анимированная водная сцена",
		onKeyDown: A ? (e) => {
			(e.key === "Enter" || e.key === " ") && !O && (e.preventDefault(), T((e) => e + 1));
		} : void 0,
		"data-water-ripple": "",
		"data-frameloop": k,
		"data-water-variant": p,
		children: /* @__PURE__ */ a(s, {
			orthographic: !0,
			frameloop: k,
			dpr: [1, tn[i]],
			camera: {
				position: [
					0,
					0,
					8
				],
				zoom: 100,
				near: .1,
				far: 100
			},
			gl: {
				alpha: !0,
				antialias: !0,
				powerPreference: "low-power"
			},
			onCreated: ({ gl: e }) => e.setClearColor(0, 0),
			fallback: /* @__PURE__ */ a("div", {
				className: en.fallback,
				children: "Для ряби требуется поддержка WebGL."
			}),
			style: {
				width: "100%",
				height: "100%",
				pointerEvents: A ? "auto" : "none",
				touchAction: "pan-y"
			},
			children: j ? /* @__PURE__ */ a(Rt, {
				...N,
				amplitude: K(d, G.amplitude, 0, .15),
				rippleInterval: K(g ?? M, M, 3, 10)
			}) : /* @__PURE__ */ a($t, {
				...N,
				intensity: K(m, 1, .3, 2)
			}, p)
		})
	});
}
//#endregion
//#region src/components/SphereVisual/catalog/sphereCatalog.ts
var rn = [
	{
		preset: "glass-petal",
		mode: "thinking",
		title: "glass-petal",
		selectLabel: "glass-petal — базовый petal",
		text: "Наша текущая сильная baseline-версия: стеклянная оболочка, лепестковая структура и мягкий внутренний haze.",
		palette: {
			core: "#f7fbff",
			glow: "#72ddff",
			accent: "#9b83ff"
		}
	},
	{
		preset: "thinking-blue",
		mode: "thinking",
		title: "thinking-blue",
		selectLabel: "thinking-blue — синий thinking",
		text: "Более собранный и холодный характер с ощущением концентрации и размышления.",
		palette: {
			core: "#f4fbff",
			glow: "#66c8ff",
			accent: "#4078ff"
		}
	},
	{
		preset: "searching-violet",
		mode: "searching",
		title: "searching-violet",
		selectLabel: "searching-violet — фиолетовый поиск",
		text: "Более активный и выразительный вариант, хорошо подходящий под поиск, AI и lab-настроение.",
		palette: {
			core: "#fff7ff",
			glow: "#d477ff",
			accent: "#6b54ff"
		}
	},
	{
		preset: "calm-pearl",
		mode: "idle",
		title: "calm-pearl",
		selectLabel: "calm-pearl — спокойный премиальный",
		text: "Спокойный премиальный пресет: мягкий, светлый и деликатный, почти luxury-настроение.",
		palette: {
			core: "#ffffff",
			glow: "#d9ecff",
			accent: "#aab7d7"
		}
	},
	{
		preset: "neon-core",
		mode: "searching",
		title: "neon-core",
		selectLabel: "neon-core — яркий tech",
		text: "Яркий технологичный вариант с более контрастным свечением и выраженным AI/tech-характером.",
		palette: {
			core: "#ffffff",
			glow: "#69f3ff",
			accent: "#d24cff"
		}
	},
	{
		preset: "bio-glow",
		mode: "thinking",
		title: "bio-glow",
		selectLabel: "bio-glow — биолюминесцентный",
		text: "Более органичный и биолюминесцентный вариант: живой, мягкий и мятно-лазурный.",
		palette: {
			core: "#effff9",
			glow: "#6fffd2",
			accent: "#3ba9c9"
		}
	},
	{
		preset: "soft-ai",
		mode: "idle",
		title: "soft-ai",
		selectLabel: "soft-ai — мягкий AI",
		text: "Мягкий базовый AI-вариант: спокойный, светящийся, универсальный для нейтральных интерфейсов.",
		palette: {
			core: "#ffffff",
			glow: "#9fdfff",
			accent: "#7e91ff"
		}
	},
	{
		preset: "prism-bloom",
		mode: "searching",
		title: "prism-bloom",
		selectLabel: "prism-bloom — яркий multicolor",
		text: "Более яркий и насыщенный вариант с усиленным внутренним glow и более спектральным характером.",
		palette: {
			core: "#ffffff",
			glow: "#8cf5ff",
			accent: "#bd69ff"
		}
	}
], an = rn.map((e) => e.preset), on = rn.map((e) => ({
	value: e.preset,
	label: e.selectLabel
})), sn = {
	root: "_root_uku4o_1",
	darkBackground: "_darkBackground_uku4o_10",
	stage: "_stage_uku4o_21"
}, Q = {
	coreKind: "atomic",
	coreRgb: "214 245 255",
	glowRgb: "114 220 255",
	accentRgb: "116 140 255",
	hotRgb: "255 255 255",
	ringCount: 3,
	baseRadius: .92,
	ringThickness: .0115,
	coreSize: .18,
	haloSize: .5,
	haloOpacity: .04,
	coreGlowOpacity: .2,
	coreInnerOpacity: .98,
	families: [
		{
			radiusScale: 1.1,
			ellipseX: 1.05,
			ellipseY: 1.08,
			tiltX: .05,
			tiltY: 1.16,
			tiltZ: .14,
			wobble: .006,
			heroThicknessScale: 1.22,
			heroOpacity: .7,
			flowSpeed: .285,
			rotationSpeed: 0,
			shimmerSpeed: .88,
			heroAccentMix: .08,
			echoAccentMix: .04,
			hotColorMix: .06,
			driftX: 0,
			driftY: 0,
			driftZ: 0,
			spinX: 0,
			spinY: 0,
			spinZ: 0,
			breath: 0,
			echoes: [],
			nodes: {
				count: 2,
				size: .024,
				glowSize: 1.6,
				speed: .1,
				offset: .08
			}
		},
		{
			mirrorX: !1,
			radiusScale: 1.01,
			ellipseX: 1.34,
			ellipseY: .84,
			tiltX: .76,
			tiltY: .18,
			tiltZ: .4,
			wobble: .0065,
			heroThicknessScale: 1.18,
			heroOpacity: .64,
			flowSpeed: .295,
			rotationSpeed: 0,
			shimmerSpeed: .92,
			heroAccentMix: .18,
			echoAccentMix: .1,
			hotColorMix: .07,
			driftX: 0,
			driftY: 0,
			driftZ: 0,
			spinX: 0,
			spinY: 0,
			spinZ: 0,
			breath: 0,
			echoes: [],
			nodes: {
				count: 3,
				size: .024,
				glowSize: 1.58,
				speed: .106,
				offset: .24
			}
		},
		{
			mirrorX: !0,
			radiusScale: 1.01,
			ellipseX: 1.34,
			ellipseY: .84,
			tiltX: .76,
			tiltY: .18,
			tiltZ: .4,
			wobble: .0065,
			heroThicknessScale: 1.18,
			heroOpacity: .64,
			flowSpeed: .295,
			rotationSpeed: 0,
			shimmerSpeed: .92,
			heroAccentMix: .18,
			echoAccentMix: .1,
			hotColorMix: .07,
			driftX: 0,
			driftY: 0,
			driftZ: 0,
			spinX: 0,
			spinY: 0,
			spinZ: 0,
			breath: 0,
			echoes: [],
			nodes: {
				count: 3,
				size: .024,
				glowSize: 1.58,
				speed: .106,
				offset: .24
			}
		}
	]
}, cn = {
	"atomic-orb": Q,
	"atomic-orb-no-electrons": {
		...Q,
		families: Q.families.map((e) => ({
			...e,
			nodes: {
				...e.nodes,
				count: 0
			}
		}))
	},
	"atomic-orb-more-electrons": {
		...Q,
		families: Q.families.map((e, t) => {
			let n = [
				4,
				6,
				6
			], r = [
				.022,
				.022,
				.022
			], i = [
				1.52,
				1.5,
				1.5
			];
			return {
				...e,
				nodes: {
					...e.nodes,
					count: n[t] ?? e.nodes.count,
					size: r[t] ?? e.nodes.size,
					glowSize: i[t] ?? e.nodes.glowSize
				}
			};
		})
	},
	"atomic-orb-white": {
		...Q,
		coreRgb: "236 248 255",
		glowRgb: "205 232 255",
		accentRgb: "182 208 255",
		hotRgb: "255 255 255",
		haloOpacity: .045,
		coreGlowOpacity: .22,
		families: Q.families.map((e) => ({
			...e,
			heroOpacity: Math.min(e.heroOpacity + .04, .78),
			heroAccentMix: Math.max(e.heroAccentMix - .04, .04),
			hotColorMix: Math.max(e.hotColorMix - .02, .04)
		}))
	},
	"atomic-orb-violet": {
		...Q,
		coreRgb: "228 220 255",
		glowRgb: "171 126 255",
		accentRgb: "118 102 255",
		hotRgb: "255 244 255",
		haloOpacity: .045,
		coreGlowOpacity: .22,
		families: Q.families.map((e) => ({
			...e,
			heroAccentMix: Math.min(e.heroAccentMix + .08, .32),
			echoAccentMix: Math.min(e.echoAccentMix + .06, .22),
			hotColorMix: Math.min(e.hotColorMix + .04, .14)
		}))
	}
}, ln = {
	coreKind: "gyro",
	coreRgb: "145 218 230",
	glowRgb: "58 204 232",
	accentRgb: "108 118 132",
	hotRgb: "248 255 255",
	ringCount: 3,
	baseRadius: 1,
	ringThickness: .046,
	coreSize: .29,
	haloSize: .42,
	haloOpacity: .012,
	coreGlowOpacity: .12,
	coreInnerOpacity: 1,
	families: [],
	gyro: {
		coreScale: 1.1,
		corePulse: .011,
		coreRotationSpeed: .095,
		coreShellOpacity: .021,
		coreGlowOpacity: .14,
		rings: [
			{
				radius: 1.46,
				thickness: .044,
				tiltX: 1.29,
				tiltY: .1,
				tiltZ: -.24,
				spinSpeed: .14,
				direction: 1,
				phase: .04,
				spatialMotion: "planar-orbit",
				spatialSpeed: .169,
				spatialDirection: 1,
				spatialPhase: .11,
				segments: 4,
				gapRatio: .025,
				railInset: .014,
				railThicknessScale: .15,
				opacity: .96,
				markerCount: 1,
				offsetY: -.065
			},
			{
				radius: 1.16,
				thickness: .037,
				tiltX: .08,
				tiltY: -.2,
				tiltZ: .04,
				spinSpeed: .21,
				direction: -1,
				phase: .37,
				spatialMotion: "axial-reveal-horizontal",
				spatialSpeed: .241,
				spatialDirection: -1,
				spatialPhase: 2.38,
				segments: 5,
				gapRatio: .035,
				railInset: .012,
				railThicknessScale: .17,
				opacity: .88,
				markerCount: 1,
				offsetX: -.012,
				offsetY: .028
			},
			{
				radius: .92,
				thickness: .033,
				tiltX: .18,
				tiltY: 0,
				tiltZ: .07,
				spinSpeed: .3,
				direction: 1,
				phase: .67,
				spatialMotion: "axial-reveal",
				spatialSpeed: .287,
				spatialDirection: 1,
				spatialPhase: .78,
				segments: 4,
				gapRatio: .045,
				railInset: .01,
				railThicknessScale: .19,
				opacity: .9,
				markerCount: 1,
				offsetX: 0,
				offsetY: .015
			}
		]
	}
};
function un(e) {
	return { ...e };
}
function dn(e = {}) {
	let t = ln.gyro, n = e.gyro?.rings ?? t.rings;
	return {
		...ln,
		...e,
		families: [],
		gyro: {
			...t,
			...e.gyro,
			rings: n.map(un)
		}
	};
}
var fn = {
	"gyro-core": ln,
	"gyro-core-precision": dn({
		coreRgb: "236 250 255",
		glowRgb: "153 226 255",
		accentRgb: "116 145 167",
		hotRgb: "255 255 255",
		coreSize: .272,
		haloSize: .39,
		haloOpacity: .009,
		coreGlowOpacity: .105,
		gyro: {
			coreScale: 1.035,
			corePulse: .006,
			coreRotationSpeed: .072,
			coreShellOpacity: .028,
			coreGlowOpacity: .115,
			rings: ln.gyro.rings.map((e, t) => ({
				...e,
				thickness: [
					.038,
					.032,
					.028
				][t] ?? e.thickness,
				spinSpeed: [
					.118,
					.176,
					.248
				][t] ?? e.spinSpeed,
				spatialSpeed: [
					.154,
					.219,
					.266
				][t] ?? e.spatialSpeed,
				opacity: [
					.9,
					.82,
					.84
				][t] ?? e.opacity,
				railThicknessScale: [
					.13,
					.15,
					.17
				][t] ?? e.railThicknessScale
			}))
		}
	}),
	"gyro-core-reactor": dn({
		coreRgb: "232 224 255",
		glowRgb: "103 225 255",
		accentRgb: "118 76 178",
		hotRgb: "255 246 255",
		coreSize: .315,
		haloSize: .48,
		haloOpacity: .018,
		coreGlowOpacity: .17,
		gyro: {
			coreScale: 1.16,
			corePulse: .017,
			coreRotationSpeed: .138,
			coreShellOpacity: .034,
			coreGlowOpacity: .205,
			rings: ln.gyro.rings.map((e, t) => ({
				...e,
				thickness: [
					.049,
					.041,
					.036
				][t] ?? e.thickness,
				spinSpeed: [
					.176,
					.264,
					.372
				][t] ?? e.spinSpeed,
				spatialSpeed: [
					.181,
					.258,
					.307
				][t] ?? e.spatialSpeed,
				opacity: [
					.98,
					.93,
					.95
				][t] ?? e.opacity,
				railThicknessScale: [
					.18,
					.2,
					.22
				][t] ?? e.railThicknessScale
			}))
		}
	}),
	"gyro-core-amber": dn({
		coreRgb: "255 224 170",
		glowRgb: "244 160 68",
		accentRgb: "116 72 42",
		hotRgb: "255 247 220",
		coreSize: .296,
		haloSize: .4,
		haloOpacity: .01,
		coreGlowOpacity: .11,
		gyro: {
			coreScale: 1.085,
			corePulse: .008,
			coreRotationSpeed: .068,
			coreShellOpacity: .024,
			coreGlowOpacity: .13,
			rings: ln.gyro.rings.map((e, t) => ({
				...e,
				thickness: [
					.05,
					.042,
					.036
				][t] ?? e.thickness,
				spinSpeed: [
					.112,
					.169,
					.238
				][t] ?? e.spinSpeed,
				spatialSpeed: [
					.146,
					.207,
					.252
				][t] ?? e.spatialSpeed,
				opacity: [
					.94,
					.86,
					.89
				][t] ?? e.opacity,
				railThicknessScale: [
					.16,
					.18,
					.2
				][t] ?? e.railThicknessScale
			}))
		}
	})
}, pn = {
	coreKind: "portal",
	coreRgb: "224 251 255",
	glowRgb: "78 225 255",
	accentRgb: "45 91 214",
	hotRgb: "255 255 255",
	ringCount: 3,
	baseRadius: 1,
	ringThickness: .055,
	coreSize: .82,
	haloSize: .72,
	haloOpacity: .035,
	coreGlowOpacity: .16,
	coreInnerOpacity: 1,
	families: [],
	portal: {
		membraneRadius: .82,
		membraneOpacity: .86,
		membraneFlowSpeed: .52,
		membraneTurbulence: .56,
		membranePulse: .028,
		membraneDepth: .24,
		frameTiltX: .06,
		frameTiltY: -.1,
		frameTiltZ: -.035,
		frameRotationSpeed: .014,
		rings: [
			{
				radius: 1.34,
				thickness: .08,
				depthOffset: .08,
				tiltX: .012,
				tiltY: .018,
				tiltZ: 0,
				segments: 10,
				gapRatio: .07,
				spinSpeed: .072,
				direction: 1,
				phase: .06,
				opacity: .9,
				accentMix: .16,
				hotMix: .42,
				markerEvery: 2
			},
			{
				radius: 1.09,
				thickness: .039,
				depthOffset: -.045,
				tiltX: -.03,
				tiltY: .045,
				tiltZ: .022,
				segments: 16,
				gapRatio: .12,
				spinSpeed: .132,
				direction: -1,
				phase: .34,
				opacity: .82,
				accentMix: .38,
				hotMix: .5,
				markerEvery: 3
			},
			{
				radius: .91,
				thickness: .018,
				depthOffset: .13,
				tiltX: .022,
				tiltY: -.03,
				tiltZ: -.016,
				segments: 32,
				gapRatio: .07,
				spinSpeed: .215,
				direction: 1,
				phase: .68,
				opacity: .76,
				accentMix: .55,
				hotMix: .56,
				markerEvery: 8
			}
		]
	}
};
function mn(e = {}) {
	let t = pn.portal, n = e.portal?.rings ?? t.rings;
	return {
		...pn,
		...e,
		families: [],
		portal: {
			...t,
			...e.portal,
			rings: n.map((e) => ({ ...e }))
		}
	};
}
var hn = mn({
	coreRgb: "244 234 255",
	glowRgb: "185 105 255",
	accentRgb: "69 79 232",
	hotRgb: "255 249 255",
	haloSize: .76,
	haloOpacity: .042,
	portal: {
		membraneOpacity: .8,
		membraneFlowSpeed: .66,
		membraneTurbulence: .76,
		membranePulse: .045,
		frameRotationSpeed: .024,
		rings: pn.portal.rings.map((e, t) => ({
			...e,
			spinSpeed: [
				.12,
				.205,
				.32
			][t] ?? e.spinSpeed,
			opacity: [
				.92,
				.84,
				.8
			][t] ?? e.opacity,
			accentMix: [
				.3,
				.5,
				.62
			][t] ?? e.accentMix,
			hotMix: [
				.42,
				.48,
				.58
			][t] ?? e.hotMix
		}))
	}
}), gn = mn({
	coreRgb: "255 231 180",
	glowRgb: "255 146 52",
	accentRgb: "142 48 32",
	hotRgb: "255 250 219",
	haloSize: .7,
	haloOpacity: .032,
	portal: {
		membraneOpacity: .7,
		membraneFlowSpeed: .44,
		membraneTurbulence: .56,
		membranePulse: .034,
		membraneDepth: .19,
		frameTiltY: -.11,
		frameRotationSpeed: .012,
		rings: pn.portal.rings.map((e, t) => ({
			...e,
			thickness: [
				.082,
				.049,
				.026
			][t] ?? e.thickness,
			gapRatio: [
				.075,
				.15,
				.29
			][t] ?? e.gapRatio,
			spinSpeed: [
				.074,
				.125,
				.205
			][t] ?? e.spinSpeed,
			opacity: [
				.94,
				.8,
				.7
			][t] ?? e.opacity,
			accentMix: [
				.22,
				.4,
				.56
			][t] ?? e.accentMix,
			hotMix: [
				.34,
				.4,
				.48
			][t] ?? e.hotMix
		}))
	}
}), _n = {
	"portal-gate": mn(),
	"portal-gate-violet": hn,
	"portal-gate-ember": gn
}, vn = {
	coreKind: "planet",
	ringStyle: "planetary",
	planetDust: {
		enabled: !1,
		density: 1,
		size: 1,
		brightness: 1,
		motion: 1,
		tintRgb: "174 235 255"
	},
	coreRgb: "128 205 255",
	glowRgb: "58 160 255",
	accentRgb: "42 98 220",
	hotRgb: "235 250 255",
	ringCount: 2,
	baseRadius: .98,
	ringThickness: .0195,
	coreSize: .7,
	haloSize: .32,
	haloOpacity: .008,
	coreGlowOpacity: .04,
	coreInnerOpacity: 1,
	families: [{
		radiusScale: 1.16,
		ellipseX: 1.48,
		ellipseY: .36,
		tiltX: -.28,
		tiltY: .04,
		tiltZ: -.08,
		wobble: .0025,
		heroThicknessScale: 2.35,
		heroOpacity: .76,
		flowSpeed: .11,
		rotationSpeed: 0,
		shimmerSpeed: .42,
		heroAccentMix: .08,
		echoAccentMix: .03,
		hotColorMix: .04,
		driftX: 0,
		driftY: 0,
		driftZ: 0,
		spinX: 0,
		spinY: 0,
		spinZ: 0,
		breath: 0,
		echoes: [],
		nodes: {
			count: 0,
			size: .022,
			glowSize: 1.4,
			speed: .08,
			offset: .1
		}
	}, {
		radiusScale: .92,
		ellipseX: 1.48,
		ellipseY: .36,
		tiltX: -.28,
		tiltY: .04,
		tiltZ: -.08,
		wobble: .0025,
		heroThicknessScale: 1.65,
		heroOpacity: .48,
		flowSpeed: .09,
		rotationSpeed: 0,
		shimmerSpeed: .36,
		heroAccentMix: .12,
		echoAccentMix: .04,
		hotColorMix: .04,
		driftX: 0,
		driftY: 0,
		driftZ: 0,
		spinX: 0,
		spinY: 0,
		spinZ: 0,
		breath: 0,
		echoes: [],
		nodes: {
			count: 0,
			size: .022,
			glowSize: 1.4,
			speed: .08,
			offset: .34
		}
	}]
};
function yn(e) {
	return {
		...e,
		echoes: e.echoes.map((e) => ({ ...e })),
		nodes: { ...e.nodes }
	};
}
function bn(e = {}) {
	let t = e.families ?? vn.families;
	return {
		...vn,
		...e,
		planetDust: {
			...vn.planetDust,
			...e.planetDust
		},
		families: t.map(yn)
	};
}
var xn = bn({
	coreRgb: "222 181 126",
	glowRgb: "242 196 126",
	accentRgb: "126 78 44",
	hotRgb: "255 239 204",
	haloSize: .34,
	haloOpacity: .007,
	coreGlowOpacity: .038,
	planetDust: {
		tintRgb: "255 218 166",
		motion: .76
	},
	families: vn.families.map((e, t) => ({
		...e,
		flowSpeed: t === 0 ? .085 : .068,
		shimmerSpeed: t === 0 ? .31 : .26,
		heroOpacity: t === 0 ? .7 : .44,
		heroAccentMix: t === 0 ? .14 : .18,
		hotColorMix: t === 0 ? .08 : .07
	}))
}), Sn = bn({
	coreRgb: "198 232 246",
	glowRgb: "132 211 255",
	accentRgb: "108 141 198",
	hotRgb: "250 254 255",
	baseRadius: 1.01,
	ringThickness: .0165,
	coreSize: .64,
	haloSize: .36,
	haloOpacity: .012,
	coreGlowOpacity: .055,
	planetDust: {
		enabled: !0,
		density: .62,
		size: .82,
		brightness: .82,
		motion: .7,
		tintRgb: "229 248 255"
	},
	families: vn.families.map((e, t) => ({
		...e,
		radiusScale: t === 0 ? 1.24 : .96,
		ellipseX: 1.56,
		ellipseY: .31,
		tiltX: -.24,
		tiltY: .03,
		tiltZ: -.06,
		heroThicknessScale: t === 0 ? 1.88 : 1.22,
		heroOpacity: t === 0 ? .62 : .34,
		flowSpeed: t === 0 ? .075 : .058,
		shimmerSpeed: t === 0 ? .26 : .22,
		heroAccentMix: t === 0 ? .04 : .08,
		hotColorMix: t === 0 ? .09 : .08
	}))
}), Cn = bn({
	coreRgb: "118 76 52",
	glowRgb: "235 143 69",
	accentRgb: "84 42 30",
	hotRgb: "255 218 157",
	baseRadius: .94,
	ringThickness: .022,
	coreSize: .74,
	haloSize: .29,
	haloOpacity: .006,
	coreGlowOpacity: .03,
	planetDust: {
		enabled: !0,
		density: .34,
		size: 1.04,
		brightness: 1.08,
		motion: .55,
		tintRgb: "255 176 86"
	},
	families: vn.families.map((e, t) => ({
		...e,
		radiusScale: t === 0 ? 1.08 : .86,
		ellipseX: 1.42,
		ellipseY: .42,
		tiltX: -.34,
		tiltY: .055,
		tiltZ: -.11,
		heroThicknessScale: t === 0 ? 2.55 : 1.72,
		heroOpacity: t === 0 ? .82 : .5,
		flowSpeed: t === 0 ? .062 : .05,
		shimmerSpeed: t === 0 ? .22 : .18,
		heroAccentMix: t === 0 ? .2 : .24,
		hotColorMix: t === 0 ? .14 : .12
	}))
}), wn = {
	"ring-planet": bn(),
	"ring-planet-stardust": bn({ planetDust: { enabled: !0 } }),
	"ring-planet-sand": xn,
	"ring-planet-sand-stardust": bn({
		...xn,
		planetDust: {
			...xn.planetDust,
			enabled: !0,
			density: .84,
			size: .94,
			brightness: .9,
			motion: .74,
			tintRgb: "255 218 166"
		},
		families: xn.families
	}),
	"ring-planet-ice": Sn,
	"ring-planet-eclipse": Cn
}, Tn = {
	...cn,
	...wn,
	...fn,
	..._n
};
//#endregion
//#region src/components/OrbitalVisual/renderers/three/GyroRing.tsx
function En(e) {
	switch (e) {
		case "low": return 28;
		case "high": return 80;
		default: return 54;
	}
}
function Dn({ radius: e, width: t, depth: n, arc: r, curveSegments: i, bevelScale: a = 1 }) {
	let o = e + t / 2, s = Math.max(e - t / 2, .02), c = new u.Shape();
	c.moveTo(o, 0), c.absarc(0, 0, o, 0, r, !1), c.lineTo(Math.cos(r) * s, Math.sin(r) * s), c.absarc(0, 0, s, r, 0, !0), c.closePath();
	let l = Math.min(t * .085, n * .28) * a, d = new u.ExtrudeGeometry(c, {
		depth: n,
		steps: 1,
		curveSegments: i,
		bevelEnabled: l > 1e-4,
		bevelSegments: l > 1e-4 ? 2 : 0,
		bevelSize: l,
		bevelThickness: l * .72
	});
	return d.translate(0, 0, -n / 2), d.computeVertexNormals(), d;
}
function On({ config: r, colors: i, quality: s, speed: l, glowFactor: d, index: f }) {
	let p = n(null), m = n(null), h = n(null), g = Math.max(3, Math.round(r.segments)), _ = Math.PI * 2 / g, v = _ * u.MathUtils.clamp(1 - r.gapRatio, .72, .996), y = Math.max(_ - v, .001), b = En(s), x = Math.max(r.thickness * 2.42, .058), S = Math.max(r.thickness * .78, .019), C = Math.max(x * r.railThicknessScale, .013), w = Math.max(S * .095, .0028), T = t(() => Dn({
		radius: r.radius,
		width: x,
		depth: S,
		arc: v,
		curveSegments: b
	}), [
		r.radius,
		x,
		S,
		v,
		b
	]), E = t(() => Dn({
		radius: Math.max(r.radius - r.railInset, .05),
		width: C,
		depth: w,
		arc: v * .955,
		curveSegments: b,
		bevelScale: .28
	}), [
		r.radius,
		r.railInset,
		C,
		w,
		v,
		b
	]), D = t(() => Dn({
		radius: r.radius + x * .32,
		width: Math.max(C * .32, .004),
		depth: w,
		arc: v * .92,
		curveSegments: b,
		bevelScale: .2
	}), [
		r.radius,
		x,
		C,
		w,
		v,
		b
	]);
	e(() => () => {
		T.dispose(), E.dispose(), D.dispose();
	}, [
		T,
		E,
		D
	]);
	let O = t(() => Array.from({ length: g }, (e, t) => t), [g]), k = t(() => O.map((e) => e * _ + v + y / 2), [
		O,
		_,
		v,
		y
	]), A = Math.max(0, Math.round(r.markerCount)), j = t(() => Array.from({ length: A }, (e, t) => t / Math.max(A, 1) * Math.PI * 2 + _ * .34), [A, _]), M = t(() => i.metal.clone().lerp(i.glow, .08 + f * .018).multiplyScalar(1.14), [
		i.metal,
		i.glow,
		f
	]), N = t(() => i.metal.clone().lerp(i.glow, .035).multiplyScalar(.82), [i.metal, i.glow]), P = t(() => i.glow.clone().lerp(i.hot, .1 + f * .04), [
		i.glow,
		i.hot,
		f
	]), ee = t(() => i.hot.clone().lerp(i.glow, .42), [i.hot, i.glow]);
	c((e) => {
		if (!p.current || !m.current || !h.current) return;
		let t = e.clock.getElapsedTime(), n = Math.max(l, .2), i = r.spatialPhase + t * r.spatialSpeed * r.spatialDirection * n;
		r.spatialMotion === "planar-orbit" ? (p.current.rotation.set(0, 0, i), m.current.rotation.set(r.tiltX, r.tiltY, r.tiltZ)) : r.spatialMotion === "axial-reveal-horizontal" ? (p.current.rotation.set(0, 0, 0), m.current.rotation.set(r.tiltX + i, r.tiltY, r.tiltZ)) : (p.current.rotation.set(0, 0, 0), m.current.rotation.set(r.tiltX, r.tiltY + i, r.tiltZ)), h.current.rotation.z = r.phase + t * r.spinSpeed * r.direction * n;
	});
	let F = S / 2 + w * .72, te = -F, I = u.MathUtils.clamp(r.radius * y * 1.05, x * .16, x * .5);
	return /* @__PURE__ */ a("group", {
		ref: p,
		children: /* @__PURE__ */ a("group", {
			ref: m,
			position: [
				r.offsetX ?? 0,
				r.offsetY ?? 0,
				r.offsetZ ?? 0
			],
			rotation: [
				r.tiltX,
				r.tiltY,
				r.tiltZ
			],
			children: /* @__PURE__ */ o("group", {
				ref: h,
				children: [
					O.map((e) => /* @__PURE__ */ o("group", {
						rotation: [
							0,
							0,
							e * _
						],
						children: [
							/* @__PURE__ */ a("mesh", {
								geometry: T,
								renderOrder: 10 + f * 5,
								children: /* @__PURE__ */ a("meshPhysicalMaterial", {
									color: M,
									emissive: i.glow,
									emissiveIntensity: (.035 + f * .009) * d,
									metalness: .58,
									roughness: .22,
									clearcoat: 1,
									clearcoatRoughness: .16,
									transparent: !0,
									opacity: r.opacity,
									depthWrite: !0,
									depthTest: !0,
									toneMapped: !1
								})
							}),
							/* @__PURE__ */ a("mesh", {
								geometry: E,
								position: [
									0,
									0,
									F
								],
								renderOrder: 14 + f * 5,
								children: /* @__PURE__ */ a("meshBasicMaterial", {
									color: P,
									transparent: !0,
									opacity: u.MathUtils.clamp(r.opacity * .64 * d, 0, .82),
									blending: u.AdditiveBlending,
									depthWrite: !1,
									depthTest: !0,
									toneMapped: !1
								})
							}),
							/* @__PURE__ */ a("mesh", {
								geometry: E,
								position: [
									0,
									0,
									te
								],
								rotation: [
									0,
									Math.PI,
									0
								],
								renderOrder: 13 + f * 5,
								children: /* @__PURE__ */ a("meshBasicMaterial", {
									color: P,
									transparent: !0,
									opacity: u.MathUtils.clamp(r.opacity * .34 * d, 0, .56),
									blending: u.AdditiveBlending,
									depthWrite: !1,
									depthTest: !0,
									toneMapped: !1
								})
							}),
							/* @__PURE__ */ a("mesh", {
								geometry: D,
								position: [
									0,
									0,
									F * .98
								],
								renderOrder: 15 + f * 5,
								children: /* @__PURE__ */ a("meshBasicMaterial", {
									color: P,
									transparent: !0,
									opacity: u.MathUtils.clamp(r.opacity * .2 * d, 0, .32),
									blending: u.AdditiveBlending,
									depthWrite: !1,
									depthTest: !0,
									toneMapped: !1
								})
							})
						]
					}, e)),
					k.map((e, t) => /* @__PURE__ */ o("group", {
						position: [
							Math.cos(e) * r.radius,
							Math.sin(e) * r.radius,
							0
						],
						rotation: [
							0,
							0,
							e
						],
						children: [/* @__PURE__ */ o("mesh", {
							renderOrder: 18 + f * 5,
							children: [/* @__PURE__ */ a("boxGeometry", { args: [
								x * 1.08,
								I,
								S * 1.22
							] }), /* @__PURE__ */ a("meshPhysicalMaterial", {
								color: N,
								emissive: i.glow,
								emissiveIntensity: .018 * d,
								metalness: .76,
								roughness: .25,
								clearcoat: .88,
								clearcoatRoughness: .2,
								depthWrite: !0,
								depthTest: !0,
								toneMapped: !1
							})]
						}), /* @__PURE__ */ o("mesh", {
							position: [
								0,
								0,
								S * .69
							],
							renderOrder: 20 + f * 5,
							children: [/* @__PURE__ */ a("boxGeometry", { args: [
								x * .55,
								Math.max(I * .38, x * .035),
								S * .08
							] }), /* @__PURE__ */ a("meshBasicMaterial", {
								color: P,
								transparent: !0,
								opacity: u.MathUtils.clamp(.42 * d, 0, .66),
								blending: u.AdditiveBlending,
								depthWrite: !1,
								depthTest: !0,
								toneMapped: !1
							})]
						})]
					}, `joint-${t}`)),
					j.map((e, t) => {
						let n = r.radius - x * .12;
						return /* @__PURE__ */ a("group", {
							position: [
								Math.cos(e) * n,
								Math.sin(e) * n,
								0
							],
							rotation: [
								0,
								0,
								e + Math.PI / 2
							],
							children: /* @__PURE__ */ o("mesh", {
								position: [
									0,
									0,
									S * .67
								],
								renderOrder: 24 + f,
								children: [/* @__PURE__ */ a("boxGeometry", { args: [
									x * .48,
									x * .075,
									S * .09
								] }), /* @__PURE__ */ a("meshBasicMaterial", {
									color: ee,
									transparent: !0,
									opacity: u.MathUtils.clamp(.58 * d, 0, .78),
									blending: u.AdditiveBlending,
									depthWrite: !1,
									depthTest: !0,
									toneMapped: !1
								})]
							})
						}, `marker-${t}`);
					})
				]
			})
		})
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/GyroCore.tsx
function kn() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,0.9)"), n.addColorStop(.12, "rgba(255,255,255,0.76)"), n.addColorStop(.3, "rgba(255,255,255,0.28)"), n.addColorStop(.58, "rgba(255,255,255,0.055)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new u.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = u.LinearFilter, r.magFilter = u.LinearFilter, r;
}
function An(e) {
	switch (e) {
		case "low": return 32;
		case "high": return 64;
		default: return 48;
	}
}
function jn(e) {
	switch (e) {
		case "low": return 1;
		case "high": return 2;
		default: return 1;
	}
}
function Mn({ coreSize: r, config: i, colors: s, quality: l, speed: d, glowFactor: f }) {
	let p = n(null), m = n(null), h = n(null), g = t(() => kn(), []), _ = An(l), v = jn(l), y = t(() => s.accent.clone().lerp(s.glow, .16).multiplyScalar(1.12), [s.accent, s.glow]), b = t(() => s.accent.clone().lerp(s.glow, .5).multiplyScalar(.82), [s.accent, s.glow]), x = t(() => s.core.clone().lerp(s.hot, .18), [s.core, s.hot]), S = t(() => s.hot.clone().lerp(s.glow, .16), [s.hot, s.glow]);
	e(() => () => {
		g?.dispose();
	}, [g]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(d, .2);
		if (p.current) {
			let e = 1 + Math.sin(t * .54 * n) * i.corePulse;
			p.current.scale.setScalar(e), p.current.rotation.y = t * i.coreRotationSpeed * n, p.current.rotation.z = Math.sin(t * .1 * n) * .012;
		}
		m.current && (m.current.rotation.x = t * .032 * n, m.current.rotation.y = -t * .046 * n), h.current && (h.current.rotation.x = t * .16 * n, h.current.rotation.y = -t * .21 * n, h.current.rotation.z = t * .11 * n);
	});
	let C = r * i.coreScale, w = C * .42, T = Math.max(C * .018, .004);
	return /* @__PURE__ */ o("group", { children: [
		/* @__PURE__ */ a("hemisphereLight", {
			color: s.hot,
			groundColor: s.accent,
			intensity: 1.32
		}),
		/* @__PURE__ */ a("directionalLight", {
			position: [
				2.8,
				2.3,
				3.6
			],
			color: s.hot,
			intensity: 2.75
		}),
		/* @__PURE__ */ a("directionalLight", {
			position: [
				-2.3,
				-1.2,
				2.1
			],
			color: s.glow,
			intensity: 1.45
		}),
		/* @__PURE__ */ a("pointLight", {
			position: [
				0,
				0,
				.24
			],
			color: s.glow,
			intensity: 1.55 * f,
			distance: 3.8,
			decay: 2
		}),
		i.rings.map((e, t) => /* @__PURE__ */ a(On, {
			config: e,
			colors: {
				metal: y,
				glow: s.glow,
				hot: s.hot
			},
			quality: l,
			speed: d,
			glowFactor: f,
			index: t
		}, t)),
		/* @__PURE__ */ o("group", {
			ref: p,
			children: [
				g ? /* @__PURE__ */ a("sprite", {
					renderOrder: 24,
					scale: [
						C * 4.25,
						C * 4.25,
						1
					],
					children: /* @__PURE__ */ a("spriteMaterial", {
						map: g,
						color: s.glow,
						transparent: !0,
						opacity: i.coreGlowOpacity * f,
						blending: u.AdditiveBlending,
						depthWrite: !1,
						depthTest: !0,
						toneMapped: !1
					})
				}) : null,
				/* @__PURE__ */ o("mesh", {
					renderOrder: 25,
					scale: 1.08,
					children: [/* @__PURE__ */ a("sphereGeometry", { args: [
						C,
						_,
						_
					] }), /* @__PURE__ */ a("meshPhysicalMaterial", {
						color: b,
						emissive: s.glow,
						emissiveIntensity: .2 * f,
						metalness: .14,
						roughness: .16,
						clearcoat: 1,
						clearcoatRoughness: .1,
						transparent: !0,
						opacity: .74,
						depthWrite: !1,
						depthTest: !0,
						toneMapped: !1
					})]
				}),
				/* @__PURE__ */ o("group", {
					ref: h,
					children: [
						/* @__PURE__ */ o("mesh", {
							rotation: [
								Math.PI / 2,
								0,
								0
							],
							renderOrder: 26,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								w,
								T,
								8,
								48
							] }), /* @__PURE__ */ a("meshBasicMaterial", {
								color: s.glow,
								transparent: !0,
								opacity: u.MathUtils.clamp(.46 * f, 0, .68),
								blending: u.AdditiveBlending,
								depthWrite: !1,
								depthTest: !0,
								toneMapped: !1
							})]
						}),
						/* @__PURE__ */ o("mesh", {
							rotation: [
								.82,
								.62,
								.34
							],
							renderOrder: 26,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								w * .92,
								T,
								8,
								48
							] }), /* @__PURE__ */ a("meshBasicMaterial", {
								color: S,
								transparent: !0,
								opacity: u.MathUtils.clamp(.34 * f, 0, .52),
								blending: u.AdditiveBlending,
								depthWrite: !1,
								depthTest: !0,
								toneMapped: !1
							})]
						}),
						/* @__PURE__ */ o("mesh", {
							rotation: [
								-.66,
								.3,
								-.72
							],
							renderOrder: 26,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								w * .78,
								T * .86,
								8,
								44
							] }), /* @__PURE__ */ a("meshBasicMaterial", {
								color: s.core,
								transparent: !0,
								opacity: u.MathUtils.clamp(.3 * f, 0, .46),
								blending: u.AdditiveBlending,
								depthWrite: !1,
								depthTest: !0,
								toneMapped: !1
							})]
						})
					]
				}),
				/* @__PURE__ */ o("mesh", {
					renderOrder: 27,
					scale: .58,
					children: [/* @__PURE__ */ a("icosahedronGeometry", { args: [C, l === "high" ? 2 : 1] }), /* @__PURE__ */ a("meshPhysicalMaterial", {
						color: x,
						emissive: s.glow,
						emissiveIntensity: .9 * f,
						metalness: .02,
						roughness: .14,
						clearcoat: .88,
						clearcoatRoughness: .1,
						transparent: !0,
						opacity: .82,
						depthWrite: !1,
						depthTest: !0,
						toneMapped: !1
					})]
				}),
				/* @__PURE__ */ o("mesh", {
					renderOrder: 28,
					scale: .18,
					children: [/* @__PURE__ */ a("sphereGeometry", { args: [
						C,
						32,
						32
					] }), /* @__PURE__ */ a("meshBasicMaterial", {
						color: S,
						transparent: !0,
						opacity: .82,
						blending: u.AdditiveBlending,
						depthWrite: !1,
						depthTest: !0,
						toneMapped: !1
					})]
				}),
				/* @__PURE__ */ o("mesh", {
					ref: m,
					renderOrder: 29,
					scale: 1.18,
					children: [/* @__PURE__ */ a("icosahedronGeometry", { args: [C, v] }), /* @__PURE__ */ a("meshBasicMaterial", {
						color: s.glow,
						transparent: !0,
						opacity: i.coreShellOpacity,
						wireframe: !0,
						depthWrite: !1,
						depthTest: !0,
						blending: u.AdditiveBlending,
						toneMapped: !1
					})]
				})
			]
		})
	] });
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/orbitGeometry.ts
function Nn(e, { radius: t, wobble: n, seed: r, ellipseX: i, ellipseY: a }) {
	let o = Math.sin(e * 2 + r * .67) * n * .008, s = Math.cos(e * 4 - r * .41) * n * .0025, c = t * (1 + o + s), l = Math.cos(e) * c * i, d = Math.sin(e) * c * a, f = Math.sin(e * 2 + r * .31) * t * n * .008 + Math.cos(e * 3 - r * .19) * t * n * .002;
	return new u.Vector3(l, d, f);
}
function Pn(e) {
	let t = [];
	for (let n = 0; n < 220; n += 1) {
		let r = n / 220 * Math.PI * 2;
		t.push(Nn(r, e));
	}
	return new u.CatmullRomCurve3(t, !0, "catmullrom", .2);
}
function Fn(e, t, n, r, i, a) {
	let o = Pn({
		radius: e,
		wobble: n,
		seed: r,
		ellipseX: i,
		ellipseY: a
	});
	return new u.TubeGeometry(o, 280, t, 20, !0);
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/OrbitalNode.tsx
function In() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.16, "rgba(255,255,255,0.98)"), n.addColorStop(.34, "rgba(255,255,255,0.58)"), n.addColorStop(.62, "rgba(255,255,255,0.18)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new u.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = u.LinearFilter, r.magFilter = u.LinearFilter, r;
}
function Ln({ radius: r, wobble: i, seed: s, ellipseX: l, ellipseY: d, size: f, glowSize: p, speed: m, offset: h, pulseOffset: g, color: _, glowColor: v, opacity: y }) {
	let b = n(null), x = n(null), S = n(null), C = n(null), w = t(() => In(), []);
	e(() => () => {
		w?.dispose();
	}, [w]);
	let T = t(() => v.clone().lerp(_, .12), [v, _]), E = t(() => v.clone().lerp(_, .38), [v, _]), D = t(() => _.clone().lerp(new u.Color(1, 1, 1), .28), [_]);
	return c((e) => {
		if (!b.current) return;
		let t = e.clock.getElapsedTime(), n = Nn((t * m + h) % 1 * Math.PI * 2, {
			radius: r,
			wobble: i,
			seed: s,
			ellipseX: l,
			ellipseY: d
		}), a = 1 + Math.sin(t * 1.55 + g) * .055, o = .96 + Math.sin(t * 2.3 + g * 1.7) * .05;
		b.current.position.copy(n), b.current.scale.setScalar(a), x.current && (x.current.opacity = y * 1.12 * o), S.current && (S.current.opacity = .92 * o), C.current && (C.current.opacity = .98 * o);
	}), /* @__PURE__ */ o("group", {
		ref: b,
		children: [
			w ? /* @__PURE__ */ a("sprite", {
				renderOrder: 8,
				scale: [
					f * p * 10,
					f * p * 10,
					1
				],
				children: /* @__PURE__ */ a("spriteMaterial", {
					ref: x,
					map: w,
					color: T,
					transparent: !0,
					opacity: y * 1.12,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})
			}) : null,
			/* @__PURE__ */ o("mesh", {
				renderOrder: 9,
				children: [/* @__PURE__ */ a("sphereGeometry", { args: [
					f * 2.5,
					20,
					20
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					ref: S,
					color: E,
					transparent: !0,
					opacity: .92,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			}),
			/* @__PURE__ */ o("mesh", {
				renderOrder: 10,
				children: [/* @__PURE__ */ a("sphereGeometry", { args: [
					f * 1.5,
					18,
					18
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					ref: C,
					color: D,
					transparent: !0,
					opacity: .98,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			})
		]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/OrbitRibbon.tsx
var Rn = "\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  void main() {\n    vUv = uv;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vec4 centerMvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n\n    vViewZ = mvPosition.z;\n    vCenterViewZ = centerMvPosition.z;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", zn = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uFlowSpeed;\n  uniform float uShimmerSpeed;\n  uniform float uOffset;\n  uniform float uDepthSide;\n  uniform float uRingStyle;\n  uniform vec3 uBaseColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  float loopDistance(float a, float b) {\n    float d = abs(a - b);\n    return min(d, 1.0 - d);\n  }\n\n  void main() {\n    // uDepthSide:\n    //  0.0  -> full ring\n    //  1.0  -> front half only\n    // -1.0  -> back half only\n\n    if (uDepthSide > 0.5) {\n      // Front: ближе к камере, чем центр планеты\n      if (vViewZ < vCenterViewZ) {\n        discard;\n      }\n    } else if (uDepthSide < -0.5) {\n      // Back: дальше от камеры, чем центр планеты\n      if (vViewZ >= vCenterViewZ) {\n        discard;\n      }\n    }\n\n    float along = fract(vUv.x - uTime * uFlowSpeed + uOffset);\n\n    /*\n     * Energy-style остаётся прежним:\n     * яркая бегущая голова, хвост, shimmer и additive glow.\n     * Именно этот путь продолжают использовать атомные пресеты.\n     */\n    float head = exp(-pow(loopDistance(along, 0.18) / 0.05, 2.0));\n    float tail = exp(-pow(loopDistance(along, 0.26) / 0.16, 2.0)) * 0.58;\n    float pulse = clamp(head + tail, 0.0, 1.0);\n\n    float energyBand = pow(\n      max(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0),\n      0.58\n    );\n\n    float energyBody =\n      0.9 +\n      0.1 *\n        sin(\n          vUv.x * 18.0 -\n          uTime * uShimmerSpeed +\n          uOffset * 6.2831\n        );\n\n    float energyShimmer =\n      0.98 +\n      0.02 *\n        sin(\n          vUv.x * 32.0 -\n          uTime * (uShimmerSpeed + 0.22) +\n          uOffset * 4.0\n        );\n\n    vec3 energyColor = mix(\n      uBaseColor,\n      uHotColor,\n      pulse * 0.9\n    );\n\n    float energyAlpha =\n      uOpacity *\n      energyBand *\n      (0.86 + pulse * 0.76) *\n      energyBody *\n      energyShimmer;\n\n    /*\n     * Planetary-style:\n     * без белой бегущей головы и без ощущения электрического кабеля.\n     * Вместо неё — широкая спокойная полоса, тонкие слои и очень\n     * медленный неоднородный световой дрейф.\n     */\n    float crossSection = abs(vUv.y - 0.5) * 2.0;\n\n    float planetaryBand = pow(\n      max(1.0 - crossSection, 0.0),\n      0.3\n    );\n\n    float planetaryEdge =\n      1.0 - smoothstep(0.76, 1.0, crossSection);\n\n    float broadLayer =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.y * 18.0 +\n          vUv.x * 3.2 +\n          uOffset * 7.0\n        );\n\n    float fineLayer =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.y * 46.0 -\n          vUv.x * 5.4 +\n          uOffset * 11.0\n        );\n\n    float layerStructure =\n      broadLayer * 0.68 +\n      fineLayer * 0.32;\n\n    float slowDrift =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 9.0 -\n          uTime * uFlowSpeed * 0.34 +\n          uOffset * 6.2831\n        );\n\n    float softVariation =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 21.0 -\n          uTime * uShimmerSpeed * 0.12 +\n          vUv.y * 5.0 +\n          uOffset * 4.0\n        );\n\n    float planetaryHotMix =\n      0.035 +\n      slowDrift * 0.085 +\n      layerStructure * 0.025;\n\n    vec3 planetaryColor = mix(\n      uBaseColor * (0.9 + layerStructure * 0.12),\n      uHotColor,\n      planetaryHotMix\n    );\n\n    float planetaryAlpha =\n      uOpacity *\n      planetaryBand *\n      planetaryEdge *\n      (\n        0.76 +\n        layerStructure * 0.14 +\n        slowDrift * 0.07 +\n        softVariation * 0.03\n      );\n\n    vec3 color = mix(\n      energyColor,\n      planetaryColor,\n      uRingStyle\n    );\n\n    float alpha = mix(\n      energyAlpha,\n      planetaryAlpha,\n      uRingStyle\n    );\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function Bn(e, t, n, r, i, a, o, s, c) {
	return {
		uTime: { value: 0 },
		uOpacity: { value: e * t },
		uFlowSpeed: { value: n },
		uShimmerSpeed: { value: r },
		uOffset: { value: i },
		uDepthSide: { value: s },
		uRingStyle: { value: +(c === "planetary") },
		uBaseColor: { value: a.clone() },
		uHotColor: { value: o.clone() }
	};
}
function Vn(e, t, n, r) {
	let i = new u.ShaderMaterial({
		uniforms: e,
		vertexShader: Rn,
		fragmentShader: zn,
		transparent: !0,
		depthWrite: !1,
		depthTest: n,
		side: u.DoubleSide,
		blending: t === "planetary" ? u.NormalBlending : u.AdditiveBlending
	});
	return i.name = r, i.toneMapped = !1, i;
}
function Hn({ radius: r, thickness: s, ellipseX: l, ellipseY: u, tiltX: d, tiltY: f, tiltZ: p, wobble: m, seed: h, baseColor: g, hotColor: _, opacity: v, flowSpeed: y, shimmerSpeed: b, offset: x, speed: S, glowFactor: C, ringStyle: w = "energy", splitDepthLayers: T = !1, nodes: E = [] }) {
	let D = n(null), O = t(() => Fn(r, s, m, h, l, u), [
		r,
		s,
		m,
		h,
		l,
		u
	]), k = t(() => Bn(v, C, y, b, x, g, _, 0, w), [
		v,
		C,
		y,
		b,
		x,
		g,
		_,
		w
	]), A = t(() => Bn(v, C, y, b, x, g, _, 1, w), [
		v,
		C,
		y,
		b,
		x,
		g,
		_,
		w
	]), j = t(() => Bn(v, C, y, b, x, g, _, -1, w), [
		v,
		C,
		y,
		b,
		x,
		g,
		_,
		w
	]), M = t(() => Vn(k, w, !0, "OrbitalRibbonFullMaterial"), [
		k,
		w,
		Rn,
		zn
	]), N = t(() => Vn(A, w, !1, "OrbitalRibbonFrontMaterial"), [
		A,
		w,
		Rn,
		zn
	]), P = t(() => Vn(j, w, !0, "OrbitalRibbonBackMaterial"), [
		j,
		w,
		Rn,
		zn
	]);
	return e(() => () => {
		O.dispose();
	}, [O]), e(() => () => {
		M.dispose();
	}, [M]), e(() => () => {
		N.dispose();
	}, [N]), e(() => () => {
		P.dispose();
	}, [P]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(S, .2), r = h * .17, i = v * C * (.992 + Math.sin(t * .24 * n + r) * .01);
		D.current && (D.current.rotation.set(d, f, p), D.current.scale.setScalar(1)), M.uniforms.uTime.value = t * n, M.uniforms.uOpacity.value = i, N.uniforms.uTime.value = t * n, N.uniforms.uOpacity.value = i, P.uniforms.uTime.value = t * n, P.uniforms.uOpacity.value = i;
	}), /* @__PURE__ */ o("group", {
		ref: D,
		children: [T ? /* @__PURE__ */ o(i, { children: [/* @__PURE__ */ a("mesh", {
			geometry: O,
			renderOrder: 6,
			children: /* @__PURE__ */ a("primitive", {
				object: P,
				attach: "material"
			}, P.uuid)
		}), /* @__PURE__ */ a("mesh", {
			geometry: O,
			renderOrder: 18,
			children: /* @__PURE__ */ a("primitive", {
				object: N,
				attach: "material"
			}, N.uuid)
		})] }) : /* @__PURE__ */ a("mesh", {
			geometry: O,
			renderOrder: 6,
			children: /* @__PURE__ */ a("primitive", {
				object: M,
				attach: "material"
			}, M.uuid)
		}), E.map((e, t) => /* @__PURE__ */ a(Ln, {
			radius: r,
			wobble: m,
			seed: h,
			ellipseX: l,
			ellipseY: u,
			size: e.size,
			glowSize: e.glowSize,
			speed: e.speed * S,
			offset: e.offset,
			pulseOffset: e.pulseOffset,
			color: _,
			glowColor: g,
			opacity: e.opacity * C
		}, `${h}-node-${t}`))]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PlanetCore.tsx
var Un = "\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec3 vObjectPosition;\n\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n\n    vViewNormal = normalize(normalMatrix * normal);\n    vViewPosition = -mvPosition.xyz;\n    vObjectPosition = position;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", Wn = "\n  uniform vec3 uCoreColor;\n  uniform vec3 uGlowColor;\n  uniform vec3 uAccentColor;\n  uniform vec3 uHotColor;\n  uniform float uGlowFactor;\n\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec3 vObjectPosition;\n\n  float hash31(vec3 p) {\n    p = fract(p * 0.1031);\n    p += dot(p, p.yzx + 33.33);\n    return fract((p.x + p.y) * p.z);\n  }\n\n  float noise3(vec3 p) {\n    vec3 i = floor(p);\n    vec3 f = fract(p);\n\n    f = f * f * (3.0 - 2.0 * f);\n\n    float n000 = hash31(i + vec3(0.0, 0.0, 0.0));\n    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));\n    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));\n    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));\n    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));\n    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));\n    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));\n    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));\n\n    float nx00 = mix(n000, n100, f.x);\n    float nx10 = mix(n010, n110, f.x);\n    float nx01 = mix(n001, n101, f.x);\n    float nx11 = mix(n011, n111, f.x);\n\n    float nxy0 = mix(nx00, nx10, f.y);\n    float nxy1 = mix(nx01, nx11, f.y);\n\n    return mix(nxy0, nxy1, f.z);\n  }\n\n  float fbm(vec3 p) {\n    float value = 0.0;\n    float amplitude = 0.5;\n\n    for (int i = 0; i < 5; i++) {\n      value += noise3(p) * amplitude;\n      p = p * 2.03 + vec3(1.7, 2.9, 4.1);\n      amplitude *= 0.5;\n    }\n\n    return value;\n  }\n\n  void main() {\n    vec3 normal = normalize(vViewNormal);\n    vec3 viewDirection = normalize(vViewPosition);\n\n    vec3 lightDirection = normalize(vec3(-0.64, 0.5, 0.62));\n    vec3 fillDirection = normalize(vec3(0.52, -0.2, 0.74));\n\n    float diffuse = dot(normal, lightDirection);\n    float softLight = smoothstep(-0.52, 0.88, diffuse);\n    float daylight = smoothstep(-0.24, 0.72, diffuse);\n    float terminator = smoothstep(-0.42, 0.26, diffuse);\n    float fillLight = max(dot(normal, fillDirection), 0.0);\n\n    vec3 spherePosition = normalize(vObjectPosition);\n\n    vec3 warp = vec3(\n      fbm(spherePosition * 1.8 + vec3(0.2, 1.1, -0.7)),\n      fbm(spherePosition * 2.05 + vec3(-1.3, 0.35, 0.9)),\n      fbm(spherePosition * 1.72 + vec3(0.75, -0.8, 1.45))\n    ) - 0.5;\n\n    vec3 warpedPosition = normalize(spherePosition + warp * 0.28);\n\n    float broadNoise = fbm(\n      warpedPosition * 2.25 + vec3(0.35, 1.2, -0.8)\n    );\n    float mediumNoise = fbm(\n      warpedPosition * 5.2 + vec3(-1.4, 0.6, 1.1)\n    );\n    float detailNoise = fbm(\n      warpedPosition * 12.2 + vec3(2.2, -1.1, 0.45)\n    );\n\n    float latitudeBand =\n      0.5 +\n      0.5 *\n        sin(\n          warpedPosition.y * 16.5 +\n          broadNoise * 5.6 +\n          warpedPosition.x * 1.2\n        );\n\n    float secondaryBand =\n      0.5 +\n      0.5 *\n        sin(\n          warpedPosition.y * 34.0 -\n          mediumNoise * 4.4 +\n          warpedPosition.z * 1.7\n        );\n\n    float cloudField =\n      broadNoise * 0.58 +\n      mediumNoise * 0.28 +\n      detailNoise * 0.14 +\n      latitudeBand * 0.1;\n\n    float cloudMask = smoothstep(0.46, 0.73, cloudField);\n    float cloudVeil = smoothstep(0.34, 0.78, cloudField);\n\n    float darkerPatch = smoothstep(\n      0.5,\n      0.8,\n      (1.0 - broadNoise) * 0.5 +\n        mediumNoise * 0.34 +\n        detailNoise * 0.16\n    );\n\n    float stormDistance = distance(\n      spherePosition,\n      normalize(vec3(-0.42, 0.18, 0.88))\n    );\n\n    float storm =\n      exp(-stormDistance * stormDistance * 28.0) *\n      (0.72 + detailNoise * 0.28);\n\n    vec3 deepSurface = mix(\n      uAccentColor * 0.3,\n      uCoreColor * 0.68,\n      0.24 + broadNoise * 0.64\n    );\n\n    vec3 middleSurface = mix(\n      deepSurface,\n      uGlowColor * 0.62 + uCoreColor * 0.24,\n      mediumNoise * 0.42\n    );\n\n    vec3 bandColor = mix(\n      uAccentColor * 0.52,\n      uGlowColor * 0.68,\n      latitudeBand\n    );\n\n    vec3 cloudColor = mix(\n      uGlowColor,\n      uHotColor,\n      0.24 + detailNoise * 0.1\n    );\n\n    vec3 surfaceColor = middleSurface;\n\n    surfaceColor = mix(\n      surfaceColor,\n      bandColor,\n      latitudeBand * 0.085 + secondaryBand * 0.04\n    );\n\n    surfaceColor = mix(\n      surfaceColor,\n      cloudColor,\n      cloudMask * 0.38 + cloudVeil * 0.075\n    );\n\n    surfaceColor += cloudColor * storm * 0.18;\n\n    surfaceColor = mix(\n      surfaceColor,\n      uAccentColor * 0.34,\n      darkerPatch * 0.13\n    );\n\n    vec3 shadowColor = mix(\n      uAccentColor * 0.3,\n      uCoreColor * 0.5,\n      0.28 + broadNoise * 0.46\n    );\n\n    shadowColor = mix(\n      shadowColor,\n      surfaceColor * 0.64,\n      0.4 + mediumNoise * 0.12\n    );\n\n    vec3 illuminatedSurface =\n      surfaceColor * (0.82 + softLight * 0.34);\n\n    vec3 litSurface = mix(\n      shadowColor,\n      illuminatedSurface,\n      terminator\n    );\n\n    litSurface +=\n      uCoreColor *\n      fillLight *\n      (1.0 - daylight) *\n      0.11;\n\n    vec3 halfVector = normalize(lightDirection + viewDirection);\n\n    float specular =\n      pow(max(dot(normal, halfVector), 0.0), 52.0) *\n      smoothstep(-0.04, 0.7, diffuse);\n\n    float rim = pow(\n      1.0 - max(dot(normal, viewDirection), 0.0),\n      3.1\n    );\n\n    float litRimMask =\n      0.1 + 0.9 * smoothstep(-0.34, 0.64, diffuse);\n\n    vec3 rimColor = mix(\n      uAccentColor,\n      uGlowColor,\n      0.78\n    );\n\n    vec3 finalColor =\n      litSurface +\n      uHotColor * specular * 0.16 +\n      rimColor *\n        rim *\n        0.22 *\n        uGlowFactor *\n        litRimMask;\n\n    gl_FragColor = vec4(finalColor, 1.0);\n  }\n", Gn = "\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n\n    vViewNormal = normalize(normalMatrix * normal);\n    vViewPosition = -mvPosition.xyz;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", Kn = "\n  uniform vec3 uGlowColor;\n  uniform vec3 uAccentColor;\n  uniform float uGlowFactor;\n\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n\n  void main() {\n    vec3 normal = normalize(vViewNormal);\n    vec3 viewDirection = normalize(vViewPosition);\n    vec3 lightDirection = normalize(vec3(-0.64, 0.5, 0.62));\n\n    float diffuse = dot(normal, lightDirection);\n    float litSide = smoothstep(-0.32, 0.66, diffuse);\n\n    float rim = pow(\n      1.0 - max(dot(normal, viewDirection), 0.0),\n      3.05\n    );\n\n    vec3 atmosphereColor = mix(\n      uAccentColor,\n      uGlowColor,\n      0.5 + litSide * 0.38\n    );\n\n    float alpha =\n      rim *\n      (0.016 + litSide * 0.105) *\n      uGlowFactor;\n\n    gl_FragColor = vec4(\n      atmosphereColor * rim * (0.42 + litSide * 0.62),\n      alpha\n    );\n  }\n";
function qn({ coreSize: r, colors: i, speed: s, glowFactor: l }) {
	let d = n(null), f = t(() => ({
		uCoreColor: { value: i.core.clone() },
		uGlowColor: { value: i.glow.clone() },
		uAccentColor: { value: i.accent.clone() },
		uHotColor: { value: i.hot.clone() },
		uGlowFactor: { value: l }
	}), [i, l]), p = t(() => ({
		uGlowColor: { value: i.glow.clone() },
		uAccentColor: { value: i.accent.clone() },
		uGlowFactor: { value: l }
	}), [i, l]), m = t(() => {
		let e = new u.ShaderMaterial({
			uniforms: f,
			vertexShader: Un,
			fragmentShader: Wn,
			depthWrite: !0,
			depthTest: !0,
			side: u.FrontSide
		});
		return e.name = "RingPlanetSurfaceMaterial", e.toneMapped = !1, e;
	}, [
		f,
		Un,
		Wn
	]), h = t(() => {
		let e = new u.ShaderMaterial({
			uniforms: p,
			vertexShader: Gn,
			fragmentShader: Kn,
			transparent: !0,
			depthWrite: !1,
			depthTest: !0,
			side: u.FrontSide,
			blending: u.AdditiveBlending
		});
		return e.name = "RingPlanetAtmosphereMaterial", e.toneMapped = !1, e;
	}, [
		p,
		Gn,
		Kn
	]);
	return e(() => () => {
		m.dispose();
	}, [m]), e(() => () => {
		h.dispose();
	}, [h]), c((e) => {
		if (!d.current) return;
		let t = e.clock.getElapsedTime(), n = Math.max(s, .2);
		d.current.rotation.x = .08, d.current.rotation.y = t * .16 * n, d.current.rotation.z = -.12;
	}), /* @__PURE__ */ o("group", {
		ref: d,
		children: [/* @__PURE__ */ o("mesh", {
			renderOrder: 12,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				r * 1.1,
				96,
				96
			] }), /* @__PURE__ */ a("primitive", {
				object: m,
				attach: "material"
			}, m.uuid)]
		}), /* @__PURE__ */ o("mesh", {
			renderOrder: 13,
			scale: 1.023,
			children: [/* @__PURE__ */ a("sphereGeometry", { args: [
				r * 1.1,
				96,
				96
			] }), /* @__PURE__ */ a("primitive", {
				object: h,
				attach: "material"
			}, h.uuid)]
		})]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PlanetRingDust.tsx
var Jn = [
	{
		name: "fine",
		count: 96,
		size: 1.7,
		opacity: .58,
		colorMix: .7,
		whiteMix: .08,
		backRenderOrder: 7,
		frontRenderOrder: 20,
		clusterChance: .42
	},
	{
		name: "glow",
		count: 42,
		size: 2.8,
		opacity: .72,
		colorMix: .8,
		whiteMix: .22,
		backRenderOrder: 8,
		frontRenderOrder: 21,
		clusterChance: .58
	},
	{
		name: "spark",
		count: 14,
		size: 4.4,
		opacity: .88,
		colorMix: .88,
		whiteMix: .52,
		backRenderOrder: 9,
		frontRenderOrder: 22,
		clusterChance: .72
	}
];
function Yn(e) {
	let t = Math.floor(Math.abs(e) * 1e5) || 1;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function Xn(e, t, n) {
	return t + (n - t) * e();
}
function Zn(e) {
	let [t = 255, n = 255, r = 255] = e.trim().split(/\s+/).map(Number);
	return new u.Color(u.MathUtils.clamp(t / 255, 0, 1), u.MathUtils.clamp(n / 255, 0, 1), u.MathUtils.clamp(r / 255, 0, 1));
}
function Qn(e) {
	let t = [
		.13,
		.35,
		.63,
		.87
	], n = [
		.052,
		.072,
		.078,
		.048
	], r = [
		.2,
		.28,
		.32,
		.2
	], i = e(), a = 0, o = 0;
	for (let e = 0; e < r.length; e += 1) if (a += r[e], i <= a) {
		o = e;
		break;
	}
	return u.MathUtils.clamp(t[o] + Xn(e, -n[o], n[o]), .025, .975);
}
function $n() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 64, e.height = 64;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(32, 32, 0, 32, 32, 32);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.18, "rgba(255,255,255,0.98)"), n.addColorStop(.44, "rgba(255,255,255,0.62)"), n.addColorStop(.72, "rgba(255,255,255,0.16)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 64, 64), t.fillStyle = n, t.fillRect(0, 0, 64, 64);
	let r = new u.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = u.LinearFilter, r.magFilter = u.LinearFilter, r;
}
function er(e, t, n, r, i, a, o, s, c) {
	let l = t.angle + n * t.orbitSpeed + Math.sin(n * .18 + t.phase) * .012, d = u.MathUtils.clamp(t.radialProgress + Math.sin(n * .28 + t.phase) * t.radialPulse, .015, .985), f = r + (d - .5) * i, p = Math.sin(l * 3 + c * .73 + d * Math.PI) * s * .4, m = Math.sin(n * .22 + t.phase) * i * .02;
	e.set(Math.cos(l) * f * a, Math.sin(l) * f * o, p + t.depth + m);
}
function tr(e) {
	let t = new Float32Array(e * 3), n = new Float32Array(e * 3), r = new u.BufferAttribute(t, 3), i = new u.BufferAttribute(n, 3);
	r.setUsage(u.DynamicDrawUsage), i.setUsage(u.DynamicDrawUsage);
	let a = new u.BufferGeometry();
	return a.setAttribute("position", r), a.setAttribute("color", i), a.setDrawRange(0, 0), {
		geometry: a,
		positions: t,
		colors: n
	};
}
function nr(e, t, n, r, i) {
	return new u.PointsMaterial({
		name: e,
		map: t ?? void 0,
		color: 16777215,
		vertexColors: !0,
		size: n,
		sizeAttenuation: !1,
		transparent: !0,
		opacity: r,
		alphaTest: t ? .012 : 0,
		depthWrite: !1,
		depthTest: i,
		blending: u.AdditiveBlending,
		toneMapped: !1
	});
}
function rr(e, t, n, r, i, a, o, s, c, l, d, f) {
	let p = Yn(o + 41.73 + t * 17.19), m = Math.max(1, Math.round(e.count * Math.max(l, 0))), h = [], g = i.clone(), _ = new u.Color(.98, .995, 1), v = [
		.06,
		.24,
		.48,
		.72,
		.91
	];
	for (let t = 0; t < m; t += 1) {
		let t = p() < e.clusterChance, n = v[Math.min(v.length - 1, Math.floor(p() * v.length))], i = t ? n + Xn(p, -.038, .038) : p(), o = p(), s = r.clone().lerp(g, u.MathUtils.clamp(e.colorMix + o * .08, 0, 1)).lerp(_, u.MathUtils.clamp(e.whiteMix + o * .08, 0, 1));
		h.push({
			angle: i * Math.PI * 2,
			radialProgress: Qn(p),
			phase: p() * Math.PI * 2,
			orbitSpeed: Xn(p, .003, .011) * (p() < .5 ? -1 : 1),
			radialPulse: Xn(p, .002, .008),
			depth: Xn(p, -a * .12, a * .12),
			color: s
		});
	}
	let y = tr(m), b = tr(m), x = u.MathUtils.clamp(e.opacity * s * c * f * 1.36, 0, .95), S = e.size * Math.max(d, 0), C = nr(`PlanetRingDust-${e.name}-front`, n, S, x, !1), w = nr(`PlanetRingDust-${e.name}-back`, n, S, x, !0);
	return {
		frontGeometry: y.geometry,
		backGeometry: b.geometry,
		frontMaterial: C,
		backMaterial: w,
		frontPositions: y.positions,
		backPositions: b.positions,
		frontColors: y.colors,
		backColors: b.colors,
		particles: h,
		baseOpacity: x,
		phase: o * .37 + t * 1.91
	};
}
function ir(e, t, n, r, i) {
	let a = n * 3;
	e[a] = r.x, e[a + 1] = r.y, e[a + 2] = r.z, t[a] = i.r, t[a + 1] = i.g, t[a + 2] = i.b;
}
function ar(e, t) {
	e.setDrawRange(0, t);
	let n = e.getAttribute("position"), r = e.getAttribute("color");
	n.needsUpdate = !0, r.needsUpdate = !0;
}
function or({ radius: r, thickness: i, ellipseX: s, ellipseY: l, wobble: d, seed: f, baseColor: p, opacity: m, speed: h, glowFactor: g, density: _, size: v, brightness: y, motion: b, tintRgb: x, splitDepthLayers: S }) {
	let C = n(null), w = Math.max(i * 8.4, r * .112), T = t(() => $n(), []), E = t(() => Zn(x), [x]), D = t(() => Jn.map((e, t) => rr(e, t, T, p, E, w, f, m, g, _, v, y)), [
		T,
		p,
		E,
		r,
		w,
		f,
		m,
		g,
		_,
		v,
		y
	]);
	e(() => () => {
		for (let e of D) e.frontGeometry.dispose(), e.backGeometry.dispose(), e.frontMaterial.dispose(), e.backMaterial.dispose();
	}, [D]), e(() => () => {
		T?.dispose();
	}, [T]);
	let O = t(() => new u.Vector3(), []), k = t(() => new u.Vector3(), []), A = t(() => new u.Vector3(), []), j = t(() => new u.Vector3(), []);
	return c((e) => {
		if (!C.current) return;
		let t = e.clock.getElapsedTime(), n = Math.max(h, .2), i = Math.max(b, 0), a = t * n * i;
		C.current.rotation.z = Math.sin(a * .05 + f) * .002, C.current.updateWorldMatrix(!0, !1), j.set(0, 0, 0).applyMatrix4(C.current.matrixWorld).applyMatrix4(e.camera.matrixWorldInverse);
		for (let i = 0; i < D.length; i += 1) {
			let o = D[i], c = 0, u = 0;
			for (let t = 0; t < o.particles.length; t += 1) {
				let n = o.particles[t];
				er(O, n, a, r, w, s, l, d, f), k.copy(O).applyMatrix4(C.current.matrixWorld), A.copy(k).applyMatrix4(e.camera.matrixWorldInverse), S && A.z - j.z >= 0 ? (ir(o.frontPositions, o.frontColors, c, O, n.color), c += 1) : (ir(o.backPositions, o.backColors, u, O, n.color), u += 1);
			}
			ar(o.frontGeometry, c), ar(o.backGeometry, u);
			let p = .72 + .28 * (.5 + .5 * Math.sin(t * n * (.42 + i * .09) + o.phase)), m = o.baseOpacity * p;
			o.frontMaterial.opacity = m, o.backMaterial.opacity = m;
		}
	}), /* @__PURE__ */ a("group", {
		ref: C,
		children: D.map((e, t) => {
			let n = Jn[t];
			return /* @__PURE__ */ o("group", { children: [/* @__PURE__ */ a("points", {
				geometry: e.backGeometry,
				material: e.backMaterial,
				renderOrder: n.backRenderOrder,
				frustumCulled: !1
			}), /* @__PURE__ */ a("points", {
				geometry: e.frontGeometry,
				material: e.frontMaterial,
				renderOrder: n.frontRenderOrder,
				frustumCulled: !1
			})] }, n.name);
		})
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PlanetRing.tsx
var sr = "\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  void main() {\n    vUv = uv;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vec4 centerMvPosition =\n      modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n\n    vViewZ = mvPosition.z;\n    vCenterViewZ = centerMvPosition.z;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", cr = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uFlowSpeed;\n  uniform float uShimmerSpeed;\n  uniform float uOffset;\n  uniform float uDepthSide;\n  uniform float uDepthFeather;\n  uniform vec3 uBaseColor;\n\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  float softBand(\n    float coordinate,\n    float center,\n    float width\n  ) {\n    float distanceFromCenter =\n      abs(coordinate - center);\n\n    return 1.0 - smoothstep(\n      width * 0.48,\n      width,\n      distanceFromCenter\n    );\n  }\n\n  void main() {\n    /*\n     * Кольцо по-прежнему делится на переднюю и заднюю части,\n     * чтобы оно действительно проходило вокруг планеты.\n     *\n     * Но вместо жёсткого discard на одной точной границе\n     * используется мягкая переходная зона.\n     */\n    float depthDelta =\n      vViewZ - vCenterViewZ;\n\n    float frontBlend =\n      smoothstep(\n        -uDepthFeather,\n        uDepthFeather,\n        depthDelta\n      );\n\n    float backBlend =\n      1.0 - frontBlend;\n\n    float depthBlend = 1.0;\n\n    if (uDepthSide > 0.5) {\n      depthBlend = frontBlend;\n    } else if (uDepthSide < -0.5) {\n      depthBlend = backBlend;\n    }\n\n    if (depthBlend <= 0.001) {\n      discard;\n    }\n\n    float radial =\n      clamp(vUv.y, 0.0, 1.0);\n\n    float innerFeather =\n      smoothstep(\n        0.0,\n        0.075,\n        radial\n      );\n\n    float outerFeather =\n      1.0 -\n      smoothstep(\n        0.925,\n        1.0,\n        radial\n      );\n\n    float edgeMask =\n      innerFeather *\n      outerFeather;\n\n    /*\n     * Четыре широкие ледяные полосы.\n     */\n    float bandA =\n      softBand(\n        radial,\n        0.13,\n        0.15\n      );\n\n    float bandB =\n      softBand(\n        radial,\n        0.35,\n        0.2\n      );\n\n    float bandC =\n      softBand(\n        radial,\n        0.63,\n        0.22\n      );\n\n    float bandD =\n      softBand(\n        radial,\n        0.87,\n        0.14\n      );\n\n    float broadMass =\n      bandA * 0.74 +\n      bandB * 0.92 +\n      bandC * 1.0 +\n      bandD * 0.76;\n\n    /*\n     * Две тёмные щели между основными полосами.\n     */\n    float gapA =\n      softBand(\n        radial,\n        0.245,\n        0.055\n      );\n\n    float gapB =\n      softBand(\n        radial,\n        0.505,\n        0.07\n      );\n\n    float gapMask =\n      1.0 -\n      gapA * 0.74 -\n      gapB * 0.64;\n\n    float slowDrift =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 12.5664 -\n          uTime *\n            uFlowSpeed *\n            0.13 +\n          uOffset * 6.2831\n        );\n\n    float secondaryDrift =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 25.1327 -\n          uTime *\n            uShimmerSpeed *\n            0.045 +\n          radial * 4.6 +\n          uOffset * 9.0\n        );\n\n    float broadVariation =\n      0.5 +\n      0.5 *\n        sin(\n          radial * 17.0 +\n          vUv.x * 3.0 +\n          uOffset * 5.0\n        );\n\n    float fineDust =\n      0.5 +\n      0.5 *\n        sin(\n          radial * 74.0 -\n          vUv.x * 6.0 +\n          uOffset * 11.0\n        );\n\n    /*\n     * Небольшая общая дымка связывает полосы\n     * и убирает ощущение набора проводов.\n     */\n    float baseHaze =\n      edgeMask * 0.08;\n\n    float structure =\n      baseHaze +\n      broadMass *\n      gapMask *\n      (\n        0.78 +\n        broadVariation * 0.15 +\n        fineDust * 0.07\n      );\n\n    vec3 deepColor =\n      uBaseColor * 0.42;\n\n    vec3 middleColor =\n      uBaseColor * 0.76 +\n      vec3(\n        0.0,\n        0.018,\n        0.055\n      );\n\n    vec3 lightColor =\n      uBaseColor * 1.08 +\n      vec3(\n        0.015,\n        0.07,\n        0.13\n      );\n\n    vec3 color =\n      mix(\n        deepColor,\n        middleColor,\n        smoothstep(\n          0.16,\n          0.56,\n          structure\n        )\n      );\n\n    color =\n      mix(\n        color,\n        lightColor,\n        smoothstep(\n          0.55,\n          0.92,\n          structure\n        ) *\n        0.72\n      );\n\n    color *=\n      0.9 +\n      slowDrift * 0.075 +\n      secondaryDrift * 0.03;\n\n    /*\n     * Передняя и задняя части используют одинаковый цвет.\n     * Разница между ними теперь создаётся только глубиной,\n     * а не резким скачком яркости.\n     */\n    float alpha =\n      uOpacity *\n      edgeMask *\n      structure *\n      (\n        0.66 +\n        slowDrift * 0.1 +\n        secondaryDrift * 0.035\n      ) *\n      depthBlend;\n\n    gl_FragColor =\n      vec4(\n        color,\n        alpha\n      );\n  }\n";
function lr(e, t, n, r, i, a) {
	let o = Math.max(t * 8.4, e * .112), s = [], c = [], l = [];
	for (let t = 0; t <= 24; t += 1) {
		let l = t / 24, u = e + (l - .5) * o;
		for (let e = 0; e <= 256; e += 1) {
			let t = e / 256, o = t * Math.PI * 2, d = Math.sin(o * 3 + a * .73 + l * Math.PI) * i * .4;
			s.push(Math.cos(o) * u * n, Math.sin(o) * u * r, d), c.push(t, l);
		}
	}
	for (let e = 0; e < 24; e += 1) for (let t = 0; t < 256; t += 1) {
		let n = e * 257 + t, r = n + 257, i = r + 1, a = n + 1;
		l.push(n, r, a), l.push(r, i, a);
	}
	let d = new u.BufferGeometry();
	return d.setAttribute("position", new u.Float32BufferAttribute(s, 3)), d.setAttribute("uv", new u.Float32BufferAttribute(c, 2)), d.setIndex(l), d.computeVertexNormals(), d.computeBoundingSphere(), d;
}
function ur(e, t, n, r, i, a, o, s) {
	return {
		uTime: { value: 0 },
		uOpacity: { value: e * t },
		uFlowSpeed: { value: n },
		uShimmerSpeed: { value: r },
		uOffset: { value: i },
		uDepthSide: { value: o },
		uDepthFeather: { value: s },
		uBaseColor: { value: a.clone() }
	};
}
function dr(e, t, n) {
	let r = new u.ShaderMaterial({
		uniforms: e,
		vertexShader: sr,
		fragmentShader: cr,
		transparent: !0,
		depthWrite: !1,
		depthTest: t,
		side: u.DoubleSide,
		blending: u.NormalBlending
	});
	return r.name = n, r.toneMapped = !1, r;
}
function fr({ radius: r, thickness: s, ellipseX: l, ellipseY: u, tiltX: d, tiltY: f, tiltZ: p, wobble: m, seed: h, baseColor: g, opacity: _, flowSpeed: v, shimmerSpeed: y, offset: b, speed: x, glowFactor: S, splitDepthLayers: C = !0, dust: w }) {
	let T = n(null), E = t(() => lr(r, s, l, u, m, h), [
		r,
		s,
		l,
		u,
		m,
		h
	]), D = t(() => Math.max(s * 1.6, r * .035), [s, r]), O = t(() => ur(_, S, v, y, b, g, 0, D), [
		_,
		S,
		v,
		y,
		b,
		g,
		D
	]), k = t(() => ur(_, S, v, y, b, g, 1, D), [
		_,
		S,
		v,
		y,
		b,
		g,
		D
	]), A = t(() => ur(_, S, v, y, b, g, -1, D), [
		_,
		S,
		v,
		y,
		b,
		g,
		D
	]), j = t(() => dr(O, !0, "PlanetRingFullMaterial"), [
		O,
		sr,
		cr
	]), M = t(() => dr(k, !1, "PlanetRingFrontMaterial"), [
		k,
		sr,
		cr
	]), N = t(() => dr(A, !0, "PlanetRingBackMaterial"), [
		A,
		sr,
		cr
	]);
	return e(() => () => {
		E.dispose();
	}, [E]), e(() => () => {
		j.dispose();
	}, [j]), e(() => () => {
		M.dispose();
	}, [M]), e(() => () => {
		N.dispose();
	}, [N]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(x, .2);
		T.current && (T.current.rotation.set(d, f, p), T.current.scale.setScalar(1));
		let r = t * n;
		j.uniforms.uTime.value = r, M.uniforms.uTime.value = r, N.uniforms.uTime.value = r;
	}), /* @__PURE__ */ o("group", {
		ref: T,
		children: [C ? /* @__PURE__ */ o(i, { children: [/* @__PURE__ */ a("mesh", {
			geometry: E,
			renderOrder: 6,
			children: /* @__PURE__ */ a("primitive", {
				object: N,
				attach: "material"
			}, N.uuid)
		}), /* @__PURE__ */ a("mesh", {
			geometry: E,
			renderOrder: 18,
			children: /* @__PURE__ */ a("primitive", {
				object: M,
				attach: "material"
			}, M.uuid)
		})] }) : /* @__PURE__ */ a("mesh", {
			geometry: E,
			renderOrder: 6,
			children: /* @__PURE__ */ a("primitive", {
				object: j,
				attach: "material"
			}, j.uuid)
		}), w?.enabled ? /* @__PURE__ */ a(or, {
			radius: r,
			thickness: s,
			ellipseX: l,
			ellipseY: u,
			wobble: m,
			seed: h,
			baseColor: g,
			opacity: _,
			speed: x,
			glowFactor: S,
			density: w.density,
			size: w.size,
			brightness: w.brightness,
			motion: w.motion,
			tintRgb: w.tintRgb,
			splitDepthLayers: C
		}) : null]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PortalMembrane.tsx
var pr = "\n  varying vec2 vUv;\n  varying vec3 vViewPosition;\n\n  void main() {\n    vUv = uv;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vViewPosition = mvPosition.xyz;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", mr = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uFlowSpeed;\n  uniform float uTurbulence;\n  uniform float uPulse;\n  uniform float uLayer;\n  uniform float uPhase;\n  uniform float uDirection;\n  uniform vec3 uCoreColor;\n  uniform vec3 uGlowColor;\n  uniform vec3 uAccentColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n  varying vec3 vViewPosition;\n\n  float hash21(vec2 pointValue) {\n    pointValue = fract(pointValue * vec2(123.34, 345.45));\n    pointValue += dot(pointValue, pointValue + 34.345);\n    return fract(pointValue.x * pointValue.y);\n  }\n\n  float noise21(vec2 pointValue) {\n    vec2 integerPart = floor(pointValue);\n    vec2 fractionalPart = fract(pointValue);\n    fractionalPart =\n      fractionalPart *\n      fractionalPart *\n      (3.0 - 2.0 * fractionalPart);\n\n    float a = hash21(integerPart);\n    float b = hash21(integerPart + vec2(1.0, 0.0));\n    float c = hash21(integerPart + vec2(0.0, 1.0));\n    float d = hash21(integerPart + vec2(1.0, 1.0));\n\n    return mix(\n      mix(a, b, fractionalPart.x),\n      mix(c, d, fractionalPart.x),\n      fractionalPart.y\n    );\n  }\n\n  float fbm(vec2 pointValue) {\n    float value = 0.0;\n    float amplitude = 0.5;\n\n    for (int index = 0; index < 6; index++) {\n      value += noise21(pointValue) * amplitude;\n      pointValue =\n        pointValue * 2.03 +\n        vec2(17.1, 11.7);\n      amplitude *= 0.5;\n    }\n\n    return value;\n  }\n\n  float softBand(float value, float center, float width) {\n    return exp(-pow((value - center) / width, 2.0));\n  }\n\n  void main() {\n    vec2 pointValue = (vUv - 0.5) * 2.0;\n    float radiusValue = length(pointValue);\n\n    if (radiusValue > 1.0) {\n      discard;\n    }\n\n    float safeRadius = max(radiusValue, 0.045);\n    float angleValue = atan(pointValue.y, pointValue.x);\n\n    float timeValue =\n      uTime *\n      uFlowSpeed *\n      uDirection +\n      uPhase;\n\n    /*\n     * Пространственная закрутка отделена от времени. Раньше время\n     * умножалось на radial acceleration, из-за чего с каждой секундой\n     * вихрь становился всё плотнее и начинал давать муар и дрожание.\n     */\n    float inwardAcceleration =\n      1.0 +\n      pow(1.0 - radiusValue, 1.55) * 2.85;\n\n    float radialTwist =\n      pow(1.0 - radiusValue, 1.38) *\n      (2.7 + uLayer * 0.58);\n\n    float flowRotation =\n      timeValue *\n      (0.86 + uLayer * 0.24);\n\n    float boundedPull =\n      sin(\n        timeValue * 0.62 +\n        radiusValue * 5.4 +\n        uPhase\n      ) *\n      (1.0 - radiusValue) *\n      0.065;\n\n    float advectedAngle =\n      angleValue +\n      radialTwist +\n      flowRotation +\n      boundedPull;\n\n    vec2 rotatedPoint =\n      vec2(\n        cos(advectedAngle),\n        sin(advectedAngle)\n      ) * radiusValue;\n\n    vec2 broadPoint =\n      rotatedPoint *\n      (1.72 + uTurbulence * 1.08);\n\n    /*\n     * ВАЖНО: любые гармоники от atan-угла должны иметь целое\n     * количество повторов за полный оборот. Дробные множители\n     * создают разрыв на границе -PI / PI, который визуально\n     * превращается в движущийся конус от центра к краю.\n     */\n    broadPoint += vec2(\n      cos(\n        advectedAngle * 2.0 -\n        timeValue * 0.42\n      ),\n      sin(\n        advectedAngle * 3.0 +\n        timeValue * 0.34\n      )\n    ) * (0.11 + uTurbulence * 0.085);\n\n    /*\n     * Основной рисунок строится на крупных массах. Detail и micro\n     * сохранены, но больше не формируют мелкую песочную поверхность.\n     */\n    float broadNoise = fbm(\n      broadPoint +\n      timeValue * vec2(0.085, -0.058)\n    );\n\n    float detailNoise = fbm(\n      broadPoint * 1.82 -\n      timeValue * vec2(0.14, 0.085)\n    );\n\n    float microNoise = fbm(\n      broadPoint * 3.15 +\n      timeValue * vec2(-0.19, 0.13)\n    );\n\n    float spiralCoordinate =\n      advectedAngle * 4.0 -\n      log(safeRadius + 0.07) * 10.9 +\n      broadNoise * 4.25 +\n      detailNoise * 1.08;\n\n    float spiralWave =\n      0.5 +\n      0.5 * sin(spiralCoordinate);\n\n    float spiralWaveTwo =\n      0.5 +\n      0.5 * sin(\n        advectedAngle * 6.0 -\n        log(safeRadius + 0.09) * 14.6 +\n        timeValue *\n          (1.16 + uLayer * 0.16) +\n        radialTwist * 1.28 +\n        detailNoise * 2.85\n      );\n\n    float primaryFilament =\n      smoothstep(0.42, 0.89, spiralWave) *\n      (0.58 + spiralWaveTwo * 0.42);\n\n    float sharpFilament =\n      pow(\n        smoothstep(0.55, 0.93, spiralWaveTwo),\n        1.28\n      ) *\n      (0.78 + microNoise * 0.22);\n\n    /*\n     * Две широкие волны идут от внешнего края к горизонту. Их частота\n     * ниже прежней, поэтому движение читается как втягивание, а не шум.\n     */\n    float suctionPhase = fract(\n      radiusValue * 6.45 +\n      timeValue *\n        (1.42 + uLayer * 0.31) +\n      sin(\n        angleValue * 3.0 +\n        uPhase\n      ) * 0.085 +\n      broadNoise * 0.31\n    );\n\n    float suctionBand =\n      softBand(suctionPhase, 0.84, 0.118) *\n      smoothstep(0.12, 0.96, radiusValue);\n\n    float fastSuctionPhase = fract(\n      radiusValue * 10.4 +\n      timeValue *\n        (2.16 + uLayer * 0.44) +\n      sin(\n        advectedAngle * 4.0 -\n        uPhase\n      ) * 0.07 +\n      detailNoise * 0.22\n    );\n\n    float fastSuctionBand =\n      softBand(\n        fastSuctionPhase,\n        0.88,\n        0.082\n      ) *\n      smoothstep(0.17, 0.94, radiusValue);\n\n    float inwardStreaks =\n      (\n        suctionBand * 0.78 +\n        fastSuctionBand * 0.5\n      ) *\n      (\n        0.42 +\n        primaryFilament * 0.46 +\n        sharpFilament * 0.22\n      ) *\n      (\n        0.74 +\n        (1.0 - radiusValue) * 1.08\n      );\n\n    float angularStreaks =\n      pow(\n        0.5 +\n        0.5 * sin(\n          advectedAngle * 14.0 +\n          detailNoise * 2.55 -\n          timeValue * 1.82\n        ),\n        2.65\n      ) *\n      inwardStreaks;\n\n    float softCloud =\n      broadNoise * 0.78 +\n      detailNoise * 0.205 +\n      microNoise * 0.015;\n\n    float centerVoid =\n      smoothstep(0.07, 0.255, radiusValue);\n\n    float horizonRadius =\n      0.222 +\n      (broadNoise - 0.5) * 0.015 +\n      sin(\n        timeValue * 2.0 +\n        angleValue * 4.0\n      ) * 0.004;\n\n    float eventHorizon =\n      1.0 -\n      smoothstep(\n        0.014,\n        0.059,\n        abs(radiusValue - horizonRadius)\n      );\n\n    float innerHalo =\n      softBand(radiusValue, 0.36, 0.205);\n\n    float sinkGlow =\n      softBand(radiusValue, 0.292, 0.122) *\n      (\n        0.66 +\n        primaryFilament * 0.34\n      );\n\n    float outerRim =\n      1.0 -\n      smoothstep(\n        0.014,\n        0.052,\n        abs(radiusValue - 0.92)\n      );\n\n    float outerFalloff =\n      1.0 -\n      smoothstep(0.84, 1.0, radiusValue);\n\n    float perspectiveShade =\n      0.93 +\n      clamp(\n        -vViewPosition.z * 0.015,\n        -0.05,\n        0.08\n      );\n\n    float pulseValue =\n      1.0 +\n      sin(\n        uTime * 1.16 +\n        broadNoise * 2.4 +\n        uPhase\n      ) *\n      uPulse;\n\n    float energy =\n      softCloud * 0.12 +\n      primaryFilament * 0.54 +\n      sharpFilament * 0.145 +\n      innerHalo * 0.14 +\n      inwardStreaks * 0.7 +\n      angularStreaks * 0.18 +\n      sinkGlow * 0.27;\n\n    vec3 deepColor = mix(\n      uAccentColor * 0.075,\n      uCoreColor * 0.14,\n      0.32\n    );\n\n    vec3 color = mix(\n      deepColor,\n      uGlowColor,\n      clamp(energy, 0.0, 1.0)\n    );\n\n    color = mix(\n      color,\n      uCoreColor,\n      sinkGlow * 0.34 +\n      innerHalo * 0.16\n    );\n\n    color = mix(\n      color,\n      uHotColor,\n      eventHorizon *\n        (0.76 + uLayer * 0.1) +\n      inwardStreaks * 0.15 +\n      angularStreaks * 0.18 +\n      outerRim * 0.12 +\n      sharpFilament * 0.08 * uLayer\n    );\n\n    float centerDarkening =\n      mix(0.028, 1.0, centerVoid);\n\n    color *=\n      centerDarkening *\n      perspectiveShade *\n      pulseValue;\n\n    float bodyAlpha =\n      outerFalloff *\n      centerVoid *\n      (\n        0.075 +\n        softCloud * 0.1 +\n        primaryFilament * 0.36 +\n        sharpFilament * 0.12 +\n        innerHalo * 0.13 +\n        inwardStreaks * 0.48 +\n        angularStreaks * 0.14\n      );\n\n    float alpha =\n      uOpacity *\n      (\n        bodyAlpha +\n        eventHorizon * 0.34 +\n        outerRim * 0.14\n      ) *\n      pulseValue;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function hr(e) {
	switch (e) {
		case "low": return 56;
		case "high": return 160;
		default: return 96;
	}
}
function gr(e, t, n, r, i, a, o) {
	return {
		uTime: { value: 0 },
		uOpacity: { value: t * o * e.opacityScale },
		uFlowSpeed: { value: n * e.flowScale },
		uTurbulence: { value: r * e.turbulenceScale },
		uPulse: { value: i * e.pulseScale },
		uLayer: { value: e.layer },
		uPhase: { value: e.phase },
		uDirection: { value: e.direction },
		uCoreColor: { value: a.core.clone() },
		uGlowColor: { value: a.glow.clone() },
		uAccentColor: { value: a.accent.clone() },
		uHotColor: { value: a.hot.clone() }
	};
}
function _r(e, t) {
	let n = new u.ShaderMaterial({
		uniforms: e,
		vertexShader: pr,
		fragmentShader: mr,
		transparent: !0,
		depthTest: !0,
		depthWrite: !1,
		side: u.DoubleSide,
		blending: t.blending
	});
	return n.name = `PortalMembrane-${t.name}`, n.toneMapped = !1, n;
}
var vr = {
	name: "back",
	opacityScale: .96,
	flowScale: 1.08,
	turbulenceScale: .9,
	pulseScale: .55,
	layer: .08,
	phase: 0,
	direction: 1,
	blending: u.NormalBlending
}, yr = {
	name: "middle",
	opacityScale: .64,
	flowScale: 1.58,
	turbulenceScale: 1.02,
	pulseScale: .72,
	layer: .56,
	phase: 2.15,
	direction: 1,
	blending: u.AdditiveBlending
}, br = {
	name: "front",
	opacityScale: .44,
	flowScale: 2.08,
	turbulenceScale: 1.12,
	pulseScale: .84,
	layer: 1,
	phase: 4.35,
	direction: 1,
	blending: u.AdditiveBlending
};
function xr({ radius: r, opacity: i, flowSpeed: s, turbulence: l, pulse: d, depth: f, colors: p, quality: m, speed: h, glowFactor: g }) {
	let _ = n(null), v = n(null), y = n(null), b = t(() => new u.CircleGeometry(r, hr(m)), [m, r]), x = t(() => gr(vr, i, s, l, d, p, g), [
		p,
		s,
		g,
		i,
		d,
		l
	]), S = t(() => gr(yr, i, s, l, d, p, g), [
		p,
		s,
		g,
		i,
		d,
		l
	]), C = t(() => gr(br, i, s, l, d, p, g), [
		p,
		s,
		g,
		i,
		d,
		l
	]), w = t(() => _r(x, vr), [x]), T = t(() => _r(S, yr), [S]), E = t(() => _r(C, br), [C]);
	return e(() => () => {
		b.dispose(), w.dispose(), T.dispose(), E.dispose();
	}, [
		w,
		E,
		b,
		T
	]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(h, .2), r = t * n;
		if (w.uniforms.uTime.value = r, T.uniforms.uTime.value = r + 1.25, E.uniforms.uTime.value = r + 2.7, _.current && (_.current.rotation.z = t * .034 * n), v.current) {
			v.current.rotation.z = t * .061 * n;
			let e = .975 + Math.sin(t * .94 * n) * .0045;
			v.current.scale.set(e, e, 1);
		}
		if (y.current) {
			y.current.rotation.z = t * .092 * n;
			let e = .94 + Math.sin(t * 1.24 * n + 1.2) * .006;
			y.current.scale.set(e, e, 1);
		}
	}), /* @__PURE__ */ o("group", { children: [
		/* @__PURE__ */ a("mesh", {
			ref: _,
			geometry: b,
			position: [
				0,
				0,
				-f * .5
			],
			renderOrder: 4,
			children: /* @__PURE__ */ a("primitive", {
				object: w,
				attach: "material"
			})
		}),
		/* @__PURE__ */ a("mesh", {
			ref: v,
			geometry: b,
			position: [
				0,
				0,
				-f * .06
			],
			scale: [
				.975,
				.975,
				1
			],
			renderOrder: 9,
			children: /* @__PURE__ */ a("primitive", {
				object: T,
				attach: "material"
			})
		}),
		/* @__PURE__ */ a("mesh", {
			ref: y,
			geometry: b,
			position: [
				0,
				0,
				f * .28
			],
			scale: [
				.94,
				.94,
				1
			],
			renderOrder: 14,
			children: /* @__PURE__ */ a("primitive", {
				object: E,
				attach: "material"
			})
		})
	] });
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PortalRing.tsx
var Sr = 1.3, Cr = "\n  varying vec2 vUv;\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec2 vWorldPosition;\n\n  void main() {\n    vUv = uv;\n\n    vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n    vec4 mvPosition = viewMatrix * worldPosition;\n\n    vViewPosition = mvPosition.xyz;\n    vViewNormal = normalize(normalMatrix * normal);\n\n    /*\n     * Передаём непрерывные координаты, а не уже вычисленный угол.\n     * Угол, интерполированный между вершинами около -PI / PI, создавал\n     * заметную радиальную линию-склейку на вращающихся кольцах.\n     */\n    vWorldPosition = worldPosition.xy;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", wr = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uPhase;\n  uniform float uAccentMix;\n  uniform float uHotMix;\n  uniform float uRingRole;\n  uniform vec3 uBaseColor;\n  uniform vec3 uAccentColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec2 vWorldPosition;\n\n  float loopDistance(float a, float b) {\n    float distanceValue = abs(a - b);\n    return min(distanceValue, 1.0 - distanceValue);\n  }\n\n  void main() {\n    vec3 viewDirection = normalize(-vViewPosition);\n    vec3 normalValue = normalize(vViewNormal);\n\n    float fresnel = pow(\n      1.0 -\n      abs(dot(normalValue, viewDirection)),\n      1.62\n    );\n\n    float faceLight = pow(\n      clamp(\n        dot(\n          normalValue,\n          normalize(vec3(-0.36, 0.58, 0.74))\n        ) * 0.5 + 0.5,\n        0.0,\n        1.0\n      ),\n      1.28\n    );\n\n    float worldAngle =\n      atan(vWorldPosition.y, vWorldPosition.x) /\n      6.28318530718 +\n      0.5;\n\n    float along = fract(\n      worldAngle +\n      uPhase -\n      uTime * (0.052 + uRingRole * 0.019)\n    );\n\n    float hotHead = exp(\n      -pow(\n        loopDistance(along, 0.19) / 0.032,\n        2.0\n      )\n    );\n\n    float warmTail = exp(\n      -pow(\n        loopDistance(along, 0.285) / 0.13,\n        2.0\n      )\n    ) * 0.3;\n\n    float secondaryHead = exp(\n      -pow(\n        loopDistance(along, 0.67) / 0.055,\n        2.0\n      )\n    ) *\n      (0.24 + uRingRole * 0.08);\n\n    float crossSection =\n      abs(vUv.y - 0.5) * 2.0;\n\n    float tubeBand = pow(\n      max(1.0 - crossSection, 0.0),\n      0.4\n    );\n\n    float edgeBand =\n      1.0 -\n      smoothstep(0.78, 1.0, crossSection);\n\n    float technicalScan =\n      0.5 +\n      0.5 * sin(\n        vUv.x * 17.0 -\n        uTime * 0.68 +\n        vUv.y * 5.0 +\n        uPhase * 6.2831\n      );\n\n    float machinedBand =\n      0.5 +\n      0.5 * sin(\n        vUv.x * 46.0 +\n        vUv.y * 8.0 +\n        uPhase * 11.0\n      );\n\n    float microBand =\n      0.5 +\n      0.5 * sin(\n        vUv.y * 36.0 +\n        vUv.x * 5.0 +\n        uPhase * 9.0\n      );\n\n    vec3 metalShadow = mix(\n      uAccentColor * 0.075,\n      uBaseColor * 0.065,\n      0.45\n    );\n\n    vec3 metalBody = mix(\n      uAccentColor *\n        (0.32 + uAccentMix * 0.13),\n      uBaseColor *\n        (0.38 + uRingRole * 0.08),\n      0.36\n    );\n\n    float metalLight = clamp(\n      0.14 +\n      faceLight * 0.5 +\n      fresnel * 0.52 +\n      technicalScan * 0.07 +\n      machinedBand * 0.028,\n      0.0,\n      1.0\n    );\n\n    vec3 color = mix(\n      metalShadow,\n      metalBody,\n      metalLight\n    );\n\n    color +=\n      uBaseColor *\n      (\n        fresnel *\n          (0.12 + uRingRole * 0.035) +\n        microBand * 0.022\n      );\n\n    float hotAmount = clamp(\n      (\n        hotHead * 0.9 +\n        warmTail * 0.34 +\n        secondaryHead * 0.5\n      ) *\n      uHotMix +\n      fresnel *\n        (0.045 + uRingRole * 0.022),\n      0.0,\n      0.88\n    );\n\n    color = mix(\n      color,\n      uHotColor,\n      hotAmount\n    );\n\n    float alpha =\n      uOpacity *\n      tubeBand *\n      edgeBand *\n      (\n        0.76 +\n        fresnel * 0.2 +\n        faceLight * 0.09 +\n        hotHead * 0.12 +\n        secondaryHead * 0.05\n      );\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function Tr(e) {
	switch (e) {
		case "low": return {
			radialSegments: 6,
			tubularSegments: 26
		};
		case "high": return {
			radialSegments: 14,
			tubularSegments: 88
		};
		default: return {
			radialSegments: 9,
			tubularSegments: 54
		};
	}
}
function Er({ config: r, colors: s, quality: l, speed: d, glowFactor: f, index: p }) {
	let m = n(null), h = Math.max(3, Math.round(r.segments)), g = Math.PI * 2 / h, _ = g * u.MathUtils.clamp(1 - r.gapRatio, .5, .997), v = Tr(l), y = t(() => new u.TorusGeometry(r.radius, r.thickness, v.radialSegments, v.tubularSegments, _), [
		r.radius,
		r.thickness,
		v.radialSegments,
		v.tubularSegments,
		_
	]), b = t(() => new u.TorusGeometry(r.radius, Math.max(r.thickness * .145, .0042), Math.max(v.radialSegments - 2, 4), v.tubularSegments, _ * .7), [
		r.radius,
		r.thickness,
		v.radialSegments,
		v.tubularSegments,
		_
	]), x = t(() => new u.TorusGeometry(r.radius, Math.max(r.thickness * .2, .005), Math.max(v.radialSegments - 2, 4), Math.max(Math.round(v.tubularSegments * .48), 18), _ * .2), [
		r.radius,
		r.thickness,
		v.radialSegments,
		v.tubularSegments,
		_
	]), S = u.MathUtils.clamp(p / 2, 0, 1), C = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: r.opacity * f },
		uPhase: { value: r.phase },
		uAccentMix: { value: r.accentMix },
		uHotMix: { value: r.hotMix },
		uRingRole: { value: S },
		uBaseColor: { value: s.glow.clone() },
		uAccentColor: { value: s.accent.clone() },
		uHotColor: { value: s.hot.clone() }
	}), [
		s,
		r.accentMix,
		r.hotMix,
		r.opacity,
		r.phase,
		f,
		S
	]), w = t(() => {
		let e = new u.ShaderMaterial({
			uniforms: C,
			vertexShader: Cr,
			fragmentShader: wr,
			transparent: !0,
			depthTest: !0,
			depthWrite: !0,
			side: u.DoubleSide,
			blending: u.NormalBlending
		});
		return e.name = `PortalRingMaterial-${p}`, e.toneMapped = !1, e;
	}, [p, C]), T = t(() => s.glow.clone().lerp(s.hot, .36), [s.glow, s.hot]), E = t(() => s.hot.clone().lerp(s.glow, .18), [s.glow, s.hot]), D = t(() => s.hot.clone().lerp(s.glow, .2 + S * .14), [
		s.hot,
		s.glow,
		S
	]), O = t(() => s.accent.clone().multiplyScalar(.16), [s.accent]), k = t(() => {
		let e = new u.MeshBasicMaterial({
			color: T,
			transparent: !0,
			opacity: r.opacity * f * (.27 + S * .04),
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			side: u.DoubleSide,
			toneMapped: !1
		});
		return e.name = `PortalRingRailMaterial-${p}`, e;
	}, [
		r.opacity,
		f,
		p,
		T,
		S
	]), A = t(() => {
		let e = new u.MeshBasicMaterial({
			color: E,
			transparent: !0,
			opacity: r.opacity * f * .5,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			side: u.DoubleSide,
			toneMapped: !1
		});
		return e.name = `PortalRingPulseMaterial-${p}`, e;
	}, [
		r.opacity,
		f,
		p,
		E
	]);
	e(() => () => {
		y.dispose(), b.dispose(), x.dispose(), w.dispose(), k.dispose(), A.dispose();
	}, [
		y,
		w,
		x,
		A,
		b,
		k
	]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(d, .2);
		m.current && (m.current.position.z = r.depthOffset, m.current.rotation.set(r.tiltX, r.tiltY, r.tiltZ + t * r.spinSpeed * r.direction * n * Sr + r.phase)), w.uniforms.uTime.value = t * n, w.uniforms.uOpacity.value = r.opacity * f * (.99 + Math.sin(t * .44 + p * 1.37) * .016), k.opacity = r.opacity * f * (.21 + S * .04 + (.5 + .5 * Math.sin(t * (1.1 + S * .22) * n + r.phase * 8)) * .18), A.opacity = r.opacity * f * (.3 + (.5 + .5 * Math.sin(t * (1.54 + S * .28) * n + r.phase * 11)) * .4);
	});
	let j = Math.max(1, Math.round(r.markerEvery)), M = (.5 - S * .12) * r.opacity * f;
	return /* @__PURE__ */ a("group", {
		ref: m,
		children: Array.from({ length: h }, (e, t) => {
			let n = t * g, s = t % j === 0, c = n + _ * .93, l = n + _ * .15, d = n + _ * (.18 + (t + p) % 3 * .17);
			return /* @__PURE__ */ o("group", { children: [
				/* @__PURE__ */ a("mesh", {
					geometry: y,
					rotation: [
						0,
						0,
						n
					],
					children: /* @__PURE__ */ a("primitive", {
						object: w,
						attach: "material"
					})
				}),
				/* @__PURE__ */ a("mesh", {
					geometry: b,
					rotation: [
						0,
						0,
						l
					],
					position: [
						0,
						0,
						r.thickness * .52
					],
					renderOrder: 18,
					children: /* @__PURE__ */ a("primitive", {
						object: k,
						attach: "material"
					})
				}),
				s ? /* @__PURE__ */ o(i, { children: [
					/* @__PURE__ */ a("mesh", {
						geometry: x,
						rotation: [
							0,
							0,
							d
						],
						position: [
							0,
							0,
							r.thickness * .72
						],
						renderOrder: 20,
						children: /* @__PURE__ */ a("primitive", {
							object: A,
							attach: "material"
						})
					}),
					/* @__PURE__ */ o("mesh", {
						position: [
							Math.cos(c) * r.radius,
							Math.sin(c) * r.radius,
							r.thickness * .62
						],
						rotation: [
							0,
							0,
							c
						],
						renderOrder: 19,
						children: [/* @__PURE__ */ a("boxGeometry", { args: [
							r.thickness * .64,
							r.thickness * (1.52 - S * .18),
							r.thickness * .32
						] }), /* @__PURE__ */ a("meshBasicMaterial", {
							color: O,
							transparent: !0,
							opacity: .82 * r.opacity,
							toneMapped: !1,
							depthWrite: !0
						})]
					}),
					/* @__PURE__ */ o("mesh", {
						position: [
							Math.cos(c) * r.radius,
							Math.sin(c) * r.radius,
							r.thickness * .88
						],
						rotation: [
							0,
							0,
							c
						],
						renderOrder: 21,
						children: [/* @__PURE__ */ a("boxGeometry", { args: [
							r.thickness * .26,
							r.thickness * (.9 - S * .1),
							r.thickness * .11
						] }), /* @__PURE__ */ a("meshBasicMaterial", {
							color: D,
							transparent: !0,
							opacity: M,
							toneMapped: !1,
							depthWrite: !1,
							blending: u.AdditiveBlending
						})]
					})
				] }) : null
			] }, `${p}-portal-segment-${t}`);
		})
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PortalGate.tsx
var Dr = 1.3;
function Or() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,0.72)"), n.addColorStop(.28, "rgba(255,255,255,0.34)"), n.addColorStop(.62, "rgba(255,255,255,0.08)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new u.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = u.LinearFilter, r.magFilter = u.LinearFilter, r;
}
function kr(e) {
	return {
		radial: e === "high" ? 14 : e === "low" ? 7 : 10,
		tubular: e === "high" ? 128 : e === "low" ? 56 : 88
	};
}
function Ar({ config: r, colors: i, quality: s, speed: l, glowFactor: d }) {
	let f = n(null), p = n(null), m = n(null), h = n(null), g = n(null), _ = n(null), v = n(null), y = t(() => Or(), []), b = r.rings[0]?.radius ?? r.membraneRadius * 1.64, x = r.rings[1]?.radius ?? r.membraneRadius * 1.33, S = r.rings[2]?.radius ?? r.membraneRadius * 1.11, C = Math.max(6, Math.round(r.rings[0]?.segments ?? 10)), w = Math.max(8, Math.round((r.rings[1]?.segments ?? 16) * .75)), T = Math.PI * 2 / C, E = Math.PI * 2 / w, D = T * .73, O = E * .62, k = D * .72, A = O * .68, j = x + Math.max(r.rings[1]?.thickness ?? .04, .035) * 1.35, M = b - Math.max(r.rings[0]?.thickness ?? .08, .06) * 1.28, N = r.membraneRadius * 1.055, P = Math.max(S - Math.max(r.rings[2]?.thickness ?? .018, .016) * 1.8, N + .045), ee = t(() => new u.RingGeometry(j, M, s === "high" ? 48 : 30, 1, 0, D), [
		D,
		j,
		M,
		s
	]), F = t(() => new u.RingGeometry(N, P, s === "high" ? 42 : 26, 1, 0, O), [
		O,
		N,
		P,
		s
	]), te = t(() => new u.RingGeometry(Math.max(M - .024, j + .01), Math.max(M - .005, j + .027), s === "high" ? 48 : 30, 1, 0, k), [
		k,
		j,
		M,
		s
	]), I = t(() => new u.RingGeometry(N + .005, Math.min(N + .022, P - .007), s === "high" ? 42 : 26, 1, 0, A), [
		A,
		N,
		P,
		s
	]), L = Math.max(j - P - .03 * 2, .05), ne = t(() => new u.BoxGeometry(L, .026, .02), [L]), re = t(() => new u.BoxGeometry(L * .58, .008, .006), [L]), R = t(() => new u.BoxGeometry(L * .2, .012, .008), [L]), z = t(() => i.glow.clone().lerp(i.hot, .34), [i.glow, i.hot]), B = t(() => i.accent.clone().multiplyScalar(.16).lerp(i.glow.clone().multiplyScalar(.12), .26), [i.accent, i.glow]), ie = t(() => i.accent.clone().lerp(i.glow, .22).multiplyScalar(.56), [i.accent, i.glow]), ae = t(() => i.accent.clone().multiplyScalar(.055), [i.accent]), oe = t(() => i.glow.clone().lerp(i.hot, .38), [i.glow, i.hot]), se = t(() => i.hot.clone().lerp(i.glow, .12), [i.glow, i.hot]), ce = t(() => {
		let e = new u.MeshBasicMaterial({
			color: B,
			transparent: !0,
			opacity: .72,
			side: u.DoubleSide,
			depthTest: !0,
			depthWrite: !0,
			toneMapped: !1
		});
		return e.name = "PortalGateHousingMaterial", e;
	}, [B]), le = t(() => {
		let e = new u.MeshBasicMaterial({
			color: ie,
			transparent: !0,
			opacity: .34,
			side: u.DoubleSide,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateInnerHousingMaterial", e;
	}, [ie]), ue = t(() => {
		let e = new u.MeshBasicMaterial({
			color: B.clone().multiplyScalar(.8),
			transparent: !0,
			opacity: .82,
			depthTest: !0,
			depthWrite: !0,
			toneMapped: !1
		});
		return e.name = "PortalGateBridgeMaterial", e;
	}, [B]), V = t(() => {
		let e = new u.MeshBasicMaterial({
			color: z,
			transparent: !0,
			opacity: .52 * d,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateBridgeLightMaterial", e;
	}, [d, z]), de = t(() => {
		let e = new u.MeshBasicMaterial({
			color: se,
			transparent: !0,
			opacity: .64 * d,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateBridgeHotMaterial", e;
	}, [se, d]), fe = t(() => {
		let e = new u.MeshBasicMaterial({
			color: oe,
			transparent: !0,
			opacity: .4 * d,
			side: u.DoubleSide,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateOuterPanelGlowMaterial", e;
	}, [d, oe]), H = t(() => {
		let e = new u.MeshBasicMaterial({
			color: z,
			transparent: !0,
			opacity: .44 * d,
			side: u.DoubleSide,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateInnerPanelGlowMaterial", e;
	}, [d, z]), pe = t(() => {
		let e = new u.MeshBasicMaterial({
			color: i.hot,
			transparent: !0,
			opacity: .62 * d,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateRimPulseMaterialA", e;
	}, [i.hot, d]), me = t(() => {
		let e = new u.MeshBasicMaterial({
			color: z,
			transparent: !0,
			opacity: .46 * d,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateRimPulseMaterialB", e;
	}, [d, z]), he = t(() => {
		let e = new u.MeshBasicMaterial({
			color: i.glow,
			transparent: !0,
			opacity: .34 * d,
			blending: u.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateRimPulseMaterialC", e;
	}, [i.glow, d]);
	e(() => () => {
		y?.dispose(), ee.dispose(), F.dispose(), te.dispose(), I.dispose(), ne.dispose(), re.dispose(), R.dispose(), ce.dispose(), le.dispose(), ue.dispose(), V.dispose(), de.dispose(), fe.dispose(), H.dispose(), pe.dispose(), me.dispose(), he.dispose();
	}, [
		ne,
		R,
		de,
		re,
		V,
		ue,
		ce,
		le,
		F,
		I,
		H,
		ee,
		te,
		fe,
		y,
		pe,
		me,
		he
	]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(l, .2);
		f.current && f.current.rotation.set(r.frameTiltX + Math.sin(t * .13 * n) * .007, r.frameTiltY + Math.cos(t * .1 * n) * .009, r.frameTiltZ + t * r.frameRotationSpeed * n + Math.sin(t * .08 * n) * .006), p.current && (p.current.rotation.z = -t * .008 * n * Dr), m.current && (m.current.rotation.z = t * .014 * n * Dr), h.current && (h.current.rotation.z = t * .11 * n), g.current && (g.current.rotation.z = t * .58 * n), _.current && (_.current.rotation.z = t * .39 * n + 2.2), v.current && (v.current.rotation.z = t * .76 * n + 4.1);
		let i = .5 + .5 * Math.sin(t * .84 * n), a = .5 + .5 * Math.sin(t * 1.22 * n + 1.7);
		le.opacity = .27 + i * .09, V.opacity = (.4 + i * .3) * d, de.opacity = (.36 + a * .46) * d, fe.opacity = (.3 + i * .28) * d, H.opacity = (.32 + a * .3) * d, pe.opacity = (.44 + i * .34) * d, me.opacity = (.3 + a * .3) * d, he.opacity = (.2 + i * .22) * d;
	});
	let U = kr(s), ge = (P + j) / 2, W = T * .5 + .02, _e = r.membraneRadius * 1.005;
	return /* @__PURE__ */ o("group", {
		ref: f,
		children: [
			y ? /* @__PURE__ */ a("sprite", {
				position: [
					0,
					0,
					-r.membraneDepth * .92
				],
				scale: [
					r.membraneRadius * 3.45,
					r.membraneRadius * 3.45,
					1
				],
				renderOrder: 1,
				children: /* @__PURE__ */ a("spriteMaterial", {
					map: y,
					color: i.glow.clone().lerp(i.accent, .2),
					transparent: !0,
					opacity: .15 * d,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})
			}) : null,
			/* @__PURE__ */ o("mesh", {
				position: [
					0,
					0,
					-r.membraneDepth * .7
				],
				renderOrder: 2,
				children: [/* @__PURE__ */ a("circleGeometry", { args: [r.membraneRadius * 1.025, s === "high" ? 128 : 72] }), /* @__PURE__ */ a("meshBasicMaterial", {
					color: ae,
					transparent: !0,
					opacity: .9,
					depthWrite: !1,
					side: u.DoubleSide,
					toneMapped: !1
				})]
			}),
			/* @__PURE__ */ a(xr, {
				radius: r.membraneRadius,
				opacity: r.membraneOpacity,
				flowSpeed: r.membraneFlowSpeed,
				turbulence: r.membraneTurbulence,
				pulse: r.membranePulse,
				depth: r.membraneDepth,
				colors: i,
				quality: s,
				speed: l,
				glowFactor: d
			}),
			/* @__PURE__ */ a("group", {
				ref: m,
				position: [
					0,
					0,
					-r.membraneDepth * .03
				],
				renderOrder: 7,
				children: Array.from({ length: w }, (e, t) => {
					let n = t * E + .08, r = n + (O - A) / 2;
					return /* @__PURE__ */ o("group", { children: [/* @__PURE__ */ a("mesh", {
						geometry: F,
						rotation: [
							0,
							0,
							n
						],
						children: /* @__PURE__ */ a("primitive", {
							object: le,
							attach: "material"
						})
					}), /* @__PURE__ */ a("mesh", {
						geometry: I,
						rotation: [
							0,
							0,
							r
						],
						position: [
							0,
							0,
							.006
						],
						renderOrder: 13,
						children: /* @__PURE__ */ a("primitive", {
							object: H,
							attach: "material"
						})
					})] }, `portal-inner-panel-${t}`);
				})
			}),
			/* @__PURE__ */ o("group", {
				ref: p,
				position: [
					0,
					0,
					-r.membraneDepth * .2
				],
				renderOrder: 6,
				children: [Array.from({ length: C }, (e, t) => {
					let n = t * T + .025, r = n + (D - k) / 2;
					return /* @__PURE__ */ o("group", { children: [/* @__PURE__ */ a("mesh", {
						geometry: ee,
						rotation: [
							0,
							0,
							n
						],
						children: /* @__PURE__ */ a("primitive", {
							object: ce,
							attach: "material"
						})
					}), /* @__PURE__ */ a("mesh", {
						geometry: te,
						rotation: [
							0,
							0,
							r
						],
						position: [
							0,
							0,
							.008
						],
						renderOrder: 12,
						children: /* @__PURE__ */ a("primitive", {
							object: fe,
							attach: "material"
						})
					})] }, `portal-outer-panel-${t}`);
				}), Array.from({ length: 6 }, (e, t) => {
					let n = t * (Math.PI * 2 / 6) + W, r = t % 2 == 0;
					return /* @__PURE__ */ o("group", {
						rotation: [
							0,
							0,
							n
						],
						children: [
							/* @__PURE__ */ a("mesh", {
								geometry: ne,
								position: [
									ge,
									0,
									-.014
								],
								renderOrder: 5,
								children: /* @__PURE__ */ a("primitive", {
									object: ue,
									attach: "material"
								})
							}),
							/* @__PURE__ */ a("mesh", {
								geometry: re,
								position: [
									ge,
									0,
									.004
								],
								renderOrder: 13,
								children: /* @__PURE__ */ a("primitive", {
									object: V,
									attach: "material"
								})
							}),
							r ? /* @__PURE__ */ a("mesh", {
								geometry: R,
								position: [
									ge + L * .12,
									0,
									.009
								],
								renderOrder: 15,
								children: /* @__PURE__ */ a("primitive", {
									object: de,
									attach: "material"
								})
							}) : null
						]
					}, `portal-bridge-${t}`);
				})]
			}),
			/* @__PURE__ */ o("group", {
				ref: h,
				position: [
					0,
					0,
					r.membraneDepth * .34
				],
				renderOrder: 17,
				children: [
					/* @__PURE__ */ o("mesh", { children: [/* @__PURE__ */ a("torusGeometry", { args: [
						_e,
						.015,
						U.radial,
						U.tubular
					] }), /* @__PURE__ */ a("meshBasicMaterial", {
						color: z,
						transparent: !0,
						opacity: .48 * d,
						blending: u.AdditiveBlending,
						depthWrite: !1,
						toneMapped: !1
					})] }),
					/* @__PURE__ */ o("mesh", {
						scale: [
							1.028,
							1.028,
							1
						],
						renderOrder: 16,
						children: [/* @__PURE__ */ a("torusGeometry", { args: [
							_e,
							.006,
							U.radial,
							U.tubular
						] }), /* @__PURE__ */ a("meshBasicMaterial", {
							color: i.glow,
							transparent: !0,
							opacity: .24 * d,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})]
					}),
					/* @__PURE__ */ a("group", {
						ref: g,
						children: /* @__PURE__ */ o("mesh", {
							renderOrder: 22,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								_e,
								.012,
								U.radial,
								Math.max(Math.round(U.tubular * .42), 28),
								.58
							] }), /* @__PURE__ */ a("primitive", {
								object: pe,
								attach: "material"
							})]
						})
					}),
					/* @__PURE__ */ a("group", {
						ref: _,
						children: /* @__PURE__ */ o("mesh", {
							renderOrder: 21,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								_e * 1.018,
								.008,
								U.radial,
								Math.max(Math.round(U.tubular * .36), 24),
								.4
							] }), /* @__PURE__ */ a("primitive", {
								object: me,
								attach: "material"
							})]
						})
					}),
					/* @__PURE__ */ a("group", {
						ref: v,
						children: /* @__PURE__ */ o("mesh", {
							renderOrder: 20,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								_e * .987,
								.006,
								U.radial,
								Math.max(Math.round(U.tubular * .28), 20),
								.28
							] }), /* @__PURE__ */ a("primitive", {
								object: he,
								attach: "material"
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ o("mesh", {
				position: [
					0,
					0,
					r.membraneDepth * .21
				],
				renderOrder: 15,
				children: [/* @__PURE__ */ a("torusGeometry", { args: [
					r.membraneRadius * .938,
					.0065,
					U.radial,
					U.tubular
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					color: i.glow,
					transparent: !0,
					opacity: .14 * d,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			}),
			r.rings.map((e, t) => /* @__PURE__ */ a(Er, {
				config: e,
				colors: i,
				quality: s,
				speed: l,
				glowFactor: d,
				index: t
			}, `portal-ring-${t}`))
		]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/OrbitalScene.tsx
function jr(e) {
	return new u.Color(`rgb(${e.split(" ").join(", ")})`);
}
function $(e, t) {
	return `rgba(${Math.round(e.r * 255)}, ${Math.round(e.g * 255)}, ${Math.round(e.b * 255)}, ${t})`;
}
function Mr(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.16;
		default: return 1;
	}
}
function Nr() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.12, "rgba(255,255,255,0.96)"), n.addColorStop(.26, "rgba(255,255,255,0.76)"), n.addColorStop(.5, "rgba(255,255,255,0.22)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new u.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = u.LinearFilter, r.magFilter = u.LinearFilter, r;
}
function Pr(e, t, n) {
	if (typeof document > "u") return null;
	let r = 1024, i = document.createElement("canvas");
	i.width = r, i.height = r;
	let a = i.getContext("2d");
	if (!a) return null;
	r / 2;
	let o = t.clone().lerp(n, .32), s = a.createRadialGradient(512, 512, 0, 512, 512, 512);
	s.addColorStop(0, "rgba(255,255,255,1)"), s.addColorStop(.08, "rgba(255,255,255,0.998)"), s.addColorStop(.2, "rgba(245,252,255,0.99)"), s.addColorStop(.38, $(e, .96)), s.addColorStop(.6, $(t, .74)), s.addColorStop(.82, $(o, .24)), s.addColorStop(1, $(o, 0)), a.clearRect(0, 0, r, r), a.fillStyle = s, a.fillRect(0, 0, r, r);
	let c = a.getImageData(0, 0, r, r), l = c.data;
	for (let e = 0; e < l.length; e += 4) if (l[e + 3] > 0) {
		let t = (Math.random() - .5) * 8;
		l[e] = Math.max(0, Math.min(255, l[e] + t)), l[e + 1] = Math.max(0, Math.min(255, l[e + 1] + t)), l[e + 2] = Math.max(0, Math.min(255, l[e + 2] + t));
	}
	a.putImageData(c, 0, 0);
	let d = new u.CanvasTexture(i);
	return d.needsUpdate = !0, d.minFilter = u.LinearFilter, d.magFilter = u.LinearFilter, d;
}
function Fr(e) {
	if (typeof document > "u") return null;
	let t = document.createElement("canvas");
	t.width = 512, t.height = 512;
	let n = t.getContext("2d");
	if (!n) return null;
	let r = n.createRadialGradient(256, 256, 0, 256, 256, 256);
	r.addColorStop(0, "rgba(255,255,255,1)"), r.addColorStop(.22, "rgba(255,255,255,0.96)"), r.addColorStop(.5, $(e, .34)), r.addColorStop(.78, $(e, .08)), r.addColorStop(1, $(e, 0)), n.clearRect(0, 0, 512, 512), n.fillStyle = r, n.fillRect(0, 0, 512, 512);
	let i = new u.CanvasTexture(t);
	return i.needsUpdate = !0, i.minFilter = u.LinearFilter, i.magFilter = u.LinearFilter, i;
}
function Ir({ family: e, speed: t, glowFactor: r, ringStyle: i, usePlanetRing: o, splitDepthLayers: s, planetDust: l }) {
	let u = n(null);
	return c(() => {
		u.current && (u.current.rotation.set(0, 0, 0), u.current.scale.setScalar(1));
	}), /* @__PURE__ */ a("group", {
		ref: u,
		children: e.orbits.map((n, c) => /* @__PURE__ */ a("group", {
			scale: n.mirrorX ? [
				-1,
				1,
				1
			] : [
				1,
				1,
				1
			],
			children: o ? /* @__PURE__ */ a(fr, {
				radius: n.radius,
				thickness: n.thickness,
				ellipseX: n.ellipseX,
				ellipseY: n.ellipseY,
				tiltX: n.tiltX,
				tiltY: n.tiltY,
				tiltZ: n.tiltZ,
				wobble: n.wobble,
				seed: n.seed,
				baseColor: n.baseColor,
				opacity: n.opacity,
				flowSpeed: n.flowSpeed,
				shimmerSpeed: n.shimmerSpeed,
				offset: n.offset,
				speed: t,
				glowFactor: r,
				splitDepthLayers: s,
				dust: l
			}) : /* @__PURE__ */ a(Hn, {
				radius: n.radius,
				thickness: n.thickness,
				ellipseX: n.ellipseX,
				ellipseY: n.ellipseY,
				tiltX: n.tiltX,
				tiltY: n.tiltY,
				tiltZ: n.tiltZ,
				wobble: n.wobble,
				seed: n.seed,
				baseColor: n.baseColor,
				hotColor: n.hotColor,
				opacity: n.opacity,
				flowSpeed: n.flowSpeed,
				shimmerSpeed: n.shimmerSpeed,
				rotationSpeed: n.rotationSpeed,
				offset: n.offset,
				speed: t,
				glowFactor: r,
				ringStyle: i,
				nodes: n.nodes,
				splitDepthLayers: s
			})
		}, `${e.key}-${c}`))
	});
}
function Lr({ presetConfig: r, quality: i, glowIntensity: s, speed: l, visualScale: d }) {
	let f = n(null), p = n(null), m = Mr(s), h = r.coreKind ?? "atomic", g = h === "atomic", _ = h === "planet", v = h === "gyro", y = h === "portal", b = _ ? "planetary" : r.ringStyle ?? "energy", x = t(() => ({
		core: jr(r.coreRgb),
		glow: jr(r.glowRgb),
		accent: jr(r.accentRgb),
		hot: jr(r.hotRgb)
	}), [r]), S = t(() => Nr(), []), C = t(() => Pr(x.core, x.glow, x.accent), [
		x.core,
		x.glow,
		x.accent
	]), w = t(() => Fr(x.core), [x.core]);
	e(() => () => {
		S?.dispose(), C?.dispose(), w?.dispose();
	}, [
		S,
		C,
		w
	]);
	let T = t(() => {
		let e = r.baseRadius;
		return r.families.map((t, n) => {
			let a = n * .18, o = x.glow.clone().lerp(x.accent, t.heroAccentMix), s = x.hot.clone().lerp(o, t.hotColorMix), c = n * 10 + 1, l = i === "low" ? 0 : i === "medium" ? Math.min(t.nodes.count, 2) : t.nodes.count, u = Array.from({ length: l }, (e, r) => ({
				size: t.nodes.size,
				glowSize: t.nodes.glowSize,
				speed: t.nodes.speed,
				offset: (t.nodes.offset + 1 / Math.max(l, 1) * r) % 1,
				pulseOffset: n * 1.3 + r * .68,
				opacity: .2
			})), d = [{
				radius: e * t.radiusScale,
				thickness: r.ringThickness * t.heroThicknessScale,
				ellipseX: t.ellipseX,
				ellipseY: t.ellipseY,
				tiltX: t.tiltX,
				tiltY: t.tiltY,
				tiltZ: t.tiltZ,
				wobble: t.wobble,
				opacity: t.heroOpacity,
				flowSpeed: t.flowSpeed,
				shimmerSpeed: t.shimmerSpeed,
				rotationSpeed: t.rotationSpeed,
				seed: c,
				offset: a + .04,
				baseColor: o,
				hotColor: s,
				nodes: u,
				mirrorX: t.mirrorX ?? !1
			}];
			return {
				key: `family-${n}`,
				phase: n * 1.12,
				driftX: t.driftX,
				driftY: t.driftY,
				driftZ: t.driftZ,
				spinX: t.spinX,
				spinY: t.spinY,
				spinZ: t.spinZ,
				breath: t.breath,
				orbits: d
			};
		});
	}, [
		x,
		r,
		i
	]);
	return c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(l, .2);
		if (f.current && f.current.rotation.set(0, 0, 0), p.current) {
			let e = 1 + Math.sin(t * .13 * n) * .0016;
			p.current.scale.setScalar(e);
		}
	}), /* @__PURE__ */ o("group", {
		ref: f,
		scale: [
			d,
			d,
			d
		],
		children: [
			S ? /* @__PURE__ */ a("sprite", {
				renderOrder: 1,
				scale: [
					r.haloSize * 4.8,
					r.haloSize * 4.8,
					1
				],
				children: /* @__PURE__ */ a("spriteMaterial", {
					map: S,
					color: x.glow.clone().lerp(x.accent, .08),
					transparent: !0,
					opacity: r.haloOpacity * 1.9 * m,
					blending: u.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})
			}) : null,
			_ ? /* @__PURE__ */ a(qn, {
				coreSize: r.coreSize,
				colors: x,
				speed: l,
				glowFactor: m
			}) : null,
			v && r.gyro ? /* @__PURE__ */ a(Mn, {
				coreSize: r.coreSize,
				config: r.gyro,
				colors: x,
				quality: i,
				speed: l,
				glowFactor: m
			}) : null,
			y && r.portal ? /* @__PURE__ */ a(Ar, {
				config: r.portal,
				colors: x,
				quality: i,
				speed: l,
				glowFactor: m
			}) : null,
			T.map((e) => /* @__PURE__ */ a(Ir, {
				family: e,
				speed: l,
				glowFactor: m,
				ringStyle: b,
				usePlanetRing: _,
				splitDepthLayers: _,
				planetDust: r.planetDust
			}, e.key)),
			g ? /* @__PURE__ */ o("group", {
				ref: p,
				children: [
					S ? /* @__PURE__ */ a("sprite", {
						renderOrder: 8,
						scale: [
							r.coreSize * 7.2,
							r.coreSize * 7.2,
							1
						],
						children: /* @__PURE__ */ a("spriteMaterial", {
							map: S,
							color: x.glow.clone().lerp(x.accent, .08),
							transparent: !0,
							opacity: r.coreGlowOpacity * .22 * m,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}) : null,
					C ? /* @__PURE__ */ a("sprite", {
						renderOrder: 9,
						scale: [
							r.coreSize * 5.05,
							r.coreSize * 5.05,
							1
						],
						children: /* @__PURE__ */ a("spriteMaterial", {
							map: C,
							color: x.hot,
							transparent: !0,
							opacity: .92,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}) : null,
					w ? /* @__PURE__ */ a("sprite", {
						renderOrder: 10,
						scale: [
							r.coreSize * 1.12,
							r.coreSize * 1.12,
							1
						],
						children: /* @__PURE__ */ a("spriteMaterial", {
							map: w,
							color: x.hot.clone().lerp(x.core, .04),
							transparent: !0,
							opacity: .58,
							blending: u.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					}) : null
				]
			}) : null
		]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/ThreeOrbitalCanvas.tsx
var Rr = {
	low: 1,
	medium: [1, 1.5],
	high: [1, 2]
};
function zr({ quality: e, visualScale: t, frameloop: n, ...r }) {
	return /* @__PURE__ */ a(s, {
		frameloop: n,
		dpr: Rr[e],
		camera: {
			position: [
				0,
				0,
				5.6
			],
			fov: 34
		},
		gl: {
			antialias: !0,
			alpha: !0,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl: e }) => {
			e.setClearColor(0, 0);
		},
		style: {
			width: "100%",
			height: "100%",
			pointerEvents: "none"
		},
		children: /* @__PURE__ */ a(Lr, {
			quality: e,
			visualScale: t,
			...r
		})
	});
}
//#endregion
//#region src/components/OrbitalVisual/OrbitalVisual.tsx
var Br = 440;
function Vr({ size: e = 420, width: t, height: n, preset: r = "atomic-orb", quality: i = "medium", glowIntensity: o = "medium", speed: s = 1, background: c = "dark", frameloop: l = "always", className: u }) {
	let d = t ?? e, f = n ?? e, p = Tn[r], m = e / Br;
	return /* @__PURE__ */ a("div", {
		className: [
			sn.root,
			c === "dark" ? sn.darkBackground : "",
			u ?? ""
		].filter(Boolean).join(" "),
		style: {
			width: d,
			height: f
		},
		children: /* @__PURE__ */ a("div", {
			className: sn.stage,
			children: /* @__PURE__ */ a(zr, {
				presetConfig: p,
				quality: i,
				glowIntensity: o,
				speed: s,
				visualScale: m,
				frameloop: l
			})
		})
	});
}
var Hr = [
	{
		id: "atomic-orb",
		title: "Atomic Orb",
		selectLabel: "atomic-orb — атомные системы",
		eyebrow: "Orbital family 01",
		description: "Светящиеся атомные системы с энергетическими орбитами, ядром и настраиваемыми электронами.",
		defaultPreset: "atomic-orb",
		presets: [
			{
				preset: "atomic-orb",
				title: "atomic-orb",
				selectLabel: "atomic-orb — базовый атом",
				text: "Базовый атомный пресет: симметричные орбиты, яркое ядро и читаемые электроны.",
				previewKind: "atom",
				palette: {
					core: "#ffffff",
					glow: "#75e9ff",
					accent: "#3f8fff"
				}
			},
			{
				preset: "atomic-orb-no-electrons",
				title: "atomic-orb-no-electrons",
				selectLabel: "atomic-orb-no-electrons — без электронов",
				text: "Тот же базовый атом, но без электронов — более чистый и графичный orbital-вариант.",
				previewKind: "atom",
				palette: {
					core: "#effcff",
					glow: "#70dcff",
					accent: "#3976df"
				}
			},
			{
				preset: "atomic-orb-more-electrons",
				title: "atomic-orb-more-electrons",
				selectLabel: "atomic-orb-more-electrons — больше электронов",
				text: "Версия с заметно большим количеством электронов и более активным визуальным ритмом.",
				previewKind: "atom",
				palette: {
					core: "#ffffff",
					glow: "#8cf4ff",
					accent: "#4f91ff"
				}
			},
			{
				preset: "atomic-orb-white",
				title: "atomic-orb-white",
				selectLabel: "atomic-orb-white — белый вариант",
				text: "Более белый и холодный вариант атома — светлый, аккуратный и почти crystalline по настроению.",
				previewKind: "atom",
				palette: {
					core: "#ffffff",
					glow: "#e5f7ff",
					accent: "#7fbce2"
				}
			},
			{
				preset: "atomic-orb-violet",
				title: "atomic-orb-violet",
				selectLabel: "atomic-orb-violet — фиолетовый вариант",
				text: "Фиолетовый вариант атома с более мягким sci-fi / tech-art характером.",
				previewKind: "atom",
				palette: {
					core: "#fff8ff",
					glow: "#e092ff",
					accent: "#725dff"
				}
			}
		]
	},
	{
		id: "ring-planet",
		title: "Ring Planet",
		selectLabel: "ring-planet — кольцевые планеты",
		eyebrow: "Orbital family 02",
		description: "Кольцевые планеты с отдельным планетарным ядром, слоями колец и декоративной звёздной пылью.",
		defaultPreset: "ring-planet",
		presets: [
			{
				preset: "ring-planet",
				title: "ring-planet",
				selectLabel: "ring-planet — сдержанная планета",
				text: "Сдержанная планета без частиц: крупное ядро, читаемые кольца и более спокойный космический характер.",
				previewKind: "planet",
				palette: {
					core: "#4ea7ff",
					glow: "#2d72ff",
					accent: "#173f9e"
				}
			},
			{
				preset: "ring-planet-stardust",
				title: "ring-planet-stardust",
				selectLabel: "ring-planet-stardust — планета со звёздной пылью",
				text: "Декоративная версия планеты с мерцающей пылью на передней и задней частях колец.",
				previewKind: "planet",
				palette: {
					core: "#58b0ff",
					glow: "#7edfff",
					accent: "#2857d1"
				}
			},
			{
				preset: "ring-planet-sand",
				title: "ring-planet-sand",
				selectLabel: "ring-planet-sand — песочная планета",
				text: "Тёплая песочно-карамельная планета без частиц — спокойный и более премиальный вариант.",
				previewKind: "planet",
				palette: {
					core: "#d89442",
					glow: "#bd6c2f",
					accent: "#6b321d"
				}
			},
			{
				preset: "ring-planet-sand-stardust",
				title: "ring-planet-sand-stardust",
				selectLabel: "ring-planet-sand-stardust — песочная планета с пылью",
				text: "Песочная планета с редкой кремово-золотистой пылью и более медленным движением.",
				previewKind: "planet",
				palette: {
					core: "#e4a04d",
					glow: "#ffd58a",
					accent: "#7d4325"
				}
			},
			{
				preset: "ring-planet-ice",
				title: "ring-planet-ice",
				selectLabel: "ring-planet-ice — ледяная планета",
				text: "Ледяная версия с меньшим ядром, более широкими тонкими кольцами и редкой холодной пылью.",
				previewKind: "planet",
				palette: {
					core: "#b8eaff",
					glow: "#61cfff",
					accent: "#28678f"
				}
			},
			{
				preset: "ring-planet-eclipse",
				title: "ring-planet-eclipse",
				selectLabel: "ring-planet-eclipse — затмение",
				text: "Тёмная драматичная планета с близкими бронзовыми кольцами и редкими янтарными искрами.",
				previewKind: "planet",
				palette: {
					core: "#8b3a1d",
					glow: "#f1722d",
					accent: "#32150f"
				}
			}
		]
	},
	{
		id: "gyro-core",
		title: "Gyro Core",
		selectLabel: "gyro-core — механические ядра",
		eyebrow: "Orbital family 03",
		description: "Механические ядра с сегментированными кольцами, световыми дорожками и независимой пространственной хореографией.",
		defaultPreset: "gyro-core",
		presets: [
			{
				preset: "gyro-core",
				title: "gyro-core",
				selectLabel: "gyro-core — базовое гироскопическое ядро",
				text: "Базовое механическое ядро: три сегментированных кольца в разных плоскостях, холодные световые дорожки и независимое контрвращение.",
				previewKind: "gyro",
				palette: {
					core: "#eaffff",
					glow: "#64efff",
					accent: "#1b6977"
				}
			},
			{
				preset: "gyro-core-precision",
				title: "gyro-core-precision",
				selectLabel: "gyro-core-precision — ледяное ядро",
				text: "Ледяной вариант: более тонкие кольца, мягкое бело-голубое ядро и спокойная механическая хореография.",
				previewKind: "gyro",
				palette: {
					core: "#f3fcff",
					glow: "#9fe8ff",
					accent: "#6e91a8"
				}
			},
			{
				preset: "gyro-core-reactor",
				title: "gyro-core-reactor",
				selectLabel: "gyro-core-reactor — реакторное ядро",
				text: "Активный реакторный вариант: увеличенное фиолетово-лазурное ядро, яркие дорожки и более энергичное движение.",
				previewKind: "gyro",
				palette: {
					core: "#eee5ff",
					glow: "#68e9ff",
					accent: "#764cb2"
				}
			},
			{
				preset: "gyro-core-amber",
				title: "gyro-core-amber",
				selectLabel: "gyro-core-amber — янтарное ядро",
				text: "Тёплый механический вариант: бронзовые кольца, янтарное ядро и более тяжёлое, размеренное вращение.",
				previewKind: "gyro",
				palette: {
					core: "#ffe1ad",
					glow: "#f4a348",
					accent: "#75472b"
				}
			}
		]
	},
	{
		id: "portal-gate",
		title: "Portal Gate",
		selectLabel: "portal-gate — энергетические порталы",
		eyebrow: "Orbital family 04",
		description: "Энергетические порталы с объёмной сегментированной рамой, независимыми кольцами и процедурной мембраной.",
		defaultPreset: "portal-gate",
		presets: [
			{
				preset: "portal-gate",
				title: "portal-gate",
				selectLabel: "portal-gate — базовый энергетический портал",
				text: "Базовый холодный портал: сегментированные концентрические кольца, живая энергетическая мембрана и независимое вращение слоёв.",
				previewKind: "portal",
				palette: {
					core: "#efffff",
					glow: "#4ee1ff",
					accent: "#2d5bd6"
				}
			},
			{
				preset: "portal-gate-violet",
				title: "portal-gate-violet",
				selectLabel: "portal-gate-violet — фиолетовый портал",
				text: "Более активный фиолетово-лазурный портал с усиленной турбулентностью мембраны и более быстрым движением колец.",
				previewKind: "portal",
				palette: {
					core: "#fff5ff",
					glow: "#b969ff",
					accent: "#454fe8"
				}
			},
			{
				preset: "portal-gate-ember",
				title: "portal-gate-ember",
				selectLabel: "portal-gate-ember — янтарный портал",
				text: "Тёплый тяжёлый вариант: массивные янтарно-бронзовые сегменты, более медленное вращение и огненная энергетическая глубина.",
				previewKind: "portal",
				palette: {
					core: "#fff0c2",
					glow: "#ff9234",
					accent: "#8e3020"
				}
			}
		]
	}
], Ur = Hr.flatMap((e) => e.presets.map((e) => e.preset)), Wr = Hr.map((e) => ({
	value: e.id,
	label: e.selectLabel
}));
function Gr(e) {
	return Hr.find((t) => t.id === e) ?? Hr[0];
}
function Kr(e) {
	return Hr.find((t) => t.presets.some((t) => t.preset === e))?.id ?? "atomic-orb";
}
function qr(e) {
	return Gr(e).presets.map((e) => ({
		value: e.preset,
		label: e.selectLabel
	}));
}
//#endregion
export { lt as BinaryPlanetVisual, Vr as OrbitalVisual, He as SphereVisual, nn as WaterRippleVisual, Qe as binaryPlanetPresets, Gr as getOrbitalObjectById, Kr as getOrbitalObjectIdForPreset, qr as getOrbitalPresetOptions, Hr as orbitalObjectCatalog, Wr as orbitalObjectOptions, Ur as orbitalPresetNames, rn as spherePresetCatalog, an as spherePresetNames, on as spherePresetOptions };

//# sourceMappingURL=index.js.map