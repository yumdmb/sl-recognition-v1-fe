export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandLandmarks {
  landmarks: HandLandmark[];
  handedness: string;
}

export interface MultiHandLandmarks {
  hands: HandLandmarks[];
}

// For recording 3D avatar movement over time
export interface RecordedFrame {
  timestamp: number;
  landmarks: MultiHandLandmarks;
}

export interface Avatar3DRecording {
  frames: RecordedFrame[];
  duration: number;
  startTime: number;
}
