import { Status } from 'allure2-js-commons';
import { expect } from 'chai';
import { suite } from 'mocha-typescript';
import { cleanResults, findTest, runTests, whenResultsAppeared } from '../utils';

@suite
class DescriptionSuite {
  before() {
    cleanResults();
    runTests('description');
  }

  @test
  shouldHaveDescription() {
    return whenResultsAppeared().then(() => {
      expect(findTest('Description')).not.eq(undefined);
      const currentTest = findTest('shouldAssignDecoratedDescription');
      expect(currentTest.status).eq(Status.PASSED);
      expect(currentTest.description).eq('Decorated description');
    });
  }
}
