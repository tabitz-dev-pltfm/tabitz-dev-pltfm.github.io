const allFiles = document.getElementById("allFiles");
const addFileButton = document.getElementById("addFileButton");
const addFolderButton = document.getElementById("addFolderButton");
const fileInput = document.querySelector('input[type="file"]');
const fileContent = document.getElementById("fileContent");
const saveButton = document.getElementById("saveButton");
const refreshButton = document.getElementById("refreshButton");
const deleteButton = document.getElementById("deleteButton");
const fileTitle = document.getElementById("fileTitle");
var focusedFolder = allFiles;

allFiles.addEventListener("click", (e) => {
    let target;
    if (e.target.tagName === "FOLDER-CELL") {
        target = e.target;
    }
    else if (e.target.tagName === "FILE-CELL") {
        target = e.target.parentElement;
    }
    else {
        target = allFiles;
    }
    const folderCellList = allFiles.querySelectorAll("folder-cell");
    for (let folderCell of folderCellList) {
        folderCell.shadowRoot.querySelector(".folder").style.backgroundColor = "lightgray";
    }
    if (target.tagName === "FOLDER-CELL") {
        target.shadowRoot.querySelector(".folder").style.backgroundColor = "gray";
    }
    focusedFolder = target;
});

allFiles.addEventListener("click", (e) => {
    const fileCellList = allFiles.querySelectorAll("file-cell");
    for (let fileCell of fileCellList) {
        fileCell.shadowRoot.querySelector(".file").style.color = "black";
        fileCell.shadowRoot.querySelector(".file").style.fontWeight = 400;
    }
    if (e.target.tagName === "FILE-CELL") {
        e.target.shadowRoot.querySelector(".file").style.color = "red";
        e.target.shadowRoot.querySelector(".file").style.fontWeight = 700;
    }
});

addFileButton.onclick = () => {
    if (focusedFolder !== allFiles) {
        let newFileCell = document.createElement("file-cell");
        newFileCell.setAttribute("filename", focusedFolder.getAttribute("foldername") + "/__file__.txt");
        focusedFolder.appendChild(newFileCell);
    }
    else {
        let newFileCell = document.createElement("file-cell");
        newFileCell.setAttribute("filename", "/__file__.txt");
        allFiles.appendChild(newFileCell);
    }
};

addFolderButton.onclick = () => {
    if (focusedFolder !== allFiles) {
        let newFolderCell = document.createElement("folder-cell");
        newFolderCell.setAttribute("foldername", focusedFolder.getAttribute("foldername") + "/__folder__");
        focusedFolder.appendChild(newFolderCell);
    }
    else {
        let newFolderCell = document.createElement("folder-cell");
        newFolderCell.setAttribute("foldername", "/__folder__");
        allFiles.appendChild(newFolderCell);
    }
};

fileInput.onchange = () => {
    const file = fileInput.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
        fileContent.innerText = fileReader.result;
    };
    fileReader.readAsText(file);
};


refreshButton.onclick = () => {
    fileInput.value = null;
    fileContent.innerText = "";
};

fileTitle.onclick = () => {
    var newTitle = prompt("以下に入力してファイルの名前を変更してください。");
    if (newTitle) {
        const fileCellList = allFiles.querySelectorAll("file-cell");
        var targetFileCell = null;
        for (let fileCell of fileCellList) {
            if (fileCell.shadowRoot.querySelector(".file").style.color == "red") {
                targetFileCell = fileCell;
            }
        }
        if (targetFileCell) {
            targetFileCell.setAttribute("filename", targetFileCell.getAttribute("filename").replace(/[^\/]*$/,"") + newTitle);
            fileTitle.innerText = newTitle;
        }
        else {
            alert("変更するファイルが見つかりませんでした。");
        }
    }
};

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
        .then(() => console.log("Service Worker is successfully registered"))
        .catch(() => console.log("Service Worker registration failed"))
}


saveButton.onclick = () => {
    if (fileInput.value) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
                command: "add",
                file: fileInput.files[0],
                pathname: (() => {
                    const fileCellList = allFiles.querySelectorAll("file-cell");
                    var targetFileCell = null;
                    for (let fileCell of fileCellList) {
                        if (fileCell.shadowRoot.querySelector(".file").style.color == "red") {
                            targetFileCell = fileCell;
                        }
                    }
                    if (targetFileCell) {
                        console.log(targetFileCell.getAttribute("filename"));
                        return targetFileCell.getAttribute("filename");
                    }
                    else {
                        return "unknown";
                    }
                })()
            });
        });
    }
    else {
        alert("参照するローカルファイルが選択されていません");
    }
};

refreshButton.onclick = () => {
    navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({
            command: "delete",
            pathname: (() => {
                const fileCellList = allFiles.querySelectorAll("file-cell");
                var targetFileCell = null;
                for (let fileCell of fileCellList) {
                    if (fileCell.shadowRoot.querySelector(".file").style.color == "red") {
                        targetFileCell = fileCell;
                    }
                }
                if (targetFileCell) {
                    console.log(targetFileCell.getAttribute("filename"));
                    return targetFileCell.getAttribute("filename");
                }
                else {
                    return "unknown";
                }
            })()
        });
        fileInput.value = null;
        fileContent.innerText = "";
    });
}

deleteButton.onclick = () => {
    navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({
            command: "delete",
            pathname: (() => {
                var result;
                const fileCellList = allFiles.querySelectorAll("file-cell");
                var targetFileCell = null;
                for (let fileCell of fileCellList) {
                    if (fileCell.shadowRoot.querySelector(".file").style.color == "red") {
                        targetFileCell = fileCell;
                    }
                }
                if (targetFileCell) {
                    console.log(targetFileCell.getAttribute("filename"));
                    result = targetFileCell.getAttribute("filename");
                    targetFileCell.remove();
                    fileTitle.innerText = "選択されていません";
                }
                else {
                    result = "unknown";
                }
                return result;
            })()
        });
        fileInput.value = null;
        fileContent.innerText = "";
    });
}
