document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const userSignedIn = document.getElementById('userSignedIn');
    const userSignedOut = document.getElementById('userSignedOut');
    const userPhoto = document.getElementById('userPhoto');
    const userName = document.getElementById('userName');
    const signOutButton = document.getElementById('signOutButton');

    // Check authentication state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            userSignedIn.style.display = 'flex';
            userSignedOut.style.display = 'none';
            userPhoto.src = user.photoURL || 'icons/default-profile.png';
            userName.textContent = user.displayName;

            // Add sign out handler
            signOutButton.addEventListener('click', async () => {
                try {
                    await firebase.auth().signOut();
                    localStorage.removeItem('user');
                    window.location.href = 'auth.html';
                } catch (error) {
                    console.error('Sign out error:', error);
                }
            });
        } else {
            // User is signed out
            userSignedIn.style.display = 'none';
            userSignedOut.style.display = 'block';
        }
    });
});
