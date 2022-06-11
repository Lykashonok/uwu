import { declarationCheck, uwuControllerManager } from "./core";
import { BOTH_WAY_BIND_CLOSE, BOTH_WAY_BIND_OPEN, CONSTRUCTIONAL, IN_WAY_BIND_CLOSE, IN_WAY_BIND_OPEN, KEYWORD, OUTPUT_WAY_BIND_CLOSE, OUTPUT_WAY_BIND_OPEN, OUT_WAY_BIND_CLOSE, OUT_WAY_BIND_OPEN, SPECS } from "./core.constants";
import { Type, uwuControllerType, uwuDeclaration, uwuModuleType } from "./core.types";
import { guid, isObject, observe, observeArray } from "./funcs";

enum BindingWay {
    IN_WAY,
    OUT_WAY,
    OUTPUT_WAY,
    TWO_WAY,
    CONSTRUCTIONAL,
    BOTH_WAY,
    NONE
}

enum BindingValue {
    PROPERTY,
    STATIC,
    FUNCTION,
}

/**
 * @interface CustomVariable uwuFor="const a of this.some_array"
 */
interface CustomVariable {
    /**
     * @param elementName text representation 'a'
     */
    elementName: string,
    /**
     * @param element as object as element of this.some_array
     */
    element: any,
    /**
     * @param elementAction must be performed after changing this attribute
     */
    elementAction: Function
    /**
     * @param elementAction must be performed after changing this attribute
     */
    elementArray: Array<any>
}

declare global {
    interface HTMLElement { guid?: string; }
    interface Text { guid?: string; }
}

type HTMLFullElement = HTMLElement | Comment;

const FUNCTION_REGEXP = new RegExp(/\(.*\)$/);
const FUNCTION_ARGS_REGEXP = new RegExp(/\([0-9,A-a,Z-z,\., \,]+\)$/);


export class BindingEngine {
    constructor(
        private controllerInstance: uwuControllerType,
    ) { }

    public getControllerBindedToNodes(controllerInstance: uwuControllerType, parentNode: HTMLElement): [uwuControllerType, HTMLElement] {
        controllerInstance ??= this.controllerInstance;
        const target = parentNode.cloneNode(false) as HTMLElement;
        target.guid = parentNode.guid;
        parentNode.childNodes.forEach((childNodeOld: ChildNode) => {
            const childNodeNew = this.processNode(controllerInstance, childNodeOld as HTMLElement);
            target.append(...childNodeNew);
        });
        return [controllerInstance, target];
    }

