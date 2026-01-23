import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from './user.model';

const generateToken = (id: any): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    let user: any = await User.findOne({ email });

    // Auto-create demo user if not exists
    if (!user && email === 'demo@example.com' && password === 'demo123') {
        user = await User.create({
            name: 'Demo Admin',
            email: 'demo@example.com',
            password: 'demo123',
        });
    }

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
