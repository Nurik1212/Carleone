document.addEventListener('DOMContentLoaded', function() {
    // Профильные предметы (по умолчанию математика и физика)
    let profileSubjects = {
        first: { name: "Математика", id: "math" },
        second: { name: "Физика", id: "physics" }
    };

    // Все возможные комбинации профильных предметов
    const validCombinations = [
        ["math", "physics"],          // математика + физика
        ["math", "geography"],        // математика + география
        ["worldHistory", "geography"], // всемирная история + география
        ["biology", "chemistry"],      // биология + химия
        ["biology", "geography"],     // биология + география
        ["english", "worldHistory"],  // английский + всемирная история
        ["geography", "english"],     // география + английский
        ["chemistry", "physics"],     // химия + физика
        ["worldHistory", "law"],      // всемирная история + основы права
        ["math", "informatics"]       // математика + информатика
    ];

    // Все предметы ЕНТ
    const allSubjects = [
        { id: "mathLit", name: "Математическая грамотность", fixed: true },
        { id: "reading", name: "Грамотность чтения", fixed: true },
        { id: "history", name: "История Казахстана", fixed: true },
        { id: "math", name: "Математика", fixed: false },
        { id: "physics", name: "Физика", fixed: false },
        { id: "geography", name: "География", fixed: false },
        { id: "worldHistory", name: "Всемирная история", fixed: false },
        { id: "biology", name: "Биология", fixed: false },
        { id: "chemistry", name: "Химия", fixed: false },
        { id: "english", name: "Английский язык", fixed: false },
        { id: "law", name: "Основы права", fixed: false },
        { id: "informatics", name: "Информатика", fixed: false }
    ];

    const form = document.getElementById('entResultsForm');
    const table = document.getElementById('entResultsTable');
    const clearBtn = document.getElementById('clearEntResultsBtn');
    const editBtn = document.getElementById('editProfileSubjectsBtn');
    const settingsPanel = document.getElementById('profileSubjectsPanel');
    const saveBtn = document.getElementById('saveProfileSubjectsBtn');
    const cancelBtn = document.getElementById('cancelProfileSubjectsBtn');
    const subjectsList = document.getElementById('subjectsList');
    
    // Загрузка данных
    loadResults();
    loadProfileSubjects();
    updateProfileSubjectsDisplay();
    updateSubjectsList();
    
    // Обработчики событий
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentName = document.getElementById('studentName').value;
        const mathLitScore = parseInt(document.getElementById('mathLitScore').value);
        const readingScore = parseInt(document.getElementById('readingScore').value);
        const historyScore = parseInt(document.getElementById('historyScore').value);
        const firstProfileScore = parseInt(document.getElementById('firstProfileScore').value);
        const secondProfileScore = parseInt(document.getElementById('secondProfileScore').value);
        
        const totalScore = mathLitScore + readingScore + historyScore + firstProfileScore + secondProfileScore;
        
        addResultToTable(studentName, mathLitScore, readingScore, historyScore, 
                       firstProfileScore, secondProfileScore, totalScore);
        saveResults();
        form.reset();
    });
    
    clearBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить все результаты?')) {
            table.innerHTML = '';
            localStorage.removeItem('entResults');
        }
    });
    
    editBtn.addEventListener('click', function() {
        // Сбросить все чекбоксы
        document.getElementById('mathCheckbox').checked = false;
        document.getElementById('physicsCheckbox').checked = false;
        document.getElementById('geographyCheckbox').checked = false;
        document.getElementById('worldHistoryCheckbox').checked = false;
        document.getElementById('biologyCheckbox').checked = false;
        document.getElementById('chemistryCheckbox').checked = false;
        document.getElementById('englishCheckbox').checked = false;
        document.getElementById('lawCheckbox').checked = false;
        document.getElementById('informaticsCheckbox').checked = false;
        
        // Отметить текущие профильные предметы
        document.getElementById(profileSubjects.first.id + 'Checkbox').checked = true;
        document.getElementById(profileSubjects.second.id + 'Checkbox').checked = true;
        
        settingsPanel.style.display = 'block';
    });
    
    saveBtn.addEventListener('click', function() {
        const selectedSubjects = [];
        if (document.getElementById('mathCheckbox').checked) selectedSubjects.push({id: "math", name: "Математика"});
        if (document.getElementById('physicsCheckbox').checked) selectedSubjects.push({id: "physics", name: "Физика"});
        if (document.getElementById('geographyCheckbox').checked) selectedSubjects.push({id: "geography", name: "География"});
        if (document.getElementById('worldHistoryCheckbox').checked) selectedSubjects.push({id: "worldHistory", name: "Всемирная история"});
        if (document.getElementById('biologyCheckbox').checked) selectedSubjects.push({id: "biology", name: "Биология"});
        if (document.getElementById('chemistryCheckbox').checked) selectedSubjects.push({id: "chemistry", name: "Химия"});
        if (document.getElementById('englishCheckbox').checked) selectedSubjects.push({id: "english", name: "Английский язык"});
        if (document.getElementById('lawCheckbox').checked) selectedSubjects.push({id: "law", name: "Основы права"});
        if (document.getElementById('informaticsCheckbox').checked) selectedSubjects.push({id: "informatics", name: "Информатика"});
        
        if (selectedSubjects.length !== 2) {
            alert("Пожалуйста, выберите ровно 2 профильных предмета!");
            return;
        }
        
        // Проверка допустимости комбинации
        const isValidCombination = validCombinations.some(comb => {
            return (comb[0] === selectedSubjects[0].id && comb[1] === selectedSubjects[1].id) ||
                   (comb[0] === selectedSubjects[1].id && comb[1] === selectedSubjects[0].id);
        });
        
        if (!isValidCombination) {
            alert("Выбрана недопустимая комбинация профильных предметов!\n\nДоступные комбинации:\n" +
                  "• Математика + Физика\n" +
                  "• Математика + География\n" +
                  "• Всемирная история + География\n" +
                  "• Биология + Химия\n" +
                  "• Биология + География\n" +
                  "• Английский язык + Всемирная история\n" +
                  "• География + Английский язык\n" +
                  "• Химия + Физика\n" +
                  "• Всемирная история + Основы права\n" +
                  "• Математика + Информатика");
            return;
        }
        
        profileSubjects.first = selectedSubjects[0];
        profileSubjects.second = selectedSubjects[1];
        
        updateProfileSubjectsDisplay();
        updateSubjectsList();
        saveProfileSubjects();
        settingsPanel.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });
    
    // Функции
    function addResultToTable(name, mathLit, reading, history, firstProfile, secondProfile, total) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${mathLit}/10</td>
            <td>${reading}/10</td>
            <td>${history}/20</td>
            <td>${firstProfile}/50</td>
            <td>${secondProfile}/50</td>
            <td>${total}/140</td>
            <td><button class="delete-btn" onclick="deleteRow(this)">Удалить</button></td>
        `;
        table.appendChild(row);
    }
    
    function saveResults() {
        const rows = table.querySelectorAll('tr');
        const results = [];
        
        rows.forEach(row => {
            const cells = row.cells;
            results.push({
                name: cells[0].textContent,
                mathLit: cells[1].textContent.split('/')[0],
                reading: cells[2].textContent.split('/')[0],
                history: cells[3].textContent.split('/')[0],
                firstProfile: cells[4].textContent.split('/')[0],
                secondProfile: cells[5].textContent.split('/')[0],
                total: cells[6].textContent.split('/')[0]
            });
        });
        
        localStorage.setItem('entResults', JSON.stringify(results));
    }
    
    function loadResults() {
        const savedResults = localStorage.getItem('entResults');
        if (savedResults) {
            const results = JSON.parse(savedResults);
            results.forEach(result => {
                addResultToTable(
                    result.name, 
                    parseInt(result.mathLit), 
                    parseInt(result.reading), 
                    parseInt(result.history), 
                    parseInt(result.firstProfile), 
                    parseInt(result.secondProfile), 
                    parseInt(result.total)
                );
            });
        }
    }
    
    function loadProfileSubjects() {
        const savedSubjects = localStorage.getItem('entProfileSubjects');
        if (savedSubjects) {
            profileSubjects = JSON.parse(savedSubjects);
        }
    }
    
    function saveProfileSubjects() {
        localStorage.setItem('entProfileSubjects', JSON.stringify(profileSubjects));
    }
    
    function updateProfileSubjectsDisplay() {
        // Обновление формата тестирования
        document.getElementById('firstProfileSubject').textContent = profileSubjects.first.name + ":";
        document.getElementById('secondProfileSubject').textContent = profileSubjects.second.name + ":";
        
        // Обновление формы ввода
        document.getElementById('firstProfileLabel').textContent = profileSubjects.first.name + ":";
        document.getElementById('secondProfileLabel').textContent = profileSubjects.second.name + ":";
        
        // Обновление заголовков таблицы
        document.getElementById('firstProfileHeader').textContent = profileSubjects.first.name;
        document.getElementById('secondProfileHeader').textContent = profileSubjects.second.name;
    }
    
    function updateSubjectsList() {
        // Очищаем список
        subjectsList.innerHTML = '';
        
        // Добавляем фиксированные предметы
        allSubjects.filter(subj => subj.fixed).forEach(subj => {
            const li = document.createElement('li');
            li.textContent = subj.name;
            subjectsList.appendChild(li);
        });
        
        // Добавляем текущие профильные предметы
        const firstLi = document.createElement('li');
        firstLi.textContent = profileSubjects.first.name;
        subjectsList.appendChild(firstLi);
        
        const secondLi = document.createElement('li');
        secondLi.textContent = profileSubjects.second.name;
        subjectsList.appendChild(secondLi);
    }
    
    window.deleteRow = function(button) {
        const row = button.closest('tr');
        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
            row.remove();
            saveResults();
        }
    };
});
