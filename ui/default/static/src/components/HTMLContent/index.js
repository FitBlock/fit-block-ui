export default class HTMLContent extends HTMLElement {
    constructor() {
        super();
        this.content = null;
        this.shadow = null;
    }
    render(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        this.content = template.content.cloneNode(true);
        this.shadow = this.attachShadow( { mode: 'closed' } );
        this.shadow.appendChild(this.content);
    }
  }