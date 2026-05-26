export interface FaceRecognitionResponse {
  status: string;
  filename: string;
  data: Array<{
    nombre: string;
  }>;
}

export interface FaceEnrollmentResponse {
  status: string;
  filename: string;
  vector: number[];
}
