import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ScalarValue from './ScalarValue';

describe('ScalarValue', () => {
  it('shows the name, number and unit', () => {
    const html = renderToStaticMarkup(<ScalarValue name="Beam size" value={0.25} unit="mm" />);

    expect(html).toContain('>Beam size</dt>');
    expect(html).toContain('>0.25<span');
    expect(html).toContain('> mm</span>');
  });

  it.each([0, -2.5])('shows %s as a number, not a missing value', (value) => {
    const html = renderToStaticMarkup(<ScalarValue name="Reading" value={value} unit="" />);

    expect(html).toContain(`>${value}</dd>`);
    expect(html).not.toContain('No value');
    expect(html).not.toContain('scalar-value__unit');
  });

  it('shows a dash with an accessible label when the value is null', () => {
    const html = renderToStaticMarkup(<ScalarValue name="Beam size" value={null} unit="mm" />);

    expect(html).toContain('<span aria-label="No value">\u2014</span>');
    expect(html).toContain('> mm</span>');
    expect(html).not.toContain('>null');
  });
});
