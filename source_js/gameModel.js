

function GameModel(piano) {

    var tempo;
    var measureTime;
    setTempo(80);

    var currentChord = null;

    var chordQueue = [0,0,7,7,9,9,7,-1,5,5,4,4,2,2,0,-1, 7,7,5,5,4,4,2,-1, 7,7,5,5,4,4,2,-1,
        0,0,7,7,9,9,7,-1, 5,5,4,4,2,2,0,-1
    ];
    var melodyQueue = [];

    var timeInMeasure = 0;

    function setTempo(bpm) {
        tempo = bpm;
        measureTime = 60000 / tempo;
    }
    this.setTempo = setTempo;

    function nextChord() {
        return currentChord = chordQueue.shift();
    }

    function nextMelody() {
        return melodyQueue.shift();
    }

    var projectiles = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
    var targets = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
    this.spawnProjectile = function(world, note) {
        var keyPos = piano.getKeyPosition(note);
        var projectile = new Projectile(20, note, 1000);
        projectile.spawn(world, keyPos.x, keyPos.y, -1);
        projectiles[note].push(projectile);
    };

    function spawnTarget(world, note) {
        var target = new Target(50, 50, PitchClassMapping.pitchClassToColor[note%12]);
        target.spawn(world, piano.getKeyPosition(note).x, 0.2);
        targets[note].push(target);
    }

    function update(dt, world) {
        timeInMeasure += dt;

        for (var i = 0; i < 13; i++) {
            if (targets[i][0] && targets[i][0].body.state.pos.y > piano.y - piano.whiteKeyHeight/2) {
                targets[i].shift().body.life = 0;
            }
            if (projectiles[i][0] && projectiles[i][0].body.state.pos.y < 0) {
                projectiles[i].shift().body.life = 0;
            }

            if (projectiles[i][0] && targets[i][0] && targets[i][0].body.state.pos.y > projectiles[i][0].body.state.pos.y) {
                projectiles[i].shift().body.life = 0;
                var targetBody = targets[i].shift().body;
                targetBody.life = 0;
                var pos = targetBody.state.pos;

                midiHandler.receiveMidiNumber(60 + i);

                for (var i = 0; i < 8; i++) {
                    var particle = Physics.body('rectangle', {
                        x: pos.x
                        ,y: pos.y
                        ,width: 30
                        ,height: 30
                        ,styles: {
                            fillStyle: targetBody.styles.fillStyle
                        }
                        ,treatment: 'kinematic'
                        ,angle: Math.random() * 2 * Math.PI
                        ,despawn: true
                        ,collision: false
                        ,life: 10000
                    });

                    particle.state.vel.x = (Math.random() - 0.5);
                    particle.state.vel.y = (Math.random()-0.5);
                    world.add(particle);
                }
            }
        }

        if (timeInMeasure > measureTime) {
            timeInMeasure -= measureTime;

            // for testing purposes I use chord to store testing notes
            var chord = nextChord();
            if (chord == null)
                spawnTarget(world, Math.floor(Math.random()*13));
            else if (chord < 0) {
                return;
            }
            else {
                spawnTarget(world, currentChord);
            }

            for (var i = 0; i < 13; i++) {
                for (var j = 0; j < targets[i].length; j++) {
                    var pos = targets[i][j].body.state.pos;
                    var style = targets[i][j].body.styles.fillStyle;
                    var velY = targets[i][j].body.state.vel.y;

                    for (var k = 0; k < 10; k++) {
                        var particle = Physics.body('rectangle', {
                            x: pos.x
                            ,y: pos.y
                            ,width: 10
                            ,height: 10
                            ,styles: {
                                fillStyle: style
                            }
                            ,treatment: 'kinematic'
                            ,angle: Math.random() * 2 * Math.PI
                            ,despawn: true
                            ,collision: false
                            ,life: Math.random() * 1000
                        });

                        particle.state.vel.x = (Math.random() - 0.5) / 4;
                        particle.state.vel.y = (Math.random()-0.5) / 2 + velY;
                        world.add(particle);
                    }
                }
            }
        }

        // if (projectiles[0])
        //     console.log(projectiles[0].body.life);
    }
    this.update = update;
}

