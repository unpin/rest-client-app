import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import SelectField from './SelectField';
import { useForm, UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { ChangeEventHandler } from 'react';

type TestFormProps<T extends FieldValues> = {
  register?: UseFormRegister<T>;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  value?: string;
  name: Path<T>;
};

const TestForm = <T extends FieldValues>({
  register,
  onChange,
  value,
  name,
}: TestFormProps<T>) => (
  <SelectField
    label="Test Select"
    name={name}
    options={['Option 1', 'Option 2']}
    register={register ? register(name) : undefined}
    onChange={onChange}
    value={value}
  />
);

describe('SelectField', () => {
  it('should render a label and a select with options', () => {
    render(<SelectField label="My Select" options={['A', 'B', 'C']} />);

    expect(screen.getByLabelText('My Select')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'B' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'C' })).toBeInTheDocument();
  });

  it('should display a default placeholder option', () => {
    render(
      <SelectField label="My Select" options={[]} defaultValue="Choose..." />
    );
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('should handle controlled component behavior with value and onChange', () => {
    const mockOnChange = jest.fn();
    render(
      <SelectField
        label="Controlled"
        options={['One', 'Two']}
        value="One"
        onChange={mockOnChange}
      />
    );

    const selectElement = screen.getByLabelText(
      'Controlled'
    ) as HTMLSelectElement;
    expect(selectElement.value).toBe('One');

    fireEvent.change(selectElement, { target: { value: 'Two' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should integrate with react-hook-form', () => {
    const { result } = renderHook(() => useForm<{ test: string }>());
    const { register } = result.current;

    render(<TestForm register={register} name="test" />);

    const selectElement = screen.getByLabelText('Test Select');
    expect(selectElement).toHaveAttribute('name', 'test');
  });
});
