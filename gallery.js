let is_on_move = false;

function move_gallery(to_right) {
    let gallery = document.querySelector(".images-panel");
    let duration = 180;
    let count = 90;
    let add = (32.5 / count) * (to_right ? 1 : -1);
    let ct = 0;
    is_on_move = true;
    let interval = setInterval(() => {
        if (ct != count) {
            let cright = Number(gallery.style.right.slice(0, -2));
            gallery.style.right = cright + add + "vw";
            ct++;
        } else {
            is_on_move = false;
            clearInterval(interval);
        }
    }, duration / count);
}

function set_gallery_buttons() {
    let first_image = 0;
    document.getElementById("next").addEventListener("click", (event) => {
        if(is_on_move)return;
        if (first_image + 3 < 5) {
            move_gallery(true);
            first_image++;
        } else {
            let gallery = document.querySelector(".images-panel");
            let im1 = gallery.firstElementChild;
            im1.remove();
            let im2 = gallery.firstElementChild;
            im2.remove();
            gallery.appendChild(im1);
            gallery.appendChild(im2);
            gallery.style.right = "0vw";
            move_gallery(true);
            first_image = 1;
        }
    });
    document.getElementById("previous").addEventListener("click", (event) => {
        if(is_on_move)return;
        if (first_image > 0) {
            console.log("attemp to move galery");
            move_gallery(false);
            first_image--;
        } else {
            let gallery = document.querySelector(".images-panel");
            let im1 = gallery.lastElementChild;
            im1.remove();
            let im2 = gallery.lastElementChild;
            im2.remove();
            gallery.insertBefore(im1, gallery.firstChild);
            gallery.insertBefore(im2, gallery.firstChild);
            gallery.style.right = "65vw";
            move_gallery(false);
            first_image = 1;
        }
    });
}

set_gallery_buttons();