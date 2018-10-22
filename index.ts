const nodeSymbol = (key): string => '__mts_' + key;
const testNameSymbol = nodeSymbol('test');
const parametersSymbol = nodeSymbol('parametersSymbol');
const nameForParametersSymbol = nodeSymbol('nameForParameters');

const enum Mark {
  test,
  skip,
  only,
  pending
}

function processDescriptor(
  parameterFn: string | ((arg: any) => string),
  reporterFn: (arg: string) => void,
  descriptor: any
) {
  const original = descriptor.value;

  if (typeof original === 'function') {
    descriptor.value = function(...args) {
      try {
        const value = typeof parameterFn === 'function' ? parameterFn.apply(this, args) : parameterFn;
        reporterFn(value);
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(`[ERROR] Failed to apply decorator: ${e}`);
      }
      return original.apply(this, args);
    };
  }

  for (const prop of Object.keys(original)) {
    if (original.hasOwnProperty(prop) && prop.startsWith('__mts_')) {
      descriptor.value[prop] = original[prop];
    }
  }

  return descriptor;
}

function makeParamsFunction(mark: Mark) {
  return (params: any, name?: string) => {
    return (target: any, propertyKey: string, descriptor: any) => {
      target[propertyKey][testNameSymbol] = propertyKey.toString();
      target[propertyKey][parametersSymbol] = target[propertyKey][parametersSymbol] || [];
      [].concat(params || []).forEach(param => {
        target[propertyKey][parametersSymbol].push({ mark, name, params: param });
      });
      return processDescriptor(args => args.toString(), arg => reporter.addArgument('inputs', arg), descriptor);
    };
  };
}

function makeParamsNameFunction() {
  return (nameForParameters: (parameters: any) => string) => {
    return (target: any, propertyKey: string, descriptor: any) => {
      target[propertyKey][nameForParametersSymbol] = nameForParameters;
      return descriptor;
    };
  };
}

function makeParamsObject() {
  return Object.assign(makeParamsFunction(Mark.test), {
    only: makeParamsFunction(Mark.only),
    pending: makeParamsFunction(Mark.pending),
    skip: makeParamsFunction(Mark.skip),
    withCustomTestName: makeParamsNameFunction()
  });
}

function processDecorator(parameterFn: string | ((arg: any) => string), reporterFn: (arg: string) => void) {
  return (target, property, descriptor) => {
    return processDescriptor(parameterFn, reporterFn, descriptor);
  };
}

export function step(nameFn: string | ((arg: any) => string)) {
  return processDecorator(nameFn, title => reporter.createStep(title));
}

export function testCaseId(idFn: string | ((arg: any) => string)) {
  return processDecorator(idFn, id => reporter.testId(id));
}

export function issue(idFn: string | ((arg: any) => string)) {
  return processDecorator(idFn, id => reporter.issue(id));
}

export function feature(featureFn: string | ((arg: any) => string)) {
  return processDecorator(featureFn, name => reporter.feature(name));
}

export function story(storyFn: string | ((arg: any) => string)) {
  return processDecorator(storyFn, name => reporter.story(name));
}

export function severity(severityFn: SeverityLevel | string | ((arg: any) => string)) {
  return processDecorator(severityFn, name => reporter.severity(name));
}

export const data = makeParamsObject();

export enum SeverityLevel {
  Blocker = 'blocker',
  Critical = 'critical',
  Normal = 'normal',
  Minor = 'minor',
  Trivial = 'trivial'
}
