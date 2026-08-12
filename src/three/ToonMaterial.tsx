import { extend } from '@react-three/fiber'
import { type ShaderMaterial } from 'three'
import * as THREE from 'three'

/**
 * ToonMaterial — soft gradient/toon shading for the "Pixar-soft + candy/bubbly"
 * look. Fresnel rim light + smooth toon falloff + top/bottom color gradient
 * (faked subsurface warmth). No harsh anime bands, no flat default material.
 *
 * Used via `extend` so r3f can attach it to a mesh as <toonMaterial .../>.
 * Created once and disposed cleanly.
 */

class SoftToonMaterial extends THREE.ShaderMaterial {
  constructor(options: {
    colorTop?: string | THREE.Color
    colorBottom?: string | THREE.Color
    rimColor?: string | THREE.Color
    rimPower?: number
    fresnel?: number
  } = {}) {
    super({
      uniforms: {
        uColorTop: { value: new THREE.Color(options.colorTop ?? '#7c6cf0') },
        uColorBottom: { value: new THREE.Color(options.colorBottom ?? '#3b2f7a') },
        uRimColor: { value: new THREE.Color(options.rimColor ?? '#ffffff') },
        uRimPower: { value: options.rimPower ?? 1.6 },
        uFresnelIntensity: { value: options.fresnel ?? 0.45 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorTop;
        uniform vec3 uColorBottom;
        uniform vec3 uRimColor;
        uniform float uRimPower;
        uniform float uFresnelIntensity;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;

        void main() {
          vec3 lightDir = normalize(vec3(0.6, 1.0, 0.4));
          float ndl = max(dot(vNormal, lightDir), 0.0);

          // Gradient from bottom color (base) to top color (lit) by height
          float t = clamp(vPosition.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 base = mix(uColorBottom, uColorTop, t);

          // Soft warm toon shading
          float band = 0.45 + smoothstep(0.2, 0.5, ndl) * 0.55;
          vec3 col = base * band;

          // Warm subsurface fake (opposite-light warm tint)
          vec3 rimLightDir = normalize(vec3(-0.4, 0.3, -0.6));
          float rimDot = pow(max(dot(vNormal, rimLightDir), 0.0), uRimPower);
          col += vec3(1.0, 0.6, 0.4) * rimDot * 0.35;

          // Camera-facing fresnel rim glow
          float fres = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);
          col += uRimColor * fres * uFresnelIntensity;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
  }

  /** r3f: run any per-frame uniform updates here if the class needs it. */
}

extend({ SoftToonMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    softToonMaterial: JSX.IntrinsicElements['meshStandardMaterial'] & {
      colorTop?: THREE.ColorRepresentation
      colorBottom?: THREE.ColorRepresentation
      rimColor?: THREE.ColorRepresentation
      rimPower?: number
      fresnel?: number
    }
  }
}

export type { SoftToonMaterial }

/** Convenience factory for creating a compiled clone outside JSX (rarely needed). */
export function makeToonMaterial(opts?: ConstructorParameters<typeof SoftToonMaterial>[0]) {
  return new SoftToonMaterial(opts)
}

export type ToonMaterialHandle = ShaderMaterial
