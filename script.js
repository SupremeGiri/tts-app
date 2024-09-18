const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#voiceSelect');
const textInput = document.querySelector('#textInput');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const previewButton = document.querySelector('#previewButton');
const highlightedText = document.querySelector('#highlightedText');

// Function to populate voices in the dropdown
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
}

// Populate voices on page load
if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = populateVoices;
} else {
    populateVoices();
}

// Function to split text into HTML for highlighting
function splitTextIntoHTML(text) {
    const words = text.split(' ');
    return words.map(word => `<span class="word">${word}</span>`).join(' ');
}

// Function to update highlighted text
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

// Function to speak the text and highlight words
function speak(text) {
    if (synth.speaking) {
        console.error('SpeechSynthesis is already speaking.');
        return;
    }

    if (text === '') {
        console.error('No text input.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    utterance.voice = voices.find((voice) => voice.name === selectedOption);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Split text into HTML and set it
    highlightedText.innerHTML = splitTextIntoHTML(text);

    utterance.onboundary = (event) => {
        const { charIndex, name } = event;
        if (name === 'word') {
            const words = highlightedText.querySelectorAll('.word');
            let wordIndex = 0;
            let charCount = 0;
            words.forEach((word, index) => {
                charCount += word.textContent.length + 1; // +1 for space
                if (charIndex < charCount) {
                    wordIndex = index;
                }
            });
            updateHighlightedText(wordIndex);
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
    if (synth.speaking) {
        synth.pause();
    }
});

previewButton.addEventListener('click', () => {
    const text = textInput.value;
    if (synth.speaking) {
        synth.cancel();
    }
    const previewUtterance = new SpeechSynthesisUtterance(text);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    previewUtterance.voice = voices.find((voice) => voice.name === selectedOption);
    previewUtterance.rate = 1;
    previewUtterance.pitch = 1;
    previewUtterance.volume = 1;
    synth.speak(previewUtterance);
});
