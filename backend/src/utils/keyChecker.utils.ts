import { Express } from "express";
import { Request, Response, NextFunction } from "express";
let ApiKeyChecker = (req: Request, res: Response, next: NextFunction) => {
	const validApiKey = "5fa3d7b0-0b1c-4e29-b467-8dfe2e5a1a7e";
	const apiKey = req.headers["x-api-key"];
	if (!apiKey) {
		res.status(401).send({ message: "API key is missing" });
	}
	if (apiKey !== validApiKey) {
		res.status(401).send({ message: "Invalid API key" });
	} else {
		next();
	}
};

export default ApiKeyChecker;
