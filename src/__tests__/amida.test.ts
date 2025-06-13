import { generateAmidaLines, traceRoute, generateRoutes } from '../lib/amida'

describe('Amida Algorithm', () => {
  test('generateAmidaLines creates correct number of lines', () => {
    const lines = generateAmidaLines(4, 1.5)
    expect(lines.length).toBe(6) // ceil(4 * 1.5) = 6
  })

  test('generateAmidaLines ensures no adjacent lines', () => {
    const lines = generateAmidaLines(5, 1.0)
    
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[i].row === lines[j].row) {
          expect(Math.abs(lines[i].col - lines[j].col)).toBeGreaterThan(1)
        }
      }
    }
  })

  test('traceRoute follows path correctly', () => {
    const lines = [
      { row: 0, col: 0 }, // Connect columns 0-1
      { row: 1, col: 1 }, // Connect columns 1-2
    ]
    
    expect(traceRoute(0, lines)).toBe(2) // 0 -> 1 -> 2
    expect(traceRoute(1, lines)).toBe(0) // 1 -> 0 -> still 0
    expect(traceRoute(2, lines)).toBe(1) // 2 -> 1 -> stay 1
  })

  test('generateRoutes produces valid mapping', () => {
    const startItems = ['A', 'B', 'C']
    const goalItems = ['X', 'Y', 'Z']
    const result = generateRoutes(startItems, goalItems)
    
    expect(result.lines.length).toBeGreaterThan(0)
    expect(result.routes.length).toBe(3)
    
    // All routes should be valid indices
    result.routes.forEach(route => {
      expect(route).toBeGreaterThanOrEqual(0)
      expect(route).toBeLessThan(startItems.length)
    })
  })
})