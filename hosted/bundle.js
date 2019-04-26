'use strict';

var previousSize = void 0;

// Draw the chart and set the chart values
function drawChart(total, other, monthly, food, clothing) {
    if (total !== 0) {
        var data = google.visualization.arrayToDataTable([['Type', 'Cost'], ['Other', other], ['Monthly', monthly], ['Food', food], ['Clothing', clothing]]);

        // Optional; add a title and set the width and height of the chart
        var options = void 0;
        if ($(window).width() < 1390) {
            options = { 'title': 'Total Spent: $' + total.toFixed(2), 'width': 750, 'height': 600, 'backgroundColor': { fill: 'transparent' }, 'z-index': 0 };
        } else {
            options = { 'title': 'Total Spent: $' + total.toFixed(2), 'width': 850, 'height': 700, 'backgroundColor': { fill: 'transparent' }, 'z-index': 0 };
        }

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    } else {
        var _data = google.visualization.arrayToDataTable([['Type', 'Cost'], ['None', 1]]);

        // Optional; add a title and set the width and height of the chart
        var _options = void 0;
        if ($(window).width() < 1390) {
            _options = { 'title': 'Total Spent: $' + total.toFixed(2), 'width': 750, 'height': 600, 'backgroundColor': { fill: 'transparent' }, 'z-index': 0 };
        } else {
            _options = { 'title': 'Total Spent: $' + total.toFixed(2), 'width': 850, 'height': 700, 'backgroundColor': { fill: 'transparent' }, 'z-index': 0 };
        }

        // Display the chart inside the <div> element with id="piechart"
        var _chart = new google.visualization.PieChart(document.getElementById('piechart'));
        _chart.draw(_data, _options);
    }
}

//Change wether or not the over screen is displayed
var hideOverScreen = function hideOverScreen(state) {
    if (state) {
        document.querySelector("#overScreen").style.display = "none";
        document.querySelector("#blocker").style.display = "none";
    } else {
        document.querySelector("#overScreen").style.display = "block";
        document.querySelector("#blocker").style.display = "block";
    }
};

//Create a post request with data from the finance form
var handleFinance = function handleFinance(e) {
    e.preventDefault();

    $("#movingMessage").animate({ height: 'hide' }, 350);

    if ($("#financeDate").val() == '' || $("#financeItem").val() == '') {
        handleError("All fields are required");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    };

    sendAjax('POST', $("#financeForm").attr("action"), $("#financeForm").serialize(), function () {
        loadFinancesFromServer();
        $("#financeItem").val("");
        $("#financeAmount").val("");
        $("#financeType").val("Other");
        $("#financeDateInput").val("");
    });

    return false;
};

//Create a post request with data from the change form
var handleChange = function handleChange(e) {
    e.preventDefault();

    $("#movingMessage").animate({ height: 'hide' }, 350);

    if ($("#username").val() == '' || $("#password").val() == '' || $("#newPassword").val() == '' || $("#newPassword2").val() == '') {
        handleError("All fields are required");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    };

    if ($("#newPassword").val() !== $("#newPassword2").val()) {
        handleError("Passwords do not match");
        setTimeout(function () {
            $("#movingMessage").animate({ height: 'hide' }, 350);
        }, 3000);
        return false;
    } else {
        sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), function () {});
    }

    hideOverScreen(true);
    return false;
};

//Create a post to upgrade the user account to "Premium"
var handleUpgrade = function handleUpgrade(e) {

    $("#movingMessage").animate({ height: 'hide' }, 350);

    //Using finance form to acquire csrf token
    sendAjax('POST', '/upgrade', $("#financeForm").serialize(), function () {});

    return false;
};

//Update the finances graph based on any data that comes in
var handleGraph = function handleGraph(total, other, monthly, food, clothing) {
    //let totalBar = document.querySelector("#barTotal");
    //let otherBar = document.querySelector("#barOther");
    //let monthlyBar = document.querySelector("#barMonthly");
    //let foodBar = document.querySelector("#barFood");
    //let clothingBar = document.querySelector("#barClothing");
    //
    //
    //totalBar.innerHTML = "Total: $" + total.toFixed(2);
    //otherBar.innerHTML = "Other: $" + other.toFixed(2);
    //monthlyBar.innerHTML = "Monthly: $" + monthly.toFixed(2);
    //foodBar.innerHTML = "Food: $" + food.toFixed(2);
    //clothingBar.innerHTML = "Clothing: $" + clothing.toFixed(2);
    //
    //if(total !== 0){
    //    totalBar.style.width = '100%';
    //    otherBar.style.width = '' + other/total * 100+ '%';
    //    monthlyBar.style.width = '' + monthly/total * 100+ '%';
    //    foodBar.style.width = '' + food/total * 100+ '%';
    //    clothingBar.style.width = '' + clothing/total * 100+ '%';
    //}else{
    //    totalBar.style.width = '0%';
    //    otherBar.style.width = '0%';
    //    monthlyBar.style.width = '0%';
    //    foodBar.style.width = '0%';
    //    clothingBar.style.width = '0%';
    //}
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        drawChart(total, other, monthly, food, clothing);
    });
};

