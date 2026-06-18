# src/modules/

Módulos de dominio del WMS. Cada carpeta representa un área funcional del negocio.

## Propósito

Organiza el código por dominio siguiendo una arquitectura modular. Cada módulo es autocontenido con su propia lógica, componentes, hooks y tipos.

## Estructura interna de un módulo

```
modules/<nombre>/
├── components/     # Componentes específicos del módulo
├── hooks/          # Hooks específicos del módulo
├── services/       # Lógica de acceso a datos del módulo
├── types/          # Tipos TypeScript del dominio
├── utils/          # Utilidades del módulo
└── index.ts        # API pública del módulo (barrel export)
```

## Módulos disponibles

| Módulo        | Área de negocio                                      |
|---------------|------------------------------------------------------|
| `auth/`       | Autenticación y sesiones                             |
| `users/`      | Gestión de usuarios y perfiles                       |
| `companies/`  | Empresas y organizaciones                            |
| `warehouses/` | Configuración de almacenes y ubicaciones             |
| `inventory/`  | Stock, productos y movimientos de inventario         |
| `purchases/`  | Órdenes de compra y recepción de mercancía           |
| `sales/`      | Órdenes de venta y despacho                          |
| `processing/` | Procesamiento y preparación de pedidos (picking)     |
| `transport/`  | Logística, envíos y transporte                       |
| `accounts/`   | Cuentas contables y facturación                      |
| `audit/`      | Registro de auditoría y trazabilidad                 |

## Convención

- Los módulos no importan entre sí directamente si pueden evitarlo; usa eventos o servicios compartidos.
- La UI genérica va en `src/components/`; la específica del dominio va aquí.
- Cada módulo expone solo lo necesario mediante `index.ts`.
