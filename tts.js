const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#voiceSelect');
const textInput = document.querySelector('#textInput');
const speakButton = document.querySelector('#speakButton');
const previewButton = document.querySelector('#previewButton');

// Function to populate available voices
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
function speak() {
    const text = textInput.value;

    if (synth.speaking) {
        console.error('SpeechSynthesis is already speaking.');
        return;
    }

    if (text === '') {
        console.error('No text input.');
        return;
    }

    // Use browser's SpeechSynthesis API
    const utterThis = new SpeechSynthesisUtterance(text);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    utterThis.voice = voices.find((voice) => voice.name === selectedOption);

    // Adjust properties for smoother pronunciation
    utterThis.rate = 1;    // Normal rate
    utterThis.pitch = 1;   // Normal pitch
    utterThis.volume = 1;  // Maximum volume

    synth.speak(utterThis);
}

// Function to preview the text using the selected voice
function preview() {
    const text = textInput.value;

    if (synth.speaking) {
        console.error('SpeechSynthesis is already speaking.');
        return;
    }

    if (text === '') {
        console.error('No text input.');
        return;
    }

    // Use browser's SpeechSynthesis API for preview
    const utterThis = new SpeechSynthesisUtterance(text);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    utterThis.voice = voices.find((voice) => voice.name === selectedOption);

    // Adjust properties for preview
    utterThis.rate = 1;    // Normal rate
    utterThis.pitch = 1;   // Normal pitch
    utterThis.volume = 1;  // Maximum volume

    synth.speak(utterThis);
}

// Attach event listeners
speakButton.addEventListener('click', speak);
previewButton.addEventListener('click', preview);

// Populate voices on page load
window.onload = function() {
    populateVoices();
};
