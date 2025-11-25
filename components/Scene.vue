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
    radius: 60
  }
  const sunGeometry = new THREE.TorusGeometry(sunPosition.radius, 1, 16, 100); // radius, thickness
  const sun = new THREE.Mesh(sunGeometry, material);
  
  sun.position.set(sunPosition.x, sunPosition.y, 0);
  scene.add(sun);
  // Sun rays
  const sunRayDist = 6;
  const sunRayLength = 50;
  const rays = {
    one: limbFactory(1, sunRayLength,sunPosition.x, sunPosition.y + sunPosition.radius + sunRayDist, 0),
    two: limbFactory(1, sunRayLength, sunPosition.x, sunPosition.y + startPosition.radius + sunRayDist, 0),
    three: limbFactory(1, sunRayLength, sunPosition.x, sunPosition.y + startPosition.radius + sunRayDist, 0),
    four: limbFactory(1, sunRayLength, sunPosition.x, sunPosition.y + startPosition.radius + sunRayDist, 0),
    five: limbFactory(1, sunRayLength, sunPosition.x, sunPosition.y + startPosition.radius + sunRayDist, 0),
    six: limbFactory(1, sunRayLength, sunPosition.x, sunPosition.y + startPosition.radius + sunRayDist, 0),
  }

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
