# Inglés Técnico - Proyecto EdTech Innovar UNTREF

Este proyecto es una aplicación web diseñada para la práctica de inglés técnico en Ingeniería en Computación. Puede ser embebida sin costuras en otras plataformas.

## Despliegue en GitHub Pages

Para subir este proyecto a GitHub y visualizarlo, sigue estos pasos:

1.  **Crear un repositorio** nuevo en GitHub (ej: `ingles-tecnico-untref`).
2.  **Inicializar Git** localmente en la carpeta del proyecto:
    ```bash
    git init
    git add .
    git commit -m "Initial commit: Rediseño para embebido y logos actualizados"
    ```
3.  **Vincular y Subir**:
    ```bash
    git remote add origin https://github.com/TU_USUARIO/ingles-tecnico-untref.git
    git branch -M main
    git push -u origin main
    ```
4.  **Habilitar Pages**:
    - Ve a `Settings` > `Pages` en tu repo de GitHub.
    - Selecciona la rama `main` y guarda.
    - ¡Tu sitio estará disponible en `https://TU_USUARIO.github.io/ingles-tecnico-untref/`!

## Cómo Embeberlo (iframe)

Copia este código en tu sitio web para integrar la actividad:

```html
<iframe 
    src="https://TU_USUARIO.github.io/ingles-tecnico-untref/" 
    style="width: 100%; height: 800px; border: none; overflow: hidden;"
    scrolling="no">
</iframe>
```
