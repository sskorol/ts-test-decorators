import { suite, test } from '@testdeck/mocha'
import { attachment, step } from '../../../src'
import { ContentType } from 'allure-js-commons'
import { BaseTest } from './baseTest'

@suite
class Attachment extends BaseTest {
  @attachment('Test attachment', ContentType.TEXT)
  public testAttachment() {
    return 'Attachment 1'
  }

  @attachment('Step attachment', ContentType.TEXT)
  public stepAttachment() {
    return 'Attachment 2'
  }

  @step('Step with attachment')
  public testStep() {
    this.stepAttachment()
  }

  @test
  shouldAssignDecoratedAttachment() {
    this.testAttachment()
    this.testStep()
  }
}
