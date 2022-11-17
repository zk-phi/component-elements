import { IProps, CustomElement } from './model';
declare function parseJson(this: CustomElement, value: string): {};
declare function getDocument(html: string): HTMLElement;
declare function getAttributeObject(attributes: NamedNodeMap): IProps;
declare function getAttributeProps(attributes: NamedNodeMap, allowed?: string[]): IProps;
declare function getPropKey(value: string): string;
export { parseJson, getDocument, getPropKey, getAttributeObject, getAttributeProps };
