# 🚀 Guía Paso a Paso - QuickSurvey

**Proyecto:** QuickSurvey - Plataforma de Encuestas  
**Plazo:** ~1.5 semanas (hasta ~7 de enero de 2026)  
**Stack:** Laravel 12 + Angular 18 + MySQL  
**Última actualización:** 25 de diciembre de 2025

---

## 📋 Tabla de Contenidos

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Fase 1: Backend - Completado ✅](#fase-1-backend---completado)
3. [Fase 2: Frontend Landing Page](#fase-2-frontend-landing-page)
4. [Fase 3: API REST](#fase-3-api-rest)
5. [Fase 4: Autenticación](#fase-4-autenticación)
6. [Fase 5: Funcionalidades Principales](#fase-5-funcionalidades-principales)
7. [Verificación y Testing](#verificación-y-testing)
8. [Despliegue](#despliegue)

---

## 📱 Resumen del Proyecto

### ¿Qué es QuickSurvey?

Una plataforma web donde los usuarios pueden:

- Crear encuestas personalizadas
- Responder encuestas de otros usuarios
- Ver resultados en tiempo real con gráficos
- Gestionar sus encuestas

### Tecnologías Utilizadas

**Backend:**

- Laravel 12 (PHP 8.2)
- MySQL 8.0
- Eloquent ORM
- Composer (gestor de dependencias)

**Frontend:**

- Angular 18
- TypeScript
- SCSS
- Chart.js (gráficos)
- npm (gestor de paquetes)

**DevOps:**

- Git + GitHub
- XAMPP (desarrollo local)
- PowerShell (terminal)

---

## ✅ Fase 1: Backend - Completado

### Paso 1.1: Configuración Inicial

```bash
# Ubicación: C:\Users\javie\OneDrive\Escritorio\QuickSurvey
# El proyecto Laravel ya está inicializado en backend-laravel/

# Verificar que XAMPP esté corriendo:
# 1. Abre XAMPP Control Panel
# 2. Inicia Apache y MySQL
```

### Paso 1.2: Base de Datos

```bash
# El esquema ya está creado con migraciones

# Estructura final:
# ├── users (id, name, email, password, timestamps)
# ├── surveys (id, user_id, title, color, image, timestamps)
# ├── survey_options (id, survey_id, text, timestamps)
# └── votes (id, survey_id, user_id, survey_option_id, timestamps)
```

**Descripción de tablas:**

| Tabla            | Propósito             | Campos Principales                                                  |
| ---------------- | --------------------- | ------------------------------------------------------------------- |
| `users`          | Usuarios del sistema  | id, name, email, password, created_at, updated_at                   |
| `surveys`        | Encuestas creadas     | id, user_id (FK), title, color, image, created_at, updated_at       |
| `survey_options` | Opciones de respuesta | id, survey_id (FK), text, created_at, updated_at                    |
| `votes`          | Votos registrados     | id, survey_id (FK), user_id (FK), survey_option_id (FK), timestamps |

**Restricciones:**

- `votes` tiene UNIQUE(survey_id, user_id) → Un usuario solo puede votar una vez por encuesta
- Cascading DELETE en todas las ForeignKeys

### Paso 1.3: Modelos Eloquent

**`app/Models/Survey.php`** (Encuesta)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['user_id', 'title', 'color', 'image'];

    // Una encuesta pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Una encuesta tiene muchas opciones
    public function options()
    {
        return $this->hasMany(SurveyOption::class);
    }

    // Una encuesta tiene muchos votos
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
```

**`app/Models/SurveyOption.php`** (Opción de Encuesta)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyOption extends Model
{
    protected $fillable = ['survey_id', 'text'];

    // Una opción pertenece a una encuesta
    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    // Una opción tiene muchos votos
    public function votes()
    {
        return $this->hasMany(Vote::class, 'survey_option_id');
    }
}
```

**`app/Models/Vote.php`** (Voto)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = ['survey_id', 'user_id', 'survey_option_id'];
    public $timestamps = false;

    // Un voto pertenece a una encuesta
    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    // Un voto pertenece a una opción
    public function option()
    {
        return $this->belongsTo(SurveyOption::class, 'survey_option_id');
    }

    // Un voto pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

**`app/Models/User.php`** (Usuario) - Extensión

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];
    protected $casts = ['email_verified_at' => 'datetime'];

    // Un usuario crea muchas encuestas
    public function surveys()
    {
        return $this->hasMany(Survey::class);
    }

    // Un usuario hace muchos votos
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
```

### Paso 1.4: Migraciones Ejecutadas

**Comandos ejecutados:**

```bash
# Navegar a backend-laravel
cd backend-laravel

# Ejecutar todas las migraciones (ya completado)
php artisan migrate:fresh --seed

# Verificar estado
php artisan migrate:status
```

**Migraciones creadas:**

1. `0001_01_01_000000_create_users_table.php` - Tabla users
2. `0001_01_01_000001_create_cache_table.php` - Cache
3. `0001_01_01_000002_create_jobs_table.php` - Jobs
4. `0001_01_01_000003_create_surveys_table.php` - Encuestas
5. `0001_01_01_000004_create_survey_options_table.php` - Opciones
6. `0001_01_01_000005_create_votes_table.php` - Votos

### Paso 1.5: Seeders de Datos de Prueba

**`database/seeders/DatabaseSeeder.php`** (ya ejecutado)

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Survey;
use App\Models\SurveyOption;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuarios
        $user1 = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => bcrypt('password123'),
        ]);

        $user2 = User::create([
            'name' => 'María García',
            'email' => 'maria@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Crear encuesta 1
        $survey1 = Survey::create([
            'user_id' => $user1->id,
            'title' => '¿Cuál es tu lenguaje de programación favorito?',
            'color' => '#5112FF',
            'image' => null,
        ]);

        // Opciones para encuesta 1
        SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'PHP']);
        SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'Python']);
        SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'JavaScript']);

        // Votos para encuesta 1
        Vote::create([
            'survey_id' => $survey1->id,
            'user_id' => $user2->id,
            'survey_option_id' => 1,
        ]);

        // Crear encuesta 2
        $survey2 = Survey::create([
            'user_id' => $user2->id,
            'title' => '¿Prefieres frontend o backend?',
            'color' => '#FF6B35',
            'image' => null,
        ]);

        // Opciones para encuesta 2
        SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Frontend']);
        SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Backend']);
        SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Ambos']);

        // Votos para encuesta 2
        Vote::create([
            'survey_id' => $survey2->id,
            'user_id' => $user1->id,
            'survey_option_id' => 4,
        ]);

        Vote::create([
            'survey_id' => $survey2->id,
            'user_id' => $user2->id,
            'survey_option_id' => 5,
        ]);
    }
}
```

**Datos de prueba creados:**

- 2 usuarios: Juan Pérez, María García
- 2 encuestas: "Lenguaje favorito", "Frontend vs Backend"
- 6 opciones de respuesta (3 por encuesta)
- 4 votos registrados

### Paso 1.6: Verificación del Backend

**Comando para verificar estado de migraciones:**

```bash
cd backend-laravel
php artisan migrate:status

# Output esperado:
# Migration                                      Batch
# 0001_01_01_000000_create_users_table           1
# 0001_01_01_000001_create_cache_table           1
# 0001_01_01_000002_create_jobs_table            1
# 0001_01_01_000003_create_surveys_table         1
# 0001_01_01_000004_create_survey_options_table  1
# 0001_01_01_000005_create_votes_table           1
```

**Verificación via Tinker (REPL de Laravel):**

```bash
php artisan tinker

# Contar registros
\App\Models\User::count()                    # Resultado: 2
\App\Models\Survey::count()                  # Resultado: 2
\App\Models\SurveyOption::count()            # Resultado: 6
\App\Models\Vote::count()                    # Resultado: 4

# Obtener datos con relaciones
$survey = \App\Models\Survey::first();
$survey->options;                             # 3 opciones
$survey->votes;                               # 2 votos

# Salir
exit
```

**Ruta de prueba (ya creada en `routes/web.php`):**

```bash
# Visitando en navegador o curl:
http://localhost:8000/test/survey

# Retorna JSON con la primera encuesta y todas sus relaciones
```

---

## 🎨 Fase 2: Frontend Landing Page

### Paso 2.1: Inicializar Angular (si aún no está hecho)

```bash
# Ir al directorio frontend
cd frontend-angular

# Instalar dependencias
npm install

# Verificar versión
ng version
```

### Paso 2.2: Crear Componentes Base

**Componente principal: LandingPageComponent**

```bash
# Desde frontend-angular/
ng generate component pages/landing-page
ng generate component shared/navbar
ng generate component shared/hero-section
ng generate component shared/footer
```

**Resultado esperado:**

```
src/
├── app/
│   ├── pages/
│   │   └── landing-page/
│   │       ├── landing-page.component.ts
│   │       ├── landing-page.component.html
│   │       ├── landing-page.component.scss
│   │       └── landing-page.component.spec.ts
│   └── shared/
│       ├── navbar/
│       ├── hero-section/
│       └── footer/
```

### Paso 2.3: Diseño SCSS (Estilos)

**Crear archivo de variables: `src/assets/scss/_variables.scss`**

```scss
// Colores
$primary-color: #5112ff; // Púrpura
$secondary-color: #ff6b35; // Naranja
$text-dark: #1a1a1a; // Texto oscuro
$text-light: #ffffff; // Texto claro
$bg-light: #f5f5f5; // Fondo claro
$bg-white: #ffffff; // Blanco puro

// Tipografía
$font-primary: "Familjen Grotesk", sans-serif;
$font-size-large: 3.5rem;
$font-size-medium: 1.5rem;
$font-size-small: 1rem;

// Espaciado
$spacing-unit: 1rem;
$spacing-large: 3rem;
$spacing-medium: 2rem;
$spacing-small: 1rem;

// Breakpoints responsivos
$breakpoint-mobile: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
```

**Navbar Component: `navbar.component.scss`**

```scss
@import "../../../assets/scss/variables";

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-medium;
  background-color: $bg-white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .logo {
    font-family: $font-primary;
    font-size: $font-size-medium;
    color: $primary-color;
    font-weight: 700;
  }

  .nav-links {
    display: flex;
    gap: $spacing-medium;
    list-style: none;

    a {
      color: $text-dark;
      text-decoration: none;
      font-family: $font-primary;
      transition: color 0.3s ease;

      &:hover {
        color: $primary-color;
      }
    }
  }

  .cta-button {
    background-color: $primary-color;
    color: $text-light;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: $font-primary;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: $spacing-medium;
  }
}
```

**Hero Section: `hero-section.component.scss`**

```scss
@import "../../../assets/scss/variables";

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: $spacing-large;
  text-align: center;

  .hero-title {
    font-family: $font-primary;
    font-size: $font-size-large;
    color: $text-light;
    margin-bottom: $spacing-medium;
    max-width: 800px;
  }

  .hero-subtitle {
    font-family: $font-primary;
    font-size: $font-size-medium;
    color: rgba($text-light, 0.9);
    margin-bottom: $spacing-large;
    max-width: 600px;
  }

  .cta-button {
    background-color: $text-light;
    color: $primary-color;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: $font-primary;
    font-weight: 700;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: $breakpoint-tablet) {
    min-height: auto;
    padding: $spacing-medium;

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }
  }
}
```

### Paso 2.4: Implementar Componentes

**`navbar.component.html`**

```html
<nav class="navbar">
  <div class="logo">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <!-- Logo SVG aquí -->
      <circle cx="20" cy="20" r="18" fill="#5112FF" />
      <text
        x="20"
        y="26"
        text-anchor="middle"
        fill="white"
        font-size="16"
        font-weight="bold"
      >
        QS
      </text>
    </svg>
    QuickSurvey
  </div>

  <ul class="nav-links">
    <li><a href="#features">Características</a></li>
    <li><a href="#about">Acerca de</a></li>
    <li><a href="#contact">Contacto</a></li>
  </ul>

  <button class="cta-button" (click)="navigateTo('/login')">
    Inicia Sesión
  </button>
</nav>
```

**`hero-section.component.html`**

```html
<section class="hero">
  <h1 class="hero-title">Crea y comparte encuestas en segundos</h1>
  <p class="hero-subtitle">
    Recoge opiniones de tus amigos y colegas de forma rápida y sencilla
  </p>
  <button class="cta-button" (click)="startSurvey()">Comienza Ahora</button>
</section>
```

**`landing-page.component.html`**

```html
<div class="landing-page">
  <app-navbar></app-navbar>
  <app-hero-section></app-hero-section>
  <app-footer></app-footer>
</div>
```

**`landing-page.component.scss`**

```scss
.landing-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
```

### Paso 2.5: Configurar Rutas

**`app.routes.ts` o `app.module.ts` (dependiendo versión Angular)**

```typescript
import { Routes } from "@angular/router";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";

export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "surveys",
    loadComponent: () =>
      import("./pages/surveys/surveys.component").then(
        (m) => m.SurveysComponent
      ),
  },
];
```

### Paso 2.6: Verificación Landing Page

```bash
# Desde frontend-angular/
npm start

# O
ng serve --open

# Acceder a: http://localhost:4200
```

**Verificar:**

- ✅ Navbar visible con logo y enlaces
- ✅ Hero section con título, subtítulo y botón
- ✅ Colores correctos (#5112FF en botón)
- ✅ Tipografía Familljen Grotesk cargada
- ✅ Responsive en móvil

---

## 🔌 Fase 3: API REST

### Paso 3.1: Crear Controladores

**Generar controlador de Surveys:**

```bash
cd backend-laravel
php artisan make:controller Api/SurveyController --api
```

**`app/Http/Controllers/Api/SurveyController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\Vote;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    // GET /api/surveys - Listar todas las encuestas
    public function index()
    {
        return Survey::with(['user', 'options', 'votes'])
            ->latest()
            ->paginate(10);
    }

    // GET /api/surveys/{id} - Obtener encuesta específica
    public function show($id)
    {
        $survey = Survey::with(['user', 'options', 'votes'])
            ->findOrFail($id);

        return [
            'id' => $survey->id,
            'title' => $survey->title,
            'color' => $survey->color,
            'image' => $survey->image,
            'created_by' => $survey->user->name,
            'options' => $survey->options->map(function ($option) use ($survey) {
                return [
                    'id' => $option->id,
                    'text' => $option->text,
                    'votes_count' => $survey->votes
                        ->where('survey_option_id', $option->id)
                        ->count(),
                ];
            }),
            'total_votes' => $survey->votes->count(),
        ];
    }

    // POST /api/surveys - Crear encuesta
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'color' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*' => 'string|max:255',
        ]);

        $survey = Survey::create([
            'user_id' => auth()->id() ?? 1, // Cambiar después de auth
            'title' => $validated['title'],
            'color' => $validated['color'],
        ]);

        foreach ($validated['options'] as $option) {
            $survey->options()->create(['text' => $option]);
        }

        return $survey->load('options');
    }

    // POST /api/surveys/{id}/vote - Registrar voto
    public function vote(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        $validated = $request->validate([
            'survey_option_id' => 'required|exists:survey_options,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Verificar que no haya votado ya
        $existingVote = Vote::where('survey_id', $survey->id)
            ->where('user_id', $validated['user_id'])
            ->first();

        if ($existingVote) {
            return response()->json(
                ['message' => 'Ya has votado en esta encuesta'],
                422
            );
        }

        $vote = Vote::create([
            'survey_id' => $survey->id,
            'user_id' => $validated['user_id'],
            'survey_option_id' => $validated['survey_option_id'],
        ]);

        return response()->json(['message' => 'Voto registrado'], 201);
    }
}
```

### Paso 3.2: Registrar Rutas API

**`routes/api.php`**

```php
<?php

use App\Http\Controllers\Api\SurveyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Encuestas públicas
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::get('/surveys/{id}', [SurveyController::class, 'show']);
    Route::post('/surveys/{id}/vote', [SurveyController::class, 'vote']);

    // Encuestas autenticadas (después)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/surveys', [SurveyController::class, 'store']);
    });
});
```

### Paso 3.3: Verificar Endpoints

```bash
# Listar encuestas
curl http://localhost:8000/api/v1/surveys

# Obtener encuesta específica
curl http://localhost:8000/api/v1/surveys/1

# Registrar voto (POST)
curl -X POST http://localhost:8000/api/v1/surveys/1/vote \
  -H "Content-Type: application/json" \
  -d '{"survey_option_id": 1, "user_id": 2}'
```

---

## 🔐 Fase 4: Autenticación

### Paso 4.1: Configurar Sanctum (API Tokens)

```bash
# Backend
cd backend-laravel
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Paso 4.2: Crear Controlador de Autenticación

**`app/Http/Controllers/Api/AuthController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(
                ['message' => 'Credenciales inválidas'],
                401
            );
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
```

### Paso 4.3: Rutas de Autenticación

**Agregar a `routes/api.php`:**

```php
Route::prefix('v1')->group(function () {
    // Autenticación pública
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Autenticación protegida
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/user', fn(Request $request) => $request->user());
    });
});
```

### Paso 4.4: Componentes Angular Login/Register

**Generar componentes:**

```bash
cd frontend-angular
ng generate component pages/login
ng generate component pages/register
```

**`login.component.html`**

```html
<div class="auth-container">
  <div class="auth-card">
    <h2>Inicia Sesión</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <input
        type="email"
        placeholder="Correo electrónico"
        formControlName="email"
      />
      <input
        type="password"
        placeholder="Contraseña"
        formControlName="password"
      />
      <button type="submit">Inicia Sesión</button>
    </form>
    <p>¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
  </div>
</div>
```

**`login.component.ts`**

```typescript
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post("/api/v1/auth/login", this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          this.router.navigate(["/surveys"]);
        },
        (error) => console.error("Error:", error)
      );
    }
  }
}
```

---

## 📊 Fase 5: Funcionalidades Principales

### Paso 5.1: Página de Encuestas

**Crear componente:**

```bash
ng generate component pages/surveys-list
ng generate component shared/survey-card
```

**`surveys-list.component.ts`**

```typescript
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-surveys-list",
  templateUrl: "./surveys-list.component.html",
  styleUrls: ["./surveys-list.component.scss"],
})
export class SurveysListComponent implements OnInit {
  surveys: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSurveys();
  }

  loadSurveys() {
    this.http.get<any>("/api/v1/surveys").subscribe(
      (response) => {
        this.surveys = response.data;
        this.loading = false;
      },
      (error) => {
        console.error("Error:", error);
        this.loading = false;
      }
    );
  }
}
```

### Paso 5.2: Página de Resultados con Chart.js

**Instalar Chart.js:**

```bash
npm install chart.js ng2-charts
```

**`survey-results.component.ts`**

```typescript
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Chart } from "chart.js/auto";

