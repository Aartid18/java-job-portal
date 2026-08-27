import { useEffect, useRef } from 'react';
import {
  Vector3 as a,
  MeshPhysicalMaterial as c,
  InstancedMesh as d,
  Timer as e,
  AmbientLight as f,
  SphereGeometry as g,
  ShaderChunk as h,
  Scene as i,
  Color as l,
  Object3D as m,
  SRGBColorSpace as n,
  MathUtils as o,
  PMREMGenerator as p,
  Vector2 as r,
  WebGLRenderer as s,
  PerspectiveCamera as t,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Plane as w,
  Raycaster as y
} from 'three';
import { RoomEnvironment as z } from 'three/examples/jsm/environments/RoomEnvironment.js';

class x {
  #e: any;
  canvas: any;
  camera: any;
  cameraMinAspect: any;
  cameraMaxAspect: any;
  cameraFov: any;
  maxPixelRatio: any;
  minPixelRatio: any;
  scene: any;
  renderer: any;
  #t: any;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#i;
  onBeforeRender = (_hVal?: any) => {};
  onAfterRender = (_hVal?: any) => {};
  onAfterResize = (_sizeVal?: any) => {};
  #s = false;
  #n = false;
  #boundResize = this.#f.bind(this);
  #boundVisibilityChange = this.#v.bind(this);
  isDisposed = false;
  #o: any;
  #r: any;
  #a: any;
  #c = new e();
  #h = { elapsed: 0, delta: 0 };
  #l: any;
  constructor(e: any) {
    this.#e = { ...e };
    this.#m();
    this.#d();
    this.#p();
    this.resize();
    this.#g();
  }
  #m() {
    this.camera = new t();
    this.cameraFov = this.camera.fov;
  }
  #d() {
    this.scene = new i();
  }
  #p() {
    if (this.#e.canvas) {
      this.canvas = this.#e.canvas;
    } else if (this.#e.id) {
      this.canvas = document.getElementById(this.#e.id);
    } else {
      console.error('Three: Missing canvas or id parameter');
    }
    this.canvas.style.display = 'block';
    const e = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(this.#e.rendererOptions ?? {})
    };
    this.renderer = new s(e);
    this.renderer.outputColorSpace = n;
  }
  #g() {
    if (!(this.#e.size instanceof Object)) {
      window.addEventListener('resize', this.#boundResize);
      if (this.#e.size === 'parent' && this.canvas.parentNode) {
        this.#r = new ResizeObserver(this.#f.bind(this));
        this.#r.observe(this.canvas.parentNode);
      }
    }
    this.#o = new IntersectionObserver(this.#u.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#o.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#boundVisibilityChange);
  }
  #y() {
    window.removeEventListener('resize', this.#boundResize);
    this.#r?.disconnect();
    this.#o?.disconnect();
    document.removeEventListener('visibilitychange', this.#boundVisibilityChange);
  }
  #u(e: any) {
    this.#s = e[0].isIntersecting;
    this.#s ? this.#w() : this.#z();
  }
  #v() {
    if (this.#s) {
      document.hidden ? this.#z() : this.#w();
    }
  }
  #f() {
    if (this.#a) clearTimeout(this.#a);
    this.#a = setTimeout(this.resize.bind(this), 100);
  }
  resize() {
    let e: number, tVal: number;
    if (this.#e.size instanceof Object) {
      e = this.#e.size.width;
      tVal = this.#e.size.height;
    } else if (this.#e.size === 'parent' && this.canvas.parentNode) {
      e = this.canvas.parentNode.offsetWidth;
      tVal = this.canvas.parentNode.offsetHeight;
    } else {
      e = window.innerWidth;
      tVal = window.innerHeight;
    }
    this.size.width = e;
    this.size.height = tVal;
    this.size.ratio = e / tVal;
    this.#x();
    this.#b();
    this.onAfterResize(this.size);
  }
  #x() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#A(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#A(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }
  #A(e: any) {
    const tVal = Math.tan(o.degToRad(this.cameraFov / 2)) / (this.camera.aspect / e);
    this.camera.fov = 2 * o.radToDeg(Math.atan(tVal));
  }
  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const e = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(e / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }
  #b() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#t?.setSize(this.size.width, this.size.height);
    let e = window.devicePixelRatio;
    if (this.maxPixelRatio && e > this.maxPixelRatio) {
      e = this.maxPixelRatio;
    } else if (this.minPixelRatio && e < this.minPixelRatio) {
      e = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(e);
    this.size.pixelRatio = e;
  }
  get postprocessing() {
    return this.#t;
  }
  set postprocessing(e) {
    this.#t = e;
    this.render = e.render.bind(e);
  }
  #w() {
    if (this.#n) return;
    const animate = () => {
      this.#l = requestAnimationFrame(animate);
      this.#c.update();
      this.#h.delta = this.#c.getDelta();
      this.#h.elapsed += this.#h.delta;
      this.onBeforeRender(this.#h);
      this.render();
      this.onAfterRender(this.#h);
    };
    this.#n = true;
    this.#c.reset();
    animate();
  }
  #z() {
    if (this.#n) {
      cancelAnimationFrame(this.#l);
      this.#n = false;
    }
  }
  #i() {
    this.renderer.render(this.scene, this.camera);
  }
  clear() {
    this.scene.traverse((e: any) => {
      if (e.isMesh && typeof e.material === 'object' && e.material !== null) {
        Object.keys(e.material).forEach((tVal) => {
          const iVal = e.material[tVal];
          if (iVal !== null && typeof iVal === 'object' && typeof iVal.dispose === 'function') {
            iVal.dispose();
          }
        });
        e.material.dispose();
        e.geometry.dispose();
      }
    });
    this.scene.clear();
  }
  dispose() {
    this.#y();
    this.#z();
    this.#c.dispose();
    this.clear();
    this.#t?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.isDisposed = true;
  }
}

