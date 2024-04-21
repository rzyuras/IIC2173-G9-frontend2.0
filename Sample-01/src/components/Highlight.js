import React, { Component } from "react";
import PropTypes from "prop-types";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

// Import the language module statically
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

const registeredLanguages = {};

class Highlight extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: true, error: null }; // Since we're not dynamically importing anymore, we set loaded to true
    this.codeNode = React.createRef();
  }

  // Remove the componentDidMount method since we don't need dynamic import anymore

  highlight = () => {
    if (this.codeNode.current) {
      hljs.highlightElement(this.codeNode.current);
    }
  };

  render() {
    const { language, children } = this.props;

    // Remove the loaded and error state handling since we're not dynamically importing anymore

    return (
      <pre className="rounded">
        <code ref={this.codeNode} className={language}>
          {children}
        </code>
      </pre>
    );
  }
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string,
};

Highlight.defaultProps = {
  language: "json", // Default language set to 'json'
};

export default Highlight;

