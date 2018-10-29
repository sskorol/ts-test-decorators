import { Status } from 'allure2-js-commons';
import { expect } from 'chai';
import { suite } from 'mocha-typescript';
import { cleanResults, findSteps, findTest, runTests, whenResultsAppeared } from '../utils';

@suite
class StepSuite {
  before() {
    cleanResults();
    runTests('step');
  }

  @test
  shouldHaveSteps() {
    const testName = 'shouldAddDecoratedSteps';
    return whenResultsAppeared().then(() => {
      expect(findTest('Step')).not.eq(undefined);
      expect(findTest(testName).status).eq(Status.PASSED);

      const steps = findSteps(testName);
      expect(steps.map(step => step.name)).deep.eq([
        'Execute step 1',
        'Execute step 2',
        'Execute step 3',
        'Execute step 5',
        'Execute step 1'
      ]);
      expect(steps.map(step => step.status)).contains(Status.PASSED);

      let subStep = steps.find(step => step.name === 'Execute step 2').steps.pop();
      expect(subStep.name).eq('Execute step 3');
      expect(subStep.status).eq(Status.PASSED);

      subStep = subStep.steps.pop();
      expect(subStep.name).eq('Execute step 4');
      expect(subStep.status).eq(Status.PASSED);

      subStep = steps.find(step => step.name === 'Execute step 3').steps.pop();
      expect(subStep.name).eq('Execute step 4');
      expect(subStep.status).eq(Status.PASSED);

      subStep = steps.find(step => step.name === 'Execute step 5').steps.pop();
      expect(subStep.name).eq('Execute step 6');
      expect(subStep.status).eq(Status.PASSED);
    });
  }
}
