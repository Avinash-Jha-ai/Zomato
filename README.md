# 🛍️ The DARK Store (MERN Stack)

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue.svg)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

A premium full-stack e-commerce platform built using the MERN stack, featuring a sophisticated storefront, a data-driven admin portal, and secure backend integration.

> [!NOTE]
> **Development Note:** The backend architecture and logic were custom-engineered from scratch, while the frontend user interface and components were developed with significant AI assistance to achieve a premium aesthetic.

---

## 🔗 Live Demos

- **Storefront:** [the-dark-store.vercel.app](https://the-dark-store.vercel.app/)
- **Admin Portal:** [the-dark-store-bgxj.vercel.app](https://the-dark-store-bgxj.vercel.app/)
- **GitHub Repository:** [Avinash-Jha-ai/The-DARK-Store](https://github.com/Avinash-Jha-ai/The-DARK-Store)

---

## 🚀 Features

- 🔐 **Secure Authentication** – JWT & Bcrypt integration for robust security.
- 📦 **Advanced Product Management** – Full CRUD operations for seamless inventory control.
- 🛒 **Real-time Cart System** – Persistent storage for a consistent user experience.
- 💳 **Seamless Razorpay Integration** – Secure and reliable payment processing.
- 👤 **User Profile** – Comprehensive dashboard with Wishlist & Order History.
- 📊 **Admin Dashboard** – Real-time sales analytics and data visualization with Recharts.
- 📸 **Optimized Media Handling** – High-performance image management via ImageKit.
- 🎨 **Responsive UI** – Modern, fluid interface powered by Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend (Storefront & Admin)
- **Framework:** React.js (Vite)
- **State Management:** Redux Toolkit
- **Animations:** Framer Motion
- **Styling:** Sass (Modular SCSS)
- **Icons:** Lucide React
- **Data Visualization:** Recharts

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API)

### Database
- **Engine:** MongoDB (Mongoose ODM)

### Other Tools
- **Media Storage:** ImageKit
- **Payments:** Razorpay
- **Auth:** JWT (JSON Web Tokens)
- **File Uploads:** Multer
- **Version Control:** Git & GitHub

---

## 📂 Project Structure

```text
THE DARK STORE/
│
├── backend/
│   ├── src/
│   │   ├── configs/        # Database & Service configs
│   │   ├── controllers/    # Business logic (Auth, Product, Order, Kart)
│   │   ├── middlewares/    # Auth & validation middleware
│   │   ├── models/         # MongoDB schemas (Mongoose)
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # External service integrations (Storage)
│   │   └── validator/      # Input validation logic
│   ├── app.js              # Express app setup
│   └── server.js           # Entry point
│
├── frontend/ (Storefront)
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Footer, Skeleton)
│   │   ├── features/       # Feature-based logic (Auth, Kart, Products)
│   │   ├── store/          # Redux Toolkit global store
│   │   ├── utils/          # Helper functions (Razorpay loader)
│   │   └── styles/         # Global SCSS
│   └── main.jsx            # Entry point
│
└── admin/ (Dashboard)
    ├── src/
    │   ├── components/     # Admin-specific UI (Sidebar)
    │   ├── features/       # Admin logic (Inventory, Dashboard, Orders)
    │   ├── store/          # Admin Redux store
    │   └── main.jsx        # Entry point
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Avinash-Jha-ai/The-DARK-Store.git
cd THE-DARK-Store
```

### 2. Install dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd ../frontend
npm install
```

**Admin Portal**
```bash
cd ../admin
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

### 4. Run the project

**Backend**
```bash
# From backend directory
npm run dev
```

**Frontend**
```bash
# From frontend directory
npm run dev
```

**Admin Portal**
```bash
# From admin directory
npm run dev
```

---

## 📚 What I Learned

- Designing a scalable multi-portal architecture (Storefront vs. Admin).
- Implementing secure payment gateways with server-side verification.
- Managing complex global states using Redux Toolkit across different user roles.
- Handling cloud-based media optimization with ImageKit.
- Orchestrating a full MERN stack deployment with multi-service interaction.

---

## 🔮 Future Improvements

- 💬 **Real-time customer support chat**
- 🔔 **Push notifications** for order status updates
- 🔍 **AI-driven product recommendations**
- ⚡ **Advanced SEO & Server Side Rendering (SSR)**

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📬 Contact

- **GitHub:** [Avinash-Jha-ai](https://github.com/Avinash-Jha-ai)
- **LinkedIn:** [Avinash Jha](https://www.linkedin.com/in/avinash-jha-0a261b385/)

---

### ⭐ If you like this project, don’t forget to give it a star!
