document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements - auth page elements
    const googleSignInButton = document.getElementById('googleSignIn');
    const userDetailsDiv = document.getElementById('userDetails');
    const userPhotoImg = document.getElementById('userPhoto');
    const userNameP = document.getElementById('userName');
    const userEmailP = document.getElementById('userEmail');
    const signOutButton = document.getElementById('signOut');

    // Get DOM elements - landing page elements
    const authStatus = document.getElementById('authStatus');
    const userSignedInDiv = document.getElementById('userSignedIn');
    const userSignedOutDiv = document.getElementById('userSignedOut');
    const mainSignOutButton = document.getElementById('signOutButton');

    // Initialize Google provider
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // Check which page we're on
    const isAuthPage = window.location.pathname.includes('auth.html');
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    // Set initial display states for landing page
    if (isIndexPage) {
        if (userSignedInDiv) userSignedInDiv.style.display = 'none';
        if (userSignedOutDiv) userSignedOutDiv.style.display = 'block';
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
            window.location.replace('index.html');
        } catch (error) {
            console.error('Sign out error:', error);
            window.location.replace('index.html');
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
        console.log('Auth state changed:', user ? 'signed in' : 'signed out');
        
        if (user) {
            // User is signed in
            if (isAuthPage && userDetailsDiv) {
                userDetailsDiv.style.display = 'block';
                if (userPhotoImg) userPhotoImg.src = user.photoURL || '';
                if (userNameP) userNameP.textContent = user.displayName || '';
                if (userEmailP) userEmailP.textContent = user.email || '';
            }
            
            if (isIndexPage) {
                console.log('Updating landing page - user signed in');
                if (userSignedInDiv) {
                    userSignedInDiv.style.display = 'block';
                    const indexUserPhoto = userSignedInDiv.querySelector('#userPhoto');
                    const indexUserName = userSignedInDiv.querySelector('#userName');
                    if (indexUserPhoto) indexUserPhoto.src = user.photoURL || '';
                    if (indexUserName) indexUserName.textContent = user.displayName || '';
                }
                if (userSignedOutDiv) userSignedOutDiv.style.display = 'none';
            }
        } else {
            // User is signed out
            if (isAuthPage && userDetailsDiv) {
                userDetailsDiv.style.display = 'none';
            }
            
            if (isIndexPage) {
                console.log('Updating landing page - user signed out');
                if (userSignedInDiv) userSignedInDiv.style.display = 'none';
                if (userSignedOutDiv) userSignedOutDiv.style.display = 'block';
            }
        }
    });
});
