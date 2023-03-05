let positions = {};
let is_lmb_pressed = false;
let is_zoom_act = false;
let previous_touch = null;

function initial_canvas() {
    positions["scale"] = 1.0;
    let mapwidth = positions["mapwidth"];
    let mapheight = positions["mapheight"];
    if (positions["cwidth"] > mapwidth) {
        positions["dx"] = (positions["cwidth"] - mapwidth) / 2;
        positions["dwidth"] = mapwidth;
    } else {
        positions["scale"] = positions["cwidth"] / mapwidth;
        positions["dwidth"] = positions["cwidth"];
        positions["dx"] = 0;
    }
    positions["sx"] = 0;
    positions["swidth"] = mapwidth;
    if (positions["cheight"] > mapheight * positions["scale"]) {
        positions["dy"] = (positions["cheight"] - mapheight * positions["scale"]) / 2;
        positions["dheight"] = mapheight * positions["scale"];
    } else {
        positions["scale"] = positions["cheight"] / mapheight;
        positions["dx"] = (positions["cwidth"] - mapwidth * positions["scale"]) / 2;
        positions["dwidth"] = mapwidth * positions["scale"];
        positions["dheight"] = positions["cheight"];
        positions["dy"] = 0;
    }
    positions["scale-default"] = positions["scale"];
    positions["sy"] = 0;
    positions["sheight"] = mapheight;
    update_map();
}

function set_zoom_interval(count, add) {
    let counter = 0;
    is_zoom_act = true;
    let interval = setInterval(() => {
        if (counter != count) {
            update_scale(add / count);
            counter++;
        } else {
            clearInterval(interval);
            is_zoom_act = false;
        }
    }, 100 / count);
}

function setup_canvas() {
    let canvas = document.getElementById("image-map");
    let holder = document.querySelector(".show-map");
    canvas.width = holder.clientWidth;
    canvas.height = holder.clientHeight;
    positions["cwidth"] = canvas.width;
    positions["cheight"] = canvas.height;
    if (canvas.ondragstart == null) {
        console.log("Canvas listeners added");
        add_listeners_canvas(canvas);
    }
}

function preventDefault(e) {
    e.preventDefault();
}

function move_map(movementX, movementY) {
    if (positions["dx"] == 0) {
        let addx = movementX / positions["scale"];
        if (positions["sx"] + addx <= 0) {
            positions["sx"] = 0;
        } else if (positions["sx"] + addx + positions["swidth"] >= positions["map"].naturalWidth) {
            positions["sx"] = positions["map"].naturalWidth - positions["swidth"];
        } else positions["sx"] += addx;
    }
    if (positions["dy"] == 0) {
        let addy = movementY / positions["scale"];
        if (positions["sy"] + addy <= 0) {
            positions["sy"] = 0;
        } else if (positions["sy"] + addy + positions["sheight"] >= positions["map"].naturalHeight) {
            positions["sy"] = positions["map"].naturalHeight - positions["sheight"];
        } else positions["sy"] += addy;
    }
    update_map();
}

function add_listeners_canvas(canvas) {
    document.getElementById("zoom-in").onclick = function () {
        if (positions["scale"] < 1.3 && !is_zoom_act) {
            set_zoom_interval(10, 0.08);
        }
    };
    document.getElementById("zoom-out").onclick = function () {
        if (positions["scale"] > 0.1 && !is_zoom_act) {
            set_zoom_interval(10, -0.08);
        }
    }
    canvas.addEventListener("mousemove", (event) => {
        if (is_lmb_pressed) {
            move_map(-event.movementX, -event.movementY);
        }
    });
    canvas.addEventListener("mousedown", (event) => {
        if (event.button == 0) is_lmb_pressed = true;
    });
    canvas.addEventListener("mouseup", (event) => {
        if (event.button == 0) is_lmb_pressed = false;
    });
    canvas.addEventListener("mouseout", (event) => {
        is_lmb_pressed = false;
        let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        window.removeEventListener(wheelEvent, preventDefault, { passive: false });
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    });
    canvas.addEventListener("wheel", (event) => {
        console.log("Wheel event");
        if (event.deltaY > 0 && positions["scale"] > 0.1 && !is_zoom_act) {
            set_zoom_interval(10, -0.08);
        } else if (event.deltaY < 0 && positions["scale"] < 1.3 && !is_zoom_act) {
            set_zoom_interval(10, 0.08);
        }
    });
    canvas.ondragstart = function () {
        return false;
    };
    canvas.addEventListener("mouseover", (event) => {
        let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        window.addEventListener(wheelEvent, preventDefault, { passive: false });
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    });
    canvas.addEventListener("touchstart", (event)=>{
        window.addEventListener('touchmove', preventDefault, { passive: false });
    });
    canvas.addEventListener("touchmove", (event) => {
        let touch = event.changedTouches[0];
        if (previous_touch) {
            let movementX =  previous_touch.pageX - touch.pageX;
            let movementY =  previous_touch.pageY - touch.pageY;
            move_map(movementX, movementY);
        }
        previous_touch = touch;
    });
    canvas.addEventListener("touchend", (event) => {
        window.removeEventListener('touchmove', preventDefault, { passive: false });
        previous_touch = null;
    });
}

