const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require("cors");
require("dotenv").config();

const pokemonRoutes = require("./routes/pokemonRoutes");
const userPokemonRoutes = require("./routes/userPokemonRoutes");
const authRoutes = require("./routes/authRoutes");
const communitymonRoutes = require("./routes/communitymonRoutes");
const poketeamRoutes = require("./routes/poketeamRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", pokemonRoutes);
app.use("/user", userPokemonRoutes);
app.use("/auth", authRoutes);
app.use("/communitymon", communitymonRoutes);
app.use("/poketeam", poketeamRoutes);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PokeDaw',
      version: '1.0.0',
      description: 'API para gestionar una Pokédex interactiva con juegos y herramientas',
      contact: {
        name: 'API Support',
        email: 'martinurbano.sergio@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.production.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenido al autenticarse'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            status: {
              type: 'integer',
              description: 'Código de estado HTTP'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js'],
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Documentación de la Pokédex API"
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
});
