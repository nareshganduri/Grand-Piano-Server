/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function MidiHandler(Pizzicato) {
    var base = 440;
    var midiToFrequency = {};

    // Send midi to be played
    this.receiveMidiNumber = function (midiNumber) {
        playMidiNote(midiNumber);
    };

    function convertMidiToFrequency(midiNumber) {
        return base * Math.pow(2, (midiNumber - 57) / 12);
    }

    function playMidiNote(midiNumber, vol) {
        if (!midiToFrequency[midiNumber]) {
            vol = vol || 0.1;
            midiToFrequency[midiNumber] = new Pizzicato.Sound({
                source: 'wave',
                options: {
                    type: 'sawtooth',
                    frequency: convertMidiToFrequency(midiNumber),
                    volume: vol}
            });
        }

        var sound = midiToFrequency[midiNumber];
        sound.play();
        setTimeout(function () {
            sound.stop();
        }, 250);
    }

    this.play = function (midiNumber) {
        if (!midiToFrequency[midiNumber]) {
            midiToFrequency[midiNumber] = new Pizzicato.Sound({
                source: 'wave',
                options: {
                    type: 'sawtooth',
                    frequency: convertMidiToFrequency(midiNumber),
                    volume: 0}

            });
        }

        var sound = midiToFrequency[midiNumber];
        sound.play();
    };

    this.stop = function (midiNumber) {
        midiToFrequency[midiNumber].stop();
    };
}