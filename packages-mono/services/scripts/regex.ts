export const enumBeginRegex = /^enum ([\dA-Za-z]+?)(Enum)?\s*{$/;
export const enumFieldRegex = /^\s*(\w+)\s*=\s*(-?\d+);((\s*)(\/\/)(.*))?$/;

// 结构体名称需要兼容数字——BridgeInstRecordV2Struct
export const messageBeginRegex = /^message ([\dA-Za-z]+)\s*{((\s*)(\/\/)(.*))?$/;
export const messageFieldRegex =
  /^\s+(optional\s*|repeated\s*)?(\w+|map<(\w+)\s*,\s*(\w+)>)\s+(\w+)\s*?=\s*?(\d+)\s*?(\[\s*?(deprecated)\s*?=\s*?(true|false)\s*?])?;((\s*)(\/\/)(.*))?$/;

export const apiModuleRegex = /(?<=.*bds_api\/)([^/]+)\/.*/;
export const apiBaseAuthModuleRegex = /(?<=.*base\/auth_api\/).*/;
export const apiCrmModuleRegex = /(?<=.*crm\/api\/)([^/]+)\/.*/;
export const apiLocalServerModuleRegex = /(?<=.*local_server_).*/;
export const apiDescRegex = /(?<=@api.desc:\s*).*/;
export const apiMethodRegex = /(?<=@api.http_method:\s*).*/;
export const apiUrlRegex = /(?<=@api.url:\s*).*/;
export const apiDeprecated = /(?<=@deprecated:\s*).*/;

export const apiMessageBeginRegex = /(?<=message .+_api_).*(?=_(request|response)\s?{)/;
export const apiMessageBeginSimpleRegex = /(?<=message .*).*(?=_(request|response)\s?{)/;

export const getApiNameRegex = (module: string) =>
  `(?<=message bdm_bds_.+_api_)[^(${module})].*(?=_(request|response)\\s?\\{)|(?<=message bdm_bds_.+_api_${module}_).*(?=_(request|response)\\s?\\{)|(?<=message bdm_base_auth_api_).*(?=_(request|response)\\s?\\{)|(?<=message bdm_crm_api_)${module}_.*(?=_(request|response)\\s?\\{)`;

export const endRegex = /^}$/;
