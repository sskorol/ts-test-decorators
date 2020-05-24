import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findParameter, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class ParameterSuite {
  before() {
    cleanResults()
    runTests('testData')
  }

  @test
  shouldHaveParameter() {
    const testName = 'shouldCallTestUserDataOnTest'
    return whenResultsAppeared().then(() => {
      expect(findTest('TestData')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findParameter(testName, 'inputs').value).eq(JSON.stringify({ firstName: 'Test', lastName: 'User' }))
    })
  }
}
