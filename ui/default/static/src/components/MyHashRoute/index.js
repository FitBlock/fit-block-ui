import HTMLContent from '@/components/HTMLContent'
export default class MyHashRoute extends HTMLContent {
    constructor() {
        super();
        this.path = this.getAttribute('path');
        this.tag = this.getAttribute('tag');
        const html = window.location.hash==this.path?`<${this.tag}/>`:'';
        this.render(html)
    }
  }
