var ChordToNotesMapping = {
    I: [0, 4, 7],
    ii: [2, 5, 9],
    II: [2, 6, 9],
    iii: [4, 7, 11],
    III: [4, 8, 11],
    IV: [0, 5, 9],
    V: [2, 7, 11],
    vi: [0, 4, 9],
    vii_dim: [2, 5, 11]
};

var repeatProgression = [
    {chords: ['I', 'vi', 'IV', 'V'], repeat: true, next:['I', 'vi']},
    {chords: ['I', 'V', 'iv', 'IV'], repeat: true, next:['I']},
    {chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'ii', 'V'], repeat: true, next:['I']},
    {chords: ['vi', 'vi', 'II', 'II'], repeat: true, next:['vi']},
    {chords: ['vi', 'IV', 'V', 'iii'], repeat: true, next:['vi']},
    {chords: ['vi', 'iii', 'IV', 'I', 'ii', 'vi', 'vii_dim', 'III'], repeat: true, next:['vi']}
];


Array.prototype.randomOne = function() {
    return this[Math.floor(Math.random() * this.length)]
};

function MusicGen() {
    var key = 0;
    var thisProgression;
    var repeatTimes;

    var chordQueue = [];
    var currentChord = null;

    // helper function to randomly select chords
    function generateRandomProgression(firstChords, params) {
        return repeatProgression.filter(function(p) {
            return (!firstChords) || firstChords.indexOf(p.chords[0] >= 0);
        }).randomOne();
    }

    // add more chords from the proper progrssion to the chord queue
    function generateNextProgression() {
        var newProgression = null;
        if (!thisProgression) {
            newProgression = generateRandomProgression()
        }
        else if (thisProgression.repeat) {
            if (repeatTimes >= 4 || (repeatTimes == 2 && Math.random() < 0.5)) {
                repeatTimes = 0;
                newProgression = generateRandomProgression(thisProgression.next)
            }
            else {
                repeatTimes += 1;
                newProgression = thisProgression;
            }
        }
        else {
            repeatTimes = 0;
            newProgression = generateRandomProgression(thisProgression.next)
        }

        console.log('new progression appended:', newProgression);
        chordQueue = chordQueue.concat(newProgression.chords);
    }


    // have a look at the next chord
    this.peekNextChord = function() {
        if (chordQueue.length == 0) {
            generateNextProgression();
        }
        return ChordToNotesMapping[chordQueue[0]];
    };

    this.popNextChord = function() {
        if (chordQueue.length == 0) {
            generateNextProgression();
        }
        currentChord = chordQueue.shift();
        return ChordToNotesMapping[currentChord];
    };


    function getNotesInRange(notes, low, high) {
        var allNotes = [];
        notes.forEach(function (note) {
            while (note <= high) {
                if (note >= low) {
                    allNotes.push(note);
                }
                note += 12
            }
        });
        return allNotes.sort();
    }

    this.generateMelody = function(length, params) {
        (length) || (length = 8);
        var melody = [];
        var notes = ChordToNotesMapping[currentChord].map(function(n){return (n + key) % 12});
        var allNotes = getNotesInRange(notes, 60, 84);
        for (var i = 0; i < length; i++) {
            // odd can be a rest
            if (i % 2 == 1 && Math.random() < 0.5) {
                melody.push(-1);
            }
            else
                melody.push(allNotes.randomOne());
        }
        console.log('melody generated:', melody);
        return melody;
    }
}