import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLabel, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class StorySuite {
  before() {
    cleanResults()
    runTests('story')
  }

  @test
  shouldHaveStories() {
    const testName = 'shouldAssignDecoratedStory'
    return whenResultsAppeared().then(() => {
      expect(findTest('Story')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findLabel(testName, 'story').value).eq('Common decorated story')
    })
  }
}
