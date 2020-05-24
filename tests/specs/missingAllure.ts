import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class MissingAllureSuite {
  before() {
    cleanResults()
    runTests('missingAllure')
  }

  @test
  shouldNotFailTestWithoutAllure() {
    return whenResultsAppeared().then(() => {
      expect(findTest('MissingAllure')).not.eq(undefined)
      const currentTest = findTest('shouldFailDecoratingMethodWithoutAllure')
      expect(currentTest.status).eq(Status.PASSED)
      expect(currentTest.description).eq(undefined)
    })
  }
}
