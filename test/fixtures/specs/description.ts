import { suite, test } from 'mocha-typescript';
import { description } from '../../../index';

@suite
class Description {
  @description('Decorated description')
  @test
  shouldAssignDecoratedDescription() {}
}
