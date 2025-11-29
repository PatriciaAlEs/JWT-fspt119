# 🧪 Generador de Nombres

🧠 Aplicación **full-stack** que genera nombres de forma dinámica  
✨ Frontend en **React**, backend en **Flask**  
🔌 Comunicación mediante **API REST**

Proyecto creado para practicar integración cliente-servidor, arquitectura escalable y buenas prácticas de desarrollo web.

---

## 🚀 Funcionalidades

- ✔ Generación de nombres desde el backend  
- ✔ Interfaz dinámica con React  
- ✔ Consumo de API propia  
- ✔ Separación clara: **UI (Frontend) + Lógica (Backend)**  

---

## 🛠️ Tecnologías utilizadas

| Área | Tecnologías |
|------|-------------|
| **Frontend** | React, JavaScript, HTML, CSS |
| **Backend** | Python, Flask |
| **Otros** | Fetch API, Pipenv (Docker opcional) |

---


## 📸 Vista previa

Pantalla principal de NameGen — interfaz para generar nombres personalizados:

<p align="center">
  <img src="./src/front/assets/img/Captura%20de%20pantalla%202025-11-29%20113001.png" width="85%" />
</p>

---

## ⚙️ Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/PatriciaAlEs/PatriciaAlEs-generador-nombres
cd PatriciaAlEs-generador-nombres


🔹 Backend (Flask)
cd src/server
pipenv install
pipenv run start


👉 Servidor en: http://localhost:3000

🔹 Frontend (React)
cd src/front
npm install
npm run start


👉 Aplicación en: http://localhost:3001

🧩 Ambos servicios deben estar activos para el correcto funcionamiento.

🏗️ Arquitectura
graph LR
A[React - Frontend] --> B[API REST]
B --> C[Flask - Backend]


📂 Estructura:

src/
 ├─ front/    → Interfaz y lógica del cliente
 └─ server/   → API y generador de nombres

🚧 Mejoras futuras / Roadmap

Temáticas variadas para la generación de nombres

Guardado de favoritos

Interfaz más visual

Deploy online (Netlify + Render)

👩‍💻 Autora

Patricia Álvarez Estevez
📎 LinkedIn: https://www.linkedin.com/in/patricia-alvarez-estevez/

🌍 Portfolio: (Work in progress)





![Status](https://img.shields.io/badge/status-in%20progress-yellow)
