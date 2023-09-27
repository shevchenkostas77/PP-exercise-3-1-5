const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e.target)
        }
    })
}

const urlAdmin = "http://localhost:8080/api/admin/current_user"
currentUser = fetch(urlAdmin).then((response) => response.json())

const urlAllUser = "http://localhost:8080/api/admin/"
const allUser = fetch(urlAllUser)
    .then((response) => response.json())

allUser.then(listUsers => {
    let result = ''
    for (const i in listUsers) {
        let roles = ''
        listUsers[i].authorities.forEach(authority => {
            roles += ' ';
            roles += authority.name; //  authority.name вместо authority
        });
        result += `<tr>
                <td>${listUsers[i].id}</td>
                <td>${listUsers[i].firstName}</td>
                <td>${listUsers[i].lastName}</td>
                <td>${listUsers[i].age}</td>
                <td>${listUsers[i].email}</td>
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


const urlRole = "http://localhost:8080/api/admin/roles"
const listRoles = fetch(urlRole).then(response => response.json())
const fillRole = function (elementId) {
    listRoles.then(roles => {
        let result = ''
        for (const i in roles) {
            result += `<option value=${roles[i].id}>${roles[i].name}`; // Используйте roles[i].name вместо roles[i]
        }
        document.getElementById(elementId).innerHTML = result
    })
}

fillRole("role_select")

const urlPost = "http://localhost:8080/api/admin/"
const newUserForm = document.getElementById("newUserForm")
document.getElementById("newUserForm")
    .addEventListener("submit", (e) => {
        e.preventDefault()
        let nameRole = document.getElementById("role_select")
        let listRoles = []
        let roleValue = ""
        for (let i = 0; i < nameRole.options.length; i++) {
            if (nameRole.options[i].selected) {
                listRoles.push({
                    id: nameRole.options[i].value,
                    role: nameRole.options[i].innerHTML
                })
                roleValue += nameRole.options[i].innerHTML + ''
            }
        }

        fetch(urlPost, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                age: document.getElementById("age").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                roles: listRoles
            })
        }).then(() => {
            newUserForm.reset()
        })
        document.getElementById("all-users-tab").click()
    })


pageUser = fetch(urlAdmin).then(response => response.json())
pageUser.then((user) => {
    let rol = "";
    user.authorities.forEach((authority) => {
        rol += " ";
        rol += authority.name;
    });
    let navbar = `<b> <span>${user.email}</span></b>
                            <span>with roles:</span>
                            <span>${rol}</span>`;
    let result = "";
    result += `<tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${rol}</td>
                   </tr>`;
    document.getElementById("user-table").innerHTML = result;
    document.getElementById("navbarBrand").innerHTML = navbar;
})


const urlPATCH = "http://localhost:8080/api/admin/"
const editUserModel = new bootstrap.Modal(document.getElementById("editUserModal"));

const editId = document.getElementById("id_edit")
const editFirstName = document.getElementById("firstName_edit")
const editage = document.getElementById("age_edit")
const editPassword = document.getElementById("password_edit")
const editRole = document.getElementById("role_edit")
const editlastName = document.getElementById("lastName_edit")
const editEmail = document.getElementById("email_edit")

const formEdit = document.getElementById("edit_user_form")

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'editUserBtn') {
        const fila = e.target.parentNode.parentNode;
        let option = '';
        editId.value = fila.children[0].innerHTML;
        editFirstName.value = fila.children[1].innerHTML;
        editlastName.value = fila.children[2].innerHTML;
        editEmail.value = fila.children[4].innerHTML;
        editage.value = fila.children[3].innerHTML;
        editPassword.value = fila.children[5].innerHTML;
        listRoles.then(rolList => {
            rolList.forEach(name => {
                let selected = fila.children[6].innerHTML.includes(name.name) ? 'selected' : '';
                option += `<option value="${name.id}" ${selected}>${name.name}</option>`;
            });
            editRole.innerHTML = option;
        });
        editUserModel.show();
    }
});

formEdit.addEventListener('submit', e => {
    e.preventDefault()
    let nameRoleEdit = document.getElementById("role_edit")
    let listRoleEdit = []
    let roleValueEdit = ''

    for (let i = 0; i < nameRoleEdit.options.length; i++) {
        if (nameRoleEdit.options[i].selected) {
            listRoleEdit.push(
                {id: nameRoleEdit.options[i].value,
                    role: nameRoleEdit.options[i].innerHTML})

            roleValueEdit += nameRoleEdit.options[i].innerHTML + ' '
        }
    }
    console.log(listRoleEdit)
    console.log(roleValueEdit)
    fetch(urlPATCH, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: editId.value,
            firstName: editFirstName.value,
            lastName: editlastName.value,
            age: editage.value,
            email: editEmail.value,
            password: editPassword.value,
            roles: listRoleEdit
        })
    }).then(() => {
        editUserModel.hide()
    })
})

const urlDelete = "http://localhost:8080/api/admin/"
const deleteModalBtn = new bootstrap.Modal(document.getElementById("deleteUserModal"))

let rowDelete = null
on(document, 'click', '#deleteUserBtn', e => {
    rowDelete = e.parentNode.parentNode
    document.getElementById('id_delete').value = rowDelete.children[0].innerHTML
    document.getElementById('firstName_delete').value = rowDelete.children[1].innerHTML
    document.getElementById('lastName_delete').value = rowDelete.children[2].innerHTML
    document.getElementById('age_delete').value = rowDelete.children[3].innerHTML
    document.getElementById('email_delete').value = rowDelete.children[4].innerHTML

    let option = ''
    listRoles.then(roles => {
        roles.forEach(role => {
            if (rowDelete.children[5].innerHTML.includes(role.role)) {
                option += `<option value="${role.id}">${role.role}</option>`
            }
        })
        document.getElementById('role_delete').innerHTML = option
    })
    deleteModalBtn.show()
})

document.getElementById('delete_user_form').addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(urlDelete + rowDelete.children[0].innerHTML, {
        method: 'DELETE'
    }).then(() => {
        deleteModalBtn.hide()
        rowDelete.parentNode.removeChild(rowDelete)
    })
})
