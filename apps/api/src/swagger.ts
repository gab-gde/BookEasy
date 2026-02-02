import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookEasy API',
      version: '1.0.0',
      description: 'API de réservation en ligne pour petits commerces',
      contact: {
        name: 'Support',
        email: 'support@bookeasy.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Public - Services', description: 'Public service endpoints' },
      { name: 'Public - Availability', description: 'Public availability endpoints' },
      { name: 'Public - Bookings', description: 'Public booking endpoints' },
      { name: 'Admin - Dashboard', description: 'Admin dashboard' },
      { name: 'Admin - Bookings', description: 'Admin booking management' },
      { name: 'Admin - Services', description: 'Admin service management' },
      { name: 'Admin - Availability', description: 'Admin availability management' },
      { name: 'Admin - Export', description: 'Admin export functions' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
