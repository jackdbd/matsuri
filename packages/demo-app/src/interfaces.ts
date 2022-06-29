export interface Config {
  app_human_readable_name: string
  app_technical_name: string
  app_version: string
  environment: string
  port: number | string
  telegram_chat_id: number | string
  telegram_token: string
}
