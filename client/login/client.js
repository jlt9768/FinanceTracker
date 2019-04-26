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


const handleRecover = (e) => {
    e.preventDefault();
    
     $("#movingMessage").animate({height:'hide'}, 350);
    
    if($("#user").val() == ''){
        handleError("All fields are required");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    }
    
    sendAjax('POST', $("#recoverForm").attr("action"), $("#recoverForm").serialize(), redirect);
    return false;
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

const RecoverWindow = (props) => {
    return(
    
        <form id="recoverForm" name = "recoverForm"
            onSubmit = {handleRecover}
            action = "/recover"
            method="POST"
            className="mainForm"
        >
        
            
        <label htmlFor="username">Username:</label>
        <input id = "user" type = "text" name = "username" placeholder = "Username"></input>
        <input type = "hidden" name = "_csrf" value = {props.csrf}/>
        
        <input className = "formSubmit" type = "submit" value = "Recover" />
            
            <label id = "text"> Clicking recover will send an email to the user's email with a new password.</label>
        </form>
    
    );
}


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

const createRecoverWindow = (csrf) => {
    ReactDOM.render(
        <RecoverWindow csrf={csrf} />,
        document.querySelector("#content")
    );  
};

//Setup react DOM
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const recoverButton = document.querySelector("#recoverButton");
    
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
    recoverButton.addEventListener("click", (e) => {
       e.preventDefault();
       createRecoverWindow(csrf);
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