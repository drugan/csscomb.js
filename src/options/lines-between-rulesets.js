'use strict';

let gonzales = require('gonzales-pe');

let option = {
  newLinesString: '',
  newLinesNode: null,
  valueNestedRuleset: 0,
  valueNestedAtrule: 0,
  hasNestedRuleset: false,
  hasNestedAtrule: false,

  /**
   * Option's name as it's used in config.
   * @type {String}
   */
  get name() {
    return 'lines-between-rulesets';
  },

  /**
   * Name of option that must run after this option.
   * @type {String}
   */
  get runBefore() {
    return 'block-indent';
  },

  /**
   * List of syntaxes that are supported by this option.
   * @type {Array}
   */
  get syntax() {
    return ['css', 'less', 'sass', 'scss'];
  },

  /**
   * Types of values this option accepts in config.
   * @type {Object}
   */
  get accepts() {
    return {
      number: true
    };
  },

  /**
   * @param {number} value
   * @returns {number}
   */
  /*
  ** Still need to override, as the core implementation of setValue doesn't
  ** pass numbers through, but creates a string of spaces of the same length.
  */
  setValue(value) {

    if (typeof value[0] === 'number') {

      if (typeof value[1] === 'number') {
        this.valueNestedRuleset = value[1];
        if (typeof value[2] === 'number') {
          this.valueNestedAtrule = value[2];
        }
      }
      value = value[0];
    }
    if (typeof value !== 'number') {
      throw new Error('Value must be a number.');
    }

    return value;
  },

  buildSpacing(syntax, value) {
    let spacing = '';
    let numNewLines = 0;
    let newLinesOffset = 1;

    if (syntax === 'sass') {
      newLinesOffset = 0;
    }

    numNewLines = Math.round(value) + newLinesOffset;

    for (var i = 0; i < numNewLines; i++) {
      spacing += '\n';
    }

    return spacing;
  },

  /**
   * Processes ast and fixes found code style errors.
   * @param {Node} ast
   */
  process(ast) {
    this.newLinesString = this.buildSpacing(ast.syntax, this.value);
    this.nestedRulesetNewLinesString = this.buildSpacing(ast.syntax, this.valueNestedRuleset);
    this.nestedAtruleNewLinesString = this.buildSpacing(ast.syntax, this.valueNestedAtrule);
    this.newLinesNode = gonzales.createNode({
      type: 'space',
      content: this.newLinesString
    });
    this.processBlock(ast);
  },

  processBlock(x) {
  this.hasNestedRuleset = false;
  this.hasNestedAtrule = false;

    if (x.is('stylesheet')) {
      // Check all @rules
      this.processAtRules(x);

      // Check all rulesets
      this.processRuleSets(x);
    }


    x.forEach((node, index) => {

      if (!node.is('block')) {
        return this.processBlock(node);
      }
    node.forEach(anode => {

      if (anode.type === 'ruleset') {
        this.hasNestedRuleset = true;
        return;
      }
      else if (anode.type === 'atrule') {
        this.hasNestedAtrule = true;
        return;
      }
    });

      // Check all @rules
      this.processAtRules(node, index);

      // Check all rulesets
      this.processRuleSets(node, index);

      this.processBlock(node);
    });
  },

  processAtRules(node) {
    node.forEach('atrule', (atRuleNode, index) => {
      this.insertNewlines(node, index, 'atrule');
    });
  },

  processRuleSets(node) {
    node.forEach('ruleset', (ruleSetNode, index) => {
      this.insertNewlines(node, index, 'ruleset');
    });
  },

  isComment(node) {
    if (!node) {
      return false;
    }
    return node.is('singlelineComment') || node.is('multilineComment');
  },

  isNewline(node) {
    if (!node) {
      return false;
    }
    return node.content === '\n';
  },

  prevLineIsComment(parent, index) {
    let indexThreshold = 2;
    let prevChild;
    let prevMinusOneChild;
    let prevMinusTwoChild;
    let parentSyntax = parent ? parent.syntax : null;

    // Sass is troublesome because newlines are counted as separate nodes
    if (parentSyntax === 'sass') {
      indexThreshold = 3;
    }

    if (!parent || index < indexThreshold) {
      return false;
    }

    prevChild = parent.get(index - 1);
    prevMinusOneChild = parent.get(index - 2);

    if (parentSyntax === 'sass') {
      prevMinusTwoChild = parent.get(index - 3);
      return this.isComment(prevMinusTwoChild) && this.isNewline(prevMinusOneChild) && prevChild.is('space');
    }

    return this.isComment(prevMinusOneChild) && prevChild.is('space');
  },

  /*
  ** Find the latest previous child that isn't a comment, and return its index.
  */
  findLatestNonCommentNode(parent, index) {
    let prevChild;
    let lastNonCommentIndex = -1;
    let currentIndex = index;
    let jumpSize = 2;

    if (parent.syntax === 'sass') {
      jumpSize = 3;
    }

    while (currentIndex >= 0) {
      if (this.prevLineIsComment(parent, currentIndex)) {
        currentIndex -= jumpSize;
        continue;
      }

      prevChild = parent.get(currentIndex - 1);

      if (!this.isComment(prevChild)) {
        lastNonCommentIndex = currentIndex - 1;
        break;
      }

      currentIndex--;
    }

    return lastNonCommentIndex;
  },

  insertNewlinesAsString(node, rule) {
    let content = node.content;
    let lastNewline = content.lastIndexOf('\n');
    let newContent;
    let newLinesString = this.newLinesString;

    if (this.hasNestedRuleset && rule === 'ruleset') {
      newLinesString = this.nestedRulesetNewLinesString;
    } else if (this.hasNestedAtrule && rule === 'atrule') {
      newLinesString = this.nestedAtruleNewLinesString;
    }

    if (lastNewline > -1) {
      content = content.substring(lastNewline + 1);
    }

    newContent = newLinesString + content;
    node.content = newContent;
  },

  insertNewlinesAsNode(node, rule) {
    let newNode = this.newLinesNode;

    if (this.hasNestedRuleset && rule === 'ruleset') {
      newNode.content = this.nestedRulesetNewLinesString;
    } else if (this.hasNestedAtrule && rule === 'atrule') {
      newNode.content = this.nestedAtruleNewLinesString;
    }

    node.insert(node.length, newNode);
  },

  insertNewlines(node, index, rule) {
    let prevChild = node.get(index - 1);
    let shouldInsert = false;

    // Check for previous nodes that are not a space
    // Do not insert if the ruleset is the first item
    for (var i = 0; i < index; i++) {
      if (!node.get(i).is('space')) {
        shouldInsert = true;
        break;
      }
    }

    if (prevChild && shouldInsert) {
      if (this.prevLineIsComment(node, index) || this.isComment(prevChild)) {
        let lastNonCommentIndex = this.findLatestNonCommentNode(node, index);
        prevChild = node.get(lastNonCommentIndex);
      }

      if (prevChild) {
        if (prevChild.is('space')) {
          this.insertNewlinesAsString(prevChild, rule);
        } else {
          this.insertNewlinesAsNode(prevChild, rule);
        }
      }
    }
  },

  /**
   * Detects the value of this option in ast.
   * @param {Node} ast
   * @return {Array?} List of detected values
   */
  detect(ast) {
    var detected = [];
    var ruleNode = false;

    ast.forEach((node, index) => {
      if (ruleNode && node.is('space')) {
        if (node.end.line && node.start.line) {
          var lines = node.end.line - node.start.line;
          if (lines > 0) {
            detected.push(lines);
          }
        }
        ruleNode = false;
      }

      if (node.is('ruleset') || node.is('atrule')) {
        ruleNode = true;
      }
    });

    return detected;
  }
};

module.exports = option;
