import { expect } from 'chai';
import { suite } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class FeatureSuite {
  before() {
    clean();
  }

  @test
  shouldCallFeatureOnReporter() {
    return runMocha(['feature']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('FeatureSuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallFeatureOnReporter');
      expect(
        result('test-case label[name="feature"]')
          .eq(0)
          .attr('value')
      ).to.be.equal('Test Feature');
    });
  }
}
