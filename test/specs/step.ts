import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class StepSuite {
  before() {
    clean();
  }

  @test
  shouldCallStepOnReporter() {
    return runMocha(['step']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('StepSuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallStepOnReporter');
      expect(
        result('test-case step name')
          .eq(0)
          .eq(0)
          .text()
      ).to.be.equal('Get user full name');
    });
  }
}
