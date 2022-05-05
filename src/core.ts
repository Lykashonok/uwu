import { autoInjectable, container, inject, injectable } from "tsyringe";
import { AppService } from "./app.service";
import { parsedUrl, Route, Type, uwuControlConfig, uwuControllerType, uwuDeclaration, uwuModuleConfig, uwuModuleType, uwuRouterType, uwuRoutesConfig } from "./core.types";
import { parseQuery } from "./funcs";

class uwuModuleManager {
    public target: uwuModuleType;
    constructor(target: Type<Function>) {
        this.target = target;
    };

    render(selector = 'application'): void {

    }

    public getRouter(): uwuRouterType | null {
        const imports = this.target.prototype.imports;
        if (Array.isArray(imports)) {
            for (const obj of imports) {
                if (declarationCheck(obj.prototype.type, uwuDeclaration.Router)) {
                    return obj;
                }
            }
        }
        return null;
    }
}

class uwuRouteManager {
    public getControllerByUrl(): uwuControllerType {
        const parsedUrl = this.processUrl();
        return this.getComponentToRenderByParsedUrl(parsedUrl);
    }

    private processUrl(): parsedUrl {
        const location = window.location;
        return {
            url: new URL(window.location.toString()),
            params: parseQuery(location.search),
            path_raw: location.pathname,
            path: location.pathname.split('/').filter(el => el.trim() != ''),
        };
    }

    private getComponentToRenderByParsedUrl(parsedUrl: parsedUrl): uwuControllerType {
        let currentModule : Type<any> | null = window.root;
        let currentPath = parsedUrl.path.length > 0 ? parsedUrl.path : [''];
        while (currentModule != null) {
            const router = this.getRouterByModule(currentModule);
            if (router == null) {
                throw new Error(`Module with name ${currentModule.name} doesn't have router module in its imports section!`);
            }
            const routes = router.prototype.routes as Route[];
            for (let path_section of currentPath) {
                if (path_section == '/') {
                    path_section = '';
                }
                const found_section = routes.find(route => {
                    if (route.path == path_section) {
                        return true;
                    }
                    if (route.regexp) {
                        const regexp = new RegExp(path_section);
                        return regexp.test(route.path);
                    }
                    return false;
                });
                if (found_section == undefined) {
                    throw new Error(`Can't find route target for route '${parsedUrl.path_raw}' at section '${path_section}'`);
                }
                const target = found_section.target;
                if (declarationCheck(target.prototype.type, uwuDeclaration.Controller)) {
                    return target;
                } else if (declarationCheck(target.prototype.type, uwuDeclaration.Module)) {
                    currentPath.shift();
                    currentModule = target as Type<any>;
                    break;
                } else {
                    throw new Error("Object must be uwu type (uwuModule, uwuService etc.)");
                }
            }
        }
        throw new Error(`Can't find any endpoint for route ${parsedUrl.path_raw}`);
    }

    private getRouterByModule(module: uwuModuleType): uwuRouterType | null {
        const imports = module.prototype.imports;
        if (Array.isArray(imports)) {
            for (const obj of imports) {
                if (declarationCheck(obj.prototype.type, uwuDeclaration.Router)) {
                    return obj;
                }
            }
        }
        return null;
    }
}

class uwuControllerManager {
    public processPageByController(controller: uwuControllerType) {
        const content : string = this.getTemplateContent(controller.prototype.template);
        const parsedHTML = this.parseHTMLContent(content);
        const rootNode = parsedHTML.querySelector("body");
        console.log('parsedHTML', rootNode?.childNodes);
    }

    private getTemplateContent(template : string) : string {
        // if (fs.existsSync(template)) {
        //     return fs.readFileSync(template, {encoding:'utf8', flag:'r'}).toString();
        // }
        return template;
    }

    private parseHTMLContent(content : string) : Document {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(content, 'text/html');
        return htmlDoc;
    }
}

function declarationCheck(target: any, compareTo: uwuDeclaration) {
    return target as uwuDeclaration == compareTo;
}


export function uwuModule(config: uwuModuleConfig): Function {
    return (moduleClass: Function) => {
        moduleClass.prototype.type = uwuDeclaration.Module;
        moduleClass.prototype.imports = config.imports;
        moduleClass.prototype.exports = config.exports;
        console.log('managing', moduleClass.name);
        for (const obj of config.imports) {
            const name = `${moduleClass.name}.${obj.name}`;
            console.log('trying to import', obj);
            switch (obj.prototype.type as uwuDeclaration) {
                case uwuDeclaration.Router:
                    break;
                case uwuDeclaration.Module:
                case uwuDeclaration.Injectable:
                    if (!container.isRegistered(obj)) {
                        container.register(name, { useValue: new obj() });
                    }
                    console.log(obj, 'stored with name', name);
                    break;
                default:
                    throw new Error("Object must be uwu type (uwuModule, uwuService etc.)");
            }
        }
        for (const obj of config.exports) {
            obj.prototype.parent = moduleClass;
            console.log('trying to export', obj);
            // switch (obj.prototype.type as uwuDeclaration) {
            //     case uwuDeclaration.Controller:
            //         const name = `${moduleClass.name}.${obj.name}`;

            //         // let t = getType<ConstructorParameters<typeof obj>>();
            //         // container.register(name, {useValue: obj});
            //         // console.log(`${name} was registered`);
            //         // console.log(obj.constructor);
            //         // console.log(obj.constructor.toString());
            //         // console.log(typeof obj.constructor.arguments);
            //         // console.log(obj.prototype.constructor.arguments);
            //         break;
            //     default:
            //         throw new Error("Object must be uwu type (uwuController etc.\)");
            // }
        }
    };
}

export function uwuController(config: uwuControlConfig): Function {
    console.log('uwuController', config.selector);
    return (objectClass: Function) => {
        console.log('uwuController return function');
        objectClass.prototype.type = uwuDeclaration.Controller;
        objectClass.prototype.selector = config.selector;
        objectClass.prototype.template = config.template;
    };
}

export function uwuRouter(config: uwuRoutesConfig): Function {
    console.log('uwuRouter');
    return (objectClass: Function) => {
        console.log('uwuRouter return function');
        objectClass.prototype.type = uwuDeclaration.Router;
        objectClass.prototype.routes = config.routes;
    };
}

export function uwuInjectable(): Function {
    return (objectClass: Type<Function>) => {
        objectClass.prototype.type = uwuDeclaration.Injectable;
        if (!container.isRegistered(objectClass)) {
            container.register(objectClass, { useValue: new objectClass() });
        }
        // type constructorParameters = ConstructorParameters<typeof objectClass>;
        // let vars : constructorParameters = objectClass.prototype.constructor;
    };
}

declare global {
    interface Window { root: Type<any>; }
}

export function bootstrap<T>(module: Type<T>) {
    if (!Object.values(uwuDeclaration).includes(module.prototype.type as uwuDeclaration)) {
        throw new Error("Object must be uwu type (uwuModule, uwuController, uwuService etc.\)")
    }
    if (!declarationCheck(module.prototype.type, uwuDeclaration.Module)) {
        throw new Error("Can bootstrap only uwuModule as enter point of app.")
    }
    window.root = module;
    window.onload = e => {
        const routeManager: uwuRouteManager = new uwuRouteManager();
        const controller = routeManager.getControllerByUrl();
        const controllerManager: uwuControllerManager = new uwuControllerManager();
        controllerManager.processPageByController(controller);
    };
    // window.onpopstate = e => {

    // };
}