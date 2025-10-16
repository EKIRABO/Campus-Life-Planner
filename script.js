//Logic for the App

let tabletasks = [];//Creating an array for holding the tasks
let cards; // Container of the cards created in the HTML
let chart = null; // Variable to conatain the chart used in the dashboard

//regular expressions used to validate the form input when the user adds a new task
const REGEX_PATTERNS = {
    title: /^\S(?:.*\S)?$/, 
    duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/, 
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[a-zA-Z\s\-,]+$/ 
};


let durationDisplay = 'minutes'; // default duration in the settings which you can change to hours
let currentTheme = 'light';// default mode in the settings which you can change to dark

// Function to generate sample tasks for first-time users of the app
function generateSeedData() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    // Sample tasks with various records and inputs
    const samples = [
        {
            id: Date.now() + 1,
            title: 'Complete Math Assignment',
            duration: 2.5,
            date: tomorrow.toISOString().split('T')[0],
            tag: 'Homework, Mathematics',
            completed: false
        },
        {
            id: Date.now() + 2,
            title: 'Study for Biology Exam',
            duration: 3,
            date: nextWeek.toISOString().split('T')[0],
            tag: 'Study, Exam',
            completed: false
        },
        {
            id: Date.now() + 3,
            title: 'Attend Programming Workshop',
            duration: 1.5,
            date: today.toISOString().split('T')[0],
            tag: 'Workshop, Coding',
            completed: false
        },
        {
            id: Date.now() + 4,
            title: 'Submit Literature Essay',
            duration: 4,
            date: yesterday.toISOString().split('T')[0],
            tag: 'Assignment, Writing',
            completed: true
        },
        {
            id: Date.now() + 5,
            title: 'Group Project Meeting',
            duration: 2,
            date: tomorrow.toISOString().split('T')[0],
            tag: 'Meeting, Teamwork',
            completed: false
        },
        {
            id: Date.now() + 6,
            title: 'Review Physics Notes',
            duration: 1,
            date: today.toISOString().split('T')[0],
            tag: 'Study, Physics',
            completed: true
        }
    ];

    return samples;
}

//Adding an event listener to load the tasks and settings
document.addEventListener('DOMContentLoaded', () => {
    cards = document.getElementById('cards-container');
    initializeChart();
    loadTasks();
    loadSettings();
    attachEventListeners();
    setupNavigation();
    updateDashboard();
});

// functions to validate the form inputs when adding a new task
function validationoftitle(title) {
    if (!title || !REGEX_PATTERNS.title.test(title)) {
        return 'Title must not have leading/trailing spaces';
    }
    return null;
}

function validationofPeriod(duration) {
    if (!duration || !REGEX_PATTERNS.duration.test(duration)) {
        return 'Duration must be a valid number (e.g., 2.5)';
    }
    if (parseFloat(duration) <= 0) {
        return 'Duration must be greater than 0';
    }
    return null;
}

function validatingdate(date) {
    if (!date || !REGEX_PATTERNS.date.test(date)) {
        return 'Date must be in YYYY-MM-DD format';
    }
    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
        return 'Invalid date';
    }
    return null;
}

function validatingtag(tag) {
    if (!tag || !REGEX_PATTERNS.tag.test(tag)) {
        return 'Tag must contain only letters, spaces, hyphens, and commas';
    }
    return null;
}



function validateForm() {
    const title = document.getElementById('title').value;
    const duration = document.getElementById('duration').value;
    const date = document.getElementById('date').value;
    const tag = document.getElementById('tag').value;

    let isValid = true;

  
    const titleError = validationoftitle(title);
    const titleInput = document.getElementById('title');
    if (titleError) {
        document.getElementById('title-error').textContent = titleError;
        titleInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('title-error').textContent = '';
        titleInput.classList.remove('invalid');
    }

   
    const durationError = validationofPeriod(duration);
    const durationInput = document.getElementById('duration');
    if (durationError) {
        document.getElementById('duration-error').textContent = durationError;
        durationInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('duration-error').textContent = '';
        durationInput.classList.remove('invalid');
    }

 
    const dateError = validatingdate(date);
    const dateInput = document.getElementById('date');
    if (dateError) {
        document.getElementById('date-error').textContent = dateError;
        dateInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('date-error').textContent = '';
        dateInput.classList.remove('invalid');
    }

    
    const tagError = validatingtag(tag);
    const tagInput = document.getElementById('tag');
    if (tagError) {
        document.getElementById('tag-error').textContent = tagError;
        tagInput.classList.add('invalid');
        isValid = false;
    } else {
        document.getElementById('tag-error').textContent = '';
        tagInput.classList.remove('invalid');
    }

    return isValid;
}


