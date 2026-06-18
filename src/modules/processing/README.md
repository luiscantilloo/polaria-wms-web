# Módulo: processing

Procesamiento y preparación de pedidos (fulfillment).

## Responsabilidades

- Generación de tareas de picking (recolección)
- Packing (empaque) y verificación de pedidos
- Asignación de tareas a operadores de almacén
- Optimización de rutas de picking dentro del almacén

## Funcionalidades previstas

- Cola de pedidos pendientes de preparar
- Lista de picking por ubicación (ordenada para eficiencia)
- Confirmar cantidades recolectadas por línea
- Empacar y generar etiqueta de envío
- Manejo de discrepancias (faltantes, productos dañados)

## Entidades relacionadas

- TareaPicking, OlaPicking, LíneaPicking, Paquete

## Relación con otros módulos

- Recibe OV confirmadas de `sales/`
- Descuenta stock vía `inventory/`
- Entrega paquetes listos a `transport/`
