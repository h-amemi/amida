import { useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from './ui/button'

interface ResultsTableProps {
  startItems: string[]
  goalItems: string[]
  onAnimateResult: (startIndex: number) => void
  isAnimating: boolean
}

interface Result {
  startItem: string
  goalItem: string
  startIndex: number
  goalIndex: number
}

export const ResultsTable = forwardRef<
  { addResult: (startIndex: number, goalIndex: number) => void },
  ResultsTableProps
>(({ startItems, goalItems, isAnimating }, ref) => {
  const [results, setResults] = useState<Result[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)


  const addResult = (startIndex: number, goalIndex: number) => {
    const newResult: Result = {
      startItem: startItems[startIndex],
      goalItem: goalItems[goalIndex],
      startIndex,
      goalIndex
    }
    
    setResults(prev => [...prev, newResult])
    setCurrentIndex(prev => prev + 1)
  }

  const resetResults = () => {
    setResults([])
    setCurrentIndex(0)
  }

  useImperativeHandle(ref, () => ({
    addResult
  }))

  const isComplete = currentIndex >= startItems.length
  const hasResults = results.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Results</h2>
        {hasResults && (
          <Button
            onClick={resetResults}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
        )}
      </div>

      {hasResults && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Start Item</th>
                <th className="px-4 py-3 text-left font-medium">Goal Item</th>
                <th className="px-4 py-3 text-center font-medium">Result #</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{result.startItem}</td>
                  <td className="px-4 py-3">{result.goalItem}</td>
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isComplete && (
        <div className="text-center py-4">
          <p className="text-lg font-medium text-green-600">
            All results checked! ({results.length}/{startItems.length})
          </p>
        </div>
      )}

      {!hasResults && !isAnimating && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Amidakuji will automatically trace each item's path...</p>
        </div>
      )}
    </div>
  )
})

ResultsTable.displayName = 'ResultsTable'

export type { Result }