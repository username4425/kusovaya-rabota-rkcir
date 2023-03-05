let is_grabbed = false;

function init_scroll(){
    document.querySelector(".thumb").addEventListener("mousedown", (event) => {
        if (event.button == 0) {
            is_grabbed = true;
        }
    });
    
    document.body.addEventListener("mouseup", (event) => {
        if (event.button == 0) {
            is_grabbed = false;
        }
    });
    
    document.body.addEventListener("mousemove", (event) => {
        if (is_grabbed) {
            let thumb = document.querySelector(".thumb");
            let scroll_line = document.querySelector(".labs-list-scroll").clientHeight;
            let thumb_pos = Number(thumb.style.top.slice(0, -2)) + event.movementY;
            let scroll = document.querySelector(".labs-list");
            let scroll_height = scroll.clientHeight;
            let scroll_val = Math.floor(event.movementY / scroll_line * scroll_height);
            let c_bottom = Number(scroll.style.bottom.slice(0, -2));
            if (c_bottom + scroll_val <= 0) {
                scroll.style.bottom = "0px";
            } else if (c_bottom + scroll_val >= scroll_height - scroll_line) {
                scroll.style.bottom = scroll_height - scroll_line + "px";
            } else {
                scroll.style.bottom = c_bottom + scroll_val + "px";
            }
            if (thumb_pos <= 0) {
                thumb.style.top = "0px";
            } else if (thumb_pos >= scroll_line - thumb.clientHeight) {
                thumb.style.top = scroll_line - thumb.clientHeight + "px";
                console.log(5);
            } else {
                thumb.style.top = thumb_pos + "px";
            }
        }
        return false;
    });
    
    document.querySelector(".scroll-list-holder").ondragstart = function () {
        return false;
    }
    
    document.querySelector(".labs-list-text").onclick = function () {
        return false;
    }
}

if(document.querySelector(".labs-list-scroll").style.display != "none"){
    init_scroll();
}