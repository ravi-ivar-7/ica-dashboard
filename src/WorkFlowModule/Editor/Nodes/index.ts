// Central Node Registries
import { NodeTemplate, WorkflowNode, ExecutionContext, ExecutionResult } from '@/WorkFlowModule/Types/workflow';

// Import Input Templates
import { textInputTemplate } from './Input/TextInput/Template';
import { imageInputTemplate } from './Input/ImageInput/Template';
import { videoInputTemplate } from './Input/VideoInput/Template';
import { audioInputTemplate } from './Input/AudioInput/Template';
import { httpsRequestTemplate } from './Input/HttpsRequest/Template';
import { fileInputTemplate } from './Input/FileInput/Template';

// Import Generation Templates
import { imageGenerationTemplate } from './Generation/ImageGeneration/Template';
import { videoGenerationTemplate } from './Generation/VideoGeneration/Template';
import { textGenerationTemplate } from './Generation/TextGeneration/Template';
import { speechToTextTemplate } from './Generation/SpeechToText/Template';
import { textToSpeechTemplate } from './Generation/TextToSpeech/Template';
import { codeGenerationTemplate } from './Generation/CodeGeneration/Template';
import { audioEnhancementTemplate } from './Generation/AudioEnhancement/Template';

// Import Utility Templates
import { delayTemplate } from './Utility/Delay/Template';
import { mergeTemplate } from './Utility/Merge/Template';
import { splitTemplate } from './Utility/Split/Template';
import { formatterTemplate } from './Utility/Formatter/Template';
import { loggerTemplate } from './Utility/Logger/Template';
import { timerTemplate } from './Utility/Timer/Template';
import { counterTemplate } from './Utility/Counter/Template';
import { jsonParserTemplate } from './Utility/JSONParser/Template';

// Import Logic Templates
import { conditionTemplate } from './Logic/Condition/Template';
import { switchTemplate } from './Logic/Switch/Template';
import { branchTemplate } from './Logic/Branch/Template';
import { errorCatcherTemplate } from './Logic/ErrorCatcher/Template';
import { variableSetterTemplate } from './Logic/VariableSetter/Template';
import { loopTemplate } from './Logic/Loop/Template';
import { mapTemplate } from './Logic/Map/Template';
import { filterTemplate } from './Logic/Filter/Template';

// Import Output Templates
import { saveFileTemplate } from './Output/SaveFile/Template';
import { exportTemplate } from './Output/Export/Template';
import { webhookTemplate } from './Output/Webhook/Template';
import { notificationTemplate } from './Output/Notification/Template';
import { dashboardViewTemplate } from './Output/DashboardView/Template';

// Import External Templates
import { agentExecutorTemplate } from './External/AgentExecutor/Template';
import { modelSelectorTemplate } from './External/ModelSelector/Template';
import { apiConnectorTemplate } from './External/APIConnector/Template';
import { langChainExecutorTemplate } from './External/LangChainExecutor/Template';

// Import Input Executors
import { executeTextInput } from './Input/TextInput/Executor';
import { executeImageInput } from './Input/ImageInput/Executor';
import { executeVideoInput } from './Input/VideoInput/Executor';
import { executeAudioInput } from './Input/AudioInput/Executor';
import { executeHttpsRequest } from './Input/HttpsRequest/Executor';
import { executeFileInput } from './Input/FileInput/Executor';

// Import Generation Executors
import { executeImageGeneration } from './Generation/ImageGeneration/Executor';
import { executeVideoGeneration } from './Generation/VideoGeneration/Executor';
import { executeTextGeneration } from './Generation/TextGeneration/Executor';
import { executeSpeechToText } from './Generation/SpeechToText/Executor';
import { executeTextToSpeech } from './Generation/TextToSpeech/Executor';
import { executeCodeGeneration } from './Generation/CodeGeneration/Executor';
import { executeAudioEnhancement } from './Generation/AudioEnhancement/Executor';

// Import Utility Executors
import { executeDelay } from './Utility/Delay/Executor';
import { executeMerge } from './Utility/Merge/Executor';
import { executeSplit } from './Utility/Split/Executor';
import { executeFormatter } from './Utility/Formatter/Executor';
import { executeLogger } from './Utility/Logger/Executor';
import { executeTimer } from './Utility/Timer/Executor';
import { executeCounter } from './Utility/Counter/Executor';
import { executeJSONParser } from './Utility/JSONParser/Executor';

// Import Logic Executors
import { executeCondition } from './Logic/Condition/Executor';
import { executeSwitch } from './Logic/Switch/Executor';
import { executeBranch } from './Logic/Branch/Executor';
import { executeErrorCatcher } from './Logic/ErrorCatcher/Executor';
import { executeVariableSetter } from './Logic/VariableSetter/Executor';
import { executeLoop } from './Logic/Loop/Executor';
import { executeMap } from './Logic/Map/Executor';
import { executeFilter } from './Logic/Filter/Executor';

