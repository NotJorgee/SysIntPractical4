import { loginUserDB } from './api.js';

// If the user is already logged in, send them straight to the app
if (localStorage.getItem('food_user_id')) {
    window.location.href = 'app.html';
}

document.getElementById('loginBtn').addEventListener('click', async () => {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
    
    // Disable button to prevent double clicks
    const btn = document.getElementById('loginBtn');
    btn.innerText = 'Logging in...';
    btn.disabled = true;

    try {
        const result = await loginUserDB(userVal, passVal);
        
        if (result.success) {
            // Save the ID and redirect to the main app
            localStorage.setItem('food_user_id', result.user_id);
            window.location.href = 'app.html';
        } else {
            // Show error and reset button
            document.getElementById('loginError').innerText = 'Invalid username or password.';
            document.getElementById('loginError').classList.remove('hidden');
            btn.innerText = 'Login';
            btn.disabled = false;
        }
    } catch (error) {
        // CATCH CRASHES: Server error, wrong path, or network failure
        console.error("Login Error:", error);
        document.getElementById('loginError').innerText = 'Server error. Check console (F12) for details.';
        document.getElementById('loginError').classList.remove('hidden');
        
        // Unfreeze the button!
        btn.innerText = 'Login';
        btn.disabled = false;
    }
});