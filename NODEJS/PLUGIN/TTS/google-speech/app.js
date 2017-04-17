/**
 * Created by mgram on 2017-04-17.
 */
var Speech = require('speak-tts');

const _addVoicesList = function (voices) {
    var list = window.document.createElement('div')
    var html = '<h2>Available Voices</h2><select id="languages"><option value="">autodetect language</option>'
    voices.forEach(function (voice) {
        html += '<option value="' + voice.lang + '"">' + voice.name + ' (' + voice.lang + ')</option>'
    })
    list.innerHTML = html
    window.document.body.appendChild(list)
}

function _prepareSpeakButton() {
    const speakButton = document.getElementById('play')
    const textarea = document.getElementById('text')
    const languages = document.getElementById('languages')
    speakButton.addEventListener('click', function () {
        Speech.setLanguage(languages.value)
        Speech.speak({
            text: textarea.value
        })
    })
}

Speech.init({
    onVoicesLoaded: function (data) {
        console.log("loaded voices", data.voices)
        _addVoicesList(data.voices)
        _prepareSpeakButton()
        Speech.speak({
            text: 'Hello, how are you today ?'
        })
    }
});

const text = (Speech.browserSupport()) ? 'Hurray, your browser supports speech synthesis' : "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !"
document.getElementById("support").innerHTML = text