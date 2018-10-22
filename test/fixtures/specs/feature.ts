import { suite, test } from 'mocha-typescript';
import { feature } from '../../../index';

@suite
class FeatureSuite {
  @feature('Test Feature')
  @test
  shouldCallFeatureOnReporter() {}
}
