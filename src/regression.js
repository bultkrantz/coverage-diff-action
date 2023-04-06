const { PR_MESSAGE, REGRESSION_RULE_CHECK } = require("./constants");

function throwRegressionError(prTitle, regressionPercentage, globalRegression) {
  // FEATURES
  if (
    prTitle.includes("feature/") &&
    REGRESSION_RULE_CHECK.FEATURE(regressionPercentage)
  ) {
    throw new Error(PR_MESSAGE.FEATURE_ERROR);
  }

  // BUGFIXES
  if (
    prTitle.includes("bugfix/") &&
    REGRESSION_RULE_CHECK.BUGFIX(regressionPercentage)
  ) {
    throw new Error(PR_MESSAGE.BUGFIX_ERROR);
  }

  // REFACTORING
  if (
    prTitle.includes("refactor/") &&
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
