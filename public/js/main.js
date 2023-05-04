function removeExtraWhitespace(str) {
    return str.split('\n')
        .map(line => line.trim().replace(/\s+/g, ' '))
        .filter(line => line.length > 0)
        .join('\n');
}

function refreshF() {
    location.replace('/')
    location.reload();
}
function addLoading() {
    let loading = document.getElementById('loading').style.display = 'flex';
}
function removeLoading() {
    let loading = document.getElementById('loading').style.display = 'none';
}

function switchContainer(type) {
    let controlsContainer = document.getElementById('selectors-container');
    let dataContainer = document.getElementById('data-container');
    let backBtn = document.getElementById('back');
    let forwardBtn = document.getElementById('forward');
    if (type === 'data') {
        controlsContainer.style.display = 'none';
        dataContainer.style.display = 'flex';
        forwardBtn.disabled = true;
        forwardBtn.style.color = 'var(--text-color)';
        backBtn.disabled = false;
        backBtn.style.color = 'var(--headline-color)';
    } else {
        controlsContainer.style.display = 'flex';
        dataContainer.style.display = 'none';
        backBtn.disabled = true;
        backBtn.style.color = 'var(--text-color)';
        forwardBtn.disabled = false;
        forwardBtn.style.color = 'var(--headline-color)';

    }
}
const words = ['Scrabbler', 'Getter', 'Scratcher', 'Fetcher'];
const element = document.getElementById('animate-word');
const deleteInterval = 120;
const typeInterval = 120;
const pauseBetweenWords = 1400;

let currentWordIndex = 0;

function deleteWord(word, callback) {
    if (word.length > 0) {
        element.textContent = word.slice(0, -1);
        setTimeout(() => deleteWord(word.slice(0, -1), callback), deleteInterval);
    } else {
        callback();
    }
}

function typeWord(word, callback) {
    if (word.length > 0) {
        element.textContent += word.charAt(0);
        setTimeout(() => typeWord(word.slice(1), callback), typeInterval);
    } else {
        callback();
    }
}

function animateWords() {
    deleteWord(element.textContent, () => {
        setTimeout(() => {
            typeWord(words[currentWordIndex], () => {
                setTimeout(() => {
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                    animateWords();
                }, pauseBetweenWords);
            });
        }, pauseBetweenWords);
    });
}
// Start the animation with the first word
typeWord(words[currentWordIndex], () => {
    setTimeout(() => {
        currentWordIndex++;
        animateWords();
    }, pauseBetweenWords);
});
