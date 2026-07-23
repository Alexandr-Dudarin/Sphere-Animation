import * as THREE from 'three';
interface OrbitPointOptions {
    radius: number;
    wobble: number;
    seed: number;
    ellipseX: number;
    ellipseY: number;
}
export declare function sampleOrbitPoint(t: number, { radius, wobble, seed, ellipseX, ellipseY }: OrbitPointOptions): THREE.Vector3;
export declare function createOrbitCurve(options: OrbitPointOptions): THREE.CatmullRomCurve3;
export declare function createOrbitGeometry(radius: number, thickness: number, wobble: number, seed: number, ellipseX: number, ellipseY: number): THREE.TubeGeometry;
export {};
//# sourceMappingURL=orbitGeometry.d.ts.map