    private processNode(controllerInstance: uwuControllerType, node: HTMLElement, customVariable: CustomVariable | null = null): Array<HTMLFullElement> {
        const el = node as HTMLElement;
        const controller = this.importControllerByTag(controllerInstance, el.tagName);
        el.guid ??= guid();
        let pack: HTMLFullElement[] = [];
        if (controller == null) {
            // console.log("now scanning", node, node.nodeType);
            if (node.tagName == "PRE") {
                pack.push(node);
            } else {
                switch (node.nodeType) {
                    case node.ELEMENT_NODE:
                        const attribute_names_all = el.getAttributeNames();
                        const attribute_names = attribute_names_all.filter(el => !el.startsWith(CONSTRUCTIONAL));
                        const constructional_names = attribute_names_all.filter(el => el.startsWith(CONSTRUCTIONAL));
                        if (constructional_names.length > 0) {
                            for (const constructional_name of constructional_names) {
                                return this.processNodeConstructionally(controllerInstance, el, constructional_name);
                            }
                        } else {
                            const template_element = node.cloneNode(false) as HTMLElement;
                            template_element.guid = node.guid;
                            for (const attribute_name of attribute_names) {
                                const attribute_value = template_element.getAttribute(attribute_name)?.trim() ?? '';
                                const attribute_name_specless = this.withoutSpec(attribute_name);
                                if (attribute_name_specless != attribute_name) {
                                    template_element.removeAttribute(attribute_name);
                                }
    
                                switch (this.checkBindingWay(attribute_name, attribute_value)) {
                                    case BindingWay.IN_WAY:
                                        this.bindInWay(attribute_name_specless, attribute_value, template_element, controllerInstance, customVariable);
                                        break;
                                    case BindingWay.OUT_WAY:
                                        this.bindOutWay(attribute_name_specless, attribute_value, template_element, controllerInstance, customVariable);
                                        break;
                                    case BindingWay.BOTH_WAY:
                                        this.bindBothWay(attribute_name_specless, attribute_value, template_element, controllerInstance, customVariable);
                                        break;
                                    case BindingWay.NONE:
                                        break;
                                    default:
                                        throw new Error(`Can't identify binding type '${attribute_name}' '${attribute_value}'`);
                                }
                            }
                            node.childNodes.forEach((childNodeOld: ChildNode) => {
                                const childNodeNew = this.processNode(controllerInstance, childNodeOld as HTMLElement, customVariable);
                                template_element.append(...childNodeNew)
                            });
                            pack = [template_element];
                        }
                        break;
                    case node.TEXT_NODE:
                        // console.log(node.parentElement);
                        const contents = node.textContent?.trim().split(' ') ?? [];
                        // const parent = node.parentNode!;
                        for (let textToken of contents) {
                            const newNode = document.createTextNode(textToken);
                            newNode.guid = guid();
                            pack.push(newNode, document.createTextNode(' '));
                            switch (this.checkBindingWay('', textToken)) {
                                case BindingWay.OUTPUT_WAY:
                                    this.bindTextOutPutWay(this.withoutSpec(textToken), newNode, controllerInstance, customVariable);
                                default:
                                    // parent.insertBefore(newNode, node)
                                    continue;
                            }
                        }
                    default:
                    // console.error(node);
                    // throw new Error(`Can't determine node type ${node.nodeType}`);
                }
            }
        } else {
            const controllerManager: uwuControllerManager = new uwuControllerManager();
            let [controllerInstanceInner, el] = controllerManager.processPageByController(controller, node);
            if (declarationCheck(controller.prototype.type, uwuDeclaration.Controller)) {
                const bindingEngine: BindingEngine = new BindingEngine(controllerInstanceInner);
                [controllerInstanceInner, el] = bindingEngine.getControllerBindedToNodes(controllerInstanceInner, el);
                for (const attribute_name of el.getAttributeNames()) {
                    const attribute_value = el.getAttribute(attribute_name)?.trim() ?? '';
                    const attribute_name_specless = this.withoutSpec(attribute_name);

                    switch (this.checkBindingWay(attribute_name, attribute_value)) {
                        case BindingWay.IN_WAY:
                            this.bindInWayInner(attribute_name_specless, attribute_value, el, controllerInstanceInner);
                            break;
                        case BindingWay.OUT_WAY:
                            this.bindOutWay(attribute_name_specless, attribute_value, el, controllerInstance);
                            break;
                        case BindingWay.NONE:
                            break;
                        default:
                            throw new Error(`Can't identify binding type for inner controller '${attribute_name}' '${attribute_value}'`);
                    }
                }
            }
            pack = [el];
        }
        return pack;
    }

