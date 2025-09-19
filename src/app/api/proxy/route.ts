import { NextRequest, NextResponse } from 'next/server';

type ProxyRequestPayload = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
};

export type ProxyResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  size: number;
  responseTime: number;
};

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers, body } =
      (await req.json()) as ProxyRequestPayload;

    if (!url) {
      return NextResponse.json(
        { error: 'errors.url_required' },
        { status: 400 }
      );
    }

    if (!method) {
      return NextResponse.json(
        { error: 'errors.method_required' },
        { status: 400 }
      );
    }
    const startTime = performance.now();
    const response = await fetch(url, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? null : body,
    });

    const responseBody = await response.text();
    const size = new TextEncoder().encode(responseBody).length;
    let responseData;
    try {
      responseData = JSON.parse(responseBody);
    } catch {
      responseData = responseBody;
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const responseTime = Math.round(performance.now() - startTime);

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseData,
      size,
      responseTime,
    } as ProxyResponseData);
  } catch (error) {
    console.info(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
