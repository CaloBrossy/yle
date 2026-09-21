# Para Vos — Experiencia Poética 3D

Una experiencia audiovisual e interactiva creada artesanalmente como un regalo digital único. Desarrollada en **React 18**, **Three.js** (`@react-three/fiber`), **Tailwind CSS** y geometría procedural matemática.

---

## 🌹 Cómo abrir y ejecutar el proyecto en VSCode

### 1. Requisitos previos
- **Node.js** (versión 18 o superior recomendada). Si no lo tienes, descárgalo de [nodejs.org](https://nodejs.org/).
- **VSCode** (Visual Studio Code).

---

### 2. Pasos para ejecutar

1. **Abrir la carpeta en VSCode**:
   - Abre VSCode.
   - Ve a `File` > `Open Folder...` (o `Archivo` > `Abrir carpeta...`).
   - Selecciona la carpeta descomprimida del proyecto.

2. **Abrir la terminal integrada**:
   - En el menú superior de VSCode, selecciona `Terminal` > `New Terminal` (o presiona `Ctrl + ~` / `Cmd + ~`).

3. **Instalar dependencias**:
   ```bash
   npm install
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Abrir en tu navegador**:
   - Haz clic en el enlace que aparece en la terminal o abre en tu navegador:
     ```text
     http://localhost:3000
     ```

---

## 🛠️ Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con recarga rápida.
- `npm run build`: Compila la aplicación para producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza localmente el build de producción.
- `npm run lint`: Ejecuta el verificador de tipos de TypeScript (`tsc --noEmit`).

---

## 🌸 Características técnicas

- **Geometría Procedural**: Pétalos generados mediante matemática paramétrica (malla continua con normales homogéneas, sin modelos 3D externos pesados).
- **Envoltorio de Floristería Artesanal**: Cono de papel Kraft multicapa con lazo de satén que reúne todos los tallos orgánicamente.
- **Audio Global Continuo**: Reproducción en bucle de la *Gymnopédie No. 1* de Erik Satie en formato de alta fidelidad (`/public/audio/gymnopedie.ogg`), persistente a lo largo de todas las transiciones y escenas.
- **Interacción y Poesía**: Cada flor del ramo es interactiva y revela su significado al hacer clic.
