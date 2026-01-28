
# GymOS – Modern Gym Management System

GymOS is a **production-ready, React-based gym management application** designed to handle day-to-day gym operations efficiently.  
It manages **member subscriptions, walk-in guests, revenue tracking, and staff access**, all powered by **Firebase**.

![Screenshot](https://i.postimg.cc/MpMzwQcZ/Screenshot-2026-01-29-012951.png "Screenshot 2026-01-29")

---

## 🚀 Features

### 📊 Smart Dashboard
- Real-time overview of:
  - Monthly revenue
  - Active subscriptions
  - Daily walk-in guests

### 👥 Member Management
- Add, edit, and delete members
- Phone number used as a **unique identifier**
- Subscription expiry calendar:
  - 🟢 Green – Active
  - 🟡 Yellow – Expiring soon
  - 🟠 Orange – Expired

### 💰 Financial Tracking
- **Transactions Ledger**: Automatically records all payments
- **Revenue Reports**: Monthly and yearly breakdowns
- **Guest Log**: Tracks walk-in fees separately

### 🔐 Role-Based Access Control
- **First-Time Admin Setup** with secure initialization flow
- **Staff Management**:
  - Create staff accounts internally
  - No public registration required

### 🌍 Multi-Currency Support
- Instantly toggle between:
  - USD, EUR, GBP, INR, MYR, JPY

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore
- **Icons**: Lucide React

---

## 📦 Prerequisites

- Node.js (v14+)
- npm or yarn
- A Firebase project

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/gym-os.git
cd gym-os
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add your Firebase credentials
(found in **Firebase Console → Project Settings**):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Open your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔥 Firebase Configuration

To run the app correctly, enable the following Firebase services:

### 🔐 Authentication

* Go to **Build → Authentication**
* Enable **Email/Password** provider

### 🗄️ Cloud Firestore

* Go to **Build → Firestore Database**
* Create a database
* For development, you may start in **test mode**
* For production, configure proper read/write security rules

---

## 🚀 First-Time Launch

When the app runs for the first time, **no accounts exist**.

### Default Login Credentials

* **Email**: `admin`
* **Password**: `admin`

On first login:

* The system detects a first-time setup
* You’ll be redirected to the **Admin Setup** screen
* Create your permanent admin email and password

⚠️ **Important**
After setup, the default `admin/admin` login is **permanently disabled**.

---

## 📂 Project Structure

```text
src/
├── config/        # Firebase initialization
├── components/    # Reusable UI components (Buttons, Cards, Inputs)
├── views/         # Main application pages (Dashboard, Members, etc.)
├── utils/         # Helpers (Currency formatting, Date logic)
└── App.jsx        # Main entry point and routing logic
```

---

## 📝 License

This project is **open-source** and available under the **MIT License**.



