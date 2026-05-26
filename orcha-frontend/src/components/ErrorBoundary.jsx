import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#FEF2F2', minHeight: '100vh' }}>
          <h2 style={{ color: '#991B1B', marginBottom: 16 }}>App Error</h2>
          <pre style={{ background: '#fff', border: '1px solid #FCA5A5', borderRadius: 8, padding: 16, fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
