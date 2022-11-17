import { FunctionComponent } from 'preact';
import { IOptions, ComponentFunction } from './model';
declare function define<P = {}>(tagName: string, child: ComponentFunction<P>, options?: IOptions): FunctionComponent<P>;
export { define };
