import { Status } from 'allure-js-commons'
import { expect } from 'chai'
import { suite, test } from '@testdeck/mocha'
import { cleanResults, findSteps, findTest, runTests, whenResultsAppeared } from '../utils'

@suite
class AttachmentSuite {
  before() {
    cleanResults()
    runTests('attachment')
  }

  @test
  shouldHaveAttachment() {
    return whenResultsAppeared().then(() => {
      expect(findTest('Attachment')).not.eq(undefined)
      const currentTest = findTest('shouldAssignDecoratedAttachment')
      const steps = findSteps(currentTest.name)
      expect(currentTest.status).eq(Status.PASSED)
      expect(currentTest.attachments.length).eq(1)
      expect(currentTest.attachments[0].name).eq('Test attachment')
      expect(currentTest.attachments[0].type).eq('text/plain')
      expect(steps.length).eq(1)
      expect(steps[0].attachments.length).eq(1)
      expect(steps[0].attachments[0].name).eq('Step attachment')
      expect(steps[0].attachments[0].type).eq('text/plain')
    })
  }
}
