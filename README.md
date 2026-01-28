GymOS - Modern Gym Management SystemA production-ready, React-based application for managing gym operations. This system handles member subscriptions, tracks walk-in guests, generates revenue reports, and manages staff access—all powered by Firebase.🚀 FeaturesSmart Dashboard: Real-time overview of monthly revenue, active subscriptions, and daily guest walk-ins.Member Management:Add, edit, and delete members.Phone number as unique ID.Subscription Calendar: Visual tracking of expiry dates (Green = Safe, Yellow = Warning, Orange = Expired).Financial Tracking:Transactions Ledger: Automatically records all payments.Revenue Reports: Monthly and yearly breakdowns.Guest Log: Track walk-in fees separately.Role-Based Access:First-Time Admin Setup: Secure initialization flow.Staff Management: Create additional staff accounts internally without using the public registration form.Multi-Currency Support: Toggle between USD, EUR, GBP, INR, MYR, JPY instantly.🛠️ Tech StackFrontend: React.js (Vite)Styling: Tailwind CSSBackend: Firebase (Authentication & Firestore)Icons: Lucide React📦 PrerequisitesNode.js (v14+)npm or yarnA Firebase Project⚙️ Installation & SetupClone the repository git clone [https://github.com/yourusername/gym-os.git](https://github.com/yourusername/gym-os.git)
cd gym-os

Install Dependenciesnpm install
Configure Environment VariablesCreate a .env file in the root directory and add your Firebase credentials. You can find these in your Firebase Console under Project Settings.VITE_FIREBASE_API_KEY=your_api_key


VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
Run the Development Servernpm run dev


Open your browser to http://localhost:5173.🔥 Firebase ConfigurationTo make the app work, you must enable two services in your Firebase Console:Authentication:Go to Build > Authentication.Enable the Email/Password provider.Cloud Firestore:Go to Build > Firestore Database.Create a database.Rules: For development, you can start with test mode, but for production, ensure you set proper read/write rules.🚀 First-Time LaunchWhen you run the app for the first time, no accounts exist.On the Login Screen, enter the default credentials:Email: adminPassword: adminThe system will detect this is the first login and redirect you to the First Time Setup screen.Create your permanent Admin Email and Password.Note: Once setup is complete, the admin/admin login is permanently disabled.📂 Project Structuresrc/
├── config/         # Firebase initialization
├── components/     # Reusable UI (Buttons, Cards, Inputs)
├── views/          # Main application pages (Dashboard, Members, etc.)
├── utils/          # Helpers (Currency formatting, Date logic)
└── App.jsx         # Main entry point and routing logic
📝 LicenseThis project is open-source and available under the MIT License.