    private processNodeConstructionally(controllerInstance: uwuControllerType, el: HTMLElement, attribute_name: string): Array<HTMLFullElement> {
        const attribute_name_specless = this.withoutSpec(attribute_name);
        const attribute_value = el.getAttribute(attribute_name);
        const node_template = el.cloneNode(true) as HTMLElement;
        node_template.removeAttribute(attribute_name);
        const template_comment = document.createComment(el.guid!);

        if (attribute_value == null) {
            throw new Error(`Empty attribute value faced ${attribute_name} in ${el}`);
        }
        switch (attribute_name_specless) {
            case `${KEYWORD}for`:
                const declaration = attribute_value.trim().split(' ');
                if (declaration[2] != 'of' || declaration[0] != 'let' || declaration.length != 4) {
                    throw new Error("Bad uFor declaration, must be 'let element of this.array'");
                }
                const [l, elementName, o, targetArray] = declaration;

                const elementsArray: Array<HTMLFullElement> = [];
                let array: Array<any> = this.scopeEval(controllerInstance, targetArray);
                if (!Array.isArray(array)) {
                    throw new Error(`${targetArray} is not type of Array`);
                }
                const action = (newArray: Array<any>) => {
                    for (const node of elementsArray) {
                        template_comment.parentElement?.removeChild(node);
                    }
                    while (elementsArray.length) { elementsArray.pop(); }
                    for (const newElement of newArray) {
                        const htmlElement = node_template.cloneNode(true) as HTMLElement;
                        htmlElement.guid = guid();
                        const innerElements = this.processNode(controllerInstance, htmlElement, {
                            element: newElement,
                            elementName: elementName,
                            elementAction: action,
                            elementArray: array,
                        });
                        template_comment.before(...innerElements);
                        elementsArray.push(...innerElements);
                    }
                }
                observeArray(array, action);
                action(this.scopeEval(controllerInstance, targetArray));
                return [template_comment, ...elementsArray];

            default:
                throw new Error(`Can't find attribute ${attribute_name}`);
        }
    }

    private importControllerByTag(controllerInstance: uwuControllerType, tagName: string): uwuControllerType | null {
        const module = controllerInstance.parent as uwuModuleType;
        return (module.prototype.exports as Array<Type<any>>).find((el: Type<any>) => tagName != undefined && (el.prototype?.selector.toString().toLowerCase() ?? "") == tagName.toLowerCase()) ?? null;
    }

    private borderedWith(target: string, left: string, right: string): boolean {
        return target.startsWith(left) && target.endsWith(right);
    }

    private withoutSpec(target: string): string {
        for (const spec of SPECS) {
            target = target.replace(spec, '');
        }
        return target;
    }

    private scopeEval(scope: any, script: string) {
        return Function('"use strict";return (' + script + ')').bind(scope)();
    }

    private checkBindingWay(attribute_name: string, attribute_value: string): BindingWay | null {
        attribute_name = attribute_name.trim();
        attribute_value = attribute_value.trim();
        if (attribute_value != null) {
            if (this.borderedWith(attribute_name, BOTH_WAY_BIND_OPEN, BOTH_WAY_BIND_CLOSE)) {
                return BindingWay.BOTH_WAY;
            } else if (this.borderedWith(attribute_value, CONSTRUCTIONAL, '')) {
                return BindingWay.CONSTRUCTIONAL;
            } else if (this.borderedWith(attribute_name, IN_WAY_BIND_OPEN, IN_WAY_BIND_CLOSE)) {
                return BindingWay.IN_WAY;
            } else if (this.borderedWith(attribute_name, OUT_WAY_BIND_OPEN, OUT_WAY_BIND_CLOSE)) {
                return BindingWay.OUT_WAY;
            } else if (this.borderedWith(attribute_value, OUTPUT_WAY_BIND_OPEN, OUTPUT_WAY_BIND_CLOSE)) {
                return BindingWay.OUTPUT_WAY;
            }
        }
        return BindingWay.NONE;
    }

    private bindBothWay(attribute_name_specless: string, attribute_value: string, el: HTMLElement, controllerInstance: uwuControllerType = this.controllerInstance, customVariable: CustomVariable | null = null): void {
        switch (attribute_name_specless) {
            case `${KEYWORD}model`:
                switch (el.tagName) {
                    case 'INPUT':
                        const actionIn = this.getActionByAttribute(el, 'value');
                        const actionOut = (ev: InputEvent) => this.dispatchBindingEvent(controllerInstance, attribute_value, (ev.target as HTMLInputElement).value);

                        this.addBindingEventToAttribute(attribute_value, actionIn, el, controllerInstance, customVariable);
                        this.bindOutWay('keyup', attribute_value, el, controllerInstance, customVariable, actionOut);
                        break;
                    default:
                        throw new Error(`Can't find model binding way for element ${el}`);
                }
                break;
            default:
                throw new Error(`Can't find binding way for ${attribute_name_specless}`);
        }
    }

