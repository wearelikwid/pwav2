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
const db = firebase.firestore();
const auth = firebase.auth();
