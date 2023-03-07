import { prisma } from "../prisma.js"
import asyncHandler from "express-async-handler"
import { faker } from "@faker-js/faker"
import { hash, verify } from "argon2"
import { generateToken } from "./generate-token.js"
import { UserField } from "../utils/user.utils.js"

//@desc   Auth user
//@route  POST /api/auth/login
//@access Public

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	const isValidPassword = await verify(user.password, password)

	// Проверяем валидацию пароля
	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({ user, token })
	} else {
		res.status(401)
		throw new Error('Email and password are not correct')
	}

	res.json(user)
})

//@desc   Register user
//@route  POST /api/auth/register
//@access Public

export const registerUser = asyncHandler(async (req, res) => {
	// Забираем Email и Password
	const { email, password } = req.body

	//Проверяем на существование текущего email
	const isHaveUser = await prisma.user.findUnique({
		//ищем 
		where: {
			email
		}
	})
	// Если User с таким emailом существует то выдаем такую ошибку
	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Создадим нашего Usera
	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.name.fullName(),
			images: ['/images/before.jpg', '/images/after.jpg']
		},
		select: UserField
	})

	// Создаем Token
	const token = generateToken(user.id)

	res.json({ user, token })
})

// GET, POST, PUT, PATH, DELETE

// GET - Для получение данных
// POST - Для записи данных
// PUT - Для обновление сущности
// PATH - Для обновление сущности для маленьких задач
// DELETE - Для удаление