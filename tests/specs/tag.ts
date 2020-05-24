import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLabel, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class TagSuite {
  before() {
    cleanResults()
    runTests('tag')
  }

  @test
  shouldHaveTags() {
    const testName = 'shouldAssignDecoratedTag'
    return whenResultsAppeared().then(() => {
      expect(findTest('Tag')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findLabel(testName, 'tag').value).eq('regression')
    })
  }
}
