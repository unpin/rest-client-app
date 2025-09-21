import { render, screen, fireEvent } from '@testing-library/react';
import MethodDropdown from './MethodDropdown';

describe('MethodDropdown', () => {
  const mockSetSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the selected method', () => {
    render(<MethodDropdown selected="GET" setSelected={mockSetSelected} />);
    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('should open the dropdown when the button is clicked', () => {
    render(<MethodDropdown selected="GET" setSelected={mockSetSelected} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should close the dropdown when an item is selected', () => {
    render(<MethodDropdown selected="GET" setSelected={mockSetSelected} />);
    fireEvent.click(screen.getByRole('button'));
    const postOption = screen.getByText('POST');
    fireEvent.click(postOption);
    expect(mockSetSelected).toHaveBeenCalledWith('POST');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should close the dropdown when clicking outside', () => {
    render(
      <div>
        <MethodDropdown selected="GET" setSelected={mockSetSelected} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('list')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('outside'));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should highlight the currently selected method in the list', () => {
    render(<MethodDropdown selected="PUT" setSelected={mockSetSelected} />);
    fireEvent.click(screen.getByRole('button'));
    const putOptions = screen.getAllByText('PUT');
    const listItem = putOptions.find((el) => el.tagName === 'LI');
    expect(listItem).toHaveClass('selected');
  });
});