//function to connect the event listeners to the various elements in the HTML
function attachEventListeners() {
    const titleInput = document.getElementById('title');
    const durationInput = document.getElementById('duration');
    const dateInput = document.getElementById('date');
    const tagInput = document.getElementById('tag');

   
    titleInput.addEventListener('blur', () => {
        const error = validationoftitle(titleInput.value);
        document.getElementById('title-error').textContent = error || '';
        if (error) titleInput.classList.add('invalid');
        else titleInput.classList.remove('invalid');
    });

    durationInput.addEventListener('blur', () => {
        const error = validationofPeriod(durationInput.value);
        document.getElementById('duration-error').textContent = error || '';
        if (error) durationInput.classList.add('invalid');
        else durationInput.classList.remove('invalid');
    });

    dateInput.addEventListener('blur', () => {
        const error = validatingdate(dateInput.value);
        document.getElementById('date-error').textContent = error || '';
        if (error) dateInput.classList.add('invalid');
        else dateInput.classList.remove('invalid');
    });

    tagInput.addEventListener('blur', () => {
        const error = validatingtag(tagInput.value);
        document.getElementById('tag-error').textContent = error || '';
        if (error) tagInput.classList.add('invalid');
        else tagInput.classList.remove('invalid');
    });

    // Form submission event listener
    const form = document.getElementById('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveTask();
        }
    });

   // What will show when the add task button is clicked
    document.getElementById('add-task').addEventListener('click', () => {
        document.getElementById('form').style.display = 'block';
    });
    //clearing the form when the clear button is clicked
    document.getElementById('clearing').addEventListener('click', clearForm);
    //hiding the form when the cancel button is clicked
    document.getElementById('canceling').addEventListener('click', () => {
        clearForm();
        document.getElementById('form').style.display = 'none';
    });

   // Event listeners for the search bar and the sort dropdown
    document.getElementById('search-input').addEventListener('input', filterTasks);
    document.getElementById('sort-select').addEventListener('change', sortTasks);

    
    document.querySelectorAll('input[name="look"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentTheme = e.target.value;
            applyTheme(e.target.value);
            saveSettings();
        });
    });

    document.querySelectorAll('input[name="duration"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            durationDisplay = e.target.value;
            saveSettings();
            renderTasks();
            updateDashboard();
        });
    });

  // Event listeners for exporting and importing data
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-file').addEventListener('change', importData);

  
    document.getElementById('menu-bar').addEventListener('click', () => {
        const menu = document.getElementById('menu-bar');
        const nav = document.getElementById('navigation-menu');
        menu.classList.toggle('active');
        nav.classList.toggle('active');
    });

    //Show and hide the contact card when the contact me button is clicked
    document.getElementById('Contact-Me').addEventListener('click', function() {
        const card = document.getElementById('contacts');
        card.style.display = card.style.display === 'block' ? 'none' : 'block';
    });
}


//Setting up the navigation between different sections of the app
function setupNavigation() {
    const sections = ['Dashboard', 'Records', 'About', 'Settings'];
    
    sections.forEach(section => {
        const button = document.getElementById(`${section}-button`);
        button.addEventListener('click', () => {
           
            document.querySelectorAll('main > section').forEach(s => {
                s.style.display = 'none';
            });
            
          
            document.getElementById(section).style.display = 'block';
            
           
            document.querySelectorAll('nav button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

          
            document.getElementById('menu-bar').classList.remove('active');
            document.getElementById('navigation-menu').classList.remove('active');
        });
    });

   
    document.querySelectorAll('main > section').forEach(s => {
        s.style.display = 'none';
    });
    document.getElementById('Dashboard').style.display = 'block';
}


//Saving a new task to the loccal Storage
function saveTask() {
    const task = {
        id: Date.now(),
        title: document.getElementById('title').value.trim(),
        duration: parseFloat(document.getElementById('duration').value),
        date: document.getElementById('date').value,
        tag: document.getElementById('tag').value.trim(),
        completed: false
    };

    tabletasks.push(task);
    saveTasks();
    renderTasks();
    updateDashboard();
    clearForm();
    document.getElementById('form').style.display = 'none';
    
    showNotification('Task added successfully!');
}
//Loading tasks from the local storage
function loadTasks() {
    const stored = localStorage.getItem('campusTasks');
    if (stored) {
        try {
            tabletasks = JSON.parse(stored);
            renderTasks();
        } catch (e) {
            console.error('Error loading tasks:', e);
            tabletasks = [];
        }
    } else {
        
        tabletasks = generateSeedData();
        saveTasks();
        renderTasks();
        showNotification('Sample tasks loaded! Feel free to add, edit, or delete them.');
    }
}
//Saving tasks to the local storage
function saveTasks() {
    localStorage.setItem('campusTasks', JSON.stringify(tabletasks));
}
//Deleting a task from the local storage
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tabletasks = tabletasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateDashboard();
        showNotification('Task deleted');
    }
}
//Switching the completed status of a task
function toggleTask(id) {
    const task = tabletasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateDashboard();
    }
}
//Clearing the form inputs and error messages
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('date').value = '';
    document.getElementById('tag').value = '';
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    document.querySelectorAll('form input').forEach(input => input.classList.remove('invalid'));
}



