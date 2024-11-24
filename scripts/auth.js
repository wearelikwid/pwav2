// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userSignedInDiv = document.getElementById('userSignedIn');
    const userSignedOutDiv = document.getElementById('userSignedOut');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const signOutButton = document.getElementById('signOutButton');

    // Check if we're on the auth page
    const isAuthPage = window.location.pathname.endsWith('auth.html');
    
    // Google Sign In
    if (isAuthPage && googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Error during sign in:', error);
                });
        });
    }

    // Sign Out
    if (signOutButton) {
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
    }

    // Auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (userSignedInDiv) userSignedInDiv.style.display = 'flex';
            if (userSignedOutDiv) userSignedOutDiv.style.display = 'none';
            if (userPhotoImg) userPhotoImg.src = user.photoURL;
            if (userNameP) userNameP.textContent = user.displayName;

            // Redirect if on auth page
            if (isAuthPage) {
                window.location.href = 'index.html';
            }
        } else {
            // User is signed out
            if (userSignedInDiv) userSignedInDiv.style.display = 'none';
            if (userSignedOutDiv) userSignedOutDiv.style.display = 'flex';
            
            // Redirect to auth page if trying to access protected pages
            if (!isAuthPage && !window.location.pathname.endsWith('index.html')) {
                window.location.href = 'auth.html';
            }
        }
    });
});
