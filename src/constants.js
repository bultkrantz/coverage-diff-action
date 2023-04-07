const PR_TITLE = Object.freeze({
  FEATURE: "feature/",
  BUGFIX: "bugfix/",
  REFACTORING: "refactor/",
});

const PERCENTAGE_THRESHOLD = Object.freeze({
  FEATURE: 0,
  BUGFIX: 0,
  REFACTORING: 0.05,
});

const PR_MESSAGE = Object.freeze({
  FEATURE_ERROR: "New features need to have test coverage",
  BUGFIX_ERROR: "For bugfixes, the test coverage should not decrease",
  REFACTORING_ERROR: `For refactoring, the test coverage should not decrease more than ${PERCENTAGE_THRESHOLD.REFACTORING}%`,
  REGRESSION_ERROR: "Total coverage is lower than the default branch",
});

const REGRESSION_RULE_CHECK = Object.freeze({
  FEATURE: (regressionPercentage) =>
    regressionPercentage <= PERCENTAGE_THRESHOLD.FEATURE,
  BUGFIX: (regressionPercentage) =>
    regressionPercentage < PERCENTAGE_THRESHOLD.BUGFIX,
  REFACTORING: (regressionPercentage) =>
    regressionPercentage < -PERCENTAGE_THRESHOLD.REFACTORING,
});

const PR_TITLE_CHECK = Object.freeze({
  FEATURE: (prTitle) => prTitle.includes(PR_TITLE.FEATURE),
  BUGFIX: (prTitle) => prTitle.includes(PR_TITLE.BUGFIX),
  REFACTORING: (prTitle) => prTitle.includes(PR_TITLE.REFACTORING),
});

module.exports = {
  PR_MESSAGE,
  REGRESSION_RULE_CHECK,
  PR_TITLE_CHECK,
  PERCENTAGE_THRESHOLD,
};
