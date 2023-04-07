const {
  PR_MESSAGE,
  REGRESSION_RULE_CHECK,
  PR_TITLE_CHECK,
} = require("./constants");

function throwRegressionError(prTitle, regressionPercentage, globalRegression) {
  // FEATURES
  if (
    PR_TITLE_CHECK.FEATURE(prTitle) &&
    REGRESSION_RULE_CHECK.FEATURE(regressionPercentage)
  ) {
    throw new Error(PR_MESSAGE.FEATURE_ERROR);
  }

  // BUGFIXES
  if (
    PR_TITLE_CHECK.BUGFIX(prTitle) &&
    REGRESSION_RULE_CHECK.BUGFIX(regressionPercentage)
  ) {
    throw new Error(PR_MESSAGE.BUGFIX_ERROR);
  }

  // REFACTORING
  if (
    PR_TITLE_CHECK.REFACTORING(prTitle) &&
    REGRESSION_RULE_CHECK.REFACTORING(regressionPercentage)
  ) {
    throw new Error(PR_MESSAGE.REFACTORING_ERROR);
  }

  // DEFAULT REGRESSION
  if (globalRegression) {
    throw new Error(PR_MESSAGE.REGRESSION_ERROR);
  }
}

module.exports = { throwRegressionError };
