import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface ItemListProps {
  title: string
  items: string[]
  onAdd: (item: string) => void
  onAddBulk?: (items: string[]) => void
  onRemove: (index: number) => void
  maxItems?: number
}

export function ItemList({ title, items, onAdd, onAddBulk, onRemove, maxItems = 20 }: ItemListProps) {
  const [inputValue, setInputValue] = useState('')
  const [bulkInputValue, setBulkInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim() && items.length < maxItems) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  const handleBulkAdd = () => {
    if (bulkInputValue.trim() && onAddBulk) {
      const newItems = bulkInputValue
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, maxItems - items.length)
      
      if (newItems.length > 0) {
        onAddBulk(newItems)
        setBulkInputValue('')
      }
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

      {onAddBulk && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Or add multiple items (one per line):
          </div>
          <Textarea
            placeholder={`Add multiple ${title.toLowerCase()} items...\nOne item per line`}
            value={bulkInputValue}
            onChange={(e) => setBulkInputValue(e.target.value)}
            disabled={items.length >= maxItems}
            rows={4}
          />
          <Button 
            onClick={handleBulkAdd}
            disabled={!bulkInputValue.trim() || items.length >= maxItems}
            className="w-full"
          >
            Add Items
          </Button>
        </div>
      )}

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