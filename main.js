document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Проверяем данные
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (savedUser && savedUser.username === username && savedUser.password === password) {
        // Сохраняем статус входа
        localStorage.setItem('isLoggedIn', 'true');
        
        // Переход на ent.html (контент)
        window.location.href = "ent.html";
    } else {
        alert("Неверный логин или пароль!");
    }
});

