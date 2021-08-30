let postFrom = undefined;
let postTo = undefined;

function getRobotData() {
    let select = document.querySelector("#sparks").options.selectedIndex;
    let ip = document.querySelector("#sparks").options[select].value;
    select = document.querySelector("#robots").options.selectedIndex;
    let offset = document.querySelector("#robots").options[select].value;
    let name = document.querySelector("#robots").options[select].textContent;
    return [ip, offset, name]
}


function sendTransfer() {
    let [ip, offset, name] = getRobotData();

    $.ajax({
        type: "POST",
        url: `/material_transfer_bd/${ip}/${offset}/${name}/${postFrom}/${postTo}`,
        data: $('#transfer_material_to_bd').serialize(),
    });
}

function setRobots() {
    let cnt = document.querySelector("#cnt");
    cnt.setAttribute("disabled", "disabled");
    let depth = document.querySelector("#depth");
    depth.setAttribute("disabled", "disabled");
    let transfer_set = document.querySelector("#transfer_set");
    transfer_set.setAttribute("disabled", "disabled");
    let flexSwitchCheckDefault = document.querySelector("#flexSwitchCheckDefault");
    flexSwitchCheckDefault.setAttribute("disabled", "disabled");

    let [...tds] = document.querySelectorAll("td");
    tds.forEach((elem) => {
        elem.textContent = "0";
        elem.style.backgroundColor = "";
    });


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

function setOn() {
    let select = document.querySelector("#robots").options.selectedIndex;
    let offset = document.querySelector("#robots").options[select].value

    let numberPost = offset == 0 ? ["4", "5", "1", "2"] : ["5", "6", "2", "3"];

    let td_from_1 = document.querySelector("#from_1_td");
    td_from_1.textContent = numberPost[0];

    let td_from_2 = document.querySelector("#from_2_td");
    td_from_2.textContent = numberPost[1];

    let td_from_3 = document.querySelector("#from_3_td");
    td_from_3.textContent = numberPost[2];

    let td_from_4 = document.querySelector("#from_4_td");
    td_from_4.textContent = numberPost[3];


    let td_to_1 = document.querySelector("#to_1_td");
    td_to_1.textContent = numberPost[0];

    let td_to_2 = document.querySelector("#to_2_td");
    td_to_2.textContent = numberPost[1];

    let td_to_3 = document.querySelector("#to_3_td");
    td_to_3.textContent = numberPost[2];

    let td_to_4 = document.querySelector("#to_4_td");
    td_to_4.textContent = numberPost[3];


    let cnt = document.querySelector("#cnt");
    cnt.removeAttribute("disabled");
    let depth = document.querySelector("#depth");
    depth.removeAttribute("disabled");
    let flexSwitchCheckDefault = document.querySelector("#flexSwitchCheckDefault");
    flexSwitchCheckDefault.removeAttribute("disabled");
    let transfer_set = document.querySelector("#transfer_set");
    transfer_set.removeAttribute("disabled");

}


let select = document.querySelector("#sparks");
select.addEventListener("change", setRobots);

let select_robots = document.querySelector("#robots");
select_robots.addEventListener("change", setOn);

let [...tds] = document.querySelectorAll("td");
tds.forEach((elem) => {
    elem.addEventListener("click", (target) => {
        //  console.log(target.target);
        if (target.target.dataset.post === "from") {
            let [...tdsF] = document.querySelectorAll("._from");
            tdsF.forEach((elem) => {
                elem.style.backgroundColor = "";
            });
            target.target.style.backgroundColor = "green";
            //console.log("from");
            postFrom = target.target.textContent;
            // console.log(postFrom);
        } else if (target.target.dataset.post === "to") {
            let [...tdsT] = document.querySelectorAll("._to");
            tdsT.forEach((elem) => {
                elem.style.backgroundColor = "";
            });
            target.target.style.backgroundColor = "green";
            //console.log("to");
            postTo = target.target.textContent;
            // console.log(postTo);
        }
    })
});
