function getDataProperty(data, returnProperty) {
    return eval(`data.` + returnProperty);
}

function getJSONString(data, returnProperty) {
    const array = [getDataProperty(data, returnProperty)];
    return JSON.stringify(array);
}

function byId(documentC, selector, returnType, returnProperty) {
    const data = documentC.getElementById(selector);
    if (returnType === 'string') return getDataProperty(data, returnProperty);
    if (returnType === 'json') return getJSONString(data, returnProperty);
    return data;
}

function selectorOne(documentC, selector, returnType, returnProperty) {
    const data = documentC.querySelector(selector);
    if (returnType === 'string') return getDataProperty(data, returnProperty);
    if (returnType === 'json') return getJSONString(data, returnProperty);
    return data;
}

function selectorAll(documentC, selector, returnType, returnProperty) {
    const elements = Array.from(documentC.querySelectorAll(selector));
    if (returnType === 'string') return elements.map(e => getDataProperty(e, returnProperty)).join('');
    if (returnType === 'json') return JSON.stringify(elements.map(e => getDataProperty(e, returnProperty)));
}

function byTagName(documentC, selector, returnType, returnProperty) {
    const elements = Array.from(documentC.getElementsByTagName(selector));
    if (returnType === 'string') return elements.map(e => getDataProperty(e, returnProperty)).join('');
    if (returnType === 'json') return JSON.stringify(elements.map(e => getDataProperty(e, returnProperty)));
}
function byClassName(documentC, selector, returnType, returnProperty) {
    const elements = Array.from(documentC.getElementsByClassName(selector));
    if (returnType === 'string') return elements.map(e => getDataProperty(e, returnProperty)).join('');
    if (returnType === 'json') return JSON.stringify(elements.map(e => getDataProperty(e, returnProperty)));
}

function createJSONButton(returnData) {
    const button = document.createElement('button');
    button.classList.add('btn-or-input', 'action-btn');
    button.textContent = 'Open JSON';
    button.addEventListener('click', () => {
        const jsonBlob = new Blob([returnData], {type: 'application/json'});
        const jsonUrl = URL.createObjectURL(jsonBlob);
        window.open(jsonUrl, '_blank');
    });
    return button;
}

function attachDownloadButton(returnType) {
    const button = document.getElementById('button-download');
    button.addEventListener('click', () => {
        const content = document.getElementById('content').innerText;
        const link = document.createElement('a');
        const blob = new Blob([content], {type: returnType === 'json' ? 'application/json' : 'text/plain'});
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', returnType === 'json' ? 'data.json' : 'data.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

async function submitForm() {
    addLoading();
    const url = document.getElementById('url').value;
    const selector = document.getElementById('selector-input').value;
    const selectorType = document.getElementById('selector-type').value;
    const returnType = document.getElementById('return-type').value;
    const returnAs = document.getElementById('return-element-type').value;
    const backBtn = document.getElementById('back');

    try {
        const response = await fetch(`http://localhost:3000/fetchWeb?url=${encodeURIComponent(url)}`);
        const html = await response.text();
        backBtn.disabled = false;
        backBtn.style.color = 'var(--headline-color)';
        switchContainer('data');
        removeLoading();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let returnData;
        switch (selectorType) {
            case 'querySelector':
                returnData = selectorOne(doc, selector, returnType, returnAs);
                break;
            case 'querySelectorAll':
                returnData = selectorAll(doc, selector, returnType, returnAs);
                break;
            case 'getElementById':
                returnData = byId(doc, selector, returnType, returnAs);
                break;
            case 'getElementsByClassName':
                returnData = byClassName(doc, selector, returnType, returnAs);
                break;
            case 'getElementsByTagName':
                returnData = byTagName(doc, selector, returnType, returnAs);
                break;
        }

        if (returnType === 'json') {
            const jsonButton = createJSONButton(returnData);
            document.getElementById('button-container-open').appendChild(jsonButton);
        }

        attachDownloadButton(returnType);

        document.getElementById('content').innerText = returnData;
    } catch (error) {
        console.log(error);
        alert('Error fetching data');
        switchContainer('controls');
    }
}

let rellax = new Rellax('.rellax');
