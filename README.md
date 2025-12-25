# QuickSurvey

Aplicación web para crear y compartir encuestas rápidas y visualizar resultados mediante gráficos.

Tecnologías principales

- Backend: Laravel 12 + PHP 8.2
- Base de datos: MySQL
- Frontend: Angular (Chart.js para gráficos)

Estado: prototipo funcional — migraciones, seeders y una ruta de prueba en backend disponibles.

## Quick Start (rápido)

Estos pasos arrancan la parte backend y frontend de forma local.

Backend (rápido):

```powershell
cd backend-laravel
composer install
# Copia o crea el fichero .env (si existe .env ya validado puedes usarlo)
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend (rápido):

```powershell
cd frontend-angular
npm install
npm run start
```

### Ruta de prueba (backend)

- `GET /test/survey` → devuelve la primera encuesta con `options` y `votes` en JSON.

## Documentación y instalación completa

- `SETUP.md` — instrucciones detalladas de configuración e instalación.
- `DOCUMENTACION_BD.md` — documentación y diseño de la base de datos.
- `DB_REFERENCE.md` — referencia rápida de la estructura de la BD.

## Próximos pasos sugeridos

- Crear endpoints API REST en `routes/api.php` para listar/mostrar encuestas y registrar votos.
- Maquetar componentes Angular y conectar con la API.

---

Para instrucciones detalladas y resolución de problemas, abre `SETUP.md`.
