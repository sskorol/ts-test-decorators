import { Severity, Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findLabel, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class SeveritySuite {
  before() {
    cleanResults()
    runTests('severity')
  }

  @test
  shouldHaveSeverity() {
    const testName = 'shouldAssignDecoratedSeverity'
    return whenResultsAppeared().then(() => {
      expect(findTest('SeveritySubSuite')).not.eq(undefined)
      expect(findTest(testName).status).eq(Status.PASSED)
      expect(findLabel(testName, 'severity').value).eq(Severity.CRITICAL)
    })
  }
}
