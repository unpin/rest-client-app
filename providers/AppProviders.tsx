import { ThemeProvider } from './theme/ThemeProvider';

export default function AppProviders({ children }: React.PropsWithChildren) {
    return <ThemeProvider>{children}</ThemeProvider>;
}
