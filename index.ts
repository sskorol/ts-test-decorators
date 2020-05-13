import { AllureInterface, Severity } from 'allure2-js-commons';

const nodeSymbol = (key): string => '__mts_' + key;
const testNameSymbol = nodeSymbol('test');
const parametersSymbol = nodeSymbol('parametersSymbol');
const nameForParametersSymbol = nodeSymbol('nameForParameters');

const localhost = 'http://localhost';
let pmsUrl = localhost;
let tmsUrl = localhost;
export function setPmsUrl(value: string) {
  pmsUrl = value;
}
export function setTmsUrl(value: string) {
  tmsUrl = value;
}

const enum Mark {
  test,
  skip,
  only,
  pending
}

const enum LinkType {
  issue = 'issue',
  tms = 'tms'
}

function getAllure(): AllureInterface {
  // @ts-ignore
  const allure = global.allure;
  if (!allure) {
    throw new Error('Unable to find AllureInterface in a global context');
  }
  return allure;
}

function makeParamsFunction(mark: Mark) {
  return (params: any, name?: string) => {
    return (target: any, propertyKey: string, descriptor: any) => {
      target[propertyKey][testNameSymbol] = propertyKey.toString();
      target[propertyKey][parametersSymbol] = target[propertyKey][parametersSymbol] || [];
      [].concat(params || []).forEach(param => {
        target[propertyKey][parametersSymbol].push({ mark, name, params: param });
      });
      return processDescriptor(args => args.toString(), arg => getAllure().addParameter('inputs', arg), descriptor);
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

function processDescriptor(
  parameterFn: string | ((arg: any) => string),
  reporterFn: (arg: string) => void,
  descriptor: any
) {
  const original = descriptor.value;

  if (typeof original === 'function') {
    descriptor.value = function(...args) {
      try {
        const value = typeof parameterFn === 'function' ? parameterFn.apply(this, args as [any]) : parameterFn;
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

function processDecorator(parameterFn: string | ((arg: any) => string), reporterFn: (arg: string) => void) {
  return (target, property, descriptor) => {
    return processDescriptor(parameterFn, reporterFn, descriptor);
  };
}

export function step(nameFn: string | ((arg: any) => string)) {
  return (target, property, descriptor) => {
    const original = descriptor.value;
    let callable;
    if (typeof original === 'function') {
      descriptor.value = function(...args) {
        try {
          const value = typeof nameFn === 'function' ? nameFn.apply(this, args as [any]) : nameFn;
          callable = () => getAllure().step(value, () => original.apply(this, args));
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error(`[ERROR] Failed to apply decorator: ${e}`);
        }
        return callable.apply(this, args);
      };
    }
    return descriptor;
  };
}

export function testCaseId(idFn: string | ((arg: any) => string)) {
  return processDecorator(idFn, id => getAllure().addLink(id, `${tmsUrl}/${id}`, LinkType.tms));
}

export function issue(idFn: string | ((arg: any) => string)) {
  return processDecorator(idFn, id => getAllure().addLink(id, `${pmsUrl}/${id}`, LinkType.issue));
}

export function feature(featureFn: string | ((arg: any) => string)) {
  return processDecorator(featureFn, name => getAllure().feature(name));
}

export function story(storyFn: string | ((arg: any) => string)) {
  return processDecorator(storyFn, name => getAllure().story(name));
}

export function severity(severityFn: Severity | string | ((arg: any) => string)) {
  return processDecorator(severityFn, name => getAllure().severity(name));
}

export function tag(tagFn: string | ((arg: any) => string)) {
  return processDecorator(tagFn, name => getAllure().addTag(name));
}

export function owner(ownerFn: string | ((arg: any) => string)) {
  return processDecorator(ownerFn, name => getAllure().addOwner(name));
}

export function description(descriptionFn: string | ((arg: any) => string)) {
  return processDecorator(descriptionFn, text => getAllure().setDescription(text));
}

export const data = makeParamsObject();