const bMap = new Map(),
  A = new r();
let R = false;

function S(e: any) {
  const tVal = {
    position: new r(),
    nPosition: new r(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...e
  };
  (function (domElem, dataObj) {
    if (!bMap.has(domElem)) {
      bMap.set(domElem, dataObj);
      if (!R) {
        document.body.addEventListener('pointermove', M);
        document.body.addEventListener('pointerleave', L);
        document.body.addEventListener('click', C);

        document.body.addEventListener('touchstart', TouchStart, { passive: false });
        document.body.addEventListener('touchmove', TouchMove, { passive: false });
        document.body.addEventListener('touchend', TouchEnd, { passive: false });
        document.body.addEventListener('touchcancel', TouchEnd, { passive: false });

        R = true;
      }
    }
  })(e.domElement, tVal);

  tVal.dispose = () => {
    const domElem = e.domElement;
    bMap.delete(domElem);
    if (bMap.size === 0) {
      document.body.removeEventListener('pointermove', M);
      document.body.removeEventListener('pointerleave', L);
      document.body.removeEventListener('click', C);

      document.body.removeEventListener('touchstart', TouchStart);
      document.body.removeEventListener('touchmove', TouchMove);
      document.body.removeEventListener('touchend', TouchEnd);
      document.body.removeEventListener('touchcancel', TouchEnd);

      R = false;
    }
  };
  return tVal;
}

function M(e: any) {
  A.x = e.clientX;
  A.y = e.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [elem, tVal] of bMap) {
    const iVal = elem.getBoundingClientRect();
    if (D(iVal)) {
      P(tVal, iVal);
      if (!tVal.hover) {
        tVal.hover = true;
        tVal.onEnter(tVal);
      }
      tVal.onMove(tVal);
    } else if (tVal.hover && !tVal.touching) {
      tVal.hover = false;
      tVal.onLeave(tVal);
    }
  }
}

function C(e: any) {
  A.x = e.clientX;
  A.y = e.clientY;
  for (const [elem, tVal] of bMap) {
    const iVal = elem.getBoundingClientRect();
    P(tVal, iVal);
    if (D(iVal)) tVal.onClick(tVal);
  }
}

