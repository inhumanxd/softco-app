import cors from "cors";
import express from "express";
import morgan from "morgan";

import rateLimiter from "@/common/middleware/rateLimiter";
import errorHandler from "@/common/middleware/errorHandler";
import { healthCheckRouter } from "./app/health/router";
import { userRouter } from "./app/user/user.routes";
import { roleRouter } from "./app/role/role.routes";
import { authRouter } from "./app/auth/auth.router";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(rateLimiter);

// Request logging
app.use(morgan("tiny"));

// // Routes
app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);

// Error handlers
app.use(errorHandler());

export { app };
