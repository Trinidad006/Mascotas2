# 🐾 Frontend - Mascotas Virtuales

Interfaz gráfica para el juego de mascotas virtuales construida con React.

## 🚀 Características

- **Interfaz moderna y responsiva** con gradientes y animaciones
- **Sistema de autenticación** con JWT
- **Dashboard interactivo** para gestionar mascotas
- **Barras de vida visuales** para cada atributo de la mascota
- **Botones de acción** para interactuar con las mascotas
- **Sistema de notificaciones** para advertencias y errores

## 🎮 Funcionalidades

### Autenticación
- Login/Registro de usuarios
- Credenciales de administrador incluidas
- Protección de rutas

### Gestión de Mascotas
- Crear nuevas mascotas con personalidades
- Ver barras de vida en tiempo real
- Interactuar con acciones: dormir, jugar, alimentar, bañar, acariciar, curar
- Eliminar mascotas

### Interfaz Visual
- Barras de progreso coloridas para cada atributo
- Indicadores de estado (viva/muerta)
- Emojis según el tipo de mascota
- Animaciones y efectos visuales

## 🛠️ Instalación y Uso

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 3. Abrir en el navegador
```
http://localhost:5173
```

## 🔧 Configuración

### Variables de entorno
Crear archivo `.env` en la carpeta `frontend`:
```
VITE_API_URL=http://localhost:3000
```

### Conectar con el backend
Asegúrate de que tu backend esté corriendo en `http://localhost:3000` antes de usar el frontend.

## 🎯 Cómo usar

1. **Iniciar sesión** con las credenciales:
   - Usuario: `Admin`
   - Contraseña: `admin123`

2. **Crear una mascota**:
   - Haz clic en "➕ Nueva Mascota"
   - Completa el formulario con nombre, tipo, poder y personalidad
   - Haz clic en "Crear Mascota"

3. **Interactuar con tu mascota**:
   - Usa los botones de acción para cuidar de tu mascota
   - Observa cómo cambian las barras de vida
   - Ten cuidado con las advertencias de sobrealimentación

4. **Monitorear el estado**:
   - Las barras de vida muestran el estado actual
   - El indicador verde/rojo muestra si está viva o muerta
   - Los botones se deshabilitan cuando no se puede realizar la acción

## 🎨 Características de la UI

- **Diseño responsivo** que se adapta a diferentes pantallas
- **Gradientes y animaciones** para una experiencia visual atractiva
- **Colores intuitivos** en las barras de vida (verde=bueno, amarillo=regular, rojo=crítico)
- **Feedback visual** en botones y acciones
- **Notificaciones** para errores y advertencias

## 🚀 Deploy

Para hacer deploy del frontend:

1. **Build para producción**:
```bash
npm run build
```

2. **Deploy en Vercel/Netlify**:
   - Sube la carpeta `dist` generada
   - Configura la variable de entorno `VITE_API_URL` con la URL de tu backend

## 🔗 Integración con Backend

El frontend se conecta automáticamente con tu API de mascotas en:
- `http://localhost:3000` (desarrollo)
- URL de producción (configurable en `.env`)

¡Disfruta cuidando de tus mascotas virtuales! 🐾 