function get_selected_floor() {
    if (document.getElementById("floor4rb").checked) {
        return 4;
    } else if (document.getElementById("floor3rb").checked) {
        return 3;
    } else if (document.getElementById("floor2rb").checked) {
        return 2;
    } else if (document.getElementById("floor1rb").checked) {
        return 1;
    } else {
        return 0;
    }
}

function update_scale(add) {
    console.log(add);
    positions["scale"] += add;
    let mapwidth = positions["mapwidth"];
    let mapheight = positions["mapheight"];
    if (positions["cwidth"] > positions["scale"] * mapwidth) {
        positions["dx"] = (positions["cwidth"] - mapwidth * positions["scale"]) / 2;
        positions["dwidth"] = mapwidth * positions["scale"];
        positions["sx"] = 0;
        positions["swidth"] = mapwidth;
    } else {
        positions["dx"] = 0;
        positions["dwidth"] = positions["cwidth"];
        let xcenter = positions["sx"] + positions["swidth"] / 2;
        positions["swidth"] = positions["cwidth"] / positions["scale"];
        positions["sx"] = xcenter - positions["swidth"] / 2;
        if (positions["sx"] < 0) positions["sx"] = 0;
        else if (positions["sx"] + positions["cwidth"] > positions["scale"] * mapwidth) {
            positions["sx"] = positions["scale"] * mapwidth - positions["cwidth"];
        }
    }
    if (positions["cheight"] > positions["scale"] * mapheight) {
        positions["dy"] = (positions["cheight"] - mapheight * positions["scale"]) / 2;
        positions["dheight"] = mapheight * positions["scale"];
        positions["sy"] = 0;
        positions["sheight"] = mapheight;
    } else {
        positions["dy"] = 0;
        positions["dheight"] = positions["cheight"];
        let ycenter = positions["sy"] + positions["sheight"] / 2;
        positions["sheight"] = positions["cheight"] / positions["scale"];
        positions["sy"] = ycenter - positions["sheight"] / 2;
        if (positions["sy"] < 0) positions["sy"] = 0;
        else if (positions["sy"] + positions["cheight"] > positions["scale"] * mapheight) {
            positions["sy"] = positions["scale"] * mapheight - positions["cheight"];
        }
    }
    update_map();
}

function update_map() {
    let map = positions["map"];
    let canvas = document.getElementById("image-map");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#34495E";
    ctx.fillRect(0, 0, positions["cwidth"], positions["cheight"]);
    ctx.drawImage(map, positions["sx"], positions["sy"], 
    positions["swidth"], positions["sheight"], positions["dx"],
    positions["dy"], positions["dwidth"], positions["dheight"]);
}

function load_map() {
    positions["map"] = document.getElementById("image-floor" + get_selected_floor());
    positions["mapwidth"] = positions["map"].naturalWidth;
    positions["mapheight"] = positions["map"].naturalHeight;
}

function set_radiob() {
    let radio_buttons = document.querySelectorAll(".floor-radio");
    radio_buttons.forEach((rb) => {
        rb.addEventListener("change", (event) => {
            if (event.target.id != "image-floor" + get_selected_floor()) {
                load_map();
                initial_canvas();
            }
            return false;
        });
    });
    document.querySelector(".floor-selector").onclick = function () {

    }
}

window.addEventListener("resize", () => {
    positions = {};
    setup_canvas();
    load_map();
    initial_canvas();
});

setup_canvas();
set_radiob();
load_map();
initial_canvas();