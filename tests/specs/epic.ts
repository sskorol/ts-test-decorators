import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLabel, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class EpicSuite {
  before() {
    cleanResults()
    runTests('epic')
  }

  @test
  shouldHaveEpic() {
    const testName = 'shouldAssignDecoratedEpic'
    return whenResultsAppeared().then(() => {
      expect(findTest('Epic')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findLabel(testName, 'epic').value).eq('Epic Name')
    })
  }
}
