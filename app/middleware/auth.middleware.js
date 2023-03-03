import { prisma } from '../prisma.js'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { UserField } from '../utils/user.utils.js'

export const protect = asyncHandler(async (req, res, next) => {
	let token

	// Проверяем существует-ли авторизационный токен
	if (req.headers.authorization?.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]

		// расшифровываем токен
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		console.log(decoded)

		const userFound = await prisma.user.findUnique({
			where: {
				id: decoded.userId
			},
			select: UserField
		})

		if (userFound) {
			req.user = userFound
			next()
		} else {
			res.status(401)
			throw new Error('Not authorized, token failed')
		}
	}
	if (!token) {
		res.status(401)
		throw new Error('Not authorized, I do not have a token')
	}
})