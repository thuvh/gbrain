import { describe, expect, test } from 'bun:test';
import { getRecipe } from '../../src/core/ai/recipes/index.ts';
import { defaultResolveAuth } from '../../src/core/ai/gateway.ts';
import { AIConfigError } from '../../src/core/ai/errors.ts';

describe('recipe: fpt-marketplace', () => {
  test('registered with expected shape', () => {
    const r = getRecipe('fpt-marketplace');
    expect(r).toBeDefined();
    expect(r!.id).toBe('fpt-marketplace');
    expect(r!.tier).toBe('openai-compat');
    expect(r!.implementation).toBe('openai-compatible');
    expect(r!.base_url_default).toBe('https://mkp-api.fptcloud.com');
    expect(r!.auth_env?.required).toEqual(['FPT_API_KEY']);
  });

  test('embedding touchpoint declares expected models and dims', () => {
    const r = getRecipe('fpt-marketplace')!;
    expect(r.touchpoints.embedding).toBeDefined();
    expect(r.touchpoints.embedding!.models).toContain('FPT.AI-e5-large');
    expect(r.touchpoints.embedding!.models).toContain('FPT.AI-gte-base');
    expect(r.touchpoints.embedding!.models).toContain('Vietnamese_Embedding');
    expect(r.touchpoints.embedding!.default_dims).toBe(1024);
    expect(r.touchpoints.embedding!.max_batch_tokens).toBe(8192);
  });

  test('chat touchpoint declares expected models and capabilities', () => {
    const r = getRecipe('fpt-marketplace')!;
    expect(r.touchpoints.chat).toBeDefined();
    expect(r.touchpoints.chat!.models).toContain('Llama-3.3-70B-Instruct');
    expect(r.touchpoints.chat!.models).toContain('DeepSeek-R1');
    expect(r.touchpoints.chat!.supports_tools).toBe(true);
    expect(r.touchpoints.chat!.supports_subagent_loop).toBe(true);
    expect(r.touchpoints.chat!.supports_prompt_cache).toBe(false);
  });

  test('default auth: FPT_API_KEY set → "Bearer <key>"', () => {
    const r = getRecipe('fpt-marketplace')!;
    const auth = defaultResolveAuth(r, { FPT_API_KEY: 'fake-fpt-key' }, 'chat');
    expect(auth.headerName).toBe('Authorization');
    expect(auth.token).toBe('Bearer fake-fpt-key');
  });

  test('default auth: missing FPT_API_KEY → AIConfigError', () => {
    const r = getRecipe('fpt-marketplace')!;
    expect(() => defaultResolveAuth(r, {}, 'embedding')).toThrow(AIConfigError);
  });
});
