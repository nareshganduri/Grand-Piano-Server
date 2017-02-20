function Piano() {
    var that = this;

    this.whiteKeyWidth = 50;
    this.whiteKeyHeight = 200;
    this.blackKeyWidth = 20;
    this.blackKeyHeight = 120;

    this.whiteKeyBodies = [];
    this.blackKeyBodies = [];

    const keyMap = {
        0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6, 12: 7,
        1: 0, 3: 1, 6: 2, 8: 3, 10: 4
    };

    function isBlack(key) {
        return [1,3,6,8,10].indexOf(key) >= 0;
    }

    this.getKeyPosition = function(key) {
        console.log(key);
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


    this.draw = function(world, x, y) {
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
            console.log(startX, startY);
            this.blackKeyBodies.push(
                Physics.body('rectangle', {
                    x: startX
                    ,y: startY
                    ,width: this.blackKeyWidth
                    ,height: this.blackKeyHeight
                    ,treatment: 'static'
                    ,styles: {
                        fillStyle: '#000000'
                    }
                })
            );
        }

        this.whiteKeyBodies.concat(this.blackKeyBodies).forEach(function(x) { world.add(x) });
    }
}

function Projectile(size, color, life) {
    var that = this;

    var body = Physics.body('convex-polygon', {
         x: 0
        ,y: 0
        ,vertices: [
             {x: -1*size, y: 0}
            ,{x: 1*size, y: 0}
            ,{x:0, y:2*size}
        ]
        ,styles: {
             fillStyle: color
        }
        ,treatment: 'kinematic'
        ,angle: Math.PI
        ,class: 'projectile'
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
                ,class: 'projectile'
                ,life: 500
            });

            particle.state.vel.x = (Math.random() - 0.5) / 4;
            particle.state.vel.y = Math.random() / 2;
            world.add(particle);
        }
    });


    this.spawn = function(world, x, y, vel) {
        console.log(body);
        if (x && y) {
            body.state.pos.x = x;
            body.state.pos.y = y;
            body.state.vel.y = vel;
        }
        world.add(body);
    }
}




