<template>
  <canvas id="c"></canvas>
</template>
<script setup>
import * as THREE from "three";

onMounted(() => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(0xffffff, 1);
  renderer.setPixelRatio(window.devicePixelRatio);

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  const startPosition = -20;
  const groundLevel = 0;
  const torsoHeight = 160;
  const walkSpeed = 0.75;
  const armSpeed = {
    t: 0,
    freq: 1,
    amount: 25,
  };

  const camera = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);
  camera.aspect = width / height;
  camera.position.z = 1;

  const scene = new THREE.Scene();

  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Sun
  const sunGeometry = new THREE.TorusGeometry(60, 0.5, 16, 100); // radius, thickness
  const sun = new THREE.Mesh(sunGeometry, material);
  sun.position.set(200, height - 150, 0);
  scene.add(sun);

  // Man
  // Torso
  const torsoPoints = [];
  torsoPoints.push(new THREE.Vector3(startPosition, groundLevel + 75, 0));
  torsoPoints.push(
    new THREE.Vector3(startPosition, groundLevel + torsoHeight, 0)
  );
  const torsoGeometry = new THREE.BufferGeometry().setFromPoints(torsoPoints);
  const torsoLine = new THREE.Line(torsoGeometry, material);
  scene.add(torsoLine);
  // head
  const headGeometry = new THREE.TorusGeometry(20, 0.5, 16, 100);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.set(startPosition, groundLevel + torsoHeight + 20, 0);
  scene.add(head);
  // arms
  const armPoints = [];
  armPoints.push(
    new THREE.Vector3(
      startPosition - armSpeed.amount,
      groundLevel + torsoHeight - 50,
      0
    )
  );
  armPoints.push(
    new THREE.Vector3(startPosition, groundLevel + torsoHeight - 25, 0)
  );
  armPoints.push(
    new THREE.Vector3(
      startPosition + armSpeed.amount,
      groundLevel + torsoHeight - 50,
      0
    )
  );
  const armGeometry = new THREE.BufferGeometry().setFromPoints(armPoints);
  const armLine = new THREE.Line(armGeometry, material);
  scene.add(armLine);
  // legs

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const nWidth = canvas.clientWidth;
    const nHeight = canvas.clientHeight;
    const needResize = nWidth !== canvas.width || nHeight !== canvas.height;
    if (needResize) {
      renderer.setSize(nWidth, nHeight, false);
      width = nWidth;
      height = nHeight;
    }
    return needResize;
  }

  function resetPosition() {
    const tPositions = torsoLine.geometry.attributes.position;
    tPositions.setX(0, startPosition);
    tPositions.setX(1, startPosition);
    head.position.set(
      startPosition,
      groundLevel + torsoHeight + 20,
      0
    );
    const aPositions = armLine.geometry.attributes.position;
    aPositions.setX(1, startPosition);
  }

  function render() {
    // torso
    const tPositions = torsoLine.geometry.attributes.position;
    if(tPositions.getX(0) - 30 > width) {
      resetPosition();
    }
    tPositions.setX(0, tPositions.getX(0) + walkSpeed);
    tPositions.setX(1, tPositions.getX(1) + walkSpeed);
    tPositions.needsUpdate = true;

    // head
    head.position.set(
      head.position.x + walkSpeed,
      groundLevel + torsoHeight + 20,
      0
    );

    // arms
    armSpeed.t += walkSpeed * 0.05;
    const swing = Math.sin(armSpeed.t * armSpeed.freq);
    const aPositions = armLine.geometry.attributes.position;
    aPositions.setX(0, aPositions.getX(1) + swing * armSpeed.amount);
    aPositions.setX(1, aPositions.getX(1) + walkSpeed);
    aPositions.setX(2, aPositions.getX(1) - swing * armSpeed.amount);
    aPositions.needsUpdate = true;

    // resize
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const w = canvas.width;
      const h = canvas.height;

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
