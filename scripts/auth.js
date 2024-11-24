// Auth state observer
auth.onAuthStateChanged((user) => {
    const userDetails = document.getElementById('userDetails');
    const googleSignIn = document.getElementById('googleSignIn');
    
    if (user) {
        // User is signed in
        displayUserInfo(user);
        userDetails.style.display = 'block';
        googleSignIn.style.display = 'none';
        
        // Store user data in Firestore
        storeUserData(user);
    } else {
        // User is signed out
        userDetails.style.display = 'none';
        googleSignIn.style.display = 'block';
    }
});

// Google Sign In
document.getElementById('googleSignIn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch((error) => {
            console.error('Error during sign in:', error);
        });
});

// Sign Out
document.getElementById('signOut').addEventListener('click', () => {
    auth.signOut()
        .catch((error) => {
            console.error('Error during sign out:', error);
        });
});

// Display user information
function displayUserInfo(user) {
    document.getElementById('userPhoto').src = user.photoURL || 'icons/default-profile.png';
    document.getElementById('userName').textContent = user.displayName;
    document.getElementById('userEmail').textContent = user.email;
}

// Store user data in Firestore
function storeUserData(user) {
    db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }); // merge: true will only update the specified fields
}
