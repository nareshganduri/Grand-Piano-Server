function Piano() {
    var that = this;

    this.whiteKeyWidth = 50;
    this.whiteKeyHeight = 200;
    this.blackKeyWidth = 20;
    this.blackKeyHeight = 120;

    this.whiteKeyBodies = [];
    this.blackKeyBodies = [];

    this.x = 0;
    this.y = 0;

    const keyMap = {
        0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6, 12: 7,
        1: 0, 3: 1, 6: 2, 8: 3, 10: 4
    };

    this.setDimension = function(width, height) {
        this.whiteKeyWidth = width / 8;
        this.blackKeyWidth = this.whiteKeyWidth  * 2 / 5;
        this.whiteKeyHeight = height;
        this.blackKeyHeight = this.whiteKeyHeight * 3 / 5;
    };

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
    };

    function isBlack(key) {
        return [1,3,6,8,10].indexOf(key) >= 0;
    }

    this.getKeyPosition = function(key) {
        if (isBlack(key)) {
            var pos = this.blackKeyBodies[keyMap[key]].state.pos;
            var x = pos.x, y = pos.y;
            return {x: x, y: y - this.blackKeyHeight / 2};
        }
        else {
            pos = this.whiteKeyBodies[keyMap[key]].state.pos;
            x = pos.x; y = pos.y;
            return {x: x, y : y - this.whiteKeyHeight / 2};
        }
    };

    this.setColorKeys = function(keys, color) {
        keys.forEach(function(key) {
            var idx = keyMap[key];
            if (isBlack(key)) {
                // black key
                that.blackKeyBodies[idx].styles={fillStyle:color, lineWidth: 1, strokeStyle: '#000'};
                that.blackKeyBodies[idx].view = null;
                that.blackKeyBodies[idx].recalc();
            }
            else {
                that.whiteKeyBodies[idx].styles={fillStyle:color, lineWidth: 1, strokeStyle: '#000'};
                that.whiteKeyBodies[idx].view = null;
                that.whiteKeyBodies[idx].recalc();
            }
        });
    };

    this.setKeysActive = function(keys) {
        this.setColorKeys(keys, '#00ff00')
    };

    this.setKeysForbidden = function(keys) {
        this.setColorKeys(keys, '#f00');
    };

    this.setKeysNotice = function(keys) {
        this.setColorKeys(keys, '#ff0')
    };

    this.setKeysNormal = function(keys) {
        keys.forEach(function(key) {
            var idx = keyMap[key];

            if ([1,3,6,8,10].indexOf(key) >= 0) {
                // black key
                that.blackKeyBodies[idx].styles={fillStyle:'#000', lineWidth: 1, strokeStyle: '#000'};
                that.blackKeyBodies[idx].view = null;
                that.blackKeyBodies[idx].recalc();
            }
            else {
                that.whiteKeyBodies[idx].styles={fillStyle:'#fff', lineWidth: 1, strokeStyle: '#000'};
                that.whiteKeyBodies[idx].view = null;
                that.whiteKeyBodies[idx].recalc();
            }
        });
    };


    this.draw = function(world) {
        var x = this.x;
        var y = this.y;

        if (this.whiteKeyBodies.length)
            return;

        var totalWidth = 8 * this.whiteKeyWidth;
        x = x - totalWidth / 2 + this.whiteKeyWidth / 2;

        for (var i = 0; i < 8; i++) {


            this.whiteKeyBodies.push(
                Physics.body('rectangle', {
                    x: x + i * this.whiteKeyWidth
                    ,y: y
                    ,width: this.whiteKeyWidth
                    ,height: this.whiteKeyHeight
                    ,treatment: 'static'
                    ,collision: false
                    ,styles: {
                        fillStyle: '#ffffff'
                        ,lineWidth: 1
                        ,strokeStyle: '#000000'
                    }
                })
            );
        }

        var blackKeyPos = [0,1,3,4,5];
        for (i in blackKeyPos) {
            var pos = blackKeyPos[i];
            var startX = x + pos * this.whiteKeyWidth + this.whiteKeyWidth / 2;
            var startY = y + (this.blackKeyHeight - this.whiteKeyHeight) / 2;
            this.blackKeyBodies.push(
                Physics.body('rectangle', {
                    x: startX
                    ,y: startY
                    ,width: this.blackKeyWidth
                    ,height: this.blackKeyHeight
                    ,treatment: 'static'
                    ,collision: false
                    ,styles: {
                        fillStyle: '#000000'
                    }
                })
            );
        }

        this.whiteKeyBodies.concat(this.blackKeyBodies).forEach(function(x) { world.add(x) });
    }
}

function Projectile(size, note, life) {

    var body = Physics.body('convex-polygon', {
         x: 0
        ,y: 0
        ,vertices: [
             {x: -1*size, y: 0}
            ,{x: 1*size, y: 0}
            ,{x:0, y:2*size}
        ]
        ,styles: {
             fillStyle: PitchClassMapping.pitchClassToColor[note%12]
        }
        ,note: note
        ,treatment: 'kinematic'
        ,angle: Math.PI
        ,despawn: true
        ,collision: false
        ,life: life
        ,onTick: function(dt, body, world) {
            if (Math.random() < 0.9) return;
            var particle = Physics.body('rectangle', {
                x: body.state.pos.x
                ,y: body.state.pos.y
                ,width: 10
                ,height: 10
                ,styles: {
                    fillStyle: body.styles.fillStyle
                }
                ,treatment: 'kinematic'
                ,angle: Math.random() * 2 * Math.PI
                ,despawn: true
                ,collision: false
                ,life: 500
            });

            particle.state.vel.x = (Math.random() - 0.5) / 4;
            particle.state.vel.y = Math.random() / 2;
            world.add(particle);
        }
    });

    this.body = body;

    this.spawn = function(world, x, y, vel) {
        if (x && y) {
            body.state.pos.x = x;
            body.state.pos.y = y;
            body.state.vel.y = vel;
        }
        world.add(body);
    }
}

function BackgroundLine(width, height, color, life) {
    var body = Physics.body('rectangle', {
        x: 0
        ,y: -height / 2
        ,width: width
        ,height: height
        ,styles: {
            fillStyle: color
        }
        ,treatment: 'kinematic'
        ,despawn: true
        ,collision: false
        ,life: life
        ,onTick: function(dt, body, world) {
        }
    });

    this.spawn = function(world, x, vel) {
        if (x) {
            body.state.pos.x = x;
            body.state.vel.y = vel;
        }
        world.add(body);
    }
}

function Target(width, height, color) {
    var body = Physics.body('convex-polygon', {
        x: 0
        ,y: -height / 2
        ,vertices: [
            {x: -1*width, y: 0}
            ,{x: 1*width, y: 0}
            ,{x:0, y:2*height}
        ]
        ,mass: 10000
        ,styles: {
            fillStyle: color
        }
        ,despawn: true
        ,life: 100000
        ,treatment: 'kinematic'
        ,collision: false
    });

    body.state.angular.vel = 0.005;

    this.body = body;

    this.spawn = function(world, x, y) {
        if (x) {
            body.state.pos.x = x;
            body.state.pos.y = y;
        }
        world.add(body);
    }
}
