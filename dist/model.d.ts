import { ComponentFactory } from 'preact';
declare type ComponentFunction<P = {}> = () => ComponentResult<P>;
declare type ComponentResult<P = {}> = ComponentFactory<P> | ComponentAsync<P>;
declare type ComponentAsync<P = {}> = Promise<ComponentFactory<P>> | Promise<{
    [index: string]: ComponentFactory<P>;
}>;
interface IOptions {
    attributes?: string[];
    formAssociated?: boolean;
    formatProps?: <P = any>(props: P) => P;
    wrapComponent?: <P>(child: ComponentFactory<P>) => ComponentFactory<P>;
}
export { IOptions, ComponentFunction, ComponentResult, ComponentAsync };
