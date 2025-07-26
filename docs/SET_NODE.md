# Nodo Set - Documentación (Estilo n8n)

El nodo Set permite establecer valores en el chain usando expresiones JavaScript, replicando exactamente el comportamiento de n8n.

## Configuración

El nodo Set acepta un objeto `values` en la configuración, donde cada clave se convierte en una propiedad del output y cada valor puede ser una expresión JavaScript entre `{{ }}`.

```json
{
  "id": "set_values",
  "type": "set",
  "name": "Set Values",
  "config": {
    "values": {
      "timestamp": "{{ $now.toISOString() }}",
      "uppercase_text": "{{ $input.generated_text.toUpperCase() }}",
      "word_count": "{{ $input.generated_text.split(' ').length }}"
    }
  }
}
```

## Variables de Contexto Disponibles

### Variables Principales
- `$input` - Datos de entrada del nodo anterior
- `$json` - Alias de `$input` (para compatibilidad con n8n)
- `$now` - Fecha y hora actual como objeto Date
- `$today` - Fecha actual como objeto Date
- `$random` - Número aleatorio entre 0 y 1
- `$timestamp` - Timestamp actual en milisegundos

### Utilidades JSON
- `$jsonUtil.stringify(obj)` - Convertir objeto a JSON string
- `$jsonUtil.parse(str)` - Parsear JSON string a objeto

## Ejemplos de Uso

### Valores Simples
```json
{
  "values": {
    "message": "{{ 'Hello World' }}",
    "number": "{{ 42 }}",
    "boolean": "{{ true }}",
    "array": "{{ [1, 2, 3] }}"
  }
}
```

### Usando Datos de Entrada
```json
{
  "values": {
    "uppercase_text": "{{ $input.generated_text.toUpperCase() }}",
    "lowercase_text": "{{ $input.generated_text.toLowerCase() }}",
    "word_count": "{{ $input.generated_text.split(' ').length }}",
    "char_count": "{{ $input.generated_text.length }}",
    "has_content": "{{ $input.generated_text.length > 0 }}"
  }
}
```

### Manipulación de Texto
```json
{
  "values": {
    "capitalized": "{{ $input.generated_text.charAt(0).toUpperCase() + $input.generated_text.slice(1) }}",
    "title_case": "{{ $input.generated_text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') }}",
    "slug": "{{ $input.generated_text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-').trim() }}",
    "reversed": "{{ $input.generated_text.split('').reverse().join('') }}"
  }
}
```

### Fechas y Tiempo
```json
{
  "values": {
    "timestamp": "{{ $now.toISOString() }}",
    "formatted_date": "{{ $now.toLocaleDateString('es-ES') }}",
    "formatted_time": "{{ $now.toLocaleTimeString('es-ES') }}",
    "unix_timestamp": "{{ $timestamp }}",
    "random_date": "{{ new Date($timestamp + Math.random() * 86400000) }}"
  }
}
```

### Lógica Condicional
```json
{
  "values": {
    "status": "{{ $input.score > 80 ? 'Excellent' : 'Good' }}",
    "category": "{{ $input.type === 'urgent' ? 'High Priority' : 'Normal' }}",
    "message": "{{ $input.generated_text ? `Processed: ${$input.generated_text}` : 'No text to process' }}"
  }
}
```

### Manipulación de Arrays
```json
{
  "values": {
    "words": "{{ $input.generated_text.split(' ') }}",
    "long_words": "{{ $input.generated_text.split(' ').filter(word => word.length > 5) }}",
    "longest_word": "{{ $input.generated_text.split(' ').reduce((longest, current) => current.length > longest.length ? current : longest, '') }}",
    "unique_words": "{{ [...new Set($input.generated_text.split(' '))] }}"
  }
}
```

### Expresiones Complejas
```json
{
  "values": {
    "summary": "{{ `Texto: ${$input.generated_text}\nPalabras: ${$input.generated_text.split(' ').length}\nCaracteres: ${$input.generated_text.length}\nTimestamp: ${$now.toISOString()}` }}",
    "analysis": "{{ {text: $input.generated_text, wordCount: $input.generated_text.split(' ').length, charCount: $input.generated_text.length, timestamp: $now.toISOString()} }}"
  }
}
```

## Configuración Completa de Ejemplo

```json
{
  "id": "set_values",
  "type": "set",
  "name": "Set Values (n8n style)",
  "config": {
    "values": {
      "timestamp": "{{ $now.toISOString() }}",
      "pipeline_name": "Set Node Example",
      "uppercase_text": "{{ $input.generated_text.toUpperCase() }}",
      "slug_text": "{{ $input.generated_text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-').trim() }}",
      "formatted_text": "{{ $input.generated_text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') }}",
      "word_count": "{{ $input.generated_text.split(' ').length }}",
      "char_count": "{{ $input.generated_text.length }}",
      "original_text": "{{ $input.generated_text }}",
      "summary": "{{ `Texto: ${$input.generated_text}\nPalabras: ${$input.generated_text.split(' ').length}\nCaracteres: ${$input.generated_text.length}\nSlug: ${$input.generated_text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-').trim()}` }}"
    }
  }
}
```

## Mejores Prácticas

1. **Usa expresiones simples** para valores directos
2. **Valida siempre** que las propiedades existan antes de usarlas
3. **Escapa correctamente** las expresiones regulares en JSON
4. **Usa nombres descriptivos** para las claves
5. **Maneja errores** en las expresiones complejas
6. **Usa template literals** para strings complejos

## Casos de Uso Comunes

- **Limpieza de datos**: Normalizar texto, eliminar caracteres especiales
- **Análisis de contenido**: Contar palabras, caracteres, detectar patrones
- **Formateo de mensajes**: Crear mensajes estructurados para publicación
- **Transformación de datos**: Convertir formatos, agregar metadatos
- **Validación**: Verificar condiciones y establecer flags
- **Manipulación de fechas**: Formatear fechas, calcular diferencias
- **Generación de IDs**: Crear slugs, hashes, identificadores únicos

## Diferencias con n8n

Este nodo replica el comportamiento básico de n8n, pero con algunas diferencias:

- **Contexto simplificado**: Solo incluye las variables más comunes
- **Sin workflow context**: No incluye `$workflow`, `$node`, `$position`
- **Sin items handling**: No maneja arrays de items como n8n
- **Sin mode detection**: No incluye `$mode`

## Compatibilidad

El nodo es compatible con la sintaxis de n8n para expresiones básicas, pero no incluye todas las características avanzadas de n8n como el manejo de items múltiples o el contexto de workflow. 