//Show the over screen
var createChangeWindow = function createChangeWindow() {
    hideOverScreen(false);
};

//Update the finances after the filter has been changed
var handleOnChange = function handleOnChange(e) {
    handleGraph(0, 0, 0, 0, 0);
    loadFilteredFromServer();
};

//The React Component for the pop up when upgrade is clicked
var UpgradePop = function UpgradePop(props) {
    return React.createElement(
        'div',
        null,
        'Upgrade to premium today for only $2 USD. You gain access to more options to differentiate types of finances.',
        React.createElement('br', null),
        React.createElement(
            'button',
            { id: 'upgradeSubmit', onClick: handleUpgrade },
            React.createElement(
                'a',
                { href: '/' },
                'Upgrade'
            )
        ),
        React.createElement(
            'button',
            { id: 'exitButton', onClick: function onClick() {
                    return hideOverScreen(true);
                } },
            'Exit'
        )
    );
};

//React component for the finance graph
var FinanceGraph = function FinanceGraph(props) {
    return React.createElement(
        'div',
        { id: 'sticky' },
        React.createElement(
            'h2',
            null,
            'Finances Graph:'
        ),
        React.createElement(
            'div',
            { id: 'barPanel' },
            React.createElement(
                'div',
                { id: 'barTotal' },
                'Total:'
            ),
            React.createElement(
                'div',
                { id: 'barOther' },
                'Other:'
            ),
            React.createElement(
                'div',
                { id: 'barMonthly' },
                'Monthly:'
            ),
            React.createElement(
                'div',
                { id: 'barFood' },
                'Food:'
            ),
            React.createElement(
                'div',
                { id: 'barClothing' },
                'Clothing:'
            )
        )
    );
};

//React component for the change password form
var ChangeForm = function ChangeForm(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'form',
            { id: 'changeForm', name: 'changeForm',
                onSubmit: handleChange,
                action: '/changePass',
                method: 'POST',
                className: 'changeForm'
            },
            React.createElement(
                'label',
                { htmlFor: 'name' },
                'Username: '
            ),
            React.createElement('input', { id: 'username', type: 'text', name: 'username', placeholder: 'Username' }),
            React.createElement('br', null),
            React.createElement(
                'label',
                { htmlFor: 'pass' },
                'Password: '
            ),
            React.createElement('input', { id: 'password', type: 'password', name: 'pass', placeholder: 'Current password' }),
            React.createElement('br', null),
            React.createElement(
                'label',
                { htmlFor: 'newPass' },
                'New Password: '
            ),
            React.createElement('input', { id: 'newPassword', type: 'password', name: 'newPass', placeholder: 'New Password' }),
            React.createElement('br', null),
            React.createElement(
                'label',
                { htmlFor: 'newPass2' },
                'New Password: '
            ),
            React.createElement('input', { id: 'newPassword2', type: 'password', name: 'newPass2', placeholder: 'Confirm new password' }),
            React.createElement('br', null),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeChangeSubmit', type: 'submit', value: 'Change Password' })
        ),
        React.createElement(
            'button',
            { id: 'exitButton', onClick: function onClick() {
                    return hideOverScreen(true);
                } },
            'Exit'
        )
    );
};

