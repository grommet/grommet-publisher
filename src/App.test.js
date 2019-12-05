import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  afterEach(cleanup);

  test('empty', () => {
    const { getByTitle, container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByTitle('choose another site'));
    expect(container.firstChild).toMatchSnapshot();
  });
});
