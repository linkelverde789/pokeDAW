# PokeDAW

## Descripción
PokeDAW es una aplicación web completa para amantes de Pokémon que ofrece múltiples funcionalidades, desde una Pokédex interactiva hasta herramientas de entrenamiento y minijuegos.

## Funcionalidades

### Pokedex
- **Pokédex Nacional**: Consulta información detallada de todos los Pokémon oficiales.
- **Pokédex Comunitaria**: Explora Pokémon creados por la comunidad de usuarios.

### Poketools
- **Calculadora de IV**: Herramienta para calcular los valores individuales de tus Pokémon.
- **Calculadora de EV**: Planifica el entrenamiento de estadísticas de tus Pokémon.
- **Calculador de Daño**: Analiza la efectividad de los ataques según tipos y estadísticas.
- **Herramienta SQL**: Ejecuta consultas personalizadas sobre la base de datos Pokémon.

### Pokeplay
- **¿Quién es ese Pokémon?**: Juego clásico para adivinar Pokémon por su silueta.
- **Pokémondle**: Versión Pokémon del juego Wordle.
- **Entrada de la Pokédex**: Juego de memorización de información de Pokémon.

### Sistema de Usuarios
- **Registro y Login**: Crea tu cuenta personal y accede a funciones exclusivas.
- **Favoritos**: Marca y gestiona tus Pokémon favoritos.
- **Pokémon Capturados**: Lleva un registro de los Pokémon que has capturado.

### CommunityMon
- **Creación de Pokémon**: Diseña y crea tus propios Pokémon personalizados.
- **Gestión de creaciones**: Actualiza o elimina tus creaciones.
- **Exploración comunitaria**: Descubre creaciones de otros usuarios.

### Equipos Pokémon
- **Creación de Miembros**: Añade Pokémon a tu colección personal.
- **Formación de Equipos**: Crea equipos con tus Pokémon capturados.
- **Gestión de Equipos**: Visualiza y administra todos tus equipos.

## Arquitectura

### Backend
- **API REST** desarrollada con **NodeJS** y **Express**.
- Arquitectura MVC (Modelo-Vista-Controlador).
- Documentación con **Swagger**.
- Sistema de autenticación mediante **JWT**.
- Base de datos **PostgreSQL**.

### Frontend
- Desarrollado con **React** y **Vite**.
- Enrutamiento con **React Router**.
- Diseño responsivo.
- Internacionalización con **i18next**.
- Integración con **Axios** para comunicación con API.

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- PostgreSQL
- JSON Web Token (JWT)
- bcryptjs
- Cors
- Dotenv
- Swagger

### Frontend
- React
- Vite
- React Router
- Axios
- i18next
- React Select
- Canvas Confetti
- React Infinite Scroll

## Instalación y Configuración

### Requisitos Previos
- Node.js
- PostgreSQL

### Configuración del Backend
1. Navega al directorio del backend: `cd backend`
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en el archivo `.env`
4. Inicia el servidor: `npm start`

### Configuración del Frontend
1. Navega al directorio del frontend: `cd frontend`
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`

## Documentación API
La documentación de la API está disponible en la ruta `/api-docs` del servidor backend.
