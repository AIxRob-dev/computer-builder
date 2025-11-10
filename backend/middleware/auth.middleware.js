import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ⭐ FIXED: Enhanced middleware supporting BOTH cookies AND Authorization header
export const protectRoute = async (req, res, next) => {
	try {
		let accessToken;

		// ⭐ CRITICAL: Check Authorization header first (for localStorage fallback)
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			accessToken = authHeader.substring(7);
			console.log("✅ Token from Authorization header");
		}

		// ⭐ Fallback to cookie if no header (traditional cookie-based auth)
		if (!accessToken) {
			accessToken = req.cookies.accessToken;
			if (accessToken) {
				console.log("✅ Token from cookie");
			}
		}

		// ⭐ No token found in either location
		if (!accessToken) {
			console.log("❌ No access token found in header or cookie");
			return res.status(401).json({ 
				message: "Unauthorized - No access token provided",
				code: "NO_TOKEN"
			});
		}

		try {
			// ⭐ Verify the token
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			
			// ⭐ Get user from database
			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				console.log("❌ User not found for token");
				return res.status(401).json({ 
					message: "Unauthorized - User not found",
					code: "USER_NOT_FOUND"
				});
			}

			// ⭐ Attach user to request
			req.user = user;
			console.log("✅ User authenticated:", user._id);
			next();

		} catch (error) {
			if (error.name === "TokenExpiredError") {
				console.log("⚠️ Access token expired");
				return res.status(401).json({ 
					message: "Unauthorized - Token expired",
					code: "TOKEN_EXPIRED"
				});
			}

			if (error.name === "JsonWebTokenError") {
				console.log("❌ Invalid token");
				return res.status(401).json({ 
					message: "Unauthorized - Invalid token",
					code: "INVALID_TOKEN"
				});
			}

			throw error;
		}

	} catch (error) {
		console.error("❌ Error in protectRoute middleware:", error);
		res.status(500).json({ 
			message: "Server error in authentication",
			error: error.message 
		});
	}
};

// ⭐ Optional: Admin-only route protection
export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ 
			message: "Access denied - Admin only",
			code: "NOT_ADMIN"
		});
	}
};
