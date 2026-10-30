// content-rules.js
// The rules every content file must follow, written once. The game uses them when it loads a file
// (so a mistake shows a friendly error), and tools/check-content.mjs uses the same rules from the
// command line. This file must not use the browser (no document, no fetch) so Node can run it.
//
// Each check returns a list of problems in plain English. An empty list means the file is fine.

// A piece of text can be a plain string, or an object like
// { "text": "...", "verify": true, "verifyNote": "..." } when it needs checking.
export function textOf(item) {
  if (typeof item === 'string') return item;
  if (item && typeof item.text === 'string') return item.text;
  return '';
}

export function needText(problems, value, where) {
  if (typeof textOf(value) !== 'string' || textOf(value).trim() === '') {
    problems.push(`${where} is missing or empty.`);
  }
}

export function needList(problems, value, where, minLength = 1) {
  if (!Array.isArray(value) || value.length < minLength) {
    problems.push(`${where} should be a list with at least ${minLength} item(s).`);
    return false;
  }
  return true;
}

// Checks a world file's data. Returns a list of plain-English problems (empty if it is fine).
export function validateWorld(world) {
  const problems = [];
  needText(problems, world.title, 'title');
  needText(problems, world.tagline, 'tagline');
  needText(problems, world.starRules, 'starRules');
  needText(problems, world.listHeading, 'listHeading');
  if (needList(problems, world.zones, 'zones')) {
    world.zones.forEach((zone, i) => {
      const where = `zones[${i}]`;
      if (zone.id !== i) problems.push(`${where} should have "id": ${i} (zones must be in order).`);
      needText(problems, zone.name, `${where}.name`);
      needText(problems, zone.topic, `${where}.topic`);
      if (!zone.map || typeof zone.map.x !== 'number' || typeof zone.map.y !== 'number') {
        problems.push(`${where}.map needs numbers for x and y.`);
      }
      if (needList(problems, zone.levels, `${where}.levels`)) {
        zone.levels.forEach((level, j) => {
          needText(problems, level.id, `${where}.levels[${j}].id`);
          needText(problems, level.title, `${where}.levels[${j}].title`);
        });
      }
    });
  }
  if (world.funFacts !== undefined) {
    if (!Array.isArray(world.funFacts) || world.funFacts.length < 3 || world.funFacts.length > 5) problems.push('funFacts should be a list of 3 to 5 facts.');
    else world.funFacts.forEach((fact, i) => needText(problems, fact.text, `funFacts[${i}].text`));
  }
  if (!world.finale || !world.finale.map) problems.push('finale (with a map position) is missing.');
  if (!world.feed) problems.push('feed (the Daily Feed text) is missing.');
  else {
    ['title', 'intro', 'hubReady', 'start', 'next', 'doneTitle', 'doneText', 'doneTextPerfect'].forEach((key) => needText(problems, world.feed[key], `feed.${key}`));
    if (!world.feed.labels) problems.push('feed.labels is missing.');
  }
  if (!world.journal) problems.push('journal (the Field Journal text) is missing.');
  else ['title', 'intro', 'lockedText', 'hubText'].forEach((key) => needText(problems, world.journal[key], `journal.${key}`));
  return problems;
}

// ---- lessons and "taughtOn" (teach before you test) ----
// Every question must point at the lesson page that taught it: "taughtOn": "page-id".
// In "play", a section can set taughtOn once for everything inside it.

