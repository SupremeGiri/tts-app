
const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#voiceSelect');

// Function to populate available voices
function populateVoices() {
    let voices = synth.getVoices();

    if (voices.length === 0) {
        // Retry if voices are not loaded (especially for mobile devices)
        setTimeout(populateVoices, 100);
        return;
    }

    // Clear existing options
    voiceSelect.innerHTML = '';

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

// Populate voices when page is loaded
populateVoices();

// Re-populate when voices change (important for some browsers/devices)
if (synth.onvoiceschanged !== undefined) {
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
