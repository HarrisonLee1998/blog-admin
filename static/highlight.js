/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/*! highlight.js v9.7.0 | BSD3 License | git.io/hljslicense */
;(function(factory) {
  // Find the global object for export to both the browser and web workers.
  const globalObject =
    (typeof window === 'object' && window) || (typeof self === 'object' && self)

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  if (typeof exports !== 'undefined') {
    factory(exports)
  } else if (globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({})

    // Finally register the global hljs with AMD.
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return globalObject.hljs
      })
    }
  }
})(function(hljs) {
  // Convenience variables for build-in objects
  const ArrayProto = []
  const objectKeys = Object.keys

  // Global internal variables used within the highlight.js library.
  const languages = {}
  const aliases = {}

  // Regular expressions used throughout the highlight.js library.
  const noHighlightRe = /^(no-?highlight|plain|text)$/i
  const languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i
  const fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm

  const spanEndTag = '</span>'

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  let options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  }

  // Object map that is used to escape some common HTML characters.
  const escapeRegexMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  }

  /* Utility functions */

  function escape(value) {
    return value.replace(/[&<>]/gm, function(character) {
      return escapeRegexMap[character]
    })
  }

  function tag(node) {
    return node.nodeName.toLowerCase()
  }

  function testRe(re, lexeme) {
    const match = re && re.exec(lexeme)
    return match && match.index === 0
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language)
  }

  function blockLanguage(block) {
    let i, match, length, _class
    let classes = block.className + ' '

    classes += block.parentNode ? block.parentNode.className : ''

    // language-* takes precedence over non-prefixed class names.
    // eslint-disable-next-line prefer-const
    match = languagePrefixRe.exec(classes)
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight'
    }

    classes = classes.split(/\s+/)

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i]

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class
      }
    }
  }

  function inherit(parent, obj) {
    let key
    const result = {}

    for (key in parent) result[key] = parent[key]
    if (obj) for (key in obj) result[key] = obj[key]
    return result
  }

  /* Stream merging */

  function nodeStream(node) {
    const result = []
    ;(function _nodeStream(node, offset) {
      for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3) offset += child.nodeValue.length
        else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset,
            node: child
          })
          offset = _nodeStream(child, offset)
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset,
              node: child
            })
          }
        }
      }
      return offset
    })(node, 0)
    return result
  }

  function mergeStreams(original, highlighted, value) {
    let processed = 0
    let result = ''
    const nodeStack = []

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted
      }
      if (original[0].offset !== highlighted[0].offset) {
        return original[0].offset < highlighted[0].offset
          ? original
          : highlighted
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted
    }

    function open(node) {
      // eslint-disable-next-line camelcase
      function attr_str(a) {
        return ' ' + a.nodeName + '="' + escape(a.value) + '"'
      }
      result +=
        '<' +
        tag(node) +
        ArrayProto.map.call(node.attributes, attr_str).join('') +
        '>'
    }

    function close(node) {
      result += '</' + tag(node) + '>'
    }

    function render(event) {
      ;(event.event === 'start' ? open : close)(event.node)
    }

    while (original.length || highlighted.length) {
      let stream = selectStream()
      result += escape(value.substr(processed, stream[0].offset - processed))
      processed = stream[0].offset
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close)
        do {
          render(stream.splice(0, 1)[0])
          stream = selectStream()
        } while (
          stream === original &&
          stream.length &&
          stream[0].offset === processed
        )
        nodeStack.reverse().forEach(open)
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node)
        } else {
          nodeStack.pop()
        }
        render(stream.splice(0, 1)[0])
      }
    }
    return result + escape(value.substr(processed))
  }

  /* Initialization */

  function compileLanguage(language) {
    function reStr(re) {
      return (re && re.source) || re
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      )
    }

    function compileMode(mode, parent) {
      if (mode.compiled) return
      mode.compiled = true

      mode.keywords = mode.keywords || mode.beginKeywords
      if (mode.keywords) {
        const compiled_keywords = {}

        const flatten = function(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase()
          }
          str.split(' ').forEach(function(kw) {
            const pair = kw.split('|')
            compiled_keywords[pair[0]] = [
              className,
              pair[1] ? Number(pair[1]) : 1
            ]
          })
        }

        if (typeof mode.keywords === 'string') {
          // string
          flatten('keyword', mode.keywords)
        } else {
          objectKeys(mode.keywords).forEach(function(className) {
            flatten(className, mode.keywords[className])
          })
        }
        mode.keywords = compiled_keywords
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true)

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b'
        }
        if (!mode.begin) mode.begin = /\B|\b/
        mode.beginRe = langRe(mode.begin)
        if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/
        if (mode.end) mode.endRe = langRe(mode.end)
        mode.terminator_end = reStr(mode.end) || ''
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end
      }
      if (mode.illegal) mode.illegalRe = langRe(mode.illegal)
      if (mode.relevance == null) mode.relevance = 1
      if (!mode.contains) {
        mode.contains = []
      }
      const expanded_contains = []
      mode.contains.forEach(function(c) {
        if (c.variants) {
          c.variants.forEach(function(v) {
            expanded_contains.push(inherit(c, v))
          })
        } else {
          expanded_contains.push(c === 'self' ? mode : c)
        }
      })
      mode.contains = expanded_contains
      mode.contains.forEach(function(c) {
        compileMode(c, mode)
      })

      if (mode.starts) {
        compileMode(mode.starts, parent)
      }

      const terminators = mode.contains
        .map(function(c) {
          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin
        })
        .concat([mode.terminator_end, mode.illegal])
        .map(reStr)
        .filter(Boolean)
      mode.terminators = terminators.length
        ? langRe(terminators.join('|'), true)
        : {
            exec(/* s */) {
              return null
            }
          }
    }

    compileMode(language)
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {
    function subMode(lexeme, mode) {
      let i, length

      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i]
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent
        }
        return mode
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme)
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme)
    }

    function keywordMatch(mode, match) {
      const match_str = language.case_insensitive
        ? match[0].toLowerCase()
        : match[0]
      // eslint-disable-next-line no-prototype-builtins
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str]
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      const classPrefix = noPrefix ? '' : options.classPrefix
      let openSpan = '<span class="' + classPrefix
      const closeSpan = leaveOpen ? '' : spanEndTag

      openSpan += classname + '">'

      return openSpan + insideSpan + closeSpan
    }

    function processKeywords() {
      let keyword_match, last_index, match, result

      if (!top.keywords) return escape(mode_buffer)

      result = ''
      last_index = 0
      top.lexemesRe.lastIndex = 0
      match = top.lexemesRe.exec(mode_buffer)

      while (match) {
        result += escape(
          mode_buffer.substr(last_index, match.index - last_index)
        )
        keyword_match = keywordMatch(top, match)
        if (keyword_match) {
          relevance += keyword_match[1]
          result += buildSpan(keyword_match[0], escape(match[0]))
        } else {
          result += escape(match[0])
        }
        last_index = top.lexemesRe.lastIndex
        match = top.lexemesRe.exec(mode_buffer)
      }
      return result + escape(mode_buffer.substr(last_index))
    }

    function processSubLanguage() {
      const explicit = typeof top.subLanguage === 'string'
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer)
      }

      const result = explicit
        ? highlight(
            top.subLanguage,
            mode_buffer,
            true,
            continuations[top.subLanguage]
          )
        : highlightAuto(
            mode_buffer,
            top.subLanguage.length ? top.subLanguage : undefined
          )

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top
      }
      return buildSpan(result.language, result.value, false, true)
    }

    function processBuffer() {
      result +=
        top.subLanguage != null ? processSubLanguage() : processKeywords()
      mode_buffer = ''
    }

    function startNewMode(mode) {
      result += mode.className ? buildSpan(mode.className, '', true) : ''
      top = Object.create(mode, { parent: { value: top } })
    }

    function processLexeme(buffer, lexeme) {
      mode_buffer += buffer

      if (lexeme == null) {
        processBuffer()
        return 0
      }

      const new_mode = subMode(lexeme, top)
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme
          }
          processBuffer()
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme
          }
        }
        startNewMode(new_mode, lexeme)
        return new_mode.returnBegin ? 0 : lexeme.length
      }

      const end_mode = endOfMode(top, lexeme)
      if (end_mode) {
        const origin = top
        if (origin.skip) {
          mode_buffer += lexeme
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme
          }
          processBuffer()
          if (origin.excludeEnd) {
            mode_buffer = lexeme
          }
        }
        do {
          if (top.className) {
            result += spanEndTag
          }
          if (!top.skip) {
            relevance += top.relevance
          }
          top = top.parent
        } while (top !== end_mode.parent)
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '')
        }
        return origin.returnEnd ? 0 : lexeme.length
      }

      if (isIllegal(lexeme, top))
        throw new Error(
          'Illegal lexeme "' +
            lexeme +
            '" for mode "' +
            (top.className || '<unnamed>') +
            '"'
        )

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme
      return lexeme.length || 1
    }

    var language = getLanguage(name)
    if (!language) {
      throw new Error('Unknown language: "' + name + '"')
    }

    compileLanguage(language)
    var top = continuation || language
    var continuations = {} // keep continuations for sub-languages
    var result = ''
    let current
    for (current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result
      }
    }
    var mode_buffer = ''
    var relevance = 0
    try {
      let match
      let count
      let index = 0
      while (true) {
        top.terminators.lastIndex = index
        match = top.terminators.exec(value)
        if (!match) break
        count = processLexeme(
          value.substr(index, match.index - index),
          match[0]
        )
        index = match.index + count
      }
      processLexeme(value.substr(index))
      for (current = top; current.parent; current = current.parent) {
        // close dangling modes
        if (current.className) {
          result += spanEndTag
        }
      }
      return {
        relevance,
        value: result,
        language: name,
        top
      }
    } catch (e) {
      if (e.message && e.message.includes('Illegal')) {
        return {
          relevance: 0,
          value: escape(value)
        }
      } else {
        throw e
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset =
      languageSubset || options.languages || objectKeys(languages)
    let result = {
      relevance: 0,
      value: escape(text)
    }
    let second_best = result
    languageSubset.filter(getLanguage).forEach(function(name) {
      const current = highlight(name, text, false)
      current.language = name
      if (current.relevance > second_best.relevance) {
        second_best = current
      }
      if (current.relevance > result.relevance) {
        second_best = result
        result = current
      }
    })
    if (second_best.language) {
      result.second_best = second_best
    }
    return result
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR)
      ? value
      : value.replace(fixMarkupRe, function(match, p1) {
          if (options.useBR && match === '\n') {
            return '<br>'
          } else if (options.tabReplace) {
            return p1.replace(/\t/g, options.tabReplace)
          }
        })
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    const language = currentLang ? aliases[currentLang] : resultLang
    const result = [prevClassName.trim()]

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs')
    }

    if (!prevClassName.includes(language)) {
      result.push(language)
    }

    return result.join(' ').trim()
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    let node, originalStream, result, resultNode, text
    const language = blockLanguage(block)

    if (isNotHighlighted(language)) return

    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
      node.innerHTML = block.innerHTML
        .replace(/\n/g, '')
        .replace(/<br[ \/]*>/g, '\n')
    } else {
      node = block
    }
    text = node.textContent
    result = language ? highlight(language, text, true) : highlightAuto(text)

    originalStream = nodeStream(node)
    if (originalStream.length) {
      resultNode = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'div'
      )
      resultNode.innerHTML = result.value
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text)
    }
    result.value = fixMarkup(result.value)

    block.innerHTML = result.value
    block.className = buildClassName(block.className, language, result.language)
    block.result = {
      language: result.language,
      re: result.relevance
    }
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      }
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options)
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called) return
    initHighlighting.called = true

    const blocks = document.querySelectorAll('pre code')
    ArrayProto.forEach.call(blocks, highlightBlock)
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false)
    addEventListener('load', initHighlighting, false)
  }

  function registerLanguage(name, language) {
    const lang = (languages[name] = language(hljs))
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {
        aliases[alias] = name
      })
    }
  }

  function listLanguages() {
    return objectKeys(languages)
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase()
    return languages[name] || languages[aliases[name]]
  }

  /* Interface definition */

  hljs.highlight = highlight
  hljs.highlightAuto = highlightAuto
  hljs.fixMarkup = fixMarkup
  hljs.highlightBlock = highlightBlock
  hljs.configure = configure
  hljs.initHighlighting = initHighlighting
  hljs.initHighlightingOnLoad = initHighlightingOnLoad
  hljs.registerLanguage = registerLanguage
  hljs.listLanguages = listLanguages
  hljs.getLanguage = getLanguage
  hljs.inherit = inherit

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*'
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*'
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?'
  hljs.C_NUMBER_RE =
    '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)' // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)' // 0b...
  hljs.RE_STARTERS_RE =
    '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~'

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]',
    relevance: 0
  }
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: "'",
    end: "'",
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  }
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"',
    end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  }
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
  }
  hljs.COMMENT = function(begin, end, inherits) {
    const mode = hljs.inherit(
      {
        className: 'comment',
        begin,
        end,
        contains: []
      },
      inherits || {}
    )
    mode.contains.push(hljs.PHRASAL_WORDS_MODE)
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    })
    return mode
  }
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$')
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/')
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$')
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  }
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  }
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  }
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin:
      hljs.NUMBER_RE +
      '(' +
      '%|em|ex|ch|rem' +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
    relevance: 0
  }
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  }
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  }
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  }
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  }

  hljs.registerLanguage('javascript', function(hljs) {
    const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*'
    const KEYWORDS = {
      keyword:
        'in of if for while finally var new function do return void else break catch ' +
        'instanceof with throw case default try this switch continue typeof delete ' +
        'let yield const export super debugger as async await static ' +
        // ECMAScript 6 modules import
        'import from as',
      literal: 'true false null undefined NaN Infinity',
      built_in:
        'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
        'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
        'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
        'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
        'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
        'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
        'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
        'Promise'
    }
    let EXPRESSIONS
    const NUMBER = {
      className: 'number',
      variants: [
        { begin: '\\b(0[bB][01]+)' },
        { begin: '\\b(0[oO][0-7]+)' },
        { begin: hljs.C_NUMBER_RE }
      ],
      relevance: 0
    }
    const SUBST = {
      className: 'subst',
      begin: '\\$\\{',
      end: '\\}',
      keywords: KEYWORDS,
      contains: [] // defined later
    }
    const TEMPLATE_STRING = {
      className: 'string',
      begin: '`',
      end: '`',
      contains: [hljs.BACKSLASH_ESCAPE, SUBST]
    }
    SUBST.contains = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      TEMPLATE_STRING,
      NUMBER,
      hljs.REGEXP_MODE
    ]
    const PARAMS_CONTAINS = SUBST.contains.concat([
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ])

    return {
      aliases: ['js', 'jsx'],
      keywords: KEYWORDS,
      contains: [
        {
          className: 'meta',
          relevance: 10,
          begin: /^\s*['"]use (strict|asm)['"]/
        },
        {
          className: 'meta',
          begin: /^#!/,
          end: /$/
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        TEMPLATE_STRING,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        NUMBER,
        {
          // object attr container
          begin: /[{,]\s*/,
          relevance: 0,
          contains: [
            {
              begin: IDENT_RE + '\\s*:',
              returnBegin: true,
              relevance: 0,
              contains: [{ className: 'attr', begin: IDENT_RE, relevance: 0 }]
            }
          ]
        },
        {
          // "value" container
          begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
          keywords: 'return throw case',
          contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.REGEXP_MODE,
            {
              className: 'function',
              begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>',
              returnBegin: true,
              end: '\\s*=>',
              contains: [
                {
                  className: 'params',
                  variants: [
                    {
                      begin: IDENT_RE
                    },
                    {
                      begin: /\(\s*\)/
                    },
                    {
                      begin: /\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // E4X / JSX
              begin: /</,
              end: /(\/\w+|\w+\/)>/,
              subLanguage: 'xml',
              contains: [
                { begin: /<\w+\s*\/>/, skip: true },
                {
                  begin: /<\w+/,
                  end: /(\/\w+|\w+\/)>/,
                  skip: true,
                  contains: [{ begin: /<\w+\s*\/>/, skip: true }, 'self']
                }
              ]
            }
          ],
          relevance: 0
        },
        {
          className: 'function',
          beginKeywords: 'function',
          end: /\{/,
          excludeEnd: true,
          contains: [
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE }),
            {
              className: 'params',
              begin: /\(/,
              end: /\)/,
              excludeBegin: true,
              excludeEnd: true,
              contains: PARAMS_CONTAINS
            }
          ],
          illegal: /\[|%/
        },
        {
          begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        },
        hljs.METHOD_GUARD,
        {
          // ES6 class
          className: 'class',
          beginKeywords: 'class',
          end: /[{;=]/,
          excludeEnd: true,
          illegal: /[:"\[\]]/,
          contains: [{ beginKeywords: 'extends' }, hljs.UNDERSCORE_TITLE_MODE]
        },
        {
          beginKeywords: 'constructor',
          end: /\{/,
          excludeEnd: true
        }
      ],
      illegal: /#(?!!)/
    }
  })

  return hljs
})