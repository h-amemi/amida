export interface AmidaLine {
  row: number
  col: number
}

export interface AmidaResult {
  lines: AmidaLine[]
  routes: number[]
  shuffledStartItems: string[]
  shuffledGoalItems: string[]
}

export function generateAmidaLines(count: number, ratio: number = 4.5): AmidaLine[] {
  const horizontalLineCount = Math.ceil(count * ratio)
  const lines: AmidaLine[] = []
  const maxRow = count * 3
  
  while (lines.length < horizontalLineCount) {
    const col = Math.floor(Math.random() * (count - 1))
    const row = Math.floor(Math.random() * maxRow)
    
    if (isValidLine(lines, row, col)) {
      lines.push({ row, col })
    }
  }
  
  return lines.sort((a, b) => a.row - b.row)
}

function isValidLine(existingLines: AmidaLine[], row: number, col: number): boolean {
  return !existingLines.some(line => {
    if (line.row === row) {
      return Math.abs(line.col - col) <= 1
    }
    return false
  })
}

export function traceRoute(startIndex: number, lines: AmidaLine[]): number {
  let currentCol = startIndex
  
  for (const line of lines) {
    if (line.col === currentCol) {
      currentCol = currentCol + 1
    } else if (line.col === currentCol - 1) {
      currentCol = currentCol - 1
    }
  }
  
  return currentCol
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateRoutes(startItems: string[], goalItems: string[]): AmidaResult {
  const count = startItems.length
  const shuffledStartItems = shuffleArray(startItems)
  const shuffledGoalItems = shuffleArray(goalItems)
  const lines = generateAmidaLines(count)
  const routes = shuffledStartItems.map((_, index) => traceRoute(index, lines))
  
  return { lines, routes, shuffledStartItems, shuffledGoalItems }
}