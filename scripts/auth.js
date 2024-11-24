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
    googleSignInButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                // Store user data
                localStorage.setItem('user', JSON.stringify(result.user));
                // Redirect to main page
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error during sign in:', error);
            });
    });

    // Sign Out
    signOutButton.addEventListener('click', () => {
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('user');
                window.location.href = 'auth.html';
            })
            .catch((error) => {
                console.error('Error during sign out:', error);
            });
    });

    // Auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            googleSignInButton.style.display = 'none';
            userDetailsDiv.style.display = 'block';
            userPhotoImg.src = user.photoURL;
            userNameP.textContent = user.displayName;
            userEmailP.textContent = user.email;
        } else {
            // User is signed out
            googleSignInButton.style.display = 'block';
            userDetailsDiv.style.display = 'none';
        }
    });
});
