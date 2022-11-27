const API_KEY ="jnfvbbeLpsiHCJFKp7D9UX8Aeqo";
const URL = "https://ci-jshint.herokuapp.com/api";
const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));

document.getElementById("status").addEventListener("click", e=> getStatus(e));
document.getElementById("submit").addEventListener("click", e=> postForm(e));
async function getStatus(e) {
    const queryString = `${URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if(response.ok){
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}
function displayStatus(data) {
    let heading ="API Key Status";
    let results = `<div>Your Key is valid until</div>`;
    document.getElementById("resultModalTitle").innerText = heading;
    document.getElementById("result-content").innerHTML=results+ data.expiry;
    resultModal.show();
}

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));
    const response = await fetch(URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body:form,
                        });
    const data = await response.json();
    if(response.ok) {
        console.log("bijo");

        console.log(data);

        displayResult(data);
    } else {
        displayError(data);
        throw new Error(data.error);
    }
}

function displayError(error) {
    let heading = "An Exception Occured";
    let errorData = `<div> The API returned status code ${error.status_code}</div>`;
    errorData += `<div>Error number:<strong> ${error.error_no}</strong></div>`;
    errorData += `<div>Error text :<strong> ${error.error}</strong> </div>`;
    document.getElementById("resultModalTitle").innerText = heading;
    document.getElementById("result-content").innerHTML = errorData;
    resultModal.show();
}

function displayResult(data) {
    let heading = `JSHint results for ${data.file}`;
    let results="";
    if( data.total_errors === 0 ) {
        results =`<div class="no_errors"> No Errors reported!</div>`;
    } else {
        results =`<div> Total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let er of data.error_list) {
            results += `<div> At Line <span class ="line">${er.line}</span>`;
            results +=`<div>column <span class="col">${er.col}</span></div>`;
            results += `<div class="error">${er.error}</div>`
        }
    }
    document.getElementById("resultModalTitle").innerText = heading;
    document.getElementById("result-content").innerHTML = results;
    resultModal.show()
}