//Change wether or not the over screen is displayed
const hideOverScreen = (state) => {
    if(state){
        document.querySelector("#overScreen").style.display = "none";
        document.querySelector("#blocker").style.display = "none";
    }else{
        document.querySelector("#overScreen").style.display = "block";
        document.querySelector("#blocker").style.display = "block";
    }
}

//Create a post request with data from the finance form
const handleFinance = (e) => {
    e.preventDefault();
    
    $("#movingMessage").animate({height:'hide'}, 350);
    
    if($("#financeDate").val() == '' || $("#financeItem").val() == '' ){
        handleError("All fields are required");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    };
    
    sendAjax('POST', $("#financeForm").attr("action"), $("#financeForm").serialize(), function() {
       loadFinancesFromServer();
        $("#financeItem").val("");
        $("#financeAmount").val("");
        $("#financeType").val("Other");
        $("#financeDateInput").val("");
    });
    
    return false;
};

//Create a post request with data from the change form
const handleChange = (e) => {
    e.preventDefault();
    
    $("#movingMessage").animate({height:'hide'}, 350);
    
    if($("#username").val() == '' || $("#password").val() == '' || $("#newPassword").val() == '' || $("#newPassword2").val() == '' ){
        handleError("All fields are required");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    };
    
    
    
    if( $("#newPassword").val() !== $("#newPassword2").val()){
        handleError("Passwords do not match");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    }else{
        sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), function() {
       
        });
    }
    
    
    hideOverScreen(true);
    return false;
};

//Create a post to upgrade the user account to "Premium"
const handleUpgrade = (e) => {
    
    $("#movingMessage").animate({height:'hide'}, 350);
     
    
    //Using finance form to acquire csrf token
    sendAjax('POST', '/upgrade', $("#financeForm").serialize(), function() {
    });
    
    return false;
};


//Update the finances graph based on any data that comes in
const handleGraph= (total, other, monthly, food, clothing) => {
    let totalBar = document.querySelector("#barTotal");
    let otherBar = document.querySelector("#barOther");
    let monthlyBar = document.querySelector("#barMonthly");
    let foodBar = document.querySelector("#barFood");
    let clothingBar = document.querySelector("#barClothing");
    
    
    totalBar.innerHTML = "Total: $" + total.toFixed(2);
    otherBar.innerHTML = "Other: $" + other.toFixed(2);
    monthlyBar.innerHTML = "Monthly: $" + monthly.toFixed(2);
    foodBar.innerHTML = "Food: $" + food.toFixed(2);
    clothingBar.innerHTML = "Clothing: $" + clothing.toFixed(2);
    
    if(total !== 0){
        totalBar.style.width = '100%';
        otherBar.style.width = '' + other/total * 100+ '%';
        monthlyBar.style.width = '' + monthly/total * 100+ '%';
        foodBar.style.width = '' + food/total * 100+ '%';
        clothingBar.style.width = '' + clothing/total * 100+ '%';
    }else{
        totalBar.style.width = '0%';
        otherBar.style.width = '0%';
        monthlyBar.style.width = '0%';
        foodBar.style.width = '0%';
        clothingBar.style.width = '0%';
    }
    
    
}

//Show the over screen
const createChangeWindow = () => {
    hideOverScreen(false);
};

//Update the finances after the filter has been changed
const handleOnChange = (e) =>{
    handleGraph(0,0,0,0,0);
    loadFilteredFromServer();
};

//The React Component for the pop up when upgrade is clicked
const UpgradePop = (props) => {
    return(
        <div>
        
            Upgrade to premium today for only $2 USD. You gain access to more options to differentiate types of finances.
            <br></br>
            <button id="upgradeSubmit" onClick={handleUpgrade} ><a href = "/">Upgrade</a></button>
            <button id="exitButton" onClick={() => hideOverScreen(true)}>Exit</button>
        </div>
    );
};

//React component for the finance graph
const FinanceGraph = (props) => {
    return(
        <div id = "sticky">
        <h2>Finances Graph:</h2>
        <div id="barPanel">
            <div id="barTotal">Total:</div>
            <div id="barOther">Other:</div>
            <div id="barMonthly">Monthly:</div>
            <div id="barFood">Food:</div>
            <div id="barClothing">Clothing:</div>    
        </div>     
        </div>
        
    );
}

