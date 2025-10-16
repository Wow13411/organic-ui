import { state } from "organic-ui/reactivity"
import { div, button, For } from "organic-ui/components"

interface BenchmarkResult {
  name: string
  organicUI: number
  vanillaJS: number
  ratio: number // organicUI / vanillaJS (lower is better)
}

interface BenchmarkTest {
  id: string
  name: string
  description: string
  warmupIterations: number
  runIterations: number
  runOrganic: () => Promise<number>
  runVanilla: () => Promise<number>
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function formatRatio(ratio: number): string {
  if (!isFinite(ratio) || isNaN(ratio)) {
    return '-'
  }
  return `${ratio.toFixed(2)}x`
}

function getRatioColor(ratio: number): string {
  if (ratio < 1.1) return '#28a745' // Excellent (within 10% of vanilla)
  if (ratio < 1.3) return '#ffc107' // Good (within 30%)
  if (ratio < 1.5) return '#fd7e14' // Acceptable (within 50%)
  return '#dc3545' // Needs optimization
}

// Small epsilon value for measurements that are too fast to measure accurately
// Represents ~0.01ms (10 microseconds)
const EPSILON = 0.01

// Weights based on js-framework-benchmark methodology
// Using 1 / (90th percentile of slowdown factors)
const benchmarkWeights: Record<string, number> = {
  'Create 1,000 rows': 0.306,
  'Replace all rows': 0.283,
  'Partial update': 0.194,
  'Swap rows': 0.194,
  'Remove row': 0.194,
  'Create 10,000 rows': 0.306,
  'Append 1,000 to 10,000 rows': 0.194,
  'Clear 10,000 rows': 0.323
}

function calculateWeightedGeometricMean(results: BenchmarkResult[]): number {
  if (results.length === 0) return 0
  
  // Calculate WGM for Organic UI times
  let organicWeightedLogSum = 0
  let totalWeight = 0
  
  for (const result of results) {
    const weight = benchmarkWeights[result.name] || 0.2 // Default weight
    
    // Use epsilon for zero or negative measurements
    const time = result.organicUI <= 0 ? EPSILON : result.organicUI
    
    organicWeightedLogSum += weight * Math.log(time)
    totalWeight += weight
  }
  
  const organicWGM = Math.exp(organicWeightedLogSum / totalWeight)
  
  // Calculate WGM for Vanilla JS times
  let vanillaWeightedLogSum = 0
  
  for (const result of results) {
    const weight = benchmarkWeights[result.name] || 0.2
    
    // Use epsilon for zero or negative measurements
    const time = result.vanillaJS <= 0 ? EPSILON : result.vanillaJS
    
    vanillaWeightedLogSum += weight * Math.log(time)
  }
  
  const vanillaWGM = Math.exp(vanillaWeightedLogSum / totalWeight)
  
  // Calculate ratio
  const ratio = organicWGM / vanillaWGM
  
  // Handle edge cases
  if (!isFinite(ratio) || isNaN(ratio)) {
    return 0 // Return 0 for invalid ratios
  }
  
  return ratio
}

async function measure(fn: () => void, warmup: number, iterations: number): Promise<number> {
  // Warmup
  for (let i = 0; i < warmup; i++) {
    fn()
  }
  
  // Force GC if available
  if ((window as any).gc) {
    (window as any).gc()
  }
  
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Actual measurement
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  const end = performance.now()
  
  return end - start
}

// Data for benchmarks
function buildData(count: number): Array<{ id: number; label: string }> {
  const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
  const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
  const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]
  const data: Array<{ id: number; label: string }> = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      label: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${colours[Math.floor(Math.random() * colours.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
    })
  }
  return data
}

