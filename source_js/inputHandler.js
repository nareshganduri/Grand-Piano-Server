/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global PitchClassMapping */

function InputHandler(Physics, Pizzicato, world) {
    var baseOctave = 60;
    var heldNotes = [];

    var midiHandler = new MidiHandler(Pizzicato);

    getKeyboardInput();

    this.receiveInput = function(midiNumber) {
        midiHandler.receiveMidiNumber(midiNumber);
    };

    function getKeyboardInput() {
        //defaultKey();
        sustain();
    }

    function sustain() {
        window.onkeydown = function (e) {
            var keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
            rapidFire(keyPressed);
            if (keyPressed in PitchClassMapping.keyboardCharToPitchClass) {
                var midiNumber = baseOctave + parseInt(PitchClassMapping.keyboardCharToPitchClass[keyPressed]);

                var index = heldNotes.indexOf(midiNumber);
                if (index === -1) {
                    heldNotes.push(midiNumber);
                }
                
                /* Maybe only create on new pitch class? 
                 * As opposed to every instance regardless of pitch class
                 * */

                midiHandler.play(midiNumber);
            }
        };

        window.onkeyup = function (e) {
            var keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
            if (keyPressed in PitchClassMapping.keyboardCharToPitchClass) {
                var midiNumber = baseOctave + parseInt(PitchClassMapping.keyboardCharToPitchClass[keyPressed]);
                var index = heldNotes.indexOf(midiNumber);
                if (index > -1) {
                    heldNotes.splice(index, 1);
                }

                midiHandler.stop(midiNumber);
            }
        };
    }

    function defaultKey() {
        window.onkeyup = function (e) {
            var keyPressed = String.fromCharCode(e.keyCode).toLowerCase();
            if (keyPressed in PitchClassMapping.keyboardCharToPitchClass) {
                var midiNumber = baseOctave + parseInt(PitchClassMapping.keyboardCharToPitchClass[keyPressed]);

                receiveInput(midiNumber);
            }

            rapidFire(keyPressed);
        };
    }

    function rapidFire(keyPressed) {
        if (keyPressed === "q") {
            var rand = baseOctave + Math.ceil(Math.random() * 12);

            receiveInput(rand);
        }
    }
}


