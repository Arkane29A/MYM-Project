const partialContainer = document.getElementById('partial-container');

// Load the login partial when the page loads
partialContainer.innerHTML = '<%- include(\'./partials/login.ejs\') %>';

// Load the signup partial when the signup link is clicked
partialContainer.addEventListener('click', async function(e) {
    if (e.target && e.target.id === 'signup-link') {
    e.preventDefault();
    const response = await fetch('/partials/signup', { async: true });
    const html = await response.text();
    partialContainer.innerHTML = html;
    }
});

// Load the login partial when the login link is clicked
partialContainer.addEventListener('click', async function(e) {
    if (e.target && e.target.id === 'login-link') {
    e.preventDefault();
    const response = await fetch('/partials/login', { async: true });
    const html = await response.text();
    partialContainer.innerHTML = html;
    }
});
