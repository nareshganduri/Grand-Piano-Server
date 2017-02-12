/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PitchClassMapping() {

}

function mapPitch(noteName, color, func) {
    return {
        "Note": noteName,
        "Color": color,
        "Function": func
    }
}

pitchClassMapping.pitchMapping = {
    0: mapPitch("C", "FF0000" )

PitchClassMapping.pitchClassToNoteName = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
};

PitchClassMapping.pitchClassToColor = {
    0: "FF0000", //RED
    7: "FF5200", //***orange-red
    2: "FFA500", //ORANGE
    9: "FFD200", //***yellow-orange
    4: "FFFF00", //YELLOW
    11: "80C000", //***yellow-green
    6: "00FF00", //GREEN
    1: "004080", //***blue-green
    8: "0000FF", //BLUE
    3: "4000C0", //***blue-purple
    10: "800080", //PURPLE
    5: "C00040"     //***purple-red    
};

PitchClassMapping.keyboardCharToPitchClass = {
    a: "0",
    w: "1",
    s: "2",
    e: "3",
    d: "4",
    f: "5",
    t: "6",
    g: "7",
    y: "8",
    h: "9",
    u: "10",
    j: "11",
    k: "12"
};

