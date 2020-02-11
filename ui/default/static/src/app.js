import appHtml from './app.html'
class AppContainer extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = appHtml;
        const content = template.content.cloneNode(true);
        const shadow = this.attachShadow( { mode: 'closed' } );
        shadow.appendChild(content);
    }
  }
window.customElements.define('app-container', AppContainer);