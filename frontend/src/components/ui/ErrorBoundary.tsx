import React, { Component, ErrorInfo, ReactNode } from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RECONCILE.AI Error Boundary Caught Exception]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    localStorage.removeItem('reconcile_token');
    localStorage.removeItem('reconcile_user');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center p-6 font-['Geist']">
          <div className="w-full max-w-2xl bg-[#1c1b1b] border border-[#ffb4ab]/30 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col gap-6 text-center sm:text-left">
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#93000a]/30 border border-[#ffb4ab]/40 flex items-center justify-center text-[#ffb4ab]">
                <MaterialIcon name="error" size={28} />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#2a2a2a] text-[#c4c7c8] text-xs font-mono tracking-wider uppercase border border-[#353534]">
                HTTP 500 • RUNTIME FAULT ENCLAVE
              </span>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white font-['Libre_Caslon_Text']">
                System Exception Encountered
              </h1>
              <p className="text-sm text-[#8e9192] leading-relaxed">
                An unexpected runtime error halted rendering in the active reconciliation pipeline. The system memory state has been safely isolated.
              </p>
            </div>

            {/* Diagnostic Details */}
            {this.state.error && (
              <div className="p-4 rounded-xl bg-[#131313] border border-[#2a2a2a] text-left overflow-x-auto text-xs font-mono text-[#ffb4ab]/90">
                <span className="font-bold text-white block mb-1">Stack Trace Diagnostic:</span>
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MaterialIcon name="refresh" size={16} />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c4c7c8] hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-[#2a2a2a] flex items-center justify-center gap-2"
              >
                <MaterialIcon name="home" size={16} />
                <span>Reset Mesh & Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
