import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

// ⭐ FIXED: Enhanced cookie configuration for cross-origin auth
const setCookies = (res, accessToken, refreshToken) => {
	const isProduction = process.env.NODE_ENV === "production";
	
	// Common cookie options
	const cookieOptions = {
		httpOnly: true,
		secure: isProduction, // Requires HTTPS in production
		sameSite: isProduction ? "none" : "lax", // "none" allows cross-site cookies
		path: "/",
	};

	// ⭐ CRITICAL: DO NOT set domain for cross-origin cookies
	// Let the browser handle the domain automatically

	res.cookie("accessToken", accessToken, {
		...cookieOptions,
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	
	res.cookie("refreshToken", refreshToken, {
		...cookieOptions,
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	// ⭐ Log cookie setting for debugging
	if (isProduction) {
		console.log("✅ Cookies set with SameSite=None, Secure=true");
	}
};

export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ name, email, password });

		// authenticate
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);

		setCookies(res, accessToken, refreshToken);

		// ⭐ CRITICAL: Return tokens in response body for localStorage fallback
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			// ⭐ NEW: Include tokens in response for localStorage
			tokens: {
				accessToken,
				refreshToken
			}
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			// ⭐ CRITICAL: Return tokens in response body for localStorage fallback
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				// ⭐ NEW: Include tokens in response for localStorage
				tokens: {
					accessToken,
					refreshToken
				}
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		// ⭐ FIXED: Enhanced cookie clearing
		const isProduction = process.env.NODE_ENV === "production";
		const clearOptions = {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
			path: "/",
		};

		res.clearCookie("accessToken", clearOptions);
		res.clearCookie("refreshToken", clearOptions);
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ⭐ FIXED: Support both cookie and body-based refresh token
export const refreshToken = async (req, res) => {
	try {
		// ⭐ Check cookies first, then request body
		const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

		if (!refreshToken) {
			console.log("⚠️ No refresh token in cookies or body");
			return res.status(401).json({ 
				message: "No refresh token provided",
				code: "NO_REFRESH_TOKEN"
			});
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			console.log("⚠️ Refresh token mismatch");
			return res.status(401).json({ 
				message: "Invalid refresh token",
				code: "INVALID_REFRESH_TOKEN"
			});
		}

		const accessToken = jwt.sign(
			{ userId: decoded.userId }, 
			process.env.ACCESS_TOKEN_SECRET, 
			{ expiresIn: "15m" }
		);

		// ⭐ Set cookie
		const isProduction = process.env.NODE_ENV === "production";
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "none" : "lax",
			path: "/",
			maxAge: 15 * 60 * 1000,
		});

		console.log("✅ Token refreshed for user:", decoded.userId);
		
		// ⭐ CRITICAL: Return new access token in response body
		res.json({ 
			message: "Token refreshed successfully",
			accessToken // ⭐ NEW: Return token for localStorage
		});
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			console.log("⚠️ Invalid refresh token:", error.message);
			return res.status(401).json({ 
				message: "Invalid refresh token",
				code: "INVALID_TOKEN"
			});
		}
		if (error.name === "TokenExpiredError") {
			console.log("⚠️ Refresh token expired");
			return res.status(401).json({ 
				message: "Refresh token expired",
				code: "TOKEN_EXPIRED"
			});
		}
		console.error("❌ Error in refreshToken controller:", error.message);
		res.status(500).json({ 
			message: "Server error", 
			error: error.message 
		});
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
