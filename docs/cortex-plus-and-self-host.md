# Cortex Plus and Self-Host

**Cortex Plus** is a premium tier that unlocks advanced features beyond the free, API-key-based experience. **Self-Host Mode** is an additional option for Cortex Plus Lifetime/Believer subscribers who want to run their own infrastructure.

---

## Cortex Plus

### What Is Cortex Plus?

Cortex Plus is a subscription that enables:

- **Autonomous agent mode** — AI that reasons step-by-step and uses tools automatically
- **File editing tools** — Write to File and Replace in File for AI-driven note editing
- **Web search** — Search the internet from chat
- **YouTube transcription** — Fetch video transcripts and use them as context
- **Memory system** — Persistent memory across conversations
- **Cortex Plus Flash model** — A built-in model that requires no separate API key
- **URL processing** — Fetch and summarize web pages as context
- **Cortex Plus embedding models** — High-quality embeddings for semantic search

### Setting Up Cortex Plus

1. Get a license key from your dashboard at **https://www.obsidiancopilot.com/en/dashboard**
2. Go to **Settings → Cortex → Basic** (or the Plus banner in the settings)
3. Enter your license key in the **Cortex Plus License Key** field
4. Features unlock automatically

---

## Cortex Plus Flash Model

**Cortex Plus Flash** is a built-in AI model included with your Cortex Plus subscription:

- No separate API key needed
- Works out of the box once your license key is active
- Supports vision (image inputs)
- Good for general-purpose tasks

It appears as `cortex-plus-flash` in the model selector.

---

## Memory System

The memory system lets Cortex remember things across conversations, so you don't have to repeat yourself.

### Recent Conversations

Cortex can reference your recent conversation history to provide more contextually relevant responses. This is separate from the current chat window — it's a summary of what you've been working on.

- **Enable**: **Settings → Cortex → Plus → Reference Recent Conversation** (on by default)
- **How many**: **Settings → Cortex → Plus → Max Recent Conversations** — default 30, range 10–50
- All history is stored locally in your vault (no data leaves your machine for this feature)

### Saved Memories

You can ask Cortex to explicitly remember specific facts about you:

```
@memory remember that I'm preparing for JLPT N3 and prefer bullet-point summaries
```

Cortex saves this to a memory file in your vault and references it in future conversations.

- **Enable**: **Settings → Cortex → Plus → Reference Saved Memories** (on by default)
- **Memory folder**: **Settings → Cortex → Plus → Memory Folder Name** — default: `cortex/memory`
- **Update memory tool**: The AI can add, update, or remove memories when you ask

---

## Document Processor

When Cortex processes PDFs and other non-markdown files (in Plus mode), it converts them to markdown for the AI to read.

You can optionally save the converted markdown to a folder in your vault:

- **Setting**: **Settings → Cortex → Plus → Store converted markdown at**
- Leave empty to skip saving (conversion still happens, it just isn't persisted)

---

## Self-Host Mode

### What Is Self-Host Mode?

Self-Host Mode lets you replace Cortex's cloud services with your own infrastructure. Instead of relying on Cortex's Plus backend, you run everything locally or on your own server.

**Requires**: A Cortex Plus Lifetime or Believer license (not available on monthly subscriptions).

### What Self-Host Mode Enables

- Use local or custom LLM servers
- Custom web search via Firecrawl or Perplexity Sonar
- Local YouTube transcript extraction via Supadata
- Miyo desktop app for local PDF parsing, semantic search, and more

### Enabling Self-Host Mode

1. Go to **Settings → Cortex → Plus**
2. Under **Self-Host Mode**, toggle **Enable Self-Host Mode**
3. Cortex validates your license. If valid, the toggle activates.
4. Toggle **Enable Miyo** to use the Miyo desktop app for local search, PDF parsing, and context.
5. _(Optional)_ Set **Custom Miyo Server URL** only if Miyo is running on a remote machine. Leave blank to use automatic local service discovery.

### Web Search in Self-Host Mode

Choose your web search provider:

- **Firecrawl** — A web crawling and scraping API. Get a key at firecrawl.dev. Enter it in **Settings → Cortex → Plus → Firecrawl API Key**.
- **Perplexity Sonar** — An AI-powered search API. Get a key at perplexity.ai. Enter it in **Settings → Cortex → Plus → Perplexity API Key**.

### YouTube Transcription in Self-Host Mode

Use your own Supadata API key for YouTube transcript extraction:

- Get a key at supadata.ai
- Enter it in **Settings → Cortex → Plus → Supadata API Key**

---

## Miyo Desktop App

Miyo is a companion desktop app from the same developer that enhances Cortex with local, offline capabilities:

### What Miyo Provides

- **Local semantic search** — Fast vector search without embedding API calls
- **PDF parsing** — Converts PDFs to markdown locally (no cloud OCR)
- **Context hub** — Manages your indexed documents locally
- **Custom server URL** — Run Miyo on any machine (local or server)

### Setting Up Miyo

1. Download and install the Miyo desktop app
2. Start the Miyo server
3. In Cortex, go to **Settings → Cortex → Plus → Enable Miyo Search**
4. Miyo automatically connects to the local server (or use a custom URL in **Miyo Server URL**)
5. Index your vault — Cortex will use Miyo to generate and store embeddings locally

### Custom Miyo Server URL

If Miyo is running on a different machine (e.g., a home server), enter its address:

```
http://192.168.1.10:8742
```

Leave empty to use automatic local discovery.

---

## Related

- [Agent Mode and Tools](agent-mode-and-tools.md) — Using the autonomous agent
- [Vault Search and Indexing](vault-search-and-indexing.md) — How Miyo enhances semantic search
- [Getting Started](getting-started.md) — First-time setup
