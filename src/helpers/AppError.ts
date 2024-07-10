type HttpCode = 200 | 201 | 300 | 400 | 401 | 403 | 404 | 500;

export class AppError extends Error {
	public readonly name: string;
	public readonly httpCode: HttpCode;
	public readonly isOperational: boolean;

	constructor(
		name: string,
		httpCode: HttpCode,
		description: string,
		isOperational: boolean
	) {
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = name;
		this.httpCode = httpCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this);
	}
}
