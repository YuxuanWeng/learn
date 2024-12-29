import { ChatScriptOptions } from '@fepkg/business/constants/options';

export const defaultChatScriptConfig = ChatScriptOptions.map(v => ({ chat_script: '', operation_type: v.value }));