function L() {
  for (const tVal of bMap.values()) {
    if (tVal.hover) {
      tVal.hover = false;
      tVal.onLeave(tVal);
    }
  }
}

function TouchStart(e: any) {
  if (e.touches.length > 0) {
    e.preventDefault();
    A.x = e.touches[0].clientX;
    A.y = e.touches[0].clientY;

    for (const [elem, tVal] of bMap) {
      const rect = elem.getBoundingClientRect();
      if (D(rect)) {
        tVal.touching = true;
        P(tVal, rect);
        if (!tVal.hover) {
          tVal.hover = true;
          tVal.onEnter(tVal);
        }
        tVal.onMove(tVal);
      }
    }
  }
}

function TouchMove(e: any) {
  if (e.touches.length > 0) {
    e.preventDefault();
    A.x = e.touches[0].clientX;
    A.y = e.touches[0].clientY;

    for (const [elem, tVal] of bMap) {
      const rect = elem.getBoundingClientRect();
      P(tVal, rect);

      if (D(rect)) {
        if (!tVal.hover) {
          tVal.hover = true;
          tVal.touching = true;
          tVal.onEnter(tVal);
        }
        tVal.onMove(tVal);
      } else if (tVal.hover && tVal.touching) {
        tVal.onMove(tVal);
      }
    }
  }
}

function TouchEnd() {
  for (const [, tVal] of bMap) {
    if (tVal.touching) {
      tVal.touching = false;
      if (tVal.hover) {
        tVal.hover = false;
        tVal.onLeave(tVal);
      }
    }
  }
}

function P(e: any, tVal: any) {
  const { position: iVal, nPosition: sVal } = e;
  iVal.x = A.x - tVal.left;
  iVal.y = A.y - tVal.top;
  sVal.x = (iVal.x / tVal.width) * 2 - 1;
  sVal.y = (-iVal.y / tVal.height) * 2 + 1;
}

function D(e: any) {
  const { x: tVal, y: iVal } = A;
  const { left: sVal, top: nVal, width: oVal, height: rVal } = e;
  return tVal >= sVal && tVal <= sVal + oVal && iVal >= nVal && iVal <= nVal + rVal;
}

const { randFloat: k, randFloatSpread: E } = o;
const F = new a();
const I = new a();
const O = new a();
const V = new a();
const B = new a();
const N = new a();
const _ = new a();
const j = new a();
const H = new a();
const T = new a();

