# 🎁 Plantilla de Creación: SORTEO

Usa este formato para preparar la información de un nuevo sorteo antes de subirlo a Supabase.

---

### 1. Información del Sorteo
*   **Tipo:** `sorteo` (No cambiar)
*   **Estado:** `activo` (Para mostrarlo en los sorteos actuales) o `proximo` (Para anunciarlo).
*   **Título:** Nombre del sorteo (Ej: *Sorteo Razer DeathAdder V3*)
*   **Slug:** Identificador para el formulario. Debe ser único y corto (Ej: `sorteo-raton-razer`).
*   **Fecha:** Día en que se anunciará al ganador (Ej: `Domingo de Stream`).

### 2. Estilo Visual y Textos
*   **Imagen:** Nombre del archivo subido a R2 (Opcional si se usa el diseño de tarjetas sencillas).
*   **Descripción Corta:** Lo que verán en la tarjeta principal (Ej: *¡Participa para ganar el mejor ratón gaming!*).
*   **Detalles:** Información adicional sobre las condiciones del sorteo.

### 3. Requisitos de Participación
*   **Normas:** Requisitos del sorteo (Ej: `Sub de Twitch`, `Seguir en Twitter`).
*   **Premios:** El regalo concreto (Ej: `Razer DeathAdder V3 Pro White`).

---

### 💡 Ejemplo de Registro en Supabase:
| Campo | Valor de ejemplo |
| :--- | :--- |
| **tipo** | `sorteo` |
| **estado** | `activo` |
| **titulo** | `Sorteo Auriculares Astro` |
| **slug** | `sorteo-astro-a50` |
| **fecha** | `Próximo Directo` |
| **imagen** | `astro_banner.png` |
| **normas** | `{"Sub Twitch", "Follow Tokkii", "Cuenta Vinculada"}` |
| **premios** | `Astro A50 Gen 4` |
