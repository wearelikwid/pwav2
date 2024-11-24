// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user && window.location.pathname.endsWith('auth.html')) {
        window.location.href = 'index.html';
        return;
    }

    // UI Elements
    const googleButton = document.getElementById('googleSignIn');
    const signOutButton = document.getElementById('signOut');
    const userDetails = document.getElementById('userDetails');
    const userPhoto = document.getElementById('userPhoto');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    // Google Sign In
    googleButton.addEventListener('click', async function() {
        console.log('Google button clicked');
        
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            
            // Store user data
            const userData = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL
            };
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Redirect to home
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error.message);
        }
    });

    // Sign Out Handler
    signOutButton?.addEventListener('click', async function() {
        try {
            await auth.signOut();
            localStorage.removeItem('user');
            window.location.href = 'auth.html';
        } catch (error) {
            console.error('Sign out error:', error);
            alert('Sign out failed: ' + error.message);
        }
    });

    // Auth State Observer
    auth.onAuthStateChanged(function(user) {
        if (user) {
            if (googleButton) googleButton.style.display = 'none';
            if (userDetails) userDetails.style.display = 'block';
            if (userPhoto) userPhoto.src = user.photoURL || '';
            if (userName) userName.textContent = user.displayName;
            if (userEmail) userEmail.textContent = user.email;
        } else {
            if (googleButton) googleButton.style.display = 'block';
            if (userDetails) userDetails.style.display = 'none';
        }
    });
});
