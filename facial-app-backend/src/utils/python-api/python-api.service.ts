import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import {
  FaceEnrollmentResponse,
  FaceRecognitionResponse,
} from 'src/interfaces/face-recognition';

@Injectable()
export class PythonApiService {
  private readonly basePythonUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('PYTHON_API_URL');
    if (!baseUrl)
      throw new Error('No se encuentra la URL del servicio de python');

    this.basePythonUrl = baseUrl;
  }

  async enrollFace(imageBuffer: Buffer, fileName: string): Promise<number[]> {
    const formData = new FormData();
    formData.append('file', imageBuffer, fileName);

    try {
      const response = await lastValueFrom(
        this.httpService.post<FaceEnrollmentResponse>(
          `${this.basePythonUrl}/enrolar`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );

      if (response.data.status !== 'success') {
        throw new Error('Error en el microservicio de IA');
      }
      return response.data.vector;
    } catch (error) {
      console.error('Error enrolando rostro:', error.message);
      throw new InternalServerErrorException(
        'Fallo al extraer el vector biométrico en Python',
      );
    }
  }

  async recognizeFace(
    imageBuffer: Buffer,
    fileName: string,
    baseDatosVectores: Record<string, number[]>,
  ): Promise<FaceRecognitionResponse> {
    const formData = new FormData();
    formData.append('file', imageBuffer, fileName);

    formData.append('vectores_json', JSON.stringify(baseDatosVectores));

    try {
      const response = await lastValueFrom(
        this.httpService.post<FaceRecognitionResponse>(
          `${this.basePythonUrl}/reconocer`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );

      if (response.data.status !== 'success') {
        throw new Error('Error en el microservicio de IA');
      }

      return response.data;
    } catch (error) {
      console.error('Error reconociendo rostro:', error.message);
      throw new InternalServerErrorException(
        'Fallo en el motor de IA biométrica',
      );
    }
  }
}
