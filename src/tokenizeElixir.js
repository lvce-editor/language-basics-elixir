/**
 * @enum number
 */
const State = {
  None: 0,
  TopLevelContent: 1,
  InsideSingleQuoteString: 2,
  InsideDoubleQuoteString: 3,
  InsideTripleQuoteString: 4,
}

/**
 * @enum number
 */
export const TokenType = {
  None: 99999999,
  Keyword: 951,
  Whitespace: 0,
  NewLine: 771,
  VariableName: 2,
  Punctuation: 3,
  String: 4,
  Numeric: 5,
  Attribute: 6,
  KeywordControl: 9,
  KeywordReturn: 10,
}

export const TokenMap = {
  [TokenType.None]: 'None',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.VariableName]: 'VariableName',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.String]: 'String',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.Attribute]: 'Attribute',
  [TokenType.KeywordControl]: 'KeywordControl',
  [TokenType.KeywordReturn]: 'KeywordReturn',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

const RE_KEYWORD =
  /^(?:after|alias|and|case|catch|cond|defmodule|defimpl|defprotocol|defrecord|defstruct|do|else|end|fn|for|if|import|in|not|or|quote|raise|receive|require|reraise|rescue|try|unless|unquote|unquote_splicing|use|when|with\|0)\b/
const RE_WHITESPACE = /^\s+/
const RE_VARIABLE_NAME = /^[a-zA-Z]+/
const RE_PUNCTUATION = /^[:,;\{\}\[\]\.=\(\)>]/
const RE_QUOTE_SINGLE = /^'/
const RE_QUOTE_DOUBLE = /^"/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^']+/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_NUMERIC = /^\d+/
const RE_TRIPLE_DOUBLE_QUOTE = /^"""/
const RE_STRING_TRIPLE_CONTENT = /^.+?(?="""|$)/s
const RE_ATTRIBUTE = /^@\w+/

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_KEYWORD))) {
          switch (next[0]) {
            case 'break':
            case 'case':
            case 'do':
            case 'elsif':
            case 'else':
            case 'for':
            case 'if':
            case 'in':
            case 'then':
            case 'while':
            case 'end':
            case 'def':
            case 'begin':
            case 'rescue':
            case 'unless':
            case 'do':
            case 'end':
              token = TokenType.KeywordControl
              break
            case 'return':
              token = TokenType.KeywordReturn
              break
            default:
              token = TokenType.Keyword
              break
          }
          state = State.TopLevelContent
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.VariableName
          state = State.TopLevelContent
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_NUMERIC))) {
          token = TokenType.Numeric
          state = State.TopLevelContent
        } else if ((next = part.match(RE_QUOTE_SINGLE))) {
          token = TokenType.Punctuation
          state = State.InsideSingleQuoteString
        } else if ((next = part.match(RE_TRIPLE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = State.InsideTripleQuoteString
        } else if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.Punctuation
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_ATTRIBUTE))) {
          token = TokenType.Attribute
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsideTripleQuoteString:
        if ((next = part.match(RE_TRIPLE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_TRIPLE_CONTENT))) {
          token = TokenType.String
          state = State.InsideTripleQuoteString
        } else {
          throw new Error('no')
        }
        break
      case State.InsideSingleQuoteString:
        if ((next = part.match(RE_QUOTE_SINGLE))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_SINGLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideSingleQuoteString
        } else {
          throw new Error('no')
        }
        break
      case State.InsideDoubleQuoteString:
        if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else {
          throw new Error('no')
        }
        break
      default:
        state
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
  }
}
