
const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#voiceSelect');
const textInput = document.querySelector('#textInput');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const previewButton = document.querySelector('#previewButton');

let utterance = null;

// Populate the voice selection dropdown
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

// Ensure voices are loaded before populating
if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = populateVoices;
}

// Function to speak the text using the selected voice
function speak(text) {
    if (synth.speaking) {
        console.error('SpeechSynthesis is already speaking.');
        return;
    }

    if (text === '') {
        console.error('No text input.');
        return;
    }

    utterance = new SpeechSynthesisUtterance(text);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    utterance.voice = voices.find((voice) => voice.name === selectedOption);
    
    // Adjust properties for smoother pronunciation
    utterance.rate = 1;    // Normal rate
    utterance.pitch = 1;   // Normal pitch
    utterance.volume = 1;  // Maximum volume

    synth.speak(utterance);
}

// Function to handle the Start button click
startButton.addEventListener('click', () => {
    const text = textInput.value;
    speak(text);
});

// Function to handle the Pause button click
pauseButton.addEventListener('click', () => {
    if (synth.speaking) {
        synth.pause();
    }
});

// Function to handle the Preview button click
previewButton.addEventListener('click', () => {
    const text = textInput.value;

    if (synth.speaking) {
        synth.cancel();
    }

    const previewUtterance = new SpeechSynthesisUtterance(text);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    previewUtterance.voice = voices.find((voice) => voice.name === selectedOption);

    // Adjust properties for preview
    previewUtterance.rate = 1;    // Normal rate
    previewUtterance.pitch = 1;   // Normal pitch
    previewUtterance.volume = 1;  // Maximum volume

    synth.speak(previewUtterance);
});

// Populate voices on page load
window.onload = function() {
    populateVoices();
};
