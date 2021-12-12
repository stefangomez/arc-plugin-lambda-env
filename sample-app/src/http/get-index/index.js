// learn more about HTTP functions here: https://arc.codes/http
const { Database } = require('@architect/shared/database');

exports.handler = async function http (req) {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
  <title>Architect</title>
</head>
<body>
<script>
    function toggleDark() {
      let htmlEl = document.getElementsByTagName('html')[0];
      let isDark = htmlEl.getAttribute('data-theme') === "dark";
      htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
    }
    function addTask(form) {
      let formData = new FormData(form);
      let task = formData.get('task');
      if (task) {
        form.reset();
        fetch('/add-task', { 
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task: task }) 
        }).then(function(resp) {
          getListItems();
        });
        return false;
      }
    }
    function deleteTask(taskId) {
      fetch('/delete-task', { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId }) 
      }).then(function(resp) {
        getListItems();
      });
    }
    function getListItems() {
      fetch('/list-tasks').then(function(resp) {
        resp.json().then(function(tasks) {
          console.log('tasks', tasks);
          let todosEl = document.getElementById('todos');
          let taskEls = document.createDocumentFragment();
          let tasksHtml = "";
          tasks.forEach(function(task) {
            tasksHtml += \`<tr><td width="40"><input type="checkbox" onclick="deleteTask('\${task.id}')" name="done"></td><td>\${task.task}</td></tr>\`;
          });
          todosEl.innerHTML = tasksHtml;
        });
      });
    }
    getListItems();
</script>
  <main class="container-fluid">
        <h3 class="margin-bottom-16">
          <input type="checkbox" id="switch" name="switch" role="switch" onchange="toggleDark()">
      Test Todo app for arc-plugin-lambda-env
        </h3>
        <form onsubmit="addTask(this); return false;">
          <div class="grid">
              <input type="text" name="task" placeholder="Type task...">
              <button type="submit"">Add Task</button>
          </div>
        </form>
        <table>
          <thead>
            <tr>
              <th scope="col" colspan="2">Todos</th>
            </tr>
          </thead>
          <tbody id="todos">
            
          </tbody>
        </table>
  </main>
</body>
</html>
`
  }
}