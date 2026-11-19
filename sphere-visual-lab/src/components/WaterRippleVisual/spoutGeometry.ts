import { CatmullRomCurve3, Vector3 } from 'three';
import { SOURCE_HEIGHT } from './dropletSequence';

/** The two rolled edges and lower wall of a small tilted pouring lip. */
export function createSpoutCurves() {
  const left = [
    [-1.18, -0.22, 2.4], [-0.94, -0.2, 2.32], [-0.66, -0.17, 2.17],
    [-0.4, -0.13, 1.97], [-0.17, -0.075, 1.83], [0, 0, SOURCE_HEIGHT],
  ];
  const right = left.map(([x, y, z]) => [x, -y, z]);
  const lower = [
    [-1.25, 0, 2.08], [-0.99, 0, 1.86], [-0.72, 0, 1.73],
    [-0.46, 0, 1.69], [-0.22, 0, 1.75], [0, 0, SOURCE_HEIGHT],
  ];
  return [left, right, lower].map((points) => new CatmullRomCurve3(
    points.map(([x, y, z]) => new Vector3(x, y, z)), false, 'centripetal',
  ));
}
