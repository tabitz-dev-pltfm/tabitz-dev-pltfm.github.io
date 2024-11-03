class FolderCell extends HTMLElement {
    static observedAttributes = ["foldername"];

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const temp = document.createElement("template");
        temp.innerHTML = `
            <style>
                .folder {
                    border: 1px dotted black;
                    background-color: lightgray;
                }
                .container {
                    width: calc(100% - 20px);
                    margin-left: 20px;
                }
            </style>
            <div class="folder">
                <span class="activeText">None</span>
                <div class="container">
                    <slot></slot>
                </div>
            </div>
        `;
        shadow.appendChild(temp.content.cloneNode(true));
    }

    connectedCallback() {
        const folderTitle = this.shadowRoot.querySelector(".activeText");
        this.onclick = () => console.log(this.getAttribute("foldername"));
        folderTitle.onclick = async () => {
            await new Promise((res) => setTimeout(res, 1));
            var newTitle = prompt("以下に入力してフォルダ名を変更してください。");
            if (newTitle) this.setAttribute("foldername", this.getAttribute("foldername").replace(/[^\/]*$/, newTitle));
        }
    }

    attributeChangedCallback(name, _, newValue) {
        const activeText = this.shadowRoot.querySelector(".activeText");
        if (name == "foldername") {
            activeText.innerText = newValue.match(/\/[^\/]*$/)[0];
            const children = this.children;
            for (let child of children) {
                if (child.tagName === "FILE-CELL") {
                    child.setAttribute("filename", newValue + child.getAttribute("filename").match(/\/[^\/]*$/)[0]);
                }
                else {
                    child.setAttribute("foldername", newValue + child.getAttribute("foldername").match(/\/[^\/]*$/)[0]);
                }
            }
        }
    }
}

customElements.define("folder-cell", FolderCell);