//React component for the change password form
const ChangeForm = (props) => {
    return(
        <div>
      <form id="changeForm" name = "changeForm"
            onSubmit = {handleChange}
            action = "/changePass"
            method="POST"
            className="changeForm"
        >
        
        
        <label htmlFor="name">Username: </label>
        <input id = "username" type="text" name="username" placeholder = "Username"/>
        <br></br>
        <label htmlFor="pass">Password: </label>
        <input id = "password" type="password" name="pass" placeholder = "Current password"/>
        <br></br>
        <label htmlFor="newPass">New Password: </label>
        <input id = "newPassword" type="password" name="newPass" placeholder = "New Password"/>
        <br></br>
        <label htmlFor="newPass2">New Password: </label>
        <input id = "newPassword2" type="password" name="newPass2" placeholder = "Confirm new password"/>
        <br></br>
        <input type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "makeChangeSubmit" type = "submit" value = "Change Password" />
        </form>
        <button id="exitButton" onClick={() => hideOverScreen(true)}>Exit</button>
    </div>
  );    
};

//React component for the filters
const Filter = (props) => {
  return(
      <div id="reactFilter">
        <label class = "filterLabel" htmlfor="filter">Type Filter: </label>
        <select id = "filterType" name = "filter" onChange={handleOnChange}>
            <option value="" selected></option>
            <option value="Other" >Other</option>
            <option value="Monthly">Monthly</option>
            <option value="Food">Food</option>
            <option value="Clothing">Clothing</option>
        </select>
          &nbsp;
        <label class = "filterLabel" htmlfor="filter">Date Filter: </label>
        <input id = "filterDate" type="date" name="date" onChange={handleOnChange}/>
      </div>
  
  );  
};

//React Component for premium finance form
const FinanceFormPremium = (props) => {
    return(
        <form id="financeForm" name = "financeForm"
            onSubmit = {handleFinance}
            action = "/finance"
            method="POST"
            className="financeForm"
        >
        
        
        <label htmlFor="item">Item: </label>
        <input id = "financeItem" type="text" name="item" placeholder = "Name of item"/>
        <label id = "amount" htmlFor="amount">Amount: </label>
        <input id = "financeAmount" type="text" name="amount" placeholder = "Cost of item"/>
        <label htmlFor="type">Type: </label>
        <select id = "financeType" name = "type">
            <option value="Other" selected>Other</option>
            <option value="Monthly">Monthly</option>
            <option value="Food">Food</option>
            <option value="Clothing">Clothing</option>
        </select>
            <label htmlFor="date">Date: </label>
        <input id = "financeDateInput" type="date" name="date"/>
        <input id = "csrf" type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "makeFinanceSubmit" type = "submit" value = "Add Finance" />
        </form>
        

    );  
};

//React component for normal finance form
const FinanceForm= (props) => {
    return(
        <form id="financeForm" name = "financeForm"
            onSubmit = {handleFinance}
            action = "/finance"
            method="POST"
            className="financeForm"
        >
        
        
        <label htmlFor="item">Item: </label>
        <input id = "financeItem" type="text" name="item" placeholder = "Name of item"/>
        <label id = "amount" htmlFor="amount">Amount: </label>
        <input id = "financeAmount" type="text" name="amount" placeholder = "Cost of item"/>
        <label htmlFor="type">Type: </label>
        <select id = "financeType" name = "type">
            <option value="Other" selected>Other</option>
        </select>
            <label htmlFor="date">Date: </label>
        <input id = "financeDateInput" type="date" name="date"/>
        <input id = "csrf" type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "makeFinanceSubmit" type = "submit" value = "Add Finance" />
        </form>
        

    );  
};

