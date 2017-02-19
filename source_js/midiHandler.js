/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var piano_sound_files = {
    60: new Pizzicato.Sound('./sounds/m4a/c1.m4a'),
    61: new Pizzicato.Sound('./sounds/m4a/c1s.m4a'),
    62: new Pizzicato.Sound('./sounds/m4a/d1.m4a'),
    63: new Pizzicato.Sound('./sounds/m4a/d1s.m4a'),
    64: new Pizzicato.Sound('./sounds/m4a/e1.m4a'),
    65: new Pizzicato.Sound('./sounds/m4a/f1.m4a'),
    66: new Pizzicato.Sound('./sounds/m4a/f1s.m4a'),
    67: new Pizzicato.Sound('./sounds/m4a/g1.m4a'),
    68: new Pizzicato.Sound('./sounds/m4a/g1s.m4a'),
    69: new Pizzicato.Sound('./sounds/m4a/a1.m4a'),
    70: new Pizzicato.Sound('./sounds/m4a/a1s.m4a'),
    71: new Pizzicato.Sound('./sounds/m4a/b1.m4a'),
    72: new Pizzicato.Sound('./sounds/m4a/c2.m4a'),
};
       

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
        var sound;
        if (midiNumber >= 60 && midiNumber <= 72) { // try to use piano sounds for the octave we are using
            sound = piano_sound_files[midiNumber];
        }
        else {
            sound = midiToFrequency[midiNumber];
        }
        sound.play();
        setTimeout(function () {
            sound.stop();
        }, 200);
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