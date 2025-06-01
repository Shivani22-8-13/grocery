import { userModel } from '../models/userModel.js';
import validator from 'validator';
export const signup = async (req, res) => {
    //here extracting the name, email, passsword from the user
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
            // return res.json({success:false, message:"missing detials"})
        }
        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }
        const userAlreadyExists = await userModel.findOne({ email });
        console.log("userAlreadyExits", userAlreadyExists);
        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        //hashinng user password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new userModel({
            email,
            password: hashedPassword,
            name,
            isVerified: false,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        })

        //saving at the data base
        await newUser.save();

        //jwt
       

        res.status(201).json({
            success: true,
            message: "User Created successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                gender: newUser.gender,
                dob: newUser.dob,
                phone: newUser.phone,
                address: newUser.address,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                lastLogin: newUser.lastLogin,
                isVerified: newUser.isVerified,
                verificationToken: newUser.verificationToken,
                verificationTokenExpiresAt: newUser.verificationTokenExpiresAt,
            },
        });


    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }

}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User doesn't exist" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Email not verified. Please verify your email before logging in." });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        generateTokenAndCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            isAuthenticated: true,
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch (error) {
        console.log("Error in login:", error)
        res.status(400).json({ success: false, message: error.message })
    }
}