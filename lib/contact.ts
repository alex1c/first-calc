export function getTelegramContactLink(): string | null {
	const explicitLink = process.env.NEXT_PUBLIC_TELEGRAM_CONTACT_URL
	if (explicitLink) {
		return explicitLink
	}

	const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID
	if (chatId) {
		if (chatId.startsWith('http')) {
			return chatId
		}
		const normalized = chatId.startsWith('@') ? chatId.slice(1) : chatId
		return `https://t.me/${normalized}`
	}

	return null
}

export function hasTelegramBot(): boolean {
	return Boolean(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN)
}





