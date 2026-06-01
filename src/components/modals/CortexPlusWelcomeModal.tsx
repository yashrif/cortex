import React from "react";
import { App, Modal } from "obsidian";
import { Root } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { createPluginRoot } from "@/utils/react/createPluginRoot";
import {
  DEFAULT_CORTEX_PLUS_CHAT_MODEL,
  DEFAULT_CORTEX_PLUS_EMBEDDING_MODEL,
  DEFAULT_CORTEX_PLUS_EMBEDDING_MODEL_KEY,
  applyPlusSettings,
} from "@/plusUtils";
import { getSettings } from "@/settings/model";
import { TriangleAlert } from "lucide-react";

function CortexPlusWelcomeModalContent({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const settings = getSettings();
  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div>
        <p>
          Thanks for purchasing <b>Cortex Plus</b>! You have unlocked the full power of Cortex,
          featuring chat context, PDF and image support, exclusive chat and embedding models, and
          much more!
        </p>
        <p>
          Would you like to apply the Cortex Plus settings now? You can always change this later in
          Settings.
        </p>
        <ul className="tw-pl-4">
          <li>
            Default mode: <b className="tw-text-accent">Cortex Plus</b>
          </li>
          <li>
            Chat model: <b className="tw-text-accent">{DEFAULT_CORTEX_PLUS_CHAT_MODEL}</b>
          </li>
          <li>
            <div>
              Embedding model:{" "}
              <b className="tw-text-accent">{DEFAULT_CORTEX_PLUS_EMBEDDING_MODEL}</b>
            </div>
            {settings.embeddingModelKey !== DEFAULT_CORTEX_PLUS_EMBEDDING_MODEL_KEY && (
              <div className="tw-flex tw-items-center tw-gap-1 tw-text-sm tw-text-warning">
                <TriangleAlert className="tw-size-4" /> It will rebuild your embeddings for the
                entire vault
              </div>
            )}
          </li>
        </ul>
      </div>
      <div className="tw-flex tw-w-full tw-justify-end tw-gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Apply Later
        </Button>
        <Button variant="default" onClick={onConfirm}>
          Apply Now
        </Button>
      </div>
    </div>
  );
}

export class CortexPlusWelcomeModal extends Modal {
  private root: Root;

  constructor(app: App) {
    super(app);
    // https://docs.obsidian.md/Reference/TypeScript+API/Modal/setTitle
    // @ts-ignore
    this.setTitle("Welcome to Cortex Plus 🚀");
  }

  onOpen() {
    const { contentEl } = this;
    this.root = createPluginRoot(contentEl, this.app);

    const handleConfirm = () => {
      applyPlusSettings();
      this.close();
    };

    const handleCancel = () => {
      this.close();
    };

    this.root.render(
      <CortexPlusWelcomeModalContent onConfirm={handleConfirm} onCancel={handleCancel} />
    );
  }

  onClose() {
    this.root.unmount();
  }
}
