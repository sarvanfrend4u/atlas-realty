# ADR-004: Groq Free Tier + Ollama as LLM for Conversational Search

## Status
Accepted

## Context
Conversational search requires an LLM to parse natural language queries ("3BHK near OMR under 80L") into structured filter parameters. Options include:
- OpenAI API (GPT-4) — paid, ~$0.01/query
- Anthropic Claude API — paid
- Google Gemini API — free tier available
- Groq (Llama 3 hosted) — free tier, 60 req/min
- Ollama (local Llama 3.2) — fully offline, zero cost, slower

## Decision
Use **Groq free tier** as the primary LLM (cloud, fast, free at low volume) with **Ollama + Llama 3.2** as the local fallback for development or offline use.

The `GROQ_API_KEY` environment variable is optional — if absent, the system falls back to Ollama automatically.

## Consequences
**Better:**
- Groq free tier: 60 requests/minute, ~100ms response — sufficient for early traffic
- Ollama allows fully offline development — no API keys needed for local dev
- No vendor lock-in — LLM provider is swappable via config
- Zero cost at launch

**Worse:**
- Groq free tier rate limit (60 req/min) will cap concurrent users at scale
- Ollama requires local GPU or CPU inference — slower on low-spec machines (~2–5s)

**Trigger for revisiting:**
Switch to a paid LLM tier or add request queuing if conversational search latency exceeds 500ms p99 in production.