function renderTasks(tasksToRender = tabletasks) {
  
    cards.innerHTML = '';
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = '';

    if (tasksToRender.length === 0) {
        cards.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No tasks found. Add a task to get started!</p>';
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999; padding: 40px;">No tasks found</td></tr>';
        return;
    }

    tasksToRender.forEach(task => {
        
        const card = createTaskCard(task);
        cards.appendChild(card);

      
        const row = createTaskRow(task);
        tbody.appendChild(row);
    });
}
//Creating a card for each task to be displayed in the records section by default or on small screens
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');
    
    const displayDuration = formatDuration(task.duration);
    
    card.innerHTML = `
        <div class="task-card-header">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})" 
                   aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
            <div class="task-card-title">${escapeHtml(task.title)}</div>
        </div>
        <div class="task-card-body">
            <div><span>Duration:</span> ${displayDuration}</div>
            <div><span>Due Date:</span> ${task.date}</div>
            <div><span>Tag:</span> ${escapeHtml(task.tag)}</div>
        </div>
        <div class="task-card-footer">
            <button onclick="deleteTask(${task.id})" aria-label="Delete task">Delete</button>
        </div>
    `;
    return card;
}
function createTaskRow(task) {
    const row = document.createElement('tr');
    row.className = task.completed ? 'completed' : '';
    
    const displayDuration = formatDuration(task.duration);
    
    row.innerHTML = `
        <td><input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})"
                   aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"></td>
        <td>${escapeHtml(task.title)}</td>
        <td>${task.date}</td>
        <td>${displayDuration}</td>
        <td>${escapeHtml(task.tag)}</td>
        <td><button onclick="deleteTask(${task.id})" aria-label="Delete task">Delete</button></td>
    `;
    return row;
}




//Filtering tasks based on the search input
function filterTasks() {
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (!searchTerm) {
        renderTasks(tabletasks);
        return;
    }

    try {
      
        const regex = new RegExp(searchTerm, 'i');
        const filtered = tabletasks.filter(task => 
            regex.test(task.title) || 
            regex.test(task.tag) || 
            regex.test(task.date)
        );
        renderTasks(filtered);
    } catch (e) {
       
        const filtered = tabletasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.date.includes(searchTerm)
        );
        renderTasks(filtered);
    }
}

function sortTasks() {
    const sortBy = document.getElementById('sort-select').value;
    const sorted = [...tabletasks];

    switch(sortBy) {
        case 'Title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'Due Date':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'Duration':
            sorted.sort((a, b) => b.duration - a.duration);
            break;
    }

    renderTasks(sorted);
}



function updateDashboard() {
    const total = tabletasks.length;
    const completed = tabletasks.filter(t => t.completed).length;
    const totalDuration = tabletasks.reduce((sum, t) => sum + t.duration, 0);
    const progress = total > 0 ? (completed / total * 100) : 0;

    document.getElementById('total').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    
    
    const durationText = formatDuration(totalDuration);
    document.getElementById('total-duration').textContent = durationText;
    
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-bar').setAttribute('aria-valuenow', progress.toFixed(0));
    document.getElementById('progress-text').textContent = progress.toFixed(0) + '% completed';

   
    const upcoming = tabletasks
        .filter(t => !t.completed && new Date(t.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    document.getElementById('upcoming-tasks').textContent = 
        upcoming.length > 0 ? upcoming.map(t => t.title).join(', ') : 'None';

    updateChart();
}


//Initializing the chart in the dashboard
function initializeChart() {
    const ctx = document.getElementById('activityChart');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Completed Tasks',
                data: [],
                borderColor: 'rgb(106, 90, 205)',
                backgroundColor: 'rgba(106, 90, 205, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!chart) return;

 
    const grouped = {};
    tabletasks.forEach(task => {
        if (task.completed) {
            grouped[task.date] = (grouped[task.date] || 0) + 1;
        }
    });

   
    const dates = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(dateStr);
        counts.push(grouped[dateStr] || 0);
    }

    chart.data.labels = dates;
    chart.data.datasets[0].data = counts;
    chart.update();
}



function loadSettings() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDuration = localStorage.getItem('durationDisplay') || 'minutes';
    
    currentTheme = savedTheme;
    durationDisplay = savedDuration;
    
    applyTheme(savedTheme);
    document.querySelector(`input[name="look"][value="${savedTheme}"]`).checked = true;
    document.querySelector(`input[name="duration"][value="${savedDuration}"]`).checked = true;
}

function saveSettings() {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('durationDisplay', durationDisplay);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}


//Exporting and importing data functions
function exportData() {
    const dataStr = JSON.stringify(tabletasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campus-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                tabletasks = imported;
                saveTasks();
                renderTasks();
                updateDashboard();
                showNotification('Data imported successfully!');
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}



function formatDuration(hours) {
    if (durationDisplay === 'hours') {
        return `${hours.toFixed(2)} hrs`;
    } else {
        return `${(hours * 60).toFixed(0)} mins`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    setTimeout(() => {
        statusDiv.textContent = '';
    }, 3000);
}
 
//Making functions accessible globally for inline event handlers

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
