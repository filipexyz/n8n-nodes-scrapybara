import { INodeType } from 'n8n-workflow';
import { Scrapybara } from './nodes/Scrapybara/Scrapybara.node';
import { ScrapybaraApi } from './credentials/ScrapybaraApi.credentials';

export { Scrapybara, ScrapybaraApi };

// Export for n8n
export const nodeTypes = {
  Scrapybara,
};

export const credentialTypes = {
  ScrapybaraApi,
}; 