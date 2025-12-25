# Guía de Configuración - QuickSurvey Backend

## Requisitos Previos

1. **XAMPP** instalado (incluye Apache, MySQL y PHP)
2. **Composer** instalado
3. **Node.js** y **npm** instalados

## Pasos de Configuración

### 1. Crear la base de datos en MySQL

Abre phpMyAdmin (http://localhost/phpmyadmin) y ejecuta el siguiente SQL:

```sql
CREATE DATABASE IF NOT EXISTS quicksurvey CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O usa la línea de comandos de MySQL:

```bash
mysql -u root -p < db/QuickSurvey.sql
```

### 2. Instalar dependencias de PHP

```bash
cd backend-laravel
composer install
```

### 3. Generar clave de aplicación

```bash
php artisan key:generate
```

### 4. Ejecutar las migraciones

```bash
php artisan migrate --seed
```

Esto creará todas las tablas y agregará datos de prueba.

### 5. Instalar dependencias de Node.js

```bash
npm install
```

### 6. Compilar assets (CSS y JS)

```bash
npm run build
```

O para desarrollo con watch:

```bash
npm run dev
```

### 7. Iniciar el servidor

En una terminal:

```bash
php artisan serve
```

El servidor estará disponible en `http://localhost:8000`

En otra terminal (para compilación en tiempo real):

```bash
npm run dev
```

## Verificación

Para verificar que todo está funcionando:

1. Abre http://localhost:8000
2. Deberías ver la página de bienvenido de Laravel

## Estructura de la Base de Datos

### Tablas Creadas:

- **users**: Almacena los usuarios registrados
- **surveys**: Almacena las encuestas creadas
- **survey_options**: Opciones de respuesta de cada encuesta
- **votes**: Votos/respuestas de los usuarios
- **cache**: Caché de la aplicación
- **jobs**: Cola de trabajos

## Datos de Prueba

El seeder crea automáticamente:

- **3 usuarios de prueba**
- **2 encuestas de ejemplo**
- **Votos de prueba** en ambas encuestas

Credenciales de prueba:
- Email: `juan@example.com` (Contraseña: creada por el factory)
- Email: `maria@example.com`
- Email: `carlos@example.com`

## Problemas Comunes

### Error: "No database selected"
Verifica que la base de datos `quicksurvey` existe y que tu `.env` tiene:
```
DB_DATABASE=quicksurvey
DB_USERNAME=root
DB_PASSWORD=
```

### Error: "SQLSTATE[HY000] [2002]"
MySQL no está corriendo. Inicia XAMPP y asegúrate de que MySQL está activo.

### Migraciones no se ejecutan
Ejecuta:
```bash
php artisan migrate:refresh --seed
```

## Comandos Útiles

```bash
# Ver el estado de las migraciones
php artisan migrate:status

# Deshacer todas las migraciones
php artisan migrate:reset

# Rehacer todas las migraciones
php artisan migrate:refresh

# Ejecutar solo el seeder
php artisan db:seed
```

## Próximos Pasos

Una vez que todo esté configurado:

1. **API Endpoints**: Crear controladores para CRUD de encuestas
2. **Autenticación**: Implementar sistema de login/registro
3. **Frontend Angular**: Conectar con los endpoints de la API
