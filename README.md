# Test Decorators

[![Build Status](https://travis-ci.com/sskorol/ts-test-decorators.svg?branch=master)](https://travis-ci.com/sskorol/ts-test-decorators)
[![codecov](https://codecov.io/gh/sskorol/ts-test-decorators/branch/master/graph/badge.svg)](https://codecov.io/gh/sskorol/ts-test-decorators)
[![npm version](https://badge.fury.io/js/ts-test-decorators.svg)](https://badge.fury.io/js/ts-test-decorators)

**IMPORTANT NOTE**: this functionality is already included into [allure-js](https://github.com/allure-framework/allure-js) as a separate `allure-decorators` module So feel free to check it out if you already have Allure integration.

This project will help to smoothly migrate from Java to Javascript automation.

Let's say we have the following test written in Java:

```java
public class AuthorizationTests {
    
    @Issue("42")
    @TmsLink("58")
    @Feature("Login")
    @Story("58")
    @Severity(SeverityLevel.BLOCKER)
    @Test(dataProvider = "testData")
    public void userShouldBeAbleToSignIn(User user) {
        open(LoginPage.class)
            .loginWith(user)
            .select(ProfilePage.class);
    
        verifyThat(at(ProfilePage.class))
            .fullNameIs(user.getFullName())
            .usernameIs(user.getUsername());
    }
    
    @DataSupplier
    public StreamEx testData() {
        return StreamEx.of(
          new User('stranger', '123456', 'Strange Person'),
          new User('test', '123456', 'Test User')
        );
    }    
}
```

Everyone in a Java world get used to strict types, classes and annotations.
You may wonder how to achieve the same in JS?

The answer is using Typescript and decorators.

[@testdeck/mocha](https://www.npmjs.com/package/@testdeck/mocha) will help us with core features.
However, it has nothing to do with [Allure](https://github.com/allure-framework/allure-js).
Moreover, there's no flexible [DataProvider](https://github.com/sskorol/test-data-supplier) mechanism available. 

This library fills these gaps, so that you can write your tests the following way:

```typescript
import { Severity } from "allure2-js-commons"
import { suite, test } from '@testdeck/mocha'
import {
  assignPmsUrl,
  assignTmsUrl,
  decorate,
  data,
  description,
  feature,
  issue,
  owner,
  severity,
  story,
  tag,
  testCaseId
} from 'ts-test-decorators'
import { allure, MochaAllure } from 'allure-mocha/runtime'
      
@suite
class AuthorizationTests {
  static testData = () => {
    return new User('Test', 'User')
  }

  before() {
    const gitHubUrl: string = 'https://github.com/sskorol/ts-test-decorators/issues'
    assignPmsUrl(gitHubUrl)
    assignTmsUrl(gitHubUrl)
    decorate<MochaAllure>(allure)
  }
      
  @issue('42')
  @testCaseId('58')
  @severity(Severity.BLOCKER)
  @feature('Login')
  @story('58')
  @owner('skorol')
  @tag('smoke')
  @description('Basic authorization test.')
  @data(AuthorizationTests.testData)
  @data.naming((user: User) => `${user} should be able to sign`)
  @test
  userShouldBeAbleToSignIn(user: User) {
    open(LoginPage)
      .loginWith(user)
      .select(ProfilePage)
    
    verifyThat(atProfilePage)
      .fullNameIs(user.fullName)
      .usernameIs(user.username)
  }
}
``` 
## Installation

```bash
npm i ts-test-decorators --save-dev
```
or via yarn:
```bash
yarn add ts-test-decorators --dev
```

As it's an extension to [allure-js](https://github.com/allure-framework/allure-js) and [testdeck](https://www.npmjs.com/package/@testdeck/mocha), you have to install the following dependencies:

 - mocha
 - @testdeck/mocha
 - allure-mocha
 - allure-js-commons
 - source-map-support
 - typescript

## Configuration

Either add **allure-mocha** into **.mocharc.json**:

```json
{
  "require": "source-map-support/register",
  "reporter": "allure-mocha"
}
```

Or pass the same value via commandline / scripts:

```bash
mocha -R allure-mocha
```

**tsconfig.json** may look like the following:
```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "inlineSourceMap": true,
    "inlineSources": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "declaration": true,
    "lib": [
      "es7"
    ],
    "types": [
      "node",
      "mocha",
      "chai"
    ],
    "removeComments": true,
    "noImplicitAny": false,
    "baseUrl": ".",
    "paths": {
      "*": [ "./*" ],
      "src/*": ["./src/*"]
    },
    "typeRoots": [
      "node_modules/@types"
    ]
  },
  "include": [
    "./src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

Now you can use the following decorators:

 - `attachment<T>(name: string, type: ContentType)`
 - `issue<T>(idFn: string | ((arg: T) => string))`
 - `testCaseId<T>(idFn: string | ((arg: T) => string))`
 - `feature<T>(featureFn: string | ((arg: T) => string))`
 - `story<T>(storyFn: string | ((arg: T) => string))`
 - `severity<T>(severityFn: Severity | string | ((arg: T) => string | Severity))`
 - `tag<T>(tagFn: string | ((arg: T) => string))`
 - `owner<T>(ownerFn: string | ((arg: T) => string))`
 - `epic<T>(epicFn: string | ((arg: T) => string))`
 - `description<T>(descriptionFn: string | ((arg: T) => string))`
 - `step<T>(nameFn: string | ((arg: T) => string))`
 - `data(params: any, name?: string)`
 - `data.naming(nameForTests: (parameters: any) => string)`

To activate decorators you have to provide Allure implementation in runtime. You can do that the following way:
```typescript
import { decorate } from 'ts-test-decorators';
import { allure, MochaAllure } from 'allure-mocha/runtime'
// ...
  before() {
    decorate<MochaAllure>(allure)
  }
```

If you want to set you own trackers' URLs, do the following:
```typescript
import { assignPmsUrl, assignTmsUrl } from 'ts-test-decorators';
// ...
  before() {
    const gitHubUrl: string = 'https://github.com/sskorol/ts-test-decorators/issues'
    assignPmsUrl(gitHubUrl)
    assignTmsUrl(gitHubUrl)
  }
```

**@data** is not related to Allure. It's just a wrapper for testdeck **@params** decorator.

Also, be aware of **@test** and **@data** order. They should be always put before actual test method signature.

## Examples

See [mocha-allure2-example](https://github.com/sskorol/mocha-allure2-example) project, which is already configured to use latest Allure 2 features with decorators support.

## Special Thanks

[@srg-kostyrko](https://github.com/srg-kostyrko) for help and assistance.
