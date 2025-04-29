import express, { Application, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { JWT_SECRET } from "./config.js";
import { middleware } from "./middleware/middleware.js";


const app: Application = express();
app.use(express.json());

interface UserSignupData {
  name: string;
  email: string;
  password: string;
  photo?: string;
}
// POST /signup endpoint
app.post("/signup", async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    //* Normalize and validate email---- optional
    // const normalizedEmail = email.toLowerCase().trim();

    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    //   return res.status(400).json({ error: "Invalid email format" });
    // }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        existingUserId: existingUser.id,
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
//*login

app.post("/signin", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Check for existing user

    const foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!foundUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    //*generate token

    const token = jwt.sign(
      {
        userId: foundUser.id,
      },
      JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: foundUser,
      token: token,
    });
  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

//* room id

app.post("/room", middleware, async (req: any, res: any) => {
  try {
    const { slug } = req.body;

    const userId = req.userId;

    const room = await prisma.room.create({
      data: {
        slug: slug,
        adminId: userId,
      },
      select: {
        id: true,
        slug: true,
        adminId: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: room,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//*get all chats

app.get("/chats", middleware, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const chats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        message: true,
        room: {
          select: {
            slug: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      chats: chats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
