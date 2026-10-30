// calc-eval.js
// A small, safe calculator for the on-screen calculator and numeric answers.
// It understands: numbers, + - × ÷ (or * /), ^ (power), mod, brackets,
// sqrt(...) or √(...), and log2(...) or log₂(...). It never uses eval().
//   evaluate('2^10 - 24')   → 1000
//   evaluate('log2(1024)')  → 10
//   evaluate('17 mod 5')    → 2
// A problem (like "1 / 0" or an unfinished sum) throws an Error with a friendly message.

function tokenize(source) {
  const text = source
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-')
    .replace(/√/g, 'sqrt').replace(/log₂/gi, 'log2')
    .replace(/(\d),(?=\d{3}\b)/g, '$1') // 1,000 → 1000
    .toLowerCase();
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (/\s/.test(c)) { i += 1; continue; }
    const number = text.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
    if (number) { tokens.push({ type: 'num', value: Number(number[0]) }); i += number[0].length; continue; }
    const word = text.slice(i).match(/^(sqrt|log2|mod)/);
    if (word) { tokens.push({ type: word[0] }); i += word[0].length; continue; }
    if ('+-*/^()'.includes(c)) { tokens.push({ type: c }); i += 1; continue; }
    throw new Error(`I don't understand "${source.slice(i, i + 1)}".`);
  }
  return tokens;
}

export function evaluate(source) {
  const tokens = tokenize(String(source));
  let at = 0;
  const peek = () => (tokens[at] ? tokens[at].type : null);
  const take = (type) => {
    if (peek() !== type) throw new Error(type === ')' ? 'A bracket is not closed.' : 'That sum looks unfinished.');
    at += 1;
  };

  // expression → term (('+' | '-') term)*
  function expression() {
    let value = term();
    while (peek() === '+' || peek() === '-') {
      const op = tokens[at].type; at += 1;
      const right = term();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }
  // term → unary (('*' | '/' | 'mod') unary)*
  function term() {
    let value = unary();
    while (peek() === '*' || peek() === '/' || peek() === 'mod') {
      const op = tokens[at].type; at += 1;
      const right = unary();
      if ((op === '/' || op === 'mod') && right === 0) throw new Error("You can't divide by zero.");
      value = op === '*' ? value * right : (op === '/' ? value / right : ((value % right) + right) % right);
    }
    return value;
  }
  // unary → '-' unary | power
  function unary() {
    if (peek() === '-') { at += 1; return -unary(); }
    if (peek() === '+') { at += 1; return unary(); }
    return power();
  }
  // power → primary ('^' unary)?     (so 2^3^2 is 2^(3^2), and 2^-1 works)
  function power() {
    const base = primary();
    if (peek() === '^') { at += 1; return base ** unary(); }
    return base;
  }
  function primary() {
    const type = peek();
    if (type === 'num') { const v = tokens[at].value; at += 1; return v; }
    if (type === '(') { at += 1; const v = expression(); take(')'); return v; }
    if (type === 'sqrt' || type === 'log2') {
      at += 1; take('(');
      const v = expression(); take(')');
      if (type === 'sqrt') { if (v < 0) throw new Error("You can't take the square root of a negative number."); return Math.sqrt(v); }
      if (v <= 0) throw new Error('log₂ needs a number above 0.');
      return Math.log2(v);
    }
    throw new Error('That sum looks unfinished.');
  }

  if (!tokens.length) throw new Error('Type a number or a sum.');
  const result = expression();
  if (at < tokens.length) throw new Error('That sum looks unfinished.');
  if (!Number.isFinite(result)) throw new Error("That result isn't a normal number.");
  return result;
}

// Tidy display: at most 10 significant digits, no trailing zeros.
export function formatResult(value) {
  return String(Number(value.toPrecision(10)));
}
