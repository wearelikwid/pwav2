// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user && window.location.pathname.endsWith('auth.html')) {
        window.location.href = 'index.html';
        return;
    }

    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');

    // Google Sign In
    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        try {
            console.log('Starting Google sign in process...');
            
            // Enable persistence
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            
            const result = await firebase.auth().signInWithPopup(provider);
            console.log('Sign in successful:', result.user.email);
            
            // Store user data in localStorage
            const userData = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User data stored:', userData);
            
            // Redirect to home page
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in error: ' + error.message);
        }
    }

    // Sign Out
    async function signOut() {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('user');
