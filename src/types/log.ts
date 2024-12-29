export type LogFlow<T = string> = {
  flowName: string;
  flowPhase: LogFlowPhase;
  flowData?: T;
  flowDuration?: number;
};

export enum LogFlowPhase {
  Enter = 1,
  Submit = 2,
  Success = 3
}
