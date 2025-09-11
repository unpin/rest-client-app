import ActionButton from '@/components/Buttons/ActionButton';
import { useTranslations } from 'next-intl';

type AuthButtonProps = {
  form: 'signIn' | 'signUp' | 'signOut' | 'main';
  disabled?: boolean;
  onClick?: () => void;
};

export default function AuthButton({ form, onClick }: AuthButtonProps) {
  const t = useTranslations('Auth');
  const labels = {
    signIn: t('login.submit'),
    signUp: t('register.submit'),
    signOut: t('common.logout'),
    main: t('common.main'),
  };

  const label = labels[form];
  const type = form === 'signOut' ? 'button' : 'submit';

  return (
    <ActionButton
      className="w-full min-w-[140px] bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
      type={type}
      label={label}
      onClick={onClick}
    />
  );
}
