interface Window {
  tracker: Tracker
}

class Tracker {
  private buffer: any[] = []
  private lastSent: number = Date.now()
  private interval: number = 1000
  private minEvents: number = 3

  constructor() {
    window.addEventListener("beforeunload", () => {
      this.dispatchUserActivity()
    })
  }

  public track(event: string, ...tags: string[]): void {
    this.buffer.push({
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: Math.floor(Date.now() / 1000)
    })

    this.dispatchUserActivity()
  }

  private checkBufferInterval(): void {
    if (Date.now() - this.lastSent >= this.interval) {
      this.dispatchUserActivity()
    }
  }

  private dispatchUserActivity(): void {
    if (this.buffer.length >= this.minEvents) {
      const tracks = this.buffer.slice()
      this.buffer = []

      fetch("http://localhost:8888/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tracks)
      })
          .then(() => {
            this.lastSent = Date.now()
          })
          .catch(() => {
            this.buffer.unshift(...tracks)

            if (this.buffer.length) {
              setTimeout(() => {
                this.checkBufferInterval()
              }, this.interval)
            }
          })
    }
  }
}

window.tracker = new Tracker()
