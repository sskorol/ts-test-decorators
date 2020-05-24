import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class DescriptionSuite {
  before() {
    cleanResults()
    runTests('description')
  }

  @test
  shouldHaveDescription() {
    return whenResultsAppeared().then(() => {
      expect(findTest('Description')).not.eq(undefined)
      const currentTest = findTest('shouldAssignDecoratedDescription')
      expect(currentTest.status).eq(Status.PASSED)
      expect(currentTest.description).eq('Decorated description')
    })
  }
}
