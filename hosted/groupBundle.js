'use strict';

var handleChoice = function handleChoice(e) {
    e.preventDefault();

    sendAjax('POST', '/setGroup', $("#" + e.currentTarget.id).serialize(), function () {
        //window.location = '/finance';
        window.location = '/finance';
    });

    return false;
};

//Create a post request with data from the finance form
var handleGroup = function handleGroup(e) {
    e.preventDefault();

    $("#movingMessage").animate({ height: 'hide' }, 350);

    if ($("#groupName").val() == '') {
        handleError("A name is required");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    };

    sendAjax('POST', $("#groupForm").attr("action"), $("#groupForm").serialize(), function () {
        loadGroupsFromServer();
    });

    return false;
};

//React component for normal finance form
var GroupForm = function GroupForm(props) {
    return React.createElement(
        'form',
        { id: 'groupForm', name: 'groupForm',
            onSubmit: handleGroup,
            action: '/groups',
            method: 'POST',
            className: 'groupForm'
        },
        React.createElement(
            'div',
            { id: 'groupFormDiv' },
            React.createElement(
                'label',
                { htmlFor: 'name' },
                'Group Name: '
            ),
            React.createElement('input', { id: 'groupName', type: 'text', name: 'name', placeholder: 'Name of group' }),
            React.createElement('input', { id: 'csrf', type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeGroupSubmit', type: 'submit', value: 'Create' })
        )
    );
};

//React component for list of finances
//Also updates the graph with the incoming list
var GroupList = function GroupList(props) {
    if (props.groups.length === 0) {
        return React.createElement(
            'div',
            { className: 'groupList' },
            React.createElement(
                'h3',
                { className: 'emptyGroup' },
                'No Groups Yet'
            )
        );
    };

    var groupNodes = props.groups.map(function (group) {
        return (
            //<div key={group._id} className = "group">
            //    
            //    <h3 className = "groupName">Group: &nbsp;&nbsp; {group.name}</h3>
            //    <button onClick = {() => {handleChoice(group.name);}}>Choose</button>
            //</div>
            React.createElement(
                'form',
                { key: group._id, id: group.name, name: 'choiceForm',
                    onSubmit: handleChoice,
                    action: '/setGroup',
                    method: 'POST',
                    className: 'choiceForm'
                },
                React.createElement(
                    'div',
                    { className: 'groupDiv' },
                    React.createElement(
                        'label',
                        { htmlFor: 'name' },
                        'Group: '
                    ),
                    React.createElement(
                        'label',
                        { id: 'groupNameInd', name: 'name' },
                        group.name
                    ),
                    React.createElement('input', { id: "nameID" + group.name, type: 'hidden', name: 'name', value: group.name }),
                    React.createElement('input', { id: 'csrf', type: 'hidden', name: '_csrf', value: csrf.value }),
                    React.createElement('input', { className: 'chooseGroupSubmit', type: 'submit', value: 'Choose' })
                )
            )
        );
    });
    return React.createElement(
        'div',
        { className: 'groupList' },
        groupNodes
    );
};

//Gets all the finances from the server
var loadGroupsFromServer = function loadGroupsFromServer() {
    sendAjax('GET', '/getGroups', null, function (data) {
        ReactDOM.render(React.createElement(GroupList, { groups: data.groups }), document.querySelector("#groups"));
    });
};

//Set up the React form
var setup = function setup(csrf) {

    ReactDOM.render(React.createElement(GroupForm, { csrf: csrf }), document.querySelector("#makeGroups"));

    ReactDOM.render(React.createElement(GroupList, { csrf: csrf, groups: [] }), document.querySelector("#groups"));

    loadGroupsFromServer();
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
