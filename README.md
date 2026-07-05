# FAQBot 🤖

**Ask it anything. It only answers what you tell it to.**

FAQBot is a lightweight FAQ assistant built on Azure OpenAI. Write a system prompt, define its scope, and it answers questions inside that boundary only — nothing else. Point it at a product manual and it becomes a support bot. Point it at a codebase and it becomes a coding assistant. The scope lives entirely in the prompt, not the code.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-GPT--5--mini-0078D4?logo=microsoftazure&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## What it does

- **Scoped answers** — a system prompt defines what the bot will and won't talk about; off-topic questions get politely declined instead of answered.
- **Live chat interface** — ask a question, get a streamed response, no page reloads.
- **One place to change behaviour** — edit the system prompt in the UI to retarget the bot without touching code.
- **Azure OpenAI under the hood** — runs on GPT-5-mini via your own Azure resource, so requests and data stay in your subscription.

## How it works

```
 browser (index.html)
       │  types a question
       ▼
 app.js  ──POST /api/chat──▶  Express server
                                    │  attaches system prompt
                                    ▼
                             Azure OpenAI (GPT-5-mini)
                                    │
       ◀──────── JSON { reply } ───┘
```

The frontend never talks to Azure directly — your API key stays server-side in `.env`, and the browser only ever calls your own `/api/chat` endpoint.

## Stack

| Layer      | Tech                              |
|------------|------------------------------------|
| Model      | Azure OpenAI · GPT-5-mini (West US) |
| Server     | Node.js + Express                  |
| Frontend   | Vanilla HTML / CSS / JS — no build step |

## Getting started

**1. Clone and install**

```bash
git clone https://github.com/saishagoel27/FAQ-Bot
cd FAQBot
npm install
```

**2. Configure your environment**

Create a `.env` file in the project root:

```env
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
AZURE_OPENAI_API_VERSION=2024-your_version
```

**3. Run it**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Getting an Azure OpenAI key

1. Go to [portal.azure.com](https://portal.azure.com) and create an Azure OpenAI resource.
2. Open **Azure AI Foundry** for that resource and deploy `gpt-5-mini`.
3. Copy the resource's endpoint and key, and the deployment name you gave it, into `.env`.

## Customising the bot

Everything about the bot's behaviour flows from the system prompt in the UI. A few starting points:

- **Narrow the scope** — list exactly what topics it should cover, and tell it what to say when a question falls outside that list.
- **Set the tone** — "explain like I'm a beginner" and "answer like a senior engineer" produce noticeably different responses from the same model.
- **Give it a persona** — name it, give it a personality, and it'll stay in character across the conversation.

## Project structure

```
FAQBot/
├── index.html       # chat UI
├── style.css         # styling
├── app.js            # frontend logic — talks to /api/chat
├── server.js         # Express server + Azure OpenAI integration
├── .env               # your Azure credentials (not committed)
└── package.json
```

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `Error connecting to server` in the chat | The Express server isn't running, or `.env` is missing/misconfigured |
| Empty or generic replies | Check `AZURE_OPENAI_DEPLOYMENT` matches the deployment name in Azure AI Foundry exactly |
| 401 / auth errors | `AZURE_OPENAI_KEY` is wrong or has been rotated in the Azure portal |

## License

MIT — use it, fork it, point it at whatever you want.
