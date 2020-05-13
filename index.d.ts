import { Severity } from 'allure2-js-commons';
export declare function setPmsUrl(value: string): void;
export declare function setTmsUrl(value: string): void;
export declare function step(
  nameFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function testCaseId(
  idFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function issue(
  idFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function feature(
  featureFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function story(
  storyFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function severity(
  severityFn: Severity | string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function tag(
  tagFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function owner(
  ownerFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare function description(
  descriptionFn: string | ((arg: any) => string)
): (target: any, property: any, descriptor: any) => any;
export declare const data: ((
  params: any,
  name?: string | undefined
) => (target: any, propertyKey: string, descriptor: any) => any) & {
  only: (params: any, name?: string | undefined) => (target: any, propertyKey: string, descriptor: any) => any;
  pending: (params: any, name?: string | undefined) => (target: any, propertyKey: string, descriptor: any) => any;
  skip: (params: any, name?: string | undefined) => (target: any, propertyKey: string, descriptor: any) => any;
  withCustomTestName: (
    nameForParameters: (parameters: any) => string
  ) => (target: any, propertyKey: string, descriptor: any) => any;
};
