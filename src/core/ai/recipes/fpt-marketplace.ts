import type { Recipe } from '../types.ts';

/**
 * FPT AI Marketplace — OpenAI-compatible inference gateway by FPT Cloud.
 * Hosts Vietnamese and international LLMs (DeepSeek, Llama, Qwen, SaoLa)
 * plus FPT's own embedding models optimized for Vietnamese text.
 *
 * Reference: https://marketplace.fptcloud.com/en
 * API docs:  https://github.com/fpt-corp/ai-marketplace
 */
export const fptMarketplace: Recipe = {
  id: 'fpt-marketplace',
  name: 'FPT AI Marketplace',
  tier: 'openai-compat',
  implementation: 'openai-compatible',
  base_url_default: 'https://mkp-api.fptcloud.com',
  auth_env: {
    required: ['FPT_API_KEY'],
    setup_url: 'https://marketplace.fptcloud.com/en/my-account#my-api-key',
  },
  touchpoints: {
    embedding: {
      models: [
        'FPT.AI-e5-large',
        'FPT.AI-gte-base',
        'Vietnamese_Embedding',
      ],
      default_dims: 1024,
      // FPT does not publish a hard batch-token cap; use a conservative limit
      // so the gateway pre-splits before hitting undocumented server limits.
      max_batch_tokens: 8192,
    },
    chat: {
      models: [
        'Llama-3.3-70B-Instruct',
        'Llama-4-Scout-17B-16E',
        'DeepSeek-R1',
        'DeepSeek-R1-Distill-Llama-70B',
        'QwQ-32B',
        'Qwen2.5-7B-instruct',
        'Qwen2.5-Coder-32B-Instruct',
        'SaoLa3.1-medium',
        'Llama-3.1-8B-Instruct',
      ],
      supports_tools: true,
      supports_subagent_loop: true,
      supports_prompt_cache: false,
      max_context_tokens: 131072,
    },
  },
  setup_hint:
    'Get an API key at https://marketplace.fptcloud.com/en/my-account#my-api-key, then `export FPT_API_KEY=...`',
};
