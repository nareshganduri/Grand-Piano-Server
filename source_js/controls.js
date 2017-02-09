document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;
    console.log(e);
    if (e.keyCode == 187) { // = key
        // add a side
        num_sides += 1;
        world.remove(zero);
        zero = Physics.body('compound', {
                x: width/2
                ,y: height/2
                ,treatment: 'kinematic'
                ,styles: {
                    fillStyle: colors.white
                    ,lineWidth: 1
                    ,strokeStyle: colors.white

                }
                ,children: regularPolygon(num_sides, 100)
            });

        world.add(zero);
    }
    else if (e.keyCode == 189) { // - key
        // remove a side
        if ( num_sides > 3 ) {
            num_sides -= 1;
            world.remove(zero);
            zero = Physics.body('compound', {
                    x: width/2
                    ,y: height/2
                    ,treatment: 'kinematic'
                    ,styles: {
                        fillStyle: colors.white
                        ,lineWidth: 1
                        ,strokeStyle: colors.white

                    }
                    ,children: regularPolygon(num_sides, 100)
                });

            world.add(zero);
        }
    }
    else if (e.keyCode == 219) { // [ key
        // decrease rotation
        zero_ang_vel -= 0.0001;
    }
    else if (e.keyCode == 221) { // ] key
        // increase rotation
        zero_ang_vel += 0.0001;
    }

}