import { suite, test } from 'mocha-typescript';
import { feature } from '../../../index';

@suite
class Feature {
  @feature('Decorated Feature')
  @test
  shouldAssignDecoratedFeature() {}
}
