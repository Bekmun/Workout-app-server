import { prisma } from "../prisma.js"
import { UserField } from "../utils/user.utils.js"
import asyncHandler from 'express-async-handler'


// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	// Ищем пользователя
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: UserField
	})

	res.json(user)
})