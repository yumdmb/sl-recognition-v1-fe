"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { HandLandmarks, MultiHandLandmarks } from "@/types/hand";

// Finger segments that should be rendered as bones
const FINGER_SEGMENTS = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
  [5, 6], [6, 7], [7, 8],                   // Index finger
  [9, 10], [10, 11], [11, 12],              // Middle finger
  [13, 14], [14, 15], [15, 16],             // Ring finger
  [17, 18], [18, 19], [19, 20],             // Pinky
  [0, 5], [0, 9], [0, 13], [0, 17],         // Wrist to finger bases
];

// Color schemes for left and right hands
const HAND_COLORS = {
  Left: { bone: "#a8d4ff", joint: "#6bb3ff", wrist: "#4a9eff" },
  Right: { bone: "#ffc0a8", joint: "#ffb3a0", wrist: "#ff6b6b" },
  Unknown: { bone: "#c8c8c8", joint: "#b0b0b0", wrist: "#909090" },
};

interface BoneProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius?: number;
  color: string;
}

function Bone({ start, end, radius = 0.02, color }: BoneProps) {
  const midpoint = useMemo(() => {
    return new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  }, [start, end]);

  const length = useMemo(() => start.distanceTo(end), [start, end]);

  const quaternion = useMemo(() => {
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const axis = new THREE.Vector3(0, 1, 0);
    return new THREE.Quaternion().setFromUnitVectors(axis, direction);
  }, [start, end]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

interface JointProps {
  position: THREE.Vector3;
  radius?: number;
  color: string;
}

function Joint({ position, radius = 0.03, color }: JointProps) {
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}


interface HandModelProps {
  landmarks: HandLandmarks;
  handIndex: number;
}

function HandModel({ landmarks, handIndex }: HandModelProps) {
  const colors = HAND_COLORS[landmarks.handedness as keyof typeof HAND_COLORS] || HAND_COLORS.Unknown;

  const positions = useMemo(() => {
    if (!landmarks?.landmarks) return [];

    // Scale Z much more to make depth visible when rotating
    // MediaPipe Z values are very small (relative to wrist), so we amplify them
    return landmarks.landmarks.map((landmark) => {
      return new THREE.Vector3(
        (landmark.x - 0.5) * 4,
        -(landmark.y - 0.5) * 4,
        -landmark.z * 10 // Increased from 2 to 10 for visible depth
      );
    });
  }, [landmarks]);

  if (!landmarks || positions.length === 0) {
    return null;
  }

  return (
    <group>
      {/* Render bones (cylinders between joints) */}
      {FINGER_SEGMENTS.map(([startIdx, endIdx], i) => (
        <Bone
          key={`hand-${handIndex}-bone-${i}`}
          start={positions[startIdx]}
          end={positions[endIdx]}
          radius={startIdx === 0 || endIdx === 0 ? 0.025 : 0.018}
          color={colors.bone}
        />
      ))}

      {/* Render palm connections with wider bones */}
      {[[5, 9], [9, 13], [13, 17]].map(([startIdx, endIdx], i) => (
        <Bone
          key={`hand-${handIndex}-palm-${i}`}
          start={positions[startIdx]}
          end={positions[endIdx]}
          radius={0.03}
          color={colors.bone}
        />
      ))}

      {/* Render joints (spheres at landmarks) */}
      {positions.map((pos, i) => (
        <Joint
          key={`hand-${handIndex}-joint-${i}`}
          position={pos}
          radius={i === 0 ? 0.04 : i % 4 === 0 ? 0.035 : 0.025}
          color={i === 0 ? colors.wrist : colors.joint}
        />
      ))}
    </group>
  );
}

interface Hand3DProps {
  multiHandLandmarks: MultiHandLandmarks | null;
  enableControls?: boolean;
}

export const Hand3D: React.FC<Hand3DProps> = ({
  multiHandLandmarks,
  enableControls = false,
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        {/* Lighting setup for realistic hand rendering */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 10, 0]} intensity={0.4} />

        {/* 3D Hand Models - render all detected hands */}
        {multiHandLandmarks?.hands.map((hand, index) => (
          <HandModel key={`hand-${index}`} landmarks={hand} handIndex={index} />
        ))}

        {/* Controls - only enabled when explicitly requested */}
        {enableControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={1}
            maxDistance={5}
          />
        )}
        <gridHelper args={[5, 20, "#444444", "#222222"]} position={[0, -1, 0]} />
      </Canvas>
    </div>
  );
};

export default Hand3D;
