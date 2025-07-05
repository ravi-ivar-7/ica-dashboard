export interface JSONParserConfig {
  parse_mode: string;
  path: string;
  default_value: any;
}

export interface JSONParserInputs {
  json_string: string;
}

export interface JSONParserOutputs {
  parsed: any;
  is_valid: boolean;
  error_message?: string;
}

