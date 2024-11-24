document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');
    const mainSignOutButton = document.getElementById('signOutButton');

    // Initialize Google provider
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // Google Sign In
    async function signInWithGoogle() {
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            if (result.user) {
                const userData = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                };
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.replace('index.html');
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            alert("Error signing in: " + error.message);
        }
    }

    // Sign Out
    async function handleSignOut() {
        try {
            // First, clear local storage
            localStorage.clear();
            
            // Then sign out from Firebase
            await firebase.auth().signOut();
            
            // Force a clean redirect to index.html
            console.log('Signing out, redirecting to index.html');
            setTimeout(() => {
                window.location.replace('/index.html');
            }, 100);
        } catch (error) {
            console.error('Sign out error:', error);
            // Force redirect even if there's an error
            window.location.replace('/index.html');
        }
    }

    // Event Listeners
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', signInWithGoogle);
    }

    // Handle both sign out buttons
    if (signOutButton) {
        signOutButton.addEventListener('click', handleSignOut);
    }
    if (mainSignOutButton) {
        mainSignOutButton.addEventListener('click', handleSignOut);
    }

    // Auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (userDetailsDiv) {
                userDetailsDiv.style.display = 'block';
                if (userPhotoImg) userPhotoImg.src = user.photoURL || '';
                if (userNameP) userNameP.textContent = user.displayName || '';
                if (userEmailP) userEmailP.textContent = user.email || '';
            }
        } else {
            // User is signed out
            if (userDetailsDiv) {
                userDetailsDiv.style.display = 'none';
            }
            // If we're not on the index page, redirect
            if (!window.location.pathname.includes('index.html')) {
                window.location.replace('/index.html');
            }
        }
    });
});
