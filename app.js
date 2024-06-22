document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const taskIdInput = document.getElementById('task-id');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskDateInput = document.getElementById('task-date');
  
    let tasks = [];
  
    const apiUrl = 'http://localhost:3000/api/tasks';
  
    function fetchTasks() {
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched tasks:', data);
          tasks = data;
          renderTasks();
        })
        .catch(error => console.error('Error fetching tasks:', error));
    }
  
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.classList.add('task');
        taskEl.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <small>Due: ${task.dueDate}</small>
          <br>
          <button onclick="editTask('${task._id}')">Edit</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(taskEl);
      });
    }
  
    function openModal() {
      taskModal.style.display = 'block';
    }
  
    function closeModal() {
      taskModal.style.display = 'none';
      taskForm.reset();
      taskIdInput.value = '';
    }
  
    function saveTask(event) {
      event.preventDefault();
      const task = {
        title: taskTitleInput.value,
        description: taskDescInput.value,
        dueDate: taskDateInput.value,
      };
      const id = taskIdInput.value;
      if (id) {
        // Update existing task
        fetch(`${apiUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          fetchTasks();
          closeModal();
        })
        .catch(error => console.error('Error updating task:', error));
      } else {
        // Create new task
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          fetchTasks();
          closeModal();
        })
        .catch(error => console.error('Error creating task:', error));
      }
    }
  
    window.editTask = function(id) {
      console.log('Edit task:', id);
      const task = tasks.find(t => t._id === id);
      if (task) {
        taskIdInput.value = task._id;
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description;
        taskDateInput.value = task.dueDate;
        modalTitle.textContent = 'Edit Task';
        openModal();
      }
    };
  
    window.deleteTask = function(id) {
      console.log('Delete task:', id);
      fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchTasks();
      })
      .catch(error => console.error('Error deleting task:', error));
    };
  
    addTaskBtn.addEventListener('click', () => {
      modalTitle.textContent = 'Add Task';
      openModal();
    });
  
    closeModalBtn.addEventListener('click', closeModal);
  
    taskForm.addEventListener('submit', saveTask);
  
    window.onclick = function(event) {
      if (event.target == taskModal) {
        closeModal();
      }
    };
  
    fetchTasks();
  });
