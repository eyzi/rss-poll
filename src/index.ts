import Parser from "rss-parser"
import { EventEmitter } from "events"
import {
  GUID,
  PollConfig,
  Feed
} from "./types"

enum PollerStatus {
  IDLE,
  CHECKING,
  STOPPED
}

class Poller extends EventEmitter {
  config: PollConfig
  lastGuid: GUID
  status: PollerStatus
  interval: any

  constructor (config: PollConfig) {
    super()
    this.config = config
    this.lastGuid = null
    this.status = PollerStatus.IDLE
    this.tryCheck()
    this.emit("ready")
    this.interval = setInterval(
      this.tryCheck.bind(this),
      this.config.interval ?? 60 * 1000
    )
  }

  handleNewFeed (items: Feed[]): void {
    const itemsCopy = [...items]
    const lastItem = itemsCopy.pop()
    if (!lastItem) return

    this.setLastGuid(lastItem.guid)
    this.emit("feed", lastItem)
    return this.handleNewFeed(itemsCopy)
  }

  lastGuidIndex (items: Feed[]) {
		let index
		for (index = 0; index < items.length; index++) {
			if (items[index].guid === this.lastGuid) return index
		}
		return -1
	}

  trimSeen (items: Feed[]): Feed[] {
    const itemsCopy = [...items]
    const lastIndex = this.lastGuidIndex(items)
    if (lastIndex <= 0) return []
    itemsCopy.splice(lastIndex)
    return itemsCopy
  }

  async checkNewFeed () {
    this.setStatus(PollerStatus.CHECKING)

    const parser = new Parser(this.config.parserConfig)
    const feed = await parser.parseURL(this.config.url)
    if (!feed || !feed.items || feed.items.length <= 0) return

    if (!this.lastGuid) {
      const firstItem = feed.items.shift() as Feed
      this.setLastGuid(firstItem.guid)
      this.emit("first-fetch", firstItem)
    } else {
      const unseenFeed = this.trimSeen(feed.items as Feed[])
      this.handleNewFeed(unseenFeed)
    }

    this.setStatus(PollerStatus.IDLE)
  }

  setStatus (status: PollerStatus) {
    switch (status) {
      case PollerStatus.CHECKING:
        this.status = PollerStatus.CHECKING
        this.emit("checking")
        this.emit("status", "checking")
        break
      case PollerStatus.IDLE:
        this.status = PollerStatus.IDLE
        this.emit("idle")
        this.emit("status", "idle")
        break
      case PollerStatus.STOPPED:
        this.status = PollerStatus.STOPPED
        this.emit("stopped")
        this.emit("status", "stopped")
        break
    }
  }

  setLastGuid (guid: string) {
    this.lastGuid = guid
    this.emit("last-guid", guid)
  }

  tryCheck () {
    if (this.status !== PollerStatus.IDLE) return
    this.checkNewFeed()
  }

  toggle (value: boolean = false) {
    if (value) {
      this.setStatus(PollerStatus.IDLE)
    } else {
      this.setStatus(PollerStatus.STOPPED)
    }
  }
}

export default Poller
