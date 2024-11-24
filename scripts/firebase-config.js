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

// Configure Firestore settings for better offline support and multi-tab sync
db.enablePersistence({
  synchronizeTabs: true
}).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code == 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});

// Configure Auth persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.email);
  } else {
    console.log('User is signed out');
  }
});

// Export the Firebase services
window.db = db;
window.auth = auth;
window.app = app;
