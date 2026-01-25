$(document).ready(function() {
    // Global variables
    let currentUser = null;
    let userNotes = [];
    let editingNoteId = null;
    let resetEmail = '';
    
    // Initialize application
    initApp();
    
    function initApp() {
        // Create advanced weather background
        createWeatherBackground();
        
        // Hide loading screen after 1.5 seconds
        setTimeout(() => {
            $('#loadingScreen').fadeOut(500, function() {
                $('.container').fadeIn(500);
                checkLoginStatus();
                setupEventListeners();
            });
        }, 1500);
    }
    
    // Create advanced weather background
    function createWeatherBackground() {
        const container = $('#weatherBackground');
        
        // Create sun
        container.append('<div class="weather-sun"></div>');
        
        // Create clouds (different sizes)
        for (let i = 0; i < 12; i++) {
            const cloud = $('<div class="weather-cloud"></div>');
            const sizeClass = ['small', 'medium', 'large'][i % 3];
            cloud.addClass(sizeClass);
            
            // Random properties
            const top = Math.random() * 70 + 5;
            const delay = Math.random() * 30;
            const drift = (Math.random() * 80 - 40);
            const scale = Math.random() * 0.5 + 0.7;
            const opacity = Math.random() * 0.2 + 0.6;
            
            cloud.css({
                top: `${top}%`,
                animationDelay: `${delay}s`,
                '--cloud-drift': `${drift}px`,
                '--cloud-scale': scale,
                '--cloud-opacity': opacity,
                left: `-${200 + Math.random() * 200}px`,
                width: `${120 + Math.random() * 180}px`,
                height: `${40 + Math.random() * 60}px`
            });
            
            container.append(cloud);
        }
        
        // Create rain drops
        for (let i = 0; i < 100; i++) {
            const rain = $('<div class="weather-rain"></div>');
            
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = Math.random() * 0.6 + 0.8;
            const length = Math.random() * 25 + 25;
            
            rain.css({
                left: `${left}vw`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                height: `${length}px`,
                opacity: Math.random() * 0.4 + 0.1
            });
            
            container.append(rain);
        }
        
        // Create fog
        for (let i = 0; i < 4; i++) {
            const fog = $('<div class="weather-fog"></div>');
            fog.css({
                top: `${15 + i * 25}%`,
                animationDelay: `${i * 8}s`,
                height: `${80 + Math.random() * 70}px`
            });
            container.append(fog);
        }
        
        // Create waves
        for (let i = 0; i < 3; i++) {
            const wave = $('<div class="weather-wave"></div>');
            wave.css({
                bottom: `${i * 20}px`,
                animationDelay: `${i * 3}s`,
                opacity: 0.2 + i * 0.05,
                height: `${80 + i * 20}px`
            });
            container.append(wave);
        }
        
        // Create birds
        for (let i = 0; i < 6; i++) {
            const bird = $('<div class="weather-bird"><i class="fas fa-dove"></i></div>');
            bird.css({
                top: `${Math.random() * 50 + 10}%`,
                animationDelay: `${Math.random() * 20}s`,
                '--bird-y': `${Math.random() * 40 - 20}px`,
                fontSize: `${16 + Math.random() * 20}px`
            });
            container.append(bird);
        }
        
        // Create stars for night effect
        if (Math.random() > 0.7) { // 30% chance of night mode
            for (let i = 0; i < 50; i++) {
                const star = $('<div class="weather-star"></div>');
                star.css({
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`
                });
                container.append(star);
            }
        }
    }
    
    // Check if user is already logged in
    function checkLoginStatus() {
        const savedUser = localStorage.getItem('secureNotesUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user.rememberMe) {
                    showDashboard(user);
                    return;
                }
            } catch (e) {
                console.error('Error parsing saved user:', e);
            }
        }
        
        // Initialize demo data if first time
        initDemoData();
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Form toggle events
        $('#showRegister').click(showRegisterForm);
        $('#showLogin').click(showLoginForm);
        $('#forgotPasswordLink').click(showForgotForm);
        $('#backToLogin').click(showLoginForm);
        
        // Form submissions
        $('#loginForm').submit(handleLogin);
        $('#registerForm').submit(handleRegister);
        $('#forgotForm').submit(handleForgotPassword);
        $('#resetPasswordForm').submit(handleResetPassword);
        
        // Password strength check
        $('#newPassword').on('input', checkPasswordStrength);
        $('#registerPassword').on('input', checkRegisterPasswordStrength);
        
        // Dashboard events
        $('#logoutBtn').click(logout);
        $('#addNoteBtn').click(showAddNoteModal);
        
        // Note modal events
        $('.close-modal').click(hideNoteModal);
        $('.close-reset-modal').click(hideResetModal);
        $('#saveNoteBtn').click(saveNote);
        
        // Character counters
        $('#noteTitle').on('input', function() {
            const count = $(this).val().length;
            $('#titleCharCount').text(`${count}/100`);
        });
        
        $('#noteContent').on('input', function() {
            const count = $(this).val().length;
            $('#contentCharCount').text(`${count}/1000`);
        });
        
        // Search functionality
        $('#searchNotes').on('input', debounce(searchNotes, 300));
        
        // Close modal on outside click
        $(window).click(function(e) {
            if ($(e.target).hasClass('note-modal')) {
                hideNoteModal();
            }
            if ($(e.target).hasClass('reset-modal')) {
                hideResetModal();
            }
        });
        
        // Prevent form submission on Enter key
        $('form').on('keypress', function(e) {
            if (e.which === 13 && $(e.target).is('input')) {
                e.preventDefault();
            }
        });
    }
    
    // Initialize demo data
    function initDemoData() {
        if (!localStorage.getItem('secureNotesUsers')) {
            const demoUsers = [
                {
                    id: 1,
                    username: 'John Doe',
                    email: 'john@example.com',
                    mobile: '+1234567890',
                    password: 'password123',
                    rememberMe: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'Jane Smith',
                    email: 'jane@example.com',
                    mobile: '+0987654321',
                    password: 'password123',
                    rememberMe: false,
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('secureNotesUsers', JSON.stringify(demoUsers));
        }
        
        // Initialize notes storage if not exists
        if (!localStorage.getItem('secureNotes')) {
            localStorage.setItem('secureNotes', JSON.stringify([]));
        }
    }
    
    // Form switching functions
    function showLoginForm() {
        $('.form-container').removeClass('active');
        setTimeout(() => {
            $('.login-container').addClass('active');
            clearForm('#loginForm');
            enableFormControls('#loginForm');
        }, 10);
    }
    
    function showRegisterForm() {
        $('.form-container').removeClass('active');
        setTimeout(() => {
            $('.register-container').addClass('active');
            clearForm('#registerForm');
            enableFormControls('#registerForm');
        }, 10);
    }
    
    function showForgotForm() {
        $('.form-container').removeClass('active');
        setTimeout(() => {
            $('.forgot-container').addClass('active');
            clearForm('#forgotForm');
            enableFormControls('#forgotForm');
        }, 10);
    }
    
    function clearForm(formSelector) {
        $(formSelector)[0].reset();
        $(`${formSelector} .input-group input`).each(function() {
            $(this).removeClass('has-value');
            $(this).siblings('label').removeClass('active');
        });
    }
    
    function enableFormControls(formSelector) {
        $(`${formSelector} input`).prop('disabled', false);
        $(`${formSelector} button`).prop('disabled', false);
        $(`${formSelector} .submit-btn`).removeClass('btn-loading');
    }
    
    function disableFormControls(formSelector) {
        $(`${formSelector} input`).prop('disabled', true);
        $(`${formSelector} button`).prop('disabled', true);
        $(`${formSelector} .submit-btn`).addClass('btn-loading');
    }
    
    // Handle login
    function handleLogin(e) {
        e.preventDefault();
        
        const email = $('#loginEmail').val().trim();
        const password = $('#loginPassword').val();
        const rememberMe = $('#rememberMe').is(':checked');
        
        if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        disableFormControls('#loginForm');
        
        const users = JSON.parse(localStorage.getItem('secureNotesUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const userToSave = {
                ...user,
                rememberMe: rememberMe
            };
            localStorage.setItem('secureNotesUser', JSON.stringify(userToSave));
            
            showAlert('Login successful!', 'success');
            
            setTimeout(() => {
                enableFormControls('#loginForm');
                showDashboard(userToSave);
            }, 1000);
        } else {
            setTimeout(() => {
                enableFormControls('#loginForm');
                showAlert('Invalid email or password', 'error');
            }, 500);
        }
    }
    
    // Handle registration
    function handleRegister(e) {
        e.preventDefault();
        
        const username = $('#registerUsername').val().trim();
        const email = $('#registerEmail').val().trim();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#registerConfirmPassword').val();
        
        // Remove mobile field check
        if (!username || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        // Remove mobile validation
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            $('#registerPassword').val('');
            $('#registerConfirmPassword').val('');
            $('#registerPassword').focus();
            return;
        }
        
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'error');
            return;
        }
        
        disableFormControls('#registerForm');
        
        const users = JSON.parse(localStorage.getItem('secureNotesUsers') || '[]');
        
        if (users.find(u => u.email === email)) {
            setTimeout(() => {
                enableFormControls('#registerForm');
                showAlert('Email already registered', 'error');
            }, 500);
            return;
        }
        
        // Remove mobile duplicate check
        
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            setTimeout(() => {
                enableFormControls('#registerForm');
                showAlert('Username already taken', 'error');
            }, 500);
            return;
        }
        
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            // Remove mobile field
            password: password,
            rememberMe: false,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('secureNotesUsers', JSON.stringify(users));
        localStorage.setItem('lastRegisteredEmail', email);
        
        $('#registerForm')[0].reset();
        $('#registerPasswordStrength').removeClass('weak medium strong').css('width', '0');
        $('#registerStrengthText').text('Password strength');
        
        setTimeout(() => {
            enableFormControls('#registerForm');
            showAlert(`Welcome ${username}! Your account has been created successfully. Please login.`, 'success');
            
            setTimeout(() => {
                showLoginForm();
                $('#loginEmail').val(email);
                $('#loginPassword').focus();
            }, 2000);
        }, 1000);
    }
    
    // Handle forgot password - DIRECT RESET (No OTP)
    function handleForgotPassword(e) {
        e.preventDefault();
        
        const email = $('#forgotEmail').val().trim();
        
        if (!email) {
            showAlert('Please enter your email address', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        disableFormControls('#forgotForm');
        
        const users = JSON.parse(localStorage.getItem('secureNotesUsers') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            resetEmail = email;
            
            setTimeout(() => {
                enableFormControls('#forgotForm');
                showAlert('Email verified! Please reset your password.', 'success');
                
                setTimeout(() => {
                    showResetModal(user);
                }, 1000);
            }, 1000);
        } else {
            setTimeout(() => {
                enableFormControls('#forgotForm');
                showAlert('No account found with this email address', 'error');
            }, 500);
        }
    }
    
    // Check password strength for reset form
    function checkPasswordStrength() {
        const password = $('#newPassword').val();
        const strengthMeter = $('#passwordStrength');
        const strengthText = $('#strengthText');
        
        if (!password) {
            strengthMeter.removeClass('weak medium strong').css('width', '0');
            strengthText.text('Password strength');
            return;
        }
        
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        strengthMeter.removeClass('weak medium strong');
        
        if (strength <= 2) {
            strengthMeter.addClass('weak');
            strengthText.text('Weak password');
        } else if (strength <= 4) {
            strengthMeter.addClass('medium');
            strengthText.text('Medium strength');
        } else {
            strengthMeter.addClass('strong');
            strengthText.text('Strong password!');
        }
    }
    
    // Check password strength for register form
    function checkRegisterPasswordStrength() {
        const password = $('#registerPassword').val();
        const strengthMeter = $('#registerPasswordStrength');
        const strengthText = $('#registerStrengthText');
        
        if (!password) {
            strengthMeter.removeClass('weak medium strong').css('width', '0');
            strengthText.text('Password strength');
            return;
        }
        
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        strengthMeter.removeClass('weak medium strong');
        
        if (strength <= 2) {
            strengthMeter.addClass('weak');
            strengthText.text('Weak password');
        } else if (strength <= 4) {
            strengthMeter.addClass('medium');
            strengthText.text('Medium strength');
        } else {
            strengthMeter.addClass('strong');
            strengthText.text('Strong password!');
        }
    }
    
    // Show reset password modal
    function showResetModal(user) {
        $('#resetAccountName').text(user.username);
        $('#resetEmailText').text(user.email);
        $('#resetModal').addClass('active');
        $('#oldPassword').focus();
        $('#oldPassword').val('');
        $('#newPassword').val('');
        $('#confirmNewPassword').val('');
        $('#passwordStrength').removeClass('weak medium strong').css('width', '0');
        $('#strengthText').text('Password strength');
    }
    
    // Hide reset password modal
    function hideResetModal() {
        $('#resetModal').removeClass('active');
        resetEmail = '';
        $('#resetPasswordForm')[0].reset();
    }
    
    // Handle reset password - DIRECT (No OTP)
    function handleResetPassword(e) {
        e.preventDefault();
        
        const oldPassword = $('#oldPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmNewPassword = $('#confirmNewPassword').val();
        
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showAlert('New passwords do not match', 'error');
            $('#newPassword').val('');
            $('#confirmNewPassword').val('');
            $('#newPassword').focus();
            return;
        }
        
        if (newPassword.length < 6) {
            showAlert('New password must be at least 6 characters long', 'error');
            return;
        }
        
        if (oldPassword === newPassword) {
            showAlert('New password must be different from old password', 'error');
            return;
        }
        
        const resetBtn = $('#resetPasswordForm button[type="submit"]');
        resetBtn.prop('disabled', true).addClass('btn-loading');
        
        const users = JSON.parse(localStorage.getItem('secureNotesUsers') || '[]');
        const userIndex = users.findIndex(u => u.email === resetEmail);
        
        if (userIndex === -1) {
            showAlert('User not found', 'error');
            hideResetModal();
            return;
        }
        
        if (users[userIndex].password !== oldPassword) {
            showAlert('Current password is incorrect', 'error');
            resetBtn.prop('disabled', false).removeClass('btn-loading');
            return;
        }
        
        users[userIndex].password = newPassword;
        localStorage.setItem('secureNotesUsers', JSON.stringify(users));
        
        showAlert('Password changed successfully!', 'success');
        
        resetBtn.prop('disabled', false).removeClass('btn-loading');
        
        setTimeout(() => {
            hideResetModal();
            showLoginForm();
            $('#loginEmail').val(resetEmail);
            $('#loginPassword').focus();
        }, 1500);
    }
    
    // Show dashboard
    function showDashboard(user) {
        currentUser = user;
        
        $('.container').fadeOut(400, function() {
            $('.dashboard-container').fadeIn(400);
            updateUserInfo(user);
            loadUserNotes(user.id);
        });
    }
    
    // Update user information in dashboard
    function updateUserInfo(user) {
        $('#userName').text(user.username);
        $('#userEmail').text(user.email);
        $('#dashboardUserName').text(user.username.split(' ')[0]);
        
        const initials = user.username
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        $('#userAvatar').text(initials || 'U');
    }
    
    // Load user's notes
    function loadUserNotes(userId) {
        try {
            const allNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
            userNotes = allNotes.filter(note => note.userId === userId);
            renderNotes(userNotes);
        } catch (error) {
            console.error('Error loading notes:', error);
            localStorage.setItem('secureNotes', JSON.stringify([]));
            userNotes = [];
            renderNotes([]);
        }
    }
    
    // Render notes in dashboard
    function renderNotes(notes) {
        const notesGrid = $('#notesGrid');
        const emptyState = $('#emptyState');
        
        $('#notesCount').text(`${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`);
        
        notesGrid.empty();
        
        if (notes.length === 0) {
            emptyState.show();
            return;
        }
        
        emptyState.hide();
        
        const sortedNotes = [...notes].sort((a, b) => 
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        
        sortedNotes.forEach((note, index) => {
            const noteCard = createNoteCard(note, index);
            notesGrid.append(noteCard);
        });
        
        attachNoteEventListeners();
    }
    
    // Create a note card element
    function createNoteCard(note, index) {
        const noteDate = new Date(note.updatedAt);
        const formattedDate = formatDate(noteDate);
        
        const truncatedContent = note.content.length > 150 
            ? note.content.substring(0, 150) + '...'
            : note.content;
        
        return `
            <div class="note-card" data-id="${note.id}" data-index="${index}">
                <div class="note-header">
                    <div class="note-title">${escapeHtml(note.title)}</div>
                </div>
                <div class="note-date">${formattedDate}</div>
                <div class="note-content">${escapeHtml(truncatedContent).replace(/\n/g, '<br>')}</div>
                <div class="note-actions">
                    <button class="note-action-btn edit-note" title="Edit Note">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="note-action-btn delete-note" title="Delete Note">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    // Attach event listeners to note actions
    function attachNoteEventListeners() {
        $('.edit-note').off('click').click(function() {
            const noteId = $(this).closest('.note-card').data('id');
            editNote(noteId);
        });
        
        $('.delete-note').off('click').click(function() {
            const noteId = $(this).closest('.note-card').data('id');
            deleteNote(noteId);
        });
    }
    
    // Show add note modal
    function showAddNoteModal() {
        editingNoteId = null;
        $('#modalTitle').text('Add New Note');
        $('#noteTitle').val('');
        $('#noteContent').val('');
        $('#titleCharCount').text('0/100');
        $('#contentCharCount').text('0/1000');
        $('#noteModal').addClass('active');
        $('#noteTitle').focus();
    }
    
    // Hide note modal
    function hideNoteModal() {
        $('#noteModal').removeClass('active');
        editingNoteId = null;
    }
    
    // Save note (add or edit)
    function saveNote() {
        const title = $('#noteTitle').val().trim();
        const content = $('#noteContent').val().trim();
        
        if (!title) {
            showAlert('Please enter a title for your note', 'error');
            $('#noteTitle').focus();
            return;
        }
        
        if (!content) {
            showAlert('Please enter content for your note', 'error');
            $('#noteContent').focus();
            return;
        }
        
        if (title.length > 100) {
            showAlert('Title must be less than 100 characters', 'error');
            return;
        }
        
        if (content.length > 1000) {
            showAlert('Content must be less than 1000 characters', 'error');
            return;
        }
        
        try {
            const allNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
            
            if (editingNoteId) {
                const noteIndex = allNotes.findIndex(note => note.id === editingNoteId);
                if (noteIndex !== -1) {
                    allNotes[noteIndex].title = title;
                    allNotes[noteIndex].content = content;
                    allNotes[noteIndex].updatedAt = new Date().toISOString();
                }
            } else {
                const newNote = {
                    id: Date.now(),
                    userId: currentUser.id,
                    title: title,
                    content: content,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                allNotes.push(newNote);
            }
            
            localStorage.setItem('secureNotes', JSON.stringify(allNotes));
            loadUserNotes(currentUser.id);
            
            showAlert(`Note ${editingNoteId ? 'updated' : 'added'} successfully!`, 'success');
            hideNoteModal();
        } catch (error) {
            console.error('Error saving note:', error);
            showAlert('Error saving note. Please try again.', 'error');
        }
    }
    
    // Edit existing note
    function editNote(noteId) {
        try {
            const allNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
            const note = allNotes.find(n => n.id === noteId);
            
            if (note) {
                editingNoteId = noteId;
                $('#modalTitle').text('Edit Note');
                $('#noteTitle').val(note.title);
                $('#noteContent').val(note.content);
                $('#titleCharCount').text(`${note.title.length}/100`);
                $('#contentCharCount').text(`${note.content.length}/1000`);
                $('#noteModal').addClass('active');
                $('#noteTitle').focus();
            }
        } catch (error) {
            console.error('Error editing note:', error);
            showAlert('Error loading note. Please try again.', 'error');
        }
    }
    
    // Delete note
    function deleteNote(noteId) {
        Swal.fire({
            title: 'Delete Note?',
            text: "Are you sure you want to delete this note? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff7e5f',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const allNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
                    const updatedNotes = allNotes.filter(note => note.id !== noteId);
                    localStorage.setItem('secureNotes', JSON.stringify(updatedNotes));
                    loadUserNotes(currentUser.id);
                    showAlert('Note deleted successfully!', 'success');
                } catch (error) {
                    console.error('Error deleting note:', error);
                    showAlert('Error deleting note. Please try again.', 'error');
                }
            }
        });
    }
    
    // Search notes
    function searchNotes() {
        const searchTerm = $('#searchNotes').val().toLowerCase().trim();
        
        if (!searchTerm) {
            loadUserNotes(currentUser.id);
            return;
        }
        
        const allNotes = JSON.parse(localStorage.getItem('secureNotes') || '[]');
        const userNotes = allNotes.filter(note => note.userId === currentUser.id);
        
        const filteredNotes = userNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
        
        renderNotes(filteredNotes);
    }
    
    // Logout
    function logout() {
        Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to logout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ff7e5f',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                currentUser = null;
                
                const savedUser = JSON.parse(localStorage.getItem('secureNotesUser') || 'null');
                if (savedUser && !savedUser.rememberMe) {
                    localStorage.removeItem('secureNotesUser');
                }
                
                $('.dashboard-container').fadeOut(400, function() {
                    $('.container').fadeIn(400);
                    showLoginForm();
                    showAlert('Logged out successfully', 'info');
                });
            }
        });
    }
    
    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // function validateMobile(mobile) {
    //     const re = /^\+?[\d\s\-\(\)]{10,}$/;
    //     return re.test(mobile);
    // }
    
    function formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                if (diffMinutes === 0) {
                    return 'Just now';
                }
                return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
            }
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function showAlert(message, type = 'info') {
        const icon = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info'
        }[type] || 'info';
        
        Swal.fire({
            icon: icon,
            title: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    }
});
