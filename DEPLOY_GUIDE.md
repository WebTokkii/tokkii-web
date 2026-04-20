# Guía de Despliegue - Tokkii Web

Este proyecto utiliza **GitHub Pages** para el alojamiento, configurado para servir archivos desde la carpeta `/docs` en la rama `main`.

## Proceso de Envío a GitHub

Para asegurar que los cambios se reflejen en [tokkii.online](https://tokkii.online/), NO basta con hacer un `git push` del código fuente. Se debe compilar el proyecto primero.

### Método Automático (Recomendado)
Ejecuta el siguiente comando en la terminal:
```bash
npm run deploy
```
Este comando hará lo siguiente por ti:
1. Compilará el proyecto (`vite build`) y actualizará la carpeta `/docs`.
2. Añadirá todos los cambios (`git add .`).
3. Creará un commit con un mensaje descriptivo.
4. Enviará todo a GitHub (`git push origin main`).

### Método Manual
Si prefieres hacerlo paso a paso:
1. `npm run build`
2. `git add .`
3. `git commit -m "mensaje"`
4. `git push origin main`

---
**Nota para IAs:** Siempre que el usuario solicite "Enviar a GitHub" o "Desplegar cambios", prioriza el uso de `npm run deploy` para garantizar que la web pública se actualice.
