import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";


export const registerUser = async ({ name, email, password }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists with this email.");
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    const token = generateToken(user);

    return {
        success: true,
        message: "User registered successfully.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password.");
    }


    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password.");
    }
    const token = generateToken(user)



    return {
        success: true,
        message: "User logged in successfully.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };

}