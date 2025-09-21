import { render, screen, renderHook } from '@testing-library/react';
import InputField from './InputsField';
import { useForm, UseFormRegister, FieldValues, Path } from 'react-hook-form';

type TestFormProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
};

const TestForm = <T extends FieldValues>({
  register,
  name,
}: TestFormProps<T>) => (
  <InputField label="Test Input" name={name} register={register(name)} />
);

describe('InputField', () => {
  it('should render a label and an input with the correct attributes', () => {
    render(
      <InputField
        label="Username"
        name="username"
        id="user-id"
        type="text"
        autoComplete="username"
        defaultValue="JohnDoe"
      />
    );

    const labelElement = screen.getByText('Username');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'user-id');

    const inputElement = screen.getByLabelText('Username');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'user-id');
    expect(inputElement).toHaveAttribute('name', 'username');
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('autoComplete', 'username');
    expect(inputElement).toHaveAttribute('placeholder', 'Username');
    expect(inputElement).toHaveValue('JohnDoe');
  });

  it('should use name as id if id is not provided', () => {
    render(<InputField label="Email" name="email" />);
    const inputElement = screen.getByLabelText('Email');
    expect(inputElement).toHaveAttribute('id', 'email');
  });

  it('should integrate with react-hook-form', () => {
    const { result } = renderHook(() => useForm<{ test: string }>());
    const { register } = result.current;

    render(<TestForm register={register} name="test" />);

    const inputElement = screen.getByLabelText('Test Input');
    expect(inputElement).toHaveAttribute('name', 'test');
  });
});