export function Benchmarks() {
  const [results, setResults] = state<BenchmarkResult[]>([])
  const [running, setRunning] = state<string | null>(null)
  
  // Following js-framework-benchmark spec
  const benchmarks: BenchmarkTest[] = [
    {
      id: 'create-1000',
      name: 'Create 1,000 rows',
      description: 'Duration for creating 1,000 rows after the page loaded (no warmup)',
      warmupIterations: 0,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const duration = await measure(() => {
          const [data, setData] = state(buildData(1000))
          const list = For({
            each: data,
            children: (item) => div({ 
              text: () => `${item.id} - ${item.label}`
            })
          })
          list.mount(container)
          list.unmount()
        }, 0, 1)
        
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const duration = await measure(() => {
          const data = buildData(1000)
          container.innerHTML = ''
          data.forEach(item => {
            const el = document.createElement('div')
            el.textContent = `${item.id} - ${item.label}`
            container.appendChild(el)
          })
          container.innerHTML = ''
        }, 0, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'replace-all',
      name: 'Replace all rows',
      description: 'Duration for replacing all 1,000 rows (with 5 warmup iterations)',
      warmupIterations: 5,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const [data, setData] = state(buildData(1000))
        const list = For({
          each: data,
          children: (item) => div({ text: () => `${item.id} - ${item.label}` })
        })
        list.mount(container)
        
        const duration = await measure(() => {
          setData(buildData(1000))
        }, 5, 1)
        
        list.unmount()
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        let data = buildData(1000)
        const render = () => {
          container.innerHTML = ''
          data.forEach(item => {
            const el = document.createElement('div')
            el.textContent = `${item.id} - ${item.label}`
            container.appendChild(el)
          })
        }
        render()
        
        const duration = await measure(() => {
          data = buildData(1000)
          render()
        }, 5, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'partial-update',
      name: 'Partial update',
      description: 'Time to update the text of every 10th row for 10,000 rows (with 5 warmup iterations)',
      warmupIterations: 5,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const [data, setData] = state(buildData(10000))
        const list = For({
          each: data,
          children: (item) => div({ text: () => `${item.id} - ${item.label}` })
        })
        list.mount(container)
        
        const duration = await measure(() => {
          setData(prev => prev.map((item, idx) => 
            idx % 10 === 0 ? { ...item, label: item.label + ' !!!' } : item
          ))
        }, 5, 1)
        
        list.unmount()
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        let data = buildData(10000)
        const elements: HTMLDivElement[] = []
        data.forEach(item => {
          const el = document.createElement('div')
          el.textContent = `${item.id} - ${item.label}`
          container.appendChild(el)
          elements.push(el)
        })
        
        const duration = await measure(() => {
          for (let i = 0; i < data.length; i += 10) {
            data[i].label += ' !!!'
            elements[i].textContent = `${data[i].id} - ${data[i].label}`
          }
        }, 5, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'swap-rows',
      name: 'Swap rows',
      description: 'Time to swap 2 rows on a 1,000 row table (with 5 warmup iterations)',
      warmupIterations: 5,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const [data, setData] = state(buildData(1000))
        const list = For({
          each: data,
          children: (item) => div({ text: () => `${item.id} - ${item.label}` })
        })
        list.mount(container)
        
        const duration = await measure(() => {
          setData(prev => {
            const arr = [...prev]
            if (arr.length > 998) {
              const tmp = arr[1]
              arr[1] = arr[998]
              arr[998] = tmp
            }
            return arr
          })
        }, 5, 1)
        
        list.unmount()
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const data = buildData(1000)
        const elements: HTMLDivElement[] = []
        data.forEach(item => {
          const el = document.createElement('div')
          el.textContent = `${item.id} - ${item.label}`
          container.appendChild(el)
          elements.push(el)
        })
        
        const duration = await measure(() => {
          if (data.length > 998) {
            const tmp = data[1]
            data[1] = data[998]
            data[998] = tmp
            
            elements[1].textContent = `${data[1].id} - ${data[1].label}`
            elements[998].textContent = `${data[998].id} - ${data[998].label}`
          }
        }, 5, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'remove-row',
      name: 'Remove row',
      description: 'Duration to remove a row (with 5 warmup iterations)',
      warmupIterations: 5,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const [data, setData] = state(buildData(1000))
        const list = For({
          each: data,
          children: (item) => div({ text: () => `${item.id} - ${item.label}` })
        })
        list.mount(container)
        
        const duration = await measure(() => {
          setData(prev => prev.filter((_, idx) => idx !== 1))
        }, 5, 1)
        
        list.unmount()
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        let data = buildData(1000)
        const render = () => {
          container.innerHTML = ''
          data.forEach(item => {
            const el = document.createElement('div')
            el.textContent = `${item.id} - ${item.label}`
            container.appendChild(el)
          })
        }
        render()
        
        const duration = await measure(() => {
          data = data.filter((_, idx) => idx !== 1)
          render()
        }, 5, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'create-10000',
      name: 'Create 10,000 rows',
      description: 'Duration to create 10,000 rows (no warmup)',
      warmupIterations: 0,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const duration = await measure(() => {
          const [data] = state(buildData(10000))
          const list = For({
            each: data,
            children: (item) => div({ text: () => `${item.id} - ${item.label}` })
          })
          list.mount(container)
          list.unmount()
        }, 0, 1)
        
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const duration = await measure(() => {
          const data = buildData(10000)
          container.innerHTML = ''
          data.forEach(item => {
            const el = document.createElement('div')
            el.textContent = `${item.id} - ${item.label}`
            container.appendChild(el)
          })
          container.innerHTML = ''
        }, 0, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'append-1000',
      name: 'Append 1,000 to 10,000 rows',
      description: 'Duration for adding 1,000 rows on a table of 10,000 rows (no warmup)',
      warmupIterations: 0,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const [data, setData] = state(buildData(10000))
        const list = For({
          each: data,
          children: (item) => div({ text: () => `${item.id} - ${item.label}` })
        })
        list.mount(container)
        
        const duration = await measure(() => {
          setData(prev => [...prev, ...buildData(1000)])
        }, 0, 1)
        
        list.unmount()
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        let data = buildData(10000)
        data.forEach(item => {
          const el = document.createElement('div')
          el.textContent = `${item.id} - ${item.label}`
          container.appendChild(el)
        })
        
        const duration = await measure(() => {
          const newData = buildData(1000)
          newData.forEach(item => {
            const el = document.createElement('div')
            el.textContent = `${item.id} - ${item.label}`
            container.appendChild(el)
          })
        }, 0, 1)
        
        document.body.removeChild(container)
        return duration
      }
    },
    {
      id: 'clear-10000',
      name: 'Clear 10,000 rows',
      description: 'Duration to clear the table filled with 10,000 rows (no warmup)',
      warmupIterations: 0,
      runIterations: 1,
      runOrganic: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const [data, setData] = state(buildData(10000))
        const list = For({
          each: data,
          children: (item) => div({ text: () => `${item.id} - ${item.label}` })
        })
        list.mount(container)
        
        const duration = await measure(() => {
          setData([])
        }, 0, 1)
        
        list.unmount()
        document.body.removeChild(container)
        return duration
      },
      runVanilla: async () => {
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const data = buildData(10000)
        data.forEach(item => {
          const el = document.createElement('div')
          el.textContent = `${item.id} - ${item.label}`
          container.appendChild(el)
        })
        
        const duration = await measure(() => {
          container.innerHTML = ''
        }, 0, 1)
        
        document.body.removeChild(container)
        return duration
      }
    }
  ]
  
  const runBenchmark = async (benchmark: BenchmarkTest) => {
    setRunning(benchmark.id)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const organicDuration = await benchmark.runOrganic()
      const vanillaDuration = await benchmark.runVanilla()
      
      // Calculate ratio with epsilon for zero measurements
      const organicTime = organicDuration <= 0 ? EPSILON : organicDuration
      const vanillaTime = vanillaDuration <= 0 ? EPSILON : vanillaDuration
      
      let ratio = organicTime / vanillaTime
      
      // Handle edge cases (shouldn't happen with epsilon, but just in case)
      if (!isFinite(ratio) || isNaN(ratio)) {
        ratio = 0
      }
      
      const result: BenchmarkResult = {
        name: benchmark.name,
        organicUI: organicDuration,
        vanillaJS: vanillaDuration,
        ratio
      }
      
      setResults(prev => [...prev.filter(r => r.name !== result.name), result])
    } catch (error) {
      console.error('Benchmark error:', error)
    } finally {
      setRunning(null)
    }
  }
  
  const runAllBenchmarks = async () => {
    setResults([])
    for (const benchmark of benchmarks) {
      await runBenchmark(benchmark)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  
  return div({
    children: [
      // Header
      div({
        children: [
          div({
            text: "Performance Benchmarks",
            style: {
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#2c3e50"
            }
          }),
          div({
            text: "Following js-framework-benchmark specification",
            style: {
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px"
            }
          })
        ]
      }),
      
      // Results Table
      div({
        children: [
          // Header with button
          div({
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            },
            children: [
              div({
                text: "Benchmark Results",
                style: {
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#2c3e50"
                }
              }),
              div({
                style: {
                  display: "flex",
                  gap: "10px",
                  alignItems: "center"
                },
                children: [
                  div({
                    text: () => running() ? `Running: ${running()}` : results().length > 0 ? `✓ ${results().length}/${benchmarks.length} completed` : "",
                    style: {
                      color: "#666",
                      fontSize: "14px"
                    }
                  }),
                  button({
                    text: () => running() ? "Running..." : "Run All",
                    onClick: runAllBenchmarks,
                    style: () => ({
                      padding: "10px 20px",
                      background: running() ? "#6c757d" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: running() ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "600"
                    })
                  })
                ]
              })
            ]
          }),
          div({
            style: {
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden"
            },
            children: [
              // Table header
              div({
                style: {
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                  gap: "10px",
                  padding: "15px",
                  background: "#f8f9fa",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#2c3e50"
                },
                children: [
                  div({ text: "Benchmark" }),
                  div({ text: "Vanilla JS (ms)" }),
                  div({ text: "Organic UI (ms)" }),
                  div({ text: "Ratio" }),
                  div({ text: "Action" })
                ]
              }),
              // Table rows
              ...benchmarks.map(benchmark => {
                const result = () => results().find(r => r.name === benchmark.name)
                const isRunning = () => running() === benchmark.id
                
                return div({
                  style: {
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                    gap: "10px",
                    padding: "15px",
                    borderTop: "1px solid #e0e0e0",
                    fontSize: "14px",
                    alignItems: "center"
                  },
                  children: [
                    div({ 
                      text: benchmark.name,
                      style: { fontWeight: "500" }
                    }),
                    div({ 
                      text: () => result() ? formatNumber(result()!.vanillaJS) : "-",
                      style: () => ({
                        color: result() ? "#2c3e50" : "#ccc"
                      })
                    }),
                    div({ 
                      text: () => result() ? formatNumber(result()!.organicUI) : "-",
                      style: () => ({
                        color: result() ? "#2c3e50" : "#ccc"
                      })
                    }),
                    div({ 
                      text: () => result() ? formatRatio(result()!.ratio) : "-",
                      style: () => ({
                        fontWeight: "600",
                        color: result() ? getRatioColor(result()!.ratio) : "#ccc"
                      })
                    }),
                    button({
                      text: () => isRunning() ? "..." : "Run",
                      onClick: () => runBenchmark(benchmark),
                      style: () => ({
                        padding: "6px 12px",
                        background: isRunning() ? "#6c757d" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isRunning() ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        fontWeight: "500"
                      })
                    })
                  ]
                })
              }),
              // Footer rows - WGM calculations
              div({
                style: () => ({
                  display: results().length === benchmarks.length ? "grid" : "none",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                  gap: "10px",
                  padding: "15px",
                  borderTop: "2px solid #2c3e50",
                  fontSize: "14px",
                  alignItems: "center",
                  background: "#f8f9fa",
                  fontWeight: "600"
                }),
                children: [
                  div({ 
                    text: "Weighted Geometric Mean",
                    style: { fontWeight: "700", color: "#2c3e50" }
                  }),
                  div({ 
                    text: () => {
                      // Calculate WGM for Vanilla JS
                      let vanillaWeightedLogSum = 0
                      let totalWeight = 0
                      
                      for (const result of results()) {
                        const weight = benchmarkWeights[result.name] || 0.2
                        const time = result.vanillaJS <= 0 ? EPSILON : result.vanillaJS
                        vanillaWeightedLogSum += weight * Math.log(time)
                        totalWeight += weight
                      }
                      
                      const vanillaWGM = Math.exp(vanillaWeightedLogSum / totalWeight)
                      return formatNumber(vanillaWGM)
                    },
                    style: { color: "#2c3e50" }
                  }),
                  div({ 
                    text: () => {
                      // Calculate WGM for Organic UI
                      let organicWeightedLogSum = 0
                      let totalWeight = 0
                      
                      for (const result of results()) {
                        const weight = benchmarkWeights[result.name] || 0.2
                        const time = result.organicUI <= 0 ? EPSILON : result.organicUI
                        organicWeightedLogSum += weight * Math.log(time)
                        totalWeight += weight
                      }
                      
                      const organicWGM = Math.exp(organicWeightedLogSum / totalWeight)
                      return formatNumber(organicWGM)
                    },
                    style: { color: "#2c3e50" }
                  }),
                  div({ 
                    text: "-",
                    style: { color: "#999" }
                  }),
                  div({ text: "" })
                ]
              }),
              div({
                style: () => ({
                  display: results().length === benchmarks.length ? "grid" : "none",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                  gap: "10px",
                  padding: "15px",
                  borderTop: "1px solid #dee2e6",
                  fontSize: "14px",
                  alignItems: "center",
                  background: "#f8f9fa",
                  fontWeight: "600"
                }),
                children: [
                  div({ 
                    text: "Relative WGM (Organic UI / Vanilla JS)",
                    style: { fontWeight: "700", color: "#2c3e50" }
                  }),
                  div({ 
                    text: "1.00x",
                    style: { color: "#28a745", fontWeight: "700" }
                  }),
                  div({ 
                    text: () => {
                      const score = calculateWeightedGeometricMean(results())
                      return formatRatio(score)
                    },
                    style: () => {
                      const score = calculateWeightedGeometricMean(results())
                      return {
                        fontWeight: "700",
                        color: getRatioColor(score)
                      }
                    }
                  }),
                  div({ 
                    text: () => {
                      const score = calculateWeightedGeometricMean(results())
                      return formatRatio(score)
                    },
                    style: () => {
                      const score = calculateWeightedGeometricMean(results())
                      return {
                        fontWeight: "700",
                        fontSize: "16px",
                        color: getRatioColor(score)
                      }
                    }
                  }),
                  div({ text: "" })
                ]
              })
            ]
          }),
          
          // Average ratio
          div({
            style: () => ({
              display: results().length === benchmarks.length ? "block" : "none",
              marginTop: "20px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              textAlign: "center"
            }),
            children: [
              div({
                text: "Average Performance Ratio",
                style: {
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "#2c3e50"
                }
              }),
              div({
                text: () => {
                  const score = calculateWeightedGeometricMean(results())
                  return formatRatio(score)
                },
                style: () => {
                  const score = calculateWeightedGeometricMean(results())
                  return {
                    fontSize: "36px",
                    fontWeight: "700",
                    color: getRatioColor(score)
                  }
                }
              }),
              div({
                text: () => {
                  const score = calculateWeightedGeometricMean(results())
                  if (score < 1.1) return "🎉 Excellent! Nearly as fast as vanilla JS"
                  if (score < 1.3) return "✅ Good performance overhead"
                  if (score < 1.5) return "⚠️ Acceptable, but room for improvement"
                  return "❌ Needs optimization"
                },
                style: {
                  fontSize: "14px",
                  color: "#666",
                  marginTop: "10px"
                }
              }),
              div({
                text: "Using weighted geometric mean (js-framework-benchmark methodology)",
                style: {
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "8px",
                  fontStyle: "italic"
                }
              })
            ]
          })
        ]
      }),
      
      // About Section
      div({
        style: {
          marginTop: "40px",
          padding: "20px",
          background: "#f8f9fa",
          borderRadius: "8px"
        },
        children: [
          div({
            text: "📊 About These Benchmarks",
            style: {
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "15px",
              color: "#2c3e50"
            }
          }),
          div({
            text: "These benchmarks follow the official js-framework-benchmark specification used to compare all major JavaScript frameworks. Each test measures a specific DOM operation pattern and compares Organic UI's performance against vanilla JavaScript (the theoretical fastest implementation).",
            style: {
              fontSize: "14px",
              color: "#666",
              marginBottom: "20px",
              lineHeight: "1.6"
            }
          }),
          div({
            text: "Methodology",
            style: {
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "10px",
              color: "#2c3e50"
            }
          }),
          div({
            style: {
              fontSize: "14px",
              color: "#666",
              marginBottom: "20px",
              lineHeight: "1.6"
            },
            children: [
              div({ 
                text: "• Each test compares Organic UI against vanilla JavaScript",
                style: { marginBottom: "6px" }
              }),
              div({ 
                text: "• Ratio = Organic UI time / Vanilla JS time (lower is better)",
                style: { marginBottom: "6px" }
              }),
              div({ 
                text: "• Overall score uses weighted geometric mean (same as official js-framework-benchmark)",
                style: { marginBottom: "6px" }
              }),
              div({ 
                text: "• Color coding: Green (<1.1x) = Excellent, Yellow (<1.3x) = Good, Orange (<1.5x) = Acceptable",
                style: { marginBottom: "6px" }
              })
            ]
          }),
          div({
            text: "Framework Comparison (typical ratios)",
            style: {
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "10px",
              color: "#2c3e50"
            }
          }),
          div({
            style: {
              fontSize: "13px",
              color: "#666",
              fontFamily: "monospace",
              lineHeight: "1.8"
            },
            children: [
              div({ text: "• Vanilla JS: 1.00x (baseline)" }),
              div({ text: "• Solid: ~1.05x" }),
              div({ text: "• Organic UI: ~1.08x (target)" }),
              div({ text: "• Vue 3: ~1.15x" }),
              div({ text: "• Svelte: ~1.20x" }),
              div({ text: "• React: ~1.45x" })
            ]
          })
        ]
      })
    ]
  })
}
