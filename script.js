const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#voiceSelect');
const textInput = document.querySelector('#textInput');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const previewButton = document.querySelector('#previewButton');
const highlightedText = document.querySelector('#highlightedText');

let utterance = null;
let voicesLoaded = false;

// Populate voices in the dropdown
function populateVoices() {
    const voices = synth.getVoices();
    voiceSelect.innerHTML = '';

    voices.forEach((voice) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-name', voice.name);
        option.setAttribute('data-lang', voice.lang);
        voiceSelect.appendChild(option);
    });

    voicesLoaded = true;
}

if (!voicesLoaded && typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = populateVoices;
}

// Split text into words for highlighting
function splitTextIntoHTML(text) {
    const words = text.split(' ');
    return words.map(word => `<span class="word">${word}</span>`).join(' ');
}

// Highlight the current word being spoken
function updateHighlightedText(index) {
    const words = highlightedText.querySelectorAll('.word');
    words.forEach((word, i) => {
        if (i === index) {
            word.classList.add('highlight');
        } else {
            word.classList.remove('highlight');
        }
    });
}

// Speak the text with word highlighting
function speak(text) {
    if (synth.speaking) {
        synth.cancel();
    }

    if (text === '') {
        return;
    }

    utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    utterance.voice = voices.find(voice => voice.name === selectedVoice);

    highlightedText.innerHTML = splitTextIntoHTML(text);

    let wordIndex = 0;
    utterance.onboundary = (event) => {
        if (event.name === 'word') {
            updateHighlightedText(wordIndex);
            wordIndex++;
        }
    };

    synth.speak(utterance);
}

// Event listeners for buttons
startButton.addEventListener('click', () => {
    const text = textInput.value;
    speak(text);
});

pauseButton.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
    } else if (synth.paused) {
        synth.resume();
    }
});

previewButton.addEventListener('click', () => {
    const text = textInput.value.split(' ').slice(0, 10).join(' ');
    speak(text);
});

// Populate voices when the page loads
window.onload = function() {
    populateVoices();
};

