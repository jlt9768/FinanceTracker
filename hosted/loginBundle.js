"use strict";

//Handle login post request
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#movingMessage").animate({ height: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    };

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

//Handle signup post request
var handleSignup = function handleSignup(e) {
    e.preventDefault();
    $("#movingMessage").animate({ height: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
};

var handleRecover = function handleRecover(e) {
    e.preventDefault();

    $("#movingMessage").animate({ height: 'hide' }, 350);

    if ($("#user").val() == '') {
        handleError("All fields are required");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    }

    sendAjax('POST', $("#recoverForm").attr("action"), $("#recoverForm").serialize(), redirect);
    return false;
};

//React Component for the login form
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm", name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    );
};

//React component for the sign up form
var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm", name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "email" },
            "Email:"
        ),
        React.createElement("input", { id: "email", type: "text", name: "email", placeholder: "email" }),
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
    );
};

var RecoverWindow = function RecoverWindow(props) {
    return React.createElement(
        "form",
        { id: "recoverForm", name: "recoverForm",
            onSubmit: handleRecover,
            action: "/recover",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username:"
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Recover" }),
        React.createElement(
            "label",
            { id: "text" },
            " Clicking recover will send an email to the user's email with a new password."
        )
    );
};

//Create login window on react DOM
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

//Create signup window on react DOM
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createRecoverWindow = function createRecoverWindow(csrf) {
    ReactDOM.render(React.createElement(RecoverWindow, { csrf: csrf }), document.querySelector("#content"));
};

//Setup react DOM
var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");
    var recoverButton = document.querySelector("#recoverButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
    recoverButton.addEventListener("click", function (e) {
        e.preventDefault();
        createRecoverWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#movingMessage").animate({ height: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#movingMessage").animate({ height: 'hide' }, 0);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
