import ActionButton from '@/components/Buttons/ActionButton';
import { useTranslations } from 'next-intl';

type AuthButtonProps = {
  form: 'signIn' | 'signUp';
  disabled?: boolean;
};

export default function AuthButton({ form }: AuthButtonProps) {
  const t = useTranslations('Auth');
  return (
    <ActionButton
      className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
      type="submit"
      label={form === 'signIn' ? t('login.submit') : t('register.submit')}
    />
  );
}
