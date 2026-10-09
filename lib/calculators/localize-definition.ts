/**
 * Apply locales/<locale>/calculators/items/<slug>.json copy onto an existing
 * CalculatorDefinition (typically the English TypeScript registry entry).
 * Keeps the shared calculate() engine — no duplicated business logic.
 */

import type { CalculatorDefinition, CalculatorLocale } from '@/lib/calculators/types'
import type { CalculatorContentI18n } from '@/lib/i18n/types-items'

/**
 * Overlay item-file strings onto a base definition for a target locale.
 * Input/output labels are matched by stable field name when the item entry
 * includes `name`; otherwise fall back to positional index (legacy items).
 */
export function applyCalculatorItemContent(
	base: CalculatorDefinition,
	locale: CalculatorLocale,
	content: CalculatorContentI18n,
	contentLocale: CalculatorLocale,
): CalculatorDefinition {
	const contentInputs = content.inputs || []
	const contentOutputs = content.outputs || []

	return {
		...base,
		locale,
		contentLocale,
		title: content.title || base.title,
		shortDescription: content.shortDescription || base.shortDescription,
		longDescription: content.longDescription || base.longDescription,
		howToBullets: content.howTo || base.howToBullets,
		inputs: base.inputs.map((input, index) => {
			const byName = contentInputs.find(
				(entry) => (entry as { name?: string }).name === input.name,
			)
			const contentInput = byName || contentInputs[index]
			if (!contentInput) return input
			const localizedOptions =
				contentInput.options?.length && input.options
					? input.options.map((option) => {
							const match = contentInput.options?.find(
								(entry) => entry.value === option.value,
							)
							return match ?? option
						})
					: contentInput.options?.length
						? contentInput.options
						: input.options
			return {
				...input,
				label: contentInput.label || input.label,
				placeholder: contentInput.placeholder || input.placeholder,
				helpText: contentInput.helpText || input.helpText,
				unitLabel: contentInput.unitLabel || input.unitLabel,
				options: localizedOptions,
			}
		}),
		outputs: base.outputs.map((output, index) => {
			const byName = contentOutputs.find(
				(entry) => (entry as { name?: string }).name === output.name,
			)
			const contentOutput = byName || contentOutputs[index]
			if (!contentOutput) return output
			return {
				...output,
				label: contentOutput.label || output.label,
				unitLabel: contentOutput.unitLabel || output.unitLabel,
			}
		}),
		examples: content.examples
			? content.examples.map((example, index) => ({
					id: `example-${index + 1}`,
					title: example.title || `Example ${index + 1}`,
					inputDescription:
						example.description || example.resultDescription || '',
					steps: example.steps || [],
					resultDescription: example.resultDescription || '',
				}))
			: base.examples,
		faq: content.faq || base.faq,
		seo: content.seo
			? {
					title: content.seo.title,
					description: content.seo.description,
				}
			: base.seo,
		meta: content.seo?.keywords
			? { keywords: content.seo.keywords }
			: base.meta,
	}
}