    private bindInWay(attribute_name_specless: string, attribute_value: string, el: HTMLElement, controllerInstance: uwuControllerType = this.controllerInstance, customVariable: CustomVariable | null = null): void {
        const action = this.getActionByAttribute(el, attribute_name_specless);
        this.addBindingEventToAttribute(attribute_value, action, el, controllerInstance, customVariable);
    }

    private bindInWayInner(attribute_name_specless: string, attribute_value: string, el: HTMLElement, controllerInstance: uwuControllerType = this.controllerInstance): void {
        const attribute_name_specless_this = `this.${attribute_name_specless}`;
        const action = (newValue: any) => this.dispatchBindingEvent(controllerInstance, attribute_name_specless_this, newValue);
        this.addBindingEventToAttribute(attribute_value, action, el, this.controllerInstance);
    }

    private bindOutWay(attribute_name_specless: string, attribute_value: string, el: HTMLElement, controllerInstance: uwuControllerType = this.controllerInstance, customVariable: CustomVariable | null = null, action: Function | null = null,): HTMLElement {
        let [cleared_attribute_value, args] = this.getFunctionClearedAttributeValue(attribute_value);
        el.addEventListener(attribute_name_specless, (ev: Event) => {
            const propToRun = this.scopeEval(controllerInstance, cleared_attribute_value);
            if (typeof propToRun == 'function') {
                args = this.scopeEval(controllerInstance, `[${args}]`);
                (propToRun as Function).call(controllerInstance, ev, ...args);
            } else if (action != null) {
                action(ev, ...args);
            } else {
                this.scopeEval(controllerInstance, cleared_attribute_value)
            }
        });
        return el;
    }

    private bindTextOutPutWay(attribute_value: string, el: Text, controllerInstance: uwuControllerType = this.controllerInstance, customVariable: CustomVariable | null = null): Text {
        const action = (newValue: any) => el.textContent = newValue;
        this.addBindingEventToAttribute(attribute_value, action, el, controllerInstance, customVariable);
        return el;
    }

