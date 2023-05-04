function byId(documentC, selector, type, returnC) {
    let data = documentC.getElementById(selector);
    switch (type) {
        case 'string':
            return eval(`data.`+returnC)
        case 'json':
            let array = [];
            array.push(eval('data.'+returnC));
            return JSON.stringify(array)
    }
    return data;
}
function selectorOne(documentC, selector, type, returnC) {
    let data = documentC.querySelector(selector);

    switch (type) {
        case 'string':
            return eval(`data.`+returnC)
        case 'json':
            let array = [];
            array.push(eval('data.'+returnC));
            return JSON.stringify(array)
    }

    return data;
}
function selectorAll(documentC, selector, type, returnC) {
    let data = '';

    switch(type) {
        case 'string':
            for(let e of documentC.querySelectorAll(selector)) {
                data += eval(`e.`+returnC);
            }
            return data;
        case 'json':
            let myArray = [];
            for(let e of documentC.querySelectorAll(selector)) {
                myArray.push(eval(`e.`+returnC));
            }
            let json = JSON.stringify(myArray);
            return json;
    }
    return data;
}

async function submitForm() {
    addLoading()
    let url = document.getElementById('url').value;
    let selector = document.getElementById('selector-input').value;
    let selectorType = document.getElementById('selector-type').value;
    let returnType = document.getElementById('return-type').value;
    let returnAs = document.getElementById('return-element-type').value;
    let backBtn = document.getElementById('back');
    try {
        const response = await fetch(`http://localhost:3000/fetchWeb?url=${encodeURIComponent(url)}`);
        const html = await response.text();
        backBtn.disabled = false;
        backBtn.style.color = 'var(--headline-color)';
        switchContainer('data');
        removeLoading()
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let returnData;
        switch(selectorType) {
            case 'querySelector':
                returnData = selectorOne(doc, selector, returnType, returnAs);
                break;
            case 'querySelectorAll':
                returnData = selectorAll(doc, selector, returnType, returnAs);
                break;
            case 'getElementById':
                returnData = byId(doc, selector, returnType, returnAs);
                break;
        }
        if (returnType === 'json') {
            // create button to open JSON in new tab
            document.getElementById('button-container-open').innerHTML = `<button class="btn-or-input action-btn" type="button" id="jsonButton">Open JSON</button>`;
            let jsonButton = document.getElementById('jsonButton');
            jsonButton.addEventListener('click', () => {
                const jsonBlob = new Blob([returnData], {type: 'application/json'});
                const jsonUrl = URL.createObjectURL(jsonBlob);
                window.open(jsonUrl, '_blank');
            });
        }
        document.getElementById('button-download').addEventListener('click', () => {
            const content = document.getElementById('content').innerText;
            const link = document.createElement('a');
            if (returnType === 'json') {
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'data.json');
            } else {
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'data.txt');
            }
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        document.getElementById('content').innerText = returnData;
    } catch (error) {
        console.log(error);
        alert('Error fetching data');
        switchContainer('controls')
    }
}
let rellax = new Rellax('.rellax');
