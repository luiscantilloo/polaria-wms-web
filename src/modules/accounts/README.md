# Módulo: accounts

Cuentas contables y facturación.

## Responsabilidades

- Registro de cuentas por cobrar y por pagar
- Emisión de facturas y notas de crédito/débito
- Conciliación con órdenes de venta y compra
- Reportes financieros básicos

## Funcionalidades previstas

- Generar factura desde una OV confirmada
- Registrar pagos y aplicar a facturas pendientes
- Consultar estado de cuenta de clientes y proveedores
- Exportar movimientos contables

## Entidades relacionadas

- Factura, Pago, CuentaPorCobrar, CuentaPorPagar, Asiento

## Relación con otros módulos

- Factura ventas de `sales/`
- Registra obligaciones de `purchases/`
