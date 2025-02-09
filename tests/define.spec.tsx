import { h, Fragment, ComponentFactory } from 'preact';
import { mount } from 'enzyme';
import { define } from '../src/define';

/* -----------------------------------
 *
 * Promises
 *
 * -------------------------------- */

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/* -----------------------------------
 *
 * IProps
 *
 * -------------------------------- */

interface IProps {
  customTitle?: string;
  value: string;
  children?: any;
}

/* -----------------------------------
 *
 * Component
 *
 * -------------------------------- */

function Message({ customTitle, value, children }: IProps) {
  return (
    <Fragment>
      {customTitle && <h2>{customTitle}</h2>}
      <em>{value}</em>
      {children}
    </Fragment>
  );
}

/* -----------------------------------
 *
 * Define
 *
 * -------------------------------- */

describe('define()', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  describe('when run in the browser', () => {
    let root;

    beforeEach(() => {
      root = document.createElement('div');
      document.body.appendChild(root);
    });

    afterEach(() => {
      document.body.removeChild(root);
    });

    it('validates tag name value with prefix if needed', () => {
      const props = { value: 'propsValue' };

      define('message', () => Message);

      const element = document.createElement('component-message');

      element.setAttribute('props', JSON.stringify(props));

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<em>${props.value}</em>`);
    });

    it('renders component correctly when from props attribute', async () => {
      const props = { value: 'propsValue' };

      define('message-one', () => Message);

      const element = document.createElement('message-one');

      element.setAttribute('props', JSON.stringify(props));

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<em>${props.value}</em>`);
    });

    it('renders component correctly when from json script block', async () => {
      const props = { value: 'jsonValue' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;

      define('message-two', () => Message);

      const element = document.createElement('message-two');

      element.innerHTML = json;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<em>${props.value}</em>`);
    });

    it('sets contained HTML as children prop when not server rendered', async () => {
      const props = { value: 'childMarkup' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;
      const html = '<p data-title="test">Testing</p><br><button title="test">Click here</button>';

      define('message-three', () => Message);

      const element = document.createElement('message-three');

      element.innerHTML = json + html;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<em>${props.value}</em>${html}`);
    });

    it('does not use contained HTML if server rendered', async () => {
      const props = { value: 'serverRender' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;
      const html = '<p>Server rendered!</p><button>Click here</button>';

      define('message-four', () => Message);

      const element = document.createElement('message-four');

      element.setAttribute('server', '');
      element.innerHTML = json + html;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<em>${props.value}</em>`);
    });

    it('renders component asynchronously when provided', async () => {
      const props = { value: 'asyncValue' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;

      define('message-five', () => Promise.resolve(Message));

      const element = document.createElement('message-five');

      element.innerHTML = json;

      root.appendChild(element);

      await flushPromises();

      expect(root.innerHTML).toContain(`<em>${props.value}</em>`);
    });

    it('tries to infer the component if not explicitly returned', async () => {
      const props = { value: 'inferValue' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;

      define('message-six', () => Promise.resolve({ MessageSix: Message }));

      const element = document.createElement('message-six');

      element.innerHTML = json;

      root.appendChild(element);

      await flushPromises();

      expect(root.innerHTML).toContain(`<em>${props.value}</em>`);
    });

    it('merges defined attributes in array with component props', () => {
      const customTitle = 'customTitle';
      const props = { value: 'attrProps' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;

      define('message-seven', () => Message, { attributes: ['custom-title'] });

      const element = document.createElement('message-seven');

      element.setAttribute('custom-title', customTitle);
      element.innerHTML = json;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<h2>${customTitle}</h2><em>${props.value}</em>`);
    });

    it('errors if component cannot be found in function', async () => {
      define('message-eight', () => Promise.resolve({ Message }));

      const element = document.createElement('message-eight');

      root.appendChild(element);

      await flushPromises();

      expect(errorSpy).toBeCalled();
      expect(element.innerHTML).toEqual('');
    });

    it('updates component props when attributes are changed', () => {
      const customTitle = 'customTitle';
      const updatedProp = 'updated!';
      const props = { value: 'attrUpdate' };
      const html = '<button>Click here</button>';

      define('message-nine', () => Message, { attributes: ['custom-title'] });

      const element = document.createElement('message-nine');

      element.setAttribute('custom-title', customTitle);
      element.setAttribute('props', JSON.stringify(props));

      element.innerHTML = html;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<h2>${customTitle}</h2><em>${props.value}</em>${html}`);

      element.setAttribute('custom-title', '');
      element.setAttribute('props', JSON.stringify({ ...props, value: updatedProp }));

      expect(root.innerHTML).toContain(`<em>${updatedProp}</em>${html}`);
    });

    it('wraps component in an HOC if provided', () => {
      const props = { value: 'wrapComponent' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;

      const wrapComponent = (child: ComponentFactory<any>) => (props: any) =>
        h('section', {}, h(child, props));

      define('message-ten', () => Message, { wrapComponent });

      const element = document.createElement('message-ten');

      element.innerHTML = json;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<section><em>${props.value}</em></section>`);
    });

    it('correctly passes props through formatProps if provided', () => {
      const props = { Value: 'formatProps' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;

      const formatProps = (props: any) => {
        const keys = Object.keys(props);

        return keys.reduce<any>((result, key) => {
          result[key.toLowerCase()] = props[key];

          return result;
        }, {});
      };

      define('message-eleven', () => Message, { formatProps });

      const element = document.createElement('message-eleven');

      element.innerHTML = json;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<em>${props.Value}</em>`);
    });

    it('correctly segments <* slot="{key}" /> elements into props', () => {
      const customTitle = '<em>customTitle</em>';
      const html = `<div slot="customTitle">${customTitle}</div>`;

      define('message-twelve', () => Message);

      const element = document.createElement('message-twelve');

      element.innerHTML = html;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<h2>${customTitle}</h2><em></em>`);
    });

    it('correctly caches children when moved in the DOM', () => {
      const customTitle = '<em>customTitle</em>';
      const customText = 'Lorem ipsum dolor';
      const html = `<div slot="customTitle">${customTitle}</div><p>${customText}</p>`;

      define('message-thirteen', () => Message);

      const element = document.createElement('message-thirteen');
      const wrapper = document.createElement('main');

      element.innerHTML = html;

      root.appendChild(element);

      element.remove();

      expect(root.innerHTML).toContain('');

      root.appendChild(wrapper);
      wrapper.appendChild(element);

      expect(root.innerHTML).toContain(`<h2>${customTitle}</h2><em></em><p>${customText}</p>`);
    });
  });

  describe('when run in the browser (no "Reflect.construct")', () => {
    const { Reflect } = global;
    let root;

    beforeAll(() => {
      delete global.Reflect;
    });

    beforeEach(() => {
      root = document.createElement('div');
      document.body.appendChild(root);
    });

    afterEach(() => {
      document.body.removeChild(root);
    });

    afterAll(() => {
      global.Reflect = Reflect;
    });

    it('renders component correctly', () => {
      const customTitle = 'customTitle';
      const props = { value: 'attrUpdate' };
      const json = `<script type="application/json">${JSON.stringify(props)}</script>`;
      const html = '<button>Click here</button>';

      define('message-class', () => Message, { attributes: ['custom-title'] });

      const element = document.createElement('message-class');

      element.setAttribute('custom-title', customTitle);
      element.innerHTML = json + html;

      root.appendChild(element);

      expect(root.innerHTML).toContain(`<h2>${customTitle}</h2><em>${props.value}</em>${html}`);

      element.setAttribute('custom-title', '');

      expect(root.innerHTML).toContain(`<em>${props.value}</em>${html}`);
    });
  });

  describe('when run on the server', () => {
    const { window } = global;

    beforeAll(() => {
      delete global.window;
    });

    afterAll(() => {
      global.window = window;
    });

    it('returns the correct markup', () => {
      const props = { value: 'serverValue' };
      const component = define('message-one', () => Message);

      const instance = mount(h(component, props) as any);

      expect(instance.find('message-one').length).toEqual(1);
      expect(instance.find('em').text()).toEqual(props.value);
    });

    it('throws an error when used with a promise', () => {
      expect(() => define('message-two', () => Promise.resolve(Message))).toThrow();
    });

    it('includes a json script block with props', () => {
      const props = { value: 'serverValue' };
      const component = define('message-three', () => Message);

      const instance = mount(h(component, props) as any);

      expect(instance.find('script').text()).toEqual(JSON.stringify(props));
    });
  });
});
