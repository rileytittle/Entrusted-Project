import { Express } from "express";
import { Request, Response, NextFunction } from "express";

/**
 * ApiKeyChecker is a function that is passed to each middleware
 * to protect the middleware from requests from unauthorized clients.
 * It takes a request, response, and nextFunction argument, which will
 * be passed to it by the middleware it is put in.
 * The function checks where the request was sent with an "x-api-key"
 * header and if so, whether the value of the header matches the API key.
 * If the request fails either of those checks, it sends back an unauthorized
 * status.
 * Otherwise, it allows the middleware to continue by calling next().
 */
let ApiKeyChecker = (req: Request, res: Response, next: NextFunction) => {
	const validApiKey = "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e";
	const apiKey = req.headers["x-api-key"];
	if (!apiKey) {
		res.status(401).send({ message: "Unauthorized" });
	}
	if (apiKey !== validApiKey) {
		res.status(401).send({ message: "Unauthorized" });
	} else {
		next();
	}
};

export default ApiKeyChecker;
