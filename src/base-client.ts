import jwt from 'jsonwebtoken';
import { Err, Ok, Result } from 'ts-monads/lib/Result';

export interface Claims {
    to_jwt(): string;
    refresh(): void;
    is_expired(): boolean;
}

export interface APIClaims {
    iat: number;
    exp: number;
    iss: string;
    projectId: string;
}

export class HttpError extends Error {
    statusCode: number;
    text: string;

    constructor(statusCode: number, text: string) {
        super(`HttpError: Status Code ${statusCode}; Message: ${text}`);
        this.statusCode = statusCode;
        this.text = text;
    }
}

export interface BaseClientOptions {
    autoRenewToken: boolean;
}

export class BaseClient {
    baseUrl: string;
    claims: Claims;
    autoRenewToken: boolean;

    constructor(
        baseUrl: string,
        claims: Claims,
        options: BaseClientOptions = { autoRenewToken: true }
    ) {
        this.baseUrl = baseUrl;
        this.claims = claims;
        this.autoRenewToken = options.autoRenewToken;
    }

    private getToken(): string {
        if (this.autoRenewToken && this.claims.is_expired()) {
            this.claims.refresh();
        }
        return this.claims.to_jwt();
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
            Authorization: `Bearer ${this.getToken()}`,
        };

        const requestBody = body || {};
        const requestInit: RequestInit = {
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

const encodeJWT = (
    apiKey: string,
    apiSecret: string,
    projectId: string,
    exp: number
): string => {
    let claims: APIClaims = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + exp,
        iss: apiKey,
        projectId: projectId,
    };

    return jwt.sign(claims, apiSecret, {
        algorithm: 'HS256',
    });
};

export class ProjectTokenClaims implements Claims {
    private apiKey: string;
    private apiSecret: string;
    private projectId: string;
    private exp: number;
    private token?: string;

    constructor(
        apiKey: string,
        apiSecret: string,
        projectId: string,
        expiration: number = 3600
    ) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.projectId = projectId;
        this.exp = expiration;
    }

    to_jwt(): string {
        if (!this.token || this.is_expired()) {
            this.refresh();
        }
        return this.token!;
    }

    refresh(): void {
        this.token = encodeJWT(
            this.apiKey,
            this.apiSecret,
            this.projectId,
            this.exp
        );
    }

    is_expired(): boolean {
        if (!this.token) {
            return false;
        }
        const claims = decodeJWT(this.token);
        return claims.exp < Math.floor(Date.now() / 1000) - 100;
    }
}

const decodeJWT = (token: string): APIClaims => {
    const claims = jwt.decode(token) as APIClaims;

    return claims;
};
