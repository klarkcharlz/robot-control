function setRobots() {
    let on = document.querySelector("#cam_on");
    on.setAttribute("disabled", "disabled");

    let save = document.querySelector("#save_pos");
    save.setAttribute("disabled", "disabled");

    let [...number] = document.querySelectorAll("input[type=number]");
    number.forEach((elem)=> {elem.setAttribute("disabled", "disabled");});

    let select = document.querySelector("#sparks").options.selectedIndex;
    let spark = document.querySelector("#sparks").options[select].dataset.name;

    if(spark) {
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
    }
    else {
        let robots = document.querySelector("#robots");
        robots.innerHTML = "";
        let default_option = document.createElement("option");
        default_option.textContent = "Pls Select Robots";
        default_option.selected = true;
        robots.appendChild(default_option);
    }
}

function setOn(){
    let on = document.querySelector("#cam_on");
    on.removeAttribute("disabled");
}

let select = document.querySelector("#sparks");
select.addEventListener("change", setRobots);

let select_robots = document.querySelector("#robots");
select_robots.addEventListener("change", setOn);


function getRobotData(){
    let select = document.querySelector("#sparks").options.selectedIndex;
    let ip = document.querySelector("#sparks").options[select].value;
    select = document.querySelector("#robots").options.selectedIndex;
    let offset = document.querySelector("#robots").options[select].value;
    let name = document.querySelector("#robots").options[select].textContent;
    return [ip, offset, name]
}


(function () {
    let btn_on = document.querySelector("#cam_on");
    let btn_off = document.querySelector("#cam_off");

    let save = document.querySelector("#save_pos");

    let pos_set = document.querySelector("#pos_set");
    let dpi_set = document.querySelector("#dpi_set");
    let sparks = document.querySelector("#sparks");
    let robots = document.querySelector("#robots");

    btn_on.addEventListener("click", function (event) {
        let [...number] = document.querySelectorAll("input[type=number]");
        number.forEach((elem)=> {elem.removeAttribute("disabled");});

        sparks.setAttribute("disabled", "disabled");
        robots.setAttribute("disabled", "disabled");
        btn_on.setAttribute("disabled", "disabled");
        btn_off.removeAttribute("disabled");
        pos_set.removeAttribute("disabled");
        dpi_set.removeAttribute("disabled");
        save.removeAttribute("disabled");

        let [ip, offset, name] = getRobotData();

        // let t_href = event.target;
        // console.log(t_href)
        $.ajax({
            url: `/set_cam/1/${ip}/${offset}/${name}`,
        });
        event.preventDefault();

    });
    btn_off.addEventListener("click", function (event) {
        let [...number] = document.querySelectorAll("input[type=number]");
        number.forEach((elem)=> {elem.setAttribute("disabled", "disabled");});

        btn_on.removeAttribute("disabled");
        btn_off.setAttribute("disabled", "disabled");
        pos_set.setAttribute("disabled", "disabled");
        dpi_set.setAttribute("disabled", "disabled");
        save.setAttribute("disabled", "disabled");
        sparks.removeAttribute("disabled");
        robots.removeAttribute("disabled");

        let [ip, offset, name] = getRobotData();

        // let t_href = event.target;
        // console.log(t_href)
        $.ajax({
            url: `/set_cam/0/${ip}/${offset}/${name}`,
        });
        event.preventDefault();

    });
}());


function control(operation){
    let [ip, offset, name] = getRobotData();

    let form = `#${operation}`

    let data = $(form).serialize()
    // console.log(data);
    // console.log(typeof data);

    $.ajax({
        type: "POST",
        url: `/${operation}/${ip}/${offset}/${name}`,
        data: data,
    });
}


let save = document.querySelector("#save_pos");

save.addEventListener("mousedown", (elem)=>{
    //console.log("НАЖАЛ");
    let [ip, offset, name] = getRobotData();

    // let t_href = event.target;
    // console.log(t_href)
    $.ajax({
        url: `/save_position/${ip}/${offset}/${name}/1`,
    });
});

save.addEventListener("mouseup", (elem)=>{
    //console.log("ОТПУСТИЛ");
    let [ip, offset, name] = getRobotData();

    // let t_href = event.target;
    // console.log(t_href)
    $.ajax({
        url: `/save_position/${ip}/${offset}/${name}/0`,
    });
});

