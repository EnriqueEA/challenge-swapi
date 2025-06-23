# SWAPI Challenge - API de Fusión de Planetas y Clima

Una API serverless que fusiona datos de planetas de Star Wars (SWAPI) con información meteorológica de la Tierra, creando descripciones narrativas que conectan ambos mundos.

## 🌟 Características

- **Fusión de Datos**: Combina información de planetas de Star Wars con datos meteorológicos reales
- **Caché Inteligente**: Sistema de caché con TTL de 30 minutos para optimizar rendimiento
- **Autenticación JWT**: Endpoints protegidos con autenticación basada en tokens
- **Almacenamiento Personalizado**: Permite guardar datos personalizados con autenticación
- **Historial Completo**: Acceso al historial de todas las fusiones realizadas
- **Arquitectura Limpia**: Implementa principios de Clean Architecture con TypeScript

## 🏗️ Arquitectura

El proyecto sigue una arquitectura hexagonal (Clean Architecture) con las siguientes capas:

```
src/
├── domain/           # Entidades de negocio
├── application/      # Casos de uso y puertos
├── infrastructure/   # Adaptadores e implementaciones
└── presentation/     # Controllers HTTP y utilidades
```

### Tecnologías Utilizadas

- **Runtime**: Node.js 20.x
- **Framework**: Serverless Framework v4
- **Base de Datos**: AWS DynamoDB
- **Cache**: DynamoDB con TTL
- **Autenticación**: JWT
- **APIs Externas**:
  - SWAPI (Star Wars API)
  - Open-Meteo (datos meteorológicos)
  - OpenStreetMap Nominatim (geolocalización)

## 🚀 Endpoints Disponibles

### `GET /fusionados`

Obtiene una nueva fusión de planeta y clima.

**Respuesta:**

```json
{
  "planet": {
    "name": "Tatooine",
    "climate": "arid",
    "terrain": "desert",
    "latitude": 42.123,
    "longitude": -71.456
  },
  "weather": {
    "temperature": "23°C",
    "windSpeed": "15 km/h",
    "country": "Spain",
    "displayName": "Madrid, Spain"
  },
  "description": "El planeta Tatooine en las coordenadas 42.123°N, -71.456°E, con un clima arid, terreno desert, tiene como equivalencia en el planeta Tierra los datos meteorológicos de Madrid, Spain, donde actualmente la temperatura es de 23°C y la velocidad del viento es de 15 km/h.",
  "fusedAt": "2025-06-23T10:30:00.000Z"
}
```

### `POST /almacenar` 🔒

Almacena datos personalizados (requiere autenticación JWT).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "customField": "valor personalizado",
  "anotherField": 123
}
```

### `GET /historial` 🔒

Obtiene el historial de todas las fusiones (requiere autenticación JWT).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos

- Node.js 20.x o superior
- AWS CLI configurado
- Serverless Framework CLI

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd rimac-swapi

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.template .env
# Editar .env con tus valores
```

### Variables de Entorno

```bash
JWT_SECRET=tu_secreto_jwt_aqui
```

### Desarrollo Local

```bash
# Iniciar el servidor local
npm run dev
# o
serverless offline

# Linting y formateo
npm run lint
npm run lint:fix
npm run prettier
```

### Despliegue

```bash
# Desplegar a AWS
serverless deploy

# Desplegar a un stage específico
serverless deploy --stage production
```

## 🔧 Configuración

### DynamoDB

El proyecto utiliza dos tablas de DynamoDB:

1. **FusedPlanetWeatherV2**: Almacena las fusiones y datos personalizados
2. **FusedPlanetWeatherCache**: Cache con TTL para optimizar consultas

### JWT

Para generar un token JWT de prueba, puedes usar:

```javascript
const jwt = require("jsonwebtoken");
const token = jwt.sign({ userId: "test" }, "tu_secreto_jwt_aqui");
console.log(token);
```

## 📊 Flujo de Datos

1. **Fusión de Planetas**:
   - Obtiene un planeta aleatorio de SWAPI
   - Verifica el caché
   - Obtiene datos meteorológicos de las coordenadas del planeta
   - Genera una descripción narrativa
   - Almacena en base de datos y caché

2. **Cache Strategy**:
   - TTL de 30 minutos por planeta
   - Mejora significativamente el rendimiento
   - Reduce llamadas a APIs externas

3. **Autenticación**:
   - JWT Authorizer custom
   - Protege endpoints sensibles
   - Validación automática de tokens

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Validar código
npm run lint
```

## 📚 Estructura del Proyecto

- **Domain**: Entidades como `FusedPlanetWeather` y `CustomData`
- **Application**: Casos de uso como `FusionPlanetWeather`, `GetFusionHistory`
- **Infrastructure**: Implementaciones de repositorios, cache y clientes API
- **Presentation**: Handlers HTTP y utilidades

## 🔒 Seguridad

- Autenticación JWT en endpoints sensibles
- Validación de inputs
- Principio de menor privilegio en IAM roles
- Variables de entorno para secretos
