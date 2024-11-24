// Initialize Firebase Auth
const auth = firebase.auth();

// UI Elements
const googleButton = document.getElementById('googleSignIn');
console.log('Found Google button:', googleButton); // Debug log

// Google Sign In
googleButton.addEventListener('click', async function() {
    console.log('Google button clicked'); // Debug log
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        console.log('Created provider'); // Debug log
        
        // Enable persistence first
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        console.log('Set persistence'); // Debug log
        
        const result = await auth.signInWithPopup(provider);
        console.log('Sign in successful:', result.user.email); // Debug log
    } catch (error) {
        console.error('Detailed sign in error:', error); // More detailed error
        alert('Sign in failed: ' + error.message);
    }
});

// Sign Out
signOutButton.addEventListener('click', async function() {
    console.log('Sign out clicked'); // Debug log
    try {
        await auth.signOut();
        console.log('Sign out successful'); // Debug log
    } catch (error) {
        console.error('Sign out error:', error);
        alert('Sign out failed. Please try again.');
    }
});

// Auth State Observer
auth.onAuthStateChanged(function(user) {
    console.log('Auth state changed. User:', user ? 'logged in' : 'logged out'); // Debug log
    
    if (user) {
        // User is signed in
        googleButton.style.display = 'none';
        userDetails.style.display = 'block';
        userPhoto.src = user.photoURL;
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;

        console.log('Redirecting to index.html...'); // Debug log
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // User is signed out
        googleButton.style.display = 'block';
        userDetails.style.display = 'none';
        userPhoto.src = '';
        userName.textContent = '';
        userEmail.textContent = '';
    }
});
