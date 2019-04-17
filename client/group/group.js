
//Create a post request with data from the finance form
const handleGroup = (e) => {
    e.preventDefault();
    
    $("#movingMessage").animate({height:'hide'}, 350);
    
    if($("#groupName").val() == ''){
        handleError("A name is required");
        setTimeout(() => {
          $("#movingMessage").animate({height:'hide'}, 350);
        }, 3000);
        return false;
    };
    
    sendAjax('POST', $("#groupForm").attr("action"), $("#groupForm").serialize(), function() {
       loadGroupsFromServer();
    });
    
    return false;
};

//React component for normal finance form
const GroupForm= (props) => {
    return(
        <form id="groupForm" name = "groupForm"
            onSubmit = {handleGroup}
            action = "/groups"
            method="POST"
            className="groupForm"
        >
        
        
        <label htmlFor="name">Group Name: </label>
        <input id = "groupName" type="text" name="name" placeholder = "Name of group"/>
        
        <input id = "csrf" type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "makeGroupSubmit" type = "submit" value = "Create" />
        </form>

    );  
};

//React component for list of finances
//Also updates the graph with the incoming list
const GroupList = function(props) {
    if(props.groups.length === 0){    
      return(
          <div className ="groupList">
              <h3 className = "emptyGroup">No Groups Yet</h3>
          </div>
      );  
    };
    
    const groupNodes = props.groups.map(function(group) {
            return(
            <div key={group._id} className = "group">
                
                <h3 className = "groupName">Group: &nbsp;&nbsp; {group.name}</h3>
                    
            </div>     
        );
         
    });
    return(
        <div className ="groupList">
            {groupNodes}
        </div>
    );
};

//Gets all the finances from the server
const loadGroupsFromServer = () => {
    sendAjax('GET', '/getGroups', null, (data) => {
       ReactDOM.render(
            <GroupList groups={data.groups}/>, document.querySelector("#groups")
       ); 
    });
};

//Set up the React form
const setup = function(csrf){   
    
    
    ReactDOM.render(
        <GroupForm csrf={csrf} />, document.querySelector("#makeGroups")
    );
      
    
    
    ReactDOM.render(
        <GroupList groups= {[]} />, document.querySelector("#groups")
    );
    
    loadGroupsFromServer();

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    }); 
};

$(document).ready(function() {
   getToken();
   
});
