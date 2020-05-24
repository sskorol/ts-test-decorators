import { ContentType, Severity, Allure } from 'allure-js-commons'

const defaultTrackerAddress: string = 'http://localhost'
let pmsUrl: string = defaultTrackerAddress
let tmsUrl: string = defaultTrackerAddress
let allure: Allure

/**
 * This code was partially cloned from testdeck/core package and improved to support missing features.
 */
const nodeSymbol: (key: string) => string = (key): string => '__testdeck_' + key
const testNameSymbol: string = nodeSymbol('name')
const parametersSymbol: string = nodeSymbol('parametersSymbol')
const nameForParametersSymbol: string = nodeSymbol('nameForParameters')

type Params = any | ((arg?: any) => any)
type Execution = undefined | 'pending' | 'only' | 'skip' | 'execution'
type TestDecorator = (target: object, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor
type ParamsDecorator = (params: Params, name?: string) => TestDecorator

interface ParameterizedPropertyDescriptor extends PropertyDescriptor {
  (params: Params, name?: string): MethodDecorator

  skip(params: Params, name?: string): MethodDecorator

  only(params: Params, name?: string): MethodDecorator

  pending(params: Params, name?: string): MethodDecorator

  naming(nameForParameters: (params: Params) => string): MethodDecorator
}

const enum LinkType {
  issue = 'issue',
  tms = 'tms',
}

export const data: ParameterizedPropertyDescriptor = makeParamsObject()

export function step<T>(nameFn: string | ((arg: T) => string)): TestDecorator {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original: object = descriptor.value
    let callable: (args: T) => void = () => {}

    if (typeof original === 'function') {
      descriptor.value = function (...args: [T]) {
        try {
          const value: string = typeof nameFn === 'function' ? nameFn.apply(this, args) : nameFn
          callable = () => getAllure().step(value, () => original.apply(this, args))
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error(`[ERROR] Failed to apply decorator: ${e}`)
        }
        return callable.apply(this, args)
      }
    }
    return descriptor
  }
}

export function attachment<T>(name: string, type: ContentType) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const original: object = descriptor.value
    let callable: (args: T) => void = () => {}

    if (typeof original === 'function') {
      descriptor.value = function (...args: [T]) {
        try {
          const content: Buffer | string = original.apply(this, args)
          callable = () => getAllure().attachment(name, content, type)
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error(`[ERROR] Failed to apply decorator: ${e}`)
        }
        return callable.apply(this, args)
      }
    }
    return descriptor
  }
}

export function testCaseId<T>(idFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(idFn, (id) => getAllure().link(`${tmsUrl}/${id}`, id, LinkType.tms))
}

export function issue<T>(idFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(idFn, (id) => getAllure().link(`${pmsUrl}/${id}`, id, LinkType.issue))
}

export function feature<T>(featureFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(featureFn, (name) => getAllure().feature(name))
}

export function story<T>(storyFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(storyFn, (name) => getAllure().story(name))
}

export function severity<T>(severityFn: Severity | string | ((arg: T) => string | Severity)): TestDecorator {
  return processDecorator(severityFn, (name) => getAllure().severity(name))
}

export function tag<T>(tagFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(tagFn, (name) => getAllure().tag(name))
}

export function owner<T>(ownerFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(ownerFn, (name) => getAllure().owner(name))
}

export function epic<T>(epicFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(epicFn, (name) => getAllure().epic(name))
}

export function description<T>(descriptionFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(descriptionFn, (text) => getAllure().description(text))
}

export function assignTmsUrl(url: string): void {
  tmsUrl = url
}

export function assignPmsUrl(url: string): void {
  pmsUrl = url
}

export function decorate<T extends Allure>(allureInstance: T): void {
  allure = allureInstance
}

function getAllure<T extends Allure>(): T {
  if (!allure) {
    throw new Error('Unable to find Allure implementation')
  }
  return allure as T
}

function processDescriptor<T>(
  parameterFn: string | ((arg: T) => string),
  reporterFn: (arg: string) => void,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original: object = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function (...args: [T]) {
      try {
        const value: string = typeof parameterFn === 'function' ? parameterFn.apply(this, args) : parameterFn
        reporterFn(value)
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(`[ERROR] Failed to apply decorator: ${e}`)
      }
      return original.apply(this, args)
    }
  }

  for (const prop of Object.keys(original)) {
    if (original.hasOwnProperty(prop) && prop.startsWith('__testdeck_')) {
      descriptor.value[prop] = original[prop]
    }
  }

  return descriptor
}

function makeParamsFunction<T>(execution?: Execution): ParamsDecorator {
  return (params: Params, name?: string) => {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
      const adjustedParams = typeof params === 'function' ? params() : params
      target[propertyKey][testNameSymbol] = propertyKey.toString()
      target[propertyKey][parametersSymbol] = target[propertyKey][parametersSymbol] || []
      ;[].concat(adjustedParams || []).forEach((param) => {
        target[propertyKey][parametersSymbol].push({ execution, name, params: param })
      })
      return processDescriptor<T>(
        (args) => JSON.stringify(args),
        (arg) => getAllure().parameter('inputs', arg),
        descriptor
      )
    }
  }
}

function makeParamsNameFunction(): any {
  return (nameForParameters: (params: Params) => string) => {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
      target[propertyKey][nameForParametersSymbol] = nameForParameters
      return descriptor
    }
  }
}

function makeParamsObject(): any {
  return Object.assign(makeParamsFunction(), {
    only: makeParamsFunction('only'),
    pending: makeParamsFunction('pending'),
    skip: makeParamsFunction('skip'),
    naming: makeParamsNameFunction(),
  })
}

function processDecorator<T>(
  parameterFn: string | ((arg: T) => string),
  reporterFn: (arg: string) => void
): TestDecorator {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    return processDescriptor(parameterFn, reporterFn, descriptor)
  }
}
