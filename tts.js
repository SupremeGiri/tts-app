const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#voiceSelect');

// Function to populate available voices
function populateVoices() {
    const voices = synth.getVoices();
    
    // Clear the voice select dropdown
    voiceSelect.innerHTML = '';

    // Check if voices are available
    if (voices.length === 0) {
        const noVoiceOption = document.createElement('option');
        noVoiceOption.textContent = 'No voices available';
        voiceSelect.appendChild(noVoiceOption);
        return;
    }

    voices.forEach((voice) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;

        // Mark the voice as the default if it's the system default
        if (voice.default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-name', voice.name);
        option.setAttribute('data-lang', voice.lang);
        voiceSelect.appendChild(option);
    });
}

// Listen for the voiceschanged event, which triggers when voices are loaded
if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = populateVoices;
}

// Function to speak the text using the selected voice
function speak() {
    if (synth.speaking) {
        console.error('SpeechSynthesis is already speaking.');
        return;
    }

    const textInput = document.querySelector('#textInput').value;
    if (textInput === '') {
        console.error('No text input.');
        return;
    }

    const utterThis = new SpeechSynthesisUtterance(textInput);
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

    const voices = synth.getVoices();
    utterThis.voice = voices.find((voice) => voice.name === selectedOption);

    synth.speak(utterThis);
}

// Event listener for the speak button
document.querySelector('#speakButton').addEventListener('click', speak);

// Trigger voice population on page load
window.onload = function() {
    // Try to populate voices on page load in case they are already available
    populateVoices();
};
