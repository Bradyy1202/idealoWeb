# ADR 0001 — Categorías jerárquicas frente a atributos de filtrado

- **Estado:** aceptada
- **Fecha:** 2026-08-04

## Contexto

El requerimiento inicial planteaba organizar el catálogo mediante categorías y subcategorías. El ejemplo dado fue: la categoría _Botellas_ con subcategorías _aluminio, acero inoxidable, térmicas, deportivas, infantiles_.

Al analizar esa lista aparece un problema de modelado: los cinco valores no pertenecen a la misma dimensión.

- _Aluminio_ y _acero inoxidable_ describen el **material**
- _Térmica_ y _deportiva_ describen la **función**
- _Infantil_ describe el **público objetivo**

Un mismo producto puede pertenecer a varias de esas dimensiones a la vez: una botella deportiva de acero inoxidable con aislamiento térmico es simultáneamente las tres cosas.

## Problema

Modelar esos valores como subcategorías obliga a elegir entre tres opciones, todas malas:

1. **Ubicar el producto en una sola rama** — el cliente que filtra por _acero inoxidable_ no encuentra la botella que está clasificada como _deportiva_.
2. **Duplicar el producto en varias ramas** — el mismo artículo aparece varias veces en los resultados y cada edición debe replicarse manualmente.
3. **Crear categorías compuestas** (_Botellas deportivas de acero infantiles_) — la explosión combinatoria hace inmanejable el árbol.

Además, las subcategorías rígidas no permiten filtrado múltiple: un usuario no puede pedir "térmica **y** de 750 ml **y** azul".

## Decisión

Se adopta un modelo híbrido:

**Categorías** — árbol de máximo dos niveles que responde a _qué es el producto_. Corresponde a la navegación principal y a la estructura de URLs. Ejemplos: Botellas, Tazas, Textiles → Camisetas.

**Atributos** — características transversales que responden a _cómo es el producto_. Se modelan como pares `Attribute` / `AttributeValue` asociados a los productos mediante una tabla puente `ProductAttributeValue`. Ejemplos: Material, Capacidad, Uso, Color, Talla.

**CategoryAttribute** — tabla que define qué atributos se muestran como filtro en cada categoría, evitando ofrecer "capacidad en mililitros" al navegar camisetas.

## Consecuencias

**Positivas**

- Un producto se registra una sola vez y aparece en todos los filtros que le corresponden
- El filtrado multifaceta funciona de forma natural (material + capacidad + color)
- La administradora puede agregar nuevas características desde el panel sin migraciones ni despliegues
- El árbol de categorías se mantiene corto y comprensible
- Es el modelo que usan las plataformas de comercio electrónico reales, lo que facilita la migración futura

**Negativas**

- Mayor complejidad inicial: cinco tablas en lugar de una
- Las consultas de filtrado requieren agrupaciones sobre la tabla puente, no un simple `WHERE categoryId = ?`
- La carga inicial de datos exige definir atributos antes que productos

**Mitigación**

El coste de complejidad se paga una vez, en la fase de fundaciones. El coste de la alternativa se paga en cada producto nuevo y en cada filtro que el negocio quiera agregar. Los índices sobre `ProductAttributeValue` mantienen el rendimiento del filtrado en el rango de catálogos previsto (cientos de productos).

## Alternativas descartadas

- **Etiquetas libres (tags)** — simple de implementar, pero sin dimensiones tipadas no se puede construir una interfaz de filtros agrupada ni validar coherencia (nada impide etiquetar una taza como "talla XL").
- **Columnas fijas en `Product`** (`material`, `capacidad`, `color`) — obliga a una migración de base de datos cada vez que aparece una característica nueva, exactamente lo que el requerimiento de autogestión pretende evitar.
