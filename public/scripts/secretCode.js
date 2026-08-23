let secretCode = document.querySelector(".get-code");
let film = document.querySelector(".film");
let codePopup = document.querySelector(".code-box");
let close = document.querySelector(".close");
let pCode = document.querySelector(".permanent-code");
let pCodeCopy = document.querySelector(".permanent-code-copy");
let tCode = document.querySelector(".temporary-code");
let tCodeCopy = document.querySelector(".temporary-code-copy");
let genCode = document.querySelector(".gen-code");

secretCode.addEventListener("click", () => {
    film.classList.remove("hide");
});

close.addEventListener("click", () => {
    film.classList.add("hide");
});

pCodeCopy.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(pCode.getAttribute("data-code"));
        document.querySelector(".copied").classList.remove("hide");
        setTimeout(() => {
            document.querySelector(".copied").classList.add("hide");
        }, 1000);
        console.log("Data copied successfully!");
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
});

tCodeCopy.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(tCode.getAttribute("data-code"));
        document.querySelector(".temp-copied").classList.remove("hide");
        setTimeout(() => {
            document.querySelector(".temp-copied").classList.add("hide");
        }, 1000);
        console.log("Data copied successfully!");
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
});

genCode.addEventListener("click", async () => {
    let userName = document.querySelector(".user-input").value;
    if (!userName) {
        document.querySelector(".empty-user").classList.remove("hide");
        document.querySelector(".temp-mes").classList.add("hide");
        document.querySelector(".temp-box").classList.add("hide");
        document.querySelector(".not-user").classList.add("hide");
        return;
    }else{
        document.querySelector(".empty-user").classList.add("hide");
        try {
            const response = await fetch(`/code?u=${encodeURIComponent(userName)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error details:", errorData);
                document.querySelector(".temp-mes").classList.add("hide");
                document.querySelector(".temp-box").classList.add("hide");
                document.querySelector(".not-user").classList.remove("hide");
                document.querySelector(".not-user").innerText = `${errorData.error}`;
                throw new Error(errorData.error || "Something went wrong!");
            }

            const data = await response.json();
            console.log("Generated Code:", data.code);
            document.querySelector(".temp-mes").classList.remove("hide");
            document.querySelector(".temp-box").classList.remove("hide");
            document.querySelector(".not-user").classList.add("hide");
            tCode.innerText = `${data.code}`;
            tCode.setAttribute("data-code", `${data.code}`);
        } catch (err) {
            console.error("Error fetching code:", err);
        }
    }
});
