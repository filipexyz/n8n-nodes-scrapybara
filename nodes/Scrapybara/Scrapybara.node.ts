import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

import { ScrapybaraClient } from 'scrapybara';

export class Scrapybara implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scrapybara',
		name: 'scrapybara',
		icon: 'file:scrapybara.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with the Scrapybara API',
		defaults: {
			name: 'Scrapybara',
		},
		inputs: [
			{
				type: NodeConnectionType.Main,
			},
		],
		outputs: [
			{
				type: NodeConnectionType.Main,
			},
		],
		credentials: [
			{
				name: 'scrapybaraApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Instance',
						value: 'instance',
					},
				],
				default: 'instance',
			},

			// INSTANCE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['instance'],
					},
				},
				options: [
					{
						name: 'Start',
						value: 'start',
						description: 'Start a new instance',
						action: 'Start a new instance',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop an instance',
						action: 'Stop an instance',
					},
					{
						name: 'Pause',
						value: 'pause',
						description: 'Pause an instance',
						action: 'Pause an instance',
					},
					{
						name: 'Resume',
						value: 'resume',
						description: 'Resume an instance',
						action: 'Resume an instance',
					},
					{
						name: 'Screenshot',
						value: 'screenshot',
						description: 'Take a screenshot of the instance',
						action: 'Take a screenshot of the instance',
					},
					{
						name: 'Get Stream URL',
						value: 'getStreamUrl',
						description: 'Get the streaming URL for the instance',
						action: 'Get the streaming URL for the instance',
					},
					{
						name: 'Run Bash Command',
						value: 'runBashCommand',
						description: 'Run a bash command on the instance',
						action: 'Run a bash command on the instance',
					},
					{
						name: 'Computer Action',
						value: 'computerAction',
						description: 'Perform a computer action (mouse/keyboard)',
						action: 'Perform a computer action',
					},
				],
				default: 'start',
			},

			// START INSTANCE
			{
				displayName: 'Instance Type',
				name: 'instanceType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['start'],
					},
				},
				options: [
					{
						name: 'Ubuntu',
						value: 'ubuntu',
						description: 'Start an Ubuntu instance',
					},
					{
						name: 'Browser',
						value: 'browser',
						description: 'Start a browser instance',
					},
					{
						name: 'Windows',
						value: 'windows',
						description: 'Start a Windows instance',
					},
				],
				default: 'ubuntu',
			},
			{
				displayName: 'Timeout Hours',
				name: 'timeoutHours',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['start'],
					},
				},
				default: 1,
				description: 'Timeout in hours before instance is automatically terminated',
				required: false,
			},

			// STOP, PAUSE, RESUME, SCREENSHOT, GET STREAM URL
			{
				displayName: 'Instance ID',
				name: 'instanceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['stop', 'pause', 'resume', 'screenshot', 'getStreamUrl', 'runBashCommand', 'computerAction'],
					},
				},
				default: '',
				description: 'ID of the instance',
			},

			// RESUME INSTANCE
			{
				displayName: 'Timeout Hours',
				name: 'timeoutHours',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['resume'],
					},
				},
				default: 1,
				description: 'Timeout in hours before instance is automatically terminated',
				required: false,
			},

			// RUN BASH COMMAND
			{
				displayName: 'Command',
				name: 'command',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['runBashCommand'],
					},
				},
				default: '',
				description: 'Bash command to run',
			},
			{
				displayName: 'Restart Shell',
				name: 'restart',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['runBashCommand'],
					},
				},
				default: false,
				description: 'Whether to restart the shell',
			},

			// COMPUTER ACTION
			{
				displayName: 'Action',
				name: 'computerAction',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
					},
				},
				options: [
					{
						name: 'Key',
						value: 'key',
						description: 'Press a key or combination of keys',
					},
					{
						name: 'Type',
						value: 'type',
						description: 'Type text into the active window',
					},
					{
						name: 'Mouse Move',
						value: 'mouse_move',
						description: 'Move mouse cursor to specific coordinates',
					},
					{
						name: 'Left Click Drag',
						value: 'left_click_drag',
						description: 'Click and drag from current position to specified coordinates',
					},
					{
						name: 'Left Click',
						value: 'left_click',
						description: 'Perform a left mouse click at current position',
					},
					{
						name: 'Right Click',
						value: 'right_click',
						description: 'Perform a right mouse click at current position',
					},
					{
						name: 'Middle Click',
						value: 'middle_click',
						description: 'Perform a middle mouse click at current position',
					},
					{
						name: 'Double Click',
						value: 'double_click',
						description: 'Perform a double left click at current position',
					},
					{
						name: 'Screenshot',
						value: 'screenshot',
						description: 'Take a screenshot of the desktop',
					},
					{
						name: 'Cursor Position',
						value: 'cursor_position',
						description: 'Get current mouse cursor coordinates',
					},
					{
						name: 'Wait',
						value: 'wait',
						description: 'Wait for 3 seconds',
					},
					{
						name: 'Scroll',
						value: 'scroll',
						description: 'Scroll horizontally and/or vertically',
					},
				],
				default: 'left_click',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['key', 'type'],
					},
				},
				default: '',
				description: 'Text to type or key combination to press',
			},
			{
				displayName: 'Coordinates [x, y]',
				name: 'coordinates',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['mouse_move', 'left_click_drag', 'scroll'],
					},
				},
				options: [
					{
						displayName: 'Coordinate',
						name: 'coordinate',
						values: [
							{
								displayName: 'X',
								name: 'x',
								type: 'number',
								default: 0,
								description: 'X coordinate',
							},
							{
								displayName: 'Y',
								name: 'y',
								type: 'number',
								default: 0,
								description: 'Y coordinate',
							},
						],
					},
				],
				description: 'Coordinates for mouse actions',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		// Get credentials
		const credentials = await this.getCredentials('scrapybaraApi') as { apiKey: string };
		
		// Initialize Scrapybara client
		const client = new ScrapybaraClient({ apiKey: credentials.apiKey });

		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: IDataObject = {};

				// INSTANCE OPERATIONS
				if (resource === 'instance') {
					// START INSTANCE
					if (operation === 'start') {
						const instanceType = this.getNodeParameter('instanceType', i) as string;
						const timeoutHours = this.getNodeParameter('timeoutHours', i, 1) as number;
						
						let instance;
						if (instanceType === 'ubuntu') {
							instance = await client.startUbuntu({ timeoutHours });
						} else if (instanceType === 'browser') {
							instance = await client.startBrowser({ timeoutHours });
						} else if (instanceType === 'windows') {
							instance = await client.startWindows({ timeoutHours });
						}
						
						responseData = instance as unknown as IDataObject;
					}
					
					// STOP INSTANCE
					else if (operation === 'stop') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								await clientAny.instance(instanceId).stop();
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								await clientAny.instances[instanceId].stop();
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].stop === 'function') {
								await clientAny[instanceId].stop();
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = { success: true, instanceId };
						} catch (error) {
							throw new Error(`Falha ao parar instância ${instanceId}: ${error.message}`);
						}
					}
					
					// PAUSE INSTANCE
					else if (operation === 'pause') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								await clientAny.instance(instanceId).pause();
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								await clientAny.instances[instanceId].pause();
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].pause === 'function') {
								await clientAny[instanceId].pause();
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = { success: true, instanceId };
						} catch (error) {
							throw new Error(`Falha ao pausar instância ${instanceId}: ${error.message}`);
						}
					}
					
					// RESUME INSTANCE
					else if (operation === 'resume') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const timeoutHours = this.getNodeParameter('timeoutHours', i, 1) as number;
						try {
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								await clientAny.instance(instanceId).resume({ timeoutHours });
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								await clientAny.instances[instanceId].resume({ timeoutHours });
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].resume === 'function') {
								await clientAny[instanceId].resume({ timeoutHours });
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = { success: true, instanceId };
						} catch (error) {
							throw new Error(`Falha ao retomar instância ${instanceId}: ${error.message}`);
						}
					}
					
					// SCREENSHOT
					else if (operation === 'screenshot') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							let response;
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								response = await clientAny.instance(instanceId).screenshot();
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								response = await clientAny.instances[instanceId].screenshot();
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].screenshot === 'function') {
								response = await clientAny[instanceId].screenshot();
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = response as unknown as IDataObject;
						} catch (error) {
							throw new Error(`Falha ao capturar screenshot da instância ${instanceId}: ${error.message}`);
						}
					}
					
					// GET STREAM URL
					else if (operation === 'getStreamUrl') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							let response;
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								response = await clientAny.instance(instanceId).getStreamUrl();
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								response = await clientAny.instances[instanceId].getStreamUrl();
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].getStreamUrl === 'function') {
								response = await clientAny[instanceId].getStreamUrl();
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = response as unknown as IDataObject;
						} catch (error) {
							throw new Error(`Falha ao obter stream URL da instância ${instanceId}: ${error.message}`);
						}
					}
					
					// RUN BASH COMMAND
					else if (operation === 'runBashCommand') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const command = this.getNodeParameter('command', i) as string;
						const restart = this.getNodeParameter('restart', i, false) as boolean;
						
						try {
							let response;
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								response = await clientAny.instance(instanceId).bash({ command, restart });
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								response = await clientAny.instances[instanceId].bash({ command, restart });
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].bash === 'function') {
								response = await clientAny[instanceId].bash({ command, restart });
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = response as unknown as IDataObject;
						} catch (error) {
							throw new Error(`Falha ao executar comando bash na instância ${instanceId}: ${error.message}`);
						}
					}
					
					// COMPUTER ACTION
					else if (operation === 'computerAction') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const action = this.getNodeParameter('computerAction', i) as string;
						
						const payload: {
							action: string;
							text?: string;
							coordinate?: number[];
						} = { action };

						// Add text parameter if needed
						if (['key', 'type'].includes(action)) {
							payload.text = this.getNodeParameter('text', i) as string;
						}
						
						// Add coordinates if needed
						if (['mouse_move', 'left_click_drag', 'scroll'].includes(action)) {
							const coordinatesCollection = this.getNodeParameter('coordinates', i) as IDataObject;
							const coordinate = coordinatesCollection.coordinate as IDataObject;
							
							if (coordinate) {
								payload.coordinate = [
									coordinate.x as number,
									coordinate.y as number,
								];
							}
						}
						
						try {
							let response;
							// Tenta diferentes abordagens para acessar e manipular a instância
							const clientAny = client as any;
							
							// Abordagem 1: Tenta usar método instance() se existir
							if (typeof clientAny.instance === 'function') {
								response = await clientAny.instance(instanceId).computer(payload);
							}
							// Abordagem 2: Tenta acessar map de instances
							else if (clientAny.instances && clientAny.instances[instanceId]) {
								response = await clientAny.instances[instanceId].computer(payload);
							}
							// Abordagem 3: Tenta acessar diretamente via indexador
							else if (clientAny[instanceId] && typeof clientAny[instanceId].computer === 'function') {
								response = await clientAny[instanceId].computer(payload);
							}
							// Nenhuma abordagem funcionou
							else {
								throw new Error(`Não foi possível encontrar ou manipular a instância ${instanceId}`);
							}
							responseData = response as unknown as IDataObject;
						} catch (error) {
							throw new Error(`Falha ao executar ação de computador na instância ${instanceId}: ${error.message}`);
						}
					}
				}

				// Add the response data to the result
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ ...responseData }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 