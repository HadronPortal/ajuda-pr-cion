import { useState, Suspense, forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  ContactShadows, 
  useGLTF, 
  Html,
  PerspectiveCamera,
  Environment,
  Bounds,
  BakeShadows,
  Loader
} from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";

// Preload the model
useGLTF.preload("/assets/models/car.glb");

function Model({ url, onPointClick }: { url: string, onPointClick: (name: string, data: any) => void }) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();

  // Clone scene to avoid shared state if multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Improve materials for light/dark
        if (child.material) {
          child.material.envMapIntensity = 1;
        }
      }
    });
  }, [clonedScene]);

  // Coordinates for hotspots (normalized to model space)
  // These are estimates based on standard sedan proportions
  const hotspots = [
    { name: "Pneu Dianteiro Esquerdo", position: [-0.8, 0.3, 1.4], type: "tire" },
    { name: "Pneu Dianteiro Direito", position: [0.8, 0.3, 1.4], type: "tire" },
    { name: "Pneu Traseiro Esquerdo", position: [-0.8, 0.3, -1.4], type: "tire" },
    { name: "Pneu Traseiro Direito", position: [0.8, 0.3, -1.4], type: "tire" },
    { name: "Motor", position: [0, 0.8, 1.8], type: "engine" },
    { name: "Bateria", position: [0.4, 0.7, 1.6], type: "battery" },
    { name: "Freios", position: [0.7, 0.4, 1.3], type: "brakes" },
    { name: "Óleo", position: [-0.3, 0.7, 1.7], type: "oil" },
    { name: "Carroceria", position: [0, 1.2, 0], type: "body" },
  ];

  return (
    <group>
      <primitive object={clonedScene} />
      {hotspots.map((spot) => (
        <Hotspot 
          key={spot.name} 
          position={new THREE.Vector3(...spot.position)} 
          name={spot.name} 
          onClick={() => onPointClick(spot.name, {})} 
        />
      ))}
    </group>
  );
}

function Hotspot({ position, name, onClick }: { position: THREE.Vector3, name: string, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  
  // Logic to hide if behind the car could be added here using Raycaster, 
  // but Html component in drei handles basic occlusion well enough for now 
  // if we set distanceFactor.

  return (
    <group ref={ref} position={position}>
      <Html
        distanceFactor={6}
        position={[0, 0, 0]}
        transform
        occlude
        style={{
          transition: 'all 0.2s',
          opacity: hovered ? 1 : 0.8,
          transform: `scale(${hovered ? 1.2 : 1})`,
        }}
      >
        <div 
          className="cursor-pointer group relative"
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <div className="h-6 w-6 flex items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
            <div className="relative h-3 w-3 rounded-full bg-primary shadow-lg border-2 border-white" />
          </div>
          
          {/* Tooltip */}
          <div className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background/90 backdrop-blur text-[10px] font-medium rounded shadow-md border whitespace-nowrap transition-opacity pointer-events-none",
            hovered ? "opacity-100" : "opacity-0"
          )}>
            {name}
          </div>
        </div>
      </Html>
    </group>
  );
}

import { useState } from "react";

interface VehicleSceneProps {
  color?: string;
  className?: string;
  onPointClick?: (name: string, data: any) => void;
}

export function VehicleScene({ className, onPointClick = () => {} }: VehicleSceneProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={cn("relative h-full w-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center", className)}>
        <img 
          src="/lovable-uploads/38605335-9df0-4c28-98e3-0d3460662d53.png" 
          alt="Modelo indisponível" 
          className="max-h-[60%] object-contain mb-4 opacity-50"
        />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Modelo 3D indisponível</p>
          <p className="text-xs text-muted-foreground">Exibindo representação fotográfica.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full bg-muted/10", className)}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={40} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Bounds fit clip observe margin={1.2}>
            <Model 
              url="/assets/models/car.glb" 
              onPointClick={onPointClick} 
            />
          </Bounds>

          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.6} 
            scale={10} 
            blur={2} 
            far={4.5} 
          />
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2.1} // Prevent going below ground
            minPolarAngle={0.1} // Prevent top-down vertical flip
            makeDefault
          />
          <BakeShadows />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: 'transparent' }}
        innerStyles={{ width: '100px', height: '2px', backgroundColor: 'var(--primary)' }}
        barStyles={{ backgroundColor: 'var(--primary)' }}
        dataStyles={{ color: 'var(--muted-foreground)', fontSize: '10px' }}
        dataInterpolation={(p) => `Carregando veículo: ${p.toFixed(0)}%`}
      />

      <div className="absolute bottom-4 right-4 pointer-events-none flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
          Modelo GLB Real
        </span>
        <span className="text-[9px] text-muted-foreground/60">
          Representação visual de alta fidelidade
        </span>
      </div>
    </div>
  );
}
