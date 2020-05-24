import { assignPmsUrl, assignTmsUrl, decorate } from '../../../src'
import { allure, MochaAllure } from 'allure-mocha/runtime'

export class BaseTest {
  public before() {
    const gitHubUrl: string = 'https://github.com/sskorol/ts-test-decorators/issues'
    assignPmsUrl(gitHubUrl)
    assignTmsUrl(gitHubUrl)
    decorate<MochaAllure>(allure)
  }
}
