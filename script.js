const baseUrl = 'https://fancy-todo-reborn.herokuapp.com'
const token = localStorage.getItem('access_token')

const showLoginPage = () => {
  $("#login-page").show()
  $("#register-page").hide()
  $("#main-page").hide()
  $("#btn-logout").hide()
}
const showMainPage = () => {

  $("#login-page").hide()
  $("#main-page").show()
  $("#btn-logout").show()
  $("#edit-form").hide()
  $("#todo-form").hide()
  $("#register-page").hide()
  fetchTodos()
  getWeather()
}
const register = () => {
  const first_name = $("#first_name-input").val()
  const last_name = $("#last_name-input").val()
  const email = $("#email_reg-input").val()
  const password = $("#password_reg-input").val()

  $.ajax({
    method: 'POST',
    url: `${baseUrl}/users/register`,
    data: {
      first_name,
      last_name,
      email,
      password
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(response => {
    console.log(response)
    showLoginPage()
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus)
  })
}
const login = () => {
    const email = $("#email-input").val()
    const password = $("#password-input").val()

    $.ajax({
      url: `${baseUrl}/users/login`,
      method: 'POST',
      data: {
        email,
        password
      }
    })
    .done(response => {
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('full_name_user', response.full_name)
      showMainPage()
    })
    .fail((xhr, textStatus) => {
      console.log(xhr, textStatus)
    })
    .always(_ => {
      $("#email-input").val("")
      $("#password-input").val("")
    })
}
const logout = () => {
  localStorage.clear()
  showLoginPage()
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
const fetchTodos = () => {
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(response => {
    $("#todo-list").empty()
    $("#current-weather").data("full_name_user", localStorage.getItem("full_name_user"))
    response.forEach(todo => {
      $("#todo-list").append(`<div class="card col-sm" style="width: 350px; margin-right: 15px;">
        <div class="card-header">
          ${todo.title}
        </div>
        <div class="card-body">
          <h5 class="card-title">Description: ${todo.description}</h5>
          <p class="card-text">Status: ${todo.status}</p>
          <p class="card-text">Due_date: ${todo.due_date}</p>
          <a href="#" class="btn btn-warning" onclick="showEditForm(${todo.id})">Edit</a>
          <a href="#" class="btn btn-danger" onclick="deleteTodo(${todo.id})">Delete</a>
        </div>
    </div>`)
    })

  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus)
  })
}
const addTodo = () => {
  const title = $("#title-input").val()
  const description = $("#description-input").val()
  const status = $("#status-input").val()
  const due_date = $("#due_date-input").val()

  $.ajax({
    method: 'POST',
    url: `${baseUrl}/todos`,
    data: {
      title,
      description,
      status,
      due_date
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(response => {
      fetchTodos()
    })
    .fail((xhr, textStatus) => {
      console.log(xhr)
    })
    .always(_ => {
      $("#title-input").val("")
      $("#description-input").val("")
      $("#status-input").val("")
      $("#due_date-input").val("")
    })
}
const deleteTodo = (id) => {
  $.ajax({
    method: 'DELETE',
    url: `${baseUrl}/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(response => {
      fetchTodos()
    })
    .fail((xhr, textStatus) => {
      console.log(xhr)
    })
}
const showEditForm = (id) => {
  $("#todo-form").hide()
  $("#edit-form").show()
  $("#todo-list").hide()
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(response => {
    $("#title-edit").val(response.title)
    $("#description-edit").val(response.description)
    $("#status-edit").val(response.status)
    $("#due_date-edit").val(response.due_date)
    $("#edit-form").data('id', id)
  })
  .fail((xhr, textStatus) => {
    console.log(xhr)
  })

}
const editTodo = () => {
  const title = $("#title-edit").val()
  const description = $("#description-edit").val()
  const status = $("#status-edit").val()
  const due_date = $("#due_date-edit").val()
  const todoId = $("#edit-form").data('id')

  $.ajax({
    method: 'PUT',
    url: `${baseUrl}/todos/${todoId}`,
    data: {
      title,
      description,
      status,
      due_date
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(response => {
    fetchTodos()
    $("#todo-list").show()
    $("#todo-form").show()
    $("#edit-form").hide()
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus)
  })
  .always(_ => {
    $("#title-input").val("")
    $("#description-input").val("")
    $("#status").val("")
    $("#due_date").val("")
  })
}
const getWeather = () => {

  $.ajax({
    method: 'GET',
    url: `${baseUrl}/weather`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(response => {
    $("#current-weather").empty()
    const username = $("#current-weather").data('full_name_user')
    $("#current-weather").append(`
    <h2>Hallo ${username}</h2>
    <h3>Berikut perkiraan cuaca hari ini:</h3>
    <h1>${response.location.name}</h1>
    <img src="${response.current.weather_icons}">
    <h3>${response.current.feelslike}&deg;</h3>
    <div class="row">
      <div class="col-4">General<br>${response.current.weather_descriptions}</div>
      <div class="col-4">Cloud<br>${response.current.cloudcover}</div>
      <div class="col-4">Pressure<br>${response.current.pressure}</div>
    </div>
    `)
  })
  .fail((xhr, textStatus) => {
    console.log(xhr)
  })
}
function onSignIn(googleUser) {
  var googleToken = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: 'POST',
    url: `${baseUrl}/users/googlelogin`,
    data: {
      googleToken
    }
  })
  .done(response => {
    console.log(response)
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('full_name_user', response.full_name)
    showMainPage()
  })
  .fail((xhr, textStatus) => {
    console.log(xhr, textStatus)
  })
}


$(document).ready(() => {

  if(token) {
    showMainPage()
  } else {
    showLoginPage()
  }

  $("#login-form").on("submit", (event) => {
    event.preventDefault()
    login()
  })
  $("#btn-logout").on("click", () => {
    logout()
  })
  $("#todo-form").on("submit", (event) => {
    event.preventDefault()
    addTodo()
  })
  $("#edit-form").on("submit", (event) => {
    event.preventDefault()
    editTodo()
  })
  $("#add-btn").on("click", (event) => {
    $("#todo-form").show()
  })
  $("#register-here").on("click", (event) => {
    event.preventDefault()
    $("#register-page").show()
    $("#login-page").hide()
  })
  $("#register-form").on("submit", (event) => {
    event.preventDefault()
    register()
  })
  $("#have-account").on("click", (event) => {
    event.preventDefault()
    showLoginPage()
  })
})