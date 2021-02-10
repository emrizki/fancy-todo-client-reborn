const baseUrl = 'http://localhost:3000'
const token = localStorage.getItem('access_token')

const showLoginPage = () => {
  $("#login-page").show()
  $("#main-page").hide()
  $("#btn-logout").hide()
}

const showMainPage = () => {
  $("#login-page").hide()
  $("#main-page").show()
  $("#btn-logout").show()
  fetchTodos()
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

    response.forEach(todo => {
      $("#todo-list").append(`<div class="card col-sm" style="width: 350px; margin-right: 15px;">
        <div class="card-header">
          ${todo.title}
        </div>
        <div class="card-body">
          <h5 class="card-title">Description: ${todo.description}</h5>
          <p class="card-text">Status: ${todo.status}</p>
          <p class="card-text">Due_date: ${todo.due_date}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>`)
    })

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

})