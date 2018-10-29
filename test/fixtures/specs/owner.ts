import { suite, test } from 'mocha-typescript';
import { owner } from '../../../index';

@suite
class Owner {
  @owner('Sergey Korol')
  @test
  shouldAssignDecoratedOwner() {}
}
