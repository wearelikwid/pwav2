document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements - auth page elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');

    // Get DOM elements - index page elements
    const mainSignOutButton = document.getElementById('signOutButton');
    const userSignedInDiv = document.getElementById('userSignedIn');
    const userSignedOutDiv = document.getElementById('userSignedOut');
    const indexUserPhoto = document.getElementById('userPhoto');
    const indexUserName = document.getElementById('userName');

    // Initialize Google provider
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // Check which page we're on
    const isAuthPage = window.location.pathname.includes('auth.html');
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    // Redirect to index if needed
    function redirectToIndex() {
        if (!isIndexPage) {
            window.location.replace('index.html');
        }
    }

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
                
                // Only redirect if we're on the auth page
                if (isAuthPage) {
                    window.location.replace('index.html');
                }
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            alert("Error signing in: " + error.message);
        }
    }

    // Sign Out
    async function handleSignOut() {
        try {
            localStorage.clear();
            await firebase.auth().signOut();
            redirectToIndex(); // Use the redirect function
        } catch (error) {
            console.error('Sign out error:', error);
            redirectToIndex(); // Redirect even if there's an error
        }
    }

    // Event Listeners
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', signInWithGoogle);
    }

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
            if (isAuthPage && userDetailsDiv) {
                // Auth page updates
                userDetailsDiv.style.display = 'block';
                if (userPhotoImg) userPhotoImg.src = user.photoURL || '';
                if (userNameP) userNameP.textContent = user.displayName || '';
                if (userEmailP) userEmailP.textContent = user.email || '';
            }
            
            if (isIndexPage) {
                // Index page updates
                if (userSignedInDiv) userSignedInDiv.style.display = 'block';
                if (userSignedOutDiv) userSignedOutDiv.style.display = 'none';
                if (indexUserPhoto) indexUserPhoto.src = user.photoURL || '';
                if (indexUserName) indexUserName.textContent = user.displayName || '';
            }
        } else {
            // User is signed out
            if (isAuthPage) {
                if (userDetailsDiv) userDetailsDiv.style.display = 'none';
                redirectToIndex(); // Always redirect to index when signed out on auth page
            }
            
            if (isIndexPage) {
                if (userSignedInDiv) userSignedInDiv.style.display = 'none';
                if (userSignedOutDiv) userSignedOutDiv.style.display = 'block';
            }
        }
    });
});
