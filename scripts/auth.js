document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');

    // Check if we're on the auth page
    const isAuthPage = window.location.pathname.endsWith('auth.html');

    // Google Sign In
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                // Enable persistence
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                const result = await firebase.auth().signInWithPopup(provider);
                
                // Store user data
                const userData = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                };
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Sign in error:', error);
            }
        });
    }

    // Sign Out
    const handleSignOut = async () => {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('user');
            localStorage.removeItem('workoutProgress'); // Clear any user-specific data
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Attach sign out listener to any sign out button
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
            if (isAuthPage) {
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
