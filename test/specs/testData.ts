import { Status } from 'allure2-js-commons';
import { expect } from 'chai';
import { suite } from 'mocha-typescript';
import { cleanResults, findParameter, findTest, runTests, whenResultsAppeared } from '../utils';

@suite
class ParameterSuite {
  before() {
    cleanResults();
    runTests('testData');
  }

  @test
  shouldHaveParameter() {
    const testName = 'shouldCallTestDataOnTest';
    return whenResultsAppeared().then(() => {
      expect(findTest('TestData')).not.eq(undefined);
      expect(findTest(testName).status).eq(Status.PASSED);
      expect(findParameter(testName, 'inputs').value).eq('Test');
    });
  }
}
