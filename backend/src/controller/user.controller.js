import { User } from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const auth = await req.auth();
    const currentUserId = auth.userId;

    const users = await User.find({
      clerkId: { $ne: currentUserId },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
