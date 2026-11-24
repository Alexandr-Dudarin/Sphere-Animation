export const planetRingVertex = `
  varying vec2 vUv;
  varying float vViewZ;
  varying float vCenterViewZ;

  void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 centerMvPosition =
      modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

    vViewZ = mvPosition.z;
    vCenterViewZ = centerMvPosition.z;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const planetRingFragment = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFlowSpeed;
  uniform float uShimmerSpeed;
  uniform float uOffset;
  uniform float uDepthSide;
  uniform float uDepthFeather;
  uniform vec3 uBaseColor;

  varying vec2 vUv;
  varying float vViewZ;
  varying float vCenterViewZ;

  float softBand(
    float coordinate,
    float center,
    float width
  ) {
    float distanceFromCenter =
      abs(coordinate - center);

    return 1.0 - smoothstep(
      width * 0.48,
      width,
      distanceFromCenter
    );
  }

  void main() {
    /*
     * Кольцо по-прежнему делится на переднюю и заднюю части,
     * чтобы оно действительно проходило вокруг планеты.
     *
     * Но вместо жёсткого discard на одной точной границе
     * используется мягкая переходная зона.
     */
    float depthDelta =
      vViewZ - vCenterViewZ;

    float frontBlend =
      smoothstep(
        -uDepthFeather,
        uDepthFeather,
        depthDelta
      );

    float backBlend =
      1.0 - frontBlend;

    float depthBlend = 1.0;

    if (uDepthSide > 0.5) {
      depthBlend = frontBlend;
    } else if (uDepthSide < -0.5) {
      depthBlend = backBlend;
    }

    if (depthBlend <= 0.001) {
      discard;
    }

    float radial =
      clamp(vUv.y, 0.0, 1.0);

    float innerFeather =
      smoothstep(
        0.0,
        0.075,
        radial
      );

    float outerFeather =
      1.0 -
      smoothstep(
        0.925,
        1.0,
        radial
      );

    float edgeMask =
      innerFeather *
      outerFeather;

    /*
     * Четыре широкие ледяные полосы.
     */
    float bandA =
      softBand(
        radial,
        0.13,
        0.15
      );

    float bandB =
      softBand(
        radial,
        0.35,
        0.2
      );

    float bandC =
      softBand(
        radial,
        0.63,
        0.22
      );

    float bandD =
      softBand(
        radial,
        0.87,
        0.14
      );

    float broadMass =
      bandA * 0.74 +
      bandB * 0.92 +
      bandC * 1.0 +
      bandD * 0.76;

    /*
     * Две тёмные щели между основными полосами.
     */
    float gapA =
      softBand(
        radial,
        0.245,
        0.055
      );

    float gapB =
      softBand(
        radial,
        0.505,
        0.07
      );

    float gapMask =
      1.0 -
      gapA * 0.74 -
      gapB * 0.64;

    float slowDrift =
      0.5 +
      0.5 *
        sin(
          vUv.x * 12.5664 -
          uTime *
            uFlowSpeed *
            0.13 +
          uOffset * 6.2831
        );

    float secondaryDrift =
      0.5 +
      0.5 *
        sin(
          vUv.x * 25.1327 -
          uTime *
            uShimmerSpeed *
            0.045 +
          radial * 4.6 +
          uOffset * 9.0
        );

    float broadVariation =
      0.5 +
      0.5 *
        sin(
          radial * 17.0 +
          vUv.x * 3.0 +
          uOffset * 5.0
        );

    float fineDust =
      0.5 +
      0.5 *
        sin(
          radial * 74.0 -
          vUv.x * 6.0 +
          uOffset * 11.0
        );

    /*
     * Небольшая общая дымка связывает полосы
     * и убирает ощущение набора проводов.
     */
    float baseHaze =
      edgeMask * 0.08;

    float structure =
      baseHaze +
      broadMass *
      gapMask *
      (
        0.78 +
        broadVariation * 0.15 +
        fineDust * 0.07
      );

    vec3 deepColor =
      uBaseColor * 0.42;

    vec3 middleColor =
      uBaseColor * 0.76 +
      vec3(
        0.0,
        0.018,
        0.055
      );

    vec3 lightColor =
      uBaseColor * 1.08 +
      vec3(
        0.015,
        0.07,
        0.13
      );

    vec3 color =
      mix(
        deepColor,
        middleColor,
        smoothstep(
          0.16,
          0.56,
          structure
        )
      );

    color =
      mix(
        color,
        lightColor,
        smoothstep(
          0.55,
          0.92,
          structure
        ) *
        0.72
      );

    color *=
      0.9 +
      slowDrift * 0.075 +
      secondaryDrift * 0.03;

    /*
     * Передняя и задняя части используют одинаковый цвет.
     * Разница между ними теперь создаётся только глубиной,
     * а не резким скачком яркости.
     */
    float alpha =
      uOpacity *
      edgeMask *
      structure *
      (
        0.66 +
        slowDrift * 0.1 +
        secondaryDrift * 0.035
      ) *
      depthBlend;

    gl_FragColor =
      vec4(
        color,
        alpha
      );
  }
`;

