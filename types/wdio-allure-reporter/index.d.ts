interface IAllureReporter {
  createStep: (title, body?, bodyLabel?, status?) => void;
  feature: (featureName) => void;
  addEnvironment: (name, value) => void;
  addArgument: (name, value) => void;
  addDescription: (description, type) => void;
  createAttachment: (name, content, type?) => void;
  story: (storyName) => void;
  severity: (severity) => void;
  issue: (issue) => void;
  testId: (testId) => void;
}

declare const reporter: IAllureReporter;
