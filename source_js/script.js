/* global PitchClassMapping */

$(document).ready(function(){
    var ws = new WebSocket('ws://localhost:1234', 'echo-protocol');
});

// global variables
var zero_ang_vel = 0.001;
var num_sides = 3;
var width = window.innerWidth
    ,height = window.innerHeight;

var physicsEngine = Physics(function (world) {
    // bounds of the window
    var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight)
    ,edgeBounce
    ,renderer
    ;

    /////////////////////////////////////////////MIDI PROCESSING///////////////////////////////////////////
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
        console.log(data);
        var channel = data[0] & 0xf;
        var type = data[0] & 0xf0;
        console.log('channel:' + channel);
        console.log('type:' + type);
        var note = data[1];
        var velocity = data[2];
        if (velocity > 0) {
            switch(type) {
                case 144: //noteon
                    console.log('note on');
                    spawnCircle(width/2, height/2, 10, '#ffffff', data[1]);
                    break;
                case 128:
                    console.log('note off');
                    break
                default:
                    break
            }    
        }
    }


    ///////////////////////////////////////////////////PHYSICS////////////////////////////////////////////////////////////
    // Plz give me a number > 3
    var regularPolygon = function (N, r, width, mass) {

        width || (width = 5);
        mass || (mass = 20);

        var angle = 2 * Math.PI / N;
        var sideLength = 2 * r * Math.sin(angle / 2);
        var sideDist = r * Math.cos(angle / 2);

        var angles = [];
        for (var i = 0; i < N; i++) {
            angles.push(angle * i);
        }

        return angles.map(function(angle) {
            var x = sideDist * Math.cos(angle);
            var y = sideDist * Math.sin(angle);
            var rotation = angle;

            return Physics.body('rectangle', {    //right side
                x: S(x)
                ,y: S(y)
                ,width: S(width)
                ,height: S(sideLength + width / 2)
                ,mass: mass
                ,angle: rotation
            })
        })
    }

    var spawnCircle = function (x, y, r, color, note) {
        console.log(note);
        var circle = Physics.body('circle', {
            x: x
            ,y: y
            ,mass: 1
            ,radius: r
            ,styles: {
                fillStyle: color
            }
        });
        circle.note = note;
        world.add(circle);
    }

    // scale relative to window width
    function S( n ){
        return n * window.innerWidth / 600;
    }

    var input = new InputHandler(Physics, Pizzicato, world, regularPolygon, width, height);

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
        ,restitution: 0.9
        ,cof: 0.5
    });

    // resize events
    window.addEventListener('resize', function () {

        // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
        viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
        // update the boundaries
        edgeBounce.setAABB(viewportBounds);

    }, true);

    // create the zero, spinning regular polygon
    var zero = Physics.body('compound', {
        x: width/2
        ,y: height/2
        ,treatment: 'kinematic'
        ,styles: {
            fillStyle: '#ffffff'
            ,lineWidth: 1
            ,strokeStyle: '#ffffff'

        }
        ,children: regularPolygon(3, 100)
    });

    world.add(zero);

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

    world.on('collisions:detected', function(data) {
        var bodyA = data.collisions[0].bodyA;
        var bodyB = data.collisions[0].bodyB;

        if (bodyA.note)
            input.receiveInput(bodyA.note);
        if (bodyB.note)
            input.receiveInput(bodyB.note);
    });


    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time ) {
        world.step( time );
        world.findOne({'treatment':'kinematic'}).state.angular.vel = zero_ang_vel;
    });
});