function checkLessons(problems, level, where) {
  const ids = new Set();
  if (!needList(problems, level.lessons, `${where}.lessons`, 2)) return ids;
  if (level.lessons.length > 4) problems.push(`${where}.lessons has more than 4 pages. Keep it to 2 to 4.`);
  level.lessons.forEach((lesson, j) => {
    const at = `${where}.lessons[${j}]`;
    if (typeof lesson.id !== 'string' || !/^[a-z0-9-]+$/.test(lesson.id)) problems.push(`${at}.id should be a short code like "why-layers".`);
    else if (ids.has(lesson.id)) problems.push(`${at}.id "${lesson.id}" is used twice.`);
    else ids.add(lesson.id);
    needText(problems, lesson.title, `${at}.title`);
    if (needList(problems, lesson.text, `${at}.text`)) lesson.text.forEach((p, k) => needText(problems, p, `${at}.text[${k}]`));
    if (lesson.terms !== undefined && needList(problems, lesson.terms, `${at}.terms`)) {
      lesson.terms.forEach((item, k) => { needText(problems, item.term, `${at}.terms[${k}].term`); needText(problems, item.meaning, `${at}.terms[${k}].meaning`); });
    }
    if (lesson.table && (!Array.isArray(lesson.table.head) || !Array.isArray(lesson.table.rows) || lesson.table.rows.some((r) => !Array.isArray(r) || r.length !== lesson.table.head.length))) {
      problems.push(`${at}.table needs "head" (column names) and "rows" (each with the same number of cells).`);
    }
    if (lesson.predict) { needText(problems, lesson.predict.prompt, `${at}.predict.prompt`); needText(problems, lesson.predict.answer, `${at}.predict.answer`); }
    if (lesson.deeper) {
      needText(problems, lesson.deeper.title, `${at}.deeper.title`);
      if (needList(problems, lesson.deeper.text, `${at}.deeper.text`)) lesson.deeper.text.forEach((p, k) => needText(problems, p, `${at}.deeper.text[${k}]`));
    }
    if (needList(problems, lesson.references, `${at}.references`)) {
      lesson.references.forEach((ref, k) => {
        needText(problems, ref.title, `${at}.references[${k}].title`);
        if (typeof ref.url !== 'string' || !ref.url.startsWith('https://')) problems.push(`${at}.references[${k}].url should start with https://`);
      });
    }
  });
  return ids;
}

function joinReferences(level) {
  const seen = new Set();
  const joined = [];
  [...(level.lessons || []).flatMap((lesson) => lesson.references || []), ...(level.readMore || [])].forEach((ref) => {
    if (ref && ref.url && !seen.has(ref.url)) { seen.add(ref.url); joined.push(ref); }
  });
  return joined;
}

function checkTaughtOn(problems, value, lessonIds, where) {
  if (typeof value !== 'string') problems.push(`${where} needs "taughtOn": the id of the lesson page that teaches it.`);
  else if (!lessonIds.has(value)) problems.push(`${where}.taughtOn "${value}" isn't one of this level's lesson page ids.`);
}

// Walks the "play" section. Anything with hints, or with answer options, is a question and needs a lesson page.
function checkPlayTaughtOn(problems, node, lessonIds, where, inherited = null) {
  if (Array.isArray(node)) { node.forEach((item, i) => checkPlayTaughtOn(problems, item, lessonIds, `${where}[${i}]`, inherited)); return; }
  if (!node || typeof node !== 'object') return;
  const own = typeof node.taughtOn === 'string' ? node.taughtOn : inherited;
  if (node.taughtOn !== undefined) checkTaughtOn(problems, node.taughtOn, lessonIds, where);
  const isQuestion = Array.isArray(node.hints) || (Array.isArray(node.options) && node.options.some((o) => o && o.correct));
  if (isQuestion && !own) problems.push(`${where} is a question but has no "taughtOn" (set it here or on the section around it).`);
  // Stages made in code (like "rankTaughtOn") name their lesson page with a key ending in TaughtOn.
  Object.entries(node).forEach(([key, value]) => {
    if (key !== 'taughtOn' && key.endsWith('TaughtOn')) checkTaughtOn(problems, value, lessonIds, `${where}.${key}`);
    else if (key !== 'taughtOn') checkPlayTaughtOn(problems, value, lessonIds, `${where}.${key}`, own);
  });
}


// ---- activities (the data-driven way to build a level's "Play" part) ----
// Every activity has: id, type, prompt, hints (2 gentle-to-clear nudges), explain, taughtOn.
// Types: choice, order, match, buckets, numeric, stepsim. An activity with "challenge": true is
// optional bonus work. Those must come after all the normal ones, and never cost stars.

export const ACTIVITY_TYPES = ['choice', 'order', 'match', 'buckets', 'numeric', 'stepsim'];
export const SIM_VIEWS = ['array', 'bars', 'graph'];
export const SIM_MODES = ['watch', 'predict', 'count'];

function exactlyOneCorrect(problems, options, where) {
  if (!needList(problems, options, `${where}.options`, 2)) return;
  options.forEach((o, i) => needText(problems, o.text, `${where}.options[${i}].text`));
  if (options.filter((o) => o && o.correct === true).length !== 1) problems.push(`${where}.options needs exactly one option with "correct": true.`);
}

