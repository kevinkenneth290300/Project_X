import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import App from '../App';

it('keeps an accessible demonstration notice across navigation', async () => {
  render(<App />);
  expect(screen.getByRole('note', { name: 'Demonstration only' })).toHaveTextContent('no live monitoring');
  fireEvent.click(screen.getByRole('button', { name: /Evidence/ }));
  expect(await screen.findByRole('heading', { name: 'Sample Evidence' })).toBeInTheDocument();
  expect(screen.getByRole('note', { name: 'Demonstration only' })).toHaveTextContent('verified evidence');
  fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
  expect(screen.getByRole('note', { name: 'Demonstration only' })).toBeInTheDocument();
});