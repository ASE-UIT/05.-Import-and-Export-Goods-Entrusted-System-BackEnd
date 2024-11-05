import { Injectable, NotFoundException} from '@nestjs/common';
import { Provider } from '../../models/providers.model';

@Injectable()
export class FindAllProviderStrategy {
  async find(): Promise<Provider[] | null> {
    return Provider.findAll();
  }
}
