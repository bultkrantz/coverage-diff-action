const coverageDiff = require("coverage-diff");
const { REGRESSION_RULE_CHECK, PR_MESSAGE } = require("./constants");

const ICONS = {
  OK: "✅",
  WARN: "👎",
  KO: "🚫",
};

const CRITERIAS = ["lines", "branches", "functions", "statements"];

function _renderPct(pct, addSign = true) {
  if (addSign && pct >= 0) {
    return `+${pct.toFixed(2)}%`;
  }
  return `${pct.toFixed(2)}%`;
}

function computeDiff(base, head, options = {}) {
  const diff = coverageDiff.diff(base, head);

  let totalTitle = "Total coverage";
  let summaryTitle = "click to open the diff coverage report";

  let countRegression = 0;
  let table = [];
  Object.keys(diff.diff).forEach((file) => {
    if (file === "total") {
      return;
    }

    const element = diff.diff[file];

    if (CRITERIAS.every((criteria) => element[criteria].pct === 0)) {
      return;
    }

    const fileRegression = CRITERIAS.some(
      (criteria) => element[criteria].pct < 0
    );
    if (fileRegression) {
      countRegression++;
    }

    table.push({
      icon: fileRegression ? ICONS.KO : ICONS.OK,
      filename: file,
      lines: {
        pct: _renderPct(head[file].lines.pct, false),
        diff: _renderPct(element.lines.pct),
      },
      branches: {
        pct: _renderPct(head[file].branches.pct, false),
        diff: _renderPct(element.branches.pct),
      },
      functions: {
        pct: _renderPct(head[file].functions.pct, false),
        diff: _renderPct(element.functions.pct),
      },
      statements: {
        pct: _renderPct(head[file].statements.pct, false),
        diff: _renderPct(element.statements.pct),
      },
    });
  });

  if (table.length > 0 && countRegression > 0) {
    summaryTitle = `${countRegression} file${
      countRegression > 1 ? "s" : ""
    } with a coverage regression`;
  }

  let totals = {};
  let globalRegression = false;
  CRITERIAS.forEach((criteria) => {
    let diffPct = head.total[criteria].pct - base.total[criteria].pct;
    if (diffPct < 0) {
      globalRegression = true;
    }
    totals[criteria] = `${_renderPct(
      head.total[criteria].pct,
      false
    )} (${_renderPct(diffPct)})`;
  });

  if (diffPct <= 0) {
    let baseTitle = options.allowedToFail ? ICONS.WARN : ICONS.KO;

    // FEATURE
    if (REGRESSION_RULE_CHECK.FEATURE(diffPct)) {
      totalTitle = `${baseTitle} ${PR_MESSAGE.FEATURE_ERROR}`;
    }

    // BUGFIX
    else if (REGRESSION_RULE_CHECK.BUGFIX(diffPct)) {
      totalTitle = `${baseTitle} ${PR_MESSAGE.BUGFIX_ERROR}`;
    }

    // REFACTORING
    else if (REGRESSION_RULE_CHECK.REFACTORING(diffPct)) {
      totalTitle = `${baseTitle} ${PR_MESSAGE.REFACTORING_ERROR}`;
    }

    // REGRESSION
    else {
      totalTitle = `${baseTitle} ${PR_MESSAGE.REGRESSION_ERROR}`;
    }
  }

  return {
    regressionPercentage: diffPct,
    regression: globalRegression,
    markdown: `
### ${totalTitle}

| Lines           | Branches           | Functions           | Statements           |
| --------------- | ------------------ | ------------------- | -------------------- |
| ${totals.lines} | ${totals.branches} | ${totals.functions} | ${
      totals.statements
    } | 
${
  table.length > 0
    ? `

#### Detailed report

<details><summary>${summaryTitle}</summary>

|   | File | Lines | Branches | Functions | Statements |
| - | ---- | ----- | -------- | --------- | ---------- |${table.map(
        (row) =>
          `\n| ${row.icon} | ${row.filename} | ${row.lines.pct}${
            row.lines.diff !== "+0.00%" ? ` (${row.lines.diff})` : ""
          } | ${row.branches.pct}${
            row.branches.diff !== "+0.00%" ? ` (${row.branches.diff})` : ""
          } | ${row.functions.pct}${
            row.functions.diff !== "+0.00%" ? ` (${row.functions.diff})` : ""
          } | ${row.statements.pct}${
            row.statements.diff !== "+0.00%" ? ` (${row.statements.diff})` : ""
          } |`
      )}
</details>`
    : ""
}
`,
  };
}

module.exports = { computeDiff };
