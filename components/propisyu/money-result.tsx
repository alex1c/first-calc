/**
 * Server-rendered money result block + client copy variants.
 */

import {
	buildMoneyCopyVariants,
	buildMoneyWords,
	calculateIncludedVat,
	formatRubKopecks,
	type MoneyAmount,
} from '@/lib/propisyu/money'
import { CopyableVariants } from '@/components/propisyu/copyable-variants'

interface MoneyResultProps {
	amount: MoneyAmount
}

export function MoneyResult({ amount }: MoneyResultProps) {
	const words = buildMoneyWords(amount)
	const vat = calculateIncludedVat(amount.totalKopecks)
	const variants = buildMoneyCopyVariants(amount)
	const displayAmount = `${amount.rubles}.${String(amount.kopecks).padStart(2, '0')}`

	return (
		<div className="space-y-8">
			<div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
				<p className="mb-2 text-sm text-slate-500">Сумма</p>
				<p className="mb-4 text-4xl font-bold text-slate-900">
					{displayAmount} руб.
				</p>
				<p className="mb-2 text-sm text-slate-500">Прописью</p>
				<p className="text-2xl font-semibold text-blue-700 md:text-3xl">
					{words.rublesWords} {words.rubleNoun} {words.kopecksWords}{' '}
					{words.kopeckNoun}
				</p>
			</div>

			<div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold text-slate-900">
					НДС 20% (выделение из суммы)
				</h2>
				<p className="mb-2 text-sm text-slate-700">
					Сумма считается включающей НДС. Доля НДС:{' '}
					<strong>{vat.vatDisplay} руб.</strong> (
					{formatRubKopecks(amount.totalKopecks)} × 20 ÷ 120, округление до
					копейки).
				</p>
				<p className="text-sm text-slate-600">
					{vat.vatWordsLower}
				</p>
			</div>

			<div>
				<h2 className="mb-4 text-lg font-semibold text-slate-900">
					Варианты для копирования
				</h2>
				<p className="mb-4 text-sm text-slate-600">
					Семь исторических формулировок из архивного шаблона first-calc.com
					(строчные, заглавная, копейки цифрами, НДС, НДС прописью, сумма в
					скобках).
				</p>
				<CopyableVariants variants={variants} />
			</div>
		</div>
	)
}
