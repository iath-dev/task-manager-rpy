# Frontend - Interfaz de Usuario del Gestor de Tareas

Este es el frontend para la aplicación de gestión de tareas, construido con React y Vite.

## Tecnologías Utilizadas

*   **Framework:** React 19
*   **Lenguaje:** TypeScript
*   **Herramienta de Construcción:** Vite
*   **Estilos:** Tailwind CSS
*   **Enrutamiento:** React Router DOM v6
*   **Componentes de UI:** Shadcn

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── features/
│   ├── hooks/
│   ├── interfaces/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── providers/
│   ├── routes/
│   ├── services/
│   └── store/
├── vite.config.ts
├── package.json
└── README.md
```

## Configuración y Ejecución

### Prerrequisitos

*   Node.js
*   npm

### Desarrollo Local

1.  **Instalar dependencias:**

    ```bash
    npm install
    ```

2.  **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

### Docker

Consulte el `README.md` de la raíz del proyecto para obtener instrucciones sobre cómo ejecutar la aplicación con Docker Compose.

## Pruebas (Testing)

Este proyecto utiliza **Cypress** para las pruebas de componentes. La estrategia de pruebas se centra en un **enfoque basado en componentes**, donde las pruebas se encuentran junto a los componentes mismos (por ejemplo, `MiComponente.cy.tsx`).

Nuestra filosofía es probar a fondo la lógica y la funcionalidad personalizadas de la aplicación. Evitamos escribir pruebas redundantes para componentes importados de bibliotecas de terceros como **Shadcn**, ya que se asume que están bien probados por sus mantenedores. Esto nos permite centrar nuestros esfuerzos de prueba en nuestro propio código, garantizando su corrección y fiabilidad.

Para ejecutar las pruebas, utilice el siguiente comando:

```bash
npm run cypress:open:component
```