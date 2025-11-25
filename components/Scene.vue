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
  const groundLevel = 0;
  const torsoHeight = 160;
  const walkSpeed = 0.75 / pixelRatio;
  let time = 0;

  const camera = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);
  camera.aspect = width / height;
  camera.position.z = 1;

  const scene = new THREE.Scene();

  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Sun
  const sunGeometry = new THREE.TorusGeometry(60, 1, 16, 100); // radius, thickness
  const sun = new THREE.Mesh(sunGeometry, material);
  sun.position.set(200, height - 150, 0);
  scene.add(sun);

  // Man
  // Torso
  const torsoGeometry = new THREE.CylinderGeometry(1, 1, torsoHeight - 84);
  const torso = new THREE.Mesh(torsoGeometry, material);
  torso.position.set(startPosition, torsoHeight / 2 + 42, 0);
  scene.add(torso);
  // head
  const headGeometry = new THREE.TorusGeometry(20, 1, 16, 100);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.set(startPosition, groundLevel + torsoHeight + 20, 0);
  scene.add(head);
  // arms
  const armLPivot = new THREE.Object3D();
  armLPivot.position.set(startPosition - 13.5, torsoHeight - (torsoHeight/5), 0);
  scene.add(armLPivot);
  const armLMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, torsoHeight / 4),
    material
  );
  armLPivot.add(armLMesh);
  armLPivot.rotation.z = -Math.PI / 4;
  const armRPivot = new THREE.Object3D();
  armRPivot.position.set(startPosition + 13.5, torsoHeight - (torsoHeight/5), 0);
  scene.add(armRPivot);
  const armRMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, torsoHeight / 4),
    material
  );
  armRPivot.add(armRMesh);
  armRPivot.rotation.z = Math.PI / 4;
  // legs

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
    torso.position.set(startPosition, torsoHeight / 2 + 42, 0);
    head.position.set(startPosition, groundLevel + torsoHeight + 20, 0);
    armLPivot.position.set(
      startPosition - 13.5,
      torsoHeight - torsoHeight / 5,
      0
    );
    armRPivot.position.set(
      startPosition + 13.5,
      torsoHeight - torsoHeight / 5,
      0
    );
  }

  function render() {
    time += 0.0125;

    // torso
    if(torso.position.x - 30 > width) {
      resetPosition();
    }
    torso.position.set(torso.position.x + walkSpeed, torso.position.y, 0);

    // head
    head.position.set(head.position.x + walkSpeed, head.position.y, 0);

    // arms
    // const swingAngle = (Math.sin(time) * Math.PI) / 2;
    // armLPivot.rotation.z = Math.PI / 4 + swingAngle;
    // armRPivot.rotation.z = -Math.PI / 4 - swingAngle;
    armLPivot.position.x += walkSpeed;
    armRPivot.position.x += walkSpeed;

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
