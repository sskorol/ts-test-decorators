import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLabel, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class OwnerSuite {
  before() {
    cleanResults()
    runTests('owner')
  }

  @test
  shouldHaveOwner() {
    const testName = 'shouldAssignDecoratedOwner'
    return whenResultsAppeared().then(() => {
      expect(findTest('Owner')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findLabel(testName, 'owner').value).eq('Sergey Korol')
    })
  }
}
