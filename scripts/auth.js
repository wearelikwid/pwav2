// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const signOutButton = document.getElementById('signOut');

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
        signOutButton.addEventListener('click', async () => {
            try {
                await firebase.auth().signOut();
                localStorage.removeItem('user');
                // Force redirect to index.html after sign out
                window.location.replace('index.html');
            } catch (error) {
                console.error('Error during sign out:', error);
            }
        });
    }

    // Auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (userDetailsDiv) userDetailsDiv.style.display = 'block';
            if (userPhotoImg) userPhotoImg.src = user.photoURL;
            if (userNameP) userNameP.textContent = user.displayName;

            // Only redirect if on auth page
            if (isAuthPage) {
                window.location.href = 'index.html';
            }
        } else {
            // User is signed out
            if (userDetailsDiv) userDetailsDiv.style.display = 'none';
            
            // Don't redirect to auth page unless trying to access protected pages
            const protectedPages = ['workouts.html', 'create-workout.html', 'programs.html'];
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'auth.html';
            }
        }
    });
});
