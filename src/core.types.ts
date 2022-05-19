export interface uwuModuleConfig {
    imports: Array<Type<any>>,
    exports: Array<Type<any>>,
}

export interface uwuControlConfig {
    template: String,
    selector: String,
    styles: String[]
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

export interface uwuRoutesConfig {
    routes : Array<Route>,
}

export enum uwuDeclaration {
    Module,
    Controller,
    Injectable,
    Router,
}

export type uwuModuleType = Type<any>;
export type uwuControllerType = Type<any>;
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