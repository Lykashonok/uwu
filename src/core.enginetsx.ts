const createElement = (tag : string | Function, props : {[key: string] : any}, ...children : any[]) : HTMLElement => {
    if (typeof tag === "function")
        return tag(props, ...children);
    const element = document.createElement(tag);

    Object.entries(props || {}).forEach(([name, value]) => {
        if (name.startsWith("on") && name.toLowerCase() in window)
            element.addEventListener(name.toLowerCase().substr(2), value);
        else element.setAttribute(name, value.toString());
    });

    children.forEach(child => {
        appendChild(element, child);
    });

    return element;
};

const appendChild = (parent : HTMLElement, child : HTMLElement) => {
    if (Array.isArray(child))
        child.forEach(nestedChild => appendChild(parent, nestedChild));
    else
        parent.appendChild(child.nodeType ? child : document.createTextNode(child.toString()));
};

const createFragment = (props : any, ...children : any[]) => {
    return children;
};

// Global storage manager for redrawing an storaging components
export class uwuTsxRenderManager {
    static hooks : {
        // Key = guid
        [key: string] : Function // function to redraw element
    } = {};

    static render(guid : string, newState : any) {
        this.hooks[guid](newState)
    }
}

const uwuTsx = {
    createElement,
}

export default uwuTsx;