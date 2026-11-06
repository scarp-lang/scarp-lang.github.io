/**
 * Reveal copy controls only when the Clipboard API and their exact text exist.
 * A no-JavaScript page still exposes readable code and checksums.
 */
export interface ClipboardWriter {
  writeText(text: string): Promise<void>;
}

/** Structural DOM subset: also typechecks in Node's DOM-free test environment. */
export interface CopyControl {
  hidden: boolean;
  disabled: boolean;
  textContent: string | null;
  dataset: { copyText?: string };
  closest(selector: string): { querySelector(selector: string): { textContent: string | null } | null } | null;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  addEventListener(type: "click", handler: () => void): void;
}

type Scheduler = (callback: () => void, delayMs: number) => void;

export function enhanceCopyButtons(
  buttons: Iterable<CopyControl>,
  clipboard: ClipboardWriter | undefined,
  announce: (message: string) => void,
  schedule: Scheduler = (callback, delayMs) => { setTimeout(callback, delayMs); },
): void {
  if (typeof clipboard?.writeText !== "function") return;

  for (const button of buttons) {
    const explicitText = button.dataset.copyText;
    const text = explicitText ??
      button.closest(".code-block")?.querySelector("code")?.textContent ?? "";
    if (!text) continue;

    const originalText = button.textContent ?? "Copy";
    const originalLabel = button.getAttribute("aria-label");
    let generation = 0;
    button.hidden = false;

    button.addEventListener("click", async () => {
      if (button.disabled) return;
      const current = ++generation;
      button.disabled = true;
      try {
        await clipboard.writeText(text);
        button.textContent = "Copied!";
        button.setAttribute("aria-label", (originalLabel ?? originalText) + " — copied");
        announce(explicitText !== undefined
          ? "SHA-256 checksum copied to clipboard."
          : "Code copied to clipboard.");
      } catch {
        button.textContent = "Copy failed";
        button.setAttribute("aria-label", (originalLabel ?? originalText) + " — failed");
        announce("Could not copy. Select the text and copy it manually.");
      } finally {
        button.disabled = false;
        // A previous click must not reset the message from a later attempt.
        schedule(() => {
          if (generation !== current) return;
          button.textContent = originalText;
          if (originalLabel === null) button.removeAttribute("aria-label");
          else button.setAttribute("aria-label", originalLabel);
        }, 1800);
      }
    });
  }
}
