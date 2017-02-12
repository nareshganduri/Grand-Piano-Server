/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PitchClassMapping() {

}

function mapPitch(pitch, color) {
    return {
        "pitch": pitch,
        "color": color
    }
}
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
    a: mapPitch("0", "#FF0000"),    //RED
    w: mapPitch("1", "#004080"),    //blue-green
    s: mapPitch("2", "#FFA500"),    //ORANGE
    e: mapPitch("3", "#4000C0"),    //blue-purple
    d: mapPitch("4", "#FFFF00"),    //YELLOW
    f: mapPitch("5", "#C00040"),    //purple-red
    t: mapPitch("6", "#00FF00"),    //GREEN
    g: mapPitch("7", "#FF5200"),    //orange-red
    y: mapPitch("8", "#0000FF"),    //BLUE
    h: mapPitch("9", "#FFD200"),    //yellow-orange
    u: mapPitch("10", "#800080"),   //PURPLE
    j: mapPitch("11", "#80C000"),   //yellow-green
    k: mapPitch("12", "#FF0000")    //RED
};

