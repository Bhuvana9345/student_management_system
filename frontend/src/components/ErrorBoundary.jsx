import React from 'react';

export default class ErrorBoundary extends React.Component {
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
        <div className="login-page">
          <div className="panel error-panel">
            <h2>Page loading issue</h2>
            <p className="text-muted">{this.state.error.message}</p>
            <button className="btn btn-primary" onClick={() => {
              localStorage.clear();
              window.location.href = '/login/admin';
            }}>Open Login Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
