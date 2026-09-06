# Plantillas de sitios web para negocios en Puerto Rico

Diez sitios web completos, cada uno diseñado para un tipo de negocio distinto que existe
en la isla. Están hechos para enseñárselos a un cliente potencial: abre la galería, deja que
escoja el que más se le parezca a su negocio, y ese se convierte en el punto de partida.

**Abre `index.html`** (la galería) para verlas todas. Cada tarjeta abre la plantilla en una
pestaña nueva.

---

## Las diez plantillas

| # | Negocio | Carpeta | Lo que la hace distinta |
|---|---------|---------|--------------------------|
| 01 | Barbería | `templates/01-barberia` | Indicador de "abierto ahora" calculado en vivo, lista de precios estilo carta, barra de reserva que aparece al hacer scroll |
| 02 | Salón de uñas | `templates/02-salon-unas` | Cotizador: la clienta arma su set (base + largo + extras) y ve precio y duración al instante |
| 03 | Club de nutrición | `templates/03-club-nutricion` | Menú de batidas con pestañas por categoría, horario del club, programa de reto de 21 días |
| 04 | Gimnasio | `templates/04-gym` | Calendario de clases por día con cupos, tabla de membresías con precio mensual/anual |
| 05 | Taller de wraps y vinilos | `templates/05-car-wrap` | Comparador antes/después que se arrastra, cotizador por tipo de vehículo y acabado |
| 06 | Ropa deportiva de mujer | `templates/06-activewear-mujer` | Tienda con filtros, cambio de color por producto, carrito lateral y barra de envío gratis |
| 07 | Ropa y calzado de hombre | `templates/07-menswear` | Estantes horizontales, vista rápida en modal con selección de talla y tallas agotadas |
| 08 | Cafetería y tostaduría | `templates/08-cafeteria` | Selector de tueste que cambia notas de sabor y barras de cuerpo, acidez y dulzor |
| 09 | Bodas y alquiler de eventos | `templates/09-eventos` | Galería con lightbox navegable, inventario de alquiler, estimado según invitados y paquete |
| 10 | Tours y excursiones | `templates/10-tours` | Buscador, tours filtrables, itinerario desplegable hora por hora, calculadora de reserva |

Los diez comparten lo básico: navegación fija con menú de hamburguesa en móvil, diseño
responsive real, secciones de contacto y horario, y llamadas a la acción hacia WhatsApp,
teléfono y ATH Móvil — que es como la gente aquí realmente contacta un negocio.

---

## Cómo están hechas

- **Un solo archivo por sitio.** Todo el HTML, CSS y JavaScript vive dentro de `index.html`.
  No hay build, ni `npm install`, ni dependencias. Doble clic y abre.
- **Sin librerías.** Nada de Bootstrap, Tailwind ni jQuery. Lo único externo son las
  tipografías de Google Fonts (si no hay internet, cae a las del sistema y se ve bien igual).
- **Sin imágenes.** Todas las "fotos" son degradados y formas hechas con CSS, marcadas con
  una etiqueta tipo `FOTO · ...` para que sepas exactamente qué reemplazar.
- **Contenido real.** Los textos están en el español que se habla en Puerto Rico, con
  municipios, precios y detalles creíbles. Un cliente lee la plantilla y se ve a sí mismo.

## Para adaptar una plantilla a un cliente

1. **Copia la carpeta** y renómbrala con el nombre del cliente.
2. **Colores:** están todos juntos en el bloque `:root { ... }` al principio del `<style>`.
   Cambias tres o cuatro variables y el sitio completo cambia de personalidad.
3. **Tipografías:** el `<link>` de Google Fonts está en el `<head>`, y las variables
   `--serif` / `--sans` (o equivalentes) controlan dónde se usan.
4. **Contenido:** nombre del negocio, teléfono, dirección, horario y precios. Busca
   `555‑` para encontrar todos los teléfonos de ejemplo.
5. **Fotos:** cada bloque de foto es un `div` con un `background` de degradado. Sustituye
   el degradado por `background:url('fotos/loquesea.jpg') center/cover;`.
6. **SEO:** actualiza `<title>` y `<meta name="description">` — ya están escritos con el
   formato correcto (negocio + servicio + pueblo).

## Lo que estas plantillas no incluyen

Son sitios de vitrina, no aplicaciones. Los formularios, carritos y calculadoras funcionan
visualmente pero no envían nada a ningún lado. Para un cliente real hay que conectar:

- **Formularios** → Formspree, Netlify Forms o un backend propio.
- **Reservaciones** → Calendly, Square Appointments, Booksy (barberías y salones lo usan mucho aquí).
- **Tienda** → Shopify, Stripe Checkout o WooCommerce si el cliente quiere WordPress.
- **Analítica** → Google Analytics o Plausible.
- **Hosting** → Netlify, Vercel o Cloudflare Pages. Al ser HTML puro, cualquiera de los tres
  las publica gratis arrastrando la carpeta.

## Ver las plantillas con un servidor local

No hace falta, pero si prefieres verlas servidas:

```bash
npx serve -p 5190 "/Users/angelsuarez/Coding Projects/pr-website-templates"
```

Ya existe una configuración `pr-templates` en `.claude/launch.json` que hace exactamente eso.

---

*Los negocios, nombres, teléfonos y direcciones son ficticios. Cualquier parecido con un
negocio real es coincidencia.*
