document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');

    // Initialize the FirebaseUI Widget using Firebase
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // Google Sign In
    async function signInWithGoogle() {
        try {
            // Set persistence to LOCAL - user will stay signed in after page refresh
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            
            // Sign in with redirect (recommended for mobile)
            await firebase.auth().signInWithRedirect(provider);
        } catch (error) {
            console.error("Error during sign in:", error);
            alert("Error signing in: " + error.message);
        }
    }

    // Handle redirect result
    firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.user) {
                // User successfully signed in
                const userData = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                };
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.href = 'index.html';
            }
        })
        .catch((error) => {
            console.error("Error getting redirect result:", error);
        });

    // Sign Out
    const handleSignOut = async () => {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('user');
            localStorage.removeItem('workoutProgress');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Event Listeners
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', signInWithGoogle);
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', handleSignOut);
    }

    // Auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (userDetailsDiv) {
                userDetailsDiv.style.display = 'block';
                if (userPhotoImg) userPhotoImg.src = user.photoURL;
                if (userNameP) userNameP.textContent = user.displayName;
                if (userEmailP) userEmailP.textContent = user.email;
            }

            // If on auth page, redirect to index
            if (window.location.pathname.endsWith('auth.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // User is signed out
            if (userDetailsDiv) {
                userDetailsDiv.style.display = 'none';
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
