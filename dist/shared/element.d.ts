import { IComponent, CustomElement } from './model';
declare function getAsyncComponent(component: Promise<IComponent>, tagName: string): Promise<any>;
declare function getElementTag(tagName: string): string;
declare function getElementAttributes(this: CustomElement): import("./model").IProps;
export { getElementTag, getElementAttributes, getAsyncComponent };