//React component for list of finances
//Also updates the graph with the incoming list
const FinanceList = function(props) {
    let total = 0;
    let other = 0;
    let monthly = 0;
    let food = 0;
    let clothing = 0;
    if(props.finances.length === 0){
      
      return(
          <div className ="financeList">
              <h3 className = "emptyFinance">No Finances Yet</h3>
          </div>
      );  
    };
    
    const financeNodes = props.finances.map(function(finance) {
            total += finance.amount;
            switch(finance.type){
                case "Other":
                    other += finance.amount
                    break;
                case "Monthly":
                    monthly += finance.amount
                    break;
                case "Food":
                    food += finance.amount
                    break;
                case "Clothing":
                    clothing += finance.amount
                    break;
            }
            return(
            <div key={finance._id} className = "finance">
                
                <h3 className = "financeDate">Date: &nbsp;&nbsp; {finance.date}</h3>
                <h3 className = "financeItem"> Item: &nbsp;&nbsp;   {finance.item}</h3>
                <h3 className = "financeAmount"> Amount: &nbsp;&nbsp;    ${finance.amount}</h3>
                <h3 className = "financeType"> Type: &nbsp;&nbsp;    {finance.type}</h3>
                    
            </div>     
        );
         
    });
    handleGraph(total,other,monthly,food,clothing);
    return(
        <div className ="financeList">
            {financeNodes}
        </div>
    );
};

//Filters the finances that come in form the server
const loadFilteredFromServer = () =>{
    sendAjax('GET', '/getFinances', null, (data) => {
       let filtered = data.finances.filter(function(value,index,arr){
            if(($("#filterType").val().toLocaleLowerCase() === "" || value.type.toLocaleLowerCase() === $("#filterType").val().toLocaleLowerCase()) 
               && ($("#filterDate").val() === "" || value.date === $("#filterDate").val())){
                 return value;
            }
       });
       
       ReactDOM.render(
            <FinanceList finances={filtered}/>, document.querySelector("#finances")
       ); 
    });
}

//Gets all the finances from the server
const loadFinancesFromServer = () => {
    sendAjax('GET', '/getFinances', null, (data) => {
       ReactDOM.render(
            <FinanceList finances={data.finances}/>, document.querySelector("#finances")
       ); 
    });
};

//Set up the React form
const setup = function(csrf){   
    
    ReactDOM.render(
      <ChangeForm csrf={csrf} />,
      document.querySelector("#overScreen")
    );    
    
    //Check to see if the user is premium
    sendAjax('GET', '/getPremium', null, (data) => {      
       if(data.premium){
           ReactDOM.render(
                <FinanceFormPremium csrf={csrf} />, document.querySelector("#makeFinance")
           );
           document.querySelector("#upgradeButton").style.display = "none";
       }else{
           ReactDOM.render(
               <FinanceForm csrf={csrf} />, document.querySelector("#makeFinance")
           );
           document.querySelector("#upgradeButton").style.display = "block";
       }
    });
    
    
    
    ReactDOM.render(
        <FinanceList finances= {[]} />, document.querySelector("#finances")
    );
    ReactDOM.render(
        <Filter />, document.querySelector("#filter")
    );
    
    const changeButton = document.querySelector("#changeButton");
    changeButton.addEventListener("click", (e) => {
        
       e.preventDefault();
        ReactDOM.render(
          <ChangeForm csrf={csrf} />,
          document.querySelector("#overScreen")
        );
       createChangeWindow(csrf);
       return false;
    });
    const upgradeButton = document.querySelector("#upgradeButton");
    upgradeButton.addEventListener("click", (e) => {
        
        ReactDOM.render(
          <UpgradePop />,
          document.querySelector("#overScreen")
        );
       e.preventDefault();
       hideOverScreen(false);
        
       return false;
    });
    
    
    
    ReactDOM.render(
        <FinanceGraph />, document.querySelector("#graph")
    );
    handleGraph(0,0,0,0,0);
    loadFinancesFromServer();
    
    document.querySelector("#barTotal").style.backgroundColor = "#b50000";
   document.querySelector("#barOther").style.backgroundColor = "#00b500";
   document.querySelector("#barMonthly").style.backgroundColor = "0000b5";
    document.querySelector("#barFood").style.backgroundColor = "b5b500";
    document.querySelector("#barClothing").style.backgroundColor = "b500b5";
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    }); 
};

$(document).ready(function() {
   getToken();
   hideOverScreen(true);
   
});

