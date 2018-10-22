import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class StorySuite {
  before() {
    clean();
  }

  @test
  shouldCallStoryOnReporter() {
    return runMocha(['story']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('StorySuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallStoryOnReporter');
      expect(
        result('test-case label[name="story"]')
          .eq(0)
          .attr('value')
      ).to.be.equal('3');
    });
  }
}
