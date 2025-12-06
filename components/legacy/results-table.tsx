interface TableColumn {
	header: string
	key: string
}

interface ResultsTableProps {
	columns: TableColumn[]
	data: Array<Record<string, string | number>>
}

/**
 * Results table component for legacy pages
 */
export function ResultsTable({ columns, data }: ResultsTableProps) {
	if (data.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<p className="text-gray-500 text-center">No results to display</p>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							{columns.map((column) => (
								<th
									key={column.key}
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((row, rowIndex) => (
							<tr key={rowIndex} className="hover:bg-gray-50">
								{columns.map((column) => (
									<td
										key={column.key}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
									>
										{row[column.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
