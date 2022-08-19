export interface OAuthApp {
  client_id: string
  client_secret: string
}

export interface TelegramCredentials {
  chat_id: string
  token: string
}

export interface Session {
  github_id: number
  github_username: string
}

export interface AppConfig {
  session_cookie_password: string
  bell_cookie_password: string
}
