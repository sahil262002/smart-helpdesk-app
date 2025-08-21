// frontend/src/components/LoginPage.test.jsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('LoginPage', () => {
    it('renders email and password inputs', () => {
        renderWithRouter(<LoginPage />);
        
        // This is a more robust way to find form elements
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
});