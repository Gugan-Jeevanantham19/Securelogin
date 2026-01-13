// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Application Initializing...');
    
    // Add clear functionality to input fields
    setupClearButtons();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize password strength
    if (passwordInput) {
        updatePasswordStrength();
    }
    
    // Check for remembered user
    checkRememberMe();
    
    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    }
    
    console.log('✅ Application Initialized Successfully');
});

// Setup Clear Buttons for Input Fields
function setupClearButtons() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        // Add clear button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.type = 'button';
        clearBtn.style.display = 'none';
        clearBtn.setAttribute('aria-label', 'Clear input');
        
        // Insert clear button after input
        input.parentNode.insertBefore(clearBtn, input.nextSibling);
        
        // Show/hide clear button based on input value
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
        });
        
        // Clear input when clear button is clicked
        clearBtn.addEventListener('click', function() {
            input.value = '';
            input.focus();
            clearBtn.style.display = 'none';
            
            // Trigger input event for password strength
            if (input.id === 'password') {
                updatePasswordStrength();
            }
        });
        
        // Hide clear button on blur if input is empty
        input.addEventListener('blur', function() {
            setTimeout(() => {
                if (this.value.length === 0) {
                    clearBtn.style.display = 'none';
                }
            }, 100);
        });
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
    
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Password Strength Calculation
function updatePasswordStrength() {
    if (!passwordInput) return;
    
    const password = passwordInput.value;
    let strength = 0;
    let text = 'Password strength';
    let color = '#f72585';
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    const strengthElement = document.getElementById('passwordStrength');
    const textElement = document.getElementById('strengthText');
    
    if (!strengthElement || !textElement) return;
    
    if (strength === 0) {
        text = 'Very Weak';
        color = '#f72585';
    } else if (strength <= 50) {
        text = 'Weak';
        color = '#f8961e';
    } else if (strength <= 75) {
        text = 'Good';
        color = '#4cc9f0';
    } else {
        text = 'Strong';
        color = '#4ade80';
    }
    
    strengthElement.style.width = `${strength}%`;
    strengthElement.style.backgroundColor = color;
    textElement.textContent = text;
    textElement.style.color = color;
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
    
    // Add animation
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        icon.style.transform = 'scale(1)';
    }, 200);
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    
    if (!notification) return;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Registration Function
function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const agreeTerms = document.getElementById("agreeTerms");
    const regError = document.getElementById("regError");
    
    // Reset error
    regError.textContent = '';
    regError.style.display = 'none';
    
    // Validation
    if (!name || !email || !password || !confirm) {
        showFieldError("All fields are required", "regError");
        return;
    }
    
    if (password !== confirm) {
        showFieldError("Passwords do not match", "regError");
        return;
    }
    
    if (password.length < 8) {
        showFieldError("Password must be at least 8 characters", "regError");
        return;
    }
    
    if (!agreeTerms || !agreeTerms.checked) {
        showFieldError("Please agree to the terms and conditions", "regError");
        return;
    }
    
    // Check if user already exists
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
            showFieldError("Email already registered", "regError");
            return;
        }
    }
    
    // Create user object
    const user = { 
        name, 
        email, 
        password,
        registeredAt: new Date().toISOString(),
        lastLogin: null
    };
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    // Show success message
    showNotification("Registration successful! Redirecting to login...", "success");
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}

// Login Function
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe");
    const loginError = document.getElementById("loginError");
    
    // Reset error
    loginError.textContent = '';
    loginError.style.display = 'none';
    
    // Basic validation
    if (!email || !password) {
        showFieldError("Please enter email and password", "loginError");
        return;
    }
    
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    
    if (!userData) {
        showFieldError("No account found with this email", "loginError");
        return;
    }
    
    const user = JSON.parse(userData);
    
    if (user.email !== email || user.password !== password) {
        showFieldError("Invalid email or password", "loginError");
        return;
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem("user", JSON.stringify(user));
    
    // Save session
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("username", user.name);
    sessionStorage.setItem("userEmail", user.email);
    
    // Remember me functionality
    if (rememberMe && rememberMe.checked) {
        localStorage.setItem("rememberedUser", email);
    } else {
        localStorage.removeItem("rememberedUser");
    }
    
    // Show success message
    showNotification("Login successful! Redirecting to dashboard...", "success");
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
}

// Check if user is remembered
function checkRememberMe() {
    const rememberedUser = localStorage.getItem("rememberedUser");
    const loginEmail = document.getElementById("loginEmail");
    const rememberMe = document.getElementById("rememberMe");
    
    if (rememberedUser && loginEmail && rememberMe) {
        loginEmail.value = rememberedUser;
        rememberMe.checked = true;
        
        // Show clear button if there's a value
        const clearBtn = loginEmail.parentElement.querySelector('.clear-btn');
        if (clearBtn && loginEmail.value.length > 0) {
            clearBtn.style.display = 'block';
        }
    }
}

// Show field error
function showFieldError(message, elementId = 'regError') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add shake animation
        errorElement.classList.add('error-shake');
        setTimeout(() => errorElement.classList.remove('error-shake'), 500);
    }
}

// Dashboard Functions
function checkLogin() {
    if (sessionStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

// Logout Function
function logout() {
    // Clear session
    sessionStorage.clear();
    
    // Show notification
    showNotification("Logged out successfully", "success");
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

// Initialize dashboard
function initDashboard() {
    if (!checkLogin()) return;
    
    // Set user info
    const username = sessionStorage.getItem("username");
    const userEmail = sessionStorage.getItem("userEmail");
    
    // Update greeting
    const hour = new Date().getHours();
    let greeting = "Good ";
    
    if (hour < 12) greeting += "Morning";
    else if (hour < 18) greeting += "Afternoon";
    else greeting += "Evening";
    
    const greetingElement = document.getElementById('greetingText');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const usernameElement = document.getElementById('username');
    const userAvatar = document.getElementById('userAvatar');
    const userAvatarSm = document.getElementById('userAvatarSm');
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (greetingElement) greetingElement.textContent = greeting;
    if (welcomeUsername) welcomeUsername.textContent = `${username}!`;
    if (usernameElement) usernameElement.textContent = username;
    if (userNameElement) userNameElement.textContent = username;
    if (userEmailElement) userEmailElement.textContent = userEmail;
    
    // Set avatar initials
    if (userAvatar) {
        const initials = username.split(' ').map(n => n[0]).join('');
        userAvatar.textContent = initials.toUpperCase();
    }
    
    if (userAvatarSm) {
        const initials = username.split(' ').map(n => n[0]).join('');
        userAvatarSm.textContent = initials.toUpperCase();
    }
    
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Initialize animations
    initAnimations();
}

// Initialize animations
function initAnimations() {
    // Animate cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.card-animate');
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.85) {
                const delay = card.dataset.delay || 0;
                
                setTimeout(() => {
                    card.classList.add('animated');
                }, delay * 1000);
            }
        });
    };

    // Initial animation
    setTimeout(animateOnScroll, 500);

    // Animate on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Add CSS for error shake
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .error-shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    </style>
`);