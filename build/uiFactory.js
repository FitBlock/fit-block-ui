"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = require("./ui/default");
const instanceMap = new Map();
class uiFactory {
    static getUIInstance(name) {
        switch (name.toLowerCase()) {
            case 'default':
                return uiFactory.getUIByClass(default_1.default);
            default:
                throw new Error('not support uiUI.');
        }
    }
    static getUIByClass(uiUI) {
        if (instanceMap.has(uiUI.name)) {
            return instanceMap.get(uiUI.name);
        }
        const uiUIInstance = new uiUI();
        instanceMap.set(uiUI.name, uiUIInstance);
        return uiUIInstance;
    }
}
exports.default = uiFactory;
