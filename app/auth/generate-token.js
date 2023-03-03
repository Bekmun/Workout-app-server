import jwt from 'jsonwebtoken'

// Возвращает ключ
export const generateToken = userId =>
	jwt.sign(
		{
			userId,
		},
		process.env.JWT_SECRET, // Ключ шифрование
		{
			expiresIn: '10d' // Дни когда закончится Token
		}
	)