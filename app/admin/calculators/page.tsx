'use client'

import { useState, useEffect } from 'react'
import type { CalculatorDefinition } from '@/lib/calculators/types'
import Link from 'next/link'

/**
 * Admin page for managing calculators
 * Simple internal interface without authentication (for now)
 */
export default function AdminCalculatorsPage() {
	const [calculators, setCalculators] = useState<CalculatorDefinition[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedCalculator, setSelectedCalculator] =
		useState<CalculatorDefinition | null>(null)
	const [jsonSchema, setJsonSchema] = useState<string>('')

	useEffect(() => {
		loadCalculators()
	}, [])

	const loadCalculators = async () => {
		try {
			const response = await fetch('/api/calculators?locale=en')
			const data = await response.json()
			setCalculators(data.calculators || [])
		} catch (error) {
			console.error('Failed to load calculators:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleExportSchema = (calc: CalculatorDefinition) => {
		// Convert calculator definition to JSON schema format
		const schema = {
			id: calc.id,
			locale: calc.locale,
			category: calc.category,
			slug: calc.slug,
			title: calc.title,
			description: calc.shortDescription,
			inputs: calc.inputs.map((inp) => ({
				name: inp.name,
				label: inp.label,
				type: inp.type,
				unit: inp.unitLabel,
				min: inp.min,
				max: inp.max,
				step: inp.step,
				options: inp.options,
				defaultValue: inp.defaultValue,
				helpText: inp.helpText,
			})),
			outputs: calc.outputs.map((out) => ({
				name: out.name,
				label: out.label,
				unit: out.unitLabel,
			})),
			formula: '// Formula would need to be extracted from calculate function',
			howTo: calc.howToBullets,
			examples: calc.examples.map((ex) => ({
				input: {},
				result: {},
				title: ex.title,
				description: ex.inputDescription,
			})),
			faq: calc.faq,
			relatedIds: calc.relatedIds,
			standardIds: calc.standardIds,
			meta: calc.meta,
		}

		setJsonSchema(JSON.stringify(schema, null, 2))
		setSelectedCalculator(calc)
	}

	const handleViewCalculator = async (calc: CalculatorDefinition) => {
		try {
			const response = await fetch(`/api/calculators/${calc.id}?locale=${calc.locale}`)
			const data = await response.json()
			setSelectedCalculator(data)
			setJsonSchema(JSON.stringify(data, null, 2))
		} catch (error) {
			console.error('Failed to load calculator:', error)
		}
	}

	const handleUploadJson = async () => {
		try {
			const schema = JSON.parse(jsonSchema)
			// In a real implementation, this would save to the data source
			alert('JSON upload functionality would save to data source in production')
			console.log('Schema to save:', schema)
		} catch (error) {
			alert('Invalid JSON format')
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-7xl mx-auto">
					<p>Loading calculators...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Calculator Admin
					</h1>
					<p className="text-gray-600">
						Manage calculators and export/import JSON schemas
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Calculator List */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							All Calculators ({calculators.length})
						</h2>
						<div className="space-y-2 max-h-96 overflow-y-auto">
							{calculators.map((calc) => (
								<div
									key={calc.id}
									className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
								>
									<div>
										<h3 className="font-medium text-gray-900">{calc.title}</h3>
										<p className="text-sm text-gray-600">
											{calc.category} • {calc.locale}
										</p>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => handleViewCalculator(calc)}
											className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
										>
											View
										</button>
										<button
											onClick={() => handleExportSchema(calc)}
											className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
										>
											Export JSON
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Calculator Details / JSON Editor */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							{selectedCalculator ? 'Calculator Details' : 'JSON Schema Editor'}
						</h2>

						{selectedCalculator && (
							<div className="mb-4 p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-900 mb-2">
									{selectedCalculator.title}
								</h3>
								<p className="text-sm text-gray-600 mb-2">
									{selectedCalculator.shortDescription}
								</p>
								<div className="text-xs text-gray-500">
									ID: {selectedCalculator.id} • Slug: {selectedCalculator.slug}
								</div>
							</div>
						)}

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								JSON Schema
							</label>
							<textarea
								value={jsonSchema}
								onChange={(e) => setJsonSchema(e.target.value)}
								className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
								placeholder="Paste or edit JSON schema here..."
							/>
						</div>

						<div className="flex gap-2">
							<button
								onClick={handleUploadJson}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								Upload JSON
							</button>
							<button
								onClick={() => {
									setJsonSchema('')
									setSelectedCalculator(null)
								}}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							>
								Clear
							</button>
						</div>
					</div>
				</div>

				<div className="mt-8">
					<Link
						href="/"
						className="text-blue-600 hover:text-blue-800 underline"
					>
						← Back to site
					</Link>
				</div>
			</div>
		</div>
	)
}








