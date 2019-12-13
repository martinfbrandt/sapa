import 'whatwg-fetch';
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.add("login", async (email, pw) => {
    const loggedInUser = await fetch('http://localhost:3000/api/login', {
        method:'POST',
        mode: 'cors',
        cache: "no-cache",
        url: 'http://localhost:3000',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email, password: pw})
    });
    const userJson = await loggedInUser.json();
    console.log(sessionStorage)
    sessionStorage.setItem('user', JSON.stringify(userJson));
    console.log(sessionStorage)

})