# Módulo: audit

Registro de auditoría y trazabilidad.

## Responsabilidades

- Registrar quién hizo qué, cuándo y sobre qué entidad
- Historial inmutable de cambios (crear, editar, eliminar)
- Consulta de logs para cumplimiento y depuración
- Exportación de registros de auditoría

## Funcionalidades previstas

- Log automático en operaciones críticas (ajustes de stock, cambios de permisos)
- Filtros por usuario, módulo, acción y rango de fechas
- Vista de diff (antes/después) en cambios de datos
- Retención configurable de registros

## Entidades relacionadas

- RegistroAuditoría, Acción, EntidadAfectada

## Convención

- Los registros de auditoría son append-only (no se editan ni eliminan).
- Cada módulo emite eventos de auditoría; este módulo los almacena y consulta.
