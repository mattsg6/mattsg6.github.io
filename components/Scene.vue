<template>
  <canvas id="c"></canvas>
</template>
<script setup>
import * as THREE from "three";

onMounted(() => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  const pixelRatio = window.devicePixelRatio;
  renderer.setClearColor(0xffffff, 1);
  renderer.setPixelRatio(pixelRatio);

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  const startPosition = -20; // -20
  const torsoHeight = 155;
  const walkSpeed = 0.75 / pixelRatio;
  let time = 0;

  const camera = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);
  camera.aspect = width / height;
  camera.position.z = 1;

  const scene = new THREE.Scene();

  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Sun
  const sunPosition = {
    x: 200,
    y: height - 150,
    radius: 60,
    c: 50,
  };
  const sunGeometry = new THREE.TorusGeometry(sunPosition.radius, 1, 16, 100); // radius, thickness
  const sun = new THREE.Mesh(sunGeometry, material);
  sun.position.set(sunPosition.x, sunPosition.y, 0);
  scene.add(sun);
  // Sun rays
  const sunRayDist = 10;
  const sunRayLength = 50;
  const rays = {
    one: limbFactory(
      1,
      sunRayLength,
      sunPosition.x,
      sunPosition.y + sunPosition.radius + sunRayDist,
      0
    ),
    two: limbFactory(
      1,
      sunRayLength,
      sunPosition.x,
      sunPosition.y - sunPosition.radius - sunRayDist,
      0
    ),
    three: limbFactory(
      1,
      sunRayLength,
      sunPosition.x + sunPosition.radius + sunRayDist,
      sunPosition.y,
      0
    ),
    four: limbFactory(
      1,
      sunRayLength,
      sunPosition.x - sunPosition.radius - sunRayDist,
      sunPosition.y,
      0
    ),
    five: limbFactory(
      1,
      sunRayLength / 2,
      sunPosition.x + sunPosition.c,
      sunPosition.y + sunPosition.c,
      0
    ),
    six: limbFactory(
      1,
      sunRayLength / 2,
      sunPosition.x + sunPosition.c,
      sunPosition.y - sunPosition.c,
      0
    ),
    seven: limbFactory(
      1,
      sunRayLength / 2,
      sunPosition.x - sunPosition.c,
      sunPosition.y - sunPosition.c,
      0
    ),
    eight: limbFactory(
      1,
      sunRayLength / 2,
      sunPosition.x - sunPosition.c,
      sunPosition.y + sunPosition.c,
      0
    ),
  };
  rays.one.rotation.z = Math.PI;
  rays.three.rotation.z = Math.PI / 2;
  rays.four.rotation.z = -Math.PI / 2;
  rays.five.rotation.z = (Math.PI * 3) / 4;
  rays.six.rotation.z = Math.PI / 4;
  rays.seven.rotation.z = -Math.PI / 4;
  rays.eight.rotation.z = (-Math.PI * 3) / 4;

  // birds
  const bl1 = limbFactory(1, 50, width * 0.75, height * 0.75, 0);
  bl1.rotation.z = -Math.PI / 2;
  const bl2 = limbFactory(1, 50, width * 0.75, height * 0.75, 0);
  bl2.rotation.z = Math.PI / 2;
  const br1 = limbFactory(1, 30, width * 0.65, height * 0.85, 0);
  br1.rotation.z = -Math.PI / 2;
  const br2 = limbFactory(1, 30, width * 0.65, height * 0.85, 0);
  br2.rotation.z = Math.PI / 2;

  // clouds
  function cloudy(x, y, xRad, yRad, arcLength, rotation) {
    const curve = new THREE.EllipseCurve(
      x,
      y,
      xRad,
      yRad,
      0,
      arcLength,
      false,
      rotation
    );
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const ellipse = new THREE.Line(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(ellipse);
    return ellipse;
  }
  const clouds = [
    cloudy(width * 0.4, height * 0.65, 50, 100, (Math.PI * 2) / 3, Math.PI / 2),
    cloudy(
      width * 0.4,
      height * 0.65,
      50,
      100,
      (Math.PI * 2) / 3,
      -Math.PI / 2
    ),
    cloudy(width * 0.4, height * 0.65, 50, 50, Math.PI / 2, Math.PI),
    cloudy(width * 0.4 - 20, height * 0.65, 50, 50, Math.PI / 2, Math.PI),
    cloudy(width * 0.4 - 40, height * 0.65, 50, 50, Math.PI / 2, Math.PI),
    cloudy(width * 0.4, height * 0.65, 50, 50, Math.PI/4, Math.PI /4),
    cloudy(width * 0.4 + 20, height * 0.65, 50, 50, Math.PI/4, Math.PI /4),
    cloudy(width * 0.4 + 40, height * 0.65, 50, 50, Math.PI/4, Math.PI /4),
  ];

  // Man
  // Torso
  const torso = limbFactory(1, torsoHeight / 2, startPosition, torsoHeight, 0);
  scene.add(torso);
  // head
  const headGeometry = new THREE.TorusGeometry(20, 1, 16, 100);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.set(startPosition, torsoHeight + 20, 0);
  scene.add(head);
  // arms
  const armLength = torsoHeight / 3;
  const armY = torsoHeight - torsoHeight / 5;
  const armL = limbFactory(1, armLength, startPosition, armY, 0);
  armL.rotation.z = -Math.PI / 4;
  const armR = limbFactory(1, armLength, startPosition, armY, 0);
  armR.rotation.z = Math.PI / 4;
  // legs
  const legLength = torsoHeight / 4;
  const legLTop = limbFactory(1, legLength, startPosition, torsoHeight / 2, 0);
  const legLBot = limbFactory(1, legLength, 0, -legLength, 0, false);
  legLTop.add(legLBot);
  const legRTop = limbFactory(1, legLength, startPosition, torsoHeight / 2, 0);
  const legRBot = limbFactory(1, legLength, 0, -legLength, 0);
  legRTop.add(legRBot);

  function limbFactory(
    thickness,
    length,
    startX,
    startY,
    startZ,
    addToScene = true
  ) {
    const geometry = new THREE.CylinderGeometry(thickness, thickness, length);
    geometry.translate(0, -length / 2, 0);
    const obj = new THREE.Object3D();
    obj.position.set(startX, startY, startZ);
    if (addToScene) {
      scene.add(obj);
    }
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    obj.add(mesh);
    return obj;
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize =
      canvas.width !== width * window.devicePixelRatio ||
      canvas.height !== height * window.devicePixelRatio;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function resetPosition() {
    torso.position.set(startPosition, torsoHeight, 0);
    head.position.set(startPosition, torsoHeight + 20, 0);
    armL.position.set(startPosition, torsoHeight - torsoHeight / 7, 0);
    armR.position.set(startPosition, torsoHeight - torsoHeight / 7, 0);
    legLTop.position.set(startPosition, torsoHeight / 2, 0);
    legRTop.position.set(startPosition, torsoHeight / 2, 0);
    legLBot.position.set(0, -legLength, 0);
    legRBot.position.set(0, -legLength, 0);
  }

  function render() {
    time += 0.0125;

    // torso
    if (torso.position.x - 30 > width) {
      resetPosition();
    }
    torso.position.set(torso.position.x + walkSpeed, torso.position.y, 0);

    // head
    head.position.set(head.position.x + walkSpeed, head.position.y, 0);

    // arms
    armL.rotation.z = (Math.sin(time * walkSpeed * 8) * Math.PI) / 8;
    armR.rotation.z = (-Math.sin(time * walkSpeed * 8) * Math.PI) / 8;
    armL.position.x += walkSpeed;
    armR.position.x += walkSpeed;

    // legs
    const walk = time * walkSpeed * 8;
    const swingL = Math.sin(walk);
    const swingR = -Math.sin(walk);
    const backSwingFactor = 0.2; // 0.0 = no backswing, 1.0 = full
    legLTop.rotation.z =
      swingL > 0 ? 0.3 * swingL : 0.3 * swingL * backSwingFactor;
    legRTop.rotation.z =
      swingR > 0 ? 0.3 * swingR : 0.3 * swingR * backSwingFactor;
    legLBot.rotation.z = -0.3 * Math.max(0, swingL); // only bend forward
    legRBot.rotation.z = -0.3 * Math.max(0, swingR); // only bend forward

    legLTop.position.x += walkSpeed;
    legRTop.position.x += walkSpeed;

    // sun
    const scale1 = Math.sin(time);
    const scale2 = Math.cos(time) * 2;
    rays.one.scale.y = Math.max(0.5, scale1);
    rays.two.scale.y = Math.max(0.5, scale1);
    rays.three.scale.y = Math.max(0.5, scale1);
    rays.four.scale.y = Math.max(0.5, scale1);
    rays.five.scale.y = Math.max(0.5, scale2);
    rays.six.scale.y = Math.max(0.5, scale2);
    rays.seven.scale.y = Math.max(0.5, scale2);
    rays.eight.scale.y = Math.max(0.5, scale2);

    // bird
    let flapAmplitude = 0.6 / pixelRatio;
    let flapSpeed = 4 / pixelRatio;
    bl1.rotation.z = -Math.PI / 2 + Math.sin(time * flapSpeed) * flapAmplitude;
    bl2.rotation.z = Math.PI / 2 - Math.sin(time * flapSpeed) * flapAmplitude;
    br1.rotation.z =
      -Math.PI / 2 + Math.sin(time * flapSpeed * 1.5) * flapAmplitude;
    br2.rotation.z =
      Math.PI / 2 - Math.sin(time * flapSpeed * 1.5) * flapAmplitude;

    // clouds
    clouds.forEach(c => c.position.x += walkSpeed * 3)

    // resize
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      camera.left = 0;
      camera.right = w;
      camera.top = h;
      camera.bottom = 0;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  renderer.setSize(width, height);
  renderer.render(scene, camera);
});
</script>
<style scoped>
#c {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
