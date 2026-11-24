import * as THREE from 'three';

export function createPlanetRingGeometry(
  radius: number,
  thickness: number,
  ellipseX: number,
  ellipseY: number,
  wobble: number,
  seed: number,
) {
  const angularSegments = 256;
  const radialSegments = 24;

  const ringWidth = Math.max(
    thickness * 8.4,
    radius * 0.112,
  );

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (
    let radialIndex = 0;
    radialIndex <= radialSegments;
    radialIndex += 1
  ) {
    const radialProgress =
      radialIndex / radialSegments;

    const radialOffset =
      radialProgress - 0.5;

    const localRadius =
      radius +
      radialOffset * ringWidth;

    for (
      let angularIndex = 0;
      angularIndex <= angularSegments;
      angularIndex += 1
    ) {
      const angularProgress =
        angularIndex / angularSegments;

      const angle =
        angularProgress *
        Math.PI *
        2;

      const localWobble =
        Math.sin(
          angle * 3 +
          seed * 0.73 +
          radialProgress * Math.PI,
        ) *
        wobble *
        0.4;

      positions.push(
        Math.cos(angle) *
          localRadius *
          ellipseX,
        Math.sin(angle) *
          localRadius *
          ellipseY,
        localWobble,
      );

      uvs.push(
        angularProgress,
        radialProgress,
      );
    }
  }

  const rowLength =
    angularSegments + 1;

  for (
    let radialIndex = 0;
    radialIndex < radialSegments;
    radialIndex += 1
  ) {
    for (
      let angularIndex = 0;
      angularIndex < angularSegments;
      angularIndex += 1
    ) {
      const a =
        radialIndex *
          rowLength +
        angularIndex;

      const b =
        a + rowLength;

      const c =
        b + 1;

      const d =
        a + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      positions,
      3,
    ),
  );

  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(
      uvs,
      2,
    ),
  );

  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}

