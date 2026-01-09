# QuickSurvey

Aplicación web para crear, compartir y votar encuestas con visualización de resultados en tiempo real.

## Stack

- Backend: Laravel 12 (PHP 8.2) + MySQL
- Frontend: Angular + Chart.js

## Funcionalidades

- Registro/login con roles (admin/usuario)
- CRUD de encuestas y opciones
- Votación con control de duplicados
- Resultados con gráficos

## Estructura del repositorio

- `backend-laravel/` → API Laravel, migraciones, seeders
- `frontend-angular/` → SPA Angular
- `db/QuickSurvey.sql` → dump inicial
- `DOCUMENTACION_BD.md` → diseño de base de datos
- `SETUP.md` → guía completa de instalación

## Requisitos mínimos

- PHP 8.2+, Composer 2
- Node.js 20+ y npm
- MySQL 8.x

## Inicio rápido

Backend:

```powershell
cd backend-laravel
composer install
copy .env.example .env   # ajusta credenciales
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend:

```powershell
cd frontend-angular
npm install
npm run start
```

## Rutas útiles (API)

- `GET /api/surveys` (auth)
- `POST /api/surveys` (auth) crear encuesta
- `POST /api/surveys/{id}/vote` (auth) registrar voto

## Documentación extendida

- Instalación detallada y resolución de problemas: [SETUP.md](SETUP.md)
- Modelo de datos: [DOCUMENTACION_BD.md](DOCUMENTACION_BD.md)

## Notas rápidas

- Usa `php artisan serve` (no `server`).
- Ejecuta `composer dump-autoload` si cambian clases y no se reconocen.
