var focusedFile = null;
const fileTitle = document.getElementById("fileTitle");

class FileCell extends HTMLElement {
    static observedAttributes = ["filename"];

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const temp = document.createElement("template");
        temp.innerHTML = `
            <style>
                .file {
                    border: 1px dotted black;
                    background-color: white;
                }
            </style>
            <div class="file">
            </div>
        `;
        shadow.appendChild(temp.content.cloneNode(true));
    }

    connectedCallback() {
        const div = this.shadowRoot.querySelector(".file");
        this.onpointerover = () => {
            div.style.backgroundColor = "rgb(240,240,240)";
        };
        this.onpointerout = () => {
            div.style.backgroundColor = "white";
        };
        this.onclick = () => {
            focusedFile = this;
            fileTitle.innerText = this.getAttribute("filename").match(/[^\/]*$/)[0];
            console.log(this.getAttribute("filename"));
        };
    }

    attributeChangedCallback(name, _, newValue) {
        const div = this.shadowRoot.querySelector(".file");
        if (name == "filename") {
            div.innerText = newValue.match(/[^\/]*$/)[0];
        }
    }
}

customElements.define("file-cell", FileCell);
