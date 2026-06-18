# src/services/

Capa de servicios: comunicación con APIs externas y backend.

## Propósito

Centraliza toda la comunicación con servicios externos. Los componentes y módulos no hacen `fetch` directamente; usan estos servicios.

## Archivos previstos

| Archivo        | Descripción                                           |
|----------------|-------------------------------------------------------|
| `api.ts`       | Cliente HTTP base (fetch/axios) con interceptores     |
| `supabase.ts`  | Cliente de Supabase (auth, database, storage)         |

## Convención

- Los servicios devuelven datos tipados o lanzan errores estandarizados.
- Maneja autenticación (headers, tokens) en un solo lugar.
- Los servicios específicos de un módulo pueden vivir en `src/modules/<modulo>/services/`; los genéricos van aquí.

## Ejemplo de uso

```typescript
import { supabase } from '@/services/supabase';

const { data, error } = await supabase.from('products').select('*');
```
