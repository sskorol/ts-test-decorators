# Test Decorators

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
Moreover, there's no flexible [Data Provider](https://github.com/sskorol/test-data-supplier) mechanism available. 

This library is intended to fill these gaps, so that you can write tests the following way:

```typescript
@suite
class AuthorizationTests {
      
  @issue('42')
  @testCaseId('58')
  @feature('Login')
  @story('58')
  @severity(SeverityLevel.Blocker)
  @data(testData())
  @data.withCustomTestName(user => `${user} should be able to sign in`)
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
npm install ts-test-decorators --save-dev
```
or via yarn:
```bash
yarn add ts-test-decorators --dev
```
Assuming usage with **mocha**, **allure** and **wdio**, you will also need the following dependencies:
 
 - webdriverio
 - wdio-allure-reporter
 - wdio-mocha-framework
 - mocha
 - mocha-typescript
 - ts-node
 - source-map-support
 - typescript

## Configuration

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
      "./node_modules/@types/"
    ]
  },
  "exclude": [
    "./node_modules/"
  ],
  "compileOnSave": false
}
```
**wdio.conf.js** should use mocha-typescript ui with additional compiler options:
```javascript
  mochaOpts: {
    ui: 'mocha-typescript',
    compilers: ['ts:ts-node/register'],
    require: ['source-map-support/register']
  },
  reporters: ['allure'],
  before: function(capabilities, specs) {
    global.reporter = require('wdio-allure-reporter');
  }
```
Note that you have to put allure reporter into test scope to use the following decorators:

 - `issue(idFn: string | ((arg: any) => string))`
 - `testCaseId(idFn: string | ((arg: any) => string))`
 - `feature(featureFn: string | ((arg: any) => string))`
 - `story(storyFn: string | ((arg: any) => string))`
 - `severity(severityFn: SeverityLevel | string | ((arg: any) => string))`
 - `step(nameFn: string | ((arg: any) => string))`
 - `data(params: any, name?: string)`
 - `data.withCustomTestName(nameForTests: (parameters: any) => string)`

**@data** is not related to Allure. It's just a wrapper for mocha-typescript **@params** [decorator](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.naming.suite.ts).

Also be aware of **@test** and **@data** order. They should be always put before actual test method signature.

Moreover, both decorators replace each other. If you're using **@data**, you don't need to specify **@test**, and vice versa.  

You should also care of **package.json** scripts to compile TS code before actual tests execution:
```json
  "scripts": {
    "pretest": "tsc",
    "test": "wdio wdio.conf.js",
  }
```
