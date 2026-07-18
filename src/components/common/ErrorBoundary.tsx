import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-brand-black p-6 text-brand-ink">
          <section className="page-card mx-auto max-w-xl p-6" role="alert">
            <h1 className="font-display text-3xl">Something went sideways.</h1>
            <p className="mt-4 text-lg">
              Refresh the page. If this keeps happening, use the host recovery controls or paper backup.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
