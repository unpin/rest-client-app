import { convert } from 'postman-code-generators';
import { Request as PostmanRequest } from 'postman-collection';

export async function createCodeSample(
  language: string,
  variant: string,
  request: PostmanRequest,
  options: Record<string, unknown> = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    convert(language, variant, request, options, (err, codeEx) => {
      if (err) reject(err);
      else resolve(codeEx);
    });
  });
}
