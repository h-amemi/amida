import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface ItemListProps {
  title: string
  items: string[]
  onAdd: (item: string) => void
  onRemove: (index: number) => void
  maxItems?: number
}

export function ItemList({ title, items, onAdd, onRemove, maxItems = 20 }: ItemListProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim() && items.length < maxItems) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div className="flex gap-2">
        <Input
          placeholder={`Add ${title.toLowerCase()} item...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={items.length >= maxItems}
        />
        <Button 
          onClick={handleAdd}
          disabled={!inputValue.trim() || items.length >= maxItems}
        >
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
            <span>{item}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        {items.length}/{maxItems} items
      </div>
    </div>
  )
}