    addBindingEventToAttribute(attribute_value: string, action: Function, elementToBind: HTMLElement | Text, controllerInstance: uwuControllerType = this.controllerInstance, customVariable: CustomVariable | null = null) {
        // Clearing calls from value
        let [cleared_attribute_value, _] = this.getFunctionClearedAttributeValue(attribute_value);

        // Getting parts for replacing to ''
        let tokens = cleared_attribute_value.split('.');
        const fullTokens: string[] = [];
        tokens.reduce((prev, next) => {
            const joined = [prev, next].join('.');
            fullTokens.push(joined);
            return joined;
        });

        if (customVariable != null && cleared_attribute_value.startsWith(customVariable.elementName)) {
            const scopedCustomVariableName = cleared_attribute_value.replace(customVariable.elementName, 'this');
            let currentValue = this.scopeEval(customVariable.element, scopedCustomVariableName);
            action(currentValue);
        } else if (fullTokens.length > 0) {
            // Go through every part and add it to bindPack
            // console.log("Starting binding", cleared_attribute_value, "to", elementToBind);
            for (const token of fullTokens) {
                const shouldRunAction = cleared_attribute_value == token;
                const parentProperty = this.scopeEval(controllerInstance, token.slice(0, token.lastIndexOf('.')));
                const splittedTokens = token.split('.');
                const propertyToBind = splittedTokens[splittedTokens.length - 1];
                let currentValue = this.scopeEval(controllerInstance, token);
                if (elementToBind.guid == undefined) {
                    throw new Error("Trying to bind element with empty guid");
                }

                if (token in controllerInstance.bindPack && ((elementToBind.guid ?? "") in controllerInstance.bindPack[token].actions == false)) {
                    // console.log("value was in bindPack and guid was not set in actions for this guid", token, elementToBind);
                    if (shouldRunAction) {
                        controllerInstance.bindPack[token].actions[elementToBind.guid] = action;
                    }
                } else {
                    // console.log("setting binding at first", token, elementToBind);
                    Object.defineProperty(parentProperty, propertyToBind, {
                        set: (newValue: any) => {
                            currentValue = newValue;
                            this.dispatchBindingEvent(controllerInstance, token);
                        },
                        get: () => currentValue,
                    });
                    controllerInstance.bindPack[token] = {
                        descriptor: Object.getOwnPropertyDescriptor(parentProperty, propertyToBind),
                        actions: shouldRunAction ? { [elementToBind.guid ?? ""]: action } : {}
                    };
                }
                if (shouldRunAction) {
                    parentProperty[propertyToBind] = currentValue;
                }
            }
        } else {
            // just add notifiers
            const newTokens = cleared_attribute_value.split(/\W+/).filter(e => e.startsWith('this'))
            const shouldRunAction = true;
            for (const token of newTokens) {
                if (token in controllerInstance.bindPack && ((elementToBind.guid ?? "") in controllerInstance.bindPack[token].actions == false)) {
                    if (shouldRunAction) {
                        controllerInstance.bindPack[token].actions[elementToBind.guid ?? ""] = action;
                    }
                } else {
                    controllerInstance.bindPack[token] = {
                        actions: shouldRunAction ? { [elementToBind.guid ?? ""]: action } : {}
                    }
                }
            }
            action(this.scopeEval(controllerInstance, attribute_value));
        }
    }

    dispatchBindingEvent(controllerInstance: uwuControllerType, token: string, forceValue: any = null) {
        const bindingsToInform = Object.keys(controllerInstance.bindPack).filter(el => el.startsWith(token) /*&& el != token */);
        for (const bindingKey of bindingsToInform) {
            const binding = controllerInstance.bindPack[bindingKey];
            for (const guid in binding.actions) {
                if (binding.descriptor != undefined && binding.descriptor.get != undefined) {
                    binding.actions[guid](forceValue ?? binding.descriptor.get());
                }
            }
        }
    }

    private getFunctionClearedAttributeValue(attribute_value: string): string[] {
        let cleared_attribute_value = attribute_value;
        FUNCTION_REGEXP.exec(attribute_value)?.forEach((part: string) => {
            cleared_attribute_value = attribute_value.replace(part, '');
        });
        const argsArray = FUNCTION_ARGS_REGEXP.exec(attribute_value) ?? [];
        const args = argsArray.length > 0 ? this.withoutSpec(argsArray[0]) : "";
        return [cleared_attribute_value, args];
    }

    private getActionByAttribute(el: HTMLElement, attribute: string): Function {
        switch (attribute.toLowerCase()) {
            case 'value':
                if (el instanceof HTMLInputElement) {
                    return (newValue: any) => el.value = newValue;
                }
            case 'innerhtml':
                return (newValue: any) => el.innerHTML = newValue;
            case `${KEYWORD}class`:
                return (newValue: { [cls: string]: boolean }) => {
                    Object.keys(newValue).filter(c => newValue[c]).forEach(styleClass => el.classList.add(styleClass));
                    Object.keys(newValue).filter(c => !newValue[c]).forEach(styleClass => el.classList.remove(styleClass));
                };
            case `${KEYWORD}style`:
                return (newValue: { [cls: string]: string }) => {
                    Object.keys(newValue).forEach(style => style in el.style ? el.style.setProperty(style, newValue[style]) : false);
                };
            default:
                return (newValue: any) => el.setAttribute(attribute, newValue);
        }
    }
}