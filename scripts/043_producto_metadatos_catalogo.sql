-- Ejecutar en Supabase → SQL Editor si el catálogo pide metadatos_catalogo.
-- También disponible en polaria-wms-db/migrations/043_producto_metadatos_catalogo.sql

ALTER TABLE producto
    ADD COLUMN IF NOT EXISTS metadatos_catalogo jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN producto.metadatos_catalogo IS
    'Metadatos extendidos del catálogo (título, slug, precio, SEO, etc.).';
