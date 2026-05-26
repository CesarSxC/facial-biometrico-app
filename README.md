# Sistema de Kiosco Biométrico en Tiempo Real

Este proyecto es una solución integral de control de asistencia mediante reconocimiento facial automatizado. Está diseñado bajo una arquitectura limpia, desacoplada y de alta disponibilidad, estructurada como un **Monorepo** que unifica tres ecosistemas tecnológicos clave.

## 🚀 Arquitectura del Proyecto

El sistema se divide en tres componentes principales:

1. **Frontend (`/facial-app-frontend`)**: Desarrollado en **Angular (v17+)** utilizando componentes *Standalone* y el nuevo sistema de **Signals** para una reactividad óptima. Interfaz estilizada con **Tailwind CSS** y maquetación modular bajo principios de diseño atómico.
2. **Backend (`/facial-app-backend`)**: Una API REST robusta construida con **NestJS** y **TypeScript**, encargada de la lógica de negocio, persistencia de datos (con TypeORM) y gestión de registros de asistencia.
3. **Servicio de IA (`/facial-app`)**: Microservicio desarrollado en **Python** especializado en visión artificial. Se encarga del procesamiento de imágenes de la cámara web, detección de rostros y la generación de vectores matemáticos para la verificación biométrica.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Angular 17, TypeScript, Tailwind CSS, RxJS, Bun.
- **Backend:** NestJS, Node.js, TypeORM, PostgreSQL/MySQL.
- **Inteligencia Artificial:** Python, OpenCV, DeepFace / Face Recognition.
- **Herramientas de Entorno:** Git (Monorepo), Docker (opcional).

## 📋 Características Principales

- 📸 **Escaneo Facial:** Captura y procesamiento en tiempo real desde un flujo de cámara web.
- 🕒 **Historial Reactivo:** Panel lateral dinámico (`RecentScans`) que muestra los últimos 5 accesos del día actualizándose automáticamente sin refrescar la página.
- 👥 **Gestión de Personal:** CRUD completo para la administración de empleados, roles y departamentos.
- ⚡ **Optimización del DOM:** Arquitectura modular que previene desbordamientos de memoria en renderizados masivos de datos.

##  Fuentes para este proyecto

- *Reconocimiento facial* : 
  https://medium.com/@abdelazizechamsine2/facial-recognition-with-deep-learning-the-best-algorithms-for-accurate-and-fast-results-f03a80572fa3

  https://www.youtube.com/watch?v=sz25xxF_AVE&t=622s

- *Ultimas Implemetaciones de Angular* :
  https://youtu.be/TXZq4dd5G1s?si=ekoFL4W1iB-6972N
  https://youtu.be/R1QePsia5xk?si=dTxiI49v7JgeHi7k

