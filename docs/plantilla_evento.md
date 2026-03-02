# 🎫 Plantilla de Creación: EVENTO

Usa este formato para preparar la información de un nuevo evento antes de subirlo a Supabase.

---

### 1. Información Básica
*   **Tipo:** `evento` (No cambiar)
*   **Estado:** `activo` (Si ya se puede participar) o `proximo` (Si es para anunciar próximamente).
*   **Título:** Nombre del evento (Ej: *Copa de Invierno Lolito*)
*   **Slug:** Identificador para la URL. Debe ser único, en minúsculas y sin espacios (Ej: `copa-invierno-lolito`).
*   **Fecha:** Fecha y hora del evento (Ej: `Sábado 15 de Marzo - 18:00 CET`).

### 2. Contenido Visual y Textual
*   **Imagen:** Nombre exacto del archivo subido a R2 (Ej: `CopaInvierno_Banner.png`).
*   **Descripción Corta:** Resumen de 1-2 frases para la tarjeta de la lista general.
*   **Detalles (Largo):** Explicación completa del evento para la página individual. Puedes usar saltos de línea.

### 3. Reglas y Premios
*   **Normas (Array):** Lista de reglas separadas (En Supabase se escriben entre llaves: `{"Regla 1", "Regla 2"}`).
*   **Premios:** Descripción del premio (Ej: `3.000 Monedas + Rol especial en Discord`).

---

### 💡 Ejemplo de Relleno para Supabase:
| Campo | Valor de ejemplo |
| :--- | :--- |
| **tipo** | `evento` |
| **estado** | `proximo` |
| **titulo** | `Torneo Mishi Volador` |
| **slug** | `torneo-mishi-volador` |
| **fecha** | `20 de Mayo` |
| **imagen** | `mishi_volador.jpg` |
| **normas** | `{"Ser Nivel 10", "No usar hacks", "Estar en Discord"}` |
| **premios** | `10 Euros en Steam` |