class W {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: any;
  constructor(e: any) {
    this.config = e;
    this.positionData = new Float32Array(3 * e.count).fill(0);
    this.velocityData = new Float32Array(3 * e.count).fill(0);
    this.sizeData = new Float32Array(e.count).fill(1);
    this.center = new a();
    this.#R();
    this.setSizes();
  }
  #R() {
    const { config: e, positionData: tVal } = this;
    this.center.toArray(tVal, 0);
    for (let iVal = 1; iVal < e.count; iVal++) {
      const sVal = 3 * iVal;
      tVal[sVal] = E(2 * e.maxX);
      tVal[sVal + 1] = E(2 * e.maxY);
      tVal[sVal + 2] = E(2 * e.maxZ);
    }
  }
  setSizes() {
    const { config: e, sizeData: tVal } = this;
    tVal[0] = e.size0;
    for (let iVal = 1; iVal < e.count; iVal++) {
      tVal[iVal] = k(e.minSize, e.maxSize);
    }
  }
  update(e: any) {
    const { config: tVal, center: iVal, positionData: sVal, sizeData: nVal, velocityData: oVal } = this;
    let rVal = 0;
    if (tVal.controlSphere0) {
      rVal = 1;
      F.fromArray(sVal, 0);
      F.lerp(iVal, 0.1).toArray(sVal, 0);
      V.set(0, 0, 0).toArray(oVal, 0);
    }
    for (let idx = rVal; idx < tVal.count; idx++) {
      const base = 3 * idx;
      I.fromArray(sVal, base);
      B.fromArray(oVal, base);
      B.y -= e.delta * tVal.gravity * nVal[idx];
      B.multiplyScalar(tVal.friction);
      B.clampLength(0, tVal.maxVelocity);
      I.add(B);
      I.toArray(sVal, base);
      B.toArray(oVal, base);
    }
    for (let idx = rVal; idx < tVal.count; idx++) {
      const base = 3 * idx;
      I.fromArray(sVal, base);
      B.fromArray(oVal, base);
      const radius = nVal[idx];
      for (let jdx = idx + 1; jdx < tVal.count; jdx++) {
        const otherBase = 3 * jdx;
        O.fromArray(sVal, otherBase);
        N.fromArray(oVal, otherBase);
        const otherRadius = nVal[jdx];
        _.copy(O).sub(I);
        const dist = _.length();
        const sumRadius = radius + otherRadius;
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          j.copy(_)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          H.copy(j).multiplyScalar(Math.max(B.length(), 1));
          T.copy(j).multiplyScalar(Math.max(N.length(), 1));
          I.sub(j);
          B.sub(H);
          I.toArray(sVal, base);
          B.toArray(oVal, base);
          O.add(j);
          N.add(T);
          O.toArray(sVal, otherBase);
          N.toArray(oVal, otherBase);
        }
      }
      if (tVal.controlSphere0) {
        _.copy(F).sub(I);
        const dist = _.length();
        const sumRadius0 = radius + nVal[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          j.copy(_.normalize()).multiplyScalar(diff);
          H.copy(j).multiplyScalar(Math.max(B.length(), 2));
          I.sub(j);
          B.sub(H);
        }
      }
      if (Math.abs(I.x) + radius > tVal.maxX) {
        I.x = Math.sign(I.x) * (tVal.maxX - radius);
        B.x = -B.x * tVal.wallBounce;
      }
      if (tVal.gravity === 0) {
        if (Math.abs(I.y) + radius > tVal.maxY) {
          I.y = Math.sign(I.y) * (tVal.maxY - radius);
          B.y = -B.y * tVal.wallBounce;
        }
      } else if (I.y - radius < -tVal.maxY) {
        I.y = -tVal.maxY + radius;
        B.y = -B.y * tVal.wallBounce;
      }
      const maxBoundary = Math.max(tVal.maxZ, tVal.maxSize);
      if (Math.abs(I.z) + radius > maxBoundary) {
        I.z = Math.sign(I.z) * (tVal.maxZ - radius);
        B.z = -B.z * tVal.wallBounce;
      }
      I.toArray(sVal, base);
      B.toArray(oVal, base);
    }
  }
}

class Y extends c {
  uniforms: any;
  onBeforeCompile2: any;
  constructor(e: any) {
    super(e);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 }
    };
    if (!this.defines) this.defines = {};
    this.defines.USE_UV = '';
    this.onBeforeCompile = (eVal: any) => {
      Object.assign(eVal.uniforms, this.uniforms);
      eVal.fragmentShader =
        '\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      ' +
        eVal.fragmentShader;
      eVal.fragmentShader = eVal.fragmentShader.replace(
        'void main() {',
        '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      '
      );
      const tVal = h.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        '\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        '
      );
      eVal.fragmentShader = eVal.fragmentShader.replace('#include <lights_fragment_begin>', tVal);
      if (this.onBeforeCompile2) this.onBeforeCompile2(eVal);
    };
  }
}

