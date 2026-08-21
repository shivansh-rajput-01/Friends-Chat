let rooms1 = document.querySelectorAll(".room");
let roomContainer = document.querySelector(".room-container");
let search = document.querySelector(".search-input");
let leftPanel = document.querySelector(".rooms");

let roomContainerNew = document.createElement("div");
roomContainerNew.classList.add("room-container", "overflow-y-auto", "w-full", "hide");

leftPanel.append(roomContainerNew);

let roomData = [];

function initialiseRoomData(){
    for(let room of rooms1){
        let rid = room.getAttribute("data-id");
        let userName = room.children[1].getAttribute("data-name");
        let message = formatMessage(room.children[1].getAttribute("data-message"));
        let time = room.children[1].getAttribute("data-time");
        roomData.push({rid, userName, message, time});
    }
    console.log(roomData);
}

initialiseRoomData();

function formatMessage(msg){
    if(msg.length >= 18){
        return msg.slice(0, 19) + "...";
    }
    return msg;
}

function searchFind(usr, search){
    if(usr.includes(search)) return true;
    return false;
}

function createRoom(obj){
    let r = document.createElement("div");
    r.classList.add(
        "flex",
        "items-center",
        "w-[90%]",
        "h-16",
        "border-b",
        "border-b-blue-300",
        "bg-slate-200",
        "hover:bg-slate-300",
        "mx-auto",
        "my-2",
        "rounded-2xl"
    );
    r.innerHTML = `
        <div class="profile w-8 h-8 rounded-full bg-blue-600 ml-4 mr-4 text-2xl flex items-center justify-center text-white p-0">${obj.userName[0].toUpperCase()}</div>
        <div class="name-message w-[70%]">
            ${obj.userName.slice(0, obj.startIdx)}<span style="margin: 0px; color: white; font-size: 1.2rem; background-color: #8794fa;">${obj.userName.slice(obj.startIdx, obj.lastIdx)}</span>${obj.userName.slice(obj.lastIdx, obj.userName.length)}
            <br>
            <div class="mes-box flex justify-between w-full">
                <span class="mes-con text-sm text-black">
                    ${obj.message}
                </span>
                <span class="mes-time text-sm text-black">
                    ${obj.time}
                </span>
            </div>
        </div>
    `;
    r.addEventListener("click", () => {
        window.location.href = `/chats/${obj.rid}`;
    });
    roomContainerNew.append(r);
}

function displayRooms(list, s){
    if(list.length == 0){
        let msg = document.createElement("div");
        msg.style.textAlign = "center";
        msg.innerText = `No friend in friendlist for ${s}`;
        roomContainerNew.append(msg);
    }
    for(let l of list){
        createRoom(l);
    }
}

search.addEventListener("input", () => {
    let searchedRooms = [];
    if(search.value.trim()){
        roomContainerNew.innerHTML = "";
        roomContainerNew.classList.remove("hide");
        for(let r of roomData){
            let {rid, userName, message, time} = r;
            if(searchFind(userName, search.value.trim().toLowerCase())){
                let startIdx = userName.indexOf(search.value.trim().toLowerCase());
                let lastIdx = startIdx + search.value.trim().length;
                searchedRooms.push({rid, userName, message, time, startIdx, lastIdx});
            }
        }
        roomContainer.classList.add("hide");
        displayRooms(searchedRooms, search.value.trim());
    } else {
        roomContainerNew.innerHTML = "";
        roomContainerNew.classList.add("hide");
        roomContainer.classList.remove("hide");
    }
});