function checkSimScript(problems, script, where) {
  if (!script || typeof script !== 'object') { problems.push(`${where}.script is missing.`); return; }
  if (!SIM_VIEWS.includes(script.view)) problems.push(`${where}.script.view should be one of: ${SIM_VIEWS.join(', ')}.`);
  if (!needList(problems, script.steps, `${where}.script.steps`, 2)) return;
  script.steps.forEach((step, i) => {
    const at = `${where}.script.steps[${i}]`;
    needText(problems, step.say, `${at}.say`);
    if (!step.state) problems.push(`${at}.state is missing.`);
    else if (script.view === 'graph') {
      const ids = new Set((step.state.nodes || []).map((n) => n.id));
      if (!needList(problems, step.state.nodes, `${at}.state.nodes`, 2)) return;
      (step.state.edges || []).forEach((e, k) => {
        if (!ids.has(e.from) || !ids.has(e.to)) problems.push(`${at}.state.edges[${k}] joins a node that doesn't exist.`);
      });
    } else if (script.view === 'array' && !Array.isArray(step.state.items)) problems.push(`${at}.state.items should be a list.`);
    else if (script.view === 'bars' && !Array.isArray(step.state.bars)) problems.push(`${at}.state.bars should be a list.`);
    if (step.predict) exactlyOneCorrect(problems, step.predict.options, `${at}.predict`);
  });
}

export function checkActivities(problems, activities, lessonIds, where) {
  if (!needList(problems, activities, where, 1)) return;
  const ids = new Set();
  let seenChallenge = false;
  activities.forEach((a, i) => {
    const at = `${where}[${i}]${a.id ? ` (${a.id})` : ''}`;
    if (typeof a.id !== 'string' || !/^[a-z0-9-]+$/.test(a.id)) problems.push(`${at}.id should be a short code like "order-layers".`);
    else if (ids.has(a.id)) problems.push(`${at}.id is used twice.`);
    else ids.add(a.id);
    if (a.challenge) seenChallenge = true;
    else if (seenChallenge) problems.push(`${at} is a normal activity after a challenge one. Put all "challenge": true activities last.`);
    if (!ACTIVITY_TYPES.includes(a.type)) { problems.push(`${at}.type should be one of: ${ACTIVITY_TYPES.join(', ')}.`); return; }
    needText(problems, a.prompt, `${at}.prompt`);
    needText(problems, a.explain, `${at}.explain`);
    checkTaughtOn(problems, a.taughtOn, lessonIds, at);
    if (a.type !== 'stepsim' && (!Array.isArray(a.hints) || a.hints.length !== 2)) problems.push(`${at}.hints should be exactly 2 hints: a gentle nudge, then a clearer one.`);
    else if (Array.isArray(a.hints)) a.hints.forEach((h, k) => needText(problems, h, `${at}.hints[${k}]`));

    if (a.type === 'choice') exactlyOneCorrect(problems, a.options, at);
    if (a.type === 'order') {
      if (needList(problems, a.items, `${at}.items`, 3)) a.items.forEach((item, k) => needText(problems, item, `${at}.items[${k}]`));
      if (Array.isArray(a.items) && new Set(a.items.map((x) => String(x))).size !== a.items.length) problems.push(`${at}.items has a repeated item, so the order would be ambiguous.`);
    }
    if (a.type === 'match') {
      if (needList(problems, a.pairs, `${at}.pairs`, 3)) {
        a.pairs.forEach((pair, k) => { needText(problems, pair.left, `${at}.pairs[${k}].left`); needText(problems, pair.right, `${at}.pairs[${k}].right`); });
        if (new Set(a.pairs.map((x) => x.right)).size !== a.pairs.length) problems.push(`${at}.pairs has two identical right-hand items, so a match would be ambiguous.`);
        if (a.pairs.length > 6) problems.push(`${at}.pairs has more than 6 pairs. Keep it to 3 to 6.`);
      }
    }
    if (a.type === 'buckets') {
      if (!Array.isArray(a.buckets) || a.buckets.length < 2 || a.buckets.length > 4) problems.push(`${at}.buckets should be a list of 2 to 4 group names.`);
      else if (needList(problems, a.items, `${at}.items`, 4)) {
        a.items.forEach((item, k) => {
          needText(problems, item.text, `${at}.items[${k}].text`);
          if (!a.buckets.includes(item.bucket)) problems.push(`${at}.items[${k}].bucket "${item.bucket}" isn't one of the buckets.`);
        });
        a.buckets.forEach((b) => { if (!a.items.some((item) => item.bucket === b)) problems.push(`${at}: the bucket "${b}" has no items.`); });
      }
    }
    if (a.type === 'numeric') {
      if (typeof a.answer !== 'number' || !Number.isFinite(a.answer)) problems.push(`${at}.answer should be a number.`);
      if (a.tolerance !== undefined && (typeof a.tolerance !== 'number' || a.tolerance < 0)) problems.push(`${at}.tolerance should be a number, 0 or more.`);
      if (a.tolerancePercent !== undefined && (typeof a.tolerancePercent !== 'number' || a.tolerancePercent < 0)) problems.push(`${at}.tolerancePercent should be a number, 0 or more.`);
    }
    if (a.type === 'stepsim') {
      if (!SIM_MODES.includes(a.mode || 'watch')) problems.push(`${at}.mode should be one of: ${SIM_MODES.join(', ')}.`);
      checkSimScript(problems, a.script, at);
    }
  });
}

