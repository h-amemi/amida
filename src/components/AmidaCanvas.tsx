import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { generateRoutes, traceRoute, type AmidaLine } from '@/lib/amida'

interface AmidaCanvasProps {
  startItems: string[]
  goalItems: string[]
  currentAnimatingIndex: number
  autoStarted: boolean
  onComplete?: (startIndex: number, result: number) => void
  onAutoStarted?: () => void
}

export function AmidaCanvas({ startItems, goalItems, currentAnimatingIndex, autoStarted, onComplete, onAutoStarted }: AmidaCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [lines, setLines] = useState<AmidaLine[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const width = 800
  const height = 600
  const margin = 50
  const columnWidth = (width - 2 * margin) / (startItems.length - 1)
  const rowHeight = 20

  useEffect(() => {
    if (startItems.length > 0 && goalItems.length > 0) {
      const result = generateRoutes(startItems, goalItems)
      setLines(result.lines)
    }
  }, [startItems, goalItems])

  useEffect(() => {
    if (!svgRef.current || lines.length === 0) return

    const svg = svgRef.current
    svg.innerHTML = ''

    drawVerticalLines()
    drawHorizontalLines()
    drawLabels()
  }, [lines])

  // Auto-start animation when entering result screen
  useEffect(() => {
    if (!autoStarted && lines.length > 0 && startItems.length > 0) {
      onAutoStarted?.()
      setTimeout(() => {
        animateRoute(0)
      }, 500)
    }
  }, [autoStarted, lines, startItems])

  // Handle animation changes
  useEffect(() => {
    if (autoStarted && currentAnimatingIndex < startItems.length) {
      animateRoute(currentAnimatingIndex)
    }
  }, [currentAnimatingIndex, autoStarted])

  const drawVerticalLines = () => {
    if (!svgRef.current) return

    startItems.forEach((_, index) => {
      const x = margin + index * columnWidth
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      
      line.setAttribute('x1', x.toString())
      line.setAttribute('y1', margin.toString())
      line.setAttribute('x2', x.toString())
      line.setAttribute('y2', (height - margin).toString())
      line.setAttribute('stroke', 'currentColor')
      line.setAttribute('stroke-width', '2')
      line.setAttribute('class', 'vertical-line')
      
      const pathLength = height - 2 * margin
      line.style.strokeDasharray = pathLength.toString()
      line.style.strokeDashoffset = pathLength.toString()
      
      svgRef.current?.appendChild(line)
    })
  }

  const drawHorizontalLines = () => {
    if (!svgRef.current) return

    lines.forEach((line) => {
      const x1 = margin + line.col * columnWidth
      const x2 = margin + (line.col + 1) * columnWidth
      const y = margin + line.row * rowHeight
      
      const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      
      lineElement.setAttribute('x1', x1.toString())
      lineElement.setAttribute('y1', y.toString())
      lineElement.setAttribute('x2', x2.toString())
      lineElement.setAttribute('y2', y.toString())
      lineElement.setAttribute('stroke', 'currentColor')
      lineElement.setAttribute('stroke-width', '2')
      lineElement.setAttribute('class', 'horizontal-line')
      
      const pathLength = columnWidth
      lineElement.style.strokeDasharray = pathLength.toString()
      lineElement.style.strokeDashoffset = pathLength.toString()
      
      svgRef.current?.appendChild(lineElement)
    })
  }

  const drawLabels = () => {
    if (!svgRef.current) return

    startItems.forEach((item, index) => {
      const x = margin + index * columnWidth
      
      const startText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      startText.setAttribute('x', x.toString())
      startText.setAttribute('y', (margin - 10).toString())
      startText.setAttribute('text-anchor', 'middle')
      startText.setAttribute('class', 'text-sm fill-current')
      startText.textContent = item
      
      const goalText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      goalText.setAttribute('x', x.toString())
      goalText.setAttribute('y', (height - margin + 20).toString())
      goalText.setAttribute('text-anchor', 'middle')
      goalText.setAttribute('class', 'text-sm fill-current')
      goalText.textContent = goalItems[index] || ''
      
      svgRef.current?.appendChild(startText)
      svgRef.current?.appendChild(goalText)
    })
  }

  const animateRoute = (startIndex: number) => {
    if (isAnimating || !svgRef.current) return

    setIsAnimating(true)
    const tl = gsap.timeline()

    // Show all lines first if this is the first animation
    if (startIndex === 0) {
      const verticalLines = svgRef.current.querySelectorAll('.vertical-line')
      const horizontalLines = svgRef.current.querySelectorAll('.horizontal-line')

      tl.to(verticalLines, {
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
      })

      tl.to(horizontalLines, {
        strokeDashoffset: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out'
      }, '-=0.5')
    }

    // Create colored path for this specific route
    const routePath = createRoutePathElements(startIndex)
    const delay = startIndex === 0 ? '+=0.5' : 0
    
    tl.to(routePath, {
      strokeDashoffset: 0,
      duration: 2,
      stagger: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        const result = traceRoute(startIndex, lines)
        onComplete?.(startIndex, result)
        setIsAnimating(false)
      }
    }, delay)
  }

  const createRoutePathElements = (startIndex: number): SVGElement[] => {
    if (!svgRef.current) return []

    const pathElements: SVGElement[] = []
    let currentCol = startIndex
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
    const color = colors[startIndex % colors.length]
    
    let currentY = margin
    
    // Add vertical line from start
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineY = margin + line.row * rowHeight
      
      // Draw vertical line to this horizontal line
      if (lineY > currentY) {
        const vertLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        vertLine.setAttribute('x1', (margin + currentCol * columnWidth).toString())
        vertLine.setAttribute('y1', currentY.toString())
        vertLine.setAttribute('x2', (margin + currentCol * columnWidth).toString())
        vertLine.setAttribute('y2', lineY.toString())
        vertLine.setAttribute('stroke', color)
        vertLine.setAttribute('stroke-width', '4')
        vertLine.setAttribute('class', `route-path-${startIndex}`)
        
        const pathLength = lineY - currentY
        vertLine.style.strokeDasharray = pathLength.toString()
        vertLine.style.strokeDashoffset = pathLength.toString()
        
        svgRef.current.appendChild(vertLine)
        pathElements.push(vertLine)
        currentY = lineY
      }
      
      // Check if we need to cross this horizontal line
      if (line.col === currentCol) {
        // Draw horizontal line to the right
        const horizLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        horizLine.setAttribute('x1', (margin + currentCol * columnWidth).toString())
        horizLine.setAttribute('y1', lineY.toString())
        horizLine.setAttribute('x2', (margin + (currentCol + 1) * columnWidth).toString())
        horizLine.setAttribute('y2', lineY.toString())
        horizLine.setAttribute('stroke', color)
        horizLine.setAttribute('stroke-width', '4')
        horizLine.setAttribute('class', `route-path-${startIndex}`)
        
        const pathLength = columnWidth
        horizLine.style.strokeDasharray = pathLength.toString()
        horizLine.style.strokeDashoffset = pathLength.toString()
        
        svgRef.current.appendChild(horizLine)
        pathElements.push(horizLine)
        currentCol = currentCol + 1
      } else if (line.col === currentCol - 1) {
        // Draw horizontal line to the left
        const horizLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        horizLine.setAttribute('x1', (margin + currentCol * columnWidth).toString())
        horizLine.setAttribute('y1', lineY.toString())
        horizLine.setAttribute('x2', (margin + (currentCol - 1) * columnWidth).toString())
        horizLine.setAttribute('y2', lineY.toString())
        horizLine.setAttribute('stroke', color)
        horizLine.setAttribute('stroke-width', '4')
        horizLine.setAttribute('class', `route-path-${startIndex}`)
        
        const pathLength = columnWidth
        horizLine.style.strokeDasharray = pathLength.toString()
        horizLine.style.strokeDashoffset = pathLength.toString()
        
        svgRef.current.appendChild(horizLine)
        pathElements.push(horizLine)
        currentCol = currentCol - 1
      }
    }
    
    // Final vertical line to bottom
    if (currentY < height - margin) {
      const finalVertLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      finalVertLine.setAttribute('x1', (margin + currentCol * columnWidth).toString())
      finalVertLine.setAttribute('y1', currentY.toString())
      finalVertLine.setAttribute('x2', (margin + currentCol * columnWidth).toString())
      finalVertLine.setAttribute('y2', (height - margin).toString())
      finalVertLine.setAttribute('stroke', color)
      finalVertLine.setAttribute('stroke-width', '4')
      finalVertLine.setAttribute('class', `route-path-${startIndex}`)
      
      const pathLength = (height - margin) - currentY
      finalVertLine.style.strokeDasharray = pathLength.toString()
      finalVertLine.style.strokeDashoffset = pathLength.toString()
      
      svgRef.current.appendChild(finalVertLine)
      pathElements.push(finalVertLine)
    }
    
    return pathElements
  }


  return (
    <div className="w-full flex justify-center">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="border border-border rounded-lg bg-card"
      />
    </div>
  )
}