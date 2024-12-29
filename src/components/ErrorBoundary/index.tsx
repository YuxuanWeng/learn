import React, { ErrorInfo, ReactNode } from 'react';

interface IProps extends React.PropsWithChildren {
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallbackRender?: (error: Error) => ReactNode;
}

interface IState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.error && this.props.fallbackRender) {
      return this.props.fallbackRender(this.state.error);
    }

    return this.props.children;
  }
}
