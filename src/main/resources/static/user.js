const url = "http://localhost:8080/api/user/"
console.log("")
currentUser = fetch(url).then((response) => response.json())

currentUser.then((user) =>{
    const role = user.authorities[0].name.toString();
    let result = "";
    result += `<tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${role}</td>
                   </tr>`;
    let navbar = `<b> <span>${user.email}</span></b>
                            <span>with roles:</span>
                            <span>${role}</span>`;
    document.getElementById("tableUser").innerHTML = result;
    document.getElementById("navbarBrand").innerHTML = navbar;
})
