# Referencia de Base de Datos - QuickSurvey

## Diagrama Relacional

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── password
└── timestamps

    ↓ (1:N)

surveys
├── id (PK)
├── user_id (FK → users)
├── title
├── description
├── slug (UNIQUE)
├── is_anonymous
├── is_active
├── expires_at
└── timestamps

    ├── ↓ (1:N)
    │
    └─→ survey_options
        ├── id (PK)
        ├── survey_id (FK → surveys)
        ├── text
        ├── order
        └── timestamps
        
            ↓ (1:N)
        
        votes
        ├── id (PK)
        ├── survey_id (FK → surveys)
        ├── survey_option_id (FK → survey_options)
        ├── user_id (FK → users, nullable)
        ├── ip_address
        └── timestamps
```

## Modelos y Relaciones

### User Model
```php
users:
  - hasMany('surveys')      // Encuestas creadas por el usuario
  - hasMany('votes')        // Votos realizados por el usuario
```

### Survey Model
```php
surveys:
  - belongsTo('user')           // Creador de la encuesta
  - hasMany('options')          // Opciones de la encuesta
  - hasMany('votes')            // Votos en la encuesta
```

### SurveyOption Model
```php
survey_options:
  - belongsTo('survey')         // Encuesta a la que pertenece
  - hasMany('votes')            // Votos para esta opción
```

### Vote Model
```php
votes:
  - belongsTo('survey')         // Encuesta votada
  - belongsTo('option')         // Opción seleccionada
  - belongsTo('user')           // Usuario que votó (nullable)
```

## Restricciones Importantes

1. **Votos únicos por usuario**: UNIQUE(`survey_id`, `user_id`)
   - Previene que un usuario registrado vote más de una vez en la misma encuesta

2. **Votos por IP**: Índice en (`survey_id`, `ip_address`)
   - Permite rastrear votos anónimos por IP (para futuros filtros)

3. **Cascadas**: 
   - Al eliminar una encuesta, se eliminan sus opciones y votos
   - Al eliminar un usuario, se asigna NULL a los votos asociados

## Consultas Comunes

### Obtener resultados de una encuesta
```php
$survey = Survey::find($id);
$results = $survey->options()->with('votes')->get();
```

### Contar votos por opción
```php
$survey->options()->withCount('votes')->get();
```

### Verificar si un usuario ya votó
```php
$hasVoted = Vote::where('survey_id', $id)
    ->where('user_id', $userId)
    ->exists();
```

### Obtener encuestas de un usuario
```php
$surveys = User::find($userId)->surveys()->get();
```

## Seeders de Datos de Prueba

El `DatabaseSeeder` crea:

**Usuarios:**
- Juan Pérez (juan@example.com)
- María García (maria@example.com)
- Carlos López (carlos@example.com)

**Encuestas:**
1. "¿Cuál es tu lenguaje de programación favorito?" (creada por Juan)
   - Opciones: PHP, Python, JavaScript, Java
   - 3 votos de prueba

2. "¿Qué framework web prefieres?" (creada por María)
   - Opciones: Laravel, Django, Angular
   - 3 votos de prueba (anónima)

## Índices para Rendimiento

- `users.email` → búsquedas rápidas por email
- `surveys.user_id` → obtener encuestas de un usuario
- `surveys.slug` → obtener encuesta por URL amigable
- `survey_options.survey_id` → obtener opciones de una encuesta
- `votes.survey_id` → obtener votos de una encuesta
- `votes.survey_id, votes.ip_address` → detección de múltiples votos por IP