const X = {
  count: 200,
  colors: [0x4f46e5, 0x7c3aed, 0x06b6d4],
  ambientColor: 16777215,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const U = new m();

class Z extends d {
  config: any;
  physics: W;
  ambientLight: any;
  light: any;
  constructor(e: any, tVal: any = {}) {
    const iVal = { ...X, ...tVal };
    const sVal = new z();
    const nVal = (new (p as any)(e, 0.04)).fromScene(sVal).texture;
    const oVal = new g();
    const rVal = new Y({ envMap: nVal, ...iVal.materialParams });
    rVal.envMapRotation.x = -Math.PI / 2;
    super(oVal, rVal, iVal.count);
    this.config = iVal;
    this.physics = new W(iVal);
    this.#S();
    this.setColors(iVal.colors);
  }
  #S() {
    this.ambientLight = new f(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new u(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }
  setColors(e: any) {
    if (Array.isArray(e) && e.length > 1) {
      const tVal = (function (colorsArr: any) {
        let t: any, i: any[];
        function setCols(cArr: any) {
          t = cArr;
          i = [];
          t.forEach((col: any) => {
            i.push(new l(col));
          });
        }
        setCols(colorsArr);
        return {
          setColors: setCols,
          getColorAt: function (ratio: number, out = new l()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (t.length - 1);
            const idx = Math.floor(scaled);
            const start = i[idx];
            if (idx >= t.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = i[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
          }
        };
      })(e);
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, tVal.getColorAt(idx / this.count));
        if (idx === 0) {
          this.light.color.copy(tVal.getColorAt(idx / this.count));
        }
      }
      if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }
  }
  update(e: any) {
    this.physics.update(e);
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        U.scale.setScalar(0);
      } else {
        U.scale.setScalar(this.physics.sizeData[idx]);
      }
      U.updateMatrix();
      this.setMatrixAt(idx, U.matrix);
      if (idx === 0) this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(e: any, tVal: any = {}) {
  const iVal = new x({
    canvas: e,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true }
  });
  let sVal: any;
  iVal.renderer.toneMapping = v;
  iVal.camera.position.set(0, 0, 20);
  iVal.camera.lookAt(0, 0, 0);
  iVal.cameraMaxAspect = 1.5;
  iVal.resize();
  initialize(tVal);
  const nVal = new y();
  const oVal = new w(new a(0, 0, 1), 0);
  const rVal = new a();
  let cVal = false;

  e.style.touchAction = 'none';
  e.style.userSelect = 'none';
  e.style.webkitUserSelect = 'none';

  const hVal = S({
    domElement: e,
    onMove() {
      nVal.setFromCamera(hVal.nPosition, iVal.camera);
      iVal.camera.getWorldDirection(oVal.normal);
      nVal.ray.intersectPlane(oVal, rVal);
      sVal.physics.center.copy(rVal);
      sVal.config.controlSphere0 = true;
    },
    onLeave() {
      sVal.config.controlSphere0 = false;
    }
  });

  function initialize(cfg: any) {
    if (sVal) {
      iVal.clear();
      iVal.scene.remove(sVal);
    }
    sVal = new Z(iVal.renderer, cfg);
    iVal.scene.add(sVal);
  }

  iVal.onBeforeRender = (eTime: any) => {
    if (!cVal) sVal.update(eTime);
  };
  iVal.onAfterResize = (eSize: any) => {
    sVal.config.maxX = eSize.wWidth / 2;
    sVal.config.maxY = eSize.wHeight / 2;
  };
  return {
    three: iVal,
    get spheres() {
      return sVal;
    },
    setCount(cCount: number) {
      initialize({ ...sVal.config, count: cCount });
    },
    updateConfig(newProps: any) {
      if (newProps.count !== undefined && newProps.count !== sVal.config.count) {
        initialize({ ...sVal.config, ...newProps });
      } else {
        Object.assign(sVal.config, newProps);
        if (newProps.colors) {
          sVal.setColors(sVal.config.colors);
        }
        if (newProps.minSize !== undefined || newProps.maxSize !== undefined || newProps.size0 !== undefined) {
          sVal.physics.setSizes();
        }
      }
    },
    togglePause() {
      cVal = !cVal;
    },
    dispose() {
      hVal.dispose();
      iVal.dispose();
    }
  };
}

export interface BallpitProps {
  className?: string;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  maxVelocity?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
  [key: string]: any;
}

export function Ballpit({ className = '', followCursor = true, ...props }: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spheresInstanceRef = useRef<any>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    spheresInstanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose();
        spheresInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (spheresInstanceRef.current) {
      spheresInstanceRef.current.updateConfig({ followCursor, ...props });
    }
  }, [props, followCursor]);

  return <canvas className={className} ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default Ballpit;
