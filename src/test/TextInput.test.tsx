import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextInput } from '../features/projects/component/TextInput';

describe('TextInput Component', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnBlur.mockClear();
  });

  it('should render input with correct props', () => {
    render(
      <TextInput
        id="test"
        name="test"
        value="test value"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        placeholder="Enter text"
      />
    );

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveValue('test value');
    expect(input).toHaveAttribute('id', 'test');
    expect(input).toHaveAttribute('name', 'test');
  });

  it('should call onChange when value changes', () => {
    render(
      <TextInput
        id="test"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('should call onBlur when input loses focus', () => {
    render(
      <TextInput
        id="test"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('should handle number input correctly', () => {
    render(
      <TextInput
        id="test"
        name="test"
        type="number"
        value={0}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '42' } });

    expect(mockOnChange).toHaveBeenCalledWith(42);
  });

  it('should apply error styles when error exists', () => {
    render(
      <TextInput
        id="test"
        name="test"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        error="This field has an error"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500', 'bg-red-50');
  });
});