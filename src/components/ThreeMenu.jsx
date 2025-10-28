import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader, Vector3 } from "three";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import ParticleTrail from "./ParticleTrail";

function FloatingCard({ basePos, label, onClick, isActive, scaleFactor }) {
  const mesh = useRef();
  const floatOffset = Math.random() * 2;
  const swayOffset = Math.random() * 2;
  const texture = useLoader(TextureLoader, "/textures/parchment.jpg");
  const { camera, gl } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = basePos[1] + Math.sin(t + floatOffset) * 0.12;
    mesh.current.position.x = basePos[0] + Math.sin(t + swayOffset) * 0.15;
    mesh.current.position.z = basePos[2] + Math.cos(t + swayOffset) * 0.15;
    mesh.current.lookAt(camera.position);
  });

  const handlePointerOver = () => (gl.domElement.style.cursor = "pointer");
  const handlePointerOut = () => (gl.domElement.style.cursor = "default");

  return (
    <group
      ref={mesh}
      onClick={(e) => {
        e.stopPropagation();
        onClick(label.toLowerCase());
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={[scaleFactor, scaleFactor, scaleFactor]}
    >
      <mesh>
        <planeGeometry args={[1.8, 1.0]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.2}
          roughness={0.6}
          emissive={isActive ? new THREE.Color("#ff4500") : new THREE.Color("#660000")}
          emissiveIntensity={0.6}
          transparent
          opacity={0.95}
        />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.3 * scaleFactor}
        color={isActive ? "#ff6b00" : "#ff3300"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function CameraController({ target, lookAt }) {
  const { camera } = useThree();
  const tmpPos = useRef(new Vector3());
  const tmpLook = useRef(new Vector3());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const hover = Math.sin(t * 0.3) * 0.3;
    const side = Math.cos(t * 0.2) * 0.3;
    camera.position.x += (side - camera.position.x) * 0.02;
    camera.position.y += (hover - camera.position.y) * 0.02;

    tmpPos.current.lerp(target.current, 0.08);
    camera.position.z += (target.current.z - camera.position.z) * 0.02;
    tmpLook.current.lerp(lookAt.current, 0.12);
    camera.lookAt(tmpLook.current);
    camera.updateMatrixWorld();
  });
  return null;
}

export default function ThreeMenu({ onOpenPage, onClosePage, activePage }) {
  const target = useRef(new Vector3(0, 0, 6));
  const lookAt = useRef(new Vector3(0, 0, 0));
  const initialCamPos = new Vector3(0, 0, 8);
  target.current.copy(initialCamPos);
  const sceneGroup = useRef();

  const [cards, setCards] = useState([
    { label: "Početna", basePos: [-3, 1.5, 0] },
    { label: "O meni", basePos: [1, 1.6, -2] },
    { label: "Radovi", basePos: [3, 1.4, 1.5] },
    { label: "Kontakt", basePos: [-1, 1.3, 2] },
  ]);

  const handleOpen = (page) => {
    const card = cards.find((c) => c.label.toLowerCase() === page);
    if (!card) return;
    const pos = new Vector3(...card.basePos);
    const camTarget = pos.clone().add(new Vector3(0, 0, 2.2));
    target.current.copy(camTarget);
    lookAt.current.copy(pos);
    onOpenPage(page, pos.toArray());
  };

  const handleClose = () => {
    target.current.copy(initialCamPos);
    lookAt.current.set(0, 0, 0);
    onClosePage();
  };

  useEffect(() => {
    if (!activePage) handleClose();
  }, [activePage]);

  const CameraWithTrail = () => {
    const { camera } = useThree();
    return <ParticleTrail camera={camera} />;
  };

  // responsive skala
  const [planetScale, setPlanetScale] = useState(1);
  const [cardScale, setCardScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        // telefon
        setPlanetScale(0.25); // jos manje
        setCardScale(0.35); // jos manje
        target.current.set(0, 0, 10); // kamera dalje
        setCards([
          { label: "Početna", basePos: [-1.2, 1.0, 0] },
          { label: "O meni", basePos: [0.4, 1.0, -0.5] },
          { label: "Radovi", basePos: [1.0, 0.8, 0.5] },
          { label: "Kontakt", basePos: [-0.4, 0.7, 1] },
        ]);
      } else if (window.innerWidth < 768) {
        setPlanetScale(0.5);
        setCardScale(0.6);
        target.current.set(0, 0, 8);
        setCards([
          { label: "Početna", basePos: [-2, 1.2, 0] },
          { label: "O meni", basePos: [0.8, 1.2, -1] },
          { label: "Radovi", basePos: [2, 1.0, 1] },
          { label: "Kontakt", basePos: [-0.8, 0.9, 1.5] },
        ]);
      } else {
        setPlanetScale(1);
        setCardScale(1);
        target.current.set(0, 0, 8);
        setCards([
          { label: "Početna", basePos: [-3, 1.5, 0] },
          { label: "O meni", basePos: [1, 1.6, -2] },
          { label: "Radovi", basePos: [3, 1.4, 1.5] },
          { label: "Kontakt", basePos: [-1, 1.3, 2] },
        ]);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // teksture planeta
  const moonTexture = useLoader(TextureLoader, "/textures/moon.jpg");
  const mercuryTexture = useLoader(TextureLoader, "/textures/mercury.jpg");
  const venusTexture = useLoader(TextureLoader, "/textures/venus.jpg");

  return (
    <div className="canvas-wrap" style={{ width: "100vw", height: "100vh", backgroundColor: "#050505" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />

        {/* Zvezdano nebo */}
        <Stars radius={120} depth={80} count={6000} factor={3} fade speed={0.3} />

        <CameraController target={target} lookAt={lookAt} />
        <CameraWithTrail />

        {/* Mesec krvave boje */}
        <mesh position={[0, -1.1, 0]} scale={[1.5 * planetScale, 1.5 * planetScale, 1.5 * planetScale]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            map={moonTexture}
            color="#aa2222"
            metalness={0.1}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* Merkur (levo) */}
        <mesh position={[-3, 0.5, -1]} scale={[planetScale, planetScale, planetScale]}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <meshStandardMaterial map={mercuryTexture} metalness={0.05} roughness={0.9} flatShading />
        </mesh>

        {/* Venera (desno) */}
        <mesh position={[3, 0.3, -0.5]} scale={[0.8 * planetScale, 0.8 * planetScale, 0.8 * planetScale]}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial map={venusTexture} metalness={0.1} roughness={0.85} flatShading />
        </mesh>

        {/* Lebdeće kartice */}
        <group ref={sceneGroup}>
          {cards.map((c) => (
            <FloatingCard
              key={c.label}
              basePos={c.basePos}
              label={c.label}
              onClick={handleOpen}
              isActive={activePage === c.label.toLowerCase()}
              scaleFactor={cardScale}
            />
          ))}

          <mesh position={[0, -10, 0]} onClick={() => activePage && handleClose()}>
            <planeGeometry args={[200, 200]} />
            <meshBasicMaterial opacity={0} transparent />
          </mesh>
        </group>

        {/* Efekti */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
