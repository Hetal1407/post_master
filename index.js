//Utility function
//1. Utility function to get DOM element from string
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

//Initialize number of parameters
let addedParamCount = 0;

//Hide the parameter box initially
let parameterBox = document.getElementById('parameterBox');
parameterBox.style.display = 'none';

//If the user clicks on params box,hide the json box
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJson').style.display = 'none';
    document.getElementById('parameterBox').style.display = 'block';
})

//If the user clicks on json box,hide the params box
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('parameterBox').style.display = 'none';
    document.getElementById('requestJson').style.display = 'block';
})

//If the user clicks on + button ,add more parameters
let addParam = document.getElementById('addParam');
addParam.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = ` <div class="form-row my-3">
                        <label for="url" class="col-sm-2 col-form-label">Parameter${addedParamCount + 2}</label>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Enter parmeter${addedParamCount + 2} key">
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Enter parameter${addedParamCount + 2} value">
                        </div>
                        <button class="btn btn-primary deleteParam">-</button>
                    </div>`;
    //COnvert the element string to DOM node
    let paramElement = getElementFromString(string);
    params.appendChild(paramElement);

    //Add an event listener to remove the parameter on clicking - button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (item of deleteParam) {
        item.addEventListener('click', (e) => {
            //TODO : add a confirmationbox to confrim parameter deletion
            e.target.parentElement.remove();
        })
    }

    addedParamCount++;
})

//If user clicks on the submit button
let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    //Show please wait in the response box to request patience from the user
    // document.getElementById('responseJsonText').value = "Please wait...Fetching response...";
    document.getElementById('responsePrism').innerHTML = "Please wait...Fetching response...";

    //Fetch all the values user has entered
    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

    //if user has used params option instead of json,collect all the params in an object
    if (contentType == 'params') {
        data = {};
        for (i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }
            data = JSON.stringify(data);
        }
    }
    else {
        data = document.getElementById('responsePrism').value;
    }
    //log all the values in the console for debugging
    console.log('URL is', url);
    console.log('request Type is', requestType);
    console.log('content Type is', contentType);
    console.log('Data is', data);

    //If the request type is GET , invoke fetch API to create a post request
    if (requestType == 'GET') {
        fetch(url, {
            method: 'GET',
        })
            .then(response => response.text())
            .then((text) => {
                // document.getElementById('responseJsonText').value = text;
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            });
    }

    else {
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.text())
            .then((text) => {
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            });
    }
});