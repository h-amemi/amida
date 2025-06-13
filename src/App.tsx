import { useState } from 'react'
import { ItemList } from './components/ItemList'
import { ModeToggle } from './components/ModeToggle'
import { AmidaCanvas } from './components/AmidaCanvas'
import { Button } from './components/ui/button'

type AppState = 'setup' | 'result'

function App() {
  const [state, setState] = useState<AppState>('setup')
  const [startItems, setStartItems] = useState<string[]>([])
  const [goalItems, setGoalItems] = useState<string[]>([])
  const [selectedStart, setSelectedStart] = useState<number>()
  const [result, setResult] = useState<number>()

  const handleAddStart = (item: string) => {
    setStartItems([...startItems, item])
  }

  const handleAddStartBulk = (items: string[]) => {
    setStartItems([...startItems, ...items])
  }

  const handleRemoveStart = (index: number) => {
    setStartItems(startItems.filter((_, i) => i !== index))
  }

  const handleAddGoal = (item: string) => {
    setGoalItems([...goalItems, item])
  }

  const handleAddGoalBulk = (items: string[]) => {
    setGoalItems([...goalItems, ...items])
  }

  const handleRemoveGoal = (index: number) => {
    setGoalItems(goalItems.filter((_, i) => i !== index))
  }

  const handleStart = () => {
    if (startItems.length >= 2 && goalItems.length >= 2 && startItems.length === goalItems.length) {
      setState('result')
      setSelectedStart(0)
    }
  }

  const handleReset = () => {
    setState('setup')
    setSelectedStart(undefined)
    setResult(undefined)
  }

  const handleComplete = (resultIndex: number) => {
    setResult(resultIndex)
  }

  const isValid = startItems.length >= 2 && goalItems.length >= 2 && startItems.length === goalItems.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Amida Kuji</h1>
          <ModeToggle />
        </div>

        {state === 'setup' && (
          <div className="grid md:grid-cols-2 gap-8">
            <ItemList
              title="Start Items"
              items={startItems}
              onAdd={handleAddStart}
              onAddBulk={handleAddStartBulk}
              onRemove={handleRemoveStart}
            />
            
            <ItemList
              title="Goal Items"
              items={goalItems}
              onAdd={handleAddGoal}
              onAddBulk={handleAddGoalBulk}
              onRemove={handleRemoveGoal}
            />

            <div className="md:col-span-2 flex justify-center">
              <Button
                onClick={handleStart}
                disabled={!isValid}
                size="lg"
              >
                Start Amida Kuji
              </Button>
            </div>

            {!isValid && (
              <div className="md:col-span-2 text-center text-muted-foreground">
                {startItems.length < 2 || goalItems.length < 2 
                  ? "Add at least 2 items to both lists"
                  : "Both lists must have the same number of items"
                }
              </div>
            )}
          </div>
        )}

        {state === 'result' && (
          <div className="space-y-8">
            <AmidaCanvas
              startItems={startItems}
              goalItems={goalItems}
              selectedStart={selectedStart}
              onComplete={handleComplete}
            />

            {result !== undefined && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold">
                  Result: {startItems[0]} → {goalItems[result]}
                </div>
                <Button onClick={handleReset} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App