import * as vscode from "vscode";
import { RecognizeViewProvider } from "./RecognizeViewProvider";
import { Settings } from "./Settings";

export function activate(context: vscode.ExtensionContext) {
  const provider = new RecognizeViewProvider(context.extensionUri);
  let autoRefreshTimer: ReturnType<typeof setInterval> | undefined;

  const startOrRestartAutoRefresh = () => {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = undefined;
    }

    const interval = Number(Settings.cardsInterval) || 0;
    if (interval > 0) {
      autoRefreshTimer = setInterval(() => {
        provider.autoRefresh();
      }, interval);
    }
  };

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("awardsAndRecognitions.view", provider),
    // Refresh command shows a random card with potentially new style
    vscode.commands.registerCommand("awardsAndRecognitions.refresh", () => {
      provider.update();
      startOrRestartAutoRefresh();
    }),
    vscode.commands.registerCommand("awardsAndRecognitions.nextCard", () => {
      provider.nextCard();
      startOrRestartAutoRefresh();
    }),
    vscode.commands.registerCommand("awardsAndRecognitions.previousCard", () => {
      provider.previousCard();
      startOrRestartAutoRefresh();
    }),
    vscode.commands.registerCommand("awardsAndRecognitions.openSettings", () => {
      vscode.commands.executeCommand(
        Settings.hasWorkspaceSetting() ? "workbench.action.openWorkspaceSettings" : "workbench.action.openSettings",
        " @ext:thinker.awards-and-recognitions ",
      );
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("awardsAndRecognitions.cardsInterval")) {
        startOrRestartAutoRefresh();
      }
    }),
    new vscode.Disposable(() => {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
      }
    }),
  );

  startOrRestartAutoRefresh();
}
