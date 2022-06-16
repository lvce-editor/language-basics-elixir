import {
  initialLineState,
  tokenizeLine,
  TokenType,
  TokenMap,
} from '../src/tokenizeElixir.js'

const DEBUG = true

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize(``).toEqual()
})

test('whitespace', () => {
  expectTokenize(' ').toEqual(TokenType.Whitespace)
})

test('keyword', () => {
  // see https://github.com/highlightjs/highlight.js/blob/main/src/languages/elixir.js
  expectTokenize('after').toEqual(TokenType.Keyword)
  expectTokenize('alias').toEqual(TokenType.Keyword)
  expectTokenize('and').toEqual(TokenType.Keyword)
  expectTokenize('case').toEqual(TokenType.Keyword)
  expectTokenize('catch').toEqual(TokenType.Keyword)
  expectTokenize('cond').toEqual(TokenType.Keyword)
  expectTokenize('defmodule').toEqual(TokenType.Keyword)
  expectTokenize('defimpl').toEqual(TokenType.Keyword)
  expectTokenize('defprotocol').toEqual(TokenType.Keyword)
  expectTokenize('defrecord').toEqual(TokenType.Keyword)
  expectTokenize('defstruct').toEqual(TokenType.Keyword)
  expectTokenize('do').toEqual(TokenType.Keyword)
  expectTokenize('else').toEqual(TokenType.Keyword)
  expectTokenize('end').toEqual(TokenType.Keyword)
  expectTokenize('fn').toEqual(TokenType.Keyword)
  expectTokenize('for').toEqual(TokenType.Keyword)
  expectTokenize('if').toEqual(TokenType.Keyword)
  expectTokenize('import').toEqual(TokenType.Keyword)
  expectTokenize('in').toEqual(TokenType.Keyword)
  expectTokenize('not').toEqual(TokenType.Keyword)
  expectTokenize('or').toEqual(TokenType.Keyword)
  expectTokenize('quote').toEqual(TokenType.Keyword)
  expectTokenize('raise').toEqual(TokenType.Keyword)
  expectTokenize('receive').toEqual(TokenType.Keyword)
  expectTokenize('require').toEqual(TokenType.Keyword)
  expectTokenize('reraise').toEqual(TokenType.Keyword)
  expectTokenize('rescue').toEqual(TokenType.Keyword)
  expectTokenize('try').toEqual(TokenType.Keyword)
  expectTokenize('unless').toEqual(TokenType.Keyword)
  expectTokenize('unquote').toEqual(TokenType.Keyword)
  expectTokenize('unquote_splicing').toEqual(TokenType.Keyword)
  expectTokenize('use').toEqual(TokenType.Keyword)
  expectTokenize('when').toEqual(TokenType.Keyword)
  expectTokenize('with|0').toEqual(TokenType.Keyword)
})

test('doc string', () => {
  expectTokenize(`"""
This is the Hello module.
"""`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.String,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('multiline doc string', () => {
  expectTokenize(`"""
line 1
line 2
line 3
"""`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.String,
    TokenType.NewLine,
    TokenType.String,
    TokenType.NewLine,
    TokenType.String,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('double quoted string', () => {
  expectTokenize(`"Hello" abc`).toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('single quoted string', () => {
  expectTokenize(`'Hello' abc`).toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('module with attribute', () => {
  expectTokenize(`defmodule RealWorld do
  @moduledoc
end`).toEqual(
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Whitespace,
    TokenType.Keyword,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Attribute,
    TokenType.NewLine,
    TokenType.Keyword
  )
})
