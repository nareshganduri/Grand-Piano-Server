
// var env   = T("adsr", {a:0, d:1000, s:0, r:600});

var env = T("perc", {r:1000});
var synth = T("SynthDef", {mul:0.45, poly:4});
synth.def = function(opts) {
    var op1 = T("sin", {freq:opts.freq*6, fb:0.25, mul:0.4});
    var op2 = T("sin", {freq:opts.freq, phase:op1, mul:0.4});
    return env.clone().append(op2).on("ended", opts.doneAction).bang();
};
synth.play();




var mml = "l2 g0<c0e> f0g0<d> e0g0<c1";

var bass = T("OscGen", {wave:"sin(10)", env:{type:"adsr"}, mul:0.2}).play();

var bassEffect = T('chorus', {rate:4, fb: 0.5, mix: 0.25}, bass);
bassEffect = T("reverb", {room:0.95, damp:0.1, mix:0.75}, bassEffect);
bassEffect.play();

function MusicBox() {
    var beatCount = 0;

    var melodyQueue = [];
    // music playing logic
    this.playChord = function(chord) {
        bass.allNoteOff();
        melodyQueue = [];
        chord.forEach(function(noteClass) {
            bass.noteOn(noteClass + 48, 60);
        })
    };

    this.playMelody = function(melody) {
        melodyQueue = melodyQueue.concat(melody);
    };

    this.playNote = function() {

    };

    this.onBeat = function() {
        beatCount++;
        if (melodyQueue.length > 0)
            synth.noteOn(melodyQueue.pop(), 100);
        console.log(beatCount);
    }
}
