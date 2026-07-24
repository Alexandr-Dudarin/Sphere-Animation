import { useEffect as e, useMemo as t, useRef as n, useState as r } from "react";
import { Fragment as i, jsx as a, jsxs as o } from "react/jsx-runtime";
import { Canvas as s, useFrame as c } from "@react-three/fiber";
import * as l from "three";
var u = {
	root: "_root_v13bp_1",
	darkBackground: "_darkBackground_v13bp_19",
	stage: "_stage_v13bp_41"
}, d = {
	size: 420,
	mode: "thinking",
	preset: "glass-petal",
	quality: "high",
	interactive: !0,
	glowIntensity: "high",
	speed: 1.1,
	background: "dark"
}, f = {
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
function p() {
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
function m(e, t, n) {
	return e + (t - e) * n;
}
//#endregion
//#region src/components/SphereVisual/utils/normalizePointer.ts
function h(e, t, n) {
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
function g(t) {
	let i = n(null), a = n({
		x: 0,
		y: 0
	}), o = n(null), [s, c] = r({
		x: 0,
		y: 0
	});
	return e(() => {
		let e = i.current;
		if (!e || !t) {
			a.current = {
				x: 0,
				y: 0
			}, c({
				x: 0,
				y: 0
			});
			return;
		}
		let n = () => {
			c((e) => ({
				x: m(e.x, a.current.x, .12),
				y: m(e.y, a.current.y, .12)
			})), o.current = window.requestAnimationFrame(n);
		}, r = (t) => {
			let n = e.getBoundingClientRect(), r = h(t.clientX, t.clientY, n);
			a.current = {
				x: r.x,
				y: r.y
			};
		}, s = () => {
			a.current = {
				x: 0,
				y: 0
			};
		};
		return e.addEventListener("pointermove", r), e.addEventListener("pointerleave", s), o.current = window.requestAnimationFrame(n), () => {
			e.removeEventListener("pointermove", r), e.removeEventListener("pointerleave", s), o.current !== null && window.cancelAnimationFrame(o.current);
		};
	}, [t]), {
		containerRef: i,
		pointerX: s.x,
		pointerY: s.y
	};
}
var _ = {
	root: "_root_derx8_1",
	reducedMotion: "_reducedMotion_derx8_75",
	backMist: "_backMist_derx8_95",
	outerGlow: "_outerGlow_derx8_97",
	vortexZone: "_vortexZone_derx8_99",
	swirlA: "_swirlA_derx8_101",
	swirlB: "_swirlB_derx8_103",
	swirlC: "_swirlC_derx8_105",
	swirlD: "_swirlD_derx8_107",
	chromaBand: "_chromaBand_derx8_109",
	tunnelGlow: "_tunnelGlow_derx8_111",
	texture: "_texture_derx8_113",
	centerEye: "_centerEye_derx8_115",
	centerCore: "_centerCore_derx8_117",
	glassShell: "_glassShell_derx8_119",
	shellInner: "_shellInner_derx8_121",
	glassHalo: "_glassHalo_derx8_123",
	refraction: "_refraction_derx8_125",
	frontCaustic: "_frontCaustic_derx8_127",
	specular: "_specular_derx8_129",
	frontRim: "_frontRim_derx8_131",
	backMistPulse: "_backMistPulse_derx8_1",
	outerGlowPulse: "_outerGlowPulse_derx8_1",
	swirlSpin: "_swirlSpin_derx8_1",
	swirlSpinReverse: "_swirlSpinReverse_derx8_1",
	swirlBreathe: "_swirlBreathe_derx8_1",
	microSpin: "_microSpin_derx8_1",
	chromaPulse: "_chromaPulse_derx8_1",
	tunnelPulse: "_tunnelPulse_derx8_1",
	textureDrift: "_textureDrift_derx8_1",
	eyeBreathe: "_eyeBreathe_derx8_1",
	corePulse: "_corePulse_derx8_1",
	shellBreathe: "_shellBreathe_derx8_1",
	refractionShift: "_refractionShift_derx8_1",
	causticShift: "_causticShift_derx8_1",
	modeIdle: "_modeIdle_derx8_957",
	modeThinking: "_modeThinking_derx8_989",
	modeSearching: "_modeSearching_derx8_1029"
}, v = {
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
}, y = {
	low: "16px",
	medium: "12px",
	high: "8px"
}, b = {
	low: .76,
	medium: .88,
	high: 1
}, x = {
	low: .72,
	medium: .88,
	high: 1
};
function S({ presetConfig: e, mode: t, quality: n, interactive: r, glowIntensity: i, speed: s, pointerX: c, pointerY: l, reducedMotion: u }) {
	let d = v[t], f = Math.max(s, .15);
	return /* @__PURE__ */ o("div", {
		className: [
			_.root,
			u ? _.reducedMotion : "",
			t === "idle" ? _.modeIdle : "",
			t === "thinking" ? _.modeThinking : "",
			t === "searching" ? _.modeSearching : ""
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
			"--detail-blur": y[n],
			"--shell-opacity": b[n].toString(),
			"--glow-alpha": Math.min(1, d.haloStrength * x[i]).toString(),
			"--flare-x": `${50 + c * 16}%`,
			"--flare-y": `${22 + l * 13}%`,
			"--violet-rgb": t === "searching" ? "156 122 255" : "132 111 255",
			"--pink-rgb": t === "searching" ? "255 97 186" : "233 116 255",
			"--mint-rgb": "108 255 223",
			"--amber-rgb": "255 196 112"
		},
		children: [
			/* @__PURE__ */ a("div", { className: _.backMist }),
			/* @__PURE__ */ a("div", { className: _.outerGlow }),
			/* @__PURE__ */ o("div", {
				className: _.vortexZone,
				children: [
					/* @__PURE__ */ a("div", { className: _.swirlA }),
					/* @__PURE__ */ a("div", { className: _.swirlB }),
					/* @__PURE__ */ a("div", { className: _.swirlC }),
					/* @__PURE__ */ a("div", { className: _.swirlD }),
					/* @__PURE__ */ a("div", { className: _.chromaBand }),
					/* @__PURE__ */ a("div", { className: _.tunnelGlow }),
					/* @__PURE__ */ a("div", { className: _.texture }),
					/* @__PURE__ */ a("div", { className: _.centerEye }),
					/* @__PURE__ */ a("div", { className: _.centerCore })
				]
			}),
			/* @__PURE__ */ a("div", { className: _.glassShell }),
			/* @__PURE__ */ a("div", { className: _.shellInner }),
			/* @__PURE__ */ a("div", { className: _.glassHalo }),
			/* @__PURE__ */ a("div", { className: _.refraction }),
			/* @__PURE__ */ a("div", { className: _.frontCaustic }),
			/* @__PURE__ */ a("div", { className: _.specular }),
			/* @__PURE__ */ a("div", { className: _.frontRim })
		]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/InnerScatterField.tsx
var C = 440;
function w(e = "medium") {
	if (typeof e == "number") return l.MathUtils.clamp(e, .5, 2);
	switch (e) {
		case "low": return .82;
		case "high": return 1.28;
		default: return 1;
	}
}
function T() {
	let e = document.createElement("canvas");
	e.width = 64, e.height = 64;
	let t = e.getContext("2d");
	if (!t) return new l.Texture();
	let n = t.createRadialGradient(64 * .5, 64 * .5, 0, 64 * .5, 64 * .5, 64 * .5);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.22, "rgba(255,255,255,0.9)"), n.addColorStop(.52, "rgba(255,255,255,0.28)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 64, 64), t.fillStyle = n, t.fillRect(0, 0, 64, 64);
	let r = new l.CanvasTexture(e);
	return r.needsUpdate = !0, r;
}
function E(e, t, n, r) {
	let i = t * 3, a = r * n.speed, o = (1 - n.radius) ** 1.25, s = n.angle + a + n.radius * 5.6 + o * n.twist * 1.9 + Math.sin(a * .8 + n.phase) * .12, c = .92 + .05 * Math.sin(r * .75 + n.phase) + .025 * Math.cos(r * 1.1 + n.phase * .85), l = n.radius * c, u = o * .12, d = .012 * n.drift * Math.sin(s * 1.7 + n.phase) + .008 * n.drift * Math.cos(s * 2.1 - n.phase), f = Math.cos(s) * l * .84 + Math.cos(s * 2 + n.phase) * d - Math.cos(s) * u * .32, p = Math.sin(s) * l * .8 + Math.sin(s * 1.6 + n.phase) * d - Math.sin(s) * u * .26, m = n.depth * .06 + Math.sin(s * 1.18 + n.phase) * .013 + Math.cos(r * .62 + n.phase) * .006;
	e[i] = f, e[i + 1] = p, e[i + 2] = m;
}
function D({ speed: r = 1, reducedMotion: i = !1, glowIntensity: o = "medium", colors: s, scatterStrength: u }) {
	let d = n(null), f = w(o), p = l.MathUtils.clamp(u, .45, 1.7), m = Math.max(220, Math.round(C * (.7 + p * .35))), { geometry: h, material: g, spriteTexture: _, positions: v, seeds: y } = t(() => {
		let e = T(), t = new Float32Array(m * 3), n = new Float32Array(m * 3), r = [];
		for (let e = 0; e < m; e += 1) {
			let i = .045 + Math.random() ** 1.65 * .76, a = {
				radius: i,
				angle: Math.random() * Math.PI * 2,
				phase: Math.random() * Math.PI * 2,
				speed: l.MathUtils.randFloat(.18, .34),
				drift: l.MathUtils.randFloat(.55, 1.1),
				depth: l.MathUtils.randFloatSpread(1),
				twist: l.MathUtils.randFloat(.85, 1.35)
			};
			r.push(a), E(t, e, a, 0);
			let o = s.halo.clone().lerp(s.mint, .35 + i * .2), c = s.violet.clone().lerp(s.pink, .35 + (1 - i) * .4), u = o.lerp(c, .22 + (1 - i) * .42).lerp(s.white, (1 - i) * .08), d = e * 3;
			n[d] = u.r, n[d + 1] = u.g, n[d + 2] = u.b;
		}
		let i = new l.BufferGeometry();
		return i.setAttribute("position", new l.BufferAttribute(t, 3)), i.setAttribute("color", new l.BufferAttribute(n, 3)), {
			geometry: i,
			material: new l.PointsMaterial({
				size: .026 * f * Math.sqrt(p),
				map: e,
				transparent: !0,
				opacity: .34 * f * p,
				vertexColors: !0,
				depthWrite: !1,
				blending: l.AdditiveBlending,
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
		for (let e = 0; e < y.length; e += 1) E(v, e, y[e], n);
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
var O = new l.Vector3(0, 0, 1);
function k(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.22;
		default: return 1;
	}
}
function A(e, t, n, r, i = 0, a = 0) {
	let o = new l.Vector3(0, 0, i), s = new l.Vector3(0, e, i + a), c = new l.CubicBezierCurve3(o, new l.Vector3(t * 1.02, e * .18, i + a * .15), new l.Vector3(t * .92, e * .78, i + a * .8), s), u = new l.CubicBezierCurve3(s, new l.Vector3(-t * .92, e * .78, i + a * .8), new l.Vector3(-t * 1.02, e * .18, i + a * .15), o), d = [...c.getPoints(42), ...u.getPoints(42).slice(1)].map((e) => e.clone().applyAxisAngle(O, n)), f = new l.CatmullRomCurve3(d, !1, "catmullrom", .45);
	return new l.TubeGeometry(f, 120, r, 12, !1);
}
function j(e, t, n, r, i, a, o, s, c = 0, l = 0) {
	return Array.from({ length: e }, (u, d) => {
		let f = d / e * Math.PI * 2 + r;
		return {
			wash: A(t, n, f, s, c, l),
			glow: A(t, n, f, o, c, l),
			mid: A(t, n, f, a, c, l),
			core: A(t, n, f, i, c, l)
		};
	});
}
function M(e, t, n, r, i) {
	return e.clone().lerp(t, r).lerp(n, i);
}
function N(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 2.1) + 1) * .5;
	return {
		wash: M(n.halo, n.mint, n.violet, .18 + i * .18, .08 + a * .12),
		glow: M(n.violet, n.pink, n.mint, .18 + i * .28, .08 + a * .16),
		mid: M(n.mint, n.halo, n.violet, .28 + i * .18, .08 + a * .1),
		core: M(n.white, n.mint, n.violet, .2 + i * .16, .04 + a * .06)
	};
}
function P(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + .7) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 3) + 1) * .5;
	return {
		wash: M(n.halo, n.violet, n.mint, .12 + i * .16, .06 + a * .08),
		glow: M(n.violet, n.pink, n.halo, .24 + i * .2, .1 + a * .08),
		mid: M(n.violet, n.pink, n.mint, .22 + i * .16, .06 + a * .12),
		core: M(n.white, n.violet, n.mint, .14 + i * .12, .04 + a * .08)
	};
}
function ee(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + 1.4) + 1) * .5;
	return {
		wash: n.halo.clone().lerp(n.violet, .12 + i * .08),
		glow: n.pink.clone().lerp(n.violet, .18 + i * .12),
		mid: n.mint.clone().lerp(n.violet, .16 + i * .12),
		core: n.white.clone().lerp(n.mint, .12 + i * .08)
	};
}
function F({ speed: e, reducedMotion: r, glowIntensity: i, colors: s }) {
	let u = n(null), d = n(null), f = n(null), p = n(null), m = n(null), h = k(i), g = t(() => j(8, .9, .19, 0, .0054, .0134, .025, .043, .008, .024), []), _ = t(() => j(8, .64, .132, Math.PI / 8, .0044, .0108, .0195, .032, .016, .013), []), v = t(() => j(8, .36, .07, 0, .003, .0068, .011, .017, .022, .006), []), y = t(() => s.white.clone().lerp(s.mint, .28), [s]), b = t(() => s.white.clone().lerp(s.pink, .1), [s]), x = t(() => s.halo.clone().lerp(s.mint, .22), [s]);
	return c((t) => {
		let n = t.clock.getElapsedTime(), i = r ? .35 : 1, a = Math.max(e, .15), o = Math.sin(n * .92 * i), s = Math.sin(n * .98 * i + .12), c = Math.sin(n * 1.08 * i + .68), l = Math.sin(n * 1.22 * i + 1.28);
		if (u.current) {
			let e = 1 + o * .008 * i;
			u.current.scale.setScalar(e), u.current.rotation.z = Math.sin(n * .14 * a) * .045, u.current.rotation.x = Math.sin(n * .08 * a) * .04, u.current.rotation.y = Math.cos(n * .09 * a) * .04;
		}
		let h = 1 + s * .038 * i, g = 1 + c * .026 * i, _ = 1 + l * .018 * i;
		if (d.current && (d.current.rotation.z = n * .085 * a * i, d.current.scale.setScalar(h)), f.current && (f.current.rotation.z = -n * .11 * a * i + Math.sin(n * .42 * i) * .03, f.current.scale.setScalar(g)), p.current && (p.current.rotation.z = n * .16 * a * i, p.current.scale.setScalar(_)), m.current) {
			let e = 1 + Math.sin(n * 1.14 * i + .4) * .05;
			m.current.scale.setScalar(e);
		}
	}), /* @__PURE__ */ o("group", {
		ref: u,
		renderOrder: 18,
		children: [
			/* @__PURE__ */ a("group", {
				ref: d,
				children: g.map((e, t) => {
					let n = N(t, g.length, s);
					return /* @__PURE__ */ o("group", { children: [
						/* @__PURE__ */ a("mesh", {
							geometry: e.wash,
							renderOrder: 12,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.wash,
								transparent: !0,
								opacity: .016 * h,
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
					let n = P(t, _.length, s);
					return /* @__PURE__ */ o("group", { children: [
						/* @__PURE__ */ a("mesh", {
							geometry: e.wash,
							renderOrder: 16,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.wash,
								transparent: !0,
								opacity: .01 * h,
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
					let n = ee(t, v.length, s);
					return /* @__PURE__ */ o("group", { children: [
						/* @__PURE__ */ a("mesh", {
							geometry: e.wash,
							renderOrder: 20,
							children: /* @__PURE__ */ a("meshBasicMaterial", {
								color: n.wash,
								transparent: !0,
								opacity: 0,
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
								blending: l.AdditiveBlending,
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
					blending: l.AdditiveBlending,
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
					blending: l.AdditiveBlending,
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
					blending: l.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			})
		]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/PetalPulseField.tsx
var te = new l.Vector3(0, 0, 1);
function I(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.18;
		default: return 1;
	}
}
function L(e, t, n, r, i = 0, a = 0) {
	let o = new l.Vector3(0, 0, i), s = new l.Vector3(0, e, i + a), c = new l.CubicBezierCurve3(o, new l.Vector3(t * 1.02, e * .18, i + a * .15), new l.Vector3(t * .92, e * .78, i + a * .8), s), u = new l.CubicBezierCurve3(s, new l.Vector3(-t * .92, e * .78, i + a * .8), new l.Vector3(-t * 1.02, e * .18, i + a * .15), o), d = [...c.getPoints(42), ...u.getPoints(42).slice(1)].map((e) => e.clone().applyAxisAngle(te, n)), f = new l.CatmullRomCurve3(d, !1, "catmullrom", .45);
	return new l.TubeGeometry(f, 160, r, 12, !1);
}
function R(e, t, n, r, i, a = 0, o = 0) {
	return Array.from({ length: e }, (s, c) => ({ pulse: L(t, n, c / e * Math.PI * 2 + r, i, a, o) }));
}
var ne = "\n  varying vec2 vUv;\n\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", re = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uSpeed;\n  uniform float uOffset;\n  uniform vec3 uBaseColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n\n  float loopDistance(float a, float b) {\n    float d = abs(a - b);\n    return min(d, 1.0 - d);\n  }\n\n  void main() {\n    float along = fract(vUv.x - uTime * uSpeed + uOffset);\n\n    float head = exp(-pow(loopDistance(along, 0.18) / 0.042, 2.0));\n    float tail = exp(-pow(loopDistance(along, 0.26) / 0.12, 2.0)) * 0.56;\n    float pulse = clamp(head + tail, 0.0, 1.0);\n\n    float body = 0.12 + 0.06 * sin((vUv.x + uOffset) * 24.0 - uTime * 1.15);\n    float shimmer = 0.92 + 0.08 * sin((vUv.x + uOffset) * 34.0 - uTime * 1.35);\n\n    vec3 color = mix(uBaseColor, uHotColor, pulse);\n    float alpha = uOpacity * (body + pulse * 1.22) * shimmer;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function z({ geometry: e, baseColor: r, hotColor: i, opacity: o, speed: s, reducedMotion: u, glowFactor: d, offset: f, speedFactor: p, pulseFactor: m }) {
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
		let t = e.clock.getElapsedTime(), n = u ? .42 : 1, r = Math.max(s, .15);
		h.current && (h.current.uniforms.uTime.value = t * r * n);
	}), /* @__PURE__ */ a("mesh", {
		geometry: e,
		renderOrder: 24,
		children: /* @__PURE__ */ a("shaderMaterial", {
			ref: h,
			uniforms: g,
			vertexShader: ne,
			fragmentShader: re,
			transparent: !0,
			depthWrite: !1,
			toneMapped: !1,
			blending: l.AdditiveBlending
		})
	});
}
function ie({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, pulseStrength: u }) {
	let d = n(null), f = n(null), p = I(i), m = l.MathUtils.clamp(u, .45, 1.7), h = t(() => R(10, .76, .17, 0, .0038, .012, .022), []), g = t(() => R(10, .58, .12, Math.PI / 10, .0032, .018, .012), []);
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
			children: h.map((t, n) => n % 2 == 0 ? /* @__PURE__ */ a(z, {
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
			children: g.map((t, n) => n % 3 == 0 ? /* @__PURE__ */ a(z, {
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
var ae = new l.Vector3(0, 0, 1);
function oe(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.2;
		default: return 1;
	}
}
function se(e, t, n, r, i = 0, a = 0) {
	let o = new l.Vector3(0, 0, i), s = new l.Vector3(0, e, i + a), c = new l.CubicBezierCurve3(o, new l.Vector3(t * 1.03, e * .18, i + a * .15), new l.Vector3(t * .94, e * .78, i + a * .82), s), u = new l.CubicBezierCurve3(s, new l.Vector3(-t * .94, e * .78, i + a * .82), new l.Vector3(-t * 1.03, e * .18, i + a * .15), o), d = [...c.getPoints(42), ...u.getPoints(42).slice(1)].map((e) => e.clone().applyAxisAngle(ae, n)), f = new l.CatmullRomCurve3(d, !1, "catmullrom", .45);
	return new l.TubeGeometry(f, 120, r, 12, !1);
}
function ce(e, t, n, r, i, a, o, s = 0, c = 0) {
	return Array.from({ length: e }, (l, u) => {
		let d = u / e * Math.PI * 2 + r;
		return {
			haze: se(t, n, d, o, s, c),
			bloom: se(t, n, d, a, s, c),
			ghost: se(t, n, d, i, s, c)
		};
	});
}
function B(e, t, n, r, i) {
	return e.clone().lerp(t, r).lerp(n, i);
}
function le(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + .3) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 2.4) + 1) * .5;
	return {
		haze: B(n.halo, n.violet, n.mint, .1 + i * .1, .04 + a * .06),
		bloom: B(n.violet, n.pink, n.mint, .18 + i * .16, .06 + a * .08),
		ghost: B(n.halo, n.white, n.violet, .14 + i * .1, .05 + a * .06)
	};
}
function ue(e, t, n) {
	let r = e / t, i = (Math.sin(r * Math.PI * 2 + 1.2) + 1) * .5, a = (Math.sin(r * Math.PI * 2 + 3.1) + 1) * .5;
	return {
		haze: B(n.halo, n.violet, n.mint, .08 + i * .08, .04 + a * .05),
		bloom: B(n.violet, n.pink, n.halo, .15 + i * .13, .05 + a * .06),
		ghost: B(n.halo, n.white, n.mint, .1 + i * .08, .04 + a * .05)
	};
}
function de({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, echoStrength: u }) {
	let d = n(null), f = n(null), p = n(null), m = oe(i), h = l.MathUtils.clamp(u, .45, 1.7), g = t(() => ce(8, .95, .205, 0, .0115, .024, .043, -.012, .02), []), _ = t(() => ce(8, .82, .17, Math.PI / 8, .0095, .019, .034, -.008, .014), []);
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
				let n = le(t, g.length, s);
				return /* @__PURE__ */ o("group", { children: [
					/* @__PURE__ */ a("mesh", {
						geometry: e.haze,
						renderOrder: 8,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.haze,
							transparent: !0,
							opacity: .034 * m * h,
							blending: l.AdditiveBlending,
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
							blending: l.AdditiveBlending,
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
							blending: l.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})
					})
				] }, `outer-echo-${t}`);
			})
		}), /* @__PURE__ */ a("group", {
			ref: p,
			children: _.map((e, t) => {
				let n = ue(t, _.length, s);
				return /* @__PURE__ */ o("group", { children: [
					/* @__PURE__ */ a("mesh", {
						geometry: e.haze,
						renderOrder: 11,
						children: /* @__PURE__ */ a("meshBasicMaterial", {
							color: n.haze,
							transparent: !0,
							opacity: .026 * m * h,
							blending: l.AdditiveBlending,
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
							blending: l.AdditiveBlending,
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
							blending: l.AdditiveBlending,
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
function V(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.24;
		default: return 1;
	}
}
var H = "\n  varying vec2 vUv;\n\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", U = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uPhase;\n  uniform float uCenterCut;\n  uniform float uEdgeStrength;\n  uniform float uBandA;\n  uniform float uBandB;\n\n  uniform vec3 uColorA;\n  uniform vec3 uColorB;\n  uniform vec3 uColorC;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 p = vUv * 2.0 - 1.0;\n    float r = length(p);\n    float a = atan(p.y, p.x);\n\n    if (r > 1.0) discard;\n\n    float bandOuter = exp(-pow((r - uBandA) / 0.12, 2.0));\n    float bandMid = exp(-pow((r - uBandB) / 0.18, 2.0));\n\n    float inwardA = 0.5 + 0.5 * sin(a * 4.0 + r * 7.8 - uTime * 0.2 + uPhase);\n    float inwardB = 0.5 + 0.5 * sin(a * 7.0 - r * 9.4 + uTime * 0.16 + uPhase * 1.31);\n    float inwardC = 0.5 + 0.5 * sin((p.x * 1.8 - p.y * 2.0) * 2.7 - uTime * 0.12 + uPhase * 2.0);\n\n    float edgeWarp =\n      0.026 * sin(a * 5.0 + uTime * 0.14 + uPhase) +\n      0.018 * sin(a * 9.0 - uTime * 0.09 + uPhase * 0.82) +\n      0.012 * sin(a * 13.0 + uTime * 0.06 + uPhase * 1.7);\n\n    float edgeFade = 1.0 - smoothstep(0.91 + edgeWarp, 1.0, r);\n\n    float centerSuppression = smoothstep(uCenterCut, 1.0, r);\n\n    float structure =\n      bandOuter * (uEdgeStrength + inwardA * 0.2 + inwardB * 0.14) +\n      bandMid * (0.34 + inwardB * 0.16 + inwardC * 0.12);\n\n    structure *= edgeFade;\n    structure *= centerSuppression;\n\n    vec3 color = mix(\n      uColorA,\n      uColorB,\n      clamp(bandOuter * 0.62 + inwardA * 0.24, 0.0, 1.0)\n    );\n\n    color = mix(\n      color,\n      uColorC,\n      clamp(bandMid * 0.22 + inwardB * 0.16, 0.0, 1.0)\n    );\n\n    float alpha = uOpacity * structure;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function W({ speed: e, reducedMotion: r, glowFactor: i, radius: s, opacity: u, z: d, phase: f, rotationSpeed: p, pulse: m, colors: h, renderOrder: g, centerCut: _, edgeStrength: v, bandA: y, bandB: b }) {
	let x = n(null), S = n(null), C = t(() => ({
		uTime: { value: 0 },
		uOpacity: { value: u * i },
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
		u,
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
		S.current && (S.current.uniforms.uTime.value = o, S.current.uniforms.uOpacity.value = u * i * (.97 + Math.sin(o * .34 + f) * .035));
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
			vertexShader: H,
			fragmentShader: U,
			transparent: !0,
			depthWrite: !1,
			depthTest: !1,
			toneMapped: !1,
			blending: l.AdditiveBlending,
			side: l.DoubleSide
		})]
	});
}
function fe({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, volumeStrength: u }) {
	let d = n(null), f = V(i), p = l.MathUtils.clamp(u, .45, 1.7), m = t(() => [
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
			/* @__PURE__ */ a(W, {
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
			/* @__PURE__ */ a(W, {
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
			/* @__PURE__ */ a(W, {
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
function pe(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.2;
		default: return 1;
	}
}
var G = "\n  varying vec3 vWorldPos;\n  varying vec3 vWorldNormal;\n  varying vec3 vLocalPos;\n\n  void main() {\n    vLocalPos = normalize(position);\n\n    vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n    vWorldPos = worldPosition.xyz;\n    vWorldNormal = normalize(mat3(modelMatrix) * normal);\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", me = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform vec3 uHalo;\n  uniform vec3 uMint;\n  uniform vec3 uViolet;\n  uniform vec3 uPink;\n  uniform vec3 uAccent;\n  uniform vec3 uWhite;\n\n  varying vec3 vWorldPos;\n  varying vec3 vWorldNormal;\n  varying vec3 vLocalPos;\n\n  float angleDelta(float a, float b) {\n    return abs(atan(sin(a - b), cos(a - b)));\n  }\n\n  void main() {\n    vec3 N = normalize(vWorldNormal);\n    vec3 V = normalize(cameraPosition - vWorldPos);\n\n    float ndv = clamp(dot(N, V), 0.0, 1.0);\n    float fresnel = pow(1.0 - ndv, 2.72);\n\n    float rimSoft = smoothstep(0.06, 0.74, fresnel);\n    float rimStrong = smoothstep(0.22, 0.98, fresnel);\n\n    float body = smoothstep(0.03, 0.2, fresnel) * (1.0 - rimStrong) * 0.11;\n    float innerReflection = exp(-pow((fresnel - 0.22) / 0.11, 2.0)) * 0.34;\n\n    float angle = atan(vLocalPos.y, vLocalPos.x);\n\n    float bandA =\n      0.5 + 0.5 * sin(angle * 2.35 + vLocalPos.z * 4.8 + uTime * 0.34);\n    float bandB =\n      0.5 + 0.5 * sin(angle * 3.1 - uTime * 0.42 + vLocalPos.z * 5.4);\n    float latFlow =\n      0.5 + 0.5 * sin(vLocalPos.z * 7.2 + angle * 1.8 + uTime * 0.22);\n\n    vec3 spectralA = mix(uHalo, uMint, 0.54);\n    vec3 spectralB = mix(uViolet, uPink, 0.5);\n    vec3 spectralC = mix(uAccent, uWhite, 0.22);\n    vec3 spectralD = mix(uAccent, uMint, 0.44);\n\n    vec3 spectral = mix(spectralA, spectralB, bandA * 0.52 + bandB * 0.14);\n    spectral = mix(spectral, spectralC, innerReflection * 0.26 + bandB * 0.18);\n    spectral = mix(spectral, spectralD, latFlow * 0.24);\n\n    float travelA =\n      exp(-pow(angleDelta(angle, uTime * 0.36 + vLocalPos.z * 0.42) / 0.42, 2.0));\n    float travelB =\n      exp(-pow(angleDelta(angle, -uTime * 0.28 + 1.85 + vLocalPos.z * 0.24) / 0.34, 2.0));\n    float travelC =\n      exp(-pow(angleDelta(angle, uTime * 0.18 - 2.2 + vLocalPos.z * 0.3) / 0.7, 2.0));\n\n    float microSpark =\n      0.5 + 0.5 * sin(angle * 6.0 - uTime * 0.76 + vLocalPos.z * 6.4);\n\n    float movingHighlight =\n      rimStrong * (travelA * 0.42 + travelB * 0.22) +\n      rimSoft * travelC * 0.12;\n\n    vec3 color = spectral * (rimSoft * 0.56 + rimStrong * 0.46 + body * 0.22);\n    color += uWhite * movingHighlight * (0.72 + microSpark * 0.16);\n    color += mix(uMint, uWhite, 0.34) * innerReflection * 0.18;\n    color += mix(uViolet, uHalo, 0.42) * rimStrong * 0.05;\n    color += mix(uAccent, uWhite, 0.24) * rimSoft * 0.06;\n\n    float alpha = uOpacity * clamp(\n      rimStrong * 0.76 +\n      rimSoft * 0.22 +\n      innerReflection * 0.16 +\n      body * 0.18 +\n      movingHighlight * 0.22,\n      0.0,\n      1.0\n    );\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function he({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, shellStrength: u }) {
	let d = n(null), f = n(null), p = n(null), m = n(null), h = pe(i), g = l.MathUtils.clamp(u, .5, 1.6), _ = t(() => s.halo.clone().lerp(s.mint, .16).lerp(s.white, .04), [s]), v = t(() => s.mint.clone().lerp(s.white, .12).lerp(s.halo, .08), [s]), y = t(() => s.halo.clone().lerp(s.violet, .16).lerp(s.mint, .05), [s]), b = t(() => ({
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
				side: l.FrontSide,
				blending: l.NormalBlending
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
				side: l.BackSide,
				blending: l.AdditiveBlending
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
				vertexShader: G,
				fragmentShader: me,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1,
				side: l.FrontSide,
				blending: l.AdditiveBlending
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
				side: l.BackSide,
				blending: l.AdditiveBlending
			})]
		})
	] });
}
//#endregion
//#region src/components/SphereVisual/renderers/three/Lights.tsx
var K = {
	low: .72,
	medium: .9,
	high: 1.08
};
function ge({ colors: e, glowIntensity: t }) {
	let n = K[t];
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
function _e(e) {
	switch (e) {
		case "low": return .8;
		case "high": return 1.16;
		default: return 1;
	}
}
var ve = "\n  varying vec2 vUv;\n\n  void main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n", ye = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform vec3 uColorA;\n  uniform vec3 uColorB;\n  uniform vec3 uColorC;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 p = (vUv - 0.5) * 2.0;\n    float r = length(p);\n    float a = atan(p.y, p.x);\n\n    float baseMask = smoothstep(1.0, 0.08, r);\n    float petalHint = 0.5 + 0.5 * cos(a * 8.0);\n    float swirl = 0.5 + 0.5 * sin(a * 3.0 - r * 7.5 + uTime * 0.22);\n    float inner = exp(-pow(r / 0.7, 2.4));\n\n    vec3 color = mix(uColorA, uColorB, petalHint * 0.72);\n    color = mix(color, uColorC, swirl * 0.38);\n\n    float alpha =\n      uOpacity *\n      baseMask *\n      inner *\n      (0.7 + 0.3 * petalHint);\n\n    gl_FragColor = vec4(color, alpha);\n  }\n", be = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform vec3 uColorA;\n  uniform vec3 uColorB;\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 p = (vUv - 0.5) * 2.0;\n    float r = length(p);\n\n    float softCore = exp(-pow(r / 0.48, 2.6));\n    float softBloom = exp(-pow(r / 0.78, 2.2)) * 0.55;\n    float drift = 0.96 + 0.04 * sin(uTime * 0.45 - r * 4.0);\n\n    vec3 color = mix(uColorA, uColorB, 0.38 + 0.18 * sin(uTime * 0.18));\n    float alpha = uOpacity * (softCore * 0.7 + softBloom * 0.3) * drift;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function xe({ speed: e, reducedMotion: r, glowIntensity: i, colors: s, centerStrength: u }) {
	let d = n(null), f = n(null), p = n(null), m = _e(i), h = l.MathUtils.clamp(u, .45, 1.7), g = t(() => ({
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
				vertexShader: ve,
				fragmentShader: ye,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1,
				blending: l.AdditiveBlending
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
				vertexShader: ve,
				fragmentShader: be,
				transparent: !0,
				depthWrite: !1,
				toneMapped: !1,
				blending: l.AdditiveBlending
			})]
		})]
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/three/SphereScene.tsx
function q(e) {
	return new l.Color(`rgb(${e.split(" ").join(", ")})`);
}
function Se(e) {
	let { presetConfig: r, mode: s, quality: u, interactive: d, glowIntensity: f, speed: p, pointerX: m, pointerY: h, reducedMotion: g, visualScale: _ } = e, v = n(null), y = t(() => ({
		accent: q(r.accentRgb),
		halo: q(r.haloRgb),
		violet: q(r.violetRgb),
		pink: q(r.pinkRgb),
		mint: q(r.mintRgb),
		white: q(r.whiteRgb ?? "255 255 255")
	}), [r]), b = Math.max(p, .15);
	return c((e) => {
		let t = e.clock.getElapsedTime(), n = g ? .06 : d ? 1 : .14, r = h * .08 * n, i = m * .1 * n;
		v.current && (v.current.rotation.x = l.MathUtils.lerp(v.current.rotation.x, r, .08), v.current.rotation.y = l.MathUtils.lerp(v.current.rotation.y, i, .08), v.current.rotation.z = l.MathUtils.lerp(v.current.rotation.z, Math.sin(t * .24 * b) * .008, .05));
	}), /* @__PURE__ */ o(i, { children: [/* @__PURE__ */ a(ge, {
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
				blending: l.AdditiveBlending,
				depthWrite: !1,
				side: l.BackSide,
				toneMapped: !1
			})] }),
			/* @__PURE__ */ a(fe, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				volumeStrength: r.innerVolumeStrength
			}),
			/* @__PURE__ */ a(de, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				echoStrength: r.echoStrength
			}),
			/* @__PURE__ */ a(F, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y
			}),
			/* @__PURE__ */ a(ie, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				pulseStrength: r.pulseStrength
			}),
			/* @__PURE__ */ a(xe, {
				speed: p,
				reducedMotion: g,
				glowIntensity: f,
				colors: y,
				centerStrength: r.centerStrength
			}),
			/* @__PURE__ */ a(D, {
				speed: p,
				reducedMotion: g,
				interactive: d,
				glowIntensity: f,
				colors: y,
				scatterStrength: r.scatterStrength
			}),
			/* @__PURE__ */ a(he, {
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
var Ce = {
	low: 1,
	medium: [1, 1.5],
	high: [1, 2]
};
function we({ quality: e, visualScale: t, ...n }) {
	return /* @__PURE__ */ a(s, {
		dpr: Ce[e],
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
		children: /* @__PURE__ */ a(Se, {
			quality: e,
			visualScale: t,
			...n
		})
	});
}
//#endregion
//#region src/components/SphereVisual/renderers/ThreeSphereRenderer.tsx
function Te(e) {
	return /* @__PURE__ */ a("div", {
		style: {
			width: "100%",
			height: "100%",
			pointerEvents: "none"
		},
		children: /* @__PURE__ */ a(we, { ...e })
	});
}
//#endregion
//#region src/components/SphereVisual/SphereVisual.tsx
var Ee = 440;
function De({ size: e = d.size, width: t, height: n, mode: r = d.mode, preset: i = d.preset, quality: o = d.quality, interactive: s = d.interactive, glowIntensity: c = d.glowIntensity, speed: l = d.speed, background: m = d.background, renderer: h = "three", className: _ }) {
	let v = p(), y = s && !v, { containerRef: b, pointerX: x, pointerY: C } = g(y), w = t ?? e, T = n ?? e, E = f[i], D = [
		u.root,
		m === "dark" ? u.darkBackground : "",
		_ ?? ""
	].filter(Boolean).join(" "), O = {
		width: w,
		height: T
	}, k = {
		presetConfig: E,
		mode: r,
		quality: o,
		interactive: y,
		glowIntensity: c,
		speed: l,
		pointerX: x,
		pointerY: C,
		reducedMotion: v,
		visualScale: e / Ee
	};
	return /* @__PURE__ */ a("div", {
		className: D,
		style: O,
		children: /* @__PURE__ */ a("div", {
			ref: b,
			className: u.stage,
			children: h === "css" ? /* @__PURE__ */ a(S, {
				presetConfig: E,
				mode: r,
				quality: o,
				interactive: y,
				glowIntensity: c,
				speed: l,
				pointerX: x,
				pointerY: C,
				reducedMotion: v
			}) : /* @__PURE__ */ a(Te, { ...k })
		})
	});
}
//#endregion
//#region src/components/SphereVisual/catalog/sphereCatalog.ts
var Oe = [
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
], ke = Oe.map((e) => e.preset), Ae = Oe.map((e) => ({
	value: e.preset,
	label: e.selectLabel
})), je = {
	root: "_root_xp51f_1",
	darkBackground: "_darkBackground_xp51f_19",
	stage: "_stage_xp51f_41"
}, J = {
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
}, Me = {
	"atomic-orb": J,
	"atomic-orb-no-electrons": {
		...J,
		families: J.families.map((e) => ({
			...e,
			nodes: {
				...e.nodes,
				count: 0
			}
		}))
	},
	"atomic-orb-more-electrons": {
		...J,
		families: J.families.map((e, t) => {
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
		...J,
		coreRgb: "236 248 255",
		glowRgb: "205 232 255",
		accentRgb: "182 208 255",
		hotRgb: "255 255 255",
		haloOpacity: .045,
		coreGlowOpacity: .22,
		families: J.families.map((e) => ({
			...e,
			heroOpacity: Math.min(e.heroOpacity + .04, .78),
			heroAccentMix: Math.max(e.heroAccentMix - .04, .04),
			hotColorMix: Math.max(e.hotColorMix - .02, .04)
		}))
	},
	"atomic-orb-violet": {
		...J,
		coreRgb: "228 220 255",
		glowRgb: "171 126 255",
		accentRgb: "118 102 255",
		hotRgb: "255 244 255",
		haloOpacity: .045,
		coreGlowOpacity: .22,
		families: J.families.map((e) => ({
			...e,
			heroAccentMix: Math.min(e.heroAccentMix + .08, .32),
			echoAccentMix: Math.min(e.echoAccentMix + .06, .22),
			hotColorMix: Math.min(e.hotColorMix + .04, .14)
		}))
	}
}, Y = {
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
function Ne(e) {
	return { ...e };
}
function Pe(e = {}) {
	let t = Y.gyro, n = e.gyro?.rings ?? t.rings;
	return {
		...Y,
		...e,
		families: [],
		gyro: {
			...t,
			...e.gyro,
			rings: n.map(Ne)
		}
	};
}
var Fe = {
	"gyro-core": Y,
	"gyro-core-precision": Pe({
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
			rings: Y.gyro.rings.map((e, t) => ({
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
	"gyro-core-reactor": Pe({
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
			rings: Y.gyro.rings.map((e, t) => ({
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
	"gyro-core-amber": Pe({
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
			rings: Y.gyro.rings.map((e, t) => ({
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
}, Ie = {
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
function Le(e = {}) {
	let t = Ie.portal, n = e.portal?.rings ?? t.rings;
	return {
		...Ie,
		...e,
		families: [],
		portal: {
			...t,
			...e.portal,
			rings: n.map((e) => ({ ...e }))
		}
	};
}
var Re = Le({
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
		rings: Ie.portal.rings.map((e, t) => ({
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
}), ze = Le({
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
		rings: Ie.portal.rings.map((e, t) => ({
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
}), Be = {
	"portal-gate": Le(),
	"portal-gate-violet": Re,
	"portal-gate-ember": ze
}, X = {
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
function Ve(e) {
	return {
		...e,
		echoes: e.echoes.map((e) => ({ ...e })),
		nodes: { ...e.nodes }
	};
}
function Z(e = {}) {
	let t = e.families ?? X.families;
	return {
		...X,
		...e,
		planetDust: {
			...X.planetDust,
			...e.planetDust
		},
		families: t.map(Ve)
	};
}
var He = Z({
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
	families: X.families.map((e, t) => ({
		...e,
		flowSpeed: t === 0 ? .085 : .068,
		shimmerSpeed: t === 0 ? .31 : .26,
		heroOpacity: t === 0 ? .7 : .44,
		heroAccentMix: t === 0 ? .14 : .18,
		hotColorMix: t === 0 ? .08 : .07
	}))
}), Ue = Z({
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
	families: X.families.map((e, t) => ({
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
}), We = Z({
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
	families: X.families.map((e, t) => ({
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
}), Ge = {
	"ring-planet": Z(),
	"ring-planet-stardust": Z({ planetDust: { enabled: !0 } }),
	"ring-planet-sand": He,
	"ring-planet-sand-stardust": Z({
		...He,
		planetDust: {
			...He.planetDust,
			enabled: !0,
			density: .84,
			size: .94,
			brightness: .9,
			motion: .74,
			tintRgb: "255 218 166"
		},
		families: He.families
	}),
	"ring-planet-ice": Ue,
	"ring-planet-eclipse": We
}, Ke = {
	...Me,
	...Ge,
	...Fe,
	...Be
};
//#endregion
//#region src/components/OrbitalVisual/renderers/three/GyroRing.tsx
function qe(e) {
	switch (e) {
		case "low": return 28;
		case "high": return 80;
		default: return 54;
	}
}
function Je({ radius: e, width: t, depth: n, arc: r, curveSegments: i, bevelScale: a = 1 }) {
	let o = e + t / 2, s = Math.max(e - t / 2, .02), c = new l.Shape();
	c.moveTo(o, 0), c.absarc(0, 0, o, 0, r, !1), c.lineTo(Math.cos(r) * s, Math.sin(r) * s), c.absarc(0, 0, s, r, 0, !0), c.closePath();
	let u = Math.min(t * .085, n * .28) * a, d = new l.ExtrudeGeometry(c, {
		depth: n,
		steps: 1,
		curveSegments: i,
		bevelEnabled: u > 1e-4,
		bevelSegments: u > 1e-4 ? 2 : 0,
		bevelSize: u,
		bevelThickness: u * .72
	});
	return d.translate(0, 0, -n / 2), d.computeVertexNormals(), d;
}
function Ye({ config: r, colors: i, quality: s, speed: u, glowFactor: d, index: f }) {
	let p = n(null), m = n(null), h = n(null), g = Math.max(3, Math.round(r.segments)), _ = Math.PI * 2 / g, v = _ * l.MathUtils.clamp(1 - r.gapRatio, .72, .996), y = Math.max(_ - v, .001), b = qe(s), x = Math.max(r.thickness * 2.42, .058), S = Math.max(r.thickness * .78, .019), C = Math.max(x * r.railThicknessScale, .013), w = Math.max(S * .095, .0028), T = t(() => Je({
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
	]), E = t(() => Je({
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
	]), D = t(() => Je({
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
		let t = e.clock.getElapsedTime(), n = Math.max(u, .2), i = r.spatialPhase + t * r.spatialSpeed * r.spatialDirection * n;
		r.spatialMotion === "planar-orbit" ? (p.current.rotation.set(0, 0, i), m.current.rotation.set(r.tiltX, r.tiltY, r.tiltZ)) : r.spatialMotion === "axial-reveal-horizontal" ? (p.current.rotation.set(0, 0, 0), m.current.rotation.set(r.tiltX + i, r.tiltY, r.tiltZ)) : (p.current.rotation.set(0, 0, 0), m.current.rotation.set(r.tiltX, r.tiltY + i, r.tiltZ)), h.current.rotation.z = r.phase + t * r.spinSpeed * r.direction * n;
	});
	let F = S / 2 + w * .72, te = -F, I = l.MathUtils.clamp(r.radius * y * 1.05, x * .16, x * .5);
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
									opacity: l.MathUtils.clamp(r.opacity * .64 * d, 0, .82),
									blending: l.AdditiveBlending,
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
									opacity: l.MathUtils.clamp(r.opacity * .34 * d, 0, .56),
									blending: l.AdditiveBlending,
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
									opacity: l.MathUtils.clamp(r.opacity * .2 * d, 0, .32),
									blending: l.AdditiveBlending,
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
								opacity: l.MathUtils.clamp(.42 * d, 0, .66),
								blending: l.AdditiveBlending,
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
									opacity: l.MathUtils.clamp(.58 * d, 0, .78),
									blending: l.AdditiveBlending,
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
function Xe() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,0.9)"), n.addColorStop(.12, "rgba(255,255,255,0.76)"), n.addColorStop(.3, "rgba(255,255,255,0.28)"), n.addColorStop(.58, "rgba(255,255,255,0.055)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new l.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = l.LinearFilter, r.magFilter = l.LinearFilter, r;
}
function Ze(e) {
	switch (e) {
		case "low": return 32;
		case "high": return 64;
		default: return 48;
	}
}
function Qe(e) {
	switch (e) {
		case "low": return 1;
		case "high": return 2;
		default: return 1;
	}
}
function $e({ coreSize: r, config: i, colors: s, quality: u, speed: d, glowFactor: f }) {
	let p = n(null), m = n(null), h = n(null), g = t(() => Xe(), []), _ = Ze(u), v = Qe(u), y = t(() => s.accent.clone().lerp(s.glow, .16).multiplyScalar(1.12), [s.accent, s.glow]), b = t(() => s.accent.clone().lerp(s.glow, .5).multiplyScalar(.82), [s.accent, s.glow]), x = t(() => s.core.clone().lerp(s.hot, .18), [s.core, s.hot]), S = t(() => s.hot.clone().lerp(s.glow, .16), [s.hot, s.glow]);
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
		i.rings.map((e, t) => /* @__PURE__ */ a(Ye, {
			config: e,
			colors: {
				metal: y,
				glow: s.glow,
				hot: s.hot
			},
			quality: u,
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
						blending: l.AdditiveBlending,
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
								opacity: l.MathUtils.clamp(.46 * f, 0, .68),
								blending: l.AdditiveBlending,
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
								opacity: l.MathUtils.clamp(.34 * f, 0, .52),
								blending: l.AdditiveBlending,
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
								opacity: l.MathUtils.clamp(.3 * f, 0, .46),
								blending: l.AdditiveBlending,
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
					children: [/* @__PURE__ */ a("icosahedronGeometry", { args: [C, u === "high" ? 2 : 1] }), /* @__PURE__ */ a("meshPhysicalMaterial", {
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
						blending: l.AdditiveBlending,
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
						blending: l.AdditiveBlending,
						toneMapped: !1
					})]
				})
			]
		})
	] });
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/orbitGeometry.ts
function et(e, { radius: t, wobble: n, seed: r, ellipseX: i, ellipseY: a }) {
	let o = Math.sin(e * 2 + r * .67) * n * .008, s = Math.cos(e * 4 - r * .41) * n * .0025, c = t * (1 + o + s), u = Math.cos(e) * c * i, d = Math.sin(e) * c * a, f = Math.sin(e * 2 + r * .31) * t * n * .008 + Math.cos(e * 3 - r * .19) * t * n * .002;
	return new l.Vector3(u, d, f);
}
function tt(e) {
	let t = [];
	for (let n = 0; n < 220; n += 1) {
		let r = n / 220 * Math.PI * 2;
		t.push(et(r, e));
	}
	return new l.CatmullRomCurve3(t, !0, "catmullrom", .2);
}
function nt(e, t, n, r, i, a) {
	let o = tt({
		radius: e,
		wobble: n,
		seed: r,
		ellipseX: i,
		ellipseY: a
	});
	return new l.TubeGeometry(o, 280, t, 20, !0);
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/OrbitalNode.tsx
function rt() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.16, "rgba(255,255,255,0.98)"), n.addColorStop(.34, "rgba(255,255,255,0.58)"), n.addColorStop(.62, "rgba(255,255,255,0.18)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new l.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = l.LinearFilter, r.magFilter = l.LinearFilter, r;
}
function it({ radius: r, wobble: i, seed: s, ellipseX: u, ellipseY: d, size: f, glowSize: p, speed: m, offset: h, pulseOffset: g, color: _, glowColor: v, opacity: y }) {
	let b = n(null), x = n(null), S = n(null), C = n(null), w = t(() => rt(), []);
	e(() => () => {
		w?.dispose();
	}, [w]);
	let T = t(() => v.clone().lerp(_, .12), [v, _]), E = t(() => v.clone().lerp(_, .38), [v, _]), D = t(() => _.clone().lerp(new l.Color(1, 1, 1), .28), [_]);
	return c((e) => {
		if (!b.current) return;
		let t = e.clock.getElapsedTime(), n = et((t * m + h) % 1 * Math.PI * 2, {
			radius: r,
			wobble: i,
			seed: s,
			ellipseX: u,
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
					blending: l.AdditiveBlending,
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
					blending: l.AdditiveBlending,
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
					blending: l.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			})
		]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/OrbitRibbon.tsx
var at = "\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  void main() {\n    vUv = uv;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vec4 centerMvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n\n    vViewZ = mvPosition.z;\n    vCenterViewZ = centerMvPosition.z;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", ot = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uFlowSpeed;\n  uniform float uShimmerSpeed;\n  uniform float uOffset;\n  uniform float uDepthSide;\n  uniform float uRingStyle;\n  uniform vec3 uBaseColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  float loopDistance(float a, float b) {\n    float d = abs(a - b);\n    return min(d, 1.0 - d);\n  }\n\n  void main() {\n    // uDepthSide:\n    //  0.0  -> full ring\n    //  1.0  -> front half only\n    // -1.0  -> back half only\n\n    if (uDepthSide > 0.5) {\n      // Front: ближе к камере, чем центр планеты\n      if (vViewZ < vCenterViewZ) {\n        discard;\n      }\n    } else if (uDepthSide < -0.5) {\n      // Back: дальше от камеры, чем центр планеты\n      if (vViewZ >= vCenterViewZ) {\n        discard;\n      }\n    }\n\n    float along = fract(vUv.x - uTime * uFlowSpeed + uOffset);\n\n    /*\n     * Energy-style остаётся прежним:\n     * яркая бегущая голова, хвост, shimmer и additive glow.\n     * Именно этот путь продолжают использовать атомные пресеты.\n     */\n    float head = exp(-pow(loopDistance(along, 0.18) / 0.05, 2.0));\n    float tail = exp(-pow(loopDistance(along, 0.26) / 0.16, 2.0)) * 0.58;\n    float pulse = clamp(head + tail, 0.0, 1.0);\n\n    float energyBand = pow(\n      max(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0),\n      0.58\n    );\n\n    float energyBody =\n      0.9 +\n      0.1 *\n        sin(\n          vUv.x * 18.0 -\n          uTime * uShimmerSpeed +\n          uOffset * 6.2831\n        );\n\n    float energyShimmer =\n      0.98 +\n      0.02 *\n        sin(\n          vUv.x * 32.0 -\n          uTime * (uShimmerSpeed + 0.22) +\n          uOffset * 4.0\n        );\n\n    vec3 energyColor = mix(\n      uBaseColor,\n      uHotColor,\n      pulse * 0.9\n    );\n\n    float energyAlpha =\n      uOpacity *\n      energyBand *\n      (0.86 + pulse * 0.76) *\n      energyBody *\n      energyShimmer;\n\n    /*\n     * Planetary-style:\n     * без белой бегущей головы и без ощущения электрического кабеля.\n     * Вместо неё — широкая спокойная полоса, тонкие слои и очень\n     * медленный неоднородный световой дрейф.\n     */\n    float crossSection = abs(vUv.y - 0.5) * 2.0;\n\n    float planetaryBand = pow(\n      max(1.0 - crossSection, 0.0),\n      0.3\n    );\n\n    float planetaryEdge =\n      1.0 - smoothstep(0.76, 1.0, crossSection);\n\n    float broadLayer =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.y * 18.0 +\n          vUv.x * 3.2 +\n          uOffset * 7.0\n        );\n\n    float fineLayer =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.y * 46.0 -\n          vUv.x * 5.4 +\n          uOffset * 11.0\n        );\n\n    float layerStructure =\n      broadLayer * 0.68 +\n      fineLayer * 0.32;\n\n    float slowDrift =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 9.0 -\n          uTime * uFlowSpeed * 0.34 +\n          uOffset * 6.2831\n        );\n\n    float softVariation =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 21.0 -\n          uTime * uShimmerSpeed * 0.12 +\n          vUv.y * 5.0 +\n          uOffset * 4.0\n        );\n\n    float planetaryHotMix =\n      0.035 +\n      slowDrift * 0.085 +\n      layerStructure * 0.025;\n\n    vec3 planetaryColor = mix(\n      uBaseColor * (0.9 + layerStructure * 0.12),\n      uHotColor,\n      planetaryHotMix\n    );\n\n    float planetaryAlpha =\n      uOpacity *\n      planetaryBand *\n      planetaryEdge *\n      (\n        0.76 +\n        layerStructure * 0.14 +\n        slowDrift * 0.07 +\n        softVariation * 0.03\n      );\n\n    vec3 color = mix(\n      energyColor,\n      planetaryColor,\n      uRingStyle\n    );\n\n    float alpha = mix(\n      energyAlpha,\n      planetaryAlpha,\n      uRingStyle\n    );\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function st(e, t, n, r, i, a, o, s, c) {
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
function ct(e, t, n, r) {
	let i = new l.ShaderMaterial({
		uniforms: e,
		vertexShader: at,
		fragmentShader: ot,
		transparent: !0,
		depthWrite: !1,
		depthTest: n,
		side: l.DoubleSide,
		blending: t === "planetary" ? l.NormalBlending : l.AdditiveBlending
	});
	return i.name = r, i.toneMapped = !1, i;
}
function lt({ radius: r, thickness: s, ellipseX: l, ellipseY: u, tiltX: d, tiltY: f, tiltZ: p, wobble: m, seed: h, baseColor: g, hotColor: _, opacity: v, flowSpeed: y, shimmerSpeed: b, offset: x, speed: S, glowFactor: C, ringStyle: w = "energy", splitDepthLayers: T = !1, nodes: E = [] }) {
	let D = n(null), O = t(() => nt(r, s, m, h, l, u), [
		r,
		s,
		m,
		h,
		l,
		u
	]), k = t(() => st(v, C, y, b, x, g, _, 0, w), [
		v,
		C,
		y,
		b,
		x,
		g,
		_,
		w
	]), A = t(() => st(v, C, y, b, x, g, _, 1, w), [
		v,
		C,
		y,
		b,
		x,
		g,
		_,
		w
	]), j = t(() => st(v, C, y, b, x, g, _, -1, w), [
		v,
		C,
		y,
		b,
		x,
		g,
		_,
		w
	]), M = t(() => ct(k, w, !0, "OrbitalRibbonFullMaterial"), [
		k,
		w,
		at,
		ot
	]), N = t(() => ct(A, w, !1, "OrbitalRibbonFrontMaterial"), [
		A,
		w,
		at,
		ot
	]), P = t(() => ct(j, w, !0, "OrbitalRibbonBackMaterial"), [
		j,
		w,
		at,
		ot
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
		}), E.map((e, t) => /* @__PURE__ */ a(it, {
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
var ut = "\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec3 vObjectPosition;\n\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n\n    vViewNormal = normalize(normalMatrix * normal);\n    vViewPosition = -mvPosition.xyz;\n    vObjectPosition = position;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", dt = "\n  uniform vec3 uCoreColor;\n  uniform vec3 uGlowColor;\n  uniform vec3 uAccentColor;\n  uniform vec3 uHotColor;\n  uniform float uGlowFactor;\n\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec3 vObjectPosition;\n\n  float hash31(vec3 p) {\n    p = fract(p * 0.1031);\n    p += dot(p, p.yzx + 33.33);\n    return fract((p.x + p.y) * p.z);\n  }\n\n  float noise3(vec3 p) {\n    vec3 i = floor(p);\n    vec3 f = fract(p);\n\n    f = f * f * (3.0 - 2.0 * f);\n\n    float n000 = hash31(i + vec3(0.0, 0.0, 0.0));\n    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));\n    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));\n    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));\n    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));\n    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));\n    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));\n    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));\n\n    float nx00 = mix(n000, n100, f.x);\n    float nx10 = mix(n010, n110, f.x);\n    float nx01 = mix(n001, n101, f.x);\n    float nx11 = mix(n011, n111, f.x);\n\n    float nxy0 = mix(nx00, nx10, f.y);\n    float nxy1 = mix(nx01, nx11, f.y);\n\n    return mix(nxy0, nxy1, f.z);\n  }\n\n  float fbm(vec3 p) {\n    float value = 0.0;\n    float amplitude = 0.5;\n\n    for (int i = 0; i < 5; i++) {\n      value += noise3(p) * amplitude;\n      p = p * 2.03 + vec3(1.7, 2.9, 4.1);\n      amplitude *= 0.5;\n    }\n\n    return value;\n  }\n\n  void main() {\n    vec3 normal = normalize(vViewNormal);\n    vec3 viewDirection = normalize(vViewPosition);\n\n    vec3 lightDirection = normalize(vec3(-0.64, 0.5, 0.62));\n    vec3 fillDirection = normalize(vec3(0.52, -0.2, 0.74));\n\n    float diffuse = dot(normal, lightDirection);\n    float softLight = smoothstep(-0.52, 0.88, diffuse);\n    float daylight = smoothstep(-0.24, 0.72, diffuse);\n    float terminator = smoothstep(-0.42, 0.26, diffuse);\n    float fillLight = max(dot(normal, fillDirection), 0.0);\n\n    vec3 spherePosition = normalize(vObjectPosition);\n\n    vec3 warp = vec3(\n      fbm(spherePosition * 1.8 + vec3(0.2, 1.1, -0.7)),\n      fbm(spherePosition * 2.05 + vec3(-1.3, 0.35, 0.9)),\n      fbm(spherePosition * 1.72 + vec3(0.75, -0.8, 1.45))\n    ) - 0.5;\n\n    vec3 warpedPosition = normalize(spherePosition + warp * 0.28);\n\n    float broadNoise = fbm(\n      warpedPosition * 2.25 + vec3(0.35, 1.2, -0.8)\n    );\n    float mediumNoise = fbm(\n      warpedPosition * 5.2 + vec3(-1.4, 0.6, 1.1)\n    );\n    float detailNoise = fbm(\n      warpedPosition * 12.2 + vec3(2.2, -1.1, 0.45)\n    );\n\n    float latitudeBand =\n      0.5 +\n      0.5 *\n        sin(\n          warpedPosition.y * 16.5 +\n          broadNoise * 5.6 +\n          warpedPosition.x * 1.2\n        );\n\n    float secondaryBand =\n      0.5 +\n      0.5 *\n        sin(\n          warpedPosition.y * 34.0 -\n          mediumNoise * 4.4 +\n          warpedPosition.z * 1.7\n        );\n\n    float cloudField =\n      broadNoise * 0.58 +\n      mediumNoise * 0.28 +\n      detailNoise * 0.14 +\n      latitudeBand * 0.1;\n\n    float cloudMask = smoothstep(0.46, 0.73, cloudField);\n    float cloudVeil = smoothstep(0.34, 0.78, cloudField);\n\n    float darkerPatch = smoothstep(\n      0.5,\n      0.8,\n      (1.0 - broadNoise) * 0.5 +\n        mediumNoise * 0.34 +\n        detailNoise * 0.16\n    );\n\n    float stormDistance = distance(\n      spherePosition,\n      normalize(vec3(-0.42, 0.18, 0.88))\n    );\n\n    float storm =\n      exp(-stormDistance * stormDistance * 28.0) *\n      (0.72 + detailNoise * 0.28);\n\n    vec3 deepSurface = mix(\n      uAccentColor * 0.3,\n      uCoreColor * 0.68,\n      0.24 + broadNoise * 0.64\n    );\n\n    vec3 middleSurface = mix(\n      deepSurface,\n      uGlowColor * 0.62 + uCoreColor * 0.24,\n      mediumNoise * 0.42\n    );\n\n    vec3 bandColor = mix(\n      uAccentColor * 0.52,\n      uGlowColor * 0.68,\n      latitudeBand\n    );\n\n    vec3 cloudColor = mix(\n      uGlowColor,\n      uHotColor,\n      0.24 + detailNoise * 0.1\n    );\n\n    vec3 surfaceColor = middleSurface;\n\n    surfaceColor = mix(\n      surfaceColor,\n      bandColor,\n      latitudeBand * 0.085 + secondaryBand * 0.04\n    );\n\n    surfaceColor = mix(\n      surfaceColor,\n      cloudColor,\n      cloudMask * 0.38 + cloudVeil * 0.075\n    );\n\n    surfaceColor += cloudColor * storm * 0.18;\n\n    surfaceColor = mix(\n      surfaceColor,\n      uAccentColor * 0.34,\n      darkerPatch * 0.13\n    );\n\n    vec3 shadowColor = mix(\n      uAccentColor * 0.3,\n      uCoreColor * 0.5,\n      0.28 + broadNoise * 0.46\n    );\n\n    shadowColor = mix(\n      shadowColor,\n      surfaceColor * 0.64,\n      0.4 + mediumNoise * 0.12\n    );\n\n    vec3 illuminatedSurface =\n      surfaceColor * (0.82 + softLight * 0.34);\n\n    vec3 litSurface = mix(\n      shadowColor,\n      illuminatedSurface,\n      terminator\n    );\n\n    litSurface +=\n      uCoreColor *\n      fillLight *\n      (1.0 - daylight) *\n      0.11;\n\n    vec3 halfVector = normalize(lightDirection + viewDirection);\n\n    float specular =\n      pow(max(dot(normal, halfVector), 0.0), 52.0) *\n      smoothstep(-0.04, 0.7, diffuse);\n\n    float rim = pow(\n      1.0 - max(dot(normal, viewDirection), 0.0),\n      3.1\n    );\n\n    float litRimMask =\n      0.1 + 0.9 * smoothstep(-0.34, 0.64, diffuse);\n\n    vec3 rimColor = mix(\n      uAccentColor,\n      uGlowColor,\n      0.78\n    );\n\n    vec3 finalColor =\n      litSurface +\n      uHotColor * specular * 0.16 +\n      rimColor *\n        rim *\n        0.22 *\n        uGlowFactor *\n        litRimMask;\n\n    gl_FragColor = vec4(finalColor, 1.0);\n  }\n", ft = "\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n\n    vViewNormal = normalize(normalMatrix * normal);\n    vViewPosition = -mvPosition.xyz;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", pt = "\n  uniform vec3 uGlowColor;\n  uniform vec3 uAccentColor;\n  uniform float uGlowFactor;\n\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n\n  void main() {\n    vec3 normal = normalize(vViewNormal);\n    vec3 viewDirection = normalize(vViewPosition);\n    vec3 lightDirection = normalize(vec3(-0.64, 0.5, 0.62));\n\n    float diffuse = dot(normal, lightDirection);\n    float litSide = smoothstep(-0.32, 0.66, diffuse);\n\n    float rim = pow(\n      1.0 - max(dot(normal, viewDirection), 0.0),\n      3.05\n    );\n\n    vec3 atmosphereColor = mix(\n      uAccentColor,\n      uGlowColor,\n      0.5 + litSide * 0.38\n    );\n\n    float alpha =\n      rim *\n      (0.016 + litSide * 0.105) *\n      uGlowFactor;\n\n    gl_FragColor = vec4(\n      atmosphereColor * rim * (0.42 + litSide * 0.62),\n      alpha\n    );\n  }\n";
function mt({ coreSize: r, colors: i, speed: s, glowFactor: u }) {
	let d = n(null), f = t(() => ({
		uCoreColor: { value: i.core.clone() },
		uGlowColor: { value: i.glow.clone() },
		uAccentColor: { value: i.accent.clone() },
		uHotColor: { value: i.hot.clone() },
		uGlowFactor: { value: u }
	}), [i, u]), p = t(() => ({
		uGlowColor: { value: i.glow.clone() },
		uAccentColor: { value: i.accent.clone() },
		uGlowFactor: { value: u }
	}), [i, u]), m = t(() => {
		let e = new l.ShaderMaterial({
			uniforms: f,
			vertexShader: ut,
			fragmentShader: dt,
			depthWrite: !0,
			depthTest: !0,
			side: l.FrontSide
		});
		return e.name = "RingPlanetSurfaceMaterial", e.toneMapped = !1, e;
	}, [
		f,
		ut,
		dt
	]), h = t(() => {
		let e = new l.ShaderMaterial({
			uniforms: p,
			vertexShader: ft,
			fragmentShader: pt,
			transparent: !0,
			depthWrite: !1,
			depthTest: !0,
			side: l.FrontSide,
			blending: l.AdditiveBlending
		});
		return e.name = "RingPlanetAtmosphereMaterial", e.toneMapped = !1, e;
	}, [
		p,
		ft,
		pt
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
var ht = [
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
function gt(e) {
	let t = Math.floor(Math.abs(e) * 1e5) || 1;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function _t(e, t, n) {
	return t + (n - t) * e();
}
function vt(e) {
	let [t = 255, n = 255, r = 255] = e.trim().split(/\s+/).map(Number);
	return new l.Color(l.MathUtils.clamp(t / 255, 0, 1), l.MathUtils.clamp(n / 255, 0, 1), l.MathUtils.clamp(r / 255, 0, 1));
}
function yt(e) {
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
	return l.MathUtils.clamp(t[o] + _t(e, -n[o], n[o]), .025, .975);
}
function bt() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 64, e.height = 64;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(32, 32, 0, 32, 32, 32);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.18, "rgba(255,255,255,0.98)"), n.addColorStop(.44, "rgba(255,255,255,0.62)"), n.addColorStop(.72, "rgba(255,255,255,0.16)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 64, 64), t.fillStyle = n, t.fillRect(0, 0, 64, 64);
	let r = new l.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = l.LinearFilter, r.magFilter = l.LinearFilter, r;
}
function xt(e, t, n, r, i, a, o, s, c) {
	let u = t.angle + n * t.orbitSpeed + Math.sin(n * .18 + t.phase) * .012, d = l.MathUtils.clamp(t.radialProgress + Math.sin(n * .28 + t.phase) * t.radialPulse, .015, .985), f = r + (d - .5) * i, p = Math.sin(u * 3 + c * .73 + d * Math.PI) * s * .4, m = Math.sin(n * .22 + t.phase) * i * .02;
	e.set(Math.cos(u) * f * a, Math.sin(u) * f * o, p + t.depth + m);
}
function St(e) {
	let t = new Float32Array(e * 3), n = new Float32Array(e * 3), r = new l.BufferAttribute(t, 3), i = new l.BufferAttribute(n, 3);
	r.setUsage(l.DynamicDrawUsage), i.setUsage(l.DynamicDrawUsage);
	let a = new l.BufferGeometry();
	return a.setAttribute("position", r), a.setAttribute("color", i), a.setDrawRange(0, 0), {
		geometry: a,
		positions: t,
		colors: n
	};
}
function Ct(e, t, n, r, i) {
	return new l.PointsMaterial({
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
		blending: l.AdditiveBlending,
		toneMapped: !1
	});
}
function wt(e, t, n, r, i, a, o, s, c, u, d, f) {
	let p = gt(o + 41.73 + t * 17.19), m = Math.max(1, Math.round(e.count * Math.max(u, 0))), h = [], g = i.clone(), _ = new l.Color(.98, .995, 1), v = [
		.06,
		.24,
		.48,
		.72,
		.91
	];
	for (let t = 0; t < m; t += 1) {
		let t = p() < e.clusterChance, n = v[Math.min(v.length - 1, Math.floor(p() * v.length))], i = t ? n + _t(p, -.038, .038) : p(), o = p(), s = r.clone().lerp(g, l.MathUtils.clamp(e.colorMix + o * .08, 0, 1)).lerp(_, l.MathUtils.clamp(e.whiteMix + o * .08, 0, 1));
		h.push({
			angle: i * Math.PI * 2,
			radialProgress: yt(p),
			phase: p() * Math.PI * 2,
			orbitSpeed: _t(p, .003, .011) * (p() < .5 ? -1 : 1),
			radialPulse: _t(p, .002, .008),
			depth: _t(p, -a * .12, a * .12),
			color: s
		});
	}
	let y = St(m), b = St(m), x = l.MathUtils.clamp(e.opacity * s * c * f * 1.36, 0, .95), S = e.size * Math.max(d, 0), C = Ct(`PlanetRingDust-${e.name}-front`, n, S, x, !1), w = Ct(`PlanetRingDust-${e.name}-back`, n, S, x, !0);
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
function Tt(e, t, n, r, i) {
	let a = n * 3;
	e[a] = r.x, e[a + 1] = r.y, e[a + 2] = r.z, t[a] = i.r, t[a + 1] = i.g, t[a + 2] = i.b;
}
function Et(e, t) {
	e.setDrawRange(0, t);
	let n = e.getAttribute("position"), r = e.getAttribute("color");
	n.needsUpdate = !0, r.needsUpdate = !0;
}
function Dt({ radius: r, thickness: i, ellipseX: s, ellipseY: u, wobble: d, seed: f, baseColor: p, opacity: m, speed: h, glowFactor: g, density: _, size: v, brightness: y, motion: b, tintRgb: x, splitDepthLayers: S }) {
	let C = n(null), w = Math.max(i * 8.4, r * .112), T = t(() => bt(), []), E = t(() => vt(x), [x]), D = t(() => ht.map((e, t) => wt(e, t, T, p, E, w, f, m, g, _, v, y)), [
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
	let O = t(() => new l.Vector3(), []), k = t(() => new l.Vector3(), []), A = t(() => new l.Vector3(), []), j = t(() => new l.Vector3(), []);
	return c((e) => {
		if (!C.current) return;
		let t = e.clock.getElapsedTime(), n = Math.max(h, .2), i = Math.max(b, 0), a = t * n * i;
		C.current.rotation.z = Math.sin(a * .05 + f) * .002, C.current.updateWorldMatrix(!0, !1), j.set(0, 0, 0).applyMatrix4(C.current.matrixWorld).applyMatrix4(e.camera.matrixWorldInverse);
		for (let i = 0; i < D.length; i += 1) {
			let o = D[i], c = 0, l = 0;
			for (let t = 0; t < o.particles.length; t += 1) {
				let n = o.particles[t];
				xt(O, n, a, r, w, s, u, d, f), k.copy(O).applyMatrix4(C.current.matrixWorld), A.copy(k).applyMatrix4(e.camera.matrixWorldInverse), S && A.z - j.z >= 0 ? (Tt(o.frontPositions, o.frontColors, c, O, n.color), c += 1) : (Tt(o.backPositions, o.backColors, l, O, n.color), l += 1);
			}
			Et(o.frontGeometry, c), Et(o.backGeometry, l);
			let p = .72 + .28 * (.5 + .5 * Math.sin(t * n * (.42 + i * .09) + o.phase)), m = o.baseOpacity * p;
			o.frontMaterial.opacity = m, o.backMaterial.opacity = m;
		}
	}), /* @__PURE__ */ a("group", {
		ref: C,
		children: D.map((e, t) => {
			let n = ht[t];
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
var Ot = "\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  void main() {\n    vUv = uv;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vec4 centerMvPosition =\n      modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n\n    vViewZ = mvPosition.z;\n    vCenterViewZ = centerMvPosition.z;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", kt = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uFlowSpeed;\n  uniform float uShimmerSpeed;\n  uniform float uOffset;\n  uniform float uDepthSide;\n  uniform float uDepthFeather;\n  uniform vec3 uBaseColor;\n\n  varying vec2 vUv;\n  varying float vViewZ;\n  varying float vCenterViewZ;\n\n  float softBand(\n    float coordinate,\n    float center,\n    float width\n  ) {\n    float distanceFromCenter =\n      abs(coordinate - center);\n\n    return 1.0 - smoothstep(\n      width * 0.48,\n      width,\n      distanceFromCenter\n    );\n  }\n\n  void main() {\n    /*\n     * Кольцо по-прежнему делится на переднюю и заднюю части,\n     * чтобы оно действительно проходило вокруг планеты.\n     *\n     * Но вместо жёсткого discard на одной точной границе\n     * используется мягкая переходная зона.\n     */\n    float depthDelta =\n      vViewZ - vCenterViewZ;\n\n    float frontBlend =\n      smoothstep(\n        -uDepthFeather,\n        uDepthFeather,\n        depthDelta\n      );\n\n    float backBlend =\n      1.0 - frontBlend;\n\n    float depthBlend = 1.0;\n\n    if (uDepthSide > 0.5) {\n      depthBlend = frontBlend;\n    } else if (uDepthSide < -0.5) {\n      depthBlend = backBlend;\n    }\n\n    if (depthBlend <= 0.001) {\n      discard;\n    }\n\n    float radial =\n      clamp(vUv.y, 0.0, 1.0);\n\n    float innerFeather =\n      smoothstep(\n        0.0,\n        0.075,\n        radial\n      );\n\n    float outerFeather =\n      1.0 -\n      smoothstep(\n        0.925,\n        1.0,\n        radial\n      );\n\n    float edgeMask =\n      innerFeather *\n      outerFeather;\n\n    /*\n     * Четыре широкие ледяные полосы.\n     */\n    float bandA =\n      softBand(\n        radial,\n        0.13,\n        0.15\n      );\n\n    float bandB =\n      softBand(\n        radial,\n        0.35,\n        0.2\n      );\n\n    float bandC =\n      softBand(\n        radial,\n        0.63,\n        0.22\n      );\n\n    float bandD =\n      softBand(\n        radial,\n        0.87,\n        0.14\n      );\n\n    float broadMass =\n      bandA * 0.74 +\n      bandB * 0.92 +\n      bandC * 1.0 +\n      bandD * 0.76;\n\n    /*\n     * Две тёмные щели между основными полосами.\n     */\n    float gapA =\n      softBand(\n        radial,\n        0.245,\n        0.055\n      );\n\n    float gapB =\n      softBand(\n        radial,\n        0.505,\n        0.07\n      );\n\n    float gapMask =\n      1.0 -\n      gapA * 0.74 -\n      gapB * 0.64;\n\n    float slowDrift =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 12.5664 -\n          uTime *\n            uFlowSpeed *\n            0.13 +\n          uOffset * 6.2831\n        );\n\n    float secondaryDrift =\n      0.5 +\n      0.5 *\n        sin(\n          vUv.x * 25.1327 -\n          uTime *\n            uShimmerSpeed *\n            0.045 +\n          radial * 4.6 +\n          uOffset * 9.0\n        );\n\n    float broadVariation =\n      0.5 +\n      0.5 *\n        sin(\n          radial * 17.0 +\n          vUv.x * 3.0 +\n          uOffset * 5.0\n        );\n\n    float fineDust =\n      0.5 +\n      0.5 *\n        sin(\n          radial * 74.0 -\n          vUv.x * 6.0 +\n          uOffset * 11.0\n        );\n\n    /*\n     * Небольшая общая дымка связывает полосы\n     * и убирает ощущение набора проводов.\n     */\n    float baseHaze =\n      edgeMask * 0.08;\n\n    float structure =\n      baseHaze +\n      broadMass *\n      gapMask *\n      (\n        0.78 +\n        broadVariation * 0.15 +\n        fineDust * 0.07\n      );\n\n    vec3 deepColor =\n      uBaseColor * 0.42;\n\n    vec3 middleColor =\n      uBaseColor * 0.76 +\n      vec3(\n        0.0,\n        0.018,\n        0.055\n      );\n\n    vec3 lightColor =\n      uBaseColor * 1.08 +\n      vec3(\n        0.015,\n        0.07,\n        0.13\n      );\n\n    vec3 color =\n      mix(\n        deepColor,\n        middleColor,\n        smoothstep(\n          0.16,\n          0.56,\n          structure\n        )\n      );\n\n    color =\n      mix(\n        color,\n        lightColor,\n        smoothstep(\n          0.55,\n          0.92,\n          structure\n        ) *\n        0.72\n      );\n\n    color *=\n      0.9 +\n      slowDrift * 0.075 +\n      secondaryDrift * 0.03;\n\n    /*\n     * Передняя и задняя части используют одинаковый цвет.\n     * Разница между ними теперь создаётся только глубиной,\n     * а не резким скачком яркости.\n     */\n    float alpha =\n      uOpacity *\n      edgeMask *\n      structure *\n      (\n        0.66 +\n        slowDrift * 0.1 +\n        secondaryDrift * 0.035\n      ) *\n      depthBlend;\n\n    gl_FragColor =\n      vec4(\n        color,\n        alpha\n      );\n  }\n";
function At(e, t, n, r, i, a) {
	let o = Math.max(t * 8.4, e * .112), s = [], c = [], u = [];
	for (let t = 0; t <= 24; t += 1) {
		let l = t / 24, u = e + (l - .5) * o;
		for (let e = 0; e <= 256; e += 1) {
			let t = e / 256, o = t * Math.PI * 2, d = Math.sin(o * 3 + a * .73 + l * Math.PI) * i * .4;
			s.push(Math.cos(o) * u * n, Math.sin(o) * u * r, d), c.push(t, l);
		}
	}
	for (let e = 0; e < 24; e += 1) for (let t = 0; t < 256; t += 1) {
		let n = e * 257 + t, r = n + 257, i = r + 1, a = n + 1;
		u.push(n, r, a), u.push(r, i, a);
	}
	let d = new l.BufferGeometry();
	return d.setAttribute("position", new l.Float32BufferAttribute(s, 3)), d.setAttribute("uv", new l.Float32BufferAttribute(c, 2)), d.setIndex(u), d.computeVertexNormals(), d.computeBoundingSphere(), d;
}
function jt(e, t, n, r, i, a, o, s) {
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
function Mt(e, t, n) {
	let r = new l.ShaderMaterial({
		uniforms: e,
		vertexShader: Ot,
		fragmentShader: kt,
		transparent: !0,
		depthWrite: !1,
		depthTest: t,
		side: l.DoubleSide,
		blending: l.NormalBlending
	});
	return r.name = n, r.toneMapped = !1, r;
}
function Nt({ radius: r, thickness: s, ellipseX: l, ellipseY: u, tiltX: d, tiltY: f, tiltZ: p, wobble: m, seed: h, baseColor: g, opacity: _, flowSpeed: v, shimmerSpeed: y, offset: b, speed: x, glowFactor: S, splitDepthLayers: C = !0, dust: w }) {
	let T = n(null), E = t(() => At(r, s, l, u, m, h), [
		r,
		s,
		l,
		u,
		m,
		h
	]), D = t(() => Math.max(s * 1.6, r * .035), [s, r]), O = t(() => jt(_, S, v, y, b, g, 0, D), [
		_,
		S,
		v,
		y,
		b,
		g,
		D
	]), k = t(() => jt(_, S, v, y, b, g, 1, D), [
		_,
		S,
		v,
		y,
		b,
		g,
		D
	]), A = t(() => jt(_, S, v, y, b, g, -1, D), [
		_,
		S,
		v,
		y,
		b,
		g,
		D
	]), j = t(() => Mt(O, !0, "PlanetRingFullMaterial"), [
		O,
		Ot,
		kt
	]), M = t(() => Mt(k, !1, "PlanetRingFrontMaterial"), [
		k,
		Ot,
		kt
	]), N = t(() => Mt(A, !0, "PlanetRingBackMaterial"), [
		A,
		Ot,
		kt
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
		}), w?.enabled ? /* @__PURE__ */ a(Dt, {
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
var Pt = "\n  varying vec2 vUv;\n  varying vec3 vViewPosition;\n\n  void main() {\n    vUv = uv;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    vViewPosition = mvPosition.xyz;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", Ft = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uFlowSpeed;\n  uniform float uTurbulence;\n  uniform float uPulse;\n  uniform float uLayer;\n  uniform float uPhase;\n  uniform float uDirection;\n  uniform vec3 uCoreColor;\n  uniform vec3 uGlowColor;\n  uniform vec3 uAccentColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n  varying vec3 vViewPosition;\n\n  float hash21(vec2 pointValue) {\n    pointValue = fract(pointValue * vec2(123.34, 345.45));\n    pointValue += dot(pointValue, pointValue + 34.345);\n    return fract(pointValue.x * pointValue.y);\n  }\n\n  float noise21(vec2 pointValue) {\n    vec2 integerPart = floor(pointValue);\n    vec2 fractionalPart = fract(pointValue);\n    fractionalPart =\n      fractionalPart *\n      fractionalPart *\n      (3.0 - 2.0 * fractionalPart);\n\n    float a = hash21(integerPart);\n    float b = hash21(integerPart + vec2(1.0, 0.0));\n    float c = hash21(integerPart + vec2(0.0, 1.0));\n    float d = hash21(integerPart + vec2(1.0, 1.0));\n\n    return mix(\n      mix(a, b, fractionalPart.x),\n      mix(c, d, fractionalPart.x),\n      fractionalPart.y\n    );\n  }\n\n  float fbm(vec2 pointValue) {\n    float value = 0.0;\n    float amplitude = 0.5;\n\n    for (int index = 0; index < 6; index++) {\n      value += noise21(pointValue) * amplitude;\n      pointValue =\n        pointValue * 2.03 +\n        vec2(17.1, 11.7);\n      amplitude *= 0.5;\n    }\n\n    return value;\n  }\n\n  float softBand(float value, float center, float width) {\n    return exp(-pow((value - center) / width, 2.0));\n  }\n\n  void main() {\n    vec2 pointValue = (vUv - 0.5) * 2.0;\n    float radiusValue = length(pointValue);\n\n    if (radiusValue > 1.0) {\n      discard;\n    }\n\n    float safeRadius = max(radiusValue, 0.045);\n    float angleValue = atan(pointValue.y, pointValue.x);\n\n    float timeValue =\n      uTime *\n      uFlowSpeed *\n      uDirection +\n      uPhase;\n\n    /*\n     * Пространственная закрутка отделена от времени. Раньше время\n     * умножалось на radial acceleration, из-за чего с каждой секундой\n     * вихрь становился всё плотнее и начинал давать муар и дрожание.\n     */\n    float inwardAcceleration =\n      1.0 +\n      pow(1.0 - radiusValue, 1.55) * 2.85;\n\n    float radialTwist =\n      pow(1.0 - radiusValue, 1.38) *\n      (2.7 + uLayer * 0.58);\n\n    float flowRotation =\n      timeValue *\n      (0.86 + uLayer * 0.24);\n\n    float boundedPull =\n      sin(\n        timeValue * 0.62 +\n        radiusValue * 5.4 +\n        uPhase\n      ) *\n      (1.0 - radiusValue) *\n      0.065;\n\n    float advectedAngle =\n      angleValue +\n      radialTwist +\n      flowRotation +\n      boundedPull;\n\n    vec2 rotatedPoint =\n      vec2(\n        cos(advectedAngle),\n        sin(advectedAngle)\n      ) * radiusValue;\n\n    vec2 broadPoint =\n      rotatedPoint *\n      (1.72 + uTurbulence * 1.08);\n\n    /*\n     * ВАЖНО: любые гармоники от atan-угла должны иметь целое\n     * количество повторов за полный оборот. Дробные множители\n     * создают разрыв на границе -PI / PI, который визуально\n     * превращается в движущийся конус от центра к краю.\n     */\n    broadPoint += vec2(\n      cos(\n        advectedAngle * 2.0 -\n        timeValue * 0.42\n      ),\n      sin(\n        advectedAngle * 3.0 +\n        timeValue * 0.34\n      )\n    ) * (0.11 + uTurbulence * 0.085);\n\n    /*\n     * Основной рисунок строится на крупных массах. Detail и micro\n     * сохранены, но больше не формируют мелкую песочную поверхность.\n     */\n    float broadNoise = fbm(\n      broadPoint +\n      timeValue * vec2(0.085, -0.058)\n    );\n\n    float detailNoise = fbm(\n      broadPoint * 1.82 -\n      timeValue * vec2(0.14, 0.085)\n    );\n\n    float microNoise = fbm(\n      broadPoint * 3.15 +\n      timeValue * vec2(-0.19, 0.13)\n    );\n\n    float spiralCoordinate =\n      advectedAngle * 4.0 -\n      log(safeRadius + 0.07) * 10.9 +\n      broadNoise * 4.25 +\n      detailNoise * 1.08;\n\n    float spiralWave =\n      0.5 +\n      0.5 * sin(spiralCoordinate);\n\n    float spiralWaveTwo =\n      0.5 +\n      0.5 * sin(\n        advectedAngle * 6.0 -\n        log(safeRadius + 0.09) * 14.6 +\n        timeValue *\n          (1.16 + uLayer * 0.16) +\n        radialTwist * 1.28 +\n        detailNoise * 2.85\n      );\n\n    float primaryFilament =\n      smoothstep(0.42, 0.89, spiralWave) *\n      (0.58 + spiralWaveTwo * 0.42);\n\n    float sharpFilament =\n      pow(\n        smoothstep(0.55, 0.93, spiralWaveTwo),\n        1.28\n      ) *\n      (0.78 + microNoise * 0.22);\n\n    /*\n     * Две широкие волны идут от внешнего края к горизонту. Их частота\n     * ниже прежней, поэтому движение читается как втягивание, а не шум.\n     */\n    float suctionPhase = fract(\n      radiusValue * 6.45 +\n      timeValue *\n        (1.42 + uLayer * 0.31) +\n      sin(\n        angleValue * 3.0 +\n        uPhase\n      ) * 0.085 +\n      broadNoise * 0.31\n    );\n\n    float suctionBand =\n      softBand(suctionPhase, 0.84, 0.118) *\n      smoothstep(0.12, 0.96, radiusValue);\n\n    float fastSuctionPhase = fract(\n      radiusValue * 10.4 +\n      timeValue *\n        (2.16 + uLayer * 0.44) +\n      sin(\n        advectedAngle * 4.0 -\n        uPhase\n      ) * 0.07 +\n      detailNoise * 0.22\n    );\n\n    float fastSuctionBand =\n      softBand(\n        fastSuctionPhase,\n        0.88,\n        0.082\n      ) *\n      smoothstep(0.17, 0.94, radiusValue);\n\n    float inwardStreaks =\n      (\n        suctionBand * 0.78 +\n        fastSuctionBand * 0.5\n      ) *\n      (\n        0.42 +\n        primaryFilament * 0.46 +\n        sharpFilament * 0.22\n      ) *\n      (\n        0.74 +\n        (1.0 - radiusValue) * 1.08\n      );\n\n    float angularStreaks =\n      pow(\n        0.5 +\n        0.5 * sin(\n          advectedAngle * 14.0 +\n          detailNoise * 2.55 -\n          timeValue * 1.82\n        ),\n        2.65\n      ) *\n      inwardStreaks;\n\n    float softCloud =\n      broadNoise * 0.78 +\n      detailNoise * 0.205 +\n      microNoise * 0.015;\n\n    float centerVoid =\n      smoothstep(0.07, 0.255, radiusValue);\n\n    float horizonRadius =\n      0.222 +\n      (broadNoise - 0.5) * 0.015 +\n      sin(\n        timeValue * 2.0 +\n        angleValue * 4.0\n      ) * 0.004;\n\n    float eventHorizon =\n      1.0 -\n      smoothstep(\n        0.014,\n        0.059,\n        abs(radiusValue - horizonRadius)\n      );\n\n    float innerHalo =\n      softBand(radiusValue, 0.36, 0.205);\n\n    float sinkGlow =\n      softBand(radiusValue, 0.292, 0.122) *\n      (\n        0.66 +\n        primaryFilament * 0.34\n      );\n\n    float outerRim =\n      1.0 -\n      smoothstep(\n        0.014,\n        0.052,\n        abs(radiusValue - 0.92)\n      );\n\n    float outerFalloff =\n      1.0 -\n      smoothstep(0.84, 1.0, radiusValue);\n\n    float perspectiveShade =\n      0.93 +\n      clamp(\n        -vViewPosition.z * 0.015,\n        -0.05,\n        0.08\n      );\n\n    float pulseValue =\n      1.0 +\n      sin(\n        uTime * 1.16 +\n        broadNoise * 2.4 +\n        uPhase\n      ) *\n      uPulse;\n\n    float energy =\n      softCloud * 0.12 +\n      primaryFilament * 0.54 +\n      sharpFilament * 0.145 +\n      innerHalo * 0.14 +\n      inwardStreaks * 0.7 +\n      angularStreaks * 0.18 +\n      sinkGlow * 0.27;\n\n    vec3 deepColor = mix(\n      uAccentColor * 0.075,\n      uCoreColor * 0.14,\n      0.32\n    );\n\n    vec3 color = mix(\n      deepColor,\n      uGlowColor,\n      clamp(energy, 0.0, 1.0)\n    );\n\n    color = mix(\n      color,\n      uCoreColor,\n      sinkGlow * 0.34 +\n      innerHalo * 0.16\n    );\n\n    color = mix(\n      color,\n      uHotColor,\n      eventHorizon *\n        (0.76 + uLayer * 0.1) +\n      inwardStreaks * 0.15 +\n      angularStreaks * 0.18 +\n      outerRim * 0.12 +\n      sharpFilament * 0.08 * uLayer\n    );\n\n    float centerDarkening =\n      mix(0.028, 1.0, centerVoid);\n\n    color *=\n      centerDarkening *\n      perspectiveShade *\n      pulseValue;\n\n    float bodyAlpha =\n      outerFalloff *\n      centerVoid *\n      (\n        0.075 +\n        softCloud * 0.1 +\n        primaryFilament * 0.36 +\n        sharpFilament * 0.12 +\n        innerHalo * 0.13 +\n        inwardStreaks * 0.48 +\n        angularStreaks * 0.14\n      );\n\n    float alpha =\n      uOpacity *\n      (\n        bodyAlpha +\n        eventHorizon * 0.34 +\n        outerRim * 0.14\n      ) *\n      pulseValue;\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function It(e) {
	switch (e) {
		case "low": return 56;
		case "high": return 160;
		default: return 96;
	}
}
function Lt(e, t, n, r, i, a, o) {
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
function Rt(e, t) {
	let n = new l.ShaderMaterial({
		uniforms: e,
		vertexShader: Pt,
		fragmentShader: Ft,
		transparent: !0,
		depthTest: !0,
		depthWrite: !1,
		side: l.DoubleSide,
		blending: t.blending
	});
	return n.name = `PortalMembrane-${t.name}`, n.toneMapped = !1, n;
}
var zt = {
	name: "back",
	opacityScale: .96,
	flowScale: 1.08,
	turbulenceScale: .9,
	pulseScale: .55,
	layer: .08,
	phase: 0,
	direction: 1,
	blending: l.NormalBlending
}, Bt = {
	name: "middle",
	opacityScale: .64,
	flowScale: 1.58,
	turbulenceScale: 1.02,
	pulseScale: .72,
	layer: .56,
	phase: 2.15,
	direction: 1,
	blending: l.AdditiveBlending
}, Vt = {
	name: "front",
	opacityScale: .44,
	flowScale: 2.08,
	turbulenceScale: 1.12,
	pulseScale: .84,
	layer: 1,
	phase: 4.35,
	direction: 1,
	blending: l.AdditiveBlending
};
function Ht({ radius: r, opacity: i, flowSpeed: s, turbulence: u, pulse: d, depth: f, colors: p, quality: m, speed: h, glowFactor: g }) {
	let _ = n(null), v = n(null), y = n(null), b = t(() => new l.CircleGeometry(r, It(m)), [m, r]), x = t(() => Lt(zt, i, s, u, d, p, g), [
		p,
		s,
		g,
		i,
		d,
		u
	]), S = t(() => Lt(Bt, i, s, u, d, p, g), [
		p,
		s,
		g,
		i,
		d,
		u
	]), C = t(() => Lt(Vt, i, s, u, d, p, g), [
		p,
		s,
		g,
		i,
		d,
		u
	]), w = t(() => Rt(x, zt), [x]), T = t(() => Rt(S, Bt), [S]), E = t(() => Rt(C, Vt), [C]);
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
var Ut = 1.3, Wt = "\n  varying vec2 vUv;\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec2 vWorldPosition;\n\n  void main() {\n    vUv = uv;\n\n    vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n    vec4 mvPosition = viewMatrix * worldPosition;\n\n    vViewPosition = mvPosition.xyz;\n    vViewNormal = normalize(normalMatrix * normal);\n\n    /*\n     * Передаём непрерывные координаты, а не уже вычисленный угол.\n     * Угол, интерполированный между вершинами около -PI / PI, создавал\n     * заметную радиальную линию-склейку на вращающихся кольцах.\n     */\n    vWorldPosition = worldPosition.xy;\n\n    gl_Position = projectionMatrix * mvPosition;\n  }\n", Gt = "\n  uniform float uTime;\n  uniform float uOpacity;\n  uniform float uPhase;\n  uniform float uAccentMix;\n  uniform float uHotMix;\n  uniform float uRingRole;\n  uniform vec3 uBaseColor;\n  uniform vec3 uAccentColor;\n  uniform vec3 uHotColor;\n\n  varying vec2 vUv;\n  varying vec3 vViewNormal;\n  varying vec3 vViewPosition;\n  varying vec2 vWorldPosition;\n\n  float loopDistance(float a, float b) {\n    float distanceValue = abs(a - b);\n    return min(distanceValue, 1.0 - distanceValue);\n  }\n\n  void main() {\n    vec3 viewDirection = normalize(-vViewPosition);\n    vec3 normalValue = normalize(vViewNormal);\n\n    float fresnel = pow(\n      1.0 -\n      abs(dot(normalValue, viewDirection)),\n      1.62\n    );\n\n    float faceLight = pow(\n      clamp(\n        dot(\n          normalValue,\n          normalize(vec3(-0.36, 0.58, 0.74))\n        ) * 0.5 + 0.5,\n        0.0,\n        1.0\n      ),\n      1.28\n    );\n\n    float worldAngle =\n      atan(vWorldPosition.y, vWorldPosition.x) /\n      6.28318530718 +\n      0.5;\n\n    float along = fract(\n      worldAngle +\n      uPhase -\n      uTime * (0.052 + uRingRole * 0.019)\n    );\n\n    float hotHead = exp(\n      -pow(\n        loopDistance(along, 0.19) / 0.032,\n        2.0\n      )\n    );\n\n    float warmTail = exp(\n      -pow(\n        loopDistance(along, 0.285) / 0.13,\n        2.0\n      )\n    ) * 0.3;\n\n    float secondaryHead = exp(\n      -pow(\n        loopDistance(along, 0.67) / 0.055,\n        2.0\n      )\n    ) *\n      (0.24 + uRingRole * 0.08);\n\n    float crossSection =\n      abs(vUv.y - 0.5) * 2.0;\n\n    float tubeBand = pow(\n      max(1.0 - crossSection, 0.0),\n      0.4\n    );\n\n    float edgeBand =\n      1.0 -\n      smoothstep(0.78, 1.0, crossSection);\n\n    float technicalScan =\n      0.5 +\n      0.5 * sin(\n        vUv.x * 17.0 -\n        uTime * 0.68 +\n        vUv.y * 5.0 +\n        uPhase * 6.2831\n      );\n\n    float machinedBand =\n      0.5 +\n      0.5 * sin(\n        vUv.x * 46.0 +\n        vUv.y * 8.0 +\n        uPhase * 11.0\n      );\n\n    float microBand =\n      0.5 +\n      0.5 * sin(\n        vUv.y * 36.0 +\n        vUv.x * 5.0 +\n        uPhase * 9.0\n      );\n\n    vec3 metalShadow = mix(\n      uAccentColor * 0.075,\n      uBaseColor * 0.065,\n      0.45\n    );\n\n    vec3 metalBody = mix(\n      uAccentColor *\n        (0.32 + uAccentMix * 0.13),\n      uBaseColor *\n        (0.38 + uRingRole * 0.08),\n      0.36\n    );\n\n    float metalLight = clamp(\n      0.14 +\n      faceLight * 0.5 +\n      fresnel * 0.52 +\n      technicalScan * 0.07 +\n      machinedBand * 0.028,\n      0.0,\n      1.0\n    );\n\n    vec3 color = mix(\n      metalShadow,\n      metalBody,\n      metalLight\n    );\n\n    color +=\n      uBaseColor *\n      (\n        fresnel *\n          (0.12 + uRingRole * 0.035) +\n        microBand * 0.022\n      );\n\n    float hotAmount = clamp(\n      (\n        hotHead * 0.9 +\n        warmTail * 0.34 +\n        secondaryHead * 0.5\n      ) *\n      uHotMix +\n      fresnel *\n        (0.045 + uRingRole * 0.022),\n      0.0,\n      0.88\n    );\n\n    color = mix(\n      color,\n      uHotColor,\n      hotAmount\n    );\n\n    float alpha =\n      uOpacity *\n      tubeBand *\n      edgeBand *\n      (\n        0.76 +\n        fresnel * 0.2 +\n        faceLight * 0.09 +\n        hotHead * 0.12 +\n        secondaryHead * 0.05\n      );\n\n    gl_FragColor = vec4(color, alpha);\n  }\n";
function Kt(e) {
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
function qt({ config: r, colors: s, quality: u, speed: d, glowFactor: f, index: p }) {
	let m = n(null), h = Math.max(3, Math.round(r.segments)), g = Math.PI * 2 / h, _ = g * l.MathUtils.clamp(1 - r.gapRatio, .5, .997), v = Kt(u), y = t(() => new l.TorusGeometry(r.radius, r.thickness, v.radialSegments, v.tubularSegments, _), [
		r.radius,
		r.thickness,
		v.radialSegments,
		v.tubularSegments,
		_
	]), b = t(() => new l.TorusGeometry(r.radius, Math.max(r.thickness * .145, .0042), Math.max(v.radialSegments - 2, 4), v.tubularSegments, _ * .7), [
		r.radius,
		r.thickness,
		v.radialSegments,
		v.tubularSegments,
		_
	]), x = t(() => new l.TorusGeometry(r.radius, Math.max(r.thickness * .2, .005), Math.max(v.radialSegments - 2, 4), Math.max(Math.round(v.tubularSegments * .48), 18), _ * .2), [
		r.radius,
		r.thickness,
		v.radialSegments,
		v.tubularSegments,
		_
	]), S = l.MathUtils.clamp(p / 2, 0, 1), C = t(() => ({
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
		let e = new l.ShaderMaterial({
			uniforms: C,
			vertexShader: Wt,
			fragmentShader: Gt,
			transparent: !0,
			depthTest: !0,
			depthWrite: !0,
			side: l.DoubleSide,
			blending: l.NormalBlending
		});
		return e.name = `PortalRingMaterial-${p}`, e.toneMapped = !1, e;
	}, [p, C]), T = t(() => s.glow.clone().lerp(s.hot, .36), [s.glow, s.hot]), E = t(() => s.hot.clone().lerp(s.glow, .18), [s.glow, s.hot]), D = t(() => s.hot.clone().lerp(s.glow, .2 + S * .14), [
		s.hot,
		s.glow,
		S
	]), O = t(() => s.accent.clone().multiplyScalar(.16), [s.accent]), k = t(() => {
		let e = new l.MeshBasicMaterial({
			color: T,
			transparent: !0,
			opacity: r.opacity * f * (.27 + S * .04),
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			side: l.DoubleSide,
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
		let e = new l.MeshBasicMaterial({
			color: E,
			transparent: !0,
			opacity: r.opacity * f * .5,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			side: l.DoubleSide,
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
		m.current && (m.current.position.z = r.depthOffset, m.current.rotation.set(r.tiltX, r.tiltY, r.tiltZ + t * r.spinSpeed * r.direction * n * Ut + r.phase)), w.uniforms.uTime.value = t * n, w.uniforms.uOpacity.value = r.opacity * f * (.99 + Math.sin(t * .44 + p * 1.37) * .016), k.opacity = r.opacity * f * (.21 + S * .04 + (.5 + .5 * Math.sin(t * (1.1 + S * .22) * n + r.phase * 8)) * .18), A.opacity = r.opacity * f * (.3 + (.5 + .5 * Math.sin(t * (1.54 + S * .28) * n + r.phase * 11)) * .4);
	});
	let j = Math.max(1, Math.round(r.markerEvery)), M = (.5 - S * .12) * r.opacity * f;
	return /* @__PURE__ */ a("group", {
		ref: m,
		children: Array.from({ length: h }, (e, t) => {
			let n = t * g, s = t % j === 0, c = n + _ * .93, u = n + _ * .15, d = n + _ * (.18 + (t + p) % 3 * .17);
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
						u
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
							blending: l.AdditiveBlending
						})]
					})
				] }) : null
			] }, `${p}-portal-segment-${t}`);
		})
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/PortalGate.tsx
var Jt = 1.3;
function Yt() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,0.72)"), n.addColorStop(.28, "rgba(255,255,255,0.34)"), n.addColorStop(.62, "rgba(255,255,255,0.08)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new l.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = l.LinearFilter, r.magFilter = l.LinearFilter, r;
}
function Xt(e) {
	return {
		radial: e === "high" ? 14 : e === "low" ? 7 : 10,
		tubular: e === "high" ? 128 : e === "low" ? 56 : 88
	};
}
function Zt({ config: r, colors: i, quality: s, speed: u, glowFactor: d }) {
	let f = n(null), p = n(null), m = n(null), h = n(null), g = n(null), _ = n(null), v = n(null), y = t(() => Yt(), []), b = r.rings[0]?.radius ?? r.membraneRadius * 1.64, x = r.rings[1]?.radius ?? r.membraneRadius * 1.33, S = r.rings[2]?.radius ?? r.membraneRadius * 1.11, C = Math.max(6, Math.round(r.rings[0]?.segments ?? 10)), w = Math.max(8, Math.round((r.rings[1]?.segments ?? 16) * .75)), T = Math.PI * 2 / C, E = Math.PI * 2 / w, D = T * .73, O = E * .62, k = D * .72, A = O * .68, j = x + Math.max(r.rings[1]?.thickness ?? .04, .035) * 1.35, M = b - Math.max(r.rings[0]?.thickness ?? .08, .06) * 1.28, N = r.membraneRadius * 1.055, P = Math.max(S - Math.max(r.rings[2]?.thickness ?? .018, .016) * 1.8, N + .045), ee = t(() => new l.RingGeometry(j, M, s === "high" ? 48 : 30, 1, 0, D), [
		D,
		j,
		M,
		s
	]), F = t(() => new l.RingGeometry(N, P, s === "high" ? 42 : 26, 1, 0, O), [
		O,
		N,
		P,
		s
	]), te = t(() => new l.RingGeometry(Math.max(M - .024, j + .01), Math.max(M - .005, j + .027), s === "high" ? 48 : 30, 1, 0, k), [
		k,
		j,
		M,
		s
	]), I = t(() => new l.RingGeometry(N + .005, Math.min(N + .022, P - .007), s === "high" ? 42 : 26, 1, 0, A), [
		A,
		N,
		P,
		s
	]), L = Math.max(j - P - .03 * 2, .05), R = t(() => new l.BoxGeometry(L, .026, .02), [L]), ne = t(() => new l.BoxGeometry(L * .58, .008, .006), [L]), re = t(() => new l.BoxGeometry(L * .2, .012, .008), [L]), z = t(() => i.glow.clone().lerp(i.hot, .34), [i.glow, i.hot]), ie = t(() => i.accent.clone().multiplyScalar(.16).lerp(i.glow.clone().multiplyScalar(.12), .26), [i.accent, i.glow]), ae = t(() => i.accent.clone().lerp(i.glow, .22).multiplyScalar(.56), [i.accent, i.glow]), oe = t(() => i.accent.clone().multiplyScalar(.055), [i.accent]), se = t(() => i.glow.clone().lerp(i.hot, .38), [i.glow, i.hot]), ce = t(() => i.hot.clone().lerp(i.glow, .12), [i.glow, i.hot]), B = t(() => {
		let e = new l.MeshBasicMaterial({
			color: ie,
			transparent: !0,
			opacity: .72,
			side: l.DoubleSide,
			depthTest: !0,
			depthWrite: !0,
			toneMapped: !1
		});
		return e.name = "PortalGateHousingMaterial", e;
	}, [ie]), le = t(() => {
		let e = new l.MeshBasicMaterial({
			color: ae,
			transparent: !0,
			opacity: .34,
			side: l.DoubleSide,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateInnerHousingMaterial", e;
	}, [ae]), ue = t(() => {
		let e = new l.MeshBasicMaterial({
			color: ie.clone().multiplyScalar(.8),
			transparent: !0,
			opacity: .82,
			depthTest: !0,
			depthWrite: !0,
			toneMapped: !1
		});
		return e.name = "PortalGateBridgeMaterial", e;
	}, [ie]), de = t(() => {
		let e = new l.MeshBasicMaterial({
			color: z,
			transparent: !0,
			opacity: .52 * d,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateBridgeLightMaterial", e;
	}, [d, z]), V = t(() => {
		let e = new l.MeshBasicMaterial({
			color: ce,
			transparent: !0,
			opacity: .64 * d,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateBridgeHotMaterial", e;
	}, [ce, d]), H = t(() => {
		let e = new l.MeshBasicMaterial({
			color: se,
			transparent: !0,
			opacity: .4 * d,
			side: l.DoubleSide,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateOuterPanelGlowMaterial", e;
	}, [d, se]), U = t(() => {
		let e = new l.MeshBasicMaterial({
			color: z,
			transparent: !0,
			opacity: .44 * d,
			side: l.DoubleSide,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateInnerPanelGlowMaterial", e;
	}, [d, z]), W = t(() => {
		let e = new l.MeshBasicMaterial({
			color: i.hot,
			transparent: !0,
			opacity: .62 * d,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateRimPulseMaterialA", e;
	}, [i.hot, d]), fe = t(() => {
		let e = new l.MeshBasicMaterial({
			color: z,
			transparent: !0,
			opacity: .46 * d,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateRimPulseMaterialB", e;
	}, [d, z]), pe = t(() => {
		let e = new l.MeshBasicMaterial({
			color: i.glow,
			transparent: !0,
			opacity: .34 * d,
			blending: l.AdditiveBlending,
			depthTest: !0,
			depthWrite: !1,
			toneMapped: !1
		});
		return e.name = "PortalGateRimPulseMaterialC", e;
	}, [i.glow, d]);
	e(() => () => {
		y?.dispose(), ee.dispose(), F.dispose(), te.dispose(), I.dispose(), R.dispose(), ne.dispose(), re.dispose(), B.dispose(), le.dispose(), ue.dispose(), de.dispose(), V.dispose(), H.dispose(), U.dispose(), W.dispose(), fe.dispose(), pe.dispose();
	}, [
		R,
		re,
		V,
		ne,
		de,
		ue,
		B,
		le,
		F,
		I,
		U,
		ee,
		te,
		H,
		y,
		W,
		fe,
		pe
	]), c((e) => {
		let t = e.clock.getElapsedTime(), n = Math.max(u, .2);
		f.current && f.current.rotation.set(r.frameTiltX + Math.sin(t * .13 * n) * .007, r.frameTiltY + Math.cos(t * .1 * n) * .009, r.frameTiltZ + t * r.frameRotationSpeed * n + Math.sin(t * .08 * n) * .006), p.current && (p.current.rotation.z = -t * .008 * n * Jt), m.current && (m.current.rotation.z = t * .014 * n * Jt), h.current && (h.current.rotation.z = t * .11 * n), g.current && (g.current.rotation.z = t * .58 * n), _.current && (_.current.rotation.z = t * .39 * n + 2.2), v.current && (v.current.rotation.z = t * .76 * n + 4.1);
		let i = .5 + .5 * Math.sin(t * .84 * n), a = .5 + .5 * Math.sin(t * 1.22 * n + 1.7);
		le.opacity = .27 + i * .09, de.opacity = (.4 + i * .3) * d, V.opacity = (.36 + a * .46) * d, H.opacity = (.3 + i * .28) * d, U.opacity = (.32 + a * .3) * d, W.opacity = (.44 + i * .34) * d, fe.opacity = (.3 + a * .3) * d, pe.opacity = (.2 + i * .22) * d;
	});
	let G = Xt(s), me = (P + j) / 2, he = T * .5 + .02, K = r.membraneRadius * 1.005;
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
					blending: l.AdditiveBlending,
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
					color: oe,
					transparent: !0,
					opacity: .9,
					depthWrite: !1,
					side: l.DoubleSide,
					toneMapped: !1
				})]
			}),
			/* @__PURE__ */ a(Ht, {
				radius: r.membraneRadius,
				opacity: r.membraneOpacity,
				flowSpeed: r.membraneFlowSpeed,
				turbulence: r.membraneTurbulence,
				pulse: r.membranePulse,
				depth: r.membraneDepth,
				colors: i,
				quality: s,
				speed: u,
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
							object: U,
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
							object: B,
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
							object: H,
							attach: "material"
						})
					})] }, `portal-outer-panel-${t}`);
				}), Array.from({ length: 6 }, (e, t) => {
					let n = t * (Math.PI * 2 / 6) + he, r = t % 2 == 0;
					return /* @__PURE__ */ o("group", {
						rotation: [
							0,
							0,
							n
						],
						children: [
							/* @__PURE__ */ a("mesh", {
								geometry: R,
								position: [
									me,
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
								geometry: ne,
								position: [
									me,
									0,
									.004
								],
								renderOrder: 13,
								children: /* @__PURE__ */ a("primitive", {
									object: de,
									attach: "material"
								})
							}),
							r ? /* @__PURE__ */ a("mesh", {
								geometry: re,
								position: [
									me + L * .12,
									0,
									.009
								],
								renderOrder: 15,
								children: /* @__PURE__ */ a("primitive", {
									object: V,
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
						K,
						.015,
						G.radial,
						G.tubular
					] }), /* @__PURE__ */ a("meshBasicMaterial", {
						color: z,
						transparent: !0,
						opacity: .48 * d,
						blending: l.AdditiveBlending,
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
							K,
							.006,
							G.radial,
							G.tubular
						] }), /* @__PURE__ */ a("meshBasicMaterial", {
							color: i.glow,
							transparent: !0,
							opacity: .24 * d,
							blending: l.AdditiveBlending,
							depthWrite: !1,
							toneMapped: !1
						})]
					}),
					/* @__PURE__ */ a("group", {
						ref: g,
						children: /* @__PURE__ */ o("mesh", {
							renderOrder: 22,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								K,
								.012,
								G.radial,
								Math.max(Math.round(G.tubular * .42), 28),
								.58
							] }), /* @__PURE__ */ a("primitive", {
								object: W,
								attach: "material"
							})]
						})
					}),
					/* @__PURE__ */ a("group", {
						ref: _,
						children: /* @__PURE__ */ o("mesh", {
							renderOrder: 21,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								K * 1.018,
								.008,
								G.radial,
								Math.max(Math.round(G.tubular * .36), 24),
								.4
							] }), /* @__PURE__ */ a("primitive", {
								object: fe,
								attach: "material"
							})]
						})
					}),
					/* @__PURE__ */ a("group", {
						ref: v,
						children: /* @__PURE__ */ o("mesh", {
							renderOrder: 20,
							children: [/* @__PURE__ */ a("torusGeometry", { args: [
								K * .987,
								.006,
								G.radial,
								Math.max(Math.round(G.tubular * .28), 20),
								.28
							] }), /* @__PURE__ */ a("primitive", {
								object: pe,
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
					G.radial,
					G.tubular
				] }), /* @__PURE__ */ a("meshBasicMaterial", {
					color: i.glow,
					transparent: !0,
					opacity: .14 * d,
					blending: l.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})]
			}),
			r.rings.map((e, t) => /* @__PURE__ */ a(qt, {
				config: e,
				colors: i,
				quality: s,
				speed: u,
				glowFactor: d,
				index: t
			}, `portal-ring-${t}`))
		]
	});
}
//#endregion
//#region src/components/OrbitalVisual/renderers/three/OrbitalScene.tsx
function Qt(e) {
	return new l.Color(`rgb(${e.split(" ").join(", ")})`);
}
function Q(e, t) {
	return `rgba(${Math.round(e.r * 255)}, ${Math.round(e.g * 255)}, ${Math.round(e.b * 255)}, ${t})`;
}
function $t(e) {
	switch (e) {
		case "low": return .82;
		case "high": return 1.16;
		default: return 1;
	}
}
function en() {
	if (typeof document > "u") return null;
	let e = document.createElement("canvas");
	e.width = 256, e.height = 256;
	let t = e.getContext("2d");
	if (!t) return null;
	let n = t.createRadialGradient(128, 128, 0, 128, 128, 128);
	n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(.12, "rgba(255,255,255,0.96)"), n.addColorStop(.26, "rgba(255,255,255,0.76)"), n.addColorStop(.5, "rgba(255,255,255,0.22)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.clearRect(0, 0, 256, 256), t.fillStyle = n, t.fillRect(0, 0, 256, 256);
	let r = new l.CanvasTexture(e);
	return r.needsUpdate = !0, r.minFilter = l.LinearFilter, r.magFilter = l.LinearFilter, r;
}
function tn(e, t, n) {
	if (typeof document > "u") return null;
	let r = 1024, i = document.createElement("canvas");
	i.width = r, i.height = r;
	let a = i.getContext("2d");
	if (!a) return null;
	r / 2;
	let o = t.clone().lerp(n, .32), s = a.createRadialGradient(512, 512, 0, 512, 512, 512);
	s.addColorStop(0, "rgba(255,255,255,1)"), s.addColorStop(.08, "rgba(255,255,255,0.998)"), s.addColorStop(.2, "rgba(245,252,255,0.99)"), s.addColorStop(.38, Q(e, .96)), s.addColorStop(.6, Q(t, .74)), s.addColorStop(.82, Q(o, .24)), s.addColorStop(1, Q(o, 0)), a.clearRect(0, 0, r, r), a.fillStyle = s, a.fillRect(0, 0, r, r);
	let c = a.getImageData(0, 0, r, r), u = c.data;
	for (let e = 0; e < u.length; e += 4) if (u[e + 3] > 0) {
		let t = (Math.random() - .5) * 8;
		u[e] = Math.max(0, Math.min(255, u[e] + t)), u[e + 1] = Math.max(0, Math.min(255, u[e + 1] + t)), u[e + 2] = Math.max(0, Math.min(255, u[e + 2] + t));
	}
	a.putImageData(c, 0, 0);
	let d = new l.CanvasTexture(i);
	return d.needsUpdate = !0, d.minFilter = l.LinearFilter, d.magFilter = l.LinearFilter, d;
}
function nn(e) {
	if (typeof document > "u") return null;
	let t = document.createElement("canvas");
	t.width = 512, t.height = 512;
	let n = t.getContext("2d");
	if (!n) return null;
	let r = n.createRadialGradient(256, 256, 0, 256, 256, 256);
	r.addColorStop(0, "rgba(255,255,255,1)"), r.addColorStop(.22, "rgba(255,255,255,0.96)"), r.addColorStop(.5, Q(e, .34)), r.addColorStop(.78, Q(e, .08)), r.addColorStop(1, Q(e, 0)), n.clearRect(0, 0, 512, 512), n.fillStyle = r, n.fillRect(0, 0, 512, 512);
	let i = new l.CanvasTexture(t);
	return i.needsUpdate = !0, i.minFilter = l.LinearFilter, i.magFilter = l.LinearFilter, i;
}
function rn({ family: e, speed: t, glowFactor: r, ringStyle: i, usePlanetRing: o, splitDepthLayers: s, planetDust: l }) {
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
			children: o ? /* @__PURE__ */ a(Nt, {
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
			}) : /* @__PURE__ */ a(lt, {
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
function an({ presetConfig: r, quality: i, glowIntensity: s, speed: u, visualScale: d }) {
	let f = n(null), p = n(null), m = $t(s), h = r.coreKind ?? "atomic", g = h === "atomic", _ = h === "planet", v = h === "gyro", y = h === "portal", b = _ ? "planetary" : r.ringStyle ?? "energy", x = t(() => ({
		core: Qt(r.coreRgb),
		glow: Qt(r.glowRgb),
		accent: Qt(r.accentRgb),
		hot: Qt(r.hotRgb)
	}), [r]), S = t(() => en(), []), C = t(() => tn(x.core, x.glow, x.accent), [
		x.core,
		x.glow,
		x.accent
	]), w = t(() => nn(x.core), [x.core]);
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
		let t = e.clock.getElapsedTime(), n = Math.max(u, .2);
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
					blending: l.AdditiveBlending,
					depthWrite: !1,
					toneMapped: !1
				})
			}) : null,
			_ ? /* @__PURE__ */ a(mt, {
				coreSize: r.coreSize,
				colors: x,
				speed: u,
				glowFactor: m
			}) : null,
			v && r.gyro ? /* @__PURE__ */ a($e, {
				coreSize: r.coreSize,
				config: r.gyro,
				colors: x,
				quality: i,
				speed: u,
				glowFactor: m
			}) : null,
			y && r.portal ? /* @__PURE__ */ a(Zt, {
				config: r.portal,
				colors: x,
				quality: i,
				speed: u,
				glowFactor: m
			}) : null,
			T.map((e) => /* @__PURE__ */ a(rn, {
				family: e,
				speed: u,
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
							blending: l.AdditiveBlending,
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
							blending: l.AdditiveBlending,
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
							blending: l.AdditiveBlending,
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
var on = {
	low: 1,
	medium: [1, 1.5],
	high: [1, 2]
};
function sn({ quality: e, visualScale: t, ...n }) {
	return /* @__PURE__ */ a(s, {
		dpr: on[e],
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
		children: /* @__PURE__ */ a(an, {
			quality: e,
			visualScale: t,
			...n
		})
	});
}
//#endregion
//#region src/components/OrbitalVisual/OrbitalVisual.tsx
var cn = 440;
function ln({ size: e = 420, width: t, height: n, preset: r = "atomic-orb", quality: i = "medium", glowIntensity: o = "medium", speed: s = 1, background: c = "dark", className: l }) {
	let u = t ?? e, d = n ?? e, f = Ke[r], p = e / cn;
	return /* @__PURE__ */ a("div", {
		className: [
			je.root,
			c === "dark" ? je.darkBackground : "",
			l ?? ""
		].filter(Boolean).join(" "),
		style: {
			width: u,
			height: d
		},
		children: /* @__PURE__ */ a("div", {
			className: je.stage,
			children: /* @__PURE__ */ a(sn, {
				presetConfig: f,
				quality: i,
				glowIntensity: o,
				speed: s,
				visualScale: p
			})
		})
	});
}
var $ = [
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
], un = $.flatMap((e) => e.presets.map((e) => e.preset)), dn = $.map((e) => ({
	value: e.id,
	label: e.selectLabel
}));
function fn(e) {
	return $.find((t) => t.id === e) ?? $[0];
}
function pn(e) {
	return $.find((t) => t.presets.some((t) => t.preset === e))?.id ?? "atomic-orb";
}
function mn(e) {
	return fn(e).presets.map((e) => ({
		value: e.preset,
		label: e.selectLabel
	}));
}
//#endregion
export { ln as OrbitalVisual, De as SphereVisual, fn as getOrbitalObjectById, pn as getOrbitalObjectIdForPreset, mn as getOrbitalPresetOptions, $ as orbitalObjectCatalog, dn as orbitalObjectOptions, un as orbitalPresetNames, Oe as spherePresetCatalog, ke as spherePresetNames, Ae as spherePresetOptions };

//# sourceMappingURL=index.js.map