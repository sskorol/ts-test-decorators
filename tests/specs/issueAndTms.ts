import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLinks, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class IssueAndTmsSuite {
  before() {
    cleanResults()
    runTests('issueAndTms')
  }

  @test
  shouldHaveIssueAndTmsLinks() {
    const testName = 'shouldAssignDecoratedIssueAndTms'
    return whenResultsAppeared().then(() => {
      expect(findTest('IssueAndTms')).not.eq(undefined)

      const links = findLinks(testName)
      expect(links).length(2)
      expect(findTest(testName).status).eq(Status.PASSED)

      const gitHubUrl: string = 'https://github.com/sskorol/ts-test-decorators/issues'
      expect(links.map((link) => link.name)).contains('4', '5')
      expect(links.map((link) => link.url)).contains(`${gitHubUrl}/4`, `${gitHubUrl}/5`)
      expect(links.map((link) => link.type)).contains('issue', 'tms')
    })
  }
}