// Import Output Executors
import { executeSaveFile } from './Output/SaveFile/Executor';
import { executeExport } from './Output/Export/Executor';
import { executeWebhook } from './Output/Webhook/Executor';
import { executeNotification } from './Output/Notification/Executor';
import { executeDashboardView } from './Output/DashboardView/Executor';

// Import External Executors
import { executeAgentExecutor } from './External/AgentExecutor/Executor';
import { executeModelSelector } from './External/ModelSelector/Executor';
import { executeAPIConnector } from './External/APIConnector/Executor';
import { executeLangChainExecutor } from './External/LangChainExecutor/Executor';

// Import Input Node UIs
import TextInputNode from './Input/TextInput/NodeUI';
import ImageInputNode from './Input/ImageInput/NodeUI';
import VideoInputNode from './Input/VideoInput/NodeUI';
import AudioInputNode from './Input/AudioInput/NodeUI';
import HttpsRequestNode from './Input/HttpsRequest/NodeUI';
import FileInputNode from './Input/FileInput/NodeUI';

// Import Generation Node UIs
import ImageGenerationNode from './Generation/ImageGeneration/NodeUI';
import VideoGenerationNode from './Generation/VideoGeneration/NodeUI';
import TextGenerationNode from './Generation/TextGeneration/NodeUI';
import SpeechToTextNode from './Generation/SpeechToText/NodeUI';
import TextToSpeechNode from './Generation/TextToSpeech/NodeUI';
import CodeGenerationNode from './Generation/CodeGeneration/NodeUI';
import AudioEnhancementNode from './Generation/AudioEnhancement/NodeUI';

// Import Utility Node UIs
import DelayNode from './Utility/Delay/NodeUI';
import MergeNode from './Utility/Merge/NodeUI';
import SplitNode from './Utility/Split/NodeUI';
import FormatterNode from './Utility/Formatter/NodeUI';
import LoggerNode from './Utility/Logger/NodeUI';
import TimerNode from './Utility/Timer/NodeUI';
import CounterNode from './Utility/Counter/NodeUI';
import JSONParserNode from './Utility/JSONParser/NodeUI';

// Import Logic Node UIs
import ConditionNode from './Logic/Condition/NodeUI';
import SwitchNode from './Logic/Switch/NodeUI';
import BranchNode from './Logic/Branch/NodeUI';
import ErrorCatcherNode from './Logic/ErrorCatcher/NodeUI';
import VariableSetterNode from './Logic/VariableSetter/NodeUI';
import LoopNode from './Logic/Loop/NodeUI';
import MapNode from './Logic/Map/NodeUI';
import FilterNode from './Logic/Filter/NodeUI';

// Import Output Node UIs
import SaveFileNode from './Output/SaveFile/NodeUI';
import ExportNode from './Output/Export/NodeUI';
import WebhookNode from './Output/Webhook/NodeUI';
import NotificationNode from './Output/Notification/NodeUI';
import DashboardViewNode from './Output/DashboardView/NodeUI';

// Import External Node UIs
import AgentExecutorNode from './External/AgentExecutor/NodeUI';
import ModelSelectorNode from './External/ModelSelector/NodeUI';
import APIConnectorNode from './External/APIConnector/NodeUI';
import LangChainExecutorNode from './External/LangChainExecutor/NodeUI';

// Node Templates Registry
export const NodeTemplates: Record<string, NodeTemplate> = {
  // Input Nodes
  'text-input': textInputTemplate,
  'image-input': imageInputTemplate,
  'video-input': videoInputTemplate,
  'audio-input': audioInputTemplate,
  'https-request': httpsRequestTemplate,
  'file-input': fileInputTemplate,
  
  // Generation Nodes
  'image-generation': imageGenerationTemplate,
  'video-generation': videoGenerationTemplate,
  'text-generation': textGenerationTemplate,
  'speech-to-text': speechToTextTemplate,
  'text-to-speech': textToSpeechTemplate,
  'code-generation': codeGenerationTemplate,
  'audio-enhancement': audioEnhancementTemplate,
  
  // Utility Nodes
  'delay': delayTemplate,
  'merge': mergeTemplate,
  'split': splitTemplate,
  'formatter': formatterTemplate,
  'logger': loggerTemplate,
  'timer': timerTemplate,
  'counter': counterTemplate,
  'json-parser': jsonParserTemplate,
  
  // Logic Nodes
  'condition': conditionTemplate,
  'switch': switchTemplate,
  'branch': branchTemplate,
  'error-catcher': errorCatcherTemplate,
  'variable-setter': variableSetterTemplate,
  'loop': loopTemplate,
  'map': mapTemplate,
  'filter': filterTemplate,
  
  // Output Nodes
  'save-file': saveFileTemplate,
  'export': exportTemplate,
  'webhook': webhookTemplate,
  'notification': notificationTemplate,
  'dashboard-view': dashboardViewTemplate,
  
  // External Nodes
  'agent-executor': agentExecutorTemplate,
  'model-selector': modelSelectorTemplate,
  'api-connector': apiConnectorTemplate,
  'langchain-executor': langChainExecutorTemplate,
};

