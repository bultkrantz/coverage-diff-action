const PR_TITLE = Object.freeze({
  FEATURE: "feature/",
  BUGFIX: "bugfix/",
  REFACTORING: "refactor/",
});

const PR_MESSAGE = Object.freeze({
  FEATURE_ERROR: "New features need to have test coverage",
  BUGFIX_ERROR: "For bugfixes, the test coverage should not decrease",
  REFACTORING_ERROR:
    "For refactoring, the test coverage should not decrease more than 5%",
  REGRESSION_ERROR: "Total coverage is lower than the default branch",
});

const REGRESSION_RULE_CHECK = Object.freeze({
  FEATURE: (regressionPercentage) => regressionPercentage <= 0,
  BUGFIX: (regressionPercentage) => regressionPercentage < 0,
  REFACTORING: (regressionPercentage) => regressionPercentage < -5,
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
};
