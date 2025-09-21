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
  requestHeaders: { key: string; value: string }[];
  responseHeaders: Record<string, string>;
  requestBody: string;
  responseBody: string;
  responseSize: number;
  responseTime: number;
  requestMethod: string;
  requestSize: number;
  timestamp: string;
  endpointURL: string;
};

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers, body } =
      (await req.json()) as ProxyRequestPayload;

    if (!url) {
      return NextResponse.json(
        { error: 'error.url_required' },
        { status: 400 }
      );
    }

    if (!method) {
      return NextResponse.json(
        { error: 'error.method_required' },
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
    const responseSize = new TextEncoder().encode(responseBody).length;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const responseTime = Math.round(performance.now() - startTime);
    const requestSize = body ? new TextEncoder().encode(body).length : 0;

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      requestHeaders: Object.entries(headers).map(([key, value]) => ({
        key,
        value,
      })),
      responseHeaders,
      requestBody: body,
      responseBody: responseBody,
      responseSize,
      responseTime,
      requestSize,
      requestMethod: method,
      timestamp: new Date().toISOString(),
      endpointURL: url,
    } as ProxyResponseData);
  } catch (error) {
    console.info(error);
    return NextResponse.json({ error: 'error.unknown', status: 500 });
  }
}
