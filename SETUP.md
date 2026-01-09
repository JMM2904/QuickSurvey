# Guía de Configuración - QuickSurvey

Esta guía cubre backend (Laravel) y frontend (Angular).

## Requisitos

- PHP 8.2+ y Composer 2
- Node.js 20+ y npm
- MySQL 8.x (local o remoto)

## Variables de entorno (.env en backend-laravel)

Duplica `.env.example` a `.env` y ajusta:

```
APP_NAME=QuickSurvey
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quicksurvey
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=127.0.0.1:4200,localhost:4200
SESSION_DOMAIN=127.0.0.1
```

## Backend (Laravel)

```powershell
cd backend-laravel
composer install
copy .env.example .env   # si no existe .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

- URL por defecto: http://127.0.0.1:8000
- Si ves “Undefined method” tras mover código: `composer dump-autoload`

## Frontend (Angular)

```powershell
cd frontend-angular
npm install
npm run start
```

- URL por defecto: http://127.0.0.1:4200
- La app llama al backend en `http://127.0.0.1:8000` (ajusta el entorno si cambias el puerto/host).

## Datos de ejemplo

- `php artisan migrate --seed` crea usuarios, encuestas y votos de prueba.
- Reejecutar desde cero: `php artisan migrate:fresh --seed`

## Comandos útiles

```powershell
# Backend
php artisan test
php artisan migrate:status
php artisan db:seed

# Frontend
npm run build     # build de producción
npm run lint      # linting (si está configurado)
```

## Problemas comunes

- Error de conexión MySQL: revisa DB\_\* en .env y que MySQL esté ejecutando.
- “No such file or directory .env”: copia `.env.example` y vuelve a `php artisan key:generate`.
- El backend no arranca: usa `php artisan serve` (no `server`).
- Cambios no reflejados en clases: `composer dump-autoload`.

## Limpieza opcional

- Cache/config: `php artisan optimize:clear`
- Dependencias frontend corruptas: borrar `node_modules` y `package-lock.json`, luego `npm install`.
