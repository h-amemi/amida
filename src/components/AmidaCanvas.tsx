import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { generateRoutes, traceRoute, type AmidaLine } from '@/lib/amida'

interface AmidaCanvasProps {
  startItems: string[]
  goalItems: string[]
  selectedStart?: number
  onComplete?: (result: number) => void
}

export function AmidaCanvas({ startItems, goalItems, selectedStart, onComplete }: AmidaCanvasProps) {
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
      const result = generateRoutes(startItems)
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

    if (selectedStart !== undefined) {
      animateRoute(selectedStart)
    }
  }, [lines, selectedStart])

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

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    marker.setAttribute('r', '8')
    marker.setAttribute('fill', 'hsl(var(--primary))')
    marker.setAttribute('class', 'route-marker')
    svgRef.current.appendChild(marker)

    const path = createRoutePath(startIndex)
    
    tl.to(marker, {
      motionPath: {
        path: path,
        autoRotate: false,
      },
      duration: 2,
      ease: 'none',
      onComplete: () => {
        const result = traceRoute(startIndex, lines)
        onComplete?.(result)
        setIsAnimating(false)
      }
    }, '+=0.5')
  }

  const createRoutePath = (startIndex: number): string => {
    let currentCol = startIndex
    
    const startX = margin + startIndex * columnWidth
    const startY = margin
    
    let path = `M ${startX} ${startY}`
    
    for (const line of lines) {
      const lineY = margin + line.row * rowHeight
      
      path += ` L ${margin + currentCol * columnWidth} ${lineY}`
      
      if (line.col === currentCol) {
        currentCol = currentCol + 1
        path += ` L ${margin + currentCol * columnWidth} ${lineY}`
      } else if (line.col === currentCol - 1) {
        currentCol = currentCol - 1
        path += ` L ${margin + currentCol * columnWidth} ${lineY}`
      }
    }
    
    path += ` L ${margin + currentCol * columnWidth} ${height - margin}`
    
    return path
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