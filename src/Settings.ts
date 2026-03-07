import * as vscode from "vscode";

export type Card = {
  title?: string;
  message?: string;
  styles?: { [key: string]: string };
};

export type ConfettiStyle = "random" | "cannon" | "realistic" | "fireworks" | "stars" | "emoji" | "snow" | "schoolPride";

export class Settings {
  static get configuration() {
    return vscode.workspace.getConfiguration("awardsAndRecognitions");
  }
  static hasWorkspaceSetting(key: string = "cards") {
    const inspect = Settings.configuration.inspect(key);
    return inspect?.workspaceValue !== undefined || inspect?.workspaceFolderValue !== undefined;
  }

  static getSettings(val: string) {
    return Settings.configuration.get(val);
  }
  static async setSettings(key: string, val: any) {
    if (Settings.hasWorkspaceSetting(key)) {
      return Settings.configuration.update(key, val, vscode.ConfigurationTarget.Workspace);
    }
    return Settings.configuration.update(key, val, vscode.ConfigurationTarget.Global);
  }

  static get cards() {
    return (Settings.getSettings("cards") as Card[]) || ([{}] as Card[]);
  }

  static get cardsInterval() {
    return Settings.getSettings("cardsInterval") || 0;
  }

  static get disableConfettiOnNavigation() {
    return Settings.getSettings("disableConfettiOnNavigation") || false;
  }

  static get disableConfettiOnRefresh() {
    return Settings.getSettings("disableConfettiOnRefresh") || false;
  }
  static get disableConfettiOnClick() {
    return Settings.getSettings("disableConfettiOnClick") || false;
  }

  static get confettiStyle() {
    return (Settings.getSettings("confettiStyle") as ConfettiStyle) || ("random" as ConfettiStyle);
  }

  static get confettiCount() {
    return (Settings.getSettings("confettiCount") as number) || 150;
  }
}