@Component({
  selector: "app-survey-results",
  templateUrl: "./survey-results.component.html",
  styleUrls: ["./survey-results.component.scss"],
})
export class SurveyResultsComponent implements OnInit {
  survey: any;
  chart: Chart | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.loadSurvey(id);
  }

  loadSurvey(id: string | null) {
    if (!id) return;

    this.http.get(`/api/v1/surveys/${id}`).subscribe(
      (survey: any) => {
        this.survey = survey;
        this.createChart();
      },
      (error) => console.error("Error:", error)
    );
  }

  createChart() {
    const ctx = document.getElementById("resultsChart") as HTMLCanvasElement;

    const labels = this.survey.options.map((opt: any) => opt.text);
    const data = this.survey.options.map((opt: any) => opt.votes_count);

    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ["#5112FF", "#FF6B35", "#4ECDC4", "#FFD93D"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}
```

---

## ✅ Verificación y Testing

### Paso 6.1: Checklist de Funcionalidades

**Backend:**

- [ ] Migraciones ejecutadas correctamente
- [ ] Seeders populan datos de prueba
- [ ] Modelos con relaciones funcionan
- [ ] Rutas API retornan datos correctos
- [ ] Validación de votos duplicados funciona

**Frontend:**

- [ ] Landing page se visualiza correctamente
- [ ] Componentes responsivos en móvil
- [ ] Formularios de login/registro funcionan
- [ ] Listado de encuestas carga desde API
- [ ] Votación registra correctamente
- [ ] Gráficos de resultados se generan

### Paso 6.2: Comandos de Verificación

```bash
# Backend
cd backend-laravel
php artisan migrate:status          # Verificar migraciones
php artisan tinker                  # Explorar datos
\App\Models\Survey::count()         # Contar encuestas
\App\Models\Vote::count()           # Contar votos

# Frontend
cd frontend-angular
ng serve --open                     # Inicia servidor de desarrollo
npm run build                       # Build para producción
npm run test                        # Ejecuta tests (si existen)
```

### Paso 6.3: Testing Manual

**Escenarios a probar:**

1. **Crear Encuesta:**

   - Ir a "Crear Encuesta"
   - Ingresar título, color, mínimo 2 opciones
   - Verificar que se guarda en BD

2. **Votar:**

   - Navegar a encuesta
   - Seleccionar opción
   - Verificar que no permite votar 2 veces (UNIQUE constraint)

3. **Ver Resultados:**
   - Después de votar, ver página de resultados
   - Verificar que gráfico se actualiza
   - Comparar votos mostrados con BD

---

## 🚀 Despliegue

### Paso 7.1: Preparar para Producción

**Backend:**

```bash
cd backend-laravel

# Build optimizado
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Compilar assets (si aplica)
npm run build
```

**Frontend:**

```bash
cd frontend-angular

# Build para producción
ng build --configuration production

# Output: dist/frontend-angular/
```

### Paso 7.2: Git - Commits Finales

```bash
# Commit de funcionalidades completadas
git add .
git commit -m "feat: landing page y API de encuestas completados"
git push origin main

# O crear rama de features
git checkout -b feature/landing-page
git add .
git commit -m "feat: implementar landing page con navbar y hero"
git push origin feature/landing-page

# Hacer PR y merge a main
```

### Paso 7.3: Opciones de Hosting

**Backend Laravel (opciones):**

- Heroku (limitado)
- DigitalOcean App Platform
- AWS Lambda
- Azure App Service
- Vercel (experimental)

**Frontend Angular:**

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages
- AWS S3 + CloudFront

---

## 📝 Notas Importantes

### Puntos Clave

1. **Base de Datos:**

   - UNIQUE(survey_id, user_id) previene votos duplicados
   - Cascading DELETE mantiene integridad
   - Usa migraciones, no modifiques SQL directamente

2. **API:**

   - `/api/v1/` es el prefijo para versioning
   - Todos los endpoints retornan JSON
   - Validación en controlador antes de guardar

3. **Frontend:**

   - Usa servicios Angular para llamadas HTTP
   - Almacena token en localStorage
   - Interceptores para agregar Authorization header

4. **Git:**
   - Commit antes de cada fase importante
   - Push a main/develop regularmente
   - Crear ramas para features grandes

### Archivos de Documentación

- **`SETUP.md`** - Instalación inicial paso a paso
- **`DOCUMENTACION_BD.md`** - Detalles de base de datos
- **`DB_REFERENCE.md`** - Queries SQL comunes
- **`README.md`** - Resumen general del proyecto
- **`GUIA_PASO_A_PASO.md`** - Este archivo (guía completa)

---

## ⏱️ Timeline Sugerido

| Fase | Descripción                 | Duración  | Fecha           |
| ---- | --------------------------- | --------- | --------------- |
| ✅ 1 | Backend completo            | 3-4 días  | 25 dic - 28 dic |
| 2️⃣   | Landing page frontend       | 1-2 días  | 29 dic - 30 dic |
| 3️⃣   | API REST endpoints          | 1 día     | 31 dic          |
| 4️⃣   | Autenticación               | 1-2 días  | 1 ene - 2 ene   |
| 5️⃣   | Funcionalidades principales | 2-3 días  | 3 ene - 5 ene   |
| 6️⃣   | Testing y bugfixes          | 1 día     | 6 ene           |
| 7️⃣   | Despliegue final            | 0.5-1 día | 7 ene           |

**Total:** ~10-14 días (aproximadamente para terminar el 7 de enero)

---

## 📞 Soporte Rápido

**Comando para resetear todo (cuidado):**

```bash
# Backend
cd backend-laravel
php artisan migrate:fresh --seed
php artisan serve

# Frontend
cd frontend-angular
npm install
ng serve
```

**Errores comunes:**

| Error                         | Solución                                        |
| ----------------------------- | ----------------------------------------------- |
| "SQLSTATE Database not found" | Verificar MySQL está corriendo, `.env` correcto |
| "Class not found"             | `php artisan tinker` - verificar ruta de import |
| "CORS errors"                 | Agregar headers en Laravel `config/cors.php`    |
| "npm module not found"        | `npm install` nuevamente en frontend-angular    |
| "Cannot find template"        | Verificar ruta en `selector` del componente     |

---

**Última actualización:** 25 de diciembre de 2025  
**Versión:** 1.0  
**Autor:** JMM2904
