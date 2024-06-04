import * as jwt from 'jsonwebtoken';
import { Err, Ok, Result } from 'ts-monads/lib/Result';

export interface BaseClientOptions {
    tokenTtl: number;
    autoRenewToken: boolean;
    project?: string;
}

export interface APIClaims {
    iat: number;
    exp: number;
    iss: string;

    project?: string;
}

const encodeJWT = (
    apiKey: string,
    apiSecret: string,
    project: string | undefined,
    exp: number
): string => {
    let claims: APIClaims = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + exp,
        iss: apiKey,
    };
    if (project) {
        claims.project = project;
    }

    return jwt.sign(claims, apiSecret, {
        algorithm: 'HS256',
    });
};

const decodeJWT = (token: string): APIClaims => {
    const claims = jwt.decode(token) as APIClaims;

    return claims;
};

export class HttpError extends Error {
    statusCode: number;
    text: string;

    constructor(statusCode: number, text: string) {
        super(`HttpError: Status Code ${statusCode}; Message: ${text}`);
        this.statusCode = statusCode;
        this.text = text;
    }
}

export class BaseClient {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    tokenTtl: number;
    autoRenewToken: boolean;
    project: string | undefined;
    _token: undefined | string;

    constructor(
        baseUrl: string,
        apiKey: string,
        apiSecret: string,
        tokenTtl: number = 60 * 60,
        autoRenewToken: boolean = true,
        project?: string
    ) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.apiSecret = apiSecret;
        this.tokenTtl = tokenTtl;
        this.autoRenewToken = autoRenewToken;
        this.project = project;
        this._token = undefined;
    }

    get token(): string | undefined {
        if (!this._token) {
            this._token = this.generateToken();
        }

        if (this.autoRenewToken && this.tokenCloseToExpiry()) {
            this._token = this.generateToken();
        }

        return this._token;
    }

    private tokenCloseToExpiry(): boolean {
        if (!this._token) {
            return false;
        }
        const claims = decodeJWT(this._token);
        return claims.exp < Math.floor(Date.now() / 1000) - 100;
    }

    private generateToken(): string {
        return encodeJWT(
            this.apiKey,
            this.apiSecret,
            this.project,
            this.tokenTtl
        );
    }

    async authorizedFetch<T>(
        path: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        headers: { [key: string]: string } = {},
        body?: any
    ): Promise<Result<T, HttpError>> {
        const requestHeaders = {
            ...headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
        };

        const requestBody = body || {};
        const requestInit = {
            method,
            headers: requestHeaders,
        };

        if (method !== 'GET') {
            requestInit.body = JSON.stringify(requestBody);
        }

        const response = await fetch(`${this.baseUrl}/${path}`, requestInit);

        if (response.ok) {
            const jsonResult = (await response.json()) as T;
            return new Ok(jsonResult);
        }

        const text = await response.text();
        const statusCode = response.status;
        return new Err(new HttpError(statusCode, text));
    }
}
