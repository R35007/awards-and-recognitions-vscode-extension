import * as vscode from "vscode";
import { Settings, type ConfettiStyle } from "./Settings";
import { getConfettiScript, getPointerOriginScript, getRandomDarkStyle, getRandomMessage } from "./utils";

type RenderReason = "initial" | "navigation" | "refresh" | "autoRefresh";

type RenderData = {
  title?: string;
  message?: string;
  confettiStyle: Exclude<ConfettiStyle, "random">;
  confettiCount: number;
  style: Record<string, string>;
  enableClickConfetti: boolean;
  fireOnLoad: boolean;
};

export class RecognizeViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _currentCardIndex = 0;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this._selectRandomCard();
    this._renderCard("initial");
  }

  public update() {
    this._selectRandomCard();
    this._renderCard("refresh");
  }

  public autoRefresh() {
    this._selectRandomCard();
    this._renderCard("autoRefresh");
  }

  public nextCard() {
    const cards = Settings.cards;
    if (cards.length > 0) {
      this._currentCardIndex = (this._currentCardIndex + 1) % cards.length;
      this._renderCard("navigation");
    }
  }

  public previousCard() {
    const cards = Settings.cards;
    if (cards.length > 0) {
      this._currentCardIndex = (this._currentCardIndex - 1 + cards.length) % cards.length;
      this._renderCard("navigation");
    }
  }

  private _selectRandomCard() {
    const cards = Settings.cards;
    if (cards.length > 0) {
      this._currentCardIndex = Math.floor(Math.random() * cards.length);
    }
  }

  private _renderCard(reason: RenderReason) {
    if (!this._view) {
      return;
    }

    const cards = Settings.cards;
    if (cards.length === 0) {
      this._view.webview.html = this._getHtml({
        confettiStyle: this._resolveConfettiStyle(),
        confettiCount: Settings.confettiCount,
        style: getRandomDarkStyle(),
        enableClickConfetti: !Settings.disableConfettiOnClick,
        fireOnLoad: this._shouldFireOnLoad(reason),
      });
      return;
    }

    if (this._currentCardIndex >= cards.length) {
      this._currentCardIndex = 0;
    }

    const card = cards[this._currentCardIndex];
    const message = card.message || getRandomMessage();
    const data: RenderData = {
      title: card.title,
      message,
      confettiStyle: this._resolveConfettiStyle(),
      confettiCount: Settings.confettiCount,
      style: { color: "#ffffff", ...card.styles, background: card.styles?.background || getRandomDarkStyle().background },
      enableClickConfetti: !Settings.disableConfettiOnClick,
      fireOnLoad: this._shouldFireOnLoad(reason),
    };

    this._view.webview.html = this._getHtml(data);
  }

  private _resolveConfettiStyle(): Exclude<ConfettiStyle, "random"> {
    if (Settings.confettiStyle === "random") {
      const styles: Array<Exclude<ConfettiStyle, "random">> = ["cannon", "realistic", "fireworks", "stars", "emoji", "snow", "schoolPride"];
      return styles[Math.floor(Math.random() * styles.length)];
    }
    return Settings.confettiStyle;
  }

  private _shouldFireOnLoad(reason: RenderReason): boolean {
    if (reason === "navigation" || reason === "autoRefresh") {
      return !Settings.disableConfettiOnNavigation;
    }
    if (reason === "refresh") {
      return !Settings.disableConfettiOnRefresh;
    }
    return !Settings.disableConfettiOnRefresh;
  }

  private _getHtml(data: RenderData) {
    const titleHtml = data.title ? `<div class="manager">${data.title}</div>` : "";
    const messageHtml = data.message ? `<div class="text">"${data.message}"</div>` : "";
    const confettiScript = getConfettiScript(data.confettiStyle, data.confettiCount);
    const pointerScript = getPointerOriginScript();
    const cursorStyle = data.enableClickConfetti ? "pointer" : "default";
    const fireOnLoadScript = data.fireOnLoad ? "setTimeout(fire, 100);" : "";

    return /*html*/ `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net"></script>
          <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
          <style>
            html{
                margin: 0; padding: 0; box-sizing: border-box;
                overflow: hidden;
            }
              body { 
                  padding: 0;
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  height: 100vh; 
                  margin: 0;
                  background: #121212; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              }
              .card {
                  user-select: none;
                  padding: 1rem; 
                  border-radius: 6px; 
                  margin: 0.5rem;
                  text-align: center; color: white;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.6); width: 85%; cursor: ${cursorStyle};
                  border: 1px solid rgba(255,255,255,0.1);
                  display: grid;
                  place-items: center;
                  min-height: 60px;
                  ${Object.entries(data.style)
                    .map(([key, value]) => `${key}: ${value};`)
                    .join(" ")}
              }
              .manager { user-select: none; font-size: 0.8rem; opacity: 0.7; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; }
              .text { user-select: none; font-size: 1.2rem; font-style: italic; line-height: 1.4; font-weight: 600; }
          </style>
      </head>
        <body>
          <div class="card">
              ${titleHtml}
              ${messageHtml}
          </div>
          <script>
              ${pointerScript}
              ${confettiScript}
              ${fireOnLoadScript}
          </script>
      </body>
      </html>`;
  }
}
