export interface uwuModuleConfig {
    imports: Array<Type<any>>,
    exports: Array<Type<any>>,
}

export interface uwuControlConfig {
    template: string,
    selector: string,
    styles: string[]
}

export interface uwuTsxControlConfig {
    hook: (guid : string) => Function,
    selector: string,
    styles: string[]
}

export type Route = {
    path: string,
    children?: Array<Route>,
    target: uwuModuleType | uwuControllerType,
    guard?: any,
    /**
     * @param regexp whether should be found by regexp
     */
    regexp?: boolean
}

export type uwuTsxElement = {
    hooks?: any,
    type?: string | Function,
    child?: uwuTsxElement | null,
    parent?: uwuTsxElement,
    alternate?: uwuTsxElement | null,
    sibling?: uwuTsxElement | null,
    effectTag?: "PLACEMENT" | "UPDATE" | "DELETION",
    dom?: HTMLElement | null,
    props: {
        [key: string]: any,
        children?: Array<uwuTsxElement>
    }
}

export type HookFunction = {
    (): uwuTsxElement;
}

export interface uwuRoutesConfig {
    routes : Array<Route>,
}

export enum uwuDeclaration {
    Module,
    Controller,
    ControllerTsx,
    Injectable,
    Router,
}

export type uwuModuleType = Type<any>;
export type uwuControllerType = Type<any>;
export type uwuTsxControllerType = Type<any>;
export type uwuInjectableType = Type<any>;
export type uwuRouterType = Type<any>;

interface FunctionConstructor {
    /**
     * Creates a new function.
     * @param args A list of arguments the function accepts.
     */
    new(...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
}

export declare const Type: FunctionConstructor;

export interface Type<T> extends Function {
    new(...args: any[]): T;
    [key : string] : any
}

export interface parsedUrl {
    url: URL,
    params: Object,
    path_raw: string,
    path: string[],
}

export type bindPackType = {
    [guid: string]: {
        descriptor?: PropertyDescriptor,
        actions: {
            [key: string]: Function
        },
        forceValue?: string
    }
}