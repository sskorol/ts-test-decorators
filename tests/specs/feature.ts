import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLabel, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class FeatureSuite {
  before() {
    cleanResults()
    runTests('feature')
  }

  @test
  shouldHaveFeature() {
    const testName = 'shouldAssignDecoratedFeature'
    return whenResultsAppeared().then(() => {
      expect(findTest('Feature')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findLabel(testName, 'feature').value).eq('Decorated Feature')
    })
  }
}
