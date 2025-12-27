# QuickSurvey — Guía rápida (TFG)

## 1) Qué es

- Web para crear encuestas, votar y ver resultados.
- SPA Angular + API Laravel (Sanctum) + MySQL.

## 2) Arquitectura

- Frontend (frontend-angular): rutas `/`, `/login`, `/register`, `/surveys` (placeholder).
- Backend (backend-laravel): API en `/api/*`; health `/health/db`.
- BD: `users`, `surveys`, `survey_options`, `votes`, `personal_access_tokens`.

## 3) Autenticación (hecho)

- Formularios con validación (email válido, password ≥ 8, confirmación). Mensajes en español.
- `POST /api/register` → crea usuario, marca `email_verified_at`, devuelve token + user.
- `POST /api/login` → valida credenciales, borra tokens previos, devuelve token + user.
- `POST /api/logout` (Bearer) y `GET /api/user` (Bearer).
- Token se guarda en `localStorage` como `auth_token`.
- CTA del hero: con token → `/surveys`, sin token → `/register`.

## 4) Estado actual

- UI listas: landing, login, register; navbar con logo grande; CTA inteligente.
- Surveys: página placeholder (falta CRUD y listado real).
- Backend auth: operativo con Sanctum; CORS permite `http://localhost:4200`; passwords con bcrypt.

## 5) Arranque local

- Requisitos: Node 18+, npm, PHP 8.2+, Composer, MySQL activo.
- Backend: `cd backend-laravel && composer install && php artisan migrate && php artisan serve` (http://127.0.0.1:8000).
- Frontend: `cd frontend-angular && npm install && npm run start` (http://localhost:4200).
- API base usada por el front: `http://127.0.0.1:8000/api`.

## 6) Demo express (exposición)

1. Explicar arquitectura: Angular SPA → Laravel API con tokens Sanctum.
2. Demo registro: crear usuario, ver token en localStorage, redirección a `/surveys`.
3. Demo login: validar credenciales, tokens previos se revocan.
4. Mostrar validaciones/errores en español.
5. Comentar BD y reglas: FKs en cascada, voto único por encuesta (pendiente de CRUD).

## 7) Pendientes inmediatos

- CRUD de encuestas y opciones; conectar `/surveys` a la API.
- Guard/ruta protegida para `/surveys` en Angular.
- Botón de logout en navbar.
- Tests básicos: PHPUnit (backend) y `ng test` (frontend).
