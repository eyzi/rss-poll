export type GUID = string | null

export type ParserConfig = {
  timeout?: number
  customFields?: {
    item: string[]
  }
}

export type PollConfig = {
  url: string
  interval?: number
  parserConfig?: ParserConfig
}

export type Feed = {
  guid: string
  [key: string]: any
}