//React component for the filters
var Filter = function Filter(props) {
    return React.createElement(
        'div',
        { id: 'reactFilter' },
        React.createElement(
            'label',
            { 'class': 'filterLabel', htmlfor: 'filter' },
            'Type Filter: '
        ),
        React.createElement(
            'select',
            { id: 'filterType', name: 'filter', onChange: handleOnChange },
            React.createElement('option', { value: '', selected: true }),
            React.createElement(
                'option',
                { value: 'Other' },
                'Other'
            ),
            React.createElement(
                'option',
                { value: 'Monthly' },
                'Monthly'
            ),
            React.createElement(
                'option',
                { value: 'Food' },
                'Food'
            ),
            React.createElement(
                'option',
                { value: 'Clothing' },
                'Clothing'
            )
        ),
        '\xA0',
        React.createElement(
            'label',
            { 'class': 'filterLabel', htmlfor: 'filter' },
            'Date Filter: '
        ),
        React.createElement('input', { id: 'filterDate', type: 'date', name: 'date', onChange: handleOnChange })
    );
};

//React Component for premium finance form
var FinanceFormPremium = function FinanceFormPremium(props) {
    return React.createElement(
        'form',
        { id: 'financeForm', name: 'financeForm',
            onSubmit: handleFinance,
            action: '/finance',
            method: 'POST',
            className: 'financeForm'
        },
        React.createElement(
            'div',
            { id: 'topForm' },
            React.createElement(
                'label',
                { htmlFor: 'item' },
                'Item: '
            ),
            React.createElement('input', { id: 'financeItem', type: 'text', name: 'item', placeholder: 'Name of item' }),
            React.createElement(
                'label',
                { id: 'amount', htmlFor: 'amount' },
                'Amount: '
            ),
            React.createElement('input', { id: 'financeAmount', type: 'text', name: 'amount', placeholder: 'Cost of item' })
        ),
        React.createElement(
            'div',
            { id: 'topForm2' },
            React.createElement(
                'label',
                { htmlFor: 'type' },
                'Type: '
            ),
            React.createElement(
                'select',
                { id: 'financeType', name: 'type' },
                React.createElement(
                    'option',
                    { value: 'Other', selected: true },
                    'Other'
                ),
                React.createElement(
                    'option',
                    { value: 'Monthly' },
                    'Monthly'
                ),
                React.createElement(
                    'option',
                    { value: 'Food' },
                    'Food'
                ),
                React.createElement(
                    'option',
                    { value: 'Clothing' },
                    'Clothing'
                )
            ),
            React.createElement(
                'label',
                { htmlFor: 'date' },
                'Date: '
            ),
            React.createElement('input', { id: 'financeDateInput', type: 'date', name: 'date' }),
            React.createElement('input', { id: 'csrf', type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeFinanceSubmit', type: 'submit', value: 'Add Finance' })
        )
    );
};

//React component for normal finance form
var FinanceForm = function FinanceForm(props) {
    return React.createElement(
        'form',
        { id: 'financeForm', name: 'financeForm',
            onSubmit: handleFinance,
            action: '/finance',
            method: 'POST',
            className: 'financeForm'
        },
        React.createElement(
            'label',
            { htmlFor: 'item' },
            'Item: '
        ),
        React.createElement('input', { id: 'financeItem', type: 'text', name: 'item', placeholder: 'Name of item' }),
        React.createElement(
            'label',
            { id: 'amount', htmlFor: 'amount' },
            'Amount: '
        ),
        React.createElement('input', { id: 'financeAmount', type: 'text', name: 'amount', placeholder: 'Cost of item' }),
        React.createElement(
            'label',
            { htmlFor: 'type' },
            'Type: '
        ),
        React.createElement(
            'select',
            { id: 'financeType', name: 'type' },
            React.createElement(
                'option',
                { value: 'Other', selected: true },
                'Other'
            )
        ),
        React.createElement(
            'label',
            { htmlFor: 'date' },
            'Date: '
        ),
        React.createElement('input', { id: 'financeDateInput', type: 'date', name: 'date' }),
        React.createElement('input', { id: 'csrf', type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeFinanceSubmit', type: 'submit', value: 'Add Finance' })
    );
};

//React component for list of finances
//Also updates the graph with the incoming list
var FinanceList = function FinanceList(props) {
    var total = 0;
    var other = 0;
    var monthly = 0;
    var food = 0;
    var clothing = 0;
    if (props.finances.length === 0) {

        return React.createElement(
            'div',
            { className: 'financeList' },
            React.createElement(
                'h3',
                { className: 'emptyFinance' },
                'No Finances Yet'
            )
        );
    };

    var financeNodes = props.finances.map(function (finance) {
        total += finance.amount;
        switch (finance.type) {
            case "Other":
                other += finance.amount;
                break;
            case "Monthly":
                monthly += finance.amount;
                break;
            case "Food":
                food += finance.amount;
                break;
            case "Clothing":
                clothing += finance.amount;
                break;
        }
        return React.createElement(
            'div',
            { key: finance._id, className: 'finance' },
            React.createElement(
                'h3',
                { className: 'financeDate' },
                'Date: \xA0\xA0 ',
                finance.date
            ),
            React.createElement(
                'h3',
                { className: 'financeItem' },
                ' Item: \xA0\xA0   ',
                finance.item
            ),
            React.createElement(
                'h3',
                { className: 'financeAmount' },
                ' Amount: \xA0\xA0    $',
                finance.amount
            ),
            React.createElement(
                'h3',
                { className: 'financeType' },
                ' Type: \xA0\xA0    ',
                finance.type
            )
        );
    });
    handleGraph(total, other, monthly, food, clothing);
    return React.createElement(
        'div',
        { className: 'financeList' },
        financeNodes
    );
};

//Filters the finances that come in form the server
var loadFilteredFromServer = function loadFilteredFromServer() {
    sendAjax('GET', '/getFinances', null, function (data) {
        var filtered = data.finances.filter(function (value, index, arr) {
            if (($("#filterType").val().toLocaleLowerCase() === "" || value.type.toLocaleLowerCase() === $("#filterType").val().toLocaleLowerCase()) && ($("#filterDate").val() === "" || value.date === $("#filterDate").val())) {
                return value;
            }
        });

        ReactDOM.render(React.createElement(FinanceList, { finances: filtered }), document.querySelector("#finances"));
    });
};

//Gets all the finances from the server
var loadFinancesFromServer = function loadFinancesFromServer() {
    sendAjax('GET', '/getFinances', null, function (data) {
        ReactDOM.render(React.createElement(FinanceList, { finances: data.finances }), document.querySelector("#finances"));
    });
};

//Set up the React form
var setup = function setup(csrf) {

    ReactDOM.render(React.createElement(ChangeForm, { csrf: csrf }), document.querySelector("#overScreen"));

    //Check to see if the user is premium
    sendAjax('GET', '/getPremium', null, function (data) {
        if (data.premium) {
            ReactDOM.render(React.createElement(FinanceFormPremium, { csrf: csrf }), document.querySelector("#makeFinance"));
            document.querySelector("#upgradeButton").style.display = "none";
        } else {
            ReactDOM.render(React.createElement(FinanceForm, { csrf: csrf }), document.querySelector("#makeFinance"));
            document.querySelector("#upgradeButton").style.display = "block";
        }
    });

    ReactDOM.render(React.createElement(FinanceList, { finances: [] }), document.querySelector("#finances"));
    ReactDOM.render(React.createElement(Filter, null), document.querySelector("#filter"));

    var changeButton = document.querySelector("#changeButton");
    changeButton.addEventListener("click", function (e) {

        e.preventDefault();
        ReactDOM.render(React.createElement(ChangeForm, { csrf: csrf }), document.querySelector("#overScreen"));
        createChangeWindow(csrf);
        return false;
    });
    var upgradeButton = document.querySelector("#upgradeButton");
    upgradeButton.addEventListener("click", function (e) {

        ReactDOM.render(React.createElement(UpgradePop, null), document.querySelector("#overScreen"));
        e.preventDefault();
        hideOverScreen(false);

        return false;
    });

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        drawChart(0, 1, 1, 1, 1);
    });

    //ReactDOM.render(
    //    <FinanceGraph />, document.querySelector("#graph")
    //);
    handleGraph(0, 0, 0, 0, 0);
    loadFinancesFromServer();

    previousSize = $(window).width();
    // document.querySelector("#barTotal").style.backgroundColor = "#b50000";
    //document.querySelector("#barOther").style.backgroundColor = "#00b500";
    //document.querySelector("#barMonthly").style.backgroundColor = "0000b5";
    // document.querySelector("#barFood").style.backgroundColor = "b5b500";
    // document.querySelector("#barClothing").style.backgroundColor = "b500b5";
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

var checkSize = function checkSize() {
    if ($(window).width() < 1390 && previousSize >= 1390) {
        loadFilteredFromServer();
    } else if ($(window).width() >= 1390 && previousSize < 1390) {
        loadFilteredFromServer();
    }
    previousSize = $(window).width();
};

$(document).ready(function () {
    getToken();
    hideOverScreen(true);
});

$(window).resize(function () {
    checkSize();
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
