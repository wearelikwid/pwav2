// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');
    const signOutBtn = document.getElementById('signOutBtn');
    
    // Elements specific to index page
    const userSignedIn = document.getElementById('userSignedIn');
    const userSignedOut = document.getElementById('userSignedOut');
    const userNameDisplay = document.getElementById('userNameDisplay');

    // Check if we're on the auth page
    const isAuthPage = window.location.pathname.endsWith('auth.html');
    
    // Google Sign In
    if (googleSignInButton) {
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

    // Sign Out Function
    const handleSignOut = async () => {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('user');
            window.location.href = 'index.html';  // Changed from replace to href
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    // Attach sign out event listeners
    if (signOutButton) signOutButton.addEventListener('click', handleSignOut);
    if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);

    // Auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (userDetailsDiv) userDetailsDiv.style.display = 'block';
            if (userPhotoImg) userPhotoImg.src = user.photoURL;
            if (userNameP) userNameP.textContent = user.displayName;
            if (userEmailP) userEmailP.textContent = user.email;

            // Index page specific elements
            if (userSignedIn) {
                userSignedIn.style.display = 'flex';
                if (userNameDisplay) userNameDisplay.textContent = user.displayName;
            }
            if (userSignedOut) userSignedOut.style.display = 'none';

            // Only redirect if on auth page
            if (isAuthPage) {
                window.location.href = 'index.html';
            }
        } else {
            // User is signed out
            if (userDetailsDiv) userDetailsDiv.style.display = 'none';
            
            // Index page specific elements
            if (userSignedIn) userSignedIn.style.display = 'none';
            if (userSignedOut) userSignedOut.style.display = 'flex';
            
            // If on auth page and signed out, redirect to index
            if (isAuthPage) {
                window.location.href = 'index.html';
            }
            
            // Only redirect to auth for protected pages
            const protectedPages = ['workouts.html', 'create-workout.html', 'programs.html'];
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'auth.html';
            }
        }
    });
});
