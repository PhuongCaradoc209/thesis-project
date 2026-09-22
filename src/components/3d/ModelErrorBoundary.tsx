import { Component, type ErrorInfo, type ReactNode } from 'react';

type ModelErrorBoundaryProps = {
  children: ReactNode;
  fallback: (error: Error, retry: () => void) => ReactNode;
  resetKey: string | number;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
};

type ModelErrorBoundaryState = {
  error: Error | null;
};

export class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ModelErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(previousProps: ModelErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  private retry = () => {
    this.props.onRetry?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.retry);
    }

    return this.props.children;
  }
}
