import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { clean, runMocha } from '../utils';

@suite
class DataSuite {
  before() {
    clean();
  }

  @test
  shouldCallTestDataOnTest() {
    return runMocha(['testData']).then(results => {
      const result = results[0];

      expect(result('ns2\\:test-suite > name').text()).to.be.equal('DataSuite');
      expect(
        result('test-case > name')
          .eq(0)
          .text()
      ).to.be.equal('shouldCallTestDataOnTest');
    });
  }
}
