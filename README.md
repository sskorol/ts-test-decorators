# Test Decorators

[![Build Status](https://travis-ci.com/sskorol/ts-test-decorators.svg?branch=master)](https://travis-ci.com/sskorol/ts-test-decorators)
[![codecov](https://codecov.io/gh/sskorol/ts-test-decorators/branch/master/graph/badge.svg)](https://codecov.io/gh/sskorol/ts-test-decorators)
[![npm version](https://badge.fury.io/js/ts-test-decorators.svg)](https://badge.fury.io/js/ts-test-decorators)

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
You may wondering how to achieve the same in JS?

The answer is using Typescript and decorators.

[mocha-typescript](https://github.com/pana-cc/mocha-typescript) will help us with core features.
However, it has nothing to do with [Allure](https://github.com/webdriverio-boneyard/wdio-allure-reporter).
Moreover, there's no flexible [DataProvider](https://github.com/sskorol/test-data-supplier) mechanism available. 

This library is intended to fill these gaps, so that you can write [webdriverio](https://github.com/webdriverio/webdriverio) tests the following way:

```typescript
import { Severity } from "allure2-js-commons";
import { suite, test } from 'mocha-typescript';
import { data, description, feature, issue, owner, severity, story, tag, testCaseId } from 'ts-test-decorators';
      
@suite
class AuthorizationTests {
      
  @issue('42')
  @testCaseId('58')
  @severity(Severity.BLOCKER)
  @feature('Login')
  @story('58')
  @owner('skorol')
  @tag('smoke')
  @description('Basic authorization test.')
  @data(testData())
  @data.withCustomTestName(user => `${user} should be able to sign`)
  userShouldBeAbleToSignIn(user: User) {
    open(LoginPage)
      .loginWith(user)
      .select(ProfilePage);
    
    verifyThat(atProfilePage)
      .fullNameIs(user.fullName)
      .usernameIs(user.username);
  }
}
    
function testData(): Array<User> {
  return [
    new User('stranger', '123456', 'Strange Person'),
    new User('test', '123456', 'Test User')
  ];
}
``` 
## Installation

```bash
npm install allure2-js-commons mocha-allure2-reporter ts-test-decorators --save-dev
```
or via yarn:
```bash
yarn add allure2-js-commons mocha-allure2-reporter ts-test-decorators --dev
```

## Configuration

Either add **mocha-allure2-reporter** into **mocha.opts**:

```text
--ui mocha-typescript
--require source-map-support/register
--reporter mocha-allure2-reporter
```

Or pass the same value via commandline / scripts:

```bash
mocha -R mocha-allure2-reporter
```

**tsconfig.json** may look like the following:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "inlineSourceMap": true,
    "inlineSources": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [
      "es6",
      "dom"
    ],
    "removeComments": true,
    "noImplicitAny": false,
    "typeRoots": [
      "./node_modules/@types/",
      "./node_modules/allure2-js-commons/dist/declarations/**/"
    ]
  },
  "exclude": [
    "./node_modules/"
  ],
  "compileOnSave": false
}
```

Now you can use the following decorators:

 - `issue(idFn: string | ((arg: any) => string))`
 - `testCaseId(idFn: string | ((arg: any) => string))`
 - `feature(featureFn: string | ((arg: any) => string))`
 - `story(storyFn: string | ((arg: any) => string))`
 - `severity(severityFn: Severity | string | ((arg: any) => string))`
 - `tag(tagFn: string | ((arg: any) => string))`
 - `owner(ownerFn: string | ((arg: any) => string))`
 - `description(descriptionFn: string | ((arg: any) => string))`
 - `step(nameFn: string | ((arg: any) => string))`
 - `data(params: any, name?: string)`
 - `data.withCustomTestName(nameForTests: (parameters: any) => string)`

**@data** is not related to Allure. It's just a wrapper for mocha-typescript **@params** [decorator](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.naming.suite.ts).

Also be aware of **@test** and **@data** order. They should be always put before actual test method signature.

Moreover, both decorators replace each other. If you're using **@data**, you don't need to specify **@test**, and vice versa (mocha-typescript specifics).

## Examples

See [mocha-allure2-example](https://github.com/sskorol/mocha-allure2-example) project, which is already configured to use latest Allure 2 features with decorators support.

## Thanks

[@srg-kostyrko](https://github.com/srg-kostyrko) for help and assistance.
