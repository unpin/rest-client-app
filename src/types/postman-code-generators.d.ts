declare module 'postman-code-generators' {
  export type CodegenVariant = {
    key: string;
    label?: string;
  };

  export type CodegenLanguage = {
    key: string;
    label: string;
    syntax_mode: string;
    variants: CodegenVariant[];
  };
  export function getLanguageList(): CodegenLanguage[];

  export function convert(
    language: string,
    variant: string,
    request: unknown,
    options: Record<string, unknown>,
    callback: (error: Error | null, snippet: string) => void
  ): void;
}
