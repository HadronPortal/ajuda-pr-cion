import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, ContactShadows } from "@react-three/drei";
import { cn } from "@/lib/utils";

function Model({ color = "#cccccc" }: { color?: string }) {
  return (
    <group>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.75, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Wheels */}
      <group position={[-1, -0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      <group position={[1, -0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      <group position={[-1, -0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      <group position={[1, -0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  );
}

interface VehicleSceneProps {
  color?: string;
  className?: string;
}

export function VehicleScene({ color, className }: VehicleSceneProps) {
  return (
    <div className={cn("relative h-full w-full bg-muted/20", className)}>
      <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <Model color={color} />
          </Stage>
          <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span className="text-[10px] text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
          Representação visual
        </span>
      </div>
    </div>
  );
}
