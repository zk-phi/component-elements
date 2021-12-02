import { h } from 'preact';
import { mount } from 'enzyme';
import { parseHtml } from '../src/parse';

/* -----------------------------------
 *
 * Parse
 *
 * -------------------------------- */

describe('parse', () => {
  describe('parseHtml()', () => {
    const testHeading = 'testHeading';
    const html = `<h1>${testHeading}</h1><section><h2 title="Main Title">Hello</h2></section>`;

    it('correctly converts HTML string into VDom tree', () => {
      const result = parseHtml(html);
      const instance = mount(h(result, {}) as any);

      expect(instance.find('h1').text()).toEqual(testHeading);
    });
  });
});
