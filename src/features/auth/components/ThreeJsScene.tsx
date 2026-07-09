'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeJsScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a192f'); // Dark night sky
    scene.fog = new THREE.FogExp2('#0a192f', 0.0015);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Add Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xd9e2ec, 2);
    moonLight.position.set(-10, 20, -10);
    scene.add(moonLight);

    // 3. Create the Crescent Moon
    const moonGeometry = new THREE.SphereGeometry(3, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({ 
      color: '#f0f4f8', 
      emissive: '#f0f4f8', 
      emissiveIntensity: 0.2,
      roughness: 0.8
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(-8, 12, -15);
    scene.add(moon);

    // Create dark sphere to overlap and make crescent shape
    const shadowGeometry = new THREE.SphereGeometry(3.1, 32, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: '#0a192f' });
    const shadowMoon = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMoon.position.set(-7, 13, -14);
    scene.add(shadowMoon);

    // 4. Create the Desert Ground (Rolling dunes)
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    
    // Displace vertices to create dunes
    const positionAttribute = groundGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      // Math.sin generates rolling hills
      const z = Math.sin(x / 5) * 2 + Math.cos(y / 5) * 2;
      positionAttribute.setZ(i, z);
    }
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: '#c2b280', // Sand color
      roughness: 0.9,
      metalness: 0.1
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    // 5. Add Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starVertices = [];
    for(let i=0; i<500; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = Math.random() * 50 + 5;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 6. Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Subtle camera movement based on mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 + 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 5, 0);

      // Rotate stars slowly
      stars.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
