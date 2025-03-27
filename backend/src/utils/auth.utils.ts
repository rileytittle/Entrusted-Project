import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const SECRET_KEY = "L$XvV]jyx6+Fc*kV3R{LdR!nG$`dH/Pq2@bN^~z8A$Bv3ME!5cGp";

let Authchecker = (req: Request, res: Response, next: NextFunction) => {
	if (req.headers["authorization"]) {
		let header = req.headers["authorization"];
		if (header.includes("Bearer")) {
			let token = header.split(" ")[1];
			try {
				let payload = jwt.verify(token, SECRET_KEY) as any;
				res.setHeader("loggedInUsername", payload.username);
				next();
			} catch (e) {
				console.log(e);
				res.status(401).send({ message: "Unauthorized" });
			}
		} else {
			res.status(401).send({ message: "Unauthorized" });
		}
	} else {
		res.status(401).send({ message: "Unauthorized" });
	}
};
export { Authchecker };
