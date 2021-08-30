function setRobots() {
    let vacuum_on = document.querySelector("#vacuum_on");
    vacuum_on.setAttribute("disabled", "disabled");
    let blowdown_on = document.querySelector("#blowdown_on");
    blowdown_on.setAttribute("disabled", "disabled");

    let vacuum_off = document.querySelector("#vacuum_off");
    vacuum_off.setAttribute("disabled", "disabled");
    let blowdown_off = document.querySelector("#blowdown_off");
    blowdown_off.setAttribute("disabled", "disabled");

    let wingsUp = document.querySelector("#wings_raise");
    let wingsDown = document.querySelector("#wings_fall");
    let wingsGo = document.querySelector("#wings_go");
    wingsUp.setAttribute("disabled", "disabled");
    wingsDown.setAttribute("disabled", "disabled");
    wingsGo.setAttribute("disabled", "disabled");


    let select = document.querySelector("#sparks").options.selectedIndex;
    let spark = document.querySelector("#sparks").options[select].dataset.name;

    if (spark) {
        let robots = document.querySelector("#robots");
        robots.innerHTML = "";
        let option_1 = document.createElement("option");
        let default_option = document.createElement("option");
        default_option.textContent = "Pls Select Robots";
        default_option.selected = true;
        option_1.textContent = `k2${spark}1`;
        option_1.setAttribute("value", "0");
        let option_2 = document.createElement("option");
        option_2.textContent = `k2${spark}2`
        option_2.setAttribute("value", "1");
        robots.appendChild(default_option);
        robots.appendChild(option_1);
        robots.appendChild(option_2);
    } else {
        let robots = document.querySelector("#robots");
        robots.innerHTML = "";
        let default_option = document.createElement("option");
        default_option.textContent = "Pls Select Robots";
        default_option.selected = true;
        robots.appendChild(default_option);
    }
}

function btnOn() {
    let vacuum_on = document.querySelector("#vacuum_on");
    vacuum_on.removeAttribute("disabled");
    let blowdown_on = document.querySelector("#blowdown_on");
    blowdown_on.removeAttribute("disabled");
    let wingsUp = document.querySelector("#wings_raise");
    let wingsDown = document.querySelector("#wings_fall");
    let wingsGo = document.querySelector("#wings_go");
    wingsUp.removeAttribute("disabled");
    wingsDown.removeAttribute("disabled");
    wingsGo.removeAttribute("disabled");
    let blowdown_off = document.querySelector("#blowdown_off");
    let vacuum_off = document.querySelector("#vacuum_off");
    blowdown_off.removeAttribute("disabled");
    vacuum_off.removeAttribute("disabled");
}


let select = document.querySelector("#sparks");
select.addEventListener("change", setRobots);

let select_robots = document.querySelector("#robots");
select_robots.addEventListener("change", btnOn);


function getRobotData() {
    let select = document.querySelector("#sparks").options.selectedIndex;
    let ip = document.querySelector("#sparks").options[select].value;
    select = document.querySelector("#robots").options.selectedIndex;
    let offset = document.querySelector("#robots").options[select].value;
    let name = document.querySelector("#robots").options[select].textContent;
    return [ip, offset, name]
}


function control(operation, bit) {
    let [ip, offset, name] = getRobotData();

    $.ajax({
        type: "POST",
        url: `/${operation}/${bit}/${ip}/${offset}/${name}`,
    });

    let on_btn = `#${operation}_on`;
    let off_btn = `#${operation}_off`;
    let btn_on = document.querySelector(on_btn);
    let btn_off = document.querySelector(off_btn);
    if (bit === "1") {
        btn_on.setAttribute("disabled", "disabled");
        btn_off.removeAttribute("disabled");
    } else if (bit === "0") {
        btn_off.setAttribute("disabled", "disabled");
        btn_on.removeAttribute("disabled");
    }

}

let wings_raise = document.querySelector("#wings_raise");
let wings_fall = document.querySelector("#wings_fall");
let wings_go = document.querySelector("#wings_go");


wings_raise.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/wings/5/${ip}/${offset}/${name}/0`,
    });
});

wings_raise.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/wings/5/${ip}/${offset}/${name}/1`,
    });
});

wings_fall.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/wings/6/${ip}/${offset}/${name}/0`,
    });
});

wings_fall.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/wings/6/${ip}/${offset}/${name}/1`,
    });
});

wings_go.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/wings/7/${ip}/${offset}/${name}/0`,
    });
});

wings_go.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/wings/7/${ip}/${offset}/${name}/1`,
    });
});


let vacuumOn = document.querySelector("#vacuum_on");
let vacuumOff = document.querySelector("#vacuum_off");

vacuumOn.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/vacuum/1/${ip}/${offset}/${name}/0`,
    });
});

vacuumOn.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/vacuum/1/${ip}/${offset}/${name}/1`,
    });
});

vacuumOff.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/vacuum/0/${ip}/${offset}/${name}/0`,
    });
});

vacuumOff.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/vacuum/0/${ip}/${offset}/${name}/1`,
    });
});

let blowdownOn = document.querySelector("#blowdown_on");
let blowdownOff = document.querySelector("#blowdown_off");

blowdownOn.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/blowdown/1/${ip}/${offset}/${name}/0`,
    });
});

blowdownOn.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/blowdown/1/${ip}/${offset}/${name}/1`,
    });
});

blowdownOff.addEventListener("mouseup", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/blowdown/0/${ip}/${offset}/${name}/0`,
    });
});

blowdownOff.addEventListener("mousedown", (elem)=>{
    let [ip, offset, name] = getRobotData();
    $.ajax({
        type: "POST",
        url: `/blowdown/0/${ip}/${offset}/${name}/1`,
    });
});