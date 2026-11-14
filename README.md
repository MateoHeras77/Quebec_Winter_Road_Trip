# The Great Québec Loop ❄️

Planificador del viaje de Mateo y Daniela: Toronto → Kingston → Québec City → Montréal → Ottawa → Toronto, del 23 de diciembre de 2026 al 3 de enero de 2027.

Sitio estático con Vite y JavaScript, sin backend, cuentas, base de datos ni claves. Conserva el diseño y el contenido en inglés del HTML original. Incluye itinerario, enlaces por tramo a Google Maps, presupuesto para 1–4 viajeros, comparación de habitaciones, invitación para copiar, enlace para compartir e impresión/PDF.

## Desarrollo

Requiere Node.js 22 o posterior y npm.

```sh
npm ci
npm run dev
```

Si el entorno cloud no permite escribir en la caché predeterminada de npm:

```sh
npm ci --cache /tmp/quebec-npm-cache
```

```sh
npm test         # Pruebas del presupuesto y construcción de rutas
npm run build   # Genera dist/
npm run preview # Sirve la compilación para comprobarla
```

## Organización

```text
index.html          Secciones, itinerario, hoteles y contenido de la página
src/
  data/trip.js      Tarifas, supuestos, tramos y pendientes del alquiler
  data/car.js       Fotos, textos alternativos y títulos de la galería
  lib/budget.js     Cálculos reutilizables del presupuesto
  lib/motion.js     Nieve, entrada de secciones y preferencias de movimiento
  lib/gallery.js    Selector de fotos y ampliación accesible
  main.js           Controles, resultados, enlaces e invitación
  styles/           Diseño adaptable, galería, animaciones e impresión
public/images/      Fotos locales y foto del Tiguan
tests/              Pruebas con el runner nativo de Node.js
docs/planning.md    Supuestos, límites y puntos por confirmar
```

Para cambiar tarifas o rutas, edita `src/data/trip.js`. Para cambiar el programa de cada día, edita la sección `itinerary` de `index.html`. Los importes y ejemplos editoriales que aparecen en el HTML deben actualizarse también si cambian los supuestos; los resultados de la calculadora se generan a partir de los datos. Ejecuta las pruebas y la compilación antes de subir cambios.

## Desplegar en Vercel

1. En Vercel, selecciona **Add New → Project** e importa `MateoHeras77/Quebec_Winter_Road_Trip` desde GitHub.
2. Usa **Vite** como framework, raíz del repositorio como directorio, `npm run build` como comando y `dist` como salida. No se necesitan variables de entorno.
3. Pulsa **Deploy**. Comparte la URL HTTPS de producción usando el botón del sitio.

Vercel puede desplegar automáticamente cada cambio de la rama de producción y generar previews para otras ramas. No se ha creado un proyecto ni ejecutado un despliegue en Vercel desde este repositorio.

## Datos y fotografías

Todos los precios son estimaciones en CAD, no reservas. El sitio es público para quien tenga su enlace: no añadas confirmaciones, datos personales, tarjetas ni documentos del seguro.

Las fotografías de destinos se distribuyen con el proyecto y conservan los enlaces, autores y licencias indicados en el pie de página del documento original. Las fotos del Tiguan y los retratos proceden de imágenes aportadas por el usuario, con mejoras y recortes realizados con una herramienta de edición de imágenes; revisa el permiso de reutilización si se distribuye fuera de este plan del viaje. Consulta [los supuestos del viaje](docs/planning.md).

## Movimiento y galería

El botón **Pause motion** detiene la nieve, el balanceo de stickers y el trazado animado de la ruta. La preferencia se recuerda en el navegador, si permite almacenamiento local. El sitio respeta `prefers-reduced-motion`, detiene animaciones al cambiar de pestaña y muestra el contenido completo al imprimir. La galería del auto admite teclado; la vista ampliada se cierra con **Escape** o el botón **Close**. Las fotos WebP se sirven localmente.

## Uso en móvil

Hasta 800 px aparece una navegación inferior con accesos al itinerario, auto, presupuesto e invitación, respetando el área segura del teléfono. Hasta 600 px los escenarios de presupuesto se presentan como tarjetas y la portada y los destinos usan una distribución compacta. Las fotografías de destinos tienen variantes WebP de 480 y 960 px con selección automática según el tamaño de pantalla. Los controles principales tienen una altura mínima de 44 px. El diseño de impresión mantiene la tabla de comparación.
