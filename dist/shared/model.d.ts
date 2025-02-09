declare type IComponent = any;
interface IOptions<F = any, W = any> {
    attributes?: string[];
    formatProps?: (props: any) => F;
    wrapComponent?: (child: any) => W;
}
declare enum ErrorTypes {
    Promise = "Error: Promises cannot be used for SSR",
    Missing = "Error: Cannot find component in provided function",
    Json = "Error: Invalid JSON string passed to component"
}
interface CustomElement<C = any, I = any> extends HTMLElement {
    __mounted: boolean;
    __component: C;
    __properties?: IProps;
    __slots?: {
        [index: string]: any;
    };
    __instance?: I;
    __children?: any;
    __options: IOptions;
}
interface IProps {
    [index: string]: any;
}
declare const isPromise: (input: any) => input is Promise<any>;
declare const selfClosingTags: string[];
export { IComponent, IOptions, IProps, ErrorTypes, CustomElement, isPromise, selfClosingTags };
