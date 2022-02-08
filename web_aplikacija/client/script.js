var getTodos = function(callb) {
    $.get('/todo', function(data) {
        callb(data);
    });   
}

var addTodo = function(description, done, callb) {
    $.post('/todo', { description, done }, function(data){
        callb(data);
    });
}

var deleteTodo = function(id) {
    $.ajax({
        url: `/todo/${id}`,
        type: 'DELETE',
        success: function(data) {
            fillTable(data.todos);
        }
    });
}

var updateTodo = function(id) {
    $.ajax({
        url: `/todo/${id}`,
        type: 'PUT',
        success: function(data) {
            fillTable(data.todos);
        }
    });
}

var fillTable = function(todos) {
    var tbody = $("#todos-table > tbody")
    tbody.empty();
    for(var i = 0; i < todos.length; i++) {
        var description = todos[i].description;
        var done = todos[i].done;
        var id = todos[i].id;
        tbody.append(
            `<tr>
                <th scope='row'>${id}</th>
                <td>${description}</td><td>${done}</td>
                <td><button class="btn btn-outline-success" onclick="updateTodo(${id})">Označi</button></td>
                <td><button class="btn btn-outline-danger" onclick="deleteTodo(${id})">Obriši</button></td>
            </tr>
            `
            )
    }    
}

$(document).ready(function() {
    // čim se dokument učita, dohvati todo zapise te ih dodaj na stranicu pomocu metode fillTable
    getTodos(function(data) {
        fillTable(data.todos);
    });

    $("#todo-form").submit(function(event) {
        var description = event.target[0].value;
        var done = event.target[1].checked;
        event.target[0].value = "";
        event.target[1].checked = false;
        event.preventDefault();
        addTodo(description, done, function(data) {
            fillTable(data.todos)
        });
    });    
});