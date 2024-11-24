// Initialize Firebase Auth
const auth = firebase.auth();

// UI Elements
const googleButton = document.getElementById('googleSignIn');
const signOutButton = document.getElementById('signOut');
const userDetails = document.getElementById('userDetails');
const userPhoto = document.getElementById('userPhoto');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// Google Sign In
googleButton.addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(error => {
            console.error('Error signing in:', error);
            alert('Sign in failed. Please try again.');
        });
});

// Sign Out
signOutButton.addEventListener('click', function() {
    auth.signOut()
        .catch(error => {
            console.error('Error signing out:', error);
            alert('Sign out failed. Please try again.');
        });
});

// Auth State Observer
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        googleButton.style.display = 'none';
        userDetails.style.display = 'block';
        userPhoto.src = user.photoURL;
        userName.textContent = user.displayName;
        userEmail.textContent = user.email;
        
        // Redirect to index.html after small delay
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
