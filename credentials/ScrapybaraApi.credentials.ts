import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ScrapybaraApi implements ICredentialType {
	name = 'scrapybaraApi';
	displayName = 'Scrapybara API';
	documentationUrl = 'https://scrapybara.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Scrapybara API key',
		},
	];
} 