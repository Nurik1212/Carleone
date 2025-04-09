document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert("Заполните все поля!");
        return;
    }
    
    // Сохраняем пользователя
    localStorage.setItem('user', JSON.stringify({ username, password }));
    alert("Регистрация успешна!");
    
    // Переход на вход
    window.location.href = "index.html";
});

