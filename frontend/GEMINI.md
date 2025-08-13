# Detalles del Proyecto Frontend

Este documento describe los aspectos clave de la aplicación frontend, construida con React y TypeScript.

## Tecnologías Utilizadas

- **Framework:** React 19
- **Lenguaje:** TypeScript
- **Herramienta de Construcción:** Vite
- **Estilos:** Tailwind CSS
- **Enrutamiento:** React Router DOM v6
- **Gestión de Formularios:** React Hook Form con Zod para validación
- **Componentes de UI:** Shadcn
- **Iconos:** Lucide React
- **Bibliotecas de Utilidades:** `clsx`, `tailwind-merge`, `use-debounce`
- **Gestión de Estado:** (Planeado: `zustand` según la preferencia del usuario)

## Arquitectura del Sistema

La arquitectura del frontend está diseñada para ser modular, escalable y mantenible. Sigue un enfoque basado en componentes, donde la interfaz de usuario se divide en componentes reutilizables e independientes.

- **Componentes de UI Genéricos (`src/components/ui`):** Componentes de bajo nivel sin lógica de negocio, como botones, entradas y tarjetas. Estos son los bloques de construcción básicos de la interfaz.
- **Componentes de Características (`src/components/{Feature}`):** Componentes más complejos que encapsulan una funcionalidad específica, como `TaskList` o `TaskForm`. Estos componentes pueden contener lógica de estado y de negocio.
- **Páginas (`src/pages`):** Componentes que representan una vista completa de la aplicación, como el Dashboard o la página de inicio de sesión. Las páginas componen varios componentes de características para construir la interfaz de usuario.
- **Servicios (`src/services`):** Módulos responsables de la comunicación con la API del backend. Abstraen la lógica de obtención y envío de datos, manteniendo los componentes limpios de detalles de implementación de la API.
- **Gestión de Estado (`src/store`):** Utiliza `zustand` para un estado global y centralizado, gestionando datos que se comparten entre diferentes componentes, como la información del usuario autenticado o el estado de la barra lateral.

## Estructura del Proyecto

El frontend sigue un enfoque estructurado:

- `src/assets/`: Activos estáticos como imágenes.
- `src/components/`: Componentes de UI reutilizables.
  - `ui/`: Componentes de UI genéricos y sin estilo (por ejemplo, `navbar.tsx`, `footer.tsx`).
- `src/context/`: Definiciones de React Context (por ejemplo, `theme.ts` para el contexto del tema).
- `src/features/`: Módulos específicos de características (por ejemplo, autenticación, tareas).
- `src/hooks/`: Hooks de React personalizados.
- `src/layouts/`: Componentes de diseño (por ejemplo, `AppLayout.tsx`).
- `src/lib/`: Funciones de utilidad o módulos de ayuda.
- `src/mocks/`: Datos de prueba para desarrollo y pruebas (por ejemplo, `data.ts`).
- `src/pages/`: Componentes a nivel de página, que representan diferentes vistas de la aplicación.
  - `Auth/`: Páginas relacionadas con la autenticación (por ejemplo, `Login.tsx`, `Register.tsx`).
  - `Dashboard/`: Página del panel de control.
  - `Tasks/`: Páginas de gestión de tareas (por ejemplo, `TaskList.tsx`, `TaskForm.tsx`).
- `src/providers/`: Proveedores de React Context (por ejemplo, `theme.tsx` para el proveedor de tema).
- `src/routes/`: Configuración de enrutamiento de la aplicación.
  - `index.tsx`: Configuración principal del enrutador.
  - `protected.tsx`: Rutas que requieren autenticación.
  - `public.tsx`: Rutas de acceso público.
- `src/services/`: Cliente de API y capa de servicio para interactuar con el backend.
- `src/store/`: Gestión de estado global (planeado para `zustand`).
- `src/styles/`: Estilos globales (por ejemplo, `index.css`).
- `src/interfaces/`: Definiciones de tipo de TypeScript (por ejemplo, `task.ts`).
- `src/App.tsx`: Componente principal de la aplicación.
- `src/main.tsx`: Punto de entrada para la aplicación React.
- `src/vite-env.d.ts`: Definiciones de tipo de entorno de Vite.

## Informe del Proceso de Desarrollo

El desarrollo de este proyecto siguió un enfoque ágil e iterativo. Las decisiones clave y el proceso se detallan a continuación:

- **Elección de Tecnologías:** Se seleccionó una pila de tecnologías moderna y robusta, con React y TypeScript como base para garantizar un código tipado y mantenible. Vite se eligió como herramienta de construcción por su rapidez y excelente experiencia de desarrollo. Tailwind CSS y Shadcn se seleccionaron para un desarrollo de UI rápido y consistente.
- **Estructura de Carpetas:** Se definió una estructura de carpetas clara y escalable desde el principio para garantizar que el proyecto se mantuviera organizado a medida que crecía.
- **Pruebas (Testing):** Se adoptó un enfoque de pruebas basado en componentes con Cypress. Esta decisión se tomó para garantizar que los componentes individuales funcionen como se espera y para facilitar la depuración y el mantenimiento. Se decidió no probar los componentes de bibliotecas de terceros para centrar los esfuerzos en el código personalizado.
- **Calidad del Código:** Se configuró ESLint y Prettier para garantizar un estilo de código consistente y para detectar posibles errores en una fase temprana del desarrollo.

## Configuración y Ejecución

1.  **Clonar el repositorio.**
2.  **Navegar al directorio `frontend`.**
3.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
4.  **Ejecutar en Modo de Desarrollo:**
    ```bash
    npm run dev
    ```
    (Esto normalmente iniciará la aplicación en `http://localhost:5173` o un puerto similar.)
5.  **Construir para Producción:**
    ```bash
    npm run build
    ```
6.  **Ejecutar con Docker:**
    ```bash
    docker build -t task-manager-frontend .
    docker run -p 80:80 task-manager-frontend
    ```

## Pruebas (Testing)

- Pruebas de componentes con Cypress. Para ejecutar las pruebas, use `npm run cypress:open:component`.

## Linting

- ESLint configurado para la calidad del código.
  ```bash
  npm run lint
  ```