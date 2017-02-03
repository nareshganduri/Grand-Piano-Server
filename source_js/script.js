$(document).ready(function(){
    var ws = new WebSocket('ws://localhost:1234', 'echo-protocol');
});

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article. 
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    console.log('MIDI Access Object', midiAccess);
    // when we get a succesful response, run this code
     midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

     var inputs = midi.inputs.values();
     // loop over all available inputs and listen for any MIDI input
     for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
         // each time there is a midi message call the onMIDIMessage function
         input.value.onmidimessage = onMIDIMessage;
     }
}

function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
    console.log('MIDI data', data); // MIDI data [144, 63, 73]
}
 //
// Simple example of a newtonian orbit
//
Physics(function (world) {

    // bounds of the window
    var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight)
        ,edgeBounce
        ,renderer
        ;

    // create a renderer
    renderer = Physics.renderer('canvas', {
        el: 'viewport'
    });

    // add the renderer
    world.add(renderer);
    // render on each step
    world.on('step', function () {
        world.render();
    });

    // constrain objects to these bounds
    edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds
        ,restitution: 0.99
        ,cof: 0.5
    });

    // resize events
    window.addEventListener('resize', function () {

        // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
        viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
        // update the boundaries
        edgeBounce.setAABB(viewportBounds);

    }, true);

    world.add( Physics.body('circle', {
            x: renderer.width * 0.4
            ,y: renderer.height * 0.32
            ,vx: 0.3
            ,radius: 10
            ,styles: {
                fillStyle: '#cb4b16'
            }
        }));

    world.add( Physics.body('circle', {
        x: renderer.width * 0.7
        ,y: renderer.height * 0.3
        ,vx: -0.3
        ,radius: 10
        ,styles: {
            fillStyle: '#6c71c4'
        }
    }));

    var hex_scale = renderer.height/4;
    var hexagon = Physics.body('convex-polygon', {
        // place the center of the square at (0, 0)
        x: renderer.width * 0.5,
        y: renderer.height * 0.5,
        treatment: 'static',
        vertices: [
            { x: hex_scale*1.5, y: hex_scale*0.5 * Math.sqrt(3) },
            { x: 0, y: hex_scale*1 * Math.sqrt(3) },
            { x: hex_scale*-1.5, y: hex_scale*0.5 * Math.sqrt(3) },
            { x: hex_scale*-1.5, y: hex_scale*-0.5 * Math.sqrt(3) },
            { x: 0, y: hex_scale*-1 * Math.sqrt(3) },
            { x: hex_scale*1.5, y: hex_scale*-0.5 * Math.sqrt(3) }
        ]
    });

    world.add(hexagon);

    // add some gravity
    var gravity = Physics.behavior('constant-acceleration', {
        acc: { x : 0, y: 0.0004 } // this is the default
    });
    world.add( gravity );


    // add things to the world
    world.add([
        Physics.behavior('interactive', { el: renderer.container })
        ,Physics.behavior('body-impulse-response')
        ,Physics.behavior('body-collision-detection')
        ,Physics.behavior('sweep-prune')
        ,edgeBounce
    ]);

    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time ) {
        world.step( time );
    });
});