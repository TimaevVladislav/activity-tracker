interface Window {
  tracker: Tracker;
}

class Tracker {
  private buffer: any[] = [];
  private lastSent: number = Date.now();

  constructor() {
    window.addEventListener("beforeunload", () => {
      this.sendData();
    });
  }

  public track(event: string, ...tags: string[]): void {
    this.buffer.push({
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: Math.floor(Date.now() / 1000),
    });

    this.sendData();
  }

  private sendData(): void {
    if (this.buffer.length < 3 && Date.now() - this.lastSent < 1000) {
      return;
    }

    fetch("http://localhost:8888/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.buffer),
    })
      .then(() => {
        this.buffer = [];
        this.lastSent = Date.now();
      })
      .catch(() => setTimeout(() => this.sendData(), 1000));
  }
}

window.tracker = new Tracker();
