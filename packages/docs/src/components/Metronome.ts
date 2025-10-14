import { div, button, p } from "organic-ui/components"
import { state, effect } from "organic-ui/reactivity"

export function Metronome() {
  const [bpm, setBpm] = state(120)
  const [isPlaying, setIsPlaying] = state(false)
  const [beatCount, setBeatCount] = state(0)
  
  return div({
    style: {
      padding: "20px",
      border: "2px solid #3b82f6",
      borderRadius: "8px",
      maxWidth: "400px"
    },
    children: [
      div({
        text: "Metronome",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#2c3e50"
        }
      }),
      
      // Beat indicator
      div({
        style: {
          fontSize: "32px",
          textAlign: "center",
          padding: "20px",
          marginBottom: "16px",
          borderRadius: "8px",
          transition: "background-color 0.1s"
        },
        ref: (el) => {
          effect(() => {
            el.textContent = isPlaying() ? `♪ Beat ${beatCount()}` : "○ Stopped"
            el.style.backgroundColor = isPlaying() ? "#dbeafe" : "#f3f4f6"
          })
        }
      }),
      
      // BPM display
      p({
        text: () => `${bpm()} BPM`,
        style: {
          fontSize: "24px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "12px",
          color: "#3b82f6"
        }
      }),
      
      // BPM controls
      div({
        style: {
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          justifyContent: "center"
        },
        children: [
          button({
            text: () => "-10",
            onClick: () => setBpm(Math.max(40, bpm() - 10)),
            style: {
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }
          }),
          button({
            text: () => "-1",
            onClick: () => setBpm(Math.max(40, bpm() - 1)),
            style: {
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }
          }),
          button({
            text: () => "+1",
            onClick: () => setBpm(Math.min(240, bpm() + 1)),
            style: {
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }
          }),
          button({
            text: () => "+10",
            onClick: () => setBpm(Math.min(240, bpm() + 10)),
            style: {
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }
          })
        ]
      }),
      
      // Play/Stop button
      button({
        text: () => isPlaying() ? "Stop" : "Start",
        onClick: () => {
          setIsPlaying(!isPlaying())
          if (!isPlaying()) {
            setBeatCount(0)
          }
        },
        style: () => ({
          width: "100%",
          padding: "12px",
          backgroundColor: isPlaying() ? "#ef4444" : "#10b981",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600"
        })
      }),
      
      // Effect that manages the metronome interval
      div({
        ref: () => {
          // This effect re-runs whenever bpm or isPlaying changes
          const dispose = effect(() => {
            if (!isPlaying()) {
              // No interval when stopped
              return
            }
            
            const currentBpm = bpm()
            const intervalMs = 60000 / currentBpm
            
            // Create audio context for beep sound
            const audioContext = new AudioContext()
            
            const playBeep = () => {
              const oscillator = audioContext.createOscillator()
              const gainNode = audioContext.createGain()
              
              oscillator.connect(gainNode)
              gainNode.connect(audioContext.destination)
              
              oscillator.frequency.value = 800
              oscillator.type = "sine"
              
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
              
              oscillator.start(audioContext.currentTime)
              oscillator.stop(audioContext.currentTime + 0.1)
              
              // Use updater function to increment count
              setBeatCount(count => count + 1)
            }
            
            // Play first beat immediately
            playBeep()
            
            // Set up interval for subsequent beats
            const id = setInterval(playBeep, intervalMs)
            
            // Cleanup: clear interval and close audio context when effect re-runs
            return () => {
              clearInterval(id)
              if (audioContext.state !== "closed") {
                audioContext.close()
              }
            }
          })
          
          // Cleanup when component unmounts
          return dispose
        }
      })
    ]
  })
}
