# Documentación - Diseño y Configuración de la Base de Datos de QuickSurvey

## Índice
1. [Introducción](#introducción)
2. [Análisis del Proyecto](#análisis-del-proyecto)
3. [Diseño de la Base de Datos](#diseño-de-la-base-de-datos)
4. [Estructura de Tablas](#estructura-de-tablas)
5. [Relaciones entre Tablas](#relaciones-entre-tablas)
6. [Modelos de Laravel](#modelos-de-laravel)
7. [Migraciones](#migraciones)
8. [Configuración del Entorno](#configuración-del-entorno)

---

## Introducción

QuickSurvey es una aplicación web que permite a los usuarios crear encuestas, compartirlas y recopilar votos. Este documento describe el diseño y la implementación de la base de datos para la aplicación.

**Tecnologías utilizadas:**
- Backend: Laravel 12
- Base de datos: MySQL
- Servidor local: XAMPP

---

## Análisis del Proyecto

### Requisitos Funcionales

1. **Gestión de Usuarios**
   - Registro e inicio de sesión
   - Almacenar información del usuario (nombre, email, contraseña)

2. **Creación de Encuestas**
   - Un usuario puede crear múltiples encuestas
   - Cada encuesta tiene un título, color e imagen opcional
   - Las encuestas pertenecen a un usuario específico

3. **Opciones de Respuesta**
   - Cada encuesta tiene múltiples opciones
   - Las opciones contienen texto descriptivo

4. **Sistema de Votación**
   - Los usuarios pueden votar en las encuestas
   - Un usuario solo puede votar una vez por encuesta
   - Cada voto selecciona una opción específica

5. **Visualización de Resultados**
   - Contar votos por opción
   - Mostrar gráficos con Chart.js

---

## Diseño de la Base de Datos

### Diagrama Relacional

```
┌─────────────┐
│   USUARIOS  │
├─────────────┤
│ id (PK)     │
│ nombre      │
│ email       │
│ contraseña  │
└─────────────┘
      │ (1:N)
      ├───────────────────┐
      │                   │
      ▼                   ▼
┌─────────────┐    ┌──────────┐
│ ENCUESTAS   │    │  VOTOS   │
├─────────────┤    ├──────────┤
│ id (PK)     │    │ id (PK)  │
│ usuario_id  │    │ encuesta │
│ título      │    │ usuario  │
│ color       │    │ opción   │
│ imagen      │    └──────────┘
└─────────────┘          │
      │ (1:N)            │
      ▼              (1:N) / (1:1)
┌──────────────┐        │
│  OPCIONES    │◄───────┘
├──────────────┤
│ id (PK)      │
│ encuesta_id  │
│ texto        │
└──────────────┘
```

### Cardinalidad de Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| Usuarios → Encuestas | 1:N | Un usuario crea muchas encuestas |
| Encuestas → Opciones | 1:N | Una encuesta tiene muchas opciones |
| Encuestas → Votos | 1:N | Una encuesta recibe muchos votos |
| Opciones → Votos | 1:N | Una opción recibe muchos votos |
| Usuarios → Votos | 1:N | Un usuario realiza muchos votos |

---

## Estructura de Tablas

### 1. Tabla: `users` (Usuarios)

**Propósito:** Almacenar información de los usuarios registrados en la plataforma.

**Campos:**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identificador único del usuario |
| `name` | VARCHAR(255) | NOT NULL | Nombre completo del usuario |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email único para inicio de sesión |
| `email_verified_at` | TIMESTAMP | NULL | Fecha de verificación de email |
| `password` | VARCHAR(255) | NOT NULL | Contraseña encriptada con bcrypt |
| `remember_token` | VARCHAR(100) | NULL | Token para "recuérdame" |
| `created_at` | TIMESTAMP | NULL | Fecha de creación del registro |
| `updated_at` | TIMESTAMP | NULL | Fecha de última actualización |

**Índices:**
- `idx_email`: Índice en `email` para búsquedas rápidas

**SQL:**
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2. Tabla: `surveys` (Encuestas)

**Propósito:** Almacenar las encuestas creadas por los usuarios.

**Campos:**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identificador único de la encuesta |
| `user_id` | BIGINT UNSIGNED | NOT NULL, FK | ID del usuario que creó la encuesta |
| `title` | VARCHAR(255) | NOT NULL | Título o pregunta de la encuesta |
| `color` | VARCHAR(7) | NULL | Color hexadecimal para diseño (ej: #FF5733) |
| `image` | LONGTEXT | NULL | URL o datos codificados de imagen |
| `created_at` | TIMESTAMP | NULL | Fecha de creación |
| `updated_at` | TIMESTAMP | NULL | Fecha de última actualización |

**Claves Foráneas:**
- `user_id` → `users.id` (ON DELETE CASCADE)
  - Si se elimina un usuario, sus encuestas se eliminan automáticamente

**Índices:**
- `idx_user_id`: Para búsquedas rápidas de encuestas por usuario

**SQL:**
```sql
CREATE TABLE surveys (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    color VARCHAR(7) NULL,
    image LONGTEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3. Tabla: `survey_options` (Opciones de Encuesta)

**Propósito:** Almacenar las opciones de respuesta para cada encuesta.

**Campos:**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identificador único de la opción |
| `survey_id` | BIGINT UNSIGNED | NOT NULL, FK | ID de la encuesta a la que pertenece |
| `text` | VARCHAR(255) | NOT NULL | Texto de la opción (ej: "PHP", "Python") |
| `created_at` | TIMESTAMP | NULL | Fecha de creación |
| `updated_at` | TIMESTAMP | NULL | Fecha de última actualización |

**Claves Foráneas:**
- `survey_id` → `surveys.id` (ON DELETE CASCADE)
  - Si se elimina una encuesta, sus opciones se eliminan automáticamente

**Índices:**
- `idx_survey_id`: Para obtener rápidamente todas las opciones de una encuesta

**SQL:**
```sql
CREATE TABLE survey_options (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    survey_id BIGINT UNSIGNED NOT NULL,
    text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    INDEX idx_survey_id (survey_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 4. Tabla: `votes` (Votos)

**Propósito:** Registrar los votos realizados por los usuarios en las encuestas.

**Campos:**

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Identificador único del voto |
| `survey_id` | BIGINT UNSIGNED | NOT NULL, FK | ID de la encuesta votada |
| `user_id` | BIGINT UNSIGNED | NOT NULL, FK | ID del usuario que votó |
| `survey_option_id` | BIGINT UNSIGNED | NOT NULL, FK | ID de la opción seleccionada |
| `created_at` | TIMESTAMP | NULL | Fecha del voto |
| `updated_at` | TIMESTAMP | NULL | Fecha de última actualización |

**Claves Foráneas:**
- `survey_id` → `surveys.id` (ON DELETE CASCADE)
- `user_id` → `users.id` (ON DELETE CASCADE)
- `survey_option_id` → `survey_options.id` (ON DELETE CASCADE)

**Restricciones Especiales:**
- `UNIQUE (survey_id, user_id)`: Evita que un usuario vote más de una vez en la misma encuesta

**Índices:**
- `idx_survey_id`: Para obtener todos los votos de una encuesta
- `idx_option_id`: Para obtener votos de una opción específica

**SQL:**
```sql
CREATE TABLE votes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    survey_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    survey_option_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (survey_option_id) REFERENCES survey_options(id) ON DELETE CASCADE,
    UNIQUE KEY unique_survey_user (survey_id, user_id),
    INDEX idx_survey_id (survey_id),
    INDEX idx_option_id (survey_option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Relaciones entre Tablas

### Relación 1: Usuarios → Encuestas (1:N)

**Descripción:** Un usuario puede crear múltiples encuestas.

**Implementación:**
- Campo `user_id` en tabla `surveys` referencia `id` de tabla `users`
- Acción `ON DELETE CASCADE`: Si se elimina un usuario, todas sus encuestas se eliminan

**Ejemplo:**
```
Usuario ID 1 (Juan) 
├── Encuesta 1: "¿Lenguaje favorito?"
├── Encuesta 2: "¿Framework favorito?"
└── Encuesta 3: "¿Editor de código favorito?"
```

---

### Relación 2: Encuestas → Opciones (1:N)

**Descripción:** Una encuesta tiene múltiples opciones de respuesta.

**Implementación:**
- Campo `survey_id` en tabla `survey_options` referencia `id` de tabla `surveys`
- Acción `ON DELETE CASCADE`: Si se elimina una encuesta, todas sus opciones se eliminan

**Ejemplo:**
```
Encuesta ID 1: "¿Lenguaje favorito?"
├── Opción 1: "PHP"
├── Opción 2: "Python"
└── Opción 3: "JavaScript"
```

---

### Relación 3: Usuarios → Votos (1:N)

**Descripción:** Un usuario puede realizar múltiples votos en diferentes encuestas.

**Implementación:**
- Campo `user_id` en tabla `votes` referencia `id` de tabla `users`
- Acción `ON DELETE CASCADE`: Si se elimina un usuario, todos sus votos se eliminan

**Ejemplo:**
```
Usuario ID 2 (María)
├── Voto en Encuesta 1, Opción 2 (Python)
└── Voto en Encuesta 2, Opción 1 (Laravel)
```

---

### Relación 4: Encuestas → Votos (1:N)

**Descripción:** Una encuesta recibe múltiples votos de diferentes usuarios.

**Implementación:**
- Campo `survey_id` en tabla `votes` referencia `id` de tabla `surveys`
- Acción `ON DELETE CASCADE`: Si se elimina una encuesta, todos sus votos se eliminan

---

### Relación 5: Opciones → Votos (1:N)

**Descripción:** Una opción puede recibir múltiples votos.

**Implementación:**
- Campo `survey_option_id` en tabla `votes` referencia `id` de tabla `survey_options`
- Acción `ON DELETE CASCADE`: Si se elimina una opción, todos sus votos se eliminan

**Restricción de Integridad:**
- `UNIQUE (survey_id, user_id)`: Un usuario solo puede votar una vez por encuesta

---

## Modelos de Laravel

Se han creado 4 modelos Eloquent que representan las tablas de la base de datos.

### 1. Modelo: User

**Archivo:** `app/Models/User.php`

**Relaciones:**
```php
// Un usuario puede crear muchas encuestas
public function surveys(): HasMany {
    return $this->hasMany(Survey::class);
}

// Un usuario puede hacer muchos votos
public function votes(): HasMany {
    return $this->hasMany(Vote::class);
}
```

**Campos mass-assignable:**
```php
protected $fillable = ['name', 'email', 'password'];
```

---

### 2. Modelo: Survey

**Archivo:** `app/Models/Survey.php`

**Relaciones:**
```php
// Una encuesta pertenece a un usuario
public function user(): BelongsTo {
    return $this->belongsTo(User::class);
}

// Una encuesta tiene muchas opciones
public function options(): HasMany {
    return $this->hasMany(SurveyOption::class);
}

// Una encuesta tiene muchos votos
public function votes(): HasMany {
    return $this->hasMany(Vote::class);
}
```

**Campos mass-assignable:**
```php
protected $fillable = ['user_id', 'title', 'color', 'image'];
```

---

### 3. Modelo: SurveyOption

**Archivo:** `app/Models/SurveyOption.php`

**Relaciones:**
```php
// Una opción pertenece a una encuesta
public function survey(): BelongsTo {
    return $this->belongsTo(Survey::class);
}

// Una opción tiene muchos votos
public function votes(): HasMany {
    return $this->hasMany(Vote::class, 'survey_option_id');
}
```

**Campos mass-assignable:**
```php
protected $fillable = ['survey_id', 'text'];
```

---

### 4. Modelo: Vote

**Archivo:** `app/Models/Vote.php`

**Relaciones:**
```php
// Un voto pertenece a una encuesta
public function survey(): BelongsTo {
    return $this->belongsTo(Survey::class);
}

// Un voto pertenece a una opción
public function option(): BelongsTo {
    return $this->belongsTo(SurveyOption::class, 'survey_option_id');
}

// Un voto pertenece a un usuario
public function user(): BelongsTo {
    return $this->belongsTo(User::class);
}
```

**Campos mass-assignable:**
```php
protected $fillable = ['survey_id', 'survey_option_id', 'user_id'];
```

---

## Migraciones

Las migraciones son archivos PHP que describen cambios en la estructura de la base de datos. Permiten versionado y reversibilidad.

### Archivos de Migración Creados

#### 1. Migración: `0001_01_01_000003_create_surveys_table.php`

**Propósito:** Crear la tabla `surveys`

**Contenido clave:**
```php
Schema::create('surveys', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->string('title');
    $table->string('color')->nullable();
    $table->longText('image')->nullable();
    $table->timestamps();
});
```

**Métodos Laravel utilizados:**
- `$table->id()`: Crea una columna BIGINT UNSIGNED con auto-incremento
- `$table->foreignId('user_id')`: Crea una clave foránea
- `->constrained('users')`: Especifica la tabla referenciada
- `->onDelete('cascade')`: Define acción al eliminar
- `$table->timestamps()`: Crea `created_at` y `updated_at`

---

#### 2. Migración: `0001_01_01_000004_create_survey_options_table.php`

**Propósito:** Crear la tabla `survey_options`

**Contenido clave:**
```php
Schema::create('survey_options', function (Blueprint $table) {
    $table->id();
    $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
    $table->string('text');
    $table->timestamps();
});
```

---

#### 3. Migración: `0001_01_01_000005_create_votes_table.php`

**Propósito:** Crear la tabla `votes`

**Contenido clave:**
```php
Schema::create('votes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('survey_option_id')->constrained('survey_options')->onDelete('cascade');
    $table->timestamps();
    
    // Evitar votos duplicados
    $table->unique(['survey_id', 'user_id']);
});
```

**Restricción especial:**
- `$table->unique(['survey_id', 'user_id'])`: Crea un índice único compuesto que previene que un usuario vote más de una vez en la misma encuesta

---

### Comandos de Migraciones

**Ejecutar todas las migraciones:**
```bash
php artisan migrate
```

**Ver estado de migraciones:**
```bash
php artisan migrate:status
```

**Deshacer la última migración:**
```bash
php artisan migrate:rollback
```

**Deshacer y rehacer todas (útil en desarrollo):**
```bash
php artisan migrate:refresh
```

**Deshacer y rehacer con seeder:**
```bash
php artisan migrate:refresh --seed
```

---

## Configuración del Entorno

### Archivo `.env`

El archivo `.env` contiene la configuración específica del entorno local.

**Configuración de base de datos:**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quicksurvey
DB_USERNAME=root
DB_PASSWORD=
```

**Explicación:**
- `DB_CONNECTION=mysql`: Usar driver MySQL
- `DB_HOST=127.0.0.1`: Servidor local
- `DB_PORT=3306`: Puerto por defecto de MySQL
- `DB_DATABASE=quicksurvey`: Nombre de la base de datos
- `DB_USERNAME=root`: Usuario por defecto de XAMPP
- `DB_PASSWORD=`: Contraseña vacía (por defecto en XAMPP)

---

### Pasos para Configurar la Base de Datos

#### 1. Iniciar XAMPP
- Abrir Control Panel de XAMPP
- Iniciar Apache (no necesario para CLI, pero recomendado)
- Iniciar MySQL

#### 2. Crear la base de datos (opción A: manual en phpMyAdmin)
```bash
1. Ir a http://localhost/phpmyadmin
2. Clic en "Nueva base de datos"
3. Nombre: quicksurvey
4. Codificación: utf8mb4_unicode_ci
5. Clic en "Crear"
```

#### 3. Crear la base de datos (opción B: usando SQL)
```bash
1. En phpMyAdmin, ir a "SQL"
2. Copiar el contenido de db/QuickSurvey.sql
3. Pegar y ejecutar
```

#### 4. Ejecutar migraciones
```bash
cd backend-laravel
php artisan migrate --seed
```

Esto:
- Crea todas las tablas
- Ejecuta el DatabaseSeeder (datos de prueba)

---

### Seeder: Datos de Prueba

**Archivo:** `database/seeders/DatabaseSeeder.php`

El seeder crea automáticamente datos de prueba:

**Usuarios creados:**
1. Juan Pérez (juan@example.com)
2. María García (maria@example.com)

**Encuestas creadas:**
1. "¿Cuál es tu lenguaje de programación favorito?" (por Juan)
   - Opciones: PHP, Python, JavaScript
   - Votos de prueba: 2

2. "¿Qué framework web prefieres?" (por María)
   - Opciones: Laravel, Django, Spring Boot
   - Votos de prueba: 1

**Ejecutar solo el seeder:**
```bash
php artisan db:seed
```

---

## Consultas Comunes

### Obtener todas las encuestas de un usuario
```php
$user = User::find(1);
$surveys = $user->surveys()->get();
```

### Obtener opciones de una encuesta
```php
$survey = Survey::find(1);
$options = $survey->options()->get();
```

### Contar votos por opción
```php
$survey = Survey::find(1);
$results = $survey->options()
    ->withCount('votes')
    ->get();
```

### Verificar si un usuario ya votó
```php
$hasVoted = Vote::where('survey_id', 1)
    ->where('user_id', $userId)
    ->exists();
```

### Registrar un voto
```php
Vote::create([
    'survey_id' => 1,
    'user_id' => 2,
    'survey_option_id' => 3,
]);
```

### Obtener todos los votos de una encuesta
```php
$survey = Survey::find(1);
$votes = $survey->votes()->get();
```

---

## Integridad de Datos

### Restricciones Implementadas

1. **Clave Primaria (PK):** Cada tabla tiene una columna `id` única
2. **Claves Foráneas (FK):** Garantizan referencias válidas entre tablas
3. **Restricción UNIQUE:** Previene votos duplicados del mismo usuario
4. **NOT NULL:** Campos obligatorios tienen restricción NOT NULL
5. **ON DELETE CASCADE:** Eliminación en cascada para mantener integridad

### Ejemplo de Cascada

Si se elimina una encuesta con ID 1:
1. Se eliminan todas sus opciones
2. Se eliminan todos sus votos
3. Se eliminan automáticamente en la BD

```php
// Esto elimina todo en cascada
Survey::find(1)->delete();
```

---

## Rendimiento

### Índices Implementados

| Tabla | Campo | Propósito |
|-------|-------|-----------|
| users | email | Búsquedas rápidas de usuarios |
| surveys | user_id | Obtener encuestas de un usuario |
| survey_options | survey_id | Obtener opciones de una encuesta |
| votes | survey_id | Obtener votos de una encuesta |
| votes | survey_option_id | Obtener votos de una opción |

Los índices aceleran búsquedas pero ralentizan inserciones. Se han equilibrado para este caso de uso.

---

## Conclusión

La base de datos está diseñada de manera simple pero efectiva para soportar los requisitos de QuickSurvey:
- Gestión de usuarios y autenticación
- Creación flexible de encuestas
- Recolección segura de votos
- Generación de resultados para gráficos

La estructura normalizada previene duplicación de datos y mantiene integridad referencial en toda la aplicación.
