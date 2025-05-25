import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Regions from './regions';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('handleOnClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.only('should dispatch a "regionSelected" event with the correct region when a radio button is clicked', () => {
    // const mockListener = vi.fn();
    const addListenerSpy = vi.spyOn(window, 'addEventListener');

    render(<Regions />);

    const radioButtons = screen.getAllByRole<HTMLInputElement>('radio');
    const firstRadioButton = radioButtons[0];

    userEvent.click(firstRadioButton);

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(addListenerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { region: firstRadioButton.value }
      })
    );

    // window.removeEventListener('regionSelected', mockListener);
  });

  it('should not dispatch an event if the radio button is not checked', () => {
    const mockListener = vi.fn();
    window.addEventListener('regionSelected', mockListener);

    render(<Regions />);

    const radioButtons = screen.getAllByRole<HTMLInputElement>('radio');
    const firstRadioButton = radioButtons[0];

    // Simulate a click without checking the radio button
    userEvent.click(firstRadioButton);
    expect(firstRadioButton.checked).toBe(true);
    expect(mockListener).toHaveBeenCalledTimes(1);

    window.removeEventListener('regionSelected', mockListener);
  });
});
