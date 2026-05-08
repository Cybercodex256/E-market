import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Enhancing Your E-Marketing Platform heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Enhancing Your E-Marketing Platform/i);
  expect(headingElement).toBeInTheDocument();
});
