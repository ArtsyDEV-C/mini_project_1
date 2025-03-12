const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const saveCityForm = document.querySelector('#save-city-form');

// Register user
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Registration successful');
            } else {
                alert('Error registering user');
            }
        } catch (error) {
            alert('Error registering user');
        }
    });
}

// Login user
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Login successful');
            } else {
                alert('Error logging in user');
            }
        } catch (error) {
            alert('Error logging in user');
        }
    });
}

// Save city
if (saveCityForm) {
    saveCityForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(saveCityForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('City saved successfully');
            } else {
                alert('Error saving city');
            }
        } catch (error) {
            alert('Error saving city');
        }
    });
}

// Example function to trigger alert
const triggerAlert = async (type, to, message) => {
    await fetch('/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, to, message })
    });
};

// Function to save user preferences
const savePreferences = async (preferences) => {
    const response = await fetch('/api/save-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'USER_ID', preferences })
    });
    if (response.ok) {
        alert('Preferences saved');
    } else {
        alert('Error saving preferences');
    }
};

// Function to fetch user preferences
const fetchPreferences = async () => {
    const response = await fetch('/api/preferences/USER_ID');
    const preferences = await response.json();
    // Update UI with preferences
};