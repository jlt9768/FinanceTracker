//Handle login post request
const handleLogin = (e) => {
    e.preventDefault();
    
    $("#movingMessage").animate({height:'hide'},350);
    
    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("Username or password is empty");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    };
    
    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    
    return false;
};

//Handle signup post request
const handleSignup = (e) => {
    e.preventDefault();
    $("#movingMessage").animate({height:'hide'}, 350);
    
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
        handleError("All fields are required");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    }
    
    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
};

//React Component for the login form
const LoginWindow = (props) => {
    return(
        
        <form id="loginForm" name = "loginForm"
            onSubmit = {handleLogin}
            action = "/login"
            method="POST"
            className="mainForm"
        >
        
        <label htmlFor="username">Username: </label>
        <input id = "user" type="text" name="username" placeholder = "username"/>
        <label htmlFor="pass">Password: </label>
        <input id = "pass" type="password" name="pass" placeholder = "password"/>
        <input type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "formSubmit" type = "submit" value = "Sign in" />
        </form>
    );  
};


//React component for the sign up form
const SignupWindow = (props) => {
    return(
        <form id="signupForm" name = "signupForm"
            onSubmit = {handleSignup}
            action = "/signup"
            method="POST"
            className="mainForm"
        >
        
            
        <label htmlFor="email">Email:</label>
        <input id = "email" type = "text" name = "email" placeholder = "email"></input>
        <label htmlFor="username">Username: </label>
        <input id = "user" type="text" name="username" placeholder = "username"></input>
        <label htmlFor="pass">Password: </label>
        <input id = "pass" type="password" name="pass" placeholder = "password"></input>
        <label htmlFor="pass2">Password: </label>
        <input id = "pass2" type="password" name="pass2" placeholder = "retype password"></input>
        <input type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "formSubmit" type = "submit" value = "Sign Up" />
        </form>
    );  
};

//Create login window on react DOM
const createLoginWindow = (csrf) => {
    ReactDOM.render(
      <LoginWindow csrf={csrf} />,
      document.querySelector("#content")
    );
};

//Create signup window on react DOM
const createSignupWindow = (csrf) => {
    ReactDOM.render(
      <SignupWindow csrf={csrf} />,
      document.querySelector("#content")
    );
};

//Setup react DOM
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    
    signupButton.addEventListener("click", (e) => {
       e.preventDefault();
       createSignupWindow(csrf);
       return false;
    });
    
    loginButton.addEventListener("click", (e) => {
       e.preventDefault();
       createLoginWindow(csrf);
       return false;
    });
    
    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
       setup(result.csrfToken); 
    });
};

$(document).ready(function() {
    getToken();
});