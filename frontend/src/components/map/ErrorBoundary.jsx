import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Mapa com erro:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center p-4">Erro ao carregar o mapa. Tente novamente.</div>;
    }

    return this.props.children;
  }
}
