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
