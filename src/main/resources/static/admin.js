const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e.target)
        }
    })
}

// Получение данных о текущем пользователе
const urlAdmin = "http://localhost:8080/api/admin/current_user"
const currentUser = fetch(urlAdmin).then((response) => response.json())

// Получение списка всех пользователей
const urlAllUser = "http://localhost:8080/api/admin/"
const allUser = fetch(urlAllUser)
    .then((response) => response.json())
    .then(listUsers => {
        let result = ''
        for (const user of listUsers) {
            let roles = user.roles.map(role => role.name).join(', ')
            result += `<tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                    <td>
                        <button type="button" class="btn btn-info btn-sm text-white" id="editUserBtn">Edit</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" id="deleteUserBtn">Delete</button>
                    </td>
                </tr>`
        }
        document.getElementById("users-table").innerHTML = result
    })

// Получение списка ролей
const urlRole = "http://localhost:8080/api/admin/roles"
const listRoles = fetch(urlRole).then(response => response.json())
const fillRole = function (elementId) {
    listRoles.then(roles => {
        let result = ''
        for (const role of roles) {
            result += `<option value=${role.id}>${role.name}</option>`
        }
        document.getElementById(elementId).innerHTML = result
    })
}

fillRole("role_select")

// Получение данных о текущем пользователе
const pageUser = fetch(urlAdmin).then(response => response.json())
pageUser.then((user) => {
    let roles = user.roles.map(role => role.name).join(', ')
    let navbar = `
        <b><span>${user.email}</span></b>
        <span>with roles:</span>
        <span>${roles}</span>`;
    let result = `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
        </tr>`;
    document.getElementById("user-table").innerHTML = result;
    document.getElementById("navbarBrand").innerHTML = navbar;
})

// Обработчик кнопки "Добавить нового пользователя"
const newUserForm = document.getElementById("newUserForm")
newUserForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let nameRole = document.getElementById("role_select")
    let listRoles = []
    let roleValue = ""
    for (let i = 0; i < nameRole.options.length; i++) {
        if (nameRole.options[i].selected) {
            listRoles.push({
                id: nameRole.options[i].value,
                name: nameRole.options[i].text
            })
            roleValue += nameRole.options[i].text + ', '
        }
    }

    fetch(urlAllUser, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("Username").value,
            lastName: document.getElementById("lastName").value,
            age: document.getElementById("age").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            roles: listRoles
        })
    }).then(() => {
        newUserForm.reset()
        allUser.then(listUsers => {
            let result = ''
            for (const user of listUsers) {
                let roles = user.roles.map(role => role.name).join(', ')
                result += `<tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${roles}</td>
                        <td>
                            <button type="button" class="btn btn-info btn-sm text-white" id="editUserBtn">Edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm" id="deleteUserBtn">Delete</button>
                        </td>
                    </tr>`
            }
            document.getElementById("users-table").innerHTML = result
        })
    })
})

// Обработчик кнопки "Редактировать пользователя"
const editUserModel = new bootstrap.Modal(document.getElementById("editUserModal"))
const editId = document.getElementById("id_edit")
const editUsername = document.getElementById("Username_edit")
const editLastName = document.getElementById("lastName_edit")
const editAge = document.getElementById("age_edit")
const editEmail = document.getElementById("email_edit")
const editPassword = document.getElementById("password_edit")
const editRole = document.getElementById("role_edit")
const formEdit = document.getElementById("edit_user_form")

on(document, 'click', '#editUserBtn', e => {
    const fila = e.parentNode.parentNode
    let option = ''
    editId.value = fila.children[0].innerHTML
    editUsername.value = fila.children[1].innerHTML
    editLastName.value = fila.children[2].innerHTML
    editAge.value = fila.children[3].innerHTML
    editEmail.value = fila.children[4].innerHTML
    editPassword.value = fila.children[5].innerHTML
    listRoles.then(roles => {
        roles.forEach(role => {
            let selected = fila.children[6].innerHTML.includes(role.name) ? 'selected' : ''
            option += `<option value="${role.id}" ${selected}>${role.name}</option>`
        })
        editRole.innerHTML = option
    })
    editUserModel.show()
})

formEdit.addEventListener('submit', e => {
    e.preventDefault()
    let nameRoleEdit = document.getElementById("role_edit")
    let listRoleEdit = []
    for (let i = 0; i < nameRoleEdit.options.length; i++) {
        if (nameRoleEdit.options[i].selected) {
            listRoleEdit.push(
                { id: nameRoleEdit.options[i].value, name: nameRoleEdit.options[i].text }
            )
        }
    }

    fetch(urlAllUser, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: editId.value,
            username: editUsername.value,
            lastName: editLastName.value,
            age: editAge.value,
            email: editEmail.value,
            password: editPassword.value,
            roles: listRoleEdit
        })
    })
    editUserModel.hide()
    allUser.then(listUsers => {
        let result = ''
        for (const user of listUsers) {
            let roles = user.roles.map(role => role.name).join(', ')
            result += `<tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                    <td>
                        <button type="button" class="btn btn-info btn-sm text-white" id="editUserBtn">Edit</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" id="deleteUserBtn">Delete</button>
                    </td>
                </tr>`
        }
        document.getElementById("users-table").innerHTML = result
    })
})

// Обработчик кнопки "Удалить пользователя"
on(document, 'click', '#deleteUserBtn', e => {
    const fila = e.parentNode.parentNode
    const id = fila.children[0].innerHTML
    fetch(urlAllUser + id, {
        method: "DELETE"
    }).then(() => {
        fila.parentNode.removeChild(fila)
    })
})

// Обработчик кнопки "Сохранить пользователя"
const saveUserBtn = document.getElementById("saveUserBtn")
saveUserBtn.addEventListener("click", () => {
    newUserForm.submit()
})


