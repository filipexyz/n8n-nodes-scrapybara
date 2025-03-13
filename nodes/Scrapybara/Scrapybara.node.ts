import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

import { ScrapybaraClient, UbuntuInstance } from 'scrapybara';
import { BashRequest } from 'scrapybara/api/resources/instance';

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
						name: 'List Instances',
						value: 'listInstances',
						description: 'List all instances',
						action: 'List all instances',
					},
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
						name: 'Mouse Click',
						value: 'mouse_click',
						description: 'Click at current position',
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
						description: 'Wait for n seconds',
					},
					{
						name: 'Scroll',
						value: 'scroll',
						description: 'Scroll horizontally and/or vertically',
					},
				],
				default: 'key',
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
						computerAction: ['type'],
					},
				},
				default: '',
				description: 'Text to type or key combination to press',
			},
			{
				displayName: 'Keys',
				name: 'keys',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['key'],
					},
				},
				default: '',
				description: 'Keys to press (separated by commas)',
			},
			{
				displayName: 'Button',
				name: 'button',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['mouse_click'],
					},
				},
				options: [
					{
						name: 'Left',
						value: 'left',
						description: 'Left mouse button',
					},
					{
						name: 'Right',
						value: 'right',
						description: 'Right mouse button',
					},
					{
						name: 'Middle',
						value: 'middle',
						description: 'Middle mouse button',
					},
					{
						name: 'Back',
						value: 'back',
						description: 'Back mouse button',
					},
					{
						name: 'Forward',
						value: 'forward',
						description: 'Forward mouse button',
					},
				],
				default: 'left',
			},
			{
				displayName: 'Number of Clicks',
				name: 'numClicks',
				type: 'number',
				default: 1,
				required: false,
				description: 'Number of clicks to perform',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['mouse_click'],
					},
				},
			},
			{
				displayName: 'Hold Keys',
				name: 'holdKeys',
				type: 'string',
				default: '',
				required: false,
				description: 'Keys to hold down while performing the action (separated by commas)',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['mouse_click', 'type', 'mouse_move', 'scroll'],
					},
				},
			},
			{
				displayName: 'Coordinates [x, y]',
				name: 'coordinates',
				type: 'fixedCollection',
				required: true,
				default: {
					'x': 0,
					'y': 0,
				},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['mouse_move', 'mouse_click', 'scroll'],
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

			{
				displayName: 'Delta X',
				name: 'deltaX',
				type: 'number',
				required: false,
				default: 0,
				description: 'Delta X',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['scroll'],
					},
				},
			},
			{
				displayName: 'Delta Y',
				name: 'deltaY',
				type: 'number',
				required: false,
				default: 0,
				description: 'Delta Y',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['computerAction'],
						computerAction: ['scroll'],
					},
				},
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


					// LIST INSTANCES
					if (operation === 'listInstances') {
						const instances = await client.getInstances();
						responseData = { success: true, instances };
					}

					// START INSTANCE
					else if (operation === 'start') {
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
							const instance = await client.get(instanceId)
							await instance.stop();
							responseData = { success: true, instanceId };
						} catch (error) {
							throw new Error(`Failed to stop instance ${instanceId}: ${error.message}`);
						}
					}
					
					// PAUSE INSTANCE
					else if (operation === 'pause') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							const instance = await client.get(instanceId)
							await instance.pause();
							responseData = { success: true, instanceId };
						} catch (error) {
							throw new Error(`Failed to pause instance ${instanceId}: ${error.message}`);
						}
					}
					
					// RESUME INSTANCE
					else if (operation === 'resume') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const timeoutHours = this.getNodeParameter('timeoutHours', i, 1) as number;
						try {
							const instance = await client.get(instanceId)
							await instance.resume({ timeoutHours });
							responseData = { success: true, instanceId };
						} catch (error) {
							throw new Error(`Failed to resume instance ${instanceId}: ${error.message}`);
						}
					}
					
					// SCREENSHOT
					else if (operation === 'screenshot') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							const instance = await client.get(instanceId)
							const screenshot = await instance.screenshot();
							responseData = { success: true, instanceId, screenshot };
						} catch (error) {
							throw new Error(`Failed to capture screenshot of instance ${instanceId}: ${error.message}`);
						}
					}
					
					// GET STREAM URL
					else if (operation === 'getStreamUrl') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						try {
							const instance = await client.get(instanceId)
							const streamUrl = await instance.getStreamUrl();
							responseData = { success: true, instanceId, streamUrl };
						} catch (error) {
							throw new Error(`Failed to get stream URL of instance ${instanceId}: ${error.message}`);
						}
					}

					// RUN BASH COMMAND
					else if (operation === 'runBashCommand') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const command = this.getNodeParameter('command', i) as string;
						const restart = this.getNodeParameter('restart', i, false) as boolean;

						try {
							const instance = await client.get(instanceId) as UbuntuInstance;
							const bashRequest: BashRequest = {
								command,
								restart,
							};
							const result = await instance.bash(bashRequest);
							responseData = { success: !result.error, instanceId, result };
						} catch (error) {
							throw new Error(`Failed to run bash command on instance ${instanceId}: ${error.message}`);
						}
					}

					// COMPUTER ACTION
					else if (operation === 'computerAction') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const action = this.getNodeParameter('computerAction', i) as any;

						try {
							const instance = await client.get(instanceId);

							if (action === 'mouse_move') {
								// coordinates: [x, y] coordinates to move to (required)
								// hold_keys: List of modifier keys to hold during the action (optional, defaults to [])

								const coordinatesData = this.getNodeParameter('coordinates', i) as IDataObject;
								console.log(coordinatesData);
								const coordinates = [Number(coordinatesData['x']), Number(coordinatesData['y'])];
								const holdKeys = this.getNodeParameter('holdKeys', i) as string;


								const result = await instance.computer({
									action: 'move_mouse',
									coordinates,
									holdKeys: holdKeys ? holdKeys.split(',') : undefined,
								});
								responseData = { success: !result.error, instanceId, result };
							}
							else if (action === 'mouse_click') {
								// button: Mouse button to click (“left”, “right”, “middle”, “back”, “forward”) (required)
								// click_type: Type of click action (“down”, “up”, “click”) (optional, defaults to “click”)
								// coordinates: [x, y] coordinates to click at (optional)
								// num_clicks: Number of clicks (optional, defaults to 1)
								// hold_keys: List of modifier keys to hold during the action (optional, defaults to [])

								const button = this.getNodeParameter('button', i) as any;
								const coordinatesData = this.getNodeParameter('coordinates', i) as any;
								const coordinates = [Number(coordinatesData['coordinate']['x']), Number(coordinatesData['coordinate']['y'])];
								const numClicks = this.getNodeParameter('numClicks', i) as number;
								const holdKeys = this.getNodeParameter('holdKeys', i) as any;

								const result = await instance.computer({
									action: 'click_mouse',
									button,
									coordinates,
									numClicks,
									holdKeys: holdKeys ? holdKeys.split(',') : undefined,
								});
								responseData = { success: !result.error, instanceId, result };
							}
							// scroll
							else if (action === 'scroll') {
								// coordinates: [x, y] coordinates to scroll at (required)
								// delta_x: Horizontal scroll amount (optional, defaults to 0)
								// delta_y: Vertical scroll amount (optional, defaults to 0)
								// hold_keys: List of modifier keys to hold during the action (optional, defaults to [])

								const coordinatesData = this.getNodeParameter('coordinates', i) as IDataObject;
								const coordinates = [Number(coordinatesData['x']), Number(coordinatesData['y'])];
								const deltaX = this.getNodeParameter('deltaX', i) as number;
								const deltaY = this.getNodeParameter('deltaY', i) as number;
								const holdKeys = this.getNodeParameter('holdKeys', i) as any;

								const result = await instance.computer({
									action: 'scroll',
									coordinates,
									deltaX,
									deltaY,
									holdKeys: holdKeys ? holdKeys.split(',') : undefined,
								});
								responseData = { success: !result.error, instanceId, result };
							}
							// key
							else if (action === 'key') {
								// keys: List of keys to press (required)
								// duration: Time to hold keys in seconds (optional)

								const keys = this.getNodeParameter('keys', i) as string;
								const duration = this.getNodeParameter('duration', i) as number;

								const result = await instance.computer({
									action: 'press_key',
									keys: keys.split(','),
									duration,
								});
								responseData = { success: !result.error, instanceId, result };
							}
							// type
							else if (action === 'type') {
								// text: Text to type (required)
								// hold_keys: List of modifier keys to hold while typing (optional)

								const text = this.getNodeParameter('text', i) as string;
								const holdKeys = this.getNodeParameter('holdKeys', i) as string;

								const result = await instance.computer({
									action: 'type_text',
									text,
									holdKeys: holdKeys ? holdKeys.split(',') : undefined,
								});
								responseData = { success: !result.error, instanceId, result };
							}
							// wait
							else if (action === 'wait') {
								// duration: Time to wait in seconds (required)

								const duration = this.getNodeParameter('duration', i) as number;

								const result = await instance.computer({
									action: 'wait',
									duration,
								});
								responseData = { success: !result.error, instanceId, result };
							}
							// cursor_position
							else if (action === 'cursor_position') {
								// get current mouse cursor coordinates
								const result = await instance.computer({
									action: 'get_cursor_position',
								});
								responseData = { success: !result.error, instanceId, result };
							}
							// screenshot
							else if (action === 'screenshot') {
								const result = await instance.computer({
									action: 'take_screenshot',
								});
								responseData = { success: !result.error, instanceId, result };
							}
						} catch (error) {
							throw new Error(`Failed to perform computer action on instance ${instanceId}: ${error.message}`);
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