// Node Executors Registry
export const NodeExecutors: Record<string, (node: WorkflowNode, context: ExecutionContext) => Promise<ExecutionResult>> = {
  // Input Nodes
  'text-input': executeTextInput,
  'image-input': executeImageInput,
  'video-input': executeVideoInput,
  'audio-input': executeAudioInput,
  'https-request': executeHttpsRequest,
  'file-input': executeFileInput,
  
  // Generation Nodes
  'image-generation': executeImageGeneration,
  'video-generation': executeVideoGeneration,
  'text-generation': executeTextGeneration,
  'speech-to-text': executeSpeechToText,
  'text-to-speech': executeTextToSpeech,
  'code-generation': executeCodeGeneration,
  'audio-enhancement': executeAudioEnhancement,
  
  // Utility Nodes
  'delay': executeDelay,
  'merge': executeMerge,
  'split': executeSplit,
  'formatter': executeFormatter,
  'logger': executeLogger,
  'timer': executeTimer,
  'counter': executeCounter,
  'json-parser': executeJSONParser,
  
  // Logic Nodes
  'condition': executeCondition,
  'switch': executeSwitch,
  'branch': executeBranch,
  'error-catcher': executeErrorCatcher,
  'variable-setter': executeVariableSetter,
  'loop': executeLoop,
  'map': executeMap,
  'filter': executeFilter,
  
  // Output Nodes
  'save-file': executeSaveFile,
  'export': executeExport,
  'webhook': executeWebhook,
  'notification': executeNotification,
  'dashboard-view': executeDashboardView,
  
  // External Nodes
  'agent-executor': executeAgentExecutor,
  'model-selector': executeModelSelector,
  'api-connector': executeAPIConnector,
  'langchain-executor': executeLangChainExecutor,
};

// Node UIs Registry
export const NodeUIs: Record<string, React.ComponentType<any>> = {
  // Input Nodes
  'text-input': TextInputNode,
  'image-input': ImageInputNode,
  'video-input': VideoInputNode,
  'audio-input': AudioInputNode,
  'https-request': HttpsRequestNode,
  'file-input': FileInputNode,
  
  // Generation Nodes
  'image-generation': ImageGenerationNode,
  'video-generation': VideoGenerationNode,
  'text-generation': TextGenerationNode,
  'speech-to-text': SpeechToTextNode,
  'text-to-speech': TextToSpeechNode,
  'code-generation': CodeGenerationNode,
  'audio-enhancement': AudioEnhancementNode,
  
  // Utility Nodes
  'delay': DelayNode,
  'merge': MergeNode,
  'split': SplitNode,
  'formatter': FormatterNode,
  'logger': LoggerNode,
  'timer': TimerNode,
  'counter': CounterNode,
  'json-parser': JSONParserNode,
  
  // Logic Nodes
  'condition': ConditionNode,
  'switch': SwitchNode,
  'branch': BranchNode,
  'error-catcher': ErrorCatcherNode,
  'variable-setter': VariableSetterNode,
  'loop': LoopNode,
  'map': MapNode,
  'filter': FilterNode,
  
  // Output Nodes
  'save-file': SaveFileNode,
  'export': ExportNode,
  'webhook': WebhookNode,
  'notification': NotificationNode,
  'dashboard-view': DashboardViewNode,
  
  // External Nodes
  'agent-executor': AgentExecutorNode,
  'model-selector': ModelSelectorNode,
  'api-connector': APIConnectorNode,
  'langchain-executor': LangChainExecutorNode,
};

// Helper functions
export function getNodeTemplate(type: string): NodeTemplate | undefined {
  return NodeTemplates[type];
}

export function getNodeExecutor(type: string) {
  return NodeExecutors[type];
}

export function getNodeUI(type: string) {
  return NodeUIs[type];
}

export function getAllNodeTemplates(): NodeTemplate[] {
  return Object.values(NodeTemplates);
}

export function getNodeTemplatesByCategory(category: string): NodeTemplate[] {
  return Object.values(NodeTemplates).filter(template => template.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(Object.values(NodeTemplates).map(template => template.category))];
}

// Export all templates for backward compatibility
export const NODE_TEMPLATES = Object.values(NodeTemplates);

