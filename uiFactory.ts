import UIBase from './types/UIBase'
import UIDefault from './ui/default'
const instanceMap: Map<String, any> = new Map(); 
export default class uiFactory {
    static getUIInstance(name:string) {
        switch(name.toLowerCase()) {
            case 'default':
                return uiFactory.getUIByClass<UIDefault>(UIDefault);
            default:
                throw new Error('not support uiUI.')
        }
    }
    static getUIByClass<T extends UIBase>(uiUI: new () => T):T {
        if(instanceMap.has(uiUI.name)) {
            return instanceMap.get(uiUI.name);
        }
        const uiUIInstance = new uiUI()
        instanceMap.set(uiUI.name, uiUIInstance)
        return uiUIInstance;
    }
}