// Checks a zone file's data. Returns a list of plain-English problems (empty if it is fine).
// levelModules lets each hand-built level check its own "play" section (pass {} if none).
// As a side effect it builds each level's "Read more" list from its lesson references, and turns an
// "activities" list into level.play so the generic unit player can run it.
export function validateZone(zone, levelModules = {}) {
  const problems = [];
  if (needList(problems, zone.levels, 'levels')) {
    zone.levels.forEach((level, i) => {
      const where = `levels[${i}]${level.id ? ` (level ${level.id})` : ''}`;
      needText(problems, level.id, `${where}.id`);
      needText(problems, level.title, `${where}.title`);
      needText(problems, level.story, `${where}.story`);
      const lessonIds = checkLessons(problems, level, where);
      if (!level.everyday) problems.push(`${where}.everyday is missing (it needs "scene", "question" and "answer").`);
      else ['scene', 'question', 'answer'].forEach((key) => needText(problems, level.everyday[key], `${where}.everyday.${key}`));
      if (level.fieldNotes !== undefined && needList(problems, level.fieldNotes, `${where}.fieldNotes`)) {
        level.fieldNotes.forEach((note, j) => {
          needText(problems, note.title, `${where}.fieldNotes[${j}].title`);
          needText(problems, note.text, `${where}.fieldNotes[${j}].text`);
          if (note.source && (typeof note.source.url !== 'string' || !note.source.url.startsWith('https://'))) {
            problems.push(`${where}.fieldNotes[${j}].source.url should start with https://`);
          }
        });
      }
      if (level.feed !== undefined && needList(problems, level.feed, `${where}.feed`)) {
        const ids = new Set();
        level.feed.forEach((card, j) => {
          const at = `${where}.feed[${j}]`;
          if (!card.id) problems.push(`${at} needs an "id" (keep it the same forever, so saved progress still matches).`);
          else if (ids.has(card.id)) problems.push(`${at} uses the id "${card.id}" twice.`);
          ids.add(card.id);
          needText(problems, card.prompt, `${at}.prompt`);
          checkTaughtOn(problems, card.taughtOn, lessonIds, at);
          if (card.type === 'predict') needText(problems, card.answer, `${at}.answer`);
          else if (card.type === 'quiz' || card.type === 'why') {
            if ((card.options || []).filter((o) => o.correct).length !== 1) problems.push(`${at} should have exactly one option with "correct": true.`);
            needText(problems, card.explain, `${at}.explain`);
          } else problems.push(`${at}.type should be "quiz", "why" or "predict".`);
        });
      }
      if (!level.debrief) {
        problems.push(`${where}.debrief is missing.`);
      } else {
        needList(problems, level.debrief.summary, `${where}.debrief.summary`);
        if (!level.debrief.mistake) problems.push(`${where}.debrief.mistake is missing.`);
        else {
          needText(problems, level.debrief.mistake.title, `${where}.debrief.mistake.title`);
          needText(problems, level.debrief.mistake.text, `${where}.debrief.mistake.text`);
        }
      }
      // "Read more" is every lesson page's references, joined and de-duplicated.
      level.readMore = joinReferences(level);
      if (level.readMore.length < 2) problems.push(`${where}: the lessons' references should give at least 2 different links.`);
      if (level.activities !== undefined) {
        checkActivities(problems, level.activities, lessonIds, `${where}.activities`);
        if (level.play) problems.push(`${where} has both "play" and "activities". Use one.`);
        else level.play = { activities: level.activities };
      } else if (!level.play) {
        problems.push(`${where} needs "play" (a hand-built level) or "activities" (a data-driven one).`);
      } else {
        checkPlayTaughtOn(problems, level.play, lessonIds, `${where}.play`);
        const module = levelModules[level.id];
        if (module && typeof module.validatePlay === 'function') {
          module.validatePlay(level.play).forEach((p) => problems.push(`${where}.play: ${p}`));
        }
      }
    });
  }
  return problems;
}
