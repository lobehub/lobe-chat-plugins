export interface PluginItem {
  createAt: string;
  homepage: string;
  meta: Meta;
  name: string;
  runtime: Runtime;
  schema: any;
}

export interface Meta {
  avatar: string;
  tags: string[];
}

export interface Runtime {
  runner: string;
  render?: string;
}

export interface LobeChatPlugins {
  version: 1;
  plugins: PluginItem[];
}
