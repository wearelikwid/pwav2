// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMIz6SiQDy5hXTeV7H7iDR2ZONL_zd384",
  authDomain: "el-forma-app.firebaseapp.com",
  projectId: "el-forma-app",
  storageBucket: "el-forma-app.firebasestorage.app",
  messagingSenderId: "925445449660",
  appId: "1:925445449660:web:05fd801700fb14dcbf6db9",
  measurementId: "G-SQEPQP61E5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();

// Configure Firestore for offline persistence
db.enablePersistence()
  .then(() => {
    // Offline persistence enabled successfully
    console.log("Offline persistence enabled");
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser doesn\'t support persistence');
    }
  });

// Configure Auth persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    // Auth persistence set successfully
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Export the Firebase services
window.db = db;
window.auth = auth;